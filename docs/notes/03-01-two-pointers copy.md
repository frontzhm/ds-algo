# 双指针（Two Pointers）详解：原理+分类+场景+模板+例题

## 一、双指针是什么？

**核心定义**：用**两个指针（索引）** 遍历数据结构（数组/链表），通过指针的"移动规则"减少遍历次数，将时间复杂度从 O(n²) 优化到 O(n)。

简单说：不用嵌套循环遍历所有可能，而是用两个指针"协作"，一次遍历解决问题。

## 二、双指针的3大分类（必掌握）

双指针的核心是**"指针的移动规则"**，不同规则对应不同场景：

### 2.1 快慢指针（Fast & Slow Pointers）

快慢指针（Fast & Slow Pointers）本质是用两个步长不同的指针（如快指针走 2 步、慢指针走 1 步）遍历线性数据结构（链表 / 数组），核心解决「环检测、找中点、找倒数第 k 个元素」三类问题，优势是：空间复杂度从 O (n) 降到 O (1)，且无需额外容器（如哈希表）。

**指针位置**：两个指针从**同一端（通常是开头）** 出发

**移动规则**：快指针每次走2步，慢指针每次走1步（或其他"速度差"）

**适用场景**：链表/数组的"环形问题"、"找特定位置（中点 倒数k个点）"

**核心原理**：利用"速度差"制造"相对位置"——比如快指针先到终点，慢指针刚好在中间；或快指针追上慢指针，说明有环。

**经典场景+模板+例题**：

#### 场景1：判断链表是否有环

