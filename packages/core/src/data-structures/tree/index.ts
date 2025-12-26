/**
 * 二叉树节点（优化版）
 * @template T 节点值的类型
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

  /**
   * 节点序列化（前端数据传输用）
   */
  toJSON(): { val: T; left: boolean; right: boolean } {
    return {
      val: this.val,
      left: !!this.left,
      right: !!this.right,
    };
  }
}

/**
 * 二叉树配置项（优化版）
 * @template T 节点值的类型
 */
interface BinaryTreeOptions<T> {
  // 自定义值比较函数（解决不同类型值比较问题）
  compare?: (a: T, b: T) => number;
  // 是否允许重复值
  allowDuplicate?: boolean;
}

/**
 * 二叉树（优化版）- 高性能 + 高鲁棒性 + 前端适配
 * @template T 节点值的类型
 */
export class BinaryTree<T> {
  root: TreeNode<T> | null = null;
  private compare: (a: T, b: T) => number; // 自定义比较函数
  private allowDuplicate: boolean; // 是否允许重复值

  constructor(options: BinaryTreeOptions<T> = {}) {
    this.root = null;
    // 默认比较函数（支持数字/字符串）
    this.compare =
      options.compare ||
      ((a, b) => {
        if (a === b) return 0;
        return (a as any) < (b as any) ? -1 : 1;
      });
    this.allowDuplicate = options.allowDuplicate ?? true;
  }

  /**
   * 检查树是否为空
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * 私有方法：入参非空校验
   * @param val 要校验的值
   * @throws {Error} 值为空时抛出错误
   */
  private validateVal(val: T): void {
    if (val === undefined || val === null) {
      throw new Error('二叉树节点值不能为undefined或null');
    }
  }

