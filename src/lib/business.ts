// ====== Persona / 客户分流（全 B2B）======
export type Persona = {
  key: "tool" | "smb" | "enterprise";
  emoji: string;
  audience: string;
  pain: string;
  outcome: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  color: "blue" | "emerald" | "amber";
};

export const personas: Persona[] = [
  {
    key: "tool",
    emoji: "🚀",
    audience: "AI 工具 / SaaS 公司",
    pain: "产品做出来了，但内容没人写、SEO 没人做、视频没人拍、用户不知道你",
    outcome: "把内容 / SEO / 视频测评 / 出海推广交给我们，按月计费，1 周看到效果",
    primaryCta: { label: "查看营销代运营", href: "/services#growth" },
    secondaryCta: { label: "看品牌客户案例", href: "/cases" },
    color: "amber",
  },
  {
    key: "smb",
    emoji: "🏗️",
    audience: "中小企业 · AI 转型",
    pain: "知道 AI 重要，但内部团队没经验，自己摸索 6 个月还是 PPT",
    outcome: "4-12 周交付能跑的 AI Agent / 工作流，团队能用、KPI 能看",
    primaryCta: { label: "AI 落地咨询+实施", href: "/services#buildout" },
    secondaryCta: { label: "看落地案例", href: "/cases" },
    color: "emerald",
  },
  {
    key: "enterprise",
    emoji: "🏛️",
    audience: "大型企业 · AI 工作流托管",
    pain: "AI 工具买了一堆，没专人运营，效果不稳定，ROI 算不清",
    outcome: "我们替你跑完整 AI 工作流，按结果付费，比内部团队便宜 30%",
    primaryCta: { label: "服务即软件方案", href: "/services#managed" },
    secondaryCta: { label: "看大客户案例", href: "/cases" },
    color: "blue",
  },
];

// ====== 服务套餐（全 B2B）======
export type ServicePlan = {
  id: string;
  category: "tool" | "smb" | "enterprise";
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
};

