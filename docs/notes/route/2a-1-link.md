# 理解链表算法：从基础操作到高级应用

链表是算法面试中**最高频的考点之一**，其「非连续存储」的特性决定了它的解题思路和数组有本质区别——指针操作、边界处理、虚拟头节点等技巧贯穿始终。本文将从链表的核心解题思想出发，拆解合并、分解、指针技巧、运算四大类经典题型，结合LeetCode高频题给出最优解，并标注面试中最容易踩坑的易错点。

![link_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/link_1.png)

<!-- ```plainText
## **一、通用万能技巧**
- 虚拟头节点 dummy
  - 适用：新建链表、删除头节点、合并、分解
  - 作用：统一边界，不用判空
- 双指针
  - 快慢指针：步长 1 & 2
  - 前后指针：找前驱、删节点
  - 互换指针：链表相交
- 栈 / 最小堆
  - 栈：正序链表 → 逆序运算
  - 堆：合并 K 个有序结构
## **二、合并类（从小到大）**
- 合并两个有序链表 21
  - 双指针拉链 + dummy
  - 易错：忘记拼接剩余部分
- 合并 K 个有序链表 23
  - 最小堆 + 多指针
  - 易错：堆比较写反、漏入下一个节点
- 有序矩阵第 K 小 378
  - 每行看作链表 + 堆
  - 易错：不记录行号，无法继续遍历
- 最小和的 K 对数字 373
  - 二维组合 → 堆贪心
## **三、分解/分割类**
- 按值分割链表 86
  - 两个 dummy：小于x / 大于等于x
  - 易错：最后不断开尾节点 → 成环
- 删除重复元素 II 82
  - 前驱指针 + 跳过重复段
  - 易错：只删一个、不移动前驱
## **四、快慢指针体系（必考）**
- 找中点 876
  - 慢1 快2
  - 偶数返回第二个中点
- 倒数第 K 个节点 19
  - 快先走 K 步，再同步走
  - 易错：不用 dummy 删不掉头节点
- 判断环 141
  - 快慢相遇 = 有环
- 找环入口 142
  - 相遇后慢回头，同步走1步
  - 公式：a = c
- 链表相交 160
  - p1 走 A+B，p2 走 B+A
  - 相遇即交点
## **五、链表运算类**
- 两数相加（逆序）2
  - 直接遍历 + 进位
  - 循环条件：p1||p2||carry
- 两数相加 II（正序）445
  - 栈逆序取数 + 反向构建链表
  - 易错：漏进位、反向链表指向写反
## **六、最易踩坑合集**
- 不写 dummy → 头节点处理崩溃
- 指针不后移 → 只保留最后一个节点
- 不断开 next → 链表成环
- 快慢条件写错 → 空指针异常
- 进位忘记写进循环 → 999+1 出错
``` -->

## 一、核心解题思想：先掌握这3个通用技巧

在开始刷题前，先牢记链表题的「三板斧」，能解决80%的问题：

### 1. 虚拟头节点（Dummy Node）

**适用场景**：需要创建/修改链表（如合并、删除、分解），避免处理「头节点为空」的边界情况。

**核心价值**：让「删除头节点」和「删除中间节点」、「创建新链表头」和「拼接后续节点」的逻辑完全统一。

**示例**：合并两个链表时，用`dummy = new ListNode(-1)`作为占位符，最终返回`dummy.next`即可。

### 2. 双指针技巧

链表的绝大多数经典问题（中点、倒数k、环、相交）都依赖双指针，核心是通过指针的「步长差」或「路径差」实现目标：

- 快慢指针：慢指针走1步，快指针走2步（中点、环检测）；

- 前后指针：前驱指针记录「待删除节点的前一个节点」（删除重复、倒数k）；

- 互换指针：遍历完A链表接B链表，遍历完B链表接A链表（链表相交）。

### 3. 栈/堆的辅助使用

- 栈：解决「正序链表逆序操作」（如445题两数相加II，正序链表转逆序取数）；

- 最小堆（优先队列）：解决「多链表合并」（如合并k个升序链表、有序矩阵找第k小）。

## 二、经典题型拆解（附最优解+易错点）

### （一）链表的合并：从2个到k个，再到矩阵/数组的「伪合并」

合并类问题的核心是「筛选最小值/符合条件的值，按序拼接」，从基础的2个链表合并，可延伸到k个链表、有序矩阵等场景。

#### 1. 合并两个升序链表（LeetCode 21）

**题目要求**：将两个升序链表合并为一个新的升序链表。

**核心思路**：双指针「拉拉链」——两个指针分别遍历两个链表，每次选值更小的节点接入新链表，遍历完一个后直接拼接另一个的剩余部分。

```JavaScript

/**
 * @param {ListNode} l1 - 升序链表1
 * @param {ListNode} l2 - 升序链表2
 * @returns {ListNode} 合并后的升序链表
 */
function mergeTwoLists(l1, l2) {
    // 虚拟头节点：避免处理l1/l2为空的情况
    const dummy = new ListNode(-1);
    let p = dummy; // 新链表的尾指针
    let p1 = l1, p2 = l2;

    // 核心：选更小的节点接入新链表
    while (p1 !== null && p2 !== null) {
        if (p1.val <= p2.val) {
            p.next = p1;
            p1 = p1.next;
        } else {
            p.next = p2;
            p2 = p2.next;
        }
        p = p.next; // 尾指针后移
    }

    // 拼接剩余节点（剩余部分本身有序）
    p.next = p1 === null ? p2 : p1;
    return dummy.next;
}
```

**易错点**：

- 忘记拼接剩余节点，导致结果缺失部分链表；

- 尾指针`p`未后移，始终覆盖`dummy.next`，最终只保留最后一个节点。

#### 2. 合并k个升序链表（LeetCode 23）

**题目要求**：合并k个升序链表，返回合并后的升序链表。

**核心思路**：最小堆筛选最小值——用堆存储各链表的当前节点，每次取堆顶（最小值）接入新链表，再将该链表的下一个节点入堆。

```JavaScript

/**
 * @param {ListNode[]} lists - k个升序链表数组
 * @returns {ListNode} 合并后的链表
 */
var mergeKLists = function(lists) {
    const k = lists.length;
    if (k === 0) return null;

    // 定义最小堆（按节点值排序）
    class MinHeap {
        constructor() {
            this.heap = [];
        }
        push(node) {
            this.heap.push(node);
            this.swim(this.heap.length - 1);
        }
        pop() {
            const min = this.heap[0];
            const last = this.heap.pop();
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.sink(0);
            }
            return min;
        }
        // 上浮：维护小顶堆
        swim(idx) {
            while (idx > 0) {
                const parent = Math.floor((idx - 1) / 2);
                if (this.heap[parent].val > this.heap[idx].val) {
                    [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
                    idx = parent;
                } else break;
            }
        }
        // 下沉：维护小顶堆
        sink(idx) {
            while (idx * 2 + 1 < this.heap.length) {
                let minIdx = idx * 2 + 1;
                const right = idx * 2 + 2;
                if (right < this.heap.length && this.heap[right].val < this.heap[minIdx].val) {
                    minIdx = right;
                }
                if (this.heap[idx].val < this.heap[minIdx].val) break;
                [this.heap[idx], this.heap[minIdx]] = [this.heap[minIdx], this.heap[idx]];
                idx = minIdx;
            }
        }
        isEmpty() {
            return this.heap.length === 0;
        }
    }

    const dummy = new ListNode(-1);
    let p = dummy;
    const minHeap = new MinHeap();

    // 初始化堆：各链表的第一个节点入堆
    for (let i = 0; i < k; i++) {
        if (lists[i] !== null) minHeap.push(lists[i]);
    }

    // 循环取堆顶，拼接链表
    while (!minHeap.isEmpty()) {
        const minNode = minHeap.pop();
        p.next = minNode;
        p = p.next;
        // 该链表的下一个节点入堆
        if (minNode.next !== null) minHeap.push(minNode.next);
    }

    return dummy.next;
};
```

