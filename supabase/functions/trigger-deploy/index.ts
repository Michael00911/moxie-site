import { createClient } from 'npm:@supabase/supabase-js@2'

// 此函数仅供数据库触发器内部调用，不需要开放给浏览器跨域访问。
// 统一用 json() 辅助函数返回响应，不附加 CORS 头。

Deno.serve(async (req: Request) => {
  // 拒绝非 POST 请求（OPTIONS 预检同样无意义，直接返回 405）
  if (req.method !== 'POST') {
    return respond({ error: 'Method Not Allowed' }, 405)
  }

  try {
    // ── 1. 验证触发器密钥（timing-safe 比较防止时序攻击）────────
    const incomingSecret = req.headers.get('x-trigger-secret') ?? ''
    const expectedSecret = Deno.env.get('TRIGGER_SECRET') ?? ''

    if (!expectedSecret || !timingSafeEqual(incomingSecret, expectedSecret)) {
      console.error('[trigger-deploy] Unauthorized: invalid X-Trigger-Secret')
      return respond({ error: 'Unauthorized' }, 401)
    }

    const body = await req.json().catch(() => ({}))
    console.log('[trigger-deploy] Received:', JSON.stringify(body))

    // ── 2. 初始化 Supabase 客户端（service role 绕过 RLS）────────
    const supabaseUrl    = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const deployHookUrl  = Deno.env.get('EDGEONE_DEPLOY_HOOK_URL') ?? ''
    const apiToken       = Deno.env.get('EDGEONE_API_TOKEN') ?? ''  // 可选：token 内嵌于 URL 时留空

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[trigger-deploy] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return respond({ error: 'Server misconfiguration' }, 500)
    }

    if (!deployHookUrl) {
      console.error('[trigger-deploy] Missing EDGEONE_DEPLOY_HOOK_URL')
      return respond({ error: 'Server misconfiguration: EDGEONE_DEPLOY_HOOK_URL missing' }, 500)
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
      return respond({ error: 'Throttle check failed', detail: throttleError.message }, 500)
    }

    if (!updated || updated.length === 0) {
      console.log('[trigger-deploy] Throttled: last deploy < 60s ago, skipping')
      return respond({ status: 'throttled', message: 'Cooldown active, deploy skipped' }, 200)
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
      console.error(`[trigger-deploy] EdgeOne responded ${deployRes.status}:`, errText)
      return respond({ error: `EdgeOne error ${deployRes.status}`, detail: errText }, 502)
    }

    console.log('[trigger-deploy] Deploy triggered successfully')
    return respond({ status: 'triggered', message: 'EdgeOne deploy triggered' }, 200)
  } catch (err) {
    console.error('[trigger-deploy] Unexpected error:', err)
    return respond({ error: String(err) }, 500)
  }
})

function respond(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 固定时间字符串比较，防止短路求值导致的时序侧信道
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // 长度不等时仍走完比较循环，避免立即返回泄露长度信息
    let diff = 0
    for (let i = 0; i < b.length; i++) diff |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i))
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= (a.charCodeAt(i) ^ b.charCodeAt(i))
  return diff === 0
}
