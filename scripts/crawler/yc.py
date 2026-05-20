"""
YC AI 公司爬虫
数据来源：https://api.ycombinator.com/v0.1/companies?industry=Artificial+Intelligence
运行：python scripts/crawler/yc.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import fetch_json, clean_item, save_to_supabase, _existing_source_urls  # noqa: E402

_API_BASE = "https://api.ycombinator.com/v0.1/companies"


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


def main() -> None:
    total_parsed = 0
    total_inserted = 0

    first = fetch_json(_API_BASE, params={"industry": "Artificial Intelligence", "page": 1})
    if not first:
        print("[yc] 第一页抓取失败，退出")
        sys.exit(1)

    total_pages = first.get("totalPages", 1)
    print(f"[yc] 共 {total_pages} 页，查询已有数据...")
    existing = _existing_source_urls("crawler:yc")
    print(f"[yc] 已有 {len(existing)} 条，开始全量抓取...")

    for page in range(1, total_pages + 1):
        data = first if page == 1 else fetch_json(
            _API_BASE, params={"industry": "Artificial Intelligence", "page": page}
        )
        if data is None:
            continue

        valid = [_format_company(c) for c in data.get("companies", [])]
        cleaned = [clean_item(c) for c in valid if c is not None]

        total_parsed += len(cleaned)
        total_inserted += save_to_supabase(cleaned, existing_urls=existing)

        if page % 20 == 0:
            print(f"[yc] 进度 {page}/{total_pages}，已写入 {total_inserted} 条")

    print(f"[yc] 完成：写入 {total_inserted} 条 / 共解析 {total_parsed} 条")


if __name__ == "__main__":
    main()
