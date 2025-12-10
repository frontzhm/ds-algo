// 树&堆数据结构实现

/**
 * 二叉树节点
 */
export class TreeNode<T> {
  val: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(val: T, left: TreeNode<T> | null = null, right: TreeNode<T> | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * 二叉树（BinaryTree）
 */
export class BinaryTree<T> {
  root: TreeNode<T> | null = null;

  /**
   * 检查树是否为空
   */
  isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 插入节点
   */
  insert(val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 查找节点
   */
  find(val: T): TreeNode<T> | null {
    throw new Error('Method not implemented.');
  }

  /**
   * 删除节点
   */
  delete(val: T): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 前序遍历
   */
  preOrder(): T[] {
    throw new Error('Method not implemented.');
  }

  /**
   * 中序遍历
   */
  inOrder(): T[] {
    throw new Error('Method not implemented.');
  }

  /**
   * 后序遍历
   */
  postOrder(): T[] {
    throw new Error('Method not implemented.');
  }

  /**
   * 层序遍历
   */
  levelOrder(): T[] {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取树的高度
   */
  height(): number {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取树的大小
   */
  size(): number {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取最小值节点
   */
  min(): TreeNode<T> | null {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取最大值节点
   */
  max(): TreeNode<T> | null {
    throw new Error('Method not implemented.');
  }

  /**
   * 清空树
   */
  clear(): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * 最小堆（MinHeap）
 */
export class MinHeap<T> {
  /**
   * 插入元素
   */
  insert(val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取最小值
   */
  peek(): T | undefined {
    throw new Error('Method not implemented.');
  }

  /**
   * 弹出最小值
   */
  extractMin(): T | undefined {
    throw new Error('Method not implemented.');
  }

  /**
   * 检查堆是否为空
   */
  isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取堆的大小
   */
  size(): number {
    throw new Error('Method not implemented.');
  }

  /**
   * 清空堆
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

/**
 * 最大堆（MaxHeap）
 */
export class MaxHeap<T> {
  /**
   * 插入元素
   */
  insert(val: T): void {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取最大值
   */
  peek(): T | undefined {
    throw new Error('Method not implemented.');
  }

  /**
   * 弹出最大值
   */
  extractMax(): T | undefined {
    throw new Error('Method not implemented.');
  }

  /**
   * 检查堆是否为空
   */
  isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 获取堆的大小
   */
  size(): number {
    throw new Error('Method not implemented.');
  }

  /**
   * 清空堆
   */
  clear(): void {
    throw new Error('Method not implemented.');
  }
}
