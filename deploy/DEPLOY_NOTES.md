# EdgeOne Pages 手动部署文档

将 Next.js 静态导出产物 `out/` 部署到腾讯云 EdgeOne Pages 的标准操作流程与逐步检查清单。

- **适用项目**：moxie-site（Next.js 静态导出）
- **部署方式**：手动上传 ZIP（非 Git 自动部署）
- **产物目录**：`out/`
- **目标平台**：EdgeOne Pages 控制台 — https://console.cloud.tencent.com/edgeone/pages

---

## 0. 部署前准备

### 0.1 验证构建产物

```bash
# 目录存在且非空
ls out/ | head -5 && du -sh out/

# 关键入口文件
ls -la out/index.html
ls -la out/404.html
ls -la out/_next/
```

- [ ] `out/` 目录存在且非空
- [ ] `out/index.html` 存在（首页入口）
- [ ] `out/404.html` 存在（404 兜底页）
- [ ] `out/_next/` 目录存在（静态资源）
- [ ] 本地预跑过 `npx serve out -p 3000`，首页 200

### 0.2 修复已知缺失路由（可选但强烈推荐）

本地审计（见 [scripts/audit-static.mjs](scripts/audit-static.mjs)）发现 18 个 404：

| 缺失路由组 | 失败 URL |
|---|---|
| `/collections` 系列 | `/collections`, `/collections/content-creator`, `/collections/indie-dev`, `/collections/research-power`, `/collections/oversea-cheap` |
| `/blog` 系列 | `/blog`, `/blog/claude-code-vs-cursor-2026`, `/blog/ai-tool-stack-content-creator`, `/blog/dreamina-vs-runway`, `/blog/deepseek-vs-claude-cost`, `/blog/ai-video-stack-2026`, `/blog/manus-vs-fellou`, `/blog/vibe-coding-saas-guide` |
| `/weekly` 系列 | `/weekly`, `/weekly/47`, `/weekly/46`, `/weekly/45`, `/weekly/44` |

- [ ] 决定是先补齐路由再部署，还是带病上线（注明在部署记录中）

### 0.3 检查包大小与文件数

```bash
# 总大小（EdgeOne Pages 单项目通常 ≤ 500MB）
du -sh out/

# 文件数（通常 ≤ 16,000）
find out -type f | wc -l
```

- [ ] 解压后总大小未超限
- [ ] 文件数量未超限

---

## 1. 登录控制台

- [ ] 浏览器打开 https://console.cloud.tencent.com/edgeone/pages
- [ ] 用正确的腾讯云账号登录（确认右上角账号 ID）
- [ ] 账号已完成实名认证
- [ ] 当前地域 / 项目空间正确

---

## 2. 新建项目 → 手动上传

- [ ] 点击「**新建项目**」
- [ ] 在引导页选择「**手动上传**」（不是「Git 导入」/「从模板创建」）
- [ ] 项目名称规范：小写字母 + 短横线，例如 `moxie-site`
- [ ] 项目名称在当前账号下唯一，未被占用
- [ ] 记录项目名（后续访问域名会基于它生成）

---

## 3. 打包 ZIP

### 3.1 关键规则：打包 `out/` 里的内容，不是 `out/` 文件夹本身

EdgeOne Pages 期望 ZIP 解压后**根部直接是 `index.html`**。

**错误**（会导致访问根路径 404）：
```bash
zip -r out.zip out          # 解压后路径是 out/index.html ❌
```

**推荐**：
```bash
cd out && zip -r ../out.zip . && cd ..
# 解压后直接是 index.html ✅
```

### 3.2 验证 ZIP

```bash
# 查看 ZIP 根部结构（第一层应直接看到 index.html、_next/、404.html）
unzip -l out.zip | head -20

# 确认 _next/ 目录被包含（Windows 上有些工具会因下划线开头跳过）
unzip -l out.zip | grep "_next/" | head -3

# 文件大小（一般几 MB 到几十 MB）
ls -lh out.zip
```

- [ ] ZIP 根部第一层直接是 `index.html`，**不是** `out/`
- [ ] ZIP 中包含 `_next/` 目录
- [ ] ZIP 中包含 `404.html`
- [ ] ZIP 文件大小合理

