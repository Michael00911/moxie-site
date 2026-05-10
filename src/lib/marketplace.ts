// ====== /marketplace 项目交易市场 ======

export type ListingStatus = "active" | "negotiating" | "sold";
export type ListingTier = "free" | "standard" | "featured";

export type Listing = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  category: string;
  askingPriceUSD: number;
  currency: "USD" | "CNY";
  mrr?: number;
  arr?: number;
  monthlyVisitors?: number;
  ageMonths: number;
  techStack: string[];
  reasonToSell: string;
  whatsIncluded: string[];
  status: ListingStatus;
  tier: ListingTier;
  listedAt: string;
  contactMethod: string;
  gradient: string;
};

export const marketplaceCategories = [
  { slug: "ai-saas", name: "AI SaaS", emoji: "🤖" },
  { slug: "content", name: "内容站 / 自媒体", emoji: "📝" },
  { slug: "ecommerce", name: "电商 / 独立站", emoji: "🛍️" },
  { slug: "newsletter", name: "Newsletter", emoji: "📩" },
  { slug: "tool", name: "AI 工具", emoji: "🛠️" },
  { slug: "agency", name: "代运营 / 服务公司", emoji: "🤝" },
];

export const listings: Listing[] = [
  {
    slug: "ai-resume-saas",
    name: "AI Resume Tailor",
    emoji: "📄",
    tagline: "AI 自动定制简历，专为程序员设计",
    description:
      "海外 SaaS，30 天试用 + 月付 $19。已运营 14 个月，2,200 注册用户、$1.2k MRR。Stripe 收款。海外团队没时间继续运营，挂牌出售。",
    category: "ai-saas",
    askingPriceUSD: 28000,
    currency: "USD",
    mrr: 1200,
    arr: 14400,
    monthlyVisitors: 8500,
    ageMonths: 14,
    techStack: ["Next.js", "Supabase", "Stripe", "OpenAI API"],
    reasonToSell: "全职接外包，没时间运营。",
    whatsIncluded: [
      "完整代码 + GitHub 私有库",
      "Stripe / Supabase / 域名转移",
      "2,200 用户邮箱列表",
      "5 篇高排名 SEO 文章",
      "30 天交接支持",
    ],
    status: "active",
    tier: "featured",
    listedAt: "2026-05-03",
    contactMethod: "邮件子墨撮合",
    gradient: "from-emerald-100 to-teal-50",
  },
  {
    slug: "midjourney-prompt-newsletter",
    name: "Midjourney Daily",
    emoji: "🎨",
    tagline: "每日 Midjourney 提示词周报，1.2万订阅",
    description:
      "Beehiiv 上的英文 Newsletter，每日发送 5 个高质量 Midjourney prompts。12,400 订阅，30% 打开率，月收入 $800（赞助 + Affiliate）。",
    category: "newsletter",
    askingPriceUSD: 18000,
    currency: "USD",
    mrr: 800,
    arr: 9600,
    monthlyVisitors: 0,
    ageMonths: 18,
    techStack: ["Beehiiv", "Stripe", "Notion"],
    reasonToSell: "创始人转向做 SaaS。",
    whatsIncluded: [
      "12,400 订阅邮箱列表（Beehiiv 转移）",
      "1,200+ 篇内容存档",
      "3 个赞助商对接",
      "Affiliate 链接库",
    ],
    status: "active",
    tier: "featured",
    listedAt: "2026-05-01",
    contactMethod: "邮件子墨撮合",
    gradient: "from-rose-100 to-pink-50",
  },
  {
    slug: "ai-tools-directory-cn",
    name: "AI 工具导航小站",
    emoji: "📚",
    tagline: "中文 AI 工具目录，月 UV 5k",
    description:
      "中文 AI 工具导航站，已运营 8 个月。月独立访问 5,200，主要 SEO 流量。月广告收入 ¥3,500（首页 banner 位）。",
    category: "content",
    askingPriceUSD: 8000,
    currency: "USD",
    mrr: 500,
    arr: 6000,
    monthlyVisitors: 5200,
    ageMonths: 8,
    techStack: ["Astro", "Notion API", "Cloudflare Pages"],
    reasonToSell: "团队转向做工具开发，没精力维护内容。",
    whatsIncluded: [
      "完整代码 + 域名 (.com)",
      "180 篇 SEO 文章",
      "Notion 后台",
      "Google Analytics + Cloudflare 数据",
    ],
    status: "active",
    tier: "standard",
    listedAt: "2026-04-25",
    contactMethod: "邮件子墨撮合",
    gradient: "from-amber-100 to-orange-50",
  },
  {
    slug: "shopify-pet-store",
    name: "宠物用品独立站",
    emoji: "🐾",
    tagline: "Shopify 宠物垂类，年 GMV $180k",
    description:
      "Shopify 独立站，宠物垂类。运营 24 个月，年 GMV $180k，毛利 35%。TikTok + Meta 投流，CPC ROI 2.4x。",
    category: "ecommerce",
    askingPriceUSD: 60000,
    currency: "USD",
    mrr: 5250,
    arr: 63000,
    monthlyVisitors: 18000,
    ageMonths: 24,
    techStack: ["Shopify", "TikTok Ads", "Meta Ads", "Klaviyo"],
    reasonToSell: "转做 B 端项目，需要资金。",
    whatsIncluded: [
      "Shopify 店铺转移",
      "供应链 / 物流对接",
      "TikTok + Meta 广告账号",
      "Klaviyo 邮件列表 8,000+",
    ],
    status: "negotiating",
    tier: "featured",
    listedAt: "2026-04-15",
    contactMethod: "邮件子墨撮合",
    gradient: "from-fuchsia-100 to-pink-50",
  },
  {
    slug: "tiktok-ai-faceless",
    name: "TikTok AI 无人账号矩阵",
    emoji: "🎬",
    tagline: "5 个美区 TikTok 账号，总粉 80万",
    description:
      "美区 TikTok AI faceless 账号矩阵，5 个号合计 80万粉丝。月广告分成 + 联盟收入约 $2,500。SOP 完整。",
    category: "content",
    askingPriceUSD: 25000,
    currency: "USD",
    mrr: 2500,
    arr: 30000,
    ageMonths: 11,
    techStack: ["TikTok", "ElevenLabs", "Pictory", "Notion SOP"],
    reasonToSell: "公司转向另一个项目。",
    whatsIncluded: [
      "5 个 TikTok 账号转让",
      "完整 SOP（选题/脚本/制作/发布）",
      "AI 工具账号（ElevenLabs / 即梦）",
      "TikTok 广告账户",
    ],
    status: "active",
    tier: "standard",
    listedAt: "2026-04-22",
    contactMethod: "邮件子墨撮合",
    gradient: "from-violet-100 to-purple-50",
  },
  {
    slug: "ai-prompt-marketplace",
    name: "Prompt 交易平台",
    emoji: "💬",
    tagline: "AI 提示词交易市场，1500 用户",
    description:
      "Prompt 交易平台 SaaS，类似 PromptBase 的中文版。1,500 用户，120 个付费 prompts 上架，月收入 ¥4,000。",
    category: "ai-saas",
    askingPriceUSD: 12000,
    currency: "USD",
    mrr: 600,
    arr: 7200,
    monthlyVisitors: 3200,
    ageMonths: 9,
    techStack: ["Next.js", "Supabase", "微信支付", "Stripe"],
    reasonToSell: "竞品太多，团队转向其他方向。",
    whatsIncluded: [
      "完整代码 + 域名",
      "1,500 用户 + 120 卖家",
      "微信支付 / Stripe 配置",
      "运营 SOP",
    ],
    status: "active",
    tier: "standard",
    listedAt: "2026-04-18",
    contactMethod: "邮件子墨撮合",
    gradient: "from-blue-100 to-sky-50",
  },
  {
    slug: "ai-image-tool",
    name: "Quick AI 头像生成器",
    emoji: "👤",
    tagline: "快速生成专业头像，海外用户",
    description:
      "AI 头像生成 SaaS，单价 $9.99 一次性付费。已运营 6 个月，1,800 付费用户，营收 $18k。",
    category: "tool",
    askingPriceUSD: 22000,
    currency: "USD",
    mrr: 0,
    arr: 0,
    monthlyVisitors: 6500,
    ageMonths: 6,
    techStack: ["Next.js", "Replicate API", "Stripe"],
    reasonToSell: "运营成本高（GPU）想退出。",
    whatsIncluded: [
      "完整代码 + Replicate 配置",
      "1,800 用户邮箱",
      "营销文案 + 广告素材",
      "FB / TikTok 广告账户",
    ],
    status: "active",
    tier: "standard",
    listedAt: "2026-04-10",
    contactMethod: "邮件子墨撮合",
    gradient: "from-yellow-100 to-amber-50",
  },
  {
    slug: "video-ai-agency",
    name: "AI 短视频代运营公司",
    emoji: "🤝",
    tagline: "服务 30 个 B 端客户，月营收 ¥15万",
    description:
      "AI 短视频代运营公司，服务 30 个 B 端客户（餐饮 / 医美 / 教育）。月营收 ¥150k，毛利 50%。3 人团队。",
    category: "agency",
    askingPriceUSD: 80000,
    currency: "USD",
    mrr: 22000,
    arr: 264000,
    ageMonths: 20,
    techStack: ["即梦", "ElevenLabs", "剪映", "微信生态"],
    reasonToSell: "创始人移民，团队解散。",
    whatsIncluded: [
      "30 个客户合同转让",
      "3 人团队签约保留",
      "完整 SOP / 工具栈",
      "供应商资源对接",
    ],
    status: "negotiating",
    tier: "featured",
    listedAt: "2026-04-08",
    contactMethod: "邮件子墨撮合",
    gradient: "from-cyan-100 to-blue-50",
  },
  {
    slug: "claude-prompt-pack",
    name: "Claude 提示词数字产品",
    emoji: "📦",
    tagline: "已售 800 份，Notion 模板",
    description:
      "Claude 编程提示词包 + Notion 模板。Gumroad 上架，售价 $29。已售 800 份，总营收 $23k。",
    category: "tool",
    askingPriceUSD: 5000,
    currency: "USD",
    mrr: 200,
    arr: 2400,
    ageMonths: 5,
    techStack: ["Gumroad", "Notion"],
    reasonToSell: "维护成本不高但精力转向其他。",
    whatsIncluded: [
      "Gumroad 店铺转让",
      "Notion 模板源文件",
      "营销文案 + Twitter 帖子",
      "SEO 关键词数据",
    ],
    status: "active",
    tier: "free",
    listedAt: "2026-04-02",
    contactMethod: "邮件子墨撮合",
    gradient: "from-purple-100 to-violet-50",
  },
];

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function getListingsByCategory(category: string): Listing[] {
  return listings.filter((l) => l.category === category);
}

