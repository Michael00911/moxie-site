// ====== 行业分类（创业者来对标）======

export type Benchmark = {
  name: string;
  emoji: string;
  oneliner: string;
  metric: string;
  founded?: string;
  team?: string;
  trafficSource?: string;
  url?: string;
};

export type Industry = {
  slug: string;
  name: string;
  emoji: string;
  audience: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  benchmarks: Benchmark[];
  pitfalls: string[];
  winningPrinciples: string[];
  moxieService?: { name: string; price: string; href: string; desc: string };
  faq: { q: string; a: string }[];
  gradient: string;
};

export const industries: Industry[] = [
  {
    slug: "ecom",
    name: "跨境电商",
    emoji: "🛍️",
    audience: "Shopify / TikTok 电商 / 独立站卖家",
    description: "跨境电商赛道用 AI 降本增效的对标 + 工具组合",
    metaTitle: "跨境电商 AI 工具 + 对标项目 — Moxie 行业页",
    metaDesc: "跨境电商创业者必看：成功对标项目、AI 素材工厂、AI 选品、多语言客服一站式参考。",
    intro:
      "跨境电商的本质是「素材+流量+选品」三件事。AI 让这三件事的边际成本降到接近 0：素材从 ¥800/条降到 ¥10/条，多语言客服从 5 人压缩到 1 人，选品从靠运气变成靠数据。这一页收录跨境电商赛道做成的对标项目 + 配套工具栈 + 致胜要点。",
    benchmarks: [
      {
        name: "Pet Lovers Co",
        emoji: "🐾",
        oneliner: "Shopify 宠物垂类独立站",
        metric: "$180k/年 GMV · 35% 毛利",
        founded: "2024",
        team: "1 人 + AI",
        trafficSource: "TikTok + Meta 投放",
      },
      {
        name: "JMA Furniture",
        emoji: "🛋️",
        oneliner: "出海家具品牌",
        metric: "AI 素材成本下降 73%",
        founded: "2023",
        team: "5 人",
        trafficSource: "FB + Pinterest",
      },
      {
        name: "Outfitr",
        emoji: "👗",
        oneliner: "AI 数字人服装电商",
        metric: "$45k MRR · 8 个月达到",
        founded: "2025",
        team: "2 人 + 1 助理",
        trafficSource: "TikTok 美区无人直播",
      },
      {
        name: "AestheticHome",
        emoji: "🏡",
        oneliner: "家居装饰独立站",
        metric: "$220k/月 GMV",
        founded: "2024",
        team: "3 人",
        trafficSource: "Pinterest SEO",
      },
    ],
    pitfalls: [
      "投流不算真实 ROI，烧钱后才发现 LTV 不够",
      "供应链一个环节断掉直接死",
      "海外信用卡支付被 ban，前期千万别碰高风险品类",
      "选品太宽，没有人群定位",
    ],
    winningPrinciples: [
      "**先做内容再投流** — 0 成本素材测出爆款再放量",
      "**用 AI 把素材成本砍到 1/10** — 每周 100 条而不是每月 10 条",
      "**找垂直细分** — 别和大品牌正面拼通用品类",
      "**Pinterest + TikTok 是 2026 年最被低估的渠道**",
    ],
    moxieService: {
      name: "跨境电商 AI 包",
      price: "联系评估",
      href: "/solutions/ecom",
      desc: "AI 素材工厂 + 多语言客服 + 自动化投流，6 周交付。",
    },
    faq: [
      {
        q: "跨境电商 0 基础能做吗？",
        a: "能。先用 AI 工具栈把成本压到极低，¥5k 启动资金 + 3 个月时间足够测出方向。",
      },
      {
        q: "我应该选什么品类？",
        a: "三看：高客单（>$30）/ 复购（订阅/耗材）/ 视觉效果好。最忌讳低价大众品（红海）和电池类（合规风险）。",
      },
      {
        q: "Shopify 还是亚马逊？",
        a: "想做品牌 → Shopify 独立站。想 0-1 跑量 → TikTok Shop / Amazon。Moxie 案例里 Shopify 占 70%。",
      },
    ],
    gradient: "from-fuchsia-100 to-pink-50",
  },

  {
    slug: "saas",
    name: "SaaS 创业",
    emoji: "🚀",
    audience: "独立开发者 / Indie Hacker / SaaS 创始人",
    description: "AI 时代做 SaaS：从 idea 到 ARR 的对标 + 工具栈",
    metaTitle: "SaaS 创业 AI 工具 + 对标项目 — Moxie 行业页",
    metaDesc: "Vibe Coding 时代怎么做 SaaS：成功 SaaS 对标、Claude Code / v0 / Lovable 工具组合、定价策略。",
    intro:
      "SaaS 创业在 AI 时代的核心变化是「**1 人团队也能做出 ARR 产品**」。Claude Code 让开发效率翻 10 倍，Stripe / LemonSqueezy 让收钱无门槛，TikTok / X 让 0 成本起量。这一页收录 SaaS 赛道的对标项目 + 工具组合 + 增长打法。",
    benchmarks: [
      {
        name: "Claimly",
        emoji: "✈️",
        oneliner: "航班延误自动索赔 SaaS",
        metric: "$8.5k MRR · 3 周上线",
        founded: "2026",
        team: "2 人",
        trafficSource: "SEO + Affiliate",
        url: "https://claimly.io",
      },
      {
        name: "AI Resume Tailor",
        emoji: "📄",
        oneliner: "简历自动定制",
        metric: "$1.2k MRR · 14 月",
        founded: "2024",
        team: "1 人",
        trafficSource: "Reddit + Google SEO",
      },
      {
        name: "Lovable",
        emoji: "💖",
        oneliner: "对话式全栈 SaaS 生成器",
        metric: "$10M ARR · 6 个月",
        founded: "2024",
        team: "20 人",
        trafficSource: "X / 创始人个人 IP",
      },
      {
        name: "v0",
        emoji: "🅥",
        oneliner: "AI React 组件生成",
        metric: "$30M ARR · Vercel 出品",
        founded: "2023",
        team: "Vercel 团队",
        trafficSource: "Vercel 生态",
      },
    ],
    pitfalls: [
      "做的太宽，没有具体痛点",
      "技术先行，没验证就动手开发",
      "定价瞎拍，没数据支持",
      "全自己做，不用 Claude Code 等工具加速",
    ],
    winningPrinciples: [
      "**1 人团队是新常态** — Claude Code 让开发效率 ×10",
      "**找 boring 但有钱的痛点** — B 端简单工具比 C 端火爆产品赚钱",
      "**TikTok Demo 帖 + X 创始人故事 = 0 成本起量**",
      "**先做内测付费用户再扩量** — Top 10 用户的反馈最值钱",
    ],
    moxieService: {
      name: "Vibe Coding 启动包",
      price: "联系评估",
      href: "/services#starter-stack",
      desc: "我自用的 Next.js + Supabase + Stripe 项目模板，私有 GitHub 给你。",
    },
    faq: [
      {
        q: "做 SaaS 选什么技术栈？",
        a: "Next.js + Supabase + Stripe + Vercel 是 Indie Hacker 主流栈。Moxie 自己 4 个产品全用这个组合。",
      },
      {
        q: "国内还是出海？",
        a: "出海。海外用户付费意愿高 5-10 倍，Stripe 收款简单，监管友好。国内做 SaaS 几乎没法 ToC。",
      },
      {
        q: "怎么找需求验证？",
        a: "先去 Reddit / Indie Hackers / V2EX 找抱怨帖，3 个月内被抱怨 100+ 次的痛点 = 真需求。",
      },
    ],
    gradient: "from-purple-100 to-violet-50",
  },

  {
    slug: "content-creator",
    name: "自媒体 / 内容创作",
    emoji: "🎬",
    audience: "抖音 / 小红书 / TikTok / YouTube 博主",
    description: "做内容博主用 AI 提效 10 倍的对标 + 工具栈",
    metaTitle: "自媒体 AI 工具 + 创作者对标 — Moxie 行业页",
    metaDesc: "短视频博主怎么用 AI 工具栈一个人做矩阵：对标博主、AI 配音、AI 视频、AI 剪辑全流程。",
    intro:
      "做内容的人最焦虑「时间不够」。AI 把「选题 → 脚本 → 配音 → 视频 → 剪辑 → 封面」每一步成本压到几乎为 0，让 1 个人产出抵 5 人团队成为标配。这一页收录创作者对标 + 完整工具栈 + 矩阵起号打法。",
    benchmarks: [
      {
        name: "@子墨说AI",
        emoji: "📒",
        oneliner: "AI 工具测评博主",
        metric: "10万+ 全网粉丝 · ROI 4× 行业平均",
        founded: "2025",
        team: "5 人",
        trafficSource: "抖音 + 小红书 + 公众号矩阵",
      },
      {
        name: "@Faceless TikTok",
        emoji: "🎭",
        oneliner: "美区无脸账号矩阵",
        metric: "5 个号 80万粉 · $2.5k/月",
        founded: "2024",
        team: "1 人 + AI",
        trafficSource: "TikTok 算法",
      },
      {
        name: "@MidjourneyDaily",
        emoji: "🎨",
        oneliner: "MJ 提示词 Newsletter",
        metric: "12k 订阅 · $800/月",
        founded: "2024",
        team: "1 人",
        trafficSource: "Twitter / Beehiiv",
      },
      {
        name: "@洋光AI（参考）",
        emoji: "☀️",
        oneliner: "AI 自媒体保姆级账号",
        metric: "百万粉丝矩阵",
        founded: "2024",
        team: "10+ 人",
        trafficSource: "抖音 + 小红书",
      },
    ],
    pitfalls: [
      "AI 出镜过度，平台限流",
      "矩阵号互相抄自己，全部死掉",
      "只做信息差不做干货，粉丝来了留不住",
      "0 商业化布局，10 万粉变现还在卖课",
    ],
    winningPrinciples: [
      "**真人 + AI 混合**：真人画面 + AI 配音 + AI 字幕，平台不降权",
      "**钩子公式**：欲望 / 大数字 / 个人故事 / 大背景 / 痛点 — 命中 ≥2 类才算合格",
      "**变现要做主页置顶 / 简介 / 评论区**，视频里禁喊「私信我」",
      "**1 人 4 号矩阵** = 同套 SOP 复制，每号差异化",
    ],
    moxieService: {
      name: "Moxie 内容代运营",
      price: "联系评估",
      href: "/services#growth-content",
      desc: "全权代运营内容矩阵，按 MAU / 涨粉 KPI 计费。",
    },
    faq: [
      {
        q: "纯 AI 视频会被平台降权吗？",
        a: "纯 AI 会。「真人画面 + AI 配音 + AI 字幕」这种半 AI 模式不会，反而效率高。",
      },
      {
        q: "1 个人能做几个账号？",
        a: "用 SOP + AI 工具栈，一个人能并行运营 3-5 个账号。Moxie 内部 1 人对应 4 个矩阵号。",
      },
      {
        q: "0 粉丝怎么起号？",
        a: "找信息差选题（30%）+ 干货（70%）。前 30 条按 SOP 发，月底数据说话。",
      },
    ],
    gradient: "from-rose-100 to-pink-50",
  },

  {
    slug: "restaurant",
    name: "餐饮 / 实体连锁",
    emoji: "🍜",
    audience: "餐饮 / 网吧 / 美业 / 连锁门店",
    description: "实体连锁用 AI 降人力成本的对标 + 解决方案",
    metaTitle: "餐饮 AI 解决方案 + 连锁对标 — Moxie 行业页",
    metaDesc: "连锁餐饮 / 网吧 / 美业用 AI 降本：AI 店长系统、外卖评价、自动客服、门店看板对标方案。",
    intro:
      "实体连锁最大的痛点是「人」 — 店长招不到、客服回不过来、夜班没人值守。AI 把「店长 / 客服 / 财务」这三块 50% 的工作变成自动化，让一家 30 店连锁能压缩到 5 个真人。这一页收录实体连锁的 AI 落地对标 + 标准解决方案。",
    benchmarks: [
      {
        name: "8 圈机器人",
        emoji: "🎮",
        oneliner: "网吧 AI 店长系统",
        metric: "1,000+ 店覆盖 · 替代 50% 店长",
        founded: "2025",
        team: "30 人",
        trafficSource: "掌上 8 圈对接",
      },
      {
        name: "某连锁茶饮",
        emoji: "🧋",
        oneliner: "AI 外卖运营",
        metric: "差评回复时长 24h → 5min",
        founded: "2024",
        team: "5 店共享 AI",
        trafficSource: "美团 / 饿了么 / 抖音",
      },
      {
        name: "某轻医美连锁",
        emoji: "💉",
        oneliner: "AI 客服 + 预约",
        metric: "客服成本 -45% · 预约转化 +30%",
        founded: "2024",
        team: "30 店总部",
        trafficSource: "小红书 + 美团",
      },
      {
        name: "某 30 店餐饮",
        emoji: "🍱",
        oneliner: "AI 店长 + 评价管理",
        metric: "外卖评分 4.6 → 4.9 / 节省人力 50%",
        founded: "2025",
        team: "总部 3 人",
        trafficSource: "外卖 + 私域",
      },
    ],
    pitfalls: [
      "数字化跟不上，门店 POS 都在线下",
      "总部和门店权限分不清",
      "想一步到位上中央 AI，员工抵触",
      "外包给传统 SaaS，结果是 PPT 不是落地",
    ],
    winningPrinciples: [
      "**先 AI 客服 / 评价管理**：单点突破，3 个月看到 ROI",
      "**总部用 AI 看板，门店用 SOP**",
      "**外卖 4 大平台数据要打通**（美团 / 饿了么 / 抖音 / 小红书）",
      "**小红书 + 抖音 + 私域 = 实体新流量铁三角**",
    ],
    moxieService: {
      name: "餐饮 AI 解决方案",
      price: "联系评估",
      href: "/solutions/restaurant",
      desc: "AI 店长 + 外卖评价 + 私域客服，30 天交付，含 12 月维护。",
    },
    faq: [
      {
        q: "30 家以下的小连锁也能用吗？",
        a: "5 店以上就能。Moxie 的标准包是 8-30 店为主，<5 店推荐先用单店 SOP + 通用 AI 工具组合。",
      },
      {
        q: "员工不会用怎么办？",
        a: "Moxie 包里含驻店培训 + SOP 文档。员工 3 天内能上手，2 周稳定使用。",
      },
      {
        q: "数据安全怎么办？",
        a: "可选私有化部署 + 等保认证。门店数据不出本地，只把分析结果汇总到总部。",
      },
    ],
    gradient: "from-amber-100 to-orange-50",
  },

  {
    slug: "education",
    name: "教育 / 培训",
    emoji: "📚",
    audience: "K12 / 职业教育 / 企培 / 知识付费",
    description: "教育公司用 AI 降师资成本的对标 + 落地方案",
    metaTitle: "教育 AI 解决方案 + 培训机构对标 — Moxie 行业页",
    metaDesc: "教育公司怎么用 AI：AI 答疑老师、自动课件、学员陪伴、招生数据驱动对标和落地方案。",
    intro:
      "教育最贵的成本是「老师」。AI 把答疑、课件、运营三块的边际成本压到 0，让一家培训机构能 5 倍于过去的师生比运营。这一页收录教育行业 AI 落地的对标 + 方案 + 招生 ROI 模型。",
    benchmarks: [
      {
        name: "猿辅导 AI 答疑",
        emoji: "🎓",
        oneliner: "K12 AI 答疑老师",
        metric: "10 万 + 学员同时在线",
        founded: "2024",
        team: "AI 团队 50+",
        trafficSource: "K12 内部用户",
      },
      {
        name: "某 IT 职教机构",
        emoji: "💻",
        oneliner: "AI 答疑 + 学员陪伴",
        metric: "结课率 40% → 75%",
        founded: "2024",
        team: "30 人",
        trafficSource: "抖音 + B 站",
      },
      {
        name: "Khanmigo (Khan)",
        emoji: "🌍",
        oneliner: "Khan Academy AI 助教",
        metric: "$4/月 · 50 万订阅",
        founded: "2023",
        team: "Khan 团队",
        trafficSource: "教育生态",
      },
      {
        name: "某英语培训",
        emoji: "📖",
        oneliner: "AI 口语陪练",
        metric: "续费率 +35%",
        founded: "2024",
        team: "20 人",
        trafficSource: "小红书 + 微信",
      },
    ],
    pitfalls: [
      "课程体系跟不上 AI 能力，做出来反而干扰学员",
      "AI 答疑准确率不达标，学员流失",
      "数据合规没做（K12 监管特别严）",
      "和讲师团队冲突，AI 反而被抵制",
    ],
    winningPrinciples: [
      "**AI 做「重复劳动」**：答疑 / 批改 / 答疑老师，不动核心讲师",
      "**课件自动生成**：学科教研 1 周 → 1 天",
      "**学员数据闭环**：学习行为 → AI 推荐 → 续费率提升",
      "**抖音 / 小红书 + 私域 = 招生新铁三角**",
    ],
    moxieService: {
      name: "教育 AI 落地包",
      price: "联系评估",
      href: "/solutions/education",
      desc: "AI 答疑 + 课件生成 + 学员陪伴，10 周交付。",
    },
    faq: [
      {
        q: "K12 监管特别严，能用 AI 吗？",
        a: "K12 必须做内容合规审查 + 可追溯日志。Moxie 的 K12 包默认含合规审计模块。",
      },
      {
        q: "AI 答疑准确率怎么保证？",
        a: "标准做法是 RAG（基于自有题库）+ 人工兜底。准确率从 70% → 95%，回答不准转人工。",
      },
      {
        q: "我们没有数字化课件怎么办？",
        a: "Moxie 提供「PDF 课件 → AI 课件」转换服务，1 套课程 1 周内数字化。",
      },
    ],
    gradient: "from-emerald-100 to-teal-50",
  },

  {
    slug: "service",
    name: "服务业 / 知识工作",
    emoji: "💼",
    audience: "咨询 / 律所 / 财税 / 设计公司",
    description: "知识服务业用 AI 提效 5 倍的对标 + 方案",
    metaTitle: "服务业 AI 解决方案 + 咨询 / 律所对标 — Moxie 行业页",
    metaDesc: "咨询 / 律所 / 财税 / 设计公司用 AI：合同审阅、财报分析、提案生成、客户答疑标准方案。",
    intro:
      "知识服务业本质是「时薪生意」 — 老板时薪贵但产能低。AI 把「合同审阅 / 财报分析 / 提案撰写 / 客户答疑」每一项的人均产出提升 5-10 倍。这一页收录知识服务业的 AI 落地对标。",
    benchmarks: [
      {
        name: "Harvey",
        emoji: "⚖️",
        oneliner: "Top 律所 AI 助手",
        metric: "$80M ARR · 200+ 律所客户",
        founded: "2023",
        team: "Harvey 团队",
        trafficSource: "B 端直销",
      },
      {
        name: "某中型律所",
        emoji: "📜",
        oneliner: "AI 合同审阅",
        metric: "审阅时长 4h → 30min",
        founded: "2024",
        team: "30 人",
        trafficSource: "客户口碑",
      },
      {
        name: "某财税咨询",
        emoji: "💰",
        oneliner: "AI 财报分析",
        metric: "中小客户成本 -60%",
        founded: "2024",
        team: "10 人",
        trafficSource: "私域 + 公众号",
      },
      {
        name: "Rogo",
        emoji: "📊",
        oneliner: "投行 AI 助手",
        metric: "$25M ARR",
        founded: "2024",
        team: "Rogo 团队",
        trafficSource: "B 端直销",
      },
    ],
    pitfalls: [
      "AI 输出当成最终成果，没人审就交给客户",
      "敏感数据没做隔离，合规风险大",
      "AI 工具买了一堆没人用",
      "想自研 AI Agent，结果半年没上线",
    ],
    winningPrinciples: [
      "**AI 做初稿，人做终审**",
      "**RAG 知识库 + 团队 SOP** 比通用模型管用 10 倍",
      "**敏感行业上私有化部署**",
      "**用 AI 做差异化定价**：同样工作高客户付高价",
    ],
    moxieService: {
      name: "服务业 AI 落地",
      price: "联系评估",
      href: "/services#buildout",
      desc: "RAG 知识库 + 工作流自动化 + 私有化部署可选。",
    },
    faq: [
      {
        q: "客户数据怎么保证不泄露？",
        a: "标配私有化部署 + 数据脱敏 + 审计日志。律所 / 金融客户都要走这个流程。",
      },
      {
        q: "团队不接受 AI 怎么办？",
        a: "Moxie 包里含变革管理：先 1-2 个 Power User 试用 → 内部 case study → 团队培训 → 全员推广。",
      },
      {
        q: "ROI 多久能看到？",
        a: "AI 合同审阅 / 提案生成场景下，3-6 个月内可量化人均产出提升 50-200%。",
      },
    ],
    gradient: "from-sky-100 to-blue-50",
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
