"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Listing } from "@/lib/marketplace";
import { marketplaceCategories } from "@/lib/marketplace";

type MarketplaceCategory = (typeof marketplaceCategories)[number];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active:      { label: "在售",   color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  negotiating: { label: "谈判中", color: "bg-amber-100 text-amber-900 border-amber-200" },
  sold:        { label: "已售出", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
};

export function MarketplaceList({
  listings,
  categories,
}: {
  listings: Listing[];
  categories: MarketplaceCategory[];
}) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? undefined;

  const filtered  = activeCategory ? listings.filter((l) => l.category === activeCategory) : listings;
  const featured  = filtered.filter((l) => l.tier === "featured");
  const rest      = filtered.filter((l) => l.tier !== "featured");

  return (
    <section>
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip href="/marketplace" active={!activeCategory}>全部分类</FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.slug} href={`/marketplace?category=${c.slug}`} active={activeCategory === c.slug}>
            {c.emoji} {c.name}
          </FilterChip>
        ))}
      </div>

      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-5 flex items-center gap-2">⭐ Featured 推荐</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.slug} listing={l} featured />)}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-5">所有挂牌项目</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((l) => <ListingCard key={l.slug} listing={l} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function ListingCard({ listing, featured }: { listing: Listing; featured?: boolean }) {
  const status = STATUS_LABEL[listing.status];
  return (
    <Link
      href={`/marketplace/${listing.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border p-5 hover:shadow-md transition-all ${
        featured ? "border-amber-300 bg-gradient-to-br " + listing.gradient : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="text-3xl shrink-0">{listing.emoji}</div>
          <div className="min-w-0">
            <div className="font-bold leading-tight group-hover:underline truncate">{listing.name}</div>
            <div className="text-xs text-muted mt-0.5 line-clamp-1">{listing.tagline}</div>
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight">${listing.askingPriceUSD.toLocaleString()}</span>
        <span className="text-xs text-muted">要价</span>
      </div>

      {(listing.mrr || listing.arr) && (
        <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-border/60">
          {listing.mrr ? <div><div className="text-muted">MRR</div><div className="font-semibold">${listing.mrr}</div></div> : <div />}
          {listing.arr ? <div><div className="text-muted">ARR</div><div className="font-semibold">${listing.arr.toLocaleString()}</div></div> : <div />}
          <div><div className="text-muted">运营</div><div className="font-semibold">{listing.ageMonths} 月</div></div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-1">
        {listing.techStack.slice(0, 4).map((s) => (
          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 backdrop-blur border border-white/40 text-foreground/80">
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
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
