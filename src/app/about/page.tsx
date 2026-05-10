import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于子墨",
  description: "子墨说AI 是谁，为什么做这个工具站",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose prose-zinc">
      <div className="mb-8">
        <Image src="/logo.png" alt="子墨" width={64} height={64} className="mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">关于子墨</h1>
        <p className="text-xl text-muted leading-relaxed">
          我每天试 5 个 AI 工具，1 个能用，0.1 个值得花钱。这里就是那 0.1 个的清单。
        </p>
      </div>

      <div className="space-y-6 text-foreground/85 leading-relaxed">
        <p>
          你好，我是子墨。
        </p>
        <p>
          2024 年开始我每天追新 AI 工具，到现在试过几百个。在抖音、小红书、视频号上做{" "}
          <span className="font-medium">子墨说AI</span>，专门讲 AI 工具的真实使用体验，不夸不黑。
        </p>
        <p>
          这个网站存在的理由很简单 — Toolify 那种全量列表对普通用户没用，看完只会更迷茫。粉丝最常问我的就是：
        </p>
        <blockquote className="border-l-4 border-amber-400 bg-amber-50/50 px-5 py-3 italic">
          子墨，你说的那个工具叫啥来着？
        </blockquote>
        <p>
          所以我把视频里讲过、亲手用过的工具都整理在这里。每个工具有：
        </p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>子墨评分（用过 1 周以上才打分）</li>
          <li>子墨观点（不是官网套话，是用过之后想说的话）</li>
          <li>适合 / 不适合的场景</li>
          <li>视频测评链接（如果有）</li>
        </ul>
        <p>
          如果某个工具我标了 <span className="font-medium text-amber-700">「子墨亲测」</span>，那就是我天天在用的。如果是{" "}
          <span className="font-medium">「子墨试过」</span>，意味着我跑过几个测试用例。如果是{" "}
          <span className="font-medium">「子墨精选」</span>，是我看过 demo 和文档值得关注但还没深度用。如果是{" "}
          <span className="text-muted">「待测试」</span>，那就还在排队。
        </p>
      </div>

      <div className="mt-12 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold tracking-tight mb-4">在哪找到我</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <SocialCard platform="抖音" handle="@子墨说AI" url="#" />
          <SocialCard platform="小红书" handle="@子墨说AI" url="#" />
          <SocialCard platform="公众号" handle="子墨说AI" url="#" />
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-border text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
        >
          浏览全部工具 →
        </Link>
      </div>
    </article>
  );
}

function SocialCard({ platform, handle, url }: { platform: string; handle: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all"
    >
      <div className="text-sm text-muted mb-1">{platform}</div>
      <div className="font-medium">{handle}</div>
    </a>
  );
}
