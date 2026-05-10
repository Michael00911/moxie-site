import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPurposeBySlug, purposes } from "@/lib/purposes";
import { tools } from "@/lib/data";
import { industries } from "@/lib/industries";
import { getIntersectionsByPurpose } from "@/lib/intersections";

export async function generateStaticParams() {
  return purposes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPurposeBySlug(slug);
  if (!p) return { title: "未找到" };
  return { title: p.metaTitle, description: p.metaDesc };
}

export default async function PurposeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const purpose = getPurposeBySlug(slug);
  if (!purpose) notFound();

  const purposeTools = purpose.toolSlugs
    .map((sl) => tools.find((t) => t.slug === sl))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const intersections = getIntersectionsByPurpose(slug);
  const otherPurposes = purposes.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className={`border-b border-border bg-gradient-to-br ${purpose.gradient}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/by" className="hover:text-foreground">按用途</Link>
            <span className="mx-2">/</span>
            <span>{purpose.name}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="text-6xl shrink-0">{purpose.emoji}</div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">{purpose.name}</h1>
              <p className="text-foreground/80 mb-1">{purpose.question}</p>
              <p className="text-sm text-muted">{purpose.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-12 min-w-0">
          {/* Intro */}
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">为什么这个用途值得关注</h2>
            <p className="text-foreground/80 leading-relaxed">{purpose.intro}</p>
          </article>

          {/* Tool stack */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">推荐工具栈</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {purposeTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted-bg flex items-center justify-center text-2xl shrink-0">
                    🔧
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold leading-tight group-hover:underline">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted line-clamp-2 mt-0.5">{t.tagline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4">📋 标准工作流</h2>
            <ol className="space-y-3">
              {purpose.workflow.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Case studies */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">💼 客户案例</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {purpose.caseStudies.map((c, i) => (
                <article
                  key={i}
                  className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card"
                >
                  <div className="text-3xl">{c.emoji}</div>
                  <div className="font-bold text-base">{c.client}</div>
                  <div className="text-sm text-muted leading-relaxed">{c.outcome}</div>
                  <div className="mt-2 pt-3 border-t border-border">
                    <div className="text-xs text-muted">关键指标</div>
                    <div className="text-base font-bold">{c.metric}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* By Industry */}
          {intersections.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-5">
                🏭 按行业看「{purpose.name}」
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {intersections.map((it) => {
                  const industry = industries.find((x) => x.slug === it.industrySlug);
                  return (
                    <Link
                      key={`${it.industrySlug}-${it.purposeSlug}`}
                      href={`/industries/${it.industrySlug}/${it.purposeSlug}`}
                      className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                    >
                      <div className="text-2xl shrink-0">{industry?.emoji}</div>
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

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">常见问题</h2>
            <div className="space-y-3">
              {purpose.faq.map((f, i) => (
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

          {/* Other purposes */}
          <section className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold tracking-tight mb-5">看其他用途</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {otherPurposes.map((o) => (
                <Link
                  key={o.slug}
                  href={`/by/${o.slug}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border border-border hover:shadow-md bg-gradient-to-br ${o.gradient}`}
                >
                  <div className="text-3xl shrink-0">{o.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{o.name}</div>
                    <div className="text-xs text-muted line-clamp-1">{o.question}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start space-y-5">
          {purpose.moxieService && (
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
              <div className="text-xs text-muted mb-1">Moxie 用途方案</div>
              <div className="font-bold mb-1">{purpose.moxieService.name}</div>
              <div className="text-2xl font-bold tracking-tight mb-2">{purpose.moxieService.price}</div>
              <div className="text-xs text-muted leading-relaxed mb-4">{purpose.moxieService.desc}</div>
              <Link
                href={purpose.moxieService.href}
                className="block text-center py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
              >
                查看方案 →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4 text-xs">
            <div className="font-semibold mb-2">📩 用途周报</div>
            <p className="text-muted leading-relaxed mb-3">每周「{purpose.name}」用途的最新工具 + 案例</p>
            <input type="email" placeholder="your@email.com" className="w-full px-2 py-1.5 text-xs rounded border border-border bg-white mb-2" />
            <button className="w-full py-1.5 rounded bg-zinc-900 text-white text-xs">免费订阅</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
