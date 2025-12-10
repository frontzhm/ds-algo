// 链表数据结构实现

/**
 * 链表节点
 */
export class ListNode<T> {
  val: T;
  next: ListNode<T> | null;

  constructor(val: T, next: ListNode<T> | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * 链表（LinkedList）
 */
export class LinkedList<T> {
  head: ListNode<T> | null = null;

  /**
   * 检查链表是否为空
   */
  isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取链表的大小
   */
  size(): number {
    throw new Error('Method not implemented.');
  }

  /**
   * 在头部添加元素
   */
  prepend(val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 在尾部添加元素
   */
  append(val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 在指定位置插入元素
   */
  insertAt(index: number, val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 删除指定值的节点
   */
  delete(val: T): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 删除指定位置的节点
   */
  deleteAt(index: number): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 查找节点
   */
  find(val: T): ListNode<T> | null {
    throw new Error('Method not implemented.');
  }

  /**
   * 反转链表
   */
  reverse(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 清空链表
   */
  clear(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 转换为数组
   */
  toArray(): T[] {
    throw new Error('Method not implemented.');
  }
}
