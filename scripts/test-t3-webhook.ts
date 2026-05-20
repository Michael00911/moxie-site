/**
 * T3 Webhook 自动部署测试脚本
 * 验证 submissions 变更 → Edge Function → EdgeOne 自动部署链路
 * 运行：npx tsx scripts/test-t3-webhook.ts
 */

/// <reference types="node" />
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { request as httpsRequest } from 'node:https'
import { IncomingMessage } from 'node:http'

// ── 环境变量（从 .env.local 手动解析，避免重型依赖）────────────────
function loadEnv(file: string) {
  try {
    const lines = readFileSync(file, 'utf-8').split('\n')
    for (const line of lines) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
      }
    }
  } catch { /* 文件不存在时从 shell 环境读取 */ }
}
loadEnv('.env.local')

const SUPABASE_URL     = process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const SUPABASE_PAT     = process.env.SUPABASE_PAT ?? ''
const PROJECT_REF      = new URL(SUPABASE_URL || 'https://placeholder.supabase.co').hostname.split('.')[0]
const FUNCTION_URL     = `${SUPABASE_URL}/functions/v1/trigger-deploy`
const REST_URL         = `${SUPABASE_URL}/rest/v1`
const WAIT_MS          = 8_000

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// ── 测试框架 ───────────────────────────────────────────────────────

interface TestResult { id: string; status: 'pass' | 'fail' | 'skip'; msg: string; detail?: string }
const results: TestResult[] = []
let passed = 0, failed = 0, skipped = 0
const testLogs: string[] = []

function log(line: string) { console.log(line); testLogs.push(line) }

function record(id: string, ok: boolean, msg: string, detail?: string) {
  if (ok) { log(`  ✅ ${id}: ${msg}`); results.push({ id, status: 'pass', msg }); passed++ }
  else    { log(`  ❌ ${id}: ${msg}${detail ? ' — ' + detail : ''}`); results.push({ id, status: 'fail', msg, detail }); failed++ }
  return ok
}

function skip(id: string, reason: string) {
  log(`  ⏭️  ${id}: SKIP — ${reason}`)
  results.push({ id, status: 'skip', msg: reason }); skipped++
}

