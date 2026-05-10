// ====== Compare 对比页 ======

export type CompareTool = {
  name: string;
  vendor: string;
  toolSlug?: string;
  emoji: string;
  tagline: string;
  pricing: string;
  pros: string[];
  cons: string[];
};

export type Compare = {
  slug: string;
  a: CompareTool;
  b: CompareTool;
  title: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  dimensions: { name: string; a: string; b: string; winner?: "a" | "b" | "tie" }[];
  scenarios: { title: string; pick: "a" | "b" | "tie"; reason: string }[];
  verdict: string;
  faq: { q: string; a: string }[];
};

export const compares: Compare[] = [
  {
    slug: "claude-vs-chatgpt",
    title: "Claude vs ChatGPT 终极对比",
    metaTitle: "Claude vs ChatGPT 2026 — 子墨亲测 6 个场景告诉你怎么选",
    metaDesc: "Claude 4.7 和 ChatGPT 5 全面对比：编程 / 写作 / 推理 / 长文 / API 价格 / 中文。子墨实测 1000 次给的结论。",
    intro:
      "Anthropic Claude 和 OpenAI ChatGPT 是 2026 年仍并驾齐驱的两大通用 AI 助手。两者各有强项：Claude 在长文和编程上更稳，ChatGPT 在多模态和创意上更新更快。这篇对比基于子墨过去 6 个月的实际使用数据，按不同任务场景给出推荐。",
    a: {
      name: "Claude",
      vendor: "Anthropic",
      emoji: "🧠",
      tagline: "Anthropic 出品的稳定型大模型",
      pricing: "免费 + Pro $20/月 + API 按 token",
      pros: [
        "1M token 超长上下文",
        "编程任务更稳，少幻觉",
        "写作风格更自然，少模板感",
        "Claude Code 是顶级 AI 编程工具",
      ],
      cons: [
        "国内访问需代理",
        "不支持图像生成 / 视频",
        "新模型迭代节奏慢于 OpenAI",
      ],
    },
    b: {
      name: "ChatGPT",
      vendor: "OpenAI",
      emoji: "🤖",
      tagline: "OpenAI 旗舰大模型助手",
      pricing: "免费 + Plus $20/月 + API 按 token",
      pros: [
        "多模态完整（图 / 视频 / 语音 / 浏览）",
        "GPTs 商店有海量定制助手",
        "Sora 视频集成",
        "市占率最大，生态最完整",
      ],
      cons: [
        "长任务容易掉细节",
        "代码任务略弱于 Claude",
        "Hallucination 在复杂逻辑题更频繁",
      ],
    },
    dimensions: [
      { name: "上下文长度", a: "1M tokens", b: "128k tokens", winner: "a" },
      { name: "代码生成质量", a: "顶级", b: "优秀", winner: "a" },
      { name: "中文能力", a: "优秀", b: "优秀", winner: "tie" },
      { name: "多模态", a: "图像理解", b: "图 / 视频 / 语音 / 浏览", winner: "b" },
      { name: "API 价格 (输入)", a: "$3/1M", b: "$2.5/1M", winner: "b" },
      { name: "国内访问", a: "需代理", b: "需代理", winner: "tie" },
      { name: "生态 / 插件", a: "MCP + Artifacts", b: "GPTs Store + 插件", winner: "b" },
      { name: "推理深度", a: "Extended thinking", b: "o3 / o4-mini", winner: "tie" },
    ],
    scenarios: [
      { title: "写代码 / Vibe Coding", pick: "a", reason: "Claude Code + 1M 上下文吊打。" },
      { title: "做内容 / 创意写作", pick: "a", reason: "Claude 写出来的文字更像人，少 GPT 模板腔。" },
      { title: "处理长文档（合同/财报）", pick: "a", reason: "1M 上下文 Claude 独占。" },
      { title: "图像 / 视频生成", pick: "b", reason: "Sora + DALL-E 直接集成。" },
      { title: "需要联网 / 调研", pick: "b", reason: "ChatGPT 自带浏览能力。" },
      { title: "做营销 / 多账号 GPTs", pick: "b", reason: "GPTs Store 生态丰富。" },
    ],
    verdict:
      "我的工作流里 Claude 占 70%，ChatGPT 占 30%。如果只能留一个：写代码 / 做内容选 Claude，做营销 / 多模态选 ChatGPT。预算够建议两个都订（合计 $40/月），切换使用。",
    faq: [
      {
        q: "Claude 和 ChatGPT 哪个更适合中国用户？",
        a: "都需要科学上网。但 Claude 的中文写作风格更自然，ChatGPT 的中文偶尔会有翻译腔。如果不想翻墙，国产里 Kimi（长文本）+ DeepSeek（推理）+ 豆包（综合）能覆盖 90% 任务。",
      },
      {
        q: "Claude Pro 和 ChatGPT Plus 哪个值得订？",
        a: "都是 $20/月。Claude Pro 配额更慷慨（5 倍免费版），适合重度用户。ChatGPT Plus 自带 GPTs / Sora / Voice，多模态需求更值。你的工作内容偏代码 / 写作选 Claude，偏营销 / 创意选 GPT。",
      },
      {
        q: "用 API 怎么选？",
        a: "成本敏感选 GPT-4.1 mini 或 Claude Haiku（都是 $0.5-1/1M 级别）。质量第一选 Claude Sonnet 4 或 GPT-5。如果在国内做产品后端，建议接 DeepSeek API（成本只有他们的 1/10）。",
      },
    ],
  },
  {
    slug: "claude-code-vs-cursor",
    title: "Claude Code vs Cursor 怎么选",
    metaTitle: "Claude Code vs Cursor 2026 — 真人实测 1 个月对比",
    metaDesc: "终端 Claude Code vs 编辑器 Cursor：哪个更快、更准、更省钱？子墨连用 1 个月给的决策树。",
    intro:
      "Claude Code 和 Cursor 是 2026 年顶级的两个 AI 编程工具，但形态完全不同：Claude Code 是终端 CLI，Cursor 是 VSCode 改造的编辑器。子墨同时使用 6 个月，按真实开发场景给出推荐。",
    a: {
      name: "Claude Code",
      vendor: "Anthropic",
      toolSlug: "claude-code",
      emoji: "⌨️",
      tagline: "Anthropic 官方终端 AI 编程助手",
      pricing: "Claude Pro $20/月 (含) 或 API",
      pros: [
        "原生终端，能直接跑命令 / 改文件",
        "Plan + Apply 模式更可控",
        "1M 上下文 + Sonnet 4 模型组合",
        "Sub-Agent / Hooks 等高阶玩法",
        "适合大型工程",
      ],
      cons: [
        "命令行界面，新手有学习曲线",
        "图形 UI 工作流不如 Cursor 直观",
        "Mac/Linux 友好，Windows 略麻烦",
      ],
    },
    b: {
      name: "Cursor",
      vendor: "Anysphere",
      toolSlug: "cursor",
      emoji: "🖱️",
      tagline: "VSCode 改造的 AI 编辑器",
      pricing: "$20/月 Pro",
      pros: [
        "VSCode 体验，几乎零迁移成本",
        "Composer + Tab 自动补全惊艳",
        "适合前端 / UI 开发可视化",
        "Background Agents 可后台跑任务",
      ],
      cons: [
        "复杂工程容易丢上下文",
        "改文件后需要手动审阅",
        "对超长 prompt 不如 Claude Code 稳",
      ],
    },
    dimensions: [
      { name: "界面形态", a: "终端 CLI", b: "VSCode 编辑器", winner: "tie" },
      { name: "上下文长度", a: "1M", b: "200k", winner: "a" },
      { name: "复杂工程稳定性", a: "顶级", b: "良好", winner: "a" },
      { name: "前端 / UI 开发体验", a: "中等", b: "优秀", winner: "b" },
      { name: "学习曲线", a: "中等", b: "低", winner: "b" },
      { name: "可控性 / 安全感", a: "高（Plan 模式）", b: "中", winner: "a" },
      { name: "价格", a: "$20/月（含 Claude Pro）", b: "$20/月", winner: "tie" },
      { name: "Background 任务", a: "支持", b: "支持", winner: "tie" },
    ],
    scenarios: [
      { title: "做大型工程 / 重构", pick: "a", reason: "1M 上下文 + Plan 模式更稳。" },
      { title: "做前端 / UI 调试", pick: "b", reason: "Cursor 的可视化优势明显。" },
      { title: "脚本 / 工具开发", pick: "a", reason: "终端环境完美贴合。" },
      { title: "演示 / 直播给非程序员看", pick: "b", reason: "Cursor 视觉化，观众容易看懂。" },
      { title: "新手入门 AI 编程", pick: "b", reason: "VSCode 起点低。" },
      { title: "公司内部生产代码", pick: "a", reason: "Plan + 审阅模式更安全。" },
    ],
    verdict:
      "我现在的比例是 Claude Code 70% + Cursor 30%。Claude Code 是主力，处理所有需要严肃工程能力的工作。Cursor 留给前端微调和给非程序员演示。如果你只买一个：做后端 / 复杂工程选 Claude Code，做前端 / 创意 demo 选 Cursor。",
    faq: [
      {
        q: "Claude Code 和 Cursor 能同时用吗？",
        a: "完全可以，子墨日常就是同一个项目两个工具切换用。Claude Code 改大块逻辑，Cursor 改 UI 细节。需要两个订阅（合计 $40/月），但产出是单工具的 2 倍。",
      },
      {
        q: "免费替代品有哪些？",
        a: "Cline（VSCode 插件）+ DeepSeek API 是最佳免费组合，单月成本 ¥30-100。配合 Claude 免费版 + 国产 IDE 也能覆盖 80% 任务。",
      },
      {
        q: "Cursor 卡 / 慢怎么办？",
        a: "Cursor 在 100+ 文件项目里容易掉速度。换成 Claude Code 后立刻顺畅。或者 Cursor 设置里关掉 Tab AI 实时补全，只保留 Composer 模式。",
      },
    ],
  },
  {
    slug: "deepseek-vs-claude",
    title: "DeepSeek vs Claude 真实差距",
    metaTitle: "DeepSeek vs Claude — 1000 次实测告诉你能不能替换",
    metaDesc: "DeepSeek V3/R1 真能替换 Claude 吗？6 大场景实测：编程 / 推理 / 写作 / 翻译 / API 成本。结论可能出乎你意料。",
    intro:
      "DeepSeek 让国产模型第一次真正威胁到 Claude 和 GPT。2026 年最常见的问题是「DeepSeek 真能替换 Claude 吗？」。子墨在 6 个真实场景跑了 1000 次对比，按结果分场景告诉你答案。",
    a: {
      name: "DeepSeek",
      vendor: "深度求索",
      toolSlug: "deepseek",
      emoji: "🔮",
      tagline: "国产开源大模型新王者",
      pricing: "API 0.001 元/千 token",
      pros: [
        "API 成本只有 Claude 1/10",
        "国内访问超快，无需代理",
        "开源可商用，可私有化部署",
        "中文场景效果接近 Claude",
        "R1 推理模型逼近 Claude Sonnet",
      ],
      cons: [
        "复杂代码任务弱于 Claude Sonnet 4",
        "上下文 128k，没有 1M 选项",
        "工具调用 / Agent 框架支持不如 Claude",
        "国际市场信任度仍在建立",
      ],
    },
    b: {
      name: "Claude",
      vendor: "Anthropic",
      emoji: "🧠",
      tagline: "Anthropic Sonnet 4 / Opus",
      pricing: "API $3/1M 输入",
      pros: [
        "代码任务顶级",
        "长上下文 1M 独占",
        "工具调用 / MCP 生态完善",
        "国际客户信任度高",
      ],
      cons: [
        "成本 10 倍于 DeepSeek",
        "国内访问需代理",
        "不支持私有化部署",
      ],
    },
    dimensions: [
      { name: "代码生成（简单）", a: "9/10", b: "9.5/10", winner: "tie" },
      { name: "代码生成（复杂）", a: "7.5/10", b: "9/10", winner: "b" },
      { name: "中文写作", a: "9/10", b: "8.5/10", winner: "a" },
      { name: "数学 / 推理", a: "8.5/10", b: "9/10", winner: "tie" },
      { name: "翻译", a: "9/10", b: "8.5/10", winner: "a" },
      { name: "API 价格", a: "$0.27/1M", b: "$3/1M", winner: "a" },
      { name: "国内访问速度", a: "极快", b: "需代理", winner: "a" },
      { name: "私有化部署", a: "支持", b: "不支持", winner: "a" },
    ],
    scenarios: [
      { title: "AI 产品后端 / API 调用", pick: "a", reason: "成本相差 10 倍，效果差距 < 5%。" },
      { title: "写复杂代码 / 重构", pick: "b", reason: "Claude Sonnet 4 仍保持优势。" },
      { title: "中文写作 / 翻译", pick: "a", reason: "母语优势 + 价格优势。" },
      { title: "数据合规 / 私有部署", pick: "a", reason: "Claude 不支持私有化。" },
      { title: "做 AI Agent 产品", pick: "b", reason: "MCP / 工具调用生态成熟。" },
      { title: "成本敏感场景", pick: "a", reason: "便宜 10 倍。" },
    ],
    verdict:
      "我的策略：前端 / 用户面向场景 = Claude（质量第一），后端 / 批量任务 = DeepSeek（成本第一）。50% 任务可以从 Claude 换 DeepSeek 而用户感知不到差距。建议立刻把后端 LLM 切换到 DeepSeek，前端继续 Claude，月成本可以从 $1000 降到 $100。",
    faq: [
      {
        q: "DeepSeek API 充值怎么搞？",
        a: "支付宝 / 微信直接充，比 Claude / OpenAI 方便 10 倍。100 元能跑几百万 token。",
      },
      {
        q: "DeepSeek 能本地部署吗？",
        a: "能。DeepSeek-V3 / R1 都开源，但 671B 参数对硬件要求高（需要 8 张 H100）。中小团队用 API 更划算。",
      },
      {
        q: "DeepSeek 数据安全吗？",
        a: "DeepSeek 官方 API 数据不用于训练（明确条款）。如果担心，自托管开源版本完全可控。比 OpenAI / Anthropic 更适合国内合规场景。",
      },
    ],
  },
  {
    slug: "dreamina-vs-runway",
    title: "字节即梦 vs Runway 视频生成对比",
    metaTitle: "即梦 Dreamina vs Runway 2026 — 同 prompt 出图实测",
    metaDesc: "字节即梦 Maestro vs Runway Gen-4 全面对比。中文创作者到底该用哪个？子墨用 30 个 prompt 跑出真实差距。",
    intro:
      "AI 视频生成 2026 年的主战场上，国产即梦和海外 Runway 是最值得对比的两家。即梦背靠字节 Pika 团队，Runway 是开山祖师。子墨用同一组 30 个 prompt 在两个平台都跑过，给出按场景的推荐。",
    a: {
      name: "即梦 Dreamina",
      vendor: "字节跳动",
      toolSlug: "dreamina",
      emoji: "🇨🇳",
      tagline: "字节出品的 AI 图像 / 视频生成器",
      pricing: "VIP $20/月 (Maestro)",
      pros: [
        "Maestro 模式画质接近 Runway Gen-4",
        "国内访问超快，国内支付方便",
        "中文 prompt 理解优于 Runway",
        "命令行版本（dreamina-cli）支持批量",
        "送大量免费额度试用",
      ],
      cons: [
        "镜头控制语言相对简单",
        "高端创意场景不如 Runway",
        "海外接受度仍在建立",
      ],
    },
    b: {
      name: "Runway",
      vendor: "Runway ML",
      toolSlug: "runway",
      emoji: "🎬",
      tagline: "电影级 AI 视频生成开山祖师",
      pricing: "$15-95/月",
      pros: [
        "Gen-4 在专业场景仍是天花板",
        "镜头控制 / 摄影语言最丰富",
        "电影 / 广告行业认可度最高",
        "Director Mode 高阶功能",
      ],
      cons: [
        "国内访问慢甚至失败",
        "信用卡支付门槛高",
        "中文 prompt 经常理解错",
        "贵：高级套餐 $95/月",
      ],
    },
    dimensions: [
      { name: "出图质量", a: "9/10", b: "9.5/10", winner: "b" },
      { name: "中文 prompt 理解", a: "10/10", b: "7/10", winner: "a" },
      { name: "国内访问稳定性", a: "极佳", b: "差", winner: "a" },
      { name: "价格 ($/月)", a: "$20", b: "$15-95", winner: "a" },
      { name: "支付便利性", a: "微信/支付宝", b: "信用卡", winner: "a" },
      { name: "镜头控制", a: "中等", b: "丰富", winner: "b" },
      { name: "API / 批量", a: "支持", b: "支持", winner: "tie" },
      { name: "国际客户认可", a: "建设中", b: "顶级", winner: "b" },
    ],
    scenarios: [
      { title: "国内做内容 / 短视频", pick: "a", reason: "国内访问 + 中文理解 + 价格优势全占。" },
      { title: "做电影 / 高端广告", pick: "b", reason: "Runway 仍是行业标准。" },
      { title: "电商 / 营销素材", pick: "a", reason: "即梦 Maestro 已经够用。" },
      { title: "做海外项目交付国际客户", pick: "b", reason: "国际客户更认 Runway。" },
      { title: "批量生成 / 脚本化", pick: "a", reason: "dreamina-cli 命令行简洁。" },
      { title: "实验 / 学习", pick: "a", reason: "免费额度多，国内试错成本低。" },
    ],
    verdict:
      "我自己 80% 视频用即梦，20% 用 Runway。即梦 Maestro 的画质已经能商用，且国内访问 + 中文 + 支付三个国情都赢。Runway 留给国际客户交付场景。预算紧张直接选即梦，预算够建议两个都订（$35/月）。",
    faq: [
      {
        q: "即梦能商用吗？",
        a: "能。即梦 VIP 版生成的内容版权归你，可商业使用。但建议保留生成记录，避免版权争议。",
      },
      {
        q: "Runway 国内能用吗？",
        a: "技术上需要科学上网 + 国际信用卡。子墨实测国内访问慢且生成经常超时。如果一定要用 Runway，建议买台美区 VPS。",
      },
      {
        q: "做抖音 / 小红书选哪个？",
        a: "无脑选即梦。中文 prompt + 微信支付 + 速度快 + 价格低，更适合中文短视频博主。",
      },
    ],
  },
  {
    slug: "lovable-vs-v0",
    title: "Lovable vs v0 谁更适合你",
    metaTitle: "Lovable vs v0 by Vercel — Vibe Coding 工具对比",
    metaDesc: "Lovable 和 v0 都说自己是 AI 全栈生成器，到底哪个真的能上线 SaaS？子墨实测告诉你。",
    intro:
      "2026 年的 Vibe Coding 工具里，Lovable 和 v0 by Vercel 是最常被对比的两个。Lovable 给你完整全栈应用，v0 给你 React 组件代码。差异比表面看起来大得多。",
    a: {
      name: "Lovable",
      vendor: "Lovable.dev",
      toolSlug: "lovable",
      emoji: "💖",
      tagline: "对话式全栈应用生成器",
      pricing: "免费 5 项目 + $25/月",
      pros: [
        "生成包含数据库 / Auth / 部署的完整应用",
        "对话式交互，非技术创始人也能用",
        "Supabase / Vercel 自动集成",
        "适合 0-1 MVP 验证",
      ],
      cons: [
        "复杂业务逻辑生成质量不稳定",
        "代码黑盒，大改需要自己接管",
        "项目超过中等规模容易掉控制",
      ],
    },
    b: {
      name: "v0",
      vendor: "Vercel",
      toolSlug: "v0",
      emoji: "🅥",
      tagline: "Vercel 出品的 React 组件生成器",
      pricing: "免费有额度 + $20-200/月",
      pros: [
        "React + Tailwind + shadcn/ui 标准栈",
        "代码可直接复制到现有项目",
        "Vercel 部署一键到位",
        "适合前端 / 落地页快速产出",
      ],
      cons: [
        "只生成前端组件，需要自己接后端",
        "复杂状态管理生成质量一般",
        "对非程序员有一定门槛",
      ],
    },
    dimensions: [
      { name: "目标用户", a: "非技术创始人", b: "前端工程师", winner: "tie" },
      { name: "生成范围", a: "全栈应用", b: "React 组件", winner: "a" },
      { name: "代码质量", a: "中等", b: "良好", winner: "b" },
      { name: "可继续编辑", a: "对话改", b: "代码改", winner: "tie" },
      { name: "上线难度", a: "1 键", b: "1 键 (Vercel)", winner: "tie" },
      { name: "价格", a: "$25/月", b: "$20-200/月", winner: "a" },
      { name: "适合场景", a: "MVP / 内部工具", b: "落地页 / 组件库", winner: "tie" },
      { name: "复杂业务逻辑", a: "中等", b: "需手写", winner: "tie" },
    ],
    scenarios: [
      { title: "1 周内验证一个 SaaS idea", pick: "a", reason: "Lovable 全栈+部署一条龙。" },
      { title: "给现有 Next.js 项目加 UI", pick: "b", reason: "v0 出 React 组件直接拷贝。" },
      { title: "非技术背景做产品", pick: "a", reason: "对话式比 v0 友好。" },
      { title: "做营销落地页", pick: "b", reason: "v0 的 Vercel 部署最丝滑。" },
      { title: "做内部工具 / Admin Panel", pick: "a", reason: "全栈生成省心。" },
      { title: "组件库 / Design System", pick: "b", reason: "v0 + shadcn/ui 更标准。" },
    ],
    verdict:
      "我的逻辑：MVP 验证用 Lovable，正式产品用 v0 + Cursor 接管。Lovable 适合 0-1 出 demo，v0 适合 1-100 持续打磨。两个都试免费版，定下后选一个订就够了。",
    faq: [
      {
        q: "Lovable 生成的代码能上生产吗？",
        a: "MVP 阶段够用，生产级建议导出到本地后用 Cursor / Claude Code 二次审查重构。Lovable 的代码偏样板，复杂业务规则生成质量不稳。",
      },
      {
        q: "v0 真的免费吗？",
        a: "免费版每月 200 messages。轻度用够。重度用建议升 $20 Pro，企业用买 Team $30/月/人。",
      },
      {
        q: "国内能用 Lovable 和 v0 吗？",
        a: "都需要科学上网。Vercel / Supabase 国内访问也偶尔抽风。子墨建议在国外 VPS 上开发，部署到 Cloudflare 这种国内可访问的平台。",
      },
    ],
  },
  {
    slug: "manus-vs-fellou",
    title: "Manus vs Fellou 通用 Agent 对决",
    metaTitle: "Manus vs Fellou 2026 — 哪个 AI Agent 真的能干活",
    metaDesc: "Manus 和 Fellou 都说自己是通用 AI Agent，子墨用 10 个真实任务对比，结果出乎意料。",
    intro:
      "2026 年通用 AI Agent 赛道国内最受关注的两家：Manus（Butterfly Effect）和 Fellou。两个都宣称能让 AI 自己浏览、操作、完成任务。子墨用同一组 10 个真实任务测试，给出按场景的推荐。",
    a: {
      name: "Manus",
      vendor: "Butterfly Effect",
      toolSlug: "manus",
      emoji: "🦋",
      tagline: "国产通用 AI Agent",
      pricing: "邀请制 + $30/月",
      pros: [
        "概念演示和 demo 极强",
        "支持多步骤复杂任务规划",
        "中文场景理解好",
        "投资人和媒体认可度高",
      ],
      cons: [
        "实际跑长任务仍会卡住",
        "邀请制门槛高",
        "$30/月相对国内市场偏贵",
      ],
    },
    b: {
      name: "Fellou",
      vendor: "Fellou AI",
      toolSlug: "fellou",
      emoji: "🌐",
      tagline: "国产 AI 浏览器 + Agent 一体",
      pricing: "Freemium + Pro",
      pros: [
        "浏览器形态降低使用门槛",
        "网页内 Agent 可直接操作页面",
        "免费版可以试",
        "操作结果可视化，看得到 AI 干了什么",
      ],
      cons: [
        "Agent 复杂度不如 Manus",
        "局限在浏览器场景内",
        "海外网站操作偶尔不稳",
      ],
    },
    dimensions: [
      { name: "形态", a: "独立 Agent 平台", b: "AI 浏览器", winner: "tie" },
      { name: "任务复杂度上限", a: "高", b: "中", winner: "a" },
      { name: "上手难度", a: "中", b: "低", winner: "b" },
      { name: "可视化操作", a: "弱", b: "强", winner: "b" },
      { name: "中文场景", a: "9/10", b: "9/10", winner: "tie" },
      { name: "价格", a: "$30/月", b: "免费版可用", winner: "b" },
      { name: "稳定性", a: "中等", b: "良好", winner: "b" },
      { name: "Demo 震撼度", a: "高", b: "中", winner: "a" },
    ],
    scenarios: [
      { title: "做调研 / 找资料 / 整理表格", pick: "b", reason: "浏览器形态 + 可视化更顺。" },
      { title: "复杂多步骤工作流", pick: "a", reason: "Manus 的规划能力更强。" },
      { title: "网页操作 / 自动填表", pick: "b", reason: "Fellou 浏览器原生支持。" },
      { title: "新手第一次用 Agent", pick: "b", reason: "Fellou 上手门槛低。" },
      { title: "演示 / 给客户看 demo", pick: "a", reason: "Manus 的 demo 效果更炸。" },
      { title: "日常重复性任务", pick: "b", reason: "Fellou 跑完整链路更稳。" },
    ],
    verdict:
      "我现在更常用 Fellou，因为浏览器形态可控性强。Manus 适合做演示和复杂规划任务。如果第一次接触 Agent 强烈建议先用 Fellou 免费版，跑通后再考虑 Manus 这种付费方案。",
    faq: [
      {
        q: "Manus 邀请码怎么搞？",
        a: "官网申请排队，社区 / X 上有时会有 KOL 放码。子墨说AI 关注者可以邮件申请优先码。",
      },
      {
        q: "Fellou 是国产吗？",
        a: "Fellou AI 主要团队在国内，产品同时支持中英文。国内可访问且不需要科学上网。",
      },
      {
        q: "AI Agent 真的能替代我的工作吗？",
        a: "替代不了，但能替你跑 80% 的重复性 / 调研 / 整理类任务。建议把这类任务交给 Agent，自己专注决策和创意。",
      },
    ],
  },
];

export function getCompareBySlug(slug: string): Compare | undefined {
  return compares.find((c) => c.slug === slug);
}
