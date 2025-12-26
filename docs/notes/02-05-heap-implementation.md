# 从0到1实现大小堆（MinHeap/MaxHeap）：核心逻辑+分步引导+通用方法论

堆（Heap）是基于**完全二叉树**实现的经典数据结构，核心分为最小堆（MinHeap）和最大堆（MaxHeap），是优先队列、TopK问题、堆排序的核心底层。本文从「核心概念拆解→基础结构搭建→核心方法实现→通用逻辑总结」逐步引导，每一步说明"为什么这么设计"，帮你理解堆的本质而非单纯记忆代码。

## 一、堆的核心认知（实现前必知）

### 1. 堆的本质

堆是「满足堆序性的完全二叉树」，需同时满足两个条件：

- **结构条件**：是完全二叉树（除最后一层外，每层节点满；最后一层节点靠左排列）；

- **逻辑条件（堆序性）**：

  - 最小堆：任意父节点值 ≤ 所有子节点值（堆顶是最小值）；

  - 最大堆：任意父节点值 ≥ 所有子节点值（堆顶是最大值）。

### 2. 堆的存储优势

完全二叉树可直接用**数组存储**（无需指针），通过索引快速定位父/子节点，计算规则：

| 节点索引 `i` | 父节点索引 | 左子节点索引 | 右子节点索引 |

|--------------|------------|--------------|--------------|

| 任意有效索引 | `Math.floor((i-1)/2)` | `2*i + 1` | `2*i + 2` |

例：最小堆 `[1,3,5,4,7]` 对应的完全二叉树：

```
        1（堆顶，索引0）
       /  \
      3(1) 5(2)
     / \
    4(3) 7(4)
```

### 3. 实现前的核心思考

- **核心操作**：插入（向上堆化）、弹出极值（向下堆化）是堆的灵魂，所有方法围绕这两个操作展开；

- **堆化逻辑**：插入/弹出后需通过"堆化"恢复堆序性，这是堆区别于普通完全二叉树的关键；

- **边界防御**：空堆、单元素堆、重复值、大量元素是高频边界场景；

- **复用设计**：最小堆/最大堆仅比较逻辑不同，可抽离基类减少冗余。

## 二、Step1：搭建堆的基础结构（基类+空堆）

### 1. 堆的基类设计（抽离公共逻辑）

最小堆和最大堆的核心差异仅在于"比较规则"，先实现基类抽离公共方法（判空、大小、清空、索引计算等）：

