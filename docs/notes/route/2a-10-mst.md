# 最小生成树（MST）核心原理 + Kruskal & Prim 算法

## 一、最小生成树 MST 基础概念

MST(Minimum Spanning Tree),在一个**带权无向图**中，能够连接所有顶点且边权总和最小的树。本质是图论中最优连接方案，连接所有顶点且总权重最小。适用场景：通信网络、电力网络、基础设施布线等最经济连接问题。前提条件：必须是**带权无向连通图**，不连通则不存在 MST。

---

## 二、Kruskal 算法（贪心 + 并查集）

### 核心思想

1. 将所有边**按权重从小到大排序**

2. 依次选边，用并查集判断是否成环

3. 不成环则加入 MST，直到所有点连通

### 适用场景

- **直接给出 edges 边数组**

- **稀疏图**（点多边少）

- 代码最简单、最不容易出错

### 完整模板代码（含注释）

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

/**
 * 使用 Kruskal 算法寻找图的最小生成树
 * @param {number} n - 图中节点的数量
 * @param {number[][]} edges - 边数组，每个元素为 [u, v, weight]
 * @return {number[][] | null} - 最小生成树边集，不连通返回 null
 */
var Kruskal = function (n, edges) {
  // 并查集：管理节点连通性，避免生成环
  let uf = new UF(n);
  // 核心：按边的权重从小到大排序（贪心策略）
  edges.sort((a, b) => a[2] - b[2]);

  // 存储最小生成树的边
  let mst = [];
  // 最小生成树总权重
  let mstWeight = 0;

  // 遍历所有排序后的边
  for (let [u, v, weight] of edges) {
    // 若两点已连通，跳过（防止成环）
    if (uf.connected(u, v)) continue;

    // 合并连通分量，并将边加入 MST
    uf.union(u, v);
    mst.push([u, v, weight]);
    mstWeight += weight;

    // 所有节点已连通，提前退出循环
    if (uf.getCount() === 1) break;
  }

  // 图不连通，无最小生成树
  if (uf.getCount() > 1) return null;

  // 返回最小生成树
  return mst;
};
```

---

## 三、实战题目：LeetCode 1584 连接所有点的最小费用

### 题目信息

- **题号**：1584

- **链接**：[https://leetcode.cn/problems/min-cost-to-connect-all-points/](https://leetcode.cn/problems/min-cost-to-connect-all-points/)

- **描述**：给定平面点集，连接所有点，费用为曼哈顿距离，求最小总费用。

### 示例

输入：`points = [[0,0],[2,2],[3,10],[5,2],[7,0]]`

输出：`20`

### 思路

1. 两点之间都能连边，先**构建所有边**

2. 计算曼哈顿距离作为权重

3. 直接套用 **Kruskal 算法**

### 代码

```JavaScript

var minCostConnectPoints = function (points) {
  const n = points.length;
  const edges = [];
  // 构建边数组
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      const weight = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      edges.push([i, j, weight]);
    }
  }
  // 使用Kruskal算法求最小生成树
  let uf = new UF(n);
  edges.sort((a, b) => a[2] - b[2]);
  let mstWeight = 0;
  for (let [u, v, weight] of edges) {
    if (uf.connected(u, v)) continue;
    uf.union(u, v);
    mstWeight += weight;
    if (uf.getCount() === 1) break;
  }

  return mstWeight;
};
```

---

## 四、Prim 算法（贪心 + 最小堆）

### 核心思想

1. 从任意点出发，**每次选权重最小的边**

2. 用堆维护候选边

3. 用 visited 避免成环

4. 逐步扩展生成树

### 适用场景

- **给出 graph 邻接表**

- **稠密图**（点少边多）

- 无需构建边列表，直接遍历邻居

### 完整模板代码（含注释）

```JavaScript

/**
 * 通用堆（优先队列）：支持自定义比较逻辑
 * 适配所有Dijkstra场景（距离、概率、步数等）
 * @param {Function} compareFn - 比较函数：
 *   - 返回 < 0：a 应该排在 b 前面（a 优先级更高）
 *   - 返回 = 0：a 和 b 优先级相同
 *   - 返回 > 0：b 应该排在 a 前面（b 优先级更高）
 */
class Heap {
  constructor(compareFn) {
    this.arr = [];
    // if(a<b) .... 改成 this.compare(a,b)<0
    // if(a[0]<b[0]) .... 那么传入compareFn ((a, b) => a[0] - b[0])然后this.compare(a,b)<0
    // compare里面参数是前后两个元素，但是比较逻辑自定义
    this.compare = compareFn || ((a, b) => a - b);
  }

  parent(idx) {
    return Math.floor((idx - 1) / 2);
  }
  left(idx) {
    return idx * 2 + 1;
  }
  right(idx) {
    return idx * 2 + 2;
  }