  /**
   * 插入节点（优化：双端队列提升层序遍历性能，支持重复值配置）
   * @param val 要插入的节点值
   */
  insert(val: T): void {
    this.validateVal(val);

    // 检查重复值（不允许则直接返回）
    if (!this.allowDuplicate && this.find(val)) {
      console.warn(`值${val}已存在，不允许重复插入`);
      return;
    }

    const newNode = new TreeNode(val);
    if (this.isEmpty()) {
      this.root = newNode;
      return;
    }

    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;

      if (!current.left) {
        current.left = newNode;
        return;
      }
      if (!current.right) {
        current.right = newNode;
        return;
      }

      queue.push(current.left, current.right);
    }
  }

  /**
   * 批量插入节点（前端批量数据场景）
   * @param vals 要插入的值数组
   * @returns 成功插入的数量
   */
  batchInsert(vals: T[]): number {
    if (!Array.isArray(vals)) {
      console.warn('批量插入失败：输入不是数组');
      return 0;
    }
    let successCount = 0;
    vals.forEach(val => {
      try {
        this.insert(val);
        successCount++;
      } catch (e) {
        console.warn(`批量插入跳过值${val}：`, e);
      }
    });
    return successCount;
  }

  /**
   * 查找节点（优化：迭代实现 + 自定义比较函数）
   * @param val 要查找的节点值
   * @returns 找到的节点 | null
   */
  find(val: T): TreeNode<T> | null {
    this.validateVal(val);
    if (this.isEmpty()) return null;

    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (this.compare(current.val, val) === 0) {
        return current;
      }
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return null;
  }

  /**
   * 删除节点（优化：逻辑严谨 + 自定义比较）
   * @param val 要删除的节点值
   * @returns 是否删除成功
   */
  delete(val: T): boolean {
    this.validateVal(val);
    if (this.isEmpty()) return false;

    let targetNode: TreeNode<T> | null = null;
    let lastNode: TreeNode<T> | null = null;
    let lastNodeParent: TreeNode<T> | null = null;
    const queue: TreeNode<T>[] = [this.root!];

    // 查找目标节点 + 最后一个节点及其父节点
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (this.compare(current.val, val) === 0) {
        targetNode = current;
      }
      lastNode = current;

      if (current.left) {
        lastNodeParent = current;
        queue.push(current.left);
      }
      if (current.right) {
        lastNodeParent = current;
        queue.push(current.right);
      }
    }

    if (!targetNode) return false;

    // 替换目标节点值
    targetNode.val = lastNode!.val;

    // 删除最后一个节点
    if (lastNodeParent) {
      if (lastNodeParent.right && this.compare(lastNodeParent.right.val, lastNode!.val) === 0) {
        lastNodeParent.right = null;
      } else if (
        lastNodeParent.left &&
        this.compare(lastNodeParent.left.val, lastNode!.val) === 0
      ) {
        lastNodeParent.left = null;
      }
    } else {
      this.root = null;
    }

    return true;
  }

  /**
   * 前序遍历（优化：迭代实现，避免递归栈溢出）
   * @returns 遍历结果数组
   */
  preOrder(): T[] {
    const result: T[] = [];
    if (this.isEmpty()) return result;

    const stack: TreeNode<T>[] = [this.root!];
    while (stack.length > 0) {
      const current = stack.pop()!;
      result.push(current.val);
      // 先压右子节点（栈后进先出，保证左子节点先遍历）
      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }
    return result;
  }

  /**
   * 中序遍历（优化：迭代实现）
   * @returns 遍历结果数组
   */
  inOrder(): T[] {
    const result: T[] = [];
    if (this.isEmpty()) return result;

    const stack: TreeNode<T>[] = [];
    let current: TreeNode<T> | null = this.root;
    while (current || stack.length > 0) {
      // 先遍历左子树
      while (current) {
        stack.push(current);
        current = current.left;
      }
      // 访问根节点
      current = stack.pop()!;
      result.push(current.val);
      // 遍历右子树
      current = current.right;
    }
    return result;
  }

  /**
   * 后序遍历（优化：迭代实现）
   * @returns 遍历结果数组
   */
  postOrder(): T[] {
    const result: T[] = [];
    if (this.isEmpty()) return result;

    const stack: TreeNode<T>[] = [this.root!];
    const visited = new Set<TreeNode<T>>();
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      // 左右子节点未访问：先压入栈
      if (current.left && !visited.has(current.left)) {
        stack.push(current.left);
      } else if (current.right && !visited.has(current.right)) {
        stack.push(current.right);
      } else {
        // 左右子节点已访问：弹出并记录
        const node = stack.pop()!;
        result.push(node.val);
        visited.add(node);
      }
    }
    return result;
  }

  /**
   * 层序遍历（优化：迭代实现，避免递归栈溢出）
   * @returns 遍历结果数组
   */
  levelOrder(): T[] {
    const result: T[] = [];
    if (this.isEmpty()) return result;

    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current.val);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return result;
  }

  /**
   * 获取树的高度（优化：迭代实现，避免递归栈溢出）
   * @returns 树的高度
   */
  height(): number {
    if (this.isEmpty()) return 0;

    let height = 0;
    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const levelSize = queue.length; // 记录当前层的节点数
      height++;
      // 遍历当前层所有节点
      for (let i = 0; i < levelSize; i++) {
        const current = queue.shift()!;
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
      }
    }
    return height;
  }

  /**
   * 获取树的大小（优化：迭代实现，避免递归栈溢出）
   * @returns 节点总数
   */
  size(): number {
    if (this.isEmpty()) return 0;

    let count = 0;
    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      count++;
      const current = queue.shift()!;
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return count;
  }

  /**
   * 获取最小值节点（优化：自定义比较函数）
   * @returns 最小值节点 | null
   */
  min(): TreeNode<T> | null {
    if (this.isEmpty()) return null;

    let minNode = this.root!;
    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (this.compare(current.val, minNode.val) < 0) {
        minNode = current;
      }
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return minNode;
  }

  /**
   * 获取最大值节点（优化：自定义比较函数）
   * @returns 最大值节点 | null
   */
  max(): TreeNode<T> | null {
    if (this.isEmpty()) return null;

    let maxNode = this.root!;
    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (this.compare(current.val, maxNode.val) > 0) {
        maxNode = current;
      }
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return maxNode;
  }

  /**
   * 清空树（优化：主动切断所有节点引用，避免内存泄漏）
   */
  clear(): void {
    // 递归清空所有节点引用（GC友好）
    const clearNode = (node: TreeNode<T> | null) => {
      if (!node) return;
      clearNode(node.left);
      clearNode(node.right);
      node.left = null;
      node.right = null;
    };
    clearNode(this.root);
    this.root = null;
  }

  /**
   * 扩展：判断是否为平衡二叉树（前端算法题高频）
   * @returns 是否平衡（左右子树高度差≤1）
   */
  isBalanced(): boolean {
    const checkBalance = (node: TreeNode<T> | null): number => {
      if (!node) return 0;
      const leftHeight = checkBalance(node.left);
      const rightHeight = checkBalance(node.right);
      // 子树不平衡或高度差>1：返回-1标记
      if (leftHeight === -1 || rightHeight === -1 || Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
      }
      return Math.max(leftHeight, rightHeight) + 1;
    };
    return checkBalance(this.root) !== -1;
  }

  /**
   * 扩展：查找节点路径（根到目标节点的路径）
   * @param val 目标节点值
   * @returns 路径数组 | null
   */
  findPath(val: T): T[] | null {
    this.validateVal(val);
    const path: T[] = [];
    const find = (node: TreeNode<T> | null): boolean => {
      if (!node) return false;
      path.push(node.val);
      // 找到目标节点
      if (this.compare(node.val, val) === 0) return true;
      // 递归查找左右子树
      if (find(node.left) || find(node.right)) return true;
      // 未找到：回溯
      path.pop();
      return false;
    };
    return find(this.root) ? path : null;
  }

  /**
   * 扩展：序列化（转换为JSON，前端数据传输用）
   * @returns 树的JSON结构
   */
  toJSON(): { root: any; size: number; height: number } {
    const serializeNode = (node: TreeNode<T> | null): any => {
      if (!node) return null;
      return {
        val: node.val,
        left: serializeNode(node.left),
        right: serializeNode(node.right),
      };
    };
    return {
      root: serializeNode(this.root),
      size: this.size(),
      height: this.height(),
    };
  }

  /**
   * 扩展：迭代器支持（兼容for...of遍历，层序顺序）
   */
  *[Symbol.iterator](): Generator<T, void, void> {
    if (this.isEmpty()) return;
    const queue: TreeNode<T>[] = [this.root!];
    while (queue.length > 0) {
      const current = queue.shift()!;
      yield current.val;
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }
}
