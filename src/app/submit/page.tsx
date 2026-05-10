import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "提交工具 / 投放广告",
  description: "提交你的 AI 工具到Moxie，免费提交或付费置顶推广",
};

const PLANS = [
  {
    name: "免费收录",
    price: "¥0",
    desc: "进入待测库 (L4)",
    features: [
      "工具基础信息上架",
      "进入子墨待测排队",
      "审核期 5-7 天",
      "通过后自动展示",
    ],
    cta: "免费提交",
    highlight: false,
  },
  {
    name: "标准推广",
    price: "¥299",
    period: "/ 月",
    desc: "分类页置顶 + 标签露出",
    features: [
      "免费收录全部权益",
      "分类页置顶 30 天",
      "首页热门标签露出",
      "周报邮件提及",
      "数据看板访问",
    ],
    cta: "选择标准",
    highlight: true,
  },
  {
    name: "Featured 赞助",
    price: "¥1,999",
    period: "/ 月",
    desc: "首页赞助位 + 子墨视频测评",
    features: [
      "标准推广全部权益",
      "首页 FEATURED 赞助位",
      "子墨抖音/小红书测评视频",
      "公众号专题文章",
      "永久关键词 SEO 锚定",
    ],
    cta: "联系商务",
    highlight: false,
  },
];

export default function SubmitPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🚀 商务合作
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          把你的 AI 工具推到
          <br />
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            10 万 + 子墨说AI 粉丝面前
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">
          子墨说AI 抖音 / 小红书 / 公众号 矩阵覆盖 10 万+ 高质量 AI 内容用户，
          配套工具站日均独立访问 5,000+，是 AI 工具方触达精准 C 端的最佳渠道。
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-16">
        <Stat num="10万+" label="子墨说AI 全网粉丝" />
        <Stat num="5,000+" label="工具站日均 UV" />
        <Stat num="3.2%" label="点击转化率" />
        <Stat num="¥299起" label="月度推广起步价" />
      </div>

      {/* Plans */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">选择推广方案</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                plan.highlight
                  ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-card shadow-md scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold">
                  最受欢迎
                </div>
              )}
              <div className="font-bold text-lg mb-1">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
              </div>
              <div className="text-sm text-muted mb-5">{plan.desc}</div>
              <ul className="space-y-2 text-sm flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-lg font-medium transition-opacity ${
                  plan.highlight
                    ? "bg-zinc-900 text-white hover:opacity-90"
                    : "border border-border bg-card hover:bg-muted-bg"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Submission Form */}
      <section className="rounded-2xl border border-border bg-card p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold tracking-tight mb-1">免费提交工具</h2>
        <p className="text-sm text-muted mb-6">基础信息收录到待测库，审核通过后自动上线</p>
        <form className="space-y-4">
          <Field label="工具名称 *" placeholder="例如 Claude Code" />
          <Field label="官网链接 *" placeholder="https://..." type="url" />
          <Field label="一句话介绍 *" placeholder="不超过 50 字" />
          <Field label="联系邮箱 *" placeholder="your@email.com" type="email" />
          <div>
            <label className="block text-sm font-medium mb-1.5">所属分类 *</label>
            <select className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400">
              <option>选择分类</option>
              <option>编程开发</option>
              <option>视频制作</option>
              <option>图像生成</option>
              <option>写作助手</option>
              <option>音频语音</option>
              <option>AI Agent</option>
              <option>研究分析</option>
              <option>效率工具</option>
              <option>营销增长</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
          >
            提交审核
          </button>
        </form>
      </section>

      {/* Contact */}
      <div className="mt-16 text-center text-sm text-muted">
        商务合作邮箱：
        <a href="mailto:business@moxie.ai" className="text-foreground hover:underline">
          business@moxie.ai
        </a>
        <span className="mx-2">·</span>
        <Link href="/" className="text-foreground hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="text-2xl font-bold tracking-tight">{num}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}
