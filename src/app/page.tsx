import Link from "next/link";
import {
  blogPosts,
  categories,
  collections,
  getPlatformMeta,
  getTrendingTools,
  monthlyTop10,
  newsItems,
  recentLaunches,
  sponsors,
  tools,
  weeklyIssues,
  weeklyReviews,
} from "@/lib/data";
import { curatedLists, getListedTools } from "@/lib/lists";
import { compares } from "@/lib/compare";
import { alternatives } from "@/lib/alternatives";
import { freeTools } from "@/lib/free-tools";
import { getLaunchesByDate, getLatestLaunchDate } from "@/lib/launches";
import { industries } from "@/lib/industries";
import { purposes } from "@/lib/purposes";
import { opportunities, projects } from "@/lib/business";
import { ToolCard } from "@/components/tool-card";
import { SponsoredBanner } from "@/components/sponsored-banner";
import { SearchHero } from "@/components/search-hero";
import { ActivityFeed } from "@/components/activity-feed";
import { ui } from "@/lib/i18n";
import { TabSwitch } from "@/components/tab-switch";
import { NewsList } from "@/components/news-list";

const RANK_DELTA_COLOR = (d: number) =>
  d > 0 ? "text-emerald-600" : d < 0 ? "text-rose-500" : "text-muted";
const RANK_DELTA_ICON = (d: number) => (d > 0 ? "▲" : d < 0 ? "▼" : "—");

