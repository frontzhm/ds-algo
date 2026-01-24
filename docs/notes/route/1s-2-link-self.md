# 手把手实现链表：单链表与双链表的完整实现

链表是数据结构的基础，也是面试高频考点。很多初学者会卡在“指针操作混乱”“边界条件处理不当”等问题上。本文将从**设计思路**出发，拆解单链表实现的核心逻辑，同时补充双向链表（双链表）的实现方法，帮你彻底掌握链表的实现技巧。

## 一、为什么需要手动实现链表？

编程语言（如JavaScript）没有内置链表结构，但链表的“动态扩容”“非连续存储”特性使其在插入/删除操作中比数组更高效（尤其是头部/中部操作）。手动实现链表的核心目标是：

- 掌握**指针（引用）操作**的核心逻辑；

- 理解**虚拟头/尾节点**等技巧解决边界问题；

- 适配面试/算法题的标准化实现（如LeetCode 707）；

- 规避“空指针操作”“状态不同步”等高频报错；

- 区分单链表与双链表的设计差异，适配不同场景需求。

## 二、单链表实现

### 1. 单链表核心设计思路

链表的最小单元是“节点（Node）”，每个节点包含两部分：

- `val`：节点存储的值；

- `next`：指向下一个节点的指针（引用），默认`null`。

链表类（MyLinkedList）需维护核心属性，且遵守**状态同步约束**：

| 属性名 | 作用 | 核心约束 |
| --- | --- | --- |
| `dummyHead`（虚拟头节点） | 统一头节点操作逻辑，避免单独处理头节点 | 始终存在，`next`指向真实头节点 |
| `tail`（尾节点） | 优化尾插效率（从O(n)→O(1)） | `size=0`时`tail=null`；`size>0`时`tail`指向最后一个节点 |
| `size`（链表长度） | 简化边界判断，避免冗余遍历 | 增/删操作必须同步更新，与`tail`状态严格一致 |

### 实现步骤（从0开始设计）

**第一步：定义节点类**
```javascript
class LinkedNode {
  constructor(val) {
    this.val = val;   // 节点值
    this.next = null; // 指向下一个节点的指针
  }
}
```

**第二步：设计链表类结构**
1. 初始化虚拟头节点（`dummyHead`）：统一头节点操作，避免边界判断
2. 初始化尾节点（`tail`）：初始为`null`，空链表时无尾节点
3. 初始化长度（`size`）：初始为`0`，记录链表节点数量

**第三步：实现基础查询方法**
- `isEmpty()`：判断链表是否为空（`size === 0`）
- `get(index)`：获取指定索引的节点值
  - 边界校验：`index < 0 || index >= size` 返回 `-1`
  - 从`dummyHead.next`开始遍历到目标位置

**第四步：实现插入方法（核心：先连后断）**
- `addAtHead(val)`：头部插入
  1. 创建新节点
  2. 新节点`next`指向原头节点（`dummyHead.next`）
  3. `dummyHead.next`指向新节点
  4. 更新`size`，若`size === 1`则更新`tail`
  
- `addAtTail(val)`：尾部插入
  1. 边界处理：空链表时调用`addAtHead`
  2. 创建新节点
  3. `tail.next`指向新节点
  4. `tail`更新为新节点
  5. 更新`size`

- `addAtIndex(index, val)`：指定位置插入
  1. 边界处理：`index <= 0`调用`addAtHead`，`index > size`直接返回
  2. 遍历到插入位置的前驱节点
  3. 新节点`next`指向原节点，前驱节点`next`指向新节点
  4. 若插入到尾部，更新`tail`
  5. 更新`size`

**第五步：实现删除方法（核心：先连后断）**
- `deleteAtIndex(index)`：删除指定位置节点
  1. 边界校验：`index < 0 || index >= size || isEmpty()` 直接返回
  2. 遍历到删除位置的前驱节点
  3. 前驱节点`next`指向待删除节点的`next`（跳过待删除节点）
  4. 待删除节点`next`置为`null`（释放引用）
  5. 更新`size`，若删除的是尾节点，更新`tail`

