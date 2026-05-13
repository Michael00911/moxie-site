"""
moxie-data-gain-test
====================
使用 Crawl4AI 抓取 GitHub Trending 上本周和今日最新的开源 AI 项目，
按照星标数和推荐量排序后输出到 CSV 文件。
"""

import asyncio
import csv
import json
import os
import re
from datetime import datetime
from pathlib import Path

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy


# ── 输出目录 ─────────────────────────────────────────────────────────────────
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)


# ── GitHub Trending 目标页面 ─────────────────────────────────────────────────
TRENDING_URLS = {
    "daily": "https://github.com/trending?spoken_language_code=&since=daily&q=ai+OR+llm+OR+machine+learning+OR+deep+learning",
    "weekly": "https://github.com/trending?spoken_language_code=&since=weekly&q=ai+OR+llm+OR+machine+learning+OR+deep+learning",
}

# AI 相关关键词（过滤用）
AI_KEYWORDS = {
    "ai", "llm", "gpt", "ml", "machine-learning", "deep-learning",
    "neural", "nlp", "transformer", "diffusion", "langchain", "rag",
    "vector", "embedding", "inference", "fine-tun", "stable-diffusion",
    "openai", "anthropic", "huggingface", "pytorch", "tensorflow",
    "agent", "multimodal", "vision", "generative", "chatbot",
    "robotics", "reinforcement", "bert", "lora", "quantiz",
}


# ── CSS 提取 Schema ──────────────────────────────────────────────────────────
TRENDING_SCHEMA = {
    "name": "GitHub Trending Repos",
    "baseSelector": "article.Box-row",
    "fields": [
        {
            "name": "rank",
            "selector": "",
            "type": "index",
        },
        {
            "name": "repo_path",
            "selector": "h2.h3 a",
            "type": "attribute",
            "attribute": "href",
        },
        {
            "name": "repo_name",
            "selector": "h2.h3 a",
            "type": "text",
        },
        {
            "name": "description",
            "selector": "p.col-9",
            "type": "text",
        },
        {
            "name": "language",
            "selector": "span[itemprop='programmingLanguage']",
            "type": "text",
        },
        {
            "name": "stars_total",
            "selector": "a[href*='/stargazers']",
            "type": "text",
        },
        {
            "name": "forks_total",
            "selector": "a[href*='/forks']",
            "type": "text",
        },
        {
            "name": "stars_period",
            "selector": "span.d-inline-block.float-sm-right",
            "type": "text",
        },
    ],
}


# ── 解析工具函数 ──────────────────────────────────────────────────────────────
def parse_number(text: str) -> int:
    """将 '12,345' 或 '12.3k' 格式转为整数。"""
    if not text:
        return 0
    text = text.strip().replace(",", "").replace(" ", "").lower()
    try:
        if text.endswith("k"):
            return int(float(text[:-1]) * 1000)
        return int(re.sub(r"[^\d]", "", text) or 0)
    except ValueError:
        return 0


def is_ai_related(repo_name: str, description: str) -> bool:
    """粗略判断项目是否与 AI 相关。"""
    text = (repo_name + " " + (description or "")).lower()
    return any(kw in text for kw in AI_KEYWORDS)


def clean_repo_name(raw: str) -> str:
    """清理仓库名称中的多余空白。"""
    return re.sub(r"\s+", "", raw).strip("/")


def parse_stars_period(raw: str) -> int:
    """解析 'X stars this week/today' 类文本。"""
    if not raw:
        return 0
    raw = raw.strip()
    nums = re.findall(r"[\d,]+", raw)
    if nums:
        return parse_number(nums[0])
    return 0


