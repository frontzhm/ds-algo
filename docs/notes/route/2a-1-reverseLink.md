# 链表核心算法精讲：反转系列+回文判断（迭代+递归双实现）

在链表算法中，「反转」和「回文判断」是高频基础考点，也是后续解决复杂链表问题（如K个一组反转、区间反转）的核心铺垫。本文将基于力扣经典真题，从「基础反转」到「进阶分组反转」，再到「回文判断最优解」，用 **迭代+递归双实现** 拆解思路，结合代码注释和易错点分析，帮你彻底吃透每一个细节，避免踩坑。

![reverse\_link.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ba2055ba7d9c4e3d8d3d94de9ac9da63~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTA1NjUzMzA5OTQxNDk1In0%3D\&rk3s=e9ecf3d6\&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018\&x-orig-expires=1770893835\&x-orig-sign=fG4rZcSQWXDYEXqRsRt0oC5uBvk%3D)




## 一、前置基础：链表节点结构

所有示例基于单链表，节点结构如下（可直接用于测试）：

```javascript
// 链表节点构造函数
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}
```

**示例**：构造链表 1→2→3→4→5

```javascript
const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));

```

## 二、核心算法一：链表反转（3种场景，双实现）

链表反转的核心逻辑：**改变节点的next指向**，从「往后指」改为「往前指」，需注意保存后续节点（避免断链）。以下分「反转全部节点」「反转前n个节点」「K个一组反转」三种场景，分别实现迭代和递归解法。

### 场景1：反转链表的所有节点（力扣206题）

题目要求：给你单链表的头节点head，请你反转链表，并返回反转后的链表头节点。

#### 解法1：迭代实现（最优解，空间O(1)）

迭代思路：用三个指针（prev、cur、next）遍历链表，逐个修改节点指向。核心三步：**保存next → 反转cur指向 → 移动指针**。结合以下详细示例，可直观看到每一步指针变化，完美对应下方代码逻辑。

**详细示例**：以链表 1→2→3→4→5 为例，逐步演示迭代反转过程（对应上述代码）：

1.  **初始状态**：prev = null，cur = 1（head），链表：1→2→3→4→5

2.  **第1次循环（cur=1）**
    *   `next = cur.next` → next = 2（保存下一节点，避免断链）
    *   `cur.next = prev` → 1→null
    *   `prev = cur, cur = next` → prev=1，cur=2
    *   当前链表：null←1　2→3→4→5

3.  **第2次循环（cur=2）**
    *   next=3；2.next=1；prev=2，cur=3
    *   当前链表：null←1←2　3→4→5

4.  **第3次循环（cur=3）**
    *   next=4；3.next=2；prev=3，cur=4
    *   当前链表：null←1←2←3　4→5

5.  **第4次循环（cur=4）**
    *   next=5；4.next=3；prev=4，cur=5
    *   当前链表：null←1←2←3←4　5

6.  **第5次循环（cur=5）**
    *   next=null；5.next=4；prev=5，cur=null
    *   当前链表：null←1←2←3←4←5（全部反转完成）

7.  **循环终止**：cur = null，返回prev = 5（反转后的新头节点），最终反转结果：5→4→3→2→1。

```javascript
/**
 * 迭代法反转全部节点（最优版）
 * 时间O(n)，空间O(1)
 * @param {ListNode} head 
 * @returns {ListNode} 反转后的新头节点
 */
var reverseList = function(head) {
    // 边界条件：空链表或单节点，无需反转，直接返回
    if(head === null || head.next === null) return head;
    
    let prev = null;  // 前驱节点：反转后的尾节点（初始为null）
    let cur = head;   // 当前节点：从原链表头开始遍历
    
    while(cur) {
        // 步骤1：保存当前节点的下一个节点（关键！避免反转后丢失后续链表）
        const next = cur.next;
        // 步骤2：反转当前节点指向（让cur指向prev，而非next）
        cur.next = prev;
        // 步骤3：移动指针，准备下一次反转
        prev = cur;    // prev后移到当前节点（已完成反转）
        cur = next;    // cur后移到未反转的下一个节点
    }
    
    // 循环结束：cur为null，prev指向原链表最后一个节点（反转后的新头）
    return prev;
};

```

#### 解法2：递归实现（逻辑优雅，空间O(n)）

递归思路：**先递后归**。先递归反转「当前节点的下一个节点开始的链表」，再修改当前节点与下一个节点的指向，实现局部反转。

核心理解：递归的「递」是走到链表末尾（找到反转后的新头），「归」是从末尾往回，逐个修改节点指向。以下示例全程对应下方递归代码，清晰呈现「递」和「归」的每一步操作。

