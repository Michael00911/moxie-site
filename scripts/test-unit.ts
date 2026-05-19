/**
 * T1 单元测试脚本
 * 测试 src/lib/data.ts 中的纯函数逻辑（类型校验 + 字段映射）
 * 运行：npx tsx scripts/test-unit.ts
 */

// ── 被测函数（从 data.ts 内联，避免 top-level await 触发网络请求） ──

type ToolLevel = "L1" | "L2" | "L3" | "L4";

interface Tool {
  slug: string; name: string; nameEn?: string; tagline: string;
  description: string; level: ToolLevel; rating?: number; category: string;
  tags: string[]; pricing: "free" | "freemium" | "paid"; priceNote?: string;
  zimoView?: string; goodFor?: string[]; notGoodFor?: string[];
  websiteUrl: string; affiliateUrl?: string; videoUrl?: string;
  videoTitle?: string; logoUrl?: string; coverUrl?: string;
  publishedAt: string; updatedAt: string; isSponsored?: boolean;
  saves?: number; views?: number;
}

type SupabaseToolRow = {
  slug: string; name: string; name_en: string | null; tagline: string;
  description: string | null; level: string | null; rating: number | null;
  category: string; tags: string[] | null; pricing: string | null;
  price_note: string | null; zimo_view: string | null;
  good_for: string[] | null; not_good_for: string[] | null;
  website_url: string; affiliate_url: string | null; video_url: string | null;
  video_title: string | null; logo_url: string | null; cover_url: string | null;
  published_at: string | null; created_at: string; updated_at: string;
  is_sponsored: boolean; saves: number; views: number;
  status: string; source: string;
};

function isToolLevel(v: string | null): v is ToolLevel {
  return v === "L1" || v === "L2" || v === "L3" || v === "L4";
}

function isPricing(v: string | null): v is Tool["pricing"] {
  return v === "free" || v === "freemium" || v === "paid";
}

function rowToTool(row: SupabaseToolRow): Tool {
  return {
    slug:         row.slug,
    name:         row.name,
    nameEn:       row.name_en       ?? undefined,
    tagline:      row.tagline,
    description:  row.description   ?? "",
    level:        isToolLevel(row.level)  ? row.level  : "L4",
    rating:       row.rating        ?? undefined,
    category:     row.category,
    tags:         row.tags          ?? [],
    pricing:      isPricing(row.pricing) ? row.pricing : "free",
    priceNote:    row.price_note    ?? undefined,
    zimoView:     row.zimo_view     ?? undefined,
    goodFor:      row.good_for      ?? undefined,
    notGoodFor:   row.not_good_for  ?? undefined,
    websiteUrl:   row.website_url,
    affiliateUrl: row.affiliate_url ?? undefined,
    videoUrl:     row.video_url     ?? undefined,
    videoTitle:   row.video_title   ?? undefined,
    logoUrl:      row.logo_url      ?? undefined,
    coverUrl:     row.cover_url     ?? undefined,
    publishedAt:  row.published_at  ?? row.updated_at,
    updatedAt:    row.updated_at,
    isSponsored:  row.is_sponsored,
    saves:        row.saves,
    views:        row.views,
  };
}

// ── 测试工具 ──────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(id: string, condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ ${id}: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ ${id}: ${msg}`);
    failed++;
  }
}

function assertEqual<T>(id: string, actual: T, expected: T) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  assert(id, ok, `期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(actual)}`);
}

// ── TC-U1：isToolLevel 合法值 ─────────────────────────────────────

console.log("\n[TC-U1] isToolLevel — 合法枚举值");
assert("TC-U1-a", isToolLevel("L1"), '"L1" 应返回 true');
assert("TC-U1-b", isToolLevel("L2"), '"L2" 应返回 true');
assert("TC-U1-c", isToolLevel("L3"), '"L3" 应返回 true');
assert("TC-U1-d", isToolLevel("L4"), '"L4" 应返回 true');

// ── TC-U2：isToolLevel 非法值 ─────────────────────────────────────

console.log("\n[TC-U2] isToolLevel — 非法值被拒");
assert("TC-U2-a", !isToolLevel("L5"), '"L5" 应返回 false');
assert("TC-U2-b", !isToolLevel(""),   '"" 应返回 false');
assert("TC-U2-c", !isToolLevel(null), 'null 应返回 false');
assert("TC-U2-d", !isToolLevel("l1"), '"l1"（小写）应返回 false');
assert("TC-U2-e", !isToolLevel("L0"), '"L0" 应返回 false');

// ── TC-U3：isPricing 合法值 ───────────────────────────────────────

console.log("\n[TC-U3] isPricing — 合法枚举值");
assert("TC-U3-a", isPricing("free"),     '"free" 应返回 true');
assert("TC-U3-b", isPricing("freemium"), '"freemium" 应返回 true');
assert("TC-U3-c", isPricing("paid"),     '"paid" 应返回 true');

