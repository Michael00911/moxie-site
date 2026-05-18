/// <reference types="node" />
/**
 * T2 功能测试脚本
 * 覆盖 TC-C / TC-G / TC-E / TC-H / TC-L
 * 运行：npx tsx scripts/test-t2-functional.ts
 */

import { readFileSync, existsSync, readdirSync, statSync, createReadStream } from "node:fs";
import { resolve, join, extname } from "node:path";
import * as http from "node:http";

const ROOT = resolve(process.cwd());
const OUT  = join(ROOT, "out");

// ── 断言工具 ─────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const issues: string[] = [];

function ok(id: string, msg: string)  { console.log(`  ✅ ${id}: ${msg}`); passed++; }
function fail(id: string, msg: string) { console.error(`  ❌ ${id}: ${msg}`); failed++; issues.push(`${id}: ${msg}`); }
function check(id: string, cond: boolean, pass: string, failMsg: string) { cond ? ok(id, pass) : fail(id, failMsg); }

function readFile(path: string): string {
  try { return readFileSync(path, "utf-8"); } catch { return ""; }
}

// 修正：用 endsWith(ext) 而非精确匹配文件名
function countByExt(dir: string, ext: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const full = join(d, f);
      if (statSync(full).isDirectory()) walk(full);
      else if (f.endsWith(ext)) n++;
    }
  };
  walk(dir);
  return n;
}

function countNamed(dir: string, name: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const full = join(d, f);
      if (statSync(full).isDirectory()) walk(full);
      else if (f === name) n++;
    }
  };
  walk(dir);
  return n;
}

// ── TC-C：next.config.ts 配置 ────────────────────────────────────

console.log("\n══════════════════════════════════════════════════");
console.log("  TC-C  next.config.ts 配置验证");
console.log("══════════════════════════════════════════════════");

const config = readFile(join(ROOT, "next.config.ts"));
check("TC-C1", config.includes('"export"') || config.includes("'export'"),
  'output: "export" 已配置', 'output: "export" 未找到');
check("TC-C2", config.includes("unoptimized: true"),
  "images.unoptimized: true 已配置", "images.unoptimized: true 未找到");
check("TC-C3", config.includes("trailingSlash: true"),
  "trailingSlash: true 已配置", "trailingSlash: true 未找到");

// ── TC-G：generateStaticParams 覆盖率 ────────────────────────────

console.log("\n══════════════════════════════════════════════════");
console.log("  TC-G  generateStaticParams 覆盖率");
console.log("══════════════════════════════════════════════════");

const REQUIRED_GSP = [
  "src/app/tools/[slug]/page.tsx",
  "src/app/compare/[slug]/page.tsx",
  "src/app/alternatives/[slug]/page.tsx",
  "src/app/industries/[slug]/page.tsx",
  "src/app/industries/[slug]/[purpose]/page.tsx",
  "src/app/by/[slug]/page.tsx",
  "src/app/list/[slug]/page.tsx",
  "src/app/marketplace/[slug]/page.tsx",
  "src/app/solutions/[slug]/page.tsx",
  "src/app/launches/[date]/page.tsx",
  "src/app/badge/[slug]/preview/page.tsx",
  "src/app/badge/img/[slug]/route.ts",
];

for (const rel of REQUIRED_GSP) {
  const src = readFile(join(ROOT, rel));
  check(`TC-G1 [${rel.replace("src/app/", "")}]`,
    src.includes("generateStaticParams"), "generateStaticParams 已实现", "未实现 generateStaticParams");
}

const toolsPage = readFile(join(ROOT, "src/app/tools/[slug]/page.tsx"));
check("TC-G2", toolsPage.includes("tools.map") && toolsPage.includes("slug"),
  "tools/[slug] 参数来自 tools.map(slug)（Supabase 联动）", "tools/[slug] 参数来源异常");

const toolPageCount = existsSync(join(OUT, "tools"))
  ? readdirSync(join(OUT, "tools")).filter(f => {
      const p = join(OUT, "tools", f);
      return statSync(p).isDirectory() && existsSync(join(p, "index.html"));
    }).length
  : 0;
check("TC-G3", toolPageCount >= 20,
  `out/tools/ 含 ${toolPageCount} 个工具详情页`, `out/tools/ 仅含 ${toolPageCount} 个（期望 ≥ 20）`);

// ── TC-E：out/ 导出完整性 ────────────────────────────────────────

