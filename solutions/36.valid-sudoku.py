#
# @lc app=leetcode id=36 lang=python3
#
# [36] Valid Sudoku
#

# @lc code=start
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        seen = set()

        for row in range(9):
            for col in range(9):
                num = board[row][col]
                if num == '.':
                    continue

                row_key = f"({num}) in row {row}"
                col_key = f"({num}) in column {col}"
                box_key = f"({num}) in box {(row // 3) * 3 + (col // 3)}"

                if row_key in seen or col_key in seen or box_key in seen:
                    return False

                seen.add(row_key)
                seen.add(col_key)
                seen.add(box_key)

        return True
# @lc code=end

