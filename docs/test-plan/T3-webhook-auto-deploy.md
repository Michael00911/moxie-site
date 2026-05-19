# 测试方案：T3 Supabase 数据变更 → EdgeOne 自动部署

**任务编号：** T3
**关联需求：** v2.0-edgeone-noauth.md §4.1 T3
**编写日期：** 2026-05-19
**状态：** 待执行

> **一句话目标：** 验证"在 Supabase 改一条 tool / submissions 记录 → 1 分钟内 EdgeOne 自动重新构建"这条链路完全闭合。

---

## 一、测试目标

| 目标 | 说明 |
|------|------|
| 数据库结构 | `deploy_throttle` 表存在，触发器函数与绑定正确 |
| 安全性 | Edge Function 鉴权 + 触发器函数 SECURITY DEFINER 配置 |
| 节流逻辑 | 60 秒内重复触发只发出一次部署请求 |
| 端到端链路 | submissions 写入 → DB 触发器 → pg_net 异步 HTTP POST → Edge Function → EdgeOne 重新部署 |
| 异常容错 | 配置缺失时触发器静默跳过，不影响正常数据写入 |

---

## 二、测试环境要求

### 2.1 Supabase 环境
- 已执行迁移文件 `supabase/migrations/20260519000002_edgeone_auto_deploy.sql`
- 已在 Supabase SQL Editor 写入运行时配置（**不要提交到 git**）：
  ```sql
  INSERT INTO public.deploy_config (key, value) VALUES
      ('supabase_url',   'https://<PROJECT_REF>.supabase.co'),
      ('trigger_secret', '<随机密钥>')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  ```
- `pg_net` 扩展已启用

### 2.2 Supabase Edge Function 环境
- `supabase/functions/trigger-deploy/index.ts` 已部署到 Supabase 项目
- Edge Function 环境变量已设置：
  ```
  TRIGGER_SECRET          = <与 deploy_config 表中 trigger_secret 值一致>
  SUPABASE_URL            = https://<PROJECT_REF>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY = eyJ...
  EDGEONE_DEPLOY_HOOK_URL = https://edgeone.xxx.com/deploy-hook/...
  EDGEONE_API_TOKEN       = <EdgeOne API Token>
  ```

### 2.3 验证工具
- Supabase 控制台（SQL Editor + Edge Function 日志）
- `curl` 命令（本地终端）
- EdgeOne 控制台（部署记录）

---

## 三、测试用例总览

| ID | 分类 | 名称 | 优先级 | 执行方式 |
|----|------|------|--------|---------|
| TC-DB1 ~ DB5 | 数据库结构 | 节流表 / 触发器函数 / 触发器绑定（tools + submissions） | P0 | Supabase SQL Editor |
| TC-SEC1 ~ SEC2 | 安全性 | Edge Function 鉴权 / SECURITY DEFINER | P0 | curl + SQL Editor |
| TC-TH1 ~ TH3 | 节流逻辑 | 60s 冷却 / 冷却后恢复 | P0 | Supabase SQL Editor + Edge Function 日志 |
| TC-E2E1 ~ E2E4 | 端到端 | INSERT/UPDATE/DELETE 触发链路（tools + submissions） | P0 | SQL Editor + EdgeOne 控制台 |
| TC-ERR1 ~ ERR2 | 异常容错 | 配置缺失 / 密钥错误 | P1 | curl + SQL Editor |

---

## 四、数据库结构测试（TC-DB）

> **执行方式：** Supabase 控制台 → SQL Editor，逐条执行

### TC-DB1：`deploy_throttle` 表存在且结构正确

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'deploy_throttle'
ORDER BY ordinal_position;
```

**验收标准：** 返回 2 列：
- `id`（integer，NOT NULL，是主键）
- `last_triggered_at`（timestamp with time zone，NOT NULL）

---

### TC-DB2：节流表初始行存在

```sql
SELECT id, last_triggered_at FROM public.deploy_throttle;
```

**验收标准：** 返回 1 行，`id = 1`，`last_triggered_at` 为迁移执行时间附近的时间戳。

---

### TC-DB3：触发器函数存在且配置正确

```sql
SELECT routine_name, security_type, external_language
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'fn_notify_edgeone_deploy';
```

**验收标准：**
- 返回 1 行
- `security_type = 'DEFINER'`（SECURITY DEFINER 配置正确）
- `external_language = 'PLPGSQL'`

---

### TC-DB4：触发器已绑定到 `submissions` 表

```sql
SELECT trigger_name, event_manipulation, action_timing, action_orientation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'submissions'
  AND trigger_name = 'trg_edgeone_deploy';
