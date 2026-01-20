## 五、刷题清单：从基础到进阶

**快慢指针基础**

### 1. [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

**题目描述：**

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

**提示：**

- 链表中节点的数目范围是 `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- `pos` 为 `-1` 或者链表中的一个有效索引

**代码实现：**

```typescript
/**
 * 判断链表是否有环（快慢指针法）
 * @param head 链表头节点
 * @returns 如果链表有环返回 true，否则返回 false
 */
function hasCycle(head: ListNode | null): boolean {
  // 边界情况：空链表没有环
  if (head === null) return false;

  // 初始化快慢指针，都从头节点开始
  let slow = head;
  let fast = head;

  // 关键：循环条件确保快指针可以安全地移动两步
  // fast && fast.next 确保 fast.next.next 不会报错
  while (fast && fast.next) {
    fast = fast.next.next; // 快指针每次移动2步
    slow = slow.next; // 慢指针每次移动1步

    // 如果快慢指针相遇，说明有环
    if (fast === slow) return true;
  }

  // 快指针到达链表末尾（null），说明没有环
  return false;
}
```

**易错点分析：**

1. **❌ 错误：循环条件不完整**

   ```typescript
   // 错误：只检查 fast，没有检查 fast.next
   while (fast) {
     fast = fast.next.next; // ❌ 如果 fast.next 为 null，这里会报错
   }

   // ✅ 正确：同时检查 fast 和 fast.next
   while (fast && fast.next) {
     fast = fast.next.next; // ✅ 安全
   }
   ```

2. **❌ 错误：快慢指针初始化位置错误**

   ```typescript
   // 错误：快慢指针从不同位置开始（某些特殊场景需要，但本题不需要）
   let slow = head;
   let fast = head.next; // ❌ 可能导致提前相遇或漏判

   // ✅ 正确：都从头节点开始
   let slow = head;
   let fast = head;
   ```

3. **❌ 错误：边界条件处理缺失**

   ```typescript
   // 错误：没有处理空链表的情况
   function hasCycle(head) {
     let slow = head; // ❌ 如果 head 为 null，后续会报错
     // ...
   }

   // ✅ 正确：先检查空链表
   if (head === null) return false;
   ```

4. **✅ 正确理解：为什么快慢指针能检测环？**
   - **无环情况**：快指针会先到达链表末尾（`null`），循环结束，返回 `false`
   - **有环情况**：快慢指针都会进入环内，由于快指针每次比慢指针多走1步，它们之间的距离会逐渐缩小，最终快指针会追上慢指针（相遇），证明有环

**时间复杂度：** O(n)，其中 n 是链表中节点的数量

- 无环：快指针最多遍历 n 个节点
- 有环：快慢指针最多在环内相遇，时间复杂度仍为 O(n)

**空间复杂度：** O(1)，只使用了两个额外的指针

---

### 2. [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

**题目描述：**

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

**提示：**

- 链表的结点数范围是 `[1, 100]`
- `1 <= Node.val <= 100`

**代码实现：**

```typescript
/**
 * 找链表的中间节点（快慢指针法）
 * @param head 链表头节点
 * @returns 返回链表的中间节点，如果有两个中间节点，返回第二个
 */
function middleNode(head: ListNode | null): ListNode | null {
  // 边界情况：空链表返回 null
  if (head === null) return null;

  // 初始化快慢指针，都从头节点开始
  let slow = head;
  let fast = head;

  // 关键：循环条件确保快指针可以安全地移动两步
  // fast && fast.next 确保 fast.next.next 不会报错
  while (fast && fast.next) {
    fast = fast.next.next; // 快指针每次移动2步
    slow = slow.next; // 慢指针每次移动1步
  }

  // 当快指针到达末尾时，慢指针刚好在中间位置
  return slow;
}
```

**易错点分析：**

1. **❌ 错误：循环条件不完整**

   ```typescript
   // 错误：只检查 fast，没有检查 fast.next
   while (fast) {
     fast = fast.next.next; // ❌ 如果 fast.next 为 null，这里会报错
   }

   // ✅ 正确：同时检查 fast 和 fast.next
   while (fast && fast.next) {
     fast = fast.next.next; // ✅ 安全
   }
   ```

2. **❌ 错误：快慢指针初始化位置错误**

   ```typescript
   // 错误：快慢指针从不同位置开始
   let slow = head;
   let fast = head.next; // ❌ 会导致慢指针位置不正确

   // ✅ 正确：都从头节点开始
   let slow = head;
   let fast = head;
   ```

3. **❌ 错误：边界条件处理缺失**

   ```typescript
   // 错误：没有处理空链表的情况
   function middleNode(head) {
     let slow = head; // ❌ 如果 head 为 null，后续会报错
     // ...
   }

   // ✅ 正确：先检查空链表
   if (head === null) return null;
   ```

4. **✅ 正确理解：为什么慢指针在中间？**
   - 假设链表长度为 `n`
   - 快指针移动了 `n` 步（到达末尾）
   - 慢指针移动了 `n/2` 步（刚好在中间）
   - **偶数个节点的情况**：如果有 6 个节点，快指针移动 6 步到末尾，慢指针移动 3 步，指向第 4 个节点（第二个中间节点），符合题目要求

**时间复杂度：** O(n)，其中 n 是链表的节点数，需要遍历链表一次

**空间复杂度：** O(1)，只使用了两个额外的指针

**快慢指针进阶**

### 3. [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

**题目描述：**

给定一个链表的头节点 `head`，返回链表开始入环的第一个节点。如果链表无环，则返回 `null`。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 `pos` 是 `-1`，则在该链表中没有环。注意：`pos` 不作为参数进行传递，仅仅是为了标识链表的实际情况。

**不允许修改** 链表。

**示例 1：**

```

输入：head = [3,2,0,-4], pos = 1 输出：返回索引为 1 的链表节点解释：链表中有一个环，其尾部连接到第二个节点。

```

**示例 2：**

```

