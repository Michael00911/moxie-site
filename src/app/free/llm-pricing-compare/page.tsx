import Link from "next/link";
import type { Metadata } from "next";
import { getFreeToolBySlug, llmPricings } from "@/lib/free-tools";

const tool = getFreeToolBySlug("llm-pricing-compare")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDesc,
};

export default function LLMPricingComparePage() {
  const sortedByCheapest = [...llmPricings].sort((a, b) => a.inputPer1M - b.inputPer1M);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <nav className="text-sm text-muted mb-4">
          <Link href="/free" className="hover:text-foreground">免费工具</Link>
          <span className="mx-2">/</span>
          <span>{tool.name}</span>
        </nav>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{tool.emoji}</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{tool.name}</h1>
            <p className="text-muted leading-relaxed">{tool.description}</p>
            <div className="mt-3 text-xs text-muted">最近更新：2026.05 · 数据每月校对</div>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted-bg/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">模型</th>
                <th className="text-left px-4 py-3 font-semibold">厂商</th>
                <th className="text-left px-4 py-3 font-semibold">上下文</th>
                <th className="text-right px-4 py-3 font-semibold">输入 / 1M</th>
                <th className="text-right px-4 py-3 font-semibold">输出 / 1M</th>
                <th className="text-right px-4 py-3 font-semibold">缓存输入</th>
                <th className="text-left px-4 py-3 font-semibold">备注</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCheapest.map((p, i) => (
                <tr
                  key={p.model}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted-bg/20"}
                >
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-1.5">{p.emoji}</span>
                    {p.model}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.vendor}</td>
                  <td className="px-4 py-3 text-muted">{p.context}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    ${p.inputPer1M.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    ${p.outputPer1M.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted">
                    {p.cachedInput ? `$${p.cachedInput.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{p.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Insight emoji="💸" title="最便宜">
          <strong>{sortedByCheapest[0].model}</strong>
          <br />
          <span className="text-xs text-muted">
            ${sortedByCheapest[0].inputPer1M.toFixed(2)} / 1M 输入
          </span>
        </Insight>
        <Insight emoji="⚡" title="最快响应">
          <strong>Gemini 2.5 Flash</strong>
          <br />
          <span className="text-xs text-muted">轻量级任务首选</span>
        </Insight>
        <Insight emoji="🧠" title="最强推理">
          <strong>Claude Opus 4.7</strong>
          <br />
          <span className="text-xs text-muted">复杂任务质量第一</span>
        </Insight>
      </section>

      {/* 子墨建议 */}
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
        <h2 className="text-lg font-bold tracking-tight mb-3 flex items-center gap-2">
          📒 子墨的选型建议
        </h2>
        <ul className="space-y-2 text-sm text-foreground/85">
          <li>· <strong>后端 / 批量任务</strong>：DeepSeek V3.2（便宜 10-30 倍，效果接近）</li>
          <li>· <strong>前端用户面向</strong>：Claude Sonnet 4.7（质量稳定）</li>
          <li>· <strong>需要 1M 上下文</strong>：Claude / Gemini 2.5 Pro</li>
          <li>· <strong>移动端 / 边缘场景</strong>：GPT-5 mini / Claude Haiku（成本 + 延迟双优）</li>
          <li>· <strong>开源自托管</strong>：Llama 4 / Qwen3</li>
        </ul>
      </section>

      <FreeToolFooter />
    </div>
  );
}

function Insight({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-xs text-muted mb-1">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function FreeToolFooter() {
  return (
    <section className="mt-12 rounded-2xl border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted mb-3">
        免费工具无需注册。觉得有用？把它加入收藏，下次需要直接打开。
      </p>
      <Link
        href="/free"
        className="text-sm text-foreground hover:underline"
      >
        ← 看更多免费小工具
      </Link>
    </section>
  );
}
