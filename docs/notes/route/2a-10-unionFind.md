# 理解并查集Union-Find：从原理到练习

## 前言

并查集（Union-Find）是算法与数据结构中**解决动态连通性问题**的王牌数据结构，核心能力只有两个：**查询两个元素是否连通**、**将两个元素合并连通**。

它结构简洁、效率极高，广泛应用于连通分量统计、环检测、等价类划分等经典场景。本文将从**基础原理→平衡树优化→路径压缩→终极模板**层层递进，搭配**LeetCode高频真题**，来理解并查集。

---

# 一、并查集基础原理

并查集的核心是用一个`parent`一维数组，记录索引`i`节点的父节点，**物理上是数组，逻辑上是树**。

- 初始状态：每个节点的父节点是自己，自成一个连通分量

- 核心API：`find`（找根节点）、`union`（合并连通分量）、`connected`（判断是否连通）

### 基础并查集代码

```JavaScript

class UF {
  constructor(n) {
    // 记录连通分量
    this._count = n;
    // 节点 x 的父节点是 parent[x]
    this.parent = new Array(n);
    // 一开始互不连通
    // 父节点指针初始指向自己
    for (var i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }
  // 返回某个节点 x 的根节点
  find(x) {
    // 根节点的 parent[x] == x
    while (this.parent[x] !== x) x = this.parent[x];
    return x;
  }
  // 将 p 和 q 连接
  union(p, q) {
    var rootP = this.find(p);
    var rootQ = this.find(q);
    if (rootP === rootQ) return;
    // 将两棵树合并为一棵
    this.parent[rootP] = rootQ;
    // parent[rootQ] = rootP 也一样
    // 两个分量合二为一
    this._count--;
  }
  // 判断是不是连接
  // 返回图中有多少个连通分量 有几棵树
  connected(p, q) {
    var rootP = this.find(p);
    var rootQ = this.find(q);
    return rootP == rootQ;
  }
}
```

### 核心理解

并查集的“树”是逻辑概念，不是真实的树结构，完全由`parent`数组推导而来。

基础版合并方式过于暴力，容易退化成链表O(N)，导致`find`效率降低。

---

# 二、优化1：平衡树（按大小合并）

为了避免树退化成链表，引入`size`数组记录每棵树的节点数量，**合并时小树挂在大树上**，保证树的平衡，时间复杂度降至`O(logN)`。

### 平衡树版并查集代码

```JavaScript

class UF {
  constructor(n) {
    // 记录连通分量
    this._count = n;
    // 节点 x 的父节点是 parent[x]
    this.parent = new Array(n);
    this.size = new Array(n).fill(1);
    // 一开始互不连通
    // 父节点指针初始指向自己
    for (var i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }

  // 将 p 和 q 连接
  union(p, q) {
    var rootP = this.find(p);

    var rootQ = this.find(q);
    if (rootP === rootQ) return;
    // 将两棵树合并为一棵 谁重谁做parent  小树挂大树 = 并查集平衡的核心
    if (this.size[rootP] > this.size[rootQ]) {
      this.parent[rootQ] = rootP;
      // 谁变成子节点，谁的 size 不用维护  子树的 size 永远不会再被访问
      this.size[rootP] += this.size[rootQ];
    } else {
      this.parent[rootP] = rootQ;
      this.size[rootQ] += this.size[rootP];
    }

    // 两个分量合二为一
    this._count--;
  }


}
```

---

# 三、优化2：路径压缩

并查集只关心**根节点**，路径压缩的目标是把树压成**两层结构**（根节点+子节点），让`find`操作达到`O(1)`。

### 路径压缩实现(后序)

```JavaScript


find(x) {
  if(x === this.parent[x]){
    return x
  }
  // 先去找到根节点
  const root = find(this.parent[x])
  // 然后在后序的位置赋值（一点点往回走 想象）
  this.parent[x] =root
  return root
 }
```

---

# 四、终极版并查集（面试首选）

整合**递归路径压缩+按大小平衡树**，时间复杂度近乎`O(1)`，所有场景通用。

