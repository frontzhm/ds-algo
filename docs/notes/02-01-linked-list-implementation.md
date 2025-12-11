# 从0到1：用JavaScript实现单向链表（图文详解）

链表是前端面试和算法学习中的核心数据结构，相比于数组，它在「插入/删除」操作上更灵活（无需移动大量元素），但也因非连续存储的特性，理解起来稍抽象。本文会用「图形化拆解+代码实现」的方式，带你从零实现一个功能完整的单向链表，覆盖增删改查、反转、迭代器等核心能力。

## 一、先搞懂：链表到底是什么？

### 1. 链表 vs 数组（直观对比）

| 特性      | 数组                   | 单向链表                       |
| --------- | ---------------------- | ------------------------------ |
| 存储方式  | 连续内存空间           | 非连续，节点通过指针连接       |
| 插入/删除 | 需移动后续元素（O(n)） | 仅修改指针（O(1)，找节点O(n)） |
| 随机访问  | 支持（arr[0]，O(1)）   | 不支持（需遍历，O(n)）         |
| 空间占用  | 固定长度，易浪费       | 按需分配，每个节点多存指针     |

### 2. 单向链表的核心结构

单向链表由「节点（Node）」组成，每个节点包含两部分：

- `val`：节点存储的值（数字、字符串、对象等）；

- `next`：指向下一个节点的指针（引用），尾节点的`next`为`null`。

#### 可视化结构

```text
头节点（head）        中间节点          尾节点（tail）
  ↓                  ↓                ↓
[val:1, next→] → [val:2, next→] → [val:3, next→null]
```

## 二、分步实现：从节点类到完整链表

### 第一步：实现链表节点类（ListNode）

节点是链表的最小单元，我们先封装节点类，包含「值校验」和「指针初始化」：

```javascript
/**
 * 链表节点类
 * @param {*} val 节点值（禁止undefined/null）
 * @param {ListNode} next 下一个节点指针，默认null
 */
class ListNode {
  constructor(val, next = null) {
    // 空值校验：避免存储无效值
    if (val === undefined || val === null) {
      throw new Error('节点值不能为undefined或null');
    }
    this.val = val; // 节点值
    this.next = next; // 下一个节点指针
  }
}
```

#### 可视化示例

创建一个值为1的节点，指向值为2的节点

```javascript
const node2 = new ListNode(2);
const node1 = new ListNode(1, node2);

// 结构：node1 → node2 → null
// [1, next→node2] → [2, next→null]
```

### 第二步：实现链表核心类（LinkedList）

我们的链表需要支持这些核心功能：

- 增：头部添加、尾部添加、指定位置插入；

- 删：删除指定值、删除指定位置节点；

- 查：查找值、获取长度、判空；

- 工具：反转、转数组、可视化打印、迭代器。

先初始化链表的基础属性：

```javascript
class LinkedList {
  constructor() {
    this.head = null; // 头节点指针，初始null
    this.tail = null; // 尾节点指针，初始null（优化尾部添加性能）
    this._size = 0; // 链表长度缓存（避免每次遍历统计）
  }

  // 1. 基础工具方法
  // 判断链表是否为空
  isEmpty() {
    return this._size === 0;
  }

  // 获取链表长度（O(1)）
  size() {
    return this._size;
  }

  // 私有方法：校验值非空
  #checkVal(val) {
    if (val === null || val === undefined) {
      throw new Error('值不能为null或undefined');
    }
  }

  // 私有方法：校验索引合法性（0 ~ size）
  #isValidIndex(index) {
    if (typeof index !== 'number' || isNaN(index)) {
      throw new Error('索引必须是有效数字');
    }
    if (!(index >= 0 && index <= this._size)) {
      throw new Error(`索引${index}越界，合法范围：0~${this._size}`);
    }
    return true;
  }
}
```

### 第三步：实现「增」操作

#### 1. 头部添加（prepend）

核心逻辑：新节点的`next`指向原头节点，更新`head`为新节点；若链表为空，`tail`也指向新节点。

##### 可视化过程

（原链表：1→2→null，头部添加0）：

```text
// 原结构
head → [1, next→2] → [2, next→null] ← tail

// 步骤1：创建新节点，next指向原head
newNode: [0, next→1]

// 步骤2：更新head为newNode
head → [0, next→1] → [1, next→2] → [2, next→null] ← tail
```

##### 代码实现

```javascript
// 头部添加元素（O(1)）
prepend(val) {
  this.#checkVal(val);
  const isEmpty = this.isEmpty();
  // 新节点的next指向原head
  const newNode = new ListNode(val, this.head);
  // 更新head
  this.head = newNode;
  // 空链表时，tail同步指向新节点
  if (isEmpty) {
    this.tail = newNode;
  }
  this._size++;
}
```

#### 2. 尾部添加（append）

核心逻辑：利用`tail`指针直接在尾部添加，无需遍历，性能O(1)；空链表时同步更新`head`。

##### 可视化过程

