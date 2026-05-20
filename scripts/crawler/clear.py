"""
清除 submissions 表中指定 source 的爬虫数据
用法：python scripts/crawler/clear.py [source]
      source 默认为 crawler:yc，支持的值见 submissions.source check 约束
示例：python scripts/crawler/clear.py
      python scripts/crawler/clear.py crawler:ph
"""
import os
import re
import sys
from pathlib import Path

def _load_env() -> None:
    env_file = Path(__file__).parent.parent.parent / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z_][A-Z0-9_]*)=(.*)$', line.strip())
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip("'\"")

_load_env()
sys.path.insert(0, str(Path(__file__).parent))
from _common import _supabase_headers, SUPABASE_URL  # noqa: E402

import requests

VALID_SOURCES = {"crawler:yc", "crawler:ph"}


def clear(source: str) -> int:
    """删除指定 source 的全部记录，返回删除前的条数。"""
    if not SUPABASE_URL or not os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
        print("[clear] 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)

    # 先查精确总数（Prefer: count=exact 避免 Supabase 默认 1000 行上限）
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/submissions",
        headers={**_supabase_headers(), "Prefer": "count=exact",
                 "Range-Unit": "items", "Range": "0-0"},
        params={"select": "id", "source": f"eq.{source}"},
        timeout=15,
    )
    if r.status_code not in (200, 206):
        print(f"[clear] 查询失败 HTTP {r.status_code}: {r.text[:100]}")
        sys.exit(1)

    content_range = r.headers.get("Content-Range", "0/0")
    count = int(content_range.split("/")[-1]) if "/" in content_range else 0
    if count == 0:
        print(f"[clear] source={source} 无数据，无需清除")
        return 0

    # 二次确认
    ans = input(f"[clear] 将删除 {count} 条 source={source} 的记录，确认？[y/N] ").strip().lower()
    if ans != "y":
        print("[clear] 已取消")
        return 0

    d = requests.delete(
        f"{SUPABASE_URL}/rest/v1/submissions",
        headers={**_supabase_headers(), "Prefer": "return=minimal"},
        params={"source": f"eq.{source}"},
        timeout=30,
    )
    if d.status_code == 204:
        print(f"[clear] 已删除 {count} 条 source={source}")
        return count

    print(f"[clear] 删除失败 HTTP {d.status_code}: {d.text[:100]}")
    sys.exit(1)


if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else "crawler:yc"
    if source not in VALID_SOURCES:
        print(f"[clear] 不支持的 source: {source}，可用值: {VALID_SOURCES}")
        sys.exit(1)
    clear(source)
