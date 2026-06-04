#
# @lc app=leetcode id=165 lang=python3
#
# [165] Compare Version Numbers
#

# @lc code=start
class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        parts_1 = version1.split(".")
        parts_2 = version2.split(".")

        n = max(len(parts_1), len(parts_2))
        for i in range(n):
            a = int(parts_1[i]) if i < len(parts_1) else 0
            b = int(parts_2[i]) if i < len(parts_2) else 0

            if a < b:
                return -1
            if a > b:
                return 1

        return 0


# @lc code=end