**易错点**：

- 堆的比较逻辑写错（如写成大顶堆），导致取到最大值；

- 忘记将「当前节点的下一个节点」入堆，堆很快为空，只合并了各链表的第一个节点；

- 未处理`lists`中包含`null`的情况，入堆时报错。

#### 3. 延伸：有序矩阵中第K小的元素（LeetCode 378）

**核心思路**：将「矩阵的每一行」视为「升序链表」，复用「合并k个链表」的堆思路——每行一个指针，堆存储「行索引+当前值」，每次取最小值后将该行下一个值入堆。

```js
/**
 * 通用优先队列实现（支持大顶堆/小顶堆，基于完全二叉树+数组存储）
 * @param {Function} compareFn - 比较函数，决定堆类型：
 *                                返回值是负数的时候，第一个参数的优先级更高
 *                               - 小顶堆（默认）：(a,b) => a - b（返回负数则a优先级高）
 *                               - 大顶堆：(a,b) => b - a（返回负数则b优先级高）
 */
class PriorityQueue1 {
  constructor(compareFn = (a, b) => a - b) {
    this.compareFn = compareFn; // 自定义比较函数（核心：替代硬编码比较）
    this.size = 0; // 堆的有效元素个数（≠queue.length，避免数组空洞）
    this.queue = []; // 物理存储数组（逻辑完全二叉树）
  }

  // 入队：添加元素并上浮堆化
  enqueue(val) {
    // 1. 把新元素放到数组末尾（完全二叉树的最后一个节点）
    this.queue[this.size] = val;
    // 2. 上浮：维护堆的性质（从新元素位置向上调整）
    this.swim(this.size);
    // 3. 有效元素个数+1（先swim再++，因为swim需要当前索引）
    this.size++;
  }

  // 出队：移除并返回堆顶元素，最后一个元素补位后下沉堆化
  dequeue() {
    // 边界：空队列返回null
    if (this.size === 0) return null;
    // 1. 保存堆顶元素（要返回的值）
    const peek = this.queue[0];
    // 2. 最后一个元素移到堆顶（完全二叉树补位）
    this.queue[0] = this.queue[this.size - 1];
    // 3. 下沉：维护堆的性质（从堆顶向下调整）
    this.sink(0);
    // 4. 有效元素个数-1（堆大小减小）
    this.size--;
    // 可选：清空数组空洞（非必需，但更优雅）
    this.queue.length = this.size;
    return peek;
  }

  // 获取堆顶元素（不出队）
  head() {
    return this.size === 0 ? null : this.queue[0];
  }

  // 获取父节点索引
  parent(idx) {
    return Math.floor((idx - 1) / 2);
  }

  // 获取左子节点索引
  left(idx) {
    return idx * 2 + 1;
  }

  // 获取右子节点索引
  right(idx) {
    return idx * 2 + 2;
  }

  // 交换两个节点的值
  swap(idx1, idx2) {
    [this.queue[idx1], this.queue[idx2]] = [this.queue[idx2], this.queue[idx1]];
  }

  // 上浮（swim）：从idx向上调整，维护堆性质
  swim(idx) {
    // 循环：直到根节点（idx=0）或当前节点不小于父节点
    while (idx > 0) {
      const parentIdx = this.parent(idx);
      // 核心：用compareFn替代硬编码比较
      // compareFn(a,b) < 0 → a优先级更高（应上浮）
      if (this.compareFn(this.queue[idx], this.queue[parentIdx]) >= 0) {
        break; // 当前节点优先级不高于父节点，停止上浮
      }
      // 交换当前节点和父节点
      this.swap(idx, parentIdx);
      // 继续向上检查
      idx = parentIdx;
    }
  }

  // 下沉（sink）：从idx向下调整，维护堆性质
  sink(idx) {
    // 循环：直到没有左子节点（完全二叉树，左子不存在则右子也不存在）
    while (this.left(idx) < this.size) {
      const leftIdx = this.left(idx);
      const rightIdx = this.right(idx);
      // 找到“优先级更高”的子节点（小顶堆找更小的，大顶堆找更大的）
      let priorityIdx = leftIdx;

      // 右子节点存在，且右子优先级更高 → 切换到右子
      if (rightIdx < this.size && this.compareFn(this.queue[rightIdx], this.queue[leftIdx]) < 0) {
        priorityIdx = rightIdx;
      }

      // 当前节点优先级 ≥ 子节点 → 停止下沉
      if (this.compareFn(this.queue[idx], this.queue[priorityIdx]) <= 0) {
        break;
      }

      // 交换当前节点和优先级更高的子节点
      this.swap(idx, priorityIdx);
      // 继续向下检查
      idx = priorityIdx;
    }
  }

  // 辅助：判断队列是否为空
  isEmpty() {
    return this.size === 0;
  }
}
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
  const rows = matrix.length
  const cols = matrix[0].length
  // 每一行，都有一个指针，pArr[0]表示第0行的指针，pArr[1]表示第1行的指针，
  let pArr = new Array(rows).fill(0)
  // 返回值
  let res
  // 这里因为需要存储第几行的信息，所以queue队列里存储的不单单是val 还有row的信息，这样的话，需要重新写compareFn
  const pq = new PriorityQueue1(([row1,val1],[row2,val2])=>val1-val2)
  // 每行的第一个元素进队
  for(let row=0;row<rows;row++){
    pq.enqueue([row,matrix[row][0]])
  }
  // 当队存在且k>0的时候 说明需要继续
  while(pq.size>0 && k>0){
    // 出队的是当前最小的
    const [curRow,curVal] = pq.dequeue()
    // 值存下
    res = curVal
    // 循环k次就能获取到k小的值
    k--
    const nextCol = pArr[curRow]+1
    if(nextCol<cols){
      pArr[curRow] = nextCol
      pq.enqueue([curRow,matrix[curRow][nextCol]])
    }
  }
  return res

};
```

**易错点**：

- 堆中仅存储值，未记录行索引，无法找到下一个要入堆的值；

- 忽略矩阵单行/单列的边界情况。

### （二）链表的分解：按条件拆分，删除重复

分解类问题的核心是「用两个虚拟头节点分别存储符合/不符合条件的节点，最后拼接」。

#### 1. 分隔链表（LeetCode 86）

**题目要求**：将链表分隔为两部分，小于x的节点在前，大于等于x的节点在后，保持原有相对顺序。

**核心思路**：两个虚拟头节点分别存储「小于x」和「大于等于x」的节点，遍历原链表后拼接。

```JavaScript

var partition = function(head, x) {
    // 两个虚拟头节点：分别存储小于x和大于等于x的节点
    const p1Dummy = new ListNode(-1);
    const p2Dummy = new ListNode(-1);
    let p1 = p1Dummy, p2 = p2Dummy;
    let p = head;

    while (p !== null) {
        if (p.val < x) {
            p1.next = p;
            p1 = p1.next;
        } else {
            p2.next = p;
            p2 = p2.next;
        }
        p = p.next;
    }

    // 关键：断开p2的尾节点，避免链表成环
    p2.next = null;
    // 拼接两个链表
    p1.next = p2Dummy.next;

    return p1Dummy.next;
};
```

**易错点**：

- 未断开`p2.next`，若原链表末尾属于「大于等于x」的部分，会导致链表成环；

- 拼接时错误拼接`p2Dummy`而非`p2Dummy.next`，引入无效的虚拟头节点。

