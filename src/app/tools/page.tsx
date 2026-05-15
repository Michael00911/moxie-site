import Link from "next/link";
import type { Metadata } from "next";
import { categories, tools } from "@/lib/data";
import { ToolCard } from "@/components/tool-card";
import { LEVEL_LABEL, type ToolLevel } from "@/lib/types";

export const metadata: Metadata = {
  title: "全部工具",
  description: "Moxie收录的全部 AI 工具，按分类、等级、关键词筛选",
};

export const dynamic = "force-static";

const LEVELS: ToolLevel[] = ["L1", "L2", "L3", "L4"];

export default async function ToolsPage() {
  const filtered = tools;

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
          <FilterChip href="/tools" active={true}>
            全部
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              active={false}
            >
              {cat.emoji} {cat.name}
            </FilterChip>
          ))}
        </FilterRow>
        <FilterRow label="等级">
          <FilterChip href="/tools" active={true}>
            全部
          </FilterChip>
          {LEVELS.map((lvl) => (
            <FilterChip key={lvl} href={`/tools?level=${lvl}`} active={false}>
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
