# JS从0到1实现栈和队列：从基础到高性能优化

栈（Stack）和队列（Queue）是前端开发中最基础也最常用的两种线性数据结构，前者遵循「后进先出（LIFO）」原则，后者遵循「先进先出（FIFO）」原则。它们广泛应用于前端路由栈、异步任务队列、表达式解析、防抖节流等场景。本文将从基础实现入手，逐步优化，最终打造出高性能、高鲁棒性且适配前端业务场景的栈和队列。

## 一、先搞懂：栈和队列的核心概念

### 1. 栈（Stack）：后进先出的"子弹夹"

栈就像装子弹的弹夹，最后压入的子弹最先被打出，核心操作只有两个：

- **入栈（push）**：将元素添加到栈顶；

- **出栈（pop）**：从栈顶移除并返回元素。

**前端典型应用场景**：

- 浏览器的前进/后退功能（路由栈）；

- 函数调用栈（JS引擎执行函数时的调用顺序）；

- 括号匹配、表达式求值等算法题。

### 2. 队列（Queue）：先进先出的"排队买票"

队列就像排队买票，先排队的人先买到票，核心操作是：

- **入队（enqueue）**：将元素添加到队尾；

- **出队（dequeue）**：从队首移除并返回元素。

**前端典型应用场景**：

- 异步任务队列（如Promise、setTimeout的任务调度）；

- 消息队列（如WebSocket推送消息的有序处理）；

- 批量请求限流（控制并发请求数）。

### 3. 核心对比

| 特性       | 栈（Stack）      | 队列（Queue）      |
| ---------- | ---------------- | ------------------ |
| 访问原则   | 后进先出（LIFO） | 先进先出（FIFO）   |
| 核心操作   | push/pop         | enqueue/dequeue    |
| 前端场景   | 路由栈、函数调用 | 异步任务、消息推送 |
| 性能关键点 | 栈顶操作O(1)     | 队首出队避免O(n)   |

## 二、基础版实现：满足核心功能

先实现最基础的栈和队列，覆盖核心API，理解数据结构的本质。

### 1. 栈的基础实现

```typescript
/**
 * 栈（基础版）- 后进先出（LIFO）
 */
export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /** 推入元素到栈顶 */
  push(item: T): void {
    this.items.push(item);
  }

  /** 弹出栈顶元素 */
  pop(): T | undefined {
    return this.items.pop();
  }

  /** 查看栈顶元素但不移除 */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /** 检查栈是否为空 */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** 获取栈的大小 */
  size(): number {
    return this.items.length;
  }

  /** 清空栈 */
  clear(): void {
    this.items = [];
  }

  /** 转换为数组 */
  toArray(): T[] {
    return [...this.items];
  }
}
```

### 2. 队列的基础实现

```typescript
/**
 * 队列（基础版）- 先进先出（FIFO）
 */
export class Queue<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /** 入队 */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** 出队（基础版用shift，存在性能问题） */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /** 查看队首元素但不移除 */
  front(): T | undefined {
    return this.items[0];
  }

  /** 检查队列是否为空 */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** 获取队列的大小 */
  size(): number {
    return this.items.length;
  }

  /** 清空队列 */
  clear(): void {
    this.items = [];
  }

  /** 转换为数组 */
  toArray(): T[] {
    return [...this.items];
  }
}
```

### 3. 基础版的问题

- **队列性能瓶颈**：`shift()` 方法会重新排列数组所有元素，时间复杂度O(n)，高频出队场景（如异步任务队列）性能极差；

- **鲁棒性不足**：允许存入`undefined/null`等无效值，空栈/空队列操作无防御；

- **功能单一**：无容量限制、批量操作、遍历支持等前端实用功能；

- **内存优化缺失**：清空操作重新赋值数组，内存分配效率低。

## 三、优化版实现：高性能+鲁棒性+前端适配

针对基础版的问题，我们从**性能、鲁棒性、前端场景**三个维度优化，打造生产级可用的栈和队列。

### 1. 栈的优化实现

