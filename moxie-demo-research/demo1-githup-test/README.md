# moxie-data-gain-test

> 使用 **Crawl4AI** 自动抓取 GitHub Trending 上本日 & 本周最热门的开源 AI 项目，并按照星标数、推荐量排序后输出为 CSV 文件。

---

## 项目结构

```
moxie-data-gain-test/
├── crawler.py          # 主爬取脚本
├── requirements.txt    # 依赖列表
├── output/             # CSV 输出目录（自动创建）
└── README.md
```

---

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

安装完成后，首次运行前需要安装 Playwright 浏览器内核：

```bash
playwright install chromium
```

### 2. 运行爬取

```bash
python crawler.py
```

运行结束后，`output/` 目录下会生成三个带时间戳的 CSV 文件：

| 文件名 | 说明 |
|--------|------|
| `ai_trending_daily_<timestamp>.csv`  | 今日 AI 趋势项目 |
| `ai_trending_weekly_<timestamp>.csv` | 本周 AI 趋势项目 |
| `ai_trending_merged_<timestamp>.csv` | 今日 + 本周合并去重，综合排行 |

---

## CSV 字段说明

| 字段 | 说明 |
|------|------|
| `repo_name` | 仓库名称（`owner/repo` 格式） |
| `repo_url` | 仓库 GitHub 链接 |
| `description` | 项目描述 |
| `language` | 主要编程语言 |
| `stars_total` | 总星标数 |
| `forks_total` | 总 Fork 数 |
| `stars_daily` | 今日新增星标数（推荐量） |
| `stars_weekly` | 本周新增星标数（推荐量） |
| `period` | 来源周期（daily / weekly） |
| `rank_in_trending` | 在 Trending 页面的原始排名 |
| `crawled_at` | 抓取时间 |

---

## AI 项目筛选规则

脚本会自动过滤与 AI 相关的项目，匹配关键词包括：

`ai`, `llm`, `gpt`, `ml`, `machine-learning`, `deep-learning`, `neural`, `nlp`,
`transformer`, `diffusion`, `langchain`, `rag`, `vector`, `embedding`,
`agent`, `multimodal`, `generative`, `chatbot` 等。

---

## 排序规则

- **今日** CSV：按 `stars_daily`（今日新增星标）降序
- **本周** CSV：按 `stars_weekly`（本周新增星标）降序  
- **合并** CSV：按 `stars_total`（总星标）降序，次排 `stars_daily`

---

## 依赖说明

| 库 | 用途 |
|----|------|
| `crawl4ai` | 异步 Web 爬取 + CSS 结构化提取 |
| `playwright` | 无头浏览器驱动 |
| `pandas` | 数据处理（可选扩展） |
| `python-dateutil` | 日期解析工具 |

---

## 注意事项

- 请遵守 GitHub 的 [Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)，不要以过高频率抓取。
- 若 IP 被限流，可适当增加 `page_timeout` 或添加代理配置。
- 脚本使用 `CacheMode.BYPASS` 确保每次都获取最新数据。
