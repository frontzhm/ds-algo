# 深入浅出哈希表：原理、实现与实战应用

哈希表（Hash Table）是编程中最常用的高效数据结构之一，几乎所有编程语言的标准库都提供了哈希表的实现（如 JavaScript 的 `Map`/`Object`、Java 的 `HashMap`、Python 的 `dict`）。它以 **O(1) 平均时间复杂度** 支持增删查改操作，是解决“快速键值映射”问题的首选方案。本文将从底层原理出发，拆解哈希表的核心设计，实现两种解决哈希冲突的方案，并结合实战案例（`RandomizedCollection`）展示哈希表的灵活应用。

![hash\_x.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2307833f58b9407cbba184df472e24a5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTA1NjUzMzA5OTQxNDk1In0%3D\&rk3s=e9ecf3d6\&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018\&x-orig-expires=1769323121\&x-orig-sign=xzfMh9NRteqCYTALlEe1h1USTQ4%3D)

## 一、哈希表的核心原理：数组+哈希函数

哈希表的本质是**用数组实现的键值映射**——通过一个“哈希函数”将任意类型的 `key` 转化为数组的合法索引，从而借助数组 O(1) 的随机访问特性实现高效操作。

### 1.1 基本结构（伪代码）

```JavaScript

class MyHashMap {
    constructor() {
        // 底层存储数组
        this.table = new Array(1000).fill(null);
    }

    // 增/改：key→索引→数组赋值
    put(key, value) {
        const index = this.hash(key);
        this.table[index] = value;
    }

    // 查：key→索引→数组取值
    get(key) {
        const index = this.hash(key);
        return this.table[index];
    }

    // 删：key→索引→数组置空
    remove(key) {
        const index = this.hash(key);
        this.table[index] = null;
    }

    // 核心：哈希函数（key→合法索引）
    hash(key) {
        // 1. 计算key的哈希值（保证相同key返回相同值）
        let h = key.toString().charCodeAt(0);
        // 2. 保证哈希值非负（位运算效率高于算术运算）
        h = h & 0x7fffffff;
        // 3. 映射到数组合法索引（取模）
        return h % this.table.length;
    }
}
```

### 1.2 哈希函数的核心要求

哈希函数是哈希表的“灵魂”，必须满足三个条件：

1.  **确定性**：相同 `key` 必须返回相同索引；

2.  **高效性**：计算复杂度为 O(1)（否则哈希表整体性能退化）；

3.  **均匀性**：尽可能让不同 `key` 映射到不同索引（减少冲突）。

## 二、哈希冲突：不可避免的问题与解决方案

由于哈希函数是“无穷空间→有限空间”的映射，**哈希冲突**（不同 `key` 映射到同一索引）是必然存在的。解决冲突的核心方案有两种：**拉链法**（主流）和 **线性探查法**。

### 2.1 拉链法：数组+链表（简单易实现）

#### 核心思路

数组的每个位置存储一个**链表**，当发生哈希冲突时，将冲突的键值对追加到链表尾部。

*   增删查改：先通过哈希函数找到数组索引，再操作对应链表；

*   优势：实现简单、支持高负载因子（链表可无限延伸）；

*   劣势：链表遍历有轻微性能损耗（但平均仍为 O(1)）。

#### 完整实现（JavaScript）

