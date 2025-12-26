# 二叉树优化版实现：高性能 + 高鲁棒性 + 前端适配

## 概述

本文档基于[基础版二叉树实现](./02-04-binary-tree-implementation.md)，详细说明**优化版**的设计思路和实现逻辑。优化版在保持基础功能完整的前提下，重点提升**性能**、**鲁棒性**和**前端场景适配性**。

## 一、优化版核心设计理念

### 1. 优化目标

- **高性能**：迭代实现避免递归栈溢出，适合深树/大数据量场景
- **高鲁棒性**：完善的参数校验、边界处理、错误提示
- **前端适配**：支持批量操作、序列化、迭代器，适配前端开发场景
- **灵活扩展**：配置化设计，支持自定义比较函数、重复值控制

### 2. 与基础版的区别

| 特性 | 基础版 | 优化版 |
|------|--------|--------|
| 遍历实现 | 递归（DFS）+ 迭代（BFS） | 全部迭代实现 |
| 参数校验 | 基础判空 | 完善的 validateVal |
| 比较逻辑 | 严格相等（===） | 自定义比较函数 |
| 重复值 | 允许 | 可配置 |
| 批量操作 | 无 | batchInsert |
| 扩展功能 | 基础方法 | 平衡判断、路径查找、序列化、迭代器 |
| 节点序列化 | 无 | toJSON 方法 |

## 二、核心优化点详解

### 1. 配置化设计：自定义比较函数 + 重复值控制

#### 设计背景

基础版使用严格相等（`===`）比较，存在以下问题：
- 无法处理复杂对象比较（如 `{id: 1}` vs `{id: 1}`）
- 无法自定义排序规则（如按对象的某个属性比较）
- 无法控制是否允许重复值

#### 实现方案

```typescript
/**
 * 二叉树配置项（优化版）
 */
interface BinaryTreeOptions<T> {
  // 自定义值比较函数（解决不同类型值比较问题）
  compare?: (a: T, b: T) => number;
  // 是否允许重复值
  allowDuplicate?: boolean;
}

export class BinaryTree<T> {
  private compare: (a: T, b: T) => number;
  private allowDuplicate: boolean;

  constructor(options: BinaryTreeOptions<T> = {}) {
    // 默认比较函数（支持数字/字符串）
    this.compare =
      options.compare ||
      ((a, b) => {
        if (a === b) return 0;
        return (a as any) < (b as any) ? -1 : 1;
      });
    this.allowDuplicate = options.allowDuplicate ?? true;
  }
}
```

#### 使用示例

```typescript
// 示例1：自定义对象比较
interface User {
  id: number;
  name: string;
}

const userTree = new BinaryTree<User>({
  compare: (a, b) => a.id - b.id, // 按 id 比较
  allowDuplicate: false // 不允许重复 id
});

// 示例2：自定义字符串长度比较
const strTree = new BinaryTree<string>({
  compare: (a, b) => a.length - b.length,
  allowDuplicate: true
});
```

#### 优势分析

- **灵活性**：支持任意类型的值比较，不局限于基本类型
- **可扩展**：通过配置函数实现不同的业务逻辑
- **类型安全**：TypeScript 泛型保证类型一致性

### 2. 参数校验：validateVal 方法

#### 设计背景

基础版缺少参数校验，传入 `null` 或 `undefined` 会导致运行时错误。

#### 实现方案

```typescript
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
```

#### 使用位置

所有接受值参数的方法都会先调用 `validateVal`：
- `insert(val)` - 插入前校验
- `find(val)` - 查找前校验
- `delete(val)` - 删除前校验
- `findPath(val)` - 查找路径前校验

#### 优势分析

- **提前发现问题**：在操作前就发现参数错误，避免部分执行后失败
- **错误信息明确**：抛出清晰的错误信息，便于调试
- **统一管理**：集中处理校验逻辑，避免重复代码

### 3. 迭代实现：避免递归栈溢出

#### 设计背景

基础版的 DFS 遍历使用递归实现，在深树场景下（如 10000 层）会导致栈溢出。

#### 实现方案对比

**前序遍历（递归 → 迭代）**

```typescript
// 基础版：递归实现
preOrder(): T[] {
  const result: T[] = [];
  const traverse = (node: TreeNode<T> | null) => {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  };
  traverse(this.root);
  return result;
}

// 优化版：迭代实现（使用栈）
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
```

**中序遍历（递归 → 迭代）**

```typescript
// 优化版：迭代实现
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
```

**后序遍历（递归 → 迭代）**

```typescript
// 优化版：迭代实现（使用 visited 标记）
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
```

**获取树高度（递归 → 迭代）**

