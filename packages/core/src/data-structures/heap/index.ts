/**
 * 堆配置项（优化版）
 * @template T 堆元素类型
 */
interface HeapOptions<T> {
  // 自定义比较函数：返回值 < 0 则a优先级高于b；=0则相等；>0则b优先级高于a
  compare?: (a: T, b: T) => number;
  // 初始数据（可选，支持批量初始化）
  initialData?: T[];
  // 是否允许重复值
  allowDuplicate?: boolean;
}

/**
 * 堆的基类（优化版）- 抽离公共逻辑
 * @template T 堆元素类型
 */
abstract class BaseHeap<T> {
  protected heap: T[]; // 存储堆的数组
  protected compare: (a: T, b: T) => number; // 自定义比较函数
  protected allowDuplicate: boolean; // 是否允许重复值

  constructor(options: HeapOptions<T> = {}) {
    this.heap = [];
    // 默认比较函数（支持数字/字符串）
    this.compare =
      options.compare ||
      ((a, b) => {
        if (a === b) return 0;
        return (a as any) < (b as any) ? -1 : 1;
      });
    this.allowDuplicate = options.allowDuplicate ?? true;

    // 批量初始化数据（优化：先填充数组，再整体堆化，比逐个插入高效）
    if (options.initialData && options.initialData.length > 0) {
      this.batchInsert(options.initialData);
    }
  }

  /**
   * 私有方法：入参非空校验
   * @param val 要校验的值
   * @throws {Error} 值为空时抛出错误
   */
  private validateVal(val: T): void {
    if (val === undefined || val === null) {
      throw new Error('堆不支持插入undefined或null值');
    }
  }

  /**
   * 检查堆是否为空
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * 获取堆的大小
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * 清空堆（优化：设置length=0，减少内存分配）
   */
  clear(): void {
    this.heap.length = 0;
  }

  /**
   * 转换为数组（返回副本）
   */
  toArray(): T[] {
    return [...this.heap];
  }

