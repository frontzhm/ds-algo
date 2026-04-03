跳跃游戏1

```js
var canJump = function (nums) {
  const n = nums.length;
  if (n <= 1) return true;
  let maxIndex = 0;
  const target = n - 1;
  for (let i = 0; i < n - 1; i++) {
    // 如果连当前i都到不了 那就肯定不行
    if (maxIndex < i) return false;
    maxIndex = Math.max(maxIndex, i + nums[i]);
    if (maxIndex >= target) {
      return true;
    }
  }

  return maxIndex >= target;
};
```

跳跃游戏2 ，最先想到的就是BFS

```js
/**
 * 跳跃游戏 II
 * 给定数组 nums，nums[i] 表示在 i 位置可以跳的最大步数
 * 求到达数组最后一个位置，最少需要跳几次
 * 解法：BFS 广度优先搜索（求最短路径 = 最少跳跃次数）
 */
var jump = function (nums) {
  const n = nums.length;
  // 如果数组只有一个数，已经在终点，不用跳
  if (n <= 1) return 0;

  let level = -1; // 记录跳跃次数（BFS 的层数）
  const queue = [0]; // BFS 队列，存储当前能到达的位置
  const seen = new Array(n).fill(false); // 记录位置是否访问过，避免重复跳
  seen[0] = true; // 起始位置 0 标记为已访问

  // BFS 核心循环
  while (queue.length) {
    level++; // 每进入一层，就代表跳了一次
    const levelSize = queue.length; // 当前层有多少个位置

    // 遍历当前层的所有位置
    for (let i = 0; i < levelSize; i++) {
      const curPos = queue.shift(); // 取出队首位置

      // 如果已经跳到最后一个位置 → 直接返回当前层数（跳跃次数）
      if (curPos === n - 1) {
        return level;
      }

      const curMax = nums[curPos]; // 当前位置最多能跳几步

      // 从 1 到 curMax，挨个尝试能跳到的新位置
      for (let j = 1; j <= curMax; j++) {
        const nextPos = curPos + j;

        // 如果超出数组范围 或 已经访问过 → 跳过
        if (nextPos >= n || seen[nextPos]) continue;

        // 没访问过 → 加入队列，并标记已访问
        queue.push(nextPos);
        seen[nextPos] = true;
      }
    }
  }

  return level;
};
```

但能更优化，基于跳跃游戏1

- 第一步，先看当前边界，比如从 0 出发能跳到 2，那 0～2 就是同一层。
- 在这一层里，我边走边看能摸到的最远点。
- 等我走到当前边界 2 时，就必须跳一次，
- 然后把新边界设成刚才摸到的最远点。 边界内的还是在同一层，所谓同一层就是同样的步数能到达地方
- 只要最远点能摸到终点，那现在的跳跃次数就是最小步数。

```js
var jump = function (nums) {
  const n = nums.length;
  if (n <= 1) return 0;
  // 什么时候再跳呢 其实是每次到达边界的时候 需要再跳
  let step = 0;
  // farthest每步能看到的最远距离
  let farthest = 0;
  // end是每一步的边界
  let end = 0;
  // 第一步，先看到边界，就是nums[0]，假设是2，那么走到1看下能看到的最远距离
  // 走到2看到的最远距离，注意走到2的时候到了边界了，边界内看下到达的最远距离，边界内的步骤是一致的，最远距离是下一步的边界。
  // 什么时候最远距离超过目标，那么表示当前边界内的步数就是最小步数
  const target = n - 1;
  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    // 到边界 就下一步，end设置为新的最远距离
    if (i === end) {
      step++;
      end = farthest;
    }

    if (farthest >= target) {
      return step;
    }
  }

  return step;
};
```
