// ====== Daily Launch 每日发布系统 ======

export type SlotTier = "free" | "standard" | "gold";

export type LaunchEntry = {
  id: string;
  date: string;          // YYYY-MM-DD
  slot: number;          // 1-5
  tier: SlotTier;
  toolSlug?: string;     // 关联现有 tool
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  url: string;
  maker: string;
  makerUrl?: string;
  votes: number;
  commentCount: number;
  category: string;
  tags: string[];
};

// Mock 数据：本周每天 5 个 launch slot
export const launches: LaunchEntry[] = [
  // 2026-05-07 (今天)
  {
    id: "L20260507-1",
    date: "2026-05-07",
    slot: 1,
    tier: "gold",
    toolSlug: "manus",
    name: "Manus 2.0",
    emoji: "🦋",
    tagline: "通用 AI Agent 重磅升级，1M token + 视觉理解",
    description:
      "Manus 2.0 是 Butterfly Effect 的全新通用 Agent，支持 1M token 上下文、视觉理解和复杂任务规划。",
    url: "https://manus.im",
    maker: "Butterfly Effect",
    makerUrl: "https://manus.im/about",
    votes: 287,
    commentCount: 42,
    category: "agent",
    tags: ["#国产", "#通用Agent", "#Manus2"],
  },
  {
    id: "L20260507-2",
    date: "2026-05-07",
    slot: 2,
    tier: "standard",
    name: "PromptForge",
    emoji: "⚡",
    tagline: "AI 提示词版本管理 + A/B 测试平台",
    description: "为团队设计的 prompt 版本管理工具，支持 git-like 分支、A/B 测试、效果追踪。",
    url: "https://example.com",
    maker: "Anna Chen",
    makerUrl: "#",
    votes: 142,
    commentCount: 18,
    category: "agent",
    tags: ["#Prompt 管理", "#团队协作"],
  },
  {
    id: "L20260507-3",
    date: "2026-05-07",
    slot: 3,
    tier: "standard",
    name: "VoxCast",
    emoji: "🎙️",
    tagline: "用 AI 一键把 PDF / 文章变成播客",
    description: "上传 PDF 或粘贴 URL，AI 30 秒生成 2 人对话式播客（支持中英）。",
    url: "https://example.com",
    maker: "Mark T.",
    makerUrl: "#",
    votes: 96,
    commentCount: 12,
    category: "audio",
    tags: ["#播客", "#文档转语音"],
  },
  {
    id: "L20260507-4",
    date: "2026-05-07",
    slot: 4,
    tier: "free",
    name: "ResumeRanker",
    emoji: "📄",
    tagline: "AI 帮你识别简历里被 ATS 卡掉的关键词",
    description: "粘贴简历 + JD，AI 高亮缺失关键词、推荐改写。免费用。",
    url: "https://example.com",
    maker: "Ravi K.",
    makerUrl: "#",
    votes: 38,
    commentCount: 5,
    category: "writing",
    tags: ["#简历", "#ATS"],
  },
  {
    id: "L20260507-5",
    date: "2026-05-07",
    slot: 5,
    tier: "free",
    name: "GeoMap.AI",
    emoji: "🗺️",
    tagline: "用自然语言生成可交互地图",
    description: "「上海 5 公里内所有咖啡馆」一句话生成可分享的交互地图。",
    url: "https://example.com",
    maker: "李文强",
    makerUrl: "#",
    votes: 25,
    commentCount: 3,
    category: "research",
    tags: ["#地图", "#国产"],
  },

  // 2026-05-06
  {
    id: "L20260506-1",
    date: "2026-05-06",
    slot: 1,
    tier: "gold",
    toolSlug: "fellou",
    name: "Fellou Browser 1.5",
    emoji: "🌐",
    tagline: "国产 AI 浏览器全新 Agent 模式",
    description: "AI 浏览器内置 Agent 直接操作页面：自动登录 / 抓数据 / 填表 / 总结。",
    url: "https://fellou.ai",
    maker: "Fellou AI",
    makerUrl: "#",
    votes: 412,
    commentCount: 67,
    category: "agent",
    tags: ["#AI 浏览器", "#Fellou", "#国产"],
  },
  {
    id: "L20260506-2",
    date: "2026-05-06",
    slot: 2,
    tier: "standard",
    name: "InvoiceAI",
    emoji: "🧾",
    tagline: "AI 发票自动识别 + 入账",
    description: "拍照 / 上传发票，AI 自动识别金额 / 税号 / 类目并入账到飞书 / Notion。",
    url: "https://example.com",
    maker: "张敏",
    makerUrl: "#",
    votes: 156,
    commentCount: 21,
    category: "productivity",
    tags: ["#财务", "#OCR"],
  },
  {
    id: "L20260506-3",
    date: "2026-05-06",
    slot: 3,
    tier: "free",
    name: "HabitMate",
    emoji: "✅",
    tagline: "AI 习惯教练，每天 5 分钟语音 check-in",
    description: "用语音对 AI 描述今天习惯执行情况，AI 分析、鼓励、调整方案。",
    url: "https://example.com",
    maker: "Sarah L.",
    makerUrl: "#",
    votes: 89,
    commentCount: 11,
    category: "productivity",
    tags: ["#习惯", "#健康"],
  },
  {
    id: "L20260506-4",
    date: "2026-05-06",
    slot: 4,
    tier: "free",
    name: "DiagramGPT",
    emoji: "📊",
    tagline: "用自然语言画流程图 / 架构图",
    description: "「画一个用户登录流程」一句话出图，可导出 PNG / SVG / Mermaid 代码。",
    url: "https://example.com",
    maker: "Tom Wang",
    makerUrl: "#",
    votes: 67,
    commentCount: 8,
    category: "productivity",
    tags: ["#流程图", "#可视化"],
  },
  {
    id: "L20260506-5",
    date: "2026-05-06",
    slot: 5,
    tier: "free",
    name: "Linkly",
    emoji: "🔗",
    tagline: "AI 生成 SEO 友好的短链 + UTM",
    description: "粘贴长链接，AI 自动生成 SEO 友好短链 + UTM 参数 + 落地页 A/B 测试。",
    url: "https://example.com",
    maker: "Mia P.",
    makerUrl: "#",
    votes: 34,
    commentCount: 4,
    category: "marketing",
    tags: ["#SEO", "#营销"],
  },

  // 2026-05-05
  {
    id: "L20260505-1",
    date: "2026-05-05",
    slot: 1,
    tier: "gold",
    toolSlug: "11labs-music",
    name: "Suno V4 中文歌词",
    emoji: "🎵",
    tagline: "Suno V4 升级中文歌词，押韵更自然",
    description: "Suno V4 中文版上线，针对汉语押韵 / 平仄优化，国风 / 嘻哈 / 流行都能写。",
    url: "https://suno.com",
    maker: "Suno AI",
    makerUrl: "#",
    votes: 521,
    commentCount: 89,
    category: "audio",
    tags: ["#AI 音乐", "#中文歌词"],
  },
  {
    id: "L20260505-2",
    date: "2026-05-05",
    slot: 2,
    tier: "standard",
    name: "DocFlow",
    emoji: "📁",
    tagline: "AI 把零散 Word / PDF 整理成知识库",
    description: "上传一堆杂乱文档，AI 自动归类、生成目录、构建可搜索知识库。",
    url: "https://example.com",
    maker: "刘宇",
    makerUrl: "#",
    votes: 178,
    commentCount: 25,
    category: "productivity",
    tags: ["#知识库", "#RAG"],
  },
  {
    id: "L20260505-3",
    date: "2026-05-05",
    slot: 3,
    tier: "standard",
    name: "ColdMail Pro",
    emoji: "📧",
    tagline: "AI 写出真不像 AI 的冷邮件",
    description: "粘贴目标公司 LinkedIn URL，AI 写一封个性化、有 hook 的冷邮件。",
    url: "https://example.com",
    maker: "Daniel K.",
    makerUrl: "#",
    votes: 134,
    commentCount: 19,
    category: "marketing",
    tags: ["#外贸", "#冷邮件"],
  },
  {
    id: "L20260505-4",
    date: "2026-05-05",
    slot: 4,
    tier: "free",
    name: "PlaylistAI",
    emoji: "🎧",
    tagline: "AI 根据心情 + 场景生成 Spotify 歌单",
    description: "「下雨天写代码」自动生成歌单到 Spotify / Apple Music。",
    url: "https://example.com",
    maker: "Ben R.",
    makerUrl: "#",
    votes: 76,
    commentCount: 9,
    category: "audio",
    tags: ["#音乐", "#Spotify"],
  },
  {
    id: "L20260505-5",
    date: "2026-05-05",
    slot: 5,
    tier: "free",
    name: "ScreenStudy",
    emoji: "📚",
    tagline: "屏幕录制时 AI 实时整理笔记",
    description: "看视频 / 网课时启动，AI 实时识别画面 + 转录音频，自动出 Markdown 笔记。",
    url: "https://example.com",
    maker: "Lily W.",
    makerUrl: "#",
    votes: 41,
    commentCount: 6,
    category: "productivity",
    tags: ["#学习", "#笔记"],
  },
];

