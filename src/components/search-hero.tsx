"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/lib/i18n";

export function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [exIdx] = useState(() => Math.floor(Math.random() * ui.search.examples.length));
  const example = ui.search.examples[exIdx];
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim() || example;
    router.push(`/tools?q=${encodeURIComponent(v)}`);
  };
  return (
    <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`${ui.search.placeholderPrefix}${example}${ui.search.placeholderSuffix}`}
        className="w-full pl-12 pr-28 h-14 rounded-2xl border border-border bg-card text-base focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">🔍</div>
      <button
        type="submit"
        className="absolute right-2 top-2 h-10 px-5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {ui.search.button}
      </button>
    </form>
  );
}
