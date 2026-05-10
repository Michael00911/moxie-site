import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { alternatives, getAlternativeBySlug } from "@/lib/alternatives";
import { sponsors } from "@/lib/data";
import { SponsoredBanner } from "@/components/sponsored-banner";

export async function generateStaticParams() {
  return alternatives.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternativeBySlug(slug);
  if (!alt) return { title: "替代品未找到" };
  return {
    title: alt.metaTitle,
    description: alt.metaDesc,
  };
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = getAlternativeBySlug(slug);
  if (!alt) notFound();

  const featureSponsor = sponsors.find((s) => s.category === "feature");
  const related = alternatives.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-violet-50/40 via-white to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/alternatives" className="hover:text-foreground">替代品</Link>
            <span className="mx-2">/</span>
            <span>{alt.originalName}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="text-6xl shrink-0">{alt.originalEmoji}</div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
                {alt.title}
              </h1>
              <p className="text-lg text-foreground/80 mb-2">{alt.hero}</p>
              <div className="flex items-center gap-2 text-xs text-muted mt-3">
                <span>{alt.alternatives.length} 个替代品</span>
                <span>·</span>
                <span>2026.05 更新</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-12">
          {/* Why */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">
              为什么找 {alt.originalName} 替代品？
            </h2>
            <p className="text-foreground/80 leading-relaxed">{alt.whyAlternatives}</p>
          </section>

          {featureSponsor && <SponsoredBanner sponsor={featureSponsor} />}

          {/* Alternatives list */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">
              替代品清单（共 {alt.alternatives.length} 个）
            </h2>
            <div className="space-y-4">
              {alt.alternatives.map((a, i) => (
                <article
                  key={a.name}
                  className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-2xl">{a.emoji}</span>
                        {a.toolSlug ? (
                          <Link href={`/tools/${a.toolSlug}`} className="font-bold text-lg hover:underline">
                            {a.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-lg">{a.name}</span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded bg-muted-bg text-muted">
                          {a.vendor}
                        </span>
                        <span className="text-amber-500 text-sm">
                          {"★".repeat(a.rating)}
                          <span className="text-zinc-300">{"★".repeat(5 - a.rating)}</span>
                        </span>
                      </div>
                      <div className="text-sm text-muted mt-1">
                        💰 {a.pricing} · 🎯 {a.bestFor}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50/50 border border-amber-200 p-3 mb-4">
                    <div className="text-xs font-semibold text-amber-900 mb-1">为什么选它</div>
                    <div className="text-sm text-foreground/85">{a.reasonOverOriginal}</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 mb-1.5">优势</div>
                      <ul className="space-y-1 text-sm">
                        {a.pros.map((p) => (
                          <li key={p} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <span className="text-foreground/85">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-rose-700 mb-1.5">劣势</div>
                      <ul className="space-y-1 text-sm">
                        {a.cons.map((c) => (
                          <li key={c} className="flex items-start gap-1.5">
                            <span className="text-rose-400 shrink-0">×</span>
                            <span className="text-foreground/85">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">常见问题</h2>
            <div className="space-y-3">
              {alt.faq.map((f, i) => (
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
            <h2 className="text-xl font-bold tracking-tight mb-5">其他替代品榜单</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/alternatives/${r.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="text-3xl shrink-0">{r.originalEmoji}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm leading-tight">
                      {r.originalName} 替代品
                    </div>
                    <div className="text-xs text-muted">{r.alternatives.length} 个推荐</div>
                  </div>
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
              本榜单按子墨实际使用排序。不是简单列举，是真正用过 1 周以上才推荐。每月更新。
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="font-semibold mb-1 text-sm">📬 看更多替代品</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              订阅周报，每周整理一个工具替代清单
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
            <div className="font-semibold text-sm mb-1">💼 你的工具想上替代清单？</div>
            <Link href="/submit" className="text-foreground hover:underline">
              查看推广方案 →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
