# 数组双指针部分指南：快慢·左右·倒序与避坑清单

双指针是数组/链表题里的「解题神器」：通过指针分工实现**一次遍历、原地修改**。本文数组覆盖 **3 类核心模板**（快慢指针、左右指针、倒序双指针）和 **2 类进阶**（中心扩展、三指针分区），并标清指针语义、循环条件与等于号取舍，方便直接套题。

![double\_pointer.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4d3f3bb3e0db4f309006d53f4004946c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTA1NjUzMzA5OTQxNDk1In0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1771496674&x-orig-sign=%2BnL2hv6%2F2TtsJ768wT75e7rCvRA%3D)

<!--

```plainText
## **一、快慢指针** ### 核心思想 - slow：维护有效区域边界 - fast：遍历寻找有效元素 ### 通用模板 - 明确slow定位：最后一个元素 / 下一个填充位 - while(fast < len) - 有效则赋值更新slow - fast始终前进 ### 实战题目 - LeetCode 26 去重（保留1个） - fast≠slow 则保留 - return slow+1 - LeetCode 27 移除元素 - ≠val 则保留 - return slow - LeetCode 80 去重（保留2个） - fast≠slow-1 则保留 - slow初始=1，fast从2开始 ## **二、左右指针** ### 循环条件规则 - left < right：两数之和、反转 - left <= right：回文判断、二分 - 中心扩展：l>=0 && r<len ### 对撞型模板 - 左右两端向中间逼近 - 和大动右，和小动左 ### 实战题目 - LeetCode 167 两数之和 II - LeetCode 125 验证回文串 - 跳过非字母数字 - 统一小写对比 ### 拓展：中心扩展法 - LeetCode 5 最长回文子串 - 单中心、双中心各扩一次 - 取最长结果返回 ## **三、倒序双指针** ### 适用场景 - 合并有序数组 - 有序数组平方 ### 核心思路 - 从后往前填充，避免覆盖 - 大值优先放入尾部 ### 实战题目 - LeetCode 88 合并两个有序数组 - LeetCode 977 有序数组的平方 - 比较两端绝对值 - 平方后倒序存放 ## **四、拓展：三指针分区** ### 指针定义 - p0：0区下一个填充位 - p2：2区上一个填充位 - p：遍历指针 ### 核心逻辑 - 0：交换p0，p0++ - 2：交换p2，p2--，p不移动 - 1：直接p++ - 循环：while(p <= p2) - LeetCode 75 颜色分类 ## **五、通用步骤** 1. 确定题型 2. 明确每个指针含义 3. 套用对应模板 4. 检查边界与等于号 ## **六、易错点** - slow定位混淆导致长度错误 - 左右指针循环条件写错 - 倒序双指针正序填充覆盖 - 三指针交换2后p误移动
```
-->

***

## 一、快慢指针模板（核心：原地修改/去重）

### 模板核心定义（必须记死）

| 指针   | 定位（二选一，标注清楚！）      | 示例场景                |
| ---- | ------------------ | ------------------- |
| slow | 已保留区域的**最后一个元素索引** | 有序数组去重（LeetCode 26） |
| slow | 新区域的**下一个要填充的位置**  | 移除指定元素（LeetCode 27） |
| fast | 遍历指针，探索所有元素（固定）    | 所有快慢指针场景            |

### 通用模板（适配 90% 快慢指针题）

```JavaScript
/**
 * 快慢指针通用模板
 * @param {Array} arr - 待处理数组
 * @param {Function} isValid - 判定fast指向元素是否有效（需保留）
 * @return {number} - 新数组长度
 */
function slowFastPointerTemplate(arr, isValid) {
    const len = arr.length;
    if (len <= 1) return len; // 边界：空/单元素直接返回

    // === 关键：明确slow的初始定位 ===
    let slow = 0; // 示例：已保留区域最后一个元素（初始在第一个元素）
    // let slow = 0; // 示例：新区域下一个要填充的位置（初始在第一个位置）
    let fast = 0;

    while (fast < len) {
        // 核心：fast找到有效元素
        if (isValid(arr[fast], arr[slow], slow)) {
            // === 关键：根据slow定位调整 ===
            slow++; // 若slow是「已保留最后一个」→ 先移动再赋值
            // 若slow是「下一个填充位」→ 直接赋值（无需先移动）
            arr[slow] = arr[fast];
        }
        fast++; // 无论是否有效，fast始终遍历
    }

    // === 长度计算规则 ===
    // 1. slow是「已保留最后一个索引」→ 返回 slow + 1
    // 2. slow是「下一个填充位」→ 返回 slow
    return slow + 1;
}
```

### 模板实战1：有序数组去重（保留1个，[LeetCode 26](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)）

**题目描述**：给你一个非严格递增排列的数组 nums ，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。元素的相对顺序应该保持一致。要求：更改数组 nums ，使 nums 的前 k 个元素包含唯一元素，并按照它们最初在 nums 中出现的顺序排列；nums 的其余元素与 nums 的大小不重要，最终返回 k 。

**解题思路**：

*   核心适配：沿用快慢指针模板，明确指针定位——slow 为「已保留区域的最后一个元素索引」，fast 为遍历指针，负责探索所有元素。

*   有效判断：当 fast 指向元素与 slow 指向元素不同时，说明该元素是新的有效元素（未重复）。

*   指针操作：找到有效元素后，先将 slow 移动到下一个填充位，再将 fast 元素赋值给 slow。

*   长度返回：因 slow 是最后一个有效元素的索引，最终返回 slow + 1 即为新数组长度。

```JavaScript
var removeDuplicates = function(nums) {
    const len = nums.length;
    if (len <= 1) return len;

    // slow：已保留区域的最后一个元素索引（初始在0）
    let slow = 0;
    let fast = 0;

    while (fast < len) {
        // 有效条件：fast元素 ≠ slow元素（新元素）
        if (nums[fast] !== nums[slow]) {
            slow++; // 先移动到下一个填充位
            nums[slow] = nums[fast];
        }
        fast++;
    }

    return slow + 1; // slow是最后一个有效索引 → +1
};
```

### 模板实战2：移除指定元素（[LeetCode 27](https://leetcode.cn/problems/remove-element/)）

**题目描述**：给你一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，元素的顺序可能发生改变，然后返回 nums 中与 val 不同的元素的数量。要求：不能使用额外的数组空间，必须原地修改输入数组并使用 O(1) 额外空间完成。

