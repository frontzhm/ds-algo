# 前缀和技巧全解析：从基础到进阶

前缀和是算法领域中解决「区间和/子数组和」问题的核心技巧，能将频繁的区间和查询时间复杂度从  $O(n)$  优化到  $O(1)$ 。本文将从基础概念出发，逐步讲解一维/二维前缀和、前缀积，以及进阶的「前缀和+哈希表」技巧，并结合LeetCode高频面试题给出可复用的模板代码。

## 一、前缀和核心概念

### 1.1 前缀和定义

前缀和数组 `prefix` 中，`prefix[i]` 表示原数组 `nums`中**从nums[0]到nums[i-1]的所有元素之和**（即不包含nums[i]）；若延伸为前缀积，则 `prefix[i]` 表示从nums[0]到nums[i-1]的所有元素之积（不包含nums[i]）。

- 一维前缀和：`prefix[i] = nums[0] + nums[1] + ... + nums[i-1]`（长度为原数组nums长度+1，prefix[0] = 0，含额外虚拟基准位）

- 区间和公式：`nums[left...right]` 的和 = `prefix[right+1] - prefix[left]`（无需判断left是否为0，简化边界计算）

### 1.2 适用场景

- 快速计算数组/矩阵的区间和

- 寻找满足特定和条件的子数组（如和为k、和为k的倍数、和为0等）

- 需频繁查询区间和的场景（如多次sumRange调用）

### 1.3 局限性

1. 原数组不可变：若原数组元素修改，前缀和数组需重新计算

2. 仅适用于有逆运算的场景：求和/积可行，求最大值/最小值不可行（无逆运算）

## 二、基础模板：一维/二维前缀和

### 2.1 一维前缀和（力扣303. 区域和检索 - 数组不可变，https://leetcode.cn/problems/range-sum-query-immutable/）

**题目详细描述**：给定一个整数数组 `nums`，处理以下类型的多个查询：计算索引 `left` 和 `right`（包含 `left` 和 `right`）之间的 `nums` 元素的 和，其中 `left <= right`。实现 `NumArray` 类：
- `NumArray(int[] nums)` 使用数组 `nums` 初始化对象
- `int sumRange(int left, int right)` 返回数组 `nums` 中索引 `left` 和 `right` 之间的元素的 总和（包含 `left` 和 `right` 两点）

**示例 1**：
```
输入：
["NumArray", "sumRange", "sumRange", "sumRange"]
[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]
输出：
[null, 1, -1, -3]

解释：
NumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
numArray.sumRange(0, 2); // return 1 ((-2) + 0 + 3)
numArray.sumRange(2, 5); // return -1 (3 + (-5) + 2 + (-1))
numArray.sumRange(0, 5); // return -3 ((-2) + 0 + 3 + (-5) + 2 + (-1))
```

**解题思路**：使用一维前缀和数组。核心步骤：
1. 构建前缀和数组：prefix[i] = nums[0]~nums[i-1]的和（不包含nums[i]）
2. 区间和查询：sumRange(left, right) = prefix[right+1] - prefix[left]

```JavaScript
/**
 * LeetCode 303. 区域和检索 - 数组不可变
 * 核心思路：一维前缀和
 * 
 * 前缀和定义：prefix[i] = nums[0]~nums[i-1]的和 → prefix = [0, 1, 3, 6]
 * - prefix[0] = 0（虚拟基准位，前0个元素的和）
 * - prefix[1] = nums[0] = 1（前1个元素，不包含nums[1]）
 * - prefix[2] = nums[0]+nums[1] = 3（前2个元素，不包含nums[2]）
 * - prefix[3] = nums[0]+nums[1]+nums[2] = 6（前3个元素，不包含nums[3]，nums[3]不存在）
 * 
 * 区间和公式（原始标准）：nums[left...right] 的和 = prefix[right+1] - prefix[left]
 * 例：nums[0..2] 和 = prefix[3] - prefix[0] = 6；nums[1..2] 和 = prefix[3] - prefix[1] = 5
 */
class NumArray {
  constructor(nums) {
    this.nums = nums;
    const len = nums.length;
    this.prefixNums = new Array(len + 1); // 长度=原数组长度+1，含虚拟基准位prefix[0]=0
    // 初始化prefixNums：prefixNums[i] 表示nums[0]~nums[i-1]的和
    this.prefixNums[0] = 0;
    for (let i = 1; i <= len; i++) {
      this.prefixNums[i] = nums[i-1] + this.prefixNums[i-1]; // 累加前一个前缀和，不包含当前nums[i]
    }
  }

  sumRange(left, right) {
    // 核心公式（原始标准）：无需判断边界，直接用right+1和left计算
    return this.prefixNums[right + 1] - this.prefixNums[left];
  }
}
// 测试验证：nums = [1,2,3,4] → prefixNums = [0,1,3,6,10]
// sumRange(0,3) = 10 - 0 = 10（正确）；sumRange(1,2) = 6 - 1 = 5（正确）
// sumRange(2,3) = 10 - 3 = 7（正确）
```