**题目描述：** [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

给你一个链表的头节点 `head`，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：`pos` 不作为参数进行传递，仅仅是为了标识链表的实际情况。

如果链表中存在环，则返回 `true`。否则，返回 `false`。

**示例 1：**

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

```
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

**解题思路详解：**

**核心思想：快慢指针（Floyd 判圈算法）**

使用两个指针，一个快指针每次移动两步，一个慢指针每次移动一步。如果链表中存在环，快指针最终会追上慢指针（相遇）；如果没有环，快指针会先到达链表末尾（`null`）。

**为什么快慢指针能检测环？**

1. **无环情况**：快指针会先到达链表末尾，循环结束，返回 `false`
2. **有环情况**：快指针和慢指针都会进入环内
   - 假设慢指针进入环时，快指针已经在环内某个位置
   - 由于快指针每次比慢指针多走一步，它们之间的距离会逐渐缩小
   - 最终快指针会追上慢指针（相遇），证明有环

**数学证明（为什么一定会相遇）：**

假设：

- 环外长度为 `a`（从头节点到环入口的距离）
- 环长度为 `b`
- 慢指针进入环时，快指针在环内距离入口 `c` 的位置（0 ≤ c < b）

当慢指针进入环时：

- 慢指针位置：`a`
- 快指针位置：`a + c`
- 快慢指针距离：`c`（快指针在慢指针前面 `c` 步）

由于快指针每次比慢指针多走 1 步，它们之间的距离每次减少 1：

- 第 1 次移动后：距离变为 `c - 1`
- 第 2 次移动后：距离变为 `c - 2`
- ...
- 第 `c` 次移动后：距离变为 `0`（相遇）

因此，最多经过 `c` 次移动（`c < b`），快慢指针一定会相遇。

**代码实现：**

```typescript
function hasCycle(head: ListNode | null): boolean {
  let fast = head,
    slow = head;
  // 快指针需要检查 fast 和 fast.next，避免空指针
  while (fast && fast.next) {
    fast = fast.next.next; // 快指针走2步
    slow = slow.next; // 慢指针走1步
    if (fast === slow) return true; // 相遇则有环
  }
  return false; // 快指针到达末尾，无环
}
```

**关键点解析：**

1. **初始化**：快慢指针都从头节点开始
2. **循环条件**：`fast && fast.next` 确保快指针可以安全地移动两步
3. **移动规则**：快指针每次移动 2 步，慢指针每次移动 1 步
4. **判断相遇**：如果 `fast === slow`，说明两指针相遇，存在环
5. **无环情况**：快指针到达 `null`，循环结束，返回 `false`

**时间复杂度：** O(n)，其中 n 是链表中节点的数量

- 无环：快指针最多遍历 n 个节点
- 有环：快慢指针最多在环内相遇，时间复杂度仍为 O(n)

**空间复杂度：** O(1)，只使用了两个额外的指针

**执行过程示例：**

```
有环链表：1 -> 2 -> 3 -> 4 -> 5 -> 3 (5指向3，形成环)

初始：fast = 1, slow = 1
第1步：fast = 3, slow = 2
第2步：fast = 5, slow = 3
第3步：fast = 4, slow = 4 (相遇！返回 true)
```

#### 场景2：找链表中间节点

**题目描述：** [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

给你单链表的头结点 `head`，请你找出并返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

**示例 1：**

```
输入：head = [1,2,3,4,5]
输出：[3,4,5]
解释：链表只有一个中间结点，值为 3。
```

**示例 2：**

```
输入：head = [1,2,3,4,5,6]
输出：[4,5,6]
解释：该链表有两个中间结点，值分别为 3 和 4，返回第二个结点。
```

**解题思路详解：**

**核心思想：快慢指针**

使用两个指针，快指针每次移动两步，慢指针每次移动一步。当快指针到达链表末尾时，慢指针刚好在中间位置。

**为什么慢指针在中间？**

- 假设链表长度为 `n`
- 快指针移动了 `n` 步（到达末尾）
- 慢指针移动了 `n/2` 步（刚好在中间）

**偶数个节点的情况：**

- 如果有 6 个节点，快指针移动 6 步到末尾，慢指针移动 3 步
- 由于题目要求"两个中间结点返回第二个"，所以返回慢指针指向的节点是正确的

**代码实现：**

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  let fast = head,
    slow = head;
  // 快指针每次走2步，慢指针每次走1步
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }
  return slow; // 慢指针在中间
}
```

**关键点解析：**

1. **循环条件**：`fast && fast.next` 确保快指针可以安全地移动两步
2. **移动规则**：快指针移动 2 步，慢指针移动 1 步
3. **返回结果**：慢指针指向的节点就是中间节点

**时间复杂度：** O(n)，其中 n 是链表的节点数，需要遍历链表一次

**空间复杂度：** O(1)，只使用了两个额外的指针

**执行过程示例：**

```
链表：1 -> 2 -> 3 -> 4 -> 5

初始：fast = 1, slow = 1
第1步：fast = 3, slow = 2
第2步：fast = 5, slow = 3
fast.next = null，循环结束
返回 slow = 3（中间节点）
```

#### 场景3：删除倒数第k个节点

**题目描述：** [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

**示例 1：**

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**示例 2：**

```
输入：head = [1], n = 1
输出：[]
```

**示例 3：**

```
输入：head = [1,2], n = 1
输出：[1]
```

**解题思路详解：**

**核心思想：快慢指针 + 虚拟头节点**

1. **快指针先走 n 步**：让快指针领先慢指针 n 个位置
2. **快慢指针同时移动**：当快指针到达末尾时，慢指针刚好在倒数第 n+1 个节点
3. **删除节点**：将慢指针的下一个节点删除

**为什么慢指针在倒数第 n+1 个节点？**

- 假设链表长度为 `L`，要删除倒数第 `n` 个节点
- 快指针先走 `n` 步，此时快指针在正数第 `n+1` 个节点
- 快慢指针同时移动，当快指针到达末尾（第 `L` 个节点）时
- 慢指针移动了 `L - n` 步，位于第 `L - n + 1` 个节点
- 第 `L - n + 1` 个节点就是倒数第 `n + 1` 个节点（因为 `L - (L - n + 1) + 1 = n + 1`）

**边界情况处理：**

- 如果 `fast` 为 `null`（快指针先走 n 步后为空），说明要删除的是头节点
- 直接返回 `head.next`

**代码实现：**

```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  let fast = head,
    slow = head;
  // 快指针先跑n步
  for (let i = 0; i < n; i++) {
    fast = fast!.next;
  }
  // 如果快指针为空，说明要删除的是头节点
  if (!fast) return head!.next;
  // 快慢指针一起跑，快指针到终点时，慢指针在倒数第n+1个节点
  while (fast.next) {
    fast = fast.next;
    slow = slow!.next;
  }
  // 删除倒数第n个节点（slow.next）
  slow!.next = slow!.next!.next;
  return head;
}
```

**关键点解析：**

1. **快指针先走 n 步**：建立快慢指针之间的相对位置
2. **边界检查**：`if (!fast)` 处理删除头节点的情况
3. **循环条件**：`fast.next` 确保慢指针停在倒数第 n+1 个节点
4. **删除操作**：`slow.next = slow.next.next` 跳过要删除的节点

**时间复杂度：** O(n)，其中 n 是链表的节点数，需要遍历链表一次

**空间复杂度：** O(1)，只使用了两个额外的指针

**执行过程示例：**

```
链表：1 -> 2 -> 3 -> 4 -> 5，删除倒数第 2 个节点（4）

初始：fast = 1, slow = 1
快指针先走2步：fast = 3, slow = 1
快慢指针一起移动：
  第1步：fast = 4, slow = 2
  第2步：fast = 5, slow = 3
fast.next = null，循环结束
slow = 3（倒数第3个节点），slow.next = 4（要删除的节点）
删除：slow.next = slow.next.next，即 3.next = 5
结果：1 -> 2 -> 3 -> 5
```

### 2.2 左右指针（Left & Right Pointers）

左右指针（Left & Right Pointers）本质是用两个指针从「数组 / 字符串的两端」向中间移动（或从同一端同向移动），核心解决「有序数组 / 字符串的双值匹配、区间收缩、回文判断、去重」四类问题，优势是：将暴力枚举的 O (n²) 时间复杂度降到 O (n)，且空间复杂度 O (1)。

**指针位置**：两个指针从**两端（开头+结尾）** 出发

**移动规则**：根据条件向中间移动（比如"左指针右移"或"右指针左移"）

**适用场景**：有序数组、回文、区间最值

**核心原理**：利用"两端向中间收缩"的方式，缩小搜索范围，避免遍历所有组合。

满足以下任一条件，直接用左右指针：数据结构是数组 / 字符串（可随机访问），且是「有序」的；问题涉及「两端向中间匹配」（如回文、两数之和）；问题涉及「区间收缩 / 滑动窗口」（如去重、子串 / 子数组）；要求「O (n) 时间 + O (1) 空间」，且无需处理「环」相关问题。

**经典场景+模板+例题**：

#### 场景1：有序数组两数之和

**题目描述：** [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

给你一个下标从 **1** 开始的整数数组 `numbers`，该数组已按 **非递减顺序排列**，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]`，则 `1 <= index1 < index2 <= numbers.length`。

以长度为 2 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 `index1` 和 `index2`。

你可以假设每个输入 **只对应唯一的答案**，而且你 **不可以** 重复使用相同的元素。

**示例 1：**

```
输入：numbers = [2,7,11,15], target = 9
输出：[1,2]
解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
```

**示例 2：**

```
输入：numbers = [2,3,4], target = 6
输出：[1,3]
解释：2 与 4 之和等于目标数 6 。因此 index1 = 1, index2 = 3 。返回 [1, 3] 。
```

**示例 3：**

```
输入：numbers = [-1,0], target = -1
输出：[1,2]
解释：-1 与 0 之和等于目标数 -1 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
```

**解题思路详解：**

**核心思想：左右指针向中间收缩**

由于数组是有序的，可以利用这个特性：

- 如果两数之和小于目标值，说明需要更大的数，左指针右移
- 如果两数之和大于目标值，说明需要更小的数，右指针左移
- 如果两数之和等于目标值，找到答案

**为什么这样移动指针是正确的？**

假设当前 `sum = numbers[left] + numbers[right]`：

1. **如果 `sum < target`**：
   - 由于数组有序，`numbers[left]` 是当前左区间的最小值
   - 要增大和，只能让 `left++`（右移左指针）
   - 如果右移右指针，和会变得更小，不符合要求

2. **如果 `sum > target`**：
   - 由于数组有序，`numbers[right]` 是当前右区间的最大值
   - 要减小和，只能让 `right--`（左移右指针）
   - 如果左移左指针，和会变得更大，不符合要求

**代码实现：**

```typescript
function twoSum(numbers: number[], target: number): number[] {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      // 题目要求下标从1开始
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++; // 太小，左指针右移（增大和）
    } else {
      right--; // 太大，右指针左移（减小和）
    }
  }
  return []; // 未找到（题目保证有解，这里不会执行）
}
```

**关键点解析：**

1. **循环条件**：`left < right` 确保两个指针不会相遇
2. **移动规则**：根据和与目标值的大小关系决定移动哪个指针
3. **返回值**：注意题目要求下标从 1 开始，所以返回 `[left + 1, right + 1]`

**时间复杂度：** O(n)，其中 n 是数组的长度，最多遍历数组一次

**空间复杂度：** O(1)，只使用了两个额外的指针

**执行过程示例：**

```
数组：[2, 7, 11, 15]，target = 9

