、

# 从数组/链表到高级结构：数据结构的增删改查与场景选型（含完整实现）

数据结构的本质是「为高效操作数据而生」——不同结构的核心差异，在于增删改查的时空复杂度，以及适配的业务场景。本文从最基础的数组、链表出发，拆解基于它们衍生的常用数据结构，讲清每种结构的核心逻辑、复杂度、利弊与适用场景，并附上**可直接运行的完整实现代码**。

---

## 一、基础：数组 vs 链表（所有结构的基石）

先明确两个底层结构的核心特性，后续所有衍生结构都基于此延伸：

| 操作 | 数组 | 链表（单向） | 链表（双向） |
| --- | --- | --- | --- |
| 前增/前删 | O(n)（需搬移元素） | O(1)（改头指针） | O(1) |
| 后增/后删 | O(1)（无扩容时） | O(1)（需记录尾指针） | O(1) |
| 中间增/删 | O(n)（搬移元素） | O(n)（先找位置） | O(1)（找到位置后） |
| 按索引改/查 | O(1) | O(n)（遍历找索引） | O(n) |
| 按值改/查 | O(n)（遍历匹配） | O(n) | O(n) |
| 空间特性 | 连续内存，缓存友好，有扩容开销 | 非连续内存，每个节点存指针，无扩容 | 指针开销翻倍，增删更灵活 |

核心结论：

- 数组胜在「随机访问」，链表胜在「非连续内存 + 两端增删」；

- 所有高级数据结构，本质是「数组/链表的组合 + 规则约束」，目的是优化特定操作的复杂度。

---

## 二、常用数据结构完整实现

### 4. 双端队列 Deque

**特点**：头尾均可增删 O(1)，适合滑动窗口、回文判断、单调队列。

```JavaScript

class Deque {
  constructor(cap = 16) {
    this.cap = cap;
    this.arr = new Array(cap);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  _index(i) {
    return ((i % this.cap) + this.cap) % this.cap;
  }

  _grow() {
    const next = new Array(this.cap * 2);
    for (let i = 0; i < this.size; i++)
      next[i] = this.arr[this._index(this.head + i)];
    this.arr = next;
    this.head = 0;
    this.tail = this.size;
    this.cap *= 2;
  }

  pushBack(val) {
    if (this.size === this.cap) this._grow();
    this.arr[this.tail] = val;
    this.tail = this._index(this.tail + 1);
    this.size++;
  }

  pushFront(val) {
    if (this.size === this.cap) this._grow();
    this.head = this._index(this.head - 1);
    this.arr[this.head] = val;
    this.size++;
  }

  popBack() {
    if (this.size === 0) return null;
    this.tail = this._index(this.tail - 1);
    const val = this.arr[this.tail];
    this.size--;
    return val;
  }

  popFront() {
    if (this.size === 0) return null;
    const val = this.arr[this.head];
    this.head = this._index(this.head + 1);
    this.size--;
    return val;
  }

  peekFront() {
    return this.size ? this.arr[this.head] : null;
  }

  peekBack() {
    return this.size ? this.arr[this._index(this.tail - 1)] : null;
  }
}
```

---

### 5. 哈希表 HashMap（拉链法）

**特点**：按 key 增删改查均摊 O(1)，最常用的键值存储结构。

```JavaScript

class HashMap {
  constructor(cap = 16, loadFactor = 0.75) {
    this.cap = cap;
    this.loadFactor = loadFactor;
    this.size = 0;
    this.buckets = Array.from({ length: cap }, () => null);
  }

  _hash(key) {
    let h = 0;
    const s = String(key);
    for (let c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h % this.cap;
  }

  _resize() {
    const old = this.buckets;
    this.cap *= 2;
    this.buckets = Array.from({ length: this.cap }, () => null);
    this.size = 0;
    for (let p of old) {
      while (p) {
        this.set(p.key, p.value);
        p = p.next;
      }
    }
  }

  set(key, value) {
    if (this.size >= this.cap * this.loadFactor) this._resize();
    const i = this._hash(key);
    let p = this.buckets[i];
    while (p) {
      if (p.key === key) {
        p.value = value;
        return;
      }
      p = p.next;
    }
    this.buckets[i] = { key, value, next: this.buckets[i] };
    this.size++;
  }

  get(key) {
    let p = this.buckets[this._hash(key)];
    while (p) {
      if (p.key === key) return p.value;
      p = p.next;
    }
    return undefined;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const i = this._hash(key);
    let prev = null, p = this.buckets[i];
    while (p) {
      if (p.key === key) {
        if (prev) prev.next = p.next;
        else this.buckets[i] = p.next;
        this.size--;
        return true;
      }
      prev = p;
      p = p.next;
    }
    return false;
  }
}
```