  /**
   * 查看堆顶元素
   */
  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /**
   * 插入单个元素
   * @param val 要插入的元素
   */
  insert(val: T): void {
    this.validateVal(val);

    // 检查重复值（不允许则直接返回）
    if (!this.allowDuplicate && this.heap.some(item => this.compare(item, val) === 0)) {
      console.warn(`值${String(val)}已存在，不允许重复插入`);
      return;
    }

    // 1. 添加到数组末尾
    this.heap.push(val);
    // 2. 向上堆化
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * 批量插入元素（优化：先填充数组，再从最后一个非叶子节点开始堆化，减少堆化次数）
   * @param vals 要插入的元素数组
   * @returns 成功插入的数量
   */
  batchInsert(vals: T[]): number {
    if (!Array.isArray(vals)) {
      console.warn('批量插入失败：输入不是数组');
      return 0;
    }

    let successCount = 0;
    const validVals: T[] = [];

    // 过滤无效值和重复值
    vals.forEach(val => {
      try {
        this.validateVal(val);
        if (this.allowDuplicate || !this.heap.some(item => this.compare(item, val) === 0)) {
          validVals.push(val);
          successCount++;
        } else {
          console.warn(`批量插入跳过重复值：${String(val)}`);
        }
      } catch (e) {
        console.warn(`批量插入跳过无效值：${String(val)}，原因：`, e);
      }
    });

    // 批量添加到数组
    const startIndex = this.heap.length;
    this.heap.push(...validVals);

    // 批量堆化（从最后一个非叶子节点开始向下堆化，比逐个向上堆化高效）
    if (this.heap.length > 1) {
      const lastNonLeafIndex = Math.floor(this.heap.length / 2) - 1;
      for (let i = lastNonLeafIndex; i >= 0; i--) {
        this.bubbleDown(i);
      }
    }

    return successCount;
  }

  /**
   * 弹出堆顶元素
   */
  extract(): T | undefined {
    if (this.isEmpty()) return undefined;

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return top;
  }

  /**
   * 扩展：获取TopK元素（最小堆返回最大的K个，最大堆返回最小的K个）
   * @param k 要获取的元素个数
   * @returns TopK元素数组
   */
  getTopK(k: number): T[] {
    if (k <= 0) return [];
    if (k >= this.size()) return this.toArray().sort((a, b) => -this.compare(a, b));

    // 复制堆，避免修改原数据
    const tempHeap = new (this.constructor as new (opts: HeapOptions<T>) => BaseHeap<T>)({
      compare: this.compare,
      allowDuplicate: this.allowDuplicate,
      initialData: this.toArray(),
    });

    const result: T[] = [];
    const count = Math.min(k, tempHeap.size());
    for (let i = 0; i < count; i++) {
      const val = tempHeap.extract();
      if (val !== undefined) result.push(val);
    }

    return result;
  }

  /**
   * 扩展：堆排序（返回排序后的数组，不修改原堆）
   * @returns 排序后的数组（最小堆升序，最大堆降序）
   */
  sort(): T[] {
    const tempHeap = new (this.constructor as new (opts: HeapOptions<T>) => BaseHeap<T>)({
      compare: this.compare,
      allowDuplicate: this.allowDuplicate,
      initialData: this.toArray(),
    });

    const result: T[] = [];
    while (!tempHeap.isEmpty()) {
      const val = tempHeap.extract();
      if (val !== undefined) result.push(val);
    }

    return result;
  }

  /**
   * 扩展：验证堆的性质是否合法
   * @returns 是否为合法的堆
   */
  isValid(): boolean {
    const length = this.heap.length;
    // 遍历所有非叶子节点，检查是否满足堆的性质
    for (let i = 0; i < Math.floor(length / 2); i++) {
      const leftChildIndex = this.getLeftChildIndex(i);
      const rightChildIndex = this.getRightChildIndex(i);

      // 检查左子节点
      if (leftChildIndex < length && !this.checkParentChild(i, leftChildIndex)) {
        return false;
      }

      // 检查右子节点
      if (rightChildIndex < length && !this.checkParentChild(i, rightChildIndex)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 扩展：迭代器支持（兼容for...of遍历）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    // 复制堆，避免遍历过程中修改原数据
    const tempHeap = new (this.constructor as new (opts: HeapOptions<T>) => BaseHeap<T>)({
      compare: this.compare,
      allowDuplicate: this.allowDuplicate,
      initialData: this.toArray(),
    });

    while (!tempHeap.isEmpty()) {
      const val = tempHeap.extract();
      if (val !== undefined) yield val;
    }
  }

  /**
   * 抽象方法：检查父节点和子节点是否满足堆的性质
   * @param parentIndex 父节点索引
   * @param childIndex 子节点索引
   * @returns 是否满足堆的性质
   */
  protected abstract checkParentChild(parentIndex: number, childIndex: number): boolean;

  /**
   * 抽象方法：向上堆化
   * @param index 要调整的节点索引
   */
  protected abstract bubbleUp(index: number): void;

  /**
   * 抽象方法：向下堆化
   * @param index 要调整的节点索引
   */
  protected abstract bubbleDown(index: number): void;

  /**
   * 获取父节点索引
   * @param index 当前节点索引
   */
  protected getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * 获取左子节点索引
   * @param index 当前节点索引
   */
  protected getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  /**
   * 获取右子节点索引
   * @param index 当前节点索引
   */
  protected getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /**
   * 交换两个节点的值
   * @param i 节点1索引
   * @param j 节点2索引
   */
  protected swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/**
 * 最小堆（优化版）
 * @template T 元素类型
 */
export class MinHeap<T> extends BaseHeap<T> {
  constructor(options: HeapOptions<T> = {}) {
    super(options);
  }

  /**
   * 检查父节点 ≤ 子节点（最小堆性质）
   * @param parentIndex 父节点索引
   * @param childIndex 子节点索引
   * @returns 是否满足最小堆性质
   */
  protected checkParentChild(parentIndex: number, childIndex: number): boolean {
    return this.compare(this.heap[parentIndex], this.heap[childIndex]) <= 0;
  }

  /**
   * 向上堆化（最小堆：当前节点 < 父节点则交换）
   * @param index 要调整的节点索引
   */
  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0) {
      // 满足最小堆性质，停止调整
      if (this.checkParentChild(parentIndex, currentIndex)) break;

      // 交换当前节点和父节点
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * 向下堆化（最小堆：找到最小的子节点交换）
   * @param index 要调整的节点索引
   */
  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const length = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let smallestIndex = currentIndex;

      // 找到最小的子节点
      if (
        leftChildIndex < length &&
        this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = leftChildIndex;
      }
      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = rightChildIndex;
      }

      // 当前节点已是最小，停止调整
      if (smallestIndex === currentIndex) break;

      // 交换当前节点和最小子节点
      this.swap(currentIndex, smallestIndex);
      currentIndex = smallestIndex;
    }
  }

  /**
   * 弹出最小值（对外暴露的方法，适配测试用例）
   */
  extractMin(): T | undefined {
    return this.extract();
  }
}

/**
 * 最大堆（优化版）
 * @template T 元素类型
 */
export class MaxHeap<T> extends BaseHeap<T> {
  constructor(options: HeapOptions<T> = {}) {
    super(options);
  }

  /**
   * 检查父节点 ≥ 子节点（最大堆性质）
   * @param parentIndex 父节点索引
   * @param childIndex 子节点索引
   * @returns 是否满足最大堆性质
   */
  protected checkParentChild(parentIndex: number, childIndex: number): boolean {
    return this.compare(this.heap[parentIndex], this.heap[childIndex]) >= 0;
  }

  /**
   * 向上堆化（最大堆：当前节点 > 父节点则交换）
   * @param index 要调整的节点索引
   */
  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0) {
      // 满足最大堆性质，停止调整
      if (this.checkParentChild(parentIndex, currentIndex)) break;

      // 交换当前节点和父节点
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * 向下堆化（最大堆：找到最大的子节点交换）
   * @param index 要调整的节点索引
   */
  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const length = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let largestIndex = currentIndex;

      // 找到最大的子节点
      if (
        leftChildIndex < length &&
        this.compare(this.heap[leftChildIndex], this.heap[largestIndex]) > 0
      ) {
        largestIndex = leftChildIndex;
      }
      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], this.heap[largestIndex]) > 0
      ) {
        largestIndex = rightChildIndex;
      }

      // 当前节点已是最大，停止调整
      if (largestIndex === currentIndex) break;

      // 交换当前节点和最大子节点
      this.swap(currentIndex, largestIndex);
      currentIndex = largestIndex;
    }
  }

  /**
   * 弹出最大值（对外暴露的方法，适配测试用例）
   */
  extractMax(): T | undefined {
    return this.extract();
  }
}
