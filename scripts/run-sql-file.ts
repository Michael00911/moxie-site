/**
 * 执行指定 SQL 文件并查询验证
 * 用法：npx tsx scripts/run-sql-file.ts <sql文件路径> [验证查询]
 */

/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { request as httpsRequest } from 'node:https'
import { IncomingMessage } from 'node:http'

function loadEnv(file: string) {
  try {
    const lines = readFileSync(file, 'utf-8').split('\n')
    for (const line of lines) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }
  } catch { /* 从 shell 环境读取 */ }
}
loadEnv('.env.local')

const SUPABASE_URL     = process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const SUPABASE_PAT     = process.env.SUPABASE_PAT ?? ''
const PROJECT_REF      = 'lkheprtvomhtitivtuyc'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY'); process.exit(1)
}

function httpFetch(rawUrl: string, opts: {
  method?: string; headers?: Record<string, string>; body?: string; timeoutMs?: number
}): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(rawUrl)
    const req = httpsRequest({
      hostname: url.hostname, port: url.port || 443,
      path: url.pathname + url.search,
      method: opts.method ?? 'GET', headers: opts.headers ?? {},
    }, (res: IncomingMessage) => {
      let body = ''
      res.on('data', (c: Buffer) => { body += c.toString() })
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
      res.on('error', reject)
    })
    req.on('error', reject)
    if (opts.timeoutMs) req.setTimeout(opts.timeoutMs, () => { req.destroy(); reject(new Error('timeout')) })
    if (opts.body) req.write(opts.body)
    req.end()
  })
}

async function execSQL(query: string) {
  const { status, body } = await httpFetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_PAT}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      timeoutMs: 20_000,
    }
  )
  return { status, data: status < 300 ? JSON.parse(body) : null, error: status >= 300 ? body : null }
}

async function main() {
  const sqlFile = process.argv[2]
  if (!sqlFile) { console.error('用法：npx tsx scripts/run-sql-file.ts <sql文件路径>'); process.exit(1) }

  if (!SUPABASE_PAT) { console.error('❌ 缺少 SUPABASE_PAT，无法通过 Management API 执行 SQL'); process.exit(1) }

  const sql = readFileSync(sqlFile, 'utf-8')
  console.log(`\n📄 执行文件：${sqlFile}`)
  console.log('─'.repeat(60))

  // ── 执行 SQL ──────────────────────────────────────────────────
  const { status, data, error } = await execSQL(sql)
  if (error) {
    console.error(`❌ 执行失败 HTTP ${status}`)
    console.error(error.slice(0, 500))
    process.exit(1)
  }
  console.log(`✅ 执行成功（HTTP ${status}）`)
  if (data) console.log('   返回：', JSON.stringify(data).slice(0, 200))

  // ── 验证：查询刚插入的数据 ────────────────────────────────────
  console.log('\n🔍 验证查询（最新 10 条 submissions）')
  console.log('─'.repeat(60))

  const verify = await execSQL(`
    SELECT
      id,
      payload->>'name'   AS tool_name,
      source,
      status,
      submitter_email,
      LEFT(reject_reason, 30) AS reject_reason,
      to_char(created_at, 'MM-DD HH24:MI:SS') AS created_at
    FROM public.submissions
    ORDER BY created_at DESC
    LIMIT 10
  `)

  if (verify.error) {
    console.error('❌ 验证查询失败：', verify.error.slice(0, 300))
    process.exit(1)
  }

  const rows: Record<string, unknown>[] = verify.data ?? []
  if (rows.length === 0) {
    console.log('⚠️  submissions 表为空，插入可能未生效')
  } else {
    console.log(`共 ${rows.length} 条（最新在前）：\n`)
    const header = ['tool_name', 'source', 'status', 'submitter_email', 'reject_reason', 'created_at']
    const widths  = [18, 16, 10, 26, 22, 18]
    console.log(header.map((h, i) => h.padEnd(widths[i])).join('  '))
    console.log(header.map((_, i) => '─'.repeat(widths[i])).join('  '))
    for (const r of rows) {
      console.log(header.map((h, i) => String(r[h] ?? '').slice(0, widths[i]).padEnd(widths[i])).join('  '))
    }
  }
}

main().catch(e => { console.error('脚本异常：', e); process.exit(1) })