export const servicePlans: ServicePlan[] = [
  // ========== AI 工具方营销代运营 ==========
  {
    id: "growth-content",
    category: "tool",
    name: "内容代运营",
    price: "联系评估",
    desc: "你做产品，我们做内容。SEO 文章 + 公众号 + 知乎 + 小红书全网铺",
    features: [
      "每月 20-40 篇 SEO 长尾文章",
      "公众号 / 知乎 / 小红书 / B 站矩阵分发",
      "AI Agent + 编辑组合产出",
      "内容数据看板（曝光 / 点击 / 转化）",
      "首月不满意全额退款",
    ],
    cta: "预约对接",
    href: "/services#growth-content",
    badge: "适合 0-1 期",
  },
  {
    id: "growth-video",
    category: "tool",
    name: "视频测评 + KOL 投放",
    price: "联系评估",
    desc: "子墨说AI 自有矩阵 + 外部 KOL 网络，按效果付费",
    features: [
      "子墨说AI 抖音 / 小红书测评（10 万+ 粉丝）",
      "外部精选 KOL 矩阵投放（科技 / AI / 出海）",
      "脚本 / 拍摄 / 剪辑全包",
      "GMV 分成可选模式（基础月费 + 转化分成）",
      "出海版本（TikTok / X / YouTube）按需加量",
    ],
    cta: "查看流量数据",
    href: "/submit",
    highlight: true,
    badge: "ROI 最高",
  },
  {
    id: "growth-fullstack",
    category: "tool",
    name: "全案代运营",
    price: "联系评估",
    desc: "把营销当 CMO 外包给我们，我们对增长 KPI 负责",
    features: [
      "内容 + 视频 + KOL + 投放 + 私域全包",
      "驻场 PM 1 名 + 内容组 3-5 人",
      "对 MAU / 付费用户 / GMV 等北极星指标负责",
      "周报 / 月报 / 季度复盘",
      "GMV 分成模式（封顶 + 阶梯）",
    ],
    cta: "对话商务",
    href: "/services#growth-fullstack",
    badge: "CMO 替代",
  },
  {
    id: "growth-overseas",
    category: "tool",
    name: "出海代运营",
    price: "联系评估",
    desc: "国内 AI 工具出海全包：TikTok / X / Reddit / Product Hunt",
    features: [
      "海外品牌名 / 域名 / 落地页定制",
      "TikTok / X / Reddit 内容矩阵搭建",
      "Product Hunt 上线代办",
      "Stripe / LemonSqueezy 收款配置",
      "前 3 个月 KPI：1k 海外注册 + 100 付费用户",
    ],
    cta: "出海方案",
    href: "/services#growth-overseas",
    badge: "新业务",
  },

  // ========== 中小企业 AI 落地 ==========
  {
    id: "audit",
    category: "smb",
    name: "AI 落地诊断",
    price: "联系评估",
    desc: "2 周输出企业 AI 转型路径图（可作为后续落地基础）",
    features: [
      "高管 / 业务部门访谈",
      "业务流程梳理 + AI 介入点识别",
      "AI 落地优先级矩阵（ROI × 难度）",
      "工具 / 供应商选型清单",
      "12 个月落地排期 + 预算",
    ],
    cta: "预约诊断",
    href: "/services#audit",
  },
  {
    id: "buildout",
    category: "smb",
    name: "AI Agent 落地实施",
    price: "联系评估",
    desc: "把方案真的跑起来 — 客服 / 销售线索 / 内容 / 数据处理",
    features: [
      "Agent / 工作流设计 + 全栈开发",
      "对接 CRM / ERP / OA / 微信生态",
      "RAG 知识库搭建",
      "数据安全 + 合规审查",
      "上线 + 切流 + 90 天 SLA",
    ],
    cta: "对话商务",
    href: "/services#buildout",
    highlight: true,
    badge: "最受欢迎",
  },
  {
    id: "vertical-restaurant",
    category: "smb",
    name: "餐饮 AI 解决方案",
    price: "联系评估",
    desc: "针对连锁餐饮 / 网吧 / 美业的标准化 AI 落地包",
    features: [
      "AI 店长（线上接单 + 排班 + 库存）",
      "微信社群 AI 客服",
      "外卖评价管理 + 自动回复",
      "数据看板（GMV / 客单 / 复购）",
      "30 天交付 + 12 个月维护",
    ],
    cta: "查看方案",
    href: "/services#vertical-restaurant",
    badge: "行业包",
  },
  {
    id: "vertical-ecom",
    category: "smb",
    name: "跨境电商 AI 包",
    price: "联系评估",
    desc: "Shopify / TikTok 电商的 AI 选品 + 素材 + 客服全套",
    features: [
      "AI 选品 + 趋势预测",
      "AI 素材工厂（图 / 短视频 / 落地页）",
      "TikTok / Meta 投放素材自动产出",
      "海外多语言 AI 客服",
      "30 天交付 + 持续素材产出",
    ],
    cta: "查看方案",
    href: "/services#vertical-ecom",
    badge: "行业包",
  },

  // ========== 大企业 AI 工作流托管 ==========
  {
    id: "managed-content",
    category: "enterprise",
    name: "AI 内容生产托管",
    price: "联系评估",
    desc: "替企业产出全部 SEO / 公众号 / 短视频内容，按产量计费",
    features: [
      "适合：电商 / SaaS / 教育 / 金融",
      "每月 50-200 篇文章 + 50-100 条短视频",
      "我们承担：工具成本 / 模型 token / 运维",
      "按产出量阶梯计费",
      "替代传统外包团队 30-50% 成本",
    ],
    cta: "对话商务",
    href: "/services#managed-content",
  },
  {
    id: "managed-cs",
    category: "enterprise",
    name: "AI 客服 / 销售线索托管",
    price: "联系评估",
    desc: "全权运营 AI 客服 + 销售线索资格筛选，按成交付费",
    features: [
      "替企业接管全部 L1 / L2 工单",
      "70% 工单 AI 一次性解决",
      "复杂工单转接人工",
      "按成功解决工单数 / Lead 数计费",
      "包工具 / 包 token / 包人力",
    ],
    cta: "对话商务",
    href: "/services#managed-cs",
    highlight: true,
    badge: "服务即软件",
  },
  {
    id: "managed-data",
    category: "enterprise",
    name: "AI 数据处理托管",
    price: "联系评估",
    desc: "把企业内部需要 AI 处理的数据流外包给我们",
    features: [
      "适用：财报分析 / 合同审阅 / 简历筛选 / 文档归档",
      "我们设计 + 部署 + 运维全套",
      "按月度处理量计费",
      "私有化部署可选（金融 / 央企）",
      "数据合规 + 审计可追溯",
    ],
    cta: "对话商务",
    href: "/services#managed-data",
  },
];