**关键设计要点：**
- ✅ 使用虚拟头节点统一边界处理
- ✅ 维护`tail`指针优化尾插操作
- ✅ `size`与`tail`状态必须严格同步
- ✅ 所有指针操作前先校验边界条件
- ✅ 遵循"先连后断"原则：先建立新连接，再断开旧连接
- ✅ 使用虚拟头节点统一边界处理
- ✅ 维护`tail`指针优化尾插操作
- ✅ `size`与`tail`状态必须严格同步
- ✅ 所有指针操作前先校验边界条件

### 2. 单链表完整实现

```JavaScript

/**
 * 单链表节点类
 * @param {number} val - 节点存储的值
 */
class LinkedNode {
  constructor(val) {
    this.val = val;       // 节点值
    this.next = null;     // 指向下一个节点的指针
  }
}

/**
 * 单链表实现
 */
class MySinglyLinkedList {
  constructor() {
    this.dummyHead = new LinkedNode('_dummy'); // 虚拟头节点
    this.tail = null;  // 尾节点
    this.size = 0;     // 链表长度
    // 约束：size=0 时 tail=null；size>0 时 tail 指向最后一个节点
  }

  /**
   * 判断链表是否为空
   * @returns {boolean}
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * 获取指定索引的节点值
   * @param {number} index - 目标索引（从0开始）
   * @returns {number} 节点值，索引无效返回-1
   */
  get(index) {
    if (index < 0 || index >= this.size) return -1;

    let pointer = this.dummyHead.next;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }
    return pointer.val;
  }

  /**
   * 头部插入节点
   * @param {number} val - 要插入的值
   */
  addAtHead(val) {
    const newNode = new LinkedNode(val);
    newNode.next = this.dummyHead.next;
    this.dummyHead.next = newNode;

    this.size++;
    // 空链表插入，尾节点同步更新
    if (this.size === 1) {
      this.tail = newNode;
    }
  }

  /**
   * 尾部插入节点
   * @param {number} val - 要插入的值
   */
  addAtTail(val) {
    // 双重兜底校验：避免tail为null但size>0的异常
    if (this.isEmpty() || this.tail === null) {
      this.addAtHead(val);
      return;
    }

    const newNode = new LinkedNode(val);
    this.tail.next = newNode;
    this.tail = newNode;
    this.size++;
  }

  /**
   * 指定索引插入节点
   * @param {number} index - 插入位置
   * @param {number} val - 要插入的值
   */
  addAtIndex(index, val) {
    if (index <= 0) {
      this.addAtHead(val);
      return;
    }
    if (index > this.size) return;

    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const newNode = new LinkedNode(val);
    newNode.next = pointer.next;
    pointer.next = newNode;

    // 插入到尾部时更新tail
    if (index === this.size) {
      this.tail = newNode;
    }
    this.size++;
  }

  /**
   * 删除头部节点
   */
  deleteAtHead() {
    if (this.isEmpty()) return;

    const oldHead = this.dummyHead.next;
    this.dummyHead.next = oldHead.next;
    oldHead.next = null;

    this.size--;
    // 同步更新tail
    if (this.size === 0) {
      this.tail = null;
    } else if (oldHead === this.tail) {
      this.tail = this.dummyHead.next;
    }
  }

  /**
   * 删除尾部节点
   */
  deleteAtTail() {
    if (this.isEmpty()) return;

    if (this.size === 1) {
      this.deleteAtHead();
      return;
    }

    let pointer = this.dummyHead;
    while (pointer.next.next) {
      pointer = pointer.next;
    }

    pointer.next.next = null;
    this.tail = pointer.next;
    this.size--;
  }

  /**
   * 删除指定索引节点
   * @param {number} index - 要删除的索引
   */
  deleteAtIndex(index) {
    if (index < 0 || index >= this.size || this.isEmpty()) {
      return;
    }

    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const nodeToDel = pointer.next;
    pointer.next = nodeToDel.next;
    nodeToDel.next = null;

    this.size--;
    // 同步更新tail
    if (this.size === 0) {
      this.tail = null;
    } else if (nodeToDel === this.tail) {
      this.tail = pointer.next || pointer;
    }
  }
}

// 单链表测试用例
const singlyList = new MySinglyLinkedList();
singlyList.addAtHead(1);
singlyList.addAtTail(3);
singlyList.addAtIndex(1, 2);
console.log("单链表get(1):", singlyList.get(1)); // 输出2
singlyList.deleteAtIndex(1);
console.log("单链表get(1):", singlyList.get(1)); // 输出3
```

