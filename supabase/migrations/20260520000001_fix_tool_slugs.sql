-- =============================================================
-- Migration: 20260520000001_fix_tool_slugs
-- 目的：删除因 seed 脚本 slug 错误而遗留的旧行
--
--   11labs-music  → suno     （ElevenLabs slug 误填到 Suno 工具）
--   n8n-cloud     → make-com （n8n Cloud slug 误填到 Make.com 工具）
--
-- 这两条 DELETE 会移除旧的错误行。
-- 对应的正确行（slug=suno / make-com）已由 seed-tools.ts 插入，
-- 若未插入，重新运行 seed 脚本即可。
-- 幂等性：目标行不存在时 DELETE 静默成功，可重复执行。
-- =============================================================

DELETE FROM public.tools WHERE slug = '11labs-music';
DELETE FROM public.tools WHERE slug = 'n8n-cloud';
