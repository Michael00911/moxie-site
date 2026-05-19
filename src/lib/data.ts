import type { Category, Tool, ToolLevel } from "./types";
import { categories as _categories } from "./types";

// ─────────────────────────────────────────────
// Supabase REST API 返回的原始行类型（snake_case）
// ─────────────────────────────────────────────
type SupabaseToolRow = {
  slug: string;
  name: string;
  name_en: string | null;
  tagline: string;
  description: string | null;
  level: string | null;
  rating: number | null;
  category: string;
  tags: string[] | null;
  pricing: string | null;
  price_note: string | null;
  zimo_view: string | null;
  good_for: string[] | null;
  not_good_for: string[] | null;
  website_url: string;
  affiliate_url: string | null;
  video_url: string | null;
  video_title: string | null;
  logo_url: string | null;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_sponsored: boolean;
  saves: number;
  views: number;
  status: string;
  source: string;
};

// ─────────────────────────────────────────────
// 枚举字段校验（防止 DB 写入非法值后静默通过类型断言）
// ─────────────────────────────────────────────
function isToolLevel(v: string | null): v is ToolLevel {
  return v === "L1" || v === "L2" || v === "L3" || v === "L4";
}

function isPricing(v: string | null): v is Tool["pricing"] {
  return v === "free" || v === "freemium" || v === "paid";
}

// ─────────────────────────────────────────────
// snake_case → camelCase 映射
// ─────────────────────────────────────────────
function rowToTool(row: SupabaseToolRow): Tool {
  return {
    slug:          row.slug,
    name:          row.name,
    nameEn:        row.name_en        ?? undefined,
    tagline:       row.tagline,
    description:   row.description    ?? "",
    level:         isToolLevel(row.level)   ? row.level   : "L4",
    rating:        row.rating         ?? undefined,
    category:      row.category,
    tags:          row.tags           ?? [],
    pricing:       isPricing(row.pricing)   ? row.pricing : "free",
    priceNote:     row.price_note     ?? undefined,
    zimoView:      row.zimo_view      ?? undefined,
    goodFor:       row.good_for       ?? undefined,
    notGoodFor:    row.not_good_for   ?? undefined,
    websiteUrl:    row.website_url,
    affiliateUrl:  row.affiliate_url  ?? undefined,
    videoUrl:      row.video_url      ?? undefined,
    videoTitle:    row.video_title    ?? undefined,
    logoUrl:       row.logo_url       ?? undefined,
    coverUrl:      row.cover_url      ?? undefined,
    publishedAt:   row.published_at   ?? row.updated_at,
    updatedAt:     row.updated_at,
    isSponsored:   row.is_sponsored,
    saves:         row.saves,
    views:         row.views,
  };
}

// ─────────────────────────────────────────────
// 从 Supabase 拉取工具列表（构建时缓存）
// ─────────────────────────────────────────────
async function fetchToolsFromSupabase(): Promise<Tool[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("[data] 缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY，请在 .env.local 或 Vercel 环境变量中配置");
  }

  const url =
    `${supabaseUrl}/rest/v1/tools` +
    `?status=eq.approved` +
    `&order=published_at.desc` +
    `&select=*`;

  const res = await fetch(url, {
    headers: {
      apikey:        anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept:        "application/json",
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`[data] Supabase fetch 失败：${res.status} ${res.statusText}`);
  }

  const rows: SupabaseToolRow[] = await res.json();
  return rows.map(rowToTool);
}

// ─────────────────────────────────────────────
// 静态分类列表（源自 types.ts，供页面直接 import { categories } from '@/lib/data' 使用）
// ─────────────────────────────────────────────
export const categories: Category[] = _categories;

// ─────────────────────────────────────────────
// 工具列表：构建时从 Supabase 拉取（top-level await，module: esnext 已支持）
// ─────────────────────────────────────────────
export const tools: Tool[] = await fetchToolsFromSupabase();

// ─────────────────────────────────────────────
// 工具查询辅助函数（与原有签名完全一致）
// ─────────────────────────────────────────────
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.level === "L1").slice(0, 6);
}

