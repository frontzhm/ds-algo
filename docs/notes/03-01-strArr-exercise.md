# 数组 & 字符串（前端第一高频，25题）

数组和字符串是前端处理接口数据、DOM 操作、文本处理的核心载体，该板块题目占前端算法面试的 30%，必须吃透。

## 核心考点

双指针（快慢 / 左右）、滑动窗口、原地修改、边界处理。

## 必刷题目（按高频优先级排序）

### 1. 26. 删除有序数组中的重复项

**LeetCode链接**：[https://leetcode.cn/problems/remove-duplicates-from-sorted-array/](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

**题目描述**：给你一个升序排列的数组 `nums`，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。元素的相对顺序需要保持一致。要求不能使用额外的数组空间，必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

**示例**：

- 示例1：输入 `nums = [1,1,2]`，输出 `2`，此时 nums 前2个元素为 `[1,2]`；

- 示例2：输入 `nums = [0,0,1,1,1,2,2,3,3,4]`，输出 `5`，此时 nums 前5个元素为 `[0,1,2,3,4]`。

```js
function d(nums) {
  const len = nums.length;
  if (len <= 1) return len;
  // left指向已知的不重复的最后一个元素
  let left = 0;
  // const map = new Map([nums[left], 1]);
  for (let right = 1; right < len; right++) {
    const curVal = nums[right];
    // const curKey = curVal;
    // 重复的话，啥都不做，继续遍历
    // 不重复的话，先map记录，填充到不重复的下一个位置，更新left指针
    if (curVal > nums[left]) {
      // map.set(curKey, 1);
      nums[left + 1] = curVal;
      left++;
    }
  }
  // 注意是长度
  return left + 1;
}
```

注意是升序

```js
function d(nums) {
  const len = nums.length;
  if (len <= 1) return len;
  // left指向已知的不重复的最后一个元素
  let left = 0;
  const map = new Map([nums[left], 1]);
  for (let right = 1; right < len; right++) {
    const curVal = nums[right];
    const curKey = curVal;
    // 重复的话，啥都不做，继续遍历
    // 不重复的话，先map记录，填充到不重复的下一个位置，更新left指针
    if (!map.has(curKey)) {
      map.set(curKey, 1);
      nums[left + 1] = curVal;
      left++;
    }
  }
  // 注意是长度
  return left + 1;
}
```

### 2. 27. 移除元素

**LeetCode链接**：[https://leetcode.cn/problems/remove-element/](https://leetcode.cn/problems/remove-element/)

**题目描述**：给你一个数组 `nums` 和一个值 `val`，你需要原地移除所有数值等于 `val` 的元素，并返回移除后数组的新长度。要求不要使用额外的数组空间，必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

**示例**：

- 示例1：输入 `nums = [3,2,2,3], val = 3`，输出 `2`，此时 nums 前2个元素为 `[2,2]`；

- 示例2：输入 `nums = [0,1,2,2,3,0,4,2], val = 2`，输出 `5`，此时 nums 前5个元素为 `[0,1,4,0,3]`（元素顺序可任意）。

```js
function d(nums, val) {
  const len = nums.length;
  if (len === 0) return 0;

  let left = 0;
  let right = len - 1;

  // 相向指针遍历：左找要删的，右找可替换的
  while (left < right) {
    // 右指针左移，找到第一个不等于val的元素
    while (left < right && nums[right] === val) {
      right--;
    }
    // 左指针找到等于val的元素，交换到右指针位置（移到末尾）
    if (nums[left] === val) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      right--;
    }
    // 左指针不等于val，直接右移
    if (nums[left] !== val) {
      left++;
    }
  }

  // 关键：最后检查重合位置的元素是否等于val（决定最终长度）
  return nums[left] === val ? left : left + 1;
}
```

简洁

```js
function d(nums, val) {
  const len = nums.length;
  if (len === 0) return 0;

  // 下一个不是val放的位置
  let slow = 0;
  for (let fast = 0; fast < len; fast++) {
    const cur = nums[fast];
    if (cur !== val) {
      nums[slow] = cur;
      slow++;
    }
  }
  return slow;
}
```

### 3. 3. 无重复字符的最长子串

**LeetCode链接**：[https://leetcode.cn/problems/longest-substring-without-repeating-characters/](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**题目描述**：给定一个字符串 `s`，请你找出其中不含有重复字符的最长子串的长度。

**示例**：

- 示例1：输入 `s = "abcabcbb"`，输出 `3`，最长无重复字符的子串为"abc"；

- 示例2：输入 `s = "bbbbb"`，输出 `1`，最长无重复字符的子串为"b"；

- 示例3：输入 `s = "pwwkew"`，输出 `3`，最长无重复字符的子串为"wke"（注意"pwke"是子序列而非子串）。

### 4. 15. 三数之和

**LeetCode链接**：[https://leetcode.cn/problems/3sum/](https://leetcode.cn/problems/3sum/)

**题目描述**：给你一个整数数组 `nums`，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k`，同时还满足 `nums[i] + nums[j] + nums[k] == 0`。请你返回所有和为 0 且不重复的三元组。注意：答案中不可以包含重复的三元组。

**示例**：

- 示例1：输入 `nums = [-1,0,1,2,-1,-4]`，输出 `[[-1,-1,2],[-1,0,1]]`；

- 示例2：输入 `nums = [0,1,1]`，输出 `[]`；

- 示例3：输入 `nums = [0,0,0]`，输出 `[[0,0,0]]`。

```js
function d(nums) {
  // 显式处理长度不足3的情况，更直观
  if (nums.length < 3) return [];
  // 升序排序：双指针和去重的基础
  nums.sort((x, y) => x - y);
  const len = nums.length;
  const res = [];

  for (let i = 0; i < len - 2; i++) {
    const fixed = nums[i];
    // 提前剪枝：最小值>0，后续不可能凑出和为0的三元组
    if (fixed > 0) break;
    // 跳过重复的固定值，避免重复三元组（关键：对比前一个值）
    if (i > 0 && fixed === nums[i - 1]) continue;

    let left = i + 1;
    let right = len - 1;
    while (left < right) {
      const sum = fixed + nums[left] + nums[right];
      if (sum === 0) {
        res.push([fixed, nums[left], nums[right]]);
        // 跳过left的所有重复值（相邻重复）
        while (left < right && nums[left] === nums[left + 1]) left++;
        // 跳过right的所有重复值（相邻重复）
        while (left < right && nums[right] === nums[right - 1]) right--;
        // 移动指针继续寻找下一组可能的解
        left++;
        right--;
      } else if (sum < 0) {
        // 和偏小，左指针右移增大值
        left++;
      } else {
        // 和偏大，右指针左移减小值
        right--;
      }
    }
  }
  return res;
}
```

### 5. 11. 盛最多水的容器

**LeetCode链接**：[https://leetcode.cn/problems/container-with-most-water/](https://leetcode.cn/problems/container-with-most-water/)

**题目描述**：给定一个长度为 `n` 的整数数组 `height`。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])`。找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。说明：你不能倾斜容器。

**示例**：

- 示例1：输入 `height = [1,8,6,2,5,4,8,3,7]`，输出 `49`（第2条和最后1条线，面积=7×7=49）；

- 示例2：输入 `height = [1,1]`，输出 `1`。

```js
function d(height) {
  const len = height.length;
  if (len <= 1) return 0;
  let left = 0;
  let right = len - 1;
  let maxArea = 0;

  while (left < right) {
    // 核心修正：宽度 = 右指针索引 - 左指针索引（水平距离）
    const width = right - left;
    const leftHeight = height[left];
    const rightHeight = height[right];
    // 盛水量由短板高度决定
    const shortHeight = Math.min(leftHeight, rightHeight);
    const currentArea = width * shortHeight;

    // 更新最大面积
    maxArea = Math.max(maxArea, currentArea);

    // 贪心策略：移动短板指针（移动长板无法增大盛水量）
    if (leftHeight < rightHeight) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}
```

### 6. 53. 最大子数组和

**LeetCode链接**：[https://leetcode.cn/problems/maximum-subarray/](https://leetcode.cn/problems/maximum-subarray/)

**题目描述**：给你一个整数数组 `nums`，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。子数组是数组中的一个连续部分。

**示例**：

- 示例1：输入 `nums = [-2,1,-3,4,-1,2,1,-5,4]`，输出 `6`（连续子数组[4,-1,2,1]和最大，为6）；

- 示例2：输入 `nums = [1]`，输出 `1`；

- 示例3：输入 `nums = [5,4,-1,7,8]`，输出 `23`。

```js
function d(nums) {
  const len = nums.length;
  if (len === 1) return nums[0];
  // 包含nums[i]的最大子数组和
  let dp = new Array(len).fill(-Infinity);
  dp[0] = nums[0];
  const maxSum = dp[0];
  for (let i = 1; i < len; i++) {
    const curVal = nums[i];
    dp[i] = dp[i - 1] < 0 ? curVal : dp[i - 1] + curVal;
    maxSum = Math.max(maxSum, dp[i]);
  }
  return maxSum;
}
```

优化

```js
function d(nums) {
  // 边界处理：空数组按题目要求返回0（或根据题意调整，题目保证至少1个元素）
  if (!nums.length) return 0;

  // prev：以当前元素的前一个元素结尾的最大子数组和
  let prev = nums[0];
  // max：全局最大子数组和
  let maxSum = prev;

  // 从第二个元素开始遍历
  for (let i = 1; i < nums.length; i++) {
    // 核心逻辑：前序和为负 → 重新开始（只取当前元素）；前序和为正 → 延续（前序和+当前元素）
    prev = Math.max(nums[i], prev + nums[i]);
    // 更新全局最大值
    maxSum = Math.max(maxSum, prev);
  }

  return maxSum;
}
```

### 8. 283. 移动零

**LeetCode链接**：[https://leetcode.cn/problems/move-zeroes/](https://leetcode.cn/problems/move-zeroes/)

**题目描述**：给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。要求：必须在原地操作，不要拷贝额外的数组；尽量减少操作次数。

**示例**：

- 示例1：输入 `nums = [0,1,0,3,12]`，输出 `[1,3,12,0,0]`；

- 示例2：输入 `nums = [0]`，输出 `[0]`。

```js
function d(nums) {
  const len = nums.length;
  if (len <= 1) return nums;
  let left = 0;
  for (let right = 0; right < len; right++) {
    const cur = nums[right];
    if (cur !== 0) {
      nums[left] = cur;
      left++;
    }
  }
  for (let i = left; i < len; i++) {
    nums[i] = 0;
  }
  return nums;
}
```

优化

```js
function d(nums) {
  let slow = 0;
  const len = nums.length;
  for (let fast = 0; fast < len; fast++) {
    // 遇到非零元素，与慢指针位置交换
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
  return nums;
}
```

### 9. 344. 反转字符串

**LeetCode链接**：[https://leetcode.cn/problems/reverse-string/](https://leetcode.cn/problems/reverse-string/)

**题目描述**：编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 `s` 的形式给出。要求：原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

**示例**：

- 示例1：输入 `s = ["h","e","l","l","o"]`，输出 `["o","l","l","e","h"]`；

- 示例2：输入 `s = ["H","a","n","n","a","h"]`，输出 `["h","a","n","n","a","H"]`。

```js
function d(s) {
  const len = s.length;
  // 边界条件：空数组/单元素数组无需反转，直接返回
  if (len <= 1) return s;

  let left = 0; // 左指针：从数组头部开始
  let right = len - 1; // 右指针：从数组尾部开始

  // 相向遍历，直到指针相遇（无需遍历完整个数组）
  while (left < right) {
    // 核心：直接交换左右指针位置的元素（无任何额外过滤）
    [s[left], s[right]] = [s[right], s[left]];
    // 指针向中间移动
    left++;
    right--;
  }
  return s;
}
```

### 10. 121. 买卖股票的最佳时机

**LeetCode链接**：[https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

**题目描述**：给定一个数组 `prices`，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润。返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0`。

**示例**：

- 示例1：输入 `prices = [7,1,5,3,6,4]`，输出 `5`（第2天买，第5天卖，利润6-1=5）；

- 示例2：输入 `prices = [7,6,4,3,1]`，输出 `0`（无盈利可能）。

### 总结

1. 该板块核心解题思路围绕**双指针**（快慢/左右）和**滑动窗口**展开，优先保证原地修改以符合前端性能优化要求；

2. 所有题目需重点关注**边界条件**（如空数组、全重复元素、全负数数组等），这是前端面试高频考察点；

3. 刷题时可直接点击LeetCode链接跳转题目页面，先理解示例的输入输出逻辑，再动手编写代码。
   > （注：文档部分内容可能由 AI 生成）

```

```