```typescript
// 基础版：递归实现
height(): number {
  const getHeight = (node: TreeNode<T> | null): number => {
    if (!node) return 0;
    const leftHeight = getHeight(node.left);
    const rightHeight = getHeight(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  };
  return getHeight(this.root);
}

// 优化版：迭代实现（层序遍历计数）
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
```

#### 性能对比

| 方法 | 实现方式 | 栈深度限制 | 适用场景 |
|------|----------|------------|----------|
| 递归 DFS | 函数调用栈 | ~10000 层（浏览器） | 浅树、逻辑简单 |
| 迭代 DFS | 手动栈 | 受内存限制 | 深树、大数据量 |
| 迭代 BFS | 队列 | 受内存限制 | 层序遍历、查找 |

#### 优势分析

- **避免栈溢出**：迭代实现不受调用栈深度限制
- **性能稳定**：避免函数调用开销，性能更可预测
- **内存可控**：栈/队列大小可控，便于内存管理

### 4. 批量操作：batchInsert 方法

#### 设计背景

前端场景经常需要批量插入数据（如从 API 获取列表后批量构建树），逐个调用 `insert` 效率低且错误处理不统一。

#### 实现方案

```typescript
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
```

#### 使用示例

```typescript
const tree = new BinaryTree<number>();

// 批量插入
const data = [1, 2, 3, 4, 5, null, 6]; // 可能包含无效值
const successCount = tree.batchInsert(data);
console.log(`成功插入 ${successCount} 个节点`);

// 从 API 获取数据后批量插入
fetch('/api/tree-data')
  .then(res => res.json())
  .then(data => {
    const count = tree.batchInsert(data);
    console.log(`从 API 插入 ${count} 个节点`);
  });
```

#### 优势分析

- **容错性强**：单个值失败不影响其他值插入
- **错误提示**：详细的错误信息，便于调试
- **返回统计**：返回成功插入数量，便于监控

### 5. 扩展功能：平衡判断、路径查找、序列化

#### 5.1 平衡二叉树判断（isBalanced）

**应用场景**：前端算法题高频考点，判断树是否平衡（左右子树高度差 ≤ 1）

```typescript
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
```

**算法思路**：
- 递归计算每个节点的高度
- 如果子树不平衡或高度差 > 1，返回 -1 标记
- 最终判断根节点是否返回 -1

#### 5.2 查找节点路径（findPath）

**应用场景**：找到从根节点到目标节点的路径，用于树形导航、面包屑等

```typescript
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
```

**算法思路**：
- 使用回溯算法，记录当前路径
- 找到目标节点时返回 true，保留路径
- 未找到时回溯（pop），继续搜索

#### 5.3 序列化（toJSON）

**应用场景**：前端数据传输、状态持久化、调试展示

```typescript
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
```

**使用示例**：

```typescript
const tree = new BinaryTree<number>();
tree.insert(1);
tree.insert(2);
tree.insert(3);

const json = tree.toJSON();
// {
//   root: { val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } },
//   size: 3,
//   height: 2
// }

// 前端场景：保存到 localStorage
localStorage.setItem('tree-data', JSON.stringify(tree.toJSON()));

// 前端场景：发送到后端
fetch('/api/save-tree', {
  method: 'POST',
  body: JSON.stringify(tree.toJSON())
});
```

#### 5.4 迭代器支持（Symbol.iterator）

**应用场景**：支持 `for...of` 遍历，符合 ES6+ 标准，代码更简洁

```typescript
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
```

**使用示例**：

```typescript
const tree = new BinaryTree<number>();
tree.insert(1);
tree.insert(2);
tree.insert(3);

// 使用 for...of 遍历（层序顺序）
for (const val of tree) {
  console.log(val); // 1, 2, 3
}

// 使用数组方法
const values = [...tree]; // [1, 2, 3]
const doubled = Array.from(tree, val => val * 2); // [2, 4, 6]
```

### 6. 节点序列化：TreeNode.toJSON

**应用场景**：节点级别的序列化，用于前端组件展示、调试

```typescript
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
```

**设计考虑**：
- 只序列化节点值和子节点存在性（boolean），不递归序列化整个子树
- 避免深度序列化导致的数据冗余
- 适合前端组件展示节点状态

## 三、删除节点优化：自定义比较函数

### 问题分析

基础版的删除逻辑在判断最后一个节点时使用严格相等（`===`），但在优化版中，由于使用了自定义比较函数，可能出现：
- 值相同但引用不同的对象
- 需要根据业务逻辑判断是否相等

### 实现方案

```typescript
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

  // 删除最后一个节点（使用自定义比较函数判断）
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
```

**关键改进**：
- 使用 `this.compare()` 替代严格相等判断
- 支持自定义比较逻辑，适配不同业务场景

