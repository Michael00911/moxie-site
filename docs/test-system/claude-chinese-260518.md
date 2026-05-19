# CLAUDE.md（中文版）

本文件为 Claude Code（claude.ai/code）在本仓库中工作时提供指导。

## 重要：Next.js 版本警告

本项目使用 **Next.js 16.2.5** 与 **React 19.2.4**——这些版本可能与你训练数据中的版本存在显著差异。在编写任何 Next.js 相关代码之前，请先阅读 `node_modules/next/dist/docs/` 中的相关指南，并注意弃用提示。

## 常用命令

```bash
npm run dev      # 启动开发服务器，地址为 http://localhost:3000
npm run build    # 生产环境构建
npm run start    # 启动生产服务器
```

项目未配置 lint 或测试脚本。TypeScript 类型检查在构建时隐式执行（`next build` 内部会运行 `tsc --noEmit`）。

## 架构说明

**Moxie** 是一个静态中文 AI 工具导航站（"子墨说AI"）。所有内容均以 TypeScript 硬编码——没有数据库或后端 API。

### 数据层（`src/lib/`）

所有站点数据以导出的 TypeScript 数组和辅助函数的形式存放于此：

- **`data.ts`** — 核心数据文件：`tools[]`、`categories[]`、`sponsors[]`、`newsItems[]`、`blogPosts[]`、`collections[]`、`monthlyTop10[]`、`recentLaunches[]`、`weeklyReviews[]`、`weeklyIssues[]`。新增工具 = 向 `tools[]` 追加一个对象。
- **`types.ts`** — 核心类型：`Tool`、`Category`、`ToolLevel`（`L1`–`L4`）。L1 = "子墨亲测"，L2 = 用过，L3 = 精选，L4 = 待测试。
- **`compare.ts`** — 工具一对一对比数据（`Compare[]`），每条包含维度表、场景推荐、最终判断、FAQ。
- **`alternatives.ts`** — 各工具的替代品清单。
- **`industries.ts`** — 行业专题页（`Industry[]`）：跨境电商、SaaS 创业、自媒体/内容创作、餐饮/实体连锁、教育/培训、服务业/知识工作。
- **`lists.ts`**、**`marketplace.ts`**、**`launches.ts`**、**`purposes.ts`**、**`use-cases.ts`**、**`intersections.ts`**、**`free-tools.ts`**、**`business.ts`**、**`feed.ts`** — 其他内容数据集。
- **`i18n/zh.ts`** — 所有 UI 字符串集中管理，使用强类型字典。在组件中通过 `import { ui } from "@/lib/i18n"` 引入。若要新增英文语言包，只需新建 `en.ts` 实现 `Dict` 类型，再更新 `i18n/index.ts` 即可。

### 页面（`src/app/`）

采用 App Router 结构。核心路由模式：

- `/tools/[slug]` — 工具详情页
- `/compare/[slug]` — 工具一对一对比页
- `/alternatives/[slug]` — 替代品列表页
- `/industries/[slug]` — 行业落地页
- `/industries/[slug]/[purpose]` — 行业 × 用途交叉页
- `/badge/[slug]/route.ts` — 生成工具徽章图片的 API 路由
- `/free/*` — 免费实用工具（Token 计算器、LLM 价格对比等）

### 组件（`src/components/`）

共用 UI 组件：`tool-card.tsx`、`launch-card.tsx`、`search-hero.tsx`、`activity-feed.tsx`、`news-list.tsx`、`sponsored-banner.tsx`、`tab-switch.tsx`、`floating-cta.tsx`。

### 样式

使用 Tailwind CSS v4（通过 `@tailwindcss/postcss`）。根布局（`src/app/layout.tsx`）中包含若干带 `!important` 的内联覆盖样式——这是针对 Tailwind v4 去重问题的有意设计，并非 bug，请勿删除。

### 路径别名

`@/*` 指向 `./src/*`（在 `tsconfig.json` 中配置）。

## PR 规范

所有面向 `main` 分支的 PR，标题或描述中必须包含 `task:#N` 引用（例如 `task: #241`）。`require-task-ref` GitHub Actions 工作流会强制校验此规则，缺失则阻止合并。任务编号在 `https://rd.sdtads.com` 查询。