// ====== AI 出海机会（保留作为内容资产，吸引流量）======
export type Opportunity = {
  slug: string;
  title: string;
  hook: string;
  difficulty: "新手" | "进阶" | "高阶";
  capital: "0 成本" | "<¥5k" | "<¥30k" | "¥30k+";
  earnRange: string;
  timeline: string;
  tags: string[];
  recommended?: boolean;
};

export const opportunities: Opportunity[] = [
  {
    slug: "ai-tool-affiliate",
    title: "海外 AI 工具 Affiliate",
    hook: "做内容 + 推工具，分成 30-50%。零库存零客服。",
    difficulty: "新手",
    capital: "0 成本",
    earnRange: "$500-5000 / 月",
    timeline: "3 个月起步",
    tags: ["内容创作", "Affiliate", "TikTok"],
    recommended: true,
  },
  {
    slug: "tiktok-ai-faceless",
    title: "TikTok AI 无人直播 / 无脸账号",
    hook: "用 AI 配音 + AI 视频生成做美区账号，复制即可起量。",
    difficulty: "新手",
    capital: "<¥5k",
    earnRange: "$1k-10k / 月",
    timeline: "6 周",
    tags: ["TikTok", "AI 视频", "美区"],
  },
  {
    slug: "ai-saas-china-agent",
    title: "海外 AI SaaS 中国代理",
    hook: "拿到工具中国独家代理 + 提供本地客服 / 充值。",
    difficulty: "进阶",
    capital: "<¥30k",
    earnRange: "¥10k-100k / 月",
    timeline: "3-6 个月",
    tags: ["代理", "B 端", "支付"],
  },
  {
    slug: "ai-newsletter",
    title: "垂直 AI Newsletter（英文）",
    hook: "Beehiiv / Substack 写英文 AI 周报，付费订阅 + 赞助。",
    difficulty: "进阶",
    capital: "0 成本",
    earnRange: "$300-8000 / 月",
    timeline: "12 个月",
    tags: ["Newsletter", "英文", "长期"],
  },
  {
    slug: "ai-tool-china-clone",
    title: "海外 AI 工具中文版克隆",
    hook: "找一个英文 AI 工具，做一个中文 SEO 优化的镜像。",
    difficulty: "进阶",
    capital: "<¥5k",
    earnRange: "¥5k-50k / 月",
    timeline: "2-4 个月",
    tags: ["SEO", "克隆", "中文"],
    recommended: true,
  },
  {
    slug: "ai-developer-freelance",
    title: "Vibe Coding 接外包",
    hook: "用 Claude Code / Cursor 做海外 AI 项目外包。",
    difficulty: "进阶",
    capital: "0 成本",
    earnRange: "$3k-30k / 项目",
    timeline: "立刻可做",
    tags: ["开发", "外包", "Upwork"],
  },
  {
    slug: "ai-cross-border",
    title: "AI 跨境选品 / 独立站",
    hook: "用 AI 找品 + 做素材 + 投流，Shopify 独立站起量。",
    difficulty: "高阶",
    capital: "¥30k+",
    earnRange: "¥30k-500k / 月",
    timeline: "6-12 个月",
    tags: ["电商", "Shopify", "投流"],
  },
  {
    slug: "ai-ltd-arbitrage",
    title: "AI 工具 LTD 套利",
    hook: "AppSumo 上买终身版，国内做代理 / 转售。",
    difficulty: "新手",
    capital: "<¥5k",
    earnRange: "¥3k-30k / 月",
    timeline: "立刻可做",
    tags: ["套利", "AppSumo", "代理"],
  },
];