核心优化：容量限制、空值校验、峰值监控、迭代器支持、内存优化。

```typescript
/**
 * 栈（优化版）- 后进先出（LIFO）
 * 优化点：
 * 1. 鲁棒性：空值校验、容量限制、空操作防御
 * 2. 性能：清空操作优化（减少内存分配）
 * 3. 扩展：峰值统计、迭代器支持（适配ES6遍历）
 * 4. 类型：严格泛型约束
 */
export class Stack<T> {
  // 数组在栈场景push/pop已是O(1)，保留数组存储并补充监控
  private readonly items: T[];
  private capacity: number; // 可选容量限制（前端缓存限流）
  private peakSize: number = 0; // 峰值大小（监控栈最大占用）

  /**
   * 构造函数
   * @param initialData 初始数据（可选）
   * @param capacity 容量限制（默认无限制，传>0则启用）
   */
  constructor(initialData?: T[], capacity: number = 0) {
    // 过滤空值，避免无效数据存储
    this.items = initialData?.filter(item => item !== undefined && item !== null) || [];
    this.capacity = capacity;
    this.peakSize = this.items.length;
  }

  /**
   * 推入元素到栈顶（强化鲁棒性）
   * @throws {Error} 超出容量/入参为空时抛出错误
   */
  push(item: T): void {
    // 1. 入参非空校验（避免存储无效值）
    if (item === undefined || item === null) {
      throw new Error('栈不支持推入undefined/null值');
    }
    // 2. 容量限制校验（前端缓存限流场景）
    if (this.capacity > 0 && this.items.length >= this.capacity) {
      throw new Error(`栈已达容量上限(${this.capacity})，无法推入新元素`);
    }
    // 3. 执行推入并更新峰值
    this.items.push(item);
    if (this.items.length > this.peakSize) {
      this.peakSize = this.items.length;
    }
  }

  /**
   * 弹出栈顶元素（空栈防御）
   * @returns 栈顶元素 | undefined（空栈时返回undefined，避免报错）
   */
  pop(): T | undefined {
    if (this.isEmpty()) {
      console.warn('栈为空，无法执行pop操作');
      return undefined;
    }
    return this.items.pop();
  }

  /**
   * 查看栈顶元素但不移除（空栈防御）
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.items.length - 1];
  }

  /**
   * 检查栈是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取栈的大小
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空栈（优化：直接重置数组长度，GC回收更高效）
   */
  clear(): void {
    this.items.length = 0; // 比重新赋值[]更高效（减少内存分配）
  }

  /**
   * 转换为数组（返回副本，避免外部修改内部数据）
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * 扩展：获取栈峰值（监控用，适配前端性能监控）
   */
  getPeakSize(): number {
    return this.peakSize;
  }

  /**
   * 扩展：迭代器支持（兼容for...of遍历，从栈顶到栈底）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    for (let i = this.items.length - 1; i >= 0; i--) {
      yield this.items[i];
    }
  }
}
```

### 2. 队列的优化实现（核心性能优化）

队列的核心痛点是`shift()`的O(n)性能问题，我们用**双指针+数组**优化，将出队操作均摊为O(1)。