输入：head = [1,2], pos = 0 输出：返回索引为 0 的链表节点解释：链表中有一个环，其尾部连接到第一个节点。

```

**示例 3：**

```

输入：head = [1], pos = -1 输出：返回 null 解释：链表中没有环。

```

**提示：**

- 链表中节点的数目范围在范围 `[0, 10^4]` 内
- `-10^5 <= Node.val <= 10^5`
- `pos` 的值为 `-1` 或者链表中的一个有效索引

解决这个问题的核心是快慢指针的两步法，这是找链表环入口的最优解（时间 O (n)，空间 O (1)）：

- 第一步：快慢指针相遇，证明有环慢指针（slow）每次走 1 步，快指针（fast）每次走 2 步；若链表有环，快慢指针必会相遇（快指针绕环追上慢指针）；若无环，快指针会先走到 null。
- 第二步：重置指针找入口相遇后，将其中一个指针（比如 fast）重置到链表头节点；两个指针都改为每次走 1 步，再次相遇的节点就是「入环的第一个节点」（数学推导：相遇时两指针走过的路程差等于环长的整数倍，重置后同速走会在入口相遇）。

```ts
function detectCycle(head: ListNode | null): null | ListNode {
  // 边界条件：空链表/单节点链表，直接返回null（无环）
  if (head === null || head.next === null) return null;

  // 第一步：快慢指针找相遇点（证明有环）
  let slow = head;
  let fast = head;
  // 标记是否有环
  let hasCycle = false;

  // 循环条件：快指针能安全走两步（避免fast.next.next报错）
  while (fast !== null && fast.next !== null) {
    slow = slow.next; // 慢指针走1步
    fast = fast.next.next; // 快指针走2步

    // 快慢指针相遇，说明有环，跳出循环准备找入口
    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  // 无环，直接返回null
  if (!hasCycle) return null;

  // 第二步：重置fast到表头，两指针同速走，相遇点就是环入口
  fast = head; // 重置快指针到表头
  while (slow !== fast) {
    slow = slow.next; // 慢指针继续走1步
    fast = fast.next; // 快指针也走1步
  }

  // 相遇时，返回入口节点（slow/fast均可）
  return slow;
}
```

---

### 4. [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

**题目描述：**

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

**示例 1：**

```

输入：head = [1,2,3,4,5], n = 2输出：[1,2,3,5]

```

**示例 2：**

```

输入：head = [1], n = 1输出：[]

```

**示例 3：**

```

输入：head = [1,2], n = 1输出：[1]

```

**提示：**

- 链表中结点的数目为 `sz`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

```js
/**
 * 删除链表的倒数第 n 个节点（原地修改，返回新链表头节点）
 * @param {ListNode} head - 链表的头节点（题目约束：sz≥1，无空链表）
 * @param {number} n - 要删除的倒数第 n 个节点（题目约束：1≤n≤sz）
 * @returns {ListNode|null} - 删除节点后的新链表头节点
 * 核心思路：快慢指针法（时间O(n)，空间O(1)）
 */
function removeNthFromEnd(head, n) {
  // 初始化快慢指针，均指向头节点
  let fast = head;
  let slow = head;

  // 第一步：快指针提前走 n 步
  for (let i = 1; i <= n; i++) {
    // 【易错点1】删除头节点的特殊处理（逻辑核心，必写）
    // 错误写法：忽略该判断，直接继续循环 → 后续slow会错误指向非前驱节点
    // 原因：n=sz（删除头节点）时，fast走n步后next为null，无后续节点可走
    if (fast.next === null) {
      return head.next; // 直接返回头节点的下一个，完成头节点删除
    }
    fast = fast.next;
    // 【易错点2】循环条件错误
    // 错误写法：i从0开始（i=0;i<n;i++）→ 看似等价，但易混淆步数（面试中易写错）
    // 正确逻辑：i从1到n，明确走满n步，和"倒数第n个"语义对应
  }

  // 第二步：快慢指针同速走，直到快指针到链表最后一个节点
  // 【易错点3】循环条件错误
  // 错误写法：while(fast.next) → 等价，但漏写fast===null的防御（题目约束下无影响，但逻辑不完整）
  // 错误写法：while(fast) → 快指针会走到null，slow多走一步，指向待删除节点而非前驱
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }

  // 第三步：删除slow的下一个节点（待删除节点）
  // 【易错点4】空指针操作（题目约束下可省略，但面试建议保留）
  // 错误写法：无判断直接操作 → 若题目约束失效（如n=0），会触发slow.next.next报错
  if (slow.next) {
    slow.next = slow.next.next;
    // 【易错点5】修改指针错误
    // 错误写法：slow = slow.next.next → 仅修改slow变量，未修改链表结构，删除无效
    // 正确逻辑：修改slow的next指针，跳过待删除节点
  }

  // 返回修改后的头节点
  return head;
}

// 链表节点构造函数（测试用）
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
```

---

**左右指针基础**

### 5. [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

**题目描述：**

给你一个下标从 **1** 开始的整数数组 `numbers`，该数组已按 **非递减顺序排列**，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]`，则 `1 <= index1 < index2 <= numbers.length`。

以长度为 2 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 `index1` 和 `index2`。

你可以假设每个输入 **只对应唯一的答案**，而且你 **不可以** 重复使用相同的元素。

**示例 1：**

```

输入：numbers = [2,7,11,15], target = 9输出：[1,2] 解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。

```

**示例 2：**

```

输入：numbers = [2,3,4], target = 6输出：[1,3] 解释：2 与 4 之和等于目标数 6 。因此 index1 = 1, index2 = 3 。返回 [1, 3] 。

```

**示例 3：**

```

输入：numbers = [-1,0], target = -1输出：[1,2] 解释：-1 与 0 之和等于目标数 -1 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。

```

**提示：**

- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `numbers` 按 **非递减顺序** 排列
- `-1000 <= target <= 1000`
- 仅存在一个有效答案