// ====== 自研项目（公司组合产品展示）======
export type Project = {
  slug: string;
  name: string;
  status: "已上线" | "建设中" | "已开源";
  tagline: string;
  story: string;
  stack: string[];
  metrics?: { label: string; value: string }[];
  url?: string;
  caseStudyUrl?: string;
  emoji: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    slug: "claimly",
    name: "Claimly",
    status: "已上线",
    tagline: "航班延误自动索赔 SaaS（海外市场）",
    story:
      "公司孵化的海外 SaaS。覆盖欧盟 EC261 法规，跑通了全自动化索赔工作流。证明我们能做 0-1 的自有产品。",
    stack: ["Next.js", "Supabase", "Stripe", "Claude API", "Resend"],
    metrics: [
      { label: "用户", value: "1,200+" },
      { label: "月活跃", value: "$8.5k" },
      { label: "团队", value: "2 人" },
    ],
    url: "https://claimly.io",
    emoji: "✈️",
    gradient: "from-sky-100 to-blue-50",
  },
  {
    slug: "moii",
    name: "MOII / 8圈机器人",
    status: "已上线",
    tagline: "面向网吧 / 餐饮的 AI 店长系统",
    story:
      "B2B SaaS + 硬件机器人组合方案。已对接掌上 8 圈，覆盖全国 1000+ 网吧。",
    stack: ["Python", "OpenAI", "RAG", "硬件嵌入式"],
    metrics: [
      { label: "覆盖店", value: "1,000+" },
      { label: "替代店长", value: "50%" },
    ],
    emoji: "🎮",
    gradient: "from-emerald-100 to-teal-50",
  },
  {
    slug: "zimo-tools-site",
    name: "子墨说AI 工具站",
    status: "已上线",
    tagline: "你正在看的这个网站 — 媒体 + 商业化入口",
    story:
      "公司媒体业务的承接站。每天承接子墨说AI 自媒体矩阵流量，带来 B 端客户线索。",
    stack: ["Next.js 16", "Tailwind v4", "飞书 OpenAPI", "Vercel"],
    metrics: [
      { label: "周 UV", value: "12,000+" },
      { label: "月线索", value: "30+" },
    ],
    url: "/",
    emoji: "📒",
    gradient: "from-amber-100 to-orange-50",
  },
  {
    slug: "xiaolaai",
    name: "小拉AI",
    status: "已上线",
    tagline: "B 端短视频广告 Autopilot 平台",
    story:
      "公司在 B 端代运营业务的产品化封装。卖成品视频 + AI 数字人，替代 MCN 模式。",
    stack: ["Next.js", "Stripe", "AI 视频管线"],
    metrics: [
      { label: "成本下降", value: "70%" },
      { label: "客户", value: "20+" },
    ],
    emoji: "🎥",
    gradient: "from-purple-100 to-fuchsia-50",
  },
];

