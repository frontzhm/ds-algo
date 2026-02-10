# 图结构完全解析：从基础概念到遍历实现

图是计算机科学中最核心的数据结构之一，它能抽象现实世界中各类复杂的关系网络——从地图导航的路径规划，到社交网络的好友推荐，再到物流网络的成本优化，都离不开图结构的应用。本文将从图的基础概念出发，逐步讲解图的存储方式、通用实现，以及核心的遍历算法（DFS/BFS），帮助你彻底掌握图结构的核心逻辑。

## 一、图的核心概念

### 1.1 基本构成

图由**节点（Vertex）** 和**边（Edge）** 组成：

- 节点：表示实体，有唯一ID标识；

- 边：表示节点间的关系，可分为：

    - 有向/无向：有向边（如A→B）仅表示单向关系，无向边（如A-B）等价于双向有向边；

    - 加权/无权：加权边附带数值（如距离、成本），无权边可视为权重为1的特殊情况。

### 1.2 关键属性

#### （1）度

- 无向图：节点的度 = 相连边的条数；

- 有向图：入度（指向该节点的边数）+ 出度（该节点指向其他的边数）。

#### （2）稀疏图 vs 稠密图

简单图（无自环、无多重边）中，V个节点最多有  $V(V-1)/2$  条边：

- 稀疏图：边数E远小于  $V^2$ （如社交网络）；

- 稠密图：边数E接近  $V^2$ （如全连接网络）。

### 1.3 子图相关

- 子图：节点和边均为原图的子集；

- 生成子图：包含原图所有节点，仅保留部分边（如最小生成树）；

- 导出子图：选择部分节点，且包含这些节点在原图中的所有边。

### 1.4 连通性

- 无向图：

    - 连通图：任意两节点间有路径可达；

    - 连通分量：非连通图中的最大连通子图；

- 有向图：

    - 强连通：任意两节点间有双向有向路径；

    - 弱连通：忽略边方向后为连通图。

### 1.5 图与树的关系

图是多叉树的延伸：树无环、仅允许父→子指向，而图可成环、节点间可任意指向。树的遍历逻辑（DFS/BFS）完全适用于图，仅需增加「标记已访问节点」的逻辑避免环导致的死循环。

## 二、图的存储方式

图的存储核心是「记录节点间的连接关系」，主流方式有**邻接表**和**邻接矩阵**两种，二者各有适用场景。

### 2.1 邻接表

#### 核心结构

以节点ID为键，存储该节点的所有出边（包含目标节点+权重）：

- 数组版：`graph[x]` 存储节点x的出边列表（适用于节点ID为连续整数）；

- Map版：`graph.get(x)` 存储节点x的出边列表（适用于任意类型节点ID）。

#### 特点

- 空间复杂度： $O(V+E)$ （仅存储实际存在的边，适合稀疏图）；

- 时间复杂度：增边 $O(1)$ ，删/查边 $O(E)$ （E为节点出边数），获取邻居 $O(1)$ 。

### 2.2 邻接矩阵

#### 核心结构

二维数组 `matrix[from][to]`：

- 无权图：`true/false` 表示是否有边；

- 加权图：数值表示权重，`null` 表示无边（避免0权重歧义）。

#### 特点

- 空间复杂度： $O(V^2)$ （需预分配所有节点组合，适合稠密图）；

- 时间复杂度：增/删/查边/获取权重均为 $O(1)$ ，获取邻居 $O(V)$ 。

### 2.3 存储方式对比

|特性|邻接表|邻接矩阵|
|---|---|---|
|空间效率|稀疏图更优|稠密图更优|
|增删查边|增边快、删/查边慢|所有操作均快|
|节点ID支持|支持任意类型（Map版）|仅支持连续整数|
|适用场景|大多数稀疏图场景|节点少、需快速查边|
## 三、图的通用实现

基于邻接表/邻接矩阵，我们实现支持「增删查改」的通用加权有向图类，可灵活适配无向图（双向加边）、无权图（权重默认1）。

### 3.1 邻接表（数组版）：适用于连续整数节点ID

