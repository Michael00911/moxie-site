import Link from "next/link";
import type { Metadata } from "next";
import { launchPlans } from "@/lib/launches";

export const metadata: Metadata = {
  title: "申请 Launch Slot — Moxie",
  description: "申请你的 AI 工具在Moxie每日发布会上线，三档套餐可选。",
};

export default function LaunchSubmitPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🚀 申请 Launch Slot
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          上线子墨每日发布会
        </h1>
        <p className="text-muted max-w-xl mx-auto leading-relaxed">
          每天 5 个 slot，工具方排队上线。3 档方案覆盖免费排队到 Gold 头条。
        </p>
      </header>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3 mb-16">
        {launchPlans.map((p) => (
          <div
            key={p.id}
            className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
              p.highlight
                ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-card shadow-md"
                : "border-border bg-card"
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold whitespace-nowrap">
                {p.badge}
              </div>
            )}
            <div className="font-bold text-lg mb-1">{p.name}</div>
            <div className="text-3xl font-bold tracking-tight mb-2">{p.price}</div>
            <div className="text-sm text-muted mb-5">{p.desc}</div>
            <ul className="space-y-2 text-sm flex-1 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  <span className="text-foreground/85 text-xs leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold tracking-tight mb-1">提交 Launch 申请</h2>
        <p className="text-sm text-muted mb-6">填好表单后子墨 48 小时内联系你确认 slot 时间</p>
        <form className="space-y-4">
          <Field label="工具名 *" placeholder="例如 Claude Resume Tailor" />
          <Field label="官网 *" placeholder="https://..." type="url" />
          <Field label="一句话简介 *" placeholder="不超过 50 字" />
          <div>
            <label className="block text-sm font-medium mb-1.5">详细介绍 *</label>
            <textarea
              rows={4}
              placeholder="200-500 字介绍核心功能 + 适合谁用"
              className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400"
            />
          </div>
          <Field label="Maker 名字 *" placeholder="你的名字 / 公司名" />
          <Field label="Maker URL（X / 个人主页）" placeholder="https://x.com/yourhandle" />
          <Field label="联系邮箱 *" placeholder="your@email.com" type="email" />
          <div>
            <label className="block text-sm font-medium mb-1.5">选择 Slot 套餐 *</label>
            <select className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400">
              <option>选择套餐</option>
              <option>免费 Slot</option>
              <option>标准 Slot（性价比之选）</option>
              <option>Gold Slot（指定头条 + 视频测评）</option>
            </select>
          </div>
          <Field label="期望上线日期（仅 Gold 套餐有效）" placeholder="例如 2026-05-12" />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90"
          >
            提交申请
          </button>
        </form>
      </section>

      <div className="mt-12 text-center text-sm text-muted">
        其他问题？邮件{" "}
        <a href="mailto:business@moxie.ai" className="text-foreground hover:underline">
          business@moxie.ai
        </a>{" "}
        ·{" "}
        <Link href="/launches" className="text-foreground hover:underline">
          返回 Launch 总览
        </Link>
      </div>
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
