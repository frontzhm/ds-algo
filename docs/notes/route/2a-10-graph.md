# 图的数据结构：从「多叉树」到存储与遍历

图（Graph）在算法题和工程里都很常见，但很多人一上来就被「邻接表、邻接矩阵、DFS、BFS」绕晕。其实只要抓住一点：**图就是「带环的多叉树」**，树会遍历，图也就会了一大半。这篇文章从直觉出发，把图在代码里怎么存、怎么遍历、以及一笔画（欧拉路径）怎么想，一次性讲清楚。

---

## 一、直觉：图 = 带环的多叉树

先把「图」和「树」的关系捋清楚：

|      | 多叉树        | 图                                        |
| ---- | ------------- | ----------------------------------------- |
| 结构 | 节点 + 子节点 | 节点 + 邻居                               |
| 环   | 无环          | 可以有环                                  |
| 遍历 | DFS / BFS     | 同样是 DFS / BFS                          |
| 关键 | 不用防重      | **必须用 visited 防重，否则有环会死循环** |

所以：**会树的遍历，就几乎会了图的遍历**，多出来的一步只是「标记已访问」。

逻辑上可以把图想成「一堆顶点 + 各自邻居」：

```js
// 逻辑上的图节点（理解用，实际很少这么写）
function Vertex(id, neighbors) {
  this.id = id;
  this.neighbors = neighbors;
}
```

真正写代码时，我们不会给每个点建一个类，而是用两种「二维结构」在内存里表示整张图：**邻接表**和**邻接矩阵**。下面分别说它们长什么样、什么时候用。

---

## 二、图的两种存储方式

### 1. 邻接表（最常用）

**含义**：有 `n` 个点，就开长度为 `n` 的数组，`table[from]` 里存「从 from 出发能到哪些点，以及边权」。  
每个元素可以是 `Map(to → weight)` 或数组，方便按点枚举邻居。

- **空间**：O(V + E)，只存存在的边。
- **适合**：边数远小于 V² 的**稀疏图**（大部分题和业务图都是这种）。
- **查一条边**：看 `table[from]` 里有没有 `to`，均摊 O(1)（用 Map）或 O(度数)。

示例：有向有权图。

```js
/**
 * 有向有权图 - 邻接表
 * table[v] = Map( 邻居节点 -> 边权 )
 */
class Graph {
  constructor(n) {
    this.table = new Array(n).fill(0).map(() => new Map());
  }
  addEdge(from, to, weight) {
    this.table[from].set(to, weight);
  }
  removeEdge(from, to) {
    return this.table[from].delete(to);
  }
  hasEdge(from, to) {
    return this.table[from].has(to);
  }
  weight(from, to) {
    return this.table[from].get(to) ?? null;
  }
  /** 返回 v 的所有出边：[{ to, weight }, ...] */
  neighbors(v) {
    return Array.from(this.table[v].entries()).map(([to, w]) => ({ to, weight: w }));
  }
  size() {
    return this.table.length;
  }
}
```

- **无向图**：一条无向边 (a, b) 等价于两条有向边 a→b 和 b→a，`addEdge(a,b,w)` 和 `addEdge(b,a,w)` 各调一次即可。
- **无权图**：边权固定为 1（或 0），不关心权重时可以不存。

---

### 2. 邻接矩阵

**含义**：`n` 个点用一个 `n×n` 的二维数组，`matrix[from][to]` 表示 from→to 的边权，0 表示无边。

- **空间**：O(V²)。
- **适合**：边很多、接近「任意两点都可能相连」的**稠密图**；或需要频繁判断「两点是否相邻」且 V 不太大时。
- **查一条边**：O(1)。枚举某点邻居需要扫一整行，O(n)。

```js
/**
 * 有向有权图 - 邻接矩阵
 * matrix[from][to] = 边权，0 表示无边
 */
class Graph {
  constructor(n) {
    this.matrix = new Array(n).fill(0).map(() => new Array(n).fill(0));
    this.nodeCount = n;
  }
  addEdge(from, to, weight) {
    this.matrix[from][to] = weight;
  }
  hasEdge(from, to) {
    return this.matrix[from][to] !== 0;
  }
  weight(from, to) {
    return this.matrix[from][to];
  }
  neighbors(v) {
    return this.matrix[v].reduce((acc, w, i) => {
      if (w !== 0) acc.push({ to: i, weight: w });
      return acc;
    }, []);
  }
  size() {
    return this.nodeCount;
  }
}
```

