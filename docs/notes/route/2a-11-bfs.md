# BFS 与并查集实战总结：从基础框架到刷题落地

在算法刷题与面试中，BFS（广度优先搜索）和并查集是两大高频核心工具，它们各自有明确的适用场景，也能结合使用解决复杂问题。本文将结合大量实战例题，梳理 BFS 与并查集的核心逻辑、应用场景、标准模板，以及刷题时的关键技巧，所有代码均保留原始实现和注释，方便直接参考使用，助力快速掌握并灵活运用这两大算法。

# 一、BFS 核心解析：层序遍历的本质与应用

BFS 的本质是「层序遍历」，遵循“先进先出（FIFO）”的原则，核心优势是能高效求解「无权图/树的最短路径」，因为它能保证首次添加到队列到目标节点时，所经过的路径是最短的。

无论是二叉树、多叉树还是图，BFS 的核心逻辑一致，唯一的区别在于：图需要增加「添加到队列的标记」（seen），避免重复入队和死循环；而树的结构天然无环，无需额外标记（除非有特殊场景）。

## 1.1 BFS 核心思想与适用场景

BFS 的核心思路可以概括为：

1. 初始化队列，将起点节点加入队列，并标记为已添加到队列；

2. 循环遍历队列，每次取出当前层的所有节点，处理每个节点的业务逻辑；

3. 遍历当前节点的所有邻接节点，未添加到队列过的节点标记后加入队列；

4. 直到队列为空，或达到目标条件，结束遍历。

适用场景（面试高频）：

- 树的层序遍历、求树的最小深度、填充节点的右侧指针等；

- 图的最短路径（无权），如迷宫出口、单词接龙、二进制矩阵最短路径等；

- 多源扩散问题，如腐烂的橘子、01 矩阵等；

- 场景抽象类问题（将具体场景转化为图/树），如滑动谜题、打开转盘锁等。

## 1.2 BFS 标准模板（无权图最短路径）

以下是 BFS 求解无权图两点之间最短路径的标准模板，适配大多数图类场景，可直接复用修改：

```js
/**
 * BFS 层序遍历 - 求无权图两点之间的最短路径长度
 * @param {Object} graph 图（必须支持 size() 获取节点数、neighbors(curId) 获取邻接点）
 * @param {Number} startId 起点编号
 * @param {Number} targetId 终点编号
 * @return {Number} 最短路径的层数（步数）
 */
function bfs(graph, startId, targetId) {
  // 1. 获取图中总节点数量
  const n = graph.size();

  // 2.  seen 数组：标记节点是否被添加到队列过，避免重复入队、死循环
  const seen = new Array(n).fill(false);

  // 3. BFS 核心队列：存储【待遍历的节点】
  // 队列遵循：先进先出（FIFO），保证层序遍历
  const q = [startId];
  // ✅ 关键：入队时立刻标记为已添加到队列！防止重复入队
  seen[startId] = true;

  // 4. 记录当前层数（步数），起点算第 0 层
  let level = -1;

  // 5. 队列不为空就继续遍历
  while (q.length) {
    // 每进入一层，层数 +1
    level++;

    // 🔥 关键：记录当前层有多少个节点（必须先保存，不能直接用 q.length）
    const levelNodesCount = q.length;

    // 遍历当前层的所有节点
    for (let i = 0; i < levelNodesCount; i++) {
      // 队首出队
      const curId = q.shift();

      // 6. 如果当前节点就是目标，直接返回当前层数 = 最短路径
      if (curId === targetId) return level;

      // 7. 遍历当前节点的所有邻居
      for (const [to, weight] of graph.neighbors(curId)) {
        // 没添加到队列过才处理
        if (!seen[to]) {
          seen[to] = true; // 入队前标记添加到队列
          q.push(to); // 加入下一层
        }
      }
    }
  }

  // 8. 没找到目标（图不连通）
  return -1;
}
```

## 1.3 BFS 实战例题（含完整代码）

以下例题均保留原始代码和注释，覆盖不同场景，可直接复制提交，适配 LeetCode 对应题目，重点体会场景抽象和 BFS 逻辑的复用。

### 例题 1：滑动谜题（773 题）

核心：将棋盘的每一种排列抽象为「状态节点」，0 的移动对应状态之间的切换，求从初始状态到目标状态的最短步数，典型 BFS 应用。