```JavaScript

// 链表节点：存储key-value
class HashNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.next = null;
    }
}

class HashTableChaining {
    constructor(capacity = 10) {
        this.capacity = capacity; // 数组初始容量
        this.size = 0; // 实际存储的键值对数量
        this.loadFactor = 0.75; // 负载因子（触发扩容的阈值）
        this.table = new Array(capacity).fill(null); // 底层数组
    }

    // 哈希函数：key→索引
    hash(key) {
        let h = typeof key === 'number' ? key : key.toString().charCodeAt(0);
        h = h & 0x7fffffff; // 保证非负
        return h % this.capacity;
    }

    // 扩容：解决哈希冲突频繁的问题
    resize() {
        const oldTable = this.table;
        this.capacity *= 2; // 容量翻倍
        this.table = new Array(this.capacity).fill(null);
        this.size = 0;

        // 重新哈希并迁移数据
        for (let node of oldTable) {
            while (node) {
                this.put(node.key, node.val);
                node = node.next;
            }
        }
    }

    // 增/改
    put(key, val) {
        // 达到负载因子，先扩容
        if (this.size / this.capacity >= this.loadFactor) {
            this.resize();
        }

        const index = this.hash(key);
        // 链表为空，直接新建节点
        if (!this.table[index]) {
            this.table[index] = new HashNode(key, val);
            this.size++;
            return;
        }

        // 链表非空：遍历查找（存在则修改，不存在则追加）
        let curr = this.table[index];
        while (curr) {
            if (curr.key === key) {
                curr.val = val; // 存在，修改值
                return;
            }
            if (!curr.next) {
                curr.next = new HashNode(key, val); // 不存在，追加到尾部
                this.size++;
                return;
            }
            curr = curr.next;
        }
    }

    // 查
    get(key) {
        const index = this.hash(key);
        let curr = this.table[index];
        while (curr) {
            if (curr.key === key) {
                return curr.val;
            }
            curr = curr.next;
        }
        return null; // 未找到
    }

    // 删
    remove(key) {
        const index = this.hash(key);
        let curr = this.table[index];
        let prev = null;

        while (curr) {
            if (curr.key === key) {
                // 找到节点：删除（分头部/中间节点）
                if (prev) {
                    prev.next = curr.next;
                } else {
                    this.table[index] = curr.next;
                }
                this.size--;
                return true;
            }
            prev = curr;
            curr = curr.next;
        }
        return false; // 未找到
    }
}

// 测试拉链法哈希表
const ht = new HashTableChaining();
ht.put("a", 1);
ht.put("b", 2);
ht.put("c", 3);
console.log(ht.get("a")); // 1
ht.remove("b");
console.log(ht.get("b")); // null
```

### 2.2 线性探查法：开放寻址（复杂但无链表开销）

#### 核心思路

不使用链表，当发生哈希冲突时，**向后遍历数组找空位**（到数组末尾则绕回头部）：

*   插入：找到空位后直接存入；

*   查询：从哈希索引开始遍历，直到找到目标或空位；

*   删除：不能直接置空（会中断查询），需用**占位符**标记（如 `DELETED`）。

#### 关键难点

1.  **环形数组**：遍历到数组末尾时需绕回头部；

2.  **删除逻辑**：用占位符替代直接置空，避免查询中断。

#### 完整实现（JavaScript）

```JavaScript

class HashTableProbing {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.size = 0;
        this.loadFactor = 0.75;
        this.table = new Array(capacity).fill(null);
        this.DELETED = Symbol('deleted'); // 占位符：标记已删除
    }

    // 哈希函数
    hash(key) {
        let h = typeof key === 'number' ? key : key.toString().charCodeAt(0);
        h = h & 0x7fffffff;
        return h % this.capacity;
    }

    // 扩容
    resize() {
        const oldTable = this.table;
        this.capacity *= 2;
        this.table = new Array(this.capacity).fill(null);
        this.size = 0;

        // 迁移数据（跳过占位符）
        for (let entry of oldTable) {
            if (entry && entry !== this.DELETED) {
                this.put(entry.key, entry.val);
            }
        }
    }

    // 查找key的索引（核心：处理冲突+占位符）
    findIndex(key) {
        let index = this.hash(key);
        let start = index;

        // 环形遍历：直到找到目标/空位/遍历完
        while (this.table[index] !== null) {
            // 找到目标key
            if (this.table[index] !== this.DELETED && this.table[index].key === key) {
                return index;
            }
            // 绕回头部
            index = (index + 1) % this.capacity;
            // 遍历完一圈仍未找到
            if (index === start) {
                return -1;
            }
        }
        return index; // 返回空位索引
    }

    // 增/改
    put(key, val) {
        if (this.size / this.capacity >= this.loadFactor) {
            this.resize();
        }

        const index = this.findIndex(key);
        // 未找到：插入新值
        if (index === -1 || this.table[index] === null || this.table[index] === this.DELETED) {
            this.table[index] = { key, val };
            this.size++;
            return;
        }
        // 找到：修改值
        this.table[index].val = val;
    }

    // 查
    get(key) {
        const index = this.findIndex(key);
        if (index === -1 || this.table[index] === null || this.table[index] === this.DELETED) {
            return null;
        }
        return this.table[index].val;
    }

    // 删：用占位符标记
    remove(key) {
        const index = this.findIndex(key);
        if (index === -1 || this.table[index] === null || this.table[index] === this.DELETED) {
            return false;
        }
        this.table[index] = this.DELETED;
        this.size--;
        return true;
    }
}

// 测试线性探查法哈希表
const htProbe = new HashTableProbing();
htProbe.put(1, 10);
htProbe.put(11, 20); // 哈希冲突（1%10=1，11%10=1）
console.log(htProbe.get(11)); // 20
htProbe.remove(1);
console.log(htProbe.get(1)); // null
```

