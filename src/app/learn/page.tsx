import Link from "next/link";
import type { Metadata } from "next";
import { learnTracks } from "@/lib/business";

export const metadata: Metadata = {
  title: "AI 学习路径",
  description: "从入门到 Vibe Coding 创业，子墨设计的 4 阶 AI 学习地图",
};

export default function LearnPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-900 mb-5">
          📚 AI 学习路径
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          从「0 会用 AI」到
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            「AI 创业 $5k MRR」
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">
          子墨自己走完一遍后整理的 4 阶路径。
          每一阶都有免费内容可以自学，需要 1对1 加速时再升级。
        </p>
      </header>

      {/* Track timeline */}
      <div className="space-y-6">
        {learnTracks.map((track, idx) => (
          <article
            key={track.slug}
            className="relative grid gap-6 md:grid-cols-[200px_1fr] rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all"
          >
            <div className="flex md:flex-col items-start gap-4 md:gap-2">
              <div className="text-5xl">{track.emoji}</div>
              <div>
                <div className="text-xs text-muted">阶段 {track.level}</div>
                <div className="font-bold text-lg leading-tight">{track.name}</div>
                <div className="text-xs text-muted mt-1">⏱ {track.duration}</div>
              </div>
            </div>
            <div>
              <p className="text-foreground/85 mb-4 leading-relaxed">{track.desc}</p>
              <div className="grid gap-2 sm:grid-cols-2 mb-5">
                {track.modules.map((m) => (
                  <div key={m} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-500 shrink-0 mt-0.5">▸</span>
                    <span className="text-foreground/80">{m}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                <div className="flex-1">
                  <div className="text-xs text-muted">完成后预期收益</div>
                  <div className="font-semibold">{track.outcome}</div>
                </div>
                <Link
                  href={track.cta.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-opacity ${
                    idx >= 2
                      ? "bg-zinc-900 text-white hover:opacity-90"
                      : "border border-border bg-card hover:bg-muted-bg"
                  }`}
                >
                  {track.cta.label}
                </Link>
              </div>
            </div>
            {idx < learnTracks.length - 1 && (
              <div className="absolute left-[100px] -bottom-3 w-0.5 h-3 bg-border" />
            )}
          </article>
        ))}
      </div>

      {/* All-in CTA */}
      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="text-xl font-bold tracking-tight mb-2">不知道自己在哪一阶？</h2>
          <p className="text-muted mb-5">
            做个 3 分钟测评，告诉我你的 AI 使用现状，我推荐起点。
          </p>
          <Link
            href="/learn/quiz"
            className="inline-flex px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
          >
            测一下 →
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-8">
          <h2 className="text-xl font-bold tracking-tight mb-2">不想自己摸索，想直接复制结果？</h2>
          <p className="text-muted mb-5">
            买子墨工具栈包 / 出海资源库 / Vibe Coding 启动包，跳过 80% 弯路。
          </p>
          <Link
            href="/services"
            className="inline-flex px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
          >
            查看子墨产品 →
          </Link>
        </div>
      </section>
    </div>
  );
}