console.log("\n══════════════════════════════════════════════════");
console.log("  TC-E  out/ 静态导出完整性");
console.log("══════════════════════════════════════════════════");

check("TC-E1", existsSync(OUT), "out/ 目录存在", "out/ 不存在，请先运行 npm run build");

const htmlCount = countNamed(OUT, "index.html");
check("TC-E2", htmlCount >= 100, `HTML 文件数：${htmlCount}（≥ 100）`, `HTML 文件数：${htmlCount}（期望 ≥ 100）`);

for (const route of [
  "tools/claude-code", "tools/deepseek", "tools/cursor",
  "compare/claude-code-vs-cursor", "compare/deepseek-vs-claude",
  "alternatives/chatgpt", "alternatives/cursor",
  "industries/saas", "industries/content-creator", "industries/content-creator/design",
  "launches/2026-05-06", "launches/2026-05-05",
  "list/chinese-ai", "list/free-ai-tools",
  "marketplace/ai-resume-saas",
  "by/design", "by/dev",
  "solutions/ai-tool", "solutions/ecom",
]) {
  check(`TC-E3 [${route}]`, existsSync(join(OUT, route, "index.html")), "index.html 存在", "index.html 缺失");
}

const jsCnt  = countByExt(join(OUT, "_next", "static"), ".js");
const cssCnt = countByExt(join(OUT, "_next", "static"), ".css");
check("TC-E4-js",  jsCnt  >= 10, `静态 JS：${jsCnt} 个`,  `静态 JS 仅 ${jsCnt} 个（期望 ≥ 10）`);
check("TC-E4-css", cssCnt >= 1,  `静态 CSS：${cssCnt} 个`, `静态 CSS 为 0`);
check("TC-E5", existsSync(join(OUT, "404.html")), "out/404.html 存在", "out/404.html 缺失");

// ── TC-H：HTML 内容功能验证 ───────────────────────────────────────

console.log("\n══════════════════════════════════════════════════");
console.log("  TC-H  HTML 内容功能验证");
console.log("══════════════════════════════════════════════════");

const homeHtml    = readFile(join(OUT, "index.html"));
const claudeHtml  = readFile(join(OUT, "tools/claude-code/index.html"));
const compareHtml = readFile(join(OUT, "compare/claude-code-vs-cursor/index.html"));
const saasHtml    = readFile(join(OUT, "industries/saas/index.html"));
const toolsHtml   = readFile(join(OUT, "tools/index.html"));
const notFoundHtml= readFile(join(OUT, "404.html"));

check("TC-H1", homeHtml.includes("Claude Code") || homeHtml.includes("Cursor") || homeHtml.includes("即梦"),
  "首页含工具名（Supabase 数据）", "首页未找到任何工具名");
check("TC-H2", homeHtml.includes('lang="zh-CN"') || homeHtml.includes("lang='zh-CN'"),
  '首页 <html lang="zh-CN"> 正确', "首页缺少 lang=zh-CN");
check("TC-H3", homeHtml.includes("/_next/static") && (homeHtml.includes(".css") || homeHtml.includes("stylesheet")),
  "首页引用了 CSS 资源", "首页未找到 CSS 引用");
check("TC-H4", claudeHtml.includes("Claude Code"),
  "tools/claude-code 含工具名", "tools/claude-code 未含工具名");
check("TC-H5", claudeHtml.includes("Anthropic 官方的终端 AI 编程助手"),
  "tools/claude-code 含 tagline（Supabase 数据）", "tools/claude-code 未含 tagline，Supabase 数据可能未注入");
check("TC-H6", claudeHtml.includes("子墨亲测"),
  "tools/claude-code 含 level 标签（子墨亲测）", "tools/claude-code 未含 level 标签");
check("TC-H7", compareHtml.includes("Claude Code") && compareHtml.includes("Cursor"),
  "compare 页同时含两个工具名", "compare 页缺失工具名");
check("TC-H8", saasHtml.length > 5000,
  `industries/saas HTML 体积正常（${Math.round(saasHtml.length/1024)}KB）`,
  `industries/saas HTML 过小（${saasHtml.length}B），疑似未渲染`);
check("TC-H9", toolsHtml.includes("/tools/claude-code") || toolsHtml.includes("claude-code"),
  "工具列表页含工具 slug 链接", "工具列表页未含任何工具 slug 链接");
check("TC-H10", notFoundHtml.length > 1000,
  `404 页面正常渲染（${Math.round(notFoundHtml.length/1024)}KB）`,
  `404 页面内容过少（${notFoundHtml.length}B）`);

