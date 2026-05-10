"use client";

import { useState } from "react";
import Link from "next/link";

const PREFIXES = ["", "Get", "Use", "Try", "Go", "My", "Just", "On", "By", "Hey", "Open", "Smart", "Quick", "Easy", "Pro"];
const SUFFIXES = ["", "AI", "Hub", "Lab", "Kit", "Pro", "Cloud", "io", "Box", "Wave", "Nest", "Hive", "Pad", "Spark", "Loop"];
const VERBS = ["build", "make", "craft", "spin", "flow", "rise", "snap", "boost", "lift", "fly"];
const NOUNS = ["mind", "spark", "wave", "loop", "atom", "axis", "core", "echo", "vibe", "pulse"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateNames(seed: string): string[] {
  if (!seed.trim()) return [];
  const base = seed.trim().toLowerCase().replace(/\s+/g, "");
  const cap = base.charAt(0).toUpperCase() + base.slice(1);

  const names = new Set<string>();

  // 1. Prefix + Seed
  for (const p of shuffle(PREFIXES).slice(0, 3)) {
    names.add(p ? p + cap : cap);
  }
  // 2. Seed + Suffix
  for (const s of shuffle(SUFFIXES).slice(0, 3)) {
    names.add(s ? cap + s : cap);
  }
  // 3. Seed + .ai .io .app
  names.add(`${base}.ai`);
  names.add(`${base}.io`);
  names.add(`${base}.app`);
  // 4. Verb + Seed
  for (const v of shuffle(VERBS).slice(0, 2)) {
    names.add(v + cap);
  }
  // 5. Seed + Noun
  for (const n of shuffle(NOUNS).slice(0, 2)) {
    names.add(cap + n.charAt(0).toUpperCase() + n.slice(1));
  }
  // 6. Misc creative
  names.add(`${cap}ly`);
  names.add(`${cap}ify`);
  names.add(`${cap}r`);
  names.add(`${cap}ist`);

  return Array.from(names).slice(0, 14);
}

export default function AiNameGenerator() {
  const [seed, setSeed] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    setResults(generateNames(seed));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <nav className="text-sm text-muted mb-4">
          <Link href="/free" className="hover:text-foreground">免费工具</Link>
          <span className="mx-2">/</span>
          <span>AI 工具命名生成器</span>
        </nav>
        <div className="flex items-start gap-4">
          <div className="text-5xl">✨</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              AI 工具命名生成器
            </h1>
            <p className="text-muted">
              输入你的核心关键词，1 秒生成 14 个备选品牌名 + 域名建议
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm font-medium mb-2">核心关键词（英文）</label>
        <div className="flex gap-2">
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="比如 resume / video / agent / writer..."
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={generate}
            className="px-6 py-3 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90"
          >
            生成
          </button>
        </div>
        <div className="mt-3 text-xs text-muted">
          💡 建议先尝试 1-2 个核心英文单词。生成器会自动加前后缀 / 改造。
        </div>
      </div>

      {results.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4">14 个候选名字</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
              >
                <span className="font-mono font-semibold">{name}</span>
                <a
                  href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(name.replace(/\.(ai|io|app)$/, ""))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-700 hover:underline shrink-0 ml-2"
                >
                  查域名 →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-sm">
            <div className="font-semibold mb-1">📒 子墨建议</div>
            <ul className="space-y-1 text-xs text-foreground/80">
              <li>· <strong>4-8 个字母最佳</strong>：好记好打字</li>
              <li>· <strong>避开通用词</strong>：「smart / better / new」开头基本都被注</li>
              <li>· <strong>.ai 域名最贴 AI 站</strong>，但 $100-300/年贵；.com 最稳</li>
              <li>· <strong>查重要查商标</strong>：注册前在 USPTO 和中国商标局查一次</li>
            </ul>
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href="/free/ai-description-generator" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md">
          <span className="text-2xl">📝</span>
          <div>
            <div className="font-semibold text-sm">AI 工具描述生成器</div>
            <div className="text-xs text-muted">生成官网级文案</div>
          </div>
        </Link>
        <Link href="/list/ai-startups-monetizing" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md">
          <span className="text-2xl">💸</span>
          <div>
            <div className="font-semibold text-sm">在赚钱的 AI 公司</div>
            <div className="text-xs text-muted">看人家怎么命名</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
