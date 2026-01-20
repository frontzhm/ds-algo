# 前端算法必备：双指针从入门到很熟练（快慢指针+相向指针+滑动窗口）

<!--
> 🎯 **交互演示**：[相向指针剪枝可视化](https://frontzhm.github.io/blog-demo/two-pointers-headtail.html) - 动态演示剪枝过程，直观理解从 O(n²) 到 O(n) 的优化！
>
> 📚 **相关文档**：[滑动窗口详解](https://juejin.cn/post/7593731473489690687) - 双指针的重要应用，处理子串/子数组问题
-->

## 📑 目录

- [一、双指针是什么？](#一双指针是什么)
- [二、双指针的分类](#二双指针的分类)
  - [2.1 快慢指针](#21-快慢指针fast--slow-pointers)
  - [2.2 左右指针（相向指针）](#22-左右指针相向指针left--right-pointers)
  - [2.3 同向指针（滑动窗口）](#23-同向指针滑动窗口sliding-window)
    - [2.3.1 滑动窗口与相向指针的相似性：剪枝优化](#231-滑动窗口与相向指针的相似性剪枝优化)
- [三、快速判断：什么时候用哪种双指针？](#三快速判断什么时候用哪种双指针)
- [四、双指针的学习技巧](#四双指针的学习技巧)
- [五、刷题清单：从基础到进阶](#五刷题清单从基础到进阶)
  - [前端必刷题目（按难度和面试频次）](#前端必刷题目按难度和面试频次)
- [六、常见错误和避坑点](#六常见错误和避坑点)
<!-- - [七、前端应用场景](#七前端应用场景) -->

## 一、双指针是什么？

**核心定义**：用**两个指针（索引）** 遍历数据结构（数组/链表），通过指针的"移动规则"减少遍历次数，将时间复杂度从 O(n²) 优化到 O(n)。

简单说：不用嵌套循环遍历所有可能，而是用两个指针"协作"，一次遍历解决问题。

## 二、双指针的分类

双指针的核心是**"指针的移动规则"**，不同规则对应不同场景。按照**指针的移动方式和相对位置**，主要分为以下3大类：

| 分类 | 指针位置 | 移动方式 | 核心特点 | 典型问题 |
| --- | --- | --- | --- | --- |
| **快慢指针** | 同一端出发 | 同向移动，速度不同 | 利用速度差制造相对位置 | 环检测、找中点、找倒数第k个 |
| **左右指针（相向指针）** | 两端出发 | 相向移动（向中间靠拢） | 利用有序性缩小搜索范围 | 两数之和、回文判断、盛水容器 |
| **同向指针（滑动窗口）** | 同一端出发 | 同向移动，维护窗口 | 利用单调性压缩遍历维度 | 无重复子串、最小子数组、子数组计数 |

> 💡 **说明**：Vue3 diff 四个指针是左右指针的进阶应用，会在"前端应用场景"部分作为实际案例介绍。

### 2.1 快慢指针（Fast & Slow Pointers）

快慢指针（Fast & Slow Pointers）本质是用两个步长不同的指针（如快指针走 2 步、慢指针走 1 步）遍历线性数据结构（链表 / 数组），核心解决「环检测、找中点、找倒数第 k 个元素」三类问题，优势是：空间复杂度从 O (n) 降到 O (1)，且无需额外容器（如哈希表）。

**指针位置**：两个指针从**同一端（通常是开头）** 出发

**移动规则**：快指针每次走2步，慢指针每次走1步（或其他"速度差"）

**适用场景**：链表/数组的"环形问题"、"找特定位置（中点 倒数k个点）"

**核心原理**：利用"速度差"制造"相对位置"——比如快指针先到终点，慢指针刚好在中间；或快指针追上慢指针，说明有环。

**核心模板**：

```typescript
// 快慢指针通用模板
function fastSlowPointer(head: ListNode | null): boolean | ListNode | null {
  let fast = head;
  let slow = head;

  // 关键：循环条件确保快指针可以安全移动
  while (fast && fast.next) {
    fast = fast.next.next; // 快指针走2步
    slow = slow.next; // 慢指针走1步

    // 根据具体问题判断
    // 1. 环检测：if (fast === slow) return true;
    // 2. 找中点：循环结束后 slow 就是中点
    // 3. 找倒数第k个：先让 fast 走 k 步，再一起走
  }

  return false; // 或返回 slow（中点）
}
```

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

### 2.2 左右指针（相向指针，Left & Right Pointers）

> 🎯 **交互演示**：[点击这里查看动态演示](https://frontzhm.github.io/blog-demo/two-pointers-headtail.html) - 通过交互式可视化，直观看到每一步剪掉的组合！

左右指针（Left & Right Pointers）本质是用两个指针从「数组 / 字符串的两端」向中间移动，核心解决「有序数组 / 字符串的双值匹配、区间收缩、回文判断、区间最值」四类问题，优势是：将暴力枚举的 O(n²) 时间复杂度降到 O(n)，且空间复杂度 O(1)。

**指针位置**：两个指针从**两端（开头+结尾）** 出发

**移动规则**：根据条件向中间移动（比如"左指针右移"或"右指针左移"）

**适用场景**：有序数组、回文、区间最值

**核心原理**：利用"两端向中间收缩"的方式，缩小搜索范围，避免遍历所有组合。

满足以下任一条件，直接用左右指针：数据结构是数组 / 字符串（可随机访问），且是「有序」的；问题涉及「两端向中间匹配」（如回文、两数之和）；问题涉及「区间收缩 / 滑动窗口」（如去重、子串 / 子数组）；要求「O (n) 时间 + O (1) 空间」，且无需处理「环」相关问题。

抖音上有个[博主的视频](https://v.douyin.com/gQhWu32_Wxg) ，我觉得讲的很好，可以先看完，对相向有个可视化的认识，简单说，每次移动左指针和右指针，在脑海里，就会干掉了某一行或者某列表的组合，以此进行优化，本质是剪枝思想

**核心模板**：

```typescript
// 左右指针通用模板
function leftRightPointer(arr: number[] | string, target: any): any {
  let left = 0;
  let right = arr.length - 1;

  // 关键：循环条件确保两个指针不会相遇
  while (left < right) {
    // 根据具体问题判断
    const sum = arr[left] + arr[right]; // 或比较 arr[left] 和 arr[right]

    if (满足条件) {
      // 找到答案或更新答案
      return result;
    } else if (需要增大) {
      left++; // 左指针右移
    } else {
      right--; // 右指针左移
    }
  }

  return result;
}
```

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

> 💡 **提示**：想要更直观地理解剪枝过程？[点击这里体验交互式演示](https://frontzhm.github.io/blog-demo/two-pointers-headtail.html)，每一步都能看到被剪掉的组合！

这涉及到**剪枝优化**的核心思想。让我们用矩阵可视化来理解：

**第一步：理解暴力枚举的搜索空间**

暴力枚举需要检查所有可能的 `(i, j)` 组合，其中 `i < j`。这形成了一个矩阵：

```
所有可能的组合 (i, j)，其中 i < j：

      j=0  1  2  3
i=0   -  01 02 03  ← 第0行
i=1   -  -  12 13  ← 第1行
i=2   -  -  -  23  ← 第2行
i=3   -  -  -  -   ← 第3行（空）

总共有 N*(N-1)/2 = 4*3/2 = 6 个组合需要检查
时间复杂度：O(n²)
```

**第二步：双指针的剪枝策略**

假设当前 `left = 0`, `right = 3`，数组为 `[2, 7, 11, 15]`，`target = 9`。

**情况1：`sum < target`（需要增大和）**

```
当前状态：left=0, right=3
当前和：sum = 2 + 15 = 17 > 9（实际是 > target，但先看 < target 的情况）

假设 sum = 2 + 7 = 9 < target = 10（为了演示）：

矩阵中当前检查的位置：
      j=0  1  2  3
i=0   -  [01] 02 03  ← 当前检查 (0,1)
i=1   -  -  12 13
i=2   -  -  -  23

剪枝逻辑：
如果 sum < target，那么：
- 对于固定的 left，所有 numbers[left] + numbers[j]（j < right）都 < target
- 因为数组有序，numbers[j] ≤ numbers[right]（j < right）
- 所以可以剪掉第 left 行的所有剩余组合

因此，可以剪掉第 left 行的剩余部分：
      j=0  1  2  3
i=0   -  [01] ✂️ ✂️  ← 剪掉整行！
i=1   -  -  12 13
i=2   -  -  -  23

移动 left++，跳过第0行的所有剩余组合
```

**情况2：`sum > target`（需要减小和）**

```
当前状态：left=0, right=3
当前和：sum = 2 + 15 = 17 > 9

矩阵中当前检查的位置：
      j=0  1  2  3
i=0   -  01 02 [03]  ← 当前检查 (0,3)
i=1   -  -  12 13
i=2   -  -  -  23

剪枝逻辑：
如果 sum > target，那么：
- 对于固定的 right，所有 numbers[i] + numbers[right]（i > left）都 > target
- 因为数组有序，numbers[i] ≥ numbers[left]（i > left）
- 所以可以剪掉第 right 列的所有剩余组合

因此，可以剪掉第 right 列的剩余部分：
      j=0  1  2  3
i=0   -  01 02 [03]
i=1   -  -  12 ✂️  ← 剪掉整列！
i=2   -  -  -  ✂️  ← 剪掉整列！

移动 right--，跳过第3列的所有剩余组合
```

**第三步：剪枝效果可视化**

每次移动指针，都会剪掉**整行**或**整列**，大大减少搜索空间：

```
数组：[2, 7, 11, 15]，target = 9
初始：需要检查 6 个组合

第1步：left=0, right=3, sum=2+15=17 > 9
       移动 right--，剪掉第3列（2个组合）
       剩余：6 - 2 = 4 个组合

第2步：left=0, right=2, sum=2+11=13 > 9
       移动 right--，剪掉第2列（1个组合）
       剩余：4 - 1 = 3 个组合

第3步：left=0, right=1, sum=2+7=9 = 9
       找到答案！

最终：只需要检查 O(n) 个组合，而不是 O(n²)
```

**数学证明：**

假设当前 `sum = numbers[left] + numbers[right]`：

1. **如果 `sum < target`**：
   - 由于数组有序，`numbers[left]` 是当前左区间的最小值
   - 要增大和，只能让 `left++`（右移左指针）
   - 如果右移右指针，和会变得更小，不符合要求
   - **剪枝效果**：可以剪掉第 `left` 行的所有剩余组合

2. **如果 `sum > target`**：
   - 由于数组有序，`numbers[right]` 是当前右区间的最大值
   - 要减小和，只能让 `right--`（左移右指针）
   - 如果左移左指针，和会变得更大，不符合要求
   - **剪枝效果**：可以剪掉第 `right` 列的所有剩余组合

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

为什么移动较矮的边？这涉及到**剪枝优化**的核心思想。

> 💡 **提示**：想要更直观地理解剪枝过程？[点击这里体验交互式演示](https://frontzhm.github.io/blog-demo/two-pointers-headtail.html)，选择"盛最多水的容器"问题，每一步都能看到被剪掉的组合！

让我们用矩阵可视化来理解：

**第一步：理解暴力枚举的搜索空间**

暴力枚举需要检查所有可能的 `(i, j)` 组合，其中 `i < j`。这形成了一个矩阵：

```
所有可能的组合 (i, j)，其中 i < j：

      j=0  1  2  3  4  5  6  7  8
i=0   -  01 02 03 04 05 06 07 08  ← 第0行
i=1   -  -  12 13 14 15 16 17 18  ← 第1行
i=2   -  -  -  23 24 25 26 27 28  ← 第2行
i=3   -  -  -  -  34 35 36 37 38  ← 第3行
i=4   -  -  -  -  -  45 46 47 48  ← 第4行
i=5   -  -  -  -  -  -  56 57 58  ← 第5行
i=6   -  -  -  -  -  -  -  67 68  ← 第6行
i=7   -  -  -  -  -  -  -  -  78  ← 第7行
i=8   -  -  -  -  -  -  -  -  -   ← 第8行（空）

总共有 N*(N-1)/2 = 9*8/2 = 36 个组合需要检查
时间复杂度：O(n²)
```

**第二步：双指针的剪枝策略**

假设当前 `left = 1`, `right = 3`，高度为 `height[1] = 8`, `height[3] = 2`。

**情况1：`height[left] < height[right]`（当前：`height[1] = 8` > `height[3] = 2`，不满足，但先看这个情况）**

如果 `height[left] < height[right]`，比如 `height[1] = 2`, `height[3] = 8`：

```
当前状态：left=1, right=3
当前面积：S = (3-1) * min(2, 8) = 2 * 2 = 4

矩阵中当前检查的位置：
      j=0  1  2  3  4  5  6  7  8
i=0   -  01 02 03 04 05 06 07 08
i=1   -  -  12 [13] 14 15 16 17 18  ← 当前检查 (1,3)
i=2   -  -  -  23 24 25 26 27 28
i=3   -  -  -  -  34 35 36 37 38
      ...

剪枝逻辑：
如果 height[left] < height[right]，那么：
- 所有 (left, left+1) ... (left, right-1) 的面积都 < (left, right)
- 因为宽度更小，高度受限于 height[left]（或更小）

因此，可以剪掉第 left 行的剩余部分：
      j=0  1  2  3  4  5  6  7  8
i=0   -  01 02 03 04 05 06 07 08
i=1   -  -  12 [13] ✂️ ✂️ ✂️ ✂️ ✂️ ✂️  ← 剪掉整行！
i=2   -  -  -  23 24 25 26 27 28
i=3   -  -  -  -  34 35 36 37 38
      ...

移动 left++，跳过第1行的所有剩余组合
```

**情况2：`height[left] > height[right]`（当前实际：`height[1] = 8` > `height[3] = 2`）**

```
当前状态：left=1, right=3
当前面积：S = (3-1) * min(8, 2) = 2 * 2 = 4

矩阵中当前检查的位置：
      j=0  1  2  3  4  5  6  7  8
i=0   -  01 02 03 04 05 06 07 08
i=1   -  -  12 [13] 14 15 16 17 18  ← 当前检查 (1,3)
i=2   -  -  -  23 24 25 26 27 28
i=3   -  -  -  -  34 35 36 37 38
      ...

剪枝逻辑：
如果 height[left] > height[right]，那么：
- 所有 (left+1, right) ... (right-1, right) 的面积都 < (left, right)
- 因为宽度更小，高度受限于 height[right]（或更小）

因此，可以剪掉第 right 列的剩余部分：
      j=0  1  2  3  4  5  6  7  8
i=0   -  01 02 03 04 05 06 07 08
i=1   -  -  12 [13] 14 15 16 17 18
i=2   -  -  -  ✂️  24 25 26 27 28  ← 剪掉整列！
i=3   -  -  -  ✂️  34 35 36 37 38  ← 剪掉整列！
      ...

移动 right--，跳过第3列的所有剩余组合
```

**第三步：剪枝效果可视化**

每次移动指针，都会剪掉**整行**或**整列**，大大减少搜索空间：

```
初始：需要检查 36 个组合

第1步：left=0, right=8, height[0]=1 < height[8]=7
       移动 left++，剪掉第0行（8个组合）
       剩余：36 - 8 = 28 个组合

第2步：left=1, right=8, height[1]=8 > height[8]=7
       移动 right--，剪掉第8列（7个组合）
       剩余：28 - 7 = 21 个组合

第3步：left=1, right=7, height[1]=8 > height[7]=3
       移动 right--，剪掉第7列（6个组合）
       剩余：21 - 6 = 15 个组合

... 继续剪枝

最终：只需要检查 O(n) 个组合，而不是 O(n²)
```

**数学证明：**

假设当前左右指针指向的高度为 `h[left]` 和 `h[right]`，且 `h[left] < h[right]`：

- 当前面积：`S = (right - left) * h[left]`
- 如果移动右指针（较高的边）：
  - 新宽度：`right - left - 1`（减小）
  - 新高度：`≤ h[left]`（受限于较矮的边）
  - 新面积：`≤ (right - left - 1) * h[left] < S`（一定更小）
  - **剪枝效果**：可以剪掉第 `left` 行的所有剩余组合 `(left, left+1)` 到 `(left, right-1)`
- 如果移动左指针（较矮的边）：
  - 新宽度：`right - left - 1`（减小）
  - 新高度：可能 `> h[left]`（如果新的边更高）
  - 新面积：可能更大
  - **剪枝效果**：可以剪掉第 `right` 列的所有剩余组合 `(left+1, right)` 到 `(right-1, right)`

因此，移动较矮的边是更优的选择，同时能剪掉整行或整列，实现 O(n) 时间复杂度。

> 💡 **提示**：想要更直观地理解剪枝过程？[点击这里体验交互式演示](https://frontzhm.github.io/blog-demo/two-pointers-headtail.html)，选择"盛最多水的容器"问题，每一步都能看到被剪掉的组合！

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

### 2.3 同向指针（滑动窗口，Sliding Window）

**指针位置**：两个指针从**同一端**出发，同向移动

**移动规则**：维护一个"窗口"，根据条件动态调整窗口大小

**适用场景**：连续子数组/子串问题（固定长度或可变长度）

**核心原理**：利用窗口状态的单调性，通过扩窗和缩窗跳过无效区间，将 O(n²) 优化到 O(n)。

> 📖 **详细内容**：滑动窗口有独立的文档 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)，包含完整的原理、模板和例题。本文只介绍核心思想和与相向指针的相似性。

#### 2.3.1 滑动窗口与相向指针的相似性：剪枝优化

**核心相似点**：滑动窗口和相向指针都通过**移动指针来"干掉"某些组合**，实现从 O(n²) 到 O(n) 的优化。

**相向指针的剪枝**（回顾）：

- 移动左指针 → 剪掉第 `left` 行的所有剩余组合
- 移动右指针 → 剪掉第 `right` 列的所有剩余组合

**滑动窗口的剪枝**（同样原理）：

以"无重复字符的最长子串"为例，字符串 `s = "abcabcbb"`：

**第一步：理解暴力枚举的搜索空间**

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

**第二步：滑动窗口的剪枝策略**

假设当前 `left = 0`, `right = 3`，窗口 `[0,3] = "abca"` 包含重复字符 'a'。

**剪枝规则1：如果 `(left, right)` 存在重复字符，则 `(left, right+1...end)` 都存在重复字符**

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
移动 right++，继续探索
```

**第三步：剪枝效果可视化**

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

1. **相向指针**：通过比较两端值，移动指针剪掉整行或整列
2. **滑动窗口**：通过判断窗口状态，移动指针剪掉整行或整列
3. **共同点**：每次移动指针，都会"干掉"某些组合，避免无效计算

**分类**：根据窗口大小是否固定，可分为：

- **固定窗口**：窗口大小固定，两个指针同时移动
- **可变窗口**：窗口大小可变，根据条件动态调整（这才是真正的"滑动窗口"）

> 📖 **详细内容**：滑动窗口的完整原理、模板、例题和更多剪枝规则，请参考 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)

## 三、快速判断：什么时候用哪种双指针？

遇到问题时，按以下决策树快速判断：

```
问题类型判断
│
├─ 是否涉及"环"或"特定位置"（中点、倒数第k个）？
│  └─ ✅ 快慢指针
│     - 环形链表检测
│     - 找链表中间节点
│     - 删除倒数第k个节点
│
├─ 是否涉及"有序数组/字符串"的"两端匹配"？
│  └─ ✅ 左右指针
│     - 两数之和（有序数组）
│     - 回文串判断
│     - 盛水容器（区间最值）
│
└─ 是否涉及"连续子数组/子串"问题？
   └─ ✅ 滑动窗口（同向指针）
      - 固定窗口：窗口大小固定
      - 可变窗口：窗口大小可变
      - 详见 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)
```

**快速记忆口诀**：

- 🔄 **快慢指针**：速度差，找位置（环、中点、倒数k）
- ↔️ **左右指针（相向指针）**：两端向中间，有序数组/回文
- ➡️ **同向指针（滑动窗口）**：同一端出发，同向移动，维护窗口
  - 通过移动指针剪掉整行或整列，实现 O(n²) → O(n) 优化
  - 详见 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)

## 四、双指针的学习技巧（必看）

1. **先记"移动规则"**：不同分类的核心是"指针怎么动"——快慢指针是"速度差"，左右指针是"向中间收缩"，滑动窗口是"同向移动维护窗口"

2. **先刷"模板题"**：每个分类先做2-3道简单题（比如先刷"环形链表"、"两数之和II"），熟练后再做变种

3. **注意"边界条件"**：比如链表的`fast && fast.next`（避免空指针）、数组的`left < right`（避免越界）

4. **多总结"适用场景"**：看到"环形"、"倒数第k"想快慢指针；看到"有序数组"、"回文"想左右指针；看到"连续子数组/子串"想滑动窗口

5. **掌握核心模板**：每个分类都有固定模板，先背模板再刷题，事半功倍

## 五、刷题清单：从基础到进阶

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

**Day 6：滑动窗口（进阶）**

- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)
- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)
- 详见 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)

---

## 前端必刷题目（按难度和面试频次）

以下题目按难度和面试频次分类，建议优先刷高频题目：

### ⭐ 简单-高频（必刷）

**面试出现频率：★★★★★** | **难度：简单**

- [344. 反转字符串](https://leetcode.cn/problems/reverse-string/) - 双指针基础
- [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/) - 相向指针经典题
- [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) - 快慢指针
- [27. 移除元素](https://leetcode.cn/problems/remove-element/) - 快慢指针
- [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/) - 快慢指针找中点
- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/) - 快慢指针环检测

### ⭐⭐ 简单-中频（推荐）

**面试出现频率：★★★☆☆** | **难度：简单**

- [541. 反转字符串 II](https://leetcode.cn/problems/reverse-string-ii/) - 字符串分段处理
- [680. 验证回文串 II](https://leetcode.cn/problems/valid-palindrome-ii/) - 容错验证
- [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) - 快慢指针

### ⭐⭐⭐ 中等-高频（必刷）

**面试出现频率：★★★★★** | **难度：中等**

- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) - 滑动窗口经典题
- [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/) - 相向指针经典题
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/) - 相向指针+贪心
- [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/) - 滑动窗口
- [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/) - 快慢指针进阶

### ⭐⭐⭐⭐ 中等-中频（推荐）

**面试出现频率：★★★☆☆** | **难度：中等**

- [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/) - 字符串处理
- [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/) - 滑动窗口计数
- [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/) - 固定窗口
- [567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/) - 固定窗口

### ⭐⭐⭐⭐⭐ 困难-高频（进阶）

**面试出现频率：★★★★☆** | **难度：困难**

放弃也行，我觉得

- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/) - 相向指针+动态规划（进阶题）

## 六、常见错误和避坑点

### 6.1 快慢指针常见错误

1. **❌ 空指针检查缺失**

   ```typescript
   // 错误：没有检查 fast.next
   while (fast) {
     fast = fast.next.next; // 可能报错：Cannot read property 'next' of null
   }

   // ✅ 正确：检查 fast 和 fast.next
   while (fast && fast.next) {
     fast = fast.next.next;
   }
   ```

2. **❌ 快慢指针初始化错误**

   ```typescript
   // 错误：快慢指针从不同位置开始（某些场景需要，但大多数不需要）
   let fast = head.next;
   let slow = head;

   // ✅ 正确：大多数情况从头节点开始
   let fast = head;
   let slow = head;
   ```

3. **❌ 删除节点时未处理头节点**
   ```typescript
   // 错误：删除倒数第n个节点时，如果删除的是头节点，会出错
   function removeNthFromEnd(head, n) {
     let fast = head,
       slow = head;
     for (let i = 0; i < n; i++) {
       fast = fast.next;
     }
     // 如果 fast 为 null，说明要删除的是头节点，需要特殊处理
     if (!fast) return head.next; // ✅ 必须检查
     // ...
   }
   ```

### 6.2 左右指针常见错误

1. **❌ 循环条件错误**

   ```typescript
   // 错误：使用 <= 可能导致越界或重复计算
   while (left <= right) {
     // 某些场景下，left === right 时不应该继续
   }

   // ✅ 正确：大多数情况使用 <
   while (left < right) {
     // ...
   }
   ```

2. **❌ 指针移动方向错误**

   ```typescript
   // 错误：两数之和问题中，和太大时移动了左指针
   if (sum > target) {
     left++; // ❌ 错误：应该移动右指针
   }

   // ✅ 正确：和太大时移动右指针（减小和）
   if (sum > target) {
     right--; // ✅ 正确
   }
   ```

3. **❌ 边界情况未处理**
   ```typescript
   // 错误：没有处理空数组或单元素数组
   function twoSum(numbers, target) {
     let left = 0,
       right = numbers.length - 1;
     // 如果 numbers.length === 0，right = -1，会出错
     // ✅ 应该先检查边界
     if (numbers.length === 0) return [];
   }
   ```

### 6.3 固定窗口常见错误

1. **❌ 窗口初始化错误**

   ```typescript
   // 错误：没有先计算第一个窗口
   for (let right = 0; right < nums.length; right++) {
     sum += nums[right] - nums[right - k]; // right < k 时会出错
   }

   // ✅ 正确：先计算第一个窗口
   let sum = 0;
   for (let i = 0; i < k; i++) {
     sum += nums[i];
   }
   let max = sum;
   for (let right = k; right < nums.length; right++) {
     sum += nums[right] - nums[right - k];
     max = Math.max(max, sum);
   }
   ```

2. **❌ 窗口大小检查缺失**
   ```typescript
   // 错误：没有检查 k 是否大于数组长度
   function maxSubarraySum(nums, k) {
     // 如果 k > nums.length，应该返回错误或特殊值
     if (k > nums.length) return 0; // ✅ 应该检查
   }
   ```

### 6.4 通用避坑点

1. **边界条件处理**：空数组、单元素、全相同元素、全负数等
2. **索引越界**：确保指针移动后不会越界
3. **初始化值**：根据问题类型选择合适的初始值（0、Infinity、-Infinity等）
4. **循环条件**：仔细考虑 `while` vs `for`，`<` vs `<=`
5. **指针移动时机**：确保在正确的时机移动指针
<!--

## 七、前端应用场景

### 7.1 快慢指针在前端的应用

1. **无限滚动加载**

   ```typescript
   // 检测滚动到底部：快指针（滚动事件）和慢指针（上次检查位置）
   function checkScrollBottom() {
     const scrollTop = window.scrollY; // 快指针
     const lastCheck = lastScrollTop; // 慢指针
     if (scrollTop - lastCheck > threshold) {
       loadMore(); // 加载更多内容
     }
   }
   ```

2. **链表操作**：React/Vue 的虚拟 DOM diff 中，需要找中间节点进行分割

3. **性能监控**：检测函数执行时间，快指针记录当前时间，慢指针记录上次时间

### 7.2 左右指针在前端的应用

1. **搜索功能**

   ```typescript
   // 有序数组的二分搜索（左右指针的变种）
   function binarySearch(arr, target) {
     let left = 0,
       right = arr.length - 1;
     while (left <= right) {
       const mid = Math.floor((left + right) / 2);
       if (arr[mid] === target) return mid;
       if (arr[mid] < target) left = mid + 1;
       else right = mid - 1;
     }
     return -1;
   }
   ```

2. **表单验证**：验证输入是否为回文（用户名、密码等）

3. **UI 布局**：响应式设计中，左右指针可以用于计算容器宽度和元素位置

4. **图片/视频裁剪**：左右指针确定裁剪区域

### 7.3 固定窗口在前端的应用

1. **数据分页**

   ```typescript
   // 固定每页显示 k 条数据，计算第 page 页的数据
   function getPageData(data, page, pageSize) {
     const start = (page - 1) * pageSize;
     const end = start + pageSize;
     return data.slice(start, end);
   }
   ```

2. **轮播图**：固定窗口大小，滑动切换

3. **时间窗口统计**：统计固定时间段内的数据（如最近7天的访问量）

### 7.4 滑动窗口在前端的应用

1. **搜索建议**：用户输入时，滑动窗口检测输入变化，触发搜索

2. **性能优化**：防抖/节流中使用滑动窗口限制函数调用频率

3. **数据流处理**：处理实时数据流，维护一个时间窗口内的数据

4. **无限滚动优化**：滑动窗口管理可见区域内的 DOM 元素

### 7.5 Vue3 diff：四个指针的综合应用（进阶）

Vue3 的虚拟 DOM diff 算法是左右指针的进阶应用，使用四个指针（旧头、旧尾、新头、新尾）同时从两端向中间遍历。

**核心思想：**

使用四个指针（旧头、旧尾、新头、新尾）同时从两端向中间遍历，通过多种比较策略减少比较次数，提升性能。

**为什么需要四个指针？**

传统的双指针只能从一端或两端比较，但 Vue3 的 diff 算法需要：

1. **头头比较**：检查开头是否有相同节点（可能只是顺序变化）
2. **尾尾比较**：检查结尾是否有相同节点（可能只是顺序变化）
3. **头尾交叉比较**：检查是否有节点从开头移到了结尾（或相反）
4. **尾头交叉比较**：检查是否有节点从结尾移到了开头（或相反）

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
      patch(oldList[oldStart], newList[newStart]);
      oldStart++;
      newStart++;
    }
    // 2. 尾尾比较：旧尾和新尾相同
    else if (oldList[oldEnd].key === newList[newEnd].key) {
      patch(oldList[oldEnd], newList[newEnd]);
      oldEnd--;
      newEnd--;
    }
    // 3. 头尾交叉比较：旧头和新尾相同（节点从开头移到了结尾）
    else if (oldList[oldStart].key === newList[newEnd].key) {
      move(oldList[oldStart], newEnd);
      oldStart++;
      newEnd--;
    }
    // 4. 尾头交叉比较：旧尾和新头相同（节点从结尾移到了开头）
    else if (oldList[oldEnd].key === newList[newStart].key) {
      move(oldList[oldEnd], newStart);
      oldEnd--;
      newStart++;
    }
    // 5. 都不匹配：需要查找或新增
    else {
      const index = findIndex(oldList, newList[newStart].key, oldStart, oldEnd);
      if (index !== -1) {
        move(oldList[index], newStart);
        oldList[index] = null;
      } else {
        insert(newList[newStart], newStart);
      }
      newStart++;
    }
  }

  // 处理剩余节点
  if (oldStart > oldEnd) {
    for (let i = newStart; i <= newEnd; i++) {
      insert(newList[i], i);
    }
  } else if (newStart > newEnd) {
    for (let i = oldStart; i <= oldEnd; i++) {
      remove(oldList[i]);
    }
  }
}
```

**性能优势：**

- **减少比较次数**：通过四种比较策略，快速识别相同节点
- **最小化 DOM 操作**：只移动真正需要移动的节点，而不是全部重新渲染
- **时间复杂度优化**：平均情况下比传统 diff 算法更快 -->

## 总结

双指针是**数组/链表问题的"最优解工具"**，掌握这3类分类+对应的模板，90%的双指针题都能解决。核心是理解"指针的移动规则"，然后根据问题特点选择合适的分类。

### 核心要点回顾

1. **快慢指针**：速度差，解决环检测、找中点、找倒数第k个问题
2. **左右指针（相向指针）**：两端向中间，通过移动指针剪掉整行或整列，解决有序数组匹配、回文、区间最值问题
3. **同向指针（滑动窗口）**：同一端出发，同向移动，通过移动指针剪掉整行或整列，解决连续子数组/子串问题（详见 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)）

### 学习路径建议

1. **基础阶段**：先掌握快慢指针和左右指针的3-5道模板题
2. **进阶阶段**：学习滑动窗口（详见 [滑动窗口详解](https://juejin.cn/post/7593731473489690687)）
3. **实战阶段**：结合前端应用场景，解决实际问题
4. **总结阶段**：整理错题，总结避坑点，形成自己的模板库

### 相关资源

- 📖 [滑动窗口详解](https://juejin.cn/post/7593731473489690687) - 双指针的重要应用
- 💻 [LeetCode 双指针专题](https://leetcode.cn/tag/two-pointers/) - 刷题练习