```JavaScript

/**
 * 加权有向图（邻接表-数组版）
 * 核心：节点ID为0~n-1的连续整数，二维数组存储出边
 */
class WeightedDigraphArray {
    constructor(n) {
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error(`节点数必须是正整数（当前传入：${n}）`);
        }
        this.nodeCount = n;
        this.graph = Array.from({ length: n }, () => []); // 邻接表初始化
    }

    // 私有方法：校验节点合法性
    _validateNode(node) {
        if (!Number.isInteger(node) || node < 0 || node >= this.nodeCount) {
            throw new Error(`节点${node}非法！合法范围：0 ~ ${this.nodeCount - 1}`);
        }
    }

    // 添加加权有向边
    addEdge(from, to, weight) {
        this._validateNode(from);
        this._validateNode(to);
        if (typeof weight !== 'number' || isNaN(weight)) {
            throw new Error(`边${from}→${to}的权重必须是有效数字`);
        }
        // 避免重复加边
        if (this.hasEdge(from, to)) {
            this.removeEdge(from, to);
        }
        this.graph[from].push({ to, weight });
    }

    // 删除有向边
    removeEdge(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        const originalLength = this.graph[from].length;
        this.graph[from] = this.graph[from].filter(edge => edge.to !== to);
        return this.graph[from].length < originalLength;
    }

    // 判断边是否存在
    hasEdge(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        return this.graph[from].some(edge => edge.to === to);
    }

    // 获取边权重
    getEdgeWeight(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        const edge = this.graph[from].find(edge => edge.to === to);
        if (!edge) throw new Error(`不存在边${from}→${to}`);
        return edge.weight;
    }

    // 获取节点所有出边
    getNeighbors(v) {
        this._validateNode(v);
        return [...this.graph[v]]; // 返回拷贝，避免外部修改
    }

    // 打印邻接表（调试用）
    printAdjList() {
        console.log('=== 加权有向图邻接表 ===');
        for (let i = 0; i < this.nodeCount; i++) {
            const edges = this.graph[i].map(edge => `${edge.to}(${edge.weight})`).join(', ');
            console.log(`节点${i}的出边：${edges || '无'}`);
        }
    }
}
```

### 3.2 邻接表（Map版）：适用于任意类型节点ID

```JavaScript

/**
 * 加权有向图（邻接表-Map版）
 * 核心：支持动态添加节点，节点ID可为任意可哈希类型（数字/字符串等）
 */
class WeightedDigraphMap {
    constructor() {
        this.graph = new Map(); // key: 节点ID，value: 出边列表
    }

    // 添加加权有向边
    addEdge(from, to, weight) {
        if (typeof weight !== 'number' || isNaN(weight)) {
            throw new Error('边的权重必须是有效数字');
        }
        if (!this.graph.has(from)) {
            this.graph.set(from, []);
        }
        this.removeEdge(from, to); // 去重
        this.graph.get(from).push({ to, weight });
    }

    // 删除有向边
    removeEdge(from, to) {
        if (!this.graph.has(from)) return false;
        const edges = this.graph.get(from);
        const filtered = edges.filter(edge => edge.to !== to);
        this.graph.set(from, filtered);
        return filtered.length < edges.length;
    }

    // 判断边是否存在
    hasEdge(from, to) {
        if (!this.graph.has(from)) return false;
        return this.graph.get(from).some(edge => edge.to === to);
    }

    // 获取边权重
    getEdgeWeight(from, to) {
        if (!this.graph.has(from)) {
            throw new Error(`不存在节点${from}`);
        }
        const edge = this.graph.get(from).find(edge => edge.to === to);
        if (!edge) throw new Error(`不存在边${from}→${to}`);
        return edge.weight;
    }

    // 获取节点所有出边
    getNeighbors(v) {
        return this.graph.get(v) || [];
    }

    // 获取所有节点
    getNodes() {
        return Array.from(this.graph.keys());
    }
}
```

### 3.3 邻接矩阵版：适用于节点数少的场景

