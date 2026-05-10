"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function FloatingCTA() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((x) => !x);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/tools?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    setQ("");
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2 items-end">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all"
        >
          <span className="text-sm">🔍</span>
          <span className="text-sm text-muted hidden sm:inline">搜索</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted-bg text-muted hidden sm:inline">⌘K</kbd>
        </button>
        <Link
          href="/submit"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <span>🚀</span>
          <span className="text-sm font-medium">提交工具</span>
        </Link>
      </div>

      {/* Search palette */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={submitSearch} className="relative">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索 AI 工具，如「视频翻译」、「数字人」、「AI 编程」..."
                className="w-full pl-12 pr-12 h-14 bg-card text-base focus:outline-none"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl">🔍</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 px-2 py-1 rounded text-xs text-muted bg-muted-bg"
              >
                ESC
              </button>
            </form>
            <div className="border-t border-border p-3 text-xs text-muted">
              <div className="font-semibold text-foreground mb-2">快速跳转</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "全部工具", href: "/tools" },
                  { label: "Top 10 月榜", href: "/list" },
                  { label: "工具对比", href: "/compare" },
                  { label: "替代品", href: "/alternatives" },
                  { label: "AI 出海", href: "/oversea" },
                  { label: "周报订阅", href: "#newsletter" },
                ].map((j) => (
                  <Link
                    key={j.href}
                    href={j.href}
                    onClick={() => setOpen(false)}
                    className="px-2 py-1 rounded bg-muted-bg hover:bg-muted-bg/70 text-foreground"
                  >
                    {j.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
