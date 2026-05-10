// ====== 用途分类（按帮企业做什么分类）======

export type Purpose = {
  slug: string;
  name: string;
  emoji: string;
  question: string;       // "你想..."
  description: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  toolSlugs: string[];    // 关联的 tool slugs
  workflow: string[];
  caseStudies: { client: string; outcome: string; metric: string; emoji: string }[];
  moxieService?: { name: string; price: string; href: string; desc: string };
  faq: { q: string; a: string }[];
  gradient: string;
  color: string;
};

export const purposes: Purpose[] = [
  {
    slug: "design",
    name: "帮企业做设计",
    emoji: "🎨",
    question: "你想用 AI 做图 / 出视频 / 设计素材",
    description: "设计 / 素材 / 视频 / UI 工具组合",
    metaTitle: "帮企业做设计的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 帮企业做设计：图像 / 视频 / UI / 素材工厂，工具组合 + 案例 + 服务方案。",
    intro:
      "设计的边际成本被 AI 砍到接近 0：素材从 ¥500-2000/条降到 ¥10-50/条，视频从 ¥5k 降到 ¥100。这一页收录企业设计场景下最值钱的工具栈和落地案例。",
    toolSlugs: ["dreamina", "midjourney", "v0", "lovable", "heygen"],
    workflow: [
      "需求清单：先把「要什么风格 / 用在哪」写清楚",
      "AI 出主图：即梦 Maestro / Midjourney / Flux 三选一",
      "AI 视频化：HeyGen 数字人或即梦图生视频",
      "UI 组件：v0 / Lovable 直接出 React 代码",
      "人工 finetune：剪映 / Photoshop 最后调整",
    ],
    caseStudies: [
      {
        client: "某家具出海品牌",
        outcome: "搭建 AI 素材工厂，每周产出 200 条",
        metric: "素材成本下降 73%",
        emoji: "🛋️",
      },
      {
        client: "某连锁餐饮",
        outcome: "外卖封面图 / 短视频自动生成",
        metric: "30 店共用，月成本 -¥20k",
        emoji: "🍱",
      },
      {
        client: "某 SaaS 公司",
        outcome: "落地页 + UI Demo 视频生成",
        metric: "上线速度 ×3",
        emoji: "🚀",
      },
    ],
    moxieService: {
      name: "AI 素材工厂托管",
      price: "联系评估",
      href: "/services#growth-content",
      desc: "替企业产出全部图 / 视频 / 落地页素材，按月计费。",
    },
    faq: [
      {
        q: "AI 设计能直接给客户用吗？",
        a: "B 端做营销素材没问题。高端品牌发布会还需要人工设计师把关。",
      },
      {
        q: "版权归谁？",
        a: "付费工具（即梦 VIP / MJ / Runway 商业版）生成的素材版权归你。建议保留 prompt 记录。",
      },
      {
        q: "中文场景哪个工具最好？",
        a: "即梦 Maestro 综合最佳：中文 prompt + 国内访问 + 微信支付 + 质量接近 MJ。",
      },
    ],
    gradient: "from-rose-100 to-pink-50",
    color: "rose",
  },

  {
    slug: "operations",
    name: "帮企业做运营",
    emoji: "⚙️",
    question: "你想自动化重复工作 / 流程",
    description: "工作流 / 自动化 / Agent 工具组合",
    metaTitle: "帮企业做运营的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 自动化运营：工作流 / Agent / RPA / 数据处理工具组合 + 案例 + 服务方案。",
    intro:
      "运营的本质是「重复劳动」。AI Agent + 工作流自动化把 80% 的重复劳动外包给机器，让运营从「执行者」升级为「决策者」。这一页收录企业自动化运营的工具栈和典型场景。",
    toolSlugs: ["n8n", "manus", "claude-code", "deepseek", "fellou"],
    workflow: [
      "梳理 SOP：把人做的事写成 step by step",
      "选自动化平台：n8n / Make / Zapier 三选一",
      "AI 节点：在工作流里嵌 Claude / DeepSeek",
      "Agent 加持：复杂决策环节用 Manus / Fellou",
      "数据看板：飞书表格 / Looker / Metabase",
    ],
    caseStudies: [
      {
        client: "某 30 店连锁",
        outcome: "外卖运营 + 评价管理全自动",
        metric: "节省人力 50%",
        emoji: "🍜",
      },
      {
        client: "某 B 端 SaaS",
        outcome: "Lead 资格筛选 + CRM 入库",
        metric: "销售线索处理 ×5",
        emoji: "📞",
      },
      {
        client: "某跨境电商",
        outcome: "供应链 + 库存 + 投流自动化",
        metric: "运营人员从 8 → 3",
        emoji: "🛍️",
      },
    ],
    moxieService: {
      name: "AI 工作流落地",
      price: "联系评估",
      href: "/services#buildout",
      desc: "梳理 + 设计 + 部署 + 维护一条龙，按业务流程数量计费。",
    },
    faq: [
      {
        q: "n8n 和 Zapier 选哪个？",
        a: "n8n 开源 + 可自托管 + 复杂场景便宜。Zapier 简单场景上手快。Moxie 80% 客户用 n8n。",
      },
      {
        q: "我们没技术团队也能搭吗？",
        a: "n8n 拖拽式，运营人员 1 周能上手简单流程。复杂场景建议让 Moxie 做。",
      },
      {
        q: "Agent 真的能替代人吗？",
        a: "替代不了，但能替你跑 80% 重复 / 调研 / 整理。建议把这类外包给 Agent。",
      },
    ],
    gradient: "from-amber-100 to-orange-50",
    color: "amber",
  },

  {
    slug: "growth",
    name: "帮企业做流量",
    emoji: "📈",
    question: "你想做 SEO / 内容 / 投放 / 增长",
    description: "SEO / 内容 / 投放 / 数据分析工具组合",
    metaTitle: "帮企业做流量的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 帮企业做流量：SEO / 内容 / 投放 / KOL / 多平台矩阵工具 + 服务方案。",
    intro:
      "流量是企业最贵的成本。AI 把「内容生产 / SEO / 投放素材 / KOL 投放」每一环成本砍到 1/5。1 个人 + AI 工具栈能跑出过去 5 人团队的流量。这一页收录流量场景的工具栈 + 实战打法。",
    toolSlugs: ["claude-code", "doubao", "perplexity", "dreamina", "elevenlabs", "heygen"],
    workflow: [
      "找信息差：Perplexity / Reddit / X 调研",
      "选题清单：Claude 帮你 1 小时出 30 个选题",
      "内容批产：豆包写中文 + Claude 写英文 + 即梦出图",
      "多平台分发：抖音 / 小红书 / X / TikTok 同时铺",
      "数据闭环：每周看哪个跑出来 → 加大投入",
    ],
    caseStudies: [
      {
        client: "某国产 AI SaaS",
        outcome: "Moxie 全案代运营 6 个月",
        metric: "MAU 5k → 50k（10×）",
        emoji: "🚀",
      },
      {
        client: "某独立开发者",
        outcome: "TikTok 美区无人账号矩阵",
        metric: "5 个号 80万粉丝",
        emoji: "🎬",
      },
      {
        client: "某出海工具",
        outcome: "Featured 赞助 + 视频测评",
        metric: "2.3k 注册 / ¥1.99 单 CAC",
        emoji: "🌐",
      },
    ],
    moxieService: {
      name: "Moxie 内容代运营",
      price: "联系评估",
      href: "/services#growth-content",
      desc: "20-40 篇 SEO 文 + 多平台分发 + AI 视频，按月计费。",
    },
    faq: [
      {
        q: "0 粉丝起号要多久？",
        a: "新号 1 个月内能到 1k-5k 粉丝（按 SOP）。爆款依赖运气，但 SOP + AI 能保底。",
      },
      {
        q: "投流和内容怎么平衡？",
        a: "0-1 期靠内容（验证选题），1-10 期内容 + 投流（放大爆款），10+ 全投流（已知 ROI）。",
      },
      {
        q: "AI 写的内容会被识别吗？",
        a: "纯 AI 会被降权。「人工选题 + AI 写初稿 + 人工改写 + AI 配图」组合最优。",
      },
    ],
    gradient: "from-emerald-100 to-teal-50",
    color: "emerald",
  },

  {
    slug: "monetization",
    name: "帮企业赚钱",
    emoji: "💰",
    question: "你想找变现路径 / 提升 ARR",
    description: "变现 / 转化 / 订阅 / 复购工具组合",
    metaTitle: "帮企业赚钱的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 帮企业变现：付费转化 / 订阅 / 复购 / 客户增收工具组合 + 案例。",
    intro:
      "做生意最终回到一件事：赚钱。AI 把「找付费意愿 / 优化定价 / 提升转化 / 增加复购」这些原本靠老板经验的工作变成数据驱动。这一页收录企业变现场景的工具栈和真实案例。",
    toolSlugs: ["claude-code", "n8n", "perplexity", "doubao", "manus"],
    workflow: [
      "用户分析：把过往订单 / 用户行为给 Claude 找模式",
      "定价优化：A/B 测试不同定价，Claude 算 LTV / 利润",
      "推荐引擎：基于用户行为的产品推荐（n8n + 向量库）",
      "复购自动化：邮件 / 短信 / 私域分群推送",
      "客户成功：AI 答疑 + 续费提醒 + 优惠券",
    ],
    caseStudies: [
      {
        client: "某 SaaS 厂商",
        outcome: "Pricing A/B + 续费自动化",
        metric: "ARPU +28% / 续费率 +18%",
        emoji: "💎",
      },
      {
        client: "某教育公司",
        outcome: "AI 推荐课程 + 私域复购",
        metric: "二次购买率 12% → 35%",
        emoji: "📚",
      },
      {
        client: "某连锁茶饮",
        outcome: "会员分群 + 个性化优惠券",
        metric: "月复购 ×2",
        emoji: "🧋",
      },
    ],
    moxieService: {
      name: "AI 变现优化包",
      price: "联系评估",
      href: "/services#buildout",
      desc: "Pricing 模型 + 推荐引擎 + 私域自动化，4 周交付。",
    },
    faq: [
      {
        q: "AI 真的能提升变现吗？",
        a: "能。但前提是已有用户数据。0-1 期产品先做用户增长，再上变现 AI。",
      },
      {
        q: "私域复购怎么自动化？",
        a: "n8n + AI 客服 + 微信生态 / 飞书生态。按用户标签自动分群发送。",
      },
      {
        q: "Pricing A/B 多久能看到结果？",
        a: "B 端订阅类 1-3 个月。C 端零售类 2-4 周。前提是流量足够（>1万 UV/月）。",
      },
    ],
    gradient: "from-yellow-100 to-amber-50",
    color: "yellow",
  },

  {
    slug: "customer",
    name: "帮企业做客服",
    emoji: "💬",
    question: "你想用 AI 答疑 / 处理工单",
    description: "客服 / 工单 / 答疑 / 销售线索工具组合",
    metaTitle: "帮企业做客服的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 帮企业做客服：工单自动化 / RAG 知识库 / 销售线索筛选工具 + 服务方案。",
    intro:
      "客服是大多数企业的「成本黑洞」 — 30 人客服团队，70% 在重复回答。AI Agent 把这部分 70% 的工单自动解决，剩下 30% 转人工，客服成本降 50%+。这一页收录客服自动化的工具栈和「服务即软件」托管模式。",
    toolSlugs: ["claude-code", "deepseek", "n8n", "manus"],
    workflow: [
      "工单数据导出：过去 6 个月所有客户问题分类",
      "RAG 知识库：用 Claude / DeepSeek + 向量数据库",
      "Agent 设计：80% 简单问题 AI 答 / 20% 转人工",
      "对接工单系统：飞书 / 钉钉 / 腾讯客服 / Zendesk",
      "持续学习：未解决工单回流到训练数据",
    ],
    caseStudies: [
      {
        client: "某 SaaS 厂商",
        outcome: "L1 工单 70% AI 一次性解决",
        metric: "客服成本 -45%",
        emoji: "📞",
      },
      {
        client: "某 30 店餐饮",
        outcome: "外卖差评回复全自动",
        metric: "回复时长 24h → 5min",
        emoji: "🍱",
      },
      {
        client: "某轻医美连锁",
        outcome: "AI 客服 + 预约对接",
        metric: "预约转化 +30%",
        emoji: "💉",
      },
    ],
    moxieService: {
      name: "AI 客服托管",
      price: "联系评估",
      href: "/services#managed-cs",
      desc: "全权运营 AI 客服，按解决工单数计费。包工具 + token + 人力。",
    },
    faq: [
      {
        q: "AI 客服会乱回吗？",
        a: "RAG 架构下基于自有知识库回答，幻觉率 <5%。+ 设计「不确定就转人工」兜底。",
      },
      {
        q: "客户数据安全吗？",
        a: "可选私有化部署。AI 模型用国内 DeepSeek / Qwen，数据不出境。",
      },
      {
        q: "我们没技术团队也能用吗？",
        a: "可以选 Moxie 托管模式：我们承包整套，按工单数计费 ¥1.5/单。",
      },
    ],
    gradient: "from-blue-100 to-sky-50",
    color: "blue",
  },

  {
    slug: "dev",
    name: "帮企业做研发",
    emoji: "💻",
    question: "你想用 AI 写代码 / 做产品",
    description: "AI 编程 / 产品开发 / Agent 工具组合",
    metaTitle: "帮企业做研发的 AI 工具 — Moxie 用途页",
    metaDesc: "AI 帮企业做研发：Claude Code / Cursor / v0 / Lovable 工具栈 + Vibe Coding 实战。",
    intro:
      "Vibe Coding 已经是事实标准：1 个人 + Claude Code + v0 = 过去 5 人团队的产出。AI 让原本要 6 个月的 SaaS 项目压缩到 3 周。这一页收录企业研发场景的 AI 工具栈和落地路径。",
    toolSlugs: ["claude-code", "cursor", "v0", "lovable", "deepseek"],
    workflow: [
      "需求 PRD：用 Claude 把模糊需求变成可执行 PRD",
      "原型 demo：Lovable / v0 1 周出可点击 demo",
      "正式开发：Cursor / Claude Code 写生产级代码",
      "API 接入：DeepSeek 后端（成本 1/10）",
      "部署：Vercel / Supabase / Stripe 一键上线",
    ],
    caseStudies: [
      {
        client: "Claimly",
        outcome: "1 个人 3 周做完上线",
        metric: "$8.5k MRR",
        emoji: "✈️",
      },
      {
        client: "Moxie 工具站（你正在看）",
        outcome: "1 天搭起完整工具站",
        metric: "23 工具 + 60+ 页",
        emoji: "📒",
      },
      {
        client: "某企业内部工具",
        outcome: "Cursor 团队订阅 + Claude Code",
        metric: "研发效率 ×3",
        emoji: "🛠️",
      },
    ],
    moxieService: {
      name: "Vibe Coding 启动包",
      price: "联系评估",
      href: "/services#starter-stack",
      desc: "我自用的 Next.js + Supabase + Stripe + Stripe 项目模板。",
    },
    faq: [
      {
        q: "Claude Code vs Cursor 怎么选？",
        a: "复杂工程 / 命令行党 → Claude Code。前端 / UI / 演示 → Cursor。看 /compare/claude-code-vs-cursor",
      },
      {
        q: "国内开发者能用吗？",
        a: "Claude Code / Cursor 需要科学上网。Cline + DeepSeek API 是无 VPN 国内最佳替代。",
      },
      {
        q: "团队怎么落地 AI 编程？",
        a: "1) 1-2 个 Senior 试用 2 周 → 2) 内部分享 best practices → 3) 团队订阅 → 4) 把 PR Review 流程也改造。",
      },
    ],
    gradient: "from-violet-100 to-fuchsia-50",
    color: "violet",
  },
];

export function getPurposeBySlug(slug: string): Purpose | undefined {
  return purposes.find((p) => p.slug === slug);
}
