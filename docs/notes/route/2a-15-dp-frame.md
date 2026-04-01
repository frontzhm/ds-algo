# 动态规划框架

从斐波拉契入手。

动态规划我之前跟学的是表格法，但是东神是从暴力穷举的递归思维开始，递归的时候有很多重复计算，然后用备忘录优化，优化的时候发现，既然能自顶向下，也能自底向上，然后就把递归改成迭代。

而迭代形式上最容易理解的就是表格法，所以表格只是表象。再从过程仔细看，如果只用到部分备忘录的话，那么继续优化空间，很多时候能到O(1)。

动态规划的本质还是穷举，一般就是求最值。列出正确的「状态转移方程」，才能正确地穷举。判断算法问题是否具备「最优子结构」，

明确「状态」-> 明确「选择」 -> 定义 dp 数组/函数的含义。

## 斐波拉契的递归

```js
function fib(n) {
  if (n === 1 || n === 0) return 0;
  return fib(n - 1) + fib(n - 2);
}
```

用下东神的例子：

![1.jpg](https://labuladong.online/images/algo/dynamic-programming/1.jpg)

就是在心里想象一颗多叉树，最顶端是n，然后左边是n-1， 右边是n-2，然后先左边，一直往左边直到 2 拆成 0 1，0 1返回结果，然后2就能知道结果，巴拉巴拉在往上。

因为这里是二叉树，这样计算复杂度是2的n次方，指数级。

这里有很多重复计算，比如多次计算2，为了优化，带上备忘录

## 斐波拉契的带备忘录递归

```js
function fib(n) {
  // memo[i] 表示fib i的值
  const memo = new Array(n + 1).fill(-1);
  memo[1] = 1;
  memo[0] = 0;
  return f(n);

  function f(n) {
    // 有值就返回
    if (memo[n] !== -1) return memo[n];
    // 没值就去算，算好再填充
    memo[n] = f(n - 1) + f(n - 2);
    return memo[n];
  }
}
```

其实差不多，就是多了个缓存环节。

这样树就疯狂剪枝了，计算复杂度降成O(n)了。

这其实就已经是动态规划了，也就是暴力穷举+剪枝，这里的暴力穷举是DFS。

其实看到虽然面上自顶向下，但是每次到底部才能计算，然后往上走。

所以另一种就直接从底部往上迭代。

## 斐波拉契的自底向上for迭代

```js
function fib(n) {
  // memo[i] 表示fib i的值
  const memo = new Array(n + 1).fill(-1);
  memo[1] = 1;
  memo[0] = 0;

  for (let i = 2; i <= n; i++) {
    memo[i] = memo[i - 1] + memo[i - 2];
  }
  return memo[n];

```

这里的memo，一般习惯写作dp数组。 仔细看只用到两个值，所以还能空间优化。

```js
function fib(n) {
  // 分别代表 dp[i - 1] 和 dp[i - 2]
  let dp_i_1 = 1;
  let dp_i_2 = 0;
  for (let i = 2; i <= n; i++) {
    // dp[i] = dp[i - 1] + dp[i - 2];
    let dp_i = dp_i_1 + dp_i_2;
    // 滚动更新
    dp_i_2 = dp_i_1;
    dp_i_1 = dp_i;
  }
  return dp_i_1;
}
```

## 实践凑零钱

给你 k 种面值的硬币，面值分别为 c1, c2 ... ck，每种硬币的数量无限，再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1 。

比如说 k = 3，面值分别为 1，2，5，总金额 amount = 11。那么最少需要 3 枚硬币凑出，即 11 = 5 + 5 + 1。

先用递归思维，11在顶部，1+10 2+9 5+6，所以可以继续分解成三路。 10 9 6，然后继续在分解。0元的时候是0个硬币，负数过，那么1元就是1个硬币，在往上走。

然后自底向上迭代。

```js
const coinChange = function (coins, amount) {
  // 边界情况：金额为负数，无法凑成
  if (amount < 0) return -1;
  // 边界情况：金额为0，不需要任何硬币
  if (amount === 0) return 0;

  // dp[i] 表示：凑成总金额 i 所需要的**最少硬币个数**
  // 初始化为无穷大 Infinity，表示当前金额暂时无法凑成
  const dp = new Array(amount + 1).fill(Infinity);
  //  base case：凑成金额 0，需要 0 个硬币
  dp[0] = 0;

  // 遍历 1 ~ amount 所有金额，从小到大计算最小硬币数
  for (let i = 1; i <= amount; i++) {
    // 遍历每一种硬币，尝试用当前硬币凑金额 i
    for (const coin of coins) {
      // 只有硬币面值 <= 当前金额时，才能使用
      if (i >= coin) {
        // 状态转移方程：
        // 不选当前硬币 → 保持 dp[i] 不变
        // 选当前硬币 → dp[i - coin] + 1（在 i - coin 的基础上加 1 个当前硬币）
        // 取两者最小值，就是当前金额的最小硬币数
        dp[i] = Math.min(dp[i - coin] + 1, dp[i]);
      }
    }
  }

  // 最终：如果 dp[amount] 还是无穷大 → 无法凑成，返回 -1
  // 否则返回最少硬币数 dp[amount]
  return dp[amount] === Infinity ? -1 : dp[amount];
};
```

那么，既然知道了这是个动态规划问题，就要思考如何列出正确的状态转移方程？

1、确定「状态」，也就是原问题和子问题中会变化的变量。由于硬币数量无限，硬币的面额也是题目给定的，只有目标金额会不断地向 base case 靠近，所以唯一的「状态」就是目标金额 amount。

2、确定「选择」，也就是导致「状态」产生变化的行为。目标金额为什么变化呢，因为你在选择硬币，你每选择一枚硬币，就相当于减少了目标金额。所以说所有硬币的面值，就是你的「选择」。

3、明确 dp 函数/数组的定义。我们这里讲的是自顶向下的解法，所以会有一个递归的 dp 函数，一般来说函数的参数就是状态转移中会变化的量，也就是上面说到的「状态」；函数的返回值就是题目要求我们计算的量。就本题来说，状态只有一个，即「目标金额」，题目要求我们计算凑出目标金额所需的最少硬币数量。

所以我们可以这样定义 dp 函数：dp(n) 表示，输入一个目标金额 n，返回凑出目标金额 n 所需的最少硬币数量。

## 寻找正确的状态转移方程

动态规划的难点本来就在于寻找正确的状态转移方程，本文就借助经典的「最长递增子序列问题」来讲一讲设计动态规划的通用技巧：数学归纳思想。

最长递增子序列（Longest Increasing Subsequence，简写 LIS）是非常经典的一个算法问题，比较容易想到的是动态规划解法，时间复杂度 O(N^2)，我们借这个问题来由浅入深讲解如何找状态转移方程，如何写出动态规划解法。比较难想到的是利用二分查找，时间复杂度是 O(NlogN)，我们通过一种简单的纸牌游戏来辅助理解这种巧妙的解法。

最开始，想的是数组，但发现不用存数组，所以存长度就可以

```js
var lengthOfLIS = function (nums) {
  // 边界处理：空数组最长递增子序列长度为 0
  if (nums.length === 0) return 0;

  // dp[i] 定义：以 nums[i] 结尾的最长递增子序列的【长度】
  // 初始化：每个元素自身就是一个长度为 1 的子序列
  const dp = new Array(nums.length).fill(1);

  // 记录全局最长长度，初始值为 1
  let maxLength = 1;

  // 从第二个元素开始遍历（i 从 1 开始）
  for (let i = 1; i < nums.length; i++) {
    const curNum = nums[i]; // 当前要处理的数字

    // 遍历 i 之前所有数字 j
    for (let j = 0; j < i; j++) {
      // 如果当前数字 > 前面数字，可以形成递增子序列
      // 并且 dp[j] + 1 比当前 dp[i] 更大，就更新
      if (curNum > nums[j] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1; // 更新以 i 结尾的最长长度
        maxLength = Math.max(maxLength, dp[i]); // 更新全局最大值
      }
    }
  }

  // 返回最长递增子序列长度
  return maxLength;
};
```

信封的问题，就会有超时的情况

```js
var maxEnvelopes = function (envelopes) {
  const n = envelopes.length;
  if (n === 0) return 0;
  envelopes.sort((x, y) => {
    if (x[0] !== y[0]) {
      return x[0] - y[0];
    }
    return y[1] - x[1];
  });
  let max = 1;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    const [cw, ch] = envelopes[i];
    for (let j = 0; j < i; j++) {
      const [pw, ph] = envelopes[j];
      // 如果当前信封更大，加上当前信封长度更大 那么更换
      if (ch > ph) {
        dp[i] = Math.max(dp[j] + 1, dp[i]);
      }
    }
    max = Math.max(max, dp[i]);
  }
  return max;
};
```

需要二分查找+贪心

```js
var maxEnvelopes = function (envelopes) {
  const n = envelopes.length;
  if (n === 0) return 0;

  // 排序：宽度升序，同宽度高度降序
  envelopes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return b[1] - a[1];
  });

  // 只抽高度，求高度的最长严格递增子序列长度
  const heights = envelopes.map(e => e[1]);

  // 贪心 + 二分求 LIS O(n log n)
  const tails = [];
  for (const h of heights) {
    let l = 0,
      r = tails.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (tails[mid] < h) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    if (l === tails.length) {
      tails.push(h);
    } else {
      tails[l] = h;
    }
  }

  return tails.length;
};
```

下降路径最小和

```js
var minFallingPathSum = function (grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // dp 数组：存储当前行的最小下落路径和
  const dp = [...grid[0]]; // 初始化：第一行就是自身值

  // 从第二行开始遍历
  for (let row = 1; row < rows; row++) {
    // 关键：保存上一行的结果，防止被覆盖
    const prevDp = [...dp];

    // 计算当前行每个位置的最小路径
    for (let col = 0; col < cols; col++) {
      dp[col] =
        grid[row][col] +
        Math.min(
          prevDp[col], // 正上方
          col > 0 ? prevDp[col - 1] : Infinity, // 左上方
          col < cols - 1 ? prevDp[col + 1] : Infinity // 右上方
        );
    }
  }

  // 最后一行的最小值就是答案
  return Math.min(...dp);
};
```

子序列

```js
var numDistinct = function (s, t) {
  // s：源字符串
  // t：目标字符串，求 s 中有多少个不同的子序列等于 t
  const sr = s.length; // s 的长度
  const tc = t.length; // t 的长度
  if (sr < tc) return 0;

  // ---------------- 核心定义 ----------------
  // dp[i][j]：表示 s[0...i] 中，出现 t[0...j] 的子序列数量
  // 初始化全部为 0
  const dp = Array.from({ length: sr }, () => new Array(tc).fill(0));

  // ---------------- 初始化第一行 ----------------
  // 第一行：s 只有第一个字符 s[0]
  // 只有 s[0] == t[0] 时，能构成 1 个，否则 0
  dp[0][0] = s[0] === t[0] ? 1 : 0;
  // 第一行其他位置： s 只有 1 个字符，不可能匹配长度 >1 的 t，所以全部是 0，初始值就是0，所以不再重复填充

  // ---------------- 初始化第一列 ----------------
  // 第一列：j=0，表示匹配 t 的第一个字符 t[0]
  // 每往下一行（i 增大）：
  // 如果 s[i] == t[0]，则数量 +1
  // 否则继承上一行的数量
  for (let i = 1; i < sr; i++) {
    dp[i][0] = dp[i - 1][0] + (s[i] === t[0] ? 1 : 0);
  }

  // ---------------- 开始填充 DP 表 ----------------
  // 遍历 s 的每个字符（从第 2 个开始）
  for (let i = 1; i < sr; i++) {
    // 遍历 t 的每个字符（从第 2 个开始）
    for (let j = 1; j < tc; j++) {
      const curS = s[i]; // 当前 s 字符
      const curT = t[j]; // 当前 t 字符

      // ---------------- 情况1：字符不相等 ----------------
      // s[i] 不能用来匹配 t[j]
      // 所以 dp[i][j] = 不使用 s[i] 时的数量，即 dp[i-1][j]
      if (curS !== curT) {
        dp[i][j] = dp[i - 1][j];
        continue;
      }

      // ---------------- 情况2：字符相等 ----------------
      // 此时有两种选择：
      // 1. 不用 s[i]：方案数 = dp[i-1][j]
      // 2. 用 s[i]：方案数 = dp[i-1][j-1]（前面匹配好 t[0..j-1]，现在加上当前字符）
      // 总方案数 = 两种情况相加
      dp[i][j] = dp[i - 1][j] + dp[i - 1][j - 1];
    }
  }

  // 答案：s 全部字符 匹配 t 全部字符 的子序列数量
  return dp[sr - 1][tc - 1];
};
```

可以压缩下，这里注意因为公式是 `dp[i][j] = dp[i - 1][j] + dp[i - 1][j - 1]`，用到前一位的值，所以我们压缩的话从倒序，这样就能避免覆盖的情况。

```js
var numDistinct = function (s, t) {
  // 求字符串 s 中包含多少个 不同的子序列 等于 t
  const sr = s.length;
  const tc = t.length;

  // 边界：s 比 t 短，不可能匹配，直接返回 0
  if (sr < tc) return 0;

  // 一维 DP 数组定义
  // dp[j] = s[0..i] 中能匹配 t[0..j] 的子序列数量
  const dp = new Array(tc).fill(0);

  // 初始化：处理 s 的第一个字符，匹配 t 的第一个字符
  dp[0] = s[0] === t[0] ? 1 : 0;

  // 遍历 s 中剩余所有字符（从第二个字符开始）
  for (let i = 1; i < sr; i++) {
    const curS = s[i];
    // 一维 DP 必须倒序遍历，防止覆盖上一轮的结果
    for (let j = tc - 1; j >= 0; j--) {
      const curT = t[j];

      // 字符不相等：无法用当前 s 字符匹配，直接跳过
      if (curS !== curT) continue;

      // 字符相等：两种情况累加
      // 1. 不用当前字符：保持 dp[j] 不变
      // 2. 用当前字符：j=0 则新增1种；否则继承 dp[j-1]
      dp[j] += j === 0 ? 1 : dp[j - 1];
    }
  }

  // 最终结果：s 匹配完整 t 的数量
  return dp[tc - 1];
};
```

品字符串

```js
var wordBreak = function (s, wordDict) {
  // 把单词表转成 Set，提高查找速度
  const wordSet = new Set(wordDict);

  // 边界：如果整个字符串本身就是一个单词，直接返回 true
  if (wordSet.has(s)) return true;

  const n = s.length;
  // dp[i] 定义：
  // 表示字符串 s 中，从下标 0 到 i 的这一段（前 i+1 个字符）能否被拆分成字典中的单词
  const dp = new Array(n).fill(false);

  // 初始化：第一个字符能否单独构成单词
  dp[0] = wordSet.has(s[0]);

  // 从第二个字符开始，逐个位置判断是否能拼接成功
  for (let i = 1; i < n; i++) {
    // 情况 1：从字符串开头到当前位置 i，整体就是一个单词
    if (wordSet.has(s.slice(0, i + 1))) {
      dp[i] = true;
      // 已经确定能拼成，无需再判断其他情况
      continue;
    }

    // 情况 2：在 0 ~ i-1 中找一个分割点 j
    // 如果 s[0~j] 能拼成（dp[j] = true）
    // 并且 s[j+1 ~ i] 也是一个单词
    // 那么 s[0~i] 就能拼成
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j + 1, i + 1))) {
        dp[i] = true;
        break;
      }
    }
  }

  // 最终结果：整个字符串 s[0 ~ n-1] 能否被拼接
  return dp[n - 1];
};
```

方案

```js
var wordBreak = function (s, wordDict) {
  // 把单词列表转为 Set 结构，方便快速判断某个字符串是否是单词
  const wordSet = new Set(wordDict);

  // 字符串 s 的长度
  const n = s.length;

  // ==================== DP 数组定义 ====================
  // dp[i] 是一个数组
  // 作用：存储 s[0 ... i] 所有【能拼接成功的句子】
  // 比如 dp[3] = ["leet"] 表示从 0~3 可以拼成单词 "leet"
  const dp = new Array(n).fill(0).map(() => []);

  // ==================== 初始化 ====================
  // 判断第一个字符 s[0] 是不是单词
  // 如果是，dp[0] = [s[0]]；否则是空数组
  dp[0] = wordSet.has(s[0]) ? [s[0]] : [];

  // ==================== 遍历字符串每个位置 i ====================
  for (let i = 1; i < n; i++) {
    // 截取 s 从 0 到 i 的整个子串
    const cur = s.slice(0, i + 1);

    // ==================== 情况 1 ====================
    // 如果 0~i 整个子串本身就是一个单词
    // 直接把这个单词作为一种方案存入 dp[i]
    if (wordSet.has(cur)) {
      dp[i].push(cur);
    }

    // ==================== 情况 2 ====================
    // 枚举所有可能的分割位置 j（0 ≤ j < i）
    for (let j = 0; j < i; j++) {
      // 截取 s 从 j+1 到 i 的子串，判断是不是单词
      const c = s.slice(j + 1, i + 1);

      // 关键条件：
      // 1. dp[j] 不为空 → 0~j 可以成功拼接
      // 2. s[j+1 ~ i] 是一个单词
      if (dp[j].length > 0 && wordSet.has(c)) {
        // 遍历 dp[j] 里所有拼接好的句子
        // 在每个句子后面 + 当前单词，生成新的句子
        for (let prev of dp[j]) {
          dp[i].push(prev + ' ' + c);
        }
      }
    }
  }

  // ==================== 返回结果 ====================
  // dp[n-1] 存储了 s[0 ... n-1] 所有可能的拼接方案
  return dp[n - 1];
};
```

编辑距离

```js
var minDistance = function (word1, word2) {
  // 两个字符串一般是是二维表格法，画个表格就很清楚了
  const rows = word1.length;
  const cols = word2.length;
  // word1的前i个字符 转成 word2的前j个字符 的最少操作次数
  // 注意i j 和索引的关系
  const dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(Infinity));
  // 先填第一行，也就是word1的’‘ 转成 word2的步骤,就是插入的次数
  for (let i = 0; i <= cols; i++) {
    dp[0][i] = i;
  }
  // 再填第一列，也就是 word1从空串到整个字符串 变成空串的步骤，也就是删除的次数
  for (let i = 1; i <= rows; i++) {
    dp[i][0] = i;
  }
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const curS = word1[i - 1];
      const curT = word2[j - 1];
      // 如果当前字符一样，那么就不需要操作，操作数就是word1的前i-1个字符已经变换到word2的前j-1个字符的次数
      if (curS === curT) {
        dp[i][j] = dp[i - 1][j - 1];
        continue;
      }
      // 重点是不相等的话，有三种操作：
      // dp[i-1][j-1] (表示替换)：word1的前i-1个字符已经变换到word2的前j-1个字符的次数，说明word1的前i-1个和word2的前j-1个字符已经完成操作；那么对于word1的第i个怎么变成word2的第j个呢？这两个字符都存在，那么只能是替换了；所以dp[i][j] = dp[i-1][j-1]+1;

      // dp[i][j-1] (表示插入)：word1的前i个字符已经变换到word2的前j-1个字符的次数，当前word1的第i步字符已经用了，但是word2还差一个字符（因为当前只是处理了word2的前j-1个字符），那么插入一个字符就好了；所以dp[i][j] = dp[i][j-1]+1;

      // dp[i-1][j] (表示删除)：word1的前i-1个字符已经变换到word2的前j个字符的次数，当前word1仅用了前i-1个字符就完成了到word2的前j个字符的操作，所以word1的第i个字符其实没啥用了，那么删除操作就好了；所以dp[i][j] = dp[i-1][j]+1;

      dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
    }
  }
  return dp[rows][cols];
};
```

压成一维数组的空间，理论上能常数，但那样不好理解

```js
var minDistance = function (word1, word2) {
  const m = word1.length;
  const n = word2.length;

  // --------------------- 核心定义 ---------------------
  // 【一维优化版 DP】
  // dp[j] 代表：原来二维的 dp[i][j]
  // 含义：word1 的前 i 个字符 → 变成 word2 的前 j 个字符，最少需要几步操作

  // 为什么用 cols+1？因为 j 从 0 ~ n（前0个字符是空串）
  const dp = new Array(n + 1).fill(Infinity);

  // --------------------- 初始化：第一行 ---------------------
  // 二维中第一行：word1 是空串 → 变成 word2 前 j 个字符
  // 只能一直插入，操作次数 = j
  for (let j = 0; j <= n; j++) {
    dp[j] = j;
  }

  // --------------------- 开始递推 ---------------------
  // 遍历 word1 的每个字符（i 从 1 到 m）
  for (let i = 1; i <= m; i++) {
    // 关键！保存上一行的完整数据（二维中的上一行 dp[i-1][...]）
    const prev = [...dp];

    // 遍历 word2 的每个字符（j 从 0 到 n）
    for (let j = 0; j <= n; j++) {
      // --------------------- 初始化：第一列 ---------------------
      // 二维中第一列：word1 前 i 个字符 → 变成空串
      // 只能一直删除，操作次数 = i
      if (j === 0) {
        dp[0] = i;
        continue;
      }

      // 字符对应：因为 dp[i][j] 对应前 i/j 个，字符串下标要 -1
      const c1 = word1[i - 1];
      const c2 = word2[j - 1];

      // --------------------- 情况1：字符相等 ---------------------
      // 不用任何操作！直接继承 左上角 的值
      if (c1 === c2) {
        dp[j] = prev[j - 1];
        continue;
      }

      // --------------------- 情况2：字符不相等 ---------------------
      // 三种操作取最小，都要 +1
      // 1. prev[j-1]   → 替换（左上角）
      // 2. dp[j-1]     → 插入（左边，当前行已更新）
      // 3. prev[j]     → 删除（上边，上一行值）
      dp[j] = 1 + Math.min(prev[j - 1], dp[j - 1], prev[j]);
    }
  }

  // 答案：word1 全部 → word2 全部 的最少操作数
  return dp[n];
};
```

最大子数组和

```js
var maxSubArray = function (nums) {
  const n = nums.length;
  // dp[i] 表示包含nums[i]的子数组和的最大值
  // dp[i] = 以 nums[i] 结尾的 最大子数组和
  // 重点：必须包含当前数字 nums[i]
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];
  let max = dp[0];

  for (let i = 1; i < n; i++) {
    dp[i] = dp[i - 1] <= 0 ? nums[i] : nums[i] + dp[i - 1];
    max = Math.max(max, dp[i]);
  }
  return max;
};
```

优化

```js
var maxSubArray = function (nums) {
  const n = nums.length;

  // ==================== 核心优化 ====================
  // 不用 dp 数组了！因为 dp[i] 只依赖 dp[i-1]
  // dp[i]   = 以 nums[i] 结尾的最大子数组和
  // dp_i_1  = dp[i-1]，即 上一个位置的最大值

  // 初始化：dp[0] = 第一个元素
  let dp_i_1 = nums[0];
  // 记录全局最大和
  let max = dp_i_1;

  // 从第二个数开始遍历
  for (let i = 1; i < n; i++) {
    // ==================== 状态转移 ====================
    // 如果前面的和是负数 → 加上会变小，所以直接从当前数重新开始
    // 如果前面的和是正数 → 加上当前数，变得更大
    const dp_i = dp_i_1 <= 0 ? nums[i] : nums[i] + dp_i_1;

    // 更新全局最大值
    max = Math.max(max, dp_i);

    // 滚动更新：把当前值赋给上一个，给下一次循环用
    dp_i_1 = dp_i;
  }

  return max;
};
```

## Kadane 算法

专门解决：最大子数组和，时间 O(n)，空间最优 O(1)。

1. 核心思想一句话。只关心 “以当前数结尾” 的最大子数组和，前面的和是正数 → 带上前面，一起算前面的和是负数 → 扔掉前面，从自己重新开始全程走一遍，顺便记录最大值。

2. 标准模板（最精简 Kadane）

```js
var maxSubArray = function (nums) {
  let maxSum = nums[0];
  let curSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // 核心一句：要么重新开始，要么继续累加
    curSum = Math.max(nums[i], curSum + nums[i]);
    maxSum = Math.max(maxSum, curSum);
  }

  return maxSum;
};
```

对于每一个位置，我们只保留 “以它结尾的最优选择”，任何非最优的前缀，都不可能参与后续的最优解。任何负和的前缀，都不可能成为 “最优子数组” 的前缀。直接丢弃，不会丢失最优解。最大子数组 = 一段 “前缀和永远为正” 的区间

- **最大子数组必然以某个 nums [i] 结尾**
- 对每个 i，我们都算出了 以 i 结尾的最大可能和
- 最后取全局最大，就是答案

这种思路在 DP 里超级常见：

```shell
最长递增子序列
→ 以第 i 个元素结尾的最长递增子序列
最大子数组乘积
→ 以第 i 个元素结尾的最大 / 最小乘积
最长有效括号
→ 以第 i 位结尾的最长有效括号长度
打家劫舍
→ 抢 / 不抢第 i 间的最大值
全部都是：
固定结尾，只往前看一步，局部最优推全局最优
```

为什么这个思路这么 “神”？因为它解决了 DP 里最难的问题：怎么定义状态，才能无后效、不漏解？你原来可能会想：dp [i] = 前 i 个数的最大子数组和这样定义就麻烦了，因为不知道最后一个数选没选，转移很难写。

但一旦换成：dp [i] = 以 nums [i] 结尾的最大和一切瞬间清晰：要么接着前面的子数组,要么从自己重新开始.没有第三种可能。

## 子序列的套路

1143

```js
var longestCommonSubsequence = function (text1, text2) {
  const rows = text1.length;
  const cols = text2.length;
  // dp[i][j]表示text1的前i个字符串和text2的前j个字符串的公共子序列长度
  // 注意索引！
  const dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  // 第一行 有一个是空串 肯定是0   第一列 有一个是空串 肯定是0 初始化就是0 所以不用额外赋值
  for (let i = 1; i <= rows; i++) {
    const cur1 = text1[i - 1];
    for (let j = 1; j <= cols; j++) {
      const cur2 = text2[j - 1];
      // cur1 === cur2 直观理解： 这两个字符，一定可以作为公共子序列的最后一位！前面的最长公共部分是 dp[i-1][j-1] 现在多了一个匹配的 A → 长度 +1
      // cur1 !== cur2 直观理解： 这两个字符，不能同时加入公共子序列。
      // 扔掉 text1 的最后一个字符
      // 扔掉 text2 的最后一个字符
      // 对应 DP 里的两个来源：
      // dp[i-1][j] → 扔掉 text1 [i]
      // dp[i][j-1] → 扔掉 text2 [j]
      dp[i][j] = cur1 === cur2 ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows][cols];
};
```

换成一维

```js
var longestCommonSubsequence = function (text1, text2) {
  const rows = text1.length;
  const cols = text2.length;

  // 一维 dp 数组：代表当前行的 dp 值
  const dp = new Array(cols + 1).fill(0);

  for (let i = 1; i <= rows; i++) {
    const cur1 = text1[i - 1];
    const prevDp = [...dp]; // 保存上一行（i-1 行）的完整数据

    for (let j = 1; j <= cols; j++) {
      const cur2 = text2[j - 1];

      // ✅ 核心转移（完全正确）
      dp[j] =
        cur1 === cur2
          ? prevDp[j - 1] + 1 // 字符相同：左上角+1
          : Math.max(prevDp[j], dp[j - 1]); // 不同：取 上/左 最大
    }
  }

  // ✅ 一维数组，最后返回 dp[cols]
  return dp[cols];
};
```

583

```js
var minDistance = function (word1, word2) {
  const rows = word1.length;
  const cols = word2.length;
  const dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  // 第一行、第一列初始化
  for (let j = 0; j <= cols; j++) {
    dp[0][j] = j;
  }
  for (let i = 0; i <= rows; i++) {
    dp[i][0] = i;
  }

  for (let i = 1; i <= rows; i++) {
    const cur1 = word1[i - 1];
    for (let j = 1; j <= cols; j++) {
      const cur2 = word2[j - 1];
      // 如果当前相等的，不用操作，那么和i-1 j-1的操作是一样的
      if (cur1 === cur2) {
        dp[i][j] = dp[i - 1][j - 1];
        continue;
      }
      // 不相等的话 删除一个 看谁的操作更少 使用哪个
      // 首先有个删除的动作，所以+1 然后删除之后其实就是其他的情况分析
      dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows][cols];
};
```

优化空间

```js
var minDistance = function (word1, word2) {
  const rows = word1.length;
  const cols = word2.length;

  // ==================== 一维 DP 定义 ====================
  // dp[j] 表示：word1 前 i 个字符 和 word2 前 j 个字符
  // 变成相同字符串所需的【最小删除次数】
  const dp = new Array(cols + 1).fill(0);

  // ==================== 初始化：第一行 ====================
  // word1 为空串 → 把 word2 删空，需要删 j 次
  for (let i = 0; i <= cols; i++) dp[i] = i;

  // ==================== 遍历 word1 的每一个字符 ====================
  for (let i = 1; i <= rows; i++) {
    const cur1 = word1[i - 1];
    // prevDp 保存【上一行】的数据（对应二维的 dp[i-1][...])
    const prevDp = [...dp];

    // 遍历 word2
    for (let j = 0; j <= cols; j++) {
      // ==================== 初始化：第一列 ====================
      // word2 为空串 → 把 word1 删空，需要删 i 次
      if (j === 0) {
        dp[j] = i;
        continue;
      }

      const cur2 = word2[j - 1];

      // ==================== 情况1：字符相等 ====================
      // 不用删！直接继承 左上角 的结果
      if (cur1 === cur2) {
        dp[j] = prevDp[j - 1];
        continue;
      }

      // ==================== 情况2：字符不等 ====================
      // 两种选择，取最小 +1
      // prevDp[j]   → 删除 word1 当前字符（对应二维的上）
      // dp[j-1]     → 删除 word2 当前字符（对应二维的左）
      dp[j] = 1 + Math.min(prevDp[j], dp[j - 1]);
    }
  }

  // 最终答案：两个字符串全部的最小删除次数
  return dp[cols];
};
```

712

```js
var minimumDeleteSum = function (word1, word2) {
  const rows = word1.length;
  const cols = word2.length;

  // ==================== DP 定义 ====================
  // dp[i][j]：把 word1 前 i 个字符 和 word2 前 j 个字符
  // 变成相同字符串，所需的【最小 ASCII 删除总和】
  const dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

  // ==================== 初始化 ====================
  // 第一行：word1 为空，必须把 word2 全部删掉
  for (let i = 1; i <= cols; i++) {
    dp[0][i] = dp[0][i - 1] + word2.charCodeAt(i - 1);
  }
  // 第一列：word2 为空，必须把 word1 全部删掉
  for (let i = 1; i <= rows; i++) {
    dp[i][0] = dp[i - 1][0] + word1.charCodeAt(i - 1);
  }

  // ==================== 核心 DP 循环 ====================
  for (let i = 1; i <= rows; i++) {
    const cur1 = word1[i - 1];
    for (let j = 1; j <= cols; j++) {
      const cur2 = word2[j - 1];

      // ==================== 情况1：字符相等 ====================
      // 两个字符一样，不用删！直接继承左上角的值
      if (cur1 === cur2) {
        dp[i][j] = dp[i - 1][j - 1];
        continue;
      }

      // ==================== 情况2：字符不相等 ====================
      // 二选一，删 ASCII 更小的那个！
      dp[i][j] = Math.min(
        dp[i - 1][j] + word1.charCodeAt(i - 1), // 删 word1 当前字符，加上它的 ASCII
        dp[i][j - 1] + word2.charCodeAt(j - 1) // 删 word2 当前字符，加上它的 ASCII
      );
    }
  }

  // 返回最终结果
  return dp[rows][cols];
};
```

优化，搜`dp[`一个个修改，大约7处作用

```js
var minimumDeleteSum = function (word1, word2) {
  const rows = word1.length;
  const cols = word2.length;

  // ==================== 一维 DP 定义 ====================
  // dp[j]  ：当前行，对应二维 dp[i][j]
  // prevDp：上一行，对应二维 dp[i-1][j]
  // 含义：使 word1前i 个、word2前j 个相同的最小ASCII删除和
  const dp = new Array(cols + 1).fill(0); // ✅ 正确

  // ==================== 初始化：第一行（i=0）====================
  // word1 为空 → 必须删除 word2 所有字符
  for (let i = 1; i <= cols; i++) {
    dp[i] = dp[i - 1] + word2.charCodeAt(i - 1); //  ✅ 正确
  }

  // ==================== 遍历 word1，逐行计算 ====================
  for (let i = 1; i <= rows; i++) {
    const cur1 = word1[i - 1];
    const prevDp = [...dp]; // 保存上一行（i-1行）数据 🔥🔥🔥 关键

    for (let j = 0; j <= cols; j++) {
      // ==================== 初始化：第一列（j=0）====================
      // word2 为空 → 必须删除 word1 当前字符
      if (j === 0) {
        dp[0] = prevDp[0] + word1.charCodeAt(i - 1); //  ✅ 正确
        continue;
      }

      const cur2 = word2[j - 1];

      // ==================== 字符相等：不删，继承左上角 ====================
      if (cur1 === cur2) {
        dp[j] = prevDp[j - 1]; //✅ 正确
        continue;
      }

      // ==================== 字符不等：选代价更小的删除 ====================
      // prevDp[j]  → 上一行（删 word1）
      // dp[j-1]    → 当前行左边（删 word2） ✅ 正确
      dp[j] = Math.min(prevDp[j] + word1.charCodeAt(i - 1), dp[j - 1] + word2.charCodeAt(j - 1));
    }
  }

  return dp[cols]; // 一维数组最终答案 ✅
};
```

子序列的技巧。两个字符串多半是前i个 前j个然后xx的。一个字符串或者数组的，多少包含xx为前i个。

516

回文很特殊，是需要从短的推导长的，这就是对角线遍历了

```js
/**
 * @param {string} s
 * @return {number}

abca 0到n-1这个字符串，当首尾相等的时候那么和1到n-2的最长回文是有关的，也就是长的字符串依赖其相关短的字符串
所以从最短的字符串开始，然后长度一点点增加
          j →
        0   1   2   3
i=0     ●   ○   ○   ○
i=1         ●   ○   ○
i=2             ●   ○
i=3                 ●

先填充最短的1长度，然后填充2长度 3长度。。。
第 1 条对角线：len=1，i=j
第 2 条对角线：len=2，j=i+1
第 3 条对角线：len=3，j=i+2
第 4 条对角线：len=4，j=i+3

i依靠内侧的i，其实是依赖更大的i,所以从后往前


 */
var longestPalindromeSubseq = function (s) {
  const n = s.length;

  // dp[i][j] 定义：
  // 字符串 s 从下标 i 到 j 的子串 s[i...j] 中，最长回文子序列的长度
  // 只使用 i <= j 的上三角部分，下三角无意义
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  // 初始化：长度为 1 的子串
  // 单个字符本身就是回文，最长长度为 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // 按子串长度从小到大枚举：len 从 2 到 n
  // 先算短区间，再算长区间，保证计算 dp[i][j] 时依赖项已算完
  for (let len = 2; len <= n; len++) {
    // i 是子串左端点，j 是右端点 j = i + len - 1
    // i 的取值范围：保证 j 不越界 => i 最大为 n - len
    for (let i = n - len; i >= 0; i--) {
      const j = i + len - 1;

      // 情况 1：两端字符相等
      // 这两个字符可以一起加入回文，长度 = 内部子串结果 + 2
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      }

      // 情况 2：两端字符不相等
      // 不能同时使用 s[i] 和 s[j]，取两种选择的最大值
      // dp[i+1][j]：舍弃左端点 s[i]
      // dp[i][j-1]：舍弃右端点 s[j]
      else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // 整个字符串 s[0 ... n-1] 的最长回文子序列长度
  return dp[0][n - 1];
};
```

然后其实也也可以从下往上，这样不用对角线，更容易理解

```js
var longestPalindromeSubseq = function (s) {
  const n = s.length;

  // dp[i][j]：s[i...j] 子串中的最长回文子序列长度
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  // 初始化：单个字符一定是回文，长度为 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // 核心：从下往上遍历 i（倒数第二行开始）
  // 保证计算 dp[i][j] 时，下方、左方、左下角的值都已经算完了
  for (let i = n - 2; i >= 0; i--) {
    // j 从 i+1 往右走，填对角线右上方
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        // 两端相等 = 内部回文长度 + 2
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        // 两端不等 = 舍弃一边，取最大值
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // 答案：整个字符串 0 ~ n-1
  return dp[0][n - 1];
};
```

空间优化

```js
var longestPalindromeSubseq = function (s) {
  const n = s.length;

  // dp[i][j]：s[i...j] 子串中的最长回文子序列长度
  const dp = Array(n).fill(0);

  // 初始化：单个字符一定是回文，长度为 1
  dp[n - 1] = 1;

  // 核心：从下往上遍历 i（倒数第二行开始）
  // 保证计算 dp[i][j] 时，下方、左方、左下角的值都已经算完了
  for (let i = n - 2; i >= 0; i--) {
    const prevDp = [...dp];
    // j 从 i+1 往右走，填对角线右上方
    for (let j = i; j < n; j++) {
      // 这里j注意边界
      if (j === i) {
        dp[j] = 1;
        continue;
      }
      if (s[i] === s[j]) {
        // 两端相等 = 内部回文长度 + 2
        dp[j] = prevDp[j - 1] + 2;
      } else {
        // 两端不等 = 舍弃一边，取最大值
        dp[j] = Math.max(prevDp[j], dp[j - 1]);
      }
    }
  }

  // 答案：整个字符串 0 ~ n-1
  return dp[n - 1];
};
```

1312

```js
var minInsertions = function (s) {
  const n = s.length;

  // ==================== DP 定义 ====================
  // dp[i][j]：把字符串 s 的子串 s[i...j] 变成回文串，所需要的【最小插入次数】
  // 核心：只操作 i~j 区间
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  // ==================== 初始化 ====================
  // 单个字符（i == j）本身就是回文，不需要插入
  // 因为创建 dp 时已经 fill(0)，所以这里不用额外写循环初始化

  // ==================== 核心遍历顺序 ====================
  // 必须 从下往上 遍历 i
  // 因为 dp[i][j] 依赖：下方 dp[i+1][j]、左方 dp[i][j-1]、左下角 dp[i+1][j-1]
  // 从下往上算，才能保证用到的值都已经算好了
  for (let i = n - 2; i >= 0; i--) {
    // j 必须从 i+1 开始向右走，只填充对角线右上部分（i<j）
    for (let j = i + 1; j < n; j++) {
      // ==================== 情况 1：两端字符相等 ====================
      // s[i] == s[j]：这两个字符已经匹配，不需要插入
      // 最小插入次数 = 内部子串 s[i+1...j-1] 的最小插入次数
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1];
      }

      // ==================== 情况 2：两端字符不相等 ====================
      // 必须插入 1 个字符，有两种选择，取最小：
      // 1. 在左边插入 s[j] → 消耗 1 次 + 解决右边内部：dp[i][j-1]
      // 2. 在右边插入 s[i] → 消耗 1 次 + 解决左边内部：dp[i+1][j]
      else {
        dp[i][j] = Math.min(
          dp[i][j - 1] + 1, // 左边插一个，匹配 j
          dp[i + 1][j] + 1 // 右边插一个，匹配 i
        );
      }
    }
  }

  // ==================== 最终答案 ====================
  // 整个字符串 s[0 ... n-1] 变成回文的最小插入次数
  return dp[0][n - 1];
};
```

优化三个点

- `dp`都要修改
- j边界
- prevDp

```js
var minInsertions = function (s) {
  const n = s.length;

  // ==================== DP 定义 ====================
  // dp[j]：把字符串 s 的子串 s[0...j] 变成回文串，所需要的【最小插入次数】
  // 核心：只操作 i~j 区间
  const dp = Array(n).fill(0); // ✅dp这里

  for (let i = n - 2; i >= 0; i--) {
    const prevDp = [...dp]; // ✅🔥存储上一个dp
    // j 必须从 i+1 开始向右走，只填充对角线右上部分（i<j）
    for (let j = i; j < n; j++) {
      if (j === i) {
        // ✅🔥边界处理
        dp[j] = 0;
        continue;
      }
      // ==================== 情况 1：两端字符相等 ====================
      // s[i] == s[j]：这两个字符已经匹配，不需要插入
      // 最小插入次数 = 内部子串 s[i+1...j-1] 的最小插入次数
      if (s[i] === s[j]) {
        dp[j] = prevDp[j - 1]; // ✅dp这里
      }

      // ==================== 情况 2：两端字符不相等 ====================
      // 必须插入 1 个字符，有两种选择，取最小：
      // 1. 在左边插入 s[j] → 消耗 1 次 + 解决右边内部：dp[i][j-1]
      // 2. 在右边插入 s[i] → 消耗 1 次 + 解决左边内部：dp[i+1][j]
      else {
        dp[j] = Math.min(
          // ✅dp这里
          dp[j - 1] + 1, // 左边插一个，匹配 j
          prevDp[j] + 1 // 右边插一个，匹配 i
        );
      }
    }
  }

  // ==================== 最终答案 ====================
  // 整个字符串 s[0 ... n-1] 变成回文的最小插入次数 ✅dp这里
  return dp[n - 1];
};
```
