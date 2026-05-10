import Link from "next/link";
import type { Metadata } from "next";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  title: "按行业找对标 — 创业者商业图鉴",
  description:
    "按行业找成功对标项目：跨境电商 / SaaS / 自媒体 / 餐饮 / 教育 / 服务业。每个行业含工具栈、典型坑、致胜要点。",
};

export default function IndustriesIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🏭 按行业找对标
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          找你这个行业的
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            {" "}
            优秀对标
          </span>
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          创业者最需要的不是「努力」，是「**对标**」 — 看同行业别人怎么做成的，少走 6 个月弯路。
          每个行业页含成功案例 / 工具栈 / 典型坑 / 致胜要点。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((ind) => (
          <Link
            key={ind.slug}
            href={`/industries/${ind.slug}`}
            className={`group flex flex-col gap-3 rounded-2xl border border-border p-6 hover:shadow-md transition-all bg-gradient-to-br ${ind.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{ind.emoji}</div>
              <div className="text-xs px-2 py-0.5 rounded bg-white/60 backdrop-blur border border-white/40">
                {ind.benchmarks.length} 对标
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight group-hover:underline">
                {ind.name}
              </h2>
              <p className="text-xs text-muted mt-1">{ind.audience}</p>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed line-clamp-2">
              {ind.description}
            </p>
            {ind.moxieService && (
              <div className="mt-auto pt-3 border-t border-white/40 text-xs">
                <span className="text-muted">Moxie 方案：</span>
                <span className="font-semibold">{ind.moxieService.price}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Cross-link to /by */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          也可以「按你想干嘛」找
        </h2>
        <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
          除了按行业找对标，也可以按「想做设计 / 想做流量 / 想赚钱」这种用途分类找工具。
        </p>
        <Link
          href="/by"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90"
        >
          按用途找工具 →
        </Link>
      </section>
    </div>
  );
}
