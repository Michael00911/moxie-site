-- ============================================================
-- RLS 策略
--
-- tools.tools:
--   - anon: 仅 SELECT status='approved' 的行
--   - service_role: 完全放行（自动绕过 RLS）
--
-- submissions.submissions:
--   - anon: 仅 INSERT，不允许 SELECT/UPDATE/DELETE
--   - INSERT 时强制 status='pending'、tool_id/reviewed_* 为空，
--     防止 anon 伪造审核状态
-- ============================================================

-- ============================================================
-- tools.tools
-- ============================================================
ALTER TABLE tools.tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tools: anon read approved" ON tools.tools;
CREATE POLICY "tools: anon read approved"
  ON tools.tools
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- ============================================================
-- submissions.submissions
-- ============================================================
ALTER TABLE submissions.submissions ENABLE ROW LEVEL SECURITY;

-- 任何人都能提交，但只能创建 pending 行，
-- 不能预设 status='approved' 等审核字段
DROP POLICY IF EXISTS "submissions: anon insert pending only" ON submissions.submissions;
CREATE POLICY "submissions: anon insert pending only"
  ON submissions.submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND tool_id IS NULL
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND review_note IS NULL
  );

-- 显式拒绝 anon 读：不建 SELECT 策略 + RLS 启用 = 默认拒绝
-- 这里建一条明确 false 的策略，意图更显眼
DROP POLICY IF EXISTS "submissions: no public read" ON submissions.submissions;
CREATE POLICY "submissions: no public read"
  ON submissions.submissions
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- UPDATE / DELETE 同样不建策略 → 对 anon/authenticated 全部拒绝
-- service_role 自动绕过 RLS，后台审核流走 service_role
