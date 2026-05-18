import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/data";

export const metadata: Metadata = {
  title: "工具方嵌入徽章 — 把子墨认证贴到你的网站",
  description:
    "你的工具被Moxie收录后，把 Featured Badge 贴到自己网站。1 行代码，自带反向链接 + 信任背书。",
};

export default function BadgeIndexPage() {
  const featured = tools.filter((t) => t.level === "L1" || t.level === "L2");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900 mb-5">
          🏅 工具方嵌入徽章
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          把子墨认证
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            {" "}
            贴到你的网站
          </span>
        </h1>
        <p className="text-muted leading-relaxed max-w-2xl">
          你的工具被Moxie收录后，可以把 Featured Badge 贴到自己网站。
          1 行 HTML，自带反向链接（DR 提升）+ 用户信任背书。
        </p>
      </header>

      {/* Demo */}
      <section className="rounded-2xl border border-border bg-card p-8 mb-10">
        <h2 className="text-lg font-bold mb-4">徽章预览（点击工具名查看你的徽章）</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {featured.slice(0, 6).map((t) => (
            <Link
              key={t.slug}
              href={`/badge/preview/${t.slug}`}
              className="rounded-lg border border-border p-3 bg-muted-bg/40 hover:shadow-md transition-all"
            >
              <img
                src={`/badge/${t.slug}`}
                alt={`${t.name} featured badge`}
                width={280}
                height={80}
                className="w-full h-auto"
              />
              <div className="text-xs text-muted text-center mt-2">点击查看代码 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="grid gap-4 md:grid-cols-3 mb-10">
        <Why emoji="🔗" title="SEO 反向链接" desc="每个嵌入 = 一个 dofollow 反链，提升你的 DR。" />
        <Why emoji="🏆" title="第三方信任背书" desc="子墨 IP 10万+ 粉丝，访客一眼认出。" />
        <Why emoji="📈" title="流量回流" desc="点击徽章直接跳到Moxie详情页 → 转化用户。" />
      </section>

      {/* Embed code */}
      <section className="rounded-2xl border border-border bg-card p-8 mb-10">
        <h2 className="text-lg font-bold mb-4">嵌入代码（复制到你的网站）</h2>
        <pre className="rounded-lg bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
{`<a href="https://moxie.ai/tools/{你的工具 slug}?ref=embed" target="_blank">
  <img src="https://moxie.ai/badge/{你的工具 slug}"
       alt="Featured on Moxie"
       width="280" height="80" />
</a>`}
        </pre>
        <div className="mt-4 text-sm text-muted">
          把 <code className="px-1.5 py-0.5 rounded bg-muted-bg text-xs">{"{你的工具 slug}"}</code> 替换成你工具的 URL slug（在工具详情页 URL 里能看到）。
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4">常见问题</h2>
        <div className="space-y-3">
          {[
            {
              q: "怎么让我的工具被收录？",
              a: "去 /submit 免费提交。审核通过后即可获得徽章。子墨亲测过的工具会有「子墨亲测」标签，徽章自动显示。",
            },
            {
              q: "嵌入徽章要付费吗？",
              a: "完全免费。我们要的是反向链接和品牌曝光，不是徽章订阅费。",
            },
            {
              q: "徽章可以自定义吗？",
              a: "目前是统一样式（保持品牌一致性）。Gold Slot 申请人可以请子墨设计专属徽章（联系 business@moxie.ai）。",
            },
            {
              q: "我的工具下线了徽章会失效吗？",
              a: "不会显示「失效」字样，但会回退到默认样式。建议你也把徽章去掉。",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="rounded-xl border border-border bg-card group"
              open={i === 0}
            >
              <summary className="cursor-pointer p-4 font-medium flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Why({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="font-bold mb-1">{title}</div>
      <div className="text-sm text-muted leading-relaxed">{desc}</div>
    </div>
  );
}
