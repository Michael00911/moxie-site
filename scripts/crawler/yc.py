"""
YC AI 公司爬虫
数据来源：https://api.ycombinator.com/v0.1/companies?industry=Artificial+Intelligence
运行：python scripts/crawler/yc.py
"""
import os
import re
import sys
import time
import random
from pathlib import Path

import requests

# 从项目根目录加载 .env.local（本地开发用，CI 用环境变量）
def _load_env() -> None:
    env_file = Path(__file__).parent.parent.parent / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z_][A-Z0-9_]*)=(.*)$', line.strip())
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip("'\"")

_load_env()

# 保证无论从哪个目录运行都能找到 _common
sys.path.insert(0, str(Path(__file__).parent))
from _common import clean_item, save_to_supabase, _send_alert  # noqa: E402

# ── 常量 ────────────────────────────────────────────────────────────────
_API_BASE = "https://api.ycombinator.com/v0.1/companies"
_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
]


# ── 单页抓取 ─────────────────────────────────────────────────────────────
def _fetch_page(page: int) -> dict | None:
    for attempt in range(3):
        try:
            resp = requests.get(
                _API_BASE,
                params={"industry": "Artificial Intelligence", "page": page},
                headers={
                    "User-Agent": random.choice(_USER_AGENTS),
                    "Accept": "application/json",
                },
                timeout=20,
            )
            if resp.status_code == 200:
                return resp.json()
            print(f"[yc] page {page} 第{attempt+1}次 HTTP {resp.status_code}")
        except requests.RequestException as e:
            print(f"[yc] page {page} 第{attempt+1}次异常: {e}")
        time.sleep(2 ** attempt)

    _send_alert(f"yc.py: page {page} 三次全部失败")
    return None


# ── 格式化单条公司记录 ────────────────────────────────────────────────────
def _format_company(raw: dict) -> dict | None:
    name = (raw.get("name") or "").strip()
    if not name:
        return None
    source_url = (raw.get("url") or "").strip()
    if not source_url:
        return None
    return {
        "name":        name,
        "tagline":     raw.get("oneLiner") or "",
        "description": raw.get("longDescription") or "",
        "website_url": raw.get("website") or "",
        "source_url":  source_url,
        "batch":       raw.get("batch") or "",
        "tags":        raw.get("tags") or [],
        "logo_url":    raw.get("smallLogoUrl") or "",
    }


# ── 主流程 ───────────────────────────────────────────────────────────────
def main() -> None:
    total_parsed = 0
    total_inserted = 0

    # 先取第一页，获得总页数
    first = _fetch_page(1)
    if not first:
        print("[yc] 第一页抓取失败，退出")
        sys.exit(1)

    total_pages = first.get("totalPages", 1)
    print(f"[yc] 共 {total_pages} 页，开始全量抓取...")

    for page in range(1, total_pages + 1):
        data = first if page == 1 else _fetch_page(page)
        if data is None:
            continue

        raw_companies = data.get("companies", [])
        formatted = [_format_company(c) for c in raw_companies]
        valid = [c for c in formatted if c is not None]
        cleaned = [clean_item(c) for c in valid]

        total_parsed += len(cleaned)
        total_inserted += save_to_supabase(cleaned)

        # 每页请求后等 1s，礼貌爬取
        if page < total_pages:
            time.sleep(1)

        # 每 20 页打印一次进度
        if page % 20 == 0:
            print(f"[yc] 进度 {page}/{total_pages}，已写入 {total_inserted} 条")

    print(f"[yc] 完成：写入 {total_inserted} 条 / 共解析 {total_parsed} 条")


if __name__ == "__main__":
    main()