初始：left = 0, right = 3
第1次：sum = 2 + 15 = 17 > 9，right--，right = 2
第2次：sum = 2 + 11 = 13 > 9，right--，right = 1
第3次：sum = 2 + 7 = 9 = 9，找到答案，返回 [1, 2]
```

#### 场景2：盛最多水的容器

**题目描述：** [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

给定一个长度为 `n` 的整数数组 `height`。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])`。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：** 你不能倾斜容器。

**示例 1：**

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

**解题思路详解：**

**核心思想：左右指针 + 贪心策略**

容器的面积由两个因素决定：

1. **宽度**：`right - left`（两指针之间的距离）
2. **高度**：`Math.min(height[left], height[right])`（较矮的那条边）

**贪心策略：移动较矮的边**

为什么移动较矮的边？因为：

- 如果移动较高的边，宽度会减小，但高度不会增加（受限于较矮的边）
- 如果移动较矮的边，虽然宽度也会减小，但高度可能会增加（如果新的边更高）

**数学证明：**

假设当前左右指针指向的高度为 `h[left]` 和 `h[right]`，且 `h[left] < h[right]`：

- 当前面积：`S = (right - left) * h[left]`
- 如果移动右指针（较高的边）：
  - 新宽度：`right - left - 1`（减小）
  - 新高度：`≤ h[left]`（受限于较矮的边）
  - 新面积：`≤ (right - left - 1) * h[left] < S`（一定更小）