---

### 6. 链表 + 哈希表（LinkedHashMap / LRU 核心）

**特点**：O(1) 查找 + 保留顺序，是 LRU 缓存的标准结构。

```JavaScript

class LinkedHashMap {
  constructor() {
    this.map = new Map();
    this.head = { key: null, val: null, prev: null, next: null };
    this.tail = { key: null, val: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addToTail(node) {
    const last = this.tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  set(key, val) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = val;
      this._remove(node);
      this._addToTail(node);
      return;
    }
    const node = { key, val, prev: null, next: null };
    this._addToTail(node);
    this.map.set(key, node);
  }

  get(key) {
    if (!this.map.has(key)) return undefined;
    const node = this.map.get(key);
    this._remove(node);
    this._addToTail(node);
    return node.val;
  }

  delete(key) {
    if (!this.map.has(key)) return false;
    const node = this.map.get(key);
    this._remove(node);
    this.map.delete(key);
    return true;
  }

  removeLeastUsed() {
    const node = this.head.next;
    if (node === this.tail) return null;
    this._remove(node);
    this.map.delete(node.key);
    return node.key;
  }
}
```

---

### 7. 数组 + 哈希表（O(1) 随机集合）

**特点**：增、删、查、随机访问全 O(1)，面试高频题。

```JavaScript

class RandomizedSet {
  constructor() {
    this.list = [];
    this.map = new Map();
  }

  insert(val) {
    if (this.map.has(val)) return false;
    const idx = this.list.length;
    this.list.push(val);
    this.map.set(val, idx);
    return true;
  }

  remove(val) {
    if (!this.map.has(val)) return false;
    const idx = this.map.get(val);
    const last = this.list.at(-1);
    this.list[idx] = last;
    this.map.set(last, idx);
    this.list.pop();
    this.map.delete(val);
    return true;
  }

  getRandom() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }

  has(val) {
    return this.map.has(val);
  }
}
```

---

### 9. 跳表 SkipList

**特点**：有序结构，增删查期望 O(logn)，Redis ZSet 底层实现。

```JavaScript

class SkipListNode {
  constructor(val, level) {
    this.val = val;
    this.next = new Array(level + 1).fill(null);
  }
}

class SkipList {
  constructor(maxLevel = 16, p = 0.5) {
    this.maxLevel = maxLevel;
    this.p = p;
    this.level = 0;
    this.head = new SkipListNode(-Infinity, maxLevel);
  }

  _randomLevel() {
    let l = 0;
    while (Math.random() < this.p && l < this.maxLevel) l++;
    return l;
  }

  search(val) {
    let cur = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (cur.next[i] && cur.next[i].val < val) cur = cur.next[i];
    }
    cur = cur.next[0];
    return cur && cur.val === val ? cur : null;
  }

  add(val) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let cur = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (cur.next[i] && cur.next[i].val < val) cur = cur.next[i];
      update[i] = cur;
    }
    const lv = this._randomLevel();
    if (lv > this.level) {
      for (let i = this.level + 1; i <= lv; i++) update[i] = this.head;
      this.level = lv;
    }
    const node = new SkipListNode(val, lv);
    for (let i = 0; i <= lv; i++) {
      node.next[i] = update[i].next[i];
      update[i].next[i] = node;
    }
  }

  remove(val) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let cur = this.head;
    for (let i = this.level; i >= 0; i--) {
      while (cur.next[i] && cur.next[i].val < val) cur = cur.next[i];
      update[i] = cur;
    }
    cur = cur.next[0];
    if (!cur || cur.val !== val) return false;
    for (let i = 0; i <= this.level; i++) {
      if (update[i].next[i] !== cur) break;
      update[i].next[i] = cur.next[i];
    }
    while (this.level > 0 && !this.head.next[this.level]) this.level--;
    return true;
  }

  *values() {
    let cur = this.head.next[0];
    while (cur) {
      yield cur.val;
      cur = cur.next[0];
    }
  }
}
```

---

## 三、结构选型速查表

| 需求场景               | 推荐结构              |
| ---------------------- | --------------------- |
| 头尾快速增删、定长缓存 | 环形数组              |
| 后进先出               | 栈                    |
| 先进先出               | 队列                  |
| 两端操作、滑动窗口     | 双端队列              |
| 快速键值查找           | 哈希表                |
| 有序 + O(1) 访问       | 链表+哈希表（LRU）    |
| 随机访问 + O(1) 全操作 | 数组+哈希表 RandomSet |
| 快速取最值             | 堆                    |
| 有序集合 + 范围查询    | 跳表                  |

---
