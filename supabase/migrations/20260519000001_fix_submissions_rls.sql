-- =============================================================
-- Migration: 20260519000001_fix_submissions_rls
-- 收紧 submissions 表的匿名插入策略：
-- 只允许插入真正"待审"的记录，防止匿名用户绕过审核流程
-- （直接写入 status=approved、approved_tool_slug、reviewed_at 等字段）
-- =============================================================

drop policy if exists "anon_insert_submissions" on public.submissions;

create policy "anon_insert_submissions"
  on public.submissions
  for insert
  to anon
  with check (
    status = 'pending'
    and approved_tool_slug is null
    and reviewed_at is null
    and reject_reason is null
  );