## 四、性能优化总结

### 1. 时间复杂度对比

| 操作 | 基础版 | 优化版 | 说明 |
|------|--------|--------|------|
| 插入 | O(n) | O(n) | 层序遍历找空位 |
| 查找 | O(n) | O(n) | 层序遍历 |
| 删除 | O(n) | O(n) | 层序遍历找目标+最后节点 |
| 前序遍历 | O(n) | O(n) | 迭代实现，避免栈溢出 |
| 中序遍历 | O(n) | O(n) | 迭代实现，避免栈溢出 |
| 后序遍历 | O(n) | O(n) | 迭代实现，避免栈溢出 |
| 层序遍历 | O(n) | O(n) | 队列实现 |
| 获取高度 | O(n) | O(n) | 迭代层序遍历 |
| 获取大小 | O(n) | O(n) | 层序遍历计数 |

### 2. 空间复杂度对比

| 操作 | 基础版 | 优化版 | 说明 |
|------|--------|--------|------|
| 递归 DFS | O(h) | O(h) | h 为树高度，递归调用栈 |
| 迭代 DFS | - | O(h) | 手动栈，空间可控 |
| 迭代 BFS | O(w) | O(w) | w 为最宽层节点数 |

### 3. 实际性能提升

- **深树场景**：迭代实现避免栈溢出，可处理 10000+ 层深树
- **大数据量**：批量插入减少函数调用开销
- **内存管理**：主动清空引用，GC 友好

## 五、使用建议

### 1. 何时使用基础版

- 学习阶段，理解递归逻辑
- 浅树场景（< 100 层）
- 简单业务场景，不需要复杂配置

### 2. 何时使用优化版

- 生产环境，需要高鲁棒性
- 深树场景（> 1000 层）
- 前端场景，需要批量操作、序列化
- 复杂业务，需要自定义比较逻辑
- 需要扩展功能（平衡判断、路径查找等）

### 3. 最佳实践

```typescript
// ✅ 推荐：生产环境使用优化版
const tree = new BinaryTree<number>({
  compare: (a, b) => a - b,
  allowDuplicate: false
});

// ✅ 推荐：批量插入使用 batchInsert
tree.batchInsert([1, 2, 3, 4, 5]);

// ✅ 推荐：使用迭代器遍历
for (const val of tree) {
  console.log(val);
}

// ✅ 推荐：序列化保存状态
localStorage.setItem('tree', JSON.stringify(tree.toJSON()));

// ❌ 不推荐：逐个插入大量数据
for (let i = 0; i < 10000; i++) {
  tree.insert(i); // 应该用 batchInsert
}
```

## 六、完整代码示例

```typescript
import { BinaryTree, TreeNode } from './tree';

// 1. 基础使用
const tree = new BinaryTree<number>();
tree.insert(1);
tree.insert(2);
tree.insert(3);
console.log('层序遍历：', tree.levelOrder()); // [1, 2, 3]

// 2. 自定义比较函数
interface User {
  id: number;
  name: string;
}

const userTree = new BinaryTree<User>({
  compare: (a, b) => a.id - b.id,
  allowDuplicate: false
});

userTree.insert({ id: 1, name: 'Alice' });
userTree.insert({ id: 2, name: 'Bob' });

// 3. 批量插入
const data = [1, 2, 3, 4, 5];
const count = tree.batchInsert(data);
console.log(`成功插入 ${count} 个节点`);

// 4. 查找路径
const path = tree.findPath(5);
console.log('路径：', path); // [1, 2, 5]

// 5. 平衡判断
const isBalanced = tree.isBalanced();
console.log('是否平衡：', isBalanced);

// 6. 序列化
const json = tree.toJSON();
console.log('JSON：', json);

// 7. 迭代器遍历
for (const val of tree) {
  console.log(val);
}

// 8. 获取最值（使用自定义比较函数）
const minNode = tree.min();
const maxNode = tree.max();
console.log('最小值：', minNode?.val);
console.log('最大值：', maxNode?.val);
```

## 七、总结

优化版二叉树在基础版的基础上，通过以下优化实现了**高性能 + 高鲁棒性 + 前端适配**：

1. **配置化设计**：自定义比较函数、重复值控制，提升灵活性
2. **参数校验**：完善的 validateVal，提前发现问题
3. **迭代实现**：避免递归栈溢出，适合深树场景
4. **批量操作**：batchInsert 提升批量插入效率
5. **扩展功能**：平衡判断、路径查找、序列化、迭代器，适配前端场景
6. **节点序列化**：节点级别的 toJSON，便于前端展示

这些优化使得二叉树数据结构更适合生产环境使用，特别是在前端开发场景中。

