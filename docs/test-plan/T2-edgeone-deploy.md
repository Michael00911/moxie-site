# 测试方案：T2 EdgeOne Pages 静态部署链路

**任务编号：** T2
**关联需求：** v2.0-edgeone-noauth.md §4.1 T2
**编写日期：** 2026-05-18
**状态：** 部分通过（TC-C ✅ TC-G ✅ TC-E ✅ TC-L ✅ | TC-P 待 EdgeOne 控制台操作）
**注：** 自定义域名 + HTTPS（需求第四点）不在本方案验收范围内。

---

## 一、测试目标

| # | 需求项 | 测试目标 |
|---|--------|---------|
| 1 | `next.config.ts` 加 `output:'export'` + `images.unoptimized:true` | 配置值正确且 build 输出 `out/` 目录 |
| 2 | 所有动态路由加 `generateStaticParams` | 12 个动态路由均已实现，全部页面在 `out/` 中生成为 HTML |
| 3 | EdgeOne Pages 接 GitHub repo，build 命令、输出目录正确 | EdgeOne 构建成功，公网 URL 可访问所有路由且返回 200 |

---

## 二、测试环境要求

| 项目 | 要求 |
|------|------|
| Node.js | ≥ 18 |
| npm | 可用（注意：`package.json` build 命令是 `npm run build`，EdgeOne 控制台填写时须对应，非 `pnpm build`） |
| `.env.local` | 含 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`（build 时拉取工具数据） |
| EdgeOne 控制台 | 有项目创建权限，GitHub repo 已授权 |

> **⚠️ 构建命令提示**：规格文档写 `pnpm build`，但项目 `package.json` 无 pnpm，实际应填 `npm run build`（或先在项目根添加 `pnpm-lock.yaml` 以支持 pnpm）。EdgeOne 控制台填写时请以实际 `package.json` 脚本为准。

---

## 三、测试用例总览

| ID | 分类 | 名称 | 优先级 | 执行方式 |
|----|------|------|--------|---------|
| TC-C1 ~ C3 | 配置验证 | next.config.ts 正确性 | P0 | 文件检查 |
| TC-G1 ~ G3 | 静态参数 | generateStaticParams 覆盖率 | P0 | grep + 文件检查 |
| TC-E1 ~ E5 | 导出完整性 | out/ 目录内容验证 | P0 | 文件系统 |
| TC-L1 ~ L2 | 本地验证 | serve out/ 路由 HTTP 200 | P0 | curl |
| TC-P1 ~ P2 | 平台部署 | EdgeOne 构建 + 公网访问 | P0 | 手工（EdgeOne 控制台） |

---

## 四、配置验证（TC-C）

> **执行方式：** 读取 `next.config.ts` 文件内容

### TC-C1：`output: 'export'` 已配置

**检查命令：**
```bash
grep "output" next.config.ts
```
**验收标准：** 输出包含 `output: "export"`。

### TC-C2：`images.unoptimized: true` 已配置

**检查命令：**
```bash
grep "unoptimized" next.config.ts
```
**验收标准：** 输出包含 `unoptimized: true`。

### TC-C3：`trailingSlash: true` 已配置（生成 `/path/index.html` 形式，兼容静态托管）

**检查命令：**
```bash
grep "trailingSlash" next.config.ts
```
**验收标准：** 输出包含 `trailingSlash: true`。

---

## 五、generateStaticParams 覆盖率（TC-G）

> **执行方式：** grep + 文件检查

### TC-G1：所有动态路由文件均实现 `generateStaticParams`

**检查命令：**
```bash
grep -rl "generateStaticParams" src/app/ --include="*.tsx" --include="*.ts" | sort
```

**验收标准：** 以下 12 个文件全部出现在结果中：

| 路由文件 | 对应公开路径 |
|----------|------------|
| `src/app/tools/[slug]/page.tsx` | `/tools/:slug` |
| `src/app/compare/[slug]/page.tsx` | `/compare/:slug` |
| `src/app/alternatives/[slug]/page.tsx` | `/alternatives/:slug` |
| `src/app/industries/[slug]/page.tsx` | `/industries/:slug` |
| `src/app/industries/[slug]/[purpose]/page.tsx` | `/industries/:slug/:purpose` |
| `src/app/by/[slug]/page.tsx` | `/by/:slug` |
| `src/app/list/[slug]/page.tsx` | `/list/:slug` |
| `src/app/marketplace/[slug]/page.tsx` | `/marketplace/:slug` |
| `src/app/solutions/[slug]/page.tsx` | `/solutions/:slug` |
| `src/app/launches/[date]/page.tsx` | `/launches/:date` |
| `src/app/badge/[slug]/preview/page.tsx` | `/badge/:slug/preview` |
| `src/app/badge/img/[slug]/route.ts` | `/badge/img/:slug`（API route）|

### TC-G2：`tools/[slug]` 的参数来自 Supabase fetch

**检查命令：**
```bash
grep -A 3 "generateStaticParams" src/app/tools/\[slug\]/page.tsx
```
**验收标准：** 参数来源为 `tools.map(t => ({ slug: t.slug }))`，即与 `data.ts` 的 Supabase fetch 联动。

### TC-G3：`out/` 中动态路由页面数量与数据源一致

**检查命令：**
```bash
find out/tools -name "index.html" | wc -l
find out/compare -name "index.html" | wc -l
find out/alternatives -name "index.html" | wc -l
```

**验收标准（seed 后 23 条 tools）：**

| 路由前缀 | 期望 HTML 数量 | 说明 |
|----------|--------------|------|
| `out/tools/` | 23 | 每条 tool 一个页面（不含 `out/tools/index.html`） |
| `out/compare/` | ≥ 5 | `compare.ts` 数据条数 |
| `out/alternatives/` | ≥ 5 | `alternatives.ts` 数据条数 |
| `out/industries/` | ≥ 6 | 6 个行业 |

---

## 六、导出完整性（TC-E）

> **执行方式：** 文件系统检查

### TC-E1：`out/` 目录在 build 后存在

```bash
ls -d out/
```
**验收标准：** 目录存在，不报错。

### TC-E2：`out/` 中 HTML 文件总数 ≥ 100

```bash
find out/ -name "index.html" | wc -l
```
**验收标准：** 返回 ≥ 100（当前实测 138）。

### TC-E3：关键路由均已生成

```bash
for route in \
  tools/claude-code compare/claude-code-vs-cursor alternatives/chatgpt \
  industries/saas industries/content-creator/design launches/2026-05-06 \
  list/chinese-ai marketplace/ai-resume-saas by/design solutions/ai-tool; do
  [ -f "out/$route/index.html" ] && echo "✅ $route" || echo "❌ MISSING: $route"