### 2.2 二维前缀和（力扣304. 二维区域和检索 - 矩阵不可变，https://leetcode.cn/problems/range-sum-query-2d-immutable/）

**题目详细描述**：给定一个二维矩阵 `matrix`，处理以下类型的多个查询：计算其子矩形范围内元素的总和，该子矩阵的左上角为 `(row1, col1)`，右下角为 `(row2, col2)`。实现 `NumMatrix` 类：
- `NumMatrix(int[][] matrix)` 使用整数矩阵 `matrix` 初始化对象
- `int sumRegion(int row1, int col1, int row2, int col2)` 返回左上角 `(row1, col1)`、右下角 `(row2, col2)` 所描述的子矩阵的元素总和

**示例 1**：
```
输入：
["NumMatrix","sumRegion","sumRegion","sumRegion"]
[[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]],[2,1,4,3],[1,1,2,2],[1,2,2,4]]
输出：
[null, 8, 11, 12]

解释：
NumMatrix numMatrix = new NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]);
numMatrix.sumRegion(2, 1, 4, 3); // return 8 (红色矩形框的元素总和)
numMatrix.sumRegion(1, 1, 2, 2); // return 11 (绿色矩形框的元素总和)
numMatrix.sumRegion(1, 2, 2, 4); // return 12 (蓝色矩形框的元素总和)
```

**解题思路**：使用二维前缀和矩阵。核心步骤：
1. 构建二维前缀和矩阵：preSum[i][j] = 矩阵[0,0..i-1,j-1]的元素和（不包含matrix[i][j]）
2. 子矩阵和查询：sumRegion(x1, y1, x2, y2) = preSum[x2+1][y2+1] - preSum[x1][y2+1] - preSum[x2+1][y1] + preSum[x1][y1]

```JavaScript
/**
 * LeetCode 304. 二维区域和检索 - 矩阵不可变
 * 核心思路：二维前缀和
 * 
 * 二维前缀和定义：preSum[i][j] 表示矩阵[0,0..i-1,j-1]的元素和（不包含matrix[i][j]）
 * 即preSum[i][j] = 矩阵左上角到(i-1,j-1)（包含i-1,j-1）的所有元素之和
 * 前缀和矩阵尺寸 = (m+1)×(n+1)，含虚拟基准行preSum[0][*]和虚拟基准列preSum[*][0]（均为0）
 */
var NumMatrix = function(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  // preSum[i][j] 记录矩阵 [0, 0..i-1, j-1] 的元素和（不包含matrix[i][j]）
  this.preSum = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  
  // 边界处理：空矩阵直接返回
  if (m === 0 || n === 0) return;
  
  // 构造前缀和矩阵
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // 计算逻辑：当前元素 + 上方前缀和 + 左方前缀和 - 左上重复计算的前缀和（避免叠加）
      this.preSum[i][j] = this.preSum[i - 1][j] + this.preSum[i][j - 1] - this.preSum[i - 1][j - 1] + matrix[i - 1][j - 1];
    }
  }
};

NumMatrix.prototype.sumRegion = function(x1, y1, x2, y2) {
  // 计算子矩阵 [x1, y1..x2, y2] 的元素和（包含边界），原始标准公式
  // 子矩阵和 = 右下角前缀和 - 上方前缀和 - 左方前缀和 + 左上重复减去的前缀和
  return this.preSum[x2 + 1][y2 + 1] - this.preSum[x1][y2 + 1] - this.preSum[x2 + 1][y1] + this.preSum[x1][y1];
};
```

## 三、前缀和变形：前缀积

前缀积数组 `prefix[i]` 表示从nums[0]到nums[i-1]的所有元素之积（不包含nums[i]），核心是处理「除自身以外数组的乘积」类问题，需注意避免0作为除数。

### 3.1 除自身以外数组的乘积（力扣238，https://leetcode.cn/problems/product-of-array-except-self/）

**题目详细描述**：给你一个整数数组 `nums`，返回数组 `answer`，其中 `answer[i]` 等于 `nums` 中除 `nums[i]` 之外其余各元素的乘积。题目数据保证数组 `nums` 之中任意元素的全部前缀元素和后缀的乘积都在 32 位整数范围内。请不要使用除法，且在 O(n) 时间复杂度内完成此题。

**示例 1**：输入：`nums = [1,2,3,4]` 输出：`[24,12,8,6]`

**示例 2**：输入：`nums = [-1,1,0,-3,3]` 输出：`[0,0,9,0,0]`

**解题思路**：使用前缀积+后缀积。核心步骤：
1. 构建前缀乘积数组：prefix[i] = nums[0]~nums[i-1]的乘积（不包含nums[i]）
2. 构建后缀乘积数组：suffix[i] = nums[i]~nums[len-1]的乘积（不包含nums[i-1]）
3. 计算结果：每个位置 = 前缀积 × 后缀积