- 如果移动左指针（较矮的边）：
  - 新宽度：`right - left - 1`（减小）
  - 新高度：可能 `> h[left]`（如果新的边更高）
  - 新面积：可能更大

因此，移动较矮的边是更优的选择。

**代码实现：**

```typescript
function maxArea(height: number[]): number {
  let left = 0,
    right = height.length - 1,
    max = 0;
  while (left < right) {
    // 计算当前面积：宽度 * 较矮的边
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);
    // 移动较矮的边（贪心策略）
    if (height[left] < height[right]) {
      left++; // 左指针右移
    } else {
      right--; // 右指针左移
    }
  }
  return max;
}
```

**关键点解析：**

1. **面积计算**：`(right - left) * Math.min(height[left], height[right])`
2. **移动策略**：比较左右两边的高度，移动较矮的那一边
3. **更新最大值**：每次计算面积后，更新 `max`

**时间复杂度：** O(n)，其中 n 是数组的长度，需要遍历数组一次

**空间复杂度：** O(1)，只使用了两个额外的指针

**执行过程示例：**

```
数组：[1,8,6,2,5,4,8,3,7]

初始：left = 0, right = 8, max = 0
第1次：area = (8-0) * min(1,7) = 8 * 1 = 8，max = 8
        height[0] < height[8]，left++，left = 1
第2次：area = (8-1) * min(8,7) = 7 * 7 = 49，max = 49
        height[1] > height[8]，right--，right = 7
第3次：area = (7-1) * min(8,3) = 6 * 3 = 18，max = 49
        height[1] > height[7]，right--，right = 6
...继续移动，最终返回 max = 49
```