```typescript
/**
 * 堆的基类：抽离最小堆/最大堆的公共逻辑
 * 思考逻辑：
 * 1. 用数组存储完全二叉树（效率高于指针，符合堆的结构特性）；
 * 2. 泛型约束值类型，保证比较逻辑的一致性；
 * 3. 抽象方法留给子类实现（比较、向上堆化、向下堆化），体现多态；
 */
abstract class BaseHeap<T> {
  protected heap: T[]; // 存储堆的数组（完全二叉树的数组表示）

  constructor() {
    this.heap = []; // 初始化为空堆
  }

  /**
   * 基础方法：判断堆是否为空
   * 思考逻辑：空堆的唯一标志是数组长度为0，所有操作先校验空堆避免错误
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * 基础方法：获取堆的大小（节点总数）
   * 思考逻辑：直接返回数组长度，O(1) 时间复杂度
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * 基础方法：清空堆
   * 思考逻辑：直接重置数组为空，GC自动回收内存，简单高效
   */
  clear(): void {
    this.heap = [];
  }

  /**
   * 基础方法：查看堆顶元素（极值）
   * 思考逻辑：堆顶是数组第一个元素，空堆返回undefined，O(1) 时间复杂度
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.heap[0];
  }

  /**
   * 基础方法：转换为数组（返回副本）
   * 思考逻辑：避免外部修改内部堆数组，保证堆结构的安全性
   */
  toArray(): T[] {
    return [...this.heap];
  }

  /**
   * 工具方法：获取父节点索引
   * 思考逻辑：完全二叉树的数组索引规则，通用公式无需修改
   */
  protected getParentIndex(index: number): number {
    if (index === 0) return -1; // 根节点无父节点，返回-1标识
    return Math.floor((index - 1) / 2);
  }

  /**
   * 工具方法：获取左子节点索引
   */
  protected getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  /**
   * 工具方法：获取右子节点索引
   */
  protected getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /**
   * 工具方法：交换两个节点的值
   * 思考逻辑：堆化的核心操作，通过交换恢复堆序性
   */
  protected swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 抽象方法：由子类实现（最小堆/最大堆的核心差异）

  /**
   * 抽象方法：比较两个节点值，判断是否需要交换
   * @param parentVal 父节点值
   * @param childVal 子节点值
   * @returns 是否需要交换（true=需要交换，false=无需交换）
   */
  protected abstract compare(parentVal: T, childVal: T): boolean;

  /**
   * 抽象方法：向上堆化（插入元素后恢复堆序性）
   * @param index 新插入节点的索引
   */
  protected abstract bubbleUp(index: number): void;

  /**
   * 抽象方法：向下堆化（弹出堆顶后恢复堆序性）
   * @param index 要向下堆化的节点索引
   */
  protected abstract bubbleDown(index: number): void;

  /**
   * 公共方法：插入元素
   * 思考逻辑：所有堆的插入流程一致，仅堆化逻辑不同
   * 步骤：1. 新增元素到数组末尾；2. 向上堆化恢复堆序性
   */
  insert(val: T): void {
    if (val === undefined || val === null) {
      throw new Error('堆不支持插入undefined/null值');
    }
    this.heap.push(val); // 步骤1：添加到完全二叉树最后一个位置
    this.bubbleUp(this.heap.length - 1); // 步骤2：向上堆化
  }

  /**
   * 公共方法：弹出堆顶元素（极值）
   * 思考逻辑：所有堆的弹出流程一致，仅堆化逻辑不同
   * 步骤：1. 保存堆顶值；2. 最后一个元素移到堆顶；3. 向下堆化恢复堆序性
   */
  extract(): T | undefined {
    if (this.isEmpty()) return undefined;

    const top = this.heap[0]; // 保存堆顶极值
    const last = this.heap.pop(); // 取出最后一个元素

    // 非空堆：将最后一个元素移到堆顶，再向下堆化
    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return top;
  }
}
```

### 2. 最小堆（MinHeap）实现

最小堆的核心是「父节点 ≤ 子节点」，实现基类的抽象方法：

```typescript
/**
 * 最小堆：父节点值 ≤ 子节点值，堆顶是最小值
 * 思考逻辑：
 * 1. compare方法：父节点 > 子节点时需要交换（违反最小堆序性）；
 * 2. bubbleUp：新节点向上对比父节点，更小则交换，直到根节点；
 * 3. bubbleDown：堆顶向下对比子节点，找更小的子节点交换，直到满足堆序性；
 */
export class MinHeap<T> extends BaseHeap<T> {
  /**
   * 比较方法：判断父节点是否需要和子节点交换（最小堆）
   * @param parentVal 父节点值
   * @param childVal 子节点值
   * @returns true=父节点>子节点（需要交换），false=无需交换
   */
  protected compare(parentVal: T, childVal: T): boolean {
    return (parentVal as any) > (childVal as any);
  }

  /**
   * 向上堆化（最小堆）
   * 思考逻辑：
   * 1. 从新节点索引开始，向上找父节点；
   * 2. 若父节点 > 新节点，交换两者；
   * 3. 重复直到根节点或满足堆序性；
   */
  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    // 循环向上：直到根节点（parentIndex=-1）或无需交换
    while (parentIndex >= 0) {
      const currentVal = this.heap[currentIndex];
      const parentVal = this.heap[parentIndex];

      // 父节点 ≤ 子节点：满足堆序性，停止堆化
      if (!this.compare(parentVal, currentVal)) break;

      // 父节点 > 子节点：交换，继续向上堆化
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * 向下堆化（最小堆）
   * 思考逻辑：
   * 1. 从当前节点开始，找左右子节点中更小的那个；
   * 2. 若当前节点 > 最小子节点，交换两者；
   * 3. 重复直到叶子节点或满足堆序性；
   */
  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const heapLength = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let smallestIndex = currentIndex; // 记录最小节点的索引

      // 比较左子节点：左子更小则更新最小索引
      if (leftChildIndex < heapLength && this.compare(this.heap[smallestIndex], this.heap[leftChildIndex])) {
        smallestIndex = leftChildIndex;
      }

      // 比较右子节点：右子更小则更新最小索引
      if (rightChildIndex < heapLength && this.compare(this.heap[smallestIndex], this.heap[rightChildIndex])) {
        smallestIndex = rightChildIndex;
      }

      // 当前节点已是最小：满足堆序性，停止堆化
      if (smallestIndex === currentIndex) break;

      // 交换当前节点和最小子节点，继续向下堆化
      this.swap(currentIndex, smallestIndex);
      currentIndex = smallestIndex;
    }
  }

  /**
   * 对外暴露：弹出最小值（适配业务语义）
   */
  extractMin(): T | undefined {
    return this.extract();
  }
}
```

