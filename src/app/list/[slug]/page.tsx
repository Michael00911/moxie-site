import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  curatedLists,
  getCuratedListBySlug,
  getListedTools,
} from "@/lib/lists";
import { sponsors } from "@/lib/data";
import { ToolCard } from "@/components/tool-card";
import { SponsoredBanner } from "@/components/sponsored-banner";

export async function generateStaticParams() {
  return curatedLists.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const list = getCuratedListBySlug(slug);
  if (!list) return { title: "榜单未找到" };
  return {
    title: list.metaTitle,
    description: list.metaDesc,
  };
}

export default async function CuratedListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = getCuratedListBySlug(slug);
  if (!list) notFound();

  const tools = getListedTools(list);
  const sponsoredCard = tools[0] ? { ...tools[0], isSponsored: true } : null;
  const restTools = tools.slice(sponsoredCard ? 1 : 0);
  const featureSponsor = sponsors.find((s) => s.category === "feature");

  // 推荐其他榜单
  const relatedLists = curatedLists.filter((l) => l.slug !== slug).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${list.gradient}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span>/</span>
            <Link href="/list" className="hover:text-foreground">榜单</Link>
            <span>/</span>
            <span>{list.title}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="text-6xl shrink-0">{list.emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
                {list.title}
              </h1>
              <p className="text-lg text-foreground/80 mb-3">{list.hero}</p>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {list.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {list.highlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-white/70 backdrop-blur border border-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-4 text-sm text-muted">
                <span>共 <strong className="text-foreground">{tools.length}</strong> 个工具</span>
                <span>·</span>
                <span>更新于 2026.05</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid + sidebar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-10 min-w-0">
          {/* SEO Intro */}
          <article className="rounded-2xl border border-border bg-card p-6 prose prose-zinc">
            <h2 className="text-lg font-bold tracking-tight mb-3">为什么需要这份榜单</h2>
            <p className="text-foreground/80 leading-relaxed">{list.intro}</p>
          </article>

          {/* Sponsored slot */}
          {featureSponsor && (
            <SponsoredBanner sponsor={featureSponsor} />
          )}

          {/* Tools list */}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-5">
              工具清单（共 {tools.length} 个）
            </h2>
            {tools.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted text-sm">
                正在补充中
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {sponsoredCard && <ToolCard tool={sponsoredCard} />}
                {restTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </div>

          {/* FAQ */}
          {list.faq.length > 0 && (
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">常见问题</h2>
              <div className="space-y-3">
                {list.faq.map((f, i) => (
                  <details
                    key={i}
                    className="rounded-xl border border-border bg-card group"
                    open={i === 0}
                  >
                    <summary className="cursor-pointer p-4 font-medium flex items-center justify-between">
                      <span>{f.q}</span>
                      <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">
                      {f.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related lists */}
          <section className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold tracking-tight mb-5">其他榜单</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedLists.map((rl) => (
                <Link
                  key={rl.slug}
                  href={`/list/${rl.slug}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border border-border bg-gradient-to-br ${rl.gradient} hover:shadow-md transition-all`}
                >
                  <div className="text-2xl shrink-0">{rl.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight truncate">{rl.title}</div>
                    <div className="text-xs text-muted line-clamp-1">{rl.hero}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold mb-1 text-sm">📒 子墨亲测</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              本榜单按子墨实测评分排序，每周更新。
            </div>
            <div className="text-xs text-muted">最近更新：2026.05.07</div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="font-semibold mb-1 text-sm">📬 想第一时间看新榜？</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              订阅每周一封的子墨说AI 周报
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
            <div className="font-semibold text-sm mb-1">💼 推广合作</div>
            <div className="text-muted leading-relaxed mb-2">
              工具方想置顶到这份榜单？
            </div>
            <Link href="/submit" className="text-foreground hover:underline">
              查看推广方案 →
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
