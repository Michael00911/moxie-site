import Link from "next/link";
import type { Metadata } from "next";
import {
  listings,
  marketplaceCategories,
  marketplaceStats,
  type Listing,
} from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "AI 项目交易市场 — 中文独立开发者 SaaS / 内容站收购",
  description:
    "中文独立开发者项目交易市场。AI SaaS / Newsletter / 内容站 / 电商独立站挂牌出售，子墨撮合，月新增 12+ 项目。",
};

export const dynamic = "force-static";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active: { label: "在售", color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  negotiating: { label: "谈判中", color: "bg-amber-100 text-amber-900 border-amber-200" },
  sold: { label: "已售出", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
};

export default async function MarketplacePage() {
  const filtered = listings;
  const featured = filtered.filter((l) => l.tier === "featured");
  const rest = filtered.filter((l) => l.tier !== "featured");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-amber-50 via-orange-50/40 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
            🏪 子墨撮合 · 中文项目交易市场
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            买卖独立开发者项目
            <br />
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              子墨说AI 帮你撮合
            </span>
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            中文独立开发者退出市场。AI SaaS / Newsletter / 电商 / 代运营公司挂牌交易，
            子墨亲自审核 + 估值 + 撮合，让买卖双方都安心。
          </p>

          {/* Stats */}
          <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4 max-w-3xl">
            <Stat num={`${marketplaceStats.totalListings}`} label="在售项目" />
            <Stat num={`$${(marketplaceStats.totalGMV / 1000).toFixed(0)}k`} label="挂牌总额" />
            <Stat num={`${marketplaceStats.successfulDeals}`} label="撮合成功" />
            <Stat num={`+${marketplaceStats.monthlyAddedListings}`} label="月新增挂牌" />
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/marketplace/list"
              className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
            >
              挂牌出售你的项目 →
            </Link>
            <a
              href="mailto:business@moxie.ai?subject=想买项目"
              className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
            >
              联系子墨找项目
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0 space-y-10">
          {/* Categories filter */}
          <section>
            <div className="flex flex-wrap gap-2 mb-6">
              <FilterChip href="/marketplace" active={true}>
                全部分类
              </FilterChip>
              {marketplaceCategories.map((c) => (
                <FilterChip
                  key={c.slug}
                  href={`/marketplace?category=${c.slug}`}
                  active={false}
                >
                  {c.emoji} {c.name}
                </FilterChip>
              ))}
            </div>

            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold tracking-tight mb-5 flex items-center gap-2">
                  ⭐ Featured 推荐
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {featured.map((l) => (
                    <ListingCard key={l.slug} listing={l} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-5">所有挂牌项目</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {rest.map((l) => (
                    <ListingCard key={l.slug} listing={l} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-orange-50/50 p-5">
            <div className="text-2xl mb-2">📒</div>
            <div className="font-semibold mb-1">子墨担保撮合</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              所有挂牌都经子墨审核（数据真实性 + 估值合理性）。撮合走第三方托管，资金安全。
            </div>
            <Link
              href="/marketplace/how-it-works"
              className="text-xs text-foreground hover:underline"
            >
              撮合流程 →
            </Link>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
            <div className="font-semibold mb-1 text-sm">💰 想出售你的项目？</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              免费挂牌，撮合成功抽 8%。Featured 套餐 ¥1,499 / 90 天。
            </div>
            <Link
              href="/marketplace/list"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-900 text-white text-xs hover:opacity-90"
            >
              挂牌方案 →
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-semibold mb-1 text-sm">🔍 想买项目找不到？</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              告诉我们你想买什么类型的项目，我们从池里推荐适合的。
            </div>
            <a
              href="mailto:business@moxie.ai?subject=买项目需求"
              className="text-xs text-foreground hover:underline"
            >
              提交求购需求 →
            </a>
          </div>

          <div className="rounded-xl border border-dashed border-border p-4 text-xs">
            <div className="font-semibold text-sm mb-1">📬 新挂牌通知</div>
            <div className="text-muted leading-relaxed mb-3">
              新挂牌项目子墨周报第一时间推送。
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-2 py-1.5 text-xs rounded border border-border bg-white mb-2"
            />
            <button className="w-full py-1.5 rounded bg-zinc-900 text-white text-xs">
              订阅
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ListingCard({ listing, featured }: { listing: Listing; featured?: boolean }) {
  const status = STATUS_LABEL[listing.status];
  return (
    <Link
      href={`/marketplace/${listing.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border p-5 hover:shadow-md transition-all ${
        featured
          ? "border-amber-300 bg-gradient-to-br " + listing.gradient
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="text-3xl shrink-0">{listing.emoji}</div>
          <div className="min-w-0">
            <div className="font-bold leading-tight group-hover:underline truncate">
              {listing.name}
            </div>
            <div className="text-xs text-muted mt-0.5 line-clamp-1">{listing.tagline}</div>
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight">
          ${listing.askingPriceUSD.toLocaleString()}
        </span>
        <span className="text-xs text-muted">要价</span>
      </div>

      {(listing.mrr || listing.arr) && (
        <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-border/60">
          {listing.mrr ? (
            <div>
              <div className="text-muted">MRR</div>
              <div className="font-semibold">${listing.mrr}</div>
            </div>
          ) : <div />}
          {listing.arr ? (
            <div>
              <div className="text-muted">ARR</div>
              <div className="font-semibold">${listing.arr.toLocaleString()}</div>
            </div>
          ) : <div />}
          <div>
            <div className="text-muted">运营</div>
            <div className="font-semibold">{listing.ageMonths} 月</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-1">
        {listing.techStack.slice(0, 4).map((s) => (
          <span
            key={s}
            className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 backdrop-blur border border-white/40 text-foreground/80"
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-card text-muted border-border hover:text-foreground hover:border-foreground/20"
      }`}
    >
      {children}
    </Link>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-3">
      <div className="text-xl font-bold tracking-tight">{num}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