## 三、哈希表的进阶特性

### 3.1 负载因子与扩容

负载因子 = 已存储元素数 / 数组容量，是哈希表扩容的核心依据（通常设为 0.75）：

*   负载因子过高：哈希冲突频繁，性能退化；

*   负载因子过低：数组空间浪费；

*   扩容逻辑：容量翻倍，重新哈希并迁移所有数据（保证后续冲突减少）。

### 3.2 有序哈希表：哈希链表（LinkedHashMap）

标准哈希表的遍历顺序是无序的，若需保留插入顺序，可结合**哈希表+双向链表**实现：

*   哈希表：快速查找节点（O(1)）；

*   双向链表：维护插入顺序（删除节点 O(1)）。

```JavaScript

// 双向链表节点
class LinkedNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class LinkedHashMap {
    constructor() {
        // 哨兵节点：简化链表操作
        this.head = new LinkedNode(null, null);
        this.tail = new LinkedNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.map = new Map(); // 哈希表：key→节点
    }

    // 新增节点到链表尾部
    addLast(node) {
        const prev = this.tail.prev;
        prev.next = node;
        node.prev = prev;
        node.next = this.tail;
        this.tail.prev = node;
    }

    // 移除链表节点
    removeNode(node) {
        const prev = node.prev;
        const next = node.next;
        prev.next = next;
        next.prev = prev;
    }

    // 增/改
    put(key, val) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.val = val;
            return;
        }
        const newNode = new LinkedNode(key, val);
        this.addLast(newNode);
        this.map.set(key, newNode);
    }

    // 查
    get(key) {
        return this.map.has(key) ? this.map.get(key).val : null;
    }

    // 删
    remove(key) {
        if (!this.map.has(key)) return;
        const node = this.map.get(key);
        this.removeNode(node);
        this.map.delete(key);
    }

    // 按插入顺序遍历key
    keys() {
        const res = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            res.push(curr.key);
            curr = curr.next;
        }
        return res;
    }
}

// 测试有序哈希表
const lhm = new LinkedHashMap();
lhm.put("a", 1);
lhm.put("b", 2);
lhm.put("c", 3);
console.log(lhm.keys()); // ["a", "b", "c"]
lhm.remove("b");
console.log(lhm.keys()); // ["a", "c"]
```

### 3.3 支持随机访问的哈希表

若需哈希表支持“随机返回键”且**元素不重复**（如 `MyArrayHashMap`），可结合**数组+哈希表**实现，核心是用数组存储键值对、哈希表映射键与下标，兼顾 O(1) 增删查与随机访问。

*   数组：存储 `Node` 实例（含 key 和 val），支持 O(1) 随机访问，保证随机返回键的等概率性；

*   哈希表：key→元素在数组中的下标（一一对应，因元素不重复），支持 O(1) 定位元素，规避数组遍历开销。