```js
/**
 * 找出非递减数组中两数之和等于目标值的下标（下标从1开始）
 * @param {number[]} numbers - 按非递减顺序排列的整数数组（题目核心约束）
 * @param {number} target - 两数需要达到的目标和
 * @returns {number[]} - 满足条件的两个下标 [index1, index2]（1 ≤ index1 < index2）
 * 核心算法：双指针法（时间复杂度 O(n)，空间复杂度 O(1)）
 * 算法优势：利用数组有序的特性，无需额外空间，比哈希表法更高效（哈希表空间 O(n)）
 */
function twoSum(numbers, target) {
  // 左指针：初始指向数组第一个元素（最小数，下标0）
  let left = 0;
  // 右指针：初始指向数组最后一个元素（最大数，下标length-1）
  // 【易错点1】❌ 错误写法：right = numbers.length（下标越界，取到undefined）
  let right = numbers.length - 1;

  // 循环条件：左指针 < 右指针（保证两个指针不指向同一个元素，符合index1 < index2的要求）
  // 【易错点2】❌ 错误写法：left <= right（可能重复使用同一个元素，违反题目规则）
  while (left < right) {
    // 计算当前双指针指向元素的和（提取为变量，避免重复计算，提升可读性）
    const currentSum = numbers[left] + numbers[right];

    // 找到唯一解：返回1开始的下标（题目核心要求）
    if (currentSum === target) {
      // 【易错点3】❌ 错误写法：return [left, right]（返回0开始的下标，不符合题目要求）
      return [left + 1, right + 1];
    }
    // 和大于目标值：需要减小和 → 右指针左移（取更小的数）
    else if (currentSum > target) {
      // 【易错点4】❌ 错误写法：left++（和会更大，完全偏离目标）
      right--;
    }
    // 和小于目标值：需要增大和 → 左指针右移（取更大的数）
    else {
      // 【易错点5】❌ 错误写法：right--（和会更小，完全偏离目标）
      left++;
    }
  }

  // 题目明确说明「仅存在一个有效答案」，此处仅为语法兜底（实际不会执行到）
  return [];
}
```

---

### 6. [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)

**题目描述：**

如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 **回文串**。

字母和数字都属于字母数字字符。

给你一个字符串 `s`，如果它是 **回文串**，返回 `true`；否则，返回 `false`。

**示例 1：**

```

输入: s = "A man, a plan, a canal: Panama" 输出：true解释："amanaplanacanalpanama" 是回文串。

```

**示例 2：**

```

输入：s = "race a car" 输出：false 解释："raceacar" 不是回文串。

```

**示例 3：**

```

输入：s = " " 输出：true 解释：s 是一个空字符串 "" 或者只包含空格，所以它是回文串。

```

**提示：**

- `1 <= s.length <= 2 * 10^5`
- `s` 仅由可打印的 ASCII 字符组成

```js
/**
 * 判断字符串是否为回文串（忽略大小写、移除非字母数字字符后）
 * @param {string} s - 输入字符串（仅含可打印ASCII字符）
 * @returns {boolean} - 是否为回文串
 * 核心思路：双指针法（时间O(n)，空间O(1)），无需预处理整个字符串，效率更高
 */
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  // 字母数字字符的正则（正确写法：[]包裹范围）
  const alphanumericReg = /[0-9A-Za-z]/;

  while (left < right) {
    // 【易错点1】内层循环必须加left<right，避免指针越界
    // 移动左指针：跳过非字母数字字符
    while (left < right && !alphanumericReg.test(s[left])) {
      left++;
    }
    // 移动右指针：跳过非字母数字字符
    while (left < right && !alphanumericReg.test(s[right])) {
      right--;
    }

    // 此时left>=right：说明所有有效字符已比对完成
    if (left >= right) break;

    // 【易错点2】统一转小写比较，无需冗余的相等判断
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false; // 有字符不匹配，直接返回false
    }

    // 字符匹配，继续向中间移动指针
    left++;
    right--;
  }

  // 所有有效字符匹配完成，是回文串
  return true;
}
```

---

**左右指针进阶**

### 7. [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

**题目描述：**

给定一个长度为 `n` 的整数数组 `height`。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])`。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：** 你不能倾斜容器。

**示例 1：**

```

输入：[1,8,6,2,5,4,8,3,7] 输出：49解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。

```

**示例 2：**

```

输入：height = [1,1] 输出：1

```

**提示：**

- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

```js
/**
 * 找出能容纳最多水的容器的最大水量（容器由两条垂线和x轴构成，不可倾斜）
 * @param {number[]} height - 长度为n的垂线高度数组，第i条垂线端点为(i,0)和(i,height[i])
 * @returns {number} - 容器可储存的最大水量
 * 核心算法：双指针法（时间复杂度 O(n)，空间复杂度 O(1)）
 * 算法原理：容器盛水量由「短板高度」和「宽度」决定（盛水量=宽度×短板高度），
 *          移动短板指针才有可能找到更大的盛水量（移动长板只会让宽度减小，盛水量必降）
 */
