// 邻接表和邻接矩阵都行
class Graph {
  constructor(n) {
    this.table = new Array(n).fill(0).map(() => new Map());
    // this.idxToVal = new Map();
  }
  // 添加一条边（带权重）
  addEdge(from, to, weight) {
    this.table[from].set(to, weight);
  }

  // 删除一条边
  removeEdge(from, to) {
    return this.table[from].delete(to);
  }

  // 判断两个节点是否相邻
  hasEdge(from, to) {
    return this.table[from].has(to);
  }

  // 返回一条边的权重
  weight(from, to) {
    return this.table[from].get(to) || null;
  }

  // 返回某个节点的所有邻居节点和对应权重 （格式：[{to: 邻居节点, weight: 权重}, ...]）
  neighbors(v) {
    return Array.from(this.table[v].entries()).map(([to, weight]) => ({ to, weight }));
  }

  // 返回节点总数
  size() {
    return this.table.length;
  }
}

// 图里一共有 6 个节点：0,1,2,3,4,5,6 → 共7个节点
const graph = new Graph(7);

// 逐条添加边（from, to, weight=1）
graph.addEdge(0, 2, 1);
graph.addEdge(0, 1, 1);
graph.addEdge(6, 0, 1);
graph.addEdge(3, 0, 1);
graph.addEdge(1, 3, 1);
graph.addEdge(1, 4, 1);
graph.addEdge(3, 6, 1);
graph.addEdge(2, 6, 1);
graph.addEdge(2, 5, 1);

function getVertex(graph, startId) {
  const res = new Set();
  const visited = new Array(graph.size()).fill(false);
  traverse(graph, startId, visited);
  return res;

  function traverse(graph, startId, visited) {
    // base case
    if (startId < 0 || startId >= graph.size()) {
      return;
    }
    if (visited[startId]) {
      return;
    }
    // 前序位置
    console.log(startId);
    res.add(startId);
    visited[startId] = true;
    // 遍历子节点
    for (let { to: neighborId } of graph.neighbors(startId)) {
      traverse(graph, neighborId, visited);
    }
    // 后序位置
  }
}
function getPath(graph, startId) {
  const res = [];
  const visited = new Array(graph.size()).fill(false);
  traverse(graph, startId, visited, []);
  return res;

  function traverse(graph, startId, visited, curPath) {
    // base case
    if (startId < 0 || startId >= graph.size()) {
      return;
    }
    if (visited[startId]) {
      // curPath是先push 然后pop 等于没加； 这里懒操作 只修改了res
      res.push([...curPath, startId]);
      return;
    }
    // 前序位置
    console.log(startId);
    visited[startId] = true;
    curPath.push(startId);
    const neighbors = graph.neighbors(startId);
    if (neighbors.length === 0) {
      res.push([...curPath]);
    } else {
      // 遍历子节点
      for (let { to: neighborId } of neighbors) {
        traverse(graph, neighborId, visited, curPath);
      }
    }
    // 后序位置 pop
    visited[startId] = false;
    curPath.pop();
  }
}
function getAllPath(graph, startId, targetId) {
  const res = [];
  const curPathVisited = new Array(graph.size()).fill(false);
  const curPath = [];

  traverse(graph, startId, curPathVisited, curPath);
  return res;

  function traverse(graph, curId, visited, curPath) {
    // 节点合法性校验（兜底）
    if (curId < 0 || curId >= graph.size()) {
      return;
    }

    // 核心无环逻辑：当前节点已在路径中，直接返回（终止当前分支，避免环）
    if (visited[curId]) {
      return;
    }

    // 找到终点：收集完整路径并返回
    if (curId === targetId) {
      res.push([...curPath, curId]); // ✅ 正确：拷贝路径数组，避免引用覆盖
      return;
    }

    // 前序：标记访问 + 加入路径
    visited[curId] = true;
    curPath.push(curId);

    // 遍历所有邻居，递归探索子路径
    const neighbors = graph.neighbors(curId);
    for (let { to: neighborId } of neighbors) {
      traverse(graph, neighborId, visited, curPath);
    }

    // 后序：回溯（核心！无论是否找到终点，都要恢复状态）
    visited[curId] = false;
    curPath.pop();
  }
}
// console.log(getVertex(graph, 0));
// console.log(getPath(graph, 0));
console.log(getAllPath(graph, 0, 6));
