/**
 * 一次性 seed 脚本：将 src/lib/data.ts 的 24 条工具数据写入 Supabase tools 表。
 * 策略：UPSERT（on conflict slug → update），幂等、可重复执行，不会破坏 submissions 外键。
 *
 * 运行：
 *   npm run seed:tools
 *   npx tsx scripts/seed-tools.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { tools } from "../src/lib/data";

// ---------- 读取 .env.local ----------
function loadEnv(path: string): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    // .env.local 可能是 UTF-16LE 编码，null 字节需在解析前剥除
    const lines = readFileSync(path, "utf-8").replace(/\0/g, "").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  } catch {
    console.error(`[seed] 无法读取 ${path}，请确认文件存在`);
    process.exit(1);
  }
  return env;
}

const env = loadEnv(resolve(process.cwd(), ".env.local"));

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY  = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "[seed] 缺少环境变量：NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY\n" +
    "       请检查 .env.local"
  );
  process.exit(1);
}

// ---------- Supabase 客户端（service role，绕过 RLS） ----------
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ---------- camelCase → snake_case 转换 ----------
type ToolRow = {
  slug: string;
  name: string;
  name_en: string | null;
  tagline: string;
  description: string | null;
  level: string | null;
  rating: number | null;
  category: string;
  tags: string[];
  pricing: string | null;
  price_note: string | null;
  zimo_view: string | null;
  good_for: string[];
  not_good_for: string[];
  website_url: string;
  affiliate_url: string | null;
  video_url: string | null;
  video_title: string | null;
  logo_url: string | null;
  cover_url: string | null;
  published_at: string | null;
  updated_at: string;
  is_sponsored: boolean;
  saves: number;
  views: number;
  status: "approved" | "draft" | "archived";
  source: "curation" | "submission" | "crawler";
};

function toRow(t: (typeof tools)[number]): ToolRow {
  return {
    slug:          t.slug,
    name:          t.name,
    name_en:       t.nameEn       ?? null,
    tagline:       t.tagline,
    description:   t.description  ?? null,
    level:         t.level        ?? null,
    rating:        t.rating       ?? null,
    category:      t.category,
    tags:          t.tags         ?? [],
    pricing:       t.pricing      ?? null,
    price_note:    t.priceNote    ?? null,
    zimo_view:     t.zimoView     ?? null,
    good_for:      t.goodFor      ?? [],
    not_good_for:  t.notGoodFor   ?? [],
    website_url:   t.websiteUrl,
    affiliate_url: t.affiliateUrl ?? null,
    video_url:     t.videoUrl     ?? null,
    video_title:   t.videoTitle   ?? null,
    logo_url:      t.logoUrl      ?? null,
    cover_url:     t.coverUrl     ?? null,
    published_at:  t.publishedAt  ?? null,
    updated_at:    t.updatedAt    ?? new Date().toISOString(),
    is_sponsored:  t.isSponsored  ?? false,
    saves:         t.saves        ?? 0,
    views:         t.views        ?? 0,
    status:        "approved",
    source:        "curation",
  };
}

// ---------- 主逻辑（包在 async 函数里，兼容 CJS/ESM） ----------
async function main() {
  const rows = tools.map(toRow);
  console.log(`[seed] 准备写入 ${rows.length} 条工具数据…`);

  const { data, error } = await supabase
    .from("tools")
    .upsert(rows, {
      onConflict: "slug",
      ignoreDuplicates: false,
    })
    .select("slug");

  if (error) {
    console.error("[seed] ❌ 写入失败：", error.message);
    console.error("       详情：", error);
    process.exit(1);
  }

  console.log(`[seed] ✅ 成功写入 ${data?.length ?? 0} 条`);
  if (data && data.length !== rows.length) {
    console.warn(
      `[seed] ⚠️  期望写入 ${rows.length} 条，实际返回 ${data.length} 条，请检查 Supabase 日志`
    );
  }
}

main();
