"""
爬虫公共函数：网页抓取 / 数据清洗 / Supabase 写入
"""
import json
import os
import random
import re
import time
from typing import Optional

import requests

# ── 环境变量 ────────────────────────────────────────────────────────────
SUPABASE_URL      = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY      = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
FEISHU_WEBHOOK    = os.environ.get("FEISHU_ALERT_WEBHOOK", "")

_SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# ── User-Agent 池 ───────────────────────────────────────────────────────
_USER_AGENTS = [
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


# ── 网页抓取 ─────────────────────────────────────────────────────────────
def fetch_page(url: str) -> Optional[str]:
    """抓取单个页面，随机 UA，间隔 ≥1s，失败重试 3 次。"""
    global _last_request_time

    for attempt in range(3):
        # 保证请求间隔 ≥ 1s
        elapsed = time.time() - _last_request_time
        if elapsed < 1.0:
            time.sleep(1.0 - elapsed)

        try:
            resp = requests.get(
                url,
                headers={"User-Agent": random.choice(_USER_AGENTS)},
                timeout=20,
            )
            _last_request_time = time.time()

            if resp.status_code == 200:
                return resp.text

            print(f"[fetch] 第 {attempt+1} 次尝试 HTTP {resp.status_code}: {url}")

        except requests.RequestException as e:
            _last_request_time = time.time()
            print(f"[fetch] 第 {attempt+1} 次请求异常: {e}")

        # 指数退避：1s / 2s / 4s
        if attempt < 2:
            time.sleep(2 ** attempt)

    _send_alert(f"fetch_page 三次全部失败: {url}")
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
def _existing_source_urls(source: str) -> set[str]:
    """查询数据库中已有的 source_url 集合，避免重复插入。"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return set()
    try:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/submissions",
            headers=_SUPABASE_HEADERS,
            params={
                "select": "payload->>source_url",
                "source": f"eq.{source}",
            },
            timeout=15,
        )
        if resp.status_code == 200:
            return {row.get("source_url") for row in resp.json() if row.get("source_url")}
    except Exception as e:
        print(f"[save] 查询已有记录失败: {e}")
    return set()


def save_to_supabase(items: list[dict], source: str = "crawler:yc") -> int:
    """
    批量写入 submissions 表。
    - 跳过 source_url 已存在的记录
    - 写入失败发飞书告警
    - 返回实际写入条数
    """
    if not items:
        return 0

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[save] 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY，跳过写入")
        return 0

    existing = _existing_source_urls(source)
    to_insert = [it for it in items if it.get("source_url") not in existing]

    if not to_insert:
        print(f"[save] 全部 {len(items)} 条已存在，跳过")
        return 0

    rows = [{"payload": item, "source": source, "status": "pending"} for item in to_insert]

    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/submissions",
            headers={**_SUPABASE_HEADERS, "Prefer": "return=minimal"},
            json=rows,
            timeout=30,
        )
        if resp.status_code in (200, 201):
            print(f"[save] 写入 {len(rows)} 条（跳过 {len(items) - len(rows)} 条重复）")
            return len(rows)

        err_msg = f"Supabase 写入失败 HTTP {resp.status_code}: {resp.text[:200]}"
        print(f"[save] {err_msg}")
        _send_alert(err_msg)
        return 0

    except Exception as e:
        _send_alert(f"Supabase 写入异常: {e}")
        return 0
