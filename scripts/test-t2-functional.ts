/**
 * T2 功能测试脚本
 * 验证 EdgeOne Pages 静态部署所需的构建产物和配置
 * 运行：npx tsx scripts/test-t2-functional.ts
 */

/// <reference types="node" />
import { readFileSync, existsSync, readdirSync, statSync, createReadStream } from "node:fs";
import { resolve, join } from "node:path";
import * as http from "node:http";

const ROOT = resolve(__dirname, "..");
const OUT  = join(ROOT, "out");

// ── 测试工具 ───────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(id: string, condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ ${id}: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ ${id}: ${msg}`);
    failed++;
  }
}

function assertGte(id: string, actual: number, min: number, label: string) {
  assert(id, actual >= min, `${label} = ${actual}（期望 ≥ ${min}）`);
}

/** 递归统计目录下指定扩展名文件数量 */
function countByExt(dir: string, ext: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory()) {
      n += countByExt(join(dir, f.name), ext);
    } else if (f.name.endsWith(ext)) {
      n++;
    }
  }
  return n;
}

/** 发起 HTTP GET 请求，返回状态码（-1 = 连接失败） */
function httpGet(url: string): Promise<number> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode ?? -1);
    });
    req.on("error", () => resolve(-1));
    req.setTimeout(3000, () => { req.destroy(); resolve(-1); });
  });
}

// ── TC-C：配置验证 ─────────────────────────────────────────────────

console.log("\n[TC-C] next.config.ts 静态导出配置");

const configPath = join(ROOT, "next.config.ts");
const configSrc = existsSync(configPath) ? readFileSync(configPath, "utf-8") : "";