```JavaScript
/**
 * LeetCode 238. 除自身以外数组的乘积
 * 核心思路：前缀积 + 后缀积
 * @param {number[]} nums 整数数组
 * @return {number[]} 每个位置除自身外所有元素的乘积
 */
var productExceptSelf = function(nums) {
  const len = nums.length;
  // 边界处理：空数组/单元素数组（单元素时除自身外无元素，乘积为1）
  if (len === 0) return [];
  if (len === 1) return [1];

  // 1. 构建前缀乘积数组：prefix[i] = nums[0]~nums[i-1]的乘积（不包含nums[i]）
  const prefix = new Array(len + 1);
  prefix[0] = 1; // 虚拟基准位，前0个元素的积为1（乘法基准）
  for (let i = 1; i <= len; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1]; // 累加前一个前缀积，不包含当前nums[i]
  }

  // 2. 构建后缀乘积数组：suffix[i] = nums[i]~nums[len-1]的乘积（不包含nums[i-1]）
  const suffix = new Array(len + 1);
  suffix[len] = 1; // 虚拟基准位，后0个元素的积为1
  for (let i = len - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i]; // 累加后一个后缀积，不包含当前nums[i-1]
  }

  // 3. 计算结果：每个位置 = 前缀积（前i个元素，不包含nums[i]） × 后缀积（后len-i-1个元素，不包含nums[i]）
  const answer = new Array(len);
  for (let i = 0; i < len; i++) {
    answer[i] = prefix[i] * suffix[i + 1];
  }

  return answer;
};
```

### 3.2 最后 K 个数的乘积（力扣1352，https://leetcode.cn/problems/product-of-the-last-k-numbers/）

**题目详细描述**：请你实现一个「数字乘积类」`ProductOfNumbers`，要求支持下述两种方法：
1. `add(int num)`：将数字 `num` 添加到当前数字列表的最后面。
2. `getProduct(int k)`：返回当前数字列表中最后 `k` 个数字的乘积。你可以假设当前列表中始终至少包含 `k` 个数字。

题目数据保证：任何时候，任一连续数字序列的乘积都在 32 位整数范围内，不会溢出。

**示例**：
```
输入：
["ProductOfNumbers","add","add","add","add","add","getProduct","getProduct","getProduct","add","getProduct"]
[[],[3],[0],[2],[5],[4],[2],[3],[4],[8],[2]]

输出：
[null,null,null,null,null,null,20,40,0,null,32]

解释：
ProductOfNumbers productOfNumbers = new ProductOfNumbers();
productOfNumbers.add(3);        // [3]
productOfNumbers.add(0);        // [3,0]
productOfNumbers.add(2);        // [3,0,2]
productOfNumbers.add(5);        // [3,0,2,5]
productOfNumbers.add(4);        // [3,0,2,5,4]
productOfNumbers.getProduct(2); // 返回 20 = 5 * 4
productOfNumbers.getProduct(3); // 返回 40 = 2 * 5 * 4
productOfNumbers.getProduct(4); // 返回 0 = 3 * 0 * 2 * 5
productOfNumbers.add(8);        // [3,0,2,5,4,8]
productOfNumbers.getProduct(2); // 返回 32 = 4 * 8
```

**解题思路**：使用前缀积数组动态维护。核心步骤：
1. 添加数字：若为0则重置prefix为[1]，否则追加新的前缀积
2. 查询乘积：判断是否有足够元素，足够则用"前len-1个元素的积 ÷ 前len-1-n个元素的积"得到结果

```JavaScript
/**
 * LeetCode 1352. 最后 K 个数的乘积
 * 核心思路：前缀积数组，动态添加元素并查询
 */
class ProductOfNumbers {
  constructor() {
    // 前缀乘积数组：prefix[i] 表示前i个添加元素的乘积（不包含第i个添加元素）
    // 初始化含虚拟基准位prefix[0] = 1，添加元素时动态追加
    this.prefix = [1];
  }

  /**
   * 添加数字的核心逻辑：
   * - 加0：重置prefix为[1]（因为包含0的乘积都是0，没必要留之前的数据）
   * - 加非0：追加新的前缀积（前i个元素的积，不包含当前元素，即前一个前缀积 × 当前数）
   */
  add(val) {
    // 情况1：添加的是0 → 重置prefix为[1]（后续添加元素重新计算前缀积）
    if (val === 0) {
      this.prefix = [1];
      return;
    }

    // 情况2：添加的是非0 → 计算新的前缀积（前i个元素的积，不包含当前元素）并追加
    const lastProduct = this.prefix[this.prefix.length - 1];
    this.prefix.push(lastProduct * val);
  }

  /**
   * 查询最近n个元素的乘积：
   * - 先判断是否有足够元素（prefix长度-1 ≥ n）→ 不足则返回0（可能包含0）
   * - 足够则用"前len-1个元素的积 ÷ 前len-1-n个元素的积"得到结果
   */
  getProduct(n) {
    const len = this.prefix.length;
    // 边界1：前缀积数组长度-1 < n → 要么元素不足，要么包含0，返回0
    if (len - 1 < n) {
      return 0;
    }

    // 边界2：长度-1 ≥ n → 最近n个元素的积 = 前(len-1)个积 ÷ 前(len-1-n)个积
    return this.prefix[len - 1] / this.prefix[len - 1 - n];
  }
}
```