#### 2. 删除排序链表中的重复元素II（LeetCode 82）

**题目要求**：删除链表中所有重复的节点，只保留原链表中没有重复出现的节点。

**核心思路**：前驱指针+跳过重复项——前驱指针记录「最后一个不重复的节点」，遍历指针找到所有连续重复节点后，前驱指针跳过这些节点。

```JavaScript

var deleteDuplicates = function(head) {
    if (head === null) return null;

    const dummy = new ListNode(-1);
    dummy.next = head;
    let prev = dummy; // 前驱指针：最后一个不重复的节点
    let p = head;     // 遍历指针

    while (p) {
        // 找到所有连续重复的节点
        if (p.next && p.val === p.next.val) {
            while (p && p.next && p.val === p.next.val) {
                p = p.next;
            }
            // 跳过所有重复节点
            prev.next = p.next;
            p = p.next;
        } else {
            // 无重复，前驱指针后移
            prev = prev.next;
            p = p.next;
        }
    }

    return dummy.next;
};
```

**易错点**：

- 内层循环未判空`p && p.next`，导致`p.next.val`报错；

- 无重复时忘记移动前驱指针`prev`，`prev`始终停留在虚拟头节点，最终结果缺失部分节点；

- 仅删除重复节点中的一个，而非全部跳过。

### （三）双指针经典：中点、倒数k、环、相交

这类问题的核心是「通过指针的步长/路径设计，一次遍历完成目标」，避免先遍历统计长度的二次遍历。

#### 1. 链表的中间节点（LeetCode 876）

**题目要求**：返回链表的中间节点，偶数长度返回第二个中间节点。

**核心思路**：快慢指针——慢指针走1步，快指针走2步，快指针到末尾时，慢指针即为中间节点。

```JavaScript

var middleNode = function(head) {
    if (head === null) return null;

    let slow = head, fast = head;
    // 循环条件：fast和fast.next都不为空
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
};
```

**易错点**：

- 循环条件漏写`fast`或`fast.next`，导致`fast.next.next`报错；

- 混淆偶数长度的返回值（要求返回第二个中间节点，快慢指针的逻辑天然满足）。

#### 2. 删除链表的倒数第N个节点（LeetCode 19）

**核心思路**：快慢指针拉开N步距离——快指针先前进N步，然后快慢指针同步前进，快指针到末尾时，慢指针指向倒数第N个节点的前驱。

```JavaScript

var removeNthFromEnd = function(head, n) {
    if (head === null) return null;

    const dummy = new ListNode(-1);
    dummy.next = head;
    let slow = dummy, fast = dummy;

    // 快指针先前进n步
    for (let i = 0; i < n; i++) {
        fast = fast.next;
    }

    // 同步前进，快指针到末尾时停止
    while (fast.next) {
        slow = slow.next;
        fast = fast.next;
    }

    // 删除倒数第n个节点
    slow.next = slow.next.next;

    return dummy.next;
};
```

**易错点**：

- 未使用虚拟头节点，删除倒数第L个节点（头节点）时出错；

- 快指针前进n步时未判空，n超过链表长度时报错；

- 循环条件写成`fast !== null`，导致慢指针位置错误。

#### 3. 环形链表II（LeetCode 142）

**题目要求**：判断链表是否有环，若有则返回环的入口节点。

**核心思路**：快慢指针分两步——

1. 判环：慢1快2，相遇则有环；

2. 找入口：相遇后慢指针回头部，快慢均走1步，再次相遇即为入口。

```JavaScript

var detectCycle = function(head) {
    if (head === null || head.next === null) return null;

    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        // 相遇则找入口
        if (slow === fast) {
            slow = head; // 慢指针回头部
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next; // 快指针改为走1步
            }
            return slow;
        }
    }

    return null;
};
```

**原理推导**：

设`a`=表头到入口的距离，`b`=入口到相遇点的距离，`c`=相遇点回到入口的距离：

- 快指针路程：`2(a+b) = a + b + n*(b+c)` → `a = (n-1)*(b+c) + c`；

- 当`n=1`时，`a=c`，因此慢指针回头部后，同步走必然在入口相遇。

**易错点**：

- 相遇后快指针未改为走1步，仍走2步，无法找到入口；

- 判环时循环条件漏写`fast.next`，导致报错；

- 忽略单节点成环的情况（如`head.next = head`）。

#### 4. 相交链表（LeetCode 160）

**题目要求**：找到两个单链表相交的起始节点，无相交则返回null。

**核心思路**：互换指针——p1遍历完A接B，p2遍历完B接A，总路程均为`A+B`，相交则在交点相遇，否则同时到null。

```JavaScript

var getIntersectionNode = function(headA, headB) {
    if (headA === null || headB === null) return null;

    let p1 = headA, p2 = headB;
    while (p1 !== p2) {
        p1 = p1 === null ? headB : p1.next;
        p2 = p2 === null ? headA : p2.next;
    }

    return p1;
};
```

**易错点**：

- 担心无限循环：无需担心，p1/p2总路程相等，最终必相遇（要么交点，要么null）；

- 遍历到末尾时未切换到另一个链表，而是直接返回null。

### （四）链表运算：两数相加（逆序/正序）

链表运算的核心是「模拟手工运算」，结合栈处理正序链表的逆序操作。

#### 1. 两数相加（LeetCode 2）

**题目要求**：两个逆序存储数字的链表，返回相加后的逆序链表。

**核心思路**：模拟手工加法——遍历链表，逐位相加，处理进位。

```JavaScript

var addTwoNumbers = function(l1, l2) {
    if (l1 === null && l2 === null) return null;

    const dummy = new ListNode(-1);
    let p = dummy;
    let p1 = l1, p2 = l2;
    let isNeedPlusOne = false; // 进位标记

    while (p1 || p2 || isNeedPlusOne) {
        let val = isNeedPlusOne ? 1 : 0;
        if (p1) {
            val += p1.val;
            p1 = p1.next;
        }
        if (p2) {
            val += p2.val;
            p2 = p2.next;
        }

        isNeedPlusOne = val >= 10;
        val = val % 10;
        p.next = new ListNode(val);
        p = p.next;
    }

    return dummy.next;
};
```

#### 2. 两数相加II（LeetCode 445）

**题目要求**：两个正序存储数字的链表，返回相加后的正序链表。

**核心思路**：栈逆序取数 + 反向构建链表——先将正序链表入栈，逆序取数相加，再反向构建正序链表。

```JavaScript

var addTwoNumbers = function(l1, l2) {
    if (l1 === null && l2 === null) return null;

    // 正序链表入栈，逆序取数
    const stack1 = [], stack2 = [];
    let p1 = l1, p2 = l2;
    while (p1) { stack1.push(p1.val); p1 = p1.next; }
    while (p2) { stack2.push(p2.val); p2 = p2.next; }

    let head = null;
    let isNeedPlusOne = false;

    // 核心：逆序相加 + 反向构建链表
    while (stack1.length || stack2.length || isNeedPlusOne) {
        let val = isNeedPlusOne ? 1 : 0;
        if (stack1.length) val += stack1.pop();
        if (stack2.length) val += stack2.pop();

        isNeedPlusOne = val >= 10;
        val = val % 10;

        // 反向构建：新节点作为头节点
        const newNode = new ListNode(val);
        newNode.next = head;
        head = newNode;
    }

    return head;
};
```

**易错点**：

- 循环条件漏写`isNeedPlusOne`，漏掉末尾进位（如999+1=1000）；

- 反向构建链表时`next`指向写反（如`head.next = newNode`），导致链表断裂；

- 栈取数用`shift()`而非`pop()`，取数顺序错误。

## 三、面试高频易错点总结（避坑指南）