// ====== 客户案例（全 B2B）======
export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  challenge: string;
  outcome: string;
  metric: string;
  duration: string;
  type: "tool" | "smb" | "enterprise";
  testimonial?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "case-tool-launch",
    client: "某海外 AI 视频 SaaS",
    industry: "AI 工具",
    challenge: "想进入中国市场但没渠道，自然流量起不来",
    outcome: "Featured 赞助 + 子墨视频测评带来首批 2k 注册",
    metric: "2,300 注册 / ¥1.99 单 CAC",
    duration: "1 个月",
    type: "tool",
    testimonial: "ROI 是其他 KOL 投放的 4 倍",
  },
  {
    slug: "case-tool-cmo",
    client: "某国产 AI 协作 SaaS",
    industry: "AI 工具",
    challenge: "产品做了 1 年没增长，团队没有市场人才",
    outcome: "全案代运营 6 个月，月活从 5k 到 50k",
    metric: "MAU × 10",
    duration: "6 个月",
    type: "tool",
    testimonial: "我们等于多了一个 CMO + 5 人的内容团队，按月付费",
  },
  {
    slug: "case-furniture-brand",
    client: "某家具出海品牌",
    industry: "跨境电商",
    challenge: "FB 投放成本翻倍，急需用 AI 把素材成本砍半",
    outcome: "搭建 AI 素材工厂，每周产出 200 条素材",
    metric: "素材成本下降 73%",
    duration: "4 周",
    type: "smb",
    testimonial: "原来 1 条素材 800 块，现在 1 条 50 块还更好",
  },
  {
    slug: "case-china-agent",
    client: "某海外 AI Agent",
    industry: "B 端 SaaS",
    challenge: "海外做完了，想找中国独家代理",
    outcome: "通过子墨网络对接到 3 家有兴趣的代理商",
    metric: "签下 1 家年度独家代理",
    duration: "3 周",
    type: "tool",
  },
  {
    slug: "case-internal-agent",
    client: "某 SaaS 国内厂商",
    industry: "B 端 SaaS",
    challenge: "客户支持团队 30 人，工单积压严重",
    outcome: "AI 客服托管接管全部 L1 工单",
    metric: "客服成本降 45%",
    duration: "12 周交付 + 长期托管",
    type: "enterprise",
    testimonial: "比想象中容易，比想象中省钱",
  },
  {
    slug: "case-restaurant-chain",
    client: "某连锁餐饮品牌",
    industry: "餐饮",
    challenge: "30 家门店，外卖差评回复跟不上，店长招不到",
    outcome: "上线 AI 店长系统，外卖运营 + 评价管理全自动",
    metric: "外卖评分 4.6 → 4.9 / 节省人力 50%",
    duration: "8 周",
    type: "smb",
    testimonial: "省下来的钱够开 2 家新店",
  },
];

// ====== 行业解决方案（B2B 标准化包）======
export type Solution = {
  slug: string;
  industry: string;
  emoji: string;
  audience: string;
  pain: string;
  modules: string[];
  pricing: string;
  duration: string;
  recommended?: boolean;
};

export const solutions: Solution[] = [
  {
    slug: "ai-tool",
    industry: "AI 工具 / SaaS",
    emoji: "🚀",
    audience: "AI SaaS 公司 / 独立开发者团队",
    pain: "产品做出来了没流量，营销没人做",
    modules: ["内容代运营", "视频测评", "出海全包", "Product Hunt 上线"],
    pricing: "¥30,000 / 月起",
    duration: "月度合作",
    recommended: true,
  },
  {
    slug: "restaurant",
    industry: "餐饮 / 网吧 / 美业",
    emoji: "🍜",
    audience: "连锁门店 / 加盟体系",
    pain: "店长招不到，客服跟不上，标准化难",
    modules: ["AI 店长系统", "AI 客服", "外卖评价管理", "门店数据看板"],
    pricing: "¥80,000 起",
    duration: "8 周交付",
  },
  {
    slug: "ecom",
    industry: "跨境电商",
    emoji: "🛍️",
    audience: "Shopify / 独立站 / 出海品牌",
    pain: "素材成本高，多语言客服难，选品靠运气",
    modules: ["AI 素材工厂", "AI 选品", "多语言客服", "投放素材自动化"],
    pricing: "¥120,000 起",
    duration: "6 周交付",
    recommended: true,
  },
  {
    slug: "education",
    industry: "教育 / 培训",
    emoji: "📚",
    audience: "K12 / 职教 / 企培",
    pain: "答疑老师贵，课程内容产出慢，学员粘性低",
    modules: ["AI 答疑老师", "课件自动生成", "学员陪伴 Agent", "数据驱动招生"],
    pricing: "¥100,000 起",
    duration: "10 周交付",
  },
  {
    slug: "finance",
    industry: "金融 / 财税",
    emoji: "💼",
    audience: "投资机构 / 财税 / 律所",
    pain: "财报 / 合同 / 法律文档审阅人力贵",
    modules: ["合同审阅 Agent", "财报分析", "法律检索 RAG", "私有化部署"],
    pricing: "¥200,000 起",
    duration: "12 周交付",
  },
  {
    slug: "manufacturing",
    industry: "制造业 / 工厂",
    emoji: "🏭",
    audience: "传统制造 / B 端代工",
    pain: "海外询盘多语言响应慢，技术文档管理乱",
    modules: ["多语言询盘 AI", "技术文档 RAG", "供应商管理 Agent", "海外销售线索"],
    pricing: "¥150,000 起",
    duration: "10 周交付",
  },
];