function maxArea(height) {
  // 左指针：初始指向数组最左端（第一条垂线）
  let left = 0;
  // 右指针：初始指向数组最右端（最后一条垂线）
  // 【易错点1】❌ 错误写法：right = height.length（下标越界，无法访问height[right]）
  let right = height.length - 1;
  // 初始化最大盛水量为0（所有height[i]≥0，初始值合理）
  let maxWater = 0;

  // 循环条件：左指针 < 右指针（保证至少有两条垂线构成容器）
  // 【易错点2】❌ 错误写法：left <= right（指针重合时无法构成容器，无意义）
  while (left < right) {
    // 当前左右指针指向的垂线高度
    const leftHeight = height[left];
    const rightHeight = height[right];

    // 容器的「短板高度」：盛水量由短板决定（不可倾斜）
    // 【易错点3】❌ 错误写法：Math.max(leftHeight, rightHeight)（用长板计算，违背物理规则）
    const shortHeight = Math.min(leftHeight, rightHeight);
    // 容器的宽度：左右指针的下标差
    const width = right - left;
    // 当前容器的盛水量：宽度 × 短板高度
    const currentWater = width * shortHeight;

    // 更新最大盛水量：取当前值和历史最大值的较大者
    maxWater = Math.max(maxWater, currentWater);

    // 【核心逻辑】移动短板指针（双指针法的关键，也是最易出错的点）
    // 【易错点4】❌ 错误写法：leftHeight < rightHeight 时移动右指针（移动长板，盛水量必降）
    // leftHeight小的时候，那么含有leftHeight的组合都被放弃了，所以移动left指针
    if (leftHeight < rightHeight) {
      // 左指针是短板 → 移动左指针（可能找到更高的左板，提升盛水量）
      left++;
    } else {
      // 右指针是短板（或两板等高）→ 移动右指针（等高时移动任意一个均可）
      right--;
    }
  }

  // 返回最终找到的最大盛水量
  return maxWater;
}
```

---

### 8. [344. 反转字符串](https://leetcode.cn/problems/reverse-string/)

**题目描述：**

编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 `s` 的形式给出。

不要给另外的数组分配额外的空间，你必须**原地修改输入数组**、使用 O(1) 的额外空间解决这一问题。

**示例 1：**

```

输入：s = ["h","e","l","l","o"] 输出：["o","l","l","e","h"]

```

**示例 2：**

```

输入：s = ["H","a","n","n","a","h"] 输出：["h","a","n","n","a","H"]

```

**提示：**

- `1 <= s.length <= 10^5`
- `s[i]` 都是 ASCII 码表中的可打印字符

```js
/**
 * 原地反转字符数组（必须满足O(1)额外空间，禁止新建数组）
 * @param {character[]} s - 输入的字符数组（如["h","e","l","l","o"]）
 * @returns {character[]} - 反转后的字符数组（原地修改，返回仅为测试便利）
 * 核心算法：双指针交换法（时间复杂度 O(n)，空间复杂度 O(1)）
 * 算法优势：仅遍历数组一半长度，原地交换无额外空间，适配10^5量级的输入
 */
function reverseString(s) {
  // 【可选优化】原代码的长度为1判断属于冗余逻辑（无害但可省略）
  // 原因：length=1时，left=0、right=0，循环条件left<right不成立，循环不会执行
  // if (s.length === 1) return s;

  // 左指针：初始指向数组第一个元素（下标0）
  let left = 0;
  // 右指针：初始指向数组最后一个元素（下标length-1）
  // 【易错点1】❌ 错误写法：right = s.length（下标越界，访问s[right]会报错）
  let right = s.length - 1;

  // 循环条件：左指针 < 右指针（保证交换的是两个不同元素，避免重复交换）
  // 【易错点2】❌ 错误写法：left <= right（指针重合时交换无意义，甚至重复交换）
  while (left < right) {
    // ES6解构赋值：原地交换首尾元素（无额外空间，符合题目核心要求）
    // 【易错点3】❌ 错误写法：const temp = s[left]; s[left] = s[right]; s[right] = temp;
    // （这种写法也正确，但解构赋值更简洁；重点是避免新建数组，如const newArr = s.reverse()）
    [s[left], s[right]] = [s[right], s[left]];

    // 指针向中间移动（核心步骤，避免无限循环）
    // 【易错点4】❌ 错误写法：遗漏该步骤 → 指针永远停在首尾，无限循环
    left++;
    right--;
  }

  // 题目要求「原地修改」，返回值非必需（仅为测试时方便查看结果）
  return s;
}
```

---

**固定窗口**

### 9. [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

**题目描述：**

给定一个含有 `n` 个正整数的数组和一个正整数 `target`，找出该数组中满足其和 ≥ `target` 的长度最小的 **连续子数组** `[numsl, numsl+1, ..., numsr-1, numsr]`，并返回其长度。如果不存在符合条件的子数组，返回 `0`。

**示例 1：**

```

输入：target = 7, nums = [2,3,1,2,4,3] 输出：2解释：子数组 [4,3] 是该条件下的长度最小的子数组。

```

**示例 2：**

```

输入：target = 4, nums = [1,4,4] 输出：1

```

**示例 3：**

```

输入：target = 11, nums = [1,1,1,1,1,1,1,1] 输出：0

```

**提示：**

- `1 <= target <= 10^9`
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`

```js
/**
 * 找出和≥target的长度最小的连续子数组（滑动窗口最优解）
 * @param {number[]} nums - 正整数数组（题目约束：元素均为正整数，这是滑动窗口能成立的关键）
 * @param {number} target - 目标和（正整数）
 * @returns {number} - 满足条件的最小子数组长度；无符合条件的子数组返回0
 * 核心算法：滑动窗口（双指针）法
 * 算法优势：时间复杂度 O(n)（每个元素最多被左右指针各访问一次），空间复杂度 O(1)
 * 对比暴力枚举：暴力法O(n²)，在nums.length=10^5时会超时，滑动窗口是唯一高效解
 */
function minSubArrayLen(target, nums) {
  // 左指针：表示当前滑动窗口的起始下标（窗口左边界）
  let left = 0;
  // curSum：当前滑动窗口内所有元素的和（核心变量，用于判断是否满足条件）
  let curSum = 0;
  // minLen：记录满足条件的最小子数组长度，初始化为Infinity（无穷大）
  // 【易错点1】❌ 错误写法：初始化为0 → 无法区分「无结果」和「长度为0」，必须用Infinity
  let minLen = Infinity;

  // 右指针：表示当前滑动窗口的结束下标（窗口右边界），遍历整个数组扩展窗口
  for (let right = 0; right < nums.length; right++) {
    // 将当前右指针指向的元素加入窗口和，扩展窗口
    curSum += nums[right];

    // 内层while循环：当窗口和≥target时，收缩左指针，寻找最小窗口
    // 【易错点2】❌ 错误写法：加left < right → 会漏掉单元素窗口（如nums=[3], target=3）
    // 正确逻辑：仅判断curSum >= target，兼容所有满足条件的窗口
    while (curSum >= target) {
      // 计算当前满足条件的窗口长度（下标差+1）
      const currentWindowLen = right - left + 1;
      // 更新最小长度：取当前长度和历史最小长度的较小值
      // 【易错点3】❌ 错误写法：写在while循环外 → 收缩后窗口可能不满足条件，长度无效
      // 核心原则：满足条件时立即记录长度，这是找到「最小长度」的关键
      minLen = Math.min(minLen, currentWindowLen);

      // 收缩窗口：将左指针指向的元素移出窗口和，然后左指针右移
      // 【易错点4】❌ 错误写法1：curSum -= left → 减下标而非元素值，和值计算错误
      // 【易错点5】❌ 错误写法2：先left++再curSum -= nums[left] → 漏掉移出当前left的元素
      // 正确顺序：先减元素值，再移动指针
      curSum -= nums[left];
      left++;
    }
  }

  // 最终判断：若minLen仍为Infinity，说明无符合条件的子数组，返回0；否则返回最小长度
  return minLen === Infinity ? 0 : minLen;
}
```

