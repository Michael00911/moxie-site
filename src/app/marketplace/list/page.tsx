import Link from "next/link";
import type { Metadata } from "next";
import { listingPlans, marketplaceStats } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "挂牌出售你的项目 — 子墨 AI 项目交易市场",
  description: "在子墨说AI 项目交易市场挂牌出售你的 SaaS / Newsletter / 内容站，子墨亲自撮合。",
};

export default function ListPlanPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🚀 出售你的项目
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          想退出？让子墨帮你
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            找到买家
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">
          子墨说AI 是中文独立开发者社区最大的项目交易市场。
          月新增 12+ 挂牌，已撮合成功 7 单。从 $1k 小项目到 $500k 大资产都接。
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-16 max-w-3xl mx-auto">
        <Stat num={`${marketplaceStats.totalListings}`} label="在售项目" />
        <Stat num={`$${(marketplaceStats.totalGMV / 1000).toFixed(0)}k`} label="挂牌总额" />
        <Stat num={`${marketplaceStats.successfulDeals}`} label="撮合成功" />
        <Stat num="3-8%" label="抽佣比例" />
      </div>

      {/* Plans */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">挂牌套餐</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {listingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                plan.highlight
                  ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-card shadow-md scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold">
                  {plan.badge}
                </div>
              )}
              <div className="font-bold text-lg mb-1">{plan.name}</div>
              <div className="text-3xl font-bold tracking-tight mb-2">{plan.price}</div>
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
                选择此套餐
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold tracking-tight mb-1">提交挂牌申请</h2>
        <p className="text-sm text-muted mb-6">
          填好表单后，子墨在 48 小时内联系你做估值评估和撮合方案
        </p>
        <form className="space-y-4">
          <Field label="项目名称 *" placeholder="例如 Claude Resume Tailor" />
          <Field label="项目网址 *" placeholder="https://..." type="url" />
          <Field label="一句话介绍 *" placeholder="不超过 50 字" />
          <Field label="月收入 MRR (USD) *" placeholder="0 - 50000" type="number" />
          <Field label="期望要价 (USD) *" placeholder="例如 25000" type="number" />
          <Field label="联系邮箱 *" placeholder="your@email.com" type="email" />
          <div>
            <label className="block text-sm font-medium mb-1.5">分类 *</label>
            <select className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400">
              <option>选择分类</option>
              <option>AI SaaS</option>
              <option>内容站 / 自媒体</option>
              <option>电商 / 独立站</option>
              <option>Newsletter</option>
              <option>AI 工具</option>
              <option>代运营 / 服务公司</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
          >
            提交挂牌申请
          </button>
        </form>
      </section>

      {/* Process */}
      <section className="mt-16 rounded-2xl border border-border bg-muted-bg/40 p-8">
        <h2 className="text-xl font-bold tracking-tight mb-6 text-center">撮合流程</h2>
        <ol className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {[
            { step: "1", title: "提交挂牌", desc: "填表 + 子墨 48h 内联系评估" },
            { step: "2", title: "签订挂牌协议", desc: "确认套餐 + 信息 + 抽佣比例" },
            { step: "3", title: "上架展示", desc: "子墨说AI 周报 / 工具站推荐" },
            { step: "4", title: "买家咨询撮合", desc: "子墨建群拉买卖双方 3 方对话" },
            { step: "5", title: "尽调签约", desc: "买家看代码 / 数据 / 签 NDA + LOI" },
            { step: "6", title: "Escrow 资金托管", desc: "走第三方托管，安全交割" },
            { step: "7", title: "资产移交 + 验收", desc: "代码 / 域名 / 邮件列表交接" },
            { step: "8", title: "资金释放 + 抽佣", desc: "买家验收后释放，子墨抽 3-8%" },
          ].map((s) => (
            <li key={s.step} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <div className="font-semibold mb-0.5">{s.title}</div>
                <div className="text-sm text-muted">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact */}
      <div className="mt-12 text-center text-sm text-muted">
        其他问题？邮件{" "}
        <a href="mailto:business@moxie.ai" className="text-foreground hover:underline">
          business@moxie.ai
        </a>{" "}
        ·{" "}
        <Link href="/marketplace" className="text-foreground hover:underline">
          返回交易市场
        </Link>
      </div>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-2xl font-bold tracking-tight">{num}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
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
