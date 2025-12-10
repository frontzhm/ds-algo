/**
 * 链表节点（泛型支持任意数据类型，增加空值校验）
 */
export class ListNode<T> {
  val: T;
  next: ListNode<T> | null;

  /**
   * 构造函数（新增空值校验）
   * @param val 节点值（禁止undefined/null）
   * @param next 下一个节点指针
   */
  constructor(val: T, next: ListNode<T> | null = null) {
    // 空值校验：禁止传入undefined/null
    if (val === undefined || val === null) {
      throw new Error('节点值不能为undefined或null');
    }
    this.val = val;
    this.next = next;
  }
}

/**
 * 单向链表（完整版：迭代器+数组构建+可视化打印+空值校验+性能优化）
 */
export class LinkedList<T> {
  head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null; // 尾指针：优化append性能
  private _size: number = 0; // 缓存长度：避免重复遍历

  /**
   * 检查链表是否为空
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * 获取链表长度（O(1)）
   */
  size(): number {
    return this._size;
  }

  /**
   * 私有方法：校验索引合法性
   */
  private isValidIndex(index: number): boolean {
    return typeof index === 'number' && index >= 0 && index <= this._size;
  }

  /**
   * 私有方法：检查空链表并给出提示
   */
  private checkEmpty(): boolean {
    if (this.isEmpty()) {
      console.warn('链表为空');
      return true;
    }
    return false;
  }

  /**
   * 私有方法：值非空校验（通用）
   */
  private checkVal(val: T): void {
    if (val === undefined || val === null) {
      throw new Error('值不能为undefined或null');
    }
  }

  /**
   * 头部添加元素（O(1)，新增空值校验）
   */
  prepend(val: T): void {
    this.checkVal(val); // 空值校验
    this.head = new ListNode(val, this.head);
    if (this._size === 0) {
      this.tail = this.head;
    }
    this._size++;
  }

  /**
   * 尾部添加元素（O(1)，新增空值校验）
   */
  append(val: T): void {
    this.checkVal(val); // 空值校验
    const newNode = new ListNode(val);
    if (this._size === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this._size++;
  }

  /**
   * 指定位置插入元素（O(n)，新增空值校验）
   * @param index 插入位置（0 ~ size）
   * @param val 插入值
   */
  insertAt(index: number, val: T): void {
    this.checkVal(val); // 空值校验
    if (!this.isValidIndex(index)) {
      console.warn(`索引 ${index} 不合法，链表长度：${this._size}`);
      return;
    }

    if (index === 0) {
      this.prepend(val);
      return;
    }

    if (index === this._size) {
      this.append(val);
      return;
    }

    let i = 0;
    let curNode: ListNode<T> | null = this.head;
    while (i < index - 1 && curNode) {
      curNode = curNode.next;
      i++;
    }

    if (curNode) {
      curNode.next = new ListNode(val, curNode.next);
      this._size++;
    }
  }

  /**
   * 删除指定值的第一个节点（O(n)）
   * @returns 是否删除成功
   */
  delete(val: T): boolean {
    this.checkVal(val); // 空值校验
    if (this.checkEmpty()) return false;

    // 处理头节点是目标值的情况
    if (this.head!.val === val) {
      this.head = this.head!.next;
      this._size--;
      if (this._size === 0) {
        this.tail = null;
      }
      return true;
    }

    let curNode: ListNode<T> | null = this.head;
    while (curNode && curNode.next) {
      if (curNode.next.val === val) {
        // 处理删除尾节点的情况
        if (curNode.next === this.tail) {
          this.tail = curNode;
        }
        curNode.next = curNode.next.next;
        this._size--;
        return true;
      }
      curNode = curNode.next;
    }

    return false;
  }

  /**
   * 删除指定位置的节点（O(n)）
   * @returns 是否删除成功
   */
  deleteAt(index: number): boolean {
    if (this.checkEmpty() || !this.isValidIndex(index) || index >= this._size) {
      return false;
    }

    // 删除头节点
    if (index === 0) {
      this.head = this.head!.next;
      this._size--;
      if (this._size === 0) {
        this.tail = null;
      }
      return true;
    }

    let i = 0;
    let curNode: ListNode<T> | null = this.head;
    while (i < index - 1 && curNode) {
      curNode = curNode.next;
      i++;
    }

    if (curNode && curNode.next) {
      // 处理删除尾节点
      if (curNode.next === this.tail) {
        this.tail = curNode;
      }
      curNode.next = curNode.next.next;
      this._size--;
      return true;
    }

    return false;
  }

  /**
   * 查找指定值的第一个节点（O(n)，新增空值校验）
   * @returns 找到的节点/Null
   */
  find(val: T): ListNode<T> | null {
    this.checkVal(val); // 空值校验
    if (this.checkEmpty()) return null;

    let curNode = this.head;
    while (curNode !== null) {
      if (curNode.val === val) {
        return curNode;
      }
      curNode = curNode.next;
    }
    return null;
  }

  /**
   * 反转链表（O(n)）
   */
  reverse(): void {
    if (this._size <= 1) return;

    let prev: ListNode<T> | null = null;
    let cur: ListNode<T> | null = this.head;
    let next: ListNode<T> | null = null;

    // 交换tail和head
    this.tail = this.head;

    while (cur !== null) {
      next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }

    this.head = prev;
  }

  /**
   * 清空链表（O(1)）
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * 转换为数组（O(n)）
   */
  toArray(): T[] {
    const res: T[] = [];
    let curNode = this.head;
    while (curNode !== null) {
      res.push(curNode.val);
      curNode = curNode.next;
    }
    return res;
  }

  /**
   * 扩展1：实现迭代器（支持for...of遍历）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    let curNode = this.head;
    while (curNode) {
      yield curNode.val;
      curNode = curNode.next;
    }
  }

  /**
   * 扩展2：静态方法 - 从数组构建链表（适配前端数据流转）
   * @param arr 源数组（自动过滤空值）
   * @returns 新的链表实例
   */
  static fromArray<T>(arr: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    if (!Array.isArray(arr) || arr.length === 0) {
      return list;
    }

    // 遍历数组，跳过空值，批量添加节点
    arr.forEach(val => {
      if (val !== undefined && val !== null) {
        list.append(val);
      } else {
        console.warn(`跳过空值：${val}，不加入链表`);
      }
    });
    return list;
  }

  /**
   * 扩展3：可视化打印链表（输出格式：1 → 2 → 3 → null）
   */
  print(): void {
    if (this.isEmpty()) {
      console.log('null');
      return;
    }

    const parts: string[] = [];
    let curNode = this.head;
    while (curNode) {
      parts.push(String(curNode.val));
      curNode = curNode.next;
    }
    parts.push('null');
    console.log(parts.join(' → '));
  }
}
