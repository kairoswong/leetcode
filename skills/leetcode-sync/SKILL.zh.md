# LeetCode 题目同步

当你往 `solutions/` 目录下添加新的 `.py` 解法文件时，这个技能会自动分析你的代码，更新 `site/data/` 下的所有 JSON 元数据文件。

## 什么时候用

- 往 `solutions/` 里新增了 `.py` 文件
- 发现 `site/data/*.json` 里的数据不完整或者过时了
- 在运行 `python3 scripts/generate-index.py` 前后，需要确保数据是最新的

## 工作流程

### 1. 读取解法文件

从 `solutions/<题目ID>.<题目英文名>.py` 中读取：
- 通过 `@lc` 头注释获取题目 `ID` 和 `标题`
- 从 `# @lc code=start` 和 `# @lc code=end` 之间提取 `代码`

### 2. 加载已有的 JSON 数据

读取 `site/data/` 下所有 JSON 文件：
- `difficulties.json`、`complexities.json`、`descriptions.json`
- `approaches.json`、`insights.json`、`tags.json`
- `solutions-data.json`（检查是否已存在该题目）

### 3. 分析代码并自动推导元数据

根据代码内容按以下规则自动推导：

**难度** — 优先使用 LeetCode 官方给出的题目难度；如果能拿到官方题目元数据或题面信息，就直接采用，不要只凭代码复杂度猜测。
- 有官方难度时，优先直接使用官方定义。
- 没有官方难度时，才作为兜底使用启发式规则：
  - 基础遍历、简单数学 → `easy`
  - 常见算法（双指针、二分、BFS/DFS）→ `medium`
  - 高级结构或复杂推导 → `hard`

**复杂度** — 分析循环嵌套层数和额外空间使用，用大 O 表示。

**描述** — 从题目标题和代码注释中提炼一句话概括。

**解法思路** — 识别代码中的核心算法模式（用到什么数据结构、什么算法范式）。

**关键洞察** — 总结让解法成立的核心思想。

**标签** — 根据数据结构与算法自动匹配：
- `tags.json` 格式为 `{ "关键词": ["标签1", "标签2"] }`
- 用到 HashMap → `hash-map`，双指针 → `two-pointer`，滑动窗口 → `sliding-window`，依此类推

如果遇到无法确定的项，可以简要确认。

### 4. 更新 JSON 文件

将推导结果写入各个 JSON 文件：
- 添加新的 `"题目ID": 值` 条目
- 保持原有排序和 2 空格缩进格式

### 5. 重新生成站点索引

运行：
```bash
python3 scripts/generate-index.py
```

确认输出里有 `✅` 成功标志。

---

## 修改的文件

- `site/data/difficulties.json`
- `site/data/complexities.json`
- `site/data/descriptions.json`
- `site/data/approaches.json`
- `site/data/insights.json`
- `site/data/tags.json`

## 生成的文件

- `site/data/solutions-data.json`（通过 `generate-index.py` 生成）
- `site/scripts/solutions-data.js`（通过 `generate-index.py` 生成）
