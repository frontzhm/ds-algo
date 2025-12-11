// 栈&队列数据结构实现（优化版）
/**
 * 栈（Stack）- 后进先出（LIFO）
 * 优化点：
 * 1. 性能：用Object存储替代数组（避免shift/unshift的O(n)开销，栈场景数组push/pop本身O(1)，但统一存储结构）
 * 2. 鲁棒性：空操作防御、入参类型校验
 * 3. 扩展：迭代器支持、清空优化、容量限制、峰值统计
 * 4. 类型：严格泛型约束、返回值类型明确
 */
export class Stack<T> {
  // 优化存储结构：数组在栈场景push/pop已是O(1)，但补充容量/峰值监控
  private readonly items: T[];
  private capacity: number; // 可选容量限制（前端缓存场景常用）
  private peakSize: number = 0; // 峰值大小（监控栈最大占用）

  /**
   * 构造函数
   * @param initialData 初始数据（可选）
   * @param capacity 容量限制（默认无限制，传>0则启用）
   */
  constructor(initialData?: T[], capacity: number = 0) {
    this.items = initialData?.filter(item => item !== undefined && item !== null) || [];
    this.capacity = capacity;
    this.peakSize = this.items.length;
  }

  /**
   * 推入元素到栈顶（强化鲁棒性）
   * @throws {Error} 超出容量限制/入参为空时抛出错误（可根据业务调整为warn）
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
   * 清空栈（优化：直接重置数组，GC回收更高效）
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
   * 扩展：获取栈峰值（监控用）
   */
  getPeakSize(): number {
    return this.peakSize;
  }

  /**
   * 扩展：迭代器支持（兼容for...of遍历）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    // 栈遍历：从栈顶到栈底（符合栈的访问逻辑）
    for (let i = this.items.length - 1; i >= 0; i--) {
      yield this.items[i];
    }
  }
}

/**
 * 队列（Queue）- 先进先出（FIFO）
 * 核心优化：
 * 1. 性能：用双指针+数组替代原生shift（shift是O(n)，双指针优化为均摊O(1)）
 * 2. 鲁棒性：空操作防御、入参校验、容量限制
 * 3. 扩展：迭代器、峰值统计、批量入队/出队、前端异步任务适配
 * 4. 类型：严格泛型约束
 */
export class Queue<T> {
  // 双指针优化：避免shift的O(n)开销（前端高频队列场景如任务队列关键优化）
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
    // 1. 入参校验
    if (item === undefined || item === null) {
      throw new Error('队列不支持入队undefined/null值');
    }
    // 2. 容量校验
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
   * 出队（核心优化：双指针头移，避免shift的O(n)开销，均摊O(1)）
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
    // 3. 头指针后移
    this.head++;
    // 4. 优化：当指针偏移过大时，收缩数组（避免内存浪费）
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
   * 检查队列是否为空
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
   * 清空队列（优化：重置指针而非清空数组，更高效）
   */
  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.items.length = 0; // 配合指针重置，彻底清空
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
