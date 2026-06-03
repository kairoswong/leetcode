#
# @lc app=leetcode id=149 lang=python3
#
# [149] Max Points on a Line
#

# @lc code=start
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        def gcd(a: int, b: int) -> int:
            while b:
                a, b = b, a % b
            return abs(a)

        if len(points) < 3:
            return len(points)

        max_points = 1

        for i in range(len(points)):
            slopes = {}
            same = 1
            x1, y1 = points[i]

            for j in range(i + 1, len(points)):
                x2, y2 = points[j]
                dx = x2 - x1
                dy = y2 - y1

                if dx == 0 and dy == 0:
                    same += 1
                    continue

                if dx == 0:
                    slope = "inf"
                else:
                    g = gcd(abs(dx), abs(dy))
                    dx //= g
                    dy //= g
                    if dx < 0:
                        dx, dy = -dx, -dy
                    slope = (dx, dy)

                slopes[slope] = slopes.get(slope, 0) + 1

            max_points = max(max_points, same + max(slopes.values(), default=0))

        return max_points
# @lc code=end

