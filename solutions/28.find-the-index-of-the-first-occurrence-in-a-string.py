#
# @lc app=leetcode id=28 lang=python3
#
# [28] Find the Index of the First Occurrence in a String
#

# @lc code=start
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        length = len(needle)
        kmp = [0] * length
        for i in range(1, length):
            j = kmp[i - 1]
            while j > 0 and needle[i] != needle[j]:
                j = kmp[j - 1]
            if needle[i] == needle[j]:
                j += 1
            kmp[i] = j

        j = 0
        for i in range(len(haystack)):
            while j > 0 and haystack[i] != needle[j]:
                j = kmp[j - 1]
            if haystack[i] == needle[j]:
                j += 1
            if j == length:
                return i - length + 1
        return -1

# @lc code=end