|场景|常见错误|正确做法|
|---|---|---|
|虚拟头节点|返回`head`而非`dummy.next`|始终返回`dummy.next`，避免头节点被删除/修改|
|链表拼接|未断开尾节点的`next`|拼接前将尾节点`next`置为null，避免成环|
|快慢指针|循环条件漏写`fast.next`|判环/中点时用`while (fast && fast.next)`|
|堆/栈|堆的比较逻辑写错（大顶堆/小顶堆混淆）|小顶堆用`a.val - b.val`，大顶堆用`b.val - a.val`|
|反向构建链表|`next`指向写反|正确逻辑：`newNode.next = head; head = newNode`|
|进位处理|进位判断在取余之后|先判断`val >= 10`，再取余`val % 10`|
## 四、总结

链表题的核心是「指针操作+边界处理」，掌握以下3点即可应对绝大多数面试题：

1. **虚拟头节点**：解决头节点边界问题；

2. **双指针**：快慢/前后/互换指针，一次遍历完成目标；

3. **栈/堆辅助**：处理逆序/多链表合并场景。

刷题时建议按「合并→分解→双指针→运算」的顺序，每道题先想清楚「指针该怎么动」，再动手写代码，同时标注易错点——面试中不仅要写对代码，更要能讲清「为什么这么写」和「避免了哪些坑」。
<!-- 
合并2

两个链表两个指针，谁小，放到新链表那，然后往后迭代，如果遍历完一个的话，其他的直接合并在新链表里

新链表单独一个指针

21题

```js
/**
 * 合并两个升序排列的单链表，返回合并后的升序链表
 * @param {ListNode} l1 - 第一个升序链表的头节点
 * @param {ListNode} l2 - 第二个升序链表的头节点
 * @returns {ListNode} 合并后的升序链表头节点
 */
function mergeTwoLists(l1, l2) {
    // 1. 创建虚拟头节点（哨兵节点），避免处理头节点为空的边界情况
    // 虚拟节点的val无实际意义，仅用于统一链表操作逻辑
    const dummy = new ListNode(-1);
    // 2. 定义指针p，用于构建新链表（始终指向新链表的最后一个节点）
    let p = dummy;
    // 3. 定义两个指针分别指向两个输入链表的当前节点
    let p1 = l1;
    let p2 = l2;

    // 4. 核心循环：同时遍历两个链表，直到其中一个遍历完毕
    // 每次选择当前值更小的节点接入新链表
    while (p1 !== null && p2 !== null) {
        if (p1.val <= p2.val) {
            // 将p1节点接入新链表
            p.next = p1;
            // p1指针后移，指向下一个待比较节点
            p1 = p1.next;
        } else {
            // 将p2节点接入新链表
            p.next = p2;
            // p2指针后移，指向下一个待比较节点
            p2 = p2.next;
        }
        // p指针后移，始终指向新链表的末尾
        p = p.next;
    }

    // 5. 处理剩余节点：其中一个链表遍历完后，直接拼接另一个链表的剩余部分
    // 剩余部分本身已是升序，无需再比较
    p.next = p1 === null ? p2 : p1;

    // 6. 返回虚拟头节点的下一个节点（合并后链表的真实头节点）
    return dummy.next;
}

```
这个算法的逻辑类似于拉拉链，l1, l2 类似于拉链两侧的锯齿，指针 p 就好像拉链的拉索，将两个有序链表合并
代码中还用到一个链表的算法题中是很常见的「虚拟头结点」技巧，也就是 dummy 节点。你可以试试，如果不使用 dummy 虚拟节点，代码会复杂一些，需要额外处理指针 p 为空的情况。而有了 dummy 节点这个占位符，可以避免处理空指针的情况，降低代码的复杂性。

何时使用虚拟头结点
经常有读者问我，什么时候需要用虚拟头结点？我这里总结下：**当你需要创造一条新链表的时候，可以使用虚拟头结点简化边界情况的处理。**

比如说，让你把两条有序链表合并成一条新的有序链表，是不是要创造一条新链表？再比你想把一条链表分解成两条链表，是不是也在创造新链表？这些情况都可以使用虚拟头结点简化边界情况的处理。

## 分解

86题
三个指针  一个是原链表 两个是新链表 虚拟节点  小的一个链表 大的一个链表 遍历完之后 合并即可

```js
var partition = function(head, x) {
  // 1. 创建两个虚拟头节点，分别存储≤x的节点（p1Dummy）和>x的节点（p2Dummy）
  // 虚拟节点避免处理头节点为空的边界情况
  const p1Dummy = new ListNode(-1); // 存储≤x的节点的虚拟头
  const p2Dummy = new ListNode(-1); // 存储>x的节点的虚拟头

  // 2. 定义两个指针，用于构建两个分区链表（始终指向各自链表的尾节点）
  let p1 = p1Dummy; // 指向≤x链表的尾节点
  let p2 = p2Dummy; // 指向>x链表的尾节点
  let p = head;     // 遍历原始链表的指针

  // 3. 遍历原始链表，按值分区
  while (p !== null) {
      if (p.val < x) { // 注意：题目要求是“小于x在前”，原代码写的≤也可，需和需求匹配
          p1.next = p; // 将当前节点接入≤x的链表
          p1 = p1.next; // p1指针后移，保持指向尾节点
      } else {
          p2.next = p; // 将当前节点接入>x的链表
          p2 = p2.next; // p2指针后移，保持指向尾节点
      }
      p = p.next; // 遍历指针后移
  }

  // 4. 关键修复1：断开p2尾节点的后续引用，避免链表成环/多余节点
  p2.next = null;
  // 5. 关键修复2：将>x的链表拼接到≤x链表的尾部
  p1.next = p2Dummy.next;

  // 6. 返回≤x链表的真实头节点（虚拟头的下一个节点）
  return p1Dummy.next;
};
```
如果我们需要把原链表的节点接到新链表上，而不是 new 新节点来组成新链表的话，那么断开节点和原链表之间的链接可能是必要的。那其实我们可以养成一个好习惯，但凡遇到这种情况，就把原链表的节点断开，这样就不会出错了。

## 合并k

优先队列  最小堆