```

**验收标准：** 返回 3 行（对应 INSERT / UPDATE / DELETE），每行：
- `action_timing = 'AFTER'`
- `action_orientation = 'STATEMENT'`（FOR EACH STATEMENT）

---

### TC-DB5：触发器已绑定到 `tools` 表

```sql
SELECT trigger_name, event_manipulation, action_timing, action_orientation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'tools'
  AND trigger_name = 'trg_edgeone_deploy';
```

**验收标准：** 返回 3 行（对应 INSERT / UPDATE / DELETE），每行：
- `action_timing = 'AFTER'`
- `action_orientation = 'STATEMENT'`（FOR EACH STATEMENT）

---

## 五、安全性测试（TC-SEC）

### TC-SEC1：Edge Function 拒绝无效密钥

用错误的密钥调用 Edge Function，期望收到 401 拒绝。

```bash
# 替换 PROJECT_REF 为真实值；X-Trigger-Secret 故意传错误值
curl -s -w "\nHTTP %{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Secret: wrong-secret-12345" \
  -d '{"table":"submissions","schema":"public","op":"INSERT"}' \
  "https://<PROJECT_REF>.supabase.co/functions/v1/trigger-deploy"
```

**验收标准：** HTTP 状态码 `401`，响应体含 `"Unauthorized"`

---

### TC-SEC2：触发器函数使用 SECURITY DEFINER

> 确认函数以定义者权限运行，而非调用者权限，防止 anon 角色绕过触发器执行写入

```sql
SELECT prosecdef  -- true = SECURITY DEFINER
FROM pg_proc
WHERE proname = 'fn_notify_edgeone_deploy'
  AND pronamespace = 'public'::regnamespace;
```

**验收标准：** 返回 `prosecdef = true`

---

## 六、节流逻辑测试（TC-TH）

### TC-TH1：首次触发 — Edge Function 成功返回 `triggered`

> 先把 `last_triggered_at` 手动设回 2 分钟前，保证冷却期已过。

```sql
-- 步骤 1：把节流时间倒拨，确保不在冷却期
UPDATE public.deploy_throttle
SET last_triggered_at = now() - interval '2 minutes'
WHERE id = 1;

-- 步骤 2：插入一条 submissions 记录，触发触发器
INSERT INTO public.submissions (payload, source)
VALUES ('{"name": "Test T3"}'::jsonb, 'anonymous_form');
```

**验收标准：**
- INSERT 成功（不报错）
- 在 Supabase 控制台 → Edge Functions → `trigger-deploy` → Logs 中，约 2~5 秒后出现日志：
  ```
  [trigger-deploy] Deploy triggered successfully
  ```
- HTTP 响应体含 `"status": "triggered"`

---

### TC-TH2：60 秒内重复触发 — Edge Function 返回 `throttled`

```sql
-- 紧接 TC-TH1 执行（不等待 60s），再次写入 submissions
INSERT INTO public.submissions (payload, source)
VALUES ('{"name": "Test T3 throttle"}'::jsonb, 'anonymous_form');
```

**验收标准：**
- INSERT 成功（不报错，原始写入不被阻塞）
- Edge Function 日志出现：
  ```
  [trigger-deploy] Throttled: last deploy < 60s ago, skipping
  ```
- **不**触发 EdgeOne 重新构建（EdgeOne 控制台无新部署记录）

---

### TC-TH3：60 秒冷却后再次触发可以正常部署

```sql
-- 等待 61 秒后（或手动倒拨时间），再次插入
UPDATE public.deploy_throttle
SET last_triggered_at = now() - interval '65 seconds'
WHERE id = 1;

