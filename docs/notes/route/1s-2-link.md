# 链表链式存储的基本原理

[链式存储原理](https://labuladong.online/zh/algo/data-structure-basic/linkedlist-basic/)

一条链表并不需要一整块连续的内存空间存储元素。链表的元素可以分散在内存空间的天涯海角，通过每个节点上的 next, prev 指针，将零散的内存块串联起来形成一个链式结构。另外一个好处，它的节点要用的时候就能接上，不用的时候拆掉就行了，从来不需要考虑扩缩容和数据搬移的问题，理论上讲，链表是没有容量限制的（除非把所有内存都占满，这不太可能）。但因为元素不是紧挨着的，所以查改的复杂度就是O(N)。

链表的增删查改操作确实比数组复杂。这是因为链表的节点不是紧挨着的，所以要增删一个节点，必须先找到它的前驱和后驱节点进行协同，然后才能通过指针操作把它插入或删除。

单链表的增删改查
双链表的增删改查

[链表代码的实现](https://labuladong.online/zh/algo/data-structure-basic/linkedlist-implement/)

分别用双链表和单链给出一个简单的 MyLinkedList 代码实现，包含了基本的增删查改功能。这里给出几个关键点，等会你看代码的时候可以着重注意一下。

1. 持有尾节点引用。因为在容器尾部添加元素是个非常高频的操作，这样尾部追加就是O(1)。
1. 增加虚拟头尾节点。创建双链表时就创建一个虚拟头节点和一个虚拟尾节点，无论双链表是否为空，这两个节点都存在，这样就不会出现空指针的问题，可以避免很多边界情况的处理。假设虚拟头尾节点分别是 dummyHead 和 dummyTail，那么一条空的双链表长这样`dummyHead <-> dummyTail`，这样添加和删除元素就不用区分头部、中间、尾部了。对于单链表，虚拟头结点有一定的简化作用，但虚拟尾节点没有太大作用。在有dummyHead之后，不需要维护head引用，但可以增加一个size的属性，辅助操作。虚拟虚拟节点是内部实现，对外不可见。
1. 不会内存泄露。虽然不会有内存泄露的问题，但是清除指针是个好习惯。所以统一删除节点的指针都置为 null


## 单链表

```ts
/**
 * 链表节点类：定义单个节点的结构
 * @param {number} val - 节点存储的值
 */
class LinkedNode {
  constructor(val) {
    this.val = val;       // 节点值
    this.next = null;     // 指向下一个节点的指针，初始化为null（避免悬空）
  }
}

/**
 * LeetCode 707. 设计链表 修复版
 * 核心修复：解决 addAtTail 中 this.tail 为 null 导致的 "Cannot set properties of null" 报错
 * 核心思路：保证 size 与 tail 状态严格同步，增加兜底校验
 */
class MyLinkedList {
  constructor() {
    this.dummyHead = new LinkedNode('_dummy'); // 虚拟头节点（操作锚点）
    this.tail = null;  // 尾节点（优化尾插效率）
    this.size = 0;     // 链表长度（核心边界判断依据）
    // 【初始化约束】size=0 时 tail 必须为 null；size>0 时 tail 必须指向最后一个节点
  }

  /**
   * 辅助方法：判断链表是否为空
   * @returns {boolean} 链表是否为空
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
    // 【基础校验】索引越界直接返回-1
    if (index < 0 || index >= this.size) return -1;

    let pointer = this.dummyHead.next; // 从真实头节点开始遍历
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }
    return pointer.val;
  }

  /**
   * 头部插入节点
   * @param {number} val - 要插入的值
   * 【核心修复点1】调整 size 与 tail 更新顺序，避免 tail 赋值失效
   */
  addAtHead(val) {
    const newNode = new LinkedNode(val);
    // 指针重连：新节点指向原真实头节点，虚拟头指向新节点
    newNode.next = this.dummyHead.next;
    this.dummyHead.next = newNode;

    // 【易错点1】必须先更新 size，再判断 tail —— 原逻辑先判断后更新，导致 tail 赋值失效
    this.size++; 
    // size=1 说明是空链表插入，新节点同时是尾节点
    if (this.size === 1) {
      this.tail = newNode;
      // 【反例错误】原逻辑 if (this.isEmpty()) { this.tail = newNode; }
      // 问题：isEmpty() 依赖 size，此时 size 未更新仍为0，判断为true；但如果 size 更新在前，isEmpty() 为false，tail 赋值失效
    }
  }

  /**
   * 尾部插入节点
   * @param {number} val - 要插入的值
   * 【核心修复点2】增加 tail 兜底校验，解决 tail 为 null 但 size>0 的异常场景
   */
  addAtTail(val) {
    // 【兜底校验】双重判断（size为空 或 tail为null），彻底避免操作 null.next
    // 【易错点2】原逻辑仅判断 isEmpty()，但存在 size>0 但 tail=null 的异常场景（如手动修改size）
    if (this.isEmpty() || this.tail === null) {
      this.addAtHead(val); // 空链表/异常场景复用头插逻辑
      return;
    }

    const newNode = new LinkedNode(val);
    // 此时 tail 必不为 null，不会触发 "Cannot set properties of null" 报错
    this.tail.next = newNode; // 原尾节点指向新节点
    this.tail = newNode;      // 更新尾节点为新节点
    this.size++;              // 长度+1（与 tail 同步更新）
  }

  /**
   * 指定索引插入节点
   * @param {number} index - 插入位置
   * @param {number} val - 要插入的值
   */
  addAtIndex(index, val) {
    // 边界处理：index<=0 插头部，index>size 不插入
    if (index <= 0) {
      this.addAtHead(val);
      return;
    }
    if (index > this.size) return;

    // 找到插入位置的前驱节点
    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const newNode = new LinkedNode(val);
    // 先连后断：避免指针丢失
    newNode.next = pointer.next;
    pointer.next = newNode;

    // 【易错点3】插入到尾部时，强制更新 tail（避免 tail 与 size 不同步）
    if (index === this.size) {
      this.tail = newNode;
    }
    this.size++; // 长度+1
  }

  /**
   * 删除头部节点
   * 【核心修复点3】删除后同步更新 tail，避免 size>0 但 tail=null
   */
  deleteAtHead() {
    if (this.isEmpty()) return; // 空链表直接返回

    const oldHead = this.dummyHead.next; // 保存原头节点
    this.dummyHead.next = oldHead.next;  // 跳过原头节点
    oldHead.next = null;                 // 释放引用（规范操作）

    this.size--; // 先更新 size，再处理 tail

    // 【易错点4】删除后为空链表，tail 置 null；否则检查 tail 是否指向被删节点
    if (this.size === 0) {
      this.tail = null; // 强制置空，保证 size=0 时 tail=null
    } else if (oldHead === this.tail) {
      // 单节点删除后，tail 指向新的头节点（避免 tail 指向已删除的节点）
      this.tail = this.dummyHead.next;
    }
  }

  /**
   * 删除尾部节点
   */
  deleteAtTail() {
    if (this.isEmpty()) return;

    // 单节点链表直接删头部（复用逻辑，避免重复代码）
    if (this.size === 1) {
      this.deleteAtHead();
      return;
    }

    // 找到倒数第二个节点（尾节点的前驱）
    let pointer = this.dummyHead;
    while (pointer.next.next) {
      pointer = pointer.next;
    }

    pointer.next.next = null; // 释放尾节点引用
    this.tail = pointer.next; // 更新尾节点为倒数第二个节点
    this.size--;              // 长度-1（与 tail 同步）
  }

  /**
   * 删除指定索引节点
   * @param {number} index - 要删除的索引
   * 【核心修复点4】删除尾节点时强制更新 tail，保证状态同步
   */
  deleteAtIndex(index) {
    // 基础校验：索引越界/空链表直接返回
    if (index < 0 || index >= this.size || this.isEmpty()) {
      return;
    }

    // 找到待删除节点的前驱节点
    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const nodeToDel = pointer.next; // 保存待删除节点
    pointer.next = nodeToDel.next;  // 跳过待删除节点
    nodeToDel.next = null;          // 释放引用

    this.size--; // 先更新 size，再处理 tail

    // 【易错点5】删除后为空链表，tail 置 null；删除的是尾节点，更新 tail 为前驱
    if (this.size === 0) {
      this.tail = null; // 强制同步：size=0 → tail=null
    } else if (nodeToDel === this.tail) {
      // 删的是尾节点，tail 指向删除后的最后一个节点（pointer.next），无节点则指向 pointer
      this.tail = pointer.next || pointer;
    }
  }
}

// ====================== 错误复现 & 修复验证测试用例 ======================
/**
 * 测试1：复现原报错场景（手动制造 size 与 tail 不同步）
 * 原代码执行会报错：Cannot set properties of null (setting 'next')
 * 修复后执行无报错，正常插入
 */
const test1 = new MyLinkedList();
test1.size = 1; // 手动修改size，模拟 size>0 但 tail=null 的异常场景
test1.addAtTail(5); // 修复后走头插逻辑，无报错
console.log("测试1 - get(0):", test1.get(0)); // 输出5，验证成功

/**
 * 测试2：正常场景全覆盖（头插→尾插→删尾→删头）
 * 验证所有操作后 size 与 tail 同步，无报错
 */
const test2 = new MyLinkedList();
test2.addAtHead(1);    // size=1, tail=1
test2.addAtTail(3);    // size=2, tail=3（无报错）
console.log("测试2 - get(1):", test2.get(1)); // 输出3，验证尾插成功
test2.deleteAtTail();  // size=1, tail=1
console.log("测试2 - get(0):", test2.get(0)); // 输出1，验证删尾成功
test2.deleteAtHead();  // size=0, tail=null
console.log("测试2 - get(0):", test2.get(0)); // 输出-1，验证删头成功

// ====================== 核心易错点汇总（针对本次报错） ======================
/**
 * 【addAtTail 报错 高频易错点】
 * 1. size 与 tail 更新顺序错误：
 *    - 错误：addAtHead 中先判断 isEmpty() 再更新 size → tail 赋值失效；
 *    - 正确：先更新 size，再根据 size 判断是否更新 tail。
 * 2. 空链表判断单一化：
 *    - 错误：仅依赖 isEmpty() 判断（size>0 但 tail=null 时失效）；
 *    - 正确：增加 tail===null 兜底校验，双重保障。
 * 3. 删除操作后 tail 未同步：
 *    - 错误：删除节点后未检查 tail 是否指向被删节点 → tail 悬空；
 *    - 正确：删除后判断 nodeToDel===this.tail，同步更新 tail。
 * 4. 手动修改 size/tail：
 *    - 错误：测试时手动修改 size 但未更新 tail → 状态不一致；
 *    - 禁止：所有 size/tail 修改必须通过类方法，不手动操作。
 * 5. 尾节点更新遗漏：
 *    - 错误：addAtIndex 插入到尾部时未更新 tail → tail 指向错误；
 *    - 正确：index===this.size 时，强制 this.tail = newNode。
 */
```
## 双链表

```ts
/**
 * 链表节点类：定义单个节点的结构
 * @param {number} val - 节点存储的值
 */
class LinkedNode {
  constructor(val) {
    this.val = val;       // 节点值
    this.next = null;     // 指向下一个节点的指针，初始化为null（避免悬空）
    this.prev = null;
  }
}

/**
 * LeetCode 707. 设计链表 修复版
 * 核心修复：解决 addAtTail 中 this.tail 为 null 导致的 "Cannot set properties of null" 报错
 * 核心思路：保证 size 与 tail 状态严格同步，增加兜底校验
 */
class MyLinkedList {
  constructor() {
    this.dummyHead = new LinkedNode('_dummyHead'); // 虚拟头节点（操作锚点）
    this.dummyTail = new LinkedNode('_dummyTail'); // 虚拟头节点（操作锚点）
    this.size = 0;     // 链表长度（核心边界判断依据）
    // 【初始化约束】size=0 时 tail 必须为 null；size>0 时 tail 必须指向最后一个节点
  }

  /**
   * 辅助方法：判断链表是否为空
   * @returns {boolean} 链表是否为空
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
    // 【基础校验】索引越界直接返回-1
    if (index < 0 || index >= this.size) return -1;

    let pointer = this.dummyHead.next; // 从真实头节点开始遍历
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }
    return pointer.val;
  }

  /**
   * 头部插入节点
   * @param {number} val - 要插入的值
   * 【核心修复点1】调整 size 与 tail 更新顺序，避免 tail 赋值失效
   */
  addAtHead(val) {
    const newNode = new LinkedNode(val);
    // 指针重连：新节点指向原真实头节点，虚拟头指向新节点
    newNode.next = this.dummyHead.next;
    this.dummyHead.next = newNode;

    // 【易错点1】必须先更新 size，再判断 tail —— 原逻辑先判断后更新，导致 tail 赋值失效
    this.size++; 
    // size=1 说明是空链表插入，新节点同时是尾节点
    if (this.size === 1) {
      this.dummyTail.prev = newNode.next
      // 【反例错误】原逻辑 if (this.isEmpty()) { this.tail = newNode; }
      // 问题：isEmpty() 依赖 size，此时 size 未更新仍为0，判断为true；但如果 size 更新在前，isEmpty() 为false，tail 赋值失效
    }
  }

  /**
   * 尾部插入节点
   * @param {number} val - 要插入的值
   * 【核心修复点2】增加 tail 兜底校验，解决 tail 为 null 但 size>0 的异常场景
   */
  addAtTail(val) {
    // 【兜底校验】双重判断（size为空 或 tail为null），彻底避免操作 null.next
    // 【易错点2】原逻辑仅判断 isEmpty()，但存在 size>0 但 tail=null 的异常场景（如手动修改size）
    if (this.isEmpty() || this.tail === null) {
      this.addAtHead(val); // 空链表/异常场景复用头插逻辑
      return;
    }

    const newNode = new LinkedNode(val);
    // 此时 tail 必不为 null，不会触发 "Cannot set properties of null" 报错
    this.dummyHead.prev = newNode; // 原尾节点指向新节点
    this.size++;              // 长度+1（与 tail 同步更新）
  }

  /**
   * 指定索引插入节点
   * @param {number} index - 插入位置
   * @param {number} val - 要插入的值
   */
  addAtIndex(index, val) {
    // 边界处理：index<=0 插头部，index>size 不插入
    if (index <= 0) {
      this.addAtHead(val);
      return;
    }
    if (index > this.size) return;

    // 找到插入位置的前驱节点
    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const newNode = new LinkedNode(val);
    // 先连后断：避免指针丢失
    newNode.next = pointer.next;
    pointer.next = newNode;

    // 【易错点3】插入到尾部时，强制更新 tail（避免 tail 与 size 不同步）
    if (index === this.size) {
      this.tail = newNode;
    }
    this.size++; // 长度+1
  }

  /**
   * 删除头部节点
   * 【核心修复点3】删除后同步更新 tail，避免 size>0 但 tail=null
   */
  deleteAtHead() {
    if (this.isEmpty()) return; // 空链表直接返回

    const oldHead = this.dummyHead.next; // 保存原头节点
    this.dummyHead.next = oldHead.next;  // 跳过原头节点
    oldHead.next = null;                 // 释放引用（规范操作）

    this.size--; // 先更新 size，再处理 tail

    // 【易错点4】删除后为空链表，tail 置 null；否则检查 tail 是否指向被删节点
    if (this.size === 0) {
      this.tail = null; // 强制置空，保证 size=0 时 tail=null
    } else if (oldHead === this.tail) {
      // 单节点删除后，tail 指向新的头节点（避免 tail 指向已删除的节点）
      this.tail = this.dummyHead.next;
    }
  }

  /**
   * 删除尾部节点
   */
  deleteAtTail() {
    if (this.isEmpty()) return;

    // 单节点链表直接删头部（复用逻辑，避免重复代码）
    if (this.size === 1) {
      this.deleteAtHead();
      return;
    }

    // 找到倒数第二个节点（尾节点的前驱）
    let pointer = this.dummyHead;
    while (pointer.next.next) {
      pointer = pointer.next;
    }

    pointer.next.next = null; // 释放尾节点引用
    this.tail = pointer.next; // 更新尾节点为倒数第二个节点
    this.size--;              // 长度-1（与 tail 同步）
  }

  /**
   * 删除指定索引节点
   * @param {number} index - 要删除的索引
   * 【核心修复点4】删除尾节点时强制更新 tail，保证状态同步
   */
  deleteAtIndex(index) {
    // 基础校验：索引越界/空链表直接返回
    if (index < 0 || index >= this.size || this.isEmpty()) {
      return;
    }

    // 找到待删除节点的前驱节点
    let pointer = this.dummyHead;
    for (let i = 0; i < index; i++) {
      pointer = pointer.next;
    }

    const nodeToDel = pointer.next; // 保存待删除节点
    pointer.next = nodeToDel.next;  // 跳过待删除节点
    nodeToDel.next = null;          // 释放引用

    this.size--; // 先更新 size，再处理 tail

    // 【易错点5】删除后为空链表，tail 置 null；删除的是尾节点，更新 tail 为前驱
    if (this.size === 0) {
      this.tail = null; // 强制同步：size=0 → tail=null
    } else if (nodeToDel === this.tail) {
      // 删的是尾节点，tail 指向删除后的最后一个节点（pointer.next），无节点则指向 pointer
      this.tail = pointer.next || pointer;
    }
  }
}

// ====================== 错误复现 & 修复验证测试用例 ======================
/**
 * 测试1：复现原报错场景（手动制造 size 与 tail 不同步）
 * 原代码执行会报错：Cannot set properties of null (setting 'next')
 * 修复后执行无报错，正常插入
 */
const test1 = new MyLinkedList();
test1.size = 1; // 手动修改size，模拟 size>0 但 tail=null 的异常场景
test1.addAtTail(5); // 修复后走头插逻辑，无报错
console.log("测试1 - get(0):", test1.get(0)); // 输出5，验证成功

/**
 * 测试2：正常场景全覆盖（头插→尾插→删尾→删头）
 * 验证所有操作后 size 与 tail 同步，无报错
 */
const test2 = new MyLinkedList();
test2.addAtHead(1);    // size=1, tail=1
test2.addAtTail(3);    // size=2, tail=3（无报错）
console.log("测试2 - get(1):", test2.get(1)); // 输出3，验证尾插成功
test2.deleteAtTail();  // size=1, tail=1
console.log("测试2 - get(0):", test2.get(0)); // 输出1，验证删尾成功
test2.deleteAtHead();  // size=0, tail=null
console.log("测试2 - get(0):", test2.get(0)); // 输出-1，验证删头成功

// ====================== 核心易错点汇总（针对本次报错） ======================
/**
 * 【addAtTail 报错 高频易错点】
 * 1. size 与 tail 更新顺序错误：
 *    - 错误：addAtHead 中先判断 isEmpty() 再更新 size → tail 赋值失效；
 *    - 正确：先更新 size，再根据 size 判断是否更新 tail。
 * 2. 空链表判断单一化：
 *    - 错误：仅依赖 isEmpty() 判断（size>0 但 tail=null 时失效）；
 *    - 正确：增加 tail===null 兜底校验，双重保障。
 * 3. 删除操作后 tail 未同步：
 *    - 错误：删除节点后未检查 tail 是否指向被删节点 → tail 悬空；
 *    - 正确：删除后判断 nodeToDel===this.tail，同步更新 tail。
 * 4. 手动修改 size/tail：
 *    - 错误：测试时手动修改 size 但未更新 tail → 状态不一致；
 *    - 禁止：所有 size/tail 修改必须通过类方法，不手动操作。
 * 5. 尾节点更新遗漏：
 *    - 错误：addAtIndex 插入到尾部时未更新 tail → tail 指向错误；
 *    - 正确：index===this.size 时，强制 this.tail = newNode。
 */
```
