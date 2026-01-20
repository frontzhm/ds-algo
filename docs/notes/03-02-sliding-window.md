# 前端算法必备：滑动窗口从入门到很熟练（最长/最短/计数三大类型）

> 📺 **推荐视频**：[滑动窗口算法详解](https://b23.tv/rU4vRca) - 视频解释非常清晰，建议先看视频再阅读本文！

> 📚 **相关文档**：[双指针详解](https://juejin.cn/post/7593692797765976106) - 滑动窗口是双指针的重要应用

在算法面试中，子串、子数组相关的问题频繁出现，暴力枚举往往因 O(n²) 时间复杂度超时。而滑动窗口算法，凭借其 O(n) 的高效性能，成为解决这类问题的"神兵利器"。本文将从原理本质出发，梳理滑动窗口的分类、适用场景，提炼通用模板，并结合经典例题实战拆解，帮你彻底掌握这一核心算法。

## 📑 目录

- [一、滑动窗口核心原理](#一滑动窗口核心原理用单调性压缩遍历维度)
  - [1.1 先搞懂：暴力枚举的痛点](#11-先搞懂暴力枚举的痛点)
  - [1.2 滑动窗口的核心洞察：区间单调性](#12-滑动窗口的核心洞察区间单调性)
  - [1.3 一句话总结原理](#13-一句话总结原理)
  - [1.4 剪枝思想：每次移动指针"干掉"某些组合](#14-剪枝思想每次移动指针干掉某些组合)
- [二、滑动窗口的分类](#二滑动窗口的分类按目标场景划分)
- [三、适用场景](#三适用场景3个核心判断标准)
- [四、通用模板](#四通用模板3类场景统一框架)
- [五、经典例题实战](#五经典例题实战逐行拆解)
- [六、新手避坑指南](#六新手避坑指南)
<!-- - [七、前端应用场景](#七前端应用场景) -->
- [总结](#总结)

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

## 1.4 剪枝思想：每次移动指针"干掉"某些组合

> 🎯 **交互演示**：[点击这里查看动态演示](https://frontzhm.github.io/blog-demo/sliding-window.html) - 通过交互式可视化，直观看到每一步剪掉的组合！

**核心思想**：滑动窗口和相向指针一样，都通过**移动指针来"干掉"某些组合**，实现从 O(n²) 到 O(n) 的优化。

### 1.4.1 理解暴力枚举的搜索空间

以"无重复字符的最长子串"为例，字符串 `s = "abcabcbb"`：

暴力枚举需要检查所有可能的 `(i, j)` 组合，其中 `i ≤ j`。这形成了一个矩阵：

```
所有可能的组合 (i, j)，其中 i ≤ j：

      j=0  1  2  3  4  5  6  7
i=0   00 01 02 03 04 05 06 07  ← 第0行
i=1   -  11 12 13 14 15 16 17  ← 第1行
i=2   -  -  22 23 24 25 26 27  ← 第2行
i=3   -  -  -  33 34 35 36 37  ← 第3行
i=4   -  -  -  -  44 45 46 47  ← 第4行
i=5   -  -  -  -  -  55 56 57  ← 第5行
i=6   -  -  -  -  -  -  66 67  ← 第6行
i=7   -  -  -  -  -  -  -  77  ← 第7行

总共有 N*(N+1)/2 = 8*9/2 = 36 个组合需要检查
时间复杂度：O(n²)
```

### 1.4.2 滑动窗口的剪枝策略

**剪枝规则1：如果 `(left, right)` 存在重复字符，则 `(left, right+1...end)` 都存在重复字符**

假设当前 `left = 0`, `right = 3`，窗口 `[0,3] = "abca"` 包含重复字符 'a'：

```
当前状态：left=0, right=3
当前窗口：[0,3] = "abca"（存在重复字符 'a'）

矩阵中当前检查的位置：
      j=0  1  2  3  4  5  6  7
i=0   00 01 02 [03] 04 05 06 07  ← 当前检查 (0,3)
i=1   -  11 12 13 14 15 16 17
i=2   -  -  22 23 24 25 26 27
...

剪枝逻辑：
如果 (left, right) 存在重复字符，那么：
- 所有 (left, right+1) ... (left, end) 都包含重复字符
- 因为窗口 [left, right+1] 包含窗口 [left, right]，必然也重复

因此，可以剪掉第 left 行的所有后续组合：
      j=0  1  2  3  4  5  6  7
i=0   00 01 02 [03] ✂️ ✂️ ✂️ ✂️ ✂️  ← 剪掉整行！
i=1   -  11 12 13 14 15 16 17
i=2   -  -  22 23 24 25 26 27
...

移动 left++，跳过第0行的所有剩余组合
```

**剪枝规则2：如果 `(left, right)` 不存在重复字符，则 `(left+1...right, right)` 也不存在重复字符**

```
当前状态：left=0, right=2
当前窗口：[0,2] = "abc"（不存在重复字符）

矩阵中当前检查的位置：
      j=0  1  2  3  4  5  6  7
i=0   00 01 [02] 03 04 05 06 07  ← 当前检查 (0,2)
i=1   -  11 12 13 14 15 16 17
i=2   -  -  22 23 24 25 26 27
...

剪枝逻辑：
如果 (left, right) 不存在重复字符，那么：
- 所有 (left+1, right) ... (right, right) 都不存在重复字符
- 因为窗口 [left+1, right] 是窗口 [left, right] 的子集

因此，可以继续扩展 right，探索更长的有效窗口
移动 right++，继续探索（不剪枝，但避免重复检查）
```

### 1.4.3 剪枝效果可视化

每次移动指针，都会剪掉**整行**或**整列**，大大减少搜索空间：

```
字符串："abcabcbb"
初始：需要检查 36 个组合

第1步：left=0, right=0, 窗口="a"（无重复）
       移动 right++，继续探索
       剩余：36 个组合（未剪枝，但只检查了1个）

第2步：left=0, right=1, 窗口="ab"（无重复）
       移动 right++，继续探索
       剩余：36 个组合（未剪枝，但只检查了2个）

第3步：left=0, right=2, 窗口="abc"（无重复）
       移动 right++，继续探索
       剩余：36 个组合（未剪枝，但只检查了3个）

第4步：left=0, right=3, 窗口="abca"（有重复！）
       移动 left++，剪掉第0行的所有剩余组合（4个组合）
       剩余：36 - 4 = 32 个组合

第5步：left=1, right=3, 窗口="bca"（无重复）
       移动 right++，继续探索
       剩余：32 个组合（未剪枝，但只检查了5个）

... 继续剪枝

最终：只需要检查 O(n) 个组合，而不是 O(n²)
```

**核心思想总结**：

1. **移动 left 指针**：当窗口存在重复字符时，移动 `left++` → 剪掉第 `left` 行的所有剩余组合
2. **移动 right 指针**：当窗口无重复字符时，移动 `right++` → 继续探索（避免重复检查）
3. **共同点**：每次移动指针，都会"干掉"某些组合，避免无效计算

这与相向指针的剪枝思想完全一致：**通过移动指针剪掉整行或整列，实现 O(n²) → O(n) 的优化**。

> 💡 **提示**：想要更直观地理解剪枝过程？[点击这里体验交互式演示](https://frontzhm.github.io/blog-demo/sliding-window.html)，每一步都能看到被剪掉的组合！

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

**剪枝思想**：当窗口 `[left, right]` 存在重复字符时，移动 `left++` → 剪掉第 `left` 行的所有剩余组合 `(left, right+1)` 到 `(left, end)`，因为这些组合必然也包含重复字符。

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

### 优化方案：使用 Map 存储字符索引（更快）

**核心优化**：用 `Map` 存储字符的**最新索引**，而不是出现次数。当发现重复字符时，可以直接将 `left` 指针移动到重复字符上次出现的位置+1，避免逐步移动。

**优势**：

- **时间复杂度更优**：最坏情况下仍然是 O(n)，但平均情况下更快
- **减少循环次数**：不需要 `while` 循环逐步移动 `left`，直接跳转

**代码实现（优化版）：**

```typescript
function lengthOfLongestSubstring(s: string): number {
  let left = 0;
  let ans = 0;
  const charIndexMap = new Map<string, number>(); // Map：字符 -> 最新索引

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right];

    // 如果字符已存在，且索引 >= left（在窗口内），说明有重复
    if (charIndexMap.has(rightChar) && charIndexMap.get(rightChar)! >= left) {
      // 直接将 left 移动到重复字符上次出现的位置+1
      left = charIndexMap.get(rightChar)! + 1;
    }

    // 更新字符的最新索引
    charIndexMap.set(rightChar, right);

    // 更新答案：当前窗口是无重复的有效窗口
    ans = Math.max(ans, right - left + 1);
  }

  return ans;
}
```

**关键点解析**：

1. **`charIndexMap.get(rightChar)! >= left`**：这个判断很重要！
   - 如果字符的索引 `< left`，说明该字符不在当前窗口内，不算重复
   - 只有当索引 `>= left` 时，才说明在当前窗口内重复了

2. **直接跳转**：`left = charIndexMap.get(rightChar)! + 1`
   - 不需要 `while` 循环逐步移动
   - 直接跳到重复字符上次出现的位置+1

**执行过程示例**：

```typescript
字符串："abcabcbb"

初始：left = 0, ans = 0, charIndexMap = {}

right=0, char='a':
  - charIndexMap 中没有 'a'，直接更新
  - charIndexMap = {'a': 0}
  - ans = max(0, 0-0+1) = 1

right=1, char='b':
  - charIndexMap 中没有 'b'，直接更新
  - charIndexMap = {'a': 0, 'b': 1}
  - ans = max(1, 1-0+1) = 2

right=2, char='c':
  - charIndexMap 中没有 'c'，直接更新
  - charIndexMap = {'a': 0, 'b': 1, 'c': 2}
  - ans = max(2, 2-0+1) = 3

right=3, char='a':
  - charIndexMap 中有 'a'，且索引 0 >= left(0)，说明重复！
  - left = 0 + 1 = 1（直接跳转）
  - charIndexMap = {'a': 3, 'b': 1, 'c': 2}
  - ans = max(3, 3-1+1) = 3

right=4, char='b':
  - charIndexMap 中有 'b'，且索引 1 >= left(1)，说明重复！
  - left = 1 + 1 = 2（直接跳转）
  - charIndexMap = {'a': 3, 'b': 4, 'c': 2}
  - ans = max(3, 4-2+1) = 3

... 继续
```

**两种方案对比**：

| 方案 | 数据结构 | 移动 left 方式 | 时间复杂度 | 适用场景 |
| --- | --- | --- | --- | --- |
| **基础版** | `Record<string, number>`（出现次数） | `while` 循环逐步移动 | O(n) | 理解原理，代码直观 |
| **优化版** | `Map<string, number>`（最新索引） | 直接跳转到重复位置+1 | O(n) | 性能更优，代码更简洁 |

**推荐**：面试时可以先说基础版，然后提到优化版，展示对算法的深入理解。

### 复杂度分析

- **时间复杂度 O(n)**：每个字符被 right 加入、left 移出各一次，每个元素最多被访问两次
- **空间复杂度 O(min(m, n))**：m 是字符集大小，窗口内字符数不超过 min(m, n)

**为什么是 O(n) 而不是 O(n²)？**

关键在于：left 和 right 都**只向前移动**，不会回退。每个元素最多被：

- right 访问一次（加入窗口）
- left 访问一次（移出窗口）

因此总时间复杂度是 O(2n) = O(n)。

### 易错点分析

1. **❌ 错误：在 while 循环外更新答案**

   ```typescript
   // 错误：窗口可能处于坏状态时就更新了答案
   while (window[rightChar] > 1) {
     // ...
   }
   ans = Math.max(ans, right - left + 1); // ❌ 应该在while循环后
   ```

2. **❌ 错误：状态更新顺序错误**

   ```typescript
   // 错误：先移动left，再更新状态
   left++;
   window[leftChar]--; // ❌ 应该先更新状态，再移动left
   ```

3. **✅ 正确写法**：
   ```typescript
   // 先更新状态，再移动指针
   window[leftChar]--;
   left++;
   // 然后在while循环后更新答案
   ans = Math.max(ans, right - left + 1);
   ```

## 例题2：长度最小的子数组（类型2：求最短）

### 题目描述

给定一个含有 n 个正整数的数组和一个正整数 target，找出该数组中满足其和 ≥ target 的长度最小的 连续子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

### 解题思路

- **窗口状态（好）**：窗口和≥target；
- **状态统计**：用 sumWindow 记录窗口内元素和；
- **缩窗口条件**：sumWindow≥target（进入好状态），缩左以寻找更短窗口；
- **更新答案**：缩窗口过程中，每次缩小后计算窗口长度，更新最小值。

**剪枝思想**：当窗口 `[left, right]` 的和≥target时，移动 `left++` → 剪掉第 `left` 行的所有剩余组合 `(left, right+1)` 到 `(left, end)`，因为这些组合的和必然也≥target（数组元素为正数），但长度更长，不是最优解。

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

- **时间复杂度 O(n)**：每个元素最多被遍历两次（right 加入一次，left 移出一次）
- **空间复杂度 O(1)**：仅用常数级变量（left、right、ans、sumWindow）

### 易错点分析

1. **❌ 错误：在 while 循环外更新答案**

   ```typescript
   // 错误：只在while循环外更新，会漏掉一些有效窗口
   while (sumWindow >= target) {
     sumWindow -= nums[left];
     left++;
   }
   ans = Math.min(ans, right - left + 1); // ❌ 应该在while循环内更新
   ```

2. **❌ 错误：边界处理缺失**

   ```typescript
   // 错误：没有处理无满足条件窗口的情况
   return ans; // ❌ 如果ans还是Infinity，应该返回0
   ```

3. **✅ 正确写法**：
   ```typescript
   // 在while循环内更新答案（每次缩小窗口时）
   while (sumWindow >= target) {
     ans = Math.min(ans, right - left + 1); // ✅ 在循环内更新
     sumWindow -= nums[left];
     left++;
   }
   // 处理边界：无满足条件的窗口返回0
   return ans !== Infinity ? ans : 0; // ✅ 检查是否更新过
   ```

## 例题3：乘积小于 K 的子数组（类型3：求计数）

### 题目描述

给你一个整数数组 nums 和一个整数 k，统计并返回该数组中乘积小于 k 的连续子数组的个数。

### 解题思路

- **窗口状态（坏）**：窗口乘积≥k；
- **状态统计**：用 prod 记录窗口内元素乘积；
- **缩窗口条件**：prod≥k（进入坏状态），缩左直到乘积<k；
- **更新答案**：缩窗口完成后，当前 right 对应的有效子数组数为 right-left+1（即 [left,right]、[left+1,right]...[right,right]）。

**剪枝思想**：当窗口 `[left, right]` 的乘积≥k时，移动 `left++` → 剪掉第 `left` 行的所有剩余组合 `(left, right+1)` 到 `(left, end)`，因为这些组合的乘积必然也≥k（数组元素为正数）。

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

- **时间复杂度 O(n)**：每个元素最多被遍历两次（right 加入一次，left 移出一次）
- **空间复杂度 O(1)**：仅用常数级变量（left、right、ans、prod）

### 易错点分析

1. **❌ 错误：边界条件未处理**

   ```typescript
   // 错误：没有处理 k≤1 的情况
   function numSubarrayProductLessThanK(nums, k) {
     let prod = 1;
     // ... 直接开始循环 ❌
   }
   ```

2. **❌ 错误：计数逻辑理解错误**

   ```typescript
   // 错误：每次只加1，没有理解"以right结尾的所有子数组"
   ans += 1; // ❌ 应该是 right - left + 1
   ```

3. **✅ 正确理解**：
   ```typescript
   // 当窗口 [left, right] 的乘积 < k 时
   // 以 right 结尾的所有子数组都满足条件：
   // [left,right]、[left+1,right]...[right,right]
   // 共 right - left + 1 个
   ans += right - left + 1; // ✅ 正确
   ```

# 六、新手避坑指南

1. **窗口边界统一**：建议全程使用「左闭右闭」或「左闭右开」边界定义，不要混用。本文所有例题均采用「左闭右闭」，窗口长度为 right-left+1。

2. **状态更新顺序**：缩窗口时，需先更新状态（如减 sum、除 prod），再移动 left 指针，避免漏算或多算。

3. **边界条件处理**：
   - 求最短时，初始 ans 设为无穷大，最后需判断是否更新过（未更新则返回 0）；

   - 乘积问题需注意 k≤1 的情况（正整数乘积最小为 1，直接返回 0）；

   - 空字符串/空数组需提前返回 0。

4. **单调性验证**：遇到子串/子数组问题时，先手动模拟 2-3 个案例，确认状态是否满足单调性，再决定是否用滑动窗口。

5. **更新答案的时机**：
   - **类型1（求最长）**：在 while 循环**之后**更新，确保窗口处于好状态
   - **类型2（求最短）**：在 while 循环**内部**更新，每次缩小窗口时都更新
   - **类型3（求计数）**：在 while 循环**之后**更新，累加有效区间数

6. **状态更新顺序**：

   ```typescript
   // ✅ 正确顺序：先更新状态，再移动指针
   window[leftChar]--; // 1. 更新状态
   left++; // 2. 移动指针

   // ❌ 错误顺序：先移动指针，再更新状态（会导致状态不一致）
   left++;
   window[leftChar]--; // 此时leftChar已经是下一个字符了！
   ```

7. **边界情况检查清单**：
   - [ ] 空字符串/空数组：`if (s.length === 0) return 0;`
   - [ ] 单元素：`if (s.length === 1) return 1;`
   - [ ] 求最短时，检查 ans 是否更新过：`return ans !== Infinity ? ans : 0;`
   - [ ] 乘积问题时，检查 k≤1：`if (k <= 1) return 0;`

<!--

# 七、前端应用场景

滑动窗口在前端开发中有很多实际应用，掌握它不仅能解决算法题，还能优化实际业务代码。

## 7.1 搜索建议（防抖优化）

**场景**：用户输入搜索关键词时，实时显示搜索建议。

**问题**：如果每次输入都发送请求，会导致请求过多，性能差。

**解决方案**：使用滑动窗口 + 防抖，只在用户停止输入一段时间后才发送请求。

```typescript
function debounceSearch(input: string, delay: number = 300): void {
  let timer: NodeJS.Timeout;

  // 滑动窗口：维护一个时间窗口，窗口内只执行最后一次
  return function (searchTerm: string) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // 发送搜索请求
      fetchSearchSuggestions(searchTerm);
    }, delay);
  };
}

// 使用示例
const debouncedSearch = debounceSearch('', 300);
input.addEventListener('input', e => {
  debouncedSearch(e.target.value);
});
```

## 7.2 无限滚动加载

**场景**：滚动到底部时加载更多内容。

**问题**：滚动事件触发频繁，需要判断是否真的到达底部。

**解决方案**：使用滑动窗口判断滚动位置。

```typescript
function setupInfiniteScroll(loadMore: () => void) {
  let lastScrollTop = 0; // 上次滚动位置（左指针）
  const threshold = 100; // 距离底部的阈值

  window.addEventListener('scroll', () => {
    const currentScrollTop = window.scrollY; // 当前滚动位置（右指针）
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 滑动窗口：判断是否到达底部
    if (currentScrollTop + windowHeight >= documentHeight - threshold) {
      loadMore();
      lastScrollTop = currentScrollTop; // 更新左指针
    }
  });
}
```

## 7.3 性能监控：统计时间窗口内的错误率

**场景**：监控前端错误，统计最近5分钟内的错误率。

**解决方案**：使用滑动窗口维护时间窗口内的错误记录。

```typescript
class ErrorMonitor {
  private errors: Array<{ timestamp: number; error: Error }> = [];
  private windowSize = 5 * 60 * 1000; // 5分钟（毫秒）

  recordError(error: Error): void {
    const now = Date.now();
    this.errors.push({ timestamp: now, error });

    // 滑动窗口：移除窗口外的错误记录
    while (this.errors.length > 0 && now - this.errors[0].timestamp > this.windowSize) {
      this.errors.shift(); // 移除最旧的记录
    }
  }

  getErrorRate(): number {
    const now = Date.now();
    // 确保窗口内的记录都是有效的
    while (this.errors.length > 0 && now - this.errors[0].timestamp > this.windowSize) {
      this.errors.shift();
    }

    // 计算错误率（假设总请求数为 totalRequests）
    return this.errors.length / this.getTotalRequestsInWindow();
  }
}
```

## 7.4 数据流处理：实时统计最近N条数据的平均值

**场景**：实时显示最近100条数据的平均值（如股票价格、温度等）。

**解决方案**：使用滑动窗口维护固定大小的数据窗口。

```typescript
class MovingAverage {
  private window: number[] = [];
  private windowSize: number;
  private sum: number = 0;

  constructor(windowSize: number) {
    this.windowSize = windowSize;
  }

  add(value: number): number {
    this.window.push(value);
    this.sum += value;

    // 滑动窗口：如果超过窗口大小，移除最旧的元素
    if (this.window.length > this.windowSize) {
      const removed = this.window.shift()!;
      this.sum -= removed;
    }

    return this.getAverage();
  }

  getAverage(): number {
    return this.window.length > 0 ? this.sum / this.window.length : 0;
  }
}

// 使用示例：实时显示最近100条数据的平均值
const ma = new MovingAverage(100);
dataStream.on('data', value => {
  const avg = ma.add(value);
  updateUI(avg);
});
```

## 7.5 文本编辑器：查找和替换功能

**场景**：在文本编辑器中查找特定模式的文本（如查找所有连续的数字）。

**解决方案**：使用滑动窗口匹配模式。

```typescript
function findPattern(text: string, pattern: string): number[] {
  const results: number[] = [];
  const patternLen = pattern.length;
  let left = 0;

  // 滑动窗口：固定窗口大小（pattern的长度）
  for (let right = patternLen - 1; right < text.length; right++) {
    const window = text.substring(left, right + 1);

    if (window === pattern) {
      results.push(left); // 记录匹配位置
    }

    left++; // 窗口滑动
  }

  return results;
}
```

## 7.6 性能优化：虚拟列表（Virtual List）

**场景**：渲染大量列表项时，只渲染可见区域内的项。

**解决方案**：使用滑动窗口确定可见区域。

```typescript
class VirtualList {
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;

  getVisibleRange(): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = start + visibleCount;

    return { start, end };
  }

  onScroll(scrollTop: number): void {
    this.scrollTop = scrollTop;
    // 滑动窗口：只渲染可见区域内的项
    const { start, end } = this.getVisibleRange();
    this.renderItems(start, end);
  }
}
```

## 7.7 总结：前端应用的核心思路

滑动窗口在前端的应用核心是**时间窗口**和**数据窗口**：

1. **时间窗口**：在一段时间内只执行一次操作（防抖、节流）
2. **数据窗口**：只处理窗口内的数据（无限滚动、性能监控）
3. **固定窗口**：窗口大小固定（虚拟列表、分页）
4. **可变窗口**：窗口大小可变（搜索建议、错误监控）

掌握滑动窗口，不仅能解决算法题，还能优化实际业务代码的性能！
-->

# 总结

滑动窗口的核心是「用单调性压缩遍历维度」，通过**移动指针剪掉整行或整列**实现剪枝优化。掌握它的关键在于：

1. 判断问题是否满足「连续区间+状态单调性+状态可快速更新」；

2. 根据目标（最长/最短/计数）确定「缩窗口条件」和「更新答案时机」；

3. 套用通用模板，灵活调整状态统计工具（哈希表/和/积）。

只要抓住这三点，无论是简单的“无重复子串”，还是复杂的“最小覆盖子串”，都能按此逻辑拆解。建议多做几道经典例题，固化模板思维，面试时就能快速反应。

### 核心要点回顾

1. **判断标准**：连续区间 + 状态单调性 + 状态可快速更新
2. **剪枝思想**：每次移动指针，都会"干掉"某些组合（剪掉整行或整列），实现 O(n²) → O(n) 优化
3. **三种类型**：
   - 类型1（求最长）：坏状态时缩窗，缩窗后更新答案
   - 类型2（求最短）：好状态时缩窗，缩窗过程中更新答案
   - 类型3（求计数）：坏状态时缩窗，缩窗后累加有效区间数
4. **模板步骤**：初始化 → 扩窗口 → 缩窗口 → 更新答案
5. **时间复杂度**：O(n)，每个元素最多被访问两次
6. **空间复杂度**：O(1) 或 O(min(m,n))，取决于状态统计方式

### 相关资源

- 📖 [双指针详解](https://juejin.cn/post/7593692797765976106) - 滑动窗口是双指针的重要应用
- 📖 [算法思想总览](./03-algorithms.md) - 了解滑动窗口在算法体系中的位置
- 💻 [LeetCode 滑动窗口专题](https://leetcode.cn/tag/sliding-window/) - 刷题练习

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

~ 一般我走到这里就回去了，有兴趣就继续~

- [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/) - 需要结合单调队列
- [424. 替换后的最长重复字符](https://leetcode.cn/problems/longest-repeating-character-replacement/) - 类型1：变种

---
