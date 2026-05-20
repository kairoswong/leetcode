#
# @lc app=leetcode id=7 lang=python3
#
# [7] Reverse Integer
#

# @lc code=start
class Solution:
    def reverse(self, x: int) -> int:
        INT_MIN, INT_MAX = -2**31, 2**31 - 1

        sign = 1 if x >= 0 else -1
        x = abs(x)
        reversed_x = 0

        while x > 0:
            digit = x % 10
            reversed_x = reversed_x * 10 + digit
            x //= 10

        result = sign * reversed_x

        if result < INT_MIN or result > INT_MAX:
            return 0

        return result
# @lc code=end