```js
/**
 * 773. 滑动谜题
 * 解题思路：
 * 1. 棋盘的每一种排列 = 一个【状态】
 * 2. 0（空格）可以和相邻数字交换 = 状态之间可以切换
 * 3. 求【最少移动步数】= 典型 BFS 问题
 */
var slidingPuzzle = function (board) {
  // ===================== 1. 初始化 =====================
  // 把输入的 2x3 二维数组 转换成 字符串（方便 BFS 存储与比较）
  const start = board[0].join('') + board[1].join('');
  // 目标状态：我们需要拼成的正确结果
  const target = '123450';

  // 记录已经添加到队列过的状态，防止重复走（回头路）
  const seen = new Set();
  // BFS 队列：存储每一步的棋盘状态
  const queue = [start];

  // 【入队时立刻标记为已添加到队列】这是 BFS 关键规则
  seen.add(start);

  // 记录步数（层数），初始为 -1，进入第一层后变成 0
  let step = -1;

  // ===================== 2. BFS 核心循环 =====================
  // 队列不为空，就继续搜索
  while (queue.length) {
    // 每进入一层（每走一步），步数 +1
    step++;
    // 记录当前层有多少个状态（必须先保存，队列长度会变化）
    const stepNodeCount = queue.length;

    // 遍历当前层的所有状态
    for (let i = 0; i < stepNodeCount; i++) {
      // 队首出队：拿出当前要处理的棋盘状态
      const cur = queue.shift();

      // ===================== 终止条件 =====================
      // 如果当前状态就是目标状态，直接返回当前步数（最短路径）
      if (cur === target) {
        return step;
      }

      // ===================== 扩展子状态 =====================
      // 获取当前状态通过移动 0 能得到的所有下一步状态
      const neighbors = getNeighbors(cur);

      // 遍历所有邻居
      for (let nei of neighbors) {
        // 只处理没添加到队列过的状态
        if (!seen.has(nei)) {
          seen.add(nei); // 标记已添加到队列
          queue.push(nei); // 加入队列，作为下一层
        }
      }
    }
  }

  // 队列空了都没找到 → 无解，返回 -1
  return -1;
};

// ===================== 工具函数 =====================
/**
 * 根据当前棋盘字符串，获取 0 移动后能生成的所有状态
 * @param {string} cur 当前棋盘字符串
 * @return {string[]} 所有下一步状态数组
 */
function getNeighbors(cur) {
  // 2x3 棋盘一维索引对应的【可交换邻居】
  // 索引位置：
  // 0 1 2
  // 3 4 5
  const indexToNeighbors = [
    [1, 3], // 0
    [0, 2, 4], // 1
    [1, 5], // 2
    [0, 4], // 3
    [1, 3, 5], // 4
    [2, 4], // 5
  ];

  // 找到 0 在字符串中的位置
  const index0 = cur.indexOf('0');

  // 生成所有交换后的新状态并返回
  return indexToNeighbors[index0].map(nei => {
    const arr = cur.split('');
    [arr[index0], arr[nei]] = [arr[nei], arr[index0]];
    return arr.join('');
  });
}
```

### 例题 2：打开转盘锁（752 题）

核心：将锁的每一种状态（4位数字）抽象为节点，每转动一位数字对应状态切换，同时需要避开“死亡密码”，用 BFS 求最短转动步数，可优化为双向 BFS 提升效率。

```js
var openLock = function (deadends, target) {
  const start = '0000';

  // 边界判断：起点就是死亡点 / 起点就是终点
  if (deadends.includes(start)) return -1;
  if (start === target) return 0;

  // 记录已经添加到队列过的状态，防止重复走
  const visitedSet = new Set();
  // BFS 队列：存储每一步的锁状态
  const queue = [];

  // 初始状态入队 + 标记添加到队列
  queue.push(start);
  visitedSet.add(start);

  // 记录步数（层数）
  let level = -1;

  // ===================== BFS 核心 =====================
  while (queue.length) {
    level++;
    const levelNodesCount = queue.length; // 当前层节点数

    for (let i = 0; i < levelNodesCount; i++) {
      const cur = queue.shift(); // 取出当前状态

      // 找到目标，返回当前步数
      if (cur === target) return level;

      // 获取所有能转动到的下一个状态
      const neighbors = getNeighbors(cur);

      for (let nei of neighbors) {
        // 条件：不是死亡点 + 没添加到队列过
        if (!deadends.includes(nei) && !visitedSet.has(nei)) {
          queue.push(nei);
          visitedSet.add(nei);
        }
      }
    }
  }

  // 遍历完没找到 → 无解
  return -1;
};

// ===================== 工具函数：转动一位数字，生成 8 个邻居 =====================
function getNeighbors(str) {
  const res = [];
  // 4 位密码，每一位都可以 +1 或 -1
  for (let i = 0; i < 4; i++) {
    const num = Number(str[i]);
    const arr = str.split('');

    // 数字 -1（9→0）
    arr[i] = (num - 1 + 10) % 10;
    res.push(arr.join(''));

    // 数字 +1（0→9）
    arr[i] = (num + 1) % 10;
    res.push(arr.join(''));
  }
  return res;
}
```

