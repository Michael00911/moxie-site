// ====== 实时动态流 ======

export type ActivityType =
  | "tool_launch"        // 新工具上架
  | "tool_update"        // 工具更新
  | "weekly_issue"       // 周报发布
  | "video"              // 子墨视频
  | "marketplace_listing"// 新挂牌项目
  | "marketplace_sold"   // 项目成交
  | "compare_published"  // 新对比文章
  | "news"               // 行业新闻
  | "blog";              // 新博客文章

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  desc?: string;
  href: string;
  time: string;       // ISO 时间或人类可读
  emoji?: string;
  badge?: string;
  badgeColor?: string;
};

// Mock 数据 - 真实数据将通过定时任务从飞书 / DB 拉取
export const activityFeed: Activity[] = [
  {
    id: "1",
    type: "tool_launch",
    title: "Fellou 1.5 国产 AI 浏览器更新",
    desc: "新增 Agent 模式 + 浏览器自动操作",
    href: "/tools/fellou",
    time: "5 分钟前",
    emoji: "🆕",
    badge: "新品",
    badgeColor: "bg-emerald-100 text-emerald-900",
  },
  {
    id: "2",
    type: "marketplace_listing",
    title: "AI Resume Tailor 挂牌出售 $28,000",
    desc: "MRR $1,200，运营 14 个月",
    href: "/marketplace/ai-resume-saas",
    time: "12 分钟前",
    emoji: "🏪",
    badge: "挂牌",
    badgeColor: "bg-amber-100 text-amber-900",
  },
  {
    id: "3",
    type: "compare_published",
    title: "新对比上线：Claude vs ChatGPT 终极对决",
    href: "/compare/claude-vs-chatgpt",
    time: "1 小时前",
    emoji: "⚔️",
    badge: "对比",
    badgeColor: "bg-zinc-100 text-zinc-700",
  },
  {
    id: "4",
    type: "weekly_issue",
    title: "子墨周报 Issue #47 已发布",
    desc: "本周新出 12 个 AI 工具，3 个值得收藏",
    href: "/weekly/47",
    time: "3 小时前",
    emoji: "📩",
    badge: "周报",
    badgeColor: "bg-blue-100 text-blue-900",
  },
  {
    id: "5",
    type: "marketplace_sold",
    title: "🎉 Midjourney Daily Newsletter 撮合成功",
    desc: "成交价 $18,000",
    href: "/marketplace",
    time: "6 小时前",
    emoji: "✅",
    badge: "成交",
    badgeColor: "bg-emerald-100 text-emerald-900",
  },
  {
    id: "6",
    type: "video",
    title: "子墨新视频：DeepSeek vs Claude 实测 1000 次",
    href: "https://www.douyin.com/",
    time: "12 小时前",
    emoji: "🎬",
    badge: "视频",
    badgeColor: "bg-rose-100 text-rose-900",
  },
  {
    id: "7",
    type: "tool_launch",
    title: "Manus 通用 Agent 发布 1M token 版本",
    href: "/tools/manus",
    time: "1 天前",
    emoji: "🆕",
    badge: "新品",
    badgeColor: "bg-emerald-100 text-emerald-900",
  },
  {
    id: "8",
    type: "blog",
    title: "深度文章：1 个人怎么用 Claude Code 做 SaaS",
    href: "/blog/vibe-coding-saas-guide",
    time: "1 天前",
    emoji: "📝",
    badge: "文章",
    badgeColor: "bg-purple-100 text-purple-900",
  },
  {
    id: "9",
    type: "news",
    title: "Anthropic 与 SpaceX 签算力大单",
    href: "#",
    time: "1 天前",
    emoji: "📰",
    badge: "新闻",
    badgeColor: "bg-amber-100 text-amber-900",
  },
  {
    id: "10",
    type: "tool_update",
    title: "ElevenLabs V4 中文支持升级",
    desc: "口型同步精度 +30%",
    href: "/tools/elevenlabs",
    time: "2 天前",
    emoji: "🔄",
    badge: "更新",
    badgeColor: "bg-sky-100 text-sky-900",
  },
  {
    id: "11",
    type: "marketplace_listing",
    title: "TikTok AI 无人账号矩阵挂牌 $25,000",
    desc: "5 个美区账号，总粉 80 万",
    href: "/marketplace/tiktok-ai-faceless",
    time: "2 天前",
    emoji: "🏪",
    badge: "挂牌",
    badgeColor: "bg-amber-100 text-amber-900",
  },
  {
    id: "12",
    type: "weekly_issue",
    title: "子墨周报 Issue #46 已发布",
    href: "/weekly/46",
    time: "1 周前",
    emoji: "📩",
    badge: "周报",
    badgeColor: "bg-blue-100 text-blue-900",
  },
];