### 3. 单链表核心易错点

| 易错点 | 错误表现 | 修复方案 |
| --- | --- | --- |
| **空指针操作** | `Cannot set properties of null (setting 'next')` | 所有指针操作前先校验`null`，使用`isEmpty()`或`size`判断 |
| **tail状态不同步** | 删除节点后`tail`仍指向已删除节点 | 删除操作后同步更新`tail`，`size=0`时`tail=null` |
| **边界条件遗漏** | `index=0`或`index=size`时操作失败 | 使用虚拟头节点统一处理，特殊位置单独判断 |
| **指针操作顺序错误** | 先断开原链表导致节点丢失 | 遵循"先连后断"原则：先建立新连接，再断开旧连接 |
| **size未同步更新** | `size`与实际节点数不一致 | 每次增/删操作必须同步更新`size` |

**调试技巧：**
```javascript
// 添加调试方法：打印链表结构
toString() {
  const values = [];
  let current = this.dummyHead.next;
  while (current) {
    values.push(current.val);
    current = current.next;
  }
  return `[${values.join(' -> ')}] (size: ${this.size}, tail: ${this.tail?.val ?? 'null'})`;
}
```

## 三、双向链表（双链表）实现

### 1. 双链表核心实现逻辑

#### （1）双链表与单链表的核心差异

单链表的节点只有`next`指针（指向后继节点），只能“单向遍历”；双链表的节点新增`prev`指针（指向前驱节点），支持“双向遍历”，核心优势：

- 删除节点时，无需遍历找前驱节点（时间复杂度从O(n)→O(1)）；

- 支持从尾部反向遍历，适配“逆序操作”场景；

- 插入/删除操作更灵活，边界处理可通过“虚拟头+虚拟尾”进一步简化。

#### （2）双链表核心设计要点

- **节点结构**：每个节点包含`val`（值）、`prev`（前驱指针）、`next`（后继指针）；

- **虚拟节点**：同时维护`dummyHead`（虚拟头）和`dummyTail`（虚拟尾），彻底统一头尾节点的操作逻辑；

- **状态同步**：维护`size`（长度），且每个节点的`prev`/`next`指针必须成对更新（避免指针悬空）；

- **操作原则**：插入/删除时，先更新新节点的`prev/next`，再更新原链表的指针（先连后断）。

### 实现步骤（基于单链表扩展）

**前提：已掌握单链表实现**，在此基础上扩展为双链表。

**第一步：扩展节点类（新增`prev`指针）**
```javascript
class DoublyLinkedNode {
  constructor(val) {
    this.val = val;   // 节点值
    this.prev = null; // 指向前驱节点的指针（新增）
    this.next = null; // 指向后继节点的指针
  }
}
```

**第二步：扩展链表类结构（新增虚拟尾节点）**
1. 保留虚拟头节点（`dummyHead`）：与单链表相同
2. **新增虚拟尾节点（`dummyTail`）**：统一尾节点操作，避免边界判断
3. 初始化连接：`dummyHead.next = dummyTail`，`dummyTail.prev = dummyHead`
4. 初始化长度（`size`）：初始为`0`