function makeGuard() {
  let c = 0
  return { fail() { c++ }, reset() { c = 0 }, shouldSkip() { return c >= 3 } }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ── HTTP 工具 ──────────────────────────────────────────────────────

function httpFetch(rawUrl: string, opts: {
  method?: string
  headers?: Record<string, string>
  body?: string
  timeoutMs?: number
}): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(rawUrl)
    const reqOpts = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: opts.method ?? 'GET',
      headers: opts.headers ?? {},
    }
    const req = httpsRequest(reqOpts, (res: IncomingMessage) => {
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

const restHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

async function restGet(path: string, query = '') {
  try {
    const { status, body } = await httpFetch(`${REST_URL}/${path}${query ? '?' + query : ''}`, { headers: restHeaders, timeoutMs: 10_000 })
    return { data: status < 300 ? JSON.parse(body) : null, error: status >= 300 ? `HTTP ${status}: ${body}` : null }
  } catch (e) { return { data: null, error: String(e) } }
}

async function restPost(path: string, payload: unknown) {
  try {
    const { status, body } = await httpFetch(`${REST_URL}/${path}`, {
      method: 'POST', headers: restHeaders, body: JSON.stringify(payload), timeoutMs: 10_000,
    })
    return { data: status < 300 ? JSON.parse(body) : null, error: status >= 300 ? `HTTP ${status}: ${body}` : null }
  } catch (e) { return { data: null, error: String(e) } }
}

async function restPatch(path: string, query: string, payload: unknown) {
  try {
    const { status, body } = await httpFetch(`${REST_URL}/${path}?${query}`, {
      method: 'PATCH', headers: restHeaders, body: JSON.stringify(payload), timeoutMs: 10_000,
    })
    return { error: status >= 300 ? `HTTP ${status}: ${body}` : null }
  } catch (e) { return { error: String(e) } }
}

async function restDelete(path: string, query: string) {
  try {
    const { status, body } = await httpFetch(`${REST_URL}/${path}?${query}`, {
      method: 'DELETE', headers: { ...restHeaders, Prefer: '' }, timeoutMs: 10_000,
    })
    return { error: status >= 300 ? `HTTP ${status}: ${body}` : null }
  } catch (e) { return { error: String(e) } }
}

async function sqlQuery(query: string) {
  try {
    const { status, body } = await httpFetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      { method: 'POST', headers: { Authorization: `Bearer ${SUPABASE_PAT}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query }), timeoutMs: 12_000 }
    )
    return { data: status < 300 ? JSON.parse(body) : null, error: status >= 300 ? `HTTP ${status}: ${body}` : null }
  } catch (e) { return { data: null, error: String(e) } }
}

async function callEdgeFunction(secret: string, body = {}) {
  try {
    const { status, body: resp } = await httpFetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Trigger-Secret': secret },
      body: JSON.stringify(body), timeoutMs: 10_000,
    })
    return { status, json: JSON.parse(resp) }
  } catch (e) { return { status: -1, json: { error: String(e) } } }
}

// ── DB 辅助 ────────────────────────────────────────────────────────

async function getThrottleTime(): Promise<Date | null> {
  const { data } = await restGet('deploy_throttle', 'id=eq.1&select=last_triggered_at')
  if (!Array.isArray(data) || !data[0]) return null
  return new Date(data[0].last_triggered_at)
}

async function resetThrottle(secsAgo: number) {
  const ts = new Date(Date.now() - secsAgo * 1000).toISOString()
  const { error } = await restPatch('deploy_throttle', 'id=eq.1', { last_triggered_at: ts })
  return !error
}

async function insertSubmission(tag: string): Promise<string | null> {
  const { data, error } = await restPost('submissions', { payload: { test: tag, _t3_test: true }, source: 'anonymous_form' })
  if (error || !data?.[0]) return null
  return data[0].id as string
}

async function deleteSubmission(id: string) {
  await restDelete('submissions', `id=eq.${id}`)
}

// ── TC-DB ──────────────────────────────────────────────────────────

async function runDB() {
  log('\n[TC-DB] 数据库结构测试')
  const g = makeGuard()

  // TC-DB1
  if (g.shouldSkip()) { skip('TC-DB1', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema='public' AND table_name='deploy_throttle' ORDER BY ordinal_position`
    )
    const ok = !error && data?.length === 2 &&
      data[0].column_name === 'id' && data[0].data_type === 'integer' &&
      data[1].column_name === 'last_triggered_at' && String(data[1].data_type).includes('timestamp')
    record('TC-DB1', !!ok, 'deploy_throttle 存在且有 2 列（id: integer, last_triggered_at: timestamptz）', error ?? undefined) ? g.reset() : g.fail()
  }

  // TC-DB2
  if (g.shouldSkip()) { skip('TC-DB2', '连续失败次数过多'); return }
  {
    const { data, error } = await restGet('deploy_throttle', 'id=eq.1&select=id,last_triggered_at')
    const ok = !error && Array.isArray(data) && data[0]?.id === 1
    record('TC-DB2', !!ok, 'deploy_throttle 初始行存在（id=1）', error ?? undefined) ? g.reset() : g.fail()
  }

  // TC-DB3
  if (g.shouldSkip()) { skip('TC-DB3', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(
      `SELECT routine_name, security_type, external_language FROM information_schema.routines
       WHERE routine_schema='public' AND routine_name='fn_notify_edgeone_deploy'`
    )
    const row = data?.[0]
    const ok = !error && row?.security_type === 'DEFINER' && String(row?.external_language).toUpperCase() === 'PLPGSQL'
    record('TC-DB3', !!ok, `触发器函数 security_type=${row?.security_type ?? 'N/A'} language=${row?.external_language ?? 'N/A'}`, error ?? undefined) ? g.reset() : g.fail()
  }

  // TC-DB4
  if (g.shouldSkip()) { skip('TC-DB4', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(
      `SELECT event_manipulation, action_timing, action_orientation FROM information_schema.triggers
       WHERE event_object_schema='public' AND event_object_table='submissions' AND trigger_name='trg_edgeone_deploy'`
    )
    const events = (data ?? []).map((r: Record<string, unknown>) => r.event_manipulation as string).sort()
    const ok = !error && events.join(',') === 'DELETE,INSERT,UPDATE' &&
      (data ?? []).every((r: Record<string, unknown>) => r.action_timing === 'AFTER' && r.action_orientation === 'STATEMENT')
    record('TC-DB4', !!ok, `submissions 触发器事件: ${events.join('/')}（期望 DELETE/INSERT/UPDATE）`, error ?? undefined) ? g.reset() : g.fail()
  }

  // TC-DB5: tools 表也绑定了相同触发器
  if (g.shouldSkip()) { skip('TC-DB5', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(
      `SELECT event_manipulation, action_timing, action_orientation FROM information_schema.triggers
       WHERE event_object_schema='public' AND event_object_table='tools' AND trigger_name='trg_edgeone_deploy'`
    )
    const events = (data ?? []).map((r: Record<string, unknown>) => r.event_manipulation as string).sort()
    const ok = !error && events.join(',') === 'DELETE,INSERT,UPDATE' &&
      (data ?? []).every((r: Record<string, unknown>) => r.action_timing === 'AFTER' && r.action_orientation === 'STATEMENT')
    record('TC-DB5', !!ok, `tools 触发器事件: ${events.join('/')}（期望 DELETE/INSERT/UPDATE，FOR EACH STATEMENT）`, error ?? undefined) ? g.reset() : g.fail()
  }
}

// ── TC-SEC ─────────────────────────────────────────────────────────

async function runSEC() {
  log('\n[TC-SEC] 安全性测试')
  const g = makeGuard()

  // TC-SEC1
  if (g.shouldSkip()) { skip('TC-SEC1', '连续失败次数过多'); return }
  {
    const { status, json } = await callEdgeFunction('wrong-secret-xyz-12345', { table: 'submissions', schema: 'public', op: 'INSERT' })
    const ok = status === 401 && JSON.stringify(json).toLowerCase().includes('unauthorized')
    record('TC-SEC1', ok, `无效密钥被拒绝 HTTP ${status}，响应: ${JSON.stringify(json)}`, status === -1 ? '网络错误或超时' : undefined) ? g.reset() : g.fail()
  }

  // TC-SEC2
  if (g.shouldSkip()) { skip('TC-SEC2', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(
      `SELECT prosecdef FROM pg_proc WHERE proname='fn_notify_edgeone_deploy' AND pronamespace='public'::regnamespace`
    )
    const ok = !error && data?.[0]?.prosecdef === true
    record('TC-SEC2', !!ok, `prosecdef = ${data?.[0]?.prosecdef ?? 'N/A'}（期望 true）`, error ?? undefined) ? g.reset() : g.fail()
  }

  // TC-SEC3: deploy_throttle RLS
  if (g.shouldSkip()) { skip('TC-SEC3', '连续失败次数过多'); return }
  {
    const { data, error } = await sqlQuery(`SELECT relrowsecurity FROM pg_class WHERE relname='deploy_throttle'`)
    const ok = !error && data?.[0]?.relrowsecurity === true
    record('TC-SEC3', !!ok, `deploy_throttle RLS = ${data?.[0]?.relrowsecurity ?? 'N/A'}（期望 true）`, error ?? undefined) ? g.reset() : g.fail()
  }
}

// ── TC-TH ──────────────────────────────────────────────────────────

async function runTH() {
  log('\n[TC-TH] 节流逻辑测试（pg_net 异步，每次等待 8s）')
  const g = makeGuard()
  const ids: string[] = []

  try {
    // TC-TH1
    if (g.shouldSkip()) { skip('TC-TH1', '连续失败次数过多') }
    else {
      if (!await resetThrottle(120)) { skip('TC-TH1', '节流时间重置失败'); g.fail() }
      else {
        const tBefore = await getThrottleTime()
        const id = await insertSubmission('TC-TH1')
        if (id) ids.push(id)
        log(`  ⏳ 等待 ${WAIT_MS / 1000}s（pg_net 异步）...`)
        await sleep(WAIT_MS)
        const tAfter = await getThrottleTime()
        const updated = tBefore && tAfter && tAfter > tBefore
        record('TC-TH1', !!updated,
          `首次触发后节流时间已更新（before: ${tBefore?.toISOString().slice(11,19)} → after: ${tAfter?.toISOString().slice(11,19)}）`,
          !updated ? '节流时间未更新，Edge Function 可能未被调用' : undefined
        ) ? g.reset() : g.fail()
      }
    }

    // TC-TH2
    if (g.shouldSkip()) { skip('TC-TH2', '连续失败次数过多') }
    else {
      const tBefore = await getThrottleTime()
      const id = await insertSubmission('TC-TH2')
      if (id) ids.push(id)
      log(`  ⏳ 等待 ${WAIT_MS / 1000}s...`)
      await sleep(WAIT_MS)
      const tAfter = await getThrottleTime()
      const diffMs = tBefore && tAfter ? Math.abs(tAfter.getTime() - tBefore.getTime()) : 99999
      record('TC-TH2', diffMs < 2_000,
        `60s 内重复触发被节流（时间差 ${diffMs}ms，期望 < 2000ms）`,
        diffMs >= 2_000 ? '节流时间被更新，说明未被节流' : undefined
      ) ? g.reset() : g.fail()
    }

    // TC-TH3
    if (g.shouldSkip()) { skip('TC-TH3', '连续失败次数过多') }
    else {
      if (!await resetThrottle(65)) { skip('TC-TH3', '节流时间重置失败'); g.fail() }
      else {
        const tBefore = await getThrottleTime()
        const id = await insertSubmission('TC-TH3')
        if (id) ids.push(id)
        log(`  ⏳ 等待 ${WAIT_MS / 1000}s...`)
        await sleep(WAIT_MS)
        const tAfter = await getThrottleTime()
        const updated = tBefore && tAfter && tAfter > tBefore
        record('TC-TH3', !!updated,
          `冷却后再次触发成功（${tBefore?.toISOString().slice(11,19)} → ${tAfter?.toISOString().slice(11,19)}）`,
          !updated ? '节流时间未更新' : undefined
        ) ? g.reset() : g.fail()
      }
    }
  } finally {
    for (const id of ids) await deleteSubmission(id)
  }
}

// ── TC-E2E ─────────────────────────────────────────────────────────

async function runE2E() {
  log('\n[TC-E2E] 端到端测试')
  const manualNote = '需在 EdgeOne 控制台确认构建，DB 触发链路已由 TC-TH 覆盖'
  skip('TC-E2E1', manualNote)
  skip('TC-E2E2', manualNote)
  skip('TC-E2E3', manualNote)

  // TC-E2E4: UPDATE tools → 触发链路生效（通过 deploy_throttle 侧效验证）
  {
    const g = makeGuard()
    if (g.shouldSkip()) { skip('TC-E2E4', '连续失败次数过多') }
    else {
      if (!await resetThrottle(120)) { skip('TC-E2E4', '节流时间重置失败') }
      else {
        const tBefore = await getThrottleTime()

        // UPDATE tools SET name = name（零副作用，但触发 AFTER UPDATE STATEMENT 触发器）
        const { error: updErr } = await restPatch(
          'tools', "slug=eq.claude-code",
          { updated_at: new Date().toISOString() }
        )
        if (updErr) {
          record('TC-E2E4', false, 'UPDATE tools WHERE slug=claude-code 执行失败', updErr)
        } else {
          log(`  ⏳ TC-E2E4: 等待 ${WAIT_MS / 1000}s（pg_net 异步）...`)
          await sleep(WAIT_MS)

          const tAfter = await getThrottleTime()
          const updated = tBefore && tAfter && tAfter > tBefore
          record('TC-E2E4', !!updated,
            `UPDATE tools 触发链路生效（deploy_throttle: ${tBefore?.toISOString().slice(11,19)} → ${tAfter?.toISOString().slice(11,19)}）`,
            !updated ? 'deploy_throttle 未更新，Edge Function 可能未被调用' : undefined
          )
        }
      }
    }
  }
}

// ── TC-ERR ─────────────────────────────────────────────────────────

async function runERR() {
  log('\n[TC-ERR] 异常容错测试')
  const g = makeGuard()

  // TC-ERR1: deploy_config 缺失时静默跳过
  if (g.shouldSkip()) { skip('TC-ERR1', '连续失败次数过多') }
  else {
    // 备份
    const { data: backup } = await restGet('deploy_config', "key=in.(supabase_url,trigger_secret)&select=key,value")
    let insertId: string | null = null
    try {
      // 删除配置
      const { error: del1 } = await restDelete('deploy_config', "key=eq.supabase_url")
      const { error: del2 } = await restDelete('deploy_config', "key=eq.trigger_secret")
      if (del1 || del2) { skip('TC-ERR1', `清除 deploy_config 失败`); g.fail(); return }

      await resetThrottle(120)
      const tBefore = await getThrottleTime()

      const { data: sub, error: insErr } = await restPost('submissions', { payload: { test: 'TC-ERR1', _t3_test: true }, source: 'anonymous_form' })
      if (sub?.[0]) insertId = sub[0].id as string

      if (!record('TC-ERR1 (INSERT)', !insErr, `配置缺失时 INSERT submissions 成功`, insErr ?? undefined)) {
        g.fail(); return
      }

      log(`  ⏳ 等待 ${WAIT_MS / 1000}s（确认 pg_net 未触发 Edge Function）...`)
      await sleep(WAIT_MS)

      const tAfter = await getThrottleTime()
      const diffMs = tBefore && tAfter ? Math.abs(tAfter.getTime() - tBefore.getTime()) : 99999
      record('TC-ERR1', diffMs < 2_000,
        `触发器静默跳过（节流时间差 ${diffMs}ms，期望 < 2000ms = pg_net 未被调用）`,
        diffMs >= 2_000 ? 'deploy_throttle 被更新，说明 Edge Function 被意外调用' : undefined
      ) ? g.reset() : g.fail()
    } finally {
      // 恢复配置
      if (Array.isArray(backup) && backup.length > 0) {
        for (const row of backup as { key: string; value: string }[]) {
          await restPost('deploy_config', row).catch(() => null)
        }
      }
      if (insertId) await deleteSubmission(insertId)
    }
  }

  // TC-ERR2: SKIP
  skip('TC-ERR2', '需临时修改 Edge Function EDGEONE_DEPLOY_HOOK_URL，不可远程自动化')
}

// ── 主入口 ────────────────────────────────────────────────────────

async function main() {
  const t0 = Date.now()
  log('T3 Webhook 自动部署测试 — 开始')
  log(`Supabase URL: ${SUPABASE_URL}`)
  log(`Edge Function: ${FUNCTION_URL}`)
  log(`PAT: ${SUPABASE_PAT ? 'available' : '⚠️ missing (SQL 查询将失败)'}`)

  await runDB()
  await runSEC()
  await runTH()
  await runE2E()
  await runERR()

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  log(`\n${'─'.repeat(60)}`)
  log(`T3 结果：${passed} 通过  ${failed} 失败  ${skipped} 跳过  (${elapsed}s)`)
  if (failed > 0) {
    log('❌ 失败用例：')
    results.filter(r => r.status === 'fail').forEach(r => log(`   ${r.id}: ${r.msg}${r.detail ? ' — ' + r.detail : ''}`))
  } else {
    log('✅ 所有执行用例通过')
  }

  // 写结果文件
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const outDir  = resolve(join(__dirname, '..'), 'docs', 'test-result')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, `T3-result-${dateStr}.md`)
  writeFileSync(outPath, buildMarkdown(elapsed), 'utf-8')
  log(`\n📄 结果已写入：${outPath}`)

  process.exit(failed > 0 ? 1 : 0)
}

function buildMarkdown(elapsed: string): string {
  const date   = new Date().toISOString().slice(0, 10)
  const overall = failed === 0
    ? `✅ 全部执行用例通过（${passed} 通过，${skipped} 跳过）`
    : `❌ 存在 ${failed} 个失败（${passed} 通过，${failed} 失败，${skipped} 跳过）`

  const groups = [
    { label: 'TC-DB 数据库结构', prefix: 'TC-DB' },
    { label: 'TC-SEC 安全性',    prefix: 'TC-SEC' },
    { label: 'TC-TH 节流逻辑',   prefix: 'TC-TH' },
    { label: 'TC-E2E 端到端',    prefix: 'TC-E2E' },
    { label: 'TC-ERR 异常容错',  prefix: 'TC-ERR' },
  ]
  // 动态状态：有失败=❌，全跳过=⏭️，否则=✅
  const tableRows = groups.map(g => {
    const grp = results.filter(r => r.id.startsWith(g.prefix))
    const p = grp.filter(r => r.status === 'pass').length
    const f = grp.filter(r => r.status === 'fail').length
    const s = grp.filter(r => r.status === 'skip').length
    const icon = f > 0 ? '❌ 有失败' : s === grp.length ? '⏭️ 全跳过' : '✅ 全通过'
    return `| ${g.label} | ${grp.length} | ${p} | ${f} | ${s} | ${icon} |`
  }).join('\n')

  const detailRows = results.map(r => {
    const icon = r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : '⏭️'
    return `| ${icon} | ${r.id} | ${r.msg}${r.detail ? `（${r.detail}）` : ''} |`
  }).join('\n')

  return `# 测试结果：T3 Supabase 数据变更 → EdgeOne 自动部署

**任务编号：** T3
**测试日期：** ${date}
**测试方案：** [docs/test-plan/T3-webhook-auto-deploy.md](../test-plan/T3-webhook-auto-deploy.md)
**整体结论：** ${overall}
**耗时：** ${elapsed}s

---

## 执行汇总

| 分类 | 用例数 | 通过 | 失败 | 跳过 | 状态 |
|------|--------|------|------|------|------|
${tableRows}

---

## 详细结果

| 状态 | 用例 | 说明 |
|------|------|------|
${detailRows}

---

## 测试日志

\`\`\`
${testLogs.join('\n')}
\`\`\`

---

## 跳过说明

| 用例 | 原因 |
|------|------|
| TC-E2E1~3 | EdgeOne 构建过程需在控制台手动确认，DB 触发链路已由 TC-TH / TC-E2E4 覆盖 |
| TC-ERR2 | 需临时修改 Edge Function 环境变量 EDGEONE_DEPLOY_HOOK_URL，不可远程自动化 |

---

## 验收结论

\`\`\`
${results.filter(r => r.status === 'pass').map(r => `[x] ${r.id}: ${r.msg}`).join('\n')}
${results.filter(r => r.status === 'fail').map(r => `[!] ${r.id}: ${r.msg}${r.detail ? ' — ' + r.detail : ''}`).join('\n')}
${results.filter(r => r.status === 'skip').map(r => `[-] ${r.id}: SKIP — ${r.msg}`).join('\n')}
\`\`\`
`
}

main().catch(e => { console.error('脚本异常：', e); process.exit(1) })
