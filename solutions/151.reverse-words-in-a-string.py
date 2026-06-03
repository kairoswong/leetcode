#
# @lc app=leetcode id=151 lang=python3
#
# [151] Reverse Words in a String
#

# @lc code=start
class Solution:
    def reverseWords(self, s: str) -> str:
        # words = s.split()
        # return " ".join(reversed(words))
        words = []
        i = 0
        n = len(s)

        while i < n:
            while i < n and s[i] == ' ':
                i += 1
            if i >= n:
                break

            j = i
            while j < n and s[j] != ' ':
                j += 1

            words.append(s[i:j])
            i = j

        return " ".join(reversed(words))

# @lc code=end