```JavaScript

/**
 * 加权有向图（邻接矩阵版）
 * 核心：二维数组存储边权重，null表示无边
 */
class WeightedDigraphMatrix {
    constructor(n) {
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error('节点数必须是正整数');
        }
        this.nodeCount = n;
        this.matrix = Array.from({ length: n }, () => Array(n).fill(null));
    }

    // 校验节点合法性
    _validateNode(node) {
        if (!Number.isInteger(node) || node < 0 || node >= this.nodeCount) {
            throw new Error(`节点${node}非法！合法范围：0 ~ ${this.nodeCount - 1}`);
        }
    }

    // 添加加权有向边
    addEdge(from, to, weight) {
        this._validateNode(from);
        this._validateNode(to);
        if (typeof weight !== 'number' || isNaN(weight)) {
            throw new Error(`边${from}→${to}的权重必须是有效数字`);
        }
        this.matrix[from][to] = weight;
    }

    // 删除有向边
    removeEdge(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        if (this.matrix[from][to] === null) return false;
        this.matrix[from][to] = null;
        return true;
    }

    // 判断边是否存在
    hasEdge(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        return this.matrix[from][to] !== null;
    }

    // 获取边权重
    getEdgeWeight(from, to) {
        this._validateNode(from);
        this._validateNode(to);
        return this.matrix[from][to];
    }

    // 获取节点所有出边
    getNeighbors(v) {
        this._validateNode(v);
        const neighbors = [];
        for (let to = 0; to < this.nodeCount; to++) {
            const weight = this.matrix[v][to];
            if (weight !== null) {
                neighbors.push({ to, weight });
            }
        }
        return neighbors;
    }

    // 打印邻接矩阵（调试用）
    printMatrix() {
        console.log('=== 邻接矩阵 ===');
        process.stdout.write('    ');
        for (let i = 0; i < this.nodeCount; i++) process.stdout.write(`${i}   `);
        console.log();
        for (let from = 0; from < this.nodeCount; from++) {
            process.stdout.write(`${from} | `);
            for (let to = 0; to < this.nodeCount; to++) {
                const val = this.matrix[from][to] === null ? '∅' : this.matrix[from][to];
                process.stdout.write(`${val}   `);
            }
            console.log();
        }
    }
}
```

### 3.4 适配无向图/无权图

- 无向图：添加/删除边时，同时操作 `from→to` 和 `to→from`；

- 无权图：复用加权图类，`addEdge` 时权重默认传1。

## 四、图的核心遍历算法

图的遍历是所有图论算法的基础，核心为**深度优先搜索（DFS）** 和**广度优先搜索（BFS）**，二者的核心区别是「遍历顺序」：DFS先探到底再回溯，BFS逐层扩散。

### 4.1 深度优先搜索（DFS）

#### 核心思想

从起点出发，沿着一条路径走到头，再回溯探索其他分支，需通过 `visited`/`onPath` 数组避免环导致的死循环。

#### 场景1：遍历所有节点（visited数组）

`visited` 标记已访问的节点，确保每个节点仅遍历一次：

```JavaScript

/**
 * DFS遍历所有节点
 * @param {WeightedDigraphArray} graph - 图实例
 * @param {number} s - 起点
 * @param {boolean[]} visited - 访问标记数组
 */
function dfsTraverseNodes(graph, s, visited) {
    if (s < 0 || s >= graph.nodeCount || visited[s]) return;
    // 前序位置：标记并访问节点
    visited[s] = true;
    console.log(`访问节点 ${s}`);
    // 递归遍历所有邻居
    for (const edge of graph.getNeighbors(s)) {
        dfsTraverseNodes(graph, edge.to, visited);
    }
    // 后序位置：可处理节点相关逻辑（如统计、计算）
}

// 调用示例
const graph = new WeightedDigraphArray(3);
graph.addEdge(0, 1, 1);
graph.addEdge(0, 2, 2);
graph.addEdge(1, 2, 3);
dfsTraverseNodes(graph, 0, new Array(graph.nodeCount).fill(false));
```

#### 场景2：遍历所有路径（onPath数组）

`onPath` 标记当前路径上的节点，后序位置撤销标记（回溯），用于寻找所有路径：

```JavaScript

/**
 * DFS遍历所有路径（从src到dest）
 * @param {WeightedDigraphArray} graph - 图实例
 * @param {number} src - 起点
 * @param {number} dest - 终点
 * @param {boolean[]} onPath - 当前路径标记
 * @param {number[]} path - 当前路径
 * @param {number[][]} res - 所有路径结果
 */
function dfsTraversePaths(graph, src, dest, onPath, path, res) {
    if (src < 0 || src >= graph.nodeCount || onPath[src]) return;
    // 前序位置：加入当前路径
    onPath[src] = true;
    path.push(src);
    // 到达终点：记录路径
    if (src === dest) {
        res.push([...path]); // 拷贝路径，避免后续修改
        path.pop();
        onPath[src] = false;
        return;
    }
    // 递归遍历邻居
    for (const edge of graph.getNeighbors(src)) {
        dfsTraversePaths(graph, edge.to, dest, onPath, path, res);
    }
    // 后序位置：回溯（移出当前路径）
    path.pop();
    onPath[src] = false;
}

// 调用示例
const res = [];
dfsTraversePaths(graph, 0, 2, new Array(graph.nodeCount).fill(false), [], res);
console.log('所有从0到2的路径：', res); // [[0,1,2], [0,2]]
```