**详细示例**：仍以链表 1→2→3→4→5 为例，演示递归反转的「递」和「归」全过程（对应上述代码）：

1.  **递的过程**（找终止条件，走到链表末尾）
    *   reverseList(1)→reverseList(2)→…→reverseList(5)；
    *   reverseList(5) 时 5.next=null，返回 newHead=5（新头，之后不变）。

2.  **归的过程**（从末尾往回，改指向）
    *   **归1** reverseList(4)：`4.next.next=4` → 5→4，`4.next=null`；链表 4→null，5→4。
    *   **归2** reverseList(3)：4→3，3→null；链表 3→null，4→3，5→4。
    *   **归3** reverseList(2)：3→2，2→null。
    *   **归4** reverseList(1)：2→1，1→null；链表 1→null，2→1，3→2，4→3，5→4。

3.  **最终结果**：返回 newHead=5，反转后的链表为 5→4→3→2→1，与迭代结果一致。

```javascript
/**
 * 递归法反转全部节点
 * 时间O(n)，空间O(n)（递归栈深度=链表长度）
 * @param {ListNode} head 
 * @returns {ListNode} 反转后的新头节点
 */
function reverseList(head) {
    // 终止条件：空链表或单节点，直接返回（反转后的新头就是自身）
    if(head === null || head.next === null) {
        return head;
    }
    
    // 递：反转当前节点的下一个节点开始的链表，得到新头newHead
    let newHead = reverseList(head.next);
    
    // 归：修改当前节点与下一个节点的指向，实现局部反转
    const oldHead = head;
    oldHead.next.next = oldHead;  // 让下一个节点指向当前节点（反转指向）
    oldHead.next = null;          // 让当前节点指向null（避免环）
    
    // 始终返回反转后的新头（递归全程不变，就是原链表最后一个节点）
    return newHead;
}

```

#### 迭代 vs 递归对比

| 维度 | 迭代                            | 递归                       |
| -- | ----------------------------- | ------------------------ |
| 空间 | O(1)                          | O(n) 栈深                  |
| 适用 | 长链表、面试首选                      | 逻辑清晰，注意栈限制（如 JS 约 1e3 层） |
| 共性 | 都是改 `next` 指向，都要先保存 next 避免断链 | 同上                       |

#### 易错点（高频踩坑）

*   漏判边界：空链表 / 单节点要直接返回。
*   反转写反：应是 `cur.next = prev`，不是 `prev.next = next`。
*   返回值：循环结束应返回 `prev`（新头），不是 `cur`（已为 null）。
*   递归成环：归时必须 `oldHead.next = null`，否则形成环。

### 场景2：反转链表的前n个节点

题目要求：给定链表头节点head和整数n，反转从head开始的前n个节点，剩余节点保持不变，返回反转后的新头节点。

示例：1→2→3→4→5，n=2 → 2→1→3→4→5

#### 解法1：迭代实现（空间O(1)）

迭代思路：在「反转全部节点」的基础上，增加「循环n次」的限制，反转n个节点后，将原head（反转后的尾）接回未反转的节点（n+1个节点）。以下示例以题目给出的案例为准，逐步演示每一步操作，对应下方代码，帮你理清「循环n次」和「拼接未反转部分」的核心逻辑。

**详细示例**：以链表 1→2→3→4→5、n=2 为例（对应题目示例），逐步演示迭代反转前2个节点：

1.  **初始状态**：prev = null，cur = 1（head），next = 2，n=2；链表：1→2→3→4→5

2.  **第1次循环（n=2）**：1.next=null，prev=1，cur=2，next=3，n=1；当前：null←1　2→3→4→5

3.  **第2次循环（n=1）**：2.next=1，prev=2，cur=3，next=4，n=0；当前：null←1←2　3→4→5

4.  **循环终止（n=0）**：`head.next = cur` → 1.next=3（尾接回未反转部分）；返回 prev=2。**结果**：2→1→3→4→5。

> **补充**：n=3 时循环 3 次后 prev=3，cur=4，head.next=4，结果 3→2→1→4→5。注意 n 超过链表长度时需在循环中判空（如 `cur` 为 null 则提前结束）。

