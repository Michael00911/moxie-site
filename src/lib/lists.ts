import { tools } from "./data";
import type { Tool } from "./types";

export type CuratedList = {
  slug: string;
  title: string;
  emoji: string;
  hero: string;
  description: string;
  gradient: string;
  metaTitle: string;
  metaDesc: string;
  intro: string; // long-form intro for SEO (300-500 words)
  filter: (tools: Tool[]) => Tool[];
  sortBy?: "rating" | "recent" | "name";
  highlightTags: string[];
  faq: { q: string; a: string }[];
};

const hasTag = (t: Tool, ...keywords: string[]) =>
  keywords.some((k) => t.tags.some((tag) => tag.includes(k)));

export const curatedLists: CuratedList[] = [
  {
    slug: "chinese-ai",
    title: "国产 AI 工具榜",
    emoji: "🇨🇳",
    hero: "中文用户首选，2026 年最值得用的国产 AI 工具",
    description:
      "字节、阿里、腾讯、Moonshot、深度求索等国产团队做的 AI 工具集合。中文友好、国内访问稳、支付方便。",
    gradient: "from-red-50 via-orange-50/40 to-amber-50",
    metaTitle: "国产 AI 工具榜 2026 — 中文用户首选 AI 软件清单",
    metaDesc: "收录字节、阿里、深度求索、Moonshot 等国产团队做的 AI 工具。中文支持、国内可用、支付方便。子墨亲测筛选。",
    intro:
      "对中国用户来说，海外 AI 工具有 3 个绕不过去的坎：访问限制、支付障碍、中文效果差。这份榜单只收录国产团队做的 AI 工具 — 服务器在国内、支持微信/支付宝、中文场景效果优于海外同类。包括字节即梦（视频）、深度求索 DeepSeek（API）、Moonshot Kimi（长文本）、阿里通义、腾讯混元、豆包（综合）等主力产品。每款都标注了具体使用场景、价格和子墨的实际评分。",
    filter: (ts) =>
      ts.filter((t) => hasTag(t, "国产", "字节", "阿里", "腾讯", "Moonshot")),
    sortBy: "rating",
    highlightTags: ["#中文优化", "#国内访问", "#微信支付"],
    faq: [
      {
        q: "国产 AI 和海外 AI 哪个好？",
        a: "看场景。中文写作 / 国内业务用国产更顺，复杂推理 / 编程任务海外（Claude / GPT）暂时领先。日常 80% 任务国产够用且便宜得多。",
      },
      {
        q: "DeepSeek 和 Claude 差距有多大？",
        a: "DeepSeek V3/R1 综合能力达到 Claude 85-90%，但成本只有 1/10。代码任务略弱于 Claude Code，写作 / 翻译 / 总结基本无差。",
      },
      {
        q: "国产 AI 工具能用于商业吗？",
        a: "能。豆包、即梦、Kimi 等都有商业 API 和企业方案。部分国产工具甚至已经过等保 / ISO 认证，金融 / 政府客户也能用。",
      },
    ],
  },
  {
    slug: "open-source-ai",
    title: "开源 AI 工具榜",
    emoji: "🔓",
    hero: "可自托管、可二开、零厂商绑定",
    description:
      "完全开源的 AI 模型 / 框架 / 工具集合。适合需要数据合规、私有化部署、长期不被厂商卡脖子的团队。",
    gradient: "from-emerald-50 via-teal-50/40 to-cyan-50",
    metaTitle: "开源 AI 工具榜 2026 — 自托管 / 私有化 / 零厂商绑定",
    metaDesc: "DeepSeek、Qwen、n8n 等开源 AI 工具清单。可商用、可自托管、可二开。适合企业私有化部署。",
    intro:
      "闭源 AI 工具有 3 个企业级风险：账号封禁、API 涨价、数据合规。开源工具规避这一切。本榜单收录主流开源 AI 模型（DeepSeek、Qwen、Llama 系列）+ 开源 AI 框架（n8n、Dify、LangChain）+ 开源 AI 应用工具（tldraw、Excalidraw 等）。重点标注是否可商用、自托管难度、社区活跃度。每个都附带子墨实测的部署成本和性能数据。",
    filter: (ts) => ts.filter((t) => hasTag(t, "开源")),
    sortBy: "rating",
    highlightTags: ["#可自托管", "#可商用", "#零绑定"],
    faq: [
      {
        q: "开源 AI 模型可以商用吗？",
        a: "DeepSeek、Qwen、Llama 系列大多数采用 Apache 2.0 / MIT / Apache 改良许可，商用没问题。但需检查具体版本许可，部分对月活用户超 7 亿的产品有限制。",
      },
      {
        q: "自托管开源 AI 模型成本多少？",
        a: "70B 参数模型推理大约需要 4-8 张 A100 / H100，月成本 ¥3-5 万。中小企业更建议用云 API（DeepSeek 官方 API 1/10 成本）+ RAG 架构。",
      },
      {
        q: "开源工具适合哪些公司？",
        a: "三类：1) 数据敏感行业（金融 / 医疗 / 政府）；2) 月 token 消耗 > $1k 的团队（自托管比 API 便宜）；3) 需要深度二开 / 模型微调的团队。",
      },
    ],
  },
  {
    slug: "free-ai-tools",
    title: "免费 AI 工具榜",
    emoji: "🎁",
    hero: "0 元党友好，完全免费的 AI 工具",
    description:
      "完全免费 / 免费额度足够日常用 / 无需付费的 AI 工具集合。适合个人用户、学生、刚起步的创业者。",
    gradient: "from-yellow-50 via-amber-50/40 to-orange-50",
    metaTitle: "免费 AI 工具榜 2026 — 0 元党友好的 AI 软件清单",
    metaDesc: "完全免费或免费额度足够日常用的 AI 工具清单。子墨亲测，避雷「免费试用 7 天」型套路。",
    intro:
      "「免费 AI 工具」这个关键词搜出来 90% 是骗局：要么注册要信用卡，要么免费额度只够试 5 次。这份榜单只收录 3 类：1) 真完全免费（如 Kimi、豆包、tldraw）；2) 免费额度足够日常用（每天 100 次以上）；3) 一次性买断没有订阅。每款都标注真实的免费阈值，不夸大。",
    filter: (ts) => ts.filter((t) => t.pricing === "free" || t.pricing === "freemium"),
    sortBy: "rating",
    highlightTags: ["#真免费", "#无需信用卡", "#永久免费额度"],
    faq: [
      {
        q: "完全免费的 AI 工具有哪些？",
        a: "国产里 Kimi、豆包、文心一言基础版、通义千问基础版都是完全免费。国外 Perplexity 免费版、Cursor 免费版、Claude 限额免费版也够日常用。",
      },
      {
        q: "免费 AI 工具能商用吗？",
        a: "看具体许可。豆包 / Kimi 个人用没问题，企业商用建议升级商业版。Claude / ChatGPT 免费版禁止商用，需买 API。",
      },
      {
        q: "免费 AI 工具够做内容创作吗？",
        a: "够。子墨的早期内容全部用免费工具产出：豆包写文案 + 即梦免费额度做图 + Suno 免费 50 次 / 天做 BGM。",
      },
    ],
  },
  {
    slug: "ai-for-creators",
    title: "创作者 AI 工具榜",
    emoji: "🎬",
    hero: "短视频博主 / 自媒体 / 内容创作者必备",
    description:
      "覆盖脚本、配音、视频、图像、音乐、剪辑全流程。子墨说AI 自己做内容用的工具栈。",
    gradient: "from-rose-50 via-pink-50/40 to-fuchsia-50",
    metaTitle: "创作者 AI 工具榜 — 短视频博主 / 自媒体必备 AI 软件",
    metaDesc: "覆盖脚本 / 配音 / 视频 / 图像 / 音乐 / 剪辑全流程的 AI 工具清单。子墨说AI 自用工具栈完整披露。",
    intro:
      "做内容的人最焦虑的是「时间不够」。一条优质视频从选题到上线，传统流程 3-5 天。用对 AI 工具栈，1 个人 1 天能做 3 条。本榜单按内容生产工序分组：选题 / 脚本（Claude、豆包） → 配音（ElevenLabs、Suno）→ 视频（即梦、HeyGen）→ 图像（Midjourney、即梦）→ 剪辑（Filmora、Dina）。每款都标注子墨的实际工作流位置。",
    filter: (ts) =>
      ts.filter((t) =>
        ["video", "image", "audio", "writing"].includes(t.category)
      ),
    sortBy: "rating",
    highlightTags: ["#短视频", "#自媒体", "#内容创作"],
    faq: [
      {
        q: "做抖音 / 小红书需要哪些 AI 工具？",
        a: "最低配 3 件套：豆包（写文案）+ 即梦（出图 / 视频）+ 剪映（剪辑）。进阶可加 ElevenLabs（配音）+ Suno（BGM）+ HeyGen（数字人）。",
      },
      {
        q: "1 个人能做几个账号？",
        a: "用 AI 工具栈 + SOP，1 个人能并行运营 3-5 个账号。子墨内部团队 1 人对应 4 个矩阵号，月产 80+ 条视频。",
      },
      {
        q: "AI 视频会被平台识别降权吗？",
        a: "纯 AI 生成的会，半 AI（真人 + AI 配音 / AI 字幕 / AI 剪辑）不会。建议用 AI 做工具，不做主体。",
      },
    ],
  },
  {
    slug: "ai-for-developers",
    title: "开发者 AI 工具榜",
    emoji: "💻",
    hero: "Vibe Coding 时代的程序员武器库",
    description:
      "AI 编程助手 / Code Agent / Vibe Coding 启动包 / Agent 框架。子墨自己写 SaaS 用的全套。",
    gradient: "from-violet-50 via-purple-50/40 to-fuchsia-50",
    metaTitle: "开发者 AI 工具榜 — Claude Code / Cursor / v0 / Lovable 对比",
    metaDesc: "AI 编程助手 / Code Agent / Vibe Coding 工具清单。子墨自己写 SaaS 的全部装备。",
    intro:
      "2024 年还在讨论「AI 是否会替代程序员」，2026 年讨论的是「不会用 AI 的程序员怎么办」。Vibe Coding 已经是事实标准：1 个人 + Claude Code / Cursor + v0 / Lovable 能在 3 周做出有 ARR 的 SaaS。本榜单按开发流程分类：写代码（Claude Code、Cursor）/ 出 UI（v0、Lovable）/ 做 Agent（n8n、Manus）/ API 网关（DeepSeek 替代）。每款都附子墨实际项目里的使用份额。",
    filter: (ts) =>
      ts.filter((t) => ["coding", "agent"].includes(t.category)),
    sortBy: "rating",
    highlightTags: ["#Vibe Coding", "#AI 编程", "#Agent"],
    faq: [
      {
        q: "Claude Code 和 Cursor 选哪个？",
        a: "Claude Code 适合复杂工程、命令行重度用户。Cursor 适合 UI / 前端、习惯图形界面的人。子墨日常 70% 用 Claude Code、30% 用 Cursor 做演示。",
      },
      {
        q: "v0 和 Lovable 区别？",
        a: "v0 出 React 组件代码，需要自己集成。Lovable 直接给你完整全栈应用，连数据库都搭好。MVP 用 Lovable 快，生产环境推荐 v0 + 自己接管。",
      },
      {
        q: "用 AI 写代码会被取代吗？",
        a: "不写代码的程序员会。会用 AI 写代码的程序员产出是传统的 5-10 倍。建议立刻把工作流切到 Claude Code / Cursor。",
      },
    ],
  },
  {
    slug: "ai-tools-china-access",
    title: "国内可用 AI 工具榜",
    emoji: "🚪",
    hero: "无需 VPN、不用国际信用卡、能正常充值",
    description:
      "在中国大陆能正常访问 / 注册 / 付费的 AI 工具集合。包括国产工具和已经在国内有合规版本的海外工具。",
    gradient: "from-sky-50 via-blue-50/40 to-indigo-50",
    metaTitle: "国内可用 AI 工具榜 — 不用 VPN 的 AI 软件清单",
    metaDesc: "在中国大陆能正常访问、注册、付费的 AI 工具清单。包括国产工具和合规海外工具。",
    intro:
      "在中国用海外 AI 工具有三道坎：网络访问、信用卡支付、合规风险。这份榜单按访问难度分级：A 级（直接访问 + 国内支付）/ B 级（需简单代理但支付简单）/ C 级（强制需要海外身份）。子墨自己每周更新一次，根据实际访问情况调整。",
    filter: (ts) =>
      ts.filter(
        (t) =>
          hasTag(t, "国产", "字节", "阿里", "腾讯", "Moonshot") ||
          ["doubao", "kimi", "deepseek", "dreamina", "qwen", "manus"].includes(
            t.slug
          )
      ),
    sortBy: "rating",
    highlightTags: ["#国内可访问", "#微信/支付宝", "#合规"],
    faq: [
      {
        q: "国内可以正常用 ChatGPT 吗？",
        a: "ChatGPT 官方在国内不可用。国内可用的 GPT 镜像 / API 代理也存在合规风险，建议用国产替代（豆包、Kimi、DeepSeek）。",
      },
      {
        q: "Cursor 国内能用吗？",
        a: "Cursor 编辑器本身能下载，但调用模型要走 OpenAI 或 Anthropic API。国内用户建议接 DeepSeek 或国内代理 API。",
      },
      {
        q: "Midjourney 国内怎么用？",
        a: "Midjourney 主站访问不稳定。建议用国产替代：即梦（字节）/ 文心一格（百度）/ 通义万相（阿里），效果接近且国内稳定。",
      },
    ],
  },
  {
    slug: "ai-with-affiliate",
    title: "高佣 Affiliate AI 工具",
    emoji: "💰",
    hero: "推荐能赚钱的 AI 工具，分成 30-50%",
    description:
      "适合做内容 / 自媒体 / 独立开发者推广的 AI 工具。佣金率高、Cookie 期长、提现门槛低。",
    gradient: "from-amber-50 via-yellow-50/40 to-lime-50",
    metaTitle: "高佣 AI 工具 Affiliate 清单 — 推荐能赚 30-50% 分成",
    metaDesc: "适合内容创作者推广的 AI 工具 Affiliate 清单。佣金率 30-50%、Cookie 90+ 天、月度结算。",
    intro:
      "做 AI 内容最容易变现的方式不是卖课，是推工具。Affiliate 模式下，你只需要写一篇真实测评，工具方付你 30-50% 分成。本榜单按佣金率排序，标注 Cookie 时长、最低提现金额、品牌方信誉。子墨自己每月通过 Affiliate 收入 $3k-8k。",
    filter: (ts) =>
      ts.filter(
        (t) =>
          t.affiliateUrl ||
          ["claude-code", "cursor", "v0", "lovable", "elevenlabs", "perplexity", "n8n", "heygen"].includes(t.slug)
      ),
    sortBy: "rating",
    highlightTags: ["#高佣金", "#长 Cookie", "#月度结算"],
    faq: [
      {
        q: "怎么找 AI 工具的 Affiliate 链接？",
        a: "1) 工具官网底部找 Affiliate / Partner / Refer。2) 上 Impact / PartnerStack / Reditus 平台搜索。3) 直接邮件工具方 BD 谈定制方案。",
      },
      {
        q: "国内做海外 Affiliate 怎么收钱？",
        a: "Stripe / Wise / PayPal 是主流。国内用户可注册香港 / 新加坡公司主体（约 ¥5k 一次性）即可正常提现。",
      },
      {
        q: "Affiliate 收入大概多少？",
        a: "做内容 1 年的稳定 Affiliate 月收入 $500-3000。子墨说AI 矩阵月 Affiliate 收入 $3000+，主要来自 Claude / ElevenLabs / Cursor。",
      },
    ],
  },
  {
    slug: "ai-startups-monetizing",
    title: "在赚钱的 AI 初创公司",
    emoji: "💸",
    hero: "已经有 ARR 的 AI SaaS，看看人家怎么做的",
    description:
      "经过验证有真实付费用户的 AI 初创公司清单。MRR / ARR 公开数据，适合做竞品分析或找抄作业目标。",
    gradient: "from-lime-50 via-green-50/40 to-emerald-50",
    metaTitle: "在赚钱的 AI 初创公司榜 — MRR / ARR 公开数据",
    metaDesc: "有真实付费用户的 AI 初创公司清单。MRR / ARR / 估值 / 团队规模数据公开。竞品分析必备。",
    intro:
      "做 AI 项目最忌讳的是闭门造车。这份榜单收录已经跑出 MRR 的 AI 初创公司，按月营收分级（$1k-10k MRR / $10k-100k MRR / $100k+ MRR）。每家都标注：团队规模、上线时间、流量来源、获客成本估算、定价策略。子墨从 IndieHackers / X / 财报里整理。",
    filter: (ts) =>
      ts.filter((t) =>
        ["claude-code", "cursor", "lovable", "v0", "perplexity", "elevenlabs", "manus", "heygen", "claimly"].includes(t.slug) || t.level === "L1"
      ),
    sortBy: "rating",
    highlightTags: ["#MRR 公开", "#$1k+ ARR", "#可复制"],
    faq: [
      {
        q: "怎么查 AI 公司的 MRR 数据？",
        a: "1) IndieHackers Products 页有公开 MRR。2) X 上创始人会发图。3) 财报公司看年报 / Q 报。4) Pipiads 这类工具有抓取数据。",
      },
      {
        q: "$10k MRR 的 AI SaaS 容易做吗？",
        a: "在 2026 年仍是大多数 AI SaaS 的目标。子墨观察过的项目里：找对垂直场景 + 投放跑通后，6-12 个月达到 $10k MRR 不算难。",
      },
      {
        q: "这些公司的获客成本多少？",
        a: "ToC 类大约 $3-15 单用户 CAC，SEO + 内容主导。ToB 类 $50-500 CAC，看销售周期。Affiliate 是性价比最高的获客方式之一。",
      },
    ],
  },
];

export function getCuratedListBySlug(slug: string): CuratedList | undefined {
  return curatedLists.find((l) => l.slug === slug);
}

export function getListedTools(list: CuratedList): Tool[] {
  let result = list.filter(tools);
  if (list.sortBy === "rating") {
    result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (list.sortBy === "recent") {
    result = [...result].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else if (list.sortBy === "name") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  }
  return result;
}
