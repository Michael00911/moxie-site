-- =============================================================
-- Migration: 20260518000001_create_tools_and_submissions
-- 执行位置: Supabase 控制台 → SQL Editor → New query → 粘贴全文 → Run
-- 幂等性：全部语句均可重复执行，不会丢失已有数据。
-- 开发环境重置（危险，会清空数据）请使用 scripts/reset-db.sql。
-- =============================================================


-- -------------------------------------------------------------
-- 1. tools 表
--    主理人策展工具（现有 src/lib/data.ts 24 条迁移至此）
-- -------------------------------------------------------------
create table if not exists public.tools (
  slug          text        primary key,
  name          text        not null,
  name_en       text,
  tagline       text        not null,
  description   text,
  level         text        check (level in ('L1', 'L2', 'L3', 'L4')),
  rating        int         check (rating between 1 and 5),
  category      text        not null,
  tags          text[]      not null default '{}',
  pricing       text        check (pricing in ('free', 'freemium', 'paid')),
  price_note    text,
  zimo_view     text,
  good_for      text[]      not null default '{}',
  not_good_for  text[]      not null default '{}',
  website_url   text        not null,
  affiliate_url text,
  video_url     text,
  video_title   text,
  logo_url      text,
  cover_url     text,
  published_at  date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  saves         int         not null default 0,
  views         int         not null default 0,
  is_sponsored  boolean     not null default false,
  status        text        not null default 'approved'
                            check (status in ('approved', 'draft', 'archived')),
  source        text        not null default 'curation'
                            check (source in ('curation', 'submission', 'crawler'))
);

comment on table  public.tools                is '主理人策展工具库';
comment on column public.tools.slug           is '唯一标识符，同时作为 URL slug';
comment on column public.tools.level          is 'L1=子墨亲测 L2=子墨试过 L3=子墨精选 L4=待测试';
comment on column public.tools.zimo_view      is '主理人主观评价，展示在详情页';
comment on column public.tools.created_at     is '行插入时间，仅由 DB 写入，用于审计和排序';
comment on column public.tools.status         is 'approved=上线 draft=草稿 archived=下架';
comment on column public.tools.source         is 'curation=主理人录入 submission=UGC审核通过 crawler=爬虫审核通过';


-- -------------------------------------------------------------
-- 2. submissions 表
--    UGC 提交 + 爬虫数据（待主理人审核）
-- -------------------------------------------------------------
create table if not exists public.submissions (
  id                  uuid        primary key default gen_random_uuid(),
  payload             jsonb       not null,
  source              text        not null
                                  check (source in ('anonymous_form', 'crawler:yc', 'crawler:ph')),
  submitter_email     text,
  status              text        not null default 'pending'
                                  check (status in ('pending', 'approved', 'rejected')),
  reject_reason       text,
  created_at          timestamptz not null default now(),
  reviewed_at         timestamptz,
  approved_tool_slug  text        references public.tools (slug) on delete set null
);

comment on table  public.submissions                     is 'UGC 匿名提交 + 爬虫抓取，待主理人审核';
comment on column public.submissions.payload             is '提交的工具字段（slug 可空，approve 时主理人补填）';
comment on column public.submissions.source              is 'anonymous_form / crawler:yc / crawler:ph';
comment on column public.submissions.approved_tool_slug  is 'approve 后关联到 tools 表的 slug';


-- -------------------------------------------------------------
-- 3. updated_at 自动更新触发器（tools 表）
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tools_set_updated_at on public.tools;
create trigger tools_set_updated_at
  before update on public.tools
  for each row
  execute function public.set_updated_at();


-- -------------------------------------------------------------
-- 4. 开启 Row Level Security
-- -------------------------------------------------------------
alter table public.tools       enable row level security;
alter table public.submissions enable row level security;


-- -------------------------------------------------------------
-- 5. RLS 策略 — tools 表
--
--    anon / authenticated：只能 SELECT status = 'approved' 的行
--    service_role：绕过 RLS，拥有全部权限（Supabase 默认行为）
-- -------------------------------------------------------------
drop policy if exists "public_read_approved_tools" on public.tools;
create policy "public_read_approved_tools"
  on public.tools
  for select
  to anon, authenticated
  using (status = 'approved');


-- -------------------------------------------------------------
-- 6. RLS 策略 — submissions 表
--
--    anon：只能 INSERT（匿名提交）；不能 SELECT / UPDATE / DELETE
--    authenticated：同 anon，防止前端意外泄露 token 后被滥读
--    service_role：绕过 RLS，Edge Function / 后台用 service key 操作
-- -------------------------------------------------------------

-- anon 可以插入提交记录，但不能读取
drop policy if exists "anon_insert_submissions" on public.submissions;
create policy "anon_insert_submissions"
  on public.submissions
  for insert
  to anon
  with check (true);

-- 显式拒绝 anon SELECT（有 RLS 但无 select policy 即默认拒绝，此条可选，加上更清晰）
-- Supabase 建议"explicit deny"风格：不创建 select policy = 拒绝


-- -------------------------------------------------------------
-- 7. 索引（提升常用查询性能）
-- -------------------------------------------------------------

-- 列表页按分类过滤
create index if not exists idx_tools_category
  on public.tools (category)
  where status = 'approved';

-- 首页按 level 过滤（L1 精选）
create index if not exists idx_tools_level
  on public.tools (level)
  where status = 'approved';

-- 列表页按发布时间排序
create index if not exists idx_tools_published_at
  on public.tools (published_at desc)
  where status = 'approved';

-- 后台审核按提交时间倒序
create index if not exists idx_submissions_created_at
  on public.submissions (created_at desc);

-- 后台按状态过滤待审
create index if not exists idx_submissions_status
  on public.submissions (status);
