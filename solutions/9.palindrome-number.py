#
# @lc app=leetcode id=9 lang=python3
#
# [9] Palindrome Number
#

# @lc code=start
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < -2 ** 31 or x > 2 ** 31 - 1:
            return False
        
        s = str(x)
        return s == s[::-1]

# @lc code=end

