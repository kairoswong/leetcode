#
# @lc app=leetcode id=8 lang=python3
#
# [8] String to Integer (atoi)
#

# @lc code=start
class Solution:
    def myAtoi(self, s: str) -> int:
        INT_MIN, INT_MAX = -2**31, 2**31 - 1
        i, n = 0, len(s)

        while i < n and s[i] == ' ':
            i += 1

        if i >= n:
            return 0

        sign = 1
        if s[i] in '+-':
            sign = -1 if s[i] == '-' else 1
            i += 1

        result = 0
        while i < n and s[i].isdigit():
            digit = int(s[i])
            if result > (INT_MAX - digit) // 10:
                return INT_MAX if sign == 1 else INT_MIN
            result = result * 10 + digit
            i += 1

        return sign * result

# @lc code=end