```JavaScript

/**
 * 并查集 Union-Find 模板（最强版）
 * 功能：解决动态连通性问题（判断两点是否连通、合并连通分量）
 * 优化：递归路径压缩 + 按大小平衡树
 * 时间复杂度：近乎 O(1)
 */
class UF {
  /**
   * 构造函数：初始化 n 个节点
   * @param {number} n - 节点总数
   */
  constructor(n) {
    // 连通分量的个数（初始：每个节点自己就是一个分量）
    this.treeCount = n;

    // 核心数组：parent[i] 表示节点 i 的父节点
    // 初始状态：每个节点的父节点都是自己（自己是根节点）
    this.parent = new Array(n).fill(0).map((_, index) => index);

    // 树的大小：treeSize[i] 表示以 i 为根节点的树的节点数量
    // 初始状态：每棵树只有自己 1 个节点
    this.treeSize = new Array(n).fill(1);
  }

  /**
   * 查找节点 x 的根节点 + 【路径压缩】
   * 递归实现：找到根后，回溯时把路径上所有节点直接挂到根节点（压扁树）
   * 执行完find后，树一定是扁平的
   * @param {number} x - 要查找的节点
   * @return {number} 根节点
   */
  find(x) {
    // 递归终止条件：如果节点的父节点是自己，说明找到了根节点
    if (x === this.parent[x]) {
      return x;
    }

    // 递归查找父节点的根节点（DFS 一直钻到底）
    const root = this.find(this.parent[x]);

    // 【后序位置：路径压缩】
    // 回溯时，把当前节点 x 直接挂到根节点上，下次查找 O(1)
    this.parent[x] = root;

    // 返回根节点
    return root;
  }

  /**
   * 合并两个节点 p 和 q 所在的连通分量，后面的变量当做parent好了
   * @param {number} p
   * @param {number} q
   */
  union(p, q) {
    // 分别找到 p 和 q 的根节点
    const rootP = this.find(p);
    const rootQ = this.find(q);

    // 如果两个节点根相同，说明已经连通，直接返回
    if (rootP === rootQ) return;

    // ==============================
    // ✅ 重点：find 已经把树打平了
    // ✅ 这里怎么合并都不影响速度！所以为了视觉，直接后者为parent好了
    // ==============================
    this.parent[rootP] = rootQ;
    // 只需要更新根结点的size
    this.treeSize[rootQ] += this.treeSize[rootP];

    // 两个分量合二为一，连通分量总数 -1
    this.treeCount--;
  }

  /**
   * 判断两个节点 x 和 y 是否连通
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  connected(x, y) {
    // 连通的定义：两个节点拥有同一个根节点
    return this.find(x) === this.find(y);
  }

  /**
   * 获取节点 x 所在树的节点总数
   * @param {number} x
   * @return {number}
   */
  getSize(x) {
    // 找到根节点，返回根节点对应的 size
    return this.treeSize[this.find(x)];
  }

  /**
   * 获取当前连通分量的总数
   * @return {number}
   */
  getCount() {
    return this.treeCount;
  }
}
```

---

# 五、LeetCode 真题实战（完整版）

---

## 题目1：323. 无向图中连通分量的数目