```js
/**
 * 合并K个升序链表，返回合并后的升序链表
 * 核心思路：利用最小堆筛选各链表当前节点的最小值，时间复杂度 O(NlogK)（N为总节点数，K为链表数）
 * @param {ListNode[]} lists - K个升序链表的头节点数组（可能包含null）
 * @returns {ListNode} 合并后的升序链表头节点
 */
var mergeKLists = function(lists) {
    // 1. 定义链表节点类（确保代码独立运行，若环境已定义可省略）
    class ListNode {
        constructor(val, next = null) {
            this.val = val;
            this.next = next;
        }
    }

    // 2. 定义最小堆节点类（存储链表索引+节点值，用于堆排序）
    class HeapNode {
        constructor(listIndex, val) {
            this.listIndex = listIndex; // 所属链表的索引
            this.val = val; // 节点值（用于堆排序）
        }
    }

    // 3. 最小堆类（针对HeapNode按val排序）
    class MinHeap {
        constructor(capacity) {
            this.capacity = capacity; // 堆容量（最多存储K个元素）
            this.size = 0; // 堆当前元素个数
            this.heap = []; // 存储堆元素的数组
        }

        // 向堆中添加元素（HeapNode）
        push(heapNode) {
            if (this.size >= this.capacity) return; // 防止超容量
            this.heap[this.size] = heapNode;
            this.swim(this.size); // 上浮调整堆结构
            this.size++;
        }

        // 弹出堆顶（最小值节点）
        pop() {
            if (this.size === 0) return null; // 堆空返回null
            const min = this.heap[0];
            this.heap[0] = this.heap[this.size - 1]; // 最后一个元素移到堆顶
            this.sink(0); // 下沉调整堆结构
            this.size--;
            return min;
        }

        // 查看堆顶元素（不弹出）
        peek() {
            return this.size > 0 ? this.heap[0] : null;
        }

        // 获取父节点索引
        parent(nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        }

        // 获取左子节点索引
        left(nodeIndex) {
            return nodeIndex * 2 + 1;
        }

        // 获取右子节点索引
        right(nodeIndex) {
            return nodeIndex * 2 + 2;
        }

        // 交换堆中两个元素
        swap(index1, index2) {
            [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
        }

        // 上浮：按HeapNode.val从小到大排序
        swim(nodeIndex) {
            while (nodeIndex !== 0 && this.heap[this.parent(nodeIndex)].val > this.heap[nodeIndex].val) {
                this.swap(nodeIndex, this.parent(nodeIndex));
                nodeIndex = this.parent(nodeIndex);
            }
        }

        // 下沉：按HeapNode.val从小到大排序
        sink(nodeIndex) {
            while (this.left(nodeIndex) < this.size) {
                let minIdx = this.left(nodeIndex); // 先假设左子节点更小
                const rightIdx = this.right(nodeIndex);
                // 右子节点存在且值更小，更新最小值索引
                if (rightIdx < this.size && this.heap[minIdx].val > this.heap[rightIdx].val) {
                    minIdx = rightIdx;
                }
                // 当前节点值更小，无需调整
                if (this.heap[nodeIndex].val < this.heap[minIdx].val) {
                    break;
                }
                // 交换当前节点和最小子节点
                this.swap(nodeIndex, minIdx);
                nodeIndex = minIdx; // 继续下沉检查
            }
        }
    }

    // 4. 核心合并逻辑
    const k = lists.length;
    if (k === 0) return null; // 空数组直接返回null

    const dummy = new ListNode(-1); // 虚拟头节点，简化链表拼接
    let p = dummy; // 指向合并后链表的尾节点
    const pArr = [...lists]; // 各链表的当前遍历指针数组
    const minHeap = new MinHeap(k); // 初始化最小堆（容量为链表数K）

    // 5. 初始化堆：将每个非空链表的第一个节点加入堆
    for (let i = 0; i < k; i++) {
        if (pArr[i] !== null) {
            minHeap.push(new HeapNode(i, pArr[i].val));
        }
    }

    // 6. 循环取堆顶（最小值），拼接链表  注意循环条件！
    while (minHeap.size > 0) {
        const minNode = minHeap.pop(); // 取出堆顶（当前所有链表的最小值节点）
        const listIdx = minNode.listIndex; // 最小值节点所属链表索引

        // 将该节点拼接到合并链表
        p.next = pArr[listIdx];
        p = p.next;

        // 该链表的指针后移，若有下一个节点则加入堆
        pArr[listIdx] = pArr[listIdx].next;
        // 注意入堆！！
        if (pArr[listIdx] !== null) {
            minHeap.push(new HeapNode(listIdx, pArr[listIdx].val));
        }
    }

    // 7. 返回合并后链表的真实头节点
    return dummy.next;
};

```

## 倒数k

快慢指针两个指针 k

```js
/**
 * 删除链表的倒数第 N 个结点
 * 核心思路：快慢指针（一次遍历完成，最优解）
 * 时间复杂度：O(L)（L为链表长度），空间复杂度：O(1)（仅用常量级额外空间）
 * @param {ListNode} head - 链表头节点（可能为null）
 * @param {number} n - 要删除的倒数第n个节点（题目保证n有效，1≤n≤链表长度）
 * @returns {ListNode} 删除后的链表头节点
 */
var removeNthFromEnd = function(head, n) {
  // ========== 边界处理：空链表直接返回 ==========
  // 易错点1：忽略空链表输入，后续指针操作会报错（如fast.next）
  if (head === null) return null;

  // ========== 关键技巧：虚拟头节点（解决删除头节点的边界问题） ==========
  // 作用：让「删除头节点」和「删除中间节点」的逻辑完全统一，无需单独判断
  // 易错点2：未使用虚拟头节点，删除头节点（倒数第L个）时会失效
  const dummy = new ListNode(-1);
  dummy.next = head; // 虚拟头节点指向原链表头

  // ========== 初始化快慢指针（均从虚拟头开始） ==========
  let slow = dummy; // 慢指针：最终停在「倒数第n个节点的前驱节点」
  let fast = dummy; // 快指针：先前进n步，和慢指针拉开n个节点的距离

  // ========== 第一步：快指针先前进n步 ==========
  for (let i = 1; i <= n; i++) {
      // 防御性判断：题目保证n有效，此判断可省略，但增强鲁棒性
      if (fast === null) {
          return head; // n超过链表长度，直接返回原链表
      }
      fast = fast.next; // 快指针后移，累计移动n步
  }

  // ========== 第二步：快慢指针同步前进，直到快指针到链表末尾 ==========
  // 循环条件：fast.next !== null → 快指针停在最后一个节点时终止
  // 易错点3：错误用while(fast && fast.next)，逻辑等价但冗余；若漏写.next会导致慢指针位置错误
  while (fast.next) {
      slow = slow.next; // 慢指针后移
      fast = fast.next; // 快指针后移
  }

  // ========== 第三步：删除倒数第n个节点 ==========
  const nodeToDel = slow.next; // 此时slow的下一个节点就是倒数第n个节点
  slow.next = nodeToDel.next; // 跳过待删除节点，完成删除（核心操作）

  // 可选：释放待删除节点的引用（非必需，但符合内存管理规范）
  // 易错点4：未判空直接操作nodeToDel.next，若nodeToDel为null会报错（题目保证n有效，此情况不会出现）
  if (nodeToDel) {
      nodeToDel.next = null;
  }

  // ========== 返回结果 ==========
  // 易错点5：返回head而非dummy.next → 删除头节点时会返回原head（错误）
  return dummy.next;
};
```
不过注意我们又使用了虚拟头结点的技巧，也是为了防止出现空指针的情况，比如说链表总共有 5 个节点，题目就让你删除倒数第 5 个节点，也就是第一个节点，那按照算法逻辑，应该首先找到倒数第 6 个节点。但第一个节点前面已经没有节点了，这就会出错。

但有了我们虚拟节点 dummy 的存在，就避免了这个问题，能够对这种情况进行正确的删除。

## 中点
快慢指针走一步 走两步

```js
/**
 * 寻找链表的中间节点（LeetCode 876题最优解）
 * 核心思路：快慢指针（一次遍历完成，时间/空间复杂度最优）
 * 时间复杂度：O(L)（L为链表长度），空间复杂度：O(1)（仅用常量级额外空间）
 * 规则：若链表长度为偶数，返回第二个中间节点（如1→2→3→4，返回3）；奇数返回中间节点（如1→2→3，返回2）
 * @param {ListNode} head - 链表头节点（可能为null）
 * @returns {ListNode} 链表的中间节点
 */
var middleNode = function(head) {
    // ========== 边界处理：空链表直接返回null ==========
    // 易错点1：忽略空链表输入，后续执行fast.next会报错
    if (head === null) return null;

    // ========== 初始化快慢指针（均从链表头开始） ==========
    let slow = head; // 慢指针：每次走1步，最终停在中间节点
    let fast = head; // 快指针：每次走2步，用于判断链表是否遍历到末尾

    // ========== 核心循环：快慢指针同步前进 ==========
    // 循环条件：fast !== null && fast.next !== null
    // 易错点2：循环条件错误（如漏写fast || 漏写fast.next），导致指针越界/结果错误
    // - 漏写fast：fast为null时执行fast.next会报错
    // - 漏写fast.next：fast.next为null时执行fast.next.next会报错
    while (fast && fast.next) {
        slow = slow.next;       // 慢指针走1步
        fast = fast.next.next;  // 快指针走2步
    }

    // ========== 返回结果：慢指针即为中间节点 ==========
    // 逻辑推导：
    // - 链表长度奇数（如5个节点）：fast走到最后一个节点（fast.next=null），循环终止，slow走2步到第3个节点（中间）
    // - 链表长度偶数（如4个节点）：fast走到null，循环终止，slow走2步到第3个节点（第二个中间节点）
    return slow;
};
```
偶数的话 第二个中间节点
稍微修改就能处理环