## 四、进阶技巧：前缀和 + 哈希表

当需要「寻找满足特定和条件的子数组」时，基于前缀和（prefix[i] 表示前i个元素和，不包含nums[i]），结合哈希表可将时间复杂度从  $O(n^2)$  优化到  $O(n)$ 。核心思路是：用哈希表记录前缀和（或余数）的首次出现索引/出现次数，快速匹配目标条件。

### 4.1 核心公式

对于子数组`nums[left...right]` 的和满足条件（prefix[i] 表示前i个元素和，不包含nums[i]）：

- 和为k：`prefix[right+1] - prefix[left] = k` → 变形为：`prefix[left] = prefix[right+1] - k`（无需区分left是否为0，简化计算）

- 和为k的倍数：`(prefix[right+1] - prefix[left]) % k = 0` → 变形为：`prefix[left] % k = prefix[right+1] % k`（同余定理）

- 和为0（0/1数组）：将0替换为-1后，`prefix[right+1] - prefix[left] = 0` → 变形为：`prefix[left] = prefix[right+1]`（直接匹配前缀和相等）

### 4.2 高频面试题解析

#### LeetCode 560. 和为K的子数组（https://leetcode.cn/problems/subarray-sum-equals-k/）

**题目详细描述**：给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的连续子数组的个数 。子数组是数组中元素的连续非空序列。

**解题思路**：使用前缀和+哈希表统计子数组个数。核心步骤：
1. 实时计算前缀和（遍历到i时，prefix表示前i+1个元素和）
2. 核心公式：子数组和为k等价于 prefix[left] = prefix[right+1] - k，在哈希表中查找是否存在 prefix - k，存在则累加其出现次数
3. 哈希表初始化[[0,1]]，处理子数组从开头开始的场景
4. 遍历过程中同步更新哈希表，记录每个前缀和的出现次数

```JavaScript

/**
 * LeetCode 560. 和为K的子数组
 * 核心思路：前缀和+哈希表（统计前缀和出现次数）
 * 核心公式：
 *   子数组和=prefix[right+1] - prefix[left] = k → prefix[left] = prefix[right+1] - k
 * @param {number[]} nums 整数数组（可正/负/0）
 * @param {number} k 目标和
 * @return {number} 和为k的子数组个数
 */
var subarraySum = function(nums, k) {
  const len = nums.length;
  // 边界：空数组直接返回0
  if (len === 0) return 0;

  let prefix = 0; // 实时计算的前缀和（遍历到i时，prefix = prefix[i+1]，表示前i+1个元素和）
  /**
   * 【易错点1：哈希表初始化必须是[0, 1]】
   * 作用：处理「left=0，子数组从开头到i（包含i），和为k」的场景
   * 此时prefix[right+1] = k → prefix[left] = 0 = k - k → 需统计0出现过1次
   * 例：nums=[2],k=2 → prefix=2 → 2-k=0 → count+=map.get(0)=1（正确）
   */
  const map = new Map([[0, 1]]);
  let count = 0; // 统计符合条件的子数组个数

  for (let i = 0; i < len; i++) {
    prefix += nums[i]; // 遍历到i，prefix即为prefix[i+1]（前i+1个元素和，不包含nums[i+1]）
    const key = prefix - k; // 找需要的prefix[left]（满足prefix[left] = prefix[right+1] - k）

    // 【易错点2：累加次数而非只加1】
    // 若key存在，说明有map.get(key)个prefix[left]满足条件 → 对应map.get(key)个子数组
    if(map.has(key)) {
      count += map.get(key);
    }

    /**
     * 【易错点3：必须更新所有前缀和的次数】
     * 无论key是否存在，都要更新当前前缀和（prefix[i+1]）的出现次数：
     * - 存在则+1，不存在则设为1（map.get(prefix)||0 处理“不存在”的情况）
     */
    map.set(prefix, (map.get(prefix) || 0) + 1);
  }

  return count;
};
```

#### LeetCode 974. 和可被K整除的子数组（https://leetcode.cn/problems/subarray-sums-divisible-by-k/）

**题目详细描述**：给你一个整数数组 `nums` 和一个整数 `k`，返回其中元素之和可被 `k` 整除的（连续、非空）子数组的数目。子数组是数组中的一个连续部分。

**示例 1**：输入：`nums = [4,5,0,-2,-3,1], k = 5` 输出：`7` 解释：有 7 个子数组满足其元素之和可被 k = 5 整除：[4, 5, 0, -2, -3], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]

**示例 2**：输入：`nums = [5], k = 9` 输出：`0`

**解题思路**：使用前缀和+同余定理+哈希表。核心步骤：
1. 核心推导：子数组和可被k整除等价于 prefix[left] % k = prefix[right+1] % k（同余定理）
2. 实时计算前缀和并计算其对k的非负余数（注意处理负数取模：使用 (prefix % k + k) % k）
3. 用哈希表记录每个余数的出现次数，初始化[[0,1]]，处理子数组从开头开始的场景
4. 遍历过程中，若当前余数已存在则累加其出现次数，然后更新哈希表

