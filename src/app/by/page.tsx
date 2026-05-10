import Link from "next/link";
import type { Metadata } from "next";
import { purposes } from "@/lib/purposes";

export const metadata: Metadata = {
  title: "按用途找工具 — 设计 / 运营 / 流量 / 变现 / 客服 / 研发",
  description:
    "AI 工具按帮企业做什么分类：设计 / 运营 / 流量 / 变现 / 客服 / 研发。每个用途含工具组合 + 案例 + 服务方案。",
};

export default function PurposesIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🎯 按用途找工具
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          告诉我你要
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            {" "}
            干嘛
          </span>
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          按 6 个用途分类：帮企业做设计 / 运营 / 流量 / 变现 / 客服 / 研发。
          每个用途含工具组合 + 实战工作流 + 客户案例 + Moxie 服务方案。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {purposes.map((p) => (
          <Link
            key={p.slug}
            href={`/by/${p.slug}`}
            className={`group flex flex-col gap-3 rounded-2xl border border-border p-6 hover:shadow-md transition-all bg-gradient-to-br ${p.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{p.emoji}</div>
              <div className="text-xs px-2 py-0.5 rounded bg-white/60 backdrop-blur border border-white/40">
                {p.toolSlugs.length} 工具
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight group-hover:underline">
                {p.name}
              </h2>
              <p className="text-xs text-muted mt-1">{p.question}</p>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed line-clamp-2">
              {p.description}
            </p>
            {p.moxieService && (
              <div className="mt-auto pt-3 border-t border-white/40 text-xs">
                <span className="text-muted">Moxie 方案：</span>
                <span className="font-semibold">{p.moxieService.price}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Cross-link */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight mb-3">
          也可以「按行业」找对标
        </h2>
        <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
          想看你这个行业别人做成什么样？切到行业分类。
        </p>
        <Link
          href="/industries"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90"
        >
          按行业找对标 →
        </Link>
      </section>
    </div>
  );
}
