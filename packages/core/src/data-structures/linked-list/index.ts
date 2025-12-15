/**
 * 链表节点类（泛型实现，支持任意数据类型）
 * @template T 节点值的类型
 */
export class ListNode<T> {
  /** 节点存储的值 */
  val: T;
  /** 指向下一个节点的指针，空链表/尾节点为 null */
  next: ListNode<T> | null;

  /**
   * 构造函数：创建链表节点并做空值校验
   * @param val 节点值（禁止传入 undefined / null）
   * @param next 下一个节点指针，默认值为 null
   * @throws {Error} 当 val 为 undefined 或 null 时抛出错误
   */
  constructor(val: T, next: ListNode<T> | null = null) {
    // 空值校验：确保节点值合法
    if (val === undefined || val === null) {
      throw new Error('节点值不能为undefined或null');
    }
    this.val = val;
    this.next = next;
  }
}

/**
 * 单向链表类（功能完整版）
 * 核心特性：
 * - 泛型支持任意数据类型
 * - 空值/索引合法性校验
 * - 尾指针优化尾部操作性能（O(1)）
 * - 缓存长度避免重复遍历（O(1)）
 * - 支持迭代器、数组转换、可视化打印
 * @template T 链表存储值的类型
 */
export class LinkedList<T> {
  /** 链表头节点指针，空链表为 null */
  head: ListNode<T> | null = null;
  /** 链表尾节点指针（私有），优化尾部添加性能 */
  private tail: ListNode<T> | null = null;
  /** 链表长度缓存（私有），避免每次遍历统计 */
  private _size: number = 0;

  /**
   * 检查链表是否为空
   * @returns {boolean} 空链表返回 true，否则返回 false
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * 获取链表长度（时间复杂度 O(1)）
   * @returns {number} 链表的节点数量
   */
  size(): number {
    return this._size;
  }

  /**
   * 私有方法：校验索引合法性（插入场景）
   * @param index 待校验的索引值
   * @returns {boolean} 索引合法返回 true，否则返回 false
   * @description 合法索引范围：0 <= index <= size()（插入场景）
   */
  private isValidIndexForInsert(index: number): boolean {
    // 校验索引类型：必须是有效数字
    if (typeof index !== 'number' || isNaN(index)) {
      return false;
    }
    // 校验索引范围：0 到 链表长度（包含）
    return index >= 0 && index <= this.size();
  }

  /**
   * 私有方法：校验索引合法性（删除场景）
   * @param index 待校验的索引值
   * @returns {boolean} 索引合法返回 true，否则返回 false
   * @description 合法索引范围：0 <= index < size()（删除场景）
   */
  private isValidIndexForDelete(index: number): boolean {
    // 校验索引类型：必须是有效数字
    if (typeof index !== 'number' || isNaN(index)) {
      return false;
    }
    // 校验索引范围：0 到 链表长度（不包含）
    return index >= 0 && index < this.size();
  }

  /**
   * 私有方法：检查链表是否为空并抛出提示
   * @returns {boolean} 空链表返回 true，否则返回 false
   * @throws {Error} 空链表时抛出错误提示
   */
  private checkEmpty(): boolean {
    const res = this.isEmpty();
    if (res) {
      throw new Error('这是空链表');
    }
    return res;
  }

  /**
   * 私有方法：通用值非空校验
   * @param val 待校验的值
   * @throws {Error} 值为 null/undefined 时抛出错误
   */
  private checkVal(val: T): void {
    if (val === null || val === undefined) {
      throw new Error('值不能为undefined或null');
    }
  }

  /**
   * 头部添加元素（时间复杂度 O(1)）
   * @param val 要添加的节点值
   * @throws {Error} val 为 null/undefined 时抛出错误
   */
  prepend(val: T): void {
    // 校验值合法性
    this.checkVal(val);
    // 标记当前链表是否为空
    const isEmpty = this.isEmpty();
    // 创建新节点，next 指向原头节点
    const newNode = new ListNode(val, this.head);
    // 更新头节点为新节点
    this.head = newNode;
    // 空链表时，尾节点同步指向新节点
    isEmpty && (this.tail = newNode);
    // 链表长度+1
    this._size++;
  }