🔗 [LeetCode 323](https://leetcode.cn/problems/number-of-connected-components-in-an-undirected-graph/)

### 描述

给定`n`个节点（编号`0`到`n-1`）的无向图，和边列表`edges`，求图中连通分量的数目。

### 示例

```Plain Text

输入: n = 5, edges = [[0,1],[1,2],[3,4]]
输出: 2
```

### 思路

无向图连通分量统计 → 直接用并查集合并所有边，最终连通分量数量就是答案。

### 代码

```JavaScript

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var countComponents = function(n, edges) {
  // 初始化并查集，n个节点
  const uf = new UF(n);
  // 遍历所有边，合并两个节点所在的连通分量
  for (let [u, v] of edges) {
    uf.union(u, v);
  }
  // 最终连通分量的数量就是答案
  return uf.getCount();
};

```

---

## 题目2：130. 被围绕的区域（原324）

🔗 [LeetCode 130](https://leetcode.cn/problems/surrounded-regions/)

### 描述

给你一个`m x n`的矩阵`board`，由若干字符`'X'`和`'O'`组成，捕获所有**被围绕**的区域，并将区域中的所有`'O'`用`'X'`填充。

### 示例

```Plain Text

输入：board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
输出：[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
```

### 思路

1. 边界上的`O`永远不会被包围，用**虚拟节点**连接所有边界`O`

2. 内部与虚拟节点不连通的`O`，转为`X`

### 代码

```JavaScript

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
  // 获取矩阵的行数和列数
  let rows = board.length;
  if (rows === 0) return;
  let cols = board[0].length;
  if (cols === 0) return;

  // 计算总节点数，二维坐标(i,j) 转一维 id：i * cols + j
  const nodeCount = rows * cols;

  // 初始化并查集，多开一个位置给【虚拟节点 dummyId】
  // 作用：所有与边界连通的 O 都和这个虚拟节点连通
  const uf = new UF(nodeCount + 1);
  const dummyId = nodeCount; // 虚拟节点编号

  // 上下左右四个方向
  const dir = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  // BFS 队列：从边界 O 开始扩散
  const queue = [];

  // ==============================================
  // 核心函数：如果当前是 O，就把它连到虚拟节点，并加入队列
  // ==============================================
  function unionDummyId(i, j) {
    const curVal = board[i][j];
    const curId = i * cols + j; // 二维坐标转一维ID

    // 只有是 O，并且还没连到虚拟节点时，才进行合并
    if (curVal === 'O' && !uf.connected(curId, dummyId)) {
      uf.union(curId, dummyId); // 合并到虚拟节点，表示这个 O 不会被吃掉
      queue.push(curId); // 加入队列，继续BFS扩散
    }
  }

  // ==============================================
  // 第一步：处理四条边界上的所有 O
  // 边界上的 O 一定不会被包围，直接连虚拟节点
  // ==============================================
  // 第一行 & 最后一行
  for (let j = 0; j < cols; j++) {
    unionDummyId(0, j);
    unionDummyId(rows - 1, j);
  }
  // 第一列 & 最后一列
  for (let i = 0; i < rows; i++) {
    unionDummyId(i, 0);
    unionDummyId(i, cols - 1);
  }

  // ==============================================
  // 第二步：BFS 扩散
  // 从边界 O 出发，把所有连通的 O 都合并到虚拟节点
  // ==============================================
  while (queue.length) {
    const curId = queue.shift(); // 取出队首

    // 一维ID 转回二维坐标
    const r = Math.floor(curId / cols);
    const c = curId % cols;

    // 遍历四个方向
    for (const [dr, dc] of dir) {
      const nr = r + dr;
      const nc = c + dc;

      // 判断是否在合法范围内
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        unionDummyId(nr, nc); // 合法就尝试合并
      }
    }
  }

  // ==============================================
  // 第三步：最终遍历
  // 不和虚拟节点连通的 O → 被包围 → 变成 X
  // ==============================================
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const curId = i * cols + j;
      // 如果是 O 且不连通虚拟节点 → 翻转成 X
      if (board[i][j] === 'O' && !uf.connected(curId, dummyId)) {
        board[i][j] = 'X';
      }
    }
  }
};
```

---

## 题目3：990. 等式方程的可满足性

🔗 [LeetCode 990](https://leetcode.cn/problems/satisfiability-of-equality-equations/)

### 描述

由小写字母组成的数组`equations`，每个方程长度为4，形式为`a==b`或`a!=b`，判断所有方程是否同时满足。

### 示例

```Plain Text

输入：["a==b","b!=a"]
输出：false
```

### 思路

1. 先合并所有`==`的字母

2. 再检查所有`!=`的字母，若连通则矛盾

### 代码

```JavaScript

var equationsPossible = function (equations) {
  // 26个小写字母，初始化并查集
  const uf = new UF(26);
  const aCode = 'a'.charCodeAt(0);

  // 用来存储所有 != 的式子，最后统一检查
  let notArr = [];

  // 第一轮：只处理 == ，合并连通
  for (let i = 0; i < equations.length; i++) {
    const str = equations[i];
    const isEqual = str.slice(1, 3) === '==';

    // 如果是 != ，先存起来，后面统一判断
    if (!isEqual) {
      notArr.push(i); // 把下标存进去
      continue;
    }
    const n1 = str.charCodeAt(0) - aCode; // 转成 0-25
    const n2 = str.charCodeAt(3) - aCode;

    // 如果是 == ，直接合并
    uf.union(n1, n2);
  }

  // 第二轮：检查所有 != 是否冲突
  // 如果已经连通，却要求 != → 矛盾，return false
  for (let i = 0; i < notArr.length; i++) {
    const str = equations[notArr[i]];
    const n1 = str.charCodeAt(0) - aCode;
    const n2 = str.charCodeAt(3) - aCode;

    // 核心判断：连通 && != → 冲突
    if (uf.connected(n1, n2)) {
      return false;
    }
  }

  // 全部无冲突
  return true;
};
```

---

## 题目4：547. 省份数量

🔗 [LeetCode 547](https://leetcode.cn/problems/number-of-provinces/)

### 描述

`n`个城市，`isConnected[i][j]=1`表示城市连通，省份是连通城市的集合，求省份数量。

### 示例

```Plain Text

输入：isConnected = [[1,1,0],[1,1,0],[0,0,1]]
输出：2
```

### 思路

省份 = 连通分量 → 并查集合并所有连通城市，返回连通分量数量。

### 代码

```JavaScript

var findCircleNum = function (isConnected) {
  const n = isConnected.length;
  if (n === 0) return 0;
  const uf = new UF(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (isConnected[i][j] === 1) uf.union(i, j);
    }
  }
  return uf.getCount();
};
```

---

## 题目5：1361. 验证二叉树

🔗 [LeetCode 1361](https://leetcode.cn/problems/validate-binary-tree-nodes/)

### 描述

给定`n`个节点的二叉树，`leftChild`和`rightChild`记录子节点，验证是否是一颗合法二叉树。

### 示例

```Plain Text

输入：n = 4, leftChild = [1,-1,3,-1], rightChild = [2,-1,-1,-1]
输出：true
```

### 思路

1. 入度校验：根节点入度=0，其余入度=1，只要不是就false

2. 并查集校验：无环+全连通

### 代码

```JavaScript

var validateBinaryTreeNodes = function (n, leftChild, rightChild) {
  // ===================== 第一步：统计每个节点的【入度】（有几个父节点） =====================
  // 有效二叉树规则：
  // 1. 根节点入度 = 0
  // 2. 其余所有节点入度 = 1
  // 3. 任何节点入度 ≥ 2 → 直接非法
  const inDegree = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // 取出当前节点 i 的左孩子
    const left = leftChild[i];
    // 如果左孩子存在（不是 -1）
    if (left !== -1) {
      inDegree[left]++; // 左孩子的父节点数量 +1
      if (inDegree[left] >= 2) return false; // 有两个爹 → 不是二叉树
    }

    // 取出当前节点 i 的右孩子
    const right = rightChild[i];
    // 如果右孩子存在
    if (right !== -1) {
      inDegree[right]++; // 右孩子的父节点数量 +1
      if (inDegree[right] >= 2) return false; // 有两个爹 → 不是二叉树
    }
  }

  // ===================== 第二步：检查根节点数量 =====================
  // 有效二叉树必须有【且只有1个】根节点（入度为 0）
  let zeroCountInDegree = 0;
  inDegree.forEach(item => {
    if (item === 0) zeroCountInDegree++;
  });
  // 0个根 或 多个根 → 非法
  if (zeroCountInDegree !== 1) return false;

  // ===================== 第三步：并查集检查【是否成环】+【是否全连通】 =====================
  const uf = new UF(n);

  for (let i = 0; i < n; i++) {
    const left = leftChild[i];
    // 左孩子存在
    if (left !== -1) {
      // 如果 i 和 left 已经连通 → 再连就成环
      if (uf.connected(i, left)) return false;
      uf.union(i, left); // 连接父节点 i 和 左孩子
    }

    const right = rightChild[i];
    // 右孩子存在
    if (right !== -1) {
      // 如果 i 和 right 已经连通 → 再连就成环
      if (uf.connected(i, right)) return false;
      uf.union(i, right); // 连接父节点 i 和 右孩子
    }
  }

  // 最后必须只有 1 个连通分量 → 所有节点连成【一颗树】
  return uf.getCount() === 1;
};
```

---

## 题目6：947. 移除最多的同行或同列石头

🔗 [LeetCode 947](https://leetcode.cn/problems/most-stones-removed-with-same-row-or-column/)

### 描述

二维平面上有`stones`石头，同行/同列的石头可移除，求最多能移除多少石头。

### 示例

```Plain Text

输入：stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]
输出：5
```

### 思路

1. 同行/同列 = 连通

2. 每个连通分量最多剩1个石头

3. 最大移除数 = 总石头数 - 连通分量数

4. uf只能连通一维，所以为了方便打平x,y

### 代码

```JavaScript

var removeStones = function (stones) {
  // 一整块连通的石头，最后能剩几个？不管多大一堆，最后只能剩 1 个！
  // 一堆n快石头 分成3堆 那么只需要留下3个石头， 3 = n- 删掉的石头数量
  // 删掉的石头数量 = n - 堆数
  // 核心结论：
  // 能删除的最多石头数 = 总石头数 - 连通分量的数量（每组分剩1个）
  const n = stones.length;

  // x范围 0~10000，y+10001 后范围 200001
  const uf = new UF(20002);

  // 遍历所有石头，把 所在行x 和 所在列y+10000 连通
  for (let [x, y] of stones) {
    y += 10001; // 避免行、列数字冲突
    uf.union(x, y); // 每块石头连接
  }

  // 统计：有多少个独立的连通分量（根不同）
  let countSet = new Set();
  for (let [x] of stones) {
    const root = uf.find(x);
    countSet.add(root);
  }

  // 最终答案：总数 - 连通块数量
  return n - countSet.size;
};
```

---

# 六、总结

并查集是**极简且高效**的数据结构，核心就是**连通、查询、合并**：

1. 基础版：`parent`数组维护父子关系

2. 平衡优化：小树挂大树，避免退化

3. 路径压缩：压扁树，`O(1)`查询

4. 终极模板：递归压缩+按大小合并，面试万能解
