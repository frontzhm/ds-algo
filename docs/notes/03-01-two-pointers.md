# 双指针（Two Pointers）详解：原理+分类+场景+模板+例题

## 一、双指针是什么？

**核心定义**：用**两个指针（索引）** 遍历数据结构（数组/链表），通过指针的"移动规则"减少遍历次数，将时间复杂度从 O(n²) 优化到 O(n)。

简单说：不用嵌套循环遍历所有可能，而是用两个指针"协作"，一次遍历解决问题。

## 二、双指针的3大分类（必掌握）

双指针的核心是**"指针的移动规则"**，不同规则对应不同场景：

### 2.1 快慢指针（Fast & Slow Pointers）

**指针位置**：两个指针从**同一端（通常是开头）** 出发

**移动规则**：快指针每次走2步，慢指针每次走1步（或其他"速度差"）

**适用场景**：链表/数组的"环形问题"、"找特定位置"

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
    slow = slow.next;      // 慢指针走1步
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

**模板代码：**

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  let fast = head,
    slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }
  return slow; // 慢指针在中间
}
```

**对应例题：** [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

#### 场景3：删除倒数第k个节点

**模板代码：**

```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  let fast = head,
    slow = head;
  // 快指针先跑n步
  for (let i = 0; i < n; i++) {
    fast = fast!.next;
  }
  if (!fast) return head!.next; // 删头节点
  // 快慢指针一起跑，快指针到终点时，慢指针在倒数第n+1个节点
  while (fast.next) {
    fast = fast.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next; // 删除
  return head;
}
```

**对应例题：** [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

### 2.2 左右指针（Left & Right Pointers）

**指针位置**：两个指针从**两端（开头+结尾）** 出发

**移动规则**：根据条件向中间移动（比如"左指针右移"或"右指针左移"）

**适用场景**：有序数组、回文、区间最值

**核心原理**：利用"两端向中间收缩"的方式，缩小搜索范围，避免遍历所有组合。

**经典场景+模板+例题**：

#### 场景1：有序数组两数之和

**模板代码：**

```typescript
function twoSum(numbers: number[], target: number): number[] {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target)
      left++; // 太小，左指针右移
    else right--; // 太大，右指针左移
  }
  return [];
}
```

**对应例题：** [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

#### 场景2：盛最多水的容器

**模板代码：**

```typescript
function maxArea(height: number[]): number {
  let left = 0,
    right = height.length - 1,
    max = 0;
  while (left < right) {
    // 面积 = 宽度 * 较矮的边
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);
    // 移动较矮的边（因为移动高边不会让面积更大）
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}
```

**对应例题：** [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

#### 场景3：验证回文串

**模板代码：**

```typescript
function isPalindrome(s: string): boolean {
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

**对应例题：** [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)

### 2.3 固定窗口指针（Fixed Window Pointers）

**指针位置**：两个指针从**同一端**出发，维护一个"固定大小的窗口"

**移动规则**：左右指针同时移动，保持窗口大小不变

**适用场景**：固定长度的子数组/子串问题

**核心原理**：用窗口覆盖"固定长度的区间"，一次遍历计算所有区间的结果。

**经典场景+模板+例题**：

#### 场景：固定长度子数组的最大和

**模板代码：**

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
    sum += nums[right] - nums[right - k];
    max = Math.max(max, sum);
  }
  return max;
}
```

**对应例题：** [209. 长度最小的子数组（变种）](https://leetcode.cn/problems/minimum-size-subarray-sum/)

### 2.4 Vue3 diff 四个指针（进阶应用）

**适用场景：**

- Vue3 虚拟 DOM 对比算法
- 新旧节点列表的高效比较

**核心思想：**

- 使用四个指针（旧头、旧尾、新头、新尾）同时从两端向中间遍历
- 通过指针移动减少比较次数，提升性能

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
    // 比较逻辑...
    // 1. 比较旧头和新头
    // 2. 比较旧尾和新尾
    // 3. 比较旧头和新尾
    // 4. 比较旧尾和新头
    // 根据比较结果移动指针
  }
}
```

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
