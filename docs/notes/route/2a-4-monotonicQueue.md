# 单调队列：滑动窗口极值问题的最优解（通用模板版）

![mono_queue.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1d366727993947ddb50b198ec20a0fe5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?rk3s=f64ab15b&x-expires=1773044998&x-signature=JfsA%2B18WMebs9Y2SDpHIZWfyelY%3D)

单调队列是处理滑动窗口极值问题的「最优解」，其核心价值在于能在 $O(1)$ 时间复杂度内获取窗口的最大值/最小值，将整体问题的时间复杂度从暴力解法的 $O(nk)$ 优化到 $O(n)$ 。本文将从「通用模板设计」出发，结合经典题目实战，让你彻底掌握单调队列的使用逻辑。

## 一、单调队列核心原理

### 1.1 解决的核心问题

滑动窗口类问题中，需要频繁获取窗口内的最大值/最小值，且窗口会动态扩张/收缩（如：滑动窗口最大值、子数组极值差限制等）。

### 1.2 核心设计思想

- 维护两个「单调队列」：一个**单调递减队列**（队头为窗口最大值）、一个**单调递增队列**（队头为窗口最小值）；

- 队列中存储「元素索引」而非元素值，通过索引关联原始数组，避免值重复导致的删除错误；

- 入队时「弹尾」：移除队列中破坏单调性的元素，保证队列的单调特性；

- 出队时「删头」：若移除的元素是当前极值，同步删除极值队列的队头。

### 1.3 通用模板（支持最大值/最小值）

```JavaScript

/**
 * 通用单调队列（存储索引，支持O(1)获取最大/最小值）
 * @param {number[]} nums 原始数组
 */
class MonotonicQueue {
  constructor(nums) {
    this.nums = nums; // 原始数组，通过索引取值
    this.data = []; // 存储窗口内元素的索引（保证先进先出）
    this.maxQueue = []; // 单调递减队列（队头=最大值）
    this.minQueue = []; // 单调递增队列（队头=最小值）
  }

  /** 向队尾添加元素（传入索引） */
  push(idx) {
    this.data.push(idx);

    // 维护单调递减的最大值队列
    while (this.maxQueue.length && this.nums[this.maxQueue.at(-1)] < this.nums[idx]) {
      this.maxQueue.pop();
    }
    this.maxQueue.push(idx);

    // 维护单调递增的最小值队列
    while (this.minQueue.length && this.nums[this.minQueue.at(-1)] > this.nums[idx]) {
      this.minQueue.pop();
    }
    this.minQueue.push(idx);
  }

  /** 从队头移除元素 */
  shift() {
    if (this.isEmpty()) {
      throw new Error('MonotonicQueue: 空队列无法执行shift操作');
    }
    const delIdx = this.data.shift();

    // 同步更新最大值队列
    if (this.maxQueue.length && this.maxQueue[0] === delIdx) {
      this.maxQueue.shift();
    }

    // 同步更新最小值队列
    if (this.minQueue.length && this.minQueue[0] === delIdx) {
      this.minQueue.shift();
    }

    return this.nums[delIdx];
  }

  /** 获取窗口内最大值 */
  max() {
    if (this.maxQueue.length === 0) {
      throw new Error('MonotonicQueue: 空队列无法获取最大值');
    }
    return this.nums[this.maxQueue[0]];
  }

  /** 获取窗口内最小值 */
  min() {
    if (this.minQueue.length === 0) {
      throw new Error('MonotonicQueue: 空队列无法获取最小值');
    }
    return this.nums[this.minQueue[0]];
  }

  /** 获取窗口左边界索引 */
  frontIdx() {
    return this.data[0];
  }

  /** 判断队列是否为空 */
  isEmpty() {
    return this.data.length === 0;
  }

  /** 获取队列长度 */
  size() {
    return this.data.length;
  }
}
```

## 二、经典题目实战（统一使用通用模板）

### 2.1 滑动窗口最大值（基础入门）

