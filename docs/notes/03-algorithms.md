# 核心算法思想

## 概述

本文档是**算法题的常用解题技巧/思想分类清单**，是面试和刷题中高频用到的核心方法汇总。每一项都是解决特定类型问题的"通用思路"，掌握这些技巧能帮你快速识别问题类型并选择正确的解题方法。

## 学习路径规划

### 阶段一：基础工具+技巧（必学，每日练）

0. **排序/搜索** - 算法的“基础设施”
   - 排序：快排、归并（搭配数组）
   - 搜索：二分、DFS/BFS（搭配数组、二叉树）
1. **双指针** - 数组/链表的核心技巧（⭐⭐⭐⭐⭐）
2. **滑动窗口** - 连续子数组/子串问题（⭐⭐⭐⭐）
3. **递归** - 分而治之的基础（搭配二叉树）（⭐⭐⭐⭐）

### 阶段二：核心算法（重点，周练）

4. **动态规划（DP）** - 重叠子问题+最优子结构（⭐⭐⭐⭐⭐）
5. **回溯算法** - 穷举所有可能（⭐⭐⭐⭐）
6. **贪心算法** - 局部最优到全局最优（⭐⭐⭐）

### 阶段三：高级应用（进阶，综合练）

7. **分治算法** - 大问题拆解（搭配归并、合并K个链表）
8. **复杂场景综合** - 多技巧结合（比如“双指针+DP”、“滑动窗口+哈希表”）

## 避坑指南（关键）

- 双指针：避免指针越界，明确“指针移动条件”
- 动态规划：先写“状态定义”，再写“转移方程”
- 回溯：必须剪枝，否则会超时
- 贪心：先证明“贪心选择性质”，否则容易错

---

## 一、排序算法（Sorting）- 阶段一：基础工具

排序是算法的基础，掌握常见排序算法有助于理解其他算法。

### 1.1 快速排序（Quick Sort）

**时间复杂度：** 平均 O(nlogn)，最坏 O(n²)  
**空间复杂度：** O(logn)  
**稳定性：** 不稳定

**核心思想：**

- 选择一个基准元素（pivot）
- 将数组分为两部分：小于基准和大于基准
- 递归排序两部分

**适用场景：**

- 一般情况下的高效排序
- 数据量大且随机分布

### 1.2 归并排序（Merge Sort）

**时间复杂度：** O(nlogn)  
**空间复杂度：** O(n)  
**稳定性：** 稳定

**核心思想：**

- 将数组不断二分，直到单个元素
- 合并两个有序数组
- 分治思想的典型应用

**适用场景：**

- 需要稳定排序
- 链表排序
- 外部排序

### 1.3 堆排序（Heap Sort）

**时间复杂度：** O(nlogn)  
**空间复杂度：** O(1)  
**稳定性：** 不稳定

**核心思想：**

- 构建最大堆/最小堆
- 不断取出堆顶元素
- 利用堆的性质排序

**适用场景：**

- 需要原地排序
- TopK 问题

---

## 二、搜索算法（Searching）- 阶段一：基础工具

### 2.1 二分查找（Binary Search）

**时间复杂度：** O(logn)  
**前提条件：** 有序数组

**核心思想：**

- 每次排除一半的搜索空间
- 通过比较中间元素缩小范围

**适用场景：**

- 有序数组查找
- 查找边界问题
- 旋转数组查找

**经典题目：**