### 例题 3：腐烂的橘子（994 题）

核心：多源 BFS 应用，所有初始腐烂的橘子作为起点，同时向四周扩散，统计扩散所需时间，注意边界条件（无橘子、有橘子无法全部腐烂）。

```js
var orangesRotting = function (grid) {
  // 定义网格状态常量，代码更易读
  const EMPTY = 0;
  const FRESH = 1;
  const ROTTED = 2;

  const rows = grid.length;
  const cols = grid[0].length;

  // 统计【所有橘子】的总数：新鲜 + 腐烂
  let countOrange = 0;

  // const seen = new Set(); // 标记已入队的位置（入队=被污染）
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const queue = []; // 多源BFS队列，存储所有初始腐烂橘子

  // 第一次遍历：初始化队列 + 统计总橘子数
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cur = grid[i][j];
      if (cur !== EMPTY) countOrange++;

      // 初始腐烂橘子入队，作为BFS起点
      if (cur === ROTTED) {
        queue.push([i, j]);
        seen[i][j] = true;
        // seen.add(`${i},${j}`);
      }
    }
  }

  // ✅ 边界情况：一开始就没有任何橘子，直接返回0
  if (countOrange === 0) return 0;

  let level = -1; // 时间分钟数

  // ================= BFS 扩散主逻辑 =================
  while (queue.length) {
    level++; // 进入新一层，时间 +1
    const levelSize = queue.length; // 当前层要处理的节点数量

    // ✅ 神优化：批量减去当前层的橘子数量，替代循环--，效率更高
    countOrange -= levelSize;

    // ✅ 所有橘子都处理完毕（全部腐烂），返回当前时间
    if (countOrange === 0) return level;

    // 遍历当前层所有腐烂橘子，向四个方向扩散
    for (let i = 0; i < levelSize; i++) {
      const [row, col] = queue.shift();

      // 遍历上下左右邻居
      for (let nei of getNeighbors(row, col)) {
        const [nRow, nCol] = nei;
        // const key = nei.join(',');

        // 只处理：新鲜橘子 + 没入队过的
        if (grid[nRow][nCol] !== FRESH || seen[nRow][nCol]) continue;

        // 感染，加入下一层队列
        queue.push(nei);
        seen[nRow][nCol] = true;
        // seen.add(key);
      }
    }
  }

  // BFS结束仍有橘子剩余 → 永远无法腐烂
  return -1;

  // 工具函数：获取上下左右四个合法方向
  function getNeighbors(row, col) {
    const res = [];
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (const [dr, dc] of dirs) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        res.push([r, c]);
      }
    }
    return res;
  }
};
```

### 例题 4：01 矩阵（542 题）

核心：多源 BFS 反向应用，将所有 0 作为起点，向四周扩散，扩散的层数即为每个 1 到最近 0 的最短距离，首次添加到队列即最短距离，无需重复处理。

```js
/**
 * @param {number[][]} mat
 * @return {number[][]}
 * 全零入队做起点，层序扩散算距离，首次添加到队列即最短，遍历完成出答案
 */
var updateMatrix = function (mat) {
  // 矩阵行列数
  const rows = mat.length;
  const cols = mat[0].length;

  // 标记是否添加到队列过（防止重复入队）
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  // 结果矩阵：存储每个位置到最近 0 的距离，默认先填充0 ，只有1的位置需要重新赋值
  const res = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // 统计已处理的格子总数（用于提前退出优化）
  let count = 0;
  // BFS 队列：存储所有 0 的坐标（多源 BFS）
  const queue = [];

  // 第一步：遍历矩阵，把所有 0 加入队列作为起点
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cur = mat[i][j];
      if (cur === 0) {
        queue.push([i, j]); // 0 是 BFS 起点
        seen[i][j] = true; // 标记已添加到队列
      }
    }
  }

  // 记录距离层级（0 所在层为 0，向外扩散每层 +1）
  let level = -1;

  // ================= BFS 扩散主逻辑 =================
  while (queue.length) {
    level++; // 进入新一层，距离 +1
    const levelSize = queue.length; // 当前层节点数

    // 遍历当前层所有节点
    for (let i = 0; i < levelSize; i++) {
      const curPos = queue.shift(); // 取出队首
      const [row, col] = curPos;

      // 如果当前位置是 1，记录当前层级 = 最短距离
      if (mat[row][col] === 1) {
        res[row][col] = level;
      }

      // 遍历四个方向（上下左右）
      for (let nei of getNeighbors(row, col)) {
        const [nRow, nCol] = nei;
        if (seen[nRow][nCol]) continue; // 已添加到队列过，跳过

        // 未添加到队列的节点加入下一层
        queue.push([nRow, nCol]);
        seen[nRow][nCol] = true;
      }
    }

    // 累计已处理格子数
    count += levelSize;
    // 所有格子都处理完了，提前退出
    if (count === cols * rows) break;
  }

  // 返回距离矩阵
  return res;

  // 工具函数：获取当前坐标上下左右四个合法邻居
  function getNeighbors(row, col) {
    const res = [];
    // 四个方向
    const dirs = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ];
    for (let [rowDiff, colDiff] of dirs) {
      const newRow = row + rowDiff;
      const newCol = col + colDiff;
      // 确保在矩阵范围内
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        res.push([newRow, newCol]);
      }
    }
    return res;
  }
};
```

