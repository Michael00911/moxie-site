export type FreeTool = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  category: "calculator" | "generator" | "compare" | "tracker";
};

export const freeTools: FreeTool[] = [
  {
    slug: "ai-name-generator",
    name: "AI 工具命名生成器",
    emoji: "✨",
    tagline: "输入关键词，AI 一键生成 10 个备选品牌名",
    description: "把你的工具关键词丢进去，自动产出 10 个能用的英文品牌名 + 域名建议。",
    metaTitle: "AI 工具命名生成器 — 1 秒出 10 个品牌名 + 域名",
    metaDesc: "免费工具：输入关键词，AI 自动生成 10 个 SaaS / AI 工具品牌名，含 .com / .ai 域名可用性提示。",
    category: "generator",
  },
  {
    slug: "token-calculator",
    name: "AI Token 计算器",
    emoji: "🧮",
    tagline: "估算 Claude / GPT / DeepSeek API 调用成本",
    description: "粘贴 prompt，自动计算各家模型的 token 数和单次调用成本。多模型实时比价。",
    metaTitle: "AI Token 计算器 — Claude / GPT / DeepSeek 成本估算",
    metaDesc: "免费工具：粘贴 prompt 估算 token 数 + 各 LLM API 调用成本。Claude / GPT-5 / DeepSeek / Gemini 实时对比。",
    category: "calculator",
  },
  {
    slug: "llm-pricing-compare",
    name: "LLM API 价格对比",
    emoji: "💰",
    tagline: "主流 AI 模型 API 价格实时对比表",
    description: "Claude / GPT / DeepSeek / Gemini / Mistral 等主流 LLM 的 input / output / cache 价格一站式对比。",
    metaTitle: "LLM API 价格对比 2026 — Claude / GPT / DeepSeek 实时对比",
    metaDesc: "Claude / GPT-5 / DeepSeek / Gemini / Mistral / Qwen 等主流大模型 API 价格对比表，按 token 单价排序。",
    category: "compare",
  },
  {
    slug: "ai-cost-tracker",
    name: "AI 工具月费追踪器",
    emoji: "📊",
    tagline: "你订阅了多少 AI 工具？年花多少钱？",
    description: "勾选你订阅的 AI 工具，自动算出月度 / 年度总开销。比贵了帮你找替代品。",
    metaTitle: "AI 工具月费追踪器 — 算出你 AI 订阅总花费",
    metaDesc: "勾选你订阅的 AI 工具，自动算出月度 / 年度总开销。配套替代品建议帮你省钱。",
    category: "tracker",
  },
  {
    slug: "ai-description-generator",
    name: "AI 工具描述生成器",
    emoji: "📝",
    tagline: "输入功能要点，AI 写出官网级文案",
    description: "卡在不知道怎么写官网文案？输入工具核心功能，AI 出 3 段不同风格的文案（专业 / 亲切 / 极简）。",
    metaTitle: "AI 工具描述生成器 — 1 分钟出官网文案",
    metaDesc: "免费工具：输入工具功能，AI 自动生成 3 段不同风格的官网文案 / 一句话简介 / SEO 描述。",
    category: "generator",
  },
];

export function getFreeToolBySlug(slug: string): FreeTool | undefined {
  return freeTools.find((t) => t.slug === slug);
}

// LLM 实时价格数据（mock，未来对接 API）
export type LLMPricing = {
  model: string;
  vendor: string;
  emoji: string;
  context: string;
  inputPer1M: number;  // USD per 1M tokens
  outputPer1M: number;
  cachedInput?: number;
  notes?: string;
  url: string;
};

