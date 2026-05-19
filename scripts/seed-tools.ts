/**
 * 一次性 seed 脚本：将初始 24 条工具数据写入 Supabase tools 表。
 * 策略：UPSERT（on conflict slug → update），幂等、可重复执行，不会破坏 submissions 外键。
 *
 * 运行：
 *   npm run seed:tools
 *   npx tsx scripts/seed-tools.ts
 *
 * 注意：此脚本使用内联静态数据，与 src/lib/data.ts（从 Supabase 读取）完全解耦，
 *       避免"从 Supabase 取数再写回 Supabase"的循环依赖。
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Tool } from "../src/lib/types";

// ---------- 读取 .env.local ----------
function loadEnv(path: string): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    // .env.local 可能是 UTF-16LE 编码，null 字节需在解析前剥除
    const lines = readFileSync(path, "utf-8").replace(/\0/g, "").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  } catch {
    console.error(`[seed] 无法读取 ${path}，请确认文件存在`);
    process.exit(1);
  }
  return env;
}

const env = loadEnv(resolve(process.cwd(), ".env.local"));

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY  = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "[seed] 缺少环境变量：NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY\n" +
    "       请检查 .env.local"
  );
  process.exit(1);
}

// ---------- Supabase 客户端（service role，绕过 RLS） ----------
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ---------- 初始工具数据（与 data.ts 解耦，独立维护） ----------
const SEED_TOOLS: Tool[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    nameEn: "Claude Code",
    tagline: "Anthropic 官方的终端 AI 编程助手",
    description:
      "Claude Code 是 Anthropic 推出的终端命令行 AI 编程工具，能直接读写文件、运行命令、调试代码，是真正能动手的 AI 程序员。",
    level: "L1",
    rating: 5,
    category: "coding",
    tags: ["AI编程", "命令行", "Anthropic"],
    pricing: "paid",
    priceNote: "$20/月起，按 token 计费",
    zimoView:
      "我自己每天都在用，做什么活都先开 Claude Code。比 Cursor 更适合复杂工程，能直接跑命令、改文件、看日志。Sonnet 4 之后基本不用人类工程师手敲代码了。",
    goodFor: ["独立开发者", "全栈工程师", "Claude 重度用户"],
    notGoodFor: ["纯前端 UI 开发", "完全不懂代码的人"],
    websiteUrl: "https://claude.com/claude-code",
    videoUrl: "https://www.douyin.com/",
    videoTitle: "Claude Code 是怎么把我的工作流彻底改了",
    publishedAt: "2026-04-12",
    updatedAt: "2026-05-01",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "dreamina",
    name: "即梦 Dreamina",
    nameEn: "Dreamina",
    tagline: "字节出品的 AI 图像视频生成平台",
    description:
      "字节跳动出品的 AI 创作平台，覆盖文生图、图生视频、视频生成、口型同步等。Maestro 模式效果接近 Runway 顶配。",
    level: "L1",
    rating: 5,
    category: "video",
    tags: ["视频生成", "字节", "图像"],
    pricing: "freemium",
    priceNote: "免费试用，VIP Maestro $20/月",
    zimoView:
      "国产 AI 视频里效果最好的，Maestro 出图质量已经能直接用于商业创作。命令行版本（dreamina-cli）能批量生成，做内容效率拉满。",
    goodFor: ["短视频创作", "电商主图", "国内创作者"],
    notGoodFor: ["需要严格商业授权的甲方项目"],
    websiteUrl: "https://dreamina.capcut.com",
    videoUrl: "https://www.douyin.com/",
    videoTitle: "字节这款视频生成神器，已经超过 Runway 了",
    publishedAt: "2026-03-20",
    updatedAt: "2026-04-15",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "cursor",
    name: "Cursor",
    nameEn: "Cursor",
    tagline: "VSCode 改造的 AI 编程编辑器",
    description: "基于 VSCode 改造，深度集成 AI Agent，可以同时编辑多文件、跑命令、修复 bug。",
    level: "L1",
    rating: 4,
    category: "coding",
    tags: ["AI编程", "编辑器"],
    pricing: "freemium",
    priceNote: "$20/月 Pro",
    zimoView:
      "如果你是图形界面爱好者，Cursor 是最好的选择。我的视频里大部分演示都用 Cursor，看着直观。但纯效率上不如 Claude Code。",
    goodFor: ["前端开发", "习惯 VSCode 的人", "做演示"],
    notGoodFor: ["纯命令行党"],
    websiteUrl: "https://cursor.com",
    videoUrl: "https://www.douyin.com/",
    videoTitle: "Cursor vs Claude Code 我都用了，告诉你怎么选",
    publishedAt: "2026-02-10",
    updatedAt: "2026-04-20",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "v0",
    name: "v0 by Vercel",
    tagline: "用一句话生成 React 界面",
    description: "Vercel 出品，描述需求即可生成 React/Tailwind 组件代码，可直接部署。",
    level: "L2",
    rating: 4,
    category: "coding",
    tags: ["UI生成", "React", "Vercel"],
    pricing: "freemium",
    priceNote: "免费有额度，$20/月起",
    zimoView: "做产品原型超快，但生成的代码偏样板，复杂业务逻辑要二次改写。",
    goodFor: ["快速原型", "UI demo", "落地页"],
    notGoodFor: ["复杂业务系统"],
    websiteUrl: "https://v0.app",
    publishedAt: "2026-01-15",
    updatedAt: "2026-04-01",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    tagline: "最像真人的 AI 语音合成",
    description: "全球最强的 TTS + 声音克隆平台，支持 30+ 语言，一段录音克隆你自己的声音。",
    level: "L1",
    rating: 5,
    category: "audio",
    tags: ["语音合成", "声音克隆"],
    pricing: "freemium",
    priceNote: "免费 1 万字，$5/月起",
    zimoView:
      "我子墨说AI 视频里所有需要 AI 配音的场景都用它，质量秒杀国内任何 TTS。中文也支持，但中英混读最自然。",
    goodFor: ["视频配音", "有声书", "国际化内容"],
    notGoodFor: ["需要纯本土播音腔（豆包更接地气）"],
    websiteUrl: "https://elevenlabs.io",
    videoUrl: "https://www.douyin.com/",
    videoTitle: "我用 ElevenLabs 克隆了自己的声音，连家人都没听出来",
    publishedAt: "2026-03-05",
    updatedAt: "2026-04-25",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "runway",
    name: "Runway",
    tagline: "电影级 AI 视频生成",
    description: "Gen-3/Gen-4 模型，电影质感的文生视频和图生视频。",
    level: "L2",
    rating: 4,
    category: "video",
    tags: ["视频生成", "电影感"],
    pricing: "freemium",
    priceNote: "$15/月起",
    zimoView: "电影感最强，但价格贵+国内访问慢，多数场景用即梦更划算。",
    goodFor: ["专业短片", "广告创意"],
    notGoodFor: ["国内创作者日常用"],
    websiteUrl: "https://runwayml.com",
    publishedAt: "2026-02-28",
    updatedAt: "2026-04-10",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    tagline: "审美最高的 AI 图像生成",
    description: "Discord/Web 端运行，V7 模型在艺术性和构图上仍是天花板。",
    level: "L2",
    rating: 5,
    category: "image",
    tags: ["图像生成", "艺术风格"],
    pricing: "paid",
    priceNote: "$10/月起",
    zimoView: "审美最高没有之一，但灵活度比即梦差，需要懂 prompt 玄学。",
    goodFor: ["概念设计", "海报", "插画"],
    notGoodFor: ["精确控制人物表情/动作"],
    websiteUrl: "https://midjourney.com",
    publishedAt: "2026-01-20",
    updatedAt: "2026-04-05",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    tagline: "带引用的 AI 搜索引擎",
    description: "用 LLM 重新做的搜索引擎，每个答案都有来源链接可追溯。",
    level: "L1",
    rating: 5,
    category: "research",
    tags: ["AI搜索", "调研"],
    pricing: "freemium",
    priceNote: "免费足够用，Pro $20/月",
    zimoView: "我做调研、查资料、写报告，第一站永远是 Perplexity，不是 Google。",
    goodFor: ["深度调研", "学术", "新闻追踪"],
    notGoodFor: ["实时聊天对话"],
    websiteUrl: "https://perplexity.ai",
    videoUrl: "https://www.douyin.com/",
    videoTitle: "我已经一年没用 Google 了，因为有 Perplexity",
    publishedAt: "2026-03-15",
    updatedAt: "2026-04-22",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "n8n",
    name: "n8n",
    tagline: "开源的工作流自动化平台",
    description: "类似 Zapier 但开源、可自托管，800+ 集成，支持 AI 节点。",
    level: "L2",
    rating: 4,
    category: "agent",
    tags: ["自动化", "工作流", "开源"],
    pricing: "freemium",
    priceNote: "云版 $20/月，自托管免费",
    zimoView: "我团队的内部自动化基本都用 n8n，比 Zapier 灵活，AI 节点直接接 OpenAI/Claude。",
    goodFor: ["团队自动化", "AI Agent 工作流"],
    notGoodFor: ["完全不懂逻辑/代码的小白"],
    websiteUrl: "https://n8n.io",
    publishedAt: "2026-02-15",
    updatedAt: "2026-04-08",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    tagline: "笔记里的全能 AI 助手",
    description: "Notion 内置 AI，可对文档总结、改写、翻译、问答，2.0 后接入 Claude。",
    level: "L3",
    rating: 4,
    category: "productivity",
    tags: ["笔记", "AI助手"],
    pricing: "freemium",
    priceNote: "Notion Plus $10/月含 AI",
    zimoView: "如果你已经在用 Notion，开 AI 加值得；单独为 AI 上 Notion 不必。",
    goodFor: ["Notion 重度用户"],
    notGoodFor: ["想要一个独立 AI 工具的人"],
    websiteUrl: "https://notion.so",
    publishedAt: "2026-01-10",
    updatedAt: "2026-03-30",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "heygen",
    name: "HeyGen",
    tagline: "AI 数字人视频生成",
    description: "上传一段你的视频，生成可以说任何话的数字分身。",
    level: "L3",
    rating: 4,
    category: "video",
    tags: ["数字人", "视频"],
    pricing: "freemium",
    priceNote: "$24/月起",
    zimoView: "做电商口播、产品演示是真的省事，但口型有 5% 违和感，深度对镜头观众能看出来。",
    goodFor: ["电商带货", "多语言营销"],
    notGoodFor: ["IP 个人号（粉丝会出戏）"],
    websiteUrl: "https://heygen.com",
    publishedAt: "2026-02-25",
    updatedAt: "2026-04-12",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "lovable",
    name: "Lovable",
    tagline: "用聊天的方式造一个完整应用",
    description: "对话式开发平台，描述你想要的 SaaS，它从 0 帮你生成全栈代码。",
    level: "L2",
    rating: 4,
    category: "coding",
    tags: ["全栈生成", "无代码"],
    pricing: "freemium",
    priceNote: "免费 5 个项目，$25/月起",
    zimoView: "比 v0 走得更远，能做完整 SaaS。但生成代码质量不稳定，复杂功能要自己接管。",
    goodFor: ["MVP 验证", "非技术创始人"],
    notGoodFor: ["生产级系统"],
    websiteUrl: "https://lovable.dev",
    publishedAt: "2026-03-01",
    updatedAt: "2026-04-18",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "manus",
    name: "Manus",
    tagline: "通用 AI Agent，能自己上网做事",
    description: "国产通用 Agent，给它一个任务，它自己规划、上网、调工具完成。",
    level: "L3",
    rating: 4,
    category: "agent",
    tags: ["通用Agent", "国产"],
    pricing: "paid",
    priceNote: "邀请制，$30/月起",
    zimoView: "概念演示惊艳，实际跑长任务还会卡。短任务（找资料、整理表格）已经能用。",
    goodFor: ["调研任务", "重复性工作"],
    notGoodFor: ["生产决策"],
    websiteUrl: "https://manus.im",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-30",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "kimi",
    name: "Kimi",
    tagline: "国产长文本 AI 助手",
    description: "Moonshot 出品，200 万字长文本理解能力是国产第一。",
    level: "L3",
    rating: 4,
    category: "research",
    tags: ["国产", "长文本"],
    pricing: "free",
    priceNote: "免费，订阅版去广告",
    zimoView: "读论文、读财报、读长合同，Kimi 是国产里最好用的。日常对话不如豆包。",
    goodFor: ["读长文档", "学术研究"],
    notGoodFor: ["创意/口语对话"],
    websiteUrl: "https://kimi.moonshot.cn",
    publishedAt: "2026-02-05",
    updatedAt: "2026-03-25",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "doubao",
    name: "豆包",
    tagline: "字节出品的国产 ChatGPT",
    description: "字节跳动 AI 助手，对话/写作/图像/语音全能，国内访问最快。",
    level: "L3",
    rating: 4,
    category: "writing",
    tags: ["国产", "字节"],
    pricing: "free",
    priceNote: "免费",
    zimoView: "国产里综合最强，免费且好用。我做内容时拿它写中文初稿，再用 Claude 改。",
    goodFor: ["国内日常写作", "中文场景"],
    notGoodFor: ["代码任务", "深度推理"],
    websiteUrl: "https://www.doubao.com",
    publishedAt: "2026-01-25",
    updatedAt: "2026-04-15",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    tagline: "性价比最高的国产 AI 模型",
    description: "深度求索的开源模型，V3/R1 推理能力接近 Claude，但成本只有 1/10。",
    level: "L2",
    rating: 5,
    category: "agent",
    tags: ["国产", "开源", "高性价比"],
    pricing: "freemium",
    priceNote: "API 0.001 元/千 token",
    zimoView: "做 AI 产品后端，DeepSeek API 是国产首选。便宜、快、效果好，用 Claude 50% 任务可以替换。",
    goodFor: ["API 调用", "成本敏感场景"],
    notGoodFor: ["前端用户体验（响应稍慢）"],
    websiteUrl: "https://deepseek.com",
    publishedAt: "2026-01-08",
    updatedAt: "2026-04-20",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "11labs-music",
    name: "Suno",
    tagline: "AI 一键生成完整歌曲",
    description: "输入歌词或主题，AI 生成带人声的完整歌曲，V4 模型质量惊艳。",
    level: "L3",
    rating: 4,
    category: "audio",
    tags: ["AI音乐", "歌曲生成"],
    pricing: "freemium",
    priceNote: "免费 50 次/天，$10/月起",
    zimoView: "做短视频背景音乐神器，生日歌求婚歌也能定制。版权归你。",
    goodFor: ["视频 BGM", "定制歌曲"],
    notGoodFor: ["专业音乐制作"],
    websiteUrl: "https://suno.com",
    publishedAt: "2026-03-10",
    updatedAt: "2026-04-22",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "gamma",
    name: "Gamma",
    tagline: "AI 生成 PPT/网页/文档",
    description: "输入主题，AI 帮你生成完整 PPT，可一键转网页或文档。",
    level: "L3",
    rating: 4,
    category: "productivity",
    tags: ["PPT", "演示"],
    pricing: "freemium",
    priceNote: "免费 400 积分，$8/月起",
    zimoView: "比传统 PPT 软件快 10 倍，做演示稿、提案稿、给团队同步用得很爽。",
    goodFor: ["快速演示稿", "提案"],
    notGoodFor: ["设计精度极高的发布会 PPT"],
    websiteUrl: "https://gamma.app",
    publishedAt: "2026-02-12",
    updatedAt: "2026-04-08",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "fellou",
    name: "Fellou",
    tagline: "AI 浏览器：网页里的智能 Agent",
    description: "国产 AI 浏览器，内置 Agent 自动浏览/操作网页/总结内容。",
    level: "L4",
    category: "agent",
    tags: ["浏览器", "国产", "Agent"],
    pricing: "freemium",
    websiteUrl: "https://fellou.ai",
    publishedAt: "2026-04-15",
    updatedAt: "2026-04-15",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "qwen",
    name: "Qwen 通义千问",
    tagline: "阿里云 AI 模型",
    description: "阿里云通义系列，开源 Qwen3 在中文榜单领先。",
    level: "L4",
    category: "agent",
    tags: ["国产", "开源", "阿里"],
    pricing: "freemium",
    websiteUrl: "https://tongyi.aliyun.com",
    publishedAt: "2026-04-10",
    updatedAt: "2026-04-10",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "n8n-cloud",
    name: "Make",
    tagline: "可视化自动化平台",
    description: "Zapier 替代，复杂流程更便宜。",
    level: "L4",
    category: "agent",
    tags: ["自动化"],
    pricing: "freemium",
    websiteUrl: "https://make.com",
    publishedAt: "2026-04-08",
    updatedAt: "2026-04-08",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "tldraw",
    name: "tldraw",
    tagline: "AI 辅助的画板工具",
    description: "可在画布中用 AI 把草图变成完整 UI，把白板转成代码。",
    level: "L4",
    category: "productivity",
    tags: ["画板", "原型"],
    pricing: "free",
    websiteUrl: "https://tldraw.com",
    publishedAt: "2026-04-12",
    updatedAt: "2026-04-12",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
  {
    slug: "mermaid-chart",
    name: "Mermaid Chart",
    tagline: "AI 生成流程图/架构图",
    description: "用文字描述生成流程图、序列图、架构图，AI 助手加速。",
    level: "L4",
    category: "productivity",
    tags: ["流程图", "图表"],
    pricing: "freemium",
    websiteUrl: "https://mermaidchart.com",
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    isSponsored: false,
    saves: 0,
    views: 0,
  },
];

// ---------- camelCase → snake_case 转换 ----------
type ToolRow = {
  slug: string;
  name: string;
  name_en: string | null;
  tagline: string;
  description: string | null;
  level: string | null;
  rating: number | null;
  category: string;
  tags: string[];
  pricing: string | null;
  price_note: string | null;
  zimo_view: string | null;
  good_for: string[];
  not_good_for: string[];
  website_url: string;
  affiliate_url: string | null;
  video_url: string | null;
  video_title: string | null;
  logo_url: string | null;
  cover_url: string | null;
  published_at: string | null;
  updated_at: string;
  is_sponsored: boolean;
  saves: number;
  views: number;
  status: "approved" | "draft" | "archived";
  source: "curation" | "submission" | "crawler";
};

function toRow(t: Tool): ToolRow {
  return {
    slug:          t.slug,
    name:          t.name,
    name_en:       t.nameEn       ?? null,
    tagline:       t.tagline,
    description:   t.description  ?? null,
    level:         t.level        ?? null,
    rating:        t.rating       ?? null,
    category:      t.category,
    tags:          t.tags         ?? [],
    pricing:       t.pricing      ?? null,
    price_note:    t.priceNote    ?? null,
    zimo_view:     t.zimoView     ?? null,
    good_for:      t.goodFor      ?? [],
    not_good_for:  t.notGoodFor   ?? [],
    website_url:   t.websiteUrl,
    affiliate_url: t.affiliateUrl ?? null,
    video_url:     t.videoUrl     ?? null,
    video_title:   t.videoTitle   ?? null,
    logo_url:      t.logoUrl      ?? null,
    cover_url:     t.coverUrl     ?? null,
    published_at:  t.publishedAt  ?? null,
    updated_at:    t.updatedAt    ?? new Date().toISOString(),
    is_sponsored:  t.isSponsored  ?? false,
    saves:         t.saves        ?? 0,
    views:         t.views        ?? 0,
    status:        "approved",
    source:        "curation",
  };
}

// ---------- 主逻辑（包在 async 函数里，兼容 CJS/ESM） ----------
async function main() {
  const rows = SEED_TOOLS.map(toRow);
  console.log(`[seed] 准备写入 ${rows.length} 条工具数据…`);

  const { data, error } = await supabase
    .from("tools")
    .upsert(rows, {
      onConflict: "slug",
      ignoreDuplicates: false,
    })
    .select("slug");

  if (error) {
    console.error("[seed] ❌ 写入失败：", error.message);
    console.error("       详情：", error);
    process.exit(1);
  }

  console.log(`[seed] ✅ 成功写入 ${data?.length ?? 0} 条`);
  if (data && data.length !== rows.length) {
    console.warn(
      `[seed] ⚠️  期望写入 ${rows.length} 条，实际返回 ${data.length} 条，请检查 Supabase 日志`
    );
  }
}

main();