**解题思路**：

*   指针定位：调整 slow 定位为「新区域的下一个要填充的位置」，fast 仍为遍历指针，筛选不等于 val 的有效元素。

*   有效判断：当 fast 指向元素不等于 val 时，该元素需保留，直接填充到 slow 指向的位置。

*   指针操作：填充完成后，将 slow 移动到下一个填充位，fast 继续遍历下一个元素。

*   长度返回：slow 本身指向新区域的下一个填充位，其值即为有效元素的数量，直接返回 slow 即可。

```JavaScript
var removeElement = function(nums, val) {
    const len = nums.length;
    if (len === 0) return 0;

    // slow：新区域的「下一个要填充的位置」（初始在0）
    let slow = 0;
    let fast = 0;

    while (fast < len) {
        // 有效条件：fast元素 ≠ 目标值
        if (nums[fast] !== val) {
            nums[slow] = nums[fast]; // 直接赋值（slow是填充位）
            slow++; // 填充后移动到下一个位置
        }
        fast++;
    }

    return slow; // slow是下一个填充位 → 直接返回
};
```

### 模板实战3：有序数组去重（保留2个，[LeetCode 80](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)）

**题目描述**：给你一个有序数组 nums ，请你原地删除重复出现的元素，使得出现次数超过两次的元素只出现两次，返回删除后数组的新长度。要求：不要使用额外的数组空间，必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

**解题思路**：

*   模板优化：基于快慢指针模板，slow 仍为「已保留区域的最后一个元素索引」，结合有序数组重复元素连续的特性调整逻辑。

*   初始定位：因最多保留2个重复元素，前两个元素默认有效，slow 初始设为1，fast 从第三个元素（索引2）开始探索。

*   有效判断：当 fast 元素与 slow-1 元素不同时，说明该元素最多出现两次，可保留（避免出现3个及以上重复）。

*   指针与返回：符合条件则移动 slow 并赋值，最终 slow 为最后一个有效元素索引，返回 slow + 1 即为新长度。

```JavaScript
var removeDuplicates = function(nums) {
    const len = nums.length;
    if (len <= 2) return len;

    // slow：已保留区域的最后一个元素索引（初始在1，前两个元素默认保留）
    let slow = 1;
    let fast = 2;

    while (fast < len) {
        // 有效条件：fast元素 ≠ slow-1元素（保证最多保留2个）
        if (nums[fast] !== nums[slow - 1]) {
            slow++;
            nums[slow] = nums[fast];
        }
        fast++;
    }

    return slow + 1;
};
```

***

## 二、左右指针模板（核心：对撞/扩散）

### 模板核心规则（循环条件等于号取舍）

| 场景              | while条件                   | 等于号取舍原因            |
| --------------- | ------------------------- | ------------------ |
| 两数之和/反转数组       | left < right              | 指针相遇时无需处理（单个元素无意义） |
| 二分查找/回文串判断（全字符） | left <= right             | 需处理单个元素（如奇数长度回文中心） |
| 中心扩展（回文子串）      | left \>= 0 && right < len | 越界即停止，无等于号         |

### 通用模板1：对撞型左右指针（两数之和/反转）

```JavaScript
/**
 * 对撞型左右指针模板
 * @param {Array} arr - 有序数组
 * @param {Function} condition - 指针移动条件
 * @return {any} - 解题结果
 */
function leftRightCollideTemplate(arr, condition) {
    let left = 0;
    let right = arr.length - 1;
    let res = null;

    // === 关键：根据场景选条件 ===
    while (left < right) { // 无等于号：两数之和/反转
    // while (left <= right) { // 有等于号：二分查找/全字符回文判断
        const cur = condition(arr[left], arr[right], left, right);
        if (cur === 'moveLeft') {
            left++;
        } else if (cur === 'moveRight') {
            right--;
        } else if (cur === 'found') {
            res = [left, right];
            break;
        }
    }
    return res;
}
```

### 模板实战1：两数之和 II（[LeetCode 167](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)）

**题目描述**：给你一个下标从 1 开始的整数数组 numbers ，该数组已按非递减顺序排列，请你从数组中找出满足相加之和等于目标数 target 的两个数。如果设这两个数分别是 numbers\[index1] 和 numbers\[index2] ，则 1 <= index1 < index2 <= numbers.length 。要求：每个输入只对应唯一的答案，不可以重复使用相同的元素，解决方案必须只使用常量级的额外空间。

**解题思路**：

*   模板适配：套用对撞型左右指针模板，利用数组非递减有序的特性，实现高效查找。

*   指针定位：left 从数组头部（索引0）开始，right 从数组尾部（索引length-1）开始，相向对撞遍历。

*   循环条件：用 left < right，因两数需不同元素，指针相遇时无需处理（单个元素无法组成两个数）。

*   指针操作：计算两指针元素之和，和等于 target 则返回下标+1（题目要求下标从1开始）；和大于 target 则右指针左移（减小和）；和小于 target 则左指针右移（增大和）。

```JavaScript
var twoSum = function(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;

    // 无等于号：两数不能是同一个元素
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            return [left + 1, right + 1]; // 题目下标从1开始
        } else if (sum > target) {
            right--; // 和太大，右指针左移
        } else {
            left++; // 和太小，左指针右移
        }
    }
    return [-1, -1];
};
```

### 模板实战2：验证回文串（[LeetCode 125](https://leetcode.cn/problems/valid-palindrome/)）

**题目描述**：如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样，则可以认为该短语是一个回文串。字母和数字都属于字母数字字符。给你一个字符串 s ，请你判断它是否是一个回文串。

**解题思路**：

*   模板适配：使用对撞型左右指针，核心是对比字符串首尾对称位置的字符（处理非字母数字、大小写后）。

*   指针定位：left 从字符串头部开始，right 从字符串尾部开始，相向遍历。

*   前置处理：遍历中跳过非字母数字字符（避免干扰回文判断），再将对比的字符统一转为小写。

*   判断逻辑：若出现大小写转换后不相等的字符，直接返回 false；遍历结束（left >= right）则返回 true，循环条件用 left < right（指针相遇即完成所有对比）。

