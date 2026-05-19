-- =============================================================
-- Migration: 20260519000002_edgeone_auto_deploy
-- 功能：submissions 表变更后，通过 Edge Function 自动触发
--       EdgeOne 重新部署（带 60s 节流控制）
-- 幂等性：全部语句可重复执行，不会破坏已有数据。
-- 注意：不使用 ALTER DATABASE（Supabase 托管环境无 superuser），
--       改用 deploy_config 配置表存储运行时参数。
-- =============================================================


-- -------------------------------------------------------------
-- 1. 启用 pg_net 扩展
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_net;


-- -------------------------------------------------------------
-- 2. 节流控制表（单行模式，id 固定为 1）
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deploy_throttle (
    id                int         PRIMARY KEY DEFAULT 1,
    last_triggered_at timestamptz NOT NULL    DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.deploy_throttle (id, last_triggered_at)
VALUES (1, now())
ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------
-- 3. 配置表（替代 ALTER DATABASE SET app.*）
--    RLS 全开，anon/authenticated 均无 SELECT 权限；
--    SECURITY DEFINER 触发器函数以 owner 身份（postgres）绕过 RLS。
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deploy_config (
    key   text PRIMARY KEY,
    value text NOT NULL
);

ALTER TABLE public.deploy_config ENABLE ROW LEVEL SECURITY;

-- 无任何开放策略 = anon / authenticated 无法读取


-- -------------------------------------------------------------
-- 4. 写入配置值
--    【重要】此步骤含敏感信息，不在迁移文件中硬编码。
--    首次部署后，在 Supabase SQL Editor 单独执行以下语句
--    （将占位符替换为真实值，不要提交到 git）：
--
--    INSERT INTO public.deploy_config (key, value) VALUES
--        ('supabase_url',   'https://<PROJECT_REF>.supabase.co'),
--        ('trigger_secret', '<与 Edge Function TRIGGER_SECRET secret 相同的值>')
--    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
--
-- -------------------------------------------------------------


-- -------------------------------------------------------------
-- 5. 触发器函数
--    从 deploy_config 读取配置；SECURITY DEFINER 保证有权访问。
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_notify_edgeone_deploy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_url    text;
    v_secret text;
BEGIN
    SELECT value INTO v_url    FROM public.deploy_config WHERE key = 'supabase_url';
    SELECT value INTO v_secret FROM public.deploy_config WHERE key = 'trigger_secret';

    -- 配置缺失时静默跳过，避免阻塞正常写入
    IF v_url IS NULL OR v_secret IS NULL THEN
        RETURN NULL;
    END IF;

    -- 异步 HTTP POST，不阻塞原事务
    PERFORM net.http_post(
        url     := v_url || '/functions/v1/trigger-deploy',
        headers := jsonb_build_object(
            'Content-Type',     'application/json',
            'X-Trigger-Secret', v_secret
        ),
        body    := jsonb_build_object(
            'table',  TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA,
            'op',     TG_OP
        )
    );

    RETURN NULL;
END;
$$;


-- -------------------------------------------------------------
-- 6. 绑定触发器（FOR EACH STATEMENT：批量操作只发一次通知）
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_edgeone_deploy ON public.submissions;

CREATE TRIGGER trg_edgeone_deploy
    AFTER INSERT OR UPDATE OR DELETE
    ON public.submissions
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.fn_notify_edgeone_deploy();