INSERT INTO public.submissions (payload, source)
VALUES ('{"name": "Test T3 after cooldown"}'::jsonb, 'anonymous_form');
```

**验收标准：** Edge Function 日志再次出现 `Deploy triggered successfully`，EdgeOne 触发新一轮构建。

---

## 七、端到端测试（TC-E2E）

> **执行这组测试前提：** Edge Function 已部署，EdgeOne Deploy Hook 配置正确

### TC-E2E1：INSERT submissions → 1 分钟内前台数据更新

**测试步骤：**

1. 先在 Supabase 中新增一条 `tools` 记录（确认前台当前不显示）：
   ```sql
   INSERT INTO public.tools (slug, name, tagline, category, website_url, status, source, level)
   VALUES ('test-e2e-tool', 'E2E 测试工具', '这是端到端测试', 'coding', 'https://example.com', 'approved', 'curation', 'L4');
   ```
2. 把 `deploy_throttle.last_triggered_at` 倒拨到 2 分钟前（保证冷却期已过）
3. 插入一条 submissions 记录触发触发器：
   ```sql
   INSERT INTO public.submissions (payload, source)
   VALUES ('{"trigger": "e2e test"}'::jsonb, 'anonymous_form');
   ```
4. 在 EdgeOne 控制台查看是否有新的构建任务启动
5. 等待构建完成（通常 2~4 分钟），访问 EdgeOne 预览域名

**验收标准：**
- EdgeOne 控制台出现新的构建记录，状态为"构建成功"
- 访问 `https://moxie-site-lui1gtmxdw.edgeone.cool/tools/test-e2e-tool` 返回 200，页面含"E2E 测试工具"
- **总耗时 ≤ 5 分钟**（触发到页面可访问）

**测试后清理：**
```sql
DELETE FROM public.tools WHERE slug = 'test-e2e-tool';
DELETE FROM public.submissions WHERE payload->>'trigger' = 'e2e test';
```

---

### TC-E2E2：UPDATE tools → 触发链路正常（状态变更场景）

**测试步骤：**

1. 倒拨节流时间：
   ```sql
   UPDATE public.deploy_throttle SET last_triggered_at = now() - interval '2 minutes' WHERE id = 1;
   ```
2. 更新任意一条 submissions 记录（模拟审核操作）：
   ```sql
   UPDATE public.submissions SET status = 'approved' WHERE id = (SELECT id FROM public.submissions LIMIT 1);
   ```

**验收标准：** Edge Function 日志出现 `Received: {"table":"submissions","schema":"public","op":"UPDATE"}`，表明 UPDATE 操作也被正确捕获。

---

### TC-E2E4：直接更新 `tools` 表也能触发部署链路

> 验证 tools 触发器与 submissions 触发器共享同一函数和节流表，逻辑完全一致。

**测试步骤：**

1. 倒拨节流时间，保证冷却期已过：
   ```sql
   UPDATE public.deploy_throttle
   SET last_triggered_at = now() - interval '2 minutes'
   WHERE id = 1;
   ```

2. 更新任意一条已有 tools 记录（空操作，不改实际内容）：
   ```sql
   UPDATE public.tools SET name = name WHERE slug = 'claude-code';
   ```

**验收标准：**
- UPDATE 成功，无报错
- Edge Function 日志约 2~5 秒后出现：
  ```
  [trigger-deploy] Received: {"table":"tools","schema":"public","op":"UPDATE"}
  [trigger-deploy] Deploy triggered successfully
  ```
- EdgeOne 控制台触发新一轮构建

---

### TC-E2E3：一次批量操作只发出一条通知（STATEMENT 级触发器）

```sql
-- 同时插入 5 条 submissions（模拟爬虫批量推送）
UPDATE public.deploy_throttle SET last_triggered_at = now() - interval '2 minutes' WHERE id = 1;

INSERT INTO public.submissions (payload, source) VALUES
  ('{"n":"a"}'::jsonb, 'crawler:yc'),
  ('{"n":"b"}'::jsonb, 'crawler:yc'),
  ('{"n":"c"}'::jsonb, 'crawler:yc'),
  ('{"n":"d"}'::jsonb, 'crawler:yc'),
  ('{"n":"e"}'::jsonb, 'crawler:yc');
```

**验收标准：** Edge Function 日志中**只出现 1 条** `trigger-deploy` 请求记录（FOR EACH STATEMENT 保证批量写入只触发一次通知）。

---

## 八、异常容错测试（TC-ERR）

### TC-ERR1：数据库配置缺失时触发器静默跳过（不阻塞写入）

> 模拟 `deploy_config` 中 `supabase_url` 或 `trigger_secret` 未配置的情况