assert("TC-C1", /output\s*:\s*["']export["']/.test(configSrc), 'output: "export" 配置存在');
assert("TC-C2", /unoptimized\s*:\s*true/.test(configSrc), "images.unoptimized: true 配置存在");
assert(
  "TC-C3",
  !/distDir/.test(configSrc) || /distDir\s*:\s*["']out["']/.test(configSrc),
  "无自定义 distDir 或 distDir 为 out"
);
assert("TC-C4", /trailingSlash\s*:\s*true/.test(configSrc), "trailingSlash: true 配置存在（EdgeOne 路由无歧义必需）");

// ── TC-G：generateStaticParams 覆盖率 ─────────────────────────────

console.log("\n[TC-G] generateStaticParams 覆盖率");

const DYNAMIC_ROUTES = [
  "tools/[slug]/page.tsx",
  "compare/[slug]/page.tsx",
  "alternatives/[slug]/page.tsx",
  "industries/[slug]/page.tsx",
  "industries/[slug]/[purpose]/page.tsx",
  "by/[slug]/page.tsx",
  "launches/[date]/page.tsx",
  "list/[slug]/page.tsx",
  "marketplace/[slug]/page.tsx",
  "solutions/[slug]/page.tsx",
  "badge/[slug]/preview/page.tsx",
];

const APP_DIR = join(ROOT, "src", "app");
let routesExist = 0;
let routesHaveGSP = 0;

for (const route of DYNAMIC_ROUTES) {
  const filePath = join(APP_DIR, route);
  const exists = existsSync(filePath);
  if (exists) {
    routesExist++;
    const src = readFileSync(filePath, "utf-8");
    if (/generateStaticParams/.test(src)) routesHaveGSP++;
  }
}

assertGte("TC-G1", routesExist, DYNAMIC_ROUTES.length, `动态路由文件数（共 ${DYNAMIC_ROUTES.length} 个）`);
assertGte("TC-G2", routesHaveGSP, DYNAMIC_ROUTES.length, `包含 generateStaticParams 的文件数`);

const toolsHtmlCount = countByExt(join(OUT, "tools"), ".html");
assertGte("TC-G3", toolsHtmlCount, 10, "out/tools/ HTML 文件数");

// ── TC-E：产物完整性 ───────────────────────────────────────────────

console.log("\n[TC-E] out/ 产物完整性");

const totalHtml = countByExt(OUT, ".html");
assertGte("TC-E1", totalHtml, 100, "out/ HTML 文件总数");

// trailingSlash: true → 每个路由输出为 slug/index.html，而非 slug.html
const REQUIRED_HTML = [
  "index.html",
  join("tools", "index.html"),
  join("tools", "claude-code", "index.html"),
  join("compare", "index.html"),
  join("about", "index.html"),
];
let requiredHtmlOk = 0;
for (const f of REQUIRED_HTML) {
  if (existsSync(join(OUT, f))) requiredHtmlOk++;
}
assert("TC-E2", requiredHtmlOk === REQUIRED_HTML.length, `关键路由 HTML 存在（${requiredHtmlOk}/${REQUIRED_HTML.length}）`);

const jsCount = countByExt(join(OUT, "_next", "static"), ".js");
assertGte("TC-E3", jsCount, 5, "out/_next/static/ JS 文件数");

const cssCount = countByExt(join(OUT, "_next", "static"), ".css");
assertGte("TC-E4", cssCount, 1, "out/_next/static/ CSS 文件数");

assert("TC-E5", existsSync(join(OUT, "404.html")), "out/404.html 存在");

// ── TC-H：HTML 内容验证 ────────────────────────────────────────────

console.log("\n[TC-H] HTML 内容验证");

const claudeHtmlPath = join(OUT, "tools", "claude-code", "index.html");
const claudeHtml = existsSync(claudeHtmlPath) ? readFileSync(claudeHtmlPath, "utf-8") : "";

assert("TC-H1", /lang="zh-CN"/.test(claudeHtml), 'HTML lang="zh-CN"');
assert("TC-H2", /rel="stylesheet"|href="[^"]*\.css"/.test(claudeHtml), "CSS 样式表引用存在");

const claudeCodeCount = (claudeHtml.match(/Claude Code/g) ?? []).length;
assert("TC-H3", claudeCodeCount >= 2, `工具名 "Claude Code" 出现 ${claudeCodeCount} 次（期望 ≥ 2）`);

assert("TC-H4", /Anthropic 官方的终端 AI 编程助手/.test(claudeHtml), "tagline 正确渲染");
assert("TC-H5", /子墨亲测/.test(claudeHtml), "Level 标签 L1=子墨亲测 渲染正确");
assert("TC-H8", /free|freemium|paid|免费/.test(claudeHtml), "pricing 信息存在");

const indexHtmlPath = join(OUT, "index.html");
const indexHtml = existsSync(indexHtmlPath) ? readFileSync(indexHtmlPath, "utf-8") : "";
assert("TC-H6", /Claude Code|Cursor|Deepseek/.test(indexHtml), "首页包含工具卡片内容");
assert("TC-H7", /写作助手|视频制作|图像生成/.test(indexHtml), "首页包含分类导航");

// TC-H9: compare 页面非空（trailingSlash → slug/index.html）
const compareDir = join(OUT, "compare");
const compareSlugs = existsSync(compareDir)
  ? readdirSync(compareDir, { withFileTypes: true })
      .filter(f => f.isDirectory() && !f.name.startsWith("__"))
      .filter(f => existsSync(join(compareDir, f.name, "index.html")))
      .map(f => f.name)
  : [];
if (compareSlugs.length > 0) {
  const size = statSync(join(compareDir, compareSlugs[0], "index.html")).size;
  assert("TC-H9", size >= 5000, `compare/${compareSlugs[0]}/index.html 大小 ${size} bytes（期望 ≥ 5KB）`);
} else {
  assert("TC-H9", false, "out/compare/ 目录下无子页面");
}

// TC-H10: alternatives 页面非空（trailingSlash → slug/index.html）
const altDir = join(OUT, "alternatives");
const altSlugs = existsSync(altDir)
  ? readdirSync(altDir, { withFileTypes: true })
      .filter(f => f.isDirectory() && !f.name.startsWith("__"))
      .filter(f => existsSync(join(altDir, f.name, "index.html")))
      .map(f => f.name)
  : [];
if (altSlugs.length > 0) {
  const size = statSync(join(altDir, altSlugs[0], "index.html")).size;
  assert("TC-H10", size >= 3000, `alternatives/${altSlugs[0]}/index.html 大小 ${size} bytes（期望 ≥ 3KB）`);
} else {
  assert("TC-H10", false, "out/alternatives/ 目录下无子页面");
}

// ── TC-L：本地路由访问测试 ─────────────────────────────────────────

console.log("\n[TC-L] 本地静态服务器路由测试（Node.js http）");

async function runRouteTests() {
  const port = Math.floor(47000 + Math.random() * 1000);

  // 静态文件服务器：模拟 trailingSlash: true 的 CDN 行为
  // /slug/ 或 /slug → out/slug/index.html
  const server = http.createServer((req, res) => {
    const urlPath = (req.url ?? "/").split("?")[0].replace(/\/+$/, "") || "/";

    const candidates = urlPath === "/"
      ? [join(OUT, "index.html")]
      : [
          join(OUT, urlPath, "index.html"),   // trailingSlash: slug/index.html
          join(OUT, urlPath + ".html"),        // 兼容根级特殊文件（404.html 等）
        ];

    const filePath = candidates.find(p => existsSync(p) && statSync(p).isFile());
    if (filePath) {
      const ext = filePath.endsWith(".css") ? "text/css"
        : filePath.endsWith(".js") ? "application/javascript"
        : "text/html; charset=utf-8";
      res.writeHead(200, { "Content-Type": ext });
      createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  assert("TC-L1", true, `静态服务器启动成功（端口 ${port}）`);

  // 收集所有待测路由
  const routes: string[] = ["/", "/tools", "/compare", "/alternatives", "/about", "/404"];

  // trailingSlash: true → 动态路由输出为子目录，通过 isDirectory() 收集
  function collectSlugRoutes(segment: string) {
    const dir = join(OUT, segment);
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isDirectory() && !f.name.startsWith("__")) {
        routes.push(`/${segment}/${f.name}`);
      }
    }
  }

  collectSlugRoutes("tools");
  collectSlugRoutes("compare");
  collectSlugRoutes("alternatives");
  collectSlugRoutes("industries");

  console.log(`  → 共 ${routes.length} 条路由待测试`);

  let routeFailed = 0;
  const failedRoutes: string[] = [];

  for (const route of routes) {
    const code = await httpGet(`http://127.0.0.1:${port}${route}`);
    if (code !== 200) {
      routeFailed++;
      failedRoutes.push(`${route} (${code})`);
    }
  }

  if (routeFailed > 0) {
    console.error(`  ❌ 以下路由返回非 200：`);
    failedRoutes.forEach(r => console.error(`     ${r}`));
    failed++;
  } else {
    console.log(`  ✅ TC-L2: 全部 ${routes.length} 条路由返回 200`);
    passed++;
  }

  server.close();
}

// ── 汇总 ──────────────────────────────────────────────────────────

async function main() {
  await runRouteTests();

  console.log(`\n${"─".repeat(55)}`);
  console.log(`T2 功能测试结果：${passed} 通过，${failed} 失败`);
  console.log(`\n⚠️  TC-P1/P2（EdgeOne 控制台配置）需手动验证，请参考测试方案 §九`);

  if (failed > 0) {
    console.error("❌ 存在失败用例，请修复后重试");
    process.exit(1);
  } else {
    console.log("✅ 所有自动化测试通过");
  }
}

main().catch((e) => {
  console.error("脚本异常：", e);
  process.exit(1);
});
