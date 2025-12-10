// 栈&队列数据结构实现

/**
 * 栈（Stack）- 后进先出（LIFO）
 */
export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * 推入元素到栈顶
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * 弹出栈顶元素
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * 查看栈顶元素但不移除
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
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
   * 清空栈
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 转换为数组
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * 队列（Queue）- 先进先出（FIFO）
 */
export class Queue<T> {
  private items: T[];
  constructor() {
    this.items = [];
  }
  /**
   * 入队
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * 出队
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * 查看队首元素但不移除
   */
  front(): T | undefined {
    return this.items[0];
  }

  /**
   * 检查队列是否为空
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * 获取队列的大小
   */
  size(): number {
    return this.items.length;
  }

  /**
   * 清空队列
   */
  clear(): void {
    this.items = [];
  }

  /**
   * 转换为数组
   */
  toArray(): T[] {
    return [...this.items];
  }
}