```JavaScript
var isPalindrome = function(s) {
    let left = 0;
    let right = s.length - 1;

    // 无等于号：指针相遇即完成判断
    while (left < right) {
        // 跳过非字母数字
        while (!/[a-zA-Z0-9]/.test(s[left]) && left < right) left++;
        while (!/[a-zA-Z0-9]/.test(s[right]) && left < right) right--;

        // 字符不相等则不是回文
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        left++;
        right--;
    }
    return true;
};
```

### 拓展：中心扩展法（左右指针变形，适用于最长回文子串）

作为左右指针的拓展用法，中心扩展法专门解决回文子串类问题，无需单独定义通用模板，核心是利用回文串的中心对称性，用左右指针实现扩散遍历，对应题目为[LeetCode 5](https://leetcode.cn/problems/longest-palindromic-substring/)。

**[LeetCode 5 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)**：给你一个字符串 s，找到 s 中最长的回文子串。回文子串是指正着读和反着读都一样的子串，例如 "babad" 的最长回文子串是 "bab" 或 "aba"，"cbbd" 的最长回文子串是 "bb"。

**解题思路**：

*   核心逻辑：利用回文串的中心对称性，用左右指针从中心向两侧扩散，探索每个中心对应的最长回文子串。

*   中心分类：回文串分两种情况——奇数长度（单中心，如"aba"，中心为中间字符）、偶数长度（双中心，如"bb"，中心为两个相邻字符）。

*   遍历与扩散：遍历字符串每个位置，分别以当前位置为单中心、当前与下一个位置为双中心，调用中心扩展方法。

*   结果保留：每次扩散后记录当前回文子串，全程保留长度最长的回文子串，遍历结束后返回该子串。

```JavaScript
// 中心扩展工具函数：传入中心左右指针，返回以该中心的最长回文子串
function expandCenter(s, l, r) {
    // 扩散条件：左指针不越界 + 右指针不越界 + 左右指针指向字符相等（满足则继续扩散）
    while (l >= 0 && r < s.length && s[l] === s[r]) {
        l--; // 左指针左扩（向左侧延伸，探索更长回文）
        r++; // 右指针右扩（向右侧延伸，探索更长回文）
    }
    // 退出循环时，l/r已无效（要么越界，要么字符不等），有效回文区间为 [l+1, r-1]
    // slice方法左闭右开，所以end参数写r（自动取到r-1）
    return s.slice(l + 1, r);
}

// 主函数：遍历所有可能的中心，找到整个字符串的最长回文子串
var longestPalindrome = function(s) {
    let res = ''; // 存储最终找到的最长回文子串，初始为空
    // 遍历字符串每个位置，每个位置都可能是回文中心（单中心/双中心）
    for (let i = 0; i < s.length; i++) {
        // 情况1：奇数长度回文（单中心），中心为当前i位置（左右指针初始都指向i）
        const s1 = expandCenter(s, i, i);
        // 情况2：偶数长度回文（双中心），中心为当前i和i+1位置（左右指针分别指向i和i+1）
        const s2 = expandCenter(s, i, i + 1);
        // 保留更长的回文子串：先对比res和s1，取更长的；再对比结果和s2，取更长的
        res = res.length > s1.length ? res : s1;
        res = res.length > s2.length ? res : s2;
    }
    // 遍历结束，返回最长回文子串
    return res;
};
```

***

## 三、倒序双指针模板（核心：避免覆盖）

### 模板核心场景

合并两个有序数组、有序数组的平方等，**正序遍历会覆盖有效元素**，需从后往前填充，对应两道高频LeetCode题目，下文将逐一附上链接并实战演练。

### 通用模板

```JavaScript
/**
 * 倒序双指针模板（避免覆盖）
 * @param {Array} arr1 - 目标数组（有剩余空间）
 * @param {number} len1 - arr1有效元素长度
 * @param {Array} arr2 - 待合并数组
 * @param {number} len2 - arr2有效元素长度
 * @return {void} - 原地修改arr1
 */
function reverseTwoPointerTemplate(arr1, len1, arr2, len2) {
    // 指针定义：均指向「有效元素的最后一个位置」
    let p1 = len1 - 1; // arr1有效尾指针
    let p2 = len2 - 1; // arr2有效尾指针
    let p = len1 + len2 - 1; // 目标数组填充尾指针

    // 循环条件：两个数组都有未处理元素
    while (p1 >= 0 && p2 >= 0) {
        // 取更大的值填充到p位置（合并有序数组）
        // 取绝对值更大的值填充（有序数组平方）
        if (arr1[p1] > arr2[p2]) {
            arr1[p] = arr1[p1];
            p1--;
        } else {
            arr1[p] = arr2[p2];
            p2--;
        }
        p--; // 填充位左移
    }

    // 处理剩余元素（仅需处理arr2，arr1剩余元素已在原位）
    while (p2 >= 0) {
        arr1[p] = arr2[p2];
        p--;
        p2--;
    }
}
```

### 模板实战1：合并两个有序数组（[LeetCode 88](https://leetcode.cn/problems/merge-sorted-array/)）

**题目描述**：给你两个按非递减顺序排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。请你合并 nums2 到 nums1 中，使合并后的数组同样按非递减顺序排列。要求：最终合并后数组不应由函数返回，而是存储在数组 nums1 中；nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0，应忽略；nums2 的长度为 n。

**解题思路**：

*   核心目的：避免正序合并时，nums1 的有效元素被覆盖，因此采用倒序双指针，从后往前填充。

*   指针定义：p1 指向 nums1 有效元素的最后一个位置（m-1），p2 指向 nums2 有效元素的最后一个位置（n-1），p 指向 nums1 最终填充的尾指针（m+n-1）。

*   倒序填充：循环对比 p1 和 p2 指向的元素，将较大的元素填充到 p 位置，填充后对应指针和 p 均左移。

*   剩余处理：当 nums1 遍历完（p1 < 0），若 nums2 还有剩余元素，直接将剩余元素依次填充到 nums1 剩余位置。

```JavaScript
var merge = function(nums1, m, nums2, n) {
    let p1 = m - 1;
    let p2 = n - 1;
    let p = m + n - 1;

    // 倒序合并，避免覆盖nums1有效元素
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[p] = nums1[p1];
            p1--;
        } else {
            nums1[p] = nums2[p2];
            p2--;
        }
        p--;
    }

    // 处理nums2剩余元素
    while (p2 >= 0) {
        nums1[p] = nums2[p2];
        p--;
        p2--;
    }
};
```

### 模板实战2：有序数组的平方（[LeetCode 977](https://leetcode.cn/problems/squares-of-a-sorted-array/)）

**题目描述**：给你一个按非递减顺序排序的整数数组 nums，返回每个数字的平方组成的新数组，要求也按非递减顺序排序。例如，nums = \[-4,-1,0,3,10]，返回 \[0,1,9,16,100]；nums = \[-7,-3,2,3,11]，返回 \[4,9,9,49,121]。

**解题思路**：

*   模板变形：基于倒序双指针，利用原数组非递减特性——数组两端元素的平方可能是最大值（负数平方后可能大于正数）。

*   指针定义：left 指向数组头部（负数区），right 指向数组尾部（正数区），p 指向结果数组的尾指针（倒序填充）。

*   循环条件：用 left <= right，需处理最后一个剩余元素（避免漏处理）。

*   填充逻辑：对比 left 和 right 元素的绝对值，绝对值大的元素平方后填充到 p 位置，对应指针和 p 均左移，最终返回结果数组。

```JavaScript
var sortedSquares = function(nums) {
    const len = nums.length;
    const res = new Array(len);
    let left = 0; // 左指针（负数区）
    let right = len - 1; // 右指针（正数区）
    let p = len - 1; // 结果填充尾指针

    // 倒序填充：取绝对值更大的平方值
    while (left <= right) { // 有等于号：处理最后一个元素
        const lAbs = Math.abs(nums[left]);
        const rAbs = Math.abs(nums[right]);
        if (lAbs > rAbs) {
            res[p] = lAbs * lAbs;
            left++;
        } else {
            res[p] = rAbs * rAbs;
            right--;
        }
        p--;
    }
    return res;
};
```

***

### 拓展：三指针分区（荷兰国旗问题，[LeetCode 75](https://leetcode.cn/problems/sort-colors/)）

作为对撞/分区型双指针的进阶拓展，三指针本质还是「边界维护 + 一次遍历分区」的核心思想，不单独作为通用模板，理解指针边界定义和处理逻辑即可直接解题，对应题目为[LeetCode 75](https://leetcode.cn/problems/sort-colors/)（荷兰国旗问题）。

#### 指针核心定义

*   p0：0区的「下一个填充位」（0区左侧全是0，右侧为未处理区域）

*   p2：2区的「上一个填充位」（2区右侧全是2，左侧为未处理区域）

*   p：遍历指针，负责检查当前元素的归属（0/1/2区），遍历未处理区域

**[LeetCode 75 颜色分类](https://leetcode.cn/problems/sort-colors/)**：给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。要求：必须在不使用库内置的 sort 函数的情况下解决这个问题，且使用 O(1) 额外空间完成。

**解题思路**：

*   核心逻辑：通过三个指针分工维护0区、2区边界，一次遍历完成数组分区，无需额外空间，高效排序。

*   循环条件：p <= p2，因为p2右侧的元素已全部是2（已处理完毕），无需再遍历。

*   元素处理规则：遇到0则与p0交换（归位0区），p0右移；遇到2则与p2交换（归位2区），p2左移（p不移动，需重新检查交换后的值）；遇到1则直接遍历下一个元素（归位中间1区）。

```JavaScript
var sortColors = function(nums) {
  const len = nums.length;
  if(len <= 1) return;

  // 指针定义（通俗版）：
  // p0：「0区管家」，指向「下一个要放入0的位置」（p0左边全是已排好的0）
  // p2：「2区管家」，指向「下一个要放入2的位置」（p2右边全是已排好的2）
  // p：「检查员」，遍历数组，逐个检查当前元素该归到哪个区
  let p0 = 0;
  let p2 = len - 1;
  let p = 0;

  // 【易错点2：循环条件】p <= p2 而非 p < len
  // 原因：p2右边已经是排好的2，无需遍历；若写p < len会重复处理已排好的2
  // 错误示例：while(p < len) → 遍历到p2右侧的2，可能导致交换错误
  while(p <= p2) {
    // 情况1：检查员发现当前元素是0 → 归到0区
    if(nums[p] === 0) {
      // 交换「检查员位置」和「0区下一个空位」的元素，把0归位
      [nums[p0], nums[p]] = [nums[p], nums[p0]];
      p0++; // 0区管家右移，准备接收下一个0

      // 【易错点3：p的重置】p = Math.max(p, p0) 避免p回退到已处理的0区
      // 原因：p0左边全是0，p若小于p0，会重复检查已排好的0，导致逻辑混乱
      // 错误示例：漏掉这行 → p可能回退到p0左侧，重复交换0，最终数组出错
      p = Math.max(p, p0);
    }
    // 情况2：检查员发现当前元素是2 → 归到2区
    else if(nums[p] === 2) {
      // 交换「检查员位置」和「2区下一个空位」的元素，把2归位
      [nums[p2], nums[p]] = [nums[p], nums[p2]];
      p2--; // 2区管家左移，准备接收下一个2

      // 【易错点4：交换2后p不移动】
      // 原因：交换过来的元素可能是0/1，需要重新检查当前位置的新元素
      // 错误示例：交换2后写p++ → 跳过新交换来的0/1，导致漏处理（比如[2,0,1]会排序失败）
    }
    // 情况3：检查员发现当前元素是1 → 1本就该在中间，无需处理，直接检查下一个
    else if(nums[p] === 1) {
      p++;
    }
  }
};
```

***

## 四、避坑清单（模板核心细节）

| 模板/拓展类型   | 关键细节                                     | 易错点                     |
| --------- | ---------------------------------------- | ----------------------- |
| 快慢指针      | 1. slow定位（最后一个/下一个）<br>2. 长度计算（+1/直接返回）  | 混淆slow定位导致长度错误          |
| 左右指针      | 1. while条件是否加等于号<br>2. 中心扩展越界判断          | 漏写越界条件、错用等于号            |
| 倒序双指针     | 1. 从后往前填充<br>2. 处理剩余元素（仅处理次要数组）          | 正序填充覆盖有效元素              |
| 三指针分区（拓展） | 1. p ≤ p2（而非 p < len）<br>2. 交换 2 后 p 不移动 | 循环条件写错、交换 2 后 p++ 导致漏处理 |

***

## 五、模板使用步骤

1.  **定题型**：快慢（去重/移除）、左右（对撞/回文）、倒序（合并/平方）、三指针（分区）。
2.  **定指针**：写清每个指针的语义（如 slow = 已保留最后一项 / 下一个填充位；p0/p2 = 0 区/2 区下一个填充位）。
3.  **套模板**：按对应小节写循环条件与移动逻辑，拓展题按「边界 + 一次遍历」微调。
4.  **查细节**：等于号（< 还是 ≤）、新长度（slow+1 还是 slow）、剩余元素是否只处理一方。

<!-- 
# 双指针

## 快慢指针

数组问题中比较常见的快慢指针技巧，是让你原地修改数组。
left指向的是需要项的最后一个元素 还是下一个要填充的  一定确定清楚
right探索 负责遍历


1. leetCode 26题 给你一个 非严格递增排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 。然后返回 nums 中唯一元素的个数。

考虑 nums 的唯一元素的数量为 k ，你需要做以下事情确保你的题解可以被通过：

更改数组 nums ，使 nums 的前 k 个元素包含唯一元素，并按照它们最初在 nums 中出现的顺序排列。nums 的其余元素与 nums 的大小不重要。
返回 k 。



```js
var removeDuplicates = function(nums) {
  const len = nums.length
  if(len<=1) return len // 边界：空数组/只有1个元素，直接返回长度，无需去重
  // left：标记「去重后保留的最后一个元素的索引」，初始在第一个元素位置
  let left = 0
  // right：遍历指针，探索数组中后续的元素，初始和left同位置
  let right = 0

  // 遍历整个数组
  for(;right<len;right++){
    // 核心判断：right找到和left不同的元素（说明是新的有效元素）
    if(nums[right] !== nums[left]){
      left++ // left移动到「下一个要填充的位置」
      nums[left] = nums[right] // 把新元素填充到left位置，覆盖重复值
    }
  }
  // left是最后一个有效元素的索引，长度=索引+1
  return left+1
};
```

2. 力扣第 83 题「删除排序链表中的重复元素」，如果给你一个有序的单链表，如何去重呢？

给定一个已排序的链表的头 head ， 删除所有重复的元素，使每个元素只出现一次 。返回 已排序的链表 。

其实和数组的基本一致 只是移动指针

```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if(head === null || head.next ===null) return head
  let slow = head
  let fast = head
  while(fast){
    // 只管存储不重复的值
    if(fast.val!==slow.val){
      slow.next = fast
      slow = slow.next
    }
    // 重复的值 不需要做什么
    fast = fast.next
  }
  // 最后一个节点的next置空
  slow.next = null
  return head
}
    
```

除了让你在有序数组/链表中去重，题目还可能让你对数组中的某些元素进行「原地删除」。

比如力扣第 27 题「移除元素」，看下题目：
给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素。元素的顺序可能发生改变。然后返回 nums 中与 val 不同的元素的数量。

其实思路也是一样的只不过left这次指向的是下一个不等于val的值

```js
var removeElement = function(nums, val) {
  const len  = nums.length
  if(len === 0) return nums
  let slow = 0
  let fast = 0
  while(fast<len){
    // 只需要管slow 只有不等于val的时候 slow存放值 然后移动指针
    if(nums[fast] !== val){
      nums[slow] = nums[fast]
      slow++
    }
    // fast始终移动
    fast++
  }
  // slow指向的是下一个 所以不用+1
  return slow
    
};
```

接下来看看力扣第 283 题「移动零」：

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

请注意 ，必须在不复制数组的情况下原地对数组进行操作

其实就是收集不是0的，然后将后面的全部置为0

```js
var moveZeroes = function(nums) {
    const len = nums.length
    if(len === 0) return nums
    // slow指向不为0的下一个位置
    let slow = 0
    let fast = 0
    while(fast<len){
      if(nums[fast] !== 0){
        nums[slow] = nums[fast]
        slow++
      }
      fast++
    }
    for(let i=slow;i<len;i++){
      nums[i] = 0
    }
    return nums

};
```

## 滑动窗口

待刷
https://labuladong.online/zh/algo/essential-technique/sliding-window-framework/

## 左右指针

二分查找

待刷
https://labuladong.online/zh/algo/essential-technique/binary-search-framework/

看下力扣第 167 题「两数之和 II」：

给你一个下标从 1 开始的整数数组 numbers ，该数组已按 非递减顺序排列  ，请你从数组中找出满足相加之和等于目标数 target 的两个数。如果设这两个数分别是 numbers[index1] 和 numbers[index2] ，则 1 <= index1 < index2 <= numbers.length 。

以长度为 2 的整数数组 [index1, index2] 的形式返回这两个整数的下标 index1 和 index2。

你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。

你所设计的解决方案必须只使用常量级的额外空间。

```js

var twoSum = function(numbers, target) {
  const len = numbers.length
  if(len === 0) return [-1,-1]
  let left = 0
  let right = len-1
  // 两数之和，所以left和right指向同一个元素的情况 不包含在内
  while(left<right){
    const curSum = numbers[left] + numbers[right]
    if(curSum === target){
      // 下标从 1 开始 !!!!!!
      return [left+1,right+1]
    }
    if(curSum > target){
      right--
    }
    if(curSum < target){
      left++
    }

  }
  return [-1,-1]
};
```

反转数组

344题 
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。

不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

没啥 注意指针的移动

```js
var reverseString = function(s) {
  const len = s.length
  if(len<=1) return s
  let left = 0
  let right = len-1
  // 反转的话 也不需要left === right的情况
  while(left<right){
    // 解构交换吧
    [s[left],s[right]] = [s[right],s[left]]
    left++
    right--
  }
  return s

};
```

数组的花式遍历 待刷
https://labuladong.online/zh/algo/practice-in-action/2d-array-traversal-summary/


回文串判断

现在你应该能感觉到回文串问题和左右指针肯定有密切的联系，比如让你判断一个字符串是不是回文串，你可以写出下面这段代码：

```js
var isPalindrome = function(s) {
    // 一左一右两个指针相向而行
    var left = 0, right = s.length - 1;
    // 一样不用left===right的情况
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}


```

现在来个稍微难点的 leetcode 第5题

给你一个字符串 s，找到 s 中最长的 回文 子串。

如果回文串的长度为奇数，则它有一个中心字符；如果回文串的长度为偶数，则可以认为它有两个中心字符。所以我们可以先实现这样一个函数：

```js
// 在 s 中寻找以 s[l] 和 s[r] 为中心的最长回文串
// 正确版本：从 l/r 向两边扩展，返回以 l/r 为中心的最长回文子串
var palindrome = function(s, l, r) {
  const len = s.length;
  // 边界：空字符串直接返回''
  if (len === 0) return '';
  // l r指向下一个要判断的字符串
  // 核心逻辑：向两边扩展，只要 l/r 不越界且字符相等，就继续扩展
  while (l >= 0 && r < len && s[l] === s[r]) {
    l--;
    r++;
  }
  
  // 退出循环时，s[l] !== s[r] 或越界，所以有效回文是 [l+1, r-1]
  // slice 是左闭右开，所以第二个参数传 r 即可（slice(l+1, r) 等价于 [l+1, r-1]）
  return s.slice(l + 1, r);
};
```


解决该问题的核心是从中心向两端扩散的双指针技巧。

遍历数组，看下每个元素及旁边元素为中心的 偶数回文 和奇数回文 

```js
/**
 * 寻找字符串中最长的回文子串（中心扩展法 + 提前终止优化）
 * 核心思路：回文子串具有中心对称性，分「单字符中心（奇数长度）」和「双字符中心（偶数长度）」两种情况
 * 时间复杂度：O(n²)（最坏情况），优化后实际执行效率更高
 * 空间复杂度：O(1)（仅使用常量级额外空间）
 * @param {string} s - 输入的原始字符串
 * @returns {string} - 最长回文子串
 */
var longestPalindrome = function(s) {
  const len = s.length;
  // 【易错点1：边界条件】空串/单字符直接返回，避免后续无效遍历
  // 错误示例：漏掉此判断，i=0时palindrome仍能执行，但会多一次无意义循环
  if(len <= 1) return s;

  let res = ''; // 存储最终找到的最长回文子串，初始为空

  // 遍历每个字符，作为回文中心的起点
  for(let i = 0; i < len; i++) {
    // 【核心优化：提前终止】
    // 原理：遍历到第i个字符时，剩余字符最多能组成的回文长度为 (len-i)*2（偶数长度）
    // 如果当前res长度已超过该值，后续不可能找到更长的回文，直接终止循环
    // 【易错点2：提前终止条件】注意是 (len-i)*2，不是 len-i（漏乘2会导致提前终止失效）
    if(res.length > (len - i) * 2) {
      break;
    }

    // 情况1：以s[i]为中心（奇数长度回文，如 "aba"，中心是中间的a）
    // 【易错点3：变量复用】此处用let声明str而非const，避免后续偶数中心时重复声明报错
    let str = palindrome(s, i, i);
    // 更新最长回文：保留长度更大的那个
    res = res.length > str.length ? res : str;

    // 情况2：以s[i]和s[i+1]为中心（偶数长度回文，如 "abba"，中心是两个b之间）
    // 【易错点4：越界防护】i < len-1 避免 r = i+1 超出字符串索引（如i=len-1时，i+1=len越界）
    // 错误示例：漏掉此判断，i=len-1时调用palindrome(s, len-1, len)，r=len会触发越界判断
    if(i < len - 1) {
      str = palindrome(s, i, i+1); // 复用str变量，无需重新声明
      res = res.length > str.length ? res : str;
    }
  }

  // 返回最终找到的最长回文子串
  return res;

  /**
   * 辅助函数：中心扩展，返回以l/r为中心的最长回文子串
   * @param {string} s - 原始字符串
   * @param {number} l - 回文中心左指针（初始为单/双中心的左位置）
   * @param {number} r - 回文中心右指针（初始为单/双中心的右位置）
   * @returns {string} - 以l/r为中心的最长回文子串
   */
  function palindrome(s, l, r) {
    const curLen = s.length;
    // 【易错点5：冗余判断】此处len===0判断无意义（主函数已处理len<=1的情况，调用时s不可能为空）
    // 可删除，不影响功能，但增加无意义代码执行
    if (curLen === 0) return '';

    // 【核心逻辑：中心扩展】
    // 循环条件：1. l>=0 左指针不越界 2. r<curLen 右指针不越界 3. s[l]===s[r] 左右字符相等
    // 【易错点6：循环条件顺序】必须先判断越界再判断字符相等，否则s[l]/s[r]会取到undefined导致错误
    // 错误示例：while(s[l] === s[r] && l >= 0 && r < curLen) → 越界时s[l]为undefined，和s[r]比较会出错
    while (l >= 0 && r < curLen && s[l] === s[r]) {
      l--; // 左指针左移，向左扩展
      r++; // 右指针右移，向右扩展
    }

    // 【易错点7：切片范围】退出循环时，l/r已越界或字符不相等，有效回文是 [l+1, r-1]
    // slice(start, end) 是左闭右开，因此end传r即可（slice(l+1, r) 等价于取 l+1 到 r-1 的字符）
    // 错误示例：return s.slice(l, r-1) → 会多取l位置的无效字符，或少取r-1位置的有效字符
    return s.slice(l + 1, r);
  };
};

```

## 刷数组双指针的题目

带刷 双指针的题目
https://labuladong.online/zh/algo/problem-set/array-two-pointers/


80. 删除有序数组中的重复项 II

给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使得出现次数超过两次的元素只出现两次 ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

之前是重复的元素留一个 现在是留两个 典型的加个flag判断下 其他逻辑不变

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  const len = nums.length;
  if(len<=2) return len; // 边界：长度≤2无需处理，直接返回
  // slow：指向「已保留元素的最后一个位置」（核心：慢指针守结果）
  let slow = 0;
  // fast：遍历指针（核心：快指针找新值） 注意这里需要从1开始 不然这里else if(nums[fast] === nums[slow] 会出错，仔细想想0肯定会保留 所以从1开始
  let fast = 1;
  // 标记：当前元素是否已经保留了两次
  let isTwiceAlready = false;

  while(fast < len) {
    // 情况1：fast元素 ≠ slow元素 → 是新元素，必须保留
    if(nums[fast] !== nums[slow] ){
      slow++; // slow移动到下一个待填充位置
      nums[slow] = nums[fast]; // 填充新元素
      isTwiceAlready = false; // 新元素，重置标记（还没保留两次）
    }
    // 情况2：fast元素 = slow元素 + 还没保留两次 → 保留第二次
    // 这里必须是else 防止基于上面的继续走代码
    else if(nums[fast] === nums[slow] && !isTwiceAlready ){
      slow++; // 移动slow
      nums[slow] = nums[fast]; // 填充第二次的重复元素
      isTwiceAlready = true; // 标记：已保留两次，后续再重复就跳过
    }
    // 情况3：fast元素 = slow元素 + 已保留两次 → 不处理（跳过）

    fast++; // fast继续遍历下一个元素
  }
  return slow+1; // slow是索引，长度=索引+1
};
```

更优解法是，fast其实和slow-1比较就可以

有序数组中，如果 nums[fast] === nums[slow-1]，说明：
nums[slow-1] 和 nums[slow] 已经是两个相同的元素（保留了两次）；
nums[fast] 是第三个重复元素，必须跳过；
反之，nums[fast] 要么是新元素，要么是第二个重复元素，都需要保留。

```js
var removeDuplicates = function(nums) {
  const len = nums.length;
  if(len<=2) return len; // 边界：长度≤2无需处理，直接返回
  // slow：指向「已保留元素的最后一个位置」（核心：慢指针守结果）,前两个就肯定保留 放在1的位置就好
  let slow = 1;
  // fast从2开始探索
  let fast = 2;


  while(fast < len) {
    //nums[fast] !== nums[slow-1]就代表 nums[fast] 要么是新元素，要么是第二个重复元素，都需要保留。
    if(nums[fast] !== nums[slow-1] ){
      slow++; // slow移动到下一个待填充位置
      nums[slow] = nums[fast]; // 填充新元素
    }
    fast++; // fast继续遍历下一个元素
  }
  return slow+1; // slow是索引，长度=索引+1
};
```

验证回文串

125. 验证回文串
如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 回文串 。

字母和数字都属于字母数字字符。


```js
/**
 * 验证回文字符串（忽略大小写、忽略非字母/数字字符）
 * 核心思路：双指针对撞法，先跳过非有效字符，再对比大小写统一后的字符
 * @param {string} s - 待验证的原始字符串
 * @return {boolean} - 是否为有效回文字符串
 */
var isPalindrome = function(s) {
  const len = s.length;
  // 【易错点1：边界条件】空串/单字符直接返回true，避免无效循环
  if(len <= 1) return true;

  let left = 0; // 左指针：从字符串头部开始
  let right = len - 1; // 右指针：从字符串尾部开始

  // 双指针对撞，直到指针相遇/交叉
  while(left < right) {
    // 【易错点2：跳过非有效字符】匹配字母/数字的正则写法 + 必须加left<right防越界
    // 错误示例1：/[a-z][0-9][A-Z]/ → 会匹配"a9Z"而非单个字母/数字
    // 错误示例2：漏掉left<right → 指针越界后仍会执行left++/right--，导致s[left]为undefined
    while(!/[a-z0-9A-Z]/.test(s[left]) && left < right) {
      left++; // 左指针跳过非字母/数字字符
    }
    while(!/[a-z0-9A-Z]/.test(s[right]) && left < right) {
      right--; // 右指针跳过非字母/数字字符
    }

    // 【易错点3：字符串方法名】toLowerCase() 注意L是大写，不是toLowercase()
    // 错误示例：s[left].toLowercase() → 报TypeError（方法不存在）
    if(s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false; // 字符不相等，直接判定不是回文
    }

    // 指针向中间移动，继续对比下一组字符
    left++;
    right--;
  }

  // 【易错点4：返回值】循环正常结束说明所有有效字符匹配，必须返回true
  // 错误示例：漏掉return true → 函数返回undefined，而非预期的true
  return true;
};
```

75. 颜色分类
给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。


分为三个区域


```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
/**
 * 颜色分类（荷兰国旗问题）：原地排序0/1/2，0放左、1放中、2放右
 * 核心思路：三指针分工，1次遍历完成排序（最优解）
 * @param {number[]} nums - 仅包含0/1/2的无序数组
 * @return {void} 无返回值，直接原地修改输入数组
 */
var sortColors = function(nums) {
  const len = nums.length;
  // 【易错点1：边界条件】长度≤1的数组无需排序，直接返回
  // 错误示例：漏掉此判断 → 空数组/单元素数组进入循环，无意义但不报错
  if(len <= 1) return;

  // 指针定义（通俗版）：
  // p0：「0区管家」，指向「下一个要放入0的位置」（p0左边全是已排好的0）
  // p2：「2区管家」，指向「下一个要放入2的位置」（p2右边全是已排好的2）
  // p：「检查员」，遍历数组，逐个检查当前元素该归到哪个区
  let p0 = 0;
  let p2 = len - 1;
  let p = 0;

  // 【易错点2：循环条件】p <= p2 而非 p < len
  // 原因：p2右边已经是排好的2，无需遍历；若写p < len会重复处理已排好的2
  // 错误示例：while(p < len) → 遍历到p2右侧的2，可能导致交换错误
  while(p <= p2) {
    // 情况1：检查员发现当前元素是0 → 归到0区
    if(nums[p] === 0) {
      // 交换「检查员位置」和「0区下一个空位」的元素，把0归位
      [nums[p0], nums[p]] = [nums[p], nums[p0]];
      p0++; // 0区管家右移，准备接收下一个0

      // 【易错点3：p的重置】p = Math.max(p, p0) 避免p回退到已处理的0区
      // 原因：p0左边全是0，p若小于p0，会重复检查已排好的0，导致逻辑混乱
      // 错误示例：漏掉这行 → p可能回退到p0左侧，重复交换0，最终数组出错
      p = Math.max(p, p0);
    }
    // 情况2：检查员发现当前元素是2 → 归到2区
    else if(nums[p] === 2) {
      // 交换「检查员位置」和「2区下一个空位」的元素，把2归位
      [nums[p2], nums[p]] = [nums[p], nums[p2]];
      p2--; // 2区管家左移，准备接收下一个2

      // 【易错点4：交换2后p不移动】
      // 原因：交换过来的元素可能是0/1，需要重新检查当前位置的新元素
      // 错误示例：交换2后写p++ → 跳过新交换来的0/1，导致漏处理（比如[2,0,1]会排序失败）
    }
    // 情况3：检查员发现当前元素是1 → 1本就该在中间，无需处理，直接检查下一个
    else if(nums[p] === 1) {
      p++;
    }
  }
};
```

因为是从头开始遍历  所以需要处理p 和p0的情况，本质都是「遍历指针不能回退到已处理的区间」，所以如果倒序的话 就是处理 p 和p2的情况

你学会了合并有序的单链表，如果让你合并有序数组，会有哪些不同呢？


88. 合并两个有序数组
给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。

请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。

注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

思路：
因为是合并到nums1 为了不覆盖前面的值，所以倒序
```js
/**
 * 合并两个有序数组（力扣88题）：将nums2合并到nums1中，nums1有足够空间容纳所有元素
 * 核心思路：从后往前双指针合并（避免覆盖nums1的有效元素），最优解
 * @param {number[]} nums1 - 第一个有序数组（长度=m+n，前m个为有效元素，后n个为占位0）
 * @param {number} m - nums1的有效元素个数
 * @param {number[]} nums2 - 第二个有序数组（长度=n，所有元素均有效）
 * @param {number} n - nums2的有效元素个数
 * @return {void} 无返回值，原地修改nums1，不返回新数组
 */
var merge = function(nums1, m, nums2, n) {
  // 【易错点1：m=0的边界处理】nums1无有效元素时，需原地修改而非直接赋值
  // 错误示例：nums1 = nums2 → 仅改变函数内变量引用，外部nums1数组无变化
  // 正确逻辑：循环将nums2的元素逐个复制到nums1，保证原地修改
  if(m === 0) {
    for(let i = 0; i < n; i++) {
      nums1[i] = nums2[i];
    }
    return;
  }

  // 【易错点2：n=0的边界处理】nums2无有效元素，无需任何操作直接返回
  // 错误示例：漏掉此判断 → 进入后续循环，但p2=-1会直接退出，无实质影响但逻辑冗余
  if(n === 0) {
    return;
  }

  // 双指针定义（核心！从后往前合并的关键）：
  // p1：nums1有效元素的最后一个位置（从后往前遍历nums1的有效元素）
  // p2：nums2有效元素的最后一个位置（从后往前遍历nums2的有效元素）
  // p：nums1的最后一个位置（合并后元素的填充位置，从后往前填充）
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;

  // 【易错点3：循环条件冗余】p>=0是多余的（p由p1/p2推导，只要p1/p2≥0，p必然≥0）
  // 简化后：while(p1 >= 0 && p2 >= 0)，不影响结果但更优雅
  while(p1 >= 0 && p2 >= 0) {
    const val1 = nums1[p1]; // 取nums1当前指针位置的元素
    // 【易错点4：取值数组混淆】val2必须取nums2[p2]，而非nums1[p2]
    // 错误示例：const val2 = nums1[p2] → 取到nums1的占位0，合并结果完全错误
    const val2 = nums2[p2];

    // 核心逻辑：把更大的元素放到nums1[p]位置（从后往前填充，保证有序）
    if(val1 > val2) {
      nums1[p] = val1; // nums1当前元素更大，填充到p位置
      p1--; // nums1指针左移，遍历下一个有效元素
    } else {
      nums1[p] = val2; // nums2当前元素更大/相等，填充到p位置
      p2--; // nums2指针左移，遍历下一个有效元素
    }
    p--; // 填充位置左移，准备下一次填充
  }

  // 【易错点5：遗漏nums2剩余元素处理】nums1先遍历完但nums2还有元素的情况
  // 原因：nums1的前半部分可能还有空位，需把nums2剩余元素填充进去
  // 错误示例：漏掉此循环 → nums2剩余元素未合并，结果缺失部分值
  // 注意：nums1剩余元素无需处理（本身就在nums1中，且已有序）
  while(p2 >= 0) {
    nums1[p] = nums2[p2]; // 填充nums2剩余元素到nums1
    p--; // 填充位置左移
    p2--; // nums2指针左移
  }
};
```

如果再变个花样，你是否还能依然认出这是双指针技巧合并有序数组的问题呢？

¶977. 有序数组的平方
给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。

这个和合并的那个很相似 三个指针 倒序填充

 ```js
 /**
 * @param {number[]} nums
 * @return {number[]}
 */
/**
 * 有序数组的平方：给非递减排序的整数数组，返回每个数的平方组成的非递减数组
 * 核心思路：双指针从两端向中间遍历（利用原数组有序的特性），避免排序的O(n log n)开销
 * @param {number[]} nums - 非递减排序的整数数组（可能包含负数）
 * @return {number[]} - 平方后非递减排序的新数组
 */
var sortedSquares = function(nums) {
  const len = nums.length;
  // 【易错点1：边界条件】空数组直接返回空数组，避免后续指针操作报错
  // 错误示例：漏掉此判断 → len=0时，new Array(len)是[]，但循环不会执行，结果仍正确，但逻辑不完整
  if(len === 0) return [];

  // 双指针定义（核心！利用原数组有序的特性）：
  // left：左指针，从数组头部开始（负数绝对值可能最大的位置）
  // right：右指针，从数组尾部开始（正数绝对值可能最大的位置）
  // p：结果数组的填充指针，从尾部开始（先填最大的平方值，保证结果有序）
  let left = 0;
  let right = len - 1;
  let p = len - 1;

  // 【易错点2：结果数组初始化】必须预先创建定长数组，而非动态push（保证O(1)空间+O(n)时间）
  // 错误示例：用空数组push → 需额外反转数组，增加无意义操作
  const res = new Array(len);

  // 【易错点3：循环条件】left <= right（包含left=right的最后一个元素）
  // 错误示例：left < right → 漏掉最后一个元素，结果数组少一个值
  while(left <= right) {
    // 核心逻辑：比较左右指针元素的绝对值，绝对值大的平方后填充到结果数组尾部
    if(Math.abs(nums[left]) > Math.abs(nums[right])) {
      res[p] = nums[left] * nums[left]; // 左指针元素绝对值更大，平方后填充
      left++; // 左指针右移，遍历下一个元素
    } else {
      res[p] = nums[right] * nums[right]; // 右指针元素绝对值更大/相等，平方后填充
      right--; // 右指针左移，遍历下一个元素
    }
    p--; // 结果数组填充指针左移，准备填充下一个较小的平方值
  }

  return res; // 返回平方后有序的新数组
};
 ```


 -->