```JavaScript


// 键值对节点：封装key和val
class Node {
    constructor(key, val) {
        this.key = key;
        this.val = val;
    }
}

class MyArrayHashMap {
    constructor() {
        // 哈希表：存储key与对应在数组中的下标，实现O(1)定位
        this.map = new Map();
        // 数组：存储Node实例，支持O(1)随机访问
        this.arr = [];
    }

    /**
     * 按key查询值
     * @param {*} key - 要查询的键
     * @return {*} 对应的值（不存在返回null）
     */
    get(key) {
        if (!this.map.has(key)) {
            return null;
        }
        // 哈希表取下标，数组直接访问
        return this.arr[this.map.get(key)].val;
    }

    /**
     * 增/改键值对（元素不重复，已存在则修改值）
     * @param {*} key - 键
     * @param {*} val - 值
     */
    put(key, val) {
        if (this.containsKey(key)) {
            // 已存在：通过下标修改对应节点的值
            let i = this.map.get(key);
            this.arr[i].val = val;
            return;
        }
        // 新增：数组尾部添加节点，哈希表记录下标
        this.arr.push(new Node(key, val));
        this.map.set(key, this.arr.length - 1);
    }

    /**
     * 按key删除键值对
     * @param {*} key - 要删除的键
     */
    remove(key) {
        if (!this.map.has(key)) {
            return;
        }

        const index = this.map.get(key); // 待删除元素下标
        const node = this.arr[index]; // 待删除节点
        const lastIndex = this.arr.length - 1;
        const lastNode = this.arr[lastIndex]; // 数组最后一个节点

        // 1. 交换待删除节点与最后一个节点位置（避免数组移位，保证O(1)）
        this.arr[index] = lastNode;
        this.arr[lastIndex] = node;

        // 2. 更新最后一个节点在哈希表中的下标映射
        this.map.set(lastNode.key, index);

        // 3. 数组删除最后一个元素（O(1)操作）
        this.arr.pop();

        // 4. 哈希表删除待删除节点的key
        this.map.delete(node.key);
    }

    /**
     * 随机返回一个键（等概率）
     * @return {*} 随机键
     */
    randomKey() {
        const n = this.arr.length;
        if (n === 0) return null; // 边界处理：空表返回null
        const randomIndex = Math.floor(Math.random() * n);
        return this.arr[randomIndex].key;
    }

    /**
     * 判断key是否存在
     * @param {*} key - 要判断的键
     * @return {boolean} 存在返回true，否则false
     */
    containsKey(key) {
        return this.map.has(key);
    }

    /**
     * 获取键值对数量
     * @return {number} 数量
     */
    size() {
        return this.map.size;
    }
}

// 测试（验证不重复特性、增删查及随机访问）
let map = new MyArrayHashMap();
map.put(1, 1);
map.put(2, 2);
map.put(3, 3);
map.put(4, 4);
map.put(5, 5);

console.log(map.get(1)); // 1（查询正常）
console.log(map.randomKey()); // 随机返回1-5中的一个键

map.remove(4); // 删除key=4的键值对
console.log(map.randomKey()); // 随机返回1-3、5中的一个键
console.log(map.randomKey()); // 再次随机，无重复元素干扰

```

## 四、哈希表的关键注意事项

### 4.1 不要混淆“Map接口”和“HashMap实现”

*   `Map` 是接口（抽象定义），不保证时间复杂度；

*   `HashMap` 是实现（哈希表），平均 O(1)；`TreeMap` 是实现（红黑树），O(logN)。

### 4.2 key必须是不可变类型

若 key 是可变类型（如数组、对象），修改后哈希值会变化，导致无法找到原数据，甚至内存泄漏。

### 4.3 拉链法 vs 线性探查法

| 特性    | 拉链法          | 线性探查法          |
| ----- | ------------ | -------------- |
| 实现难度  | 简单           | 复杂（需处理环形/占位符）  |
| 负载因子  | 无上限（链表可延伸）   | 通常≤0.75（否则性能差） |
| 性能    | 平均O(1)（链表遍历） | 平均O(1)（缓存友好）   |
| 空间利用率 | 较低（链表节点开销）   | 较高（无额外节点）      |

## 五、总结

哈希表的核心是“数组+哈希函数”，解决冲突的两大方案各有优劣（拉链法是主流）。实际开发中，需根据场景选择不同的哈希表变体：

*   普通键值映射：用标准哈希表（如 `Map`）；

*   有序遍历：用哈希链表（LinkedHashMap）；

*   随机访问+元素不重复：用数组+普通哈希表组合（如 ArrayHashMap），通过节点交换实现O(1)删除；

*   高性能场景：优先选择拉链法（实现简单、不易出错）。

## 六、练习

* [380. O(1) 时间插入、删除和获取随机元素](https://leetcode.cn/problems/insert-delete-getrandom-o1/)
* [381. O(1) 时间插入、删除和获取随机元素 - 允许重复](https://leetcode.cn/problems/insert-delete-getrandom-o1-duplicates-allowed/)
