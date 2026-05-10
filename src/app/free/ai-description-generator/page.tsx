"use client";

import { useState } from "react";
import Link from "next/link";

type Style = "professional" | "friendly" | "minimal";

const TEMPLATES: Record<Style, (name: string, fn: string, audience: string) => { tagline: string; oneliner: string; seo: string }> = {
  professional: (name, fn, audience) => ({
    tagline: `${name} — ${fn} 的企业级解决方案`,
    oneliner: `${name} 通过先进的 AI 技术，帮助 ${audience} 高效完成 ${fn}，提升 3 倍生产力。`,
    seo: `${name}：专为${audience}打造的 AI ${fn}工具。智能化工作流、企业级安全、按需扩展。立即免费试用。`,
  }),
  friendly: (name, fn, audience) => ({
    tagline: `用 ${name}，让 ${fn} 不再痛苦`,
    oneliner: `${name} 是给 ${audience} 用的 AI 助手 — 帮你 1 分钟搞定原本要 1 小时的 ${fn}。`,
    seo: `${name}：${audience}最爱的 AI ${fn}神器。简单到能用，强大到惊艳。免费试用 7 天。`,
  }),
  minimal: (name, fn, _audience) => ({
    tagline: `${name}. AI ${fn}.`,
    oneliner: `${name}: AI for ${fn}. Less work. Better outcome.`,
    seo: `${name} — AI-powered ${fn} platform. Built for makers and teams. Free tier available.`,
  }),
};

export default function AIDescriptionGenerator() {
  const [name, setName] = useState("");
  const [fn, setFn] = useState("");
  const [audience, setAudience] = useState("");
  const [generated, setGenerated] = useState<{
    style: Style;
    tagline: string;
    oneliner: string;
    seo: string;
  }[]>([]);

  const generate = () => {
    if (!name || !fn) return;
    const _audience = audience || "创业者";
    const styles: Style[] = ["professional", "friendly", "minimal"];
    setGenerated(
      styles.map((s) => ({
        style: s,
        ...TEMPLATES[s](name, fn, _audience),
      }))
    );
  };

  const STYLE_LABEL: Record<Style, { label: string; emoji: string; color: string }> = {
    professional: { label: "专业商务", emoji: "💼", color: "border-zinc-300 bg-zinc-50" },
    friendly: { label: "亲切活泼", emoji: "😊", color: "border-amber-300 bg-amber-50/60" },
    minimal: { label: "极简英文", emoji: "✨", color: "border-blue-300 bg-blue-50/60" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <nav className="text-sm text-muted mb-4">
          <Link href="/free" className="hover:text-foreground">免费工具</Link>
          <span className="mx-2">/</span>
          <span>AI 工具描述生成器</span>
        </nav>
        <div className="flex items-start gap-4">
          <div className="text-5xl">📝</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              AI 工具描述生成器
            </h1>
            <p className="text-muted">
              输入工具核心信息，AI 出 3 段不同风格的官网文案 + 一句话简介 + SEO 描述
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <Field label="工具名 *" value={name} setValue={setName} placeholder="例如：Claimly" />
        <Field
          label="核心功能 *"
          value={fn}
          setValue={setFn}
          placeholder="例如：航班延误自动索赔 / AI 视频生成 / 简历定制"
        />
        <Field
          label="目标用户（可选）"
          value={audience}
          setValue={setAudience}
          placeholder="例如：跨境电商 / 独立开发者 / 程序员"
        />
        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90"
        >
          生成 3 种风格文案
        </button>
      </div>

      {generated.length > 0 && (
        <section className="mt-10 space-y-4">
          {generated.map((g) => {
            const meta = STYLE_LABEL[g.style];
            return (
              <article
                key={g.style}
                className={`rounded-2xl border p-5 ${meta.color}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{meta.emoji}</span>
                  <span className="font-bold">{meta.label}</span>
                </div>
                <Output label="一句话标语 (Hero Tagline)" content={g.tagline} />
                <Output label="官网介绍 (Homepage Description)" content={g.oneliner} />
                <Output label="SEO Meta Description" content={g.seo} />
              </article>
            );
          })}
        </section>
      )}

      <section className="mt-12 grid gap-3 sm:grid-cols-2">
        <Link href="/free/ai-name-generator" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md">
          <span className="text-2xl">✨</span>
          <div>
            <div className="font-semibold text-sm">命名生成器</div>
            <div className="text-xs text-muted">还没起好品牌名？</div>
          </div>
        </Link>
        <Link href="/blog/ai-tool-stack-content-creator" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md">
          <span className="text-2xl">📒</span>
          <div>
            <div className="font-semibold text-sm">子墨写文案的工具栈</div>
            <div className="text-xs text-muted">看子墨自己怎么写</div>
          </div>
        </Link>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  setValue,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-md border border-border bg-card focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}

function Output({ label, content }: { label: string; content: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="rounded-lg border border-border bg-white/70 backdrop-blur p-3 text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}
