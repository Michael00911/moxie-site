import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  allLaunchDates,
  getLaunchesByDate,
} from "@/lib/launches";
import { LaunchCard } from "@/components/launch-card";

export async function generateStaticParams() {
  return allLaunchDates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `${date} AI 工具发布日 — 子墨 Daily Launch`,
    description: `${date} 当天上线的 AI 工具榜单，Moxie每日发布。`,
  };
}

export default async function LaunchDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const items = getLaunchesByDate(date);
  if (items.length === 0) notFound();

  const dateIdx = allLaunchDates.indexOf(date);
  const prev = allLaunchDates[dateIdx + 1];
  const next = allLaunchDates[dateIdx - 1];
  const totalVotes = items.reduce((sum, l) => sum + l.votes, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/launches" className="hover:text-foreground">每日发布</Link>
        <span className="mx-2">/</span>
        <span>{date}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {date} 发布日
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>{items.length} 个工具上线</span>
          <span>·</span>
          <span>{totalVotes} 总票数</span>
        </div>
      </header>

      <div className="space-y-3">
        {items.map((l) => (
          <LaunchCard key={l.id} launch={l} />
        ))}
      </div>

      {/* Prev / Next */}
      <nav className="mt-12 grid gap-3 sm:grid-cols-2">
        {prev && (
          <Link
            href={`/launches/${prev}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md"
          >
            <span className="text-2xl">←</span>
            <div>
              <div className="text-xs text-muted">上一天</div>
              <div className="font-semibold">{prev}</div>
            </div>
          </Link>
        )}
        {next && (
          <Link
            href={`/launches/${next}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md sm:text-right sm:justify-end"
          >
            <div className="sm:order-1">
              <div className="text-xs text-muted">下一天</div>
              <div className="font-semibold">{next}</div>
            </div>
            <span className="text-2xl sm:order-2">→</span>
          </Link>
        )}
      </nav>

      <div className="mt-10 text-center">
        <Link
          href="/launches"
          className="text-sm text-muted hover:text-foreground"
        >
          ← 返回每日发布总览
        </Link>
      </div>
    </div>
  );
}