### 3. 最大堆（MaxHeap）实现

最大堆的核心是「父节点 ≥ 子节点」，仅需修改比较逻辑：

```typescript
/**
 * 最大堆：父节点值 ≥ 子节点值，堆顶是最大值
 * 思考逻辑：
 * 1. compare方法：父节点 < 子节点时需要交换（违反最大堆序性）；
 * 2. bubbleUp：新节点向上对比父节点，更大则交换，直到根节点；
 * 3. bubbleDown：堆顶向下对比子节点，找更大的子节点交换，直到满足堆序性；
 */
export class MaxHeap<T> extends BaseHeap<T> {
  /**
   * 比较方法：判断父节点是否需要和子节点交换（最大堆）
   * @param parentVal 父节点值
   * @param childVal 子节点值
   * @returns true=父节点<子节点（需要交换），false=无需交换
   */
  protected compare(parentVal: T, childVal: T): boolean {
    return (parentVal as any) < (childVal as any);
  }

  /**
   * 向上堆化（最大堆）
   * 思考逻辑：
   * 1. 从新节点索引开始，向上找父节点；
   * 2. 若父节点 < 新节点，交换两者；
   * 3. 重复直到根节点或满足堆序性；
   */
  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (parentIndex >= 0) {
      const currentVal = this.heap[currentIndex];
      const parentVal = this.heap[parentIndex];

      // 父节点 ≥ 子节点：满足堆序性，停止堆化
      if (!this.compare(parentVal, currentVal)) break;

      // 父节点 < 子节点：交换，继续向上堆化
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  /**
   * 向下堆化（最大堆）
   * 思考逻辑：
   * 1. 从当前节点开始，找左右子节点中更大的那个；
   * 2. 若当前节点 < 最大子节点，交换两者；
   * 3. 重复直到叶子节点或满足堆序性；
   */
  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const heapLength = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let largestIndex = currentIndex; // 记录最大节点的索引

      // 比较左子节点：左子更大则更新最大索引
      if (leftChildIndex < heapLength && this.compare(this.heap[largestIndex], this.heap[leftChildIndex])) {
        largestIndex = leftChildIndex;
      }

      // 比较右子节点：右子更大则更新最大索引
      if (rightChildIndex < heapLength && this.compare(this.heap[largestIndex], this.heap[rightChildIndex])) {
        largestIndex = rightChildIndex;
      }

      // 当前节点已是最大：满足堆序性，停止堆化
      if (largestIndex === currentIndex) break;

      // 交换当前节点和最大子节点，继续向下堆化
      this.swap(currentIndex, largestIndex);
      currentIndex = largestIndex;
    }
  }

  /**
   * 对外暴露：弹出最大值（适配业务语义）
   */
  extractMax(): T | undefined {
    return this.extract();
  }
}
```

## 三、Step2：核心方法验证（测试代码）

通过测试验证堆的核心功能，覆盖基础操作、堆序性、边界场景：