## 1.4 双向 BFS 优化技巧

当起点和终点明确时，双向 BFS 比传统 BFS 效率更高，核心思路是“从起点和终点同时扩散，直到相遇”，每次扩散节点数更少的一侧，进一步提升效率。

以下是打开转盘锁的双向 BFS 实现，保留完整代码和注释：

```js
var openLock = function (deadends, target) {
  // 锁的初始状态：0000
  const start = '0000';
  // 死亡数组转成 Set，判断速度更快 O(1)
  const deadSet = new Set(deadends);

  // 边界条件 1：起点就是死亡密码 → 直接无解
  if (deadSet.has(start)) return -1;
  // 边界条件 2：起点就是终点 → 0 步
  if (start === target) return 0;

  // ==================== 【双向 BFS 核心结构】 ====================
  // 用两个队列：
  // queues[0] → 从起点 0000 开始扩散
  // queues[1] → 从终点 target 反向扩散
  let queues = [[start], [target]];

  // 两个 seen 集合：
  // 分别记录 正向 / 反向 已经走过的位置（最标准、最安全写法）
  let seen = [
    new Set([start]), // 正向走过的
    new Set([target]), // 反向走过的
  ];

  // 两个方向各自走的步数
  let steps = [0, 0];

  // ==================== 开始 BFS 循环 ====================
  // 两个队列都不为空，才继续搜索
  while (queues[0].length && queues[1].length) {
    // ==================== 【核心优化】 ====================
    // 永远让【节点更少】的队列去扩散（速度更快）
    // 如果左边比右边大，就交换左右，保证每次都扩散小的
    if (queues[0].length > queues[1].length) {
      [queues[0], queues[1]] = [queues[1], queues[0]]; // 交换队列
      [seen[0], seen[1]] = [seen[1], seen[0]]; // 交换添加到队列记录
      [steps[0], steps[1]] = [steps[1], steps[0]]; // 交换步数
    }

    // 当前要扩散的队列（永远是小队列）
    const curQueue = queues[0];
    // 存储下一层的新节点
    const nextQueue = [];

    // 遍历当前队列的【所有节点】（一层）
    for (let i = 0; i < curQueue.length; i++) {
      const cur = curQueue[i]; // 取出当前密码

      // ==================== 【相遇判断：最重要！】 ====================
      // 如果当前节点，已经被【对面】添加到队列过
      // 说明 正向 和 反向 相遇了！
      // 总最短步数 = 正向步数 + 反向步数
      if (seen[1].has(cur)) {
        return steps[0] + steps[1];
      }

      // 获取当前密码转动一位能得到的 8 个邻居
      const neighbors = getNeighbors(cur);

      // 遍历所有邻居
      for (const nei of neighbors) {
        // 过滤：不能是死亡点 + 不能被当前方向添加到队列过
        if (deadSet.has(nei) || seen[0].has(nei)) {
          continue;
        }
        // 标记当前方向已添加到队列
        seen[0].add(nei);
        // 加入下一层
        nextQueue.push(nei);
      }
    }

    // 更新队列：当前层扩散完，换成下一层
    queues[0] = nextQueue;
    // 当前方向步数 +1
    steps[0]++;
  }

  // 循环结束没找到 → 无解
  return -1;
};

// ==================== 工具函数 ====================
// 输入一个4位密码，返回转动一位能生成的8种状态
function getNeighbors(str) {
  const res = [];
  for (let i = 0; i < 4; i++) {
    const num = Number(str[i]);
    const arr = str.split('');

    // 第 i 位数字 -1（9 → 0）
    arr[i] = (num - 1 + 10) % 10;
    res.push(arr.join(''));

    // 第 i 位数字 +1（0 → 9）
    arr[i] = (num + 1) % 10;
    res.push(arr.join(''));
  }
  return res;
}
```

