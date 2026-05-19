# 测试方案：T2 EdgeOne Pages 静态部署

**任务编号：** T2
**关联需求：** v2.0-edgeone-noauth.md §4.2 T2
**编写日期：** 2026-05-19
**状态：** 部分通过（TC-C ✅ TC-G ✅ TC-E ✅ TC-H ✅ TC-L ✅ | TC-P 待 EdgeOne 控制台操作）

---

## 一、测试目标

| 目标 | 说明 |
|------|------|
| 静态导出配置 | `next.config.ts` 包含 `output:'export'` + `images.unoptimized:true` |
| generateStaticParams 覆盖率 | 所有动态路由（~11 个）均有 `generateStaticParams` 导出 |
| 构建产物完整性 | `out/` 目录包含完整的 HTML / JS / CSS 静态文件 |
| HTML 内容正确性 | 生成的 HTML 包含正确的工具数据、语言标记、CSS 引用 |
| 路由可访问性 | 本地静态服务器能正确响应所有主要路由（HTTP 200） |
| EdgeOne 控制台配置 | GitHub 连接、构建命令 `npm run build`、输出目录 `out` |

---

## 二、测试环境要求

### 2.1 本地环境
- Node.js ≥ 18，`npm run build` 可用
- `.env.local` 包含 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `out/` 目录已存在（执行 `npm run build` 生成）
- `tsx` 已安装（`devDependencies` 中已有）

### 2.2 EdgeOne 环境（TC-P 专用）
- 已有 EdgeOne Pages 账号
- GitHub repo 有写权限
- 项目根目录有 `package.json`（构建入口）

---

## 三、测试用例总览

| ID | 分类 | 名称 | 优先级 | 执行方式 |
|----|------|------|--------|---------|
| TC-C1 ~ C3 | 配置验证 | next.config.ts 静态导出配置 | P0 | 脚本（文件读取） |
| TC-G1 ~ G3 | generateStaticParams | 动态路由覆盖率 | P0 | 脚本（文件读取） |
| TC-E1 ~ E5 | 产物完整性 | out/ 目录结构与文件数量 | P0 | 脚本（文件系统） |
| TC-H1 ~ H10 | HTML 内容 | 语言标记、CSS 引用、工具数据 | P0 | 脚本（文件读取） |
| TC-L1 ~ L2 | 路由访问 | 本地静态服务器 HTTP 响应 | P0 | 脚本（Node.js http） |
| TC-P1 ~ P2 | EdgeOne 控制台 | 项目配置 + 部署验证 | P0 | 手动操作 |

---

## 四、配置验证（TC-C）

> **执行方式：** 脚本读取 `next.config.ts` 源文件并 grep 关键字符串

### TC-C1：output: "export" 配置存在
**检查：** `next.config.ts` 中包含 `output: "export"` 或 `output:"export"`
**验收标准：** grep 到至少一处匹配

### TC-C2：images.unoptimized 配置存在
**检查：** `next.config.ts` 中包含 `unoptimized: true`
**验收标准：** grep 到至少一处匹配

### TC-C3：构建产物目录为 out/
**检查：** `next.config.ts` 中不包含 `distDir`（使用 Next.js 默认 `out/`），或 `distDir` 值为 `"out"`
**验收标准：** 无自定义 `distDir`，或 `distDir` 为 `"out"`

---

## 五、generateStaticParams 覆盖率（TC-G）

> **执行方式：** 脚本读取所有 `src/app/**/[*/page.tsx`，检查是否导出 `generateStaticParams`

### 必须存在 generateStaticParams 的路由（共 11 个）

| 路由文件 | 路由路径 |
|---------|---------|
| `src/app/tools/[slug]/page.tsx` | `/tools/:slug` |
| `src/app/compare/[slug]/page.tsx` | `/compare/:slug` |
| `src/app/alternatives/[slug]/page.tsx` | `/alternatives/:slug` |
| `src/app/industries/[slug]/page.tsx` | `/industries/:slug` |
| `src/app/industries/[slug]/[purpose]/page.tsx` | `/industries/:slug/:purpose` |
| `src/app/by/[slug]/page.tsx` | `/by/:slug` |
| `src/app/launches/[date]/page.tsx` | `/launches/:date` |
| `src/app/list/[slug]/page.tsx` | `/list/:slug` |
| `src/app/marketplace/[slug]/page.tsx` | `/marketplace/:slug` |
| `src/app/solutions/[slug]/page.tsx` | `/solutions/:slug` |
| `src/app/badge/[slug]/preview/page.tsx` | `/badge/:slug/preview` |

