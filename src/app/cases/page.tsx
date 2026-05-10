import Link from "next/link";
import type { Metadata } from "next";
import { caseStudies, siteStats } from "@/lib/business";

export const metadata: Metadata = {
  title: "客户案例",
  description: "真实跑出结果的客户案例。学员、企业、品牌方都有。",
};

const TYPE_LABEL: Record<string, { label: string; emoji: string; color: string }> = {
  tool: { label: "AI 工具方", emoji: "🚀", color: "border-amber-200 bg-amber-50/40" },
  smb: { label: "中小企业", emoji: "🏗️", color: "border-emerald-200 bg-emerald-50/40" },
  enterprise: { label: "大企业", emoji: "🏛️", color: "border-sky-200 bg-sky-50/40" },
};

export default function CasesPage() {
  const grouped = {
    tool: caseStudies.filter((c) => c.type === "tool"),
    smb: caseStudies.filter((c) => c.type === "smb"),
    enterprise: caseStudies.filter((c) => c.type === "enterprise"),
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-700 mb-5">
          📊 客户案例
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          不是 PPT 数字，
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-zinc-700 to-zinc-500 bg-clip-text text-transparent">
            是真的跑出来的结果
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">
          12+ 家 B2B 企业客户真实案例。AI 工具方 / 中小企业 / 大企业全覆盖。
          每个都附带可量化的结果和合作周期。
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <Stat num={siteStats.arr} label="ARR" />
          <Stat num={siteStats.enterpriseClients} label="服务企业" />
          <Stat num={siteStats.monthlyLeads} label="月新增线索" />
          <Stat num="60%+" label="服务毛利率" />
        </div>
      </header>

      {/* Cases by type */}
      {(["tool", "smb", "enterprise"] as const).map((type) => {
        const meta = TYPE_LABEL[type];
        return (
          <section key={type} className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-2xl">{meta.emoji}</div>
              <h2 className="text-xl font-bold tracking-tight">{meta.label}案例</h2>
              <span className="text-xs text-muted">· {grouped[type].length} 个</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {grouped[type].map((c) => (
                <article
                  key={c.slug}
                  className={`flex flex-col gap-3 rounded-2xl border p-5 hover:shadow-md transition-all ${meta.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-lg">{c.client}</div>
                      <div className="text-xs text-muted">{c.industry}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted">合作周期</div>
                      <div className="text-sm font-medium">{c.duration}</div>
                    </div>
                  </div>
                  <div className="grid gap-2 mt-2">
                    <div>
                      <div className="text-[11px] text-muted uppercase tracking-wider">挑战</div>
                      <div className="text-sm">{c.challenge}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted uppercase tracking-wider">结果</div>
                      <div className="text-sm">{c.outcome}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="text-xs text-muted">关键指标</div>
                    <div className="text-base font-bold">{c.metric}</div>
                  </div>
                  {c.testimonial && (
                    <blockquote className="mt-2 px-4 py-3 rounded-lg bg-white/70 backdrop-blur border border-white/60 text-sm italic text-foreground/85">
                      「{c.testimonial}」
                    </blockquote>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 p-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          想成为下一个案例？
        </h2>
        <p className="text-muted max-w-xl mx-auto mb-6">
          不管你是个人想出海、企业想转型、还是品牌方想推广，
          先聊一聊判断要不要合作。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
          >
            查看所有服务方案
          </Link>
          <a
            href="mailto:hi@moxie.ai"
            className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
          >
            邮件子墨 →
          </a>
        </div>
      </section>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-xl sm:text-2xl font-bold tracking-tight">{num}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
