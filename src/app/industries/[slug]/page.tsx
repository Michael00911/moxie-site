import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getIndustryBySlug,
  industries,
} from "@/lib/industries";
import { purposes } from "@/lib/purposes";
import { getIntersectionsByIndustry } from "@/lib/intersections";

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustryBySlug(slug);
  if (!ind) return { title: "未找到" };
  return { title: ind.metaTitle, description: ind.metaDesc };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = getIndustryBySlug(slug);
  if (!ind) notFound();

  const intersectionsForIndustry = getIntersectionsByIndustry(slug);
  const otherIndustries = industries.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className={`border-b border-border bg-gradient-to-br ${ind.gradient}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/industries" className="hover:text-foreground">行业</Link>
            <span className="mx-2">/</span>
            <span>{ind.name}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="text-6xl shrink-0">{ind.emoji}</div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">{ind.name}</h1>
              <p className="text-foreground/80 mb-1">{ind.description}</p>
              <p className="text-sm text-muted">适合：{ind.audience}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-12 min-w-0">
          {/* Intro */}
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">这个行业的 AI 红利</h2>
            <p className="text-foreground/80 leading-relaxed">{ind.intro}</p>
          </article>

          {/* Benchmarks */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">📈 优秀对标</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {ind.benchmarks.map((b) => (
                <article
                  key={b.name}
                  className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl shrink-0">{b.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-base leading-tight">{b.name}</div>
                      <div className="text-xs text-muted">{b.oneliner}</div>
                    </div>
                  </div>
                  <div className="text-base font-bold mt-2">{b.metric}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-1 pt-3 border-t border-border">
                    {b.team && (
                      <div>
                        <div className="text-muted">团队</div>
                        <div className="font-medium">{b.team}</div>
                      </div>
                    )}
                    {b.trafficSource && (
                      <div>
                        <div className="text-muted">流量来源</div>
                        <div className="font-medium">{b.trafficSource}</div>
                      </div>
                    )}
                    {b.founded && (
                      <div>
                        <div className="text-muted">起步</div>
                        <div className="font-medium">{b.founded}</div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* By Purpose */}
          {intersectionsForIndustry.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-5">
                🎯 按用途看 {ind.name} AI 落地
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {intersectionsForIndustry.map((it) => {
                  const purpose = purposes.find((p) => p.slug === it.purposeSlug);
                  return (
                    <Link
                      key={`${it.industrySlug}-${it.purposeSlug}`}
                      href={`/industries/${ind.slug}/${it.purposeSlug}`}
                      className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                    >
                      <div className="text-2xl shrink-0">{purpose?.emoji}</div>
                      <div className="min-w-0">
                        <div className="font-semibold leading-tight group-hover:underline">
                          {it.title}
                        </div>
                        <div className="text-xs text-muted line-clamp-1 mt-1">{it.hero}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Pitfalls */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">⚠️ 典型坑</h3>
              <ul className="space-y-2 text-sm">
                {ind.pitfalls.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0">×</span>
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">✅ 致胜要点</h3>
              <ul className="space-y-2 text-sm">
                {ind.winningPrinciples.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-foreground/85"
                    dangerouslySetInnerHTML={{
                      __html: "<span class='text-emerald-500 shrink-0 mr-2'>✓</span>" + p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">常见问题</h2>
            <div className="space-y-3">
              {ind.faq.map((f, i) => (
                <details key={i} className="rounded-xl border border-border bg-card group" open={i === 0}>
                  <summary className="cursor-pointer p-4 font-medium flex items-center justify-between">
                    <span>{f.q}</span>
                    <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Other industries */}
          <section className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold tracking-tight mb-5">看其他行业</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {otherIndustries.map((o) => (
                <Link
                  key={o.slug}
                  href={`/industries/${o.slug}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border border-border hover:shadow-md bg-gradient-to-br ${o.gradient}`}
                >
                  <div className="text-3xl shrink-0">{o.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{o.name}</div>
                    <div className="text-xs text-muted line-clamp-1">{o.audience}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start space-y-5">
          {ind.moxieService && (
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
              <div className="text-xs text-muted mb-1">Moxie 行业方案</div>
              <div className="font-bold mb-1">{ind.moxieService.name}</div>
              <div className="text-2xl font-bold tracking-tight mb-2">{ind.moxieService.price}</div>
              <div className="text-xs text-muted leading-relaxed mb-4">{ind.moxieService.desc}</div>
              <Link
                href={ind.moxieService.href}
                className="block text-center py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
              >
                查看方案 →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4 text-xs">
            <div className="font-semibold mb-2">📩 行业洞察周报</div>
            <p className="text-muted leading-relaxed mb-3">每周一封 {ind.name} 行业的 AI 落地信息</p>
            <input type="email" placeholder="your@email.com" className="w-full px-2 py-1.5 text-xs rounded border border-border bg-white mb-2" />
            <button className="w-full py-1.5 rounded bg-zinc-900 text-white text-xs">免费订阅</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
