# 从0到1实现二叉树：核心逻辑+分步引导+通用方法论

## 概述

二叉树是前端/算法领域最基础的树形数据结构，掌握其实现不仅能理解"层级存储"的核心思想，更能举一反三应对N叉树、平衡树等复杂结构。本文从「核心概念拆解→基础结构搭建→核心方法实现→通用逻辑总结」逐步引导，每一步说明"为什么这么设计"，而非单纯堆砌代码。

## 一、二叉树核心认知（实现前必知）

### 1. 二叉树的本质

二叉树是「每个节点最多有两个子节点（左子、右子）」的层级结构，核心特征：

- 有且仅有一个根节点（顶层唯一入口）；
- 子节点分为左/右，顺序不可随意调换；
- 叶子节点（无左右子）是层级的终点；
- 空树：根节点为 `null`（最基础的边界情况）。

### 2. 实现前的核心思考

- **存储方式**：用"节点类+指针"（left/right）表示层级关系（而非数组，数组更适合完全二叉树/堆）；
- **操作核心**：所有方法（插入、遍历、查找、删除）本质是「遍历+条件处理」；
- **遍历是基础**：增/删/查都依赖遍历（前序/中序/后序/层序），先实现遍历，再基于遍历扩展其他方法；
- **边界防御**：空树、单节点树、叶子节点操作是高频边界，必须优先考虑。

## 二、Step1：搭建二叉树的基础结构（节点+空树）

### 1. 节点类设计（最小单元）

二叉树的核心是"节点"，每个节点需要存储「值」和「左右子节点指针」，这是树形结构的基础：

```typescript
/**
 * 二叉树节点类：树形结构的最小单元
 * 思考逻辑：
 * 1. 每个节点必须存储值（val），是数据的载体；
 * 2. 左/右子节点默认null（初始无后代），用指针关联子节点，形成层级；
 * 3. 泛型约束值的类型，避免任意类型导致的比较/遍历错误；
 */
class TreeNode<T> {
  val: T; // 节点存储的值
  left: TreeNode<T> | null; // 左子节点指针
  right: TreeNode<T> | null; // 右子节点指针

  // 构造函数：初始化值+可选的左右子节点
  constructor(val: T, left: TreeNode<T> | null = null, right: TreeNode<T> | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

### 2. 二叉树基类（空树初始化）

二叉树的入口是"根节点"，先搭建最基础的空树结构，包含"判空"核心方法：

```typescript
/**
 * 二叉树基类：管理整棵树的入口（根节点）
 * 思考逻辑：
 * 1. 整棵树的唯一入口是根节点（root），初始为null表示空树；
 * 2. 判空方法（isEmpty）是所有操作的前置防御，避免空指针错误；
 */
class BinaryTree<T> {
  root: TreeNode<T> | null; // 根节点：整棵树的入口

  constructor() {
    this.root = null; // 初始化为空树
  }