done
```
**验收标准：** 10 条全部输出 ✅。

### TC-E4：静态资源目录存在

```bash
find out/_next/static -name "*.js" | wc -l
find out/_next/static -name "*.css" | wc -l
```
**验收标准：** JS 文件 ≥ 10，CSS 文件 ≥ 1。

### TC-E5：`404.html` 存在（EdgeOne 自定义 404 需要此文件）

```bash
ls out/404.html
```
**验收标准：** 文件存在。

---

## 七、本地静态服务验证（TC-L）

> **执行方式：** `npx serve out/` + curl 测试

### TC-L1：所有类型动态路由均返回 HTTP 200

**测试脚本：**
```bash
npx serve out/ --listen 4173 &
sleep 3
for route in \
  "/" "/tools/" "/tools/claude-code/" "/tools/dreamina/" \
  "/compare/claude-code-vs-cursor/" "/compare/deepseek-vs-claude/" \
  "/alternatives/chatgpt/" \
  "/industries/saas/" "/industries/content-creator/design/" \
  "/launches/2026-05-06/" "/launches/2026-05-05/" \
  "/list/chinese-ai/" "/list/free-ai-tools/" \
  "/marketplace/ai-resume-saas/" \
  "/by/design/" "/by/dev/" \
  "/solutions/ai-tool/" "/solutions/ecom/"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4173$route")
  [ "$code" = "200" ] && echo "✅ $route → $code" || echo "❌ $route → $code"
done
kill %1 2>/dev/null
```

**验收标准：** 所有 18 个路由均返回 200，0 个失败。

### TC-L2：CSS 样式正常加载（无 404 资源）

```bash
npx serve out/ --listen 4173 &
sleep 2
curl -s -o /dev/null -w "%{http_code}" \
  "http://localhost:4173/_next/static/chunks/0~qnq2x604axi.css"
kill %1 2>/dev/null
```

**验收标准：** CSS 文件返回 200。

---

## 八、EdgeOne 平台部署（TC-P）

> **执行方式：** 手工登录 EdgeOne 控制台操作

### TC-P1：EdgeOne Pages 项目配置正确

**操作步骤：**

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入 **Pages** → **新建项目**
3. 选择 **从 GitHub 导入**，授权并选择 `moxie-site` 仓库
4. 填写构建配置：

   | 字段 | 填写值 |
   |------|-------|
   | 构建命令 | `npm run build` |
   | 输出目录 | `out` |
   | Node.js 版本 | `18.x` 或 `20.x` |

5. 添加环境变量：

   | 变量名 | 值来源 |
   |--------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` 中的值 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` 中的值 |

6. 点击 **开始部署**，等待构建完成

**验收标准：**
- 构建日志显示 `✓ Compiled successfully`
- 构建日志显示 `Generating static pages (162/162)` 或相近数字
- 部署状态变为 **成功**

### TC-P2：公网 EdgeOne URL 可访问，所有路由返回 200

**操作步骤：**

获取 EdgeOne 分配的预览域名（形如 `xxxx.edgeone.app`），运行以下命令（替换 `EDGEONE_URL`）：

```bash
EDGEONE_URL="https://xxxx.edgeone.app"