```JavaScript

/**
 * LeetCode 974. 和可被 K 整除的子数组
 * 题目要求：统计数组中「和能被k整除」的连续子数组个数（子数组非空）
 * 核心数学推导：
 *   子数组 nums[left...right] 的和 = prefix[right+1] - prefix[left]
 *   若该和%k=0 → prefix[left]%k = prefix[right+1]%k（同余定理，无需区分边界）
 *   → 统计相同余数出现的次数，累加组合数即可得到结果
 * 时间复杂度：O(n)，空间复杂度：O(n)
 * @param {number[]} nums 整数数组（可正/负/0）
 * @param {number} k 正整数除数（题目保证k≥1）
 * @return {number} 符合条件的子数组个数
 */
var subarraysDivByK = function(nums, k) {
  const len = nums.length;
  // 【易错点1：边界处理】空数组无任何子数组，直接返回0
  if (len === 0) return 0;

  let prefix = 0; // 实时计算的前缀和（遍历到i时，prefix = prefix[i+1]，前i+1个元素和）
  /**
   * 哈希表设计规则：
   * key：前缀和%k的「非负余数」（0~k-1）
   * value：该余数出现的次数
   * 初始化[0, 1]：处理「left=0，子数组从开头到i，和可被k整除」的场景
   * 例：nums=[5],k=5 → prefix=5 → mod=0 → count += map.get(0)=1（正确统计该子数组）
   */
  const map = new Map([[0, 1]]);
  let count = 0; // 统计符合条件的子数组总个数

  // 遍历数组，逐位计算前缀和并统计余数
  for (let i = 0; i < len; i++) {
    prefix += nums[i]; // 累加当前元素，prefix即为prefix[i+1]（前i+1个元素和）

    /**
     * 【易错点2：负数取模核心修正】
     * 问题：JS中取余结果符号与被除数一致（如-1%5=-1），但我们需要数学意义的非负余数
     * 公式推导：
     *  1. prefix%k → 得到原始余数（可能为负）
     *  2. +k → 把负数余数转为正数（正数余数加k后会超过k）
     *  3. %k → 约束余数在0~k-1范围内
     * 反例：prefix=-1, k=5 → (-1%5 +5)%5 = (-1+5)%5=4（正确数学余数）
     * 错误写法：Math.abs(prefix%k)（如-1%5=-1 → abs后=1，错误）
     */
    const mod = (prefix % k + k) % k;

    // 核心逻辑：当前余数已出现过 → 累加该余数的出现次数
    // 例：余数0出现3次 → 新增1次时，可组成3个新的符合条件的子数组
    if (map.has(mod)) {
      count += map.get(mod);
    }

    /**
     * 【易错点3：哈希表更新规则】
     * 1. 存在该余数 → 次数+1；不存在 → 初始化为1
     * 2. 必须在统计count后更新（避免把当前余数计入本次统计）
     * 3. 所有余数都要更新（无论正负/是否统计过）
     */
    const newVal = (map.get(mod) || 0) + 1;
    map.set(mod, newVal);
  }

  // 返回最终统计的符合条件的子数组个数
  return count;
};

// --------------- 测试用例（覆盖核心场景）---------------
// 测试1：经典用例（包含正/负/0）
// nums = [4,5,0,-2,-3,1] → prefix（前i+1个和） = [4,9,9,7,4,5]
// console.log(subarraysDivByK([4,5,0,-2,-3,1], 5)); // 预期7 ✅
// // 测试2：单元素场景（left=0）
// console.log(subarraysDivByK([5], 5));             // 预期1 ✅
// // 测试3：负数场景（验证取模公式）
// console.log(subarraysDivByK([-1,2,9], 2));        // 预期2 ✅
// // 测试4：全负数场景
// console.log(subarraysDivByK([-5,-10,-15], 5));    // 预期6 ✅
// // 测试5：无符合条件场景
// console.log(subarraysDivByK([1,2,3], 7));         // 预期0 ✅
```

#### LeetCode 525. 连续数组（https://leetcode.cn/problems/contiguous-array/）

**题目详细描述**：给定一个二进制数组 `nums`，找到含有相同数量的 `0` 和 `1` 的最长连续子数组（的长度）。如果不存在这样的子数组，返回 `0`。

**示例 1**：输入：`nums = [0,1]` 输出：`2` 解释：`[0, 1]` 是具有相同数量 0 和 1 的最长连续子数组。

**示例 2**：输入：`nums = [0,1,0]` 输出：`2` 解释：`[0, 1]`（或 `[1, 0]`）是具有相同数量 0 和 1 的最长连续子数组。

**解题思路**：将问题转化为"和为0的最长连续子数组"，使用前缀和+哈希表。核心步骤：
1. 问题转化：将0替换为-1，此时"0和1数量相等"等价于"子数组和为0"
2. 核心公式：子数组和为0等价于 prefix[left] = prefix[right+1]
3. 实时计算前缀和，用哈希表记录每个前缀和第一次出现的索引（确保子数组最长）
4. 哈希表初始化[[0, -1]]，处理子数组从开头开始的场景，遍历过程中若前缀和已存在则计算索引差更新最大值，否则记录索引