## 环
快慢指针 一步 两步 相等

```js
/**
 * 判断链表是否有环（LeetCode 141题最优解）
 * 核心思路：快慢指针追及法（龟兔赛跑算法）
 * 原理：若链表有环，快指针（兔子）最终会追上慢指针（乌龟）；若无环，快指针会先走到链表末尾（null）
 * 时间复杂度：O(L)（L为链表长度，最多遍历一次），空间复杂度：O(1)（仅用常量级额外空间）
 * @param {ListNode} head - 链表头节点（可能为null）
 * @returns {boolean} 有环返回true，无环返回false
 */
var hasCycle = function(head) {
    // ========== 边界处理：空链表/单节点链表直接返回false ==========
    // 易错点1：仅判断head===null，忽略head.next===null的情况（单节点无环）
    // 补充：单节点链表即使自己指向自己（环），后续循环也能检测到，此处仅处理无环的单节点
    if (head === null || head.next === null) return false;

    // ========== 初始化快慢指针（均从链表头开始） ==========
    let slow = head;  // 慢指针（乌龟）：每次走1步
    let fast = head;  // 快指针（兔子）：每次走2步

    // ========== 核心循环：快慢指针同步前进，检测是否追及 ==========
    // 循环条件：fast !== null && fast.next !== null
    // 易错点2：循环条件错误（如漏写fast || 漏写fast.next）
    // - 漏写fast：fast为null时执行fast.next会报错
    // - 漏写fast.next：fast.next为null时执行fast.next.next会报错
    // 循环终止条件：无环时fast走到链表末尾（fast/fast.next为null）
    while (fast && fast.next) {
        slow = slow.next;        // 慢指针走1步
        fast = fast.next.next;   // 快指针走2步

        // 核心判断：快慢指针相遇 → 链表有环
        // 易错点3：将相遇判断写在循环外 → 无法检测到环（快指针已走出链表）
        if (slow === fast) {
            return true;
        }
    }

    // ========== 返回结果：循环终止说明无环 ==========
    // 逻辑推导：若有环，快慢指针一定会在循环内相遇并返回true；能走到这里说明快指针已到链表末尾，无环
    return false;
};

```

起点  slow指向起点  快慢一起向前 当再次相遇的时候 就是环起点

相交，交点，相遇的时候 slow重置到链表头部，然后和fast同步走 再次相遇的时候 就是起点
```js
/**
 * 寻找链表环的入口节点（LeetCode 142题最优解）
 * 核心思路：快慢指针（龟兔赛跑算法）分两步：
 * 1. 判环：慢1快2，相遇则有环；
 * 2. 找入口：相遇后慢指针回头部，快慢均走1步，再次相遇即为入口。
 * 时间复杂度：O(L)（L为链表长度），空间复杂度：O(1)
 * @param {ListNode} head - 链表头节点（可能为null）
 * @returns {ListNode|null} 有环返回环的入口节点，无环返回null
 */
var detectCycle = function(head) {
  // ========== 边界处理：空链表/单节点无环链表直接返回null ==========
  // 易错点1：原代码返回null（正确），但注释写返回false，逻辑混淆
  // 补充：单节点有环（自己指向自己）后续循环能检测到，此处仅处理无环的空/单节点
  if (head === null || head.next === null) return null;

  // ========== 初始化快慢指针（均从链表头开始） ==========
  let slow = head;  // 慢指针（乌龟）：初始走1步，相遇后走1步
  let fast = head;  // 快指针（兔子）：初始走2步，相遇后走1步

  // ========== 第一步：快慢指针相遇，证明有环 ==========
  // 循环条件：fast !== null && fast.next !== null（避免指针越界）
  // 易错点2：原代码把找入口的逻辑写在第一次循环内，导致逻辑混乱
  while (fast && fast.next) {
      slow = slow.next;        // 慢指针走1步
      fast = fast.next.next;   // 快指针走2步

      // 快慢指针相遇 → 有环，开始找入口
      if (slow === fast) {
          // ========== 第二步：找环的入口 ==========
          slow = head; // 慢指针重置到链表头
          // 易错点3：原代码未将fast的步长改为1步（关键！）
          // 核心：快慢指针均走1步，再次相遇即为入口
          while (slow !== fast) {
              slow = slow.next; // 慢指针走1步
              fast = fast.next; // 快指针从相遇点开始走1步
          }
          return slow; // 返回环的入口节点
      }
  }

  // ========== 无环情况：快指针走到链表末尾，返回null ==========
  return null;
};

```
记住 2 个关键：
快慢指针相遇时，快指针走的距离是慢指针的 2 倍；
推导得出「表头到入口的距离 = 相遇点到入口的距离 + 环的整数倍」；
a：链表头到环入口的距离
b：环入口到快慢指针相遇点的距离
c：相遇点绕环回到入口的距离
L：环的总长度，L = b + c
n：快指针在相遇前绕环的圈数（n ≥ 1，至少绕一圈才能追上慢指针）

因为快指针的路程有两种等价的表示方式，所以：
2(a+b)=a+b+n⋅L
a+b=n⋅L
a+b=n(b+c)
a+b=(n-1)(b+c) +b +c
a = (n-1)(b+c) +c
a = (n-1)L +c
n等于1的时候 a = c 
所以重置慢指针后，两者同步走，必然在入口相遇。


## 两个链表是否相交

l1 l2 分别遍历 遍历到最后一个节点的时候 逻辑上接上另一个链表 也就是遍历另一个链表

```js
/**
 * 找两个链表的相交节点（LeetCode 160题最优解）
 * 核心思路：双指针"互换链表"法（一次遍历，空间O(1)）
 * 原理：p1走A+B长度，p2走B+A长度，相交则在交点相遇，不相交则同时到null
 * 时间复杂度：O(m+n)，空间复杂度：O(1)
 * @param {ListNode} headA - 链表A头节点
 * @param {ListNode} headB - 链表B头节点
 * @returns {ListNode|null} 相交节点（无相交返回null）
 */
var getIntersectionNode = function(headA, headB) {
    // ========== 边界处理：空链表直接返回null ==========
    // 易错点1：忽略空链表，后续指针操作会报错
    if (headA === null || headB === null) return null;

    // ========== 初始化双指针 + 切换标记 ==========
    let p1 = headA;        // 指针1：从A出发
    let p2 = headB;        // 指针2：从B出发
    let isC1 = false;      // 标记p1是否已切换到B（避免无限循环）
    let isC2 = false;      // 标记p2是否已切换到A

    // ========== 核心循环：双指针同步前进 + 互换链表 ==========
    while (true) {
        // 核心判断：指针相遇且非null → 找到相交节点
        // 优化点：补充p1 !== null，避免返回null（无相交时也会相遇，但此时p1=p2=null）
        if (p1 === p2 && p1 !== null) {
            return p1;
        }

        // ========== 移动p1指针 ==========
        // 易错点2：原代码用p1.next判断，改为p1 !== null，保证每个节点都参与比较
        if (p1) { // 未到A末尾，继续走
            p1 = p1.next;
        } else { // 到A末尾，切换到B链表
            if (isC1) return null; // 已切换过一次，说明无相交
            p1 = headB;
            isC1 = true;
        }

        // ========== 移动p2指针 ==========
        if (p2) { // 未到B末尾，继续走
            p2 = p2.next;
        } else { // 到B末尾，切换到A链表
            if (isC2) return null; // 已切换过一次，说明无相交
            p2 = headA;
            isC2 = true;
        }
    }

    // 理论上不会走到这里，循环内已处理所有情况
    return null;
};

```

