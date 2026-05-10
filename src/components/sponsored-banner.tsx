import type { Sponsor } from "@/lib/data";
import { ui } from "@/lib/i18n";

export function SponsoredBanner({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noreferrer sponsored"
      className="group relative flex items-center gap-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="absolute top-2 right-3 text-[10px] font-semibold tracking-wider text-amber-700">
        {sponsor.badge}
      </div>
      <div className="w-12 h-12 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-2xl shrink-0">
        ⚡
      </div>
      <div className="min-w-0">
        <div className="font-semibold group-hover:underline">{sponsor.name}</div>
        <div className="text-sm text-muted truncate">{sponsor.tagline}</div>
      </div>
      <div className="ml-auto text-sm text-amber-700 shrink-0 hidden sm:block">
        {ui.sponsored.viewNow}
      </div>
    </a>
  );
}
