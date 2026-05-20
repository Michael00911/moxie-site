# 修复报告：feature/moxie-468-new Code Review 问题修复

**修复日期：** 2026-05-20  
**关联分支：** `feature/moxie-468-new`  
**触发来源：** `/review` 代码评审（评审结论见当次会话）  
**修复状态：** ✅ 全部完成（5 项）

---

## 修复概览

| # | 优先级 | 问题 | 文件 | 状态 |
|---|--------|------|------|------|
| 1 | 🔴 立即修复 | `.gitignore` 白名单被通配符覆盖 | `.gitignore` | ✅ 已修复 |
| 2 | 🟡 建议修复 | `timingSafeEqual` 自实现泄露长度信息 | `trigger-deploy/index.ts` | ✅ 已修复 |
| 3 | 🟡 建议修复 | `deploy_config` 缺少显式 `REVOKE` | `20260519000002_*.sql` | ✅ 已修复 |
| 4 | 🟡 建议修复 | `PROJECT_REF` 硬编码在 2 处脚本 | `test-t3-webhook.ts` / `run-sql-file.ts` | ✅ 已修复 |
| 5 | 🟢 可选优化 | `run-sql-file.ts` 验证查询固定为 `submissions` | `run-sql-file.ts` | ✅ 已修复 |

---

## 详细修复说明

### 修复 1 — `.gitignore` 白名单规则顺序（🔴）

**文件：** `.gitignore`

**问题：** gitignore 后出现的规则优先级更高。白名单 `!` 规则写在通配符之前，导致后面的 `/docs/test-result/*` 将其覆盖，新生成的 `T3-result-*.md` 等文件无法被 `git add`。

**修复前：**
```gitignore
!/docs/test-result/T3-*.md   ← 白名单（先）
/docs/test-result/*          ← 通配符（后，覆盖白名单）
```

**修复后：**
```gitignore
/docs/test-result/*          ← 通配符（先）
!/docs/test-result/T3-*.md   ← 白名单（后，正确生效）
```

**验证：**
```bash
git check-ignore -v docs/test-result/T3-result-20260520.md
# 返回：.gitignore:22:!/docs/test-result/T3-*.md → 文件不被忽略 ✅
```

---

### 修复 2 — `timingSafeEqual` 替换为 Deno 原生实现（🟡）

**文件：** `supabase/functions/trigger-deploy/index.ts`

**问题：** 自实现的比较函数在长度不同时提前分支，通过响应时间差可推断 secret 长度，存在时序侧信道风险。

**修复前：**
```typescript
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {   // ← 分支泄露长度信息
    let diff = 0
    for (let i = 0; i < b.length; i++) diff |= (a.charCodeAt(i % (a.length || 1)) ^ b.charCodeAt(i))
    return false
  }
  ...
}
```

**修复后：**
```typescript
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ab = enc.encode(a)
  const bb = enc.encode(b)
  if (ab.byteLength !== bb.byteLength) return false
  return crypto.subtle.timingSafeEqual(ab, bb)  // Deno 内置，真正 constant-time
}
```

---

### 修复 3 — `deploy_config` 补充显式 `REVOKE`（🟡）

**文件：** `supabase/migrations/20260519000002_edgeone_auto_deploy.sql`

**问题：** `deploy_throttle` 有 `REVOKE ALL FROM anon, authenticated`，但存储 `trigger_secret` 的 `deploy_config` 没有。虽然 RLS + 无策略可实质阻断访问，但缺少显式声明，未来若误加 SELECT 策略将直接暴露密钥。

**修复：**
```sql
ALTER TABLE public.deploy_config ENABLE ROW LEVEL SECURITY;
-- 新增：
REVOKE ALL ON public.deploy_config FROM anon, authenticated;
```

---

### 修复 4 — `PROJECT_REF` 从 `SUPABASE_URL` 动态解析（🟡）

**文件：** `scripts/test-t3-webhook.ts`、`scripts/run-sql-file.ts`

**问题：** `PROJECT_REF = 'lkheprtvomhtitivtuyc'` 硬编码，换项目或环境需同步修改多处，且与 `SUPABASE_URL` 信息重复。

**修复前：**
```typescript
const PROJECT_REF = 'lkheprtvomhtitivtuyc'
```

**修复后：**
```typescript
const PROJECT_REF = new URL(SUPABASE_URL || 'https://placeholder.supabase.co').hostname.split('.')[0]
```

---

### 修复 5 — `run-sql-file.ts` 验证查询通用化（🟢）

**文件：** `scripts/run-sql-file.ts`

**问题：** 无论执行什么 SQL，验证步骤固定查询 `submissions` 表，执行 `tools` 相关 SQL 时输出误导性结果（评审期间实际触发过此问题）。

**修复后：** 验证 SQL 通过第二个 CLI 参数传入，不传则跳过验证；传入时动态渲染任意列名。

```bash
# 不传验证 SQL：执行完直接退出
npx tsx scripts/run-sql-file.ts docs/test-trisql/tri-T3-toolInsert-test2.sql

# 传入自定义验证 SQL
npx tsx scripts/run-sql-file.ts docs/test-trisql/tri-T3-toolInsert-test2.sql \
  "SELECT slug, name, source FROM public.tools WHERE source='crawler' ORDER BY created_at DESC LIMIT 5"
```

---

## 未修复项说明

评审中无遗留未修复的 🔴 / 🟡 问题。以下为评审期间已记录、不在本次修复范围内的事项：

| 项目 | 说明 |
|------|------|
| TC-ERR2 测试验证 | 需修改 Edge Function Secret，危险操作，无权限，延后执行 |
| `deploy_config.trigger_secret` 明文存储 | 架构上可接受，需纳入密钥轮换计划，非代码问题 |