# 二、并查集核心解析：连通块的高效管理

并查集（Union-Find）是一种用于管理「动态连通性」的数据结构，核心优势是高效实现「合并集合」和「判断两个元素是否在同一集合」两个操作，时间复杂度接近 O(1)（带路径压缩和按秩合并优化）。

并查集的应用场景非常明确，只要题目涉及「连通块」「分组归类」「合并集合」等关键词，优先使用并查集，几乎都是最优解。

## 2.1 并查集核心思想与适用场景

并查集的核心思路可以概括为：

1. 初始化：每个元素各自为一个集合，父节点指向自身，连通块大小为 1；

2. 查找（find）：找到元素的根节点，同时进行路径压缩（将元素直接挂到根节点，减少后续查找时间）；

3. 合并（union）：将两个元素所在的集合合并，通常按连通块大小合并（小的挂到大的上面，减少树的高度）；

4. 查询：判断两个元素的根节点是否相同，相同则在同一集合。

适用场景（面试高频）：

- 无向图的连通块统计、判断两点是否连通；

- 分组归类问题，如朋友圈、账户合并、相似字符串分组；

- 感染扩散问题（无向），如恶意软件传播；

- 带权连通问题（可扩展为带权并查集），如除法求值。

## 2.2 并查集标准模板（带优化）

以下是并查集的标准版模板，包含路径压缩和按秩（连通块大小）合并优化，可直接复用：

```js
class UF {
  constructor(n) {
    this.treeCount = n; // 连通块总数
    this.parent = new Array(n).fill(0).map((_, index) => index); // 父节点数组
    this.treeSize = new Array(n).fill(1); // 每个连通块的大小
  }

  // 查找x的根节点 + 路径压缩
  find(x) {
    if (x === this.parent[x]) return x;
    const root = this.find(this.parent[x]);
    this.parent[x] = root; // 路径压缩
    return root;
  }

  // 合并p和q所在的集合
  union(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    if (rootP === rootQ) return; // 已在同一集合，无需合并
    // 小集合挂到大集合上，减少树高
    this.parent[rootP] = rootQ;
    this.treeSize[rootQ] += this.treeSize[rootP];
    this.treeCount--; // 连通块总数减少
  }

  // 判断p和q是否连通
  connected(p, q) {
    return this.find(p) === this.find(q);
  }

  // 获取x所在连通块的大小
  getTreeSize(x) {
    return this.treeSize[this.find(x)];
  }

  // 获取连通块总数
  getCount() {
    return this.treeCount;
  }
}
```

## 2.3 并查集实战例题（含完整代码）

以下例题覆盖并查集的基础应用和进阶应用（带权并查集），保留原始代码和注释，重点体会并查集在连通块管理、分组归类中的核心作用。

### 例题 1：账户合并（721 题）

核心：将每个邮箱作为节点，同一账户下的邮箱合并为一个集合，最终按连通块分组，组装成账户信息，典型的「分组归类」场景。