```typescript
/**
 * 队列（优化版）- 先进先出（FIFO）
 * 核心优化：
 * 1. 性能：双指针替代shift，出队均摊O(1)（前端高频队列场景关键优化）
 * 2. 鲁棒性：空值校验、容量限制、空操作防御
 * 3. 扩展：批量入队、峰值统计、迭代器支持
 * 4. 内存：指针偏移过大时收缩数组，避免内存浪费
 */
export class Queue<T> {
  // 双指针优化：避免shift的O(n)开销
  private readonly items: T[];
  private head: number = 0; // 队首指针
  private tail: number = 0; // 队尾指针
  private capacity: number; // 容量限制
  private peakSize: number = 0; // 峰值大小

  /**
   * 构造函数
   * @param initialData 初始数据（可选）
   * @param capacity 容量限制（默认无限制）
   */
  constructor(initialData?: T[], capacity: number = 0) {
    this.items = [];
    this.capacity = capacity;
    // 初始化数据（过滤空值）
    if (initialData && initialData.length > 0) {
      const validData = initialData.filter(item => item !== undefined && item !== null);
      if (this.capacity > 0 && validData.length > this.capacity) {
        throw new Error(`初始数据量(${validData.length})超出队列容量(${this.capacity})`);
      }
      this.items.push(...validData);
      this.tail = validData.length;
      this.peakSize = this.tail - this.head;
    }
  }

  /**
   * 入队（优化：双指针尾插，O(1)）
   * @throws {Error} 超出容量/入参为空时抛出错误
   */
  enqueue(item: T): void {
    // 1. 入参校验（避免无效值）
    if (item === undefined || item === null) {
      throw new Error('队列不支持入队undefined/null值');
    }
    // 2. 容量校验（前端任务队列限流）
    const currentSize = this.size();
    if (this.capacity > 0 && currentSize >= this.capacity) {
      throw new Error(`队列已达容量上限(${this.capacity})，无法入队新元素`);
    }
    // 3. 双指针入队（尾插）
    this.items[this.tail] = item;
    this.tail++;
    // 4. 更新峰值
    if (this.size() > this.peakSize) {
      this.peakSize = this.size();
    }
  }

  /**
   * 出队（核心优化：双指针头移，均摊O(1)）
   * @returns 队首元素 | undefined（空队列时返回undefined）
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      console.warn('队列为空，无法执行dequeue操作');
      return undefined;
    }
    // 1. 获取队首元素
    const item = this.items[this.head];
    // 2. 清空原位置（避免内存泄漏）
    this.items[this.head] = undefined as T;
    // 3. 头指针后移（核心：替代shift，无数组重排）
    this.head++;
    // 4. 优化：指针偏移过大时收缩数组（避免内存浪费）
    if (this.head > this.capacity || this.head * 2 > this.tail) {
      this.items = this.items.slice(this.head);
      this.tail -= this.head;
      this.head = 0;
    }
    return item;
  }

  /**
   * 查看队首元素但不移除（空队列防御）
   */
  front(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.head];
  }

  /**
   * 检查队列是否为空（双指针判断）
   */
  isEmpty(): boolean {
    return this.head === this.tail;
  }

  /**
   * 获取队列的大小（双指针计算，O(1)）
   */
  size(): number {
    return this.tail - this.head;
  }

  /**
   * 清空队列（优化：重置指针而非清空数组）
   */
  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.items.length = 0;
  }

  /**
   * 转换为数组（返回副本，按FIFO顺序）
   */
  toArray(): T[] {
    return this.items.slice(this.head, this.tail);
  }

  /**
   * 扩展：获取队列峰值（监控用）
   */
  getPeakSize(): number {
    return this.peakSize;
  }

  /**
   * 扩展：批量入队（前端批量任务场景）
   * @param items 待入队的元素数组
   * @returns 成功入队的数量
   */
  batchEnqueue(items: T[]): number {
    if (!Array.isArray(items)) {
      console.warn('批量入队失败：输入不是数组');
      return 0;
    }
    let successCount = 0;
    for (const item of items) {
      try {
        this.enqueue(item);
        successCount++;
      } catch (e) {
        console.warn(`批量入队跳过元素${item}：`, e);
      }
    }
    return successCount;
  }

  /**
   * 扩展：迭代器支持（兼容for...of，按FIFO顺序遍历）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    for (let i = this.head; i < this.tail; i++) {
      yield this.items[i];
    }
  }
}
```

## 四、核心优化点解析

### 1. 性能优化

| 优化点 | 基础版问题 | 优化方案 & 收益 |
| --- | --- | --- |
| 队列出队性能 | `shift()` 是O(n) | 双指针头移，均摊O(1)（高频队列场景如异步任务队列性能提升10倍+） |
| 清空操作 | 重新赋值`[]`（内存分配） | 栈：`items.length=0`；队列：重置指针（减少内存分配，GC更高效） |
| 队列内存浪费 | 指针偏移导致数组冗余 | 指针偏移过大时收缩数组（避免长期运行内存泄漏） |

