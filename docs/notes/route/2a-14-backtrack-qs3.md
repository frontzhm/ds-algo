# 回溯算法实战练习（3）

## 前言

本篇专门整理**回溯算法**中最经典、面试最高频的 4 道实战题目，涵盖**括号删除、石子移动、工作分配、饼干分发**四大题型。

---

# 1. 301. 删除无效的括号

**题目链接**：[https://leetcode.cn/problems/remove-invalid-parentheses/](https://leetcode.cn/problems/remove-invalid-parentheses/)

## 题目描述

给你一个由若干括号和字母组成的字符串 `s`，删除最小数量的无效括号，使得输入的字符串有效。

返回所有可能的结果。答案可以按**任意顺序**返回。

## 示例

- 输入：`s = "()())()"`

- 输出：`["(())()","()()()"]`

- 输入：`s = ")("`

- 输出：`[""]`

## 解题思路

- 先算最少要删几个左、右括号
  - 遍历一遍字符串，用计数器算出：

  - delLeftCount：最终必须删掉的左括号数量

  - delRightCount：最终必须删掉的右括号数量

  - 这一步保证了：我们只删最少数量的括号，不会多删。

- DFS 枚举删 / 不删
  - 从左到右遍历每个字符

  - 如果当前是 ( 且还没删够：可以选择删掉它

  - 如果当前是 ) 且还没删够：可以选择删掉它

  - 任何情况都可以选择不删，直接拼接

  - 用 start 控制位置，标准回溯切割思路

- 终止条件
  - 遍历完整个字符串

  - 刚好删掉了应该删的左、右括号数量

  - 最终字符串括号合法

  - 满足以上三点才加入结果集

- 去重
  - 使用 Set 存储结果，自动去掉重复字符串

## 代码

```JavaScript

/**
 * 301. 删除无效的括号
 * 难度：困难
 * 解法：DFS 回溯 + 最小删除计数 + 合法性验证 + Set 去重
 * 思路：
 * 1. 先计算左括号的数量和右括号的数量，得出必须删除的左右括号数
 * 2. dfs(start, 已删左, 已删右, 当前串) 枚举删或不删
 * 3. 是可删括号且没删够：可以删
 * 4. 任何情况：可以不删
 * 5. 遍历结束后验证：删够数量 + 括号合法，才加入结果
 * 6. 使用 Set 自动去重
 */
var removeInvalidParentheses = function (s) {
  const n = s.length;
  let delLeftCount = 0;
  let delRightCount = 0;

  // 计算需要删除的左、右括号数量
  for (let char of s) {
    if (char === '(') delLeftCount++;
    if (char === ')') {
      if (delLeftCount > 0) {
        delLeftCount--;
      } else {
        delRightCount++;
      }
    }
  }

  // 本身合法，直接返回
  if (delLeftCount === 0 && delRightCount === 0) return [s];

  const res = new Set();
  dfs(0, 0, 0, '');
  return [...res];

  function dfs(start, deledLeft, deledRight, curStr) {
    // 终止条件：遍历完 + 删够数量 + 合法
    if (start === n) {
      if (deledLeft === delLeftCount && deledRight === delRightCount && isValid(curStr)) {
        res.add(curStr);
      }
      return;
    }

    const char = s[start];

    // 选择1：删除左括号
    if (char === '(' && deledLeft < delLeftCount) {
      dfs(start + 1, deledLeft + 1, deledRight, curStr);
    }

    // 选择2：删除右括号
    if (char === ')' && deledRight < delRightCount) {
      dfs(start + 1, deledLeft, deledRight + 1, curStr);
    }

    // 选择3：不删
    dfs(start + 1, deledLeft, deledRight, curStr + char);
  }

  // 验证括号是否有效
  function isValid(s) {
    const stack = [];
    for (let char of s) {
      if (char === '(') {
        stack.push('(');
      } else if (char === ')') {
        if (stack.length === 0) return false;
        stack.pop();
      }
    }
    return stack.length === 0;
  }
};
```

---

# 2. 2850. 将石头分散到网格图的最少移动次数

**题目链接**：[https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid/](https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid/)

## 题目描述

给你一个 3x3 的网格 `grid`，格子中的值代表石头数量。

每次可以移动一颗石头到相邻格子，求让所有格子都恰好为 1 的**最少总移动步数**。

## 示例

- 输入：`[[1,1,0],[1,1,1],[1,2,1]]`

- 输出：1

## 解题思路

- 先扫一遍网格，找出哪些石头要搬、哪些格子是空。

- 回溯枚举所有搬法：每颗石头都可以放到任意空位。

- 用曼哈顿距离算最少步数，找到总步数最小的方案。

## 代码

```JavaScript

/**
 * LeetCode 1769. 移动石子直到所有格子都为 1
 * 题目：3x3 的网格，有的格子石头数量 > 1（多了），有的 = 0（空了）
 * 每次可以移动一颗石头到相邻格子，一步算 1
 * 求让所有格子都变成 1 的【最少总移动步数】
 *
 * 解法：回溯 DFS + 曼哈顿距离
 * 核心思想：不模拟一步步移动，直接计算【每颗石头】到【每个空位】的最短距离
 *          回溯枚举所有分配方案，找到总距离最小的
 */
var minimumMoves = function (grid) {
  // 获取网格行列数（固定 3x3）
  const rows = grid.length;
  const cols = grid[0].length;

  // ======================================
  // 第一步：收集两个关键数组
  // ======================================

  // from：存放【需要往外搬石头】的位置
  // 重点：多几颗石头，就存几次！
  // 例：grid[i][j] = 3 → 多 2 颗 → push 2 次 [i,j]
  const from = [];

  // to：存放【空位置】，需要填入石头
  const to = [];

  // 遍历整个网格，收集数据
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 如果当前格子是空的（0），加入 to 列表
      if (grid[row][col] === 0) {
        to.push([row, col]);
      }

      // 如果当前格子石头 > 1，说明有多余石头要搬走
      while (grid[row][col] > 1) {
        // 把这个位置加入 from
        from.push([row, col]);
        // 拿走一颗石头，避免死循环，同时记录多出来的数量
        grid[row][col]--;
      }
    }
  }

  // ======================================
  // 第二步：回溯准备
  // ======================================

  // used 数组：标记 to 中的空位是否已经被分配了石头
  // 作用：避免多个石头搬到同一个空位
  let used = new Array(to.length).fill(false);

  // 记录最终答案：最小总步数
  let res = Infinity;

  // ======================================
  // 第三步：开始回溯
  // ======================================

  // dfs 参数说明：
  // start：当前正在处理 from 中的第几个石头
  // step：当前已经累计的移动总步数
  dfs(0, 0);

  // 遍历完所有方案，返回最小步数
  return res;

  // ====================
  // 回溯核心函数
  // ====================
  function dfs(start, step) {
    // 递归终止条件：
    // 所有要搬的石头（from）都已经分配完了
    if (start === from.length) {
      // 更新最小步数：把当前方案的总步数和历史最小值比较
      res = Math.min(res, step);
      return;
    }

    // 取出【当前要搬运】的这颗石头的出发点坐标
    const [row1, col1] = from[start];

    // 枚举所有空位，尝试把这颗石头放到【每一个空位】上
    for (let i = 0; i < to.length; i++) {
      // 如果这个空位已经被占用，跳过
      if (used[i]) continue;

      // 标记：这个空位已经被当前石头占用
      used[i] = true;

      // 取出目标空位的坐标
      let [row2, col2] = to[i];

      // ====================
      // 曼哈顿距离：
      // 从出发点到目标点，最少需要走几步
      // 公式：横向距离 + 纵向距离
      // ====================
      const distance = Math.abs(row2 - row1) + Math.abs(col2 - col1);

      // 递归处理下一颗石头
      // 石头编号 +1，总步数 + 当前距离
      dfs(start + 1, step + distance);

      // ====================
      // 回溯核心：撤销选择！
      // 把当前空位释放，让下一颗石头也可以选择这个位置
      // ====================
      used[i] = false;
    }
  }
};
```

---

# 3. 1723. 完成所有工作的最短时间

**题目链接**：[https://leetcode.cn/problems/find-minimum-time-to-finish-all-jobs/](https://leetcode.cn/problems/find-minimum-time-to-finish-all-jobs/)

## 题目描述

给定一个整数数组 `jobs` 和一个整数 `k`。

`jobs[i]` 是第 `i` 份工作的耗时。

将所有工作分配给 `k` 个工人，求**完成所有工作的最短时间**（即工人中最大耗时的最小值）。

## 示例

- 输入：jobs = [3,2,3], k = 3

- 输出：3

## 解题思路

- 大任务优先分配，快速触发剪枝

- 回溯枚举每一份工作分给哪个工人

- 记录当前最大耗时

- 剪枝：当前最大耗时 ≥ 已找到最优解，直接返回

- 剪枝：相同工作量工人跳过重复递归

## 代码

```JavaScript

/**
 * LeetCode 1723. 完成所有工作的最短时间
 * 题意：把 jobs 分给 k 个工人，求【完成所有工作的最短时间】（即工人最大时间的最小值）
 * 解法：回溯 DFS + 三大剪枝优化
 */
var minimumTimeRequired = function (jobs, k) {
  // 🔥 优化1：大任务优先分配！让剪枝立刻生效，从根源减少递归
  jobs.sort((a, b) => b - a);

  const n = jobs.length; // 工作总数
  let minRes = Infinity; // 最终答案：最小的「最大工作时间」
  const perTime = new Array(k).fill(0); // 记录每个工人当前的工作时间

  // 开始回溯：从第0个工作开始，当前最大时间为0
  dfs(0, 0);

  return minRes;

  // ====================
  // 回溯核心函数
  // start: 当前分配第几个工作
  // maxTime: 当前【所有工人中的最大时间】
  // ====================
  function dfs(start, maxTime) {
    // 终止条件：所有工作分配完毕
    if (start === n) {
      minRes = Math.min(maxTime, minRes);
      return;
    }

    // 🔥 优化2：剪枝！当前已比最优解差，直接放弃这条路径
    if (maxTime >= minRes) return;

    // 遍历所有工人，尝试把当前工作分配给他们
    for (let i = 0; i < k; i++) {
      // 🔥 优化3：重复状态剪枝！
      // 工人时间相同，分配给谁都一样，跳过重复递归
      if (i > 0 && perTime[i] === perTime[i - 1]) continue;

      // 选择：把当前工作给工人i
      perTime[i] += jobs[start];
      // 递归：分配下一个工作，更新最大时间
      dfs(start + 1, Math.max(perTime[i], maxTime));
      // 回溯：撤销选择
      perTime[i] -= jobs[start];
    }
  }
};
```

---

# 4. 2305. 公平分发饼干

**题目链接**：[https://leetcode.cn/problems/fair-distribution-of-cookies/](https://leetcode.cn/problems/fair-distribution-of-cookies/)

## 题目描述

给定一个数组 `cookies`，其中 `cookies[i]` 是第 `i` 包饼干的数量。

将所有饼干分给 `k` 个孩子，求**最小的最大值**（即拿到最多饼干的孩子，饼干数尽可能小）。

## 示例

- 输入：cookies = [8,15,10,20,8], k = 2

- 输出：31

## 解题思路

分配问题 = 回溯 + 大的优先 + 剪枝 + 跳过重复

与 1723 完成工作的最短时间**完全同模板**。

## 代码

```JavaScript

/**
 * LeetCode 2305. 公平分发饼干
 * 题意：把饼干数组 cookies 分给 k 个孩子
 * 每个孩子可以分多块
 * 让「拿到最多饼干的孩子」尽可能少
 * 返回：最小的最大值
 *
 * 解法：回溯 DFS + 三大优化
 * 模板和 1723 完全通用！
 */
var distributeCookies = function (cookies, k) {
  // 🔥 优化1：大饼干优先分配！快速剪枝（必须降序！）
  // 你写的 x-y 是升序，改成 y-x 更稳！
  cookies.sort((a, b) => b - a);

  const n = cookies.length; // 饼干总数
  let minRes = Infinity; // 答案：最小的最大饼干数
  const children = new Array(k).fill(0); // 每个孩子当前拥有的饼干

  dfs(0, 0); // 从第0块饼干开始，当前最大值为0

  return minRes;

  // ====================
  // 回溯核心
  // cId: 当前分配第几块饼干
  // maxCookie: 当前孩子中的最大值
  // ====================
  function dfs(cId, maxCookie) {
    // 终止：所有饼干分完了
    if (cId === n) {
      minRes = Math.min(minRes, maxCookie);
      return;
    }

    // 🔥 优化2：剪枝！当前已经比最优差，直接返回
    if (maxCookie >= minRes) return;

    // 尝试分给每一个孩子
    for (let i = 0; i < k; i++) {
      // 🔥 优化3：重复状态剪枝！
      // 两个孩子饼干一样多，分给谁结果一样，跳过重复
      if (i > 0 && children[i] === children[i - 1]) continue;

      // 分配
      children[i] += cookies[cId];
      // 递归
      dfs(cId + 1, Math.max(maxCookie, children[i]));
      // 回溯
      children[i] -= cookies[cId];
    }
  }
};
```

---

# 总结

这 4 道题覆盖了回溯算法**最核心的分配与枚举思想**：

- **括号删除**：枚举删/不删 + 合法性验证

- **石子移动**：曼哈顿距离 + 全排列分配

- **工作/饼干分配**：统一万能模板（排序+双剪枝）