```js
class UF {
  constructor(n) {
    this.treeCount = n;
    this.parent = new Array(n).fill(0).map((_, index) => index);
    this.treeSize = new Array(n).fill(1);
  }

  find(x) {
    if (x === this.parent[x]) return x;
    const root = this.find(this.parent[x]);
    this.parent[x] = root;
    return root;
  }

  union(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    if (rootP === rootQ) return;
    this.parent[rootP] = rootQ;
    this.treeSize[rootQ] += this.treeSize[rootP];
    this.treeCount--;
  }
}

var accountsMerge = function (accounts) {
  // ====================== 第一步：给每个邮箱分配唯一 ID & 建立映射关系 ======================
  // 核心：邮箱是唯一标识，相同邮箱无论在哪个账户，都属于同一个人
  const idToEmailAndName = new Map(); // Map<id, [email, name]>：通过ID查 邮箱+用户名
  const emailToId = new Map(); // Map<email, id>：通过邮箱查 ID
  let id = 0; // 自增ID，每个邮箱对应唯一ID

  // 遍历所有账户，建立ID、邮箱、名字的映射
  for (let account of accounts) {
    const name = account[0]; // 账户的用户名（第一个元素）
    // 遍历当前账户的所有邮箱
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (emailToId.has(email)) continue; // 邮箱已分配ID，跳过

      // 给新邮箱分配ID，并保存映射关系
      emailToId.set(email, id);
      idToEmailAndName.set(id, [email, name]);
      id++; // ID自增，准备给下一个新邮箱
    }
  }

  // ====================== 第二步：使用并查集，合并同一个账户下的所有邮箱 ======================
  const uf = new UF(id); // 初始化并查集，总节点数 = 所有不同邮箱的数量

  // 遍历所有账户，将同一个账户内的所有邮箱互相连通
  for (let account of accounts) {
    const firstId = emailToId.get(account[1]); // 取当前账户第一个邮箱的ID作为代表
    // 把当前账户下所有邮箱 都和 第一个邮箱 合并
    for (let i = 1; i < account.length; i++) {
      const emailId = emailToId.get(account[i]);
      uf.union(firstId, emailId);
    }
  }

  // ====================== 第三步：根据根节点，对邮箱进行分组 ======================
  const rootIdToEmailList = new Map(); // Map<根ID, 邮箱数组>：同一个根 = 同一个人

  // 遍历所有ID，找到每个邮箱对应的根节点，按根分组
  for (let [id, [email]] of idToEmailAndName.entries()) {
    const rootId = uf.find(id); // 找到当前邮箱的根ID

    // 如果根ID不存在，创建空数组
    if (!rootIdToEmailList.has(rootId)) {
      rootIdToEmailList.set(rootId, []);
    }
    // 把当前邮箱加入对应根的分组
    rootIdToEmailList.get(rootId).push(email);
  }

  // ====================== 第四步：组装结果，格式化输出 ======================
  const res = [];
  // 遍历每个分组（每个人）
  for (let [rootId, emailList] of rootIdToEmailList.entries()) {
    const name = idToEmailAndName.get(rootId)[1]; // 通过根ID拿到用户名
    emailList.sort(); // 邮箱按字典序排序（题目要求）
    res.push([name, ...emailList]); // 拼接成 [名字, 邮箱1, 邮箱2...]
  }

  return res;
};
```

### 例题 2：尽量减少恶意软件的传播（924 题）

核心：用并查集合并无向图的连通块，统计每个连通块内的初始感染节点数，只有“连通块内只有1个感染节点”时，删除该节点才能拯救整个连通块，最终选择拯救节点最多、索引最小的节点。

```js
// ====================== 并查集模板（标准版，带连通块大小统计）======================
class UF {
  constructor(n) {
    this.treeCount = n; // 连通块总数（本题不用，但模板必备）
    this.parent = new Array(n).fill(0).map((_, index) => index); // 父节点数组，初始自己指向自己
    this.treeSize = new Array(n).fill(1); // 每个连通块的大小，初始每个节点自己是一块
  }

  // 查找节点x的根节点 + 路径压缩（加速）
  find(x) {
    if (x === this.parent[x]) return x;
    const root = this.find(this.parent[x]);
    this.parent[x] = root; // 路径压缩：直接挂到根节点
    return root;
  }

  // 合并两个节点所在的连通块
  union(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    if (rootP === rootQ) return; //  already in same set

    // 把p所在树挂到q所在树上
    this.parent[rootP] = rootQ;
    this.treeSize[rootQ] += this.treeSize[rootP]; // 合并后更新连通块大小
    this.treeCount--; // 连通块数量-1
  }

  // 获取节点x所在连通块的总大小
  getTreeSize(x) {
    return this.treeSize[this.find(x)];
  }
}

// ====================== 主函数：LeetCode 924 解题核心 ======================
/**
 * 题目：尽量减少恶意软件的传播
 * 核心：删除一个节点，让最终感染数最小 → 返回应该删除的节点
 * @param {number[][]} graph 无向图邻接矩阵
 * @param {number[]} initial 初始感染节点列表
 * @return {number} 返回删除的节点索引
 */
var minMalwareSpread = function (graph, initial) {
  const n = graph.length; // 总节点数
  const uf = new UF(n); // 初始化并查集

  // ====================== 步骤1：用并查集合并所有连通块 ======================
  // 无向图，只遍历 i < j 的情况，避免重复合并，效率最高
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 如果 i 和 j 相连，就合并
      if (graph[i][j] === 1) {
        uf.union(i, j);
      }
    }
  }

  // ====================== 步骤2：按【连通块根节点】分组初始感染节点 ======================
  // key：连通块根节点
  // value：这个块里的【初始感染节点列表】
  const rootToNodeList = new Map();
  for (let node of initial) {
    const root = uf.find(node); // 找到当前感染节点属于哪个连通块
    if (!rootToNodeList.has(root)) rootToNodeList.set(root, []);
    rootToNodeList.get(root).push(node); // 把感染节点加入对应列表
  }

  // ====================== 步骤3：遍历找最优删除节点 ======================
  let maxSave = 0; // 记录最多能拯救多少个节点
  let bestNode = Math.min(...initial); // 答案默认：初始列表中最小索引（边界情况）

  // 遍历每个连通块
  for (let [root, nodeList] of rootToNodeList) {
    // 核心规则：
    // 只有当一个连通块里【只有1个初始感染点】时，删除它才能拯救整个块
    // 如果块里 ≥2 个感染点，删一个没用，照样感染
    if (nodeList.length === 1) {
      const curNode = nodeList[0]; // 当前唯一感染节点（删它就能救整个块）
      const blockSize = uf.getTreeSize(root); // 当前连通块大小（能拯救的数量）

      // 情况1：能拯救更多节点 → 更新
      if (blockSize > maxSave) {
        maxSave = blockSize;
        bestNode = curNode;
      }

      // 情况2：拯救数量一样 → 选【索引更小】的节点
      if (blockSize === maxSave && curNode < bestNode) {
        bestNode = curNode;
      }
    }
  }

  // 返回最优删除节点
  return bestNode;
};
```