### TC-G1：所有动态路由文件存在
**验收标准：** 上述 11 个文件全部存在于 `src/app/` 目录中

### TC-G2：所有文件均导出 generateStaticParams
**验收标准：** 每个文件中均能 grep 到 `generateStaticParams`（不含则无法静态导出）

### TC-G3：工具详情路由生成了 ≥ 10 个 slug
**验收标准：** `out/tools/` 目录下包含 ≥ 10 个 `.html` 文件（证明参数实际生成）

---

## 六、产物完整性（TC-E）

> **执行方式：** 脚本遍历 `out/` 目录，检查文件数量和关键路径

### TC-E1：out/ 目录 HTML 文件总数 ≥ 100
**验收标准：** `find out/ -name "*.html"` 返回 ≥ 100 个文件

### TC-E2：关键路由 HTML 存在
**必须存在的文件：**
- `out/index.html`（首页）
- `out/tools.html`（工具列表）
- `out/tools/claude-code.html`
- `out/compare.html`（比较列表）
- `out/about.html`

### TC-E3：JS 资源文件存在
**验收标准：** `out/_next/static/` 递归包含 ≥ 5 个 `.js` 文件

### TC-E4：CSS 资源文件存在
**验收标准：** `out/_next/static/` 递归包含 ≥ 1 个 `.css` 文件

### TC-E5：404 页面存在
**验收标准：** `out/404.html` 文件存在

---

## 七、HTML 内容验证（TC-H）

> **执行方式：** 脚本读取特定 HTML 文件，验证关键内容片段

### TC-H1：HTML lang 属性为 zh-CN
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `lang="zh-CN"`

### TC-H2：CSS 样式表引用存在
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `<link rel="stylesheet"` 或 `href=.*\.css`

### TC-H3：工具名称渲染正确
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `Claude Code`（≥ 2 次）

### TC-H4：工具 tagline 渲染正确
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `Anthropic 官方的终端 AI 编程助手`

### TC-H5：Level 标签渲染
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `子墨亲测`（L1 工具的 level 标签）

### TC-H6：首页包含工具卡片内容
**文件：** `out/index.html`
**验收标准：** 含 `Claude Code` 或 `Cursor`（工具名）

### TC-H7：首页包含分类导航
**文件：** `out/index.html`
**验收标准：** 含 `写作助手` 或 `视频制作`（分类名）

### TC-H8：工具详情页包含 pricing 信息
**文件：** `out/tools/claude-code.html`
**验收标准：** 含 `free` 或 `freemium` 或 `paid` 或 `免费`

### TC-H9：compare 页面包含对比数据
**文件：** `out/compare/` 下第一个 `.html` 文件
**验收标准：** 非空，大小 ≥ 5KB

### TC-H10：alternatives 页面存在且非空
**文件：** `out/alternatives/` 下第一个 `.html` 文件
**验收标准：** 非空，大小 ≥ 3KB

---

## 八、本地路由访问测试（TC-L）

> **执行方式：** 脚本用 Node.js `http.createServer()` 启动静态服务器（随机端口 47000~48000），
> 再用 `http.get()` 逐一请求关键路由，检查 HTTP 状态码。
>
> **测试脚本：** `scripts/test-t2-functional.ts`

### TC-L1：静态服务器启动成功
**验收标准：** 服务器在随机端口监听，无 EADDRINUSE 错误

### TC-L2：关键路由全部返回 200
**测试路由清单（共 ~120 条）：**
- 静态页面：`/`、`/tools`、`/compare`、`/alternatives`、`/about`、`/404`
- 工具详情：`/tools/claude-code`、`/tools/cursor` 等所有生成的 slug
- 比较页面：`/compare/*.html` 下所有生成页面
- 替代品页面：`/alternatives/` 下所有生成页面
- 行业页面：`/industries/` 下所有生成页面