```javascript
/**
 * 迭代版反转前n个节点
 * @param {ListNode} head - 起始节点
 * @param {number} n - 要反转的节点数
 * @returns {ListNode} 反转后的新头节点
 */
function reverseListN(head, n) {
    // 边界条件：空链表/单节点，或n≤1（无需反转）
    if(head === null || head.next === null || n <= 1) return head;
    
    let prev = null;
    let cur = head;
    
    // 循环n次，只反转前n个节点
    while (n > 0) {
        const next = cur.next; 
        cur.next = prev;  // 反转当前节点指向
        prev = cur;       // prev后移
        cur = next;       // cur后移
        
        n--;  // 剩余反转节点数减1
    }
    
    // 关键：将反转后的尾节点（原head）接回未反转的节点（cur）
    head.next = cur;
    
    // prev指向反转后的新头（原第n个节点）
    return prev;
};

```

#### 解法2：递归实现（只遍历一次，空间O(n)）

递归思路：用全局变量保存「未反转部分的第一个节点（n+1个节点）」，递归到第n个节点后，往回修改指向，同时拼接未反转部分。

核心优势：只遍历一次链表，无需提前找到第n个节点，逻辑更简洁。以下示例仍沿用题目案例，与下方递归代码一一对应，清晰呈现「递」「归」过程中「保存未反转节点」和「拼接」的操作。

**详细示例**：仍以链表 1→2→3→4→5、n=2 为例，演示递归版反转前n个节点（对应上述代码）：

1.  **初始状态**：全局变量 next = null；调用 reverseListN(1, 2)；链表：1→2→3→4→5

2.  **递**：reverseListN(1,2) → reverseListN(2,1)；n≤1 时 next=2.next=3，返回 newHead=2。

3.  **归**：回到 reverseListN(1,2)；`head.next.next=head` → 2→1；`head.next=next` → 1→3；返回 newHead=2。**结果**：2→1→3→4→5。

**核心理解**：递归到第n个节点时，保存未反转的节点（next），归的过程中同时完成「反转指向」和「拼接未反转部分」，无需额外遍历。这一逻辑正好对应下方代码中全局变量next的作用，以及归过程中的两次指向修改。

```javascript
// 全局变量：保存未反转部分的第一个节点（n+1个节点），避免递归中丢失
let next = null;

/**
 * 递归版反转前n个节点（只遍历一次）
 * @param {ListNode} head - 起始节点
 * @param {number} n - 要反转的节点数
 * @returns {ListNode} 反转后的新头节点
 */
function reverseListN(head, n) {
    // 边界条件：空链表/单节点
    if(head === null || head.next === null) {
        return head;
    }
    
    // 终止条件：n≤1（走到第n个节点）
    if(n <= 1) {
        next = head.next;  // 保存未反转部分的第一个节点
        return head;       // 第n个节点就是反转后的新头
    }
    
    // 递：反转head.next开始的前n-1个节点，得到新头
    let newHead = reverseListN(head.next, n - 1);
    
    // 归：修改当前节点与下一个节点的指向，拼接未反转部分
    head.next.next = head;  // 下一个节点指向当前节点（反转）
    head.next = next;       // 当前节点指向未反转部分（拼接）
    
    return newHead;
}

```

### 场景3：K个一组反转链表（力扣25题，进阶）

题目要求：给你链表的头节点head，每k个节点一组进行反转，请你返回修改后的链表。如果链表的节点数不是k的整数倍，那么最后剩余的节点保持原有顺序。

示例：1→2→3→4→5，k=2 → 2→1→4→3→5

#### 核心思路（递归+迭代结合）

结合「反转前n个节点」的迭代实现，用递归处理分组：

1.  找到当前组的末尾节点end（从head开始数k个），不足k个则直接返回原head（不反转）；

2.  保存下一组的起始节点nextStart，避免反转后丢失；

3.  迭代反转当前组（head到end），得到新头newHead；

4.  递归处理下一组，将当前组的尾节点（原head）接上下一组的头；

5.  返回当前组的新头newHead。

**详细示例**：以链表 1→2→3→4→5、k=2 为例（对应题目示例），逐步演示K个一组反转，每一步均对应下方代码逻辑，清晰呈现「分组→反转→递归→拼接」的完整流程：

1.  **第一组 1→2**：end=2，nextStart=3；reverseListN(1,2) → newHead=2（2→1）；递归 reverseKGroup(3,2)。
2.  **第二组 3→4**：end=4，nextStart=5；reverseListN(3,2) → newHead=4（4→3）；递归 reverseKGroup(5,2)。
3.  **第三组 5**：从 5 数 2 个时 end=5.next=null，不足 k 个，直接返回 head=5。
4.  **回溯拼接**：第二组 head=3，head.next=5；第一组 head=1，head.next=4。
5.  **结果**：2→1→4→3→5。

