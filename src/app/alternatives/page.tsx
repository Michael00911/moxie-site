import Link from "next/link";
import type { Metadata } from "next";
import { alternatives } from "@/lib/alternatives";

export const metadata: Metadata = {
  title: "AI 工具替代品合集 — ChatGPT / Notion AI / Cursor / Midjourney 替代",
  description:
    "找 AI 工具的替代品？子墨整理 ChatGPT、Notion AI、Cursor、Midjourney 等热门工具的替代清单。",
};

export default function AlternativesIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-900 mb-5">
          🔄 替代品合集
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          AI 工具替代品合集
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          国内不能用 / 价格太贵 / 想试别的 — 这些都是常见想换工具的理由。
          子墨整理热门 AI 工具的替代品清单，每个含多维对比 + 适用场景。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((a) => (
          <Link
            key={a.slug}
            href={`/alternatives/${a.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="text-5xl">{a.originalEmoji}</div>
              <div className="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-900">
                {a.alternatives.length} 替代
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight group-hover:underline">
                {a.originalName} 替代品
              </h2>
              <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
                {a.hero}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-border">
              {a.alternatives.slice(0, 5).map((alt) => (
                <span
                  key={alt.name}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted-bg text-muted"
                >
                  {alt.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