---

### 10. 固定长度子数组的最大和（模板题）

**题目描述：**

给定一个整数数组 `nums` 和一个整数 `k`，找出长度为 `k` 的连续子数组的最大和。

**示例 1：**

```

输入：nums = [1,2,3,4,5], k = 3输出：12解释：子数组 [3,4,5] 的和最大，为 12。

```

**示例 2：**

```

输入：nums = [-1,2,-3,4,-5], k = 2输出：1解释：子数组 [2,-3] 的和为 -1，子数组 [-3,4] 的和为 1，最大和为 1。

```

**提示：**

- `1 <= k <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

```js
/**
 * 找出长度为k的连续子数组的最大和（固定窗口大小的滑动窗口最优解）
 * @param {number[]} nums - 整数数组（包含正负值，题目约束：1≤nums.length≤10^5）
 * @param {number} k - 固定窗口长度（题目约束：1≤k≤nums.length）
 * @returns {number} - 长度为k的连续子数组的最大和
 * 核心算法：固定窗口滑动窗口法
 * 算法优势：时间复杂度 O(n)（仅遍历数组一次），空间复杂度 O(1)
 * 对比暴力枚举：暴力法需嵌套循环计算每个窗口和（O(n*k)），在nums.length=10^5时会超时，滑动窗口是唯一高效解
 */
function maxSubarraySum(nums, k) {
  const len = nums.length; // 缓存数组长度，避免重复计算
  let left = 0; // 左指针：窗口左边界（初始指向第一个元素）
  let curSum = 0; // 当前窗口内元素的和（核心变量）

  // 第一步：计算第一个窗口（前k个元素）的和
  // 循环条件i <= k-1 等价于 i < k，均正确（覆盖下标0到k-1的k个元素）
  // 【易错点1】❌ 错误写法：i < k-1 → 窗口长度不足k，初始和计算错误
  for (let i = left; i <= k - 1; i++) {
    curSum += nums[i]; // 累加前k个元素，得到初始窗口和
  }

  // 初始化最大和为第一个窗口的和（至少有一个窗口，无需初始化为Infinity）
  let maxSum = curSum;

  // 第二步：滑动窗口（右指针从k开始，遍历到数组末尾）
  // 【易错点2】❌ 错误写法：right < len - 1 → 漏掉最后一个元素，无法计算最后一个窗口和
  // 正确逻辑：right需遍历到len-1（数组最后一个元素），确保所有窗口都被计算
  for (let right = k; right < len; right++) {
    // 【核心易错点3】固定窗口滑动的核心规则：先更新和值，再移动左指针
    // ❌ 错误逻辑：先left++ 再 curSum -= nums[left] → 减去的是新左指针的元素，而非移出窗口的元素
    // ✅ 正确逻辑：先减移出窗口的元素（当前left指向的元素），再加移入窗口的元素（right指向的元素）
    curSum = curSum - nums[left] + nums[right];

    left++; // 左指针右移一位，保持窗口长度始终为k（关键：窗口长度固定）

    // 每次滑动后更新最大和：取当前窗口和与历史最大和的较大者
    maxSum = Math.max(maxSum, curSum);
  }

  // 返回最终找到的最大和
  return maxSum;
}
```

---

**滑动窗口（进阶）**

### 11. [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**题目描述：**

给定一个字符串 `s`，请你找出其中不含有重复字符的 **最长子串** 的长度。

**示例 1：**

```

输入: s = "abcabcbb" 输出: 3解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

```

**示例 2：**

```

输入: s = "bbbbb" 输出: 1解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

```

**示例 3：**

```

输入: s = "pwwkew" 输出: 3 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

```

**提示：**

- `0 <= s.length <= 5 * 10^4`
- `s` 由英文字母、数字、符号和空格组成

---

```js
/**
 * 解决LeetCode 3：无重复字符的最长子串（滑动窗口+Map最优解）
 * @param {string} s - 输入字符串（可包含字母、数字、符号、空格，长度0~5*10^4）
 * @returns {number} - 无重复字符的最长子串长度
 * 核心算法：滑动窗口（可变窗口）+ Map存储字符最新下标
 * 算法优势：时间复杂度O(n)（每个字符仅被左右指针各访问一次），空间复杂度O(1)（字符集大小有限，最多128个ASCII字符）
 * 关键思路：保证窗口[left, right]内无重复字符，遇到重复时收缩左指针到重复位置的下一位
 */