// ── TC-U4：isPricing 非法值 ───────────────────────────────────────

console.log("\n[TC-U4] isPricing — 非法值被拒");
assert("TC-U4-a", !isPricing("Free"),         '"Free"（大写）应返回 false');
assert("TC-U4-b", !isPricing("subscription"), '"subscription" 应返回 false');
assert("TC-U4-c", !isPricing(null),           'null 应返回 false');
assert("TC-U4-d", !isPricing(""),             '"" 应返回 false');

// ── TC-U5：rowToTool 完整映射 ─────────────────────────────────────

console.log("\n[TC-U5] rowToTool — 完整行正确映射所有字段");

const fullRow: SupabaseToolRow = {
  slug: "test-tool", name: "Test Tool", name_en: "Test Tool EN",
  tagline: "A test tagline", description: "desc", level: "L1",
  rating: 4, category: "coding", tags: ["tag1", "tag2"],
  pricing: "freemium", price_note: "$10/mo", zimo_view: "my view",
  good_for: ["devs"], not_good_for: ["non-devs"],
  website_url: "https://test.com", affiliate_url: "https://aff.com",
  video_url: "https://vid.com", video_title: "vid title",
  logo_url: "https://logo.com", cover_url: "https://cover.com",
  published_at: "2026-01-01", created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  is_sponsored: true, saves: 5, views: 100, status: "approved", source: "curation",
};

const fullTool = rowToTool(fullRow);
assertEqual("TC-U5-slug",        fullTool.slug,        "test-tool");
assertEqual("TC-U5-nameEn",      fullTool.nameEn,      "Test Tool EN");
assertEqual("TC-U5-websiteUrl",  fullTool.websiteUrl,  "https://test.com");
assertEqual("TC-U5-isSponsored", fullTool.isSponsored, true);
assertEqual("TC-U5-level",       fullTool.level,       "L1");
assertEqual("TC-U5-pricing",     fullTool.pricing,     "freemium");
assertEqual("TC-U5-tags",        fullTool.tags,        ["tag1", "tag2"]);
assertEqual("TC-U5-goodFor",     fullTool.goodFor,     ["devs"]);
assertEqual("TC-U5-saves",       fullTool.saves,       5);
assertEqual("TC-U5-views",       fullTool.views,       100);
assertEqual("TC-U5-publishedAt", fullTool.publishedAt, "2026-01-01");
assertEqual("TC-U5-updatedAt",   fullTool.updatedAt,   "2026-01-02T00:00:00Z");

// ── TC-U6：rowToTool null 字段降级 ───────────────────────────────

console.log("\n[TC-U6] rowToTool — null 字段降级为 undefined / 空数组");

const nullRow: SupabaseToolRow = {
  ...fullRow,
  name_en: null, tags: null, description: null, rating: null,
  good_for: null, not_good_for: null,
};

const nullTool = rowToTool(nullRow);
assertEqual("TC-U6-nameEn",      nullTool.nameEn,     undefined);
assertEqual("TC-U6-tags",        nullTool.tags,       []);
assertEqual("TC-U6-description", nullTool.description, "");
assertEqual("TC-U6-rating",      nullTool.rating,     undefined);
assertEqual("TC-U6-goodFor",     nullTool.goodFor,    undefined);
assertEqual("TC-U6-notGoodFor",  nullTool.notGoodFor, undefined);

// TC-U6 extra: published_at null 时回退到 updated_at
const noPublishRow: SupabaseToolRow = { ...fullRow, published_at: null };
const noPublishTool = rowToTool(noPublishRow);
assertEqual("TC-U6-publishedAt-fallback", noPublishTool.publishedAt, fullRow.updated_at);

// ── TC-U7：非法 level 降级为 L4 ──────────────────────────────────

console.log("\n[TC-U7] rowToTool — 非法 level 降级为 L4");
const badLevelTool = rowToTool({ ...fullRow, level: "L5" });
assertEqual("TC-U7", badLevelTool.level, "L4");

const nullLevelTool = rowToTool({ ...fullRow, level: null });
assertEqual("TC-U7-null", nullLevelTool.level, "L4");

// ── TC-U8：非法 pricing 降级为 free ──────────────────────────────

console.log("\n[TC-U8] rowToTool — 非法 pricing 降级为 free");
const badPricingTool = rowToTool({ ...fullRow, pricing: "subscription" });
assertEqual("TC-U8", badPricingTool.pricing, "free");

const nullPricingTool = rowToTool({ ...fullRow, pricing: null });
assertEqual("TC-U8-null", nullPricingTool.pricing, "free");

// ── 结果汇总 ──────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`单元测试结果：${passed} 通过，${failed} 失败`);
if (failed > 0) {
  console.error("❌ 存在失败用例，请修复后重试");
  process.exit(1);
} else {
  console.log("✅ 所有单元测试通过");
}