#### 场景3：验证回文串

**题目描述：** [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)

如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 **回文串**。

字母和数字都属于字母数字字符。

给你一个字符串 `s`，如果它是 **回文串**，返回 `true`；否则，返回 `false`。

**示例 1：**

```
输入: s = "A man, a plan, a canal: Panama"
输出：true
解释："amanaplanacanalpanama" 是回文串。
```

**示例 2：**

```
输入：s = "race a car"
输出：false
解释："raceacar" 不是回文串。
```

**示例 3：**

```
输入：s = " "
输出：true
解释：s 是一个空字符串 "" 或者只包含空格，所以它是回文串。
```

**解题思路详解：**

**核心思想：左右指针向中间收缩，逐字符比较**

1. **预处理**：移除所有非字母数字字符，转换为小写
2. **双指针比较**：左右指针分别从两端向中间移动，逐字符比较
3. **判断回文**：如果所有字符都匹配，则是回文串

**优化版本（不预处理，边遍历边处理）：**

可以不用预处理，在遍历过程中跳过非字母数字字符，这样空间复杂度更优。

**代码实现（预处理版本）：**

```typescript
function isPalindrome(s: string): boolean {
  // 预处理：移除非字母数字字符，转换为小写
  s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

**代码实现（优化版本，O(1) 空间）：**

```typescript
function isPalindrome(s: string): boolean {
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    // 跳过非字母数字字符
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
      left++;
    }
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
      right--;
    }
    // 比较字符（转换为小写）
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}
```

**关键点解析：**

1. **预处理**：使用正则表达式 `/[^a-zA-Z0-9]/g` 移除非字母数字字符
2. **大小写处理**：使用 `toLowerCase()` 统一转换为小写
3. **循环条件**：`left < right` 确保两个指针不会相遇
4. **字符比较**：逐字符比较，发现不匹配立即返回 `false`

**时间复杂度：** O(n)，其中 n 是字符串的长度，需要遍历字符串一次

**空间复杂度：**

- 预处理版本：O(n)，需要创建新字符串
- 优化版本：O(1)，只使用了两个额外的指针

**执行过程示例：**

```
字符串："A man, a plan, a canal: Panama"
预处理后："amanaplanacanalpanama"