### 例题 3：除法求值（399 题）

核心：带权并查集的应用，将每个变量作为节点，等式关系作为边的权重（如 a/b = value，权重为 value），通过并查集维护变量间的比例关系，最终快速求解查询的比例。

```js
class UFW {
  // 初始化 n 个节点
  constructor(n) {
    // 父节点数组：parent[i] 表示 i 的父亲是谁
    this.parent = new Array(n).fill(0).map((_, index) => index);

    // 权重数组 🔥 核心定义：
    // weight[i] = i / parent[i]
    // 意思是：当前节点 ÷ 它的父亲 = 这个值
    this.weight = new Array(n).fill(1);

    // 连通分量的数量（可选）
    this.count = n;
  }

  // 查找 x 的根节点 + 路径压缩 + 自动更新权重
  find(x) {
    // 如果自己就是根节点，直接返回
    if (x === this.parent[x]) {
      return x;
    }

    // 保存 x 原来的父亲（路径压缩前的父亲）
    const oldP = this.parent[x];

    // 递归找到最顶层根节点
    const root = this.find(this.parent[x]);

    // 路径压缩：把 x 直接挂到根节点上
    this.parent[x] = root;

    // 🔥 权重更新（最关键）
    // this.weight[x] 原来：x / oldP
    // this.weight[oldP] 原来：oldP / root
    // 现在 x 直接指向 root，所以 x / root = (x / oldP) * (oldP / root)
    this.weight[x] = this.weight[x] * this.weight[oldP];

    return root;
  }

  // 判断 x 和 y 是否在同一个集合里（连通）
  connected(x, y) {
    return this.find(x) === this.find(y);
  }

  // 🔥 合并操作
  // 传入关系：x / y = value
  union(x, y, value) {
    // 先找到 x 和 y 各自的根
    const rootX = this.find(x);
    const rootY = this.find(y);

    // 如果已经连通，不需要合并
    if (rootX === rootY) return;

    // 把 rootX 挂到 rootY 下面（合并两个集合）
    this.parent[rootX] = rootY;

    // 🔥🔥🔥 核心公式（推导好的结果，直接用）
    // find之后，weight[x] = x / rootX
    // find之后，weight[y] = y / rootY
    // 已知 x/y = value
    // 推导得：rootX/rootY = value * weight[y]/weight[x]
    this.weight[rootX] = (value * this.weight[y]) / this.weight[x];

    // 两个集合合并成一个，连通分量总数-1
    this.count--;
  }

  // 🔥 获取 x / y 的结果
  getValue(x, y) {
    // 如果不连通 → 返回 -1
    if (!this.connected(x, y)) return -1.0;

    // 🔥 最终公式：
    // x / y = (x / root) / (y / root)
    // 也就是 weight[x] / weight[y]
    return this.weight[x] / this.weight[y];
  }

  // 获取连通分量数量（可选）
  getCount() {
    return this.count;
  }
}

/**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 */
var calcEquation = function (equations, values, queries) {
  // 字符串变量 -> 数字ID 映射（因为并查集用数字数组最快）
  const strToId = new Map();
  let id = -1;

  // 1. 给所有字符串变量分配唯一数字ID
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    if (!strToId.has(a)) strToId.set(a, ++id);
    if (!strToId.has(b)) strToId.set(b, ++id);
  }

  // 2. 创建并查集
  const uf = new UFW(id + 1);

  // 3. 合并所有等式关系 a / b = value
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    const aId = strToId.get(a);
    const bId = strToId.get(b);
    uf.union(aId, bId, values[i]);
  }

  const res = [];
  // 4. 处理每个查询
  for (let [aStr, bStr] of queries) {
    // 变量不存在 → -1
    if (!strToId.has(aStr) || !strToId.has(bStr)) {
      res.push(-1.0);
      continue;
    }
    const aId = strToId.get(aStr);
    const bId = strToId.get(bStr);
    // 直接调用并查集获取 a/b 的结果
    res.push(uf.getValue(aId, bId));
  }

  return res;
};
```