（原链表：0→1→null，尾部添加2）：

```text
// 原结构
head → [0, next→1] → [1, next→null] ← tail

// 步骤1：创建新节点
newNode: [2, next→null]

// 步骤2：原tail的next指向新节点，更新tail为新节点
head → [0, next→1] → [1, next→2] → [2, next→null] ← tail
```

##### 代码实现

```javascript
// 尾部添加元素（O(1)）
append(val) {
  this.#checkVal(val);
  const newNode = new ListNode(val);
  if (this.isEmpty()) {
    // 空链表：head和tail都指向新节点
    this.head = newNode;
    this.tail = newNode;
  } else {
    // 非空：原tail的next指向新节点，更新tail
    this.tail.next = newNode;
    this.tail = newNode;
  }
  this._size++;
}
```

#### 3. 指定位置插入（insertAt）

核心逻辑：找到插入位置的「前驱节点」，新节点的`next`指向前驱节点的`next`，前驱节点的`next`指向新节点。

##### 可视化过程

（链表：0→2→null，在索引1插入1）：

```text
// 原结构
head → [0, next→2] → [2, next→null] ← tail

// 步骤1：找到前驱节点（索引0的节点0）
prev: [0, next→2]

// 步骤2：创建新节点，next指向prev的next（节点2）
newNode: [1, next→2]

// 步骤3：prev的next指向newNode
head → [0, next→1] → [1, next→2] → [2, next→null] ← tail
```

##### 代码实现

```javascript
// 指定位置插入元素（O(n)）
insertAt(index, val) {
  this.#checkVal(val);
  this.#isValidIndex(index);

  // 插入头部
  if (index === 0) {
    this.prepend(val);
    return;
  }
  // 插入尾部
  if (index === this._size) {
    this.append(val);
    return;
  }

  // 插入中间：找到前驱节点
  let prev = this.head;
  let i = 0;
  while (i < index - 1) {
    prev = prev.next;
    i++;
  }
  // 新节点的next指向前驱的next，前驱的next指向新节点
  const newNode = new ListNode(val, prev.next);
  prev.next = newNode;
  this._size++;
}
```

### 第四步：实现「删」操作

#### 1. 删除指定值的第一个节点（delete）

核心逻辑：找到目标节点的「前驱节点」，让前驱节点的`next`跳过目标节点（指向目标节点的`next`）；若删除的是头/尾节点，需同步更新`head/tail`。

##### 可视化过程

（链表：0→1→2→null，删除值为1的节点）：

```text
// 原结构
head → [0, next→1] → [1, next→2] → [2, next→null] ← tail

// 步骤1：找到前驱节点（0）和目标节点（1）
prev: [0, next→1]
cur: [1, next→2]

// 步骤2：prev的next指向cur的next（2）
head → [0, next→2] → [2, next→null] ← tail
```

##### 代码实现

```javascript
// 删除指定值的第一个节点（O(n)）
delete(val) {
  try {
    this.#checkVal(val);
  } catch (e) {
    console.warn('删除失败：', e);
    return false;
  }

  if (this.isEmpty()) {
    console.warn('删除失败：链表为空');
    return false;
  }

  // 场景1：删除头节点
  if (this.head.val === val) {
    this.head = this.head.next;
    this._size--;
    // 删完为空，清空tail
    if (this.isEmpty()) {
      this.tail = null;
    }
    return true;
  }

  // 场景2：删除中间/尾节点
  let prev = this.head;
  let cur = prev.next;
  while (cur !== null) {
    if (cur.val === val) {
      prev.next = cur.next;
      // 删除的是尾节点，更新tail
      if (cur.next === null) {
        this.tail = prev;
      }
      this._size--;
      return true;
    }
    prev = cur;
    cur = cur.next;
  }

  // 场景3：未找到节点
  console.warn(`删除失败：未找到值为${val}的节点`);
  return false;
}
```

#### 2. 删除指定位置的节点（deleteAt）

核心逻辑：通过索引找到目标节点的前驱节点，逻辑和删除指定值类似，只是定位方式不同。

##### 代码实现

```javascript
// 删除指定位置的节点（O(n)）
deleteAt(index) {
  if (this.isEmpty()) {
    console.warn('删除失败：链表为空');
    return false;
  }

  try {
    this.#isValidIndex(index);
  } catch (e) {
    console.warn('删除失败：', e);
    return false;
  }

  // 场景1：删除头节点
  if (index === 0) {
    this.head = this.head.next;
    this._size--;
    if (this.isEmpty()) {
      this.tail = null;
    }
    return true;
  }

  // 场景2：删除中间/尾节点
  let prev = this.head;
  let cur = prev.next;
  let i = 1;
  while (i < index && cur !== null) {
    prev = cur;
    cur = cur.next;
    i++;
  }

  if (cur === null) {
    return false;
  }

  prev.next = cur.next;
  // 删除尾节点，更新tail
  if (cur.next === null) {
    this.tail = prev;
  }
  this._size--;
  return true;
}
```

