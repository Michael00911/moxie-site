import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ui } from "@/lib/i18n";
import { FloatingCTA } from "@/components/floating-cta";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${ui.brand.name} — ${ui.brand.tagline}`,
    template: `%s | ${ui.brand.name}`,
  },
  description: ui.brand.description,
  keywords: ["AI工具", "子墨说AI", "AI推荐", "AI测评", "AI软件"],
  openGraph: {
    title: ui.brand.name,
    description: ui.brand.tagline,
    locale: ui.locale.replace("-", "_"),
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={ui.locale}>
      <body className="min-h-screen flex flex-col">
        {/* 强制兜底：避免 Tailwind v4 dedupe 导致 text-white / bg-zinc-900 失效 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .text-white{color:#ffffff !important}
              .bg-zinc-900{background-color:#18181b !important}
              .bg-black{background-color:#000 !important}
              .bg-amber-500{background-color:#f59e0b !important}
              .bg-emerald-500{background-color:#10b981 !important}
              .bg-rose-500{background-color:#f43f5e !important}
              .text-amber-500{color:#f59e0b !important}
              .text-amber-700{color:#b45309 !important}
              .text-amber-900{color:#78350f !important}
              .text-emerald-500{color:#10b981 !important}
              .text-emerald-700{color:#047857 !important}
              .text-emerald-900{color:#064e3b !important}
              .text-rose-400{color:#fb7185 !important}
              .text-rose-500{color:#f43f5e !important}
              .text-rose-700{color:#be123c !important}
              .text-sky-700{color:#0369a1 !important}
            `,
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingCTA />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Image src="/logo.png" alt={ui.brand.name} width={28} height={28} priority />
          <span>{ui.brand.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-0 text-sm">
          <NavLink href="/tools">{ui.nav.tools}</NavLink>
          <NavLink href="/categories">{ui.nav.categories}</NavLink>
          <NavLink href="/list">{ui.nav.lists}</NavLink>
          <NavLink href="/compare">{ui.nav.compare}</NavLink>
          <NavLink href="/alternatives">{ui.nav.alternatives}</NavLink>
          <NavLink href="/industries">行业</NavLink>
          <NavLink href="/by">用途</NavLink>
          <NavLink href="/launches">每日发布</NavLink>
          <NavLink href="/free">免费工具</NavLink>
          <Link
            href="/submit"
            style={{ color: "#fff", backgroundColor: "#18181b" }}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {ui.nav.submit}
          </Link>
        </nav>
        <Link
          href="/submit"
          style={{ color: "#fff", backgroundColor: "#18181b" }}
          className="md:hidden inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium"
        >
          {ui.nav.submitShort}
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md hover:bg-muted-bg text-muted hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-6 text-sm text-muted">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-foreground mb-2">
            <Image src="/logo.png" alt={ui.brand.name} width={24} height={24} />
            <span>{ui.brand.name}</span>
          </div>
          <p className="leading-relaxed mb-3">{ui.brand.description}</p>
          <a href="mailto:hi@moxie.ai" className="text-xs text-muted hover:text-foreground">
            {ui.forms.aboutSiteFooter}
          </a>
        </div>
        <div>
          <div className="font-medium text-foreground mb-2">{ui.footer.sectionBrowse}</div>
          <ul className="space-y-1.5">
            <li><Link href="/tools" className="hover:text-foreground">{ui.footer.allTools}</Link></li>
            <li><Link href="/categories" className="hover:text-foreground">{ui.footer.categories}</Link></li>
            <li><Link href="/oversea" className="hover:text-foreground">{ui.footer.overseaOpps}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground mb-2">{ui.footer.sectionContent}</div>
          <ul className="space-y-1.5">
            <li><Link href="/blog" className="hover:text-foreground">{ui.footer.deepArticles}</Link></li>
            <li><Link href="/weekly" className="hover:text-foreground">{ui.footer.weeklyArchive}</Link></li>
            <li><Link href="/learn" className="hover:text-foreground">{ui.footer.learnPath}</Link></li>
            <li><Link href="/about" className="hover:text-foreground">{ui.footer.aboutZimo}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground mb-2">{ui.footer.sectionCooperation}</div>
          <ul className="space-y-1.5">
            <li><Link href="/submit" className="hover:text-foreground">{ui.footer.submitTool}</Link></li>
            <li><Link href="/services" className="hover:text-foreground">{ui.footer.business}</Link></li>
            <li><Link href="/cases" className="hover:text-foreground">{ui.footer.cases}</Link></li>
            <li><a href="mailto:hi@moxie.ai" className="hover:text-foreground">{ui.footer.contact}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-foreground mb-2">{ui.footer.sectionFollow}</div>
          <ul className="space-y-1.5">
            <li><a href="#" className="hover:text-foreground">{ui.footer.follow.douyin}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted flex justify-between">
          <span>© 2026 {ui.brand.name}</span>
          <span>{ui.footer.updateNote}</span>
        </div>
      </div>
    </footer>
  );
}
