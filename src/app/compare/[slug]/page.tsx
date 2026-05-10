import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compares, getCompareBySlug } from "@/lib/compare";
import { sponsors } from "@/lib/data";
import { SponsoredBanner } from "@/components/sponsored-banner";

export async function generateStaticParams() {
  return compares.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompareBySlug(slug);
  if (!c) return { title: "对比未找到" };
  return {
    title: c.metaTitle,
    description: c.metaDesc,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmp = getCompareBySlug(slug);
  if (!cmp) notFound();

  const featureSponsor = sponsors.find((s) => s.category === "feature");
  const related = compares.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-zinc-50 via-white to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/compare" className="hover:text-foreground">对比</Link>
            <span className="mx-2">/</span>
            <span>{cmp.a.name} vs {cmp.b.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            {cmp.title}
          </h1>
          <p className="text-muted leading-relaxed max-w-3xl">{cmp.intro}</p>

          {/* VS Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] items-stretch">
            <ToolBlock tool={cmp.a} side="A" />
            <div className="flex md:flex-col items-center justify-center gap-2 px-4">
              <div className="text-3xl font-bold text-muted">VS</div>
            </div>
            <ToolBlock tool={cmp.b} side="B" />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-12">
          {/* Sponsored */}
          {featureSponsor && <SponsoredBanner sponsor={featureSponsor} />}

          {/* Dimensions table */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">8 维度对比</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted-bg/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">维度</th>
                    <th className="text-left px-4 py-3 font-semibold">{cmp.a.name}</th>
                    <th className="text-left px-4 py-3 font-semibold">{cmp.b.name}</th>
                    <th className="text-left px-4 py-3 font-semibold w-20">胜出</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.dimensions.map((d, i) => (
                    <tr key={d.name} className={i % 2 === 0 ? "bg-card" : "bg-muted-bg/20"}>
                      <td className="px-4 py-3 font-medium">{d.name}</td>
                      <td className={`px-4 py-3 ${d.winner === "a" ? "font-semibold text-emerald-700" : ""}`}>
                        {d.a}
                      </td>
                      <td className={`px-4 py-3 ${d.winner === "b" ? "font-semibold text-emerald-700" : ""}`}>
                        {d.b}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {d.winner === "a" && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">A</span>}
                        {d.winner === "b" && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">B</span>}
                        {d.winner === "tie" && <span className="text-muted">平</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Scenarios */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">按场景选择</h2>
            <div className="grid gap-3">
              {cmp.scenarios.map((s, i) => {
                const winner = s.pick === "a" ? cmp.a : cmp.b;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                  >
                    <div className="text-2xl shrink-0">{winner.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold">{s.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                          推荐 {winner.name}
                        </span>
                      </div>
                      <div className="text-sm text-muted">{s.reason}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Verdict */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
            <h2 className="text-xl font-bold tracking-tight mb-3 flex items-center gap-2">
              📒 子墨最终判断
            </h2>
            <p className="text-foreground/85 leading-relaxed">{cmp.verdict}</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">常见问题</h2>
            <div className="space-y-3">
              {cmp.faq.map((f, i) => (
                <details
                  key={i}
                  className="rounded-xl border border-border bg-card group"
                  open={i === 0}
                >
                  <summary className="cursor-pointer p-4 font-medium flex items-center justify-between">
                    <span>{f.q}</span>
                    <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold tracking-tight mb-5">其他对比</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/compare/${r.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-1 text-2xl">
                    <span>{r.a.emoji}</span>
                    <span className="text-xs text-muted">vs</span>
                    <span>{r.b.emoji}</span>
                  </div>
                  <div className="text-sm font-medium leading-tight line-clamp-2">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-5 md:sticky md:top-20 md:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold mb-2 text-sm">📒 子墨说</div>
            <div className="text-xs text-muted leading-relaxed">
              本对比基于子墨过去 6 个月的实际使用数据。每月更新，反映最新版本能力。
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="font-semibold mb-1 text-sm">📬 想看更多对比？</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              订阅子墨周报，每周会有 1-2 个新的工具对比
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-white mb-2"
            />
            <button className="w-full py-1.5 rounded-md bg-zinc-900 text-white text-xs font-medium">
              免费订阅
            </button>
          </div>
          <div className="rounded-xl border border-dashed border-border p-4 text-xs">
            <div className="font-semibold text-sm mb-1">💼 工具方付费置顶？</div>
            <Link href="/submit" className="text-foreground hover:underline">
              查看推广方案 →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolBlock({ tool, side }: { tool: ReturnType<typeof Object>; side: "A" | "B" }) {
  const t = tool as any;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{t.emoji}</div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg leading-tight truncate">{t.name}</h3>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-900 text-white">{side}</span>
          </div>
          <div className="text-xs text-muted">{t.vendor}</div>
        </div>
      </div>
      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{t.tagline}</p>
      <div className="text-xs text-muted mb-3 pb-3 border-b border-border">
        <span className="font-medium">价格：</span>{t.pricing}
      </div>
      <div className="space-y-2 text-xs">
        <div>
          <div className="text-emerald-700 font-semibold mb-1">优势</div>
          <ul className="space-y-1">
            {t.pros.map((p: string) => (
              <li key={p} className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0">✓</span>
                <span className="text-foreground/85">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-rose-700 font-semibold mb-1">劣势</div>
          <ul className="space-y-1">
            {t.cons.map((c: string) => (
              <li key={c} className="flex items-start gap-1.5">
                <span className="text-rose-400 shrink-0">×</span>
                <span className="text-foreground/85">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
