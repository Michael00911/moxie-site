# 修复报告：代码评审问题修复（2026-05-20）

**修复日期：** 2026-05-20
**关联分支：** `feature/moxie-468-new`
**触发来源：** `/review` 代码评审（本次会话）
**修复状态：** ✅ 全部完成（7 项）

---

## 修复概览

| # | 优先级 | 问题 | 文件 | 状态 |
|---|--------|------|------|------|
| 1 | 🔴 立即修复 | `slug: "11labs-music"` 对应 `name: "Suno"`，完全不相关产品 | `seed-tools.ts:426` | ✅ 已修复 |
| 2 | 🔴 立即修复 | `slug: "n8n-cloud"` 对应 `name: "Make"`，两家不同公司产品 | `seed-tools.ts:500` | ✅ 已修复 |
| 3 | 🟡 建议修复 | 同一工具跨脚本 slug 不一致（perplexity/runway/n8n），会产生 DB 重复行 | `seed-crawler-tools.ts` | ✅ 已修复 |
| 4 | 🟡 建议修复 | `elevenlabs` 在两个 seed 脚本中均有且数据不同，UPSERT 顺序敏感 | `seed-crawler-tools.ts` | ✅ 已修复 |
| 5 | 🟡 建议修复 | `seed-tools.ts` 读取 `NEXT_PUBLIC_SUPABASE_URL`，与其他脚本读取 `SUPABASE_URL` 不一致 | `seed-tools.ts:52` | ✅ 已修复 |
| 6 | 🟡 建议修复 | TC-E2E4 `targetSlug` 直接插入 URL 查询字符串，未做 `encodeURIComponent` | `test-t3-webhook.ts` | ✅ 已修复 |
| 7 | 🟡 建议修复 | `.gitignore` 遗留 `/docs/skills/*` 死规则（目录已移至 `.claude/commands/`） | `.gitignore` | ✅ 已修复 |

---

## 详细修复说明

### 修复 1 — `suno` slug 纠错（🔴）

**文件：** `scripts/seed-tools.ts`

**问题：** `slug: "11labs-music"` 对应的工具是 Suno（AI 音乐生成），与 ElevenLabs（语音合成）完全不同产品，造成前台工具详情页会显示错误产品信息。

**修复前：**
```typescript
{ slug: "11labs-music", name: "Suno", ... }
```

**修复后：**
```typescript
{ slug: "suno", name: "Suno", ... }
```

---

### 修复 2 — `make-com` slug 纠错（🔴）

**文件：** `scripts/seed-tools.ts`

**问题：** `slug: "n8n-cloud"` 对应的工具是 Make.com（Integromat），与 n8n Cloud 是不同公司产品，n8n 已有独立 slug `n8n`。

**修复前：**
```typescript
{ slug: "n8n-cloud", name: "Make", ... }
```

**修复后：**
```typescript
{ slug: "make-com", name: "Make", ... }
```

---

### 修复 3 — `seed-crawler-tools.ts` 跨脚本 slug 对齐（🟡）

**文件：** `scripts/seed-crawler-tools.ts`

**问题：** 三个工具在两个 seed 脚本中使用了不同 slug，顺序执行后 DB 中会出现重复行，前台列表同一工具显示两次。

| 工具 | seed-tools.ts（主） | seed-crawler-tools.ts（修复前） | 修复后 |
|------|--------------------|---------------------------------|--------|
| Perplexity | `perplexity` | `perplexity-ai` | `perplexity` |
| Runway | `runway` | `runway-gen3` | `runway` |
| n8n | `n8n` | `n8n-workflow` | `n8n` |

---

### 修复 4 — 删除 `elevenlabs` 重复条目（🟡）

**文件：** `scripts/seed-crawler-tools.ts`

**问题：** `elevenlabs` 同时存在于 `seed-tools.ts`（source=curation，L1）和 `seed-crawler-tools.ts`（source=crawler，L3），数据不同。`seed-tools.ts` 的 UPSERT 会覆盖 crawler 版本（或反之），结果取决于执行顺序。

**修复：** 从 `seed-crawler-tools.ts` 删除 `elevenlabs` 条目，以 `seed-tools.ts` 为单一数据来源。

---

### 修复 5 — `seed-tools.ts` 环境变量名统一（🟡）

**文件：** `scripts/seed-tools.ts`

**问题：** `seed-tools.ts` 读取 `NEXT_PUBLIC_SUPABASE_URL`，其余所有脚本统一读取 `SUPABASE_URL`，导致开发者配置了 `SUPABASE_URL` 后运行 `seed-tools.ts` 仍报变量缺失。

**修复前：**
```typescript
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

**修复后：**
```typescript
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
```

向后兼容：优先读 `SUPABASE_URL`，兼顾已有 `NEXT_PUBLIC_SUPABASE_URL` 的配置。

---

### 修复 6 — TC-E2E4 `targetSlug` URL 编码（🟡）

**文件：** `scripts/test-t3-webhook.ts`

**问题：** `slug=eq.${targetSlug}` 直接拼接到 PostgREST 查询字符串，若 slug 含 `&`、`=`、`%` 等字符会导致参数解析错误。

**修复前：**
```typescript
await restPatch('tools', `slug=eq.${targetSlug}`, ...)
```

**修复后：**
```typescript
await restPatch('tools', `slug=eq.${encodeURIComponent(targetSlug)}`, ...)
```

---

### 修复 7 — `.gitignore` 删除死规则（🟡）

**文件：** `.gitignore`

**问题：** `/docs/skills/*` 对应目录已移至 `.claude/commands/`，该规则是死代码。

**修复：** 删除 `/docs/skills/*` 这一行。

---

## 未修复项说明

评审中记录的 🟢 可选优化项（`httpFetch` 仅支持 HTTPS 无告警、两套 `loadEnv` 并存）不影响当前功能，延后处理。