**第三步：实现辅助方法（优化查找）**
- `getNode(index)`：根据索引获取节点（优化版）
  - 边界校验：`index < 0 || index >= size` 返回 `null`
  - **优化策略**：索引在前半段从头遍历，在后半段从尾遍历（最坏O(n/2)）

**第四步：实现插入方法（核心：`prev`和`next`成对更新）**
- `addAtHead(val)`：头部插入
  1. 创建新节点
  2. 获取原头节点（`dummyHead.next`）
  3. **成对更新指针**：
     - 新节点：`prev`指向`dummyHead`，`next`指向原头节点
     - 原头节点：`prev`指向新节点
     - `dummyHead`：`next`指向新节点
  4. 更新`size`

- `addAtTail(val)`：尾部插入
  1. 创建新节点
  2. 获取原尾节点（`dummyTail.prev`）
  3. **成对更新指针**：
     - 新节点：`prev`指向原尾节点，`next`指向`dummyTail`
     - 原尾节点：`next`指向新节点
     - `dummyTail`：`prev`指向新节点
  4. 更新`size`

- `addAtIndex(index, val)`：指定位置插入
  1. 边界处理：`index <= 0`调用`addAtHead`，`index > size`直接返回，`index === size`调用`addAtTail`
  2. 使用`getNode(index)`找到插入位置的后继节点（`nextNode`）
  3. 获取前驱节点（`nextNode.prev`）
  4. **成对更新指针**：
     - 新节点：`prev`指向`prevNode`，`next`指向`nextNode`
     - `prevNode`：`next`指向新节点
     - `nextNode`：`prev`指向新节点
  5. 更新`size`

**第五步：实现删除方法（核心优势：O(1)删除）**
- `deleteAtIndex(index)`：删除指定位置节点
  1. 边界校验：使用`getNode(index)`获取待删除节点，无效则返回
  2. **核心优势**：直接获取前驱（`nodeToDel.prev`）和后继（`nodeToDel.next`），无需遍历
  3. **成对更新指针**：
     - 前驱节点：`next`指向后继节点
     - 后继节点：`prev`指向前驱节点
     - 待删除节点：`prev`和`next`置为`null`（释放引用）
  4. 更新`size`

**第六步：实现扩展功能（双链表特有）**
- `reverseTraverse()`：逆序遍历
  1. 从`dummyTail.prev`开始
  2. 通过`prev`指针向前遍历
  3. 直到`dummyHead`结束

**关键设计要点（相比单链表的升级）：**
- ✅ **双指针维护**：每个节点的`prev`和`next`必须成对更新
- ✅ **虚拟头+虚拟尾**：彻底统一边界处理，无需维护`tail`指针
- ✅ **O(1)删除优势**：删除任意节点无需遍历找前驱
- ✅ **双向遍历优化**：根据索引位置选择遍历方向（优化查找效率）
- ✅ **指针释放**：删除节点后必须将`prev`和`next`置为`null`

### 2. 双链表完整实现

