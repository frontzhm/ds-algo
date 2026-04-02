[416] 分割等和子集

```js
var canPartition = function (nums) {
  // 1. 先求数组所有数字的总和
  const sum = nums.reduce((acc, cur) => acc + cur, 0);

  // 2. 如果总和是奇数，不可能平分成两个和相等的子集，直接返回 false
  const isEven = sum % 2 === 0;
  if (!isEven) return false;

  // 3. 目标：找到一个子集，它的和正好是总和的一半
  // 只要能找到，剩下的另一半自然也满足条件
  const subSum = sum / 2;

  // 4. 构建二维 dp 数组
  // rows 代表：要凑的和 0 ~ subSum
  const cols = subSum + 1;
  // cols 代表：使用前 0 ~ nums.length 个数字
  const rows = nums.length + 1;

  // 5. dp 定义（核心）
  // dp[i][j] = 前 j 个数字，能否凑出和为 i
  // 初始全部为 false，表示默认都凑不出来
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(false));

  // 6. 初始化第一行：和为 0 时
  // 不管用多少个数字，都能凑出和为 0（什么都不选）
  // 所以 dp[0][j] 全部为 true
  for (let i = 1; i < rows; i++) dp[i][0] = true;

  // 7. 下面这一行是【错误】的！！！必须删掉
  // dp[i][0] 表示：0 个数字，能否凑出和 i
  // 只有 i=0 时为 true，i>0 一定是 false，本来就是默认值，不用改
  // for (let i = 1; i < rows; i++) dp[i][0] = true;

  // 8. 开始填充 dp 表
  // i 遍历所有可能的和：从 1 到 subSum
  for (let i = 1; i < rows; i++) {
    const curNum = nums[i - 1];
    // j 遍历所有数字个数：从 1 到 nums.length
    for (let j = 1; j < cols; j++) {
      const curSum = j;
      // 当前第 j 个数字（数组下标从 0 开始，所以是 j-1）

      // 情况1：当前数字 > 要凑的和 i
      // 这个数字太大，根本不能选，只能不选
      // 所以结果 = 不用这个数字时的结果：dp[i][j-1]
      if (curSum < curNum) {
        dp[i][j] = dp[i - 1][j];
        continue;
      }

      // 情况2：当前数字 <= i，可以选也可以不选
      // 不选：dp[i][j-1]
      // 选：dp[i - curNum][j - 1] （用前 j-1 个数字凑出 i - curNum）
      // 只要其中一种能凑出来，当前就为 true
      dp[i][j] = dp[i - 1][curSum - curNum] || dp[i - 1][j];
    }
  }

  // 9. 最终答案：用全部 nums.length 个数字，能否凑出 subSum
  return dp[rows - 1][cols - 1];
};
```

优化

- `dp`
- prevDp
- 边界

```js
var canPartition = function (nums) {
  // 1. 先求数组所有数字的总和
  const sum = nums.reduce((acc, cur) => acc + cur, 0);

  // 2. 如果总和是奇数，不可能平分成两个和相等的子集，直接返回 false
  const isEven = sum % 2 === 0;
  if (!isEven) return false;

  // 3. 目标：找到一个子集，它的和正好是总和的一半
  // 只要能找到，剩下的另一半自然也满足条件
  const subSum = sum / 2;

  // 4. 构建二维 dp 数组
  // rows 代表：要凑的和 0 ~ subSum
  const cols = subSum + 1;
  // cols 代表：使用前 0 ~ nums.length 个数字
  const rows = nums.length + 1;

  // 5. dp 定义（核心）
  // dp[i][j] = 前 j 个数字，能否凑出和为 i
  // 初始全部为 false，表示默认都凑不出来
  const dp = new Array(cols).fill(false);

  // 6. 初始化第一行：和为 0 时
  // 不管用多少个数字，都能凑出和为 0（什么都不选）
  // 所以 dp[0][j] 全部为 true
  // for (let i = 1; i < rows; i++) dp[i][0] = true;

  // 7. 下面这一行是【错误】的！！！必须删掉
  // dp[i][0] 表示：0 个数字，能否凑出和 i
  // 只有 i=0 时为 true，i>0 一定是 false，本来就是默认值，不用改
  // for (let i = 1; i < rows; i++) dp[i][0] = true;

  // 8. 开始填充 dp 表
  // i 遍历所有可能的和：从 1 到 subSum
  for (let i = 1; i < rows; i++) {
    const curNum = nums[i - 1];
    const prevDp = [...dp];
    // j 遍历所有数字个数：从 1 到 nums.length
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        dp[0] = true;
        continue;
      }
      const curSum = j;
      // 当前第 j 个数字（数组下标从 0 开始，所以是 j-1）

      // 情况1：当前数字 > 要凑的和 i
      // 这个数字太大，根本不能选，只能不选
      // 所以结果 = 不用这个数字时的结果：dp[i][j-1]
      if (curSum < curNum) {
        dp[j] = prevDp[j];
        continue;
      }

      // 情况2：当前数字 <= i，可以选也可以不选
      // 不选：dp[i][j-1]
      // 选：dp[i - curNum][j - 1] （用前 j-1 个数字凑出 i - curNum）
      // 只要其中一种能凑出来，当前就为 true
      dp[j] = prevDp[curSum - curNum] || prevDp[j];
    }
  }

  // 9. 最终答案：用全部 nums.length 个数字，能否凑出 subSum
  return dp[cols - 1];
};
```