## 第五步：实现「查」和工具方法

### 1. 查找指定值的节点（find）

```javascript
// 查找指定值的第一个节点（O(n)）
find(val) {
  try {
    this.#checkVal(val);
  } catch (e) {
    console.warn('查找失败：', e);
    return null;
  }

  let cur = this.head;
  while (cur !== null) {
    if (cur.val === val) {
      return cur;
    }
    cur = cur.next;
  }
  return null;
}
```

### 2. 反转链表（reverse）

核心逻辑：遍历链表，逐个反转节点的`next`指针（指向前驱节点），最后更新`head`和`tail`。

#### 可视化过程

（链表：0→1→2→null 反转）：

```text
// 初始状态
prev: null, cur: [0, next→1], next: 1

// 第一步：反转cur的next指向prev
cur: [0, next→null], prev: 0, cur: 1

// 第二步：反转cur的next指向prev
cur: [1, next→0], prev: 1, cur: 2

// 第三步：反转cur的next指向prev
cur: [2, next→1], prev: 2, cur: null

// 最终状态
head → [2, next→1] → [1, next→0] → [0, next→null] ← tail
```

#### 代码实现

```javascript
// 反转链表（O(n)）
reverse() {
  if (this.isEmpty() || this._size === 1) {
    return true;
  }

  let prev = null;
  let cur = this.head;
  // 原head变为新tail
  this.tail = this.head;

  while (cur !== null) {
    // 暂存下一个节点
    const next = cur.next;
    // 反转当前节点的next
    cur.next = prev;
    // 前驱节点后移
    prev = cur;
    // 当前节点后移
    cur = next;
  }

  // 原尾节点变为新head
  this.head = prev;
  return true;
}
```

### 3. 转数组（toArray）& 可视化打印（print）

```javascript
// 转换为数组（O(n)）
toArray() {
  const res = [];
  let cur = this.head;
  while (cur !== null) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

// 可视化打印链表
print() {
  if (this.isEmpty()) {
    console.log('null');
    return;
  }
  let cur = this.head;
  let str = '';
  while (cur !== null) {
    str += `${cur.val} → `;
    cur = cur.next;
  }
  str += 'null';
  console.log(str);
}
```

### 4. 迭代器（支持for...of遍历）

让链表支持ES6的`for...of`、解构赋值等语法：

```javascript
// 实现迭代器协议
*[Symbol.iterator]() {
  let cur = this.head;
  while (cur !== null) {
    yield cur.val;
    cur = cur.next;
  }
}
```

### 5. 静态方法：从数组构建链表

```javascript
// 从数组构建链表（过滤空值）
static fromArray(arr) {
  const list = new LinkedList();
  if (!Array.isArray(arr)) {
    console.warn('输入不是数组');
    return list;
  }
  arr.forEach(item => {
    if (item === null || item === undefined) return;
    try {
      list.append(item);
    } catch (e) {
      console.warn(`跳过非法值${item}：`, e);
    }
  });
  return list;
}
```

## 三、完整使用示例

```javascript
// 1. 从数组构建链表
const list = LinkedList.fromArray([1, 2, 3]);
list.print(); // 1 → 2 → 3 → null

// 2. 头部添加
list.prepend(0);
list.print(); // 0 → 1 → 2 → 3 → null

// 3. 中间插入
list.insertAt(2, 1.5);
list.print(); // 0 → 1 → 1.5 → 2 → 3 → null

// 4. 删除指定值
list.delete(1.5);
list.print(); // 0 → 1 → 2 → 3 → null

// 5. 删除指定位置
list.deleteAt(3);
list.print(); // 0 → 1 → 2 → null

// 6. 反转链表
list.reverse();
list.print(); // 2 → 1 → 0 → null

// 7. for...of遍历
for (const val of list) {
  console.log(val); // 2、1、0
}

// 8. 转数组
console.log(list.toArray()); // [2, 1, 0]
```

## 四、总结

### 1. 核心要点

- 链表的核心是「节点+指针」，增删操作的本质是修改指针指向；

- `tail`指针是性能优化点，让尾部添加从O(n)降到O(1)；

- 反转链表的关键是「暂存next节点」，避免遍历过程中链表断裂；

- 迭代器让链表适配ES6语法，使用体验更接近数组。

### 2. 应用场景

- 频繁插入/删除的场景（如消息队列、LRU缓存）；

- 数据量不确定，需动态扩展的场景（避免数组扩容的性能损耗）；

- 前端框架底层（如React的Fiber链表）。

### 3. 进阶方向

- 双向链表（每个节点增加`prev`指针，支持反向遍历）；

- 循环链表（尾节点的`next`指向头节点）；

- 带哨兵节点的链表（简化空链表/头节点操作）。

通过本文的实现，你不仅能掌握链表的核心逻辑，也能理解「指针操作」「边界处理」等编程思维——这些思维在前端算法和工程开发中都至关重要。

> （注：文档部分内容可能由 AI 生成）
