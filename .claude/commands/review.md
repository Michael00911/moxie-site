# review

对当前分支执行代码评审，**全程使用中文输出**。

## 执行步骤

1. 运行 `git log origin/main..HEAD --oneline` 查看当前分支提交列表
2. 运行 `git diff origin/main...HEAD --stat` 获取变更文件概览
3. 运行 `git diff origin/main...HEAD` 获取完整 diff（核心文件优先）
4. 按以下模板输出中文评审报告

如果传入了 `$ARGUMENTS`（PR 编号），则先尝试 `gh pr view $ARGUMENTS` 和 `gh pr diff $ARGUMENTS` 获取 PR 信息，再进行评审。

---

## 输出模板

```
## 代码评审 — <分支名>

**变更范围：** X 个文件，+N / -N 行
**核心变更：** 一句话概括本 PR 做了什么

---

### 1. 变更概述
- 列出主要新增/修改的模块
- 说明整体架构影响

---

### 2. 问题（需修复）

#### 🔴 严重 / 🟡 建议 / 🟢 可选
每个问题包含：
- **文件：** 路径 + 行号
- **问题描述**
- **修复建议**（附代码示例）

---

### 3. 安全评审
- 鉴权 / 权限边界是否正确
- 敏感数据是否暴露
- 输入校验是否完整

---

### 4. 代码质量
- 重复代码 / 硬编码 / 可维护性问题
- 是否符合项目已有的规范和风格

---

### 5. 亮点
- 值得肯定的设计决策或实现方式

---

### 6. 优先级总结

| 优先级 | 问题 | 文件 |
|-------|------|------|
| 🔴 立即修复 | ... | ... |
| 🟡 建议修复 | ... | ... |
| 🟢 可选优化 | ... | ... |
```

---

## 本项目评审重点（来自 feature/moxie-468-new 经验积累）

### .gitignore 白名单顺序规则
gitignore **后出现的规则优先**。白名单 `!` 规则必须放在通配忽略规则**之后**，否则会被覆盖：

```gitignore
# ❌ 错误：白名单在前，后面的通配会覆盖
!/docs/test-result/T3-*.md
/docs/test-result/*           ← 此行覆盖上面的白名单

# ✅ 正确：通配在前，白名单在后
/docs/test-result/*
!/docs/test-result/T3-*.md
```

### Supabase Edge Function 安全检查清单
- [ ] 密钥比较使用 constant-time 实现（纯 JS `diff |= byteA ^ byteB` 累加器，无提前退出分支；禁用 `crypto.subtle.timingSafeEqual`，该 API 为 Node.js 专有，Deno Edge Runtime 不含此方法）
- [ ] 无 CORS 头（内部触发器专用函数不需要）
- [ ] fetch 调用有超时（AbortController）
- [ ] 环境变量缺失时返回 500 而非崩溃

### 数据库迁移检查清单
- [ ] 所有语句有 `IF NOT EXISTS` / `OR REPLACE` / `IF EXISTS`（幂等）
- [ ] 新建涉及敏感数据的表需显式 `REVOKE ALL FROM anon, authenticated`
- [ ] `SECURITY DEFINER` 函数需 `SET search_path = public`
- [ ] 触发器绑定粒度（`FOR EACH STATEMENT` vs `FOR EACH ROW`）与业务意图一致

### 脚本硬编码检查
- `PROJECT_REF` 应从 `SUPABASE_URL` 动态解析，而非写死：
  ```typescript
  const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]
  ```
