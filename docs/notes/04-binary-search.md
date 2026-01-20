# 二分查找：在有序数组中查找元素

### 704. 二分查找

- 难度：简单

- 核心考点：二分查找基础模板（有序数组的折半查找逻辑、循环边界的处理、目标值的精准定位）

- 前端应用场景：下拉搜索框的关键词快速匹配（如在有序的搜索建议列表中定位用户输入的关键词）、分页功能中根据页码快速定位数据位置、有序城市列表按拼音首字母快速检索

- LeetCode链接：[https://leetcode.cn/problems/binary-search/](https://leetcode.cn/problems/binary-search/)

**题目描述**：

给定一个 `n` 个元素有序的（升序）整型数组 `nums` 和一个目标值 `target`，编写一个函数搜索 `nums` 中的 `target`。如果目标值存在于数组中，返回其对应的下标；如果目标值不存在，返回 `-1`。

```js
function search(nums, target) {
  const len = nums.length;
  if (len === 0) return -1;
  // 闭区间 [left, right]：左右边界均包含在查找范围内
  let left = 0;
  let right = len - 1;

  while (left <= right) {
    // 优化中间值计算：避免 left + right 数值过大导致的溢出（通用写法，JS 虽不易溢出，但面试更规范）
    const mid = left + Math.floor((right - left) / 2);
    const midVal = nums[mid];

    if (midVal === target) {
      return mid; // 找到目标，直接返回下标
    } else if (midVal > target) {
      right = mid - 1; // 目标在左区间，收缩右边界（排除 mid）
    } else {
      left = mid + 1; // 目标在右区间，收缩左边界（排除 mid）
    }
  }

  return -1; // 循环结束仍未找到，返回 -1
}
```

**补充说明**：

- 数组中所有元素互不重复；

- 数组长度 `n` 的范围是 `[1, 10000]`；

- 数组中每个元素的取值范围是 `[-9999, 9999]`。

**示例**：

示例 1：

输入：nums = [-1,0,3,5,9,12], target = 9

输出：4

解释：9 出现在 nums 数组中，对应的下标为 4。

示例 2：

输入：nums = [-1,0,3,5,9,12], target = 2

输出：-1

解释：2 不存在于 nums 数组中，因此返回 -1。

```js
function search(nums, target) {
  const len = nums.length;
  if (len === 0) return -1;
  // 闭区间 [left, right]：左右边界均包含在查找范围内
  let left = 0;
  let right = len - 1;

  while (left <= right) {
    // 优化中间值计算：避免 left + right 数值过大导致的溢出（通用写法，JS 虽不易溢出，但面试更规范）
    const mid = left + Math.floor((right - left) / 2);
    const midVal = nums[mid];

    if (midVal === target) {
      return mid; // 找到目标，直接返回下标
    } else if (midVal > target) {
      right = mid - 1; // 目标在左区间，收缩右边界（排除 mid）
    } else {
      left = mid + 1; // 目标在右区间，收缩左边界（排除 mid）
    }
  }

  return -1; // 循环结束仍未找到，返回 -1
}
```

---

### 35. 搜索插入位置

- 难度：简单

- 核心考点：二分查找的变形应用（目标值不存在时，确定其在有序数组中应插入的位置；循环终止条件和边界收缩的细节处理）

- 前端应用场景：表单自动补全功能中，将新输入内容插入到有序推荐列表的对应位置、任务列表按优先级排序后，新任务插入到指定优先级的位置、有序数组插入操作前的位置预判

- LeetCode链接：[https://leetcode.cn/problems/search-insert-position/](https://leetcode.cn/problems/search-insert-position/)

**题目描述**：

给定一个升序排列的整数数组 `nums` 和一个目标值 `target`，在数组中找到目标值并返回其索引；如果目标值不存在于数组中，返回它按顺序插入后对应的索引位置。

**补充说明**：

- 数组中无重复元素；

- 要求算法的时间复杂度必须为 `O(log n)` 级别。

**示例**：

示例 1：

输入：nums = [1,3,5,6], target = 5

输出：2

解释：5 存在于数组中，对应的下标为 2。

示例 2：

输入：nums = [1,3,5,6], target = 2

输出：1

解释：2 不存在于数组中，按升序应插入到 1 和 3 之间，对应的下标为 1。

示例 3：

输入：nums = [1,3,5,6], target = 7

输出：4

解释：7 大于数组中所有元素，应插入到数组末尾，对应的下标为 4。

示例 4：

输入：nums = [1,3,5,6], target = 0

输出：0

解释：0 小于数组中所有元素，应插入到数组开头，对应的下标为 0。

```js
function searchInsert(nums, target) {
  const len = nums.length;
  if (len === 0) return -1;
  // 闭区间 [left, right]：左右边界均包含在查找范围内
  let left = 0;
  let right = len - 1;

  while (left <= right) {
    // 优化中间值计算：避免 left + right 数值过大导致的溢出（通用写法，JS 虽不易溢出，但面试更规范）
    const mid = left + Math.floor((right - left) / 2);
    const midVal = nums[mid];

    if (midVal === target) {
      return mid; // 找到目标，直接返回下标
    } else if (midVal > target) {
      right = mid - 1; // 目标在左区间，收缩右边界（排除 mid）
    } else {
      left = mid + 1; // 目标在右区间，收缩左边界（排除 mid）
    }
  }
  return left;
}
```

---

### 34. 在排序数组中查找元素的第一个和最后一个位置

- 难度：中等

- 核心考点：二分查找的左右边界定位（分别查找目标值的左边界和右边界，处理数组中存在重复元素的情况，边界收缩的差异化逻辑）

- 前端应用场景：电商平台价格区间筛选（查找某价格在有序价格列表中出现的起止位置）、日志数据按时间排序后，查找某时间戳出现的首尾位置、有序列表中统计目标值的出现次数（右边界 - 左边界 + 1）

- LeetCode链接：[https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

**题目描述**：

给你一个按非递减顺序排列的整数数组 `nums` 和一个目标值 `target`，请找出目标值在数组中的开始位置和结束位置。如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

**补充说明**：

- 必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。

**示例**：

示例 1：

输入：nums = [5,7,7,8,8,10], target = 8

输出：[3,4]

解释：8 在数组中第一次出现的下标是 3，最后一次出现的下标是 4。

示例 2：

输入：nums = [5,7,7,8,8,10], target = 6

输出：[-1,-1]

解释：6 不存在于数组中，因此返回 [-1, -1]。

示例 3：

输入：nums = [], target = 0

输出：[-1,-1]

解释：空数组中无任何元素，目标值 0 不存在，返回 [-1, -1]。

```js
function searchRange(nums, target) {
  // 辅助函数：找左边界（第一个等于target的下标）
  const findLeft = (nums, target) => {
    let left = 0;
    let right = nums.length - 1;
    let leftIdx = -1; // 初始为-1，表示未找到
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        leftIdx = mid; // 记录当前位置，继续向左找更小的边界
        right = mid - 1;
      } else if (nums[mid] > target) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return leftIdx;
  };

  // 辅助函数：找右边界（最后一个等于target的下标）
  const findRight = (nums, target) => {
    let left = 0;
    let right = nums.length - 1;
    let rightIdx = -1; // 初始为-1，表示未找到
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        rightIdx = mid; // 记录当前位置，继续向右找更大的边界
        left = mid + 1;
      } else if (nums[mid] > target) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return rightIdx;
  };

  const left = findLeft(nums, target);
  const right = findRight(nums, target);
  return [left, right];
}
```

优化

```js
/**
 * 查找目标值在非递减数组中的首尾位置
 * @param {number[]} nums - 非递减排列的整数数组
 * @param {number} target - 要查找的目标值
 * @returns {number[]} - 目标值的首尾位置，不存在则返回 [-1, -1]
 * 核心思路：两次二分查找（分别找左边界、右边界），保证时间复杂度 O(log n)
 */
function searchRange(nums, target) {
  // ========== 辅助函数：查找目标值的边界（左/右） ==========
  /**
   * @param {boolean} isLeft - true：找左边界（第一个等于target的下标）；false：找右边界（最后一个等于target的下标）
   * @returns {number} - 找到的边界下标，未找到返回 -1
   */
  const findBound = isLeft => {
    let left = 0;
    let right = nums.length - 1;
    let boundIdx = -1; // 初始化边界下标为-1（表示未找到）

    // 闭区间 [left, right] 二分查找（易错点1：必须用 <=，而非 <）
    while (left <= right) {
      // 计算中间下标：用 left + Math.floor((right-left)/2) 而非 (left+right)/2
      // 易错点2：避免 left+right 数值过大导致溢出（JS中Number范围大，但这是跨语言通用写法）
      const mid = left + Math.floor((right - left) / 2);
      const midVal = nums[mid];

      if (midVal === target) {
        // 找到目标值时，不直接返回，而是继续收缩边界（核心逻辑）
        boundIdx = mid; // 先记录当前下标，作为候选边界
        if (isLeft) {
          // 找左边界：继续向左收缩（易错点3：必须 right=mid-1，而非 right=mid，否则死循环）
          right = mid - 1;
        } else {
          // 找右边界：继续向右收缩（易错点4：必须 left=mid+1，而非 left=mid，否则死循环）
          left = mid + 1;
        }
      } else if (midVal > target) {
        // 目标值在左区间，收缩右边界
        right = mid - 1;
      } else {
        // 目标值在右区间，收缩左边界
        left = mid + 1;
      }
    }

    return boundIdx;
  };

  // ========== 主逻辑 ==========
  const leftBound = findBound(true); // 找左边界
  const rightBound = findBound(false); // 找右边界

  // 易错点5：空数组/目标值不存在时，直接返回 [-1,-1]（无需额外判断，辅助函数已返回-1）
  return [leftBound, rightBound];
}
```

---

### 912. 排序数组

- 难度：中等

- 核心考点：经典排序算法的实现（快速排序、归并排序的核心逻辑，递归与分治思想，排序算法的时间/空间复杂度优化）

- 前端应用场景：前端表格数据按列排序（如按价格、销量升序/降序）、电商商品列表的排序展示、用户列表按注册时间/活跃度排序

- LeetCode链接：[https://leetcode.cn/problems/sort-an-array/](https://leetcode.cn/problems/sort-an-array/)

**题目描述**：

给你一个整数数组 `nums`，请你手动实现排序逻辑（禁止使用语言内置的排序函数），将该数组按升序排列并返回。

**补充说明**：

- 常用的最优排序算法有快速排序（实践中性能最优）、归并排序（稳定排序）、堆排序（空间复杂度优），需掌握至少一种的核心实现。

**示例**：

示例 1：

输入：nums = [5,2,3,1]

输出：[1,2,3,5]

解释：数组按升序排列后结果为 [1,2,3,5]。

示例 2：

输入：nums = [5,1,1,2,0,0]

输出：[0,0,1,1,2,5]

解释：数组按升序排列后结果为 [0,0,1,1,2,5]。

---

### 215. 数组中的第K个最大元素

- 难度：中等

- 核心考点：快速选择算法（基于快速排序的分区思想，无需完全排序即可找到第K大元素）、堆排序（构建小顶堆/大顶堆筛选TopK元素）

- 前端应用场景：电商平台“销量TopK商品”展示、用户贡献值排名中查找第K名的用户、日志分析中筛选访问量前K的页面

- LeetCode链接：[https://leetcode.cn/problems/kth-largest-element-in-an-array/](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

**题目描述**：

给定整数数组 `nums` 和整数 `k`，请在数组中找出并返回第 `k` 个最大的元素。

**补充说明**：

- 第 `k` 个最大元素指的是数组按降序排列后，第 `k` 个位置的元素（并非第 `k` 个不同的元素）；

- 要求设计时间复杂度最优的算法：快速选择（O(n)）或堆排序（O(n log k)）。

**示例**：

示例 1：

输入：nums = [3,2,1,5,6,4], k = 2

输出：5

解释：数组按降序排列为 [6,5,4,3,2,1]，第 2 个最大的元素是 5。

示例 2：

输入：nums = [3,2,3,1,2,4,5,5,6], k = 4

输出：4

解释：数组按降序排列为 [6,5,5,4,3,3,2,2,1]，第 4 个最大的元素是 4。

---

### 75. 颜色分类

- 难度：中等

- 核心考点：双指针（三指针）算法、快速排序的分区思想（将数组分为三个区域：0区、1区、2区，一次遍历完成分类）

- 前端应用场景：任务列表按状态分类（待处理、处理中、已完成）、图片像素按颜色值分类、表单数据按验证状态分类（通过、待审核、驳回）

- LeetCode链接：[https://leetcode.cn/problems/sort-colors/](https://leetcode.cn/problems/sort-colors/)

**题目描述**：

给定一个包含红色、白色、蓝色共 `n` 个元素的数组 `nums`，原地对其进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色的顺序排列。其中，整数 0 表示红色，1 表示白色，2 表示蓝色。

**补充说明**：

- 禁止使用语言内置的排序函数；

- 要求仅使用常数级额外空间（O(1)），且仅遍历数组一次（O(n)）。

**示例**：

示例 1：

输入：nums = [2,0,2,1,1,0]

输出：[0,0,1,1,2,2]

解释：将数组中的 0（红）、1（白）、2（蓝）按顺序排列，结果为 [0,0,1,1,2,2]。

示例 2：

输入：nums = [2,0,1]

输出：[0,1,2]

解释：数组按红、白、蓝顺序排列后为 [0,1,2]。

示例 3：

输入：nums = [0]

输出：[0]

解释：仅含一个红色元素，排序后仍为 [0]。

示例 4：

输入：nums = [1]

输出：[1]

解释：仅含一个白色元素，排序后仍为 [1]。

> （注：文档部分内容可能由 AI 生成）