  /**
   * 基础方法：判断树是否为空
   * 思考逻辑：空树的唯一标志是根节点为null，这是所有操作的第一步校验
   */
  isEmpty(): boolean {
    return this.root === null;
  }
}
```

## 三、Step2：实现核心遍历方法（所有操作的基础）

遍历是二叉树的"灵魂"——增/删/查都需要先遍历找到目标位置，再执行操作。

二叉树有4种核心遍历方式，分为「深度优先（DFS）」和「广度优先（BFS）」两类，先实现最常用的递归版（易理解），再补充迭代版（避免栈溢出）。

### 1. 深度优先遍历（DFS）：先深后宽

核心逻辑：优先遍历到树的最深层，再回溯处理兄弟节点，分为前序、中序、后序（区别在于"访问当前节点"的时机）。

#### 深度遍历的基础 - 递归

深度遍历核心是抓住「递归的执行逻辑」和「遍历的规则」—— 我们拆成 核心概念、代码逐行拆解、执行流程模拟 三个部分来理解。以前序遍历为例：

先明确 2 个核心概念（避免基础混淆）：

- 前序遍历规则：根节点 → 左子树 → 右子树（先访问当前节点，再递归处理左，最后递归处理右）；
- 递归的本质：「拆分子问题」+「终止条件」—— 把 “遍历整棵树” 拆成 “遍历根节点 + 遍历左子树 + 遍历右子树”，直到遇到空节点（子问题无法再拆）就停止。

代码逐行拆解（对应注释 + 通俗解释）：

```js
  // 你要理解的前序遍历方法
  preOrder(): T[] {
    // 步骤1：初始化结果数组（存储遍历出的节点值，最终返回）
    const result: T[] = [];

    // 步骤2：定义递归辅助函数（核心逻辑，封装遍历规则）
    // 参数node：当前要处理的节点（可能是根/左子/右子，也可能是null）
    const traverse = (node: TreeNode<T> | null) => {
      // 递归终止条件：如果当前节点是null（空），直接返回，不做任何操作
      // 比如叶子节点的左/右子节点都是null，到这一步就停止递归
      if (!node) return;

      // 前序遍历第一步：访问当前节点（把值存入结果数组）
      result.push(node.val);

      // 前序遍历第二步：递归遍历当前节点的左子树（处理左子树的所有节点）
      traverse(node.left);

      // 前序遍历第三步：递归遍历当前节点的右子树（处理右子树的所有节点）
      traverse(node.right);
    };

    // 步骤3：启动递归（从整棵树的根节点开始遍历）
    traverse(this.root);

    // 步骤4：返回最终的遍历结果
    return result;
  }
```

关键细节解释：

- **为什么要写辅助函数 traverse？** 因为递归需要反复调用 “遍历逻辑”，但结果数组 result 只需要初始化一次（如果把 result 放在递归函数里，每次调用都会新建数组，结果会被覆盖）。辅助函数通过「闭包」访问外层的 result，既能复用数组，又能封装递归逻辑。
- **递归终止条件 if (!node) return 为什么重要？** 没有终止条件的递归会无限调用自己，导致栈溢出。比如：叶子节点的左、右子节点都是 null，调用 traverse(null) 时直接返回，就不会继续递归了。
- **traverse(this.root) 是整个遍历的 “起点”** 整棵树的遍历从根节点开始，后续的左 / 右子树遍历都是通过递归自动触发的。
- **为什么递归会自动 “回溯”？** 递归调用后，代码会回到调用的位置继续执行。比如 traverse(node.left) 执行完，会自动执行 traverse(node.right)—— 这就是 “先左后右” 的核心。
- **如果树是空的（root=null）会怎样？** 调用 traverse(null) 直接触发终止条件，result 还是空数组，不会报错，逻辑健壮。
- **返回数组而不是直接打印，好处是什么？** 打印只能看结果，返回数组可以对结果做后续操作（比如 filter 过滤值、find 查找某个值、join 拼接成字符串等），复用性更高。

执行流程模拟（结合代码和注释理解）：

```plaintext
        根节点(1)
       /        \
左子(2)        右子(3)
   /  \
左子(4) 右子(5)
```

逐步模拟 preOrder() 的执行过程：

- 调用 preOrder()，初始化 result = []；
- 调用 traverse(根节点1)：
  - node=1 不为 null → result.push(1) → result = [1]；
  - 调用 traverse(左子节点2)；
    - node=2 不为 null → result.push(2) → result = [1,2]；
    - 调用 traverse(左子节点4)；
      - node=4 不为 null → result.push(4) → result = [1,2,4]；
      - 调用 traverse(4的左子节点null) → 触发终止条件，直接返回；
      - 调用 traverse(4的右子节点null) → 触发终止条件，直接返回；
      - traverse(4) 执行完毕，回到 traverse(2) 的下一步；
    - 调用 traverse(右子节点5)；
      - node=5 不为 null → result.push(5) → result = [1,2,4,5]；
      - 调用 traverse(5的左子节点null) → 返回；
      - 调用 traverse(5的右子节点null) → 返回；
      - traverse(5) 执行完毕，回到 traverse(2) 的下一步；
    - traverse(2) 执行完毕，回到 traverse(1) 的下一步；
  - 调用 traverse(右子节点3)；- node=3 不为 null → result.push(3) → result = [1,2,4,5,3]；- 调用 traverse(3的左子节点null) → 返回；- 调用 traverse(3的右子节点null) → 返回；- traverse(3) 执行完毕，回到 traverse(1) 的下一步；
- traverse(1) 执行完毕，preOrder() 返回 result = [1,2,4,5,3]。

递归调用栈变化图:

```plaintext
# 初始状态
栈：[] → result：[]