```typescript
// ==================== 最小堆测试 ====================
const minHeap = new MinHeap<number>();

console.log('--- 最小堆测试 ---');

// 1. 基础操作
console.log('空堆判空：', minHeap.isEmpty()); // true
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(7);
minHeap.insert(1);
console.log('堆大小：', minHeap.size()); // 4
console.log('堆顶最小值：', minHeap.peek()); // 1

// 2. 弹出极值（验证堆序性）
console.log('弹出最小值：', minHeap.extractMin()); // 1
console.log('弹出后堆顶：', minHeap.peek()); // 3
console.log('堆数组：', minHeap.toArray()); // [3,5,7]

// 3. 边界场景：重复值
minHeap.insert(3);
console.log('插入重复值后堆大小：', minHeap.size()); // 4
console.log('弹出最小值（重复值）：', minHeap.extractMin()); // 3

// ==================== 最大堆测试 ====================
const maxHeap = new MaxHeap<number>();

console.log('\n--- 最大堆测试 ---');

// 1. 基础操作
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(7);
maxHeap.insert(9);
console.log('堆顶最大值：', maxHeap.peek()); // 9

// 2. 弹出极值（验证堆序性）
console.log('弹出最大值：', maxHeap.extractMax()); // 9
console.log('弹出后堆顶：', maxHeap.peek()); // 7
console.log('堆数组：', maxHeap.toArray()); // [7,5,3]

// 3. 边界场景：大量元素
const bigHeap = new MaxHeap<number>();
for (let i = 1; i <= 1000; i++) {
  bigHeap.insert(i);
}
console.log('大量元素堆大小：', bigHeap.size()); // 1000
console.log('大量元素堆顶：', bigHeap.peek()); // 1000

// 4. 清空堆
bigHeap.clear();
console.log('清空后堆是否为空：', bigHeap.isEmpty()); // true
```

## 四、Step3：扩展实用方法（生产级优化）

基于基础实现扩展高频实用方法，适配业务场景：

```typescript
// 扩展 BaseHeap 类的实用方法（可直接添加到基类中）
abstract class BaseHeap<T> {
  // ... 原有方法 ...

  /**
   * 扩展方法：批量插入元素（优化性能）
   * 思考逻辑：
   * 1. 逐个插入的时间复杂度 O(n log n)，批量插入先填充数组再堆化 O(n)；
   * 2. 核心：从最后一个非叶子节点开始向下堆化，减少堆化次数；
   */
  batchInsert(vals: T[]): void {
    if (!Array.isArray(vals) || vals.length === 0) return;

    // 过滤无效值，添加到堆数组
    const validVals = vals.filter(val => val !== undefined && val !== null);
    this.heap.push(...validVals);

    // 批量堆化：从最后一个非叶子节点开始向下堆化
    const lastNonLeafIndex = Math.floor(this.heap.length / 2) - 1;
    for (let i = lastNonLeafIndex; i >= 0; i--) {
      this.bubbleDown(i);
    }
  }

  /**
   * 扩展方法：验证堆的合法性（调试/测试用）
   * 思考逻辑：遍历所有非叶子节点，检查是否满足堆序性
   */
  isValid(): boolean {
    const heapLength = this.heap.length;

    // 遍历所有非叶子节点
    for (let i = 0; i < Math.floor(heapLength / 2); i++) {
      const leftChildIndex = this.getLeftChildIndex(i);
      const rightChildIndex = this.getRightChildIndex(i);

      // 检查左子节点
      if (leftChildIndex < heapLength && this.compare(this.heap[i], this.heap[leftChildIndex])) {
        return false;
      }

      // 检查右子节点
      if (rightChildIndex < heapLength && this.compare(this.heap[i], this.heap[rightChildIndex])) {
        return false;
      }
    }

    return true;
  }

  /**
   * 扩展方法：TopK查询（最小堆查最大K个，最大堆查最小K个）
   * 思考逻辑：复制堆，弹出K次极值，返回结果
   */
  getTopK(k: number): T[] {
    if (k <= 0 || this.isEmpty()) return [];

    const kValid = Math.min(k, this.size());

    // 复制堆，避免修改原堆
    const tempHeap = new (this.constructor as new () => BaseHeap<T>)();
    tempHeap.heap = [...this.heap];

    const result: T[] = [];
    for (let i = 0; i < kValid; i++) {
      const val = tempHeap.extract();
      if (val !== undefined) result.push(val);
    }

    return result;
  }
}
```

## 五、堆处理的通用逻辑（核心方法论）

从实现中提炼堆的通用规律，适用于所有堆场景：

### 1. 堆的核心操作：堆化（bubbleUp/bubbleDown）

| 操作       | 触发时机       | 堆化方向 | 核心逻辑                     | 时间复杂度 |

|------------|----------------|----------|------------------------------|------------|

| 向上堆化   | 插入元素后     | 自下而上 | 新节点对比父节点，违规则交换 | O(log n)   |