export const llmPricings: LLMPricing[] = [
  { model: "Claude Sonnet 4.7", vendor: "Anthropic", emoji: "🧠", context: "1M", inputPer1M: 3, outputPer1M: 15, cachedInput: 0.3, url: "https://anthropic.com" },
  { model: "Claude Opus 4.7", vendor: "Anthropic", emoji: "🧠", context: "1M", inputPer1M: 15, outputPer1M: 75, cachedInput: 1.5, notes: "最强推理", url: "https://anthropic.com" },
  { model: "Claude Haiku 4.5", vendor: "Anthropic", emoji: "🧠", context: "200k", inputPer1M: 0.8, outputPer1M: 4, cachedInput: 0.08, url: "https://anthropic.com" },
  { model: "GPT-5", vendor: "OpenAI", emoji: "🤖", context: "256k", inputPer1M: 2.5, outputPer1M: 10, url: "https://openai.com" },
  { model: "GPT-5 mini", vendor: "OpenAI", emoji: "🤖", context: "256k", inputPer1M: 0.4, outputPer1M: 1.6, url: "https://openai.com" },
  { model: "GPT-4.1", vendor: "OpenAI", emoji: "🤖", context: "128k", inputPer1M: 2.5, outputPer1M: 10, url: "https://openai.com" },
  { model: "DeepSeek V3.2", vendor: "深度求索", emoji: "🔮", context: "128k", inputPer1M: 0.27, outputPer1M: 1.1, cachedInput: 0.07, notes: "国产高性价比", url: "https://deepseek.com" },
  { model: "DeepSeek R1", vendor: "深度求索", emoji: "🔮", context: "128k", inputPer1M: 0.55, outputPer1M: 2.2, cachedInput: 0.14, notes: "推理模型", url: "https://deepseek.com" },
  { model: "Gemini 2.5 Pro", vendor: "Google", emoji: "♊", context: "2M", inputPer1M: 1.25, outputPer1M: 10, url: "https://google.dev" },
  { model: "Gemini 2.5 Flash", vendor: "Google", emoji: "♊", context: "1M", inputPer1M: 0.3, outputPer1M: 2.5, url: "https://google.dev" },
  { model: "Qwen3 Max", vendor: "阿里", emoji: "🐉", context: "256k", inputPer1M: 1.5, outputPer1M: 6, notes: "国产开源", url: "https://qwen.ai" },
  { model: "Mistral Large 3", vendor: "Mistral", emoji: "🐱", context: "128k", inputPer1M: 2, outputPer1M: 6, url: "https://mistral.ai" },
  { model: "Llama 4 405B", vendor: "Meta", emoji: "🦙", context: "128k", inputPer1M: 2.7, outputPer1M: 2.7, notes: "开源", url: "https://meta.ai" },
];

// 常见 AI 工具订阅
export type SubscriptionItem = {
  id: string;
  name: string;
  emoji: string;
  monthlyUSD: number;
  category: string;
  alternative?: string;
};

export const commonSubscriptions: SubscriptionItem[] = [
  { id: "claude-pro", name: "Claude Pro", emoji: "🧠", monthlyUSD: 20, category: "AI 助手", alternative: "DeepSeek 免费 / API 0.001 元/千 token" },
  { id: "chatgpt-plus", name: "ChatGPT Plus", emoji: "🤖", monthlyUSD: 20, category: "AI 助手", alternative: "豆包（免费）" },
  { id: "cursor", name: "Cursor Pro", emoji: "🖱️", monthlyUSD: 20, category: "AI 编程", alternative: "Cline + DeepSeek" },
  { id: "midjourney", name: "Midjourney", emoji: "🎨", monthlyUSD: 30, category: "AI 图像", alternative: "即梦 Maestro" },
  { id: "elevenlabs", name: "ElevenLabs Creator", emoji: "🎙️", monthlyUSD: 22, category: "AI 配音", alternative: "豆包语音 / Coqui (开源)" },
  { id: "perplexity", name: "Perplexity Pro", emoji: "🔍", monthlyUSD: 20, category: "AI 搜索", alternative: "Kimi (免费)" },
  { id: "v0", name: "v0 Pro", emoji: "🅥", monthlyUSD: 20, category: "AI 开发", alternative: "Lovable" },
  { id: "lovable", name: "Lovable", emoji: "💖", monthlyUSD: 25, category: "AI 开发" },
  { id: "github-copilot", name: "GitHub Copilot", emoji: "🐙", monthlyUSD: 10, category: "AI 编程" },
  { id: "heygen", name: "HeyGen Creator", emoji: "🎭", monthlyUSD: 24, category: "数字人", alternative: "腾讯智影 (免费)" },
  { id: "runway", name: "Runway Standard", emoji: "🎬", monthlyUSD: 15, category: "AI 视频", alternative: "即梦" },
  { id: "dreamina", name: "即梦 VIP", emoji: "🇨🇳", monthlyUSD: 20, category: "AI 视频" },
  { id: "n8n", name: "n8n Cloud Starter", emoji: "🔄", monthlyUSD: 20, category: "自动化" },
  { id: "notion-ai", name: "Notion AI", emoji: "📓", monthlyUSD: 10, category: "笔记" },
  { id: "gamma", name: "Gamma Plus", emoji: "📊", monthlyUSD: 8, category: "演示" },
];
