-- =============================================================
-- ⚠️  仅限开发环境使用 — 会清空所有数据，不可恢复！
--
-- 用途：将数据库恢复到空白状态，然后重新执行迁移文件。
-- 执行步骤：
--   1. 在 Supabase 控制台 SQL Editor 执行本文件（清空数据）
--   2. 再执行 supabase/migrations/20260518000001_create_tools_and_submissions.sql（重建结构）
--   3. 运行 npm run seed:tools（重新写入初始数据）
-- =============================================================

-- 先删有外键的子表，再删父表
drop table if exists public.submissions cascade;
drop table if exists public.tools      cascade;

-- 清理触发器函数（可选）
drop function if exists public.set_updated_at cascade;
