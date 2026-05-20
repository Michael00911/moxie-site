/**
 * 执行指定 SQL 文件并查询验证
 * 用法：npx tsx scripts/run-sql-file.ts <sql文件路径> [验证查询]
 */

/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { loadEnv, httpFetch } from './lib/http'

loadEnv('.env.local')

const SUPABASE_URL     = process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const SUPABASE_PAT     = process.env.SUPABASE_PAT ?? ''
const PROJECT_REF      = new URL(SUPABASE_URL || 'https://placeholder.supabase.co').hostname.split('.')[0]

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY'); process.exit(1)
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

  // ── 验证：通过第二个参数传入自定义 SQL，或跳过 ────────────────
  const verifySQL = process.argv[3]
  if (!verifySQL) {
    console.log('\n✅ 执行完成（未传入验证查询，如需验证请作为第二参数传入 SQL）')
    return
  }

  console.log(`\n🔍 验证查询`)
  console.log('─'.repeat(60))

  const verify = await execSQL(verifySQL)

  if (verify.error) {
    console.error('❌ 验证查询失败：', verify.error.slice(0, 300))
    process.exit(1)
  }

  const rows: Record<string, unknown>[] = verify.data ?? []
  if (rows.length === 0) {
    console.log('⚠️  验证查询返回 0 行，请确认数据是否写入')
  } else {
    const keys = Object.keys(rows[0])
    const widths = keys.map(k => Math.min(Math.max(k.length, 10), 30))
    console.log(`共 ${rows.length} 行：\n`)
    console.log(keys.map((k, i) => k.padEnd(widths[i])).join('  '))
    console.log(keys.map((_, i) => '─'.repeat(widths[i])).join('  '))
    for (const r of rows) {
      console.log(keys.map((k, i) => String(r[k] ?? '').slice(0, widths[i]).padEnd(widths[i])).join('  '))
    }
  }
}

main().catch(e => { console.error('脚本异常：', e); process.exit(1) })