### 2. 双指针优化详解

#### 问题：原生 shift 的性能问题

```typescript
// 原始实现（性能问题）
dequeue(): T | undefined {
  return this.items.shift(); // O(n) - 需要移动所有后续元素
}
```

当队列有1000个元素时，每次`shift()`都需要移动999个元素，性能开销巨大。

#### 解决方案：双指针优化

```typescript
// 优化实现（均摊O(1)）
private head: number = 0; // 队首指针
private tail: number = 0; // 队尾指针

dequeue(): T | undefined {
  const item = this.items[this.head];
  this.items[this.head] = undefined; // 清空引用
  this.head++; // 仅移动指针，O(1)
  return item;
}
```

**性能提升**：

- 原始版本：1000次出队 = 1000 × O(n) = O(n²)
- 优化版本：1000次出队 = 1000 × O(1) = O(n)

**内存优化**：当指针偏移过大时，自动收缩数组：

```typescript
// 当 head 偏移过大时，收缩数组
if (this.head > this.capacity || this.head * 2 > this.tail) {
  this.items = this.items.slice(this.head);
  this.tail -= this.head;
  this.head = 0;
}
```

### 3. 鲁棒性强化

- **空值校验**：禁止存入`undefined/null`，避免业务逻辑处理无效数据；

- **容量限制**：支持配置最大容量，适配前端缓存限流、任务队列限流场景；

- **空操作防御**：空栈/空队列操作返回`undefined`+警告，而非直接报错；

- **初始数据校验**：初始化时过滤空值，避免初始数据包含无效值。

### 4. 前端场景适配

- **批量入队**：适配接口批量返回数据、批量任务提交场景；

- **峰值统计**：监控栈/队列的最大占用，便于前端性能分析；

- **迭代器支持**：兼容`for...of`、解构赋值、扩展运算符，与原生数组使用体验一致；

- **严格类型约束**：TypeScript泛型强化，避免类型错误。

## 五、使用示例（前端实战场景）

### 1. 栈的使用（路由栈模拟）

```typescript
// 模拟前端路由栈
const routeStack = new Stack<string>([], 5); // 容量限制5

// 页面跳转（入栈）
routeStack.push('/home');
routeStack.push('/user');
routeStack.push('/user/profile');

// 查看当前路由（栈顶）
console.log(routeStack.peek()); // /user/profile

// 页面返回（出栈）
routeStack.pop();
console.log(routeStack.peek()); // /user

// 遍历路由栈（从栈顶到栈底）
for (const route of routeStack) {
  console.log(route); // /user → /home
}

// 查看峰值
console.log(routeStack.getPeakSize()); // 3
```

### 2. 队列的使用（异步任务队列）

```typescript
// 模拟异步任务队列（容量限制3）
const taskQueue = new Queue<() => Promise<void>>([], 3);

// 定义异步任务
const task1 = () => Promise.resolve(console.log('任务1执行'));
const task2 = () => Promise.resolve(console.log('任务2执行'));
const task3 = () => Promise.resolve(console.log('任务3执行'));

// 批量入队
taskQueue.batchEnqueue([task1, task2, task3]);

// 执行任务（FIFO顺序）
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  task?.(); // 依次执行：任务1 → 任务2 → 任务3
}

// 查看队列峰值
console.log(taskQueue.getPeakSize()); // 3
```

### 3. 表达式求值（栈应用）

```typescript
function evaluateExpression(expression: string): number {
  const stack = new Stack<number>();
  const tokens = expression.split(' ');

  for (const token of tokens) {
    if (token === '+') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(a + b);
    } else if (token === '*') {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(a * b);
    } else {
      stack.push(parseInt(token));
    }
  }

  return stack.pop()!;
}

// 使用示例：计算 "3 4 + 2 *"
console.log(evaluateExpression('3 4 + 2 *')); // 14
```

### 4. 消息队列（队列应用）