export default function HomePage() {
  const trending = getTrendingTools(12);
  const featured = tools.filter((t) => t.level === "L1");
  const topSponsor = sponsors.find((s) => s.category === "top")!;
  const featureSponsors = sponsors.filter((s) => s.category === "feature");
  const sponsoredCards = trending.slice(0, 2).map((t) => ({ ...t, isSponsored: true }));
  const todayPick = featured[0];
  const todayLaunchDate = getLatestLaunchDate();
  const todayLaunches = getLaunchesByDate(todayLaunchDate).slice(0, 3);

  return (
    <div>
      {/* TOP SPONSORED STRIP */}
      <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-amber-900">
          <span className="font-bold tracking-widest">{ui.sponsored.featuredOn}</span>
          <span className="text-muted">·</span>
          <span>{ui.sponsored.sponsorBy}</span>
          <a href={topSponsor.url} className="font-semibold hover:underline">
            {topSponsor.name}
          </a>
          <span>{ui.sponsored.sponsorSuffix}</span>
          <span className="text-muted hidden sm:inline">— {topSponsor.tagline}</span>
          <Link href="/submit" className="ml-auto text-amber-900 hover:underline shrink-0">
            {ui.sponsored.becomeSponsor}
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-white to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {ui.hero.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            {ui.hero.title1}
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              {" "}
              {ui.hero.title2}
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {ui.hero.subtitleTotal}{" "}
            <span className="font-semibold text-foreground">{tools.length.toLocaleString()}</span>{" "}
            {ui.hero.subtitleTools}，{ui.hero.subtitleSplit}
          </p>
          <div className="mt-7">
            <SearchHero />
          </div>
          <div className="mt-5 flex justify-center gap-3 sm:gap-6 text-xs text-muted flex-wrap">
            <span>{ui.hero.statNewLaunches}</span>
            <span>{ui.hero.statTopList}</span>
            <span>{ui.hero.statSubscribers}</span>
            <span>{ui.hero.statOversea}</span>
          </div>
        </div>
      </section>

      {/* SPONSORED SLOTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid gap-3 md:grid-cols-2">
          {featureSponsors.map((s) => (
            <SponsoredBanner key={s.name} sponsor={s} />
          ))}
        </div>
      </section>

      {/* 子墨说AI 本周测评（紧凑版）*/}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold tracking-tight">🎬 子墨说AI · 本周测评</h2>
            <span className="text-xs text-muted">已发 {weeklyReviews.length} 期</span>
          </div>
          <a
            href="https://www.douyin.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted hover:text-foreground shrink-0"
          >
            抖音 @子墨说AI →
          </a>
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {weeklyReviews.map((r) => {
            const tool = tools.find((t) => t.slug === r.toolSlug);
            if (!tool) return null;
            const platform = getPlatformMeta(r.platform);
            return (
              <a
                key={r.toolSlug + r.postedAt}
                href={r.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm hover:border-foreground/20 transition-all"
              >
                {/* 视频缩略图 */}
                <div className={`relative aspect-video bg-gradient-to-br ${r.thumbnailGradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[10px] ml-0.5">▶</span>
                    </div>
                  </div>
                  <span className={`absolute top-1 left-1 text-[8px] font-bold px-1 py-0.5 rounded ${platform.color}`}>
                    {platform.label}
                  </span>
                  <span className="absolute bottom-1 right-1 text-[8px] font-medium px-1 py-0.5 rounded bg-black/70 text-white">
                    {r.views}
                  </span>
                </div>
                {/* 视频信息 */}
                <div className="p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-amber-700 font-medium truncate">
                      📒 {tool.name}
                    </span>
                  </div>
                  <div className="text-xs leading-snug line-clamp-2 group-hover:underline">
                    {r.videoTitle}
                  </div>
                  <div className="text-[10px] text-muted mt-1">{r.postedAt}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* TODAY PICK + FRESH LAUNCHES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Today's Pick */}
        {todayPick && (
          <Link
            href={`/tools/${todayPick.slug}`}
            className="group relative flex flex-col gap-4 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/40 to-card p-6 hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500 text-white">
              📍 今日精选
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-3xl shrink-0">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold tracking-tight group-hover:underline">
                  {todayPick.name}
                </h2>
                <div className="text-sm text-muted">{todayPick.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {todayPick.zimoView ?? todayPick.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {todayPick.tags.slice(0, 6).map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-white/70 backdrop-blur text-foreground/80 border border-white/60">
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        )}

        {/* Recent Launches */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-sm">🆕 新品速递</div>
              <div className="text-[11px] text-muted mt-0.5">最近 7 天上架</div>
            </div>
            <Link href="/tools" className="text-xs text-muted hover:text-foreground">
              全部 →
            </Link>
          </div>
          <ol className="space-y-2.5">
            {recentLaunches.slice(0, 6).map((l) => {
              const tool = tools.find((t) => t.slug === l.toolSlug);
              if (!tool) return null;
              return (
                <li key={l.toolSlug + l.date}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 -mx-2 px-2 py-1.5 rounded-md hover:bg-muted-bg/70"
                  >
                    <div className="text-[10px] text-muted shrink-0 w-12">
                      {l.date.slice(5)}
                    </div>
                    <div className="text-sm font-medium truncate flex-1">
                      {tool.name}
                    </div>
                    {l.highlight && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0">
                        {l.highlight}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-12 min-w-0">
            {/* Sponsored + Featured tools */}
            <section>
              <SectionHead
                title="🌟 本月推荐"
                subtitle="付费置顶 + 子墨亲测，混排"
                href="/tools"
                hrefLabel={`查看全部 ${tools.length} 个`}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sponsoredCards.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
                {featured.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>

            {/* Tabs */}
            <TabSwitch tools={tools} />

            {/* 精选榜单 (vertical lists) */}
            <section>
              <SectionHead
                title="📚 精选榜单"
                subtitle="按场景 / 国别 / 价格筛好的垂直清单"
                href="/list"
                hrefLabel="全部 8 份榜单"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {curatedLists.slice(0, 8).map((l) => {
                  const count = getListedTools(l).length;
                  return (
                    <Link
                      key={l.slug}
                      href={`/list/${l.slug}`}
                      className={`group flex flex-col gap-2 p-4 rounded-xl border border-border hover:shadow-md transition-all bg-gradient-to-br ${l.gradient}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-2xl">{l.emoji}</div>
                        <span className="text-[10px] text-muted">{count} 个</span>
                      </div>
                      <div className="font-bold text-sm leading-tight group-hover:underline">
                        {l.title}
                      </div>
                      <div className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                        {l.hero}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Compare + Alternative */}
            <section>
              <SectionHead
                title="⚔️ 工具对比 / 替代品"
                subtitle="不知道选哪个？看实测对比 + 替代清单"
                href="/compare"
                hrefLabel="全部对比"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {compares.slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-foreground/20 transition-all"
                  >
                    <div className="flex items-center gap-1 text-2xl shrink-0">
                      <span>{c.a.emoji}</span>
                      <span className="text-[10px] font-bold text-muted">VS</span>
                      <span>{c.b.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm leading-tight truncate group-hover:underline">
                        {c.a.name} vs {c.b.name}
                      </div>
                      <div className="text-xs text-muted truncate">
                        {c.dimensions.length} 维度 · {c.scenarios.length} 场景
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {alternatives.slice(0, 6).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/alternatives/${a.slug}`}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-violet-200 bg-violet-50/30 hover:shadow-md transition-all"
                  >
                    <div className="text-2xl shrink-0">{a.originalEmoji}</div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate group-hover:underline">
                        {a.originalName} 替代品
                      </div>
                      <div className="text-[11px] text-muted">
                        {a.alternatives.length} 个选择
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 编辑精选合集 */}
            <section>
              <SectionHead
                title="📦 编辑精选合集"
                subtitle="按场景打包好的工具组合，一篮子带走"
                href="/collections"
                hrefLabel="所有合集"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {collections.slice(0, 4).map((col) => (
                  <Link
                    key={col.slug}
                    href={`/collections/${col.slug}`}
                    className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${col.cover} p-5 hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{col.emoji}</div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/70 backdrop-blur border border-white/60">
                        {col.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:underline">
                      {col.title}
                    </h3>
                    <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{col.desc}</p>
                    <div className="flex items-center gap-1 mt-auto">
                      {col.toolSlugs.slice(0, 5).map((sl) => {
                        const t = tools.find((x) => x.slug === sl);
                        return t ? (
                          <span
                            key={sl}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 backdrop-blur text-foreground/80 border border-white/60"
                          >
                            {t.name}
                          </span>
                        ) : null;
                      })}
                      <span className="text-[10px] text-muted">
                        共 {col.toolSlugs.length} 个
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 出海机会（轻量化） */}
            <section>
              <SectionHead
                title="🌏 AI 出海机会"
                subtitle="子墨梳理的赚美元方向，配上工具"
                href="/oversea"
                hrefLabel="完整榜"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {opportunities.slice(0, 6).map((o) => (
                  <Link
                    key={o.slug}
                    href={`/oversea#${o.slug}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-sky-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug group-hover:text-sky-700 transition-colors">
                        {o.title}
                      </h3>
                      {o.recommended && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{o.hook}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted mt-auto pt-2 border-t border-border">
                      <span>💰 {o.earnRange}</span>
                      <span className="text-muted">·</span>
                      <span>{o.difficulty}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 今日 Launch + Find shortcut */}
            <section>
              <SectionHead
                title="🚀 今日上线"
                subtitle={`${todayLaunchDate} · 5 个 AI 工具发布`}
                href="/launches"
                hrefLabel="完整列表"
              />
              <div className="space-y-2">
                {todayLaunches.map((l, i) => (
                  <Link
                    key={l.id}
                    href={l.toolSlug ? `/tools/${l.toolSlug}` : l.url}
                    className={`group flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                      l.tier === "gold"
                        ? "border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/40 to-card"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="text-center shrink-0 w-10">
                      <div className="text-[10px] text-muted">#{i + 1}</div>
                      <div className="text-amber-600 font-bold text-sm">▲ {l.votes}</div>
                    </div>
                    <span className="text-2xl shrink-0">{l.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold group-hover:underline truncate">{l.name}</span>
                        {l.tier === "gold" && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white shrink-0">
                            🌟 GOLD
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted line-clamp-1">{l.tagline}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Industries × Purposes 双维度入口 */}
            <section>
              <SectionHead
                title="🎯 按行业 / 按用途找方案"
                subtitle="创业者的两条决策线索"
                href="/industries"
                hrefLabel="完整矩阵"
              />
              <div className="grid gap-4 md:grid-cols-2">
                {/* By Industry */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold">🏭 按行业</div>
                      <div className="text-xs text-muted">看同行业的对标</div>
                    </div>
                    <Link href="/industries" className="text-xs text-muted hover:text-foreground">
                      全部 →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.slice(0, 6).map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className={`flex items-center gap-2 p-2 rounded-lg border border-border hover:shadow-sm bg-gradient-to-br ${ind.gradient}`}
                      >
                        <span className="text-xl">{ind.emoji}</span>
                        <span className="text-xs font-medium truncate">{ind.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* By Purpose */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold">🎯 按用途</div>
                      <div className="text-xs text-muted">告诉我你要干嘛</div>
                    </div>
                    <Link href="/by" className="text-xs text-muted hover:text-foreground">
                      全部 →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {purposes.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/by/${p.slug}`}
                        className={`flex items-center gap-2 p-2 rounded-lg border border-border hover:shadow-sm bg-gradient-to-br ${p.gradient}`}
                      >
                        <span className="text-xl">{p.emoji}</span>
                        <span className="text-xs font-medium truncate">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* AI Use Case Finder shortcut */}
            <section>
              <Link
                href="/find"
                className="block rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/40 to-rose-50/40 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🎯</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg group-hover:underline">
                      告诉我你想干嘛 → 子墨推荐工具组合
                    </div>
                    <div className="text-sm text-muted mt-1">
                      用大白话搜，比按分类找快 10 倍。「我要做抖音 AI 博主」→ 自动推 5 个工具 + 完整工作流
                    </div>
                  </div>
                  <div className="text-2xl text-muted group-hover:text-foreground transition-colors hidden sm:block">→</div>
                </div>
              </Link>
            </section>

            {/* 免费工具 */}
            <section>
              <SectionHead
                title="🆓 免费小工具"
                subtitle="无需注册，浏览器直接用"
                href="/free"
                hrefLabel="所有工具"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {freeTools.slice(0, 5).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/free/${t.slug}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-foreground/20 transition-all"
                  >
                    <div className="text-2xl">{t.emoji}</div>
                    <div className="font-semibold text-sm leading-tight group-hover:underline">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted line-clamp-2">{t.tagline}</div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 深度文章 */}
            <section>
              <SectionHead
                title="📝 深度文章"
                subtitle="工具对比 / 工作流拆解 / 选型指南"
                href="/blog"
                hrefLabel="全部文章"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {blogPosts.slice(0, 6).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all"
                  >
                    <div className="text-xs text-muted mb-2">
                      {post.date} · {post.readMin} min read
                    </div>
                    <div className="font-semibold leading-snug group-hover:underline mb-2">
                      {post.title}
                    </div>
                    <div className="text-sm text-muted leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-7 lg:sticky lg:top-20 lg:self-start">
            {/* Newsletter */}
            <div className="rounded-xl border border-border bg-gradient-to-br from-amber-50 to-orange-50/50 p-5">
              <div className="text-2xl mb-2">📬</div>
              <div className="font-semibold mb-1">子墨说AI 周报</div>
              <div className="text-xs text-muted mb-3 leading-relaxed">
                每周一封 · 5 个亲测工具 + 出海机会 + 行业新闻
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-white mb-2 focus:outline-none focus:border-amber-400"
              />
              <button className="w-full py-2 rounded-md bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                免费订阅
              </button>
              <div className="text-[10px] text-muted mt-2">
                已有 2,300+ 订阅者 · 已发 47 期
              </div>
            </div>

            {/* Monthly Top 10 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold tracking-tight">🏆 本月 Top 10</h3>
                <span className="text-xs text-muted">2026.05</span>
              </div>
              <ol className="space-y-1.5">
                {monthlyTop10.map((r) => {
                  const t = tools.find((x) => x.slug === r.toolSlug);
                  if (!t) return null;
                  return (
                    <li key={r.rank}>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="flex items-center gap-2.5 -mx-2 px-2 py-1.5 rounded-md hover:bg-muted-bg/70"
                      >
                        <span
                          className={`shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                            r.rank <= 3 ? "bg-amber-500 text-white" : "bg-muted-bg text-muted"
                          }`}
                        >
                          {r.rank}
                        </span>
                        <span className="text-sm font-medium truncate flex-1">
                          {t.name}
                          {r.hot && <span className="ml-1">🔥</span>}
                        </span>
                        <span className={`text-[11px] shrink-0 ${RANK_DELTA_COLOR(r.delta)}`}>
                          {RANK_DELTA_ICON(r.delta)}
                          {r.delta !== 0 ? Math.abs(r.delta) : ""}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Weekly issues */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold tracking-tight">📩 周报往期</h3>
                <Link href="/weekly" className="text-xs text-muted hover:text-foreground">
                  全部 →
                </Link>
              </div>
              <ul className="space-y-3">
                {weeklyIssues.slice(0, 4).map((w) => (
                  <li key={w.number}>
                    <Link
                      href={`/weekly/${w.number}`}
                      className="block group"
                    >
                      <div className="text-[10px] text-muted">
                        Issue #{w.number} · {w.date}
                      </div>
                      <div className="text-sm leading-snug group-hover:underline">
                        {w.title}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* News */}
            {/* Activity feed - 站点动态 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold tracking-tight">⚡ 站点动态</h3>
                <Link href="/feed" className="text-xs text-muted hover:text-foreground">
                  全部 →
                </Link>
              </div>
              <ActivityFeed limit={8} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold tracking-tight">📰 AI 新闻</h3>
                <span className="text-xs text-muted">每日</span>
              </div>
              <NewsList items={newsItems.slice(0, 6)} />
            </div>

            {/* Tiny B2B card (低调) */}
            <div className="rounded-xl border border-dashed border-border p-4 text-xs">
              <div className="font-semibold text-sm mb-1">📞 商务合作</div>
              <div className="text-muted leading-relaxed mb-2">
                工具方推广 · 企业 AI 落地 · KOL 测评
              </div>
              <Link
                href="/services"
                className="text-foreground hover:underline"
              >
                查看方案 →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-t border-border bg-muted-bg/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <SectionHead
            title="按场景找工具"
            subtitle={`${categories.length} 个分类 · ${tools.length} 个工具`}
            href="/categories"
            hrefLabel="全部分类"
          />
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat) => {
              const count = tools.filter((t) => t.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/tools?category=${cat.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="font-medium text-sm">{cat.name}</div>
                  <div className="text-xs text-muted">{count} 个工具</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOT TAGS / BROWSE BY LETTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold tracking-tight mb-5">热门标签</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            "#AI编程",
            "#视频生成",
            "#图像生成",
            "#语音合成",
            "#国产",
            "#开源",
            "#自动化",
            "#AI Agent",
            "#出海",
            "#TikTok",
            "#Newsletter",
            "#Vibe Coding",
            "#Anthropic",
            "#字节",
            "#高性价比",
            "#数字人",
            "#PPT 生成",
            "#工作流",
            "#美区",
            "#Affiliate",
          ].map((tag) => (
            <Link
              key={tag}
              href={`/tools?q=${encodeURIComponent(tag.replace("#", ""))}`}
              className="px-3 py-1 text-sm rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-foreground/20"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-5">按字母浏览</h2>
        <div className="flex flex-wrap gap-1">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <Link
              key={letter}
              href={`/tools?q=${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-border bg-card text-sm font-medium hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
            >
              {letter}
            </Link>
          ))}
          <Link
            href="/tools?q=#"
            className="w-10 h-10 flex items-center justify-center rounded-md border border-border bg-card text-sm font-medium hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
          >
            #
          </Link>
        </div>
      </section>

      {/* FINAL CTA — 工具站调性，不是企业销售 */}
      <section className="border-t border-border bg-gradient-to-b from-amber-50/40 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            每天有 100 个新 AI 工具上线
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-7">
            子墨说AI 帮你筛掉 990 个，每周一封周报，告诉你只有 10 个值得用的。
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:border-amber-400"
            />
            <button className="px-6 py-3 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity">
              免费订阅
            </button>
          </form>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-muted">
            <Link href="/submit" className="hover:text-foreground">提交工具</Link>
            <span>·</span>
            <Link href="/services" className="hover:text-foreground">商务合作</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-foreground">关于子墨</Link>
            <span>·</span>
            <a href="mailto:hi@moxie.ai" className="hover:text-foreground">hi@moxie.ai</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  title,
  subtitle,
  href,
  hrefLabel,
}: {
  title: string;
  subtitle: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-muted mt-0.5">{subtitle}</p>
      </div>
      <Link href={href} className="text-sm text-muted hover:text-foreground shrink-0">
        {hrefLabel} →
      </Link>
    </div>
  );
}
