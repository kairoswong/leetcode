#
# @lc app=leetcode id=4 lang=python3
#
# [4] Median of Two Sorted Arrays
#

# @lc code=start
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        def getKth(k):
            i = j = 0
            while True:
                if i == len(nums1): return nums2[j + k]
                if j == len(nums2): return nums1[i + k]
                if k == 0: return min(nums1[i], nums2[j])
                
                half = (k + 1) // 2
                ni = min(i + half, len(nums1))
                nj = min(j + half, len(nums2))
                
                if nums1[ni - 1] < nums2[nj - 1]:
                    k -= ni - i
                    i = ni
                else:
                    k -= nj - j
                    j = nj
        
        total = len(nums1) + len(nums2)
        if total % 2 == 1:
            return getKth(total // 2)
        else:
            return (getKth(total//2 - 1) + getKth(total//2)) / 2
# @lc code=end