> **补充**：k=3 时前 3 个反转为 3→2→1，后 2 个不足 k 不反转，结果 3→2→1→4→5。对应代码中 `end===null` 时返回原 head。

```javascript
/**
 * K个一组反转链表（力扣25题最优解）
 * 时间O(n)，空间O(n)（递归栈深度=链表长度/k）
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 每组反转的节点数
 * @returns {ListNode} 反转后的链表头节点
 */
var reverseKGroup = function(head, k) {
    // 边界条件：空链表/单节点，直接返回
    if (head === null || head.next === null) return head;

    // 步骤1：找到当前组的末尾节点end（从head开始数k个）
    let end = head;
    for (let i = 1; i <= k - 1; i++) {
        end = end.next;
        // 易错点：不足k个节点，直接返回原head（不反转）
        if (end === null) {
            return head;
        }
    }

    // 步骤2：保存下一组的起始节点（避免反转后丢失）
    const nextStart = end.next;
    // 步骤3：迭代反转当前组（head到end，共k个节点）
    let newHead = reverseListN(head, k);
    // 步骤4：递归处理下一组，拼接当前组和下一组
    head.next = reverseKGroup(nextStart, k);
    // 步骤5：返回当前组的新头（原end节点）
    return newHead;
};

// 复用场景2的「迭代版反转前n个节点」（循环内取 next，避免 n 超长时空指针）
function reverseListN(head, n) {
    if (head === null || head.next === null || n <= 1) return head;
    let prev = null;
    let cur = head;
    while (n > 0 && cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
        n--;
    }
    head.next = cur;
    return prev;
}

```

#### 易错点总结

*   未判空end（不足k个节点时），导致空指针错误；

*   忘记保存nextStart，反转当前组后丢失下一组节点；

*   递归拼接时，错误地将end.next接上下一组，正确拼接的是head.next（原head是当前组的尾）。

## 三、核心算法二：回文链表判断（力扣234题，最优解）

题目要求：给你一个单链表的头节点head，请你判断该链表是否为回文链表。如果是，返回true；否则，返回false。

回文的核心定义：链表从前到后读，和从后到前读，节点值完全一致（如1→2→2→1、1→2→3→2→1）。

### 核心思路（空间O(1)最优解）

结合「找中点」和「链表反转」，避免使用额外空间存储节点值，步骤如下：

1.  找中点：用快慢指针找到链表前半段的最后一个节点，将链表拆分为前半段和后半段；

2.  反转后半段：将后半段链表反转，使其与前半段链表方向一致；

3.  前后对比：同步遍历前半段和反转后的后半段，若所有节点值相等，则是回文；

4.  恢复链表（可选，面试加分）：将反转后的后半段再反转一次，还原原链表结构（体现鲁棒性）。

```javascript
/**
 * 判断单链表是否为回文链表（空间O(1)最优解）
 * 时间O(n)，空间O(1)
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否为回文链表
 */
function isPalindrome(head) {
    // 易错点1：边界条件（空链表/单节点直接是回文）
    if (head === null || head.next === null) return true;

    // 初始化前半段遍历指针：从链表头开始
    // 易错点2：必须用let声明（要后移），不能用const（const不可修改）
    let leftStart = head;
    // 步骤1：找链表「前半段最后一个节点」（关键！为了拆分前后段）
    const leftEnd = findMid(head);
    // 步骤2：记录后半段的原始头节点（反转的起始点）
    const oldRightStart = leftEnd.next;

    // 步骤3：反转后半段链表，得到反转后的后半段头节点
    let rightStart = reverseList(oldRightStart);
    // 保存反转后的后半段头节点（用于后续恢复链表，避免反转后指针丢失）
    // 易错点3：必须提前保存，否则遍历rightStart后会指向null，无法恢复
    const lastNode = rightStart;

    // 初始化结果标记：默认是回文
    let res = true;

    // 步骤4：对比前半段 和 反转后的后半段
    // 循环条件：后半段没遍历完 且 结果还是回文（提前终止，优化性能）
    // 易错点4：循环条件用rightStart（后半段长度≤前半段），不用leftStart（避免越界）
    while (rightStart && res) {
        // 对比当前节点值
        if (rightStart.val !== leftStart.val) {
            res = false; // 有一个值不等，直接标记为非回文
        }
        // 前半段指针后移
        leftStart = leftStart.next;
        // 后半段指针后移
        rightStart = rightStart.next;
    }

    // 步骤5：恢复链表（面试加分项！体现鲁棒性，不破坏原链表结构）
    // 易错点5：必须用保存的lastNode，不能用rightStart（已遍历到null）
    leftEnd.next = reverseList(lastNode);

    // 返回最终结果
    return res;

    /**
     * 辅助函数：找链表「前半段最后一个节点」（慢指针法）
     * @param {ListNode} head - 链表头节点
     * @returns {ListNode} 前半段最后一个节点
     */
    function findMid(head) {
        if (head === null || head.next === null) return head;
        let slow = head; // 慢指针：每次走1步
        let fast = head; // 快指针：每次走2步

        // 易错点6：循环条件（核心！决定slow的最终位置）
        // 错误写法：while(fast && fast.next) → slow会走到后半段第一个节点
        // 正确写法：while(fast.next && fast.next.next) → slow停在前半段最后一个节点
        while (fast.next && fast.next.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    /**
     * 辅助函数：迭代法反转单链表（复用之前的最优版）
     * @param {ListNode} head - 要反转的链表头节点
     * @returns {ListNode} 反转后的新头节点
     */
    function reverseList(head) {
        if (head === null || head.next === null) return head;
        let prev = null;
        let cur = head;
        while (cur) {
            const next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}

```

