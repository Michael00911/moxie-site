# 代码评审报告

**评审范围：** commits `4a49e7a`（SQL 迁移）+ `ae69f1c`（数据层改造）
**评审日期：** 2026-05-18

---

## 概述

这两个提交将 Moxie 站点从全量硬编码 TypeScript 数据迁移至 Supabase 数据层，包含数据库 Schema 创建、seed 脚本，以及将 `data.ts` 改造为构建时从 Supabase 拉取数据。

---

## 🔴 严重问题

### 1. `tools-list.tsx` 在客户端组件中直接 import 服务端 fetch 模块

**文件：** [src/app/tools/tools-list.tsx:5](src/app/tools/tools-list.tsx#L5)

```ts
import { categories, tools } from "@/lib/data"; // ← 位于 'use client' 组件中
```

`data.ts` 包含顶层 `await fetchToolsFromSupabase()`。从 `'use client'` 组件中 import 它，会将 `fetchToolsFromSupabase` 打包进浏览器 JavaScript。每次页面加载都会在浏览器端重新请求 Supabase，彻底破坏了静态导出（`output: 'export'`）的设计意图，将构建时 fetch 变成了运行时客户端 fetch。

**修复方案：** 由父级 Server Component 将 `tools` 作为 prop 向下传递：

```tsx
// tools/page.tsx（Server Component）
export default async function ToolsPage() {
  return (
    <Suspense ...>
      <ToolsList initialTools={tools} />
    </Suspense>
  );
}

// tools-list.tsx（Client Component）
export function ToolsList({ initialTools }: { initialTools: Tool[] }) { ... }
```

---

### 2. seed 脚本在改造后出现循环依赖

**文件：** [scripts/seed-tools.ts:13](scripts/seed-tools.ts#L13)

```ts
import { tools } from "../src/lib/data";
```

改造后 `data.ts` 的 `tools` 来源是从 Supabase fetch。运行 seed 脚本时，会先从 Supabase 拉取 `tools`，再把它写回 Supabase——鸡生蛋的问题。脚本注释仍写"将 src/lib/data.ts 的 24 条工具数据写入 Supabase"，但这 24 条静态数据已不再存在于 `data.ts` 中，脚本目前实际上已无法完成最初的一次性 seed 目的。

**修复方案：** 在 seed 脚本中内联 24 条静态工具数据，或单独保留 `src/lib/seed-data.ts` 存放硬编码数据，与 Supabase fetch 逻辑解耦。

---

## 🟠 重要问题

### 3. SQL 迁移脚本具有破坏性，重复执行会丢失全部数据

**文件：** [supabase/migrations/20260518000001...sql:9-10](supabase/migrations/20260518000001_create_tools_and_submissions.sql#L9-L10)

```sql
drop table if exists public.submissions cascade;
drop table if exists public.tools      cascade;
```

在生产环境再次执行此文件会无声地删除所有数据。紧随其后的 `CREATE TABLE IF NOT EXISTS` 形成误导——DROP 之后表根本不存在，`IF NOT EXISTS` 没有任何保护意义。这种写法适合开发重置脚本，不适合应只执行一次的命名迁移文件。

**修复方案：** 从迁移文件中删除 `DROP` 语句；开发环境重置逻辑单独放到 `scripts/reset-db.sql`。保留 `CREATE TABLE IF NOT EXISTS` 使迁移真正幂等。

---

### 4. 数据库行到 TypeScript 类型的转换存在不安全的类型断言

**文件：** [src/lib/data.ts:47-51](src/lib/data.ts#L47-L51)

```ts
level:   (row.level as Tool["level"]) ?? "L4",
pricing: (row.pricing as Tool["pricing"]) ?? "free",
```

若数据库中存储了 `"L5"` 或非法值，`as` 强转会静默通过，`?? "L4"` 兜底永远不会触发（非空字符串是 truthy）。

**修复方案：** 用显式校验替代强转：

```ts
const VALID_LEVELS = new Set(["L1", "L2", "L3", "L4"]);
level: VALID_LEVELS.has(row.level ?? "") ? (row.level as Tool["level"]) : "L4",
```

---

## 🟡 中等问题

### 5. Supabase 请求失败时没有降级兜底，构建直接中断

**文件：** [src/lib/data.ts:99-103](src/lib/data.ts#L99-L103)

若 Supabase 返回非 200（限流、网络故障、密钥配置错误），当前代码直接 `throw`，导致 CI 构建失败且没有任何诊断信息。建议降级返回空数组并打印警告，避免整个构建因数据服务抖动而中断：

```ts
if (!res.ok) {
  console.warn(`[data] Supabase fetch 失败：${res.status} — 本次构建将使用 0 条工具数据`);
  return [];
}
```

---

### 6. `tools` 表缺少 `created_at` 字段

**文件：** [supabase/migrations/20260518000001...sql](supabase/migrations/20260518000001_create_tools_and_submissions.sql)

`tools` 表有 `updated_at` 但没有 `created_at`。`published_at` 记录的是"发布日期"而非"行插入时间"，两者语义不同。缺少插入时间戳会给后续审计和"按入库时间排序"需求带来不便。

---

### 7. `good_for` / `not_good_for` 的 NULL vs 空数组不一致

**SQL 定义：** `NOT NULL DEFAULT '{}'`（空数组）
**TypeScript 映射：** `goodFor: row.good_for ?? undefined`

若数据库返回 `[]`（空数组），`rowToTool` 产出 `goodFor: []`，而非 `undefined`。下游代码若用 `if (tool.goodFor)` 判断是否展示该字段，空数组会被当作 truthy，导致渲染出空内容区域。

**修复方案（二选一）：**
- SQL 改为 `good_for text[]`（允许 NULL），或
- `rowToTool` 改为 `goodFor: row.good_for?.length ? row.good_for : undefined`

---

## 🟢 低优先级 / 代码风格

### 8. `categories` 的重导出写法冗余

**文件：** [src/lib/data.ts:112](src/lib/data.ts#L112)

```ts
import { categories as _categories } from "./types";
export const categories: Category[] = _categories;
```

可简化为：

```ts
export { categories } from "./types";
```

---

### 9. `tools/page.tsx` 仅为获取 `.length` 而 import `tools`

**文件：** [src/app/tools/page.tsx:16](src/app/tools/page.tsx#L16)

```ts
import { tools } from "@/lib/data";
// 仅用于：共 {tools.length} 个工具
```

`ToolsList` 客户端组件也会评估同一模块。待问题 #1 修复后，将 `tools.length` 作为 prop 从 Server Component 传入，避免重复的模块引用。

---

## 汇总

| # | 等级 | 文件 | 问题描述 |
|---|------|------|---------|
| 1 | 🔴 严重 | `tools-list.tsx` | 客户端组件直接 import 服务端 fetch 模块，每次页面加载都会请求 Supabase |
| 2 | 🔴 严重 | `seed-tools.ts` | 循环依赖：从 Supabase 取数据再写回 Supabase，seed 脚本已失效 |
| 3 | 🟠 重要 | SQL 迁移 | `DROP TABLE CASCADE` 使迁移文件有破坏性，重复执行丢失全部数据 |
| 4 | 🟠 重要 | `data.ts` | `level` 和 `pricing` 字段存在静默不安全的类型断言 |
| 5 | 🟡 中等 | `data.ts` | Supabase fetch 失败无降级，直接导致构建中断 |
| 6 | 🟡 中等 | SQL 迁移 | `tools` 表缺少 `created_at` 审计字段 |
| 7 | 🟡 中等 | `data.ts` | `good_for`/`not_good_for` NULL 与空数组语义不一致 |
| 8 | 🟢 低 | `data.ts` | `categories` 重导出写法冗余 |
| 9 | 🟢 低 | `tools/page.tsx` | 仅为 `.length` 而重复 import `tools` |

**当前最优先修复：问题 #1（客户端 fetch 泄漏）和 #2（seed 脚本循环依赖），这两个问题会直接影响数据层上线后的正确性。**
