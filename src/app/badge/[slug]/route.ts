import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/data";
import { LEVEL_LABEL } from "@/lib/types";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const tool = getToolBySlug(slug);

  const name = tool?.name ?? slug;
  const tagline = tool?.tagline?.slice(0, 32) ?? "AI 工具";
  const level = tool ? LEVEL_LABEL[tool.level] : "已收录";
  const rating = tool?.rating ?? 4;

  // 生成 SVG 徽章
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80" viewBox="0 0 280 80">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="280" height="80" rx="10" fill="url(#g)" stroke="#fcd34d" stroke-width="1" filter="url(#shadow)"/>

  <!-- Badge label -->
  <text x="14" y="22" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" fill="#92400e" letter-spacing="1">FEATURED ON Moxie</text>

  <!-- Tool name -->
  <text x="14" y="44" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#18181b">${escapeXml(name)}</text>

  <!-- Tagline -->
  <text x="14" y="62" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="10" fill="#71717a">${escapeXml(tagline)}</text>

  <!-- Stars -->
  <text x="266" y="22" text-anchor="end" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11" fill="#f59e0b">${"★".repeat(rating)}<tspan fill="#d4d4d8">${"★".repeat(5 - rating)}</tspan></text>

  <!-- Level badge -->
  <rect x="${266 - 60}" y="50" width="60" height="18" rx="4" fill="#18181b"/>
  <text x="${266 - 30}" y="62" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="9" font-weight="600" fill="#ffffff">${escapeXml(level)}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
