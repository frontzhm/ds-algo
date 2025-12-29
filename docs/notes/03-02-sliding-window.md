# 滑动窗口详解：原理+分类+场景+模板+例题

> 📺 **推荐视频**：[滑动窗口算法详解](https://b23.tv/rU4vRca) - 视频解释非常清晰，建议先看视频再阅读本文！

在算法面试中，子串、子数组相关的问题频繁出现，暴力枚举往往因 O(n²) 时间复杂度超时。而滑动窗口算法，凭借其 O(n) 的高效性能，成为解决这类问题的"神兵利器"。本文将从原理本质出发，梳理滑动窗口的分类、适用场景，提炼通用模板，并结合经典例题实战拆解，帮你彻底掌握这一核心算法。

# 一、滑动窗口核心原理：用单调性压缩遍历维度

滑动窗口的本质，是**利用区间的单调性，将原本需要嵌套遍历（O(n²)）的连续区间问题，转化为单轮双指针遍历（O(n)）**。其核心逻辑基于对“窗口状态”的精准把控，通过两个指针（left 左边界、right 右边界）的协同移动，跳过无效区间（剪枝），实现高效枚举。

## 1.1 先搞懂：暴力枚举的痛点

以“无重复字符的最长子串”为例，暴力思路是枚举所有子串的起点 i 和终点 j（i≤j），检查子串 s[i..j] 是否无重复，最终记录最长长度。这种方式需要遍历所有 i、j 组合，时间复杂度 O(n²)，且存在大量无效计算：比如当 s[0..3] 存在重复时，s[0..4]、s[0..5] 等包含该区间的子串必然也重复，无需再检查。

## 1.2 滑动窗口的核心洞察：区间单调性

滑动窗口能优化的关键，是抓住了「窗口状态的单调性」—— 窗口的状态（如是否含重复、和/积是否满足条件）会随窗口的扩展/缩小呈现单向变化，具体可总结为两条核心规律：

- **规律1（坏状态的包含性）**：若窗口 [left, right] 处于“坏状态”（如含重复字符、和≥target、积≥K），则所有包含该窗口的更大窗口 [left, right+1]、[left, right+2]... 必然也是“坏状态”。此时无需继续扩展 right，应移动 left 缩小窗口，跳过无效区间。

- **规律2（好状态的被包含性）**：若窗口 [left, right] 处于“好状态”（如无重复、和<target、积<K），则所有被该窗口包含的更小窗口 [left+1, right]、[left+2, right]... 必然也是“好状态”。此时无需缩小窗口，应继续扩展 right 寻找更优解。

## 1.3 一句话总结原理

滑动窗口通过 right 指针“扩窗口”探索新的区间，通过 left 指针“缩窗口”剔除无效区间，每个元素最多被加入窗口（right 移动）和移出窗口（left 移动）各一次，最终以 O(n) 时间完成所有有效区间的枚举。

# 二、滑动窗口的分类：按目标场景划分

滑动窗口的核心逻辑一致，但根据问题目标（求最长、求最短、求计数）的不同，缩窗口的条件和更新答案的时机会有差异。按目标可分为三大类，覆盖绝大多数经典场景：

| 分类 | 核心目标 | 缩窗口条件 | 更新答案时机 | 典型问题 |
| --- | --- | --- | --- | --- |
| 类型1：求最长/最大区间 | 找到满足“好状态”的最长连续区间 | 窗口进入“坏状态”时，缩 left 至回到“好状态” | 缩窗口完成后，每次扩展 right 后更新 | 无重复字符的最长子串、最长重复子数组 |
| 类型2：求最短/最小区间 | 找到满足“好状态”的最短连续区间 | 窗口进入“好状态”时，缩 left 至回到“坏状态”（尽可能缩小窗口） | 缩窗口过程中，每次缩小 left 后更新 | 长度最小的子数组、最小覆盖子串 |
| 类型3：求计数/统计区间 | 统计所有满足“好状态”的连续区间个数 | 窗口进入“坏状态”时，缩 left 至回到“好状态” | 缩窗口完成后，累加当前 right 对应的有效区间数（right-left+1） | 乘积小于 K 的子数组、找到字符串中所有字母异位词 |

# 三、适用场景：3个核心判断标准

并非所有子串/子数组问题都能用滑动窗口，需满足以下 3 个核心条件，缺一不可：

1. **问题对象是连续区间**：滑动窗口仅适用于“连续子串”或“连续子数组”问题，非连续区间（如子序列）不适用。

2. **窗口状态具有单调性**：需满足前文提到的两条规律之一，即扩展/缩小窗口时，状态变化是单向的。反例：“找和为 target 的子数组（含负数值）”，窗口 [left, right] 和为 target 时，扩展 right 可能因负数导致和变小，打破单调性，无法用滑动窗口。

3. **状态可快速更新**：加入 right 元素或移出 left 元素时，窗口的状态（如和、积、字符频率）能在 O(1) 时间内更新，无需重新计算整个窗口状态。

# 四、通用模板：3类场景统一框架

基于上述分类，提炼出通用模板，只需根据目标调整「缩窗口条件」和「更新答案时机」即可。模板核心步骤：初始化变量 → 扩窗口 → 缩窗口 → 更新答案。

## 4.0 快速参考表

| 类型 | 初始 ans | 缩窗口条件 | 更新答案时机 | 关键代码 |
| --- | --- | --- | --- | --- |
| **类型1：求最长** | `0` | 进入坏状态 | 缩窗口后，每次扩展 right 后 | `ans = Math.max(ans, right - left + 1)` |
| **类型2：求最短** | `Infinity` | 进入好状态 | 缩窗口过程中 | `ans = Math.min(ans, right - left + 1)` |
| **类型3：求计数** | `0` | 进入坏状态 | 缩窗口后 | `ans += right - left + 1` |

## 4.1 通用模板（TypeScript/JavaScript）

```typescript
function slidingWindowTemplate<T>(data: T[], targetParam: any): number {
  // 1. 初始化变量
  let left = 0; // 左窗口边界
  let ans = 初始值; // 答案变量（最长→0，最短→Infinity，计数→0）
  let status = 初始状态; // 如对象（字符频率）、sum=0、prod=1

  // 2. 扩窗口：right 遍历所有元素
  for (let right = 0; right < data.length; right++) {
    const rightVal = data[right];
    // 加入右元素，更新状态
    // status.update(rightVal); // 根据具体类型更新

    // 3. 缩窗口：根据目标和当前状态判断是否缩左
    while (缩窗口条件) {
      // 核心差异点：不同类型场景条件不同
      const leftVal = data[left];
      // 移出左元素，更新状态
      // status.remove(leftVal); // 根据具体类型更新
      left++; // 缩小窗口
    }

    // 4. 更新答案：根据类型调整时机
    // 答案更新逻辑
    // 核心差异点：不同类型场景时机不同
  }

  // 5. 处理边界情况（如无满足条件的窗口）
  return 处理后的 ans;
}
```

## 4.2 分类型模板细化

### 类型1：求最长/最大区间

```typescript
function maxLengthTemplate<T>(data: T[], param: any): number {
  let left = 0;
  let ans = 0; // 最长初始为0
  const status: Record<string, number> = {}; // 对象：记录字符频率

  for (let right = 0; right < data.length; right++) {
    const rightVal = data[right];
    // 更新状态
    status[rightVal as string] = status[rightVal as string] ? status[rightVal as string] + 1 : 1;

    // 缩窗口条件：进入坏状态
    while (坏状态判断) {
      // 如 status[rightVal] > 1（重复字符）
      const leftVal = data[left];
      status[leftVal as string]--;
      left++;
    }

    // 更新答案：缩窗口后，当前窗口是有效最长窗口
    ans = Math.max(ans, right - left + 1);
  }

  return ans;
}
```

### 类型2：求最短/最小区间

```typescript
function minLengthTemplate(data: number[], param: any): number {
  let left = 0;
  let ans = Infinity; // 最短初始为无穷大
  let status = 0; // 如 sumWindow = 0

  for (let right = 0; right < data.length; right++) {
    const rightVal = data[right];
    status += rightVal; // 更新状态

    // 缩窗口条件：进入好状态（尽可能缩小窗口）
    while (好状态判断) {
      // 如 status >= target（和≥目标）
      // 缩窗口时更新答案
      ans = Math.min(ans, right - left + 1);
      const leftVal = data[left];
      status -= leftVal;
      left++;
    }
  }

  // 处理边界：无满足条件的窗口返回0
  return ans !== Infinity ? ans : 0;
}
```

### 类型3：求计数/统计区间

```typescript
function countTemplate(data: number[], param: any): number {
  let left = 0;
  let ans = 0; // 计数初始为0
  let status = 1; // 如 prod = 1

  for (let right = 0; right < data.length; right++) {
    const rightVal = data[right];
    status *= rightVal; // 更新状态

    // 缩窗口条件：进入坏状态
    while (坏状态判断) {
      // 如 status >= K（乘积≥K）
      const leftVal = data[left];
      status /= leftVal;
      left++;
    }

    // 更新答案：当前right对应的有效区间数 = right-left+1
    ans += right - left + 1;
  }

  return ans;
}
```

# 五、经典例题实战：逐行拆解

结合模板，拆解 3 类场景的经典例题，帮你理解如何将模板落地到具体问题。

## 例题1：无重复字符的最长子串（类型1：求最长）

### 题目描述

给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。

### 解题思路

- **窗口状态（坏）**：窗口内存在重复字符；
- **状态统计**：用对象记录窗口内字符的出现次数；
- **缩窗口条件**：当前加入的字符出现次数>1（进入坏状态）；
- **更新答案**：缩窗口完成后，计算当前窗口长度，更新最大值。

### 代码实现

```typescript
function lengthOfLongestSubstring(s: string): number {
  let left = 0;
  let ans = 0; // 最长子串长度初始为0
  const window: Record<string, number> = {}; // 对象：记录窗口内字符出现次数

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right];
    // 加入右字符，更新状态
    window[rightChar] = window[rightChar] ? window[rightChar] + 1 : 1;

    // 缩窗口：当当前字符出现次数>1（坏状态），缩左直到无重复
    while (window[rightChar] > 1) {
      const leftChar = s[left];
      window[leftChar]--; // 移出左字符，更新状态
      left++;
    }

    // 更新答案：当前窗口是无重复的有效窗口，计算长度
    ans = Math.max(ans, right - left + 1);
  }

  return ans;
}
```

### 复杂度分析

时间复杂度 O(n)：每个字符被 right 加入、left 移出各一次；空间复杂度 O(min(m, n)))：m 是字符集大小，窗口内字符数不超过 min(m, n)。