# ── 爬取单个页面 ──────────────────────────────────────────────────────────────
async def crawl_trending(crawler: AsyncWebCrawler, period: str, url: str) -> list[dict]:
    """爬取 GitHub Trending 页面并返回解析后的项目列表。"""
    print(f"  ▶ 正在抓取 [{period}] {url}")

    extraction_strategy = JsonCssExtractionStrategy(TRENDING_SCHEMA, verbose=False)

    config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=extraction_strategy,
        wait_for="css:article.Box-row",
        page_timeout=30000,
        verbose=False,
    )

    result = await crawler.arun(url=url, config=config)

    if not result.success:
        print(f"  ✗ 抓取失败：{result.error_message}")
        return []

    try:
        raw_items = json.loads(result.extracted_content or "[]")
    except json.JSONDecodeError:
        print("  ✗ JSON 解析失败")
        return []

    projects = []
    for idx, item in enumerate(raw_items, start=1):
        repo_path = (item.get("repo_path") or "").strip("/")
        repo_name = clean_repo_name(item.get("repo_name") or repo_path)
        description = (item.get("description") or "").strip()

        # AI 相关过滤
        if not is_ai_related(repo_name, description):
            continue

        stars_total = parse_number(item.get("stars_total") or "0")
        forks_total = parse_number(item.get("forks_total") or "0")
        stars_period = parse_stars_period(item.get("stars_period") or "0")

        projects.append(
            {
                "period": period,
                "rank_in_trending": idx,
                "repo_name": repo_name,
                "repo_url": f"https://github.com/{repo_path}",
                "description": description,
                "language": (item.get("language") or "").strip(),
                "stars_total": stars_total,
                "forks_total": forks_total,
                f"stars_{period}": stars_period,
                "crawled_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    print(f"  ✓ 获取 {len(projects)} 个 AI 相关项目（共 {len(raw_items)} 个）")
    return projects


# ── 保存到 CSV ─────────────────────────────────────────────────────────────
def save_to_csv(projects: list[dict], filepath: Path) -> None:
    if not projects:
        print("  ⚠ 无数据可保存")
        return

    fieldnames = list(projects[0].keys())
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(projects)
    print(f"  💾 已保存到 {filepath}（共 {len(projects)} 行）")


def merge_daily_weekly(daily: list[dict], weekly: list[dict]) -> list[dict]:
    """
    合并 daily 与 weekly 数据，以 repo_url 为 key 去重，
    合并后保留两个周期的 stars 字段。
    """
    merged: dict[str, dict] = {}

    for p in daily:
        key = p["repo_url"]
        merged[key] = dict(p)
        merged[key].setdefault("stars_weekly", 0)

    for p in weekly:
        key = p["repo_url"]
        weekly_stars = p.get("stars_weekly", 0)
        if key in merged:
            merged[key]["stars_weekly"] = weekly_stars
        else:
            entry = dict(p)
            entry.setdefault("stars_daily", 0)
            merged[key] = entry

    result = list(merged.values())
    # 按 stars_total 降序，再按 stars_daily 降序排列
    result.sort(key=lambda x: (x.get("stars_total", 0), x.get("stars_daily", 0)), reverse=True)

    # 统一字段顺序
    unified = []
    for r in result:
        unified.append(
            {
                "repo_name": r.get("repo_name", ""),
                "repo_url": r.get("repo_url", ""),
                "description": r.get("description", ""),
                "language": r.get("language", ""),
                "stars_total": r.get("stars_total", 0),
                "forks_total": r.get("forks_total", 0),
                "stars_daily": r.get("stars_daily", 0),
                "stars_weekly": r.get("stars_weekly", 0),
                "period": r.get("period", ""),
                "rank_in_trending": r.get("rank_in_trending", 0),
                "crawled_at": r.get("crawled_at", ""),
            }
        )
    return unified


# ── 主流程 ───────────────────────────────────────────────────────────────────
async def main():
    print("=" * 60)
    print("  moxie-data-gain-test — GitHub AI 项目趋势抓取器")
    print("=" * 60)

    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
        extra_args=["--no-sandbox", "--disable-dev-shm-usage"],
    )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    daily_csv = OUTPUT_DIR / f"ai_trending_daily_{timestamp}.csv"
    weekly_csv = OUTPUT_DIR / f"ai_trending_weekly_{timestamp}.csv"
    merged_csv = OUTPUT_DIR / f"ai_trending_merged_{timestamp}.csv"

    all_daily: list[dict] = []
    all_weekly: list[dict] = []

    async with AsyncWebCrawler(config=browser_config) as crawler:
        print("\n[1/2] 抓取今日趋势 …")
        daily_data = await crawl_trending(crawler, "daily", TRENDING_URLS["daily"])
        all_daily.extend(daily_data)

        print("\n[2/2] 抓取本周趋势 …")
        weekly_data = await crawl_trending(crawler, "weekly", TRENDING_URLS["weekly"])
        all_weekly.extend(weekly_data)

    # 按 stars_daily 降序排列
    all_daily.sort(key=lambda x: x.get("stars_daily", 0), reverse=True)
    all_weekly.sort(key=lambda x: x.get("stars_weekly", 0), reverse=True)

    print("\n── 保存结果 ──")
    save_to_csv(all_daily, daily_csv)
    save_to_csv(all_weekly, weekly_csv)

    merged = merge_daily_weekly(all_daily, all_weekly)
    save_to_csv(merged, merged_csv)

    print("\n── 合并排行榜 TOP 10 ──")
    for i, p in enumerate(merged[:10], 1):
        print(
            f"  {i:>2}. {p['repo_name']:<45} "
            f"⭐ {p['stars_total']:>6,}  "
            f"今日+{p['stars_daily']:>4}  "
            f"本周+{p['stars_weekly']:>5}"
        )

    print(f"\n✅ 完成！输出文件：")
    print(f"   今日趋势 → {daily_csv}")
    print(f"   本周趋势 → {weekly_csv}")
    print(f"   合并汇总 → {merged_csv}")


if __name__ == "__main__":
    asyncio.run(main())