# 调用 traverse(1)
栈：[traverse(1)] → push(1) → result：[1]
  ↓ 调用 traverse(2)
  栈：[traverse(1), traverse(2)] → push(2) → result：[1,2]
    ↓ 调用 traverse(4)
    栈：[traverse(1), traverse(2), traverse(4)] → push(4) → result：[1,2,4]
      ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(2), traverse(4)]
      ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(2), traverse(4)]
    ↓ traverse(4) 出栈，栈回到 [traverse(1), traverse(2)]
    ↓ 调用 traverse(5)
    栈：[traverse(1), traverse(2), traverse(5)] → push(5) → result：[1,2,4,5]
      ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(2), traverse(5)]
      ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(2), traverse(5)]
    ↓ traverse(5) 出栈，栈回到 [traverse(1), traverse(2)]
  ↓ traverse(2) 出栈，栈回到 [traverse(1)]
  ↓ 调用 traverse(3)
  栈：[traverse(1), traverse(3)] → push(3) → result：[1,2,4,5,3]
    ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(3)]
    ↓ 调用 traverse(null) → 返回，栈回到 [traverse(1), traverse(3)]
  ↓ traverse(3) 出栈，栈回到 [traverse(1)]
↓ traverse(1) 出栈，栈空
→ 返回 result：[1,2,4,5,3]
```

#### （1）前序遍历（根 → 左 → 右）

```typescript
/**
 * 前序遍历：根节点 → 左子树 → 右子树
 * 思考逻辑：
 * 1. 递归终止条件：节点为null（无数据可访问）；
 * 2. 遍历顺序：先记录当前节点值（根），再递归左子树，最后递归右子树；
 * 3. 返回数组而非直接打印：便于后续复用（如查找、过滤）；
 */
preOrder(): T[] {
  const result: T[] = []; // 存储遍历结果

  // 递归辅助函数：封装遍历逻辑，避免重复初始化结果数组
  const traverse = (node: TreeNode<T> | null) => {
    if (!node) return; // 递归终止：空节点直接返回

    result.push(node.val); // 1. 访问根节点
    traverse(node.left);   // 2. 遍历左子树
    traverse(node.right);  // 3. 遍历右子树
  };

  traverse(this.root); // 从根节点开始遍历
  return result;
}
```

#### （2）中序遍历（左 → 根 → 右）

```typescript
/**
 * 中序遍历：左子树 → 根节点 → 右子树
 * 思考逻辑：
 * 1. 唯一区别是"访问根节点"的时机：在左子树遍历完成后；
 * 2. 二叉搜索树（BST）的中序遍历是有序数组，这是BST的核心特性；
 */
inOrder(): T[] {
  const result: T[] = [];

  const traverse = (node: TreeNode<T> | null) => {
    if (!node) return;

    traverse(node.left);   // 1. 遍历左子树
    result.push(node.val); // 2. 访问根节点
    traverse(node.right);  // 3. 遍历右子树
  };

  traverse(this.root);
  return result;
}
```

#### （3）后序遍历（左 → 右 → 根）

```typescript
/**
 * 后序遍历：左子树 → 右子树 → 根节点
 * 思考逻辑：
 * 1. 访问根节点的时机最晚：等左右子树都遍历完；
 * 2. 适合"后续处理"场景（如删除节点：先删子节点，再删父节点）；
 */
