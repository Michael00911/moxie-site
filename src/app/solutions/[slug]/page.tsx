import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { solutions } from "@/lib/business";

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) return { title: "方案未找到" };
  return {
    title: `${s.industry} AI 解决方案`,
    description: s.pain,
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sol = solutions.find((s) => s.slug === slug);
  if (!sol) notFound();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-amber-50/40 via-white to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-sm text-muted mb-5">
            <Link href="/" className="hover:text-foreground">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-foreground">服务</Link>
            <span className="mx-2">/</span>
            <span>{sol.industry}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="text-6xl shrink-0">{sol.emoji}</div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
                {sol.industry} AI 解决方案
              </h1>
              <p className="text-muted mb-2">
                <span className="font-medium text-foreground">适用：</span>
                {sol.audience}
              </p>
              <p className="text-foreground/80 leading-relaxed">{sol.pain}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-12">
          {/* Modules */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">方案包含</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sol.modules.map((m, i) => (
                <div key={m} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="font-medium leading-snug pt-1">{m}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">交付流程</h2>
            <ol className="space-y-3">
              {[
                { phase: "Week 1-2", title: "现场调研 + 业务流程梳理", desc: "高管访谈 / 流程拆解 / 数据评估" },
                { phase: "Week 3-4", title: "方案定稿 + 工具选型", desc: "PRD / 技术方案 / SLA 合同" },
                { phase: "Week 5-N", title: "落地开发 + 切流", desc: "Agent 开发 / 系统对接 / 灰度上线" },
                { phase: "Long-term", title: "运维 + 持续优化", desc: "数据看板 / 月度复盘 / 持续迭代" },
              ].map((step) => (
                <li key={step.phase} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="w-24 text-xs font-bold text-amber-700 pt-1 shrink-0">{step.phase}</div>
                  <div>
                    <div className="font-semibold mb-1">{step.title}</div>
                    <div className="text-sm text-muted">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">常见问题</h2>
            <div className="space-y-3">
              {[
                {
                  q: "我们公司没有技术团队也能做吗？",
                  a: "可以。这是我们的标配场景。代码、部署、维护我们全包，你的团队只需要按 SOP 用。",
                },
                {
                  q: "数据安全怎么保证？",
                  a: "可选私有化部署。所有数据流转都签 NDA + DPA。金融 / 央企客户走专属网络。",
                },
                {
                  q: "和外部 AI 工具厂商比有什么优势？",
                  a: "我们做的是「业务方案」不是「工具」。包业务流程梳理、人员培训、SLA 保障。工具只是手段。",
                },
                {
                  q: "效果不达标可以退款吗？",
                  a: "诊断阶段不满意可全额退。落地阶段按里程碑付款，每个里程碑验收后再支付下一笔。",
                },
              ].map((f) => (
                <details key={f.q} className="rounded-xl border border-border bg-card group">
                  <summary className="cursor-pointer p-4 font-medium flex items-center justify-between">
                    <span>{f.q}</span>
                    <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-5 md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-card p-6">
            <div className="text-xs text-muted mb-1">方案起步价</div>
            <div className="text-3xl font-bold tracking-tight mb-2">{sol.pricing}</div>
            <div className="text-sm text-muted mb-5">交付周期：{sol.duration}</div>
            <a
              href="mailto:business@moxie.ai"
              className="block text-center py-2.5 rounded-lg bg-zinc-900 text-white font-medium hover:opacity-90 transition-opacity mb-2"
            >
              预约商务会议
            </a>
            <Link
              href="/cases"
              className="block text-center py-2 text-sm text-muted hover:text-foreground"
            >
              先看客户案例 →
            </Link>
          </div>

          <div className="rounded-xl border border-dashed border-border p-5 text-sm">
            <div className="font-semibold mb-2">不确定是否合适？</div>
            <div className="text-xs text-muted mb-3 leading-relaxed">
              先做 2 周 ¥30,000 的 AI 落地诊断。诊断不满意全额退。
            </div>
            <Link
              href="/services#audit"
              className="text-foreground hover:underline text-xs"
            >
              查看诊断方案 →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
