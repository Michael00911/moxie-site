"use client";

import { useState } from "react";
import Link from "next/link";
import type { LaunchEntry } from "@/lib/launches";

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  gold: { label: "🌟 GOLD", color: "bg-amber-500 text-white" },
  standard: { label: "STANDARD", color: "bg-zinc-900 text-white" },
  free: { label: "FREE", color: "bg-muted-bg text-muted" },
};

export function LaunchCard({ launch }: { launch: LaunchEntry }) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(launch.votes);
  const tier = TIER_BADGE[launch.tier];

  return (
    <article
      className={`relative flex gap-4 p-5 rounded-2xl border transition-all hover:shadow-md ${
        launch.tier === "gold"
          ? "border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/40 to-card"
          : launch.tier === "standard"
          ? "border-border bg-card"
          : "border-border bg-card"
      }`}
    >
      {/* Vote button */}
      <button
        onClick={() => {
          setVoted((v) => !v);
          setCount((c) => (voted ? c - 1 : c + 1));
        }}
        className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border-2 transition-all shrink-0 ${
          voted
            ? "border-amber-500 bg-amber-50 text-amber-700"
            : "border-border bg-card hover:border-amber-300 text-muted hover:text-amber-700"
        }`}
      >
        <span className="text-base leading-none">▲</span>
        <span className="text-sm font-bold mt-0.5">{count}</span>
      </button>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{launch.emoji}</span>
            <Link
              href={launch.toolSlug ? `/tools/${launch.toolSlug}` : launch.url}
              className="font-bold text-base hover:underline"
              {...(launch.toolSlug ? {} : { target: "_blank", rel: "noreferrer" })}
            >
              {launch.name}
            </Link>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${tier.color}`}>
              {tier.label}
            </span>
          </div>
          <span className="text-[10px] text-muted shrink-0 mt-1">#{launch.slot}</span>
        </div>
        <p className="text-sm text-foreground/85 mb-2 leading-snug line-clamp-2">
          {launch.tagline}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
          <span>👤 {launch.maker}</span>
          <span>·</span>
          <span>💬 {launch.commentCount}</span>
          {launch.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-muted-bg text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