postOrder(): T[] {
  const result: T[] = [];

  const traverse = (node: TreeNode<T> | null) => {
    if (!node) return;

    traverse(node.left);   // 1. 遍历左子树
    traverse(node.right);  // 2. 遍历右子树
    result.push(node.val); // 3. 访问根节点
  };

  traverse(this.root);
  return result;
}
```

### 2. 广度优先遍历（BFS/层序遍历）：先宽后深 - 队列

BFS核心是用队列 “先进先出” 的特性，先入队根节点，然后循环出队当前节点（记录值），再按左→右顺序入队它的子节点，直到队列为空 —— 最终结果就是按层级、从左到右的遍历顺序。用 “概念拆解 + 逐行解析 + 可视化执行流程” 三步，把抽象的代码变成看得见的执行过程：

- 层序遍历规则：按 “层级” 从上到下、同一层从左到右遍历（比如示例树的遍历顺序是：第 1 层 1 → 第 2 层 2、3 → 第 3 层 4、5）；
- 队列的作用：队列是 “先进先出” 的容器，能保证「先处理上层节点，再处理下层节点」「同一层先处理左边，再处理右边」—— 这正是层序遍历的要求。

实现代码：

```js
  /**
   * 层序遍历核心方法
   */
  levelOrder(): T[] {
    // 步骤1：初始化结果数组（存储遍历结果）
    const result: T[] = [];
    // 步骤2：空树直接返回空数组（避免后续操作报错）
    if (this.isEmpty()) return result;

    // 步骤3：初始化队列，把根节点入队（队列是层序遍历的“核心工具”）
    // ! 是非空断言：因为isEmpty()已判断root非null
    const queue: TreeNode<T>[] = [this.root!];

    // 步骤4：循环处理队列，直到队列为空（所有节点处理完毕）
    while (queue.length > 0) {
      // 步骤4.1：出队“队首节点”（当前层级最左边的节点）
      const current = queue.shift()!;
      // 步骤4.2：记录当前节点值到结果数组
      result.push(current.val);

      // 步骤4.3：左子节点入队（先左后右，保证同一层顺序）
      if (current.left) queue.push(current.left);
      // 步骤4.4：右子节点入队
      if (current.right) queue.push(current.right);
    }

    // 步骤5：返回最终遍历结果
    return result;
  }
```

关键细节解释：

- **为什么用 shift() 而不是 pop()？**shift() 是 “删除数组第一个元素”（队列的 “出队”），pop() 是 “删除最后一个元素”（栈的 “出栈”）。层序遍历需要先进先出，所以必须用 shift()。
- **为什么先入队左子节点，再入队右子节点？**保证同一层节点的遍历顺序是 “左→右”（比如节点 2 的左子 4 先入队，右子 5 后入队，处理时就会先 4 后 5）。
- **isEmpty() 判断的作用？**避免空树时 queue 初始化传入 null，导致后续 shift() 和访问 val 报错，提升代码健壮性。
- **为什么是迭代实现（非递归）？**递归适合 “深度优先”（前 / 中 / 后序），但层序是 “广度优先”—— 用队列迭代更直观，且避免递归栈溢出（比如树深度很大时，递归会栈溢出，迭代不会）。
- **如果树是空的，代码会报错吗？**不会！isEmpty() 判断会直接返回空数组，避免了访问 root.val 或 shift() 空数组的错误。
- **shift() 的性能问题？**数组的 shift() 时间复杂度是 O (n)（因为要移动所有元素），如果树节点极多，可改用「链表实现的队列」优化；但日常开发中，这个实现足够清晰，满足大部分场景。
- **层序遍历和前序遍历的核心区别？**前序：深度优先（一条路走到黑，再回头），用递归 / 栈；层序：广度优先（一层一层扫），用队列。

执行流程：

```plaintext
        1（第1层）
       /   \
      2     3（第2层）
     / \
    4   5（第3层）
