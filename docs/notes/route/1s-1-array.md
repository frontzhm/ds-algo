# 从静态数组到环形数组：手把手实现与底层原理剖析

数组作为最基础的数据结构，其核心优势是O(1)级随机访问能力，而动态数组与环形数组则是在静态数组基础上的优化与拓展。本文将先拆解静态数组的存储原理与增删查改逻辑，再一步步实现新手友好的闭区间环形数组，帮你吃透数组类结构的底层运行机制。

## TL;DR

![circle\_arr.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/217ef6628cf648c3a34eec6d81ce8adb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTA1NjUzMzA5OTQxNDk1In0%3D&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1769727947&x-orig-sign=EMCZhfxFl1MwEfUZGnSL37a%2B9%2B0%3D)

## 一、数组顺序存储的基本原理

静态数组是一段连续的内存空间，通过首地址和索引即可直接计算目标元素的内存地址，这也是其随机访问高效的核心原因。

## 1. 静态数组的内存机制

以C++代码为例，静态数组的内存分配与访问逻辑如下：

```c++

// 开辟10个int类型的连续内存空间，共40字节（1个int占4字节）
// arr为指针，指向这段空间的首地址
int arr[10];

// 初始化内存，避免二手内存数据干扰
memset(arr, 0, sizeof(arr));

// 给首地址对应的内存写入1
arr[0] = 1;
// 给首地址偏移4字节（1*sizeof(int)）的位置写入2
arr[1] = 2;

// 随机访问：通过索引计算地址，时间复杂度O(1)
int a = arr[0];
```

由于内存寻址时间可视为O(1)，静态数组的随机访问（查、改）操作时间复杂度均为O(1)，但增删操作受限于连续内存特性，效率会因位置不同而有差异。

## 2. 基于静态数组的实现动态数组的增删查改操作

数组的核心职责是增删查改，其中查和改基于随机访问特性已实现高效，重点在于增删操作的逻辑与复杂度分析。
通过对静态数组的操作来理解动态数组的API。

### （1）增加操作

增加操作分“空间未满”和“空间已满”两种场景，复杂度随插入位置变化。

**场景1：空间未满**

现有长度为10的数组，前4个元素为0、1、2、3：

*   尾部追加（push）：直接给索引4赋值，时间复杂度O(1)，代码为`arr[4] = 4`。

*   中间插入（insert）：需倒序移动元素腾位置，避免覆盖已有数据，时间复杂度O(N)。例如在索引2插入666：

```c++

// 倒序移动索引2及后续元素，给新元素腾位置
for (int i = 4; i > 2; i--) {
    arr[i] = arr[i - 1];
}
// 插入新元素
arr[2] = 666;
```

**场景2：空间已满**

当数组填满时，需执行“扩容”操作：重新申请更大内存、复制原数据、释放旧内存，整体时间复杂度O(N)。例如给满元素数组追加10：

```c++

// 申请容量为20的新数组
int newArr[20];
// 复制原数组数据
for (int i = 0; i < 10; i++) {
    newArr[i] = arr[i];
}
// 释放旧数组内存（避免内存泄漏）
// ...
// 追加新元素
newArr[10] = 10;
```

### （2）删除操作

删除操作同样分尾部和中间位置，核心是数据搬移与标记删除。

现有长度为10的数组，前4个元素为0、1、2、3：

*   尾部删除：直接标记尾部元素为特殊值（如-1），时间复杂度O(1)，代码为`arr[3] = -1`。

*   中间删除：需正序移动元素覆盖待删除位置，时间复杂度O(N)。例如删除索引1的元素：

```c++

// 正序移动元素，覆盖待删除位置
for (int i = 1; i < 4; i++) {
    arr[i] = arr[i + 1];
}
// 标记最后一个位置为删除状态
arr[4] = -1;
```

### （3）时间复杂度总结

*   增：尾部追加O(1)，中间插入O(N)，扩容O(N)；

*   删：尾部删除O(1)，中间删除O(N)；

*   查/改：随机访问O(1)。

