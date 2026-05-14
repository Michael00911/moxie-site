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

-- ============================================================
-- submissions schema + table
-- 跨 schema 拆分：submissions.submissions
--
-- 字段来源：前端表单（工具名、官网、tagline、邮箱、分类多选）
-- + 审核流转字段（status、tool_id、review_note、reviewed_at/by）
-- + 反垃圾字段（ip_address、user_agent）
-- ============================================================

CREATE SCHEMA IF NOT EXISTS submissions;

CREATE TABLE IF NOT EXISTS submissions.submissions (
  id              BIGSERIAL PRIMARY KEY,

  -- ─── 用户提交内容 ────────────────────────────────────
  tool_name       VARCHAR(255) NOT NULL,
  website_url     TEXT         NOT NULL,
  tagline         VARCHAR(50)  NOT NULL,
  contact_email   VARCHAR(255) NOT NULL,
  category_slugs  TEXT[]       NOT NULL DEFAULT ARRAY[]::TEXT[],

  -- ─── 审核流转 ────────────────────────────────────────
  status          VARCHAR(16) NOT NULL DEFAULT 'pending',
  -- 审核通过后回填，关联到正式 tools 记录
  tool_id         BIGINT REFERENCES tools.tools(id) ON DELETE SET NULL,
  review_note     TEXT,
  reviewed_at     TIMESTAMPTZ,
  reviewed_by     VARCHAR(64),

  -- ─── 反垃圾 ──────────────────────────────────────────
  ip_address      INET,
  user_agent      TEXT,

  -- ─── 时间戳 ──────────────────────────────────────────
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  -- ─── 约束 ────────────────────────────────────────────
  CONSTRAINT chk_submissions_status CHECK (
    status IN ('pending','approved','rejected','needs_fix')
  ),

  -- 分类枚举（和前端表单 9 个选项严格对齐）
  -- 用 <@ 数组包含运算符：category_slugs 必须是允许集合的子集
  CONSTRAINT chk_submissions_categories CHECK (
    category_slugs <@ ARRAY[
      '编程开发','视频制作','图像生成','写作助手','音频语音',
      'AI Agent','研究分析','效率工具','营销增长'
    ]::TEXT[]
    AND array_length(category_slugs, 1) >= 1  -- 至少选一个
  ),

  -- email 基础格式校验
  CONSTRAINT chk_submissions_email CHECK (
    contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),

  -- tagline 50 字限制（表单文案"不超过 50 字"）
  CONSTRAINT chk_submissions_tagline_length CHECK (
    char_length(tagline) BETWEEN 1 AND 50
  ),

  -- website_url 必须是 http(s)
  CONSTRAINT chk_submissions_website_url CHECK (
    website_url ~* '^https?://'
  )
);

-- ============================================================
-- 索引
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS uq_submissions_email_url
  ON submissions.submissions (contact_email, LOWER(website_url));

CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON submissions.submissions(status);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
  ON submissions.submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_tool_id
  ON submissions.submissions(tool_id) WHERE tool_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_categories
  ON submissions.submissions USING GIN(category_slugs);

-- ============================================================
-- updated_at 自动维护
-- ============================================================
CREATE OR REPLACE FUNCTION submissions.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_submissions_set_updated_at ON submissions.submissions;
CREATE TRIGGER trg_submissions_set_updated_at
  BEFORE UPDATE ON submissions.submissions
  FOR EACH ROW EXECUTE FUNCTION submissions.set_updated_at();

-- ============================================================
-- 暴露 schema + 授权
-- ⚠️ 必须在 Dashboard → Settings → API → Exposed schemas
--    把 "submissions" 加进去
-- ============================================================
GRANT USAGE ON SCHEMA submissions TO anon, authenticated, service_role;

-- anon 只授 INSERT，不授 SELECT（RLS 兜底，权限层先收紧）
GRANT INSERT ON ALL TABLES IN SCHEMA submissions TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA submissions TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA submissions TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA submissions
  GRANT INSERT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA submissions
  GRANT ALL ON TABLES TO service_role;