```

按 “时间线 + 队列状态 + 结果数组” 模拟执行:

| 步骤 | 操作（做了什么） | 队列内容（先进先出，[]=空） | 结果数组 result | 说明（层级对应） |
| --- | --- | --- | --- | --- |
| 1 | 调用 levelOrder()，初始化 result = [] | [] | [] | 初始状态 |
| 2 | 判断 isEmpty() → false（根节点存在） | [] | [] | 跳过空树逻辑 |
| 3 | 队列初始化：入队根节点 1 → queue = [1] | [1] | [] | 第 1 层节点入队 |
| 4 | 进入 while 循环（queue.length=1>0） | [1] | [] | 开始处理队列 |
| 5 | 出队队首 1 → current=1 | [] | [] | 处理第 1 层节点 |
| 6 | push(1) → result = [1] | [] | [1] | 记录第 1 层节点值 |
| 7 | 1 的左子 2 存在 → 入队 2 → queue = [2] | [2] | [1] | 第 2 层左节点入队 |
| 8 | 1 的右子 3 存在 → 入队 3 → queue = [2,3] | [2,3] | [1] | 第 2 层右节点入队 |
| 9 | 回到 while 循环（queue.length=2>0） | [2,3] | [1] | 处理第 2 层节点 |
| 10 | 出队队首 2 → current=2 | [3] | [1] | 先处理第 2 层左节点 |
| 11 | push(2) → result = [1,2] | [3] | [1,2] | 记录第 2 层左节点值 |
| 12 | 2 的左子 4 存在 → 入队 4 → queue = [3,4] | [3,4] | [1,2] | 第 3 层左节点入队 |
| 13 | 2 的右子 5 存在 → 入队 5 → queue = [3,4,5] | [3,4,5] | [1,2] | 第 3 层右节点入队 |
| 14 | 回到 while 循环（queue.length=3>0） | [3,4,5] | [1,2] | 继续处理第 2 层节点 |
| 15 | 出队队首 3 → current=3 | [4,5] | [1,2] | 处理第 2 层右节点 |
| 16 | push(3) → result = [1,2,3] | [4,5] | [1,2,3] | 记录第 2 层右节点值 |
| 17 | 3 的左子 null → 不入队 | [4,5] | [1,2,3] | 无第 3 层节点 |
| 18 | 3 的右子 null → 不入队 | [4,5] | [1,2,3] | 无第 3 层节点 |
| 19 | 回到 while 循环（queue.length=2>0） | [4,5] | [1,2,3] | 处理第 3 层节点 |
| 20 | 出队队首 4 → current=4 | [5] | [1,2,3] | 处理第 3 层左节点 |
| 21 | push(4) → result = [1,2,3,4] | [5] | [1,2,3,4] | 记录第 3 层左节点值 |
| 22 | 4 的左子 null → 不入队 | [5] | [1,2,3,4] | 无下一层节点 |
| 23 | 4 的右子 null → 不入队 | [5] | [1,2,3,4] | 无下一层节点 |
| 24 | 回到 while 循环（queue.length=1>0） | [5] | [1,2,3,4] | 处理第 3 层右节点 |
| 25 | 出队队首 5 → current=5 | [] | [1,2,3,4] | 处理第 3 层右节点 |
| 26 | push(5) → result = [1,2,3,4,5] | [] | [1,2,3,4,5] | 记录第 3 层右节点值 |
| 27 | 5 的左子 null → 不入队 | [] | [1,2,3,4,5] | 无下一层节点 |
| 28 | 5 的右子 null → 不入队 | [] | [1,2,3,4,5] | 无下一层节点 |
| 29 | 回到 while 循环 → queue.length=0 → 退出循环 | [] | [1,2,3,4,5] | 所有节点处理完毕 |
| 30 | levelOrder() 返回 result | [] | [1,2,3,4,5] | 最终结果 |

### 遍历方法验证（测试代码）

```typescript
// 初始化树并测试遍历
const tree = new BinaryTree<number>();

// 手动构建简单树：根(1) → 左(2)、右(3)；左(2) → 左(4)
tree.root = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));