动态数组的本质的是对静态数组的封装，自动处理扩缩容，简化用户操作，而环形数组则是进一步优化了动态数组的空间利用率。

## 二、手把手实现闭区间环形数组（

环形数组通过“首尾衔接”的逻辑复用数组空间，闭区间版本的核心是让`start`和`end`均指向有效元素（`start`为第一个，`end`为最后一个），逻辑更贴合直觉，下面从0到1分步实现。

## 1. 核心规则前置（必记）

所有操作均围绕以下规则展开，避免指针混乱和逻辑错误：

| 核心概念     | 定义/规则                                       |
| -------- | ------------------------------------------- |
| capacity | 物理容量，底层数组的长度，支持动态扩缩容                        |
| count    | 有效元素个数，判断空/满的核心依据（优先使用，不依赖指针）               |
| start    | 闭区间起点，指向第一个有效元素的索引                          |
| end      | 闭区间终点，指向最后一个有效元素的索引                         |
| 空数组      | count === 0（禁止用start === end判断，满数组也可能出现该情况） |
| 满数组      | count === capacity（唯一判断标准）                  |
| 新增元素     | 先移动指针，再赋值（尾部增移end，头部增移start）                |
| 删除元素     | 先清空值，再移动指针（尾部删移end，头部删移start）               |

## 2. 第一步：初始化类与基础辅助方法

先搭建类的骨架，实现判断空/满、获取有效个数、遍历等基础方法，为后续核心操作铺垫。

```javascript

/**
 * 闭区间环形数组（新手友好版）
 * 核心规则：[start, end] 均为有效元素，start=第一个，end=最后一个
 */
class CycleArrayClosed {
  // 构造函数：初始化物理容量（默认1）
  constructor(initSize = 1) {
    this.capacity = initSize; // 物理容量
    this.arr = new Array(initSize); // 底层存储数组
    this.start = 0; // 有效元素起始索引（闭区间）
    this.end = 0; // 有效元素结束索引（闭区间）
    this.count = 0; // 有效元素个数（核心判断依据）
  }

  // 辅助方法1：判断数组是否为空
  isEmpty() {
    return this.count === 0;
  }

  // 辅助方法2：判断数组是否已满
  isFull() {
    return this.count === this.capacity;
  }

  // 辅助方法3：获取有效元素个数（对外暴露）
  getCount() {
    return this.count;
  }

  // 辅助方法4：遍历所有有效元素（调试/展示用）
  traverse() {
    const result = [];
    if (this.isEmpty()) return result;

    // 分两种场景遍历，避免环形场景漏元素
    if (this.start <= this.end) {
      // 场景1：线性区间（未绕圈）
      for (let i = this.start; i <= this.end; i++) {
        result.push(this.arr[i]);
      }
    } else {
      // 场景2：环形区间（已绕圈），分两段遍历
      for (let i = this.start; i < this.capacity; i++) {
        result.push(this.arr[i]);
      }
      for (let i = 0; i <= this.end; i++) {
        result.push(this.arr[i]);
      }
    }
    return result;
  }
}
```

**测试基础方法**：

```javascript

// 初始化容量为3的环形数组
const arr = new CycleArrayClosed(3);
console.log("是否为空：", arr.isEmpty()); // true
console.log("有效个数：", arr.getCount()); // 0
console.log("遍历结果：", arr.traverse()); // []
```

## 3. 第二步：实现扩缩容（resize）核心方法

环形数组扩容时，需将旧数组的有效元素“平铺”到新数组开头，重置指针使新数组回归线性状态，避免后续操作复杂。缩容则在有效元素过少时触发，优化空间利用率。

```javascript

/**
 * 扩容/缩容方法
 * @param {number} newCapacity - 新的物理容量
 */
resize(newCapacity) {
  const newArr = new Array(newCapacity);
  // 复制旧数组有效元素到新数组
  for (let i = 0; i < this.count; i++) {
    // 核心公式：环形遍历旧数组有效元素
    // (start + i) % capacity 可适配线性/环形两种场景
    const oldIndex = (this.start + i) % this.capacity;
    newArr[i] = this.arr[oldIndex];
  }
  // 替换底层数组，重置指针和容量
  this.arr = newArr;
  this.start = 0; // 新数组有效元素从0开始
  this.end = this.count - 1; // 闭区间终点为最后一个有效元素索引
  this.capacity = newCapacity;
}
```

