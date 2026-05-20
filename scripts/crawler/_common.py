"""
爬虫公共函数：网页抓取 / 数据清洗 / Supabase 写入
"""
import os
import random
import re
import time
from typing import Optional

import requests

# ── 环境变量 ────────────────────────────────────────────────────────────
SUPABASE_URL   = os.environ.get("SUPABASE_URL", "").rstrip("/")
FEISHU_WEBHOOK = os.environ.get("FEISHU_ALERT_WEBHOOK", "")

def _supabase_headers() -> dict:
    """每次调用时读取环境变量，避免模块加载顺序导致鉴权头为空。"""
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

# ── User-Agent 池（供所有爬虫模块导入复用）──────────────────────────────
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) "
    "Gecko/20100101 Firefox/125.0",
]

_last_request_time: float = 0.0


# ── 飞书告警 ────────────────────────────────────────────────────────────
def _send_alert(msg: str) -> None:
    if not FEISHU_WEBHOOK:
        print(f"[ALERT] {msg}")
        return
    try:
        requests.post(
            FEISHU_WEBHOOK,
            json={"msg_type": "text", "content": {"text": f"[crawler] {msg}"}},
            timeout=10,
        )
    except Exception:
        print(f"[ALERT 发送失败] {msg}")


# ── 核心 HTTP 请求（内部）────────────────────────────────────────────────
def _do_fetch(
    url: str,
    params: Optional[dict] = None,
    accept_json: bool = False,
) -> Optional[requests.Response]:
    """UA 轮换，间隔 ≥1s，失败重试 3 次（指数退避）。"""
    global _last_request_time

    headers = {"User-Agent": random.choice(USER_AGENTS)}
    if accept_json:
        headers["Accept"] = "application/json"

    for attempt in range(3):
        elapsed = time.time() - _last_request_time
        if elapsed < 1.0:
            time.sleep(1.0 - elapsed)

        try:
            resp = requests.get(url, headers=headers, params=params, timeout=20)
            _last_request_time = time.time()
            if resp.status_code == 200:
                return resp
            print(f"[fetch] 第{attempt+1}次 HTTP {resp.status_code}: {url}")
        except requests.RequestException as e:
            _last_request_time = time.time()
            print(f"[fetch] 第{attempt+1}次异常: {e}")

        if attempt < 2:
            time.sleep(2 ** attempt)

    _send_alert(f"fetch 三次全部失败: {url}")
    return None


def fetch_page(url: str) -> Optional[str]:
    """抓取 HTML 页面，返回文本；失败返回 None。"""
    resp = _do_fetch(url)
    return resp.text if resp else None


def fetch_json(url: str, params: Optional[dict] = None) -> Optional[dict | list]:
    """抓取 JSON API，返回解析后的 dict 或 list；失败返回 None。"""
    resp = _do_fetch(url, params=params, accept_json=True)
    if resp is None:
        return None
    try:
        return resp.json()
    except Exception as e:
        print(f"[fetch_json] JSON 解析失败: {e}")
        return None


# ── 数据清洗 ─────────────────────────────────────────────────────────────
def ensure_https(url: str) -> str:
    if not url:
        return url
    if not re.match(r"https?://", url):
        return "https://" + url
    return url


def clean_item(item: dict) -> dict:
    """清洗单条记录：字符串字段去首尾空白、压缩连续空格；website_url 补全 scheme。"""
    result = {}
    for k, v in item.items():
        if isinstance(v, str):
            v = re.sub(r"\s+", " ", v).strip()
        result[k] = v

    if "website_url" in result:
        result["website_url"] = ensure_https(result["website_url"] or "")

    return result


# ── Supabase 写入 ────────────────────────────────────────────────────────
def save_to_supabase(items: list[dict], source: str = "crawler:yc") -> int:
    """
    批量写入 submissions 表。
    依赖数据库唯一索引 submissions_source_url_unique 实现去重
    （ON CONFLICT DO NOTHING），无需客户端查询已有记录。
    返回实际写入条数。
    """
    if not items:
        return 0

    if not SUPABASE_URL or not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
        print("[save] 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY，跳过写入")
        return 0

    rows = [{"payload": item, "source": source, "status": "pending"} for item in items]

    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/submissions",
            headers={
                **_supabase_headers(),
                "Prefer": "return=representation,resolution=ignore-duplicates",
            },
            json=rows,
            timeout=30,
        )
        if resp.status_code in (200, 201):
            inserted = len(resp.json())
            skipped = len(rows) - inserted
            print(f"[save] 写入 {inserted} 条（跳过 {skipped} 条重复）")
            return inserted

        err_msg = f"Supabase 写入失败 HTTP {resp.status_code}: {resp.text[:200]}"
        print(f"[save] {err_msg}")
        _send_alert(err_msg)
        return 0

    except Exception as e:
        _send_alert(f"Supabase 写入异常: {e}")
        return 0
