import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/lib/business";

export const metadata: Metadata = {
  title: "Vibe Coding 项目展示",
  description: "子墨用 Claude Code / Cursor 写的 SaaS 项目，看 1 个人 + AI 能干到什么程度",
};

const STATUS_COLOR: Record<string, string> = {
  已上线: "bg-emerald-100 text-emerald-900 border-emerald-200",
  建设中: "bg-amber-100 text-amber-900 border-amber-200",
  已开源: "bg-purple-100 text-purple-900 border-purple-200",
};

export default function ProjectsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 via-white to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-900 mb-5">
            🛠️ Vibe Coding · 子墨亲自写的项目
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
            一个人 + AI =
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              一支团队的产出
            </span>
          </h1>
          <p className="text-muted max-w-2xl leading-relaxed">
            这是子墨用 Claude Code / Cursor 写的项目集合。
            每个都是周末或下班时间从零搭起，证明 Vibe Coding 不只是炫技，是真能赚钱的工作方式。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services#starter-stack"
              className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity"
            >
              买 Vibe Coding 启动包 →
            </Link>
            <Link
              href="/services#co-build"
              className="px-5 py-2.5 rounded-lg border border-border bg-card font-medium hover:bg-muted-bg transition-colors"
            >
              申请联合操盘
            </Link>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.slug}
              className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${p.gradient} p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{p.emoji}</div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${STATUS_COLOR[p.status]}`}
                >
                  {p.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">{p.name}</h2>
              <p className="text-foreground/80 mb-4">{p.tagline}</p>
              <p className="text-sm text-foreground/75 leading-relaxed mb-5">{p.story}</p>

              {p.metrics && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {p.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg border border-white/60 bg-white/60 backdrop-blur p-2 text-center"
                    >
                      <div className="font-bold text-sm">{m.value}</div>
                      <div className="text-[10px] text-muted">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/70 backdrop-blur text-foreground/80 border border-white/60"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {p.url && p.url !== "/" && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    访问 ↗
                  </a>
                )}
                {p.url === "/" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-sm font-medium">
                    就是这个网站 ✨
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Methodology / pitch for coaching */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl border border-border bg-card p-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">我的 Vibe Coding 工作流</h2>
          <p className="text-muted mb-8 max-w-2xl">
            从 idea 到上线，一个人完成全套流程，不需要工程师 / 设计师 / 运维同事。
          </p>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "1", title: "Cursor / Claude Code 写代码", desc: "AI 直接读写文件、跑命令、debug" },
              { step: "2", title: "v0 / Lovable 出 UI", desc: "一句话生成 React 组件，再用 AI 微调" },
              { step: "3", title: "Supabase / Vercel 一键上线", desc: "数据库 + 部署 + 域名 30 分钟搞定" },
              { step: "4", title: "Stripe / LemonSqueezy 收钱", desc: "海外付费、税务、汇款全自动" },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-border p-5 bg-muted-bg/40">
                <div className="text-2xl font-bold text-purple-600 mb-2">{s.step}</div>
                <div className="font-semibold mb-1">{s.title}</div>
                <div className="text-sm text-muted leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted">
              想用同一套工具栈做出自己的 SaaS？
            </div>
            <div className="flex gap-2">
              <Link
                href="/services#starter-stack"
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:opacity-90"
              >
                启动包 ¥499
              </Link>
              <Link
                href="/services#co-build"
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted-bg"
              >
                联合操盘
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
