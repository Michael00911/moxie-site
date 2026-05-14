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
