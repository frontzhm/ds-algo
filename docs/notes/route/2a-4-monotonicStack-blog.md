# 单调栈：从模板到实战的完整指南

## 目录

- [一、单调栈概述](#一单调栈概述)
- [二、单调栈各种情况与总结解法](#二单调栈各种情况与总结解法)
- [三、单调栈基础模板](#三单调栈基础模板)
- [四、习题精讲](#四习题精讲)
- [五、总结](#五总结)

---

## 一、单调栈概述

栈（stack）是先进后出的数据结构。**单调栈**在入栈时通过一定规则保持栈内元素有序（单调递增或单调递减），从而把「找左侧/右侧第一个更大/更小元素」从 O(n²) 降到 O(n)。

**适用场景**：需要求「下一个更大/更小」「上一个更大/更小」、或「右侧第一个满足某条件的元素」时，可优先考虑单调栈。与堆不同，单调栈不负责全局最值，只处理「相邻关系」类的一维序列问题。

---

## 二、单调栈各种情况与总结解法

### 2.1 核心记忆口诀

| 方向 | 遍历顺序 | 说明 |
|------|----------|------|
| **下一个** | 倒序（从右往左） | 先处理右侧，栈里存「右侧候选」 |
| **上一个** | 正序（从左往右） | 先处理左侧，栈里存「左侧候选」 |

### 2.2 八种标准模板速查表

| 需求 | 遍历 | 弹出条件 | 栈类型 |
|------|------|----------|--------|
| 下一个更大元素的索引 | 倒序 | 栈顶 ≤ 当前 → 弹出 | 严格单调递减栈 |
| 下一个更大或相等元素的索引 | 倒序 | 栈顶 < 当前 → 弹出 | 非严格单调递减栈 |
| 下一个更小元素的索引 | 倒序 | 栈顶 ≥ 当前 → 弹出 | 严格单调递增栈 |
| 下一个更小或相等元素的索引 | 倒序 | 栈顶 > 当前 → 弹出 | 非严格单调递增栈 |
| 上一个更大元素的索引 | 正序 | 栈顶 ≤ 当前 → 弹出 | 严格单调递减栈 |
| 上一个更大或相等元素的索引 | 正序 | 栈顶 < 当前 → 弹出 | 非严格单调递减栈 |
| 上一个更小元素的索引 | 正序 | 栈顶 ≥ 当前 → 弹出 | 严格单调递增栈 |
| 上一个更小或相等元素的索引 | 正序 | 栈顶 > 当前 → 弹出 | 非严格单调递增栈 |

**记忆技巧**：找「更大」→ 弹掉 ≤ 当前的（栈顶保留比当前大的）；找「更小」→ 弹掉 ≥ 当前的；找「相等可接受」→ 用 `<` / `>`，否则用 `<=` / `>=`。

### 2.3 弹出条件对应法则（重要）

题目要求与弹出条件的对应关系：

| 题目要求 | 弹出条件 |
|----------|----------|
| 找「右侧第一个 > cur」的元素 | 弹出所有 ≤ cur 的元素 |
| 找「右侧第一个 ≥ cur」的元素 | 弹出所有 < cur 的元素 |
| 找「右侧第一个 < cur」的元素 | 弹出所有 ≥ cur 的元素 |
| 找「右侧第一个 ≤ cur」的元素 | 弹出所有 > cur 的元素 |

**记住这个「条件对应法则」，同类题都能快速确定弹出条件，不会写反。**

### 2.4 元素值 vs 索引

- 需要**索引**（如算距离、下标）：栈存索引，用 `nums[stack.at(-1)]` 取值比较。
- 需要**元素值**：栈存值，或答案存索引后用 `nums[res[i]]` 取值。

---

## 三、单调栈基础模板

**问题**：给定数组 `nums`，返回等长数组，`res[i]` 为 `nums[i]` 右侧第一个更大元素，没有则 -1。

**示例**：`nums = [2,1,2,4,3]` → `res = [4,2,4,-1,-1]`。

暴力做法是对每个位置向右扫描找第一个更大值，O(n²)。可抽象为：元素像一排人，身高为数值。当前人「下一个更大」= 他右侧第一个没被挡住的人（比当前矮的都被挡住）。单调栈用 O(n) 维护「右侧候选更大值」：倒序遍历，弹掉 ≤ 当前的，栈顶即答案，再入栈当前值。

```js
var findNextGreater = function(nums) {
    const len = nums.length;   
    const res = new Array(len);    // 结果数组：存储每个元素的下一个更大值
    const stack = [];            // 单调栈：存储「右侧候选更大值」，栈内元素单调递增

    // 倒序遍历：从最后一个元素开始（核心思路！易错点1）
    // 原因：先处理右侧元素，把结果存在栈里，供左侧元素直接使用
    for (let i = len - 1; i >= 0; i--) {
        const cur = nums[i];     // 当前遍历的元素

        // 核心过滤：弹出栈中「≤当前元素」的数（易错点2：必须是≤，不是<）
        // 逻辑：这些数比当前元素小/相等，不可能成为「左侧元素的下一个更大值」，直接移除
        // 栈不为空时才判断（避免访问stack.at(-1)时报错）
        while (stack.length && stack.at(-1) <= cur) { 
            stack.pop(); // 弹出无效候选值
        }

        // 记录答案：栈顶就是「当前元素右侧第一个更大值」（易错点3：别写反判断）
        // 栈空 → 无更大元素，返回-1；栈非空 → 取栈顶（第一个更大值）
        res[i] = stack.length ? stack.at(-1) : -1;

        // 当前元素入栈：成为「左侧元素」的候选更大值（易错点4：别漏写这一步）
        // 入栈后栈仍保持单调递增（因为小的都被弹走了）
        stack.push(cur);
    }

    return res;
};
```

**代码要点**：倒序遍历，先算右侧再推左侧；栈内维护「右侧候选更大值」，单调递增（栈顶最小）。  
**四步口诀**：**倒着来 → 弹 ≤ 当前的 → 栈顶即答案 → 当前入栈**。

---

## 四、习题精讲

| 题号 | 题目 | 核心考点 |
|------|------|----------|
| 496 | 下一个更大元素 I | 单调栈 + Map 缓存 |
| 739 | 每日温度 | 下一个更大 + 存索引算距离 |
| 503 | 下一个更大元素 II | 循环数组（2 倍长度 + 取模） |
| 1019 | 链表中的下一个更大节点 | 链表转数组 + 模板 |
| 1944 | 队列中可以看到的人数 | 弹栈计数 + 栈顶是否可见 |
| 1475 | 商品折扣后的最终价格 | 右侧第一个 ≤ cur |
| 901 | 股票价格跨度 | 上一个更大（正序） |
| 402 | 移掉 K 位数字 | 单调递增栈 + k 限制 |
| 853 | 车队 | 排序 + 时间比较（可不用栈） |
| 581 | 最短无序连续子数组 | 边界 + 最值扩展（非纯单调栈） |

---

### 4.1 496. 下一个更大元素 I

- **习题链接**：[LeetCode 496. 下一个更大元素 I](https://leetcode.cn/problems/next-greater-element-i/)
- **描述**：nums1 中数字 x 的「下一个更大元素」是指 x 在 nums2 中对应位置**右侧**的**第一个**比 x 大的元素。给你两个没有重复元素的数组 nums1 和 nums2，其中 nums1 是 nums2 的子集。对于每个 nums1[i]，找出其在 nums2 中的下一个更大元素；若不存在，返回 -1。
- **示例**：
  - 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
  - 输出：[-1,3,-1]
- **思路**：先对 nums2 用单调栈求每个元素的下一个更大值，存入 Map 缓存；再遍历 nums1 直接查 Map 得结果。时间复杂度 O(len1 + len2)。

```js
/**
 * LeetCode 496. 下一个更大元素 I
 * 解题思路：先对nums2用单调栈求每个元素的下一个更大值，存入Map缓存；再遍历nums1直接查Map得结果
 * 时间复杂度：O(len1 + len2)，空间复杂度：O(len2)（栈+Map的空间）
 * @param {number[]} nums1 - 待查询的数组（元素均为nums2的子集）
 * @param {number[]} nums2 - 基准数组（nums1的元素都来自这里）
 * @returns {number[]} nums1每个元素在nums2中对应的「下一个更大元素」，无则返回-1
 */
var nextGreaterElement = function(nums1, nums2) {
  // 定义nums1和nums2的长度（保持你的命名风格）
  const len1 = nums1.length
  const len2 = nums2.length
  // 边界处理：nums1为空时直接返回空数组（避免后续无效计算）
  if(len1 === 0) return []
  // 存储最终结果的数组
  const res = []

  // 核心Map：key=nums2的元素值，value=该元素在nums2中的「下一个更大值」
  const valToGreater2 = new Map()
  // 单调栈：用于计算nums2中每个元素的下一个更大值（保持你的命名风格）
  const stack2 = []

  // 第一步：倒序遍历nums2，用单调栈计算每个元素的下一个更大值
  // 易错点1：必须倒序遍历（正序无法正确缓存右侧的更大值）
  for(let i=len2-1;i>=0;i--){
    // 当前遍历到的nums2元素（保持你的命名风格）
    const cur = nums2[i]

    // 核心逻辑：弹出栈中≤当前元素的所有值（这些值无法成为左侧元素的「更大值」）
    // 易错点2：判断条件必须是<=，而非<（相等元素也无法作为「更大值」，需弹出）
    // 易错点3：必须先判断stack2.length>0，再访问stack2.at(-1)（避免栈空时取到undefined）
    while(stack2.length && stack2.at(-1)<=cur){
      stack2.pop(); // 弹出无效的候选值
    }

    // 将当前元素的「下一个更大值」存入Map
    // 易错点4：栈空时要存-1（题目要求无更大值返回-1），而非直接存stack2.at(-1)（会得到undefined）
    valToGreater2.set(cur,stack2.length?stack2.at(-1):-1);
    
    // 易错点5：必须将当前元素入栈（作为左侧元素的候选更大值，漏写则栈始终为空）
    stack2.push(cur);
  }

  // 第二步：遍历nums1，从Map中直接查询每个元素的结果（O(1)查询，无需重复计算）
  // 题目保证nums1的元素都在nums2中，无需额外判空
  for(let num of nums1){
    res.push(valToGreater2.get(num));
  }

  // 返回最终结果
  return res;
};

// 测试用例（验证你的代码正确性，可自行删除/保留）
// console.log(nextGreaterElement([4,1,2], [1,3,4,2])); // 预期输出：[-1,3,-1]
// console.log(nextGreaterElement([2,4], [1,2,3,4]));   // 预期输出：[3,-1]
// console.log(nextGreaterElement([], [1,2,3]));        // 预期输出：[]
// console.log(nextGreaterElement([5], [5]));           // 预期输出：[-1]
```

---

### 4.2 739. 每日温度

- **习题链接**：[LeetCode 739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
- **描述**：给你一个数组 temperatures，存放近几天的气温。返回等长数组，其中 answer[i] 表示第 i 天要等多少天才能遇到更高温度；若之后没有更高温度，填 0。
- **示例**：
  - 输入：temperatures = [73,74,75,71,69,72,76,73]
  - 输出：[1,1,4,2,1,1,0,0]
- **思路**：倒序遍历 + 单调索引栈（仅存索引），计算下一个高温的间隔天数。栈顶索引 - 当前索引即为等待天数。

```js
/**
 * LeetCode 739. 每日温度
 * 核心思路：倒序遍历 + 单调索引栈（仅存索引，通过索引取温度），计算下一个高温的间隔天数
 * 时间O(n) 空间O(n)（理论最优，无冗余计算/存储）
 * @param {number[]} temperatures - 每日温度数组
 * @returns {number[]} 每个位置需等待的天数（无更高温则为0）
 */
var dailyTemperatures = function(temperatures) {
  const len = temperatures.length
  if(len===0) return []
  const res = []
  const stack = [] // 存更大温度的索引栈（核心优化：仅存索引，替代对象）
  
  // 倒序遍历：从最后一天开始缓存右侧高温信息（易错点1：必须倒序）
  for(let i=len-1;i>=0;i--){
    const cur = temperatures[i] // 当前天的温度
    
    // 弹出栈中「温度≤当前值」的索引（这些天无法成为当前天的「下一个高温」）
    // 易错点2：判断条件是<=（相等温度不算更高），且通过索引取温度
    while(stack.length && temperatures[stack.at(-1)]<=cur){
      stack.pop()
    }
    
    // 计算天数：栈非空→栈顶索引-当前索引；栈空→0（易错点3：索引差别写反）
    res[i] = stack.length?stack.at(-1)-i:0
    
    // 当前索引入栈，作为左侧天数的候选（易错点4：存索引而非温度值）
    stack.push(i)
  }
  return res
};

// 测试用例验证（和你的逻辑完全匹配）
// console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]
// console.log(dailyTemperatures([30,40,50,60])); // [1,1,1,0]
```

---

### 4.3 503. 下一个更大元素 II（循环数组）

- **习题链接**：[LeetCode 503. 下一个更大元素 II](https://leetcode.cn/problems/next-greater-element-ii/)
- **描述**：输入一个「环形数组」，计算每个元素的下一个更大元素。若不存在，返回 -1。
- **示例**：
  - 输入：nums = [2,1,2,4,3]
  - 输出：[4,2,4,-1,4]（最后一个 3 绕一圈找到 4）
- **思路**：倒序遍历 2 倍长度 + 取模模拟循环 + 单调栈。用 `i % len` 映射到真实索引，仅当 `i < len` 时记录答案。

```js
/**
 * LeetCode 503. 下一个更大元素 II（循环数组版）
 * 核心：倒序遍历2倍长度 + 取模模拟循环 + 单调栈，解决「首尾相连」的更大值问题
 * 时间O(n) 空间O(n)（理论最优，无冗余计算）
 * @param {number[]} nums - 循环数组
 * @returns {number[]} 每个元素的下一个更大值（无则-1）
 */
var nextGreaterElements = function(nums) {
    const len = nums.length;   
    if (len === 0) return []; // 补充空数组边界，避免后续逻辑出错
    const res = new Array(len);    // 结果数组：存储每个元素的下一个更大值
    const stack = [];            // 单调栈：存储「右侧候选更大值」，栈内元素单调递增

    // 倒序遍历2*len-1次：模拟数组循环（核心！易错点1）
    // 原因：先处理右侧元素（含循环部分），把结果存在栈里，供左侧元素直接使用
    for (let i = 2*len - 1; i >= 0; i--) {
        const realIdx = i % len; // 取模映射到真实数组索引，模拟循环
        const cur = nums[realIdx];     // 当前遍历的元素

        // 核心过滤：弹出栈中「≤当前元素」的数（易错点2：必须是≤，不是<）
        // 逻辑：这些数比当前元素小/相等，不可能成为「左侧元素的下一个更大值」，直接移除
        // 栈不为空时才判断（避免访问stack.at(-1)时报错）
        while (stack.length && stack.at(-1) <= cur) { 
            stack.pop(); // 弹出无效候选值
        }

        // 优化点：仅i<len时赋值（避免重复赋值，提升效率）
        // 记录答案：栈顶就是「当前元素右侧第一个更大值」（易错点3：别写反判断）
        // 栈空 → 无更大元素，返回-1；栈非空 → 取栈顶（第一个更大值）
        if(i < len) {
          res[realIdx] = stack.length ? stack.at(-1) : -1;
        }

        // 当前元素入栈：成为「左侧元素」的候选更大值（易错点4：别漏写这一步）
        // 入栈后栈仍保持单调递增（因为小的都被弹走了）
        stack.push(cur);
    }

    return res;
};

// 测试用例验证（全覆盖核心场景）
// console.log(nextGreaterElements([1,2,1])); // [2,-1,2]（循环场景）
// console.log(nextGreaterElements([5,4,3,2,1])); // [-1,5,5,5,5]（递减循环）
// console.log(nextGreaterElements([])); // []（空数组）
// console.log(nextGreaterElements([1])); // [-1]（单元素）
```

---

### 4.4 1019. 链表中的下一个更大节点

- **习题链接**：[LeetCode 1019. 链表中的下一个更大节点](https://leetcode.cn/problems/next-greater-node-in-linked-list/)
- **描述**：给定链表 head，对于每个节点，查找其右侧第一个值严格大于它的节点。返回整数数组 answer，answer[i] 为第 i 个节点的下一个更大节点值；若无，则为 0。
- **示例**：
  - 输入：head = [2,1,5]
  - 输出：[5,5,0]
- **思路**：链表转数组 + 单调栈（从后往前遍历）。与「下一个更大元素」模板一致，仅需将链表值先提取到数组。

```js
/**
 * @param {ListNode} head 链表的头节点
 * @return {number[]} 每个节点的下一个更大节点值组成的数组
 * 核心思路：链表转数组 + 单调栈（从后往前遍历），时间复杂度O(n)，空间复杂度O(n)
 */
var nextLargerNodes = function(head) {
    // 易错点1：边界处理 - 空链表直接返回空数组
    if (head === null) return [];

    // 步骤1：将链表值提取到数组中（链表无法随机访问，转数组更易处理）
    const arr = [];
    let p = head; // 遍历链表的指针
    while (p) {
        arr.push(p.val); // 存储节点值而非节点本身，简化后续操作
        p = p.next; // 指针后移，易错点2：忘记移动指针会导致死循环
    }

    const n = arr.length;
    // 步骤2：初始化结果数组，默认值为0（后续无需再处理"无更大值"的情况）
    // 易错点3：未初始化默认值，可能导致res[i]为undefined
    const res = new Array(n).fill(0);
    // 单调栈：存储"待匹配更大值"的元素，栈内保持单调递减（核心）
    const stack = [];

    // 步骤3：从后往前遍历数组（反向遍历更易理解，每个元素只入栈/出栈一次）
    for (let i = n - 1; i >= 0; i--) {
        const cur = arr[i]; // 当前遍历的元素值

        // 核心逻辑：弹出栈中<=当前值的元素（这些元素不可能是前面元素的"下一个更大值"）
        // 易错点4：条件写成"<"而非"<="，会导致相同值的元素被错误保留
        while (stack.length > 0 && stack[stack.length - 1] <= cur) {
            stack.pop(); // 弹出无效元素
        }

        // 此时栈顶就是当前元素的"下一个更大值"（栈空则保持默认值0）
        if (stack.length > 0) {
            res[i] = stack[stack.length - 1]; // 易错点5：用at(-1)兼容性差，优先用stack.length-1
        }

        // 易错点6：忘记将当前元素入栈，导致前面的元素无法匹配到当前值
        stack.push(cur); // 当前元素入栈，作为前面元素的候选更大值
    }

    // 返回结果数组
    return res;
};

// 本地测试示例：head = [2,1,5] → 输出 [5,5,0]
// const head = new ListNode(2, new ListNode(1, new ListNode(5)));
// console.log(nextLargerNodes(head)); // [5,5,0]
```

---

### 4.5 1944. 队列中可以看到的人数

- **习题链接**：[LeetCode 1944. 队列中可以看到的人数](https://leetcode.cn/problems/number-of-visible-people-in-a-queue/)
- **描述**：n 个人排成一列，heights[i] 为第 i 个人的高度（互不相同）。第 i 个人能「看到」右侧第 j 个人的条件是：i < j 且两人之间所有人都比他们矮。返回 answer[i] 为第 i 个人在右侧能看到的人数。
- **示例**：
  - 输入：heights = [10,6,8,5,11,9]
  - 输出：[3,1,2,1,1,0]
- **思路**：倒序单调栈。弹出所有 ≤ 当前身高的元素（这些人都能被看到），count 为弹出数量；若栈非空，还能看到栈顶（第一个更高的人），故 +1。能看到的人数 = count + (栈非空 ? 1 : 0)。

```js
/**
 * @param {number[]} nums 代表一排人的身高数组
 * @return {number[]} 每个位置的人能看到的右侧人数
 * 核心思路：倒序单调栈（适配你的学习习惯），时间复杂度O(n)，空间复杂度O(n)
 * 核心逻辑：能看到的人数 = 弹出的矮个子数量（count） + （栈顶有更高的人则+1，否则+0）
 */
var canSeePersonsCount = function(nums) {
    // 步骤1：初始化基础变量
    const n = nums.length;
    // 易错点1：未初始化数组长度 → 赋值res[i]时会报错；无需fill(0)，因为每个位置都会显式赋值
    const res = new Array(n); 
    // 单调栈：存储索引（而非值），栈内索引对应的nums值保持「单调递减」
    // 作用：缓存当前位置右侧的"参考身高"，快速判断能看到的人
    const stack = []; 

    // 步骤2：倒序遍历（从最后一个人往前推，符合"找右侧元素"的直觉）
    for(let i = n - 1; i >= 0; i--) {
        const curHeight = nums[i]; // 当前位置的身高
        let count = 0; // 统计能看到的「矮个子数量」（被弹出的元素数）

        // 核心循环：弹出所有≤当前身高的元素 → 这些人都能被当前位置看到（矮个子，无遮挡）
        // 易错点2：条件写成`<`而非`<=` → 相同身高的人会被错误保留，导致count统计少
        // 易错点3：忘记stack.length判断 → 访问stack[-1]会报错
        while(stack.length > 0 && nums[stack[stack.length - 1]] <= curHeight) {
            stack.pop(); // 弹出的索引对应的值≤当前身高，无遮挡，能看到
            count++; // 每弹出一个，能看到的矮个子数+1
        }

        // 步骤3：计算最终能看到的人数
        // 逻辑：count（矮个子数） + （栈非空则+1，代表能看到第一个更高的人；否则+0）
        // 易错点4：仅处理栈非空的情况，忽略栈空的情况 → 栈空时res[i]会是undefined
        res[i] = stack.length ? count + 1 : count;

        // 步骤4：当前索引入栈 → 作为前面位置（i-1、i-2等）的"参考身高"
        // 易错点5：忘记push当前索引 → 前面的位置无法获取当前身高的参考，结果全错
        stack.push(i);
    }

    // 返回结果数组
    return res;
};

// 测试用例（可直接运行验证）
// console.log(canSeePersonsCount([10,6,8,5,11,9])); // 输出 [3,1,2,1,1,0]（正确）
// console.log(canSeePersonsCount([5,1,2,3,10]));    // 输出 [4,1,1,1,0]（正确）
// console.log(canSeePersonsCount([7,6,5,4,3]));      // 输出 [4,3,2,1,0]（正确）
// console.log(canSeePersonsCount([1,2,3,4,5]));      // 输出 [1,1,1,1,0]（正确）
```

---

### 4.6 1475. 商品折扣后的最终价格

- **习题链接**：[LeetCode 1475. 商品折扣后的最终价格](https://leetcode.cn/problems/final-prices-with-a-special-discount-in-a-shop/)
- **描述**：prices[i] 为第 i 件商品价格。第 i 件商品可获得折扣 prices[j]，其中 j 是满足 j > i 且 prices[j] <= prices[i] 的**最小下标**；若无则无折扣。返回每件商品折扣后的最终价格。
- **示例**：
  - 输入：prices = [8,4,6,2,3]
  - 输出：[4,2,4,2,3]
- **思路**：找「右侧第一个 ≤ cur」的元素 → 弹出所有 > cur 的元素，栈顶即为折扣。最终价格 = cur - 折扣（有则）或 cur（无则）。

```js
var finalPrices = function(prices) {
  const n = prices.length
  const res = new Array(n)
  const stack = []
  for(let i=n-1;i>=0;i--){
    const cur = prices[i]
    // 题目要求找「右侧第一个 ≤ cur」的元素 → 弹出所有 > cur 的，栈顶即为折扣
    // 右侧第一个 <= cur 的元素, 所以用大于的就弹出
    while(stack.length && stack[stack.length-1]>cur){
      stack.pop()
    }
    res[i] = stack.length? (cur -  stack[stack.length-1]) :cur
    stack.push(cur)
  }
  return res
};
```

---

### 4.7 901. 股票价格跨度

- **习题链接**：[LeetCode 901. 股票价格跨度](https://leetcode.cn/problems/online-stock-span/)
- **描述**：设计 StockSpanner 类。每次调用 next(price) 时，返回当日价格的「跨度」：从今天往回数，价格 ≤ 今日价格的最大连续天数（含今天）。
- **示例**：
  - 输入：["StockSpanner","next","next","next","next","next","next","next"], [[],[100],[80],[60],[70],[60],[75],[85]]
  - 输出：[null,1,1,1,2,1,4,6]
- **思路**：单调递减栈，找「上一个比当前价格大的元素索引」。正序遍历，弹出所有 ≤ 当前价格的索引；跨度 = 当前索引 - 栈顶索引（栈空则为 当前索引 + 1）。

```js
/**
 * 股票价格跨度计算器类
 * 核心功能：每次调用next(val)，返回当前价格的跨度（往回数≤当前价格的最大连续天数）
 * 核心思路：单调递减栈（找「上一个比当前价格大的元素索引」），时间复杂度O(n)，空间复杂度O(n)
 */
class StockSpanner {
  /**
   * 构造函数：初始化存储结构
   * - this.arr：存储每日股票价格（按调用next的顺序）
   * - this.stack：单调递减栈，存储「价格对应的索引」，栈顶→栈底索引对应的价格单调递减
   */
  constructor() {
    this.arr = [];    // 存储所有历史价格，通过索引快速获取对应价格
    this.stack = [];  // 核心：存储索引，保证索引对应的价格单调递减
  }

  /**
   * 新增当日价格，并返回该价格的跨度
   * @param {number} val - 当日股票价格
   * @returns {number} - 当日价格的跨度
   */
  next(val) {
    // 1. 将当日价格存入数组，记录当前索引（i是当前价格在arr中的位置）
    this.arr.push(val);
    const i = this.arr.length - 1;
    const cur = val;  // 简化变量名，代表当前价格

    // 2. 维护单调递减栈：弹出所有≤当前价格的索引（这些索引对应的价格无法成为后续价格的「上一个更大值」）
    // 易错点1：条件写反（比如写成>cur）→ 栈逻辑完全错误，无法找到上一个更大值
    // 易错点2：漏写stack.length判断 → 栈空时访问stack[-1]会报错
    while (this.stack.length && this.arr[this.stack[this.stack.length - 1]] <= cur) {
      this.stack.pop(); // 弹出的索引对应的价格≤当前价格，无保留意义
    }

    // 3. 计算当日跨度：跨度 = 当前索引 - 上一个更大值的索引（栈空则为i+1）
    // 易错点3：跨度计算公式写反（stack[...]-i）→ 结果为负数，完全错误
    // 易错点4：栈空时返回1而非i+1 → 仅i=0时正确，i>0时（如i=3）会返回1而非4
    const curRes = this.stack.length ? i - this.stack[this.stack.length - 1] : i + 1;

    // 4. 将当前索引压入栈，维护单调递减特性（供后续价格计算跨度使用）
    // 易错点5：忘记push当前索引 → 后续价格无法找到正确的上一个更大值，结果全错
    this.stack.push(i);

    // 5. 返回当日跨度（而非整个结果数组）
    // 易错点6：返回整个数组（如this.res）→ 不符合题目要求，题目要求返回单个数值
    return curRes;
  }
}

// 测试用例（可直接运行验证）
// const spanner = new StockSpanner();
// console.log(spanner.next(100)); // 输出1（正确）
// console.log(spanner.next(80));  // 输出1（正确）
// console.log(spanner.next(60)); // 输出1（正确）
// console.log(spanner.next(70)); // 输出2（正确）
// console.log(spanner.next(60)); // 输出1（正确）
// console.log(spanner.next(75)); // 输出4（正确）
// console.log(spanner.next(85)); // 输出6（正确）
```

---

### 4.8 402. 移掉 K 位数字

- **习题链接**：[LeetCode 402. 移掉 K 位数字](https://leetcode.cn/problems/remove-k-digits/)
- **描述**：给定字符串 num（非负整数）和整数 k，移除 k 位数字，使剩余数字最小。以字符串形式返回（不含前导零）。
- **示例**：
  - 输入：num = "1432219", k = 3
  - 输出："1219"
- **思路**：单调递增栈 + k 控制删除次数。高位越小整体越小，遇更小数字时弹出栈顶大数（仅当 k>0）；栈空且当前为 0 则跳过（避免前导零）；若遍历完 k 仍>0，从末尾再删 k 位。

```js
/**
 * @param {string} num 非负整数的字符串形式（可能含前导零）
 * @param {number} k 要移除的数字位数
 * @return {string} 移除k位后最小的数字（字符串形式）
 * 核心思路：单调递增栈 + 控制删除位数（k>0），优先移除高位大数，保证剩余数字最小
 * 时间复杂度：O(n)，空间复杂度：O(n)
 */
var removeKdigits = function(num, k) {
  const n = num.length;
  // 易错点1：边界处理 - 移除所有数字时直接返回"0"
  if (k === n) return '0';
  
  const stack = []; // 单调递增栈：栈底→栈顶数字递增，保证高位尽可能小

  for (let i = 0; i < n; i++) {
    const cur = Number(num[i]); // 转数字方便比较（也可直接比较字符）

    // 核心逻辑：维护单调递增栈，仅当k>0时移除高位大数
    // 条件解读：栈非空 + 栈顶>当前数 + 还有删除名额 → 弹出栈顶（移除大数）
    while (stack.length && stack[stack.length - 1] > cur && k > 0) {
      stack.pop();
      k--; // 剩余删除名额减1（关键：控制删除位数，保证保留足够长度）
    }

    // 优化逻辑：栈空且当前数为0 → 跳过（避免存储无效前导零）
    // 解释：第一个有效数字不能是0，栈空时存0无意义，直接跳过
    if (stack.length === 0 && cur === 0) {
      continue;
    }

    // 压入当前数，维持栈的递增特性
    stack.push(cur);
  }

  // 易错点2：遍历结束后k仍>0 → 栈是递增的，末尾数字更大，移除末尾k位
  let res = stack.join('');
  if (k > 0) {
    // 注意：slice(0, 负数)会返回空字符串，需兼容（比如stack长度<k时，slice后为空）
    res = res.slice(0, res.length - k);
  }

  // 易错点3：处理最终结果为空的场景（比如num="10"，k=2）
  if (res === '') res = '0';

  return res;
};
```

---

### 4.9 853. 车队

- **习题链接**：[LeetCode 853. 车队](https://leetcode.cn/problems/car-fleet/)
- **描述**：n 辆车在单行道开往 target。车不能超车，可追上前车并同速行驶。车队定义为并排或同速行驶的车组。返回到达目的地的车队数量。
- **示例**：
  - 输入：target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
  - 输出：3
- **思路**：① 算每辆车到达时间 = (target - position) / speed；② 按位置降序排序；③ 单调递增栈：仅当当前时间 > 栈顶时间时压栈（新车队），否则合并。栈长即为车队数。可优化为用变量代替栈。

```js
/**
 * @param {number} target 目的地位置（英里）
 * @param {number[]} position 每辆车的初始位置数组
 * @param {number[]} speed 每辆车的速度数组（英里/小时）
 * @return {number} 到达目的地的车队数量
 * 核心思路：
 * 1. 转换视角：将"追车"问题转为"到达时间"比较（后车时间≤前车 → 合并）；
 * 2. 排序：按位置从离终点近→远排序（降序），保证从最前面的车开始分析；
 * 3. 单调递增栈：存储独立车队的到达时间，cur>栈顶才push（否则合并）。
 * 时间复杂度：O(n log n)（主要来自排序），空间复杂度：O(n)
 */
var carFleet = function(target, position, speed) {
  const n = position.length;
  // 易错点1：边界处理 - 0辆车返回0，1辆车返回1（无需后续计算）
  if (n <= 1) return n;

  const stack = []; // 单调递增栈：存储每个独立车队的到达时间
  const posToTime = new Map(); // 映射：位置 → 到达终点的时间

  // 步骤1：计算每辆车的到达时间（精确浮点数，禁止取整）
  for (let i = 0; i < n; i++) {
    const pos = position[i];
    const sp = speed[i];
    // 易错点2：用Math.ceil/Math.floor取整 → 破坏时间比较逻辑，必须精确计算
    const time = (target - pos) / sp;
    posToTime.set(pos, time);
  }

  // 步骤2：按位置降序排序（离终点越近的车越先处理）
  // 易错点3：升序排序 → 逻辑完全错误（无法保证"后车不超车"的前提）
  position.sort((x, y) => y - x);

  // 步骤3：遍历排序后的位置，用单调栈判断独立车队
  for (let i = 0; i < n; i++) {
    const pos = position[i];
    const curTime = posToTime.get(pos);

    // 核心逻辑：只有当前时间 > 栈顶时间 → 无法合并，是新车队（push）
    // 反之（curTime ≤ 栈顶）→ 会追上前车，合并（continue）
    // 易错点4：错误弹出栈顶 → 破坏独立车队的时间记录，导致结果错误
    if (stack.length > 0 && stack[stack.length - 1] >= curTime) {
      continue;
    }
    stack.push(curTime);
  }

  // 栈的长度 = 独立车队数量
  return stack.length;
};
```

**优化版（用变量代替栈）：**

```js
var carFleet = function(target, position, speed) {
  const n = position.length;
  // 边界处理：0辆车返回0，1辆车返回1（无需后续计算）
  if (n <= 1) return n;

  const posToTime = new Map(); // 位置 → 到达终点的时间（避免重复计算）

  // 步骤1：计算每辆车的到达时间（精确浮点数，禁止取整！）
  for (let i = 0; i < n; i++) {
    const pos = position[i];
    const sp = speed[i];
    // 易错点：取整会破坏时间比较逻辑（比如1.333取整为2，错误判定为独立车队）
    const time = (target - pos) / sp;
    posToTime.set(pos, time);
  }

  // 步骤2：按位置降序排序（核心！保证从最前面的车开始分析，符合"不超车"规则）
  // 易错点：升序排序会导致逻辑完全错误（无法判断后车是否追前车）
  position.sort((x, y) => y - x);

  let fleetCount = 0; // 独立车队数量
  let prevFleetTime = -Infinity; // 上一个独立车队的到达时间（初始负无穷，保证第一个车被统计）

  // 步骤3：遍历排序后的位置，统计独立车队
  for (let i = 0; i < n; i++) {
    const currentPos = position[i];
    const currentTime = posToTime.get(currentPos);

    // 核心逻辑：当前时间 > 上一个车队时间 → 无法合并，是新车队
    if (prevFleetTime >= currentTime) {
      continue; // 时间更小/相等 → 合并，不计数
    }
    fleetCount++; // 新车队，计数+1
    prevFleetTime = currentTime; // 更新上一个车队的时间为当前时间
  }

  return fleetCount;
};
```

---

### 4.10 581. 最短无序连续子数组

- **习题链接**：[LeetCode 581. 最短无序连续子数组](https://leetcode.cn/problems/shortest-unsorted-continuous-subarray/)
- **描述**：找出一个连续子数组，若对该子数组升序排序，则整个数组变为升序。返回符合题意的最短子数组长度。
- **示例**：
  - 输入：nums = [2,6,4,8,10,9,15]
  - 输出：5（需排序 [6,4,8,10,9]）
- **思路**：① 找初始左边界：第一个 nums[i] > nums[i+1]；② 找初始右边界：最后一个 nums[i] < nums[i-1]；③ 求 [left,right] 内 min、max；④ 向左扩展：nums[left-1] > minVal 则 left--；⑤ 向右扩展：nums[right+1] < maxVal 则 right++。长度 = right - left + 1。

```js
/**
 * @param {number[]} nums - 待查找最短无序连续子数组的整数数组
 * @return {number} - 最短无序连续子数组的长度，排序该子数组后整个数组升序
 * 核心思路：找初始无序边界 + 计算区间最值 + 扩展边界
 * 时间复杂度：O(n)，空间复杂度：O(1)
 */
var findUnsortedSubarray = function(nums) {
  const n = nums.length;
  // ⚠️ 易错点1：长度≤1的数组本身有序，返回0而非n
  if (n <= 1) return 0;

  // 步骤1：找初始左边界（第一个破坏升序的位置）
  let left = 0;
  // ⚠️ 易错点2：循环条件写left <= n-1（会导致left+1越界），或把<=写成<（漏判相等的有序情况）
  while (left < n - 1 && nums[left] <= nums[left + 1]) {
    left++;
  }
  // 数组完全有序，直接返回0
  // ⚠️ 易错点3：此处返回n而非0（完全有序无需排序，长度为0）
  if (left === n - 1) return 0;

  // 步骤2：找初始右边界（最后一个破坏升序的位置）
  let right = n - 1;
  // ⚠️ 易错点4：循环条件写right >= 0（会导致right-1越界），或把<=写成<（漏判相等的有序情况）
  while (right > 0 && nums[right - 1] <= nums[right]) {
    right--;
  }

  // 步骤3：计算初始无序区间[left, right]的最大值和最小值
  // 作用：通过最值判断是否需要扩展左/右边界（左侧>最小值/右侧<最大值的元素都需纳入无序区间）
  let minVal = Infinity;
  let maxVal = -Infinity;
  // ⚠️ 易错点5：循环范围写错（比如i<right或i>left），导致最值计算不全
  for (let i = left; i <= right; i++) {
    minVal = Math.min(minVal, nums[i]);
    maxVal = Math.max(maxVal, nums[i]);
  }

  // 步骤4：扩展左边界（向左找所有>minVal的元素，全程不越界）
  // 逻辑：只要左侧元素>最小值，说明该元素需纳入无序区间，左边界左移
  // ⚠️ 易错点6：循环条件写成nums[left-1] >= minVal（相等元素无需纳入无序区间）
  while (left > 0 && nums[left - 1] > minVal) {
    left--;
  }

  // 步骤5：扩展右边界（向右找所有<maxVal的元素，全程不越界）
  // 逻辑：只要右侧元素<最大值，说明该元素需纳入无序区间，右边界右移
  // ⚠️ 易错点7：循环条件写成nums[right+1] <= maxVal（相等元素无需纳入无序区间）
  while (right < n - 1 && nums[right + 1] < maxVal) {
    right++;
  }

  // 步骤6：计算最终长度
  // ⚠️ 易错点8：长度计算公式写错（比如right-left 或 right-left-1）
  return right - left + 1;
};
```

---

## 五、总结

单调栈模板有共性，不必死记，按下面三步即可快速选型：

1. **定方向**：求「下一个」→ 倒序；求「上一个」→ 正序。
2. **定弹出条件**：看题目要的是「第一个 > / ≥ / < / ≤ cur」，对照上文的**弹出条件对应法则**决定弹谁。
3. **定存什么**：要下标/距离就栈里存索引，只要值就存值或存索引再 `nums[i]` 取。

实际题目往往需要先做一步转化（如循环数组、链表转数组、先排序再栈），再套上面模板即可。