**测试扩容逻辑**：

```javascript

const arr = new CycleArrayClosed(3);
// 手动模拟填充元素
arr.arr[0] = 1;
arr.arr[1] = 2;
arr.arr[2] = 3;
arr.start = 0;
arr.end = 2;
arr.count = 3;

console.log("扩容前遍历：", arr.traverse()); // [1,2,3]
arr.resize(5); // 扩容到5
console.log("扩容后容量：", arr.capacity); // 5
console.log("扩容后遍历：", arr.traverse()); // [1,2,3]
console.log("扩容后指针：start=", arr.start, "end=", arr.end); // start=0, end=2
```

## 4. 第三步：实现尾部添加（addLast）

尾部添加遵循“先移指针再赋值”规则，空数组需特殊处理，满数组先扩容。

```javascript

/**
 * 尾部添加元素（时间复杂度O(1)）
 * 规则：满了先扩容 → 空数组特殊处理 → 非空先移end再赋值
 */
addLast(val) {
  // 满数组先扩容（扩容2倍为行业通用策略，平衡效率与空间）
  if (this.isFull()) {
    this.resize(this.capacity * 2);
  }

  // 空数组：直接赋值到0位置，指针均指向0
  if (this.isEmpty()) {
    this.arr[0] = val;
    this.start = 0;
    this.end = 0;
  } else {
    // 非空数组：右移end指针（取模实现环形衔接），再赋值
    this.end = (this.end + 1) % this.capacity;
    this.arr[this.end] = val;
  }

  this.count++; // 有效元素个数+1
}
```

**测试尾部添加**：

```javascript

const arr = new CycleArrayClosed(3);
// 填充3个元素（填满容量）
arr.addLast(1);
arr.addLast(2);
arr.addLast(3);
console.log("添加3个元素后遍历：", arr.traverse()); // [1,2,3]
console.log("是否满：", arr.isFull()); // true

// 追加第4个元素（触发扩容到6）
arr.addLast(4);
console.log("扩容后容量：", arr.capacity); // 6
console.log("扩容后遍历：", arr.traverse()); // [1,2,3,4]
```

## 5. 第四步：实现头部添加（addFirst）

头部添加遵循“先移指针再赋值”规则，空数组可复用addLast逻辑，左移指针时需加capacity避免负数。

```javascript

/**
 * 头部添加元素（时间复杂度O(1)）
 * 规则：满了先扩容 → 空数组调用addLast → 非空先移start再赋值
 */
addFirst(val) {
  if (this.isFull()) {
    this.resize(this.capacity * 2);
  }

  // 空数组复用尾部添加逻辑，避免重复代码
  if (this.isEmpty()) {
    this.addLast(val);
  } else {
    // 左移start指针（+capacity确保索引非负）
    this.start = (this.start - 1 + this.capacity) % this.capacity;
    this.arr[this.start] = val;
    this.count++;
  }
}
```

**测试头部添加**：

```javascript

const arr = new CycleArrayClosed(3);
arr.addFirst(1);
console.log("头部加1后遍历：", arr.traverse()); // [1]
console.log("start指针：", arr.start); // 2（(0-1+3)%3=2）

// 再添加2个元素（填满容量）
arr.addFirst(2);
arr.addFirst(3);
console.log("填满后遍历：", arr.traverse()); // [3,2,1]

// 追加第4个元素（触发扩容）
arr.addFirst(4);
console.log("扩容后遍历：", arr.traverse()); // [4,3,2,1]
```

## 6. 第五步：实现尾部删除（removeLast）

尾部删除遵循“先清空值再移指针”规则，只剩1个元素时需重置指针，有效元素过少时触发缩容。

