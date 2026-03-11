# Dijkstra 算法：从 BFS 到带权最短路径

最短路径问题可以抽象成：在加权图中，求从起点到某点（或所有点）的「路径边权之和」最小的那条路。**Dijkstra** 解决的是**边权非负**的**单源最短路径**：从某个起点出发，到其余各点的最短距离。很多题还会加上「点到点」「最多走 K 步」等约束，本质都是在同一套框架上改松弛规则或状态维度。这篇博客把「思想 → 通用堆 → 三种模板 → 常见变形」串起来，相同逻辑的代码只保留一份，方便查阅和套用。

---

## 一、直觉：Dijkstra = BFS + 贪心

- **无权图**：BFS 按层扩散，第一次到达某点时的步数就是最短步数。
- **带权图**：边数最少不一定权和最小，所以要按「当前路径的权和」来扩展：**优先扩展当前距离最小的点**，第一次从堆里弹出终点时，对应的距离就是最短距离。

实现上只需要把 BFS 的两处改掉：

1. **队列** → **优先队列（最小堆）**：按「到起点的距离」排序，每次弹出距离最小的点。
2. **visited** → **distTo（dp）**：用数组记录「到起点的当前最短距离」，既防重复无效扩展，又直接得到答案。

因此：**Dijkstra = BFS + 优先队列 + 用 distTo 代替 visited**。下面所有模板都基于同一套「堆 + dp」的写法。

---

## 二、通用堆

Dijkstra 里需要「按第一维（距离/代价/概率）排序」的优先队列，用**带比较函数的堆**最通用：最小堆用 `(a,b)=>a[0]-b[0]`，最大堆用 `(a,b)=>b[0]-a[0]`，后面所有模板都复用这一个类。

```js
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
```

---

## 三、模板一：单源最短路径（到所有点）

**输入**：邻接表 `graph`（`graph[i]` 为 `[ [邻居 id, 边权], ... ]`）、起点 `start`。  
**输出**：一维数组 `dp`，`dp[i]` 表示起点到节点 `i` 的最短距离，不可达为 `Infinity`。

核心就是：**优先队列存 [到起点的距离, 节点 id]**，**dp 记录到起点的当前最短距离**；每次弹出「当前距离最小」的点，若已不是最优则剪枝，否则用其邻居做松弛（`newDis = curDis + weight`），更优则更新 `dp` 并入队。

```js
function Dijkstra(graph, start) {
  const n = graph.length;
  if (!graph || n === 0) return [];
  if (start < 0 || start >= n) return [];
  const pMinQueue = new Heap((before, after) => before[0] - after[0]);
  // 优先最小队列存放的每项是 [该点到起点的距离，该点]
  pMinQueue.push([0, start]);
  // dp[i]表示i点到起点的最短距离，这个值在遍历过程中会不停地更新，初始化为Infinity，如果最后还是Infinity，说明这个点没到达过
  const dp = new Array(n).fill(Infinity);
  // 起始点到起始点的距离肯定是0
  dp[start] = 0;

  while (!pMinQueue.isEmpty()) {
    // 当前点的距离是索引
    const [curDis, curIdx] = pMinQueue.shift();
    // 这里需要剪枝，因为同一个点到起点的距离，可能被推送多次，如果不是最短距离，就跳过
    if (curDis > dp[curIdx]) continue;

    // 然后开始往前走,先获取邻点
    const neighbors = graph[curIdx] || [];
    for (let [nextId, weight] of neighbors) {
      // 这个邻居到起点的距离就是
      const newDistance = curDis + weight;
      // 如果这个邻居以前到达过，那么获取它以前到起点的距离
      const oldDistance = dp[nextId];
      // 如果新路线更短，更新最短路径，并且入队列，这里注意，队列里可能也存在该点到起点的老距离，这也就是为啥上面curDis要做一次剪枝的原因，遇到同一个点，如果已经有更短的，那么当前就跳过就好
      if (newDistance < oldDistance) {
        dp[nextId] = newDistance;
        pMinQueue.push([newDistance, nextId]);
      }
    }
  }
  // 队伍空了表示，该走的都走了
  return dp;
}
```

**适用**：例如 LeetCode 743（网络延迟时间）——跑一遍单源 Dijkstra，取 `dp` 中除起点外的最大值即为「最晚收到信号的时间」，若有 `Infinity` 则返回 -1。

---

## 四、模板二：点到点最短路径（到 target 提前返回）

在模板一的基础上多加一个参数 `target`，**第一次从堆里弹出 `target` 时，当前 `dp[target]` 就是答案**，可直接返回，不必再扩展完所有点。

