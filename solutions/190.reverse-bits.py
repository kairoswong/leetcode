#
# @lc app=leetcode id=190 lang=python3
#
# [190] Reverse Bits
#

# @lc code=start
class Solution:
    def reverseBits(self, n: int) -> int:
        reverse = 0

        for i in range(32):
            reverse <<= 1
            reverse |= n & 1
            n >>= 1

        return reverse


# @lc code=end
