#
# @lc app=leetcode id=5 lang=python3
#
# [5] Longest Palindromic Substring
#

# @lc code=start
class Solution:
    def longestPalindrome(self, s: str) -> str:
        processed_s = "/" + "/".join(s) + "/"
        n = len(processed_s)

        p = [0] * n
        mid, r = 0, 0
        max_center, max_radius = 0, 0

        for i in range(n):
            if i < r:
                p[i] = min(p[2 * mid -i], r -i)
            else:
                p[i] = 1

            while (i - p[i] >= 0 and 
                i + p[i] < n and
                processed_s[i - p[i]] == processed_s[i + p[i]]):
                p[i] += 1

            if i + p[i] > r:
                mid = i
                r = i +p[i]
            
            if p[i] > max_radius:
                max_radius = p[i]
                max_center = i

        start = (max_center - max_radius + 1) // 2
        length = max_radius - 1

        return s[start : start + length]
# @lc code=end

