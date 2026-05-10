"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { findMatchingIntents, intents } from "@/lib/use-cases";
import { tools } from "@/lib/data";

const QUICK_PROMPTS = [
  "我要做抖音 AI 视频博主",
  "我想用 AI 写代码做 SaaS",
  "我要做出海赚美元",
  "我要做调研 / 写报告",
  "我要做 AI 客服降本",
  "我要批量做广告素材",
  "我要 AI 改简历",
  "我要做汇报 PPT",
];

export default function UseCaseFinderPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const matched = useMemo(() => findMatchingIntents(submitted), [submitted]);

  const search = (q: string) => {
    setQuery(q);
    setSubmitted(q);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🎯 AI Use Case Finder
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          告诉我你想干嘛
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            {" "}
            子墨推荐工具组合
          </span>
        </h1>
        <p className="text-muted max-w-xl mx-auto leading-relaxed">
          不用按工具分类找。直接用大白话说你想做什么，子墨给你 3-5 个工具的组合 + 完整工作流。
        </p>
      </header>

      {/* Search box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
        className="mb-6"
      >
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：「我想做抖音 AI 博主」「我要用 AI 做出海 SaaS」..."
            className="w-full pl-12 pr-28 h-14 rounded-2xl border-2 border-amber-200 bg-card text-base focus:outline-none focus:border-amber-400 transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">🎯</div>
          <button
            type="submit"
            className="absolute right-2 top-2 h-10 px-5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
          >
            找方案
          </button>
        </div>
      </form>

      {/* Quick prompts */}
      <div className="mb-10">
        <div className="text-xs text-muted mb-2">大家常问：</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => search(p)}
              className="px-3 py-1.5 text-sm rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-foreground/20"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {submitted && matched.length === 0 && (
        <section className="rounded-2xl border border-dashed border-border p-10 text-center mb-10">
          <div className="text-4xl mb-3">🤔</div>
          <h2 className="font-bold mb-2">这个场景子墨还没整理过</h2>
          <p className="text-sm text-muted mb-4">
            试试上面的快捷选项，或者{" "}
            <a href="mailto:hi@moxie.ai" className="text-foreground underline">
              告诉子墨
            </a>{" "}
            你的需求。
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
          >
            浏览全部 AI 工具 →
          </Link>
        </section>
      )}

      {matched.map((intent) => (
        <article
          key={intent.title}
          className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/40 to-card p-6 mb-6"
        >
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            ✨ {intent.title}
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-6">{intent.scenario}</p>

          {/* Tools */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 text-muted uppercase tracking-wider">
              推荐工具栈
            </h3>
            <div className="space-y-2">
              {intent.recommendedTools.map((rt, i) => {
                const tool = tools.find((t) => t.slug === rt.toolSlug);
                if (!tool) return null;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex items-start gap-3 p-3 rounded-xl bg-card border border-border hover:shadow-md transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold group-hover:underline">
                        {tool.name}
                      </div>
                      <div className="text-xs text-muted">{rt.role}</div>
                    </div>
                    <span className="text-muted shrink-0 text-sm">→</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Workflow */}
          {intent.workflow && (
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 text-muted uppercase tracking-wider">
                完整工作流
              </h3>
              <ol className="space-y-2">
                {intent.workflow.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <span className="text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {intent.tips && (
            <div className="rounded-xl border border-amber-200 bg-white/60 backdrop-blur p-4">
              <div className="text-sm font-bold mb-2">📒 子墨建议</div>
              <ul className="space-y-1.5 text-sm text-foreground/85">
                {intent.tips.map((t, i) => (
                  <li key={i}>· {t}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      ))}

      {/* All intents browse */}
      {!submitted && (
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-5">
            浏览全部使用场景
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {intents.map((i) => (
              <button
                key={i.title}
                onClick={() => search(i.keywords[0])}
                className="text-left flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
              >
                <div className="font-semibold">{i.title}</div>
                <div className="text-xs text-muted line-clamp-2 leading-relaxed">{i.scenario}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {i.recommendedTools.slice(0, 4).map((rt) => {
                    const t = tools.find((x) => x.slug === rt.toolSlug);
                    return t ? (
                      <span
                        key={rt.toolSlug}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted-bg text-muted"
                      >
                        {t.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
