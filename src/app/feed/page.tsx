import Link from "next/link";
import type { Metadata } from "next";
import { activityFeed } from "@/lib/feed";

export const metadata: Metadata = {
  title: "站点动态 — 实时更新",
  description: "Moxie实时动态：新工具上架、项目挂牌、对比文章、子墨视频、行业新闻。",
};

export default function FeedPage() {
  // group by day
  const groups = activityFeed.reduce<Record<string, typeof activityFeed>>(
    (acc, a) => {
      const key = a.time.includes("分钟") || a.time.includes("小时") ? "今天" : a.time;
      acc[key] = acc[key] ?? [];
      acc[key].push(a);
      return acc;
    },
    {}
  );
  const sections = Object.entries(groups);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          ⚡ 实时动态
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          站点动态
        </h1>
        <p className="text-muted leading-relaxed">
          这里能看到Moxie每分钟在发生什么 — 新工具上架、项目挂牌、新对比、视频发布、行业大事。
        </p>
      </header>

      <div className="space-y-10">
        {sections.map(([key, items]) => (
          <section key={key}>
            <h2 className="text-sm font-bold tracking-tight text-muted uppercase mb-4">
              {key}
            </h2>
            <div className="relative space-y-3 pl-6 border-l-2 border-border">
              {items.map((a) => (
                <Link
                  key={a.id}
                  href={a.href}
                  className="group block rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-foreground/20 transition-all relative"
                >
                  <span className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-amber-500 border-4 border-background" />
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{a.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {a.badge && (
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${a.badgeColor ?? "bg-muted-bg text-muted"}`}
                          >
                            {a.badge}
                          </span>
                        )}
                        <span className="text-xs text-muted">{a.time}</span>
                      </div>
                      <div className="font-semibold leading-tight group-hover:underline">
                        {a.title}
                      </div>
                      {a.desc && (
                        <div className="text-sm text-muted mt-1">{a.desc}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Subscribe */}
      <section className="mt-16 rounded-2xl border border-amber-200 bg-amber-50/40 p-6 text-center">
        <h2 className="text-lg font-bold tracking-tight mb-2">第一时间收到动态？</h2>
        <p className="text-sm text-muted mb-4">
          订阅子墨周报，每周一封整理本周关键动态
        </p>
        <form className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
          />
          <button className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium">
            免费订阅
          </button>
        </form>
      </section>
    </div>
  );
}