**小结**：

- **稀疏图用邻接表**，省空间、枚举邻居快。
- **稠密图或要 O(1) 判边用邻接矩阵**。
- 无向 = 双向加边；无权 = 权为 1。

---

## 三、图的 DFS：树遍历 + 防重

图的 DFS 和树的 DFS 思路一致，多一件事：**用 `visited` 标记已访问的点，避免沿环一直转**。

### 3.1 从起点能到达的所有点

```js
/** 从 startId 出发，DFS 能到达的所有顶点（去重） */
function getReachableVertex(graph, startId) {
  const res = new Set();
  const visited = new Array(graph.size()).fill(false);

  function dfs(u) {
    if (u < 0 || u >= graph.size() || visited[u]) return;
    visited[u] = true;
    res.add(u);
    for (const { to: v } of graph.neighbors(u)) dfs(v);
  }
  dfs(startId);
  return res;
}
```

### 3.2 从起点能到达的所有边

有时需要收集「经过的边」而不是点：

```js
/** 从 startId 出发，DFS 经过的边 [from, to][] */
function getReachableEdges(graph, startId) {
  const res = [];
  const visited = new Array(graph.size()).fill(false);

  function dfs(u) {
    if (visited[u]) return;
    visited[u] = true;
    for (const { to: v } of graph.neighbors(u)) {
      res.push([u, v]);
      dfs(v);
    }
  }
  dfs(startId);
  return res;
}
```

### 3.3 从起点到终点的所有路径（无环、回溯）

经典模板：**求从 start 到 target 的所有简单路径**（不重复经过点）。  
做法：用 `visited` 防止环，用 `path` 记录当前路径；进入节点时标记并加入 path，退出时恢复，这样同一层的其它分支还能再访问该点。

```js
/** 从 start 到 target 的所有无环路径 */
function getAllPathsNoLoop(graph, start, target) {
  const res = [];
  const visited = new Array(graph.size()).fill(false);
  const path = [];

  function dfs(u) {
    if (visited[u]) return;
    if (u === target) {
      res.push([...path, u]);
      return;
    }
    visited[u] = true;
    path.push(u);
    for (const { to: v } of graph.neighbors(u)) dfs(v);
    path.pop();
    visited[u] = false;
  }
  dfs(start);
  return res;
}
```

一句话：**前序进 path、后序出 path；visited 防环，path 记路线。**

---

## 四、图的 BFS：层序与最短

BFS 按「层」扩散：从起点开始，先处理完距离为 0 的，再距离为 1 的……所以**第一次到达目标点时，对应的步数/边数就是最短的**。求「最少步数」「边数最少路径」时，用 BFS 最直接。

要点：**入队时立刻标记 visited**，避免同一层里重复入队。

```js
/** 从 startId 开始 BFS，返回访问到的点序（按层） */
function bfsVertex(graph, startId) {
  const n = graph.size();
  const visited = new Array(n).fill(false);
  const q = [startId];
  visited[startId] = true;
  const res = [];
  let step = -1;
  while (q.length) {
    step++;
    const u = q.shift();
    res.push(u);
    for (const { to: v } of graph.neighbors(u)) {
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
    }
  }
  return res;
}
```

若要求**最短路径的边数**，可以按层计数：每处理完一层 `step++`，当某层中遇到 target 时，`step` 即为答案。若要输出路径，可在入队时记录 `parent` 或整条 path，从 target 反推回 start。

**小结**：

- **DFS + 回溯**：适合「所有路径」「所有方案」。
- **BFS**：适合「最短步数 / 最少边数」。

---

## 五、欧拉路径（一笔画）

**问题**：能否不重复地走完图中每条边（可重复经过点）？能的话，路径长什么样？

### 5.1 无向图：看度数

