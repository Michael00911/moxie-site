import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categories,
  getCategoryBySlug,
  getToolBySlug,
  tools,
} from "@/lib/data";
import { ToolCard } from "@/components/tool-card";
import { LEVEL_BADGE_CLASS, LEVEL_LABEL } from "@/lib/types";

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "工具不存在" };
  return {
    title: `${tool.name} — ${tool.tagline}`,
    description: tool.description,
  };
}

const PRICING_LABEL: Record<string, string> = {
  free: "免费",
  freemium: "免费+付费",
  paid: "付费",
};

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const cat = getCategoryBySlug(tool.category);
  const related = tools
    .filter((t) => t.slug !== tool.slug && t.category === tool.category)
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-foreground">工具</Link>
        {cat && (
          <>
            <span>/</span>
            <Link href={`/tools?category=${cat.slug}`} className="hover:text-foreground">
              {cat.name}
            </Link>
          </>
        )}
      </nav>

      {/* Header */}
      <header className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-muted-bg flex items-center justify-center text-3xl shrink-0">
          {cat?.emoji ?? "🔧"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{tool.name}</h1>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md border ${LEVEL_BADGE_CLASS[tool.level]}`}
            >
              {LEVEL_LABEL[tool.level]}
            </span>
          </div>
          {tool.nameEn && tool.nameEn !== tool.name && (
            <div className="text-muted mb-2">{tool.nameEn}</div>
          )}
          <p className="text-lg text-muted leading-relaxed">{tool.tagline}</p>
        </div>
      </header>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-8 pb-6 border-b border-border">
        {tool.rating != null && (
          <div className="flex items-center gap-2">
            <span className="text-muted">子墨评分</span>
            <span className="text-amber-500">
              {"★".repeat(tool.rating)}
              <span className="text-zinc-300">{"★".repeat(5 - tool.rating)}</span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-muted">价格</span>
          <span>{PRICING_LABEL[tool.pricing]}</span>
          {tool.priceNote && <span className="text-muted text-xs">· {tool.priceNote}</span>}
        </div>
        {cat && (
          <div className="flex items-center gap-2">
            <span className="text-muted">分类</span>
            <Link
              href={`/tools?category=${cat.slug}`}
              className="px-2 py-0.5 rounded bg-muted-bg hover:bg-muted-bg/70"
            >
              {cat.name}
            </Link>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href={tool.affiliateUrl ?? tool.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
        >
          访问官网 ↗
        </a>
        {tool.videoUrl && (
          <a
            href={tool.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
          >
            🎬 看子墨的视频测评
          </a>
        )}
      </div>

      {/* Description */}
      <section className="mb-10">
        <h2 className="text-xl font-bold tracking-tight mb-3">这是什么</h2>
        <p className="text-foreground/80 leading-relaxed">{tool.description}</p>
      </section>

      {/* Zimo's view */}
      {tool.zimoView && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-3 flex items-center gap-2">
            <Image src="/logo.png" alt="子墨" width={28} height={28} className="rounded-md" />
            子墨说
          </h2>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 leading-relaxed text-foreground/90">
            {tool.zimoView}
          </div>
          {tool.videoTitle && tool.videoUrl && (
            <a
              href={tool.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
            >
              📺 配套视频：{tool.videoTitle} ↗
            </a>
          )}
        </section>
      )}

      {/* Good for / not good for */}
      {(tool.goodFor || tool.notGoodFor) && (
        <section className="grid gap-4 md:grid-cols-2 mb-10">
          {tool.goodFor && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>✅</span> 适合
              </h3>
              <ul className="space-y-1.5 text-sm">
                {tool.goodFor.map((item) => (
                  <li key={item} className="text-foreground/80">· {item}</li>
                ))}
              </ul>
            </div>
          )}
          {tool.notGoodFor && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span> 不适合
              </h3>
              <ul className="space-y-1.5 text-sm">
                {tool.notGoodFor.map((item) => (
                  <li key={item} className="text-foreground/80">· {item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Tags */}
      {tool.tags.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm text-muted mb-2">标签</h2>
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md bg-muted-bg text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border pt-10">
          <h2 className="text-xl font-bold tracking-tight mb-5">同类工具</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