console.log('前序遍历：', tree.preOrder()); // [1,2,4,3]
console.log('中序遍历：', tree.inOrder()); // [4,2,1,3]
console.log('后序遍历：', tree.postOrder()); // [4,2,3,1]
console.log('层序遍历：', tree.levelOrder()); // [1,2,3,4]
```

## 四、Step3：实现增/查/删核心操作（基于遍历扩展）

所有修改类操作的核心逻辑：**先遍历找到目标位置 → 执行操作 → 维护树结构**。

### 1. 插入节点（层序插入：保证完全二叉树）

```typescript
/**
 * 插入节点：层序插入（按层级填充空位置，保证完全二叉树）
 * 思考逻辑：
 * 1. 插入原则：优先填充左子节点，再填充右子节点，最后填充下一层（符合完全二叉树）；
 * 2. 实现依赖：层序遍历（找到第一个空的左/右子节点）；
 * 3. 边界处理：空树直接设为根节点；
 */
insert(val: T): void {
  const newNode = new TreeNode(val); // 新建节点

  // 空树：直接作为根节点
  if (this.isEmpty()) {
    this.root = newNode;
    return;
  }

  // 非空树：层序遍历找第一个空位置
  const queue: TreeNode<T>[] = [this.root!];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // 左子节点为空：插入左子
    if (!current.left) {
      current.left = newNode;
      return;
    }

    // 右子节点为空：插入右子
    if (!current.right) {
      current.right = newNode;
      return;
    }

    // 左右子都存在：入队继续找下一层
    queue.push(current.left, current.right);
  }
}
```

### 2. 查找节点（层序查找：效率稳定）

```typescript
/**
 * 查找节点：根据值查找节点
 * 思考逻辑：
 * 1. 查找优先用层序遍历：迭代实现，避免递归栈溢出，且平均效率高于DFS；
 * 2. 匹配规则：值全等（===），可扩展为自定义比较函数；
 * 3. 返回节点而非布尔：便于后续操作（如删除、修改）；
 */
find(val: T): TreeNode<T> | null {
  if (this.isEmpty()) return null;

  const queue: TreeNode<T>[] = [this.root!];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // 找到目标节点：直接返回
    if (current.val === val) return current;

    // 未找到：继续遍历子节点
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }

  return null; // 遍历完未找到
}
```

### 3. 删除节点（最复杂：保证删除后仍为二叉树）

删除的核心难点：删除节点后，需要用"最后一个节点"填充空位，避免树结构断裂。这样把 “删任意节点” 的复杂问题，简化成 “删叶子节点” 的简单问题（叶子节点只需切断父节点指针，无任何子树断裂风险）。核心思路：

- 层序遍历的核心目的：同时找 “要删的节点” 和 “最后一个节点”；
- 值替换：保留目标节点的位置（避免子树断裂），只换内容；
- 删最后节点：最后一个节点一定是叶子 / 近叶子，删起来最容易。

```typescript
/**
 * 删除节点：按值删除
 * 思考逻辑：
 * 1. 三步核心：找目标节点 → 找最后一个节点 → 替换值+删除最后一个节点；
 * 2. 最后一个节点：层序遍历的最后一个节点（最右下角的叶子节点）；
 * 3. 边界处理：单节点树、删除根节点、删除叶子节点；
 */
delete(val: T): boolean {
  if (this.isEmpty()) return false; // 空树删除失败

  let targetNode: TreeNode<T> | null = null; // 要删除的节点
  let lastNode: TreeNode<T> | null = null;   // 最后一个节点（用于替换）
  let lastNodeParent: TreeNode<T> | null = null; // 最后一个节点的父节点

  const queue: TreeNode<T>[] = [this.root!];

  // 第一步：遍历找目标节点 + 最后一个节点及其父节点
  while (queue.length > 0) {
    const current = queue.shift()!;

    // 记录目标节点
    if (current.val === val) targetNode = current;

    // 记录最后一个节点（遍历到最后就是）
    lastNode = current;

    // 入队子节点，同时记录父节点（用于后续删除最后一个节点）
    if (current.left) {
      lastNodeParent = current;
      queue.push(current.left);
    }

    if (current.right) {
      lastNodeParent = current;
      queue.push(current.right);
    }
  }

  // 未找到目标节点：删除失败
  if (!targetNode) return false;

  // 第二步：用最后一个节点的值替换目标节点的值（避免树结构断裂）
  targetNode.val = lastNode!.val;

  // 第三步：删除最后一个节点（切断父节点的指针）
  if (lastNodeParent) {
    // 判断最后一个节点是左/右子，切断对应指针
    if (lastNodeParent.right === lastNode) {
      lastNodeParent.right = null;
    } else {
      lastNodeParent.left = null;
    }
  } else {
    // 最后一个节点是根节点（树只有一个节点）：清空根节点
    this.root = null;
  }

  return true; // 删除成功
}
```

### 增删查验证（测试代码）

```typescript
const tree = new BinaryTree<number>();

