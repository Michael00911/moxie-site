"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { llmPricings } from "@/lib/free-tools";

// 简单 token 估算：英文 ~4 字符/token，中文 ~1.5 字符/token
function estimateTokens(text: string): number {
  if (!text) return 0;
  let cnCount = 0;
  let otherCount = 0;
  for (const ch of text) {
    if (/[一-龥]/.test(ch)) cnCount += 1;
    else otherCount += 1;
  }
  return Math.ceil(cnCount / 1.5 + otherCount / 4);
}

export default function TokenCalculator() {
  const [text, setText] = useState(
    "把下面 prompt 粘贴进来，自动算出 token 数和各家模型的 API 调用成本：\n\n你是一个资深的产品经理..."
  );
  const [outputTokens, setOutputTokens] = useState(500);

  const inputTokens = useMemo(() => estimateTokens(text), [text]);

  const costs = useMemo(
    () =>
      llmPricings
        .map((p) => ({
          ...p,
          inputCost: (inputTokens / 1_000_000) * p.inputPer1M,
          outputCost: (outputTokens / 1_000_000) * p.outputPer1M,
          totalCost: (inputTokens / 1_000_000) * p.inputPer1M + (outputTokens / 1_000_000) * p.outputPer1M,
        }))
        .sort((a, b) => a.totalCost - b.totalCost),
    [inputTokens, outputTokens]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <nav className="text-sm text-muted mb-4">
          <Link href="/free" className="hover:text-foreground">免费工具</Link>
          <span className="mx-2">/</span>
          <span>AI Token 计算器</span>
        </nav>
        <div className="flex items-start gap-4">
          <div className="text-5xl">🧮</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              AI Token 计算器
            </h1>
            <p className="text-muted">
              粘贴 prompt，自动估算 token 数 + Claude / GPT / DeepSeek / Gemini 各家成本对比
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <label className="block text-sm font-medium mb-2">
            你的 Prompt（输入）
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-3 py-2 text-sm rounded-md border border-border bg-card font-mono focus:outline-none focus:border-amber-400 resize-none"
            placeholder="粘贴你的 prompt..."
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted">字符数：</span>
              <span className="font-mono font-semibold">{text.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted">≈ Tokens：</span>
              <span className="font-mono font-bold text-amber-700">{inputTokens.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <label className="block text-sm font-medium mb-2">
              预期输出 tokens
              <span className="text-xs text-muted ml-2">（一般 200-2000）</span>
            </label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Math.max(0, parseInt(e.target.value || "0")))}
              className="w-full px-3 py-2 rounded-md border border-border bg-card font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Cost table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 bg-muted-bg/50 border-b border-border">
            <h2 className="text-sm font-semibold">单次调用成本（USD）</h2>
            <div className="text-xs text-muted mt-0.5">
              {inputTokens.toLocaleString()} 输入 + {outputTokens.toLocaleString()} 输出
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <tbody>
                {costs.map((c, i) => (
                  <tr
                    key={c.model}
                    className={`border-b border-border/50 ${i === 0 ? "bg-emerald-50/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        <span className="mr-1">{c.emoji}</span>
                        {c.model}
                      </div>
                      <div className="text-[10px] text-muted">{c.vendor}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <div className="font-semibold">${c.totalCost.toFixed(5)}</div>
                      <div className="text-[10px] text-muted">
                        ¥{(c.totalCost * 7.2).toFixed(4)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notes */}
      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/40 p-5 text-sm">
        <h3 className="font-semibold mb-2">📒 估算说明</h3>
        <ul className="space-y-1 text-foreground/80 text-xs leading-relaxed">
          <li>· 中文按 1.5 字符 = 1 token，英文按 4 字符 = 1 token（粗略估算，实际请用各厂商官方 tokenizer）</li>
          <li>· 价格来自官方公开数据，每月校对一次</li>
          <li>· DeepSeek 在所有模型里成本最低，国内访问最快，是后端 API 首选</li>
          <li>· 用 Prompt Caching 可以再省 70-90% 重复内容成本</li>
        </ul>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/free/llm-pricing-compare"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
        >
          <span className="text-2xl">💰</span>
          <div>
            <div className="font-semibold text-sm">LLM 价格完整对比</div>
            <div className="text-xs text-muted">所有模型详细价格表</div>
          </div>
        </Link>
        <Link
          href="/free/ai-cost-tracker"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
        >
          <span className="text-2xl">📊</span>
          <div>
            <div className="font-semibold text-sm">AI 月费追踪器</div>
            <div className="text-xs text-muted">算出你 AI 订阅总开销</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
