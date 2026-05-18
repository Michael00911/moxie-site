export type ToolLevel = "L1" | "L2" | "L3" | "L4";

export const LEVEL_LABEL: Record<ToolLevel, string> = {
  L1: "子墨亲测",
  L2: "子墨试过",
  L3: "子墨精选",
  L4: "待测试",
};

export const LEVEL_BADGE_CLASS: Record<ToolLevel, string> = {
  L1: "bg-amber-100 text-amber-900 border-amber-200",
  L2: "bg-blue-100 text-blue-900 border-blue-200",
  L3: "bg-emerald-100 text-emerald-900 border-emerald-200",
  L4: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "writing",      name: "写作助手",  emoji: "✍️",  description: "写文案、写文章、写脚本" },
  { slug: "video",        name: "视频制作",  emoji: "🎬",  description: "AI 生成视频、剪辑、配音" },
  { slug: "image",        name: "图像生成",  emoji: "🎨",  description: "文生图、图生图、修图" },
  { slug: "coding",       name: "编程开发",  emoji: "💻",  description: "AI 写代码、调试、文档" },
  { slug: "marketing",    name: "营销增长",  emoji: "📈",  description: "广告、SEO、私域、社媒" },
  { slug: "audio",        name: "音频语音",  emoji: "🎙️", description: "TTS、语音克隆、音乐生成" },
  { slug: "agent",        name: "AI Agent", emoji: "🤖",  description: "自动化助手、工作流、Copilot" },
  { slug: "research",     name: "研究分析",  emoji: "🔍",  description: "搜索、调研、数据分析" },
  { slug: "productivity", name: "效率工具",  emoji: "⚡",  description: "笔记、日程、协作、自动化" },
];

export type Tool = {
  slug: string;
  name: string;
  nameEn?: string;
  tagline: string;
  description: string;
  level: ToolLevel;
  rating?: number;
  category: string;
  tags: string[];
  pricing: "free" | "freemium" | "paid";
  priceNote?: string;
  zimoView?: string;
  goodFor?: string[];
  notGoodFor?: string[];
  websiteUrl: string;
  affiliateUrl?: string;
  videoUrl?: string;
  videoTitle?: string;
  logoUrl?: string;
  coverUrl?: string;
  publishedAt: string;
  updatedAt: string;
  isSponsored?: boolean;
  saves?: number;
  views?: number;
};