function lengthOfLongestSubstring(s) {
  // 缓存字符串长度，避免重复访问s.length（微小性能优化）
  let len = s.length;

  // 边界条件：空字符串直接返回0（【易错点1】容易遗漏，导致后续循环异常）
  if (len === 0) return 0;

  let left = 0; // 滑动窗口左边界：窗口内始终无重复字符
  let maxLen = 0; // 记录最长无重复子串长度，初始化为0（合理，空串已提前处理）
  let map = new Map(); // 核心容器：存储{字符: 该字符最后一次出现的下标}，而非0/1（【易错点2】易误用0/1标记，导致无法精准收缩窗口）

  // 右指针遍历字符串，逐个扩展窗口右边界
  for (let right = 0; right < len; right++) {
    const curVal = s[right]; // 当前遍历到的字符
    const curKey = curVal; // 拆分变量：明确Map的key是当前字符（可读性优化，面试加分项）
    const hasCurKey = map.has(curKey); // 拆分变量：判断当前字符是否在Map中（是否出现过）

    // 如果当前字符已出现过
    if (hasCurKey) {
      const oldExistIndex = map.get(curKey); // 拆分变量：获取该字符最后一次出现的下标
      // 【核心判断】该字符的历史下标 ≥ 左指针 → 说明字符在当前窗口内重复（【易错点3】易漏此判断，把历史窗口的字符误判为重复）
      const isInWindow = oldExistIndex >= left;

      if (isInWindow) {
        // 【核心操作】收缩左指针到重复字符的下一位，彻底排除重复（【易错点4】易写成left++，逐个收缩导致效率降低）
        left = oldExistIndex + 1;
      }
    }

    // 无论当前字符是否重复，都更新其最新下标（【易错点5】易遗漏，导致历史下标未更新，后续判断错误）
    map.set(curKey, right);

    // 计算当前窗口长度，更新最大长度（【易错点6】易仅在"无重复时更新"，漏掉有效窗口）
    // 窗口长度公式：right - left + 1（【易错点7】易漏+1，把下标差直接当长度，导致少算1）
    maxLen = Math.max(maxLen, right - left + 1);
  }

  // 返回最终的最长长度
  return maxLen;
}

// -------------------------- 测试用例验证（可直接运行） --------------------------
console.log(lengthOfLongestSubstring('abcabcbb')); // 输出3（正确）
console.log(lengthOfLongestSubstring('bbbbb')); // 输出1（正确）
console.log(lengthOfLongestSubstring('pwwkew')); // 输出3（正确）
console.log(lengthOfLongestSubstring('b')); // 输出1（正确）
console.log(lengthOfLongestSubstring('')); // 输出0（正确）
```

---

## 刷题建议

1. **按顺序刷题**：建议按照 Day 1 到 Day 6 的顺序，循序渐进
2. **先思考再写代码**：每道题先思考 10-15 分钟，想清楚思路再动手
3. **注意边界条件**：空数组、单元素、边界值等特殊情况
4. **多画图理解**：对于链表和指针问题，画图能帮助理解
5. **总结模板**：每类题目刷完后，总结出通用模板

### ⭐ 简单-高频（必刷）

# 双指针 Leetcode 刷题清单（2023 年 10 月 1 日）

以下是为你补充了**详细题目描述、示例、核心思路**的双指针分级刷题清单（保留你标注的难度/频率），你可以基于这个框架补充题解和易错点，适配自己的刷题节奏：

# 双指针分级刷题清单（附详细题目信息）

## ⭐⭐⭐ 简单-高频（必刷）

**面试出现频率：★★★☆☆** | **难度：简单**

### 1. [541. 反转字符串 II](https://leetcode.cn/problems/reverse-string-ii/)

#### 题目描述

给定一个字符串 `s` 和一个整数 `k`，从字符串开头算起，每计数至 `2k` 个字符，就反转这 `2k` 字符中的前 `k` 个字符。

- 如果剩余字符少于 `k` 个，则将剩余字符全部反转。

- 如果剩余字符在 `k` 到 `2k` 之间，则反转前 `k` 个字符，其余字符保持原样。

```js
function reverse(s) {
  if (s.length === 0) return s;
  let left = 0;
  let right = 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
}
function d(s, k) {
  const len = s.length;

  let left = 0;
  let right = k - 1;
  let side = 2 * k - 1;
  if (right > len - 1) {
    return reverse(s);
  }
  if (side > len - 1) {
    let left = 0;
    let right = 1;
    while (left < right) {
      [s[left], s[right]] = [s[right], s[left]];
      left++;
      right--;
    }
    return s;
  }
  while ((side += 2 * k)) {}
}
```

#### 示例

- 示例 1：

输入：`s = "abcdefg", k = 2`

输出：`"bacdfeg"`

解释：

- 前 2k=4 个字符：`"abcd"` → 反转前 k=2 个 → `"bacd"`；

- 剩余 3 个字符：`"efg"` → 反转前 k=2 个 → `"feg"`；

- 拼接结果：`"bacdfeg"`。

- 示例 2：

输入：`s = "abcd", k = 2`

输出：`"bacd"`

#### 提示

- $1 \le s.length \le 10^4$

- `s` 仅由小写英文字母组成

- $1 \le k \le 10^4$

#### 核心思路

- 按 `2k` 为步长分段遍历字符串；

- 对每一段的前 `k` 个字符用左右指针原地反转；

- 处理剩余字符的边界情况（不足 `k`/`k~2k`）。

### 2. [680. 验证回文串 II](https://leetcode.cn/problems/valid-palindrome-ii/)

#### 题目描述

给你一个非空字符串 `s`，最多可以删除一个字符。判断是否能把它变成回文串。

#### 示例

- 示例 1：

输入：`s = "aba"`

输出：`true`

- 示例 2：

输入：`s = "abca"`

输出：`true`

解释：删除 `'c'` 或 `'b'` 后，字符串变为 `"aba"` 或 `"aca"`，均为回文。

- 示例 3：

输入：`s = "abc"`

输出：`false`

#### 提示

- $1 \le s.length \le 10^5$

- `s` 由小写英文字母组成

#### 核心思路

- 基础左右指针相向遍历，遇到字符不匹配时，分两种情况容错：
  1. 删除左指针字符，检查剩余子串是否为回文；

  2. 删除右指针字符，检查剩余子串是否为回文；

- 只要其中一种情况成立，就返回 `true`。

### 3. [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

#### 题目描述

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

#### 示例

- 示例 1：

输入：`head = [1,2,3,4,5], n = 2`

输出：`[1,2,3,5]`

- 示例 2：

输入：`head = [1], n = 1`

输出：`[]`

- 示例 3：

输入：`head = [1,2], n = 1`

输出：`[1]`

#### 提示

- 链表中结点的数目为 `sz`

- $1 \le sz \le 30$

- $0 \le$ Node.val $\le 100$

- $1 \le n \le sz$

#### 核心思路

- 快慢指针同向移动：快指针先提前走 `n` 步；

- 快慢指针再同速走，快指针到链表末尾时，慢指针指向待删除节点的前驱；

- 特殊处理：若快指针提前走 `n` 步后到末尾，说明删除的是头节点，直接返回 `head.next`。

## ⭐⭐⭐ 中等-高频（必刷）

**面试出现频率：★★★★★** | **难度：中等**

### 1. [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

#### 题目描述

给定一个字符串 `s`，请你找出其中不含有重复字符的 **最长子串** 的长度。

#### 示例

- 示例 1：

输入：`s = "abcabcbb"`

输出：`3`

解释：最长无重复子串是 `"abc"`，长度为 3。

- 示例 2：

输入：`s = "bbbbb"`

输出：`1`

- 示例 3：

输入：`s = "pwwkew"`

输出：`3`

解释：最长无重复子串是 `"wke"`，长度为 3（注意 `"pwke"` 是子序列而非子串）。

#### 提示

- $0 \le s.length \le 5 \times 10^4$

- `s` 由英文字母、数字、符号和空格组成

#### 核心思路

- 可变滑动窗口：右指针扩展窗口，用 `Map` 记录字符最新下标；

- 遇到重复字符且字符在当前窗口内时，左指针收缩到重复字符的下一位；

- 每次扩展窗口后更新最长子串长度。

### 2. [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

#### 题目描述

给你一个下标从 **1** 开始的整数数组 `numbers`，该数组已按 **非递减顺序排列**，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。

如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]`，则 $1 \le index1 < index2 \le numbers.length$ 。