#### 场景3：有向无环图（DAG）遍历

若图无环，可省略 `visited`/`onPath`，直接遍历（如寻找所有从0到终点的路径）：

```JavaScript

var allPathsSourceTarget = function(graph) {
    const res = [];
    const path = [];
    const traverse = (s) => {
        path.push(s);
        if (s === graph.length - 1) {
            res.push([...path]);
            path.pop();
            return;
        }
        for (const v of graph[s]) traverse(v);
        path.pop();
    };
    traverse(0);
    return res;
};
```

### 4.2 广度优先搜索（BFS）

#### 核心思想

从起点出发，逐层遍历所有节点，天然适合寻找「最短路径」（第一次到达终点的路径即为最短）。

#### 基础版：记录遍历步数

```JavaScript

/**
 * BFS遍历（记录步数）
 * @param {WeightedDigraphArray} graph - 图实例
 * @param {number} s - 起点
 */
function bfsTraverse(graph, s) {
    const nodeCount = graph.nodeCount;
    const visited = new Array(nodeCount).fill(false);
    const q = [s];
    visited[s] = true;
    let step = -1; // 初始-1，进入循环后++为0（起点步数）

    while (q.length > 0) {
        step++;
        const sz = q.length;
        // 遍历当前层所有节点
        for (let i = 0; i < sz; i++) {
            const cur = q.shift();
            console.log(`访问节点 ${cur}，步数 ${step}`);
            // 加入所有未访问的邻居
            for (const edge of graph.getNeighbors(cur)) {
                if (!visited[edge.to]) {
                    q.push(edge.to);
                    visited[edge.to] = true;
                }
            }
        }
    }
}
```

#### 进阶版：State类适配复杂场景

通过State类封装节点和步数，适配不同权重、不同遍历目标的场景：

```JavaScript

// 封装节点状态
class State {
    constructor(node, step) {
        this.node = node;
        this.step = step;
    }
}

/**
 * BFS遍历（State版）
 * @param {WeightedDigraphArray} graph - 图实例
 * @param {number} s - 起点
 */
function bfsTraverseState(graph, s) {
    const nodeCount = graph.nodeCount;
    const visited = new Array(nodeCount).fill(false);
    const q = [new State(s, 0)];
    visited[s] = true;

    while (q.length > 0) {
        const state = q.shift();
        const cur = state.node;
        const step = state.step;
        console.log(`访问节点 ${cur}，步数 ${step}`);

        for (const edge of graph.getNeighbors(cur)) {
            if (!visited[edge.to]) {
                q.push(new State(edge.to, step + 1));
                visited[edge.to] = true;
            }
        }
    }
}
```

### 4.3 遍历算法总结

|算法|核心数据结构|核心标记|适用场景|时间复杂度|
|---|---|---|---|---|
|DFS|递归栈|visited（遍历节点）/onPath（遍历路径）|遍历所有节点、所有路径| $O(V+E)$ |
|BFS|队列|visited|寻找最短路径、逐层遍历| $O(V+E)$ |
## 五、总结

图结构的核心是「节点+边」的关系抽象，掌握以下关键点即可应对绝大多数场景：

1. **存储选择**：稀疏图用邻接表（省空间），稠密图用邻接矩阵（查边快）；

2. **遍历逻辑**：DFS适合遍历所有路径，BFS适合找最短路径，均需标记已访问节点避免环；

3. **扩展适配**：无向图=双向有向图，无权图=权重为1的加权图，可复用通用图类；

4. **核心思想**：图是树的延伸，遍历的本质是「穷举+剪枝」（标记已访问避免死循环）。

从基础的遍历到进阶的最短路径（Dijkstra）、最小生成树（Kruskal/Prim）、拓扑排序，图论算法的核心都是「基于遍历的优化」，掌握本文的基础内容，后续学习进阶算法会事半功倍。

