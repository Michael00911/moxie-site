// ====== 行业 × 用途 交叉页（最值钱的 SEO 长尾页）======

import type { Benchmark } from "./industries";

export type Intersection = {
  industrySlug: string;
  purposeSlug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  hero: string;
  intro: string;
  toolStack: { toolSlug: string; role: string }[];
  benchmarks: Benchmark[];
  workflow: string[];
  pitfalls?: string[];
  moxieService: { name: string; price: string; desc: string; href: string };
  faq: { q: string; a: string }[];
};

export const intersections: Intersection[] = [
  // 跨境电商 × 流量
  {
    industrySlug: "ecom",
    purposeSlug: "growth",
    title: "跨境电商怎么做流量（2026 实战）",
    metaTitle: "跨境电商怎么做流量 2026 — TikTok / Pinterest / 投流实战",
    metaDesc: "跨境电商 0-10 万 GMV 的流量打法：TikTok 美区、Pinterest SEO、Meta 投流、AI 素材工厂。",
    hero: "跨境电商最贵的成本是流量。AI 把素材成本砍到 1/10，让 1 人能跑过去 5 人团队的流量",
    intro:
      "跨境电商的流量公式 = 选品 × 素材 × 渠道。2026 年顶尖玩家的打法是「**AI 出素材 + 多平台铺 + 数据迭代**」 — 一个独立卖家用这套组合能做到 $200k/月 GMV。",
    toolStack: [
      { toolSlug: "dreamina", role: "主图 + 视频素材主力（每周 100+ 条）" },
      { toolSlug: "elevenlabs", role: "多语言配音（覆盖美 / 欧 / 日）" },
      { toolSlug: "claude-code", role: "广告文案 + Hook 生成" },
      { toolSlug: "n8n", role: "自动化投流和素材分发" },
      { toolSlug: "perplexity", role: "选品调研 + 竞品分析" },
    ],
    benchmarks: [
      {
        name: "Pet Lovers Co",
        emoji: "🐾",
        oneliner: "宠物垂类独立站",
        metric: "$180k/年 GMV / 35% 毛利",
        founded: "2024",
        team: "1 人 + AI",
        trafficSource: "TikTok + Meta",
      },
      {
        name: "AestheticHome",
        emoji: "🏡",
        oneliner: "家居装饰独立站",
        metric: "$220k/月 / Pinterest 主流量",
        team: "3 人",
        trafficSource: "Pinterest SEO",
      },
    ],
    workflow: [
      "选品阶段（第 1 周）：Perplexity 调研 + 竞品 review",
      "素材产出（第 2 周）：Claude 出 30 条 Hook，即梦每条配 5 张图 + 5 段视频",
      "测试阶段（第 3-4 周）：每条 Hook $5-10 投放 TikTok + Meta",
      "放大阶段（第 5 周+）：找出 ROI > 1.5 的 2-3 条素材，每天 $200-1000 加投",
      "复购自动化：n8n 接 Klaviyo + Shopify，按用户行为分群推送",
    ],
    pitfalls: [
      "前期 $5k 测不出 ROI，急着放大 → 烧钱",
      "Hook 不够多，5 条以下样本量不够",
      "不做留存，只做新增 → 单品 LTV 不够",
    ],
    moxieService: {
      name: "跨境电商 AI 包",
      price: "联系评估",
      desc: "AI 素材工厂 + 多语言客服 + 自动化投流，6 周交付。",
      href: "/solutions/ecom",
    },
    faq: [
      {
        q: "新手起步预算多少？",
        a: "最低 $3k 测款 + $5k 放大 = $8k 起。如果能用 AI 出素材，前期素材成本几乎为 0。",
      },
      {
        q: "TikTok 美区还是 Meta 哪个先做？",
        a: "TikTok 美区适合视觉驱动 + 冲动消费品类。Meta 适合理性决策 + 高客单。两个都做 ROI 最高。",
      },
    ],
  },

  // 跨境电商 × 设计
  {
    industrySlug: "ecom",
    purposeSlug: "design",
    title: "跨境电商怎么做素材生产（AI 工厂模式）",
    metaTitle: "跨境电商 AI 素材工厂 — 每月 200 条素材，成本 1/10",
    metaDesc: "用 AI 把跨境电商素材成本从 ¥800/条降到 ¥10/条。即梦 + ElevenLabs + 剪映组合。",
    hero: "传统电商素材 ¥800/条，AI 工厂 ¥10/条。每月 200 条 vs 30 条，跑赢竞品就这么简单",
    intro:
      "跨境电商赢的关键是「素材数量 × 测试速度」。AI 让单条素材成本从 ¥500-2000 降到 ¥10-50。意味着同样预算下能测 20 倍的素材，找到爆款的概率显著提升。",
    toolStack: [
      { toolSlug: "dreamina", role: "主图 + 短视频生成（中文友好）" },
      { toolSlug: "midjourney", role: "高质量产品图" },
      { toolSlug: "elevenlabs", role: "多语言配音" },
      { toolSlug: "heygen", role: "数字人口播广告" },
      { toolSlug: "claude-code", role: "Hook 文案 + 脚本" },
    ],
    benchmarks: [
      {
        name: "JMA Furniture",
        emoji: "🛋️",
        oneliner: "家具品牌",
        metric: "素材成本 -73%",
        team: "5 人",
      },
      {
        name: "Outfitr",
        emoji: "👗",
        oneliner: "AI 数字人服装电商",
        metric: "$45k MRR · TikTok 美区",
        team: "2 人",
      },
    ],
    workflow: [
      "确定 5 个核心 Hook（Claude 生成 30 个，挑最有共鸣的 5 个）",
      "即梦每个 Hook 配 5 张主图 + 5 段 5-15 秒视频",
      "ElevenLabs 配多语言旁白（英 / 西 / 日 / 韩）",
      "剪映 / Capcut 拼成最终素材（30 分钟/条）",
      "批量上传到 Meta / TikTok / Pinterest 测",
    ],
    moxieService: {
      name: "AI 素材工厂托管",
      price: "联系评估",
      desc: "替你生产全部图 + 视频 + 落地页素材，按月计费。",
      href: "/services#growth-content",
    },
    faq: [
      {
        q: "AI 视频在 Meta 投放会被审核拦截吗？",
        a: "不会。Meta 不查 AI 生成，只查内容合规。AI 视频和真人视频审核标准一致。",
      },
      {
        q: "用即梦还是 Runway？",
        a: "中国卖家用即梦（中文 prompt + 国内访问 + 微信支付）。海外团队用 Runway。",
      },
    ],
  },

  // SaaS × 流量
  {
    industrySlug: "saas",
    purposeSlug: "growth",
    title: "SaaS 公司怎么做内容增长（0-1 万 MRR）",
    metaTitle: "SaaS 公司怎么做增长 — Indie Hacker 0-1 万 MRR 实战",
    metaDesc: "SaaS 创业 0-1 万 MRR 的内容 + SEO + 社媒打法。Claude Code / DeepSeek / Twitter 实战。",
    hero: "SaaS 0-1 万 MRR 不需要投流。靠内容 + SEO + 创始人个人 IP 三件套就能跑通",
    intro:
      "Indie Hacker SaaS 0-1 万 MRR 阶段，付费投放 ROI 永远不如内容。过去 1 年跑出 $10k+ MRR 的 SaaS 95% 都是「**SEO 长尾 + Twitter 创始人 IP + Reddit 真诚分享**」三件套。",
    toolStack: [
      { toolSlug: "claude-code", role: "SEO 文章批量产出（每周 5 篇）" },
      { toolSlug: "perplexity", role: "找 SEO 关键词 + 竞品调研" },
      { toolSlug: "v0", role: "落地页快速测试" },
      { toolSlug: "n8n", role: "Twitter / Reddit 自动化" },
    ],
    benchmarks: [
      {
        name: "Claimly",
        emoji: "✈️",
        oneliner: "航班延误索赔 SaaS",
        metric: "$8.5k MRR / SEO + Affiliate",
        team: "2 人",
      },
      {
        name: "AI Resume Tailor",
        emoji: "📄",
        oneliner: "简历定制",
        metric: "$1.2k MRR / Reddit + SEO",
        team: "1 人",
      },
    ],
    workflow: [
      "找 30 个 SEO 长尾词（搜索量 100-1000，竞争低）",
      "Claude Code 每周写 5 篇 SEO 长文 + 自动发布",
      "Twitter 创始人账号 1 天 1 帖（产品 / 故事 / 用户故事）",
      "Reddit 在 5 个相关 sub 真诚分享 + 解决用户问题",
      "Affiliate 计划上线（30% 佣金 + Cookie 90 天）",
    ],
    moxieService: {
      name: "SaaS 全案代运营",
      price: "联系评估",
      desc: "SEO + 社媒 + Affiliate 全包，按 MRR 增长 KPI 计费。",
      href: "/services#growth-fullstack",
    },
    faq: [
      {
        q: "做出海 SaaS，国内还能起号吗？",
        a: "Twitter / X 是必备。Reddit + Indie Hackers + 自己的 Newsletter 是黄金三角。",
      },
      {
        q: "SEO 多久能见效？",
        a: "新站 3-6 个月看到自然流量。前期靠 Twitter / Reddit 起量，后期 SEO 自动跑。",
      },
    ],
  },

  // SaaS × 研发
  {
    industrySlug: "saas",
    purposeSlug: "dev",
    title: "1 个人怎么做出 ARR 的 SaaS（Vibe Coding 实战）",
    metaTitle: "1 个人做 SaaS — Vibe Coding 完整指南 2026",
    metaDesc: "Claude Code + v0 + Supabase + Stripe，1 个人 3 周做出有 ARR SaaS 的实战路径。",
    hero: "Claude Code 让 1 个人能干过去 5 人团队的活。3 周从 idea 到 $500 MRR 是新基线",
    intro:
      "2026 年 SaaS 创业的最大变化是「**1 人团队成为新常态**」。Claude Code 让开发效率翻 10 倍，Stripe / LemonSqueezy 收钱无门槛，TikTok / X 让 0 成本起量。这一页是子墨自己跑过的完整路径。",
    toolStack: [
      { toolSlug: "claude-code", role: "主力 AI 编程（Sonnet 4 + 1M 上下文）" },
      { toolSlug: "cursor", role: "前端 UI 调试 + 演示" },
      { toolSlug: "v0", role: "落地页 + 组件快速生成" },
      { toolSlug: "lovable", role: "MVP 0-1 验证" },
      { toolSlug: "deepseek", role: "API 后端（成本 1/10）" },
    ],
    benchmarks: [
      {
        name: "Claimly",
        emoji: "✈️",
        oneliner: "航班延误索赔",
        metric: "$8.5k MRR / 3 周上线",
        team: "2 人",
        url: "https://claimly.io",
      },
      {
        name: "Moxie 工具站",
        emoji: "📒",
        oneliner: "你正在看的网站",
        metric: "1 天搭完 / 60+ 页",
        team: "1 人",
      },
    ],
    workflow: [
      "Day 1-3：Lovable 出可点击 demo + 验证核心流程",
      "Day 4-7：Cursor 改 UI 细节 / 接 Stripe / Supabase",
      "Day 8-14：Claude Code 重构关键业务逻辑（生产级）",
      "Day 15-18：DeepSeek API 接后端 / 测试 / 修 bug",
      "Day 19-21：上线（Vercel）+ Twitter 发帖 + Reddit 分享",
    ],
    moxieService: {
      name: "Vibe Coding 启动包",
      price: "联系评估",
      desc: "我自用的 Next.js + Supabase + Stripe 项目模板，私有 GitHub + Claude Code 提示词包。",
      href: "/services#starter-stack",
    },
    faq: [
      {
        q: "完全不会写代码也能做吗？",
        a: "可以，但要愿意学。Claude Code 帮你写代码不代表你能完全不懂代码。建议先看 1 周 Tutorial。",
      },
      {
        q: "需要哪些前置知识？",
        a: "Git / 命令行 / API 概念 / 数据库 / 部署。这些 ChatGPT 教你 2 周能上手。",
      },
    ],
  },

  // 自媒体 × 设计
  {
    industrySlug: "content-creator",
    purposeSlug: "design",
    title: "短视频博主必备 AI 设计工具栈",
    metaTitle: "短视频博主 AI 工具栈 — 一个人 1 天做 3 条爆款",
    metaDesc: "抖音 / 小红书博主用 AI 把素材生产效率提升 10 倍。完整工具栈 + 子墨自用配置。",
    hero: "传统博主 1 天 1 条，AI 博主 1 天 3 条。素材生产效率拉开 10 倍差距，粉丝增长拉开 100 倍",
    intro:
      "做内容的人最值钱的是「时间」。AI 把「选题 + 脚本 + 配音 + 视频 + 封面」每一步成本压到几乎为 0。这一页是子墨说AI 自媒体团队（10万+ 粉丝）每天用的工具栈。",
    toolStack: [
      { toolSlug: "doubao", role: "中文选题 + 文案初稿（免费）" },
      { toolSlug: "claude-code", role: "脚本结构化 + 改写润色" },
      { toolSlug: "elevenlabs", role: "AI 配音（克隆你声音）" },
      { toolSlug: "dreamina", role: "封面图 + 转场视频" },
      { toolSlug: "heygen", role: "数字人口播（批量内容）" },
    ],
    benchmarks: [
      {
        name: "@子墨说AI",
        emoji: "📒",
        oneliner: "AI 测评",
        metric: "10万+ 粉丝 · 5 人团队",
        team: "5 人",
      },
      {
        name: "@TikTok Faceless",
        emoji: "🎭",
        oneliner: "美区无脸账号",
        metric: "5 号 80万粉丝 · 1 人 + AI",
        team: "1 人",
      },
    ],
    workflow: [
      "豆包 30 分钟出 10 个选题，挑 3 个最有共鸣",
      "Claude 按「钩子-痛点-解法-CTA」结构出脚本",
      "ElevenLabs 1 分钟配音 + 即梦出 3 张封面",
      "剪映 30 分钟拼起来",
      "1 天产出 3 条，月产 90 条",
    ],
    moxieService: {
      name: "Moxie 内容代运营",
      price: "联系评估",
      desc: "全权运营内容矩阵，按 KPI 计费。",
      href: "/services#growth-content",
    },
    faq: [
      {
        q: "我没钱买 ElevenLabs 怎么办？",
        a: "用豆包语音（免费）+ 飞书妙记（免费）+ 剪映 AI 配音。质量 80%，成本 0。",
      },
      {
        q: "1 个人能做几个号？",
        a: "用 SOP + AI 工具栈，能并行 3-5 个矩阵号。每号差异化定位，避免互相抄。",
      },
    ],
  },

  // 自媒体 × 变现
  {
    industrySlug: "content-creator",
    purposeSlug: "monetization",
    title: "自媒体怎么变现（10万粉丝实战）",
    metaTitle: "自媒体 10 万粉丝怎么变现 — 5 条变现路径详解",
    metaDesc: "10 万粉丝怎么变现：广告 / 带货 / 课程 / Affiliate / 社群 5 条路径详解 + 真实案例。",
    hero: "10 万粉丝不是终点。变现路径 5 选 1 选错，10 万粉变现还在喝粥",
    intro:
      "10 万粉只是「**入场券**」。变现真正决定你能赚多少 — 同样 10 万粉的博主，月收入从 ¥3k 到 ¥30万 都有。差别在于变现路径选对没。",
    toolStack: [
      { toolSlug: "claude-code", role: "选题策划 + 脚本写作" },
      { toolSlug: "n8n", role: "私域自动化（粉丝→邮箱→课程）" },
      { toolSlug: "doubao", role: "中文文案 + 客服回复" },
    ],
    benchmarks: [
      {
        name: "@子墨说AI",
        emoji: "📒",
        oneliner: "B 端代运营 + 商务变现",
        metric: "ARR ¥600 万 · 10万粉",
        team: "5 人",
      },
      {
        name: "@MidjourneyDaily",
        emoji: "🎨",
        oneliner: "Newsletter 订阅",
        metric: "$800/月 / 12k 订阅",
        team: "1 人",
      },
    ],
    workflow: [
      "明确变现路径（不要全做，专注 1-2 条）",
      "Affiliate（最易上手）：每条视频带 1-2 个工具推荐",
      "B 端（最赚钱）：把粉丝转成企业线索（子墨说AI 路径）",
      "社群（最持续）：邮件 / 微信群分层运营",
      "课程 / 数字产品（最被高估）：除非内容门槛高否则别做",
    ],
    moxieService: {
      name: "Moxie 商务对接",
      price: "佣金分成",
      desc: "10万+ 粉博主转介给 Moxie 做 B 端代运营，按签单分成。",
      href: "/services",
    },
    faq: [
      {
        q: "10 万粉一个月能赚多少？",
        a: "完全看变现路径。广告分成 ¥3-10k，带货 ¥10-50k，B 端线索 ¥30k-100万+。",
      },
      {
        q: "卖课好还是不好？",
        a: "卖课天花板低 + 复购差。Moxie 不卖课。建议优先 Affiliate + B 端线索。",
      },
    ],
  },

  // 餐饮 × 客服
  {
    industrySlug: "restaurant",
    purposeSlug: "customer",
    title: "餐饮 AI 客服怎么做（30 店实战）",
    metaTitle: "餐饮 AI 客服 — 30 店连锁外卖差评回复全自动",
    metaDesc: "连锁餐饮用 AI 客服降本：外卖差评、私域客服、预订咨询全自动化方案。",
    hero: "30 家店外卖差评回复，传统 24h，AI 5min。客服成本 -45%，外卖评分 4.6 → 4.9",
    intro:
      "餐饮客服的核心痛点是「**多平台 + 高频 + 标准化**」 — 美团 / 饿了么 / 抖音 / 小红书 4 个平台，每天几百条评论问询，30 个店人手永远不够。AI 把这事解决得最干净。",
    toolStack: [
      { toolSlug: "claude-code", role: "客服 Agent 设计" },
      { toolSlug: "deepseek", role: "API 后端（中文优化 + 成本低）" },
      { toolSlug: "n8n", role: "工单流转 + 多平台对接" },
    ],
    benchmarks: [
      {
        name: "某 30 店餐饮",
        emoji: "🍱",
        oneliner: "外卖评价管理",
        metric: "评分 4.6 → 4.9 · 节省人力 50%",
      },
      {
        name: "某连锁茶饮",
        emoji: "🧋",
        oneliner: "AI 外卖运营",
        metric: "差评回复 24h → 5min",
      },
    ],
    workflow: [
      "导出过去 6 个月外卖评论 + 客服记录",
      "DeepSeek + RAG 训练餐饮专属客服模型",
      "n8n 接 4 大外卖平台 + 私域微信",
      "AI 先回复 → 复杂问题转店长",
      "数据看板汇总到总部",
    ],
    moxieService: {
      name: "餐饮 AI 解决方案",
      price: "联系评估",
      desc: "AI 店长 + 外卖评价 + 私域客服，30 天交付，含 12 月维护。",
      href: "/solutions/restaurant",
    },
    faq: [
      {
        q: "AI 回复客户会被识别吗？",
        a: "我们的客服 AI 故意保留「人味」 — 用「店长亲自回复」语气。客户基本识别不出。",
      },
      {
        q: "5 店以下能用吗？",
        a: "可以但 ROI 不高。Moxie 标准包是 8-30 店。<5 店建议用通用 AI 工具组合自己搭。",
      },
    ],
  },

  // 餐饮 × 运营
  {
    industrySlug: "restaurant",
    purposeSlug: "operations",
    title: "餐饮怎么用 AI 做店长（连锁实战）",
    metaTitle: "餐饮 AI 店长 — 连锁餐饮节省 50% 人力",
    metaDesc: "AI 店长系统：排班 / 订货 / 库存 / 数据看板全自动。30 店连锁实战方案。",
    hero: "传统店长月薪 ¥6k 招不到。AI 店长 ¥2k/月，30 家店共用，节省 50% 人力",
    intro:
      "餐饮最大的痛点是「店长招不到」 — 月薪 ¥6k+ 还嫌累。AI 店长把排班 / 订货 / 库存 / 数据汇总自动化，让 1 个区域督导能管 5-10 家店。",
    toolStack: [
      { toolSlug: "claude-code", role: "智能排班 + 订货决策" },
      { toolSlug: "deepseek", role: "API 后端" },
      { toolSlug: "n8n", role: "工作流自动化 + 多系统对接" },
    ],
    benchmarks: [
      {
        name: "8 圈机器人",
        emoji: "🎮",
        oneliner: "网吧 AI 店长",
        metric: "1,000+ 店覆盖 · 替代 50% 店长",
        team: "30 人",
      },
    ],
    workflow: [
      "打通 POS + 库存 + 排班系统",
      "AI 看历史数据预测每日订单量",
      "自动出排班建议 + 订货清单",
      "异常自动提醒区域督导（销量异常 / 库存预警）",
      "月度数据看板 + ROI 分析",
    ],
    moxieService: {
      name: "餐饮 AI 解决方案",
      price: "联系评估",
      desc: "AI 店长 + 外卖评价 + 私域客服，30 天交付。",
      href: "/solutions/restaurant",
    },
    faq: [
      {
        q: "店员不会用 AI 怎么办？",
        a: "Moxie 包里含驻店培训 + SOP 文档，员工 3 天内上手。",
      },
    ],
  },

  // 教育 × 内容
  {
    industrySlug: "education",
    purposeSlug: "growth",
    title: "教育公司怎么做内容招生（小红书 + 抖音）",
    metaTitle: "教育招生流量 — 小红书 + 抖音 + 私域闭环实战",
    metaDesc: "教育机构怎么做内容招生：小红书种草 + 抖音直播 + 私域转化全流程。",
    hero: "传统教育 ¥500-2000 单 CAC，新流量打法压到 ¥50-200。秘诀是 AI 让内容成本降 90%",
    intro:
      "教育招生的核心是「**信任 + 转化**」。小红书做信任，抖音做规模，私域做转化。AI 让一个 5 人内容团队的产出抵过去 30 人。",
    toolStack: [
      { toolSlug: "doubao", role: "选题 + 文案（中文最佳）" },
      { toolSlug: "claude-code", role: "课程内容结构化" },
      { toolSlug: "dreamina", role: "封面图 + 短视频" },
      { toolSlug: "elevenlabs", role: "AI 课程配音" },
      { toolSlug: "n8n", role: "私域自动化 + 续费提醒" },
    ],
    benchmarks: [
      {
        name: "某 IT 职教",
        emoji: "💻",
        oneliner: "B 站 + 抖音矩阵",
        metric: "结课率 40% → 75%",
        team: "30 人",
      },
      {
        name: "某英语培训",
        emoji: "📖",
        oneliner: "AI 口语陪练",
        metric: "续费率 +35%",
        team: "20 人",
      },
    ],
    workflow: [
      "小红书 30 篇专业测评 / 教程（信任）",
      "抖音 / 视频号 直播 / 短视频（规模）",
      "公众号 / 私域 (留存 + 转化)",
      "AI 答疑老师做学员陪伴 → 续费",
      "学员成果案例反哺内容（飞轮）",
    ],
    moxieService: {
      name: "教育 AI 落地包",
      price: "联系评估",
      desc: "AI 答疑 + 课件生成 + 学员陪伴，10 周交付。",
      href: "/solutions/education",
    },
    faq: [
      {
        q: "K12 监管严，能用 AI 吗？",
        a: "K12 必须做内容合规审查 + 可追溯日志。Moxie 的 K12 包默认含合规审计。",
      },
    ],
  },

  // 教育 × 客服
  {
    industrySlug: "education",
    purposeSlug: "customer",
    title: "教育 AI 答疑怎么做（10 万学员实战）",
    metaTitle: "教育 AI 答疑老师 — 准确率 95% / 成本 1/10",
    metaDesc: "教育公司 AI 答疑：基于 RAG 的专属答疑老师，准确率 95%，成本只有 1/10。",
    hero: "传统答疑老师月薪 ¥8k，AI 答疑 ¥0.5/次。10 万学员同时在线不卡",
    intro:
      "教育最大的成本是「答疑老师」 — 高峰期 30 个老师都不够用。AI 答疑老师基于自有题库（RAG）回答，准确率 95%+，且 10 万学员同时在线不卡。",
    toolStack: [
      { toolSlug: "claude-code", role: "答疑 Agent 设计 + 高质量回答" },
      { toolSlug: "deepseek", role: "API 后端（成本敏感场景）" },
      { toolSlug: "manus", role: "复杂问题 Agent 拆解" },
    ],
    benchmarks: [
      {
        name: "猿辅导 AI 答疑",
        emoji: "🎓",
        oneliner: "K12 答疑",
        metric: "10 万学员同时在线",
      },
      {
        name: "Khanmigo",
        emoji: "🌍",
        oneliner: "Khan AI 助教",
        metric: "$4/月 · 50 万订阅",
      },
    ],
    workflow: [
      "导出全部题库 + 课程内容 → 向量化",
      "RAG 知识库搭建（基于自有内容）",
      "答疑 Agent 训练 + 多轮对话",
      "对接 App / 微信小程序",
      "未答出问题转人工 + 反馈数据",
    ],
    moxieService: {
      name: "教育 AI 落地包",
      price: "联系评估",
      desc: "AI 答疑 + 课件生成 + 学员陪伴，10 周交付。",
      href: "/solutions/education",
    },
    faq: [
      {
        q: "答疑准确率怎么保证？",
        a: "RAG 架构基于自有题库回答，幻觉率 <5%。+「不确定就转人工」兜底，最终准确率 95%+。",
      },
    ],
  },

  // 服务业 × 运营
  {
    industrySlug: "service",
    purposeSlug: "operations",
    title: "律所 / 财税公司怎么用 AI 提效",
    metaTitle: "律所 / 财税 AI 提效 — 合同 4 小时 → 30 分钟",
    metaDesc: "律所 / 财税 / 咨询用 AI 提效：合同审阅 / 财报分析 / 提案生成实战方案。",
    hero: "律师审合同 4 小时 → AI 30 分钟。同样收费，时薪从 ¥1000 → ¥8000",
    intro:
      "知识服务业的本质是「**时薪生意**」 — 老板时薪贵但产能低。AI 把「合同审阅 / 财报分析 / 提案撰写」每一项的人均产出提升 5-10 倍。同样的客户费用，时薪翻 8 倍。",
    toolStack: [
      { toolSlug: "claude-code", role: "合同 / 财报 / 提案 主力" },
      { toolSlug: "kimi", role: "长文档总结（200 万字）" },
      { toolSlug: "perplexity", role: "调研竞品 / 行业数据" },
      { toolSlug: "manus", role: "复杂多步任务" },
    ],
    benchmarks: [
      {
        name: "Harvey",
        emoji: "⚖️",
        oneliner: "律所 AI 助手",
        metric: "$80M ARR · 200 律所",
      },
      {
        name: "某中型律所",
        emoji: "📜",
        oneliner: "AI 合同审阅",
        metric: "4h → 30min",
        team: "30 人",
      },
    ],
    workflow: [
      "建立企业内部知识库（RAG）",
      "AI 出合同 / 提案 / 报告初稿",
      "Senior 审核（5x 速度）",
      "客户交付前最后 review",
      "数据回流到 RAG（自学习）",
    ],
    moxieService: {
      name: "服务业 AI 落地",
      price: "联系评估",
      desc: "RAG 知识库 + 工作流 + 私有化部署可选，12 周交付。",
      href: "/services#buildout",
    },
    faq: [
      {
        q: "客户数据怎么保护？",
        a: "私有化部署 + 数据脱敏 + 审计日志。律所 / 金融客户都走这套。",
      },
    ],
  },

  // 服务业 × 变现
  {
    industrySlug: "service",
    purposeSlug: "monetization",
    title: "服务业怎么用 AI 提价（保住利润率）",
    metaTitle: "咨询公司 AI 变现 — AI 不是降价，是提价",
    metaDesc: "咨询 / 律所 / 财税公司用 AI 提效后怎么定价：保住利润率，让 AI 红利留给自己。",
    hero: "AI 把成本砍一半，但客户费用别降 — 利润率从 30% 跳到 60%，AI 红利全是你的",
    intro:
      "服务业用 AI 最容易犯的错是「**把成本节省让给客户**」。正确做法是：AI 砍成本，但收费保持。利润率从 30% 跳到 60%，AI 红利全留给自己。",
    toolStack: [
      { toolSlug: "claude-code", role: "高质量交付物（保持高定价）" },
      { toolSlug: "perplexity", role: "客户调研" },
      { toolSlug: "n8n", role: "客户管理自动化" },
    ],
    benchmarks: [
      {
        name: "某中型律所",
        emoji: "📜",
        oneliner: "合同审阅 4h → 30min",
        metric: "时薪 ×8",
        team: "30 人",
      },
    ],
    workflow: [
      "成本透明化：算清楚每个交付物的真实人时",
      "AI 压成本：合同 / 提案 / 报告先用 AI 出初稿",
      "保持收费：客户看到的还是「Senior 律师亲做」",
      "增加交付物：用省下的时间多做几份",
      "差异化定价：AI 速度变成「24 小时交付」溢价",
    ],
    moxieService: {
      name: "服务业 AI 落地",
      price: "联系评估",
      desc: "RAG 知识库 + 工作流 + 提案模板。",
      href: "/services#buildout",
    },
    faq: [
      {
        q: "客户知道我用 AI 会不会要求降价？",
        a: "B 端客户买的是「**结果 + 责任**」，不是工时。只要交付质量稳定，定价不变。",
      },
    ],
  },
];

export function getIntersection(
  industrySlug: string,
  purposeSlug: string
): Intersection | undefined {
  return intersections.find(
    (i) => i.industrySlug === industrySlug && i.purposeSlug === purposeSlug
  );
}

export function getIntersectionsByIndustry(industrySlug: string): Intersection[] {
  return intersections.filter((i) => i.industrySlug === industrySlug);
}

export function getIntersectionsByPurpose(purposeSlug: string): Intersection[] {
  return intersections.filter((i) => i.purposeSlug === purposeSlug);
}