// 即将上线（预告）
export const upcomingLaunches = [
  { date: "2026-05-08", count: 5, gold: "ZeroDB AI", goldTagline: "AI 自动出 SQL 的数据库管理工具" },
  { date: "2026-05-09", count: 3, gold: "FineTune Cloud", goldTagline: "一键微调开源模型托管平台" },
  { date: "2026-05-10", count: 5, gold: "VocalBot", goldTagline: "实时语音对话 AI 助手（中文优先）" },
  { date: "2026-05-11", count: 4 },
  { date: "2026-05-12", count: 5 },
];

export type LaunchPlan = {
  id: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export const launchPlans: LaunchPlan[] = [
  {
    id: "free",
    name: "免费 Slot",
    price: "免费",
    desc: "排队一周 - 一个月不等",
    features: [
      "工具卡基础展示",
      "随机分配上线日（周一到周日）",
      "Slot 4-5 位（页面下半区）",
      "开放评论 + 投票",
      "审核期 5-7 天",
    ],
  },
  {
    id: "standard",
    name: "标准 Slot",
    price: "联系评估",
    desc: "1 周内安排，工作日上线",
    features: [
      "工具卡精装展示（含 maker 头像）",
      "1 周内必上线，工作日优先",
      "Slot 2-3 位（页面中间）",
      "周报 newsletter 提及",
      "首页 24 小时活动流推送",
    ],
    highlight: true,
    badge: "性价比之选",
  },
  {
    id: "gold",
    name: "Gold Slot",
    price: "联系评估",
    desc: "指定日期 + Slot 1 位（头条）",
    features: [
      "首页 Featured 卡（gradient 大卡）",
      "你指定的日期上线",
      "Slot 1（页面顶部头条）",
      "子墨说AI 抖音 / 小红书短视频测评",
      "公众号 / 周报 专题推荐",
      "永久存档页保留 SEO 反链",
    ],
  },
];

export function getLaunchesByDate(date: string): LaunchEntry[] {
  return launches.filter((l) => l.date === date).sort((a, b) => a.slot - b.slot);
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getLatestLaunchDate(): string {
  return launches[0]?.date ?? getTodayDate();
}

export const allLaunchDates = Array.from(
  new Set(launches.map((l) => l.date))
).sort((a, b) => b.localeCompare(a));
