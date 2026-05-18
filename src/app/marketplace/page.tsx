import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  listings,
  marketplaceCategories,
  marketplaceStats,
  type Listing,
} from "@/lib/marketplace";
import { MarketplaceList } from "./marketplace-list";

export const metadata: Metadata = {
  title: "AI 项目交易市场 — 中文独立开发者 SaaS / 内容站收购",
  description:
    "中文独立开发者项目交易市场。AI SaaS / Newsletter / 内容站 / 电商独立站挂牌出售，子墨撮合，月新增 12+ 项目。",
};

export default function MarketplacePage() {
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

          <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4 max-w-3xl">
            <Stat num={`${marketplaceStats.totalListings}`} label="在售项目" />
            <Stat num={`$${(marketplaceStats.totalGMV / 1000).toFixed(0)}k`} label="挂牌总额" />
            <Stat num={`${marketplaceStats.successfulDeals}`} label="撮合成功" />
            <Stat num={`+${marketplaceStats.monthlyAddedListings}`} label="月新增挂牌" />
          </div>

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
          {/* 过滤 + 列表由客户端组件处理（useSearchParams） */}
          <Suspense fallback={<div className="text-muted text-sm">加载中…</div>}>
            <MarketplaceList listings={listings} categories={marketplaceCategories} />
          </Suspense>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-orange-50/50 p-5">
            <div className="text-2xl mb-2">📒</div>
            <div className="font-semibold mb-1">子墨担保撮合</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              所有挂牌都经子墨审核（数据真实性 + 估值合理性）。撮合走第三方托管，资金安全。
            </div>
            <Link href="/marketplace/how-it-works" className="text-xs text-foreground hover:underline">
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
            <a href="mailto:business@moxie.ai?subject=买项目需求" className="text-xs text-foreground hover:underline">
              提交求购需求 →
            </a>
          </div>

          <div className="rounded-xl border border-dashed border-border p-4 text-xs">
            <div className="font-semibold text-sm mb-1">📬 新挂牌通知</div>
            <div className="text-muted leading-relaxed mb-3">新挂牌项目子墨周报第一时间推送。</div>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-2 py-1.5 text-xs rounded border border-border bg-white mb-2"
            />
            <button className="w-full py-1.5 rounded bg-zinc-900 text-white text-xs">订阅</button>
          </div>
        </aside>
      </div>
    </div>
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
