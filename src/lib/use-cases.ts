// ====== AI Use Case Finder：意图 → 工具组合 ======

export type Intent = {
  keywords: string[];          // 触发关键词
  title: string;               // 显示标题
  scenario: string;            // 场景描述
  recommendedTools: {
    toolSlug: string;          // 关联现有 tool
    role: string;              // 在工作流里扮演什么角色
  }[];
  workflow?: string[];          // 详细步骤
  tips?: string[];              // 子墨建议
};

export const intents: Intent[] = [
  {
    keywords: ["短视频", "抖音", "tiktok", "口播", "博主", "vlog"],
    title: "做抖音 / 小红书短视频博主",
    scenario: "想做内容博主或自媒体，需要从选题到剪辑全流程 AI 工具栈。",
    recommendedTools: [
      { toolSlug: "doubao", role: "选题 + 文案初稿（中文母语优势）" },
      { toolSlug: "claude-code", role: "脚本结构化 + 改写润色" },
      { toolSlug: "elevenlabs", role: "AI 配音（如果不出镜）" },
      { toolSlug: "dreamina", role: "封面图 + 转场视频片段" },
      { toolSlug: "heygen", role: "数字人口播（如果想批量）" },
    ],
    workflow: [
      "豆包想 10 个选题，挑 3 个最有共鸣的",
      "Claude Code 帮你按「钩子-痛点-解法-CTA」结构写脚本",
      "ElevenLabs 克隆你的声音 → 1 分钟配音",
      "即梦出 3 张封面 + 转场视频",
      "剪映拼起来上传",
    ],
    tips: [
      "纯 AI 视频会被平台降权，建议「真人画面 + AI 配音 + AI 字幕」混用",
      "1 个人 1 天能做 3 条不是问题",
      "看 /list/ai-for-creators 完整推荐",
    ],
  },
  {
    keywords: ["写代码", "编程", "vibe coding", "saas", "coder"],
    title: "Vibe Coding 做 SaaS 产品",
    scenario: "想用 AI 一个人做出有 ARR 的 SaaS 产品。",
    recommendedTools: [
      { toolSlug: "claude-code", role: "主力 AI 编程（复杂工程）" },
      { toolSlug: "cursor", role: "前端 UI 开发 / 演示" },
      { toolSlug: "v0", role: "快速生成 React 组件" },
      { toolSlug: "lovable", role: "MVP 验证（全栈生成）" },
      { toolSlug: "deepseek", role: "API 后端（成本 1/10）" },
    ],
    workflow: [
      "Lovable 1 周内做出能跑的 MVP demo",
      "Cursor 在 Lovable 代码上改 UI 细节",
      "Claude Code 重构关键业务逻辑（生产级）",
      "DeepSeek API 替代 OpenAI 后端，成本立刻降 10 倍",
      "Vercel + Supabase + Stripe 上线",
    ],
    tips: [
      "首选 Claude Code，70% 任务它最稳",
      "前端用 Cursor，能直接看效果",
      "成本敏感的 API 用 DeepSeek",
      "看 /list/ai-for-developers 完整推荐",
    ],
  },
  {
    keywords: ["出海", "美元", "newsletter", "tiktok 美区", "海外"],
    title: "用 AI 出海赚美元",
    scenario: "想做出海项目，TikTok / Newsletter / SaaS 都在考虑。",
    recommendedTools: [
      { toolSlug: "claude-code", role: "Vibe Coding 做出海 SaaS" },
      { toolSlug: "elevenlabs", role: "英语配音（多种口音）" },
      { toolSlug: "perplexity", role: "找海外细分赛道 + 调研" },
      { toolSlug: "dreamina", role: "TikTok 美区视频素材" },
      { toolSlug: "n8n", role: "自动化工作流" },
    ],
    workflow: [
      "Perplexity 调研 3 个海外细分赛道，看哪个有钱",
      "选定方向后，Claude Code 做 MVP",
      "用 Stripe / LemonSqueezy 收美元",
      "TikTok 美区 / X / Reddit 三件套搞冷启动",
      "ElevenLabs 配音 + 即梦视频做 TikTok 内容",
    ],
    tips: [
      "海外创业第一难是「找对赛道」，看 /oversea 子墨整理的 8 个方向",
      "Stripe 国内开通需要香港 / 新加坡公司主体",
      "TikTok 美区的 viral 模板抄一抄就能跑通",
    ],
  },
  {
    keywords: ["调研", "研究", "查资料", "写报告", "学术"],
    title: "做调研 / 写报告",
    scenario: "需要快速理解新领域、查资料、整理信息、写出可信报告。",
    recommendedTools: [
      { toolSlug: "perplexity", role: "AI 搜索（带引用）" },
      { toolSlug: "kimi", role: "长文档阅读（财报 / 论文 / 合同）" },
      { toolSlug: "claude-code", role: "结构化思考 + 报告写作" },
      { toolSlug: "manus", role: "Agent 自动跑调研任务" },
      { toolSlug: "gamma", role: "一键生成 PPT 汇报" },
    ],
    workflow: [
      "Perplexity 找 5-10 个核心信源",
      "Kimi 读完所有长文档（200 万字上下文）",
      "Claude Code 整理结构 + 输出 markdown 报告",
      "Manus 跑后续追踪任务（每周 update）",
      "Gamma 把报告变成可演示 PPT",
    ],
    tips: [
      "Perplexity 比 Google 强 5 倍 — 答案带可追溯的引用",
      "Kimi 200 万字上下文是国产独占",
      "重要研究 Claude > 国产，因为推理深度差距还在",
    ],
  },
  {
    keywords: ["客服", "工单", "回复", "答疑", "support"],
    title: "做 AI 客服 / 工单处理",
    scenario: "团队工单太多，想用 AI 自动处理 80% 重复问题。",
    recommendedTools: [
      { toolSlug: "claude-code", role: "搭客服 Agent（高质量）" },
      { toolSlug: "deepseek", role: "API 后端（成本敏感场景）" },
      { toolSlug: "n8n", role: "工作流自动化" },
    ],
    workflow: [
      "把过去 3 个月工单导出，分类整理",
      "用 Claude / DeepSeek 搭 RAG 知识库",
      "n8n 接客服系统（飞书 / 企业微信 / 腾讯客服）",
      "AI 先答 → 不确定的转人工 → 人工答完反馈给 AI 学习",
      "上线 3 个月可解决 70-80% 工单",
    ],
    tips: [
      "看子墨 /services#managed-cs 「AI 客服托管」服务",
      "我们承包整个客服链路，按解决工单数计费 ¥1.5 / 单",
      "比内部团队便宜 30-50%",
    ],
  },
  {
    keywords: ["素材", "广告", "投放", "creative", "ads"],
    title: "做 AI 广告素材 / 投放",
    scenario: "电商 / SaaS 投放团队，想批量产出创意素材降本增效。",
    recommendedTools: [
      { toolSlug: "dreamina", role: "图片 + 视频素材主力" },
      { toolSlug: "elevenlabs", role: "多语言配音" },
      { toolSlug: "heygen", role: "数字人口播广告" },
      { toolSlug: "claude-code", role: "广告文案 + Hook 生成" },
    ],
    workflow: [
      "Claude 生成 30 个 Hook 备选",
      "即梦每个 Hook 配 1 张主图 + 1 个 5 秒短视频",
      "ElevenLabs / HeyGen 配口播",
      "剪映拼成最终素材",
      "1 个人 1 天产出 50 条素材（传统 1 周）",
    ],
    tips: [
      "看 /solutions/ecom 跨境电商 AI 包",
      "我们承包整个素材生产 ¥120k 起",
      "传统素材 ¥500-2000 / 条 → AI ¥10-50 / 条",
    ],
  },
  {
    keywords: ["简历", "应聘", "求职", "ats", "面试"],
    title: "AI 改简历 / 通过 ATS",
    scenario: "想用 AI 优化简历，避开海外 ATS 系统的关键词过滤。",
    recommendedTools: [
      { toolSlug: "claude-code", role: "主力简历改写 + 关键词优化" },
      { toolSlug: "doubao", role: "中文简历润色" },
      { toolSlug: "perplexity", role: "调研目标公司信息" },
    ],
    workflow: [
      "把现有简历 + JD 给 Claude",
      "Claude 找出 JD 里的关键词，优化简历对应段落",
      "Perplexity 调研目标公司最近的产品 / 招聘动态",
      "Cover Letter 用 Claude 写定制版（不要套模板）",
      "简体中文岗位用豆包做最后润色",
    ],
    tips: [
      "ATS 系统识别关键词，Claude 改写后通过率提升 30%+",
      "海外岗位用英文简历 + Claude 润色",
      "看 /tools/claude-code 详情",
    ],
  },
  {
    keywords: ["PPT", "演讲", "slide", "汇报", "presentation"],
    title: "用 AI 做 PPT / 演讲",
    scenario: "需要快速做出高质量的演讲 PPT 或汇报材料。",
    recommendedTools: [
      { toolSlug: "gamma", role: "AI 生成 PPT 主力" },
      { toolSlug: "claude-code", role: "演讲稿撰写" },
      { toolSlug: "dreamina", role: "PPT 配图 / 封面" },
    ],
    workflow: [
      "Claude 帮你列 PPT 大纲 + 演讲稿",
      "Gamma 一句话生成 20 页可编辑 PPT",
      "即梦生成关键页的精美配图",
      "Gamma 内对每页微调",
      "导出 PDF / PPTX / 在线分享",
    ],
    tips: [
      "Gamma 比传统 PPT 软件快 10 倍",
      "做内部分享 / 客户提案完美",
      "正式发布会还是建议传统 Keynote",
    ],
  },
];

// 简单关键词匹配（未来可换成 Claude API 的语义匹配）
export function findMatchingIntents(query: string): Intent[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return intents
    .map((intent) => ({
      intent,
      score: intent.keywords.reduce(
        (sum, kw) => sum + (q.includes(kw.toLowerCase()) ? 1 : 0),
        0
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.intent);
}
