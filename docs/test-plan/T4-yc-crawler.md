# 测试方案：T4 YC 爬虫

**任务编号：** T4  
**关联需求：** v2.0-edgeone-noauth.md §4.1 T4（MVP-Crawler）  
**编写日期：** 2026-05-20  
**状态：** 待执行（代码已实现）

> **一句话目标：** 验证 GitHub Actions cron 每日 02:00 UTC 自动抓取 YC AI 项目，写入 ≥ 50 条到 Supabase submissions 表，失败时发飞书告警。

> **爬虫架构（实际实现）：** 调用 YC JSON API（`api.ycombinator.com/v0.1/companies`），**不使用 BeautifulSoup 解析 HTML**。函数分布如下：
> - `_common.py`：`fetch_page(url)` / `clean_item(item)` / `save_to_supabase(items, source)` / `_send_alert(msg)`
> - `yc.py`：`_fetch_page(page)` / `_format_company(raw)` / `main()`
> - GitHub Actions 工作流：`.github/workflows/crawler.yml`

---

## 一、测试目标

| 目标 | 说明 |
|------|------|
| 工作流文件 | `.github/workflows/crawler.yml` 语法正确，cron 和 `workflow_dispatch` 均配置 |
| 手动触发 | `workflow_dispatch` 能手动触发并跑通完整流程 |
| 数据质量 | 采集数据 ≥ 50 条，核心字段（name / tagline / website_url）非空率 ≥ 90% |
| 数据写入 | 正确写入 `submissions` 表，`source = 'crawler:yc'`，`status = 'pending'` |
| URL 去重 | 同一 `source_url` 不重复写入（按 source_url 幂等） |
| 函数可测 | `_format_company` / `clean_item` / `save_to_supabase` 可独立单元测试 |
| 失败告警 | 写入失败或页面抓取三次全失败时，飞书机器人收到告警 |
| 定时执行 | cron 表达式 `0 2 * * *`，每日 02:00 UTC 自动触发 |

---

## 二、测试环境要求

### 2.1 本地环境（函数单元测试）

```bash
python --version   # 要求 3.10+（CI 用 3.12）
pip install requests beautifulsoup4 pytest pytest-mock
```

创建 `.env.local`（或直接 export 环境变量）：

```env
SUPABASE_URL=https://<PROJECT_REF>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
FEISHU_ALERT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

> `yc.py` 会自动读取项目根目录的 `.env.local`，本地开发无需手动 export。

### 2.2 GitHub Actions 环境

仓库 Settings → Secrets → Actions，配置以下三个 Secret：

| Secret 名称 | 说明 |
|---|---|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role 密钥（有写权限） |
| `FEISHU_ALERT_WEBHOOK` | 飞书机器人 Webhook |

> 注意：环境变量名为 `FEISHU_ALERT_WEBHOOK`（不是 `FEISHU_WEBHOOK_URL`），与 `_common.py` 第 17 行保持一致。

### 2.3 测试数据来源

- YC JSON API：`https://api.ycombinator.com/v0.1/companies?industry=Artificial+Intelligence&page=N`
- 返回格式：`{ "companies": [...], "totalPages": N }`
- 每条公司记录关键字段：`name` / `oneLiner` / `longDescription` / `website` / `url` / `batch` / `tags`

---

## 三、测试用例总览

| ID | 分类 | 名称 | 优先级 | 执行方式 |
|----|------|------|--------|---------|
| TC-WF1 ~ WF3 | 工作流文件 | 语法 / cron 表达式 / 手动触发 | P0 | 文件检查 + GitHub Actions UI |
| TC-UNIT1 ~ UNIT5 | 函数单元测试 | `_fetch_page` / `_format_company` / `clean_item` / `save_to_supabase` | P0 | Python pytest |
| TC-INT1 ~ INT4 | 集成测试 | 完整流程 / 数量 / 数据质量 / 状态字段 | P0 | 手动触发 GitHub Actions |
| TC-DEDUP1 ~ DEDUP2 | 去重测试 | 重复运行不重复写入 / 批次内去重 | P0 | SQL + 二次触发 |
| TC-ALERT1 ~ ALERT2 | 失败告警 | 飞书通知触发 / 内容可读 | P0 | 人工模拟失败场景 |
| TC-CRON1 | 定时执行 | cron 自动触发记录 | P1 | 次日查看 Actions 记录 |

