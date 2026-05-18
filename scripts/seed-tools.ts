/**
 * 一次性 seed 脚本：将 src/lib/data.ts 的 24 条工具数据写入 Supabase tools 表。
 * 策略：UPSERT（on conflict slug → update），幂等、可重复执行，不会因外键而破坏 submissions 数据。
 *
 * 运行：
 *   npx tsx scripts/seed-tools.ts
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

// ---------- 读取 .env.local ----------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv(path: string): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    const lines = readFileSync(path, "utf-8").split("\n");
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

const env = loadEnv(envPath);

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

// ---------- 原始数据（直接从 data.ts 复制，保持 camelCase） ----------
// 使用动态 import 读取编译后的模块
const { tools } = await import("../src/lib/data.js");

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
    // 保留原始 updatedAt；若没有则用当前时间
    updated_at:    t.updatedAt ?? new Date().toISOString(),
    is_sponsored:  t.isSponsored  ?? false,
    saves:         t.saves        ?? 0,
    views:         t.views        ?? 0,
    // 所有 data.ts 的已策展数据均视为 approved + curation
    status:        "approved",
    source:        "curation",
  };
}

// ---------- 执行 UPSERT ----------
const rows = tools.map(toRow);

console.log(`[seed] 准备写入 ${rows.length} 条工具数据…`);

const { data, error } = await supabase
  .from("tools")
  .upsert(rows, {
    onConflict: "slug",       // slug 冲突时 UPDATE 而非报错
    ignoreDuplicates: false,  // 确保已有记录也会被更新
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
