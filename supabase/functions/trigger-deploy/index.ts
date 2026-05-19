import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-trigger-secret',
}

Deno.serve(async (req: Request) => {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // ── 1. 验证触发器密钥 ──────────────────────────────────────
    const incomingSecret = req.headers.get('x-trigger-secret') ?? ''
    const expectedSecret = Deno.env.get('TRIGGER_SECRET') ?? ''

    if (!expectedSecret || incomingSecret !== expectedSecret) {
      console.error('[trigger-deploy] Unauthorized: invalid X-Trigger-Secret')
      return json({ error: 'Unauthorized' }, 401)
    }

    const body = await req.json().catch(() => ({}))
    console.log('[trigger-deploy] Received:', JSON.stringify(body))

    // ── 2. 初始化 Supabase 客户端（service role 绕过 RLS）────────
    const supabaseUrl         = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const deployHookUrl = Deno.env.get('EDGEONE_DEPLOY_HOOK_URL') ?? ''
    const apiToken      = Deno.env.get('EDGEONE_API_TOKEN') ?? ''  // 可选：token 内嵌于 URL 时留空

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[trigger-deploy] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return json({ error: 'Server misconfiguration' }, 500)
    }

    if (!deployHookUrl) {
      console.error('[trigger-deploy] Missing EDGEONE_DEPLOY_HOOK_URL')
      return json({ error: 'Server misconfiguration: EDGEONE_DEPLOY_HOOK_URL missing' }, 500)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // ── 3. 节流检查（原子 UPDATE）────────────────────────────────
    //    只有距上次触发 ≥ 60s 的行才会被更新；
    //    若影响行数为 0，说明仍在冷却期，跳过部署。
    const cooldownAt = new Date(Date.now() - 60_000).toISOString()

    const { data: updated, error: throttleError } = await supabase
      .from('deploy_throttle')
      .update({ last_triggered_at: new Date().toISOString() })
      .eq('id', 1)
      .lt('last_triggered_at', cooldownAt)
      .select('id')

    if (throttleError) {
      console.error('[trigger-deploy] Throttle update failed:', throttleError)
      return json({ error: 'Throttle check failed', detail: throttleError.message }, 500)
    }

    if (!updated || updated.length === 0) {
      console.log('[trigger-deploy] Throttled: last deploy < 60s ago, skipping')
      return json({ status: 'throttled', message: 'Cooldown active, deploy skipped' }, 200)
    }

    // ── 4. 触发 EdgeOne 重新部署 ──────────────────────────────────
    console.log('[trigger-deploy] Sending deploy request to EdgeOne...')

    const deployHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
    if (apiToken) deployHeaders['Authorization'] = `Bearer ${apiToken}`

    const deployRes = await fetch(deployHookUrl, {
      method: 'POST',
      headers: deployHeaders,
      body: JSON.stringify({}),
    })

    if (!deployRes.ok) {
      const errText = await deployRes.text()
      console.error(
        `[trigger-deploy] EdgeOne responded ${deployRes.status}:`,
        errText,
      )
      return json(
        { error: `EdgeOne error ${deployRes.status}`, detail: errText },
        502,
      )
    }

    console.log('[trigger-deploy] Deploy triggered successfully')
    return json({ status: 'triggered', message: 'EdgeOne deploy triggered' }, 200)
  } catch (err) {
    console.error('[trigger-deploy] Unexpected error:', err)
    return json({ error: String(err) }, 500)
  }
})

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