---

## 四、工作流文件测试（TC-WF）

> **执行方式：** 检查 `.github/workflows/crawler.yml` 文件内容

### TC-WF1：工作流文件存在且语法正确

**检查命令：**

```bash
cat .github/workflows/crawler.yml
```

**手动验证：** 推送至 GitHub 后，在 Actions 标签页确认工作流出现（语法有误则不显示）。

**验收标准：** 文件存在，包含以下关键字段：

```yaml
name: crawler
on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:
jobs:
  yc:
    steps:
      - env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          FEISHU_ALERT_WEBHOOK: ${{ secrets.FEISHU_ALERT_WEBHOOK }}
```

---

### TC-WF2：cron 表达式为每日 02:00 UTC

**检查内容：** `crawler.yml` 中 `cron` 值必须为 `"0 2 * * *"`。

**人工验证：** 可在 [crontab.guru/#0_2_*_*_*](https://crontab.guru/#0_2_*_*_*) 确认含义为"每天 UTC 02:00"（北京时间 10:00）。

**验收标准：** cron 值精确为 `"0 2 * * *"`，不多余空格或位数。

---

### TC-WF3：workflow_dispatch 手动触发可用

**操作步骤（手动验证）：**

1. 进入 GitHub 仓库 → Actions 标签页
2. 左侧找到"crawler"工作流
3. 点击"Run workflow"按钮 → 选择分支 → 确认触发

**验收标准：** 能看到"Run workflow"按钮，点击后工作流进入排队/运行状态。

---

## 五、函数单元测试（TC-UNIT）

> **执行方式：** 本地运行 `python -m pytest scripts/crawler/ -v`
>
> 测试文件建议创建为 `scripts/crawler/test_yc.py`，运行前须先 `cd` 至 `scripts/crawler/` 或设置 `PYTHONPATH`。

### TC-UNIT1：`_fetch_page()` 能获取 YC API 数据

```python
import sys, os
sys.path.insert(0, "scripts/crawler")

def test_fetch_page_returns_data():
    from yc import _fetch_page
    data = _fetch_page(1)
    assert data is not None, "第一页 API 返回 None"
    assert "companies" in data, "缺少 companies 字段"
    assert isinstance(data["companies"], list)
    assert len(data["companies"]) > 0
    assert "totalPages" in data
```

**验收标准：** 返回包含 `companies`（非空列表）和 `totalPages` 的字典。

---

### TC-UNIT2：`_fetch_page()` 失败时最多重试 3 次

```python
def test_fetch_page_retries(monkeypatch):
    import requests, yc
    call_count = 0

    def mock_get(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        raise requests.RequestException("模拟网络错误")

    monkeypatch.setattr(requests, "get", mock_get)
    from yc import _fetch_page
    result = _fetch_page(1)
    assert result is None         # 三次全失败 → 返回 None
    assert call_count == 3        # 恰好重试 3 次
```

**验收标准：** 网络失败时精确重试 3 次后返回 `None`，不抛出未捕获异常。

---

### TC-UNIT3：`_format_company()` 标准化字段映射正确

```python
def test_format_company_mapping():
    from yc import _format_company
    raw = {
        "name": " TestStartup ",
        "oneLiner": "An AI tool",
        "longDescription": "Detailed description.",
        "website": "https://test.io",
        "url": "https://www.ycombinator.com/companies/teststartup",
        "batch": "W24",
        "tags": ["AI", "B2B"],
        "smallLogoUrl": "https://cdn.yc.com/logo.png",
    }
    result = _format_company(raw)
    assert result is not None
    assert result["name"] == " TestStartup "     # 原始字段，clean_item 再去空格
    assert result["tagline"] == "An AI tool"
    assert result["website_url"] == "https://test.io"
    assert result["source_url"] == "https://www.ycombinator.com/companies/teststartup"
    assert result["batch"] == "W24"
```

**验收标准：** `name / tagline / website_url / source_url / batch / tags / logo_url` 全部正确映射。

---

### TC-UNIT4：`_format_company()` 对缺失 name 或 source_url 返回 None

```python
def test_format_company_rejects_empty_fields():
    from yc import _format_company
    # 缺 name
    assert _format_company({"name": "", "url": "https://yc.com/c/x"}) is None
    # 缺 url
    assert _format_company({"name": "Test", "url": ""}) is None
    assert _format_company({"name": "Test", "url": None}) is None
```

**验收标准：** `name` 为空或 `url` 为空时返回 `None`，不写入垃圾数据。

---

### TC-UNIT5：`clean_item()` 清洗字段（去空格 + 补全 https）

```python
def test_clean_item():
    import sys
    sys.path.insert(0, "scripts/crawler")
    from _common import clean_item

    raw = {
        "name": "  Test Tool  ",
        "tagline": "AI  powered  app",
        "website_url": "test.io",          # 无 scheme
    }
    result = clean_item(raw)
    assert result["name"] == "Test Tool"               # 去首尾空格
    assert result["tagline"] == "AI powered app"       # 压缩连续空格
    assert result["website_url"] == "https://test.io"  # 补全 https://
```

**验收标准：** 字符串字段去首尾空白、压缩多余空格；无 scheme 的 website_url 自动加 `https://`。

---

## 六、集成测试（TC-INT）

> **执行方式：** 在 GitHub Actions 手动触发 `workflow_dispatch`，工作流完成后查询 Supabase

### TC-INT1：手动触发工作流执行成功

**操作（手动验证）：**

1. GitHub → Actions → crawler → Run workflow
2. 等待工作流完成（约 5-10 分钟，取决于 YC 数据量）
3. 查看执行日志中是否有 `[yc] 完成：写入 N 条 / 共解析 M 条`

**验收标准：** 所有步骤绿色通过，日志末行出现 `[yc] 完成：写入 N 条 / 共解析 M 条`（N ≥ 50），无 Python 异常堆栈（`Traceback`）。

---

### TC-INT2：submissions 表写入 ≥ 50 条 YC 数据

工作流完成后，在 **Supabase SQL Editor** 执行：

```sql
SELECT count(*) AS inserted
FROM public.submissions
WHERE source = 'crawler:yc'
  AND created_at > now() - interval '1 hour';
```

**验收标准：** `inserted` ≥ 50。

---

### TC-INT3：数据质量 — 核心字段非空率

```sql
SELECT
  count(*)                                                                          AS total,
  round(
    count(*) FILTER (WHERE payload->>'name'        IS NOT NULL
                        AND payload->>'name' != '') * 100.0 / count(*), 1)          AS name_rate,
  round(
    count(*) FILTER (WHERE payload->>'tagline'     IS NOT NULL
                        AND payload->>'tagline' != '') * 100.0 / count(*), 1)       AS tagline_rate,
  round(
    count(*) FILTER (WHERE payload->>'website_url' IS NOT NULL
                        AND payload->>'website_url' != '') * 100.0 / count(*), 1)   AS url_rate
FROM public.submissions
WHERE source = 'crawler:yc'
  AND created_at > now() - interval '1 hour';
```

**验收标准：** `name_rate` = 100%，`url_rate` ≥ 90%，`tagline_rate` ≥ 90%。

> `name` 为 100% 是因为 `_format_company` 已过滤掉空 name 的记录；`website_url` 可能部分公司无官网。

---

### TC-INT4：所有写入记录 status = 'pending'，source = 'crawler:yc'

```sql
-- 应返回 0（无不符合规范的记录）
SELECT count(*) AS bad_rows
FROM public.submissions
WHERE source = 'crawler:yc'
  AND (status != 'pending' OR source IS NULL)
  AND created_at > now() - interval '1 hour';
```

**验收标准：** 返回 `0`，爬虫数据全部处于 `pending` 待审状态。

---

## 七、去重测试（TC-DEDUP）

> 去重逻辑：`save_to_supabase` 先查询 `payload->>'source_url'` 集合，已存在的 source_url 跳过写入。

### TC-DEDUP1：重复运行爬虫不产生重复 source_url 记录

**操作步骤（手动验证）：**

1. 第一次运行工作流完成后，查询一条已写入的 source_url：

```sql
SELECT payload->>'source_url' AS url
FROM public.submissions
WHERE source = 'crawler:yc'
ORDER BY created_at DESC
LIMIT 1;
```

2. 再次手动触发工作流，等待完成后执行：

```sql
SELECT count(*) AS dup_count
FROM public.submissions
WHERE source = 'crawler:yc'
  AND payload->>'source_url' = '<步骤1查到的 url>';
```

**验收标准：** `dup_count = 1`，说明重复运行时已存在的 source_url 被幂等跳过，不产生重复行。

---

### TC-DEDUP2：工作流日志确认跳过数量

**操作（手动验证）：**

第二次运行工作流后，在 GitHub Actions 日志中查找：

```
[save] 全部 N 条已存在，跳过
```

或：

```
[save] 写入 X 条（跳过 Y 条重复）
```

**验收标准：** 日志出现以上任一格式，且"跳过"数量 = 第一次写入的总条数（或接近）。

---

## 八、失败告警测试（TC-ALERT）

### TC-ALERT1：写入失败时飞书收到告警

**模拟失败方式：** 将 `SUPABASE_SERVICE_ROLE_KEY` Secret 临时改为无效值，手动触发工作流。

**操作步骤（手动验证）：**

1. GitHub → Settings → Secrets → Actions → 编辑 `SUPABASE_SERVICE_ROLE_KEY`，填入 `invalid-key`
2. 手动触发工作流
3. 工作流完成后（预期为失败），检查飞书机器人群

**验收标准：**
- 飞书机器人 **1 分钟内** 收到告警消息
- 消息包含 `[crawler]` 前缀（`_send_alert` 写入的标识）
- 告警内容包含错误信息（如 `Supabase 写入失败 HTTP 4xx` 或 `Supabase 写入异常`）

> **恢复：** 测试完成后立即将 Secret 改回正确值。

---

### TC-ALERT2：告警消息内容可读

**验收标准：** 飞书消息不是原始 Python traceback，而是可读的摘要，主理人能立即判断：

- 是爬虫（`[crawler]` 前缀）
- 出了什么问题（HTTP 状态码 / 异常类型）
- 涉及哪个环节（`fetch_page` / `save_to_supabase` 等）

---

## 九、定时执行验证（TC-CRON）

### TC-CRON1：cron 自动触发记录存在且执行成功（次日验证）

**操作（手动验证，次日执行）：**

1. 等待 UTC 02:00（北京时间 10:00）过后
2. GitHub → Actions → crawler → 查看执行历史

**验收标准：** 有一条触发来源为"Schedule"（非"Run workflow"）的执行记录，执行时间在 UTC 02:00 附近，状态为成功。

> TC-CRON1 不阻塞 T4 验收关闭，可在首次 cron 自动触发后补充记录。

---

## 十、T6 后台联动验证（TC-ADMIN）

> 爬虫写入的 `pending` 数据需在 T6 管理后台可见，验证 T4 → T6 链路完整。

### TC-ADMIN1：后台能看到 crawler:yc 来源的待审数据

**操作（手动验证）：**

1. 登录管理后台：`<站点>/admin?token=<ADMIN_TOKEN>`
2. 在提交列表中查找 `source = crawler:yc` 的条目
3. 确认数据可正常展示（name / tagline / website_url 字段可读）

**验收标准：** 后台列表中可见至少 50 条 source 为 `crawler:yc` 的 pending 数据，核心字段非空。

---

### TC-ADMIN2：后台可审核通过一条爬虫数据

**操作（手动验证）：**

1. 在后台选取一条 `crawler:yc` 来源的数据，点击"通过"
2. 等待 T3 触发器触发 EdgeOne 重建（约 1 分钟）
3. 前台刷新，确认该工具出现在工具列表中

**验收标准：** 审核通过后 1 分钟内前台可见该工具，T4 → T6 → T3 完整链路验证通过。

---

## 十一、执行顺序与通过标准

```
执行顺序：
  Step 1  检查工作流文件（TC-WF1 ~ WF3）          ← 文件审查
  Step 2  本地 pytest 单元测试（TC-UNIT1 ~ UNIT5）  ← 函数级验证
  Step 3  GitHub Actions 手动触发（TC-WF3 触发入口）
  Step 4  工作流完成后检查 Supabase（TC-INT1 ~ INT4）
  Step 5  二次触发验证去重（TC-DEDUP1 ~ DEDUP2）
  Step 6  模拟失败触发告警（TC-ALERT1 ~ ALERT2）
  Step 7  T6 后台联动验证（TC-ADMIN1 ~ ADMIN2）
  Step 8  次日验证 cron 自动触发（TC-CRON1，不阻塞关闭）
```

**整体通过标准：** TC-WF / TC-UNIT / TC-INT / TC-DEDUP / TC-ALERT / TC-ADMIN P0 用例全部通过，T4 验收通过。TC-CRON1 次日补充，不阻塞。

---

## 十二、附录：快速验收检查清单

```
工作流文件
  [ ] TC-WF1: .github/workflows/crawler.yml 存在，语法正确，Secrets 引用名称正确
  [ ] TC-WF2: cron 表达式为 "0 2 * * *"（每日 UTC 02:00）
  [ ] TC-WF3: workflow_dispatch 手动触发可用（能看到 Run workflow 按钮）

函数单元测试（本地 pytest）
  [ ] TC-UNIT1: _fetch_page(1) 返回含 companies 列表和 totalPages 的字典
  [ ] TC-UNIT2: _fetch_page() 网络失败时精确重试 3 次后返回 None
  [ ] TC-UNIT3: _format_company() 正确映射 name/tagline/website_url/source_url/batch
  [ ] TC-UNIT4: _format_company() 对空 name 或空 url 返回 None
  [ ] TC-UNIT5: clean_item() 去首尾空格、压缩连续空格、补全 https://

集成测试（手动触发 GitHub Actions）
  [ ] TC-INT1: 工作流手动触发成功，日志含"[yc] 完成：写入 N 条"，无 Traceback
  [ ] TC-INT2: submissions 表 source='crawler:yc' 记录 ≥ 50 条（最近 1 小时）
  [ ] TC-INT3: name 非空率 = 100%，url 非空率 ≥ 90%，tagline 非空率 ≥ 90%
  [ ] TC-INT4: 所有记录 status='pending'，无异常状态行

去重
  [ ] TC-DEDUP1: 二次运行时相同 source_url 不产生重复记录
  [ ] TC-DEDUP2: 工作流日志出现"跳过 N 条重复"字样

失败告警
  [ ] TC-ALERT1: SUPABASE_SERVICE_ROLE_KEY 无效时 1 分钟内飞书收到告警
  [ ] TC-ALERT2: 告警消息含 [crawler] 前缀，内容可读，包含错误简述

T6 后台联动
  [ ] TC-ADMIN1: /admin 后台列表可见 ≥ 50 条 crawler:yc 待审数据
  [ ] TC-ADMIN2: 通过一条爬虫数据后 1 分钟内前台可见（T4→T6→T3 闭环）

定时执行（次日补充）
  [ ] TC-CRON1: UTC 02:00 自动触发记录存在且执行成功
```

**[x] = 已通过  [!] = 通过但有偏差  [ ] = 待验证**

---

## 十三、常见失败排查

| 失败场景 | 可能原因 | 排查位置 |
|---------|---------|---------|
| YC API 返回非 200 | IP 被限速或 UA 未轮换 | `_fetch_page` 日志 + HTTP 状态码 |
| 写入条数 < 50 | API 分页未全量抓取，或大量 name/url 字段为空被过滤 | `[yc] 完成` 日志行，检查 `total_parsed` vs `total_inserted` |
| 飞书无告警 | `FEISHU_ALERT_WEBHOOK` Secret 未配置或 URL 失效 | `_send_alert` 函数，检查 Secret 名拼写 |
| 去重失效（重复写入） | `_existing_source_urls` 查询失败（Supabase 连接异常） | 检查 `[save] 查询已有记录失败` 日志 |
| Supabase 写入 403 | `SUPABASE_SERVICE_ROLE_KEY` 权限不足或过期 | Supabase Dashboard → API Keys |
| 工作流不自动触发 | cron 表达式错误，或仓库 Actions 被暂停 | GitHub → Actions → Settings → Allow all actions |