// ── TC-L：Node 内建静态服务 + http.get 全量路由验证 ───────────────

function collectRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];
  if (!existsSync(dir)) return routes;
  for (const f of readdirSync(dir)) {
    if (f.startsWith("_") || f === "404") continue;
    const full = join(dir, f);
    if (statSync(full).isDirectory()) {
      const rel = `${base}/${f}`;
      if (existsSync(join(full, "index.html"))) routes.push(rel + "/");
      routes.push(...collectRoutes(full, rel));
    }
  }
  return routes;
}

// MIME map for static assets
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".txt":  "text/plain",
  ".webp": "image/webp",
};

function createStaticServer(root: string, port: number): http.Server {
  return http.createServer((req, res) => {
    let urlPath = (req.url ?? "/").split("?")[0];

    // trailing slash → index.html
    if (urlPath.endsWith("/")) urlPath += "index.html";

    const filePath = join(root, urlPath.replace(/\//g, "/"));
    const mime = MIME[extname(filePath)] ?? "application/octet-stream";

    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404); res.end("Not Found"); return;
    }
    res.writeHead(200, { "Content-Type": mime });
    createReadStream(filePath).pipe(res);
  }).listen(port);
}

function httpGet(url: string): Promise<number> {
  return new Promise(resolve => {
    const req = http.get(url, res => { res.resume(); resolve(res.statusCode ?? 0); });
    req.setTimeout(5000, () => { req.destroy(); resolve(0); });
    req.on("error", () => resolve(0));
  });
}

async function runServeTests() {
  console.log("\n══════════════════════════════════════════════════");
  console.log("  TC-L  本地静态服务 HTTP 200 验证");
  console.log("══════════════════════════════════════════════════");

  // 随机端口避免冲突
  const PORT = 47000 + Math.floor(Math.random() * 1000);
  const server = createStaticServer(OUT, PORT);
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  console.log(`  → 静态服务已启动在端口 ${PORT}`);

  try {
    const routes = [...new Set(["/", ...collectRoutes(OUT)])];
    console.log(`  → 测试 ${routes.length} 个路由（仅打印失败项）…\n`);

    let routeFail = 0;
    for (const route of routes) {
      const code = await httpGet(`http://localhost:${PORT}${route}`);
      if (code !== 200) {
        console.error(`  ❌ TC-L1 [${route}] → ${code || "timeout"}`);
        routeFail++;
        issues.push(`TC-L1 [${route}]: HTTP ${code || "timeout"}`);
      }
    }

    routeFail === 0
      ? ok("TC-L1", `${routes.length} 个路由全部返回 200`)
      : fail("TC-L1", `${routeFail}/${routes.length} 个路由未返回 200`);

    // TC-L2：CSS 资源可加载
    const cssFiles: string[] = [];
    const walkCss = (d: string) => {
      for (const f of readdirSync(d)) {
        const full = join(d, f);
        if (statSync(full).isDirectory()) walkCss(full);
        else if (f.endsWith(".css")) cssFiles.push(full);
      }
    };
    walkCss(join(OUT, "_next", "static"));

    if (cssFiles.length > 0) {
      const cssUrl = cssFiles[0].replace(OUT, "").replace(/\\/g, "/");
      const code = await httpGet(`http://localhost:${PORT}${cssUrl}`);
      check("TC-L2", code === 200,
        `CSS 资源可加载（${cssFiles[0].split(/[\\/]/).pop()}）→ 200`,
        `CSS 资源返回 ${code}（${cssUrl}）`);
    } else {
      fail("TC-L2", "未找到 CSS 文件");
    }

  } finally {
    server.close();
  }
}

// ── 主入口 ────────────────────────────────────────────────────────

async function main() {
  await runServeTests();

  console.log(`\n${"═".repeat(50)}`);
  console.log(`T2 功能测试结果：${passed} 通过，${failed} 失败`);

  if (issues.length > 0) {
    console.log("\n失败清单：");
    for (const i of issues) console.error(`  • ${i}`);
  }

  if (failed > 0) {
    console.error("\n❌ 存在失败用例，请修复后重试");
    process.exit(1);
  } else {
    console.log("\n✅ 所有可自动化的 T2 功能测试通过");
    console.log("   剩余 TC-P1/P2 需手工在 EdgeOne 控制台完成。");
  }
}

main();