凑零钱2

```js
/**
 * 零钱兑换 II
 * 给定不同面额的硬币 coins 和一个总金额 amount
 * 求出可以凑成总金额的硬币组合数（硬币可以无限使用）
 * @param {number} amount 总金额
 * @param {number[]} coins 硬币面额数组
 * @return {number} 组合数
 */
var change = function (amount, coins) {
  // 1. 定义二维DP数组
  // rows：硬币数量维度（0 ~ coins.length），代表使用前 i 种硬币
  const rows = coins.length + 1;
  // cols：金额维度（0 ~ amount），代表要凑的金额 j
  const cols = amount + 1;

  // 2. 创建DP数组并初始化全部为 0
  // dp[i][j]：用前 i 种硬币，凑成总金额 j，一共有多少种组合方式
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // 3. 【关键初始化】第一列全部赋值为 1
  // dp[i][0]：用任意 i 种硬币，凑成金额 0
  // 只有 1 种方法：什么硬币都不选
  for (let i = 0; i < rows; i++) dp[i][0] = 1;

  // 4. 开始填充 DP 表（外层遍历硬币）
  for (let i = 1; i < rows; i++) {
    // 当前使用的第 i 种硬币（数组下标从 0 开始，所以是 i-1）
    const curCoin = coins[i - 1];

    // 内层遍历要凑的金额
    for (let j = 1; j < cols; j++) {
      const curSum = j; // 当前要凑的目标金额

      // 情况1：当前硬币面额 > 目标金额，根本用不了
      // 所以组合数 = 不使用这种硬币时的组合数（继承上一行）
      if (curCoin > curSum) {
        dp[i][j] = dp[i - 1][j];
        continue;
      }

      // 情况2：当前硬币 ≤ 目标金额，可以使用
      // 计算使用 当前硬币 1个、2个、3个... 能产生的所有组合数
      let ways = 0;
      // 枚举：使用 n 个当前硬币，只要总面额不超过 curSum 就继续
      for (let n = 1; n * curCoin <= curSum; n++) {
        // 用了 n 个当前硬币 → 剩余金额：curSum - n*curCoin
        // 剩余金额用【前 i-1 种硬币】凑，累加组合数
        ways += dp[i - 1][curSum - n * curCoin];
      }

      // 最终总组合数 = 不使用当前硬币的组合数 + 使用当前硬币的组合数
      dp[i][j] = dp[i - 1][j] + ways;
    }
  }

  // 5. 最终答案：用所有硬币，凑成 amount 金额的组合数
  return dp[rows - 1][cols - 1];
};
```

简单优化

```js
var change = function (amount, coins) {
  // 1. 定义二维DP数组
  // rows：硬币数量维度（0 ~ coins.length），代表使用前 i 种硬币
  const rows = coins.length + 1;
  // cols：金额维度（0 ~ amount），代表要凑的金额 j
  const cols = amount + 1;

  // 2. 创建DP数组并初始化全部为 0
  // dp[i][j]：用前 i 种硬币，凑成总金额 j，一共有多少种组合方式
  const dp = new Array(cols).fill(0);

  // 3. 【关键初始化】第一列全部赋值为 1
  // dp[i][0]：用任意 i 种硬币，凑成金额 0
  // 只有 1 种方法：什么硬币都不选
  // for (let i = 0; i < rows; i++) dp[i][0] = 1;
  dp[0] = 1;

  // 4. 开始填充 DP 表（外层遍历硬币）
  for (let i = 1; i < rows; i++) {
    // 当前使用的第 i 种硬币（数组下标从 0 开始，所以是 i-1）
    const curCoin = coins[i - 1];
    // const prevDp = [...dp];

    // 内层遍历要凑的金额
    for (let j = cols - 1; j >= 0; j--) {
      // if (j === 0) {
      //   dp[0] = 1;
      //   continue;
      // }
      const curSum = j; // 当前要凑的目标金额

      // 情况1：当前硬币面额 > 目标金额，根本用不了
      // 所以组合数 = 不使用这种硬币时的组合数（继承上一行）
      if (curCoin > curSum) {
        // dp[j] = prevDp[j];
        continue;
      }

      // 情况2：当前硬币 ≤ 目标金额，可以使用
      // 计算使用 当前硬币 1个、2个、3个... 能产生的所有组合数
      let ways = 0;
      // 枚举：使用 n 个当前硬币，只要总面额不超过 curSum 就继续
      for (let n = 1; n * curCoin <= curSum; n++) {
        // 用了 n 个当前硬币 → 剩余金额：curSum - n*curCoin
        // 剩余金额用【前 i-1 种硬币】凑，累加组合数
        ways += dp[curSum - n * curCoin];
      }

      // 最终总组合数 = 不使用当前硬币的组合数 + 使用当前硬币的组合数
      dp[j] = dp[j] + ways;
    }
  }

  // 5. 最终答案：用所有硬币，凑成 amount 金额的组合数
  return dp[cols - 1];
};
```