export const marketplaceStats = {
  totalListings: listings.length,
  totalGMV: listings.reduce((sum, l) => sum + l.askingPriceUSD, 0),
  avgPrice: Math.round(
    listings.reduce((sum, l) => sum + l.askingPriceUSD, 0) / listings.length
  ),
  successfulDeals: 7,
  monthlyAddedListings: 12,
};

// ====== 挂牌套餐 ======
export type ListingPlan = {
  id: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export const listingPlans: ListingPlan[] = [
  {
    id: "free",
    name: "免费挂牌",
    price: "免费",
    desc: "30 天免费挂牌，撮合成功抽佣",
    features: [
      "基础信息上架",
      "邮件撮合中转",
      "撮合成功抽佣 8%",
      "30 天后下架，可续",
    ],
  },
  {
    id: "standard",
    name: "标准挂牌",
    price: "联系评估",
    desc: "60 天 + 周报推荐 + 抽佣降至 5%",
    features: [
      "60 天挂牌期",
      "子墨说AI 周报推荐 1 次",
      "撮合成功抽佣 5%",
      "买家咨询直接 CC 你邮箱",
    ],
    highlight: true,
    badge: "最受欢迎",
  },
  {
    id: "featured",
    name: "Featured 挂牌",
    price: "联系评估",
    desc: "首页置顶 + 视频测评 + 抽佣降至 3%",
    features: [
      "首页 Featured 区永久置顶（90 天）",
      "子墨说AI 视频专题介绍",
      "撮合成功抽佣 3%",
      "1v1 子墨估值咨询",
    ],
  },
];
