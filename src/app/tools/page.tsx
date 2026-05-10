import Link from "next/link";
import type { Metadata } from "next";
import { categories, tools } from "@/lib/data";
import { ToolCard } from "@/components/tool-card";
import { LEVEL_LABEL, type ToolLevel } from "@/lib/types";

export const metadata: Metadata = {
  title: "全部工具",
  description: "Moxie收录的全部 AI 工具，按分类、等级、关键词筛选",
};

const LEVELS: ToolLevel[] = ["L1", "L2", "L3", "L4"];

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category;
  const activeLevel = params.level as ToolLevel | undefined;
  const query = params.q?.toLowerCase().trim();

  let filtered = tools;
  if (activeCategory) filtered = filtered.filter((t) => t.category === activeCategory);
  if (activeLevel) filtered = filtered.filter((t) => t.level === activeLevel);
  if (query) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.nameEn?.toLowerCase().includes(query) ||
        t.tagline.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const next: Record<string, string> = {};
    if (params.category) next.category = params.category;
    if (params.level) next.level = params.level;
    if (params.q) next.q = params.q;
    for (const [k, v] of Object.entries(overrides)) {
      if (v == null) delete next[k];
      else next[k] = v;
    }
    const qs = new URLSearchParams(next).toString();
    return qs ? `/tools?${qs}` : "/tools";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">全部工具</h1>
        <p className="text-muted mt-2">
          共 <span className="font-medium text-foreground">{tools.length}</span> 个工具，按子墨亲测程度分级
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-border">
        <FilterRow label="分类">
          <FilterChip href={buildHref({ category: undefined })} active={!activeCategory}>
            全部
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.slug}
              href={buildHref({ category: cat.slug })}
              active={activeCategory === cat.slug}
            >
              {cat.emoji} {cat.name}
            </FilterChip>
          ))}
        </FilterRow>
        <FilterRow label="等级">
          <FilterChip href={buildHref({ level: undefined })} active={!activeLevel}>
            全部
          </FilterChip>
          {LEVELS.map((lvl) => (
            <FilterChip key={lvl} href={buildHref({ level: lvl })} active={activeLevel === lvl}>
              {LEVEL_LABEL[lvl]}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted">
          <div className="text-4xl mb-3">🔍</div>
          <p>没有匹配的工具</p>
          <Link href="/tools" className="inline-block mt-3 text-sm text-foreground underline">
            清除筛选
          </Link>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted mb-4">
            显示 {filtered.length} / {tools.length}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted shrink-0 w-12">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={active ? { color: "#fff", backgroundColor: "#18181b", borderColor: "#18181b" } : undefined}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
        active
          ? ""
          : "bg-card text-muted border-border hover:text-foreground hover:border-foreground/20"
      }`}
    >
      {children}
    </Link>
  );
}