```javascript

/**
 * 尾部删除元素（时间复杂度O(1)）
 * 规则：空数组抛错 → 清空end值 → 移指针 → 缩容判断
 */
removeLast() {
  if (this.isEmpty()) {
    throw new Error("CycleArray is empty, cannot remove last element");
  }

  // 清空当前end位置的值，避免内存泄漏
  this.arr[this.end] = null;

  // 只剩1个元素：删除后变为空数组，重置指针
  if (this.count === 1) {
    this.start = 0;
    this.end = 0;
  } else {
    // 左移end指针（+capacity确保索引非负）
    this.end = (this.end - 1 + this.capacity) % this.capacity;
  }

  this.count--;

  // 缩容：有效元素为容量1/4时缩容到1/2，避免频繁缩容
  if (this.count > 0 && this.count === this.capacity / 4) {
    this.resize(Math.floor(this.capacity / 2));
  }
}
```

## 7. 第六步：实现头部删除（removeFirst）

头部删除遵循“先清空值再移指针”规则，只剩1个元素时复用removeLast逻辑，缩容逻辑与尾部删除一致。

```javascript

/**
 * 头部删除元素（时间复杂度O(1)）
 * 规则：空数组抛错 → 只剩1个元素调用removeLast → 清空start值 → 移指针 → 缩容
 */
removeFirst() {
  if (this.isEmpty()) {
    throw new Error("CycleArray is empty, cannot remove first element");
  }

  // 只剩1个元素，复用尾部删除逻辑
  if (this.count === 1) {
    this.removeLast();
    return;
  }

  // 清空当前start位置的值
  this.arr[this.start] = null;
  // 右移start指针
  this.start = (this.start + 1) % this.capacity;
  this.count--;

  // 缩容判断
  if (this.count > 0 && this.count === this.capacity / 4) {
    this.resize(Math.floor(this.capacity / 2));
  }
}
```

## 8. 第七步：实现首尾元素获取（getFirst/getLast）

直接通过start/end指针取值，只需判断空数组避免报错。

```javascript

/**
 * 获取头部元素
 */
getFirst() {
  if (this.isEmpty()) {
    throw new Error("CycleArray is empty, no first element");
  }
  return this.arr[this.start];
}

/**
 * 获取尾部元素
 */
getLast() {
  if (this.isEmpty()) {
    throw new Error("CycleArray is empty, no last element");
  }
  return this.arr[this.end];
}
```

## 9. 完整代码与综合测试

### 完整代码

```javascript

class CycleArrayClosed {
  constructor(initSize = 1) {
    this.capacity = initSize;
    this.arr = new Array(initSize);
    this.start = 0;
    this.end = 0;
    this.count = 0;
  }

  isEmpty() {
    return this.count === 0;
  }

  isFull() {
    return this.count === this.capacity;
  }

  getCount() {
    return this.count;
  }

  traverse() {
    const result = [];
    if (this.isEmpty()) return result;
    if (this.start <= this.end) {
      for (let i = this.start; i <= this.end; i++) {
        result.push(this.arr[i]);
      }
    } else {
      for (let i = this.start; i < this.capacity; i++) {
        result.push(this.arr[i]);
      }
      for (let i = 0; i <= this.end; i++) {
        result.push(this.arr[i]);
      }
    }
    return result;
  }

  resize(newCapacity) {
    const newArr = new Array(newCapacity);
    for (let i = 0; i< this.count; i++) {
      const oldIndex = (this.start + i) % this.capacity;
      newArr[i] = this.arr[oldIndex];
    }
    this.arr = newArr;
    this.start = 0;
    this.end = this.count - 1;
    this.capacity = newCapacity;
  }

  addLast(val) {
    if (this.isFull()) {
      this.resize(this.capacity * 2);
    }
    if (this.isEmpty()) {
      this.arr[0] = val;
      this.start = 0;
      this.end = 0;
    } else {
      this.end = (this.end + 1) % this.capacity;
      this.arr[this.end] = val;
    }
    this.count++;
  }

  addFirst(val) {
    if (this.isFull()) {
      this.resize(this.capacity * 2);
    }
    if (this.isEmpty()) {
      this.addLast(val);
    } else {
      this.start = (this.start - 1 + this.capacity) % this.capacity;
      this.arr[this.start] = val;
      this.count++;
    }
  }

  removeLast() {
    if (this.isEmpty()) {
      throw new Error("CycleArray is empty, cannot remove last element");
    }
    this.arr[this.end] = null;
    if (this.count === 1) {
      this.start = 0;
      this.end = 0;
    } else {
      this.end = (this.end - 1 + this.capacity) % this.capacity;
    }
    this.count--;
    if (this.count > 0 && this.count === this.capacity / 4) {
      this.resize(Math.floor(this.capacity / 2));
    }
  }

  removeFirst() {
    if (this.isEmpty()) {
      throw new Error("CycleArray is empty, cannot remove first element");
    }
    if (this.count === 1) {
      this.removeLast();
      return;
    }
    this.arr[this.start] = null;
    this.start = (this.start + 1) % this.capacity;
    this.count--;
    if (this.count > 0 && this.count === this.capacity / 4) {
      this.resize(Math.floor(this.capacity / 2));
    }
  }

  getFirst() {
    if (this.isEmpty()) {
      throw new Error("CycleArray is empty, no first element");
    }
    return this.arr[this.start];
  }

  getLast() {
    if (this.isEmpty()) {
      throw new Error("CycleArray is empty, no last element");
    }
    return this.arr[this.end];
  }
}
```

