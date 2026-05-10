import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getIntersection,
  intersections,
} from "@/lib/intersections";
import { getIndustryBySlug, industries } from "@/lib/industries";
import { getPurposeBySlug, purposes } from "@/lib/purposes";
import { tools } from "@/lib/data";

export async function generateStaticParams() {
  return intersections.map((i) => ({
    slug: i.industrySlug,
    purpose: i.purposeSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; purpose: string }>;
}): Promise<Metadata> {
  const { slug, purpose } = await params;
  const it = getIntersection(slug, purpose);
  if (!it) return { title: "未找到" };
  return { title: it.metaTitle, description: it.metaDesc };
}

export default async function CrossPage({
  params,
}: {
  params: Promise<{ slug: string; purpose: string }>;
}) {
  const { slug, purpose } = await params;
  const it = getIntersection(slug, purpose);
  if (!it) notFound();

  const industry = getIndustryBySlug(it.industrySlug);
  const purposeData = getPurposeBySlug(it.purposeSlug);
  if (!industry || !purposeData) notFound();

  // 推荐 3 个相关交叉页：同行业其他用途
  const sameIndustryOthers = intersections
    .filter((x) => x.industrySlug === slug && x.purposeSlug !== purpose)
    .slice(0, 3);

  const samePurposeOthers = intersections
    .filter((x) => x.purposeSlug === purpose && x.industrySlug !== slug)
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className={`border-b border-border bg-gradient-to-br ${industry.gradient}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span>/</span>
            <Link href="/industries" className="hover:text-foreground">行业</Link>
            <span>/</span>
            <Link href={`/industries/${industry.slug}`} className="hover:text-foreground">
              {industry.emoji} {industry.name}
            </Link>
            <span>/</span>
            <span>{purposeData.emoji} {purposeData.name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-4xl">{industry.emoji}</span>
            <span className="text-2xl text-muted">×</span>
            <span className="text-4xl">{purposeData.emoji}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 max-w-3xl leading-tight">
            {it.title}
          </h1>
          <p className="text-lg text-foreground/85 max-w-2xl leading-relaxed">{it.hero}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-12 min-w-0">
          {/* Intro */}
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">为什么这个组合最值得做</h2>
            <p className="text-foreground/80 leading-relaxed">{it.intro}</p>
          </article>

          {/* Tool Stack */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">🛠️ 推荐工具栈</h2>
            <div className="space-y-3">
              {it.toolStack.map((ts, i) => {
                const tool = tools.find((t) => t.slug === ts.toolSlug);
                if (!tool) return null;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold leading-tight group-hover:underline">{tool.name}</div>
                      <div className="text-xs text-muted">{ts.role}</div>
                    </div>
                    <span className="text-muted shrink-0 text-sm">→</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Workflow */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4">📋 完整工作流</h2>
            <ol className="space-y-3">
              {it.workflow.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Benchmarks */}
          {it.benchmarks.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-5">📈 已经做成的人</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {it.benchmarks.map((b) => (
                  <article key={b.name} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl shrink-0">{b.emoji}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-base leading-tight">{b.name}</div>
                        <div className="text-xs text-muted">{b.oneliner}</div>
                      </div>
                    </div>
                    <div className="text-base font-bold mt-2">{b.metric}</div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Pitfalls */}
          {it.pitfalls && (
            <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">⚠️ 这条路上的典型坑</h3>
              <ul className="space-y-2 text-sm">
                {it.pitfalls.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0">×</span>
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">常见问题</h2>
            <div className="space-y-3">
              {it.faq.map((f, i) => (
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

          {/* Related cross pages */}
          {(sameIndustryOthers.length > 0 || samePurposeOthers.length > 0) && (
            <section className="pt-6 border-t border-border space-y-6">
              {sameIndustryOthers.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">{industry.name} 行业的其他用途</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {sameIndustryOthers.map((other) => {
                      const op = purposes.find((x) => x.slug === other.purposeSlug);
                      return (
                        <Link
                          key={`${other.industrySlug}-${other.purposeSlug}`}
                          href={`/industries/${other.industrySlug}/${other.purposeSlug}`}
                          className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:shadow-md text-sm"
                        >
                          <span className="text-xl">{op?.emoji}</span>
                          <span className="font-medium truncate">{other.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              {samePurposeOthers.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">其他行业怎么做「{purposeData.name}」</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {samePurposeOthers.map((other) => {
                      const oi = industries.find((x) => x.slug === other.industrySlug);
                      return (
                        <Link
                          key={`${other.industrySlug}-${other.purposeSlug}`}
                          href={`/industries/${other.industrySlug}/${other.purposeSlug}`}
                          className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card hover:shadow-md text-sm"
                        >
                          <span className="text-xl">{oi?.emoji}</span>
                          <span className="font-medium truncate">{other.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start space-y-5">
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
            <div className="text-xs text-muted mb-1">Moxie 服务方案</div>
            <div className="font-bold mb-1">{it.moxieService.name}</div>
            <div className="text-2xl font-bold tracking-tight mb-2">{it.moxieService.price}</div>
            <div className="text-xs text-muted leading-relaxed mb-4">{it.moxieService.desc}</div>
            <Link
              href={it.moxieService.href}
              className="block text-center py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 mb-2"
            >
              查看方案 →
            </Link>
            <a
              href="mailto:business@moxie.ai"
              className="block text-center py-1.5 text-sm text-muted hover:text-foreground"
            >
              直接邮件 Moxie
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-xs">
            <div className="font-semibold mb-2">📩 行业 + 用途双周报</div>
            <p className="text-muted leading-relaxed mb-3">每周一封 {industry.name} × {purposeData.name} 的最新案例</p>
            <input type="email" placeholder="your@email.com" className="w-full px-2 py-1.5 text-xs rounded border border-border bg-white mb-2" />
            <button className="w-full py-1.5 rounded bg-zinc-900 text-white text-xs">免费订阅</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