  swim(idx) {
    let p = idx;
    while (this.parent(p) >= 0) {
      const parentIdx = this.parent(p);
      // 核心：用自定义compare判断是否满足堆特性
      if (this.compare(this.arr[parentIdx], this.arr[p]) <= 0) break;
      [this.arr[p], this.arr[parentIdx]] = [this.arr[parentIdx], this.arr[p]];
      p = parentIdx;
    }
  }

  sink(idx) {
    let p = idx;
    while (this.left(p) < this.arr.length) {
      const left = this.left(p);
      const right = this.right(p);
      let minIdx = left;

      // 核心：用自定义compare找优先级更高的子节点
      if (right < this.arr.length && this.compare(this.arr[right], this.arr[minIdx]) < 0) {
        minIdx = right;
      }
      if (this.compare(this.arr[p], this.arr[minIdx]) <= 0) break;
      [this.arr[p], this.arr[minIdx]] = [this.arr[minIdx], this.arr[p]];
      p = minIdx;
    }
  }

  push(val) {
    this.arr.push(val);
    this.swim(this.arr.length - 1);
  }

  shift() {
    if (this.arr.length === 0) return null;
    const res = this.arr[0];
    this.arr[0] = this.arr.at(-1);
    this.arr.pop();
    this.sink(0);
    return res;
  }

  isEmpty() {
    return this.arr.length === 0;
  }

  size() {
    return this.arr.length;
  }
}

// Prim 算法：求解无向图的【最小生成树 MST】
// graph：邻接表表示的图，graph[u] = [[v, weight], ...] 代表 u 到 v 有一条权重为 weight 的边
function prim(graph) {
  // 获取图的节点总数
  const n = graph.length;
  // 边界判断：空图直接返回 null（无生成树）
  if (!graph || n === 0) return null;

  // 存储最终的最小生成树（保存所有选中的边）
  let mst = [];
  // 标记节点是否已经加入最小生成树，初始全为 false
  const visited = new Array(graph.length).fill(false);
  // 记录已经加入 MST 的节点数量
  let visitedCount = 0;
  // 记录最小生成树的总权重（可选，这里已计算）
  let mstWeight = 0;

  // 最小堆（优先队列）：用于每次选择权值最小的边
  // 堆中元素格式：[当前节点curId, 来源节点from, 边权重weight]
  // 比较规则：按权重升序排列，权重越小越先出队
  const pMinQueue = new Heap((before, after) => before[2] - after[2]);

  // 初始化：从 0 号节点开始构建 MST
  // from = -1 表示 0 号节点是起点，没有父节点
  pMinQueue.push([0, -1, 0]);

  // 核心循环：不断从堆中取出权值最小的边，直到堆为空
  while (!pMinQueue.isEmpty()) {
    // 取出堆顶元素（权重最小的边）
    // curId：即将要访问的节点
    // from：从哪个节点过来的（父节点）
    // weight：这条边的权重
    const [curId, from, weight] = pMinQueue.shift();

    // ✅ 关键：如果该节点已经加入 MST，直接跳过
    // 因为堆里可能存在多条指向该节点的旧边，必须过滤
    if (visited[curId]) continue;

    // 标记当前节点已加入 MST
    visited[curId] = true;
    // 累加这条边的权重到总权重
    mstWeight += weight;
    // 非起点节点（from != -1），将这条边加入最小生成树
    from !== -1 && mst.push([curId, from, weight]);
    // 已加入 MST 的节点数 +1
    visitedCount++;

    // 优化：所有节点已加入 MST，提前结束循环
    if (visitedCount === n) break;

    // 遍历当前节点的所有邻接节点
    const neighbors = graph[curId] || [];
    for (let [nextId, nextWeight] of neighbors) {
      // 如果邻接节点已经在 MST 中，跳过（避免形成环）
      if (visited[nextId]) continue;

      // 将邻接节点加入优先队列
      // 格式：[邻接节点, 当前节点, 边权重]
      pMinQueue.push([nextId, curId, nextWeight]);
    }
  }

  // 如果最终加入 MST 的节点数 < 总节点数 → 图不连通，无最小生成树
  if (visitedCount < n) return null;

  // 返回最小生成树的所有边
  return mst;
}
```

---

## 五、Kruskal vs Prim 如何选择？

### 🌿 Kruskal

- 适合：**直接给 edges 边数组**

- 适合：**稀疏图**

- 数据结构：并查集

- 优点：代码短、逻辑简单

### 🌿 Prim

- 适合：**给 graph 邻接表**

- 适合：**稠密图**

- 数据结构：最小堆

- 优点：无需建边，遍历邻居更自然

一句话口诀

```Plain Text

给边用 Kruskal
给图用 Prim
简单用 Kruskal
稠密用 Prim
```

- MST = 连接所有点、无环、总权重最小的树

- **Kruskal**：排序边 + 并查集判环 → 最常用、最简单

- **Prim**：堆选最小边 + 邻接表遍历 → 适合稠密图/邻接表
