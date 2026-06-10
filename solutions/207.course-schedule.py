#
# @lc app=leetcode id=207 lang=python3
#
# [207] Course Schedule
#

# @lc code=start
class Solution:
    def canFinish(self, n: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(n)]
        indegree = [0] * n
        
        for course, prereq in prerequisites:
            graph[prereq].append(course)
            indegree[course] += 1
            
        q = deque([i for i in range(n) if indegree[i] == 0])
        
        while q:
            cur = q.popleft()
            n -= 1
            for nei in graph[cur]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)
                    
        return n == 0
# @lc code=end