### 综合测试用例

```javascript

// 初始化数组
const arr = new CycleArrayClosed(3);

// 测试新增操作
arr.addLast(1);
arr.addLast(2);
arr.addFirst(0);
console.log("新增后遍历：", arr.traverse()); // [0,1,2]
console.log("首尾元素：", arr.getFirst(), arr.getLast()); // 0 2

// 测试删除操作
arr.removeFirst();
arr.removeLast();
console.log("删除后遍历：", arr.traverse()); // [1]
console.log("有效个数：", arr.getCount()); // 1

// 测试扩容与环形遍历
arr.addLast(3);
arr.addLast(4);
arr.addFirst(5);
console.log("环形遍历：", arr.traverse()); // [5,1,3,4]

// 测试缩容
arr.removeFirst();
arr.removeLast();
arr.removeLast();
console.log("缩容后容量：", arr.capacity); // 3
console.log("缩容后遍历：", arr.traverse()); // [1]
```

# 三、核心易错点总结（新手必避坑）

1.  **忘记更新count**：增删操作后必须同步增减count，否则空/满判断会完全失效。

2.  **指针移动顺序颠倒**：新增需“先移指针再赋值”，删除需“先清空再移指针”，顺序错会导致数据覆盖或丢失。

3.  **左移指针未加capacity**：直接start-1可能得到负数索引，需通过`(start-1 + capacity) % capacity`确保索引合法。

4.  **用指针判断空/满**：start === end既可能是空数组，也可能是满数组，唯一可靠的判断是count===0（空）、count===capacity（满）。

5.  **遍历漏环形场景**：当start > end时，需分`[start, capacity-1]`和`[0, end]`两段遍历，否则会漏元素。

# 四、总结与拓展

闭区间环形数组通过指针逻辑复用空间，解决了静态数组中间增删效率低、空间利用率不足的问题，其核心优势是首尾增删均能达到O(1)时间复杂度，仅扩缩容和遍历（环形场景）需O(N)时间。

本文从静态数组原理铺垫，到分步实现环形数组，核心是帮大家理解“封装”与“优化”的思路——动态数组封装了扩缩容，环形数组则进一步优化了指针逻辑。实际开发中，JavaScript的Array本质是动态数组，而环形数组可用于实现队列、循环缓冲区等场景。

若需拓展功能，可基于本文代码实现按索引访问、修改元素等操作，核心是通过`(start + index) % capacity`计算目标元素索引。

# 五、练习

*   [641. 设计循环双端队列](https://leetcode.cn/problems/design-circular-deque/)
*   [622. 设计循环队列](https://leetcode.cn/problems/design-circular-queue/)