初始：left = 0, right = 20
第1次：s[0] = 'a', s[20] = 'a'，匹配，left++, right--
第2次：s[1] = 'm', s[19] = 'm'，匹配，left++, right--
...继续比较，所有字符都匹配
最终返回 true
```

### 2.3 固定窗口指针（Fixed Window Pointers）

**指针位置**：两个指针从**同一端**出发，维护一个"固定大小的窗口"

**移动规则**：左右指针同时移动，保持窗口大小不变

**适用场景**：固定长度的子数组/子串问题

**核心原理**：用窗口覆盖"固定长度的区间"，一次遍历计算所有区间的结果。

**经典场景+模板+例题**：

#### 场景：固定长度子数组的最大和

**题目描述：** 给定一个整数数组 `nums` 和一个整数 `k`，找出长度为 `k` 的连续子数组的最大和。

**示例 1：**

```
输入：nums = [1,2,3,4,5], k = 3
输出：12
解释：长度为 3 的子数组 [3,4,5] 的和最大，为 12。
```

**示例 2：**

```
输入：nums = [-1,2,3,-4,5], k = 2
输出：5
解释：长度为 2 的子数组 [2,3] 的和最大，为 5。
```

**解题思路详解：**

**核心思想：滑动窗口（固定窗口大小）**

固定窗口大小的滑动窗口问题，核心是：

1. **初始化窗口**：计算第一个窗口（前 k 个元素）的和
2. **滑动窗口**：每次向右移动一位，更新窗口和
3. **更新最大值**：每次移动后，更新最大和

**窗口滑动技巧：**

当窗口向右滑动一位时：

- 新窗口 = 旧窗口 - 左边界元素 + 右边界元素
- `新和 = 旧和 - nums[left] + nums[right]`
- 或者：`新和 = 旧和 - nums[right - k] + nums[right]`

**代码实现：**

```typescript
function maxSubarraySum(nums: number[], k: number): number {
  let sum = 0,
    max = 0;
  // 先计算第一个窗口的和
  for (let i = 0; i < k; i++) {
    sum += nums[i];
  }
  max = sum;
  // 窗口滑动：左指针右移（减左值），右指针右移（加右值）
  for (let right = k; right < nums.length; right++) {
    // 新窗口和 = 旧窗口和 - 移出的左边界元素 + 新加入的右边界元素
    sum += nums[right] - nums[right - k];
    max = Math.max(max, sum);
  }
  return max;
}
```

**关键点解析：**

1. **初始化窗口**：计算前 k 个元素的和
2. **滑动窗口**：`sum += nums[right] - nums[right - k]` 更新窗口和
3. **更新最大值**：每次移动后更新 `max`

**时间复杂度：** O(n)，其中 n 是数组的长度，需要遍历数组一次

**空间复杂度：** O(1)，只使用了两个额外的变量

**执行过程示例：**

```
数组：[1,2,3,4,5]，k = 3

