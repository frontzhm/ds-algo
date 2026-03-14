# 二分图核心原理与判定算法

## 什么是二分图

一句话定义：**二分图 = 可以把图里的点分成两组，使得所有的边都只在两组之间跨组连接，组内没有任何边。**

更形象一点：

- 把节点染成 **黑色** 和 **白色**

- **相邻的节点颜色一定不同**

- **同色之间绝对不能相连**

满足这个条件，就是**二分图**。

---

## 二分图的实际应用场景

从简单实用的角度来看，二分图结构在某些场景可以更高效地存储数据。

比如说我们需要一种数据结构来储存**电影和演员**之间的关系：某一部电影肯定是由多位演员出演的，且某一位演员可能会出演多部电影。

- 使用哈希表存储：需要两个哈希表分别存「演员→电影」和「电影→演员」

- 使用**二分图**存储：电影和演员分别作为两类节点，相连表示参演关系

- 每个电影节点的邻居 = 所有演员

- 每个演员节点的邻居 = 所有电影

对比哈希表，**更方便、更直观、空间更小**。

---

## 判定二分图

说白了就是遍历一遍图，一边遍历一边染色，看看能不能用**两种颜色**给所有节点染色，且相邻节点的颜色都不相同。

遍历图不涉及最短路径，**DFS、BFS 都可以**。

---

## 一、先看普通 DFS 遍历

理解二分图判定前，先看最基础的 DFS 写法。

```JavaScript

function dfs(graph,s) {
  const visited = new Array(graph.length).fill(false);
  traverse(s)

  function traverse(curId) {
    if (visited(curId)) return;
    console.log('前序位置',curId)
    visited(curId) = true
    for(let nei of graph[curId]){
      traverse(nei)
    }
    // console.log('后序位置',curId)
  }
}
```

换一种判断位置：

```JavaScript

function dfs(graph,s) {
  const visited = new Array(graph.length).fill(false);
  traverse(s)

  function traverse(curId) {
    // 这里一定没有被访问过
    console.log('前序位置',curId)
    visited(curId) = true
    for(let nei of graph[curId]){
      // 因为之前就判断了
      if(visited(nei)) continue
      traverse(nei)
    }
    // console.log('后序位置',curId)
  }
}
```

---

## 二、DFS 判断二分图（核心算法）

判断二分图的算法会用到这种写法。

```JavaScript

function isBipartite(graph, s) {
  // 如果没有给起点的话，需要遍历所有节点
  const visited = new Array(graph.length).fill(false);
  // true就表示黑色吧
  const colors = new Array(graph.length).fill(null);
  return traverse(s, true);

  function traverse(curId, isBlack) {
    // 这里一定没有被访问过
    console.log('前序位置', curId);
    visited[curId] = true;
    colors[curId] = isBlack;
    for (let nei of graph[curId]) {
      // 这点被访问过就 看下
      if (visited[nei]) {
        // 看下下一个点和当前点是不是同色，同色就挂了
        if (colors[curId] === colors[nei]) {
          return false;
        }
      } else {
        // 没访问过就继续
        if (!traverse(nei, !isBlack)) return false;
      }
    }
    // console.log('后序位置',curId) 这里邻居都没问题，说明没问题
    return true;
  }
}
```

---

## LeetCode 785. 判断二分图（DFS 完整版）