```typescript
interface Message {
  type: string;
  payload: any;
  timestamp: number;
}

const messageQueue = new Queue<Message>([], 1000);

// 接收消息
function receiveMessage(message: Message) {
  try {
    messageQueue.enqueue(message);
  } catch (e) {
    console.error('消息队列已满，丢弃消息：', message);
  }
}

// 处理消息
function processMessages() {
  while (!messageQueue.isEmpty()) {
    const message = messageQueue.dequeue();
    if (message) {
      console.log('处理消息：', message);
      // 处理逻辑...
    }
  }
}
```

## 六、性能测试对比

### 队列性能对比（10000次操作）

```typescript
// 测试代码
function performanceTest() {
  const iterations = 10000;

  // 原始版本（使用shift）
  console.time('原始队列（shift）');
  const originalQueue: number[] = [];
  for (let i = 0; i < iterations; i++) {
    originalQueue.push(i);
  }
  for (let i = 0; i < iterations; i++) {
    originalQueue.shift();
  }
  console.timeEnd('原始队列（shift）');

  // 优化版本（双指针）
  console.time('优化队列（双指针）');
  const optimizedQueue = new Queue<number>();
  for (let i = 0; i < iterations; i++) {
    optimizedQueue.enqueue(i);
  }
  for (let i = 0; i < iterations; i++) {
    optimizedQueue.dequeue();
  }
  console.timeEnd('优化队列（双指针）');
}

// 预期结果：
// 原始队列（shift）: ~500ms
// 优化队列（双指针）: ~10ms
```

## 七、进阶扩展方向

基于优化版的栈和队列，可进一步扩展适配更多前端场景：

### 1. 持久化存储

结合`localStorage`/`IndexedDB`实现栈/队列持久化（如离线任务队列）：

```typescript
class PersistentStack<T> extends Stack<T> {
  private storageKey: string;

  constructor(storageKey: string, initialData?: T[]) {
    super(initialData);
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  push(item: T): void {
    super.push(item);
    this.saveToStorage();
  }

  pop(): T | undefined {
    const item = super.pop();
    this.saveToStorage();
    return item;
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.toArray()));
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const items = JSON.parse(data);
      this.clear();
      items.forEach((item: T) => super.push(item));
    }
  }
}
```

### 2. 并发安全

添加锁机制（如互斥锁），适配前端并发操作场景：

```typescript
class ConcurrentQueue<T> extends Queue<T> {
  private lock: boolean = false;

  async enqueue(item: T): Promise<void> {
    while (this.lock) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this.lock = true;
    try {
      super.enqueue(item);
    } finally {
      this.lock = false;
    }
  }
}
```

### 3. 优先级队列

基于当前队列扩展，适配前端优先级任务调度：

```typescript
interface PriorityItem<T> {
  item: T;
  priority: number;
}

class PriorityQueue<T> {
  private queue: Queue<PriorityItem<T>>;

  enqueue(item: T, priority: number): void {
    // 按优先级插入（高优先级在前）
    // 实现逻辑...
  }
}
```

### 4. 循环队列

队列进一步优化为循环数组（减少数组收缩开销，适配超高频队列场景）：

```typescript
class CircularQueue<T> extends Queue<T> {
  // 循环数组实现，避免数组收缩
  // 实现逻辑...
}
```

## 八、总结

栈和队列是前端开发的"基础工具"，掌握其实现和优化思路，不仅能解决日常业务问题（如路由管理、异步任务调度），也能提升算法题解题能力。

本文从"基础实现→核心问题→优化升级"的思路，打造了适配前端场景的高性能栈和队列，核心收获：

- **栈的核心是"栈顶操作O(1)"**，重点强化鲁棒性和监控能力；

- **队列的核心是"优化出队性能"**，双指针是解决`shift()`性能问题的关键；

- **数据结构的优化要贴合业务场景**，而非单纯追求"底层完美"。

希望本文能帮助你从"会用"栈和队列，到"懂实现、能优化"，真正掌握这两种基础数据结构。