// 插入节点
tree.insert(1);
tree.insert(2);
tree.insert(3);
tree.insert(4);

console.log('插入后层序：', tree.levelOrder()); // [1,2,3,4]

// 查找节点
console.log('查找3：', tree.find(3)?.val); // 3
console.log('查找5：', tree.find(5)); // null

// 删除节点
console.log('删除3：', tree.delete(3)); // true
console.log('删除后层序：', tree.levelOrder()); // [1,2,4]
console.log('删除1（根节点）：', tree.delete(1)); // true
console.log('删除后层序：', tree.levelOrder()); // [4,2]
```

## 五、Step4：实现辅助方法（完善功能）

基于核心逻辑扩展实用方法，覆盖"树的属性查询+清空"等场景。

### 1. 获取树的高度（递归版）

```typescript
/**
 * 获取树的高度：从根到最远叶子节点的层数
 * 思考逻辑：
 * 1. 递归公式：当前节点高度 = 1 + max(左子树高度, 右子树高度)；
 * 2. 终止条件：空节点高度为0；
 */
height(): number {
  // 递归辅助函数：计算单个节点的高度
  const getHeight = (node: TreeNode<T> | null): number => {
    if (!node) return 0; // 空节点高度0

    const leftHeight = getHeight(node.left); // 左子树高度
    const rightHeight = getHeight(node.right); // 右子树高度

    return Math.max(leftHeight, rightHeight) + 1; // 当前节点高度=子树最大高度+1
  };

  return getHeight(this.root);
}
```

### 2. 获取树的大小（节点总数）

```typescript
/**
 * 获取树的大小：所有节点的总数
 * 思考逻辑：层序遍历计数（迭代实现，避免递归栈溢出）
 */
size(): number {
  if (this.isEmpty()) return 0;

  let count = 0;
  const queue: TreeNode<T>[] = [this.root!];

  while (queue.length > 0) {
    const current = queue.shift()!;
    count++; // 每遍历一个节点，计数+1

    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }

  return count;
}
```

### 3. 清空树

```typescript
/**
 * 清空树：切断根节点引用，让GC回收所有节点
 * 思考逻辑：
 * 1. 简单方式：根节点设为null（推荐，JS GC会自动回收无引用的节点）；
 * 2. 严谨方式：递归切断所有子节点指针（避免内存泄漏，适合老版本JS）；
 */
