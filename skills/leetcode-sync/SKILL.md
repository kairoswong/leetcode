---
name: leetcode-sync
description: 'Update LeetCode solution metadata after adding a new solution file. Use when: adding a new .py solution, fixing stale JSON data, regenerating site index after changes. Reads the solution file and updates difficulties.json, complexities.json, descriptions.json, approaches.json, insights.json, tags.json, and visualizations.json accordingly.'
argument-hint: 'Solution ID or title to update'
---

# LeetCode Solution Sync

Updates all metadata JSON files in `site/data/` when a new solution `.py` file is added to `solutions/`. The agent reads the solution file and the existing data files, then analyzes the code to infer all metadata automatically.

## When to Use

- After adding a new `.py` solution file to `solutions/`
- When metadata in any `site/data/*.json` file is incomplete or stale
- Before or after running `python3 scripts/generate-index.py`

## Procedure

### 1. Read the solution file

Read the new solution from `solutions/<id>.<title-slug>.py`. Extract:
- Problem `id` and `title` from the `@lc` header comment
- The solution `code` from between `# @lc code=start` and `# @lc code=end`

### 2. Load existing JSON data

Read all JSON files under `site/data/`:
- `difficulties.json`
- `complexities.json`
- `descriptions.json`
- `approaches.json`
- `insights.json`
- `tags.json`
- `visualizations.json`
- `solutions-data.json` (to check existing entries)

### 3. Analyze code & infer metadata

Derive each field from the code using the following rules:

**Difficulty** — Based on code complexity and algorithm type:
- Simple loops, basic math → `easy`
- Common algorithms (two-pointer, binary search, BFS/DFS) → `medium`
- Advanced structures or complex logic → `hard`

**Complexity** — Analyze loop nesting, recursion depth, and extra space usage; express in Big O notation.

**Description** — Summarize the problem in one sentence from the title and code comments.

**Approach** — Identify the core algorithm pattern (data structures and algorithm paradigm used).

**Insight** — Summarize the key idea that makes the solution work.

**Tags** — Match tags based on data structures and algorithms used:
- `tags.json` format is `{ "keyword": ["tag1", "tag2"] }` where `keyword` is a word from the title (lowercased)
- HashMap usage → `hash-map`, two-pointer → `two-pointer`, sliding window → `sliding-window`, etc.

**Visualization** — Auto-generate step data:
- Pick a visualization type based on algorithm type (see reference table below)
- Choose a small representative example, trace through the solution step by step
- Each step records `info` (description) and `highlight` (one-line summary)

If any field cannot be confidently inferred, briefly confirm with the user.

### 4. Write updated JSON files

Write the inferred results to each JSON file:
- Add the new `"id": value` entry
- Maintain existing ordering and 2-space indentation

### 5. Regenerate site index

Run:
```bash
python3 scripts/generate-index.py
```

Verify the output shows `✅` success messages.

---

## Visualization Type Reference

Available viz types and typical use cases:

| Type | Use Case | Example Params |
|------|----------|---------------|
| `hash-map` | HashMap-based lookup | `{ "nums": [...], "target": N }` |
| `linked-list` | Linked list traversal | `{ "list1": [...], "list2": [...] }` |
| `sliding-window` | Two-pointer sliding window | `{ "s": "string" }`, window indices |
| `binary-partition` | Binary search / partition | `{ "nums1": [...], "nums2": [...] }` |
| `expand-center` | Expand around center | `{ "s": "string" }` |
| `zigzag` | Row simulation | `{ "s": "string", "numRows": N }` |
| `digit-reversal` | Digit-by-digit processing | `{ "x": N }` |
| `two-pointer` | Two-pointer array traversal | `{ "height": [...] }` |
| `matrix` | Matrix transformation | `{ "matrix": [[...]] }` |
| `binary-search` | Binary search on range | `{ "x": N }` |
| `dp-table` | Dynamic programming table | `{ "n": N }` |

---

## Files Modified

- `site/data/difficulties.json`
- `site/data/complexities.json`
- `site/data/descriptions.json`
- `site/data/approaches.json`
- `site/data/insights.json`
- `site/data/tags.json`
- `site/data/visualizations.json`

## Files Generated

- `site/data/solutions-data.json` (via `generate-index.py`)
- `site/scripts/solutions-data.js` (via `generate-index.py`)