```js
function Dijkstra(graph, start, target) {
  const n = graph.length;
  if (!graph || n === 0) return Infinity;
  if (start < 0 || start >= n || target < 0 || target >= n) return Infinity;
  const pMinQueue = new Heap((before, after) => before[0] - after[0]);
  // 优先最小队列存放的每项是 [该点到起点的距离，该点]
  pMinQueue.push([0, start]);
  // dp[i]表示i点到起点的最短距离，这个值在遍历过程中会不停地更新，初始化为Infinity，如果最后还是Infinity，说明这个点没到达过
  const dp = new Array(n).fill(Infinity);
  // 起始点到起始点的距离肯定是0
  dp[start] = 0;

  while (!pMinQueue.isEmpty()) {
    const [curDis, curIdx] = pMinQueue.shift();
    // 这里需要剪枝，因为同一个点到起点的距离，可能被推送多次，如果不是最短距离，就跳过
    if (curDis > dp[curIdx]) continue;
    // 注意，如果刚开始target离起点很远的话，会被排在队列的最后面，一直到其他短距离都被遍历完，才会到，所以遍历到的时候，就是当前队列里的最小值
    if (curIdx === target) return dp[curIdx];

    const neighbors = graph[curIdx] || [];
    for (let [nextId, weight] of neighbors) {
      const newDistance = curDis + weight;
      const oldDistance = dp[nextId];
      if (newDistance < oldDistance) {
        dp[nextId] = newDistance;
        pMinQueue.push([newDistance, nextId]);
      }
    }
  }
  return dp[target];
}
```

**适用**：只关心起点到终点的最短距离、且图较大时，可少扩展很多点。

---

## 五、模板三：带「最多 K 步」限制（dp 加一维步数）

有些题限制「最多经过 K 条边」（如 LeetCode 787 最多 K 站中转）。此时状态要加上「已经走了几步」：**dp[i][step] = 从起点到节点 i、恰好用 step 步时的最短距离**。松弛时 `nextStep = curStep + 1`，只有 `nextStep <= maxStep` 才入队；当 **curStep === maxStep** 时不再扩展出边。

易错点：**先记录「到达终点」的答案，再判断「步数已满则 continue」**。否则会出现：刚好用满 K 步到达终点时，先执行了 `if (curStep === maxStep) continue`，导致没有更新答案就跳过。

```js
function Dijkstra(graph, start, target, maxStep) {
  const n = graph.length;
  if (!graph || n === 0) return Infinity;
  if (start < 0 || start >= n || target < 0 || target >= n || maxStep < 0) return Infinity;
  const pMinQueue = new Heap((before, after) => before[0] - after[0]);
  // 优先最小队列存放的每项是 [该点到起点的距离，起点走了几步到该点，该点]
  pMinQueue.push([0, 0, start]);
  // dp[i][j]表示i点到起点、用j步时的最短距离；这个值在遍历过程中会不停地更新，初始化为Infinity
  const dp = new Array(n).fill(0).map(() => new Array(maxStep + 1).fill(Infinity));
  dp[start][0] = 0;
  // 实时记录到达target的最小距离（可能在不同步数下到达，取最小）
  let minDistance = Infinity;

  while (!pMinQueue.isEmpty()) {
    const [curDis, curStep, curIdx] = pMinQueue.shift();
    if (curDis > dp[curIdx][curStep]) continue;
    // 先记录到达终点的最小代价（必须在 curStep === maxStep 的 continue 之前，否则步数刚好吃满时到终点会漏掉）
    if (curIdx === target) {
      minDistance = Math.min(minDistance, curDis);
    }
    // 步数已满不再扩展出边，但上面已记录过终点
    if (curStep === maxStep) continue;

    const neighbors = graph[curIdx] || [];
    for (let [nextId, weight] of neighbors) {
      const nextStep = curStep + 1;
      const newDistance = curDis + weight;
      const oldDistance = dp[nextId][nextStep];
      if (newDistance < oldDistance) {
        dp[nextId][nextStep] = newDistance;
        pMinQueue.push([newDistance, nextStep, nextId]);
      }
    }
  }
  return minDistance;
}
```

**适用**：LeetCode 787（最便宜航班 within K stops）：建邻接表后调用 `Dijkstra(graph, src, dst, k + 1)`，返回 `minDistance === Infinity ? -1 : minDistance`。

---

## 六、网格转邻接表（gridToGraph）

很多题给的是二维网格（如四方向移动、每格有方向箭头等），需要先转成「节点 id + 邻接表」再跑 Dijkstra。下面这段**通用网格转图**函数可复用：通过 `options.getWeight` 自定义边权，通过 `options.dirMap` 指定方向，默认配置适配 LeetCode 1368（1=右 2=左 3=下 4=上，沿箭头 0 代价否则 1）。