// ====== 团队 ======
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  emoji: string;
};

export const team: TeamMember[] = [
  {
    name: "肖仕华",
    role: "创始人 · 8圈机器人 / 子墨说AI",
    bio: "8 年 SaaS 产品 + AI 落地经验。早期在 SaaS 大厂做产品，2024 年开始 All in AI Autopilot 服务赛道。",
    emoji: "🧑‍💼",
  },
  {
    name: "技术团队",
    role: "全栈工程师 × 5",
    bio: "Claude Code / Cursor 重度使用者。一支 5 人团队的产出 = 传统 30 人团队。",
    emoji: "💻",
  },
  {
    name: "运营 / 内容团队",
    role: "增长 + 内容 × 6",
    bio: "前抖音 / 小红书运营操盘手。负责子墨说AI 自媒体矩阵 + 客户内容代运营。",
    emoji: "✍️",
  },
  {
    name: "商务 / 客户成功",
    role: "B2B 商务 × 3",
    bio: "对接 SaaS / 餐饮 / 跨境电商客户。从签约到落地 SLA 全流程负责。",
    emoji: "🤝",
  },
];

// ====== 学习路径（保留作为内容资产）======
export type LearnTrack = {
  slug: string;
  level: 1 | 2 | 3 | 4;
  name: string;
  desc: string;
  duration: string;
  modules: string[];
  cta: { label: string; href: string };
  outcome: string;
  emoji: string;
};

export const learnTracks: LearnTrack[] = [
  {
    slug: "L0",
    level: 1,
    name: "0 → 1：先会用",
    desc: "选 1 个 AI 工具开始用，每天省 1 小时",
    duration: "1 周自学",
    modules: ["5 个最值得用的 AI 工具", "Claude / ChatGPT 提问 7 个套路", "把 AI 嵌进日常工作流"],
    outcome: "每天省 1 小时",
    cta: { label: "免费阅读", href: "/learn/L0" },
    emoji: "🔰",
  },
  {
    slug: "L1",
    level: 2,
    name: "1 → 10：建立工作流",
    desc: "从单点工具升级到自己的 AI 工作流",
    duration: "1 个月自学",
    modules: ["AI 工作流的 4 种范式", "n8n / Make 自动化", "搭建你的第一个 AI Agent", "私人 RAG 知识库"],
    outcome: "效率比同事高 3 倍",
    cta: { label: "免费阅读", href: "/learn/L1" },
    emoji: "⚙️",
  },
  {
    slug: "L2",
    level: 3,
    name: "10 → 100：让 AI 替你赚钱",
    desc: "从用 AI 到 让 AI 跑生意",
    duration: "团队级",
    modules: ["AI 出海赛道选型", "AI 内容工厂搭建", "Affiliate 分销系统", "数据驱动的迭代"],
    outcome: "月均 $5k-50k",
    cta: { label: "查看案例", href: "/cases" },
    emoji: "🌏",
  },
  {
    slug: "L3",
    level: 4,
    name: "100 → 1000：AI 服务公司",
    desc: "把内部 AI 工作流标准化对外服务，做下一代 Autopilot 公司",
    duration: "公司级",
    modules: ["服务即软件商业模式", "AI 工作流标准化", "数据飞轮 + 客户复购", "团队 AI 化"],
    outcome: "ARR 千万级",
    cta: { label: "对话子墨说AI", href: "/services" },
    emoji: "🚀",
  },
];

// ====== 站点全局数据 ======
export const siteStats = {
  totalFollowers: "10.2万",
  newsletterSubs: "2,300+",
  weeklyUV: "12,000+",
  ctr: "3.2%",
  productSold: "1,200+",
  enterpriseClients: "12+",
  monthlyLeads: "30+",
  arr: "¥600 万",
};
