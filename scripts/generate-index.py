#!/usr/bin/env python3
"""
generate-index.py — Scan solutions/ and generate solutions-data.json.

This is the SINGLE SOURCE OF TRUTH for the LeetCode Solutions Explorer.
The JSON file is written to:
  - site/data/solutions-data.json  (single source for site/ deployment)

Usage:
    python scripts/generate-index.py          # regenerate solutions-data.json
"""

import os, re, json, sys

SOLUTIONS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'solutions')
SCRIPT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'site', 'data')
OUTPUT_FILE = os.path.join(DATA_DIR, 'solutions-data.json')

# Load metadata from external JSON files
def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'r') as f:
        return json.load(f)

DIFFICULTY_MAP = {int(k): v for k, v in load_json('difficulties.json').items()}
COMPLEXITY_MAP = {int(k): v for k, v in load_json('complexities.json').items()}
DESC_MAP = {int(k): v for k, v in load_json('descriptions.json').items()}
APPROACH_MAP = {int(k): v for k, v in load_json('approaches.json').items()}
INSIGHT_MAP = {int(k): v for k, v in load_json('insights.json').items()}
TAG_MAP = load_json('tags.json')
DEFAULT_TAGS = ['array', 'hash-map']

# Pattern: @lc app=leetcode id=NNNN lang=python3
# Then: # [NNNN] Problem Title
HEADER_RE = re.compile(r'# @lc app=leetcode id=(\d+).*?\n#\n# \[(\d+)\] (.+)')

def difficulty_for_id(n):
    return DIFFICULTY_MAP.get(n, 'medium')  # default to medium if unknown

# Detect if solution body has code (not just # @lc code=start ... # @lc code=end with empty body)
def is_solved(content):
    match = re.search(r'# @lc code=start\n(.+?)\n# @lc code=end', content, re.DOTALL)
    if not match:
        return False
    body = match.group(1).strip()
    lines = body.split('\n')
    # Must have at least 3 lines: class, def, and at least one body statement
    # A method ending with `:` with no statements below it is incomplete
    if len(lines) < 3:
        return False
    # Check that there's at least one line inside a method that isn't just the signature
    non_empty = [l for l in lines if l.strip() and not l.strip().startswith('#')]
    if len(non_empty) < 2:
        return False
    # Find function bodies: after a `def` line, the next non-empty non-comment line
    # should be a statement (body), not just the end of file
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('def ') and stripped.rstrip().endswith(':'):
            # Look at lines after this for actual body content
            body_lines = []
            for j in range(i+1, len(lines)):
                if lines[j].strip() and not lines[j].strip().startswith('#'):
                    body_lines.append(lines[j])
            # At least one indented line after def
            if not any(l.startswith((' ', '\t')) for l in body_lines):
                return False
    return True

# ---------- Complexity regex (optional) ----------
COMPLEXITY_RE = re.compile(r'# @complexity\s+(.*)')

def guess_tags(title):
    title_lower = title.lower()
    for key, tags in TAG_MAP.items():
        if key in title_lower:
            return tags
    return DEFAULT_TAGS

def scan_solutions():
    solutions = []
    for fname in sorted(os.listdir(SOLUTIONS_DIR), key=lambda f: int(f.split('.')[0]) if f.split('.')[0].isdigit() else 9999):
        if not fname.endswith('.py'):
            continue
        fpath = os.path.join(SOLUTIONS_DIR, fname)
        with open(fpath, 'r') as f:
            content = f.read()
        
        match = HEADER_RE.search(content)
        if not match:
            continue
        
        prob_id = int(match.group(1))
        title = match.group(3)
        solved = is_solved(content)
        difficulty = difficulty_for_id(prob_id)
        tags = guess_tags(title)
        complexity = COMPLEXITY_MAP.get(prob_id, {'time': '—', 'space': '—'})
        desc = DESC_MAP.get(prob_id, '—')
        
        solutions.append({
            'id': prob_id,
            'title': title,
            'file': fname,
            'difficulty': difficulty,
            'status': 'solved' if solved else 'incomplete',
            'complexity': complexity,
            'desc': desc,
            'approach': APPROACH_MAP.get(prob_id, ''),
            'keyInsight': INSIGHT_MAP.get(prob_id, ''),
            'tags': tags,
        })
    
    return solutions

def write_json(solutions, output_path):
    """Write solutions data to site/data/solutions-data.json."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(solutions, f, indent=2)
    print(f"✅ Wrote {len(solutions)} solutions to {output_path}")

if __name__ == '__main__':
    solutions = scan_solutions()
    if len(sys.argv) > 1 and sys.argv[1] == '--json':
        print(json.dumps(solutions, indent=2))
    else:
        write_json(solutions, OUTPUT_FILE)