| 向下堆化   | 弹出堆顶后     | 自上而下 | 父节点对比子节点，违规则交换 | O(log n)   |

| 批量堆化   | 批量插入后     | 自上而下 | 从最后一个非叶子节点开始堆化 | O(n)       |

### 2. 边界防御的通用原则

所有堆方法必须优先处理以下边界：

- 空堆：`isEmpty()` 校验，避免访问空数组索引；

- 无效值：禁止插入 `undefined/null`，避免比较错误；

- 单元素堆：弹出后直接清空，无需堆化；

- 重复值：明确是否允许（默认允许，可通过配置关闭）。

### 3. 堆与普通二叉树的核心差异

| 特性         | 堆                | 普通二叉树        | 二叉搜索树（BST） |

|--------------|-------------------|-------------------|-------------------|

| 结构         | 完全二叉树        | 任意二叉树        | 任意二叉树        |

| 核心规则     | 父-子节点有序     | 无有序规则        | 左<根<右          |

| 存储方式     | 数组（高效）      | 指针（灵活）      | 指针              |

| 核心操作     | 插入/弹出极值     | 遍历/增删查       | 有序增删查        |

| 典型应用     | 优先队列、TopK    | 通用数据存储      | 有序数据检索      |

### 4. 性能优化的通用思路

- **批量操作优先**：批量插入比逐个插入效率高（O(n) vs O(n log n)）；

- **递归改迭代**：堆化用迭代实现（本文已实现），避免深堆的栈溢出；

- **提前终止遍历**：验证堆合法性时，发现违规立即返回；

- **复用堆实例**：避免频繁创建/销毁堆对象，减少内存开销。

### 5. 堆的经典应用场景

- **优先队列**：任务调度（高优先级任务先执行）、事件驱动系统；

- **TopK问题**：从海量数据中找最大/最小的K个值（如热搜榜、销量Top10）；

- **堆排序**：时间复杂度 O(n log n) 的排序算法；

- **中位数查找**：最小堆+最大堆快速获取动态数据的中位数；

- **图算法**：Dijkstra（最短路径）、Prim（最小生成树）的核心依赖。

## 六、完整代码汇总（可直接复用）