极简写法

```js
var getIntersectionNode = function(headA, headB) {
    // ========== 边界处理：空链表直接返回null ==========
    // 易错点1：忽略空链表，后续p1/p2移动时可能报错（如headA=null时p1=null，首次循环p1=headB）
    if (headA === null || headB === null) return null;

    // ========== 初始化双指针 ==========
    let p1 = headA; // 指针1：从A链表头出发
    let p2 = headB; // 指针2：从B链表头出发

    // ========== 核心循环：双指针同步前进 + 互换链表 ==========
    // 循环终止条件：p1 === p2（要么是相交节点，要么是null）
    // 易错点2：担心无限循环 → 无需担心，p1/p2总路程相等，最终必相遇
    while (p1 !== p2) {
        // p1移动规则：到A末尾（null）则切换到B，否则走1步
        p1 = p1 === null ? headB : p1.next;
        // p2移动规则：到B末尾（null）则切换到A，否则走1步
        p2 = p2 === null ? headA : p2.next;
    }

    // 退出循环时p1===p2：
    // - 有相交：p1/p2为相交节点；
    // - 无相交：p1/p2均为null；
    return p1;
};
```

(新建链表和 删除节点的时候 都可以dummy)


## 删除重复
82. 删除排序链表中的重复元素 II

分解的技巧，一条重复，一条不重复

```js
var deleteDuplicates = function(head) {
    // 易错点1：忽略空链表，后续p.next操作会报错
  if (head === null) return null;

  // ========== 关键：虚拟头节点（处理头节点重复的场景） ==========
  const dummy = new ListNode(-1);
  dummy.next = head;
  const  dummy1 = new ListNode(-1);
  const  dummy2 = new ListNode(-1);
  let p1 = dummy1 // 不重复
  let p2 = dummy2 // 重复
  let p = head;     // 遍历指针：找重复节点
  while(p){
    if((p && p.next && p.val  === p.next.val) || p.val === p2.val){
      p2.next = p
      p2 = p2.next

    }else{
      p1.next = p
      p1 = p1.next
    }
    p = p.next
  }
  p1.next = null
  return dummy1.next



}
```
双指针，删除节点是需要知道前节点的，prev和p
```js
/**
 * 删除链表中所有重复的节点（LeetCode 82题最优解）
 * 核心思路：前驱指针+跳过重复项（重复节点全删除，一个不留）
 * 时间复杂度：O(L)（L为链表长度），空间复杂度：O(1)
 * @param {ListNode} head - 升序排序的链表头节点
 * @returns {ListNode|null} 删除重复节点后的链表头
 */
var deleteDuplicates = function(head) {
  // ========== 边界处理：空链表直接返回null ==========
  // 易错点1：忽略空链表，后续p.next操作会报错
  if (head === null) return null;

  // ========== 关键：虚拟头节点（处理头节点重复的场景） ==========
  const dummy = new ListNode(-1);
  dummy.next = head;
  let prev = dummy; // 前驱指针：记录最后一个不重复的节点
  let p = head;     // 遍历指针：找重复节点

  // ========== 核心循环：遍历链表，删除所有重复节点 ==========
  while (p) {
      // 第一步：判断当前节点是否有重复（先判p.next非空，再比较值）
      // 优化点：你补充了p.next判空，避免p.next为null时访问val报错
      if (p.next && p.val === p.next.val) {
          // 第二步：跳过所有连续重复的节点（停在最后一个重复节点）
          // 易错点2：内层循环需补充p&&p.next判空，避免越界
          while (p && p.next && p.val === p.next.val) {
              p = p.next; // 一直后移，直到最后一个重复节点
          }
          // 第三步：删除所有重复节点（prev.next跳过重复项）
          prev.next = p.next;
          // 第四步：更新p指针，继续遍历后续节点（跳过重复项）
          p = p.next;
      } else {
          // 无重复：前驱指针和遍历指针同步后移
          // 易错点3：无重复时prev必须同步后移，否则prev会停留在原地
          prev = prev.next;
          p = p.next;
      }
  }

  // ========== 返回结果：虚拟头节点的下一个节点（避免头节点被删除） ==========
  return dummy.next;
};
```


链表的合并

有些题目虽然不是链表的题目，但其中蕴含了合并有序链表的思想。
378. 有序矩阵中第 K 小的元素

和之前合并n个有序链表有点相似，这里先实现一个优先队列，自定义优先级函数，函数返回为负数的时候，第一个参数的优先级更高 (a,b)=> a-b  a-b为负数就是`a-b<0`，`a<b`，a的优先级更高 说明越小越在上面，这是个小顶堆，(a,b)=> b-a  b-a为负数就是`b-a<0`，`b<a`，a的优先级更高 说明越大越在上面，这是个大顶堆。