初始窗口：[1,2,3]，sum = 6，max = 6
滑动1次：[2,3,4]，sum = 6 - 1 + 4 = 9，max = 9
滑动2次：[3,4,5]，sum = 9 - 2 + 5 = 12，max = 12
返回 max = 12
```

**相关题目：** [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)（变种：固定长度改为最小长度）

### 2.4 Vue3 diff 四个指针（进阶应用）

**适用场景：**

- Vue3 虚拟 DOM 对比算法
- 新旧节点列表的高效比较
- 需要最小化 DOM 操作的场景

**核心思想：**

使用四个指针（旧头、旧尾、新头、新尾）同时从两端向中间遍历，通过多种比较策略减少比较次数，提升性能。

**为什么需要四个指针？**

传统的双指针只能从一端或两端比较，但 Vue3 的 diff 算法需要：

1. **头头比较**：检查开头是否有相同节点（可能只是顺序变化）
2. **尾尾比较**：检查结尾是否有相同节点（可能只是顺序变化）
3. **头尾交叉比较**：检查是否有节点从开头移到了结尾（或相反）
4. **尾头交叉比较**：检查是否有节点从结尾移到了开头（或相反）

通过这四种比较，可以快速识别出：

- 未移动的节点（头头、尾尾匹配）
- 移动的节点（交叉匹配）
- 新增/删除的节点（都不匹配）

**算法流程：**

1. **头头比较**：如果旧头和新头相同，两个头指针都右移
2. **尾尾比较**：如果旧尾和新尾相同，两个尾指针都左移
3. **头尾交叉比较**：如果旧头和新尾相同，说明节点从开头移到了结尾
4. **尾头交叉比较**：如果旧尾和新头相同，说明节点从结尾移到了开头
5. **都不匹配**：需要查找新节点在旧列表中的位置，或标记为新增

**参考实现：**

```typescript
// Vue3 diff 算法的简化版思路
function diff(oldList: Node[], newList: Node[]): void {
  let oldStart = 0;
  let oldEnd = oldList.length - 1;
  let newStart = 0;
  let newEnd = newList.length - 1;

  // 四个指针同时移动，比较并更新
  while (oldStart <= oldEnd && newStart <= newEnd) {
    // 1. 头头比较：旧头和新头相同
    if (oldList[oldStart].key === newList[newStart].key) {
      // 更新节点，两个头指针都右移
      patch(oldList[oldStart], newList[newStart]);
      oldStart++;
      newStart++;
    }
    // 2. 尾尾比较：旧尾和新尾相同
    else if (oldList[oldEnd].key === newList[newEnd].key) {
      // 更新节点，两个尾指针都左移
      patch(oldList[oldEnd], newList[newEnd]);
      oldEnd--;
      newEnd--;
    }
    // 3. 头尾交叉比较：旧头和新尾相同（节点从开头移到了结尾）
    else if (oldList[oldStart].key === newList[newEnd].key) {
      // 移动节点到正确位置
      move(oldList[oldStart], newEnd);
      oldStart++;
      newEnd--;
    }
    // 4. 尾头交叉比较：旧尾和新头相同（节点从结尾移到了开头）
    else if (oldList[oldEnd].key === newList[newStart].key) {
      // 移动节点到正确位置
      move(oldList[oldEnd], newStart);
      oldEnd--;
      newStart++;
    }
    // 5. 都不匹配：需要查找或新增
    else {
      // 查找新节点在旧列表中的位置
      const index = findIndex(oldList, newList[newStart].key, oldStart, oldEnd);
      if (index !== -1) {
        // 找到了，移动节点
        move(oldList[index], newStart);
        oldList[index] = null; // 标记为已处理
      } else {
        // 没找到，新增节点
        insert(newList[newStart], newStart);
      }
      newStart++;
    }
  }

  // 处理剩余节点
  if (oldStart > oldEnd) {
    // 旧列表处理完，新列表还有剩余，全部新增
    for (let i = newStart; i <= newEnd; i++) {
      insert(newList[i], i);
    }
  } else if (newStart > newEnd) {
    // 新列表处理完，旧列表还有剩余，全部删除
    for (let i = oldStart; i <= oldEnd; i++) {
      remove(oldList[i]);
    }
  }
}
```

**性能优势：**

- **减少比较次数**：通过四种比较策略，快速识别相同节点
- **最小化 DOM 操作**：只移动真正需要移动的节点，而不是全部重新渲染
- **时间复杂度优化**：平均情况下比传统 diff 算法更快

**实际应用：**

Vue3 的 `patchChildren` 函数就是使用这种四指针算法来高效更新子节点列表，这也是 Vue3 性能提升的关键之一。

## 三、双指针的学习技巧（必看）

1. **先记"移动规则"**：不同分类的核心是"指针怎么动"——快慢指针是"速度差"，左右指针是"向中间收缩"，固定窗口是"同时移动"

2. **先刷"模板题"**：每个分类先做2-3道简单题（比如先刷"环形链表"、"两数之和II"），熟练后再做变种

3. **注意"边界条件"**：比如链表的`fast && fast.next`（避免空指针）、数组的`left < right`（避免越界）

4. **多总结"适用场景"**：看到"环形"、"倒数第k"想快慢指针；看到"有序数组"、"回文"想左右指针；看到"固定长度"想固定窗口

## 四、双指针每日刷题清单

**Day 1：快慢指针基础**

- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)
- [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

**Day 2：快慢指针进阶**

- [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)
- [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

**Day 3：左右指针基础**

- [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)
- [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)

**Day 4：左右指针进阶**

- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)
- [344. 反转字符串](https://leetcode.cn/problems/reverse-string/)

**Day 5：固定窗口**

- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)
- 固定长度子数组的最大和（模板题）

## 总结

双指针是**数组/链表问题的"最优解工具"**，掌握这3类分类+对应的模板，90%的双指针题都能解决。核心是理解"指针的移动规则"，然后根据问题特点选择合适的分类。
