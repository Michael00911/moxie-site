import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, tools } from "@/lib/data";

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getToolBySlug(slug);
  return {
    title: t ? `${t.name} 徽章嵌入代码` : "徽章未找到",
  };
}

export default async function BadgePreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getToolBySlug(slug);
  if (!t) notFound();

  const baseUrl = "https://moxie.ai"; // 部署后替换为真实域名
  const embedCode = `<a href="${baseUrl}/tools/${slug}?ref=embed" target="_blank">
  <img src="${baseUrl}/badge/img/${slug}"
       alt="${t.name} - Featured on Moxie"
       width="280" height="80" />
</a>`;

  const markdownCode = `[![${t.name} - Featured on Moxie](${baseUrl}/badge/img/${slug})](${baseUrl}/tools/${slug}?ref=embed)`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/badge" className="hover:text-foreground">嵌入徽章</Link>
        <span className="mx-2">/</span>
        <span>{t.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {t.name} 嵌入徽章
        </h1>
        <p className="text-muted leading-relaxed">
          复制下面的代码贴到你的网站。点击会跳转到 {t.name} 在Moxie的详情页。
        </p>
      </header>

      {/* Preview */}
      <section className="rounded-2xl border border-border bg-card p-8 mb-8">
        <div className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">
          预览
        </div>
        <div className="rounded-lg bg-muted-bg/30 p-6 flex items-center justify-center">
          <img
            src={`/badge/img/${slug}`}
            alt={`${t.name} featured badge`}
            width={280}
            height={80}
            style={{ height: "auto" }}
          />
        </div>
      </section>

      {/* HTML embed */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">HTML 嵌入代码</h2>
          <span className="text-xs text-muted">大多数网站</span>
        </div>
        <pre className="rounded-lg bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
          {embedCode}
        </pre>
      </section>

      {/* Markdown embed */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Markdown 嵌入代码</h2>
          <span className="text-xs text-muted">README / 博客</span>
        </div>
        <pre className="rounded-lg bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
          {markdownCode}
        </pre>
      </section>

      {/* Image URL only */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">徽章图片直链</h2>
          <span className="text-xs text-muted">需要直接 URL 时</span>
        </div>
        <pre className="rounded-lg bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
          {baseUrl}/badge/img/{slug}
        </pre>
      </section>

      {/* Why use */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
        <h2 className="font-bold mb-3">📒 子墨建议</h2>
        <ul className="space-y-2 text-sm text-foreground/85">
          <li>· 把徽章贴在<strong>官网首页 footer</strong>或<strong>About 页面</strong>，曝光最高</li>
          <li>· 也可以贴 GitHub README，独立开发者最喜欢看</li>
          <li>· 嵌入后欢迎回到子墨说AI 自媒体留言「我贴了」，子墨会回访点赞</li>
        </ul>
      </section>

      <div className="mt-8 text-center">
        <Link href={`/tools/${slug}`} className="text-sm text-muted hover:text-foreground">
          ← 看 {t.name} 详情页
        </Link>
      </div>
    </div>
  );
}