## 例题2：长度最小的子数组（类型2：求最短）

### 题目描述

给定一个含有 n 个正整数的数组和一个正整数 target，找出该数组中满足其和 ≥ target 的长度最小的 连续子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

### 解题思路

- **窗口状态（好）**：窗口和≥target；
- **状态统计**：用 sumWindow 记录窗口内元素和；
- **缩窗口条件**：sumWindow≥target（进入好状态），缩左以寻找更短窗口；
- **更新答案**：缩窗口过程中，每次缩小后计算窗口长度，更新最小值。

### 代码实现

```typescript
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let ans = Infinity; // 最短长度初始为无穷大
  let sumWindow = 0; // 窗口内元素和

  for (let right = 0; right < nums.length; right++) {
    sumWindow += nums[right]; // 加入右元素，更新和

    // 缩窗口：和≥target时，尽可能缩小窗口
    while (sumWindow >= target) {
      // 缩窗口时更新答案：当前窗口是有效最短窗口候选
      ans = Math.min(ans, right - left + 1);
      sumWindow -= nums[left]; // 移出左元素，更新和
      left++;
    }
  }

  // 处理边界：无满足条件的窗口返回0
  return ans !== Infinity ? ans : 0;
}
```

### 复杂度分析

时间复杂度 O(n)：每个元素最多被遍历两次；空间复杂度 O(1)：仅用常数级变量。