```js
/**
 * 通用优先队列实现（支持大顶堆/小顶堆，基于完全二叉树+数组存储）
 * @param {Function} compareFn - 比较函数，决定堆类型：
 *                                返回值是负数的时候，第一个参数的优先级更高
 *                               - 小顶堆（默认）：(a,b) => a - b（返回负数则a优先级高）
 *                               - 大顶堆：(a,b) => b - a（返回负数则b优先级高）
 */
class PriorityQueue1 {
  constructor(compareFn = (a, b) => a - b) {
    this.compareFn = compareFn; // 自定义比较函数（核心：替代硬编码比较）
    this.size = 0; // 堆的有效元素个数（≠queue.length，避免数组空洞）
    this.queue = []; // 物理存储数组（逻辑完全二叉树）
  }

  // 入队：添加元素并上浮堆化
  enqueue(val) {
    // 1. 把新元素放到数组末尾（完全二叉树的最后一个节点）
    this.queue[this.size] = val;
    // 2. 上浮：维护堆的性质（从新元素位置向上调整）
    this.swim(this.size);
    // 3. 有效元素个数+1（先swim再++，因为swim需要当前索引）
    this.size++;
  }

  // 出队：移除并返回堆顶元素，最后一个元素补位后下沉堆化
  dequeue() {
    // 边界：空队列返回null
    if (this.size === 0) return null;
    // 1. 保存堆顶元素（要返回的值）
    const peek = this.queue[0];
    // 2. 最后一个元素移到堆顶（完全二叉树补位）
    this.queue[0] = this.queue[this.size - 1];
    // 3. 下沉：维护堆的性质（从堆顶向下调整）
    this.sink(0);
    // 4. 有效元素个数-1（堆大小减小）
    this.size--;
    // 可选：清空数组空洞（非必需，但更优雅）
    this.queue.length = this.size;
    return peek;
  }

  // 获取堆顶元素（不出队）
  head() {
    return this.size === 0 ? null : this.queue[0];
  }

  // 获取父节点索引
  parent(idx) {
    return Math.floor((idx - 1) / 2);
  }

  // 获取左子节点索引
  left(idx) {
    return idx * 2 + 1;
  }

  // 获取右子节点索引
  right(idx) {
    return idx * 2 + 2;
  }

  // 交换两个节点的值
  swap(idx1, idx2) {
    [this.queue[idx1], this.queue[idx2]] = [this.queue[idx2], this.queue[idx1]];
  }

  // 上浮（swim）：从idx向上调整，维护堆性质
  swim(idx) {
    // 循环：直到根节点（idx=0）或当前节点不小于父节点
    while (idx > 0) {
      const parentIdx = this.parent(idx);
      // 核心：用compareFn替代硬编码比较
      // compareFn(a,b) < 0 → a优先级更高（应上浮）
      if (this.compareFn(this.queue[idx], this.queue[parentIdx]) >= 0) {
        break; // 当前节点优先级不高于父节点，停止上浮
      }
      // 交换当前节点和父节点
      this.swap(idx, parentIdx);
      // 继续向上检查
      idx = parentIdx;
    }
  }

  // 下沉（sink）：从idx向下调整，维护堆性质
  sink(idx) {
    // 循环：直到没有左子节点（完全二叉树，左子不存在则右子也不存在）
    while (this.left(idx) < this.size) {
      const leftIdx = this.left(idx);
      const rightIdx = this.right(idx);
      // 找到“优先级更高”的子节点（小顶堆找更小的，大顶堆找更大的）
      let priorityIdx = leftIdx;

      // 右子节点存在，且右子优先级更高 → 切换到右子
      if (rightIdx < this.size && this.compareFn(this.queue[rightIdx], this.queue[leftIdx]) < 0) {
        priorityIdx = rightIdx;
      }

      // 当前节点优先级 ≥ 子节点 → 停止下沉
      if (this.compareFn(this.queue[idx], this.queue[priorityIdx]) <= 0) {
        break;
      }

      // 交换当前节点和优先级更高的子节点
      this.swap(idx, priorityIdx);
      // 继续向下检查
      idx = priorityIdx;
    }
  }

  // 辅助：判断队列是否为空
  isEmpty() {
    return this.size === 0;
  }
}
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
  const rows = matrix.length
  const cols = matrix[0].length
  // 每一行，都有一个指针，pArr[0]表示第0行的指针，pArr[1]表示第1行的指针，
  let pArr = new Array(rows).fill(0)
  // 返回值
  let res
  // 这里因为需要存储第几行的信息，所以queue队列里存储的不单单是val 还有row的信息，这样的话，需要重新写compareFn
  const pq = new PriorityQueue1(([row1,val1],[row2,val2])=>val1-val2)
  // 每行的第一个元素进队
  for(let row=0;row<rows;row++){
    pq.enqueue([row,matrix[row][0]])
  }
  // 当队存在且k>0的时候 说明需要继续
  while(pq.size>0 && k>0){
    // 出队的是当前最小的
    const [curRow,curVal] = pq.dequeue()
    // 值存下
    res = curVal
    // 循环k次就能获取到k小的值
    k--
    const nextCol = pArr[curRow]+1
    if(nextCol<cols){
      pArr[curRow] = nextCol
      pq.enqueue([curRow,matrix[curRow][nextCol]])
    }
  }
  return res

};
```

373. 查找和最小的 K 对数字

其实脑海里可以想着二维矩阵，nums1长度是行数，nums2长度是列数
[
  [0,0],[0,1],...[0,m]
  [1,0]，...
]

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function(nums1, nums2, k) {
  const rows = nums1.length
  const cols = nums2.length
  if(rows === 0 || cols === 0) return []

  const res = []
  const pq = new PriorityQueue1(([row1,col1],[row2,col2])=>(nums1[row1]+nums2[col1])-(nums1[row2]+nums2[col2]))


  // const matrix = new Array(rows).fill(0).map(()=> new Array())
  // for(let y=0;y<rows;y++){
  //   for(let x=0;x<cols;x++){
  //     matrix[y][x] = [y,x]
  //   }
  // }
  // let pArr = new Array(rows).fill(0) // 各行的指针
  for(let i=0;i<rows;i++){
    pq.enqueue([i,0])
  }
  while(pq.size>0 && k>0){
    const [curRow,curCol] = pq.dequeue()
    // 拿结果
    res.push([nums1[curRow],nums2[curCol]])
    // k迭代
    k--
    // 同一行的下一个数如果存在的话 进队，进队之后对顶自然有下一个最小值
    // const nextCol = pArr[curRow]+1
    const nextCol = curCol+1
    if(nextCol<cols){
      // pArr[curRow] = nextCol
      pq.enqueue([curRow,nextCol])
    }
  }
  return res



};
```

链表运算题
2. 两数相加

```js
var addTwoNumbers = function(l1, l2) {
  if(l1 === null && l2 === null) return null
  let p1 = l1
  let p2 = l2
  const dummy = new ListNode(-1)
  let p = dummy
  let isNeedPlusOne = false
  while(p1 || p2 || isNeedPlusOne){
    let val = isNeedPlusOne?1:0
    if(p1){
      val+=p1.val
      p1 = p1.next
    }
    if(p2){
      val+=p2.val
      p2 = p2.next
    }
    isNeedPlusOne = val >=10
    val = val % 10
    p.next = new ListNode(val)
    p = p.next

  }
  return dummy.next
    
};
```

445. 两数相加 II

```js
/**
 * @param {ListNode} l1 正序存储数字的链表（如 7→2→4→3 代表 3427）
 * @param {ListNode} l2 正序存储数字的链表（如 5→6→4 代表 465）
 * @return {ListNode} 两数相加后的正序链表（如 7→8→0→7 代表 7087）
 * 核心思路：栈逆序取数 + 反向构建链表（445题最优解，空间O(1)不计栈，时间O(max(m,n))）
 */
var addTwoNumbers = function(l1, l2) {
  // 边界1：两个链表都为空，返回null（题目中l1/l2至少一个非空，但防御性编程更严谨）
  if (l1 === null && l2 === null) return null;

  // 步骤1：将两个链表的值入栈，实现「正序链表→逆序取数」（适配手工加法从个位开始）
  const stack1 = [];
  let p1 = l1;
  while (p1) {
    stack1.push(p1.val); // 正序链表入栈：7→2→4→3 → stack1 = [7,2,4,3]
    p1 = p1.next;
  }

  const stack2 = [];
  let p2 = l2;
  while (p2) {
    stack2.push(p2.val); // 正序链表入栈：5→6→4 → stack2 = [5,6,4]
    p2 = p2.next;
  }

  // 步骤2：反向构建结果链表（无需dummy，新节点始终作为头节点）
  let head = null; // 最终结果的头节点，初始为空
  let isNeedPlusOne = false; // 进位标记：true=需要进位1，false=无需进位

  // ⚠️ 易错点1：循环条件必须包含isNeedPlusOne！否则漏掉末尾进位（如999+1=1000）
  while (stack1.length || stack2.length || isNeedPlusOne) {
    // 初始化当前位值：先加进位（true=1，false=0）
    // 优化：Number(isNeedPlusOne) 等价于 isNeedPlusOne?1:0，更简洁
    let val = isNeedPlusOne ? 1 : 0;

    // 栈顶取数（逆序，对应手工加法的个位→十位→百位）
    if (stack1.length) val += stack1.pop(); // stack1.pop() 先取3，再取4，再取2，最后取7
    if (stack2.length) val += stack2.pop(); // stack2.pop() 先取4，再取6，最后取5

    // 更新进位标记：当前位总和≥10则需要进位
    isNeedPlusOne = val >= 10;
    // 当前位的最终值：取余（如10→0，18→8）
    val = val % 10;

    // ⚠️ 易错点2：反向构建链表的核心逻辑（新手易写反next指向）
    const newNode = new ListNode(val); // 新建当前位节点
    newNode.next = head; // 新节点的next指向「之前的头节点」（反向链接）
    head = newNode; // 更新头节点为新节点（新节点始终在最前面）
  }

  // 返回最终的头节点（已正序）
  return head;
};
``` -->