clear(): void {
  // 递归清空所有子节点指针（可选，增强鲁棒性）
  const clearNode = (node: TreeNode<T> | null) => {
    if (!node) return;

    clearNode(node.left); // 清空左子树
    clearNode(node.right); // 清空右子树

    node.left = null; // 切断左指针
    node.right = null; // 切断右指针
  };

  clearNode(this.root);
  this.root = null; // 核心：切断根节点引用
}
```

## 六、二叉树处理的通用逻辑（核心方法论）

从上述实现中，可提炼出二叉树所有操作的通用规律，适用于任何树形结构：

### 1. 遍历是所有操作的基础

- 增/删/查/改 → 先遍历找到目标位置，再执行操作；
- 选遍历方式的原则：
  - 递归DFS（前/中/后序）：代码简洁，适合浅树、逻辑简单的场景；
  - 迭代BFS（层序）：避免栈溢出，适合深树/宽树、需要层级顺序的场景；

### 2. 边界防御是必做项

所有方法第一步必须校验：

- 空树（root === null）：直接返回/报错，避免空指针；
- 叶子节点（left/right都为null）：操作后无需回溯；
- 单节点树（root无左右子）：删除/修改后直接清空根节点；

### 3. 递归的核心：终止条件+子问题拆解

二叉树递归的万能公式：

```
function 递归函数(节点) {
  1. 终止条件：节点为null → 返回；
  2. 处理当前节点（可选，看遍历顺序）；
  3. 递归处理左子树（子问题1）；
  4. 递归处理右子树（子问题2）；
  5. 返回结果（可选，如高度/大小）；
}
```

### 4. 结构维护的核心：指针操作

二叉树的本质是"指针关联"，所有修改操作最终都是：

- 新增：给某个节点的left/right赋值；
- 删除：将某个节点的left/right设为null；
- 替换：修改节点的val，或替换left/right的指向；

### 5. 性能优化的通用思路

- 递归改迭代：避免深树的栈溢出（如层序遍历用队列）；
- 缓存中间结果：如计算高度时缓存子树高度，避免重复递归；
- 提前终止遍历：如查找节点时，找到后立即返回，无需遍历整棵树；

## 七、完整代码汇总（可直接复用）

```typescript
/**
 * 二叉树节点类
 * @template T 节点值类型
 */
class TreeNode<T> {
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
 * 二叉树完整实现
 * @template T 节点值类型
 */
class BinaryTree<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  // 判空
  isEmpty(): boolean {
    return this.root === null;
  }

  // 前序遍历
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

  // 中序遍历
  inOrder(): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T> | null) => {
      if (!node) return;

      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    };

    traverse(this.root);
    return result;
  }

  // 后序遍历
  postOrder(): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T> | null) => {
      if (!node) return;

      traverse(node.left);
      traverse(node.right);
      result.push(node.val);
    };

    traverse(this.root);
    return result;
  }

  // 层序遍历
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

  // 插入节点
  insert(val: T): void {
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

  // 查找节点
  find(val: T): TreeNode<T> | null {
    if (this.isEmpty()) return null;

    const queue: TreeNode<T>[] = [this.root!];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.val === val) return current;

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return null;
  }

  // 删除节点
  delete(val: T): boolean {
    if (this.isEmpty()) return false;

    let targetNode: TreeNode<T> | null = null;
    let lastNode: TreeNode<T> | null = null;
    let lastNodeParent: TreeNode<T> | null = null;

    const queue: TreeNode<T>[] = [this.root!];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.val === val) targetNode = current;

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

    targetNode.val = lastNode!.val;

    if (lastNodeParent) {
      if (lastNodeParent.right === lastNode) {
        lastNodeParent.right = null;
      } else {
        lastNodeParent.left = null;
      }
    } else {
      this.root = null;
    }

    return true;
  }

  // 获取树高度
  height(): number {
    const getHeight = (node: TreeNode<T> | null): number => {
      if (!node) return 0;

      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);

      return Math.max(leftHeight, rightHeight) + 1;
    };

    return getHeight(this.root);
  }

  // 获取树大小
  size(): number {
    if (this.isEmpty()) return 0;

    let count = 0;
    const queue: TreeNode<T>[] = [this.root!];

    while (queue.length > 0) {
      const current = queue.shift()!;
      count++;

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return count;
  }

  // 清空树
  clear(): void {
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
}
```

## 八、总结

实现二叉树的核心是"先掌握遍历，再基于遍历扩展操作"：

1. **基础层**：节点类+根节点，搭建空树；
2. **核心层**：实现4种遍历（DFS+ BFS），这是所有操作的基础；
3. **扩展层**：基于遍历实现增/查/删，注意边界防御；
4. **完善层**：补充高度、大小、清空等辅助方法；

记住：二叉树的所有操作，本质都是"遍历+条件处理"，掌握这个规律，无论是平衡树、二叉搜索树，还是N叉树，都能举一反三实现。
