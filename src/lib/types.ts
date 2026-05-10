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