```JavaScript

/**
 * LeetCode 525. 连续数组 - 最优解（前缀和+哈希表）
 * 题目要求：找到二进制数组中0和1数量相等的最长连续子数组长度
 * 核心思路：
 *  1. 0替换为-1，将问题转化为「找和为0的最长连续子数组」
 *  2. 和为0的公式：prefix[right+1] - prefix[left] = 0 → prefix[left] = prefix[right+1]
 *  3. 哈希表记录前缀和第一次出现的索引（保证子数组最长）
 * @param {number[]} nums 仅包含0和1的二进制数组
 * @return {number} 符合条件的最长子数组长度
 */
var findMaxLength = function(nums) {
  const len = nums.length;

  // 【易错点1：边界处理】长度0或1时，不可能有0和1数量相等的子数组，直接返回0
  // 优化：合并len=0和len=1的判断，更简洁
  if (len <= 1) return 0;

  // 【核心：哈希表初始化】
  // key：前缀和；value：该前缀和第一次出现的索引（对应prefix[left]的索引left）
  // 【易错点2：初始化(0, -1)】处理「left=0，prefix[right+1]=0」的场景
  // 比如nums=[0,1]（替换后[-1,1]）→ prefix=[-1,0]，right=1时prefix=0，索引差=1 - (-1) = 2（正确长度）
  const map = new Map([[0, -1]]);
  
  let prefix = 0; // 实时计算的前缀和（遍历到i时，prefix = prefix[i+1]，前i+1个元素和）
  let maxLen = 0; // 最长子数组长度，初始化为0（避免后续冗余判断）

  // 遍历数组，实时计算前缀和并更新哈希表/最大长度
  for (let i = 0; i < len; i++) {
    // 0替换为-1，更新前缀和（prefix即为prefix[i+1]，前i+1个元素和）
    // 【易错点3：运算符优先级】必须先算三元表达式，再累加prefix
    // 错误写法：prefix = nums[i]===0?-1:1 + prefix（加法优先级高于三元，会算成1+prefix）
    prefix += nums[i] === 0 ? -1 : 1; 

    // 情况1：当前前缀和已存在 → 找到和为0的子数组
    if (map.has(prefix)) {
      // 子数组范围：[map.get(prefix)+1 ... i]（包含两端），长度 = i - map.get(prefix)
      // 解释：map.get(prefix)是prefix[left]的索引left，right=i，子数组长度=right - left
      const currentLen = i - map.get(prefix);
      // 更新最大长度（取较大值）
      maxLen = Math.max(maxLen, currentLen);
    } else {
      // 情况2：当前前缀和首次出现 → 记录索引（【易错点4：只存第一次出现的索引】，保证子数组最长）
      // 反例：若存最后一次出现的索引，会得到最短子数组，不符合题意
      map.set(prefix, i);
    }
  }

  // 无需额外判断：无符合条件的子数组时，maxLen始终为0，直接返回即可
  return maxLen;
};

// 测试用例（覆盖所有核心场景）
// console.log(findMaxLength([0,1]));        // 预期：2（基础场景）
// console.log(findMaxLength([0,1,0]));      // 预期：2（非首尾符合条件）
// console.log(findMaxLength([0,0,1,1,0]));  // 预期：4（复杂场景）
// console.log(findMaxLength([1]));          // 预期：0（长度1）
// console.log(findMaxLength([]));           // 预期：0（空数组）
// console.log(findMaxLength([0,0,0]));      // 预期：0（无符合条件的子数组）
```

#### LeetCode 523. 连续的子数组和（https://leetcode.cn/problems/continuous-subarray-sum/）

**题目详细描述**：给你一个整数数组 `nums` 和一个整数 `k`，编写一个函数来判断该数组是否含有同时满足下述条件的连续子数组：子数组大小 至少为 2，且子数组元素总和为 `k` 的倍数（即总和 % k == 0）。如果存在，返回 `true`；否则，返回 `false`。

**示例 1**：输入：`nums = [23,2,4,6,7], k = 6` 输出：`true` 解释：`[2,4]` 是一个大小为 2 的子数组，并且和为 6。

**示例 2**：输入：`nums = [23,2,6,4,7], k = 6` 输出：`true` 解释：`[23, 2, 6, 4, 7]` 是大小为 5 的子数组，并且和为 42。42 是 6 的倍数，因为 42 = 7 * 6 且 7 是一个整数。

**示例 3**：输入：`nums = [23,2,6,4,7], k = 13` 输出：`false`

**解题思路**：使用前缀和+同余定理+哈希表判断。核心步骤：
1. 核心推导：子数组和为k的倍数且长度≥2等价于 prefix[left] % k = prefix[right+1] % k 且索引差≥2
2. 实时计算前缀和及其余数，用哈希表记录每个余数第一次出现的索引（保证索引差最大）
3. 哈希表初始化[[0, -1]]，处理子数组从开头开始的场景
4. 遍历过程中，若当前余数已存在且索引差≥2则返回true，否则不更新哈希表（避免覆盖首次索引），若不存在则记录索引

