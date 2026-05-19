#
# @lc app=leetcode id=6 lang=python3
#
# [6] Zigzag Conversion
#

# @lc code=start
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        if numRows == 1 or numRows >= len(s):
            return s

        rows = [''] * numRows
        cur = 0
        down = False

        for c in s:
            rows[cur] += c
            if cur == 0 or cur == numRows - 1:
                down = not down
            cur += 1 if down else -1

        return ''.join(rows)
# @lc code=end