### 3.3 Windows 替代打包方式

如 `zip` 命令不可用：
```powershell
# PowerShell
Compress-Archive -Path out\* -DestinationPath out.zip
```
或使用 7-Zip GUI：选中 `out/` 目录内**全部**子项 → 添加到压缩文件。

---

## 4. 上传 ZIP

- [ ] 在「手动上传」表单中选中 `out.zip`
- [ ] 上传进度走到 100%，未出现网络中断
- [ ] 控制台显示「解析中 / 部署中」状态
- [ ] 等待部署完成（通常 30s–2min），状态变为「**部署成功**」/「Ready」
- [ ] 若失败：查看部署日志中的报错（常见原因见底部速查表）

---

## 5. 记录临时域名与线上验收

### 5.1 记录部署信息

- [ ] 复制分配的临时域名（形如 `https://moxie-site-xxx.edgeone.app`）
- [ ] 在 `DEPLOY_NOTES.md` 或 README 中记录：
  - 部署时间
  - 构建 commit hash（`git rev-parse --short HEAD`）
  - 临时域名
  - 项目 ID / 部署 ID
- [ ] 截图保存控制台的部署成功页

### 5.2 线上验收

对应本地审计三项检查项的线上复跑：

- [ ] 访问 `https://xxx.edgeone.app/`，首页正常渲染（非空白、非 404）
- [ ] 浏览器 DevTools → Network：所有 `_next/static/...` JS/CSS 都是 200
- [ ] DevTools → Console：无红色报错
- [ ] 抽测内页：`/tools`、`/marketplace`、`/about` 都返回 200
- [ ] 再次确认已知的 18 个 404 路由（`/blog`、`/collections`、`/weekly`）状态与本地一致
- [ ] 用审计脚本跑线上：
  ```bash
  # 改 BASE 为线上域名
  curl -s https://xxx.edgeone.app/ -o ./tmp-index-prod.html
  node scripts/audit-static.mjs
  ```

---

## 6. 部署后清理

- [ ] 删除临时产物：`tmp-index.html`、`tmp-audit-results.json`、`out.zip`
- [ ] 确认本地 `npx serve` 等后台进程已停止
- [ ] 把临时域名同步给团队 / 下游联调方
- [ ] 把缺失路由问题登记到 Issue 或 TODO（如未在 0.2 阶段修复）

---

## 附录 A：常见坑速查

| 现象 | 原因 | 处理 |
|---|---|---|
| 访问根路径 404 | ZIP 根部是 `out/` 而非文件 | 重新按 3.1 推荐方式打包 |
| 页面能开但 CSS/JS 全 404 | `_next/` 未上传 | Windows 上换 `7z` 或 PowerShell `Compress-Archive` 重打 |
| 部分内页 404 | Next.js export 缺少 `generateStaticParams` 覆盖 | 本次确认 `/blog`、`/collections`、`/weekly` 为此原因 |
| 部署超时 | 文件数 > 16k | 清理 `out/__next._*.txt` 等冗余文件 |
| 域名访问慢 | 首次回源缓存未热 | 多刷几次，或在控制台手动预热 |
| 上传卡 99% | 浏览器或网络问题 | 换浏览器 / 关闭代理重试 |

---

## 附录 B：本次部署使用的本地工具

- **构建**：`next build`（已配置 `output: 'export'`）
- **本地预览**：`npx serve out -p 3000`
- **审计脚本**：[scripts/audit-static.mjs](scripts/audit-static.mjs)
  - 抓取首页 HTML
  - 提取所有 `<a href>`、`<script src>`、`<link href>`
  - 并发 HEAD 请求验证返回状态
  - 输出失败列表到 `tmp-audit-results.json`

---

## 附录 C：一键打包命令参考

```bash
# 1. 清理旧包
rm -f out.zip

# 2. 打包（注意是 out 目录内容，不是 out 本身）
cd out && zip -r ../out.zip . && cd ..

# 3. 校验
unzip -l out.zip | head -10
ls -lh out.zip
```