### 例题 4：引爆炸弹（2101 题）

核心：先通过双重循环建图（判断炸弹之间能否互相引爆），再用并查集合并连通块，最后遍历每个炸弹作为起点，用 BFS 统计能引爆的最大数量，结合了并查集和 BFS 的优势。

```js
/**
 * LeetCode 2101 引爆最多炸弹
 * 题目：炸弹之间可以连锁引爆，求最多能引爆多少个
 * 核心思想：建图 + BFS 遍历每个起点求最大连通数
 * 图关系：如果 A 能引爆 B，则 A → B 有一条有向边
 */
var maximumDetonation = function (bombs) {
  const n = bombs.length;

  // ==================== 1. 建图（邻接表）====================
  // indexToNeighbors[i]：表示炸弹 i 能直接引爆的所有炸弹编号
  // 必须用 map 创建独立数组，避免引用共享
  const indexToNeighbors = new Array(n).fill(0).map(() => []);

  // 双层循环：i 从 0~n，j 从 i~n，只算一半，效率更高
  // 同时判断 i→j 和 j→i 两个方向
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 取出两个炸弹的坐标与半径
      const [cx, cy, cr] = bombs[i];
      const [nx, ny, nr] = bombs[j];

      // 计算两点距离的平方（不开根号，避免浮点误差）
      const d = (cx - nx) * (cx - nx) + (cy - ny) * (cy - ny);

      // 判断：炸弹 i 能否引爆 j
      if (cr * cr >= d) {
        indexToNeighbors[i].push(j);
      }
      // 判断：炸弹 j 能否引爆 i
      if (nr * nr >= d) {
        indexToNeighbors[j].push(i);
      }
    }
  }

  // ==================== 2. BFS 遍历所有起点 ====================
  let maxCount = 0; // 记录全局最大数量

  // 每个炸弹都当一次起点，做 BFS
  for (let i = 0; i < n; i++) {
    const queue = [i]; // BFS 队列，存炸弹索引
    const seen = new Array(n).fill(false); // 每次 BFS 独立 seen
    let breakCount = 0; // 当前起点能引爆的总数
    seen[i] = true; // 标记起点已添加到队列

    // BFS 核心循环
    while (queue.length) {
      const levelSize = queue.length; // 层序遍历（可不用，但逻辑更清晰）

      for (let j = 0; j < levelSize; j++) {
        const curIdx = queue.shift(); // 取出当前炸弹
        breakCount++; // 计数+1

        // 遍历当前炸弹能引爆的所有邻居
        for (const nei of indexToNeighbors[curIdx]) {
          if (seen[nei]) continue; // 已炸过，跳过
          seen[nei] = true; // 标记为已炸
          queue.push(nei); // 加入队列，继续扩散
        }
      }
    }

    // 更新最大值
    maxCount = Math.max(maxCount, breakCount);
  }

  // 返回能引爆的最大数量
  return maxCount;
};
```

# 三、BFS 与并查集对比及选型技巧

BFS 和并查集都能处理图的连通性问题，但适用场景各有侧重，选择对的工具能大幅提升解题效率，避免走弯路。

## 3.1 核心区别

| 特性       | BFS                                  | 并查集                             |
| ---------- | ------------------------------------ | ---------------------------------- |
| 核心用途   | 求最短路径、层序遍历、多源扩散       | 连通块管理、合并集合、判断连通性   |
| 时间复杂度 | O(V+E)（V为节点数，E为边数）         | 接近 O(1)（带路径压缩和按秩合并）  |
| 适用场景   | 无权图最短路径、层序相关、扩散类问题 | 分组归类、连通块统计、动态合并集合 |
| 优势       | 能快速求解最短路径，适配层序类需求   | 合并、查询效率极高，代码简洁       |
| 劣势       | 处理连通块合并时效率低于并查集       | 无法求解最短路径，不适用于层序遍历 |

## 3.2 选型技巧（面试必记）

- 看到「最短路径」「最少步数」「层序」「扩散」→ 优先用 BFS；

- 看到「连通块」「分组」「合并」「是否连通」→ 优先用并查集；

- 复杂场景（如引爆炸弹）：可结合两者，先用并查集合并连通块，再用 BFS 统计结果；

- 图为有向图：优先用 BFS（并查集更适合无向图的连通性）；
