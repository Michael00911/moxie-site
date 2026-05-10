import Link from "next/link";
import type { Metadata } from "next";
import { personas, servicePlans, siteStats, solutions } from "@/lib/business";

export const metadata: Metadata = {
  title: "B2B 服务",
  description:
    "子墨说AI 是 AI Autopilot 服务公司，提供 AI 工具方营销代运营 / 中小企业 AI 落地 / 大企业 AI 工作流托管",
};

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🏢 B2B 服务方案
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          子墨说AI 是
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            AI Autopilot 服务公司
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">
          不卖课、不培训、不直播。把 AI 工作流标准化交付给你，按月付费或按结果付费。
          媒体矩阵 + 开发团队 + 运营团队三件套，按需求评估报价。
        </p>
      </header>

      {/* Persona quick nav */}
      <div className="grid gap-4 md:grid-cols-3 mb-20">
        {personas.map((p) => (
          <a
            key={p.key}
            href={`#${p.key}`}
            className={`group rounded-2xl border p-6 transition-all hover:shadow-md ${COLOR_BG[p.color]}`}
          >
            <div className="text-3xl mb-3">{p.emoji}</div>
            <div className="font-bold text-lg mb-1">{p.audience}</div>
            <div className="text-sm text-muted leading-relaxed mb-3">{p.pain}</div>
            <div className="text-xs text-foreground/85 pb-3 border-b border-border/60">
              <span className="font-medium">合作后：</span>
              {p.outcome}
            </div>
            <div className="mt-3 text-sm font-medium group-hover:translate-x-0.5 transition-transform inline-block">
              查看方案 →
            </div>
          </a>
        ))}
      </div>

      {/* TOOL */}
      <ServiceSection
        id="tool"
        emoji="🚀"
        title="AI 工具方 / SaaS 公司"
        intro="你做产品，我们替你做营销 — 内容 / SEO / 视频测评 / KOL / 出海全包。
        子墨说AI 自有矩阵 + 外部 KOL 网络 + 5 人内容团队，是 AI 工具进入中国市场最高效的渠道。"
        plans={servicePlans.filter((p) => p.category === "tool")}
        socialProof={[
          { num: siteStats.totalFollowers, label: "媒体矩阵粉丝" },
          { num: siteStats.weeklyUV, label: "工具站周 UV" },
          { num: "ROI 4×", label: "比 KOL 投放" },
        ]}
      />

      {/* SMB */}
      <ServiceSection
        id="smb"
        emoji="🏗️"
        title="中小企业 / AI 转型"
        intro="不是给你一份 PPT 报告。是和你一起把 AI Agent / 工作流真正跑起来，
        团队能用、KPI 能看。我们提供行业标准化包（餐饮 / 电商 / 教育 / 制造）也支持定制。"
        plans={servicePlans.filter((p) => p.category === "smb")}
        socialProof={[
          { num: siteStats.enterpriseClients, label: "服务过的企业" },
          { num: "45%", label: "客户成本平均下降" },
          { num: "4-12 周", label: "签约到上线" },
        ]}
      />

      {/* ENTERPRISE */}
      <ServiceSection
        id="enterprise"
        emoji="🏛️"
        title="大企业 / AI 工作流托管"
        intro="服务即软件（Service as Software） — 我们替你跑完整 AI 工作流，按结果付费。
        替代传统外包团队 30-50% 成本，毛利和稳定性都比内部自建高。"
        plans={servicePlans.filter((p) => p.category === "enterprise")}
        socialProof={[
          { num: siteStats.arr, label: "公司 ARR" },
          { num: "70%", label: "L1 工单 AI 解决率" },
          { num: "60%+", label: "服务毛利率" },
        ]}
      />

      {/* INDUSTRY SOLUTIONS */}
      <section className="mt-24 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            行业解决方案
          </h2>
          <p className="text-muted">已封装好的标准化包，开箱即用</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className={`group flex flex-col gap-3 rounded-2xl border p-5 hover:shadow-md transition-all ${
                s.recommended ? "border-amber-300 bg-amber-50/40" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{s.emoji}</div>
                {s.recommended && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                    推荐
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">{s.industry}</div>
                <div className="text-xs text-muted mt-1">{s.audience}</div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{s.pain}</p>
              <div className="grid gap-1 text-xs">
                {s.modules.map((m) => (
                  <div key={m} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">▸</span>
                    <span className="text-foreground/85">{m}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                <div>
                  <div className="text-xs text-muted">起步价</div>
                  <div className="font-bold text-sm">{s.pricing}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted">周期</div>
                  <div className="font-medium text-sm">{s.duration}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 p-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          先聊一聊判断要不要合作
        </h2>
        <p className="text-muted max-w-xl mx-auto mb-6">
          不管你是 AI 工具方、想做 AI 转型的企业，还是想把工作流外包出去 —
          先 30 分钟视频会议，我们判断有没有合作空间。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:business@moxie.ai"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
          >
            预约商务会议
          </a>
          <Link
            href="/cases"
            className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
          >
            先看客户案例 →
          </Link>
        </div>
      </section>
    </div>
  );
}

const COLOR_BG: Record<string, string> = {
  blue: "border-sky-200 bg-sky-50/40 hover:border-sky-300",
  emerald: "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300",
  amber: "border-amber-200 bg-amber-50/40 hover:border-amber-300",
};

function ServiceSection({
  id,
  emoji,
  title,
  intro,
  plans,
  socialProof,
}: {
  id: string;
  emoji: string;
  title: string;
  intro: string;
  plans: ReturnType<typeof Object>[];
  socialProof: { num: string; label: string }[];
}) {
  return (
    <section id={id} className="mb-24 scroll-mt-20">
      <div className="mb-8">
        <div className="text-3xl mb-3">{emoji}</div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-muted leading-relaxed max-w-3xl">{intro}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
          {socialProof.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-3 py-2">
              <div className="font-bold text-lg leading-tight">{s.num}</div>
              <div className="text-[11px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`grid gap-4 ${plans.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}>
        {plans.map((plan: any) => (
          <div
            key={plan.id}
            className={`relative flex flex-col p-5 rounded-2xl border transition-all ${
              plan.highlight
                ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-card shadow-md"
                : "border-border bg-card hover:border-foreground/20 hover:shadow-sm"
            }`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-5 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                plan.highlight ? "bg-amber-500 text-white" : "bg-zinc-900 text-white"
              }`}>
                {plan.badge}
              </div>
            )}
            <div className="font-bold text-base mb-1">{plan.name}</div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold tracking-tight">{plan.price}</span>
              {plan.period && <span className="text-xs text-muted">{plan.period}</span>}
            </div>
            <div className="text-xs text-muted mb-4 leading-relaxed">{plan.desc}</div>
            <ul className="space-y-1.5 text-sm flex-1 mb-5">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-foreground/80">
                  <span className="text-emerald-500 shrink-0 text-xs">✓</span>
                  <span className="text-xs leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block text-center py-2 rounded-lg text-sm font-medium transition-opacity ${
                plan.highlight
                  ? "bg-zinc-900 text-white hover:opacity-90"
                  : "border border-border bg-card hover:bg-muted-bg"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
