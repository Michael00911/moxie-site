"""
爬虫调度主入口
- 定时触发：GitHub Actions cron "0 2 * * *"（UTC 02:00 = 北京时间 10:00）
- 手动运行：python scripts/crawler/run.py [--source yc] [--dry-run]

功能：
  1. 读取 sources.json，获取各数据源的启用状态和模块配置
  2. 按配置顺序运行所有已启用的数据源爬虫
  3. 输出各数据源的拉取统计（页数、耗时、解析/写入/跳过量）
  4. 汇总输出总计，任意数据源失败则以非零退出码退出
"""
import argparse
import importlib
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

SOURCES_CONFIG = Path(__file__).parent / "sources.json"
SEP  = "=" * 70
SEP2 = "-" * 70


def _load_sources() -> dict:
    if not SOURCES_CONFIG.exists():
        print(f"[run] 找不到 {SOURCES_CONFIG}，退出")
        sys.exit(1)
    return json.loads(SOURCES_CONFIG.read_text(encoding="utf-8"))["sources"]


def _fmt_time(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    m, s = divmod(int(seconds), 60)
    return f"{m}m{s:02d}s"


def _run_source(module_name: str, dry_run: bool) -> dict:
    """动态加载爬虫模块并调用 main()，返回统计字典。"""
    try:
        mod = importlib.import_module(module_name)
    except ImportError as e:
        return {"status": "error", "error": f"模块加载失败: {e}"}

    if not hasattr(mod, "main"):
        return {"status": "error", "error": "模块缺少 main() 函数"}

    t0 = time.time()
    try:
        stats = mod.main(dry_run=dry_run) or {}
        stats["elapsed"] = time.time() - t0
        stats["status"]  = "ok"
        return stats
    except SystemExit as e:
        return {"status": "error", "error": f"退出码 {e.code}", "elapsed": time.time() - t0}
    except Exception as e:
        return {"status": "error", "error": str(e)[:80], "elapsed": time.time() - t0}


def _print_source_result(key: str, name: str, r: dict) -> None:
    status = r.get("status")
    if status == "disabled":
        print(f"  [{key}] {name}")
        print(f"       状态: 已禁用")
    elif status == "skip":
        print(f"  [{key}] {name}")
        print(f"       状态: 跳过（--source 过滤）")
    elif status == "ok":
        pages       = r.get("pages", 0)
        total_pages = r.get("total_pages", pages)
        parsed      = r.get("parsed", 0)
        elapsed     = r.get("elapsed", 0)
        pages_str   = f"{pages}/{total_pages}" if total_pages != pages else str(pages)
        # dry-run 时 inserted/skipped 字段不存在，显示 —
        if "inserted" in r:
            write_info = f" | 写入: {r['inserted']} 条 | 跳过: {r['skipped']} 条"
        else:
            write_info = " | 写入: — | 跳过: —"
        print(f"  [{key}] {name}")
        print(f"       状态: 成功 | 耗时: {_fmt_time(elapsed)} | 页数: {pages_str} 页"
              f" | 解析: {parsed} 条{write_info}")
    else:
        err = r.get("error", "未知错误")
        print(f"  [{key}] {name}")
        print(f"       状态: 失败 | 耗时: {_fmt_time(r.get('elapsed', 0))} | 错误: {err}")


def run(only_source: str | None = None, dry_run: bool = False) -> None:
    sources  = _load_sources()

    if only_source and only_source not in sources:
        known = ", ".join(sources.keys())
        print(f"[run] 未知数据源: '{only_source}'，可用值: {known}")
        sys.exit(1)

    now      = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    mode_str = "dry-run（只解析不写入）" if dry_run else "正式写入"

    print(SEP)
    print(f"  爬虫调度报告  {now}")
    print(f"  模式: {mode_str}")
    if only_source:
        print(f"  过滤: 只运行 {only_source}")
    print(SEP)

    results        = {}
    total_elapsed  = 0.0
    total_pages    = 0
    total_parsed   = 0
    total_inserted = 0
    total_skipped  = 0

    for key, cfg in sources.items():
        name    = cfg.get("name", key)
        enabled = cfg.get("enabled", False)
        module  = cfg.get("module", key)

        if only_source and key != only_source:
            results[key] = {"name": name, "status": "skip"}
            continue

        if not enabled:
            results[key] = {"name": name, "status": "disabled"}
            continue

        print(f"\n{SEP2}")
        print(f"  开始拉取: [{key}] {name}")
        print(f"  描述: {cfg.get('description', '')}")
        print(f"  开始时间: {datetime.now(timezone.utc).strftime('%H:%M:%S UTC')}")
        print(SEP2)

        r = _run_source(module, dry_run)
        r["name"] = name
        results[key] = r

        total_elapsed  += r.get("elapsed", 0)
        total_pages    += r.get("pages", 0)
        total_parsed   += r.get("parsed", 0)
        total_inserted += r.get("inserted", 0)
        total_skipped  += r.get("skipped", 0)

    # ── 汇总 ─────────────────────────────────────────────────────────
    print(f"\n{SEP}")
    print("  汇总")
    print(SEP2)

    for key, r in results.items():
        _print_source_result(key, r.get("name", key), r)

    print(SEP2)
    if dry_run:
        total_write = "写入: — | 跳过: —"
    else:
        total_write = f"写入: {total_inserted} 条 | 跳过: {total_skipped} 条"
    print(
        f"  合计 | 耗时: {_fmt_time(total_elapsed)} | 页数: {total_pages} 页"
        f" | 解析: {total_parsed} 条 | {total_write}"
    )
    print(SEP)

    if any(r.get("status") == "error" for r in results.values()):
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="爬虫调度主入口")
    parser.add_argument("--source",  metavar="KEY", help="只运行指定数据源（如 yc、ph）")
    parser.add_argument("--dry-run", action="store_true", help="只解析不写入 Supabase")
    args = parser.parse_args()
    run(only_source=args.source, dry_run=args.dry_run)