还有优化`dp[i][j] = dp[i - 1][j] + dp[i][curSum - curCoin];`

494 目标和

第一想法就是回溯

```js
var findTargetSumWays = function (nums, target) {
  const n = nums.length;
  let res = 0;
  dfs(0, 0);
  return res;

  function dfs(start, sum) {
    if (start === n) {
      if (sum === target) {
        res++;
      }
      return;
    }
    // 两种情况 一是正 而是负
    dfs(start + 1, sum + nums[start]);
    dfs(start + 1, sum - nums[start]);
  }
};
```

动态回话

```js
/**
 * 目标和
 * 给定一个数组 nums，给每个元素前添加 + 或 -，计算有多少种方式使得最终运算结果 = target
 * 解法：转化为 01 背包问题（求子集和的组合数）
 */
var findTargetSumWays = function (nums, target) {
  // 和的话 正负 考虑最大情况
  // ===================== 1. 数学推导（最核心）=====================
  // 设：
  // 前面是 + 号的数字总和 = sumP
  // 前面是 - 号的数字总和 = sumN
  // 得到两个公式：
  // sumP - sumN = target
  // sumP + sumN = sum(nums)
  // 两式相加：2 * sumP = target + sum(nums)
  // 最终：sumP = (target + sum(nums)) / 2

  // 先求数组总和
  const sum = nums.reduce((acc, cur) => acc + cur, 0);

  // 剪枝（不满足条件直接返回 0）
  // 1. target 绝对值 > 数组总和，绝对凑不出来
  // 2. (target + sum) 必须是偶数，否则 sumP 不是整数，无法凑出
  if (target > sum || target < -sum || (target + sum) % 2 === 1) {
    return 0;
  }

  // 背包容量：我们需要凑出的子集和 sumP
  const sum_add = (target + sum) / 2;

  // ===================== 2. 定义二维 DP 数组 =====================
  // 行数：i 代表使用前 i 个数字（0 ~ nums.length）
  const rows = nums.length + 1;
  // 列数：j 代表当前要凑出的数字和（0 ~ sum_add）
  const cols = sum_add + 1;

  // dp[i][j] 定义：
  // 用前 i 个数字，凑出和为 j 的组合方式总数
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // ===================== 3. DP 初始化（关键！处理 0 元素）=====================
  // 错误写法（你注释掉了）：
  // for (let i = 0; i < rows; i++) dp[i][0] = 1;
  // 解释：不能把第一列全部设为 1
  // 因为凑 0 的时候，如果数组里有 0，选 +0 或 -0 是两种方法
  // 提前写死 dp[i][0]=1 会把 0 的两种方法强制变成 1 种

  // 正确初始化：
  // 0 个数字，凑出和 0，只有 1 种方法：什么都不选
  dp[0][0] = 1;

  // ===================== 4. 填充 DP 表格 =====================
  // 遍历每个数字（i 从 1 开始）
  for (let i = 1; i < rows; i++) {
    // 当前数字（前 i 个数字 → 下标 i-1）
    const curNum = nums[i - 1];

    // 遍历所有可能的和 j（必须从 0 开始遍历，保证 0 能被正确计算）
    for (let j = 0; j < cols; j++) {
      const curSum = j;

      // 情况 1：当前数字 > 要凑的和 → 不能选这个数字
      if (curSum < curNum) {
        // 方式数 = 不选当前数字，继承上一行的结果
        dp[i][j] = dp[i - 1][curSum];
        continue;
      }

      // 情况 2：当前数字 <= 要凑的和 → 可以选 或 不选
      // dp[i-1][curSum]        → 不选当前数字
      // dp[i-1][curSum - curNum] → 选当前数字
      dp[i][j] = dp[i - 1][curSum - curNum] + dp[i - 1][curSum];
    }
  }

  // 最终答案：用所有数字，凑出 sum_add 的总方式数
  return dp[rows - 1][cols - 1];
};
```