export function getRecentTools(limit = 8): Tool[] {
  return [...tools]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getToolsByLevel(level: "L1" | "L2" | "L3" | "L4"): Tool[] {
  return tools.filter((t) => t.level === level);
}

export function getTrendingTools(limit = 12): Tool[] {
  return tools
    .filter((t) => t.level !== "L4")
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

// ─────────────────────────────────────────────
// 以下为纯静态内容，原样保留
// ─────────────────────────────────────────────

export type NewsItem = {
  title: string;
  url: string;
  source?: string;
  date: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  date: string;
  readMin: number;
};

export type Sponsor = {
  name: string;
  tagline: string;
  url: string;
  badge: string;
  category: "top" | "feature" | "newsletter";
};

export type VideoReview = {
  toolSlug: string;
  videoTitle: string;
  videoUrl: string;
  platform: "douyin" | "xhs" | "video" | "youtube";
  views: string;
  postedAt: string;
  thumbnailGradient: string;
};

export const weeklyReviews: VideoReview[] = [
  {
    toolSlug: "claude-code",
    videoTitle: "Claude Code 是怎么把我的工作流彻底改了",
    videoUrl: "https://www.douyin.com/",
    platform: "douyin",
    views: "23.6w",
    postedAt: "2 天前",
    thumbnailGradient: "from-violet-200 via-purple-200 to-fuchsia-200",
  },
  {
    toolSlug: "dreamina",
    videoTitle: "字节这款视频生成神器，已经超过 Runway 了",
    videoUrl: "https://www.douyin.com/",
    platform: "douyin",
    views: "31.2w",
    postedAt: "3 天前",
    thumbnailGradient: "from-rose-200 via-pink-200 to-fuchsia-200",
  },
  {
    toolSlug: "cursor",
    videoTitle: "Cursor vs Claude Code 我都用了，告诉你怎么选",
    videoUrl: "https://www.douyin.com/",
    platform: "douyin",
    views: "18.5w",
    postedAt: "4 天前",
    thumbnailGradient: "from-blue-200 via-sky-200 to-cyan-200",
  },
  {
    toolSlug: "elevenlabs",
    videoTitle: "我用 ElevenLabs 克隆了自己的声音，连家人都没听出来",
    videoUrl: "https://www.douyin.com/",
    platform: "xhs",
    views: "47.8w",
    postedAt: "5 天前",
    thumbnailGradient: "from-amber-200 via-orange-200 to-red-200",
  },
  {
    toolSlug: "perplexity",
    videoTitle: "我已经一年没用 Google 了，因为有 Perplexity",
    videoUrl: "https://www.douyin.com/",
    platform: "douyin",
    views: "15.3w",
    postedAt: "6 天前",
    thumbnailGradient: "from-emerald-200 via-teal-200 to-cyan-200",
  },
  {
    toolSlug: "deepseek",
    videoTitle: "DeepSeek vs Claude，1000 次实测告诉你能不能替换",
    videoUrl: "https://www.douyin.com/",
    platform: "douyin",
    views: "62.1w",
    postedAt: "今天",
    thumbnailGradient: "from-indigo-200 via-violet-200 to-purple-200",
  },
];

const PLATFORM_META: Record<VideoReview["platform"], { label: string; color: string }> = {
  douyin: { label: "抖音",   color: "bg-zinc-900 text-white" },
  xhs:    { label: "小红书", color: "bg-rose-500 text-white" },
  video:  { label: "视频号", color: "bg-emerald-500 text-white" },
  youtube:{ label: "YouTube",color: "bg-red-500 text-white" },
};

export function getPlatformMeta(platform: VideoReview["platform"]) {
  return PLATFORM_META[platform];
}

export const sponsors: Sponsor[] = [
  {
    name: "ZenMux",
    tagline: "企业级 AI 模型聚合器，自带保险机制",
    url: "#",
    badge: "今日 FEATURED",
    category: "top",
  },
  {
    name: "AdsCreator.com",
    tagline: "粘贴网址，AI 自动生成广告创意",
    url: "#",
    badge: "赞助",
    category: "feature",
  },
  {
    name: "Chatbot App",
    tagline: "30+ AI 模型一站式切换：ChatGPT/Claude/Gemini",
    url: "#",
    badge: "赞助",
    category: "feature",
  },
];

export const newsItems: NewsItem[] = [
  { title: "罗氏 10.5 亿美金收购 AI 诊断公司 PathAI",               url: "#", source: "Bloomberg",  date: "2026-05-06" },
  { title: "AI 数据中心需求暴涨，全球半导体供应紧张",               url: "#", source: "FT",           date: "2026-05-05" },
  { title: "Google Chrome 148 上线 AI 自动填充 + Prompt API",       url: "#", source: "Google Blog", date: "2026-05-05" },
  { title: "Anthropic Claude Mythos 预览版展示自主漏洞利用能力",     url: "#", source: "Anthropic",   date: "2026-05-04" },
  { title: "英伟达与康宁合作，共同打造 AI 数据中心基础设施",         url: "#", source: "NVIDIA",      date: "2026-05-03" },
  { title: "Google 推出 Gemma 4 MTP Drafters，推理速度提升 3 倍",   url: "#", source: "DeepMind",    date: "2026-05-02" },
  { title: "Anthropic 与 SpaceX Colossus 1 集群签算力大单",         url: "#", source: "The Information", date: "2026-05-01" },
  { title: "小米发布 OmniVoice：支持 600+ 语言的开源 TTS 模型",     url: "#", source: "GitHub",      date: "2026-04-30" },
  { title: "OpenAI 联合科技巨头推出 MRC 协议，优化 AI 集群",        url: "#", source: "OpenAI",      date: "2026-04-29" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "claude-code-vs-cursor-2026",
    title: "我同时用 Claude Code 和 Cursor 一个月，告诉你怎么选",
    excerpt: "深度对比 Claude Code 和 Cursor 的 6 个核心场景，附决策树。",
    date: "2026-05-04",
    readMin: 8,
  },
  {
    slug: "dreamina-vs-runway",
    title: "字节即梦 vs Runway，到底哪个适合中文创作者",
    excerpt: "Maestro 模式实测对比 Gen-4，含 12 组同 prompt 出图样本。",
    date: "2026-04-28",
    readMin: 12,
  },
  {
    slug: "ai-tool-stack-content-creator",
    title: "我做内容的 AI 工具栈：从选题到剪辑全公开",
    excerpt: "9 个核心工具 + 3 个偏门神器，附我的提示词模板包。",
    date: "2026-04-22",
    readMin: 10,
  },
  {
    slug: "deepseek-vs-claude-cost",
    title: "DeepSeek 真能替换 Claude 吗？我跑了 1000 次 API 给你看数据",
    excerpt: "成本省 90% 但效果差几个百分点，哪些场景真值得换。",
    date: "2026-04-15",
    readMin: 15,
  },
  {
    slug: "ai-video-stack-2026",
    title: "2026 年 AI 视频工具天梯图：18 款实测排序",
    excerpt: "从 Sora 到即梦再到可灵，每个都拿同 prompt 跑过。",
    date: "2026-05-02",
    readMin: 14,
  },
  {
    slug: "manus-vs-fellou",
    title: "Manus vs Fellou：谁才是真正的通用 Agent",
    excerpt: "10 个真实任务 PK，结果出乎意料。",
    date: "2026-04-26",
    readMin: 9,
  },
  {
    slug: "ai-newsletter-howto",
    title: "怎么搭一个赚钱的英文 AI Newsletter",
    excerpt: "从 0 起步到 $2k MRR 的 Beehiiv 实战手册。",
    date: "2026-04-18",
    readMin: 11,
  },
  {
    slug: "vibe-coding-saas-guide",
    title: "Vibe Coding 上线 SaaS 全流程：3 周从 idea 到 $500 MRR",
    excerpt: "Claude Code + v0 + Supabase + Stripe 实战路径。",
    date: "2026-04-10",
    readMin: 18,
  },
];

export type Collection = {
  slug: string;
  title: string;
  desc: string;
  toolSlugs: string[];
  emoji: string;
  cover: string;
  tag: string;
};

export const collections: Collection[] = [
  {
    slug: "content-creator",
    title: "短视频博主必备 5 件套",
    desc: "脚本 + 配音 + 视频 + 剪辑 + 封面，一条龙搞定",
    toolSlugs: ["claude-code", "elevenlabs", "dreamina", "heygen", "midjourney"],
    emoji: "🎬",
    cover: "from-rose-100 to-pink-50",
    tag: "短视频",
  },
  {
    slug: "indie-dev",
    title: "独立开发者武器库",
    desc: "1 个人 + AI 做出 SaaS 的全部装备",
    toolSlugs: ["claude-code", "cursor", "v0", "lovable", "deepseek"],
    emoji: "🛠️",
    cover: "from-purple-100 to-violet-50",
    tag: "Vibe Coding",
  },
  {
    slug: "research-power",
    title: "深度研究 / 写报告",
    desc: "替代 Google + 提升信息处理速度 10 倍",
    toolSlugs: ["perplexity", "kimi", "gamma", "doubao"],
    emoji: "🔬",
    cover: "from-blue-100 to-sky-50",
    tag: "研究",
  },
  {
    slug: "oversea-cheap",
    title: "出海创业最低成本配置",
    desc: "全部用免费 / 国产替代，月成本 < ¥200",
    toolSlugs: ["deepseek", "doubao", "kimi", "dreamina"],
    emoji: "🌏",
    cover: "from-emerald-100 to-teal-50",
    tag: "出海",
  },
  {
    slug: "ai-agent-stack",
    title: "AI Agent 工作流搭建包",
    desc: "n8n + Claude + RAG，把重复劳动外包给 AI",
    toolSlugs: ["n8n", "claude-code", "manus"],
    emoji: "🤖",
    cover: "from-amber-100 to-orange-50",
    tag: "Agent",
  },
  {
    slug: "audio-music",
    title: "音频 / 音乐生成最佳组合",
    desc: "TTS + 歌曲 + 配音，做播客 / 视频 / 课程",
    toolSlugs: ["elevenlabs", "11labs-music"],
    emoji: "🎵",
    cover: "from-fuchsia-100 to-pink-50",
    tag: "音频",
  },
];

export type RankItem = {
  rank: number;
  toolSlug: string;
  delta: number;
  hot?: boolean;
};

export const monthlyTop10: RankItem[] = [
  { rank: 1,  toolSlug: "claude-code",  delta: 0,  hot: true },
  { rank: 2,  toolSlug: "dreamina",     delta: 1,  hot: true },
  { rank: 3,  toolSlug: "cursor",       delta: -1 },
  { rank: 4,  toolSlug: "deepseek",     delta: 2,  hot: true },
  { rank: 5,  toolSlug: "elevenlabs",   delta: 0 },
  { rank: 6,  toolSlug: "perplexity",   delta: -2 },
  { rank: 7,  toolSlug: "manus",        delta: 5,  hot: true },
  { rank: 8,  toolSlug: "lovable",      delta: 1 },
  { rank: 9,  toolSlug: "midjourney",   delta: -3 },
  { rank: 10, toolSlug: "kimi",         delta: 0 },
];

export type Launch = {
  date: string;
  toolSlug: string;
  highlight?: string;
};

export const recentLaunches: Launch[] = [
  { date: "2026-05-06", toolSlug: "fellou",        highlight: "国产 AI 浏览器" },
  { date: "2026-05-04", toolSlug: "manus",         highlight: "通用 Agent" },
  { date: "2026-05-02", toolSlug: "11labs-music" },
  { date: "2026-04-30", toolSlug: "qwen" },
  { date: "2026-04-28", toolSlug: "tldraw" },
  { date: "2026-04-25", toolSlug: "lovable",       highlight: "全栈生成" },
  { date: "2026-04-22", toolSlug: "gamma" },
  { date: "2026-04-20", toolSlug: "mermaid-chart" },
];

export type WeeklyIssue = {
  number: number;
  date: string;
  title: string;
  topPicks: string[];
};

export const weeklyIssues: WeeklyIssue[] = [
  {
    number: 47,
    date: "2026-05-05",
    title: "本周新出 12 个 AI 工具，3 个值得收藏",
    topPicks: ["Fellou AI 浏览器", "Manus 通用 Agent", "Suno V4 音乐生成"],
  },
  {
    number: 46,
    date: "2026-04-28",
    title: "Claude 4.7 + Cursor 2.0 双重更新解读",
    topPicks: ["Claude Code 1M 上下文", "Cursor Background Agents", "DeepSeek-Coder 加速"],
  },
  {
    number: 45,
    date: "2026-04-21",
    title: "AI 视频工具大洗牌：即梦、可灵、Sora 谁赢了",
    topPicks: ["即梦 Maestro 模式", "可灵 2.0", "Sora API 开放"],
  },
  {
    number: 44,
    date: "2026-04-14",
    title: "Vibe Coding 实战：1 周做 SaaS 的工具组合",
    topPicks: ["Lovable.dev", "v0 by Vercel", "Supabase + Stripe 模板"],
  },
];
