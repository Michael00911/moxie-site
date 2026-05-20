"""
手动触发爬虫预览拉取脚本
用法：python scripts/crawler/test/fetch_preview.py [--pages N] [--dry-run]
      --pages N    拉取前 N 页（默认 3）
      --dry-run    只统计不写入 Supabase

功能：
  1. 统计 YC AI 数据源总页数和预估总条数
  2. 拉取前 N 页数据并解析
  3. 写入 Supabase submissions 表（dry-run 时跳过）
  4. 打印每页写入结果和汇总
"""
import argparse
import os
import re
import sys
import time
from pathlib import Path

# ── 加载 .env.local ──────────────────────────────────────────
def _load_env() -> None:
    env_file = Path(__file__).parent.parent.parent.parent / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z_][A-Z0-9_]*)=(.*)$', line.strip())
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip("'\"")

_load_env()

# ── 确保能找到 _common / yc ──────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent.parent))
from _common import fetch_json, clean_item, save_to_supabase, _existing_source_urls
from yc import _format_company, _API_BASE


# ── 主逻辑 ───────────────────────────────────────────────────
def run(max_pages: int, dry_run: bool) -> None:
    sep = "─" * 60

    print(sep)
    print(f"  YC AI 爬虫预览拉取")
    print(f"  模式: {'dry-run（不写入）' if dry_run else '写入 Supabase'}")
    print(f"  计划拉取: 前 {max_pages} 页")
    print(sep)

    # ── Step 1: 拉取第 1 页，获取总页数 ─────────────────────
    print("\n[1/4] 拉取第 1 页，获取数据源概况...")
    first = fetch_json(_API_BASE, params={"industry": "Artificial Intelligence", "page": 1})
    if not first:
        print("  [FAIL] 第 1 页拉取失败，请检查网络或 YC API 可用性")
        sys.exit(1)

    total_pages = first.get("totalPages", 1)
    page1_count = len(first.get("companies", []))
    est_total   = total_pages * page1_count

    print(f"  总页数:       {total_pages} 页")
    print(f"  每页条数:     ~{page1_count} 条")
    print(f"  预估总数据量: ~{est_total} 条")
    print(f"  本次拉取范围: 第 1 ~ {min(max_pages, total_pages)} 页")

    # ── Step 2: 查询已有 source_url（dry-run 时跳过）────────
    existing: set[str] = set()
    if not dry_run:
        print(f"\n[2/4] 查询 Supabase 已有记录（去重用）...")
        existing = _existing_source_urls("crawler:yc")
        print(f"  已有记录数: {len(existing)} 条")
    else:
        print(f"\n[2/4] dry-run 模式，跳过已有记录查询")

    # ── Step 3: 逐页拉取并写入 ───────────────────────────────
    print(f"\n[3/4] 开始逐页拉取...")
    print(sep)

    total_parsed   = 0
    total_inserted = 0
    total_skipped  = 0

    for page in range(1, min(max_pages, total_pages) + 1):
        if page == 1:
            data = first
        else:
            time.sleep(1)  # 1s 礼貌间隔
            data = fetch_json(
                _API_BASE,
                params={"industry": "Artificial Intelligence", "page": page},
            )

        if data is None:
            print(f"  第 {page} 页  [FAIL] 拉取失败，跳过")
            continue

        companies = data.get("companies", [])
        valid     = [_format_company(c) for c in companies]
        cleaned   = [clean_item(c) for c in valid if c is not None]
        filtered  = len(companies) - len(cleaned)   # 被过滤（空name/url）的条数

        if dry_run:
            inserted = 0
            skipped  = 0
            print(f"  第 {page:>3} 页  解析 {len(cleaned):>3} 条"
                  f"  过滤 {filtered} 条  [dry-run 不写入]")
        else:
            before    = len(existing)
            inserted  = save_to_supabase(cleaned, existing_urls=existing)
            skipped   = len(cleaned) - inserted
            after     = len(existing)
            print(f"  第 {page:>3} 页  解析 {len(cleaned):>3} 条"
                  f"  写入 {inserted:>3} 条  跳过重复 {skipped:>3} 条"
                  f"  (existing set: {before}→{after})")

        total_parsed   += len(cleaned)
        total_inserted += inserted
        total_skipped  += skipped

    # ── Step 4: 汇总 ────────────────────────────────────────
    print(sep)
    print(f"\n[4/4] 汇总")
    print(f"  拉取页数:   {min(max_pages, total_pages)} / {total_pages} 页")
    print(f"  解析条数:   {total_parsed}")
    if dry_run:
        print(f"  写入条数:   — (dry-run)")
    else:
        print(f"  写入条数:   {total_inserted}")
        print(f"  跳过重复:   {total_skipped}")
        if total_inserted > 0:
            print(f"\n  [OK] 写入完成，可在 Supabase submissions 表查看 source=crawler:yc 数据")
        else:
            print(f"\n  [INFO] 无新数据写入（数据可能已全部存在）")
    print(sep)


# ── CLI 入口 ─────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YC 爬虫预览拉取（前 N 页）")
    parser.add_argument("--pages",   type=int, default=3, help="拉取前 N 页，默认 3")
    parser.add_argument("--dry-run", action="store_true",  help="只拉取解析，不写入 Supabase")
    args = parser.parse_args()

    if args.pages < 1:
        print("错误：--pages 必须 >= 1")
        sys.exit(1)

    run(max_pages=args.pages, dry_run=args.dry_run)
