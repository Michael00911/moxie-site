import Link from "next/link";
import type { Metadata } from "next";
import { categories, tools } from "@/lib/data";

export const metadata: Metadata = {
  title: "分类",
  description: "按场景浏览 AI 工具分类",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">按场景浏览</h1>
        <p className="text-muted mt-2">挑你今天要解决的问题</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat.slug);
          const featured = catTools.filter((t) => t.level === "L1" || t.level === "L2").slice(0, 3);
          return (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{cat.emoji}</div>
                <div className="text-xs text-muted">{catTools.length} 个工具</div>
              </div>
              <div>
                <h2 className="font-semibold group-hover:text-accent-foreground transition-colors">
                  {cat.name}
                </h2>
                <p className="text-sm text-muted mt-1">{cat.description}</p>
              </div>
              {featured.length > 0 && (
                <div className="mt-2 pt-3 border-t border-border">
                  <div className="text-xs text-muted mb-1.5">子墨推荐</div>
                  <div className="flex flex-wrap gap-1.5">
                    {featured.map((t) => (
                      <span
                        key={t.slug}
                        className="text-xs px-2 py-0.5 rounded bg-muted-bg text-foreground/80"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