## 例题3：乘积小于 K 的子数组（类型3：求计数）

### 题目描述

给你一个整数数组 nums 和一个整数 k，统计并返回该数组中乘积小于 k 的连续子数组的个数。

### 解题思路

- **窗口状态（坏）**：窗口乘积≥k；
- **状态统计**：用 prod 记录窗口内元素乘积；
- **缩窗口条件**：prod≥k（进入坏状态），缩左直到乘积<k；
- **更新答案**：缩窗口完成后，当前 right 对应的有效子数组数为 right-left+1（即 [left,right]、[left+1,right]...[right,right]）。

### 代码实现

```typescript
function numSubarrayProductLessThanK(nums: number[], k: number): number {
  // 边界条件：k≤1时，所有正整数乘积≥1，无满足条件的子数组
  if (k <= 1) {
    return 0;
  }
  let left = 0;
  let ans = 0; // 计数初始为0
  let prod = 1; // 窗口内元素乘积

  for (let right = 0; right < nums.length; right++) {
    prod *= nums[right]; // 加入右元素，更新乘积

    // 缩窗口：乘积≥k时，缩左直到乘积<k
    while (prod >= k) {
      prod /= nums[left]; // 移出左元素，更新乘积
      left++;
    }

    // 累加当前right对应的有效子数组数
    // 当窗口 [left, right] 的乘积 < k 时，以 right 结尾的所有子数组都满足条件
    // 即 [left,right]、[left+1,right]...[right,right] 共 right-left+1 个
    ans += right - left + 1;
  }

  return ans;
}
```

