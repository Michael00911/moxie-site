"""
T4 YC 爬虫单元测试
覆盖: TC-UNIT1 ~ TC-UNIT5, TC-UA1 ~ UA2, TC-RATE1 ~ RATE2, TC-ALERT1 ~ ALERT2
运行: python -m pytest scripts/crawler/test_yc.py -v
"""
import sys
import os
from pathlib import Path
from unittest.mock import MagicMock

sys.path.insert(0, str(Path(__file__).parent))


# ─────────────────────────────────────────────────────────────
# TC-UNIT1: fetch_json() 能获取 YC API 第一页（网络真实请求）
# ─────────────────────────────────────────────────────────────
def test_fetch_json_yc_api():
    """TC-UNIT1: 调用真实 YC API，验证返回结构"""
    from _common import fetch_json
    import time
    time.sleep(1)  # 遵守 1s/req 礼貌限速
    data = fetch_json(
        "https://api.ycombinator.com/v0.1/companies",
        params={"industry": "Artificial Intelligence", "page": 1},
    )
    assert data is not None, "fetch_json 返回 None，网络或 API 异常"
    assert "companies" in data, f"缺少 companies 字段，实际返回: {list(data.keys())}"
    assert isinstance(data["companies"], list), "companies 不是列表"
    assert len(data["companies"]) > 0, "companies 为空"
    assert "totalPages" in data, "缺少 totalPages 字段"