- 每个点有一个**度数**（连了几条边）。
- 路径经过一个「中间点」时，一定是「进一次、出一次」，所以中间点度数必为偶数。
- 只有**起点**可以多一条「出」；**终点**多一条「入」。所以起点、终点度数可以是奇数。

结论（无向图）：

- 所有点度数都是偶数 → 存在**欧拉回路**（从某点出发，一笔画回到该点）。
- 恰好 2 个点度数为奇 → 存在**欧拉路径**（从一奇点出发，在另一奇点结束）。
- 奇点个数不是 0 也不是 2 → 不能一笔画。

### 5.2 有向图：看出度与入度

有向图里每个点有**入度**（指向它的边数）和**出度**（从它指出的边数）。路径经过中间点时，每次「进」都要「出」，所以中间点必须 **入度 = 出度**；起点可以多一条「出」，终点可以多一条「入」。

结论（有向图）：

- 所有点都满足 **入度 = 出度** → 存在**欧拉回路**（从某点出发，一笔画回到该点）。
- 恰好 1 个点 **出度 = 入度 + 1**（起点）、恰好 1 个点 **入度 = 出度 + 1**（终点），其余点入度 = 出度 → 存在**欧拉路径**（从起点到终点）。
- 其他情况（例如两个点出度比入度多 1，或差值绝对值大于 1）→ 不能一笔画。

实现时：先统计每个点的 `inDeg[v]`、`outDeg[v]`，再根据上述条件判是否存在回路/路径并选起点（有路径时起点为「出度比入度大 1」的点），然后用下面的 Hierholzer 按有向边往下走即可。

### 5.3 Hierholzer 算法：随便走 + 后序压栈

思路：

1. 根据度数选起点（有奇点就选一奇点，否则任选）。
2. 从起点开始「随便走」：每走一条边就标记掉，走不动了就把当前点压入路径。
3. 因为每个中间点进=出，**走不动时一定停在「终点」**。
4. 递归返回时依次压入的是「倒序的路径」，最后把路径反序即得欧拉路径（或回路）。

```js
/**
 * 无向图欧拉路径/回路
 * @param {number} n 顶点数
 * @param {[number, number][]} edges 无向边，每条边只出现一次
 * @returns {number[] | null} 顶点序列，不能一笔画则 null
 */
function findEulerianPath(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const deg = new Array(n).fill(0);

  edges.forEach(([a, b], i) => {
    adj[a].push({ to: b, e: i });
    adj[b].push({ to: a, e: i });
    deg[a]++;
    deg[b]++;
  });

  const odds = deg.map((d, i) => (d % 2 === 1 ? i : -1)).filter(i => i >= 0);
  if (odds.length !== 0 && odds.length !== 2) return null;

  const visEdge = new Array(edges.length).fill(false);
  const path = [];
  const start = odds.length === 2 ? odds[0] : 0;

  function dfs(u) {
    while (adj[u].length) {
      const { to: v, e } = adj[u].pop();
      if (visEdge[e]) continue;
      visEdge[e] = true;
      dfs(v);
    }
    path.push(u);
  }
  dfs(start);

  if (!visEdge.every(Boolean)) return null;
  return path.reverse();
}
```

**妙处**：不用贪心选「该走哪条边」，随便走；**卡壳的位置一定是终点**，逆序即得答案。

---

## 六、总结：图的数据结构怎么记

1. **图 = 带环的多叉树**：遍历还是 DFS/BFS，多一个 `visited` 防环。
2. **存图**：稀疏用**邻接表**（数组 + Map/数组），稠密或要 O(1) 判边用**邻接矩阵**；无向=双向加边，无权=权为 1。
3. **DFS**：找连通块、枚举所有路径用 DFS，配合回溯和 `visited`。
4. **BFS**：最短步数、最少边数用 BFS，入队时标记 `visited`。
5. **欧拉路径**：无向图看度数（0 或 2 个奇点）；有向图看出/入度（全相等为回路，否则恰一起点、一终点）。用 Hierholzer「随便走 + 后序压栈再逆序」得到路径。

把「树 → 图」想成多了一个环和 visited，图的结构和遍历就会清晰很多；邻接表/邻接矩阵只是同一张图在内存里的两种存法，按场景选即可。
