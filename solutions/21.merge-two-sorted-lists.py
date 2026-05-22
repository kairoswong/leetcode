#
# @lc app=leetcode id=21 lang=python3
#
# [21] Merge Two Sorted Lists
#

# @lc code=start
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    # def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    #     dummy = ListNode()
    #     current = dummy
        
    #     while list1 and list2:
    #         if list1.val < list2.val:
    #             current.next = list1
    #             list1 = list1.next
    #         else:
    #             current.next = list2
    #             list2 = list2.next
    #         current = current.next
        
    #     current.next = list1 or list2
        
    #     return dummy.next

    # Alternative recursive solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        if not list1:
            return list2
        if not list2:
            return list1
        
        if list1.val < list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2
# @lc code=end

