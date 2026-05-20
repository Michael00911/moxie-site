"""
T4 YC 爬虫单元测试
覆盖: TC-UNIT1 ~ TC-UNIT5
运行: python -m pytest scripts/crawler/test_yc.py -v
"""
import sys
import os
from pathlib import Path
from unittest.mock import MagicMock, patch

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