for route in \
  "/" "/tools/" "/tools/claude-code/" "/tools/dreamina/" \
  "/compare/claude-code-vs-cursor/" \
  "/alternatives/chatgpt/" \
  "/industries/saas/" "/industries/content-creator/design/" \
  "/launches/2026-05-06/" \
  "/list/chinese-ai/" \
  "/marketplace/ai-resume-saas/" \
  "/by/design/" \
  "/solutions/ai-tool/"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${EDGEONE_URL}${route}")
  [ "$code" = "200" ] && echo "✅ $route → $code" || echo "❌ $route → $code"
done
```

**验收标准：** 所有路由返回 200，0 个失败。

---

## 九、执行顺序

```
Step 1: TC-C1 ~ C3  — grep next.config.ts
Step 2: TC-G1 ~ G3  — grep + find out/
Step 3: TC-E1 ~ E5  — find out/ 文件系统检查
Step 4: TC-L1 ~ L2  — npx serve out/ + curl
Step 5: TC-P1       — EdgeOne 控制台手工配置
Step 6: TC-P2       — curl 验证公网 URL
```

**整体通过标准：** TC-C / TC-G / TC-E / TC-L / TC-P 全部通过 → T2 验收通过，可进入 T3。

---

## 十、执行结果记录（2026-05-18）

### TC-C — ✅ 全部通过

```
文件：next.config.ts
```

| 用例 | 结果 | 实测值 |
|------|------|--------|
| TC-C1: output = 'export' | ✅ | `output: "export"` |
| TC-C2: images.unoptimized = true | ✅ | `unoptimized: true` |
| TC-C3: trailingSlash = true | ✅ | `trailingSlash: true` |

### TC-G — ✅ 全部通过

| 用例 | 结果 | 说明 |
|------|------|------|
| TC-G1: 12 个动态路由均有 generateStaticParams | ✅ | grep 命中 12 个文件 |
| TC-G2: tools/[slug] 参数来自 Supabase tools | ✅ | `tools.map(t => ({ slug: t.slug }))` |
| TC-G3: out/tools/ 含 23 个页面 | ✅ | 与 seed 数据 23 条一致 |

### TC-E — ✅ 全部通过

| 用例 | 结果 | 实测值 |
|------|------|--------|
| TC-E1: out/ 目录存在 | ✅ | `out/` 存在（最近 build 时间 2026-05-18 18:07） |
| TC-E2: HTML 文件 ≥ 100 | ✅ | 138 个 index.html + 1 个 404.html = 139 |
| TC-E3: 10 个关键路由全部存在 | ✅ | 10/10 ✅ |
| TC-E4: JS ≥ 10，CSS ≥ 1 | ✅ | JS: 18，CSS: 1（`chunks/0~qnq2x604axi.css`） |
| TC-E5: 404.html 存在 | ✅ | `out/404.html` 存在 |

### TC-L — ✅ 全部通过

```
命令：npx serve out/ --listen 4173
```

| 路由 | HTTP 状态 |
|------|----------|
| / | ✅ 200 |
| /tools/ | ✅ 200 |
| /tools/claude-code/ | ✅ 200 |
| /tools/dreamina/ | ✅ 200 |
| /compare/claude-code-vs-cursor/ | ✅ 200 |
| /compare/deepseek-vs-claude/ | ✅ 200 |
| /alternatives/chatgpt/ | ✅ 200 |
| /industries/saas/ | ✅ 200 |
| /industries/content-creator/design/ | ✅ 200 |
| /launches/2026-05-06/ | ✅ 200 |
| /launches/2026-05-05/ | ✅ 200 |
| /list/chinese-ai/ | ✅ 200 |
| /list/free-ai-tools/ | ✅ 200 |
| /marketplace/ai-resume-saas/ | ✅ 200 |
| /by/design/ | ✅ 200 |
| /by/dev/ | ✅ 200 |
| /solutions/ai-tool/ | ✅ 200 |
| /solutions/ecom/ | ✅ 200 |

18/18 路由返回 200，0 失败。

### TC-P — 🔲 待手工执行

| 用例 | 结果 | 说明 |
|------|------|------|
| TC-P1: EdgeOne 控制台配置并部署 | 🔲 待操作 | 见第八节操作步骤 |
| TC-P2: 公网 URL 所有路由 200 | 🔲 待操作 | 需 TC-P1 完成后执行 |

### 当前整体结论

- **可自动验证用例（TC-C / TC-G / TC-E / TC-L）：全部通过**
- **待人工完成：** TC-P1 / TC-P2（EdgeOne 控制台建项目 + 公网验证）
- **注意事项：**
  - EdgeOne 构建命令应填 `npm run build`，不是 `pnpm build`
  - 构建时需在 EdgeOne 控制台配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 两个环境变量
  - 输出目录填 `out`（无斜杠）
