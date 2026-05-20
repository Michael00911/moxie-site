-- =============================================================
-- Migration: 20260520000001_submissions_source_url_unique
-- 为 submissions 表的 (source, source_url) 加唯一索引
-- 支持爬虫用 INSERT ... ON CONFLICT DO NOTHING 实现去重
-- 不影响 source_url 为 NULL 的行（WHERE 条件过滤）
-- =============================================================

CREATE UNIQUE INDEX IF NOT EXISTS submissions_source_url_unique
    ON public.submissions (source, (payload->>'source_url'))
    WHERE payload->>'source_url' IS NOT NULL;
