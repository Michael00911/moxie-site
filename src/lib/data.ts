import type { Category, Tool } from "./types";

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

export const categories: Category[] = [
  { slug: "writing", name: "写作助手", emoji: "✍️", description: "写文案、写文章、写脚本" },
  { slug: "video", name: "视频制作", emoji: "🎬", description: "AI 生成视频、剪辑、配音" },
  { slug: "image", name: "图像生成", emoji: "🎨", description: "文生图、图生图、修图" },
  { slug: "coding", name: "编程开发", emoji: "💻", description: "AI 写代码、调试、文档" },
  { slug: "marketing", name: "营销增长", emoji: "📈", description: "广告、SEO、私域、社媒" },
  { slug: "audio", name: "音频语音", emoji: "🎙️", description: "TTS、语音克隆、音乐生成" },
  { slug: "agent", name: "AI Agent", emoji: "🤖", description: "自动化助手、工作流、Copilot" },
  { slug: "research", name: "研究分析", emoji: "🔍", description: "搜索、调研、数据分析" },
  { slug: "productivity", name: "效率工具", emoji: "⚡", description: "笔记、日程、协作、自动化" },
];

export const tools: Tool[] = [
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
  },
];

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

// ====== 子墨说AI 本周视频测评 ======
export type VideoReview = {
  toolSlug: string;
  videoTitle: string;
  videoUrl: string;
  platform: "douyin" | "xhs" | "video" | "youtube";
  views: string;        // "12.3w" / "85k"
  postedAt: string;     // 相对时间 / 日期
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
  douyin: { label: "抖音", color: "bg-zinc-900 text-white" },
  xhs: { label: "小红书", color: "bg-rose-500 text-white" },
  video: { label: "视频号", color: "bg-emerald-500 text-white" },
  youtube: { label: "YouTube", color: "bg-red-500 text-white" },
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
  { title: "罗氏 10.5 亿美金收购 AI 诊断公司 PathAI", url: "#", source: "Bloomberg", date: "2026-05-06" },
  { title: "AI 数据中心需求暴涨，全球半导体供应紧张", url: "#", source: "FT", date: "2026-05-05" },
  { title: "Google Chrome 148 上线 AI 自动填充 + Prompt API", url: "#", source: "Google Blog", date: "2026-05-05" },
  { title: "Anthropic Claude Mythos 预览版展示自主漏洞利用能力", url: "#", source: "Anthropic", date: "2026-05-04" },
  { title: "英伟达与康宁合作，共同打造 AI 数据中心基础设施", url: "#", source: "NVIDIA", date: "2026-05-03" },
  { title: "Google 推出 Gemma 4 MTP Drafters，推理速度提升 3 倍", url: "#", source: "DeepMind", date: "2026-05-02" },
  { title: "Anthropic 与 SpaceX Colossus 1 集群签算力大单", url: "#", source: "The Information", date: "2026-05-01" },
  { title: "小米发布 OmniVoice：支持 600+ 语言的开源 TTS 模型", url: "#", source: "GitHub", date: "2026-04-30" },
  { title: "OpenAI 联合科技巨头推出 MRC 协议，优化 AI 集群", url: "#", source: "OpenAI", date: "2026-04-29" },
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

// ====== 编辑精选合集 ======
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

// ====== 月度榜单 ======
export type RankItem = {
  rank: number;
  toolSlug: string;
  delta: number; // 排名变化
  hot?: boolean;
};

export const monthlyTop10: RankItem[] = [
  { rank: 1, toolSlug: "claude-code", delta: 0, hot: true },
  { rank: 2, toolSlug: "dreamina", delta: 1, hot: true },
  { rank: 3, toolSlug: "cursor", delta: -1 },
  { rank: 4, toolSlug: "deepseek", delta: 2, hot: true },
  { rank: 5, toolSlug: "elevenlabs", delta: 0 },
  { rank: 6, toolSlug: "perplexity", delta: -2 },
  { rank: 7, toolSlug: "manus", delta: 5, hot: true },
  { rank: 8, toolSlug: "lovable", delta: 1 },
  { rank: 9, toolSlug: "midjourney", delta: -3 },
  { rank: 10, toolSlug: "kimi", delta: 0 },
];

// ====== 上架时间线 / 新品速递 ======
export type Launch = {
  date: string;
  toolSlug: string;
  highlight?: string;
};

export const recentLaunches: Launch[] = [
  { date: "2026-05-06", toolSlug: "fellou", highlight: "国产 AI 浏览器" },
  { date: "2026-05-04", toolSlug: "manus", highlight: "通用 Agent" },
  { date: "2026-05-02", toolSlug: "11labs-music" },
  { date: "2026-04-30", toolSlug: "qwen" },
  { date: "2026-04-28", toolSlug: "tldraw" },
  { date: "2026-04-25", toolSlug: "lovable", highlight: "全栈生成" },
  { date: "2026-04-22", toolSlug: "gamma" },
  { date: "2026-04-20", toolSlug: "mermaid-chart" },
];

// ====== AI 周报往期 ======
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

export function getToolsByLevel(level: "L1" | "L2" | "L3" | "L4"): Tool[] {
  return tools.filter((t) => t.level === level);
}

export function getTrendingTools(limit = 12): Tool[] {
  return tools
    .filter((t) => t.level !== "L4")
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}