```JavaScript

/**
 * 双链表节点类
 * @param {number} val - 节点存储的值
 */
class DoublyLinkedNode {
  constructor(val) {
    this.val = val;       // 节点值
    this.prev = null;     // 指向前驱节点的指针
    this.next = null;     // 指向后继节点的指针
  }
}

/**
 * 双向链表实现（优化版：虚拟头+虚拟尾）
 */
class MyDoublyLinkedList {
  constructor() {
    this.dummyHead = new DoublyLinkedNode('_dummyHead'); // 虚拟头节点
    this.dummyTail = new DoublyLinkedNode('_dummyTail'); // 虚拟尾节点
    this.size = 0;                                       // 链表长度

    // 初始化：虚拟头的next指向虚拟尾，虚拟尾的prev指向虚拟头
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
    // 约束：真实节点始终在dummyHead和dummyTail之间
  }

  /**
   * 判断链表是否为空
   * @returns {boolean}
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * 辅助方法：根据索引找到对应节点（优化：判断索引位置，选择从头/尾遍历）
   * @param {number} index - 目标索引
   * @returns {DoublyLinkedNode|null} 找到的节点/索引无效返回null
   */
  getNode(index) {
    if (index < 0 || index >= this.size) return null;

    let current;
    // 优化：索引在前半段，从头遍历；索引在后半段，从尾遍历
    if (index < this.size / 2) {
      current = this.dummyHead.next;
      for (let i = 0; i < index; i++) {
        current = current.next;
      }
    } else {
      current = this.dummyTail.prev;
      for (let i = this.size - 1; i > index; i--) {
        current = current.prev;
      }
    }
    return current;
  }

  /**
   * 获取指定索引的节点值
   * @param {number} index - 目标索引
   * @returns {number} 节点值，索引无效返回-1
   */
  get(index) {
    const node = this.getNode(index);
    return node ? node.val : -1;
  }

  /**
   * 头部插入节点
   * @param {number} val - 要插入的值
   */
  addAtHead(val) {
    const newNode = new DoublyLinkedNode(val);
    const nextNode = this.dummyHead.next; // 虚拟头的后继节点（原真实头）

    // 步骤1：新节点的prev指向虚拟头，next指向原真实头
    newNode.prev = this.dummyHead;
    newNode.next = nextNode;

    // 步骤2：原真实头的prev指向新节点
    nextNode.prev = newNode;

    // 步骤3：虚拟头的next指向新节点
    this.dummyHead.next = newNode;

    this.size++; // 长度+1
  }

  /**
   * 尾部插入节点
   * @param {number} val - 要插入的值
   */
  addAtTail(val) {
    const newNode = new DoublyLinkedNode(val);
    const prevNode = this.dummyTail.prev; // 虚拟尾的前驱节点（原真实尾）

    // 步骤1：新节点的prev指向原真实尾，next指向虚拟尾
    newNode.prev = prevNode;
    newNode.next = this.dummyTail;

    // 步骤2：原真实尾的next指向新节点
    prevNode.next = newNode;

    // 步骤3：虚拟尾的prev指向新节点
    this.dummyTail.prev = newNode;

    this.size++; // 长度+1
  }

  /**
   * 指定索引插入节点
   * @param {number} index - 插入位置
   * @param {number} val - 要插入的值
   */
  addAtIndex(index, val) {
    // 边界处理：index<=0插头部，index>size不插入
    if (index <= 0) {
      this.addAtHead(val);
      return;
    }
    if (index > this.size) return;
    // index===size 插尾部
    if (index === this.size) {
      this.addAtTail(val);
      return;
    }

    // 找到插入位置的目标节点（新节点的后继节点）
    const nextNode = this.getNode(index);
    const prevNode = nextNode.prev; // 目标节点的前驱（新节点的前驱）
    const newNode = new DoublyLinkedNode(val);

    // 步骤1：新节点的prev指向prevNode，next指向nextNode
    newNode.prev = prevNode;
    newNode.next = nextNode;

    // 步骤2：prevNode的next指向新节点
    prevNode.next = newNode;

    // 步骤3：nextNode的prev指向新节点
    nextNode.prev = newNode;

    this.size++; // 长度+1
  }

  /**
   * 删除指定索引节点
   * @param {number} index - 要删除的索引
   */
  deleteAtIndex(index) {
    const nodeToDel = this.getNode(index);
    if (!nodeToDel) return; // 索引无效直接返回

    // 步骤1：获取待删除节点的前驱和后继
    const prevNode = nodeToDel.prev;
    const nextNode = nodeToDel.next;

    // 步骤2：跳过待删除节点，连接前驱和后继
    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    // 步骤3：释放待删除节点的指针（避免内存泄漏）
    nodeToDel.prev = null;
    nodeToDel.next = null;

    this.size--; // 长度-1
  }

  /**
   * 扩展方法：逆序遍历链表（双链表核心优势）
   * @returns {number[]} 逆序的节点值数组
   */
  reverseTraverse() {
    const result = [];
    let current = this.dummyTail.prev; // 从虚拟尾的前驱开始遍历
    while (current !== this.dummyHead) {
      result.push(current.val);
      current = current.prev;
    }
    return result;
  }
}

// 双链表测试用例
const doublyList = new MyDoublyLinkedList();
doublyList.addAtHead(1);
doublyList.addAtTail(3);
doublyList.addAtIndex(1, 2);
console.log("双链表get(1):", doublyList.get(1)); // 输出2
console.log("双链表逆序遍历:", doublyList.reverseTraverse()); // 输出[3,2,1]
doublyList.deleteAtIndex(1);
console.log("双链表get(1):", doublyList.get(1)); // 输出3
console.log("双链表逆序遍历:", doublyList.reverseTraverse()); // 输出[3,1]
```