**验收标准：** 所有请求均返回状态码 200，失败数量为 0

---

## 九、EdgeOne 控制台配置（TC-P）

> **执行方式：** 手动操作 EdgeOne Pages 控制台，以下为操作检查清单

### TC-P1：EdgeOne Pages 项目配置正确

操作步骤：
1. 登录 EdgeOne 控制台 → Pages → 新建项目
2. 选择"从 GitHub 导入"，授权并选择 `moxie-site` 仓库
3. 配置如下：
   - **构建命令：** `npm run build`
   - **输出目录：** `out`
   - **Node.js 版本：** `18.x` 或 `20.x`
4. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL` = `<your-supabase-url>`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<your-anon-key>`
5. 点击"保存并部署"

**验收标准：** 构建日志显示 `✓ Compiled successfully`，部署成功，获得预览域名（形如 `xxxx.edgeone.app`）

### TC-P2：EdgeOne 预览域名路由可访问

获取 TC-P1 分配的预览域名后，执行以下验证：

```bash
EDGEONE_URL="https://xxxx.edgeone.app"

# 验证首页
curl -s -o /dev/null -w "%{http_code}" "$EDGEONE_URL/"

# 验证工具列表
curl -s -o /dev/null -w "%{http_code}" "$EDGEONE_URL/tools"

# 验证工具详情
curl -s -o /dev/null -w "%{http_code}" "$EDGEONE_URL/tools/claude-code"
```

**验收标准：** 三个请求均返回 200（或 301/302 重定向到正确页面）

---

## 十、执行顺序与通过标准

```
执行顺序：
  Step 1: npm run build（生成 out/ 目录，TC-E/H/L 前提）
  Step 2: npx tsx scripts/test-t2-functional.ts（TC-C / TC-G / TC-E / TC-H / TC-L）
  Step 3: EdgeOne 控制台操作（TC-P1）
  Step 4: 部署成功后执行 curl 验证（TC-P2）
```

**整体通过标准：** TC-C / TC-G / TC-E / TC-H / TC-L 100% 通过，TC-P1/P2 手动确认后，T2 验收通过。

---

## 十一、已执行测试结果（2026-05-19）

> 执行命令：`npx tsx scripts/test-t2-functional.ts`

（见 `docs/test-result/T2-result-20260519.md`）

---

## 附录 A：快速验收检查清单

```
配置验证（脚本自动）
  [ ] TC-C1: output: "export" 配置存在
  [ ] TC-C2: images.unoptimized: true 配置存在
  [ ] TC-C3: 无自定义 distDir 或 distDir 为 "out"

generateStaticParams 覆盖率（脚本自动）
  [ ] TC-G1: 11 个动态路由文件全部存在
  [ ] TC-G2: 全部文件导出 generateStaticParams
  [ ] TC-G3: tools/ 目录下 ≥ 10 个 slug HTML

产物完整性（脚本自动）
  [ ] TC-E1: HTML 文件总数 ≥ 100
  [ ] TC-E2: 5 个关键路由 HTML 存在
  [ ] TC-E3: JS 资源 ≥ 5 个
  [ ] TC-E4: CSS 资源 ≥ 1 个
  [ ] TC-E5: 404.html 存在

HTML 内容（脚本自动）
  [ ] TC-H1: lang="zh-CN"
  [ ] TC-H2: CSS 样式表引用存在
  [ ] TC-H3: 工具名称正确渲染
  [ ] TC-H4: tagline 正确渲染
  [ ] TC-H5: Level 标签渲染
  [ ] TC-H6/H7: 首页内容
  [ ] TC-H8: pricing 信息
  [ ] TC-H9/H10: compare/alternatives 页面

路由访问（脚本自动）
  [ ] TC-L1: 静态服务器启动成功
  [ ] TC-L2: 所有路由 HTTP 200

EdgeOne 控制台（手动）
  [ ] TC-P1: 项目配置正确，部署成功，获取预览域名
  [ ] TC-P2: 预览域名三条路由均 200
```

**[x] = 已通过  [!] = 通过但有偏差  [ ] = 待验证**