以长度为 2 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标。

#### 示例

- 示例 1：

输入：`numbers = [2,7,11,15], target = 9`

输出：`[1,2]`

- 示例 2：

输入：`numbers = [2,3,4], target = 6`

输出：`[1,3]`

- 示例 3：

输入：`numbers = [-1,0], target = -1`

输出：`[1,2]`

#### 提示

- $2 \le numbers.length \le 3 \times 10^4$

- $-1000 \le numbers[i] \le 1000$

- `numbers` 按 **非递减顺序** 排列

- $-1000 \le target \le 1000$

- 仅存在一个有效答案

#### 核心思路

- 相向双指针：左指针从头部（最小数）、右指针从尾部（最大数）开始；

- 和大于 `target` → 右指针左移（减小和）；和小于 `target` → 左指针右移（增大和）；

- 找到和等于 `target` 时，返回 `[left+1, right+1]`（下标从 1 开始）。

### 3. [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

#### 题目描述

给定一个长度为 `n` 的整数数组 `height`。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])`。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。

**说明：你不能倾斜容器。**

#### 示例

- 示例 1：

输入：`height = [1,8,6,2,5,4,8,3,7]`

输出：`49`

解释：两条垂线为下标 1（8）和下标 8（7），宽度 7，短板高度 7，盛水量 7×7=49。

- 示例 2：

输入：`height = [1,1]`

输出：`1`

#### 提示

- $n == height.length$

- $2 \le n \le 10^5$

- $0 \le height[i] \le 10^4$

#### 核心思路

- 相向双指针：盛水量 = 宽度 × 短板高度；

- 贪心策略：移动短板指针（移动长板只会减小宽度，盛水量必降；移动短板可能找到更高的板，增大盛水量）；

- 每次移动指针后计算盛水量，更新最大值。

### 4. [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

#### 题目描述

给定一个含有 `n` 个正整数的数组和一个正整数 `target`，找出该数组中满足其和 ≥ `target` 的长度最小的 **连续子数组**，并返回其长度。如果不存在符合条件的子数组，返回 `0`。

#### 示例

- 示例 1：

输入：`target = 7, nums = [2,3,1,2,4,3]`

输出：`2`

解释：子数组 `[4,3]` 的和为 7，是长度最小的子数组。

- 示例 2：

输入：`target = 4, nums = [1,4,4]`

输出：`1`

- 示例 3：

输入：`target = 11, nums = [1,1,1,1,1,1,1,1]`

输出：`0`

#### 提示

- $1 \le target \le 10^9$

- $1 \le nums.length \le 10^5$

- $1 \le nums[i] \le 10^4$

#### 核心思路

- 可变滑动窗口：右指针扩展窗口，累加窗口和；

- 当窗口和 ≥ `target` 时，左指针收缩窗口，同时更新最小子数组长度；

- 利用数组元素均为正整数的特性，收缩窗口时和必然减小，无需回头。

### 5. [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

#### 题目描述

给定一个链表的头节点 `head`，返回链表开始入环的第一个节点。如果链表无环，则返回 `null`。

**不允许修改** 链表。

#### 示例

- 示例 1：

输入：`head = [3,2,0,-4], pos = 1`

输出：返回索引为 1 的链表节点

解释：链表中有一个环，其尾部连接到第二个节点。

- 示例 2：

输入：`head = [1,2], pos = 0`

输出：返回索引为 0 的链表节点

- 示例 3：

输入：`head = [1], pos = -1`

输出：`null`

#### 提示

- 链表中节点的数目范围在 `[0, 10^4]` 内

- $-10^5 \le$ Node.val $\le 10^5$

- `pos` 的值为 `-1` 或者链表中的一个有效索引

#### 核心思路

- 快慢指针两步法：
  1. 快指针走 2 步、慢指针走 1 步，相遇则证明有环；

  2. 重置快指针到表头，两指针同速走，再次相遇的节点即为环入口（数学推导：表头到入口的距离 = 相遇点到入口的距离 + n 倍环长）。

## ⭐⭐⭐⭐ 中等-中频（推荐）

**面试出现频率：★★★☆☆** | **难度：中等**

### 1. [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

#### 题目描述

给你一个字符串 `s`，请你反转字符串中 **单词** 的顺序。

- 单词是由非空格字符组成的字符串。`s` 中使用至少一个空格将字符串中的单词分隔开。

- 返回 **单词顺序反转且单词之间用单个空格连接** 的结果字符串。

- 注意：输入字符串 `s` 中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。

#### 示例

- 示例 1：

输入：`s = "the sky is blue"`

输出：`"blue is sky the"`

- 示例 2：

输入：`s = "  hello world  "`

输出：`"world hello"`

- 示例 3：

输入：`s = "a good   example"`

输出：`"example good a"`

#### 提示

- $1 \le s.length \le 10^4$

- `s` 包含英文大小写字母、数字和空格 `' '`

- `s` 中至少存在一个单词

#### 核心思路

- 先去除字符串首尾空格，再用双指针分割单词（跳过中间多空格）；

- 收集所有单词后反转数组，最后用单个空格拼接。

### 2. [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/)

#### 题目描述

给你一个整数数组 `nums` 和一个整数 `k`，请你返回子数组内所有元素的乘积严格小于 `k` 的连续子数组的数目。

#### 示例

- 示例 1：

输入：`nums = [10,5,2,6], k = 100`

输出：`8`

解释：满足条件的子数组有：`[10]、[5]、[2]、[6]、[10,5]、[5,2]、[2,6]、[5,2,6]`。

- 示例 2：

输入：`nums = [1,2,3], k = 0`

输出：`0`

#### 提示

- $1 \le nums.length \le 3 \times 10^4$

- $1 \le nums[i] \le 1000$

- $0 \le k \le 10^6$

#### 核心思路

- 可变滑动窗口：右指针扩展窗口，累乘窗口乘积；

- 当乘积 ≥ `k` 时，左指针收缩窗口（注意数组元素均为正整数，乘积单调递增）；

- 关键技巧：窗口 `[left, right]` 满足条件时，新增的子数组数目为 `right - left + 1`（以 `right` 为结尾的所有子数组）。

### 3. [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

#### 题目描述

给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 **异位词** 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

**异位词** 指由相同字母重排形成的字符串（包括相同的字符串）。

#### 示例

- 示例 1：

输入：`s = "cbaebabacd", p = "abc"`

输出：`[0,6]`

解释：

- 起始索引 0 的子串是 `"cba"`，是 `"abc"` 的异位词；

- 起始索引 6 的子串是 `"bac"`，是 `"abc"` 的异位词。

- 示例 2：

输入：`s = "abab", p = "ab"`

输出：`[0,1,2]`

#### 提示

- $1 \le s.length, p.length \le 3 \times 10^4$

- `s` 和 `p` 仅包含小写字母

#### 核心思路

- 固定滑动窗口：窗口大小等于 `p` 的长度；

- 用数组统计 `p` 的字符频次，遍历 `s` 时维护窗口内字符频次；

- 窗口内频次与 `p` 完全匹配时，记录窗口起始索引。

### 4. [567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/)

#### 题目描述

给你两个字符串 `s1` 和 `s2`，写一个函数来判断 `s2` 是否包含 `s1` 的排列。如果是，返回 `true`；否则，返回 `false`。

换句话说，`s1` 的排列之一是 `s2` 的 **子串** 。

#### 示例

- 示例 1：

输入：`s1 = "ab", s2 = "eidbaooo"`

输出：`true`

解释：`s2` 包含 `s1` 的排列之一 `"ba"`。

- 示例 2：

输入：`s1 = "ab", s2 = "eidboaoo"`

输出：`false`

#### 提示

- $1 \le s1.length, s2.length \le 10^4$

- `s1` 和 `s2` 仅包含小写字母

#### 核心思路

- 固定滑动窗口：窗口大小等于 `s1` 的长度；

- 统计 `s1` 的字符频次，遍历 `s2` 时维护窗口内字符频次；

- 只要有一个窗口的频次与 `s1` 完全匹配，立即返回 `true`。

## ⭐⭐⭐⭐⭐ 困难-高频（进阶）

**面试出现频率：★★★★☆** | **难度：困难**

放弃也行，我觉得

### [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)

#### 题目描述

给定 `n` 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨后能接多少雨水。

#### 示例

- 示例 1：

输入：`height = [0,1,0,2,1,0,1,3,2,1,2,1]`

输出：`6`

解释：上面是由数组 `[0,1,0,2,1,0,1,3,2,1,2,1]` 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分）。

- 示例 2：

输入：`height = [4,2,0,3,2,5]`

输出：`9`

#### 提示

- $n == height.length$

- $1 \le n \le 2 \times 10^4$

- $0 \le height[i] \le 10^5$

#### 核心思路（相向指针版）

- 左右指针从两端向中间移动，维护 `leftMax`（左指针左侧最大高度）和 `rightMax`（右指针右侧最大高度）；

- 雨水的存储量由「较低的最大高度」决定：
  - 若 `leftMax < rightMax`：左指针位置的雨水量 = `leftMax - height[left]`，左指针右移；

  - 否则：右指针位置的雨水量 = `rightMax - height[right]`，右指针左移；

- 累加所有位置的雨水量即为总结果。

### 刷题小贴士

1. 先刷「简单-高频」和「中等-高频」（共 8 题），这部分是面试核心考点，覆盖 80% 的双指针场景；

2. 每道题先自己写思路 → 写代码 → 对照题解修正，重点标注「易错点」（比如指针越界、边界条件）；

3. 滑动窗口题可先记「固定窗口」和「可变窗口」的通用模板，再套具体题目；

4. 困难题（如接雨水）可先理解思路，不用强求一遍写对，重点掌握「相向指针+贪心」的核心逻辑。

你可以按这个清单逐题补充自己的题解和易错点笔记，完成后就是一份专属的双指针刷题笔记啦～

https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/2_pointer.png
