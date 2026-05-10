import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getListingBySlug,
  listings,
  marketplaceCategories,
} from "@/lib/marketplace";

export async function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getListingBySlug(slug);
  if (!l) return { title: "项目未找到" };
  return {
    title: `${l.name} 出售 — 要价 $${l.askingPriceUSD.toLocaleString()}`,
    description: l.tagline,
  };
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active: { label: "🟢 在售", color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  negotiating: { label: "🟠 谈判中", color: "bg-amber-100 text-amber-900 border-amber-200" },
  sold: { label: "已售出", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getListingBySlug(slug);
  if (!l) notFound();

  const category = marketplaceCategories.find((c) => c.slug === l.category);
  const status = STATUS_LABEL[l.status];
  const related = listings
    .filter((x) => x.slug !== l.slug && x.category === l.category)
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className={`border-b border-border bg-gradient-to-br ${l.gradient}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/marketplace" className="hover:text-foreground">交易市场</Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/marketplace?category=${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-start gap-5">
            <div className="text-6xl shrink-0">{l.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{l.name}</h1>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${status.color}`}>
                  {status.label}
                </span>
                {l.tier === "featured" && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500 text-white">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-lg text-foreground/85 mb-4">{l.tagline}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">
                  ${l.askingPriceUSD.toLocaleString()}
                </span>
                <span className="text-sm text-muted">要价（约 ¥{(l.askingPriceUSD * 7.2).toLocaleString()}）</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-3">项目介绍</h2>
            <p className="text-foreground/85 leading-relaxed">{l.description}</p>
          </section>

          {/* Metrics */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">关键数据</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {l.mrr ? <Stat num={`$${l.mrr.toLocaleString()}`} label="月经常性收入 (MRR)" /> : null}
              {l.arr ? <Stat num={`$${l.arr.toLocaleString()}`} label="年化收入 (ARR)" /> : null}
              {l.monthlyVisitors ? <Stat num={l.monthlyVisitors.toLocaleString()} label="月独立访客" /> : null}
              <Stat num={`${l.ageMonths} 月`} label="运营时长" />
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">技术栈</h2>
            <div className="flex flex-wrap gap-2">
              {l.techStack.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Reason to Sell */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
            <h2 className="text-base font-bold tracking-tight mb-2 flex items-center gap-2">
              💭 为什么出售
            </h2>
            <p className="text-foreground/85">{l.reasonToSell}</p>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-xl font-bold tracking-tight mb-4">交付清单</h2>
            <ul className="space-y-2">
              {l.whatsIncluded.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Process */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold tracking-tight mb-4">撮合流程</h2>
            <ol className="space-y-3 text-sm">
              {[
                "买家发邮件给 business@moxie.ai 表达意向",
                "子墨建群拉进卖家，3 方对话",
                "买卖双方对接谈价 / 看代码 / 签 NDA",
                "走第三方资金托管（Escrow.com）",
                "卖家移交资产 → 买家验收 → 资金释放",
                "子墨抽佣 3-8%（按挂牌套餐）",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="pt-6 border-t border-border">
              <h2 className="text-xl font-bold tracking-tight mb-5">同类项目</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/marketplace/${r.slug}`}
                    className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{r.emoji}</span>
                      <span className="font-semibold text-sm truncate">{r.name}</span>
                    </div>
                    <div className="text-base font-bold">${r.askingPriceUSD.toLocaleString()}</div>
                    {r.mrr && <div className="text-xs text-muted">MRR ${r.mrr}</div>}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start space-y-5">
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
            <div className="text-xs text-muted mb-1">要价</div>
            <div className="text-3xl font-bold tracking-tight mb-1">
              ${l.askingPriceUSD.toLocaleString()}
            </div>
            <div className="text-xs text-muted mb-5">≈ ¥{(l.askingPriceUSD * 7.2).toLocaleString()}</div>
            <a
              href={`mailto:business@moxie.ai?subject=想买 ${l.name}&body=Hi 子墨，我对这个项目（${l.name}）感兴趣，想进一步了解...`}
              className="block text-center py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity mb-2"
            >
              联系子墨撮合
            </a>
            <Link
              href="/marketplace/how-it-works"
              className="block text-center py-2 text-sm text-muted hover:text-foreground"
            >
              看撮合流程 →
            </Link>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs">
            <div className="font-semibold text-sm mb-1">🔒 子墨担保</div>
            <p className="text-muted leading-relaxed">
              所有挂牌项目子墨人工审核（数据真实性 + 法律合规）。撮合走第三方资金托管，资金安全。
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-border p-4 text-xs">
            <div className="font-semibold text-sm mb-1">🚀 也想出售？</div>
            <Link
              href="/marketplace/list"
              className="text-foreground hover:underline"
            >
              查看挂牌方案 →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xl font-bold tracking-tight">{num}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
