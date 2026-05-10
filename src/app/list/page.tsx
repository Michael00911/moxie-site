import Link from "next/link";
import type { Metadata } from "next";
import { curatedLists, getListedTools } from "@/lib/lists";

export const metadata: Metadata = {
  title: "AI 工具榜单合集 — 国产 / 开源 / 免费 / 创作者 / 开发者",
  description:
    "子墨说AI 整理的 AI 工具垂直榜单。按场景 / 国别 / 价格 / 角色筛好的精选清单，找工具不再大海捞针。",
};

export default function CuratedListsIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          📚 精选榜单
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          AI 工具榜单合集
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          按场景 / 国别 / 价格 / 角色筛好的精选清单。子墨亲测排序，每周更新。
          每份榜单都是一个独立 SEO 入口 — 想找什么类型的 AI，从这里点进去就对了。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {curatedLists.map((l) => {
          const count = getListedTools(l).length;
          return (
            <Link
              key={l.slug}
              href={`/list/${l.slug}`}
              className={`group flex flex-col gap-3 rounded-2xl border border-border p-6 hover:shadow-md transition-all bg-gradient-to-br ${l.gradient}`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">{l.emoji}</div>
                <div className="text-xs px-2 py-0.5 rounded bg-white/70 backdrop-blur border border-white/60">
                  {count} 个
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight group-hover:underline">
                  {l.title}
                </h2>
                <p className="text-sm text-foreground/85 mt-1 leading-relaxed">{l.hero}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/60">
                {l.highlightTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/70 backdrop-blur border border-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Submit list CTA */}
      <section className="mt-16 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight mb-2">
          想看哪个垂直榜单？
        </h2>
        <p className="text-sm text-muted mb-5">
          告诉我们你想看的 AI 工具分类，我们会优先收录。
        </p>
        <a
          href="mailto:hi@moxie.ai?subject=榜单选题建议"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          告诉我们 →
        </a>
      </section>
    </div>
  );
}