```js
/**
 * 通用网格转邻接表函数（图论通用版）
 * @param {number[][]} grid - 二维网格
 * @param {Object} options - 自定义配置（灵活适配所有网格转图场景）
 * @param {Function} options.getWeight - 边权重计算函数（核心扩展点）
 *                   参数：(curVal, dirIdx, curR, curC, nextR, nextC)
 *                   返回：数值（边的权重，可正/负/0，代表代价/收益/概率等）
 * @param {Array} options.dirMap - 方向映射表：[[rDiff, cDiff], ...]
 *                   索引=方向编号（如1=右、2=左），值=[行偏移, 列偏移]
 * @param {number} options.dirCount - 方向数量（默认4个方向）
 * @returns {Array} graph - 邻接表：graph[节点ID] = [[邻接节点ID, 边权重], ...]
 */
function gridToGraph(grid, options) {
  const defaultOptions = {
    // 方向映射：1=右 2=左 3=下 4=上（索引对应方向编号）
    dirMap: [[], [0, 1], [0, -1], [1, 0], [-1, 0]],
    dirCount: 4,
    // 默认权重规则：沿grid值方向移动权重0，否则1（1368题的「修改代价」）
    getWeight: (curVal, dirIdx) => (dirIdx === curVal ? 0 : 1),
  };

  const { dirMap, dirCount, getWeight } = { ...defaultOptions, ...options };
  const rows = grid.length;
  if (rows === 0) return [];
  const cols = grid[0].length;
  if (cols === 0) return [];

  const totalNodes = rows * cols;
  const graph = new Array(totalNodes).fill(0).map(() => []);

  for (let curR = 0; curR < rows; curR++) {
    for (let curC = 0; curC < cols; curC++) {
      // 行优先计算节点ID（核心公式：列数×行 + 列）
      const curNodeId = cols * curR + curC;
      const curGridVal = grid[curR][curC];

      for (let dirIdx = 1; dirIdx <= dirCount; dirIdx++) {
        const [rDiff, cDiff] = dirMap[dirIdx] || [0, 0];
        const nextR = curR + rDiff;
        const nextC = curC + cDiff;

        if (nextR >= 0 && nextR < rows && nextC >= 0 && nextC < cols) {
          const nextNodeId = cols * nextR + nextC;
          const edgeWeight = getWeight(curGridVal, dirIdx, curR, curC, nextR, nextC);
          graph[curNodeId].push([nextNodeId, edgeWeight]);
        }
      }
    }
  }

  return graph;
}
```

用法示例：1368 题可直接 `const graph = gridToGraph(grid)`，得到邻接表后再用**模板二**求 `(0,0)` 到 `(rows-1, cols-1)` 的最短代价（节点 id：起点 `0`，终点 `rows*cols-1`）。其他网格题若边权规则不同，只需传入自定义 `getWeight`（及必要时 `dirMap`）。

---

## 七、常见变形：改松弛规则与堆

下面几题仍然用「堆 + dp」的框架，只是**松弛规则**或**堆的优先级**不同，代码里只写出与上面模板的差异部分（邻接表格式、松弛公式、堆比较函数）。

### 1. 路径「最大边权」最小（LeetCode 1631 最小体力消耗）

边权是高度差，要求整条路径上**最大的一条边**尽量小。  
**松弛**：不是「当前距离 + 边权」，而是 **`newVal = Math.max(curVal, weight)`**；只有 `newVal < dp[nextId]` 才更新并入队。堆仍按第一维最小出队。

### 2. 路径「成功概率」最大（LeetCode 1514）

边权是概率，要求路径上概率**连乘**最大。  
**松弛**：`newProb = curProb * edgeProb`，只有 `newProb > dp[nextId]` 才更新。  
**堆**：要「概率大的先出队」，用**最大堆**：`new Heap((a, b) => b[0] - a[0])`，队列里存 `[概率, 节点]`，dp 初始为 0，起点为 1。

### 3. 网格图 + 0/1 代价（LeetCode 1368 至少一条有效路径）

每个格子有默认方向，沿默认方向走代价 0，改方向代价 1。  
**建图**：把网格按行优先展平为节点 id，四个方向连边，边权为 0 或 1。  
**算法**：用模板二（点到点 Dijkstra）即可，松弛仍是 `curCost + weight`。

### 4. 单源最短路 + 取最大值（LeetCode 743 网络延迟时间）

从起点跑一遍**模板一**，得到 `dp`；答案 = `Math.max(...dp.slice(1))`（或排除起点后的最大值），若有 `Infinity` 则返回 -1。