- [704. 二分查找](https://leetcode.cn/problems/binary-search/)
- [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

### 2.2 DFS（深度优先搜索）

**适用场景：**

- 图的遍历
- 树的遍历
- 路径问题
- 连通性问题

**核心思想：**

- 一条路走到黑，再回溯
- 利用递归或栈实现

**经典题目：**

- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)
- [79. 单词搜索](https://leetcode.cn/problems/word-search/)

### 2.3 BFS（广度优先搜索）

**适用场景：**

- 最短路径问题（无权图）
- 层序遍历
- 扩散问题

**核心思想：**

- 一层一层遍历
- 利用队列实现

**经典题目：**

- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [127. 单词接龙](https://leetcode.cn/problems/word-ladder/)

---

## 三、双指针（Two Pointers）- 阶段一：核心技巧 ⭐⭐⭐⭐⭐

双指针是数组/链表问题的核心技巧，通过维护两个指针来高效解决问题。

**核心定义**：用**两个指针（索引）** 遍历数据结构（数组/链表），通过指针的"移动规则"减少遍历次数，将时间复杂度从 O(n²) 优化到 O(n)。

**主要分类**：

- **快慢指针**：解决链表环形问题、找中间节点、删除倒数第k个节点
- **左右指针**：解决有序数组两数之和、回文判断、盛水容器
- **固定窗口指针**：解决固定长度子数组问题
- **Vue3 diff 四个指针**：虚拟 DOM 对比算法

**经典题目：**

- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)
- [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

📖 **详细内容请参考：** [双指针详解](https://juejin.cn/post/7593692797765976106)

---

## 四、滑动窗口（Sliding Window）- 阶段一：核心技巧 ⭐⭐⭐⭐

**适用场景：**

- 连续子数组/子串问题
- 最长无重复字符子串
- 最小覆盖子串
- 滑动窗口最大值
- 长度最小的子数组

**核心思想：**

- 用双指针维护一个"动态区间"（窗口）
- 通过移动窗口边界，减少重复计算
- 窗口大小可以是固定的或动态的

**算法模板：**

```typescript
function slidingWindow(s: string): number {
  let left = 0;
  let right = 0;
  const window = new Map(); // 窗口数据

  while (right < s.length) {
    // 扩大窗口
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    right++;

    // 缩小窗口（根据条件）
    while (window需要缩小) {
      const d = s[left];
      window.set(d, window.get(d) - 1);
      left++;
    }

    // 更新结果
  }

  return result;
}
```

**经典题目：**

- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)
- [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)
- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

---

## 五、递归（Recursion）- 阶段一：核心技巧 ⭐⭐⭐⭐

**适用场景：**

- 二叉树遍历（前序、中序、后序）
- 归并排序
- 斐波那契数列
- 汉诺塔问题
- 分而治之的问题

**核心思想：**

- 通过"调用自身"拆解问题
- 必须有终止条件，避免无限递归
- 利用函数调用栈保存状态

**递归三要素：**

1. **终止条件**：递归何时结束
2. **递归关系**：如何拆解问题
3. **返回值**：如何合并子问题的解

**注意事项：**

- 避免栈溢出（深递归时考虑迭代实现）
- 注意重复计算（可用记忆化优化）
- 理解递归调用栈的执行顺序

**经典题目：**

- [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)
- [509. 斐波那契数](https://leetcode.cn/problems/fibonacci-number/)
- [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)

---

## 六、动态规划（Dynamic Programming）- 阶段二：核心算法 ⭐⭐⭐⭐⭐

**适用场景：**

- 重叠子问题 + 最优子结构
- 最长递增子序列
- 背包问题（0-1背包、完全背包）
- 零钱兑换
- 编辑距离
- 股票买卖问题

**核心思想：**

- 用"状态转移方程"记录子问题的解
- 避免重复计算，提升效率
- 自底向上或自顶向下求解

**DP 三要素：**

1. **状态定义**：`dp[i]` 表示什么
2. **状态转移方程**：`dp[i] = f(dp[i-1], ...)`
3. **边界条件**：初始状态

**解题步骤：**

1. 确定状态（一维/二维）
2. 写出状态转移方程
3. 初始化边界条件
4. 确定遍历顺序
5. 举例验证

**经典题目：**

- [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)
- [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)
- [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)
- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
- [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

---

## 七、回溯算法（Backtracking）- 阶段二：核心算法 ⭐⭐⭐⭐

**适用场景：**

- 穷举所有可能的问题
- 全排列
- 组合总和
- N 皇后问题
- 子集问题
- 数独求解

**核心思想：**

- "尝试-回退"机制
- 通过剪枝优化效率
- 利用递归实现状态回溯

**回溯模板：**

```typescript
function backtrack(路径, 选择列表): void {
  // 终止条件
  if (满足条件) {
    结果.push(路径);
    return;
  }

  // 遍历选择
  for (选择 of 选择列表) {
    // 做选择
    路径.push(选择);

    // 递归
    backtrack(路径, 选择列表);

    // 撤销选择（回溯）
    路径.pop();
  }
}
```

**优化技巧：**

- 剪枝：提前排除不可能的分支
- 去重：避免重复计算
- 记忆化：缓存已计算的结果

**经典题目：**

- [46. 全排列](https://leetcode.cn/problems/permutations/)
- [78. 子集](https://leetcode.cn/problems/subsets/)
- [39. 组合总和](https://leetcode.cn/problems/combination-sum/)
- [51. N 皇后](https://leetcode.cn/problems/n-queens/)

---

## 八、贪心算法（Greedy）- 阶段二：核心算法 ⭐⭐⭐

**适用场景：**

- 每一步选局部最优，最终得到全局最优
- 买卖股票的最佳时机（部分问题）
- 区间调度问题
- 霍夫曼编码
- 最小生成树（部分算法）

**核心思想：**

- 每一步都做出当前最优的选择
- 不回溯，不重新考虑已做的选择
- 需要证明问题满足"贪心选择性质"

**适用条件：**

1. **贪心选择性质**：局部最优能导致全局最优
2. **最优子结构**：问题的最优解包含子问题的最优解

**注意事项：**

- 不是所有问题都适合贪心
- 需要严格证明贪心策略的正确性
- 与动态规划的区别：贪心不保存子问题的解

**经典题目：**

- [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)
- [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)
- [435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)
- [452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)

---

## 九、分治算法（Divide and Conquer）- 阶段三：高级应用

**适用场景：**

- 大问题拆成小问题，小问题解合并成大问题解
- 归并排序
- 快速排序
- 大数乘法
- 最近点对问题

**核心思想：**

- **分（Divide）**：将问题分解为子问题
- **治（Conquer）**：递归求解子问题
- **合（Combine）**：合并子问题的解

**与递归的关系：**

- 分治是递归的常见应用场景
- 分治通常有明确的"分"和"合"步骤

**经典题目：**

- [归并排序实现](../packages/core/src/algorithms/sort/index.ts)
- [快速排序实现](../packages/core/src/algorithms/sort/index.ts)
- [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)
- [169. 多数元素](https://leetcode.cn/problems/majority-element/)

---

## 十、复杂场景综合 - 阶段三：高级应用

在实际算法题中，很多问题需要**多种技巧结合**使用，这是算法能力的综合体现。

### 10.1 双指针 + 动态规划

**典型场景：**

- 最长回文子串
- 编辑距离的优化

**示例：**

```typescript
// 最长回文子串：双指针扩展 + DP 优化
function longestPalindrome(s: string): string {
  // 结合双指针和动态规划的思路
}
```

### 10.2 滑动窗口 + 哈希表

**典型场景：**

- 最小覆盖子串
- 找到字符串中所有字母异位词

**示例：**

```typescript
// 滑动窗口 + 哈希表记录字符频率
function minWindow(s: string, t: string): string {
  const need = new Map(); // 哈希表
  let left = 0,
    right = 0; // 滑动窗口
  // ...
}
```

### 10.3 回溯 + 剪枝优化

**典型场景：**

- N 皇后问题
- 数独求解

**关键点：**

- 回溯是基础框架
- 剪枝是性能优化的关键

### 10.4 分治 + 递归

**典型场景：**

- 归并排序
- 快速排序
- 合并 K 个有序链表

**关键点：**

- 分治是思路
- 递归是实现方式

### 10.5 动态规划 + 状态压缩

**典型场景：**

- 状态空间较大的 DP 问题
- 位运算优化状态表示

**关键点：**

- 用位运算压缩状态
- 减少空间复杂度

### 10.6 贪心 + 排序

**典型场景：**

- 区间调度问题
- 活动选择问题

**关键点：**

- 先排序预处理
- 再用贪心策略选择

### 综合练习建议

1. **从单一技巧开始**：先掌握每种技巧的独立应用
2. **逐步组合**：理解每种技巧的特点，再思考如何组合
3. **多做综合题**：LeetCode 中等和困难题往往需要多技巧结合
4. **总结模式**：识别常见的组合模式，形成解题模板

**经典综合题目：**

- [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/) - 双指针 + DP
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/) - 滑动窗口 + 哈希表
- [51. N 皇后](https://leetcode.cn/problems/n-queens/) - 回溯 + 剪枝
- [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) - 分治 + 递归

---

## 十一、算法技巧选择指南

遇到问题时，按以下思路选择算法：

1. **数组/链表问题** → 双指针
2. **连续子数组/子串** → 滑动窗口
3. **树/图遍历** → DFS/BFS
4. **最优解问题** → 动态规划或贪心
5. **穷举所有可能** → 回溯
6. **大问题拆解** → 分治
7. **有序数组查找** → 二分查找

---

## 十二、学习建议

1. **先理解思想，再刷题**：掌握每种算法的核心思想和适用场景
2. **从简单题开始**：每种算法先做 2-3 道简单题，理解模板
3. **总结模板**：整理每种算法的通用模板，形成肌肉记忆
4. **举一反三**：做完一道题，思考能否用其他方法解决
5. **定期复习**：算法需要反复练习，定期回顾经典题目

---

## 十三、参考资源

- [LeetCode 算法题单](https://leetcode.cn/)
- [代码随想录](https://programmercarl.com/)
- [labuladong 的算法小抄](https://labuladong.github.io/algo/)

---

## 总结

这些算法技巧是解决算法题的"核心工具"，刷题时遇到问题，先判断属于哪类场景，再用对应的技巧解决即可。记住：**理解思想 > 记忆代码**，掌握核心思路后，代码实现就是水到渠成的事情。