🔗 [https://leetcode.cn/problems/is-graph-bipartite/](https://leetcode.cn/problems/is-graph-bipartite/)

### 题目描述

给定一个无向图 `graph`，判断它是否是二分图。

### 示例

- 输入：`graph = [[1,2,3],[0,2],[0,1,3],[0,2]]`

- 输出：`false`

### 思路

1. 使用 DFS 进行双色染色

2. 相邻节点必须颜色相反

3. 遇到颜色冲突 → 不是二分图

4. 必须遍历所有节点（处理非连通图）

### 代码

```JavaScript

/**
 * LeetCode 785 判断二分图
 * 解法：DFS 染色法
 * 核心思想：使用两种颜色染色，相邻节点颜色必须不同
 * @param {number[][]} graph 邻接表表示的无向图
 * @return {boolean} 是否是二分图
 */
var isBipartite = function (graph) {
  // 节点总数
  const n = graph.length;

  // 标记节点是否被访问过（防止重复遍历）
  const visited = new Array(n).fill(false);

  // 染色数组：true=黑色，false=白色，null=未染色
  const colors = new Array(n).fill(null);

  // 图可能是非连通的（有多个独立子图），必须遍历每个节点
  for (let i = 0; i < n; i++) {
    // 已访问过的节点跳过
    if (visited[i]) continue;
    // DFS 染色，如果发现不是二分图，直接返回 false
    if (!traverse(i, true)) return false;
  }

  // 所有节点都染色成功，说明是二分图
  return true;

  /**
   * DFS 递归染色
   * @param {number} curId 当前节点编号
   * @param {boolean} isBlack 当前节点要染的颜色：true黑，false白
   * @return {boolean} 染色是否合法（是否冲突）
   */
  function traverse(curId, isBlack) {
    // 前序位置：刚进入当前节点，开始染色
    console.log('前序位置', curId);

    // 标记当前节点已访问
    visited[curId] = true;
    // 给当前节点染色
    colors[curId] = isBlack;

    // 遍历当前节点的所有邻居
    for (let nei of graph[curId]) {
      if (visited[nei]) {
        // 邻居已经被访问过 → 检查颜色是否冲突
        // 如果当前节点和邻居颜色相同 → 不是二分图
        if (colors[curId] === colors[nei]) {
          return false;
        }
      } else {
        // 邻居未被访问 → 递归染色，颜色必须相反
        if (!traverse(nei, !isBlack)) return false;
      }
    }

    // 所有邻居都处理完毕，无冲突 → 染色成功
    return true;
  }
};
```

---

## 三、BFS 判断二分图

```JavaScript

function isBipartite(graph, s) {
  const n = graph.length;
  if (n === 0) return;
  const visited = new Array(n).fill(false);
  const colors = new Array(n).fill(null);
  let isBlack = true;
  const queue = [[s, isBlack]]; // 保证入对的时候 肯定没有被visited
  while (queue.length) {
    const [curId, isBlack] = queue.shift();
    visited[curId] = true;
    colors[curId] = isBlack;

    for (let nei of graph[curId]) {
      if (visited[nei]) {
        if (colors[curId] === colors[nei]) return false;
        continue;
      }
      queue.push([nei, !isBlack]);
    }
  }
  return true;
}
```

如果没有特定起点，必须全局遍历：

```JavaScript

// BFS 版本 判断二分图
function isBipartite(graph) {
  // 节点总数
  const n = graph.length;
  // 空图直接返回（边界）
  if (n === 0) return;

  // 标记节点是否被访问过
  const visited = new Array(n).fill(false);
  // 染色数组：true=黑色，false=白色，null=未染色
  const colors = new Array(n).fill(null);

  // 外层循环：处理非连通图，每个连通分量都要检查
  for (let s = 0; s < n; s++) {
    // 已经访问过的节点跳过
    if (visited[s]) continue;

    // BFS 队列：每个元素存储 [当前节点, 要染的颜色]
    // 入队时节点一定未被访问，保证安全
    const queue = [[s, true]];

    // BFS 循环
    while (queue.length) {
      // 出队：拿到当前节点和它应该染的颜色
      const [curId, isBlack] = queue.shift();

      // 标记已访问 + 染色
      visited[curId] = true;
      colors[curId] = isBlack;

      // 遍历所有邻居
      for (let nei of graph[curId]) {
        // 如果邻居已经访问过 → 检查颜色是否冲突
        if (visited[nei]) {
          // 相邻节点同色 → 不是二分图
          if (colors[curId] === colors[nei]) return false;
          continue;
        }

        // 邻居没访问过 → 染相反颜色，入队
        queue.push([nei, !isBlack]);
      }
    }
  }

  // 所有节点染色无冲突 → 是二分图
  return true;
}
```

---

# LeetCode 886. 可能的二分法（BFS 高效版）

🔗 [https://leetcode.cn/problems/possible-bipartition/](https://leetcode.cn/problems/possible-bipartition/)

## 题目描述

给定 N 个人和一组 dislikes 关系，每个人不能和自己讨厌的人分在同一组。

判断是否可以成功分成两组。

## 示例

- 输入：`n = 4, dislikes = [[1,2],[1,3],[2,4]]`

- 输出：`true`

## 思路

1. 把讨厌关系建成无向图

2. 判断是否是二分图

3. 使用 BFS + 头指针优化避免超时

## 代码

```JavaScript

// BFS 版本 判断二分图
function isBipartite(graph) {
  // 节点总数
  const n = graph.length;
  // 空图直接返回（边界）
  if (n <= 1) return true;

  // 标记节点是否被访问过
  const visited = new Array(n).fill(false);
  // 染色数组：true=黑色，false=白色，null=未染色
  const colors = new Array(n).fill(null);

  // 外层循环：处理非连通图，每个连通分量都要检查
  for (let s = 0; s < n; s++) {
    // 已经访问过的节点跳过
    if (visited[s]) continue;

    // BFS 队列：每个元素存储 [当前节点, 要染的颜色]
    // 入队时节点一定未被访问，保证安全
    const queue = [[s, true]];
    // 用索引在大数据的时候 也能轻松通过
    let head = 0;
    // BFS 循环
    while (head < queue.length) {
      // 出队：拿到当前节点和它应该染的颜色
      const [curId, isBlack] = queue[head++];

      // 标记已访问 + 染色
      visited[curId] = true;
      colors[curId] = isBlack;

      // 遍历所有邻居
      for (let nei of graph[curId]) {
        // 如果邻居已经访问过 → 检查颜色是否冲突
        if (visited[nei]) {
          // 相邻节点同色 → 不是二分图
          if (colors[curId] === colors[nei]) return false;
          continue;
        }

        // 邻居没访问过 → 染相反颜色，入队
        queue.push([nei, !isBlack]);
      }
    }
  }

  // 所有节点染色无冲突 → 是二分图
  return true;
}
```

---

# 总结

1. **二分图 = 双色可染 + 相邻不同色**

2. **判定方法：DFS / BFS 染色**

3. **必须遍历所有节点（处理非连通图）**

4. **BFS 用 head 指针可大幅提速，避免大数据超时**

5. 典型题目：**785 判断二分图、886 可能的二分法**

---