---

## 八、题目练习

以下每题给出：**链接**、**题目介绍**、**示例**、**思路**、**代码**（若与上文模板/网格转图完全一致则只写「见上文 xxx」）。

---

### 1. 743. 网络延迟时间

- **链接**：[LeetCode 743 - 网络延迟时间](https://leetcode.cn/problems/network-delay-time/)
- **题目介绍**：有 n 个节点，标号 1~n。给定有向边列表 `times`，每条为 `[u, v, w]` 表示从 u 到 v 的传递时间为 w。从节点 k 发出信号，求**所有节点都收到信号所需的最短时间**；若存在节点收不到则返回 -1。
- **示例**：`times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2` → 输出 `2`（从 2 到 4 最远为 2）。
- **思路**：单源最短路，起点为 k。跑一遍**模板一**得到 `dp`，答案 = 所有点中最大的 `dp[i]`（节点从 1 开始则注意下标）；若有 `Infinity` 则返回 -1。
- **使用**：**模板一**（见第三节）。Heap 见上文。

```js
var networkDelayTime = function (times, n, k) {
  if (n <= 0) return -1;
  if (k < 1 || k > n) return -1;
  const graph = new Array(n + 1).fill(0).map(() => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);
  const dp = Dijkstra(graph, k); // 模板一：单源最短路，返回 dp[]
  const max = Math.max(...dp.slice(1));
  return Number.isFinite(max) ? max : -1;
};
```

---

### 2. 1631. 最小体力消耗路径

- **链接**：[LeetCode 1631 - 最小体力消耗路径](https://leetcode.cn/problems/path-with-minimum-effort/)
- **题目介绍**：给定二维矩阵 `heights`，从左上角走到右下角。每次可走上下左右，体力消耗为**相邻两格高度差的绝对值**。求一条路径使得**整条路径中「单步最大高度差」最小**。
- **示例**：`heights = [[1,2,2],[3,8,2],[5,3,5]]` → 输出 `2`（路径上最大高度差为 2）。
- **思路**：建图用 **gridToGraph**（第六节），Dijkstra 用**模板二**的流程，仅松弛改为 `newVal = Math.max(curVal, weight)`。
- **使用**：**gridToGraph**（第六节）+ **模板二变体**（松弛改为路径最大边权）。Heap 见上文。

```js
var minimumEffortPath = function (heights) {
  if (!heights.length || !heights[0].length) return 0;
  const graph = gridToGraph(heights, {
    dirMap: [[], [-1, 0], [1, 0], [0, -1], [0, 1]],
    dirCount: 4,
    getWeight: (_, __, curR, curC, nextR, nextC) =>
      Math.abs(heights[curR][curC] - heights[nextR][nextC]),
  });
  return DijkstraMaxEdge(graph, 0, graph.length - 1);
};

// 模板二变体：与第四节模板二相同，仅松弛改为 newVal = Math.max(curVal, weight)
function DijkstraMaxEdge(graph, start, target) {
  const n = graph.length;
  if (!n || start < 0 || start >= n || target < 0 || target >= n) return Infinity;
  const pMinQueue = new Heap((a, b) => a[0] - b[0]);
  pMinQueue.push([0, start]);
  const dp = new Array(n).fill(Infinity);
  dp[start] = 0;
  while (!pMinQueue.isEmpty()) {
    const [curVal, curIdx] = pMinQueue.shift();
    if (curVal > dp[curIdx]) continue;
    if (curIdx === target) return dp[curIdx];
    for (const [nextId, weight] of graph[curIdx] || []) {
      const newVal = Math.max(curVal, weight);
      if (newVal < dp[nextId]) {
        dp[nextId] = newVal;
        pMinQueue.push([newVal, nextId]);
      }
    }
  }
  return dp[target];
}
```

---

### 3. 1514. 概率最大的路径

- **链接**：[LeetCode 1514 - 概率最大的路径](https://leetcode.cn/problems/path-with-maximum-probability/)
- **题目介绍**：无向图，每条边有一个成功概率。求从 `start_node` 到 `end_node` 的路径中，**成功概率最大**的一条（概率为路径上各边概率的乘积）。
- **示例**：`n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2` → 输出 `0.25`（0→1→2 为 0.5\*0.5=0.25）。
- **思路**：**模板二变体**：最大堆、dp 初值 0 且起点为 1、松弛为 `newProb = curProb * prob`，仅当 `newProb > dp[nextId]` 时更新（见第七节常见变形第 2 条）。
- **使用**：**模板二变体**（最大堆 + 乘法松弛）。Heap 见上文。

```js
var maxProbability = function (n, edges, succProb, start_node, end_node) {
  if (n <= 0) return 0;
  if (start_node < 0 || start_node >= n || end_node < 0 || end_node >= n) return 0;
  const graph = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    const p = succProb[i];
    graph[u].push([v, p]);
    graph[v].push([u, p]);
  }
  return DijkstraMaxProb(graph, start_node, end_node);
};

// 模板二变体：最大堆 (a,b)=>b[0]-a[0]，dp 初值 0、起点 1，松弛 newProb = curProb * prob
function DijkstraMaxProb(graph, start, target) {
  const n = graph.length;
  if (!n || start < 0 || start >= n || target < 0 || target >= n) return 0;
  const pMaxQueue = new Heap((a, b) => b[0] - a[0]);
  pMaxQueue.push([1, start]);
  const dp = new Array(n).fill(0);
  dp[start] = 1;
  while (!pMaxQueue.isEmpty()) {
    const [curProb, curIdx] = pMaxQueue.shift();
    if (curProb < dp[curIdx]) continue;
    if (curIdx === target) return curProb;
    for (const [nextId, prob] of graph[curIdx] || []) {
      const newProb = curProb * prob;
      if (newProb > dp[nextId]) {
        dp[nextId] = newProb;
        pMaxQueue.push([newProb, nextId]);
      }
    }
  }
  return 0;
}
```

---

### 4. 1368. 使网格图至少有一条有效路径的最小代价

- **链接**：[LeetCode 1368 - 使网格图至少有一条有效路径的最小代价](https://leetcode.cn/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/)
- **题目介绍**：网格每格有一个方向（1 右 2 左 3 下 4 上），沿该方向走代价 0，改方向代价 1。求从左上到右下的**最小修改代价**。
- **示例**：`grid = [[1,1,3],[3,2,2],[1,1,4]]` → 输出 `0`（按箭头走即可）。
- **思路**：用 **gridToGraph(grid)** 默认配置（第六节）得到邻接表，再跑**模板二**求 0 到 total-1 的最短代价。
- **使用**：**gridToGraph**（第六节，默认即此题）+ **模板二**（见第四节）。Heap 见上文。

```js
var minCost = function (grid) {
  if (!grid.length || !grid[0].length) return 0;
  const graph = gridToGraph(grid); // 第六节，默认 dirMap 与 getWeight 即此题
  return Dijkstra(graph, 0, graph.length - 1); // 模板二，见第四节
};
```

---

### 5. 787. K 站中转内最便宜的航班

- **链接**：[LeetCode 787 - K 站中转内最便宜的航班](https://leetcode.cn/problems/cheapest-flights-within-k-stops/)
- **题目介绍**：n 个城市，航班列表 `flights[i]=[from, to, price]`。求从 `src` 到 `dst` 的**最便宜价格**，且**最多经过 k 站中转**（即最多 k+1 条边）。不存在则返回 -1。
- **示例**：`n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1` → 输出 `700`（0→1→3，两段，价格 100+600）。
- **思路**：建邻接表后调用**模板三**，`maxStep = k + 1`，返回前将 `Infinity` 转为 -1。
- **使用**：**模板三**（见第五节）。Heap 见上文。

```js
var findCheapestPrice = function (n, flights, src, dst, k) {
  if (n <= 0) return -1;
  if (src < 0 || src >= n || dst < 0 || dst >= n) return -1;
  const graph = new Array(n).fill(0).map(() => []);
  for (const [from, to, price] of flights) graph[from].push([to, price]);
  const minDist = Dijkstra(graph, src, dst, k + 1); // 模板三（第五节）：Dijkstra(graph, start, target, maxStep)
  return minDist === Infinity ? -1 : minDist;
};
```

---

## 九、小结

| 需求           | 用法说明                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| 单源到所有点   | 模板一，返回 `dp[]`                                                        |
| 单源到某点     | 模板二，弹出 `target` 时返回 `dp[target]`                                  |
| 最多 K 步/边   | 模板三，`dp[i][step]`，**先更新终点答案再判断 curStep===maxStep continue** |
| 路径最大边最小 | 松弛用 `Math.max(cur, weight)`，堆仍最小                                   |
| 路径概率最大   | 松弛用乘法，堆用最大堆，dp 初始 0、起点 1                                  |
| 网格 0/1 边权  | 用 **gridToGraph** 转邻接表，再套模板二                                    |

**核心**：Dijkstra = BFS + 优先队列 + distTo；同一套堆和循环结构，通过**松弛公式**和**状态维度**（是否带 step）适配不同题。网格题先用**网格转邻接表**再选对应模板
