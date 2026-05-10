"use client";

import { useState } from "react";
import { ToolCard } from "./tool-card";
import type { Tool } from "@/lib/types";
import { ui } from "@/lib/i18n";

type TabKey = "today" | "new" | "saved" | "trending" | "extension" | "app";

const TABS: { key: TabKey; label: string }[] = [
  { key: "today", label: ui.tabs.today },
  { key: "new", label: ui.tabs.new },
  { key: "saved", label: ui.tabs.saved },
  { key: "trending", label: ui.tabs.trending },
  { key: "extension", label: ui.tabs.extension },
  { key: "app", label: ui.tabs.app },
];

export function TabSwitch({ tools }: { tools: Tool[] }) {
  const [active, setActive] = useState<TabKey>("today");
  const filtered = (() => {
    switch (active) {
      case "today":
        return tools.slice(0, 12);
      case "new":
        return [...tools]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 12);
      case "saved":
        return [...tools].sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0)).slice(0, 12);
      case "trending":
        return tools.filter((t) => t.level === "L1" || t.level === "L2").slice(0, 12);
      case "extension":
        return tools.filter((t) => t.tags.some((x) => x.includes("浏览器") || x.includes("扩展"))).slice(0, 12);
      case "app":
        return tools.filter((t) => t.tags.some((x) => x.includes("App") || x.includes("应用"))).slice(0, 12);
    }
  })();
  return (
    <section>
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`shrink-0 px-3.5 py-1.5 text-sm rounded-full border transition-colors ${
              active === t.key
                ? "bg-zinc-900 text-white border-zinc-900"
                : "border-border text-muted hover:text-foreground hover:border-foreground/20 bg-card"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-sm text-muted py-12 text-center border border-dashed border-border rounded-xl">
          {ui.tabs.emptyHint}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
