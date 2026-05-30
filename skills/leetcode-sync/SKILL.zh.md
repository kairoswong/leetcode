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
- `approaches.json`、`insights.json`、`tags.json`、`visualizations.json`
- `solutions-data.json`（检查是否已存在该题目）

### 3. 分析代码并自动推导元数据

根据代码内容按以下规则自动推导：

**难度** — 根据代码复杂度和算法类型判断：
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

**可视化** — 自动生成步骤数据：
- 根据算法类型选择对应的可视化类型（见下方参考表）
- 挑一个短小的示例输入，逐步骤模拟执行
- 每步记录 `info`（描述）和 `highlight`（一句话高亮）

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

## 可视化类型参考

| 类型 | 适用场景 | 参数示例 |
|------|---------|---------|
| `hash-map` | 哈希表查找 | `{ "nums": [...], "target": N }` |
| `linked-list` | 链表遍历 | `{ "list1": [...], "list2": [...] }` |
| `sliding-window` | 双指针滑动窗口 | `{ "s": "字符串" }`，需要标记窗口边界 |
| `binary-partition` | 二分查找 / 分区 | `{ "nums1": [...], "nums2": [...] }` |
| `expand-center` | 中心扩散 | `{ "s": "字符串" }` |
| `zigzag` | Z 字形排列 | `{ "s": "字符串", "numRows": N }` |
| `digit-reversal` | 逐位数字处理 | `{ "x": N }` |
| `two-pointer` | 双指针数组遍历 | `{ "height": [...] }` |
| `matrix` | 矩阵变换 | `{ "matrix": [[...]] }` |
| `binary-search` | 范围上的二分查找 | `{ "x": N }` |
| `dp-table` | 动态规划表格 | `{ "n": N }` |

---

## 修改的文件

- `site/data/difficulties.json`
- `site/data/complexities.json`
- `site/data/descriptions.json`
- `site/data/approaches.json`
- `site/data/insights.json`
- `site/data/tags.json`
- `site/data/visualizations.json`

## 生成的文件

- `site/data/solutions-data.json`（通过 `generate-index.py` 生成）
- `site/scripts/solutions-data.js`（通过 `generate-index.py` 生成）