  /**
   * 尾部添加元素（时间复杂度 O(1)）
   * @param val 要添加的节点值
   * @throws {Error} val 为 null/undefined 时抛出错误
   */
  append(val: T): void {
    // 校验值合法性
    this.checkVal(val);
    // 创建新节点（尾节点 next 默认为 null）
    const newNode = new ListNode(val);

    // 空链表：头/尾节点都指向新节点
    if (this.isEmpty()) {
      this.head = this.tail = newNode;
    } else {
      // 非空链表：原尾节点 next 指向新节点，更新尾节点
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    // 链表长度+1
    this._size++;
  }

  /**
   * 指定索引位置插入元素（时间复杂度 O(n)）
   * @param index 插入位置（0 ~ size()）
   * @param val 要插入的节点值
   * @throws {Error} val 非法时抛出错误
   * @description 索引越界时不插入，静默失败（符合测试期望）
   */
  insertAt(index: number, val: T): void {
    // 校验值合法性
    this.checkVal(val);
    // 校验索引合法性（不合法时直接返回，不抛错）
    if (!this.isValidIndexForInsert(index)) {
      return;
    }

    // 插入头部：复用 prepend 方法
    if (index === 0) {
      this.prepend(val);
      return;
    }

    // 插入尾部：复用 append 方法
    if (index === this._size) {
      this.append(val);
      return;
    }

    // 插入中间：找到插入位置的前驱节点
    let prev: ListNode<T> = this.head!; // 索引合法，head 非空
    let cur = prev.next;
    let i = 1;

    // 遍历到目标索引的前驱节点
    while (i < index) {
      i++;
      prev = cur!; // 索引合法，cur 非空
      cur = cur!.next;
    }

    // 创建新节点，next 指向前驱节点的原 next
    const newNode = new ListNode(val, cur);
    // 前驱节点 next 指向新节点
    prev.next = newNode;

    // 边界处理：插入位置为尾节点前，更新尾指针
    if (cur === null) {
      this.tail = newNode;
    }

    // 链表长度+1
    this._size++;
  }

  /**
   * 删除第一个匹配指定值的节点（时间复杂度 O(n)）
   * @param val 要删除的节点值
   * @returns {boolean} 删除成功返回 true，失败（空链表/未找到）返回 false
   * @throws {Error} val 为 null/undefined 时抛出错误
   */
  delete(val: T): boolean {
    // 校验值合法性（空值直接抛错，符合测试期望）
    this.checkVal(val);

    // 检查空链表（捕获错误，返回 false 而非抛错）
    try {
      this.checkEmpty();
    } catch (e) {
      console.warn('删除失败：', e);
      return false;
    }

    // 前驱节点初始化为头节点
    let prev: ListNode<T> = this.head!;
    // 当前节点初始化为头节点的下一个节点
    let cur: ListNode<T> | null = prev.next;

    // 场景1：删除头节点
    if (prev.val === val) {
      this.head = cur;
      this._size--;
      // 删完为空，清空尾节点
      if (this.isEmpty()) {
        this.tail = null;
      }
      return true;
    }

    // 场景2：删除中间/尾节点
    while (cur !== null) {
      // 找到目标节点
      if (cur.val === val) {
        // 前驱节点 next 跳过当前节点
        prev.next = cur.next;
        // 边界处理：删除的是尾节点，更新尾指针
        if (cur.next === null) {
          this.tail = prev;
        }
        // 链表长度-1
        this._size--;
        return true;
      }
      // 未找到，继续遍历
      prev = cur;
      cur = cur.next;
    }

    // 场景3：未找到匹配节点
    return false;
  }

  /**
   * 删除指定索引位置的节点（时间复杂度 O(n)）
   * @param index 要删除的节点索引
   * @returns {boolean} 删除成功返回 true，失败（空链表/索引越界）返回 false
   */
  deleteAt(index: number): boolean {
    // 检查空链表（捕获错误，返回 false 而非抛错）
    try {
      this.checkEmpty();
    } catch (e) {
      console.warn('删除失败：', e);
      return false;
    }
    // 校验索引合法性（不合法时返回 false，不抛错）
    if (!this.isValidIndexForDelete(index)) {
      return false;
    }

    // 场景1：删除头节点
    if (index === 0) {
      this.head = this.head!.next;
      this._size--;
      // 删完为空，清空尾节点
      if (this.isEmpty()) {
        this.tail = null;
      }
      return true;
    }

    // 场景2：删除中间/尾节点
    // 前驱节点初始化为头节点
    let prev: ListNode<T> = this.head!;
    // 当前节点初始化为头节点的下一个节点
    let cur: ListNode<T> | null = prev.next;
    let i = 1;

    // 遍历到目标索引的节点（增加 cur 非空判断，避免死循环）
    while (i < index && cur !== null) {
      prev = cur;
      cur = cur.next;
      i++;
    }

    // 兜底：索引合法但 cur 为空（理论上不会触发）
    if (cur === null) {
      return false;
    }

    // 前驱节点 next 跳过当前节点
    prev.next = cur.next;
    // 边界处理：删除的是尾节点，更新尾指针
    if (cur.next === null) {
      this.tail = prev;
    }

    // 链表长度-1
    this._size--;
    return true;
  }

  /**
   * 查找第一个匹配指定值的节点（时间复杂度 O(n)）
   * @param val 要查找的节点值
   * @returns {ListNode<T> | null} 找到返回节点对象，未找到返回 null
   * @throws {Error} val 为 null/undefined 时抛出错误
   */
  find(val: T): ListNode<T> | null {
    // 校验值合法性（空值直接抛错，符合测试期望）
    this.checkVal(val);

    // 从头节点开始遍历
    let cur = this.head;
    while (cur !== null) {
      // 找到匹配节点，返回
      if (cur.val === val) {
        return cur;
      }
      cur = cur.next;
    }

    // 未找到匹配节点
    return null;
  }

  /**
   * 反转链表（时间复杂度 O(n)）
   * @description 原地反转，仅修改节点指针，不创建新节点
   */
  reverse(): void {
    // 空链表/单节点链表无需反转
    if (this.isEmpty() || this.size() === 1) return;

    // 前驱节点初始化为头节点
    let prev = this.head!;
    // 当前节点初始化为头节点的下一个节点
    let cur = prev.next;

    // 第一步：头节点变为尾节点，next 置空
    prev.next = null;
    this.tail = prev;

    // 第二步：遍历反转每个节点的指针
    while (cur !== null) {
      // 暂存下一个节点（避免链表断裂）
      const next = cur.next;
      // 反转当前节点的 next 指向
      cur.next = prev;
      // 前驱节点后移
      prev = cur;
      // 当前节点后移（使用暂存的 next）
      cur = next;
    }

    // 第三步：原尾节点变为新头节点
    this.head = prev;
  }

  /**
   * 清空链表（时间复杂度 O(1)）
   * @description 重置头/尾指针和长度，GC 会自动回收节点内存
   */
  clear(): void {
    this.head = this.tail = null;
    this._size = 0;
  }

  /**
   * 链表转换为数组（时间复杂度 O(n)）
   * @returns {T[]} 包含所有节点值的数组（顺序与链表一致）
   */
  toArray(): T[] {
    // 明确类型标注，避免 any 类型
    const res: T[] = [];
    let cur = this.head;
    // 遍历链表，收集节点值
    while (cur !== null) {
      res.push(cur.val);
      cur = cur.next;
    }
    return res;
  }

  /**
   * 实现迭代器协议（支持 for...of 遍历）
   * @returns {Generator<T, void, void>} 生成器迭代器，逐个产出节点值
   * @description 支持：for...of、解构赋值、扩展运算符等 ES6 语法
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    let cur = this.head;
    // 遍历链表，逐个产出节点值
    while (cur !== null) {
      yield cur.val;
      cur = cur.next;
    }
  }

  /**
   * 静态方法：从数组构建链表（适配前端数据流转）
   * @template T 数组元素类型
   * @param arr 源数组（自动过滤 null/undefined 元素）
   * @returns {LinkedList<T>} 新的链表实例
   */
  static fromArray<T>(arr: T[]): LinkedList<T> {
    // 创建空链表
    const list = new LinkedList<T>();
    // 校验输入是否为数组
    if (!Array.isArray(arr)) {
      console.warn('fromArray失败：输入不是数组');
      return list;
    }
    // 遍历数组，添加非空元素到链表
    arr.forEach(item => {
      if (item === null || item === undefined) {
        console.warn(`跳过非法值 ${item}：值不能为undefined或null`);
        return;
      }
      try {
        list.append(item);
      } catch (e) {
        console.warn(`跳过非法值 ${item}：`, e);
      }
    });
    return list;
  }

  /**
   * 可视化打印链表（调试用）
   * @description 输出格式：1 → 2 → 3 → null
   */
  print(): void {
    // 空链表直接打印 null
    if (this.isEmpty()) {
      console.log('null');
      return;
    }
    let cur = this.head;
    let res = '';
    // 遍历拼接节点值
    while (cur !== null) {
      res += `${cur.val} → `;
      cur = cur.next;
    }
    // 拼接尾节点标识
    res += 'null';
    console.log(res);
  }
}
