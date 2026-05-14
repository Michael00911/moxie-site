-- ============================================================
-- tools schema + table
-- 跨 schema 拆分方案：tools.tools
-- ============================================================

CREATE SCHEMA IF NOT EXISTS tools;

CREATE TABLE IF NOT EXISTS tools.tools (
  id              BIGSERIAL PRIMARY KEY,

  -- 来源
  source              VARCHAR(32)  NOT NULL,
  source_slug         VARCHAR(255) NOT NULL,
  source_url          TEXT         NOT NULL,
  source_launch_date  DATE,
  source_metrics      JSONB        DEFAULT '{}'::jsonb,

  -- 基础字段
  name_en         VARCHAR(255) NOT NULL,
  name_cn         VARCHAR(255),
  tagline         TEXT         NOT NULL,
  description     TEXT,
  website_url     TEXT         NOT NULL,
  image_url       TEXT,
  icon_emoji      VARCHAR(8),

  -- 分类
  category_slug            VARCHAR(32),
  category_slug_suggested  VARCHAR(32),
  list_slugs               TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags                     TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- 价格
  pricing_model    VARCHAR(16) DEFAULT 'unknown',
  pricing_detail   VARCHAR(255),

  -- 运营
  ziimo_status     VARCHAR(16),
  ziimo_say        TEXT,
  rating           SMALLINT,
  pros             TEXT[],
  cons             TEXT[],

  -- 状态
  status           VARCHAR(16) NOT NULL DEFAULT 'pending',
  is_duplicate_of  BIGINT REFERENCES tools.tools(id),

  -- 时间
  crawled_at       TIMESTAMPTZ NOT NULL,
  reviewed_at      TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),

  -- 唯一约束
  CONSTRAINT uq_tools_source_slug UNIQUE (source, source_slug),

  -- CHECK 约束（净数据优先）
  CONSTRAINT chk_tools_pricing_model CHECK (
    pricing_model IN ('free','paid','free_paid','freemium','open_source','unknown')
  ),
  CONSTRAINT chk_tools_status CHECK (
    status IN ('pending','approved','rejected','needs_fix','duplicate')
  ),
  CONSTRAINT chk_tools_rating CHECK (
    rating IS NULL OR rating BETWEEN 1 AND 5
  ),
  CONSTRAINT chk_tools_ziimo_status CHECK (
    ziimo_status IS NULL OR ziimo_status IN ('亲测','精选','试过')
  )
);

-- ============================================================
-- 索引
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tools_status         ON tools.tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category       ON tools.tools(category_slug) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_tools_crawled_at     ON tools.tools(crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_source         ON tools.tools(source);
CREATE INDEX IF NOT EXISTS idx_tools_website_url    ON tools.tools((LOWER(website_url)));
CREATE INDEX IF NOT EXISTS idx_tools_published_at   ON tools.tools(published_at DESC)
  WHERE status = 'approved' AND published_at IS NOT NULL;

-- 数组字段 GIN（按榜单/标签筛选时大幅提速）
CREATE INDEX IF NOT EXISTS idx_tools_list_slugs ON tools.tools USING GIN(list_slugs);
CREATE INDEX IF NOT EXISTS idx_tools_tags       ON tools.tools USING GIN(tags);

-- ============================================================
-- updated_at 自动维护
-- ============================================================
CREATE OR REPLACE FUNCTION tools.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tools_set_updated_at ON tools.tools;
CREATE TRIGGER trg_tools_set_updated_at
  BEFORE UPDATE ON tools.tools
  FOR EACH ROW EXECUTE FUNCTION tools.set_updated_at();

-- ============================================================
-- 暴露 schema + 授权
-- 注意：仅授权这里还不够，必须在 Supabase Dashboard
-- Settings → API → Exposed schemas 里把 "tools" 加进去
-- ============================================================
GRANT USAGE ON SCHEMA tools TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA tools TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA tools TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA tools TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tools
  GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA tools
  GRANT ALL ON TABLES TO service_role;