- **题目链接**：[LeetCode 239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

- **题目介绍**：给定数组和窗口大小k，返回每个滑动窗口的最大值。

- **示例**：

输入：nums = [1,3,-1,-3,5,3,6,7], k = 3

输出：[3,3,5,5,6,7]

- **解题思路**：
  1. 用通用单调队列存储窗口内元素索引，通过`max()`方法获取窗口最大值；

  2. 窗口右移时，先移除窗口左侧元素（索引`i-k`），再添加当前元素（索引`i`）；

  3. 窗口长度≥k时，记录当前窗口最大值。

- **代码实现**：

```JavaScript

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const n = nums.length;
  if (n <= 1) return nums;
  if (k === 1) return nums;

  const res = [];
  // 初始化通用单调队列（传入原始数组）
  const window = new MonotonicQueue(nums);

  // 形成第一个窗口（前k个元素）
  for (let i = 0; i < k; i++) {
    window.push(i); // 传入索引，而非值
  }
  res.push(window.max()); // 获取第一个窗口的最大值

  // 移动窗口（右指针从k到n-1）
  for (let i = k; i < n; i++) {
    // 移除窗口左侧的元素（索引i-k）
    window.shift();
    // 添加当前元素（索引i）
    window.push(i);
    // 记录当前窗口最大值
    res.push(window.max());
  }

  return res;
};
```

### 2.2 绝对差不超过限制的最长连续子数组

- **题目链接**：[LeetCode 1438. 绝对差不超过限制的最长连续子数组](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)

- **题目介绍**：找出最长的连续子数组，使得子数组中任意两个元素的绝对差≤限制。

- **示例**：

输入：nums = [8,2,4,7], limit = 4

输出：2

- **解题思路**：
  1. 滑动窗口+通用单调队列（通过`max()`/`min()`获取窗口极值）；

  2. 右指针扩展窗口，当`max()-min()>limit`时，左指针收缩窗口；

  3. 记录窗口的最大长度。

- **代码实现**：

```JavaScript

/**
 * @param {number[]} nums 输入数组
 * @param {number} limit 绝对差限制
 * @return {number} 满足条件的最长子数组长度
 */
var longestSubarray = function (nums, limit) {
  const n = nums.length;
  // 边界处理：空数组直接返回0
  if (n === 0) return 0;

  const window = new MonotonicQueue(nums); // 初始化单调队列
  let maxLen = 0; // 记录最长子数组长度

  // 右指针遍历数组，扩张窗口
  for (let i = 0; i < n; i++) {
    // 第一步：将当前元素加入单调队列（必须先加，才能判断窗口是否满足条件）
    window.push(i);

    // 第二步：收缩窗口：当窗口内最大值-最小值 > limit 时，移动左指针
    while (window.max() - window.min() > limit) {
      // 移除窗口左侧的元素
      window.shift();
    }

    // 第三步：更新最长子数组长度
    maxLen = Math.max(maxLen, i - window.frontIdx() + 1);
  }

  // 返回最长子数组长度
  return maxLen;
};

// 测试用例
console.log(longestSubarray([8, 2, 4, 7], 4)); // 预期2 ✅
console.log(longestSubarray([10, 1, 2, 4, 7, 2], 5)); // 预期4 ✅
```

### 2.3 环形子数组的最大和

- **题目链接**：[LeetCode 918. 环形子数组的最大和](https://leetcode.cn/problems/maximum-sum-circular-subarray/)

- **题目介绍**：给定环形数组，返回其非空子数组的最大和（子数组可跨首尾）。

- **示例**：

输入：nums = [5,-3,5]

输出：10

- **解题思路**：
  1. 双倍前缀和模拟环形数组：nums + nums；

  2. 用通用单调队列维护窗口内前缀和的最小值（通过`min()`方法）；

  3. 保证窗口长度≤n，计算`preSum[i] - window.min()`的最大值。

- **代码实现**：

```JavaScript

/**
 * @param {number[]} nums 输入的环形数组
 * @return {number} 环形数组的最大子数组和
 */
var maxSubarraySumCircular = function (nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // 1. 构建双倍长度的前缀和数组
  const pLen = 2 * n + 1;
  const prefixSum = new Array(pLen).fill(0);
  for (let i = 1; i < pLen; i++) {
    prefixSum[i] = prefixSum[i - 1] + nums[(i - 1) % n];
  }

  let maxSum = -Infinity;
  // 初始化通用单调队列（传入前缀和数组）
  const window = new MonotonicQueue(prefixSum);
  window.push(0); // 加入前缀和的基准点（索引0）

  // 遍历前缀和（i从1到2n）
  for (let i = 1; i < pLen; i++) {
    // 计算当前最大子数组和：当前前缀和 - 窗口内最小前缀和
    maxSum = Math.max(maxSum, prefixSum[i] - window.min());

    // 收缩窗口：保证窗口长度<n
    while (window.size() === n) {
      window.shift();
    }

    // 添加当前前缀和索引到窗口
    window.push(i);
  }


  return maxSum;
};

// 测试用例
// console.log(maxSubarraySumCircular([5, -3, 5])); // 预期10 ✅
// console.log(maxSubarraySumCircular([-3, -2, -1])); // 预期-1 ✅
```

### 2.4 连续子数组的数目

- **题目链接**：[LeetCode 2762. 连续子数组的数目](https://leetcode.cn/problems/continuous-subarrays/)

- **题目介绍**：统计所有满足「最大值-最小值≤2」的连续子数组数量。

- **示例**：

输入：nums = [5,4,2,4]

输出：8

- **解题思路**：
  1. 滑动窗口+通用单调队列（通过`max()`/`min()`获取窗口极值）；

  2. 遍历右指针，收缩左指针保证`max()-min()≤2`；

  3. 统计以每个右指针为结尾的合法子数组数量。

- **代码实现**：

```JavaScript

/**
 * @param {number[]} nums 输入数组
 * @return {number} 满足条件的子数组总数
 */
var continuousSubarrays = function (nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // 初始化通用单调队列
  const window = new MonotonicQueue(nums);
  let count = 0;

  for (let i = 0; i < n; i++) {
    // 添加当前元素（索引i）到窗口
    window.push(i);

    // 收缩左边界：直到max-min ≤ 2
    while (window.max() - window.min() > 2) {
      window.shift();
    }

    // 统计以i为右边界的合法子数组数量（窗口长度=window.size()）
    count += window.size();
  }

  return count;
};

// 测试用例
console.log(continuousSubarrays([5,4,2,4])); // 预期8 ✅
```

### 2.5 和至少为 K 的最短子数组

- **题目链接**：[LeetCode 862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/)

- **题目介绍**：找出和至少为k的最短非空子数组，不存在则返回-1。

- **示例**：

输入：nums = [1], k = 1

输出：1

- **解题思路**：
  1. 前缀和转换：子数组和 = preSum[j] - preSum[i]（j > i）；

  2. 用数组模拟单调递增队列（存储前缀和索引），无需通用模板（因本题仅需维护前缀和单调性，非窗口极值）；

  3. 遍历前缀和时，收缩队头找到满足条件的最短子数组。

- **代码实现**：

```JavaScript

/**
 * @param {number[]} nums 原始数组
 * @param {number} k 子数组和的下限
 * @return {number} 满足条件的最短子数组长度，无则返回-1
 */
var shortestSubarray = function (nums, k) {
  const n = nums.length;
  if (n === 0) return -1;

  // 1. 构建前缀和数组
  const preSum = new Array(n + 1).fill(0);
  for (let m = 0; m < n; m++) {
    preSum[m + 1] = preSum[m] + nums[m];
  }

  let minLen = Infinity;
  const deque = [];
  deque.push(0);

  for (let m = 1; m <= n; m++) {
    // 维护队列单调性（单调递增）
    while (deque.length > 0 && preSum[m] <= preSum[deque[deque.length - 1]]) {
      deque.pop();
    }

    // 收缩队头，更新最短长度
    while (deque.length > 0 && preSum[m] - preSum[deque[0]] >= k) {
      minLen = Math.min(minLen, m - deque[0]);
      deque.shift();
    }

    deque.push(m);
  }

  return minLen === Infinity ? -1 : minLen;
};

// 测试用例
console.log(shortestSubarray([1], 1)); // 预期1 ✅
console.log(shortestSubarray([2, -1, 2], 3)); // 预期3 ✅
```

## 三、关键总结

1. **通用模板适配性**：
   - 滑动窗口极值问题（239、1438、2762、918）均可直接复用通用模板，仅需调整调用方式；

   - 前缀和+单调队列（862）是特殊场景，通用模板不适用，需单独实现。

2. **核心调用规则**：
   - 初始化队列时传入目标数组（原始数组/前缀和数组）；

   - 入队时传入**索引**，而非值；

   - 通过`max()`/`min()`获取窗口极值，`size()`/`frontIdx()`计算窗口长度。

3. **优势**：统一模板后，无需为每个题目编写单独的队列类，降低代码冗余，提升可维护性，同时避免手动维护左指针、极值队列的易错点。

## 四、避坑指南

1. 不要硬编码边界条件（如`limit===0`返回0），需按逻辑动态判断；

2. 入队和收缩窗口的顺序不能反（必须先入队，再判断是否收缩）；

3. 窗口长度计算需注意`+1`（索引从0开始，如`i=0`时窗口长度为1）；
