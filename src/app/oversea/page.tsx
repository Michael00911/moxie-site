import Link from "next/link";
import type { Metadata } from "next";
import { opportunities } from "@/lib/business";

export const metadata: Metadata = {
  title: "AI 出海机会榜",
  description: "子墨整理的 AI 出海赚钱方向，按难度 / 成本 / 收益分级",
};

const DIFF_COLOR: Record<string, string> = {
  新手: "bg-emerald-100 text-emerald-900 border-emerald-200",
  进阶: "bg-amber-100 text-amber-900 border-amber-200",
  高阶: "bg-rose-100 text-rose-900 border-rose-200",
};

export default function OverseaPage() {
  const recommended = opportunities.filter((o) => o.recommended);
  const all = opportunities;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-900 mb-5">
            🌏 AI 出海机会榜
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            8 个真实有人在赚钱的
            <span className="bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
              AI 出海方向
            </span>
          </h1>
          <p className="text-muted max-w-2xl leading-relaxed">
            子墨亲自跑过或带学员跑通过的方向。按难度 / 启动成本 / 收益区间分级，
            帮你 5 分钟看完决定从哪里下手。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["#零成本启动", "#新手友好", "#赚美元", "#TikTok", "#Newsletter", "#代理商", "#Vibe Coding"].map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-900 border border-sky-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">⭐ 子墨当下最推荐</h2>
            <p className="text-xs text-muted mt-1">2026 Q2 ROI 最高的两个方向</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map((o) => (
            <OpportunityCard key={o.slug} opportunity={o} featured />
          ))}
        </div>
      </section>

      {/* All */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-bold tracking-tight mb-5">全部出海方向</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((o) => (
            <OpportunityCard key={o.slug} opportunity={o} />
          ))}
        </div>
      </section>

      {/* CTA: 工具包 + 资源库 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50/40 p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <div className="text-xs font-semibold text-sky-700 mb-2">🎁 出海起步双件套</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                看完榜单还是不知道选哪个？
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                直接拿子墨自己在用的 <span className="font-semibold text-foreground">工具栈包</span> +{" "}
                <span className="font-semibold text-foreground">出海资源库</span>，
                跳过 80% 弯路。一次性买断，永久访问，1,200+ 人已购。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services#toolkit"
                  className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  联系商务
                </Link>
                <Link
                  href="/cases"
                  className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
                >
                  看客户案例
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat num="47" label="亲测工具数" />
              <Stat num="200+" label="出海资源" />
              <Stat num="1,200+" label="已购用户" />
              <Stat num="12+" label="服务过的企业" />
              <Stat num="180+" label="对接学员" />
              <Stat num="终身" label="持续更新" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OpportunityCard({
  opportunity: o,
  featured,
}: {
  opportunity: ReturnType<typeof Object>;
  featured?: boolean;
}) {
  const op = o as any;
  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border p-5 hover:shadow-md transition-all ${
        featured
          ? "border-sky-300 bg-gradient-to-br from-sky-50/60 to-white"
          : "border-border bg-card hover:border-foreground/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg leading-snug flex-1">{op.title}</h3>
        <span
          className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap ${DIFF_COLOR[op.difficulty]}`}
        >
          {op.difficulty}
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{op.hook}</p>
      <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-border">
        <div>
          <div className="text-muted text-[10px]">启动成本</div>
          <div className="font-semibold">{op.capital}</div>
        </div>
        <div>
          <div className="text-muted text-[10px]">月收益</div>
          <div className="font-semibold">{op.earnRange}</div>
        </div>
        <div>
          <div className="text-muted text-[10px]">起步周期</div>
          <div className="font-semibold">{op.timeline}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        {op.tags.map((t: string) => (
          <span
            key={t}
            className="text-[11px] px-1.5 py-0.5 rounded bg-muted-bg text-muted"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-base font-bold tracking-tight">{num}</div>
      <div className="text-[10px] text-muted mt-0.5">{label}</div>
    </div>
  );
}
