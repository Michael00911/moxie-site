import Link from "next/link";
import {
  LEVEL_BADGE_CLASS,
  LEVEL_LABEL,
  type Tool,
} from "@/lib/types";
import { categories } from "@/lib/types";

const PRICING_LABEL: Record<Tool["pricing"], string> = {
  free: "免费",
  freemium: "免费+付费",
  paid: "付费",
};

export function ToolCard({ tool, dense }: { tool: Tool; dense?: boolean }) {
  const cat = categories.find((c) => c.slug === tool.category);
  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border bg-card p-4 hover:shadow-md transition-all ${
        tool.isSponsored
          ? "border-amber-300 bg-amber-50/40"
          : "border-border hover:border-foreground/20"
      }`}
    >
      {tool.isSponsored && (
        <div className="absolute top-3 right-3 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500 text-white tracking-wider">
          赞助
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-muted-bg flex items-center justify-center text-2xl shrink-0">
          {cat?.emoji ?? "🔧"}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/tools/${tool.slug}`}
            className="block font-semibold truncate hover:underline"
          >
            {tool.name}
          </Link>
          {tool.nameEn && tool.nameEn !== tool.name && (
            <div className="text-xs text-muted truncate">{tool.nameEn}</div>
          )}
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            {tool.rating != null && (
              <span className="text-amber-500">
                {"★".repeat(tool.rating)}
                <span className="text-zinc-300">{"★".repeat(5 - tool.rating)}</span>
              </span>
            )}
            <span className="text-muted">·</span>
            <span className="text-muted">{PRICING_LABEL[tool.pricing]}</span>
            {!tool.isSponsored && (
              <>
                <span className="text-muted">·</span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${LEVEL_BADGE_CLASS[tool.level]}`}
                >
                  {LEVEL_LABEL[tool.level]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
        {tool.tagline}
      </p>
      {!dense && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 6).map((tag) => (
            <Link
              key={tag}
              href={`/tools?q=${encodeURIComponent(tag)}`}
              className="text-[11px] px-1.5 py-0.5 rounded bg-muted-bg text-muted hover:text-foreground hover:bg-muted-bg/70"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 rounded-xl"
        aria-label={tool.name}
      />
    </div>
  );
}
