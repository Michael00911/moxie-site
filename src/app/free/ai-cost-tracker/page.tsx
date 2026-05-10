"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { commonSubscriptions } from "@/lib/free-tools";

export default function AiCostTracker() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalMonthly = useMemo(
    () =>
      commonSubscriptions
        .filter((s) => selected.has(s.id))
        .reduce((sum, s) => sum + s.monthlyUSD, 0),
    [selected]
  );
  const totalYearly = totalMonthly * 12;
  const yearlyRMB = totalYearly * 7.2;

  const selectedItems = commonSubscriptions.filter((s) => selected.has(s.id));
  const withAlts = selectedItems.filter((s) => s.alternative);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <nav className="text-sm text-muted mb-4">
          <Link href="/free" className="hover:text-foreground">免费工具</Link>
          <span className="mx-2">/</span>
          <span>AI 工具月费追踪器</span>
        </nav>
        <div className="flex items-start gap-4">
          <div className="text-5xl">📊</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              AI 工具月费追踪器
            </h1>
            <p className="text-muted">
              勾选你订阅的 AI 工具，自动算出月度 / 年度总开销 + 替代品省钱建议
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main>
          <h2 className="font-semibold mb-4">勾选你订阅的工具</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {commonSubscriptions.map((s) => {
              const isSelected = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-amber-400 bg-amber-50/60 shadow-sm"
                      : "border-border bg-card hover:border-foreground/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "border-border bg-card"
                    }`}
                  >
                    {isSelected && "✓"}
                  </div>
                  <span className="text-2xl shrink-0">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-muted">{s.category}</div>
                  </div>
                  <div className="font-mono text-sm shrink-0">
                    ${s.monthlyUSD}/月
                  </div>
                </button>
              );
            })}
          </div>
        </main>

        {/* Sidebar summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-5">
            <div className="text-xs text-muted mb-1">每月总花费</div>
            <div className="text-3xl font-bold tracking-tight">${totalMonthly}</div>
            <div className="text-xs text-muted mt-2 mb-3">
              ≈ ¥{(totalMonthly * 7.2).toFixed(0)} / 月
            </div>
            <div className="pt-3 border-t border-amber-200">
              <div className="text-xs text-muted mb-1">每年总花费</div>
              <div className="text-2xl font-bold tracking-tight">${totalYearly}</div>
              <div className="text-xs text-muted mt-1">≈ ¥{yearlyRMB.toFixed(0)} / 年</div>
            </div>
            <div className="mt-3 text-xs text-muted">
              已选 {selected.size} / {commonSubscriptions.length} 个工具
            </div>
          </div>

          {withAlts.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
              <div className="font-semibold mb-2 text-sm">💡 子墨省钱建议</div>
              <ul className="space-y-2 text-xs">
                {withAlts.slice(0, 5).map((s) => (
                  <li key={s.id} className="border-l-2 border-emerald-400 pl-2">
                    <div className="font-medium text-foreground">
                      {s.emoji} {s.name} →
                    </div>
                    <div className="text-muted leading-relaxed">{s.alternative}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs text-muted">
                以上替代品大多免费 / 1/10 价格，按需切换可省 50-90%
              </div>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border p-4 text-xs">
            <div className="font-semibold text-sm mb-1">📒 子墨实战</div>
            <p className="text-muted leading-relaxed">
              我自己每月 AI 工具开销约 $80 — Claude Pro + Cursor + 即梦 + ElevenLabs。其他全部用免费替代或 API 按量付费。
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-12 grid gap-3 sm:grid-cols-2">
        <Link
          href="/list/free-ai-tools"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md"
        >
          <span className="text-2xl">🎁</span>
          <div>
            <div className="font-semibold text-sm">免费 AI 工具榜</div>
            <div className="text-xs text-muted">真完全免费的 AI 工具清单</div>
          </div>
        </Link>
        <Link
          href="/free/llm-pricing-compare"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md"
        >
          <span className="text-2xl">💰</span>
          <div>
            <div className="font-semibold text-sm">LLM 价格对比</div>
            <div className="text-xs text-muted">API 调用价格对比表</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