```typescript
/**
 * 堆的基类：抽离最小堆/最大堆的公共逻辑
 * @template T 堆元素类型（需支持大小比较）
 */
abstract class BaseHeap<T> {
  protected heap: T[];

  constructor() {
    this.heap = [];
  }

  // 基础方法：判空
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  // 基础方法：获取大小
  size(): number {
    return this.heap.length;
  }

  // 基础方法：清空堆
  clear(): void {
    this.heap = [];
  }

  // 基础方法：查看堆顶
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.heap[0];
  }

  // 基础方法：转换为数组（副本）
  toArray(): T[] {
    return [...this.heap];
  }

  // 工具方法：获取父节点索引
  protected getParentIndex(index: number): number {
    if (index === 0) return -1;
    return Math.floor((index - 1) / 2);
  }

  // 工具方法：获取左子节点索引
  protected getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  // 工具方法：获取右子节点索引
  protected getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  // 工具方法：交换节点
  protected swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 抽象方法：比较父/子节点是否需要交换
  protected abstract compare(parentVal: T, childVal: T): boolean;

  // 抽象方法：向上堆化
  protected abstract bubbleUp(index: number): void;

  // 抽象方法：向下堆化
  protected abstract bubbleDown(index: number): void;

  // 公共方法：插入元素
  insert(val: T): void {
    if (val === undefined || val === null) {
      throw new Error('堆不支持插入undefined/null值');
    }
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  // 公共方法：弹出堆顶
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

  // 扩展方法：批量插入
  batchInsert(vals: T[]): void {
    if (!Array.isArray(vals) || vals.length === 0) return;

    const validVals = vals.filter(val => val !== undefined && val !== null);
    this.heap.push(...validVals);

    const lastNonLeafIndex = Math.floor(this.heap.length / 2) - 1;
    for (let i = lastNonLeafIndex; i >= 0; i--) {
      this.bubbleDown(i);
    }
  }

  // 扩展方法：验证堆合法性
  isValid(): boolean {
    const heapLength = this.heap.length;

    for (let i = 0; i < Math.floor(heapLength / 2); i++) {
      const leftChildIndex = this.getLeftChildIndex(i);
      const rightChildIndex = this.getRightChildIndex(i);

      if (leftChildIndex < heapLength && this.compare(this.heap[i], this.heap[leftChildIndex])) {
        return false;
      }

      if (rightChildIndex < heapLength && this.compare(this.heap[i], this.heap[rightChildIndex])) {
        return false;
      }
    }

    return true;
  }

  // 扩展方法：TopK查询
  getTopK(k: number): T[] {
    if (k <= 0 || this.isEmpty()) return [];

    const kValid = Math.min(k, this.size());

    // 复制堆，避免修改原堆
    const tempHeap = new (this.constructor as new () => BaseHeap<T>)();
    tempHeap.heap = [...this.heap];

    const result: T[] = [];
    for (let i = 0; i < kValid; i++) {
      const val = tempHeap.extract();
      if (val !== undefined) result.push(val);
    }

    return result;
  }
}

/**
 * 最小堆：父节点 ≤ 子节点，堆顶是最小值
 */
export class MinHeap<T> extends BaseHeap<T> {
  protected compare(parentVal: T, childVal: T): boolean {
    return (parentVal as any) > (childVal as any);
  }

  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (parentIndex >= 0) {
      const currentVal = this.heap[currentIndex];
      const parentVal = this.heap[parentIndex];

      if (!this.compare(parentVal, currentVal)) break;

      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const heapLength = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let smallestIndex = currentIndex;

      if (leftChildIndex < heapLength && this.compare(this.heap[smallestIndex], this.heap[leftChildIndex])) {
        smallestIndex = leftChildIndex;
      }

      if (rightChildIndex < heapLength && this.compare(this.heap[smallestIndex], this.heap[rightChildIndex])) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === currentIndex) break;

      this.swap(currentIndex, smallestIndex);
      currentIndex = smallestIndex;
    }
  }

  extractMin(): T | undefined {
    return this.extract();
  }
}

/**
 * 最大堆：父节点 ≥ 子节点，堆顶是最大值
 */
export class MaxHeap<T> extends BaseHeap<T> {
  protected compare(parentVal: T, childVal: T): boolean {
    return (parentVal as any) < (childVal as any);
  }

  protected bubbleUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (parentIndex >= 0) {
      const currentVal = this.heap[currentIndex];
      const parentVal = this.heap[parentIndex];

      if (!this.compare(parentVal, currentVal)) break;

      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  protected bubbleDown(index: number): void {
    let currentIndex = index;
    const heapLength = this.heap.length;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let largestIndex = currentIndex;

      if (leftChildIndex < heapLength && this.compare(this.heap[largestIndex], this.heap[leftChildIndex])) {
        largestIndex = leftChildIndex;
      }

      if (rightChildIndex < heapLength && this.compare(this.heap[largestIndex], this.heap[rightChildIndex])) {
        largestIndex = rightChildIndex;
      }

      if (largestIndex === currentIndex) break;

      this.swap(currentIndex, largestIndex);
      currentIndex = largestIndex;
    }
  }

  extractMax(): T | undefined {
    return this.extract();
  }
}

// 测试代码
if (require.main === module) {
  // 最小堆测试
  const minHeap = new MinHeap<number>();
  minHeap.insert(5);
  minHeap.insert(3);
  minHeap.insert(7);
  minHeap.insert(1);
  console.log('最小堆堆顶：', minHeap.peek()); // 1
  console.log('最小堆弹出极值：', minHeap.extractMin()); // 1

  // 最大堆测试
  const maxHeap = new MaxHeap<number>();
  maxHeap.batchInsert([5, 3, 7, 9]);
  console.log('最大堆堆顶：', maxHeap.peek()); // 9
  console.log('最大堆Top2：', maxHeap.getTopK(2)); // [9,7]
}
```

## 七、总结

实现堆的核心是「掌握堆化逻辑」：

1. 基础层：用数组存储完全二叉树，抽离基类公共逻辑；

2. 核心层：实现向上/向下堆化，恢复堆序性；

3. 扩展层：补充批量插入、TopK、合法性验证等实用方法；

4. 优化层：关注边界防御和性能优化，适配生产场景。

记住：堆的所有操作本质是「维护堆序性」，最小堆和最大堆的唯一差异是"比较规则"，掌握这个核心，就能灵活应对各种堆相关问题。