### 补充：递归版回文判断（易懂但空间O(n)）

思路：利用递归「后序遍历」的特性（从后往前遍历节点），同时用一个指针从前往后遍历，逐一对比前后节点值。

**先说说后序遍历**（链表 1→2→3 时，先递到末尾再在「归」时打印，输出顺序为 3→2→1）：

```js
function traverse(head) {
  if (head === null) return;
  traverse(head.next);
  console.log(head.val);  // 放在递归调用之后 → 归的时候才执行
}
```

| 阶段  | 执行动作                                | 是否「归」 |
| --- | ----------------------------------- | ----- |
| 递 1 | 调用 traverse(1) → 先执行 traverse(2)    | ❌ 递   |
| 递 2 | 调用 traverse(2) → 先执行 traverse(3)    | ❌ 递   |
| 递 3 | 调用 traverse(3) → 先执行 traverse(null) | ❌ 递   |
| 终止  | traverse(null) 触发返回                 | 递的终点  |
| 归 1 | 回到 traverse(3) → 执行 console.log(3)  | ✅ 归   |
| 归 2 | 回到 traverse(2) → 执行 console.log(2)  | ✅ 归   |
| 归 3 | 回到 traverse(1) → 执行 console.log(1)  | ✅ 归   |
| 结束  | traverse(1) 执行完，递归结束                | —     |

基于「归」时从后往前的特性，回文判断代码可以这样写：

```javascript
/**
 * 递归版回文判断（易懂但空间O(n)）
 * 时间O(n)，空间O(n)（递归栈深度=链表长度）
 * @param {ListNode} head 
 * @returns {boolean}
 */
function isPalindrome(head) {
    if(head === null || head.next === null) return true;
    
    let p = head; // 前向指针：从前往后遍历
    let res = true; // 结果标记
    
    // 递归后序遍历：从后往前遍历节点
    function traverse(node) {
        if(node === null) return;
        traverse(node.next); // 递：走到链表末尾
        
        // 归：从后往前对比（node是后向节点，p是前向节点）
        if (p.val !== node.val) {
            res = false;
            return; // 提前终止当前递归层，无法终止整个递归
        }
        p = p.next; // 前向指针后移，准备下一次对比
    }
    
    traverse(head);
    return res;
};

```

### 两种回文判断对比

| 解法        | 空间   | 特点                    |
| --------- | ---- | --------------------- |
| 找中点+反转后半段 | O(1) | 面试首选，需掌握找中点和反转细节      |
| 递归后序对比    | O(n) | 好理解，适合入门；面试可作口述思路     |
| 共性        | —    | 都是「前后对撞对比」，区别在是否用额外空间 |

## 四、总结与刷题建议

### 1. 核心知识点梳理

*   反转系列：核心是「修改节点next指向」，迭代优先（空间优），递归为辅（逻辑优）；

*   回文判断：最优解是「找中点+反转后半段」，兼顾空间和效率，体现算法思维；

*   递归关键：理解「先递后归」，递是找终止条件，归是做具体操作（反转/对比）。

### 2. 易错点汇总（必背）

1.  边界条件：空链表、单节点、n≤1、不足k个节点，需提前判空/终止；

2.  指针操作：反转时先保存next，避免断链；遍历指针用let声明，便于后移；

3.  拼接操作：反转前n个节点、K个一组反转、回文判断，需注意拼接未反转部分；

4.  返回值：反转后返回prev（新头），而非cur或head；回文判断需返回全局结果标记。



