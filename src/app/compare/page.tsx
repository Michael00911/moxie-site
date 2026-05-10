import Link from "next/link";
import type { Metadata } from "next";
import { compares } from "@/lib/compare";

export const metadata: Metadata = {
  title: "AI 工具对比合集 — Claude vs ChatGPT / DeepSeek vs Claude / Cursor vs Claude Code",
  description:
    "子墨实测的 AI 工具一对一对比。每个对比 8 维度 × 6 场景 × FAQ，5 分钟看完做决策。",
};

export default function CompareIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-700 mb-5">
          ⚔️ AI 工具对比
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          AI 工具一对一对比
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          子墨实测的工具横评。每个对比含 8 维度表格 + 6 场景推荐 + 子墨最终判断 + FAQ。
          5 分钟看完不再纠结。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {compares.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-center gap-3 text-4xl py-3">
              <span>{c.a.emoji}</span>
              <span className="text-xs font-bold text-muted">VS</span>
              <span>{c.b.emoji}</span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight group-hover:underline">
                {c.a.name} vs {c.b.name}
              </h2>
              <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
                {c.intro}
              </p>
            </div>
            <div className="text-xs text-muted mt-auto pt-3 border-t border-border">
              {c.dimensions.length} 维度 · {c.scenarios.length} 场景 · 含 FAQ
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