# ─────────────────────────────────────────────────────────────
# TC-UNIT2: _do_fetch() 失败时恰好重试 3 次后返回 None
# ─────────────────────────────────────────────────────────────
def test_do_fetch_retries_exactly_3_times(monkeypatch):
    """TC-UNIT2: 模拟全程网络异常，断言 _do_fetch 重试 3 次"""
    import requests
    import _common

    call_count = 0

    def mock_get(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        raise requests.RequestException("模拟网络错误")

    monkeypatch.setattr(requests, "get", mock_get)
    monkeypatch.setattr("time.sleep", lambda _: None)

    result = _common._do_fetch("https://test.invalid/")
    assert result is None, "三次全失败应返回 None"
    assert call_count == 3, f"期望重试 3 次，实际 {call_count} 次"


def test_fetch_json_returns_none_on_failure(monkeypatch):
    """TC-UNIT2b: fetch_json 在网络失败后返回 None（不抛异常）"""
    import requests
    import _common

    monkeypatch.setattr(requests, "get", lambda *a, **k: (_ for _ in ()).throw(
        requests.RequestException("网络错误")
    ))
    monkeypatch.setattr("time.sleep", lambda _: None)

    result = _common.fetch_json("https://test.invalid/")
    assert result is None


# ─────────────────────────────────────────────────────────────
# TC-UNIT3: _format_company() 字段映射正确
# ─────────────────────────────────────────────────────────────
def test_format_company_mapping():
    """TC-UNIT3: 验证所有字段正确映射"""
    from yc import _format_company
    raw = {
        "name": "TestStartup",
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
    assert result["name"] == "TestStartup"
    assert result["tagline"] == "An AI tool"
    assert result["description"] == "Detailed description."
    assert result["website_url"] == "https://test.io"
    assert result["source_url"] == "https://www.ycombinator.com/companies/teststartup"
    assert result["batch"] == "W24"
    assert result["tags"] == ["AI", "B2B"]
    assert result["logo_url"] == "https://cdn.yc.com/logo.png"


def test_format_company_optional_fields_fallback():
    """TC-UNIT3b: 可选字段缺失时降级为空字符串/空列表"""
    from yc import _format_company
    raw = {
        "name": "MinimalCo",
        "url": "https://www.ycombinator.com/companies/minimalco",
    }
    result = _format_company(raw)
    assert result is not None
    assert result["tagline"] == ""
    assert result["description"] == ""
    assert result["website_url"] == ""
    assert result["batch"] == ""
    assert result["tags"] == []
    assert result["logo_url"] == ""


# ─────────────────────────────────────────────────────────────
# TC-UNIT4: _format_company() 对空 name 或 url 返回 None
# ─────────────────────────────────────────────────────────────
def test_format_company_rejects_empty_name():
    """TC-UNIT4a: name 为空字符串 → None"""
    from yc import _format_company
    assert _format_company({"name": "", "url": "https://yc.com/c/x"}) is None


def test_format_company_rejects_whitespace_name():
    """TC-UNIT4b: name 全空白 → None"""
    from yc import _format_company
    assert _format_company({"name": "   ", "url": "https://yc.com/c/x"}) is None


def test_format_company_rejects_empty_url():
    """TC-UNIT4c: url 为空字符串 → None"""
    from yc import _format_company
    assert _format_company({"name": "Test", "url": ""}) is None


def test_format_company_rejects_none_url():
    """TC-UNIT4d: url 为 None → None"""
    from yc import _format_company
    assert _format_company({"name": "Test", "url": None}) is None


def test_format_company_rejects_missing_name():
    """TC-UNIT4e: 完全缺少 name 键 → None"""
    from yc import _format_company
    assert _format_company({"url": "https://yc.com/c/x"}) is None


# ─────────────────────────────────────────────────────────────
# TC-UNIT5: clean_item() 清洗逻辑
# ─────────────────────────────────────────────────────────────
def test_clean_item_strips_whitespace():
    """TC-UNIT5a: 首尾空格被去除"""
    from _common import clean_item
    result = clean_item({"name": "  Test Tool  ", "tagline": "AI app"})
    assert result["name"] == "Test Tool"


def test_clean_item_compresses_inner_spaces():
    """TC-UNIT5b: 字段内连续空格压缩为单个"""
    from _common import clean_item
    result = clean_item({"tagline": "AI  powered   app"})
    assert result["tagline"] == "AI powered app"


def test_clean_item_adds_https_scheme():
    """TC-UNIT5c: 无 scheme 的 website_url 补全 https://"""
    from _common import clean_item
    result = clean_item({"website_url": "test.io"})
    assert result["website_url"] == "https://test.io"


def test_clean_item_preserves_existing_https():
    """TC-UNIT5d: 已有 https:// 不重复添加"""
    from _common import clean_item
    result = clean_item({"website_url": "https://test.io"})
    assert result["website_url"] == "https://test.io"


def test_clean_item_preserves_http_scheme():
    """TC-UNIT5e: http:// 保持不变"""
    from _common import clean_item
    result = clean_item({"website_url": "http://old.example.com"})
    assert result["website_url"] == "http://old.example.com"


def test_clean_item_empty_website_url():
    """TC-UNIT5f: website_url 为空字符串时保持空字符串"""
    from _common import clean_item
    result = clean_item({"website_url": ""})
    assert result["website_url"] == ""


def test_clean_item_non_string_passthrough():
    """TC-UNIT5g: 非字符串字段（列表、数字）直接透传"""
    from _common import clean_item
    result = clean_item({"tags": ["AI", "B2B"], "count": 42})
    assert result["tags"] == ["AI", "B2B"]
    assert result["count"] == 42


# ─────────────────────────────────────────────────────────────
# TC-UA1/UA2: User-Agent 轮换
# ─────────────────────────────────────────────────────────────
def test_ua_drawn_from_pool_via_random_choice(monkeypatch):
    """TC-UA1: 每次请求通过 random.choice(USER_AGENTS) 选 UA，且选出值在池内"""
    import random
    import requests
    import _common

    choices_from_pool = []
    original_choice = random.choice

    def spy_choice(seq):
        result = original_choice(seq)
        if seq is _common.USER_AGENTS:
            choices_from_pool.append(result)
        return result

    sent_uas = []

    def mock_get(url, headers=None, params=None, timeout=None):
        sent_uas.append((headers or {}).get("User-Agent", ""))
        return MagicMock(status_code=200)

    monkeypatch.setattr(random, "choice", spy_choice)
    monkeypatch.setattr(requests, "get", mock_get)
    monkeypatch.setattr("time.sleep", lambda _: None)
    monkeypatch.setattr("time.time", lambda: 999.0)

    _common._do_fetch("https://test.invalid/")

    assert len(choices_from_pool) == 1, "每次请求恰好调用一次 random.choice(USER_AGENTS)"
    assert choices_from_pool[0] in _common.USER_AGENTS, f"选出的 UA 不在池内: {choices_from_pool[0]}"
    assert sent_uas[0] == choices_from_pool[0], "发出的 UA 与 random.choice 结果不一致"


def test_ua_rotation_uses_multiple_values(monkeypatch):
    """TC-UA2: 连续 20 次请求使用的 UA 不完全相同，且全部来自 USER_AGENTS 池"""
    import requests
    import _common

    sent_uas = []

    def mock_get(url, headers=None, params=None, timeout=None):
        sent_uas.append((headers or {}).get("User-Agent", ""))
        return MagicMock(status_code=200)

    monkeypatch.setattr(requests, "get", mock_get)
    monkeypatch.setattr("time.sleep", lambda _: None)
    monkeypatch.setattr("time.time", lambda: 999.0)

    for _ in range(20):
        _common._do_fetch("https://test.invalid/")

    assert len(set(sent_uas)) > 1, f"20 次请求应出现多种 UA，实际只有: {set(sent_uas)}"
    for ua in sent_uas:
        assert ua in _common.USER_AGENTS, f"使用了 UA 池外的 UA: {ua}"


# ─────────────────────────────────────────────────────────────
# TC-RATE1/RATE2: 1 s/req 限速
# ─────────────────────────────────────────────────────────────
def test_rate_limit_sleeps_when_interval_too_short(monkeypatch):
    """TC-RATE1: 距上次请求 < 1s 时，_do_fetch 调用 sleep 补足间隔"""
    import requests
    import _common

    sleep_calls = []

    # 上次请求 t=10.0，当前 t=10.4 → elapsed=0.4 → sleep(0.6)
    monkeypatch.setattr("time.time", lambda: 10.4)
    monkeypatch.setattr("time.sleep", lambda t: sleep_calls.append(t))
    monkeypatch.setattr(requests, "get", lambda *a, **kw: MagicMock(status_code=200))
    monkeypatch.setattr(_common, "_last_request_time", 10.0)

    _common._do_fetch("https://test.invalid/")

    rate_sleeps = [t for t in sleep_calls if abs(t - 0.6) < 0.05]
    assert rate_sleeps, (
        f"期望限速 sleep(≈0.6)，实际所有 sleep 调用: {sleep_calls}"
    )


def test_rate_limit_no_sleep_when_interval_elapsed(monkeypatch):
    """TC-RATE2: 距上次请求已超 1s，不触发限速 sleep"""
    import requests
    import _common

    sleep_calls = []

    # elapsed = 100.0 - 98.5 = 1.5 > 1.0 → 无需限速 sleep
    monkeypatch.setattr("time.time", lambda: 100.0)
    monkeypatch.setattr("time.sleep", lambda t: sleep_calls.append(t))
    monkeypatch.setattr(requests, "get", lambda *a, **kw: MagicMock(status_code=200))
    monkeypatch.setattr(_common, "_last_request_time", 98.5)

    _common._do_fetch("https://test.invalid/")

    assert not sleep_calls, f"间隔已超 1s，不应调用 sleep，实际: {sleep_calls}"


# ─────────────────────────────────────────────────────────────
# TC-ALERT1/ALERT2: 失败发飞书
# ─────────────────────────────────────────────────────────────
def test_send_alert_called_once_after_3_failures(monkeypatch):
    """TC-ALERT1: 三次全部失败后，_send_alert 恰好调用一次，消息含失败 URL"""
    import requests
    import _common

    alert_msgs = []

    def mock_get(*a, **kw):
        raise requests.RequestException("模拟网络错误")

    monkeypatch.setattr(requests, "get", mock_get)
    monkeypatch.setattr("time.sleep", lambda _: None)
    monkeypatch.setattr(_common, "_send_alert", lambda msg: alert_msgs.append(msg))

    result = _common._do_fetch("https://test.invalid/alert-check")

    assert result is None
    assert len(alert_msgs) == 1, f"期望 1 次告警，实际 {len(alert_msgs)} 次"
    assert "test.invalid" in alert_msgs[0], f"告警消息应含失败 URL: {alert_msgs[0]}"


def test_feishu_webhook_post_correct_payload(monkeypatch):
    """TC-ALERT2: FEISHU_WEBHOOK 已配置时，_send_alert 向 Webhook 发送正确格式 POST"""
    import requests
    import _common

    post_calls = []

    def mock_post(url, json=None, timeout=None):
        post_calls.append({"url": url, "json": json})
        return MagicMock(status_code=200)

    monkeypatch.setattr(requests, "post", mock_post)
    monkeypatch.setattr(_common, "FEISHU_WEBHOOK", "https://open.feishu.cn/mock-hook")

    _common._send_alert("Supabase 写入失败 HTTP 401")

    assert len(post_calls) == 1, "应发起 1 次 POST"
    assert post_calls[0]["url"] == "https://open.feishu.cn/mock-hook"
    payload = post_calls[0]["json"]
    assert payload.get("msg_type") == "text", f"msg_type 应为 text: {payload}"
    text = payload.get("content", {}).get("text", "")
    assert "[crawler]" in text, f"消息应含 [crawler] 前缀: {text}"
    assert "Supabase 写入失败" in text, f"消息应含原始告警内容: {text}"