```JavaScript

/**
 * LeetCode 523. 连续的子数组和
 * 题目要求：判断是否存在长度≥2的连续子数组，其和为k的倍数（sum%k===0）
 * 核心理论：同余定理
 *   子数组和%k=0 → prefix[left]%k = prefix[right+1]%k
 *   即：两个前缀和的余数相同 → 中间子数组的和是k的倍数
 * @param {number[]} nums 非负整数数组
 * @param {number} k 正整数除数
 * @return {boolean} 是否存在符合条件的子数组
 */
var checkSubarraySum = function(nums, k) {
  const len = nums.length;

  // 【易错点1：边界处理】长度<2时，不可能有符合条件的子数组（题目要求长度≥2）
  // 覆盖len=0/1两种情况，直接返回false
  if (len <= 1) return false;

  /**
   * 哈希表设计：
   * key：前缀和 % k 的余数
   * value：该余数第一次出现的索引（核心！只存第一次，保证索引差最大，更容易满足长度≥2）
   * 初始化[0, -1]：处理「left=0，prefix[right+1]%k=0」的场景
   * 例如：nums=[2,4],k=6 → prefix=[2,6] → 6%6=0 → 索引差=1 - (-1)=2（满足长度≥2）
   */
  const map = new Map([[0, -1]]);
  
  let prefix = 0; // 实时计算的前缀和（遍历到i时，prefix = prefix[i+1]，前i+1个元素和）

  // 遍历数组，逐位计算前缀和并验证同余条件
  for (let i = 0; i < len; i++) {
    prefix += nums[i]; // 累加当前元素到前缀和，prefix即为prefix[i+1]（前i+1个元素和）
    const mod = prefix % k; // 计算当前前缀和对k的余数

    // 情况1：当前余数已在哈希表中（找到同余的前缀和）
    if (map.has(mod)) {
      // 【易错点2：长度校验】必须保证子数组长度≥2
      // 子数组范围：[map.get(mod)+1 ... i] → 长度 = i - map.get(mod)
      if (i - map.get(mod) >= 2) {
        return true; // 找到符合条件的子数组，直接返回true
      }
      // 【易错点3：不更新哈希表】即使余数存在但长度不够，也不更新索引
      // （若更新，会覆盖第一次出现的索引，导致后续索引差变小，错过符合条件的子数组）
      continue;
    }

    // 情况2：当前余数首次出现 → 存入哈希表（记录第一次出现的索引）
    map.set(mod, i);
  }

  // 遍历结束未找到符合条件的子数组
  return false;
};

// --------------- 测试用例（覆盖核心场景）---------------
// 测试1：基础场景（长度2，和为k的倍数）
// console.log(checkSubarraySum([23,2,4,6,7], 6)); // true（[2,4]和为6，长度2）
// // 测试2：全0场景（边界值）
// console.log(checkSubarraySum([0,0], 1));         // true（长度2，和为0是1的倍数）
// // 测试3：长度不够（索引差1）
// console.log(checkSubarraySum([23,2], 6));        // false（无符合条件的子数组）
// // 测试4：无符合条件的场景
// console.log(checkSubarraySum([23,2,6,4,7], 13));// false
// // 测试5：从开头开始的长数组
// console.log(checkSubarraySum([1,2,3], 6));       // true（[1,2,3]和为6，长度3）
```

### 4.3 寻找数组的中心下标（力扣724，https://leetcode.cn/problems/find-pivot-index/）

**题目详细描述**：给你一个整数数组 `nums`，请计算数组的 中心下标。数组 中心下标 是数组的一个下标，其左侧所有元素相加的和等于右侧所有元素相加的和。如果中心下标位于数组最左端，那么左侧数之和视为 0，因为在下标的左侧不存在元素。这一点对于中心下标位于数组最右端同样适用。如果数组有多个中心下标，应该返回 最靠近左边 的那一个。如果数组不存在中心下标，返回 -1。

**示例 1**：输入：`nums = [1, 7, 3, 6, 5, 6]` 输出：`3` 解释：中心下标是 3。左侧数之和 sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11，右侧数之和 sum = nums[4] + nums[5] = 5 + 6 = 11，二者相等。

**示例 2**：输入：`nums = [1, 2, 3]` 输出：`-1` 解释：数组中不存在满足此条件的中心下标。

**示例 3**：输入：`nums = [2, 1, -1]` 输出：`0` 解释：中心下标是 0。左侧数之和 sum = 0（下标 0 左侧不存在元素），右侧数之和 sum = nums[1] + nums[2] = 1 + (-1) = 0。

**解题思路**：使用前缀和。核心步骤：
1. 构建前缀和数组：prefix[i] = nums[0]+...+nums[i-1]（不包含nums[i]）
2. 遍历每个索引j，判断是否为中心索引：左侧和 = prefix[j]，右侧和 = prefix[len] - prefix[j+1]
3. 若左侧和等于右侧和，返回当前索引；否则继续遍历，未找到则返回-1