### 复杂度分析

时间复杂度 O(n)：每个元素最多被遍历两次；空间复杂度 O(1)：仅用常数级变量。

# 六、新手避坑指南

1. **窗口边界统一**：建议全程使用「左闭右闭」或「左闭右开」边界定义，不要混用。本文所有例题均采用「左闭右闭」，窗口长度为 right-left+1。

2. **状态更新顺序**：缩窗口时，需先更新状态（如减 sum、除 prod），再移动 left 指针，避免漏算或多算。

3. **边界条件处理**：
   - 求最短时，初始 ans 设为无穷大，最后需判断是否更新过（未更新则返回 0）；

   - 乘积问题需注意 k≤1 的情况（正整数乘积最小为 1，直接返回 0）；

   - 空字符串/空数组需提前返回 0。

4. **单调性验证**：遇到子串/子数组问题时，先手动模拟 2-3 个案例，确认状态是否满足单调性，再决定是否用滑动窗口。

# 七、总结

滑动窗口的核心是「用单调性压缩遍历维度」，剪枝只是优化手段。掌握它的关键在于：

1. 判断问题是否满足「连续区间+状态单调性+状态可快速更新」；

2. 根据目标（最长/最短/计数）确定「缩窗口条件」和「更新答案时机」；

3. 套用通用模板，灵活调整状态统计工具（哈希表/和/积）。

只要抓住这三点，无论是简单的“无重复子串”，还是复杂的“最小覆盖子串”，都能按此逻辑拆解。建议多做几道经典例题，固化模板思维，面试时就能快速反应。

## 练习题推荐

按难度和类型分类，建议按顺序练习：

### 基础题（必做）

- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) - 类型1：求最长
- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/) - 类型2：求最短
- [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/) - 类型3：求计数

### 进阶题（推荐）

- [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/) - 类型3：固定窗口
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/) - 类型2：复杂场景
- [567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/) - 类型3：固定窗口变种

### 扩展题（挑战）

- [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/) - 需要结合单调队列
- [424. 替换后的最长重复字符](https://leetcode.cn/problems/longest-repeating-character-replacement/) - 类型1：变种