```sql
-- 步骤 1：备份当前配置值
CREATE TEMP TABLE _cfg_backup AS
SELECT key, value FROM public.deploy_config WHERE key IN ('supabase_url', 'trigger_secret');

-- 步骤 2：删除配置，模拟缺失
DELETE FROM public.deploy_config WHERE key IN ('supabase_url', 'trigger_secret');

-- 步骤 3：插入记录，期望触发器不报错、写入成功
INSERT INTO public.submissions (payload, source)
VALUES ('{"test": "missing config"}'::jsonb, 'anonymous_form');

-- 步骤 4：恢复配置
INSERT INTO public.deploy_config (key, value)
SELECT key, value FROM _cfg_backup
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

DROP TABLE _cfg_backup;
```

**验收标准：** INSERT 成功，无任何 PostgreSQL 错误，说明触发器在配置缺失时静默返回 NULL。

---

### TC-ERR2：Edge Function 配置缺失返回 500 而非崩溃

> 通过正确密钥调用，但模拟 EdgeOne 环境变量缺失

```bash
# 用正确密钥调用，但传入不存在的 Deploy Hook URL
# （此测试需要在 Edge Function 环境变量中临时把 EDGEONE_DEPLOY_HOOK_URL 清空，或通过直接 POST 绕过触发器）
curl -s -w "\nHTTP %{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Secret: <正确密钥>" \
  -d '{"table":"submissions","schema":"public","op":"INSERT"}' \
  "https://<PROJECT_REF>.supabase.co/functions/v1/trigger-deploy"
```

**验收标准：** HTTP 状态码 `500`，响应体含 `"Server misconfiguration"`，不返回未处理异常堆栈。

---

## 九、执行顺序与通过标准

```
执行顺序：
  Step 1: 在 Supabase SQL Editor 执行迁移文件（若未执行）
  Step 2: 在 SQL Editor 向 deploy_config 写入 supabase_url 和 trigger_secret（见 §2.1）
  Step 3: 部署 Edge Function trigger-deploy
  Step 4: TC-DB1 ~ DB4（数据库结构验证）
  Step 5: TC-SEC1 ~ SEC2（安全性）
  Step 6: TC-TH1 ~ TH3（节流逻辑）
  Step 7: TC-E2E1 ~ E2E3（端到端，需 EdgeOne 构建时间，耗时最长）
  Step 8: TC-ERR1 ~ ERR2（异常容错）
```

**整体通过标准：** TC-DB / TC-SEC / TC-TH / TC-E2E P0 用例 100% 通过，TC-ERR P1 用例通过，T3 验收通过。

---

## 十、附录：快速验收检查清单

```
数据库结构（Supabase SQL Editor）
  [ ] TC-DB1: deploy_throttle 表存在，2 列结构正确
  [ ] TC-DB2: 节流表初始行 id=1 存在
  [ ] TC-DB3: 触发器函数存在，SECURITY DEFINER 配置
  [ ] TC-DB4: 触发器绑定到 submissions，AFTER INSERT/UPDATE/DELETE FOR EACH STATEMENT
  [ ] TC-DB5: 触发器绑定到 tools，AFTER INSERT/UPDATE/DELETE FOR EACH STATEMENT

安全性
  [ ] TC-SEC1: 无效密钥被 Edge Function 拒绝（401）
  [ ] TC-SEC2: pg_proc.prosecdef = true

节流逻辑
  [ ] TC-TH1: 首次触发返回 "triggered"，Edge Function 日志正常
  [ ] TC-TH2: 60s 内重复触发返回 "throttled"，不发出 EdgeOne 请求
  [ ] TC-TH3: 冷却后再次触发正常部署

端到端
  [ ] TC-E2E1: submissions INSERT → EdgeOne 构建 → 前台 5 分钟内更新
  [ ] TC-E2E2: submissions UPDATE 操作也被正确捕获
  [ ] TC-E2E3: 批量 INSERT 只发出 1 条通知（STATEMENT 级触发器）
  [ ] TC-E2E4: tools UPDATE → Edge Function 日志含 "table":"tools" → EdgeOne 触发构建

异常容错
  [ ] TC-ERR1: 配置缺失时写入不报错（静默跳过）
  [ ] TC-ERR2: EdgeOne 配置缺失时 Edge Function 返回 500 且有明确错误信息
```

**[x] = 已通过  [!] = 通过但有偏差  [ ] = 待验证**
