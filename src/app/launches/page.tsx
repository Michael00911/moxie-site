import Link from "next/link";
import type { Metadata } from "next";
import {
  allLaunchDates,
  getLatestLaunchDate,
  getLaunchesByDate,
  upcomingLaunches,
  launchPlans,
} from "@/lib/launches";
import { LaunchCard } from "@/components/launch-card";

export const metadata: Metadata = {
  title: "每日 AI 工具发布 — Moxie Daily Launch",
  description:
    "Moxie每日 5 个 AI 工具上线发布。Gold / Standard / Free 三档 slot，工具方排队上线，社区投票排序。",
};

export default function LaunchesIndex() {
  const today = getLatestLaunchDate();
  const todayLaunches = getLaunchesByDate(today);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-amber-50/40 via-white to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
            🚀 Daily Launch · 每天 5 个新工具
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            每日 AI 工具发布会
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Moxie每日 5 个 AI 工具上线 · Gold / Standard / Free 三档 slot
            · 社区投票排序 · 周报必推。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/launches/submit"
              className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
            >
              申请上线 Slot →
            </Link>
            <a
              href="#today"
              className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
            >
              看今日上线
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0 space-y-12">
          {/* Today */}
          <section id="today">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  📅 今日上线
                  <span className="text-xs font-normal text-muted">
                    ({today})
                  </span>
                </h2>
                <p className="text-xs text-muted mt-1">投票决定今日 Top，Slot 顺序按 tier 排</p>
              </div>
            </div>
            <div className="space-y-3">
              {todayLaunches.map((l) => (
                <LaunchCard key={l.id} launch={l} />
              ))}
            </div>
          </section>

          {/* History */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">📚 历史发布</h2>
            <div className="space-y-3">
              {allLaunchDates
                .filter((d) => d !== today)
                .map((date) => {
                  const items = getLaunchesByDate(date);
                  const top = items[0];
                  return (
                    <Link
                      key={date}
                      href={`/launches/${date}`}
                      className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                    >
                      <div className="text-center shrink-0 w-20">
                        <div className="text-xs text-muted">
                          {date.split("-")[1]}/{date.split("-")[2]}
                        </div>
                        <div className="text-2xl font-bold mt-1">{items.length}</div>
                        <div className="text-[10px] text-muted">个上线</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{top.emoji}</span>
                          <div className="font-semibold leading-tight truncate group-hover:underline">
                            {top.name}
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                            🌟 GOLD
                          </span>
                        </div>
                        <div className="text-xs text-muted line-clamp-1">{top.tagline}</div>
                      </div>
                      <div className="text-xs text-muted shrink-0">
                        {items.reduce((sum, l) => sum + l.votes, 0)} 票 →
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          {/* Submit CTA */}
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-bold mb-1">申请上线 Slot</div>
            <div className="text-xs text-muted leading-relaxed mb-4">
              Gold / Standard / Free · 联系评估
            </div>
            <Link
              href="/launches/submit"
              className="block text-center py-2 rounded-md bg-zinc-900 text-white text-xs font-medium hover:opacity-90"
            >
              查看 slot 方案 →
            </Link>
          </div>

          {/* Upcoming */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="font-bold text-sm mb-3">⏭️ 即将上线</div>
            <ul className="space-y-3">
              {upcomingLaunches.map((u) => (
                <li key={u.date} className="text-xs">
                  <div className="font-mono text-muted">{u.date.slice(5)}</div>
                  {u.gold ? (
                    <>
                      <div className="font-semibold text-foreground mt-0.5 truncate">
                        🌟 {u.gold}
                      </div>
                      <div className="text-muted truncate">{u.goldTagline}</div>
                    </>
                  ) : (
                    <div className="text-muted">{u.count} 个 slot 待定</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
            <div className="font-bold text-sm mb-1">📬 不漏过任何上线</div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              订阅周报，每周一收到本周 Top 5 launches
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-white mb-2"
            />
            <button className="w-full py-1.5 rounded-md bg-zinc-900 text-white text-xs">
              免费订阅
            </button>
          </div>
        </aside>
      </div>

      {/* Plans */}
      <section className="border-t border-border bg-muted-bg/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              选择你的 Launch Slot
            </h2>
            <p className="text-sm text-muted">三档套餐，从免费排队到指定头条</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {launchPlans.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                  p.highlight
                    ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-card shadow-md"
                    : "border-border bg-card"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold whitespace-nowrap">
                    {p.badge}
                  </div>
                )}
                <div className="font-bold text-lg mb-1">{p.name}</div>
                <div className="text-3xl font-bold tracking-tight mb-2">{p.price}</div>
                <div className="text-sm text-muted mb-5">{p.desc}</div>
                <ul className="space-y-2 text-sm flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <span className="text-foreground/85 text-xs leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/launches/submit"
                  className={`block text-center py-2 rounded-lg font-medium transition-opacity ${
                    p.highlight
                      ? "bg-zinc-900 text-white hover:opacity-90"
                      : "border border-border bg-card hover:bg-muted-bg"
                  }`}
                >
                  联系商务
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