### 3. 双链表核心易错点

| 易错点 | 错误表现 | 修复方案 |
| --- | --- | --- |
| **指针更新顺序错误** | 先修改原链表指针，导致新节点指针丢失 | 先更新新节点的`prev/next`，再修改原链表的指针（先连后断） |
| **虚拟头尾未初始化** | `dummyHead.next`/`dummyTail.prev`为null，操作时报错 | 初始化时必须让`dummyHead.next = dummyTail`、`dummyTail.prev = dummyHead` |
| **遍历方向选择不当** | 无论索引位置都从头遍历，效率低 | 判断索引是否小于`size/2`，选择从头/尾遍历（优化时间复杂度） |
| **仅更新单向指针** | 只更新`next`不更新`prev`，导致链表断裂 | 插入/删除时，`prev`和`next`必须成对更新 |
| **未释放删除节点的指针** | 节点删除后仍有`prev/next`引用，导致内存泄漏（JS中影响小，但不规范） | 删除后将节点的`prev/next`置为null |


## 四、实战应用场景

### 1. LeetCode 经典题目

- **[707. 设计链表](https://leetcode.cn/problems/design-linked-list/)**：单链表/双链表的基础实现
- **[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)**：单链表指针操作
- **[92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)**：部分反转，需要定位前后节点
- **[141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)**：快慢指针技巧
- **[142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)**：找环入口
- **[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)**：双链表 + 哈希表（经典应用）

### 2. 实际应用场景

- **LRU缓存**：使用双链表维护访问顺序，O(1)时间删除任意节点
- **浏览器历史记录**：双链表支持前进/后退操作
- **撤销/重做功能**：双链表维护操作历史
- **音乐播放列表**：单链表实现顺序播放
- **任务队列**：单链表实现FIFO队列

### 3. 面试高频考点

1. **指针操作**：如何正确更新`next`/`prev`指针
2. **边界处理**：空链表、单节点、头尾节点的特殊处理
3. **状态同步**：`size`、`tail`等状态的维护
4. **时间复杂度优化**：双链表的删除优势、虚拟节点的作用
5. **内存管理**：指针释放、避免内存泄漏

## 五、总结

### 1. 单链表核心

- 核心属性：`dummyHead`（虚拟头）+ `tail`（尾节点）+ `size`（长度）；

- 修复关键：`size`与`tail`同步更新，对`null`敏感操作增加兜底校验；

- 避坑原则：先校验边界，再执行核心逻辑，指针操作“先连后断”。

### 2. 双链表核心

- 核心升级：节点新增`prev`指针，新增`dummyTail`（虚拟尾）；

- 效率优势：删除节点无需找前驱，支持双向遍历；

- 操作原则：`prev/next`成对更新，遍历方向按需选择。

掌握单链表和双链表的实现逻辑后，不仅能应对LeetCode 707等基础题，还能扩展到环形链表、LRU缓存（双链表+哈希表）等进阶场景。建议结合测试用例反复调试，重点关注指针操作和状态同步，形成肌肉记忆。
## 六、练习