```JavaScript
/**
 * LeetCode 724. 寻找数组的中心下标 - 前缀和解法
 * 核心思路：
 *  中心索引j满足「左侧元素和 = 右侧元素和」
 *  左侧和：nums[0..j-1] 的和 = prefix[j]（前j个元素和，不包含nums[j]）
 *  右侧和：nums[j+1..len-1] 的和 = prefix[len] - prefix[j+1]（总元素和 - 前j+1个元素和）
 *  核心公式：prefix[j] = prefix[len] - prefix[j+1]
 * @param {number[]} nums 整数数组（可含负数/0）
 * @return {number} 中心索引（无则返回-1）
 */
var pivotIndex = function(nums) {
  const len = nums.length;
  // 边界1：空数组直接返回-1
  if (len === 0) return -1;
  // 边界2：单元素数组，中心索引就是0（左右和都为0）
  if (len === 1) return 0;

  // 步骤1：构建前缀和数组：prefix[i] = nums[0]+...+nums[i-1]（不包含nums[i]）
  const prefixNums = new Array(len + 1);
  prefixNums[0] = 0; // 虚拟基准位，前0个元素和为0
  for (let i = 1; i <= len; i++) {
    prefixNums[i] = prefixNums[i - 1] + nums[i - 1]; // 累加前一个前缀和，不包含当前nums[i]
  }

  // 步骤2：遍历每个索引，判断是否为中心索引
  const totalSum = prefixNums[len]; // 数组总和（prefix[len] = 前len个元素和，即所有元素和）
  for (let j = 0; j < len; j++) {
    const leftSum = prefixNums[j]; // 左侧和：前j个元素和，不包含nums[j]
    const rightSum = totalSum - prefixNums[j + 1]; // 右侧和：总元素和 - 前j+1个元素和
    if (leftSum === rightSum) {
      return j; // 找到中心索引，直接返回（题目要求最左侧的）
    }
  }

  // 场景3：遍历完无中心索引，返回-1
  return -1;
};

// 测试用例验证
// nums=[1,7,3,6,5,6] → prefixNums=[0,1,8,11,17,22,28]，totalSum=28
// j=3时：leftSum=prefixNums[3]=11，rightSum=28 - prefixNums[4]=28-17=11 → 符合条件，返回3 ✅
console.log(pivotIndex([1,7,3,6,5,6])); // 预期输出：3
console.log(pivotIndex([1,2,3]));       // 预期输出：-1
console.log(pivotIndex([2,1,-1]));      // 预期输出：0
console.log(pivotIndex([1]));           // 预期输出：0
console.log(pivotIndex([]));            // 预期输出：-1
```

优化版（无需存储前缀和数组，空间优化）：

```JavaScript
/**
 * LeetCode 724. 寻找数组的中心下标 - 前缀和解法
 * 核心思路：
 *  中心索引j满足「左侧元素和 = 右侧元素和」
 *  左侧和：nums[0..j-1] 的和 = prefix[j]（前j个元素和，不包含nums[j]）
 *  右侧和：nums[j+1..len-1] 的和 = prefix[len] - prefix[j+1]（总元素和 - 前j+1个元素和）
 *  核心公式：prefix[j] = prefix[len] - prefix[j+1]
 * @param {number[]} nums 整数数组（可含负数/0）
 * @return {number} 中心索引（无则返回-1）
 */
var pivotIndex = function(nums) {
  const len = nums.length;
  if (len === 0) return -1;
  if (len === 1) return 0;

  const totalSum = nums.reduce((acc, cur) => acc + cur, 0); // 数组总和
  let leftSum = 0; // 实时累加左侧和（nums[0..j-1]的和）

  for (let j = 0; j < len; j++) {
    // 右侧和 = 总和 - 左侧和 - 当前元素
    const rightSum = totalSum - leftSum - nums[j];
    if (leftSum === rightSum) {
      return j;
    }
    leftSum += nums[j]; // 累加当前元素，作为下一个索引的左侧和
  }

  return -1;
};
```

## 五、核心易错点总结

|场景|易错点|解决方案|
|---|---|---|
|前缀和初始化|遗漏虚拟基准位（prefix[0]≠0），或长度错误|prefix[0]=0，长度=原数组长度+1，无需额外处理边界|
|负数取模|使用`Math.abs(prefix%k)`|用`(prefix%k +k)%k`保证余数非负|
|哈希表更新|覆盖首次出现的索引|只记录前缀和/余数**第一次出现**的索引|
|子数组长度|未校验长度≥2，或索引差计算错误|索引差=当前i - map.get(mod)，需≥2（对应子数组长度）|
|运算符优先级|三元表达式与加法混用|给三元表达式加括号（如`prefix += (nums[i]===0?-1:1)`）|
|统计次数|只加1而非累加出现次数|`count += map.get(key)`（而非`count++`）|
|区间和公式|误用自定义公式|牢记公式：sum = prefix[right+1] - prefix[left]|
