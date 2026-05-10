import Link from "next/link";
import type { Metadata } from "next";
import { freeTools } from "@/lib/free-tools";

export const metadata: Metadata = {
  title: "免费 AI 小工具 — Token 计算器 / LLM 价格对比 / 命名生成器",
  description:
    "Moxie免费小工具集：AI 工具命名生成器、Token 计算器、LLM API 价格对比、AI 月费追踪等。无需注册，浏览器直接用。",
};

const CATEGORY_LABEL: Record<string, { label: string; color: string }> = {
  calculator: { label: "🧮 计算器", color: "bg-amber-50 border-amber-200" },
  generator: { label: "✨ 生成器", color: "bg-violet-50 border-violet-200" },
  compare: { label: "📊 对比", color: "bg-sky-50 border-sky-200" },
  tracker: { label: "📈 追踪", color: "bg-emerald-50 border-emerald-200" },
};

export default function FreeToolsIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🆓 免费小工具
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          免费 AI 小工具集
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          无需注册，浏览器直接用。计算 Token 成本、生成品牌名、对比模型价格、追踪 AI 月费 — 都是 1 分钟搞定的小工具。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {freeTools.map((t) => (
          <Link
            key={t.slug}
            href={`/free/${t.slug}`}
            className={`group flex flex-col gap-3 rounded-2xl border p-6 hover:shadow-md transition-all ${CATEGORY_LABEL[t.category]?.color ?? "bg-card border-border"}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{t.emoji}</div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/60 backdrop-blur border border-white/40">
                {CATEGORY_LABEL[t.category]?.label}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight group-hover:underline">
                {t.name}
              </h2>
              <p className="text-sm text-foreground/85 mt-1 leading-relaxed">{t.tagline}</p>
            </div>
            <div className="text-xs text-muted mt-auto pt-3 border-t border-white/40">
              立即使用 →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
