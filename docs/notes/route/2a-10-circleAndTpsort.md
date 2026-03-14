# 环检测与拓扑排序：BFS/DFS双实现

## 前言

在有向图问题中，**环检测**和**拓扑排序**是高频核心考点，二者紧密关联——拓扑排序仅能在“无环有向图（DAG）”中实现，若图中存在环，则无法生成合法的拓扑序列。

本文将从「BFS」和「DFS」两种经典视角，拆解环检测与拓扑排序的实现逻辑，搭配LeetCode高频真题（207.课程表、210.课程表II），完整覆盖“原理→代码→实战”，所有代码及注释**100%原样保留**，兼顾理解性和实用性，适合算法入门及面试复盘。

---

# 一、核心概念铺垫

在开始实现前，先明确两个关键概念，为后续理解打下基础：

- **拓扑排序**：对有向无环图（DAG）的节点进行排序，使得对于每一条有向边A→B，节点A在排序结果中都位于节点B之前（本质是解决“依赖顺序”问题）。

- **环检测**：判断有向图中是否存在“循环依赖”（如A→B、B→C、C→A），若存在环，则无法进行拓扑排序；反之则可以生成拓扑序列。

- **入度**：节点的入度是指指向该节点的边的数量（可理解为“完成该节点所需的前置依赖数”）。

---

# 二、BFS实现：拓扑排序 + 环检测

BFS实现的核心思路是「基于入度的“任务调度”」——将无依赖（入度=0）的节点作为起点，逐步解锁下游节点，最终判断所有节点是否都能被解锁（无环），同时记录解锁顺序（拓扑序列）。

### BFS通用模板（环检测）

```JavaScript

/**
 * BFS+拓扑排序检测有向图是否存在环
 * 核心思想：
 * 1. 把图的节点看作「任务」，节点间的有向边看作「任务依赖」（A→B 表示 B依赖A，要先做A才能做B）
 * 2. 入度：某个节点的入度 = 该节点的「依赖任务数」（有多少个任务要先完成，才能做这个任务）
 * 3. 无依赖任务（入度=0）可以直接执行，执行完后会减少其下游任务的依赖数
 * 4. 若最终有任务未被执行（未打勾），说明存在循环依赖（环）
 * @param {Array<Array<number>>} graph - 邻接表表示的有向图，格式：graph[当前节点id] = [邻居节点1id, 邻居节点2id,...]
 * @param {number} start - 起始节点id（本算法是全局检测环，该参数仅保留兼容，实际不影响逻辑）
 * @returns {boolean} - 检测结果：true表示图中有环，false表示无环
 */
function detectCircle(graph, start) {
  // 1. 获取图的总节点数（邻接表的长度就是节点数）
  const n = graph.length;
  // 边界处理：空图（没有任何节点）一定没有环，直接返回false
  if (n === 0) return false;

  // 2. 初始化入度数组：inDeg[i] 表示节点i的入度（依赖任务数），初始值都为0
  const inDeg = new Array(n).fill(0);
  // 3. 遍历所有节点，统计每个节点的入度（核心步骤）
  graph.forEach(neighbors => {
    // 遍历当前节点cur的所有邻居节点nei
    neighbors.forEach(neigh => {
      // 邻居节点nei的入度+1（因为多了一个依赖任务cur）
      inDeg[nei]++;
    });
  });

  // 4. 初始化已完成任务列表：记录所有「执行完毕（打勾）」的节点id
  const done = [];
  // 5. 收集所有「无依赖任务」（入度=0的节点），放入队列等待执行
  const todoList = [];
  inDeg.forEach((deg, id) => {
    // deg是节点id的入度，deg=0表示该节点无依赖，可直接执行
    if (deg === 0) {
      todoList.push(id); // 加入队列
    }
  });

  // 6. BFS核心逻辑：循环执行无依赖任务，更新下游任务的依赖数
  while (todoList.length > 0) {
    // 队列不为空时，说明还有可执行的无依赖任务
    // 6.1 取出队列头部的节点（BFS特性：先进先出），作为当前要执行的任务
    const cur = todoList.shift();
    // 6.2 标记该节点为已完成（打勾），加入done列表
    done.push(cur);

    // 6.3 遍历当前节点cur的所有邻居节点nei（cur执行完后，nei的依赖数要减少）
    for (const nei of graph[cur]) {
      // 邻居节点nei的入度-1（少了一个依赖任务cur）
      inDeg[nei]--;
      // 6.4 若nei的入度变为0，说明其所有依赖任务都已完成，变为无依赖任务
      if (inDeg[nei] === 0) {
        todoList.push(nei); // 加入队列，等待执行
      }
    }
  }

  // 7. 判环核心逻辑：
  // - done.length 是已完成的节点数，n是总节点数
  // - 若已完成数 ≠ 总节点数 → 有节点因循环依赖无法执行 → 图中有环
  // - 若已完成数 = 总节点数 → 所有任务都执行完毕 → 图中无环
  return done.length !== n;
}

```

### BFS真题实战：LeetCode 210. 课程表 II（拓扑排序）

🔗 [LeetCode 210](https://leetcode.cn/problems/course-schedule-ii/)

#### 描述

现在你总共有 `numCourses` 门课需要学习，记为`0` 到 `numCourses - 1`。给你一个数组 `prerequisites`，其中 `prerequisites[i] = [ai, bi]`，表示在学习课程 `ai` 之前必须先学习课程 `bi`。

返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回任意一个即可。如果不可能完成所有课程，返回一个空数组。

#### 示例

```Plain Text

输入：numCourses = 2, prerequisites = [[1,0]]
输出：[0,1]
解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1]。

输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
输出：[0,2,1,3]
解释：总共有 4 门课程。要学习课程 3，你应该先学习课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
因此，一个正确的课程顺序是 [0,1,2,3]。另一个正确的顺序是 [0,2,1,3]。

输入：numCourses = 1, prerequisites = []
输出：[0]

```

#### 思路

1. 将课程看作节点，先修关系看作有向边（bi→ai，即ai依赖bi），构建邻接表表示有向图。

2. 统计每个课程的入度（即该课程的先修课数量）。

3. 用BFS遍历，先处理入度为0的课程（无先修课，可直接学习），学习后解锁其下游课程（入度减1）。

4. 若最终学习的课程数等于总课程数，说明无环，返回学习顺序（拓扑序列）；否则有环，返回空数组。

5. 补充：若将题目改为207.课程表（仅判断能否完成所有课程），只需返回“学习课程数是否等于总课程数”即可。

#### 代码

```JavaScript

/**
 * 210. 课程表 II（返回课程学习的拓扑排序顺序）
 * 核心逻辑：拓扑排序 → 无环返回合法学习顺序，有环返回空数组
 * @param {number} numCourses - 课程总数
 * @param {Array<Array<number>>} prerequisites - 先修课列表：[要学的课, 先修课] 即 [to, from]
 * @returns {Array<number>} - 合法的学习顺序（无环），空数组（有环）
 */
var findOrder = function (numCourses, prerequisites) {
  // 1. 初始化邻接表：graph[先修课] = [依赖该先修课的课程列表]
  // 例：graph[0] = [1] → 学完0才能学1
  const graph = new Array(numCourses).fill(0).map(() => []);
  // 2. 初始化入度数组：inDegree[课程] = 该课程的先修课数量（依赖数）
  const inDegree = new Array(numCourses).fill(0);

  // 3. 遍历先修课列表，填充邻接表和入度数组
  prerequisites.forEach(([to, from]) => {
    graph[from].push(to); // from是to的先修课 → from指向to
    inDegree[to]++; // to的依赖数+1
  });

  // 4. 收集所有「无先修课的课程」（入度=0，可直接学）
  const toDoList = [];
  inDegree.forEach((inDeg, index) => {
    if (inDeg === 0) toDoList.push(index);
  });

  // 5. 记录拓扑排序的学习顺序（替代原有的done数字）
  const doneList = [];

  // 6. BFS核心：处理无依赖课程，解锁下游课程
  while (toDoList.length) {
    // 取出队首课程（shift=队列→标准BFS，保证顺序符合拓扑特性）
    const cur = toDoList.shift();
    doneList.push(cur); // 加入学习顺序

    // 遍历当前课程能解锁的下游课程
    for (const nei of graph[cur]) {
      inDegree[nei]--; // 下游课程依赖数-1
      // 依赖数为0 → 无先修课，加入待学列表
      if (inDegree[nei] === 0) {
        toDoList.push(nei);
      }
    }
  }

  // 7. 关键：若拓扑排序长度≠总课程数 → 有环，返回空数组；否则返回学习顺序
  // return doneList.length === numCourses 如果是207题换成这个就行
  return doneList.length === numCourses ? doneList : [];
};

```

---

# 三、DFS实现：拓扑排序 + 环检测

DFS实现的核心思路是「后序遍历+递归栈判环」——通过递归遍历所有节点，先处理当前节点的所有下游依赖（钻到底），再记录当前节点（后序），同时用递归栈标记当前路径，若发现节点已在递归栈中，则存在环。最终将后序记录反转，即可得到拓扑序列。

### DFS通用模板（拓扑排序+环检测）

```JavaScript

/**
 * DFS实现拓扑排序（打勾视角）
 * 核心：钻到底打勾 → 所有依赖打完勾，再给自己打勾 → 反转得到拓扑序
 * @param {Array<Array<number>>} graph - 邻接表：graph[cur] = [neighbor1, neighbor2...]（正向建图：cur→next）
 * @param {number} start - 起始节点
 * @returns {Array<number>} - 拓扑序（无环）/空数组（有环）
 */
function tpOrder(graph, start) {
  const n = graph.length;
  const visited = new Array(n).fill(false); // 全局打勾：是否遍历过（避免重复）
  const inStack = new Array(n).fill(false); // 当前路径：是否在递归栈中（判环）
  let hasCircle = false; // 是否有环（循环依赖）
  const orderList = []; // 后序打勾记录（依赖倒序）

  traverse(start);
  // 无环则反转后序记录，得到正拓扑序；有环返回空
  return hasCircle ? [] : orderList.reverse();

  /**
   * 递归遍历：钻到底打勾
   * @param {number} curId - 当前节点
   * @returns {boolean} - 是否找到环（提前终止递归）
   */
  function traverse(curId) {
    // 提前终止：已找到环，不用继续
    if (hasCircle) {
      return true;
    }
    // 全局已打勾：该节点的所有依赖都处理过，无需重复
    if (visited[curId]) return false;
    // 判环：当前节点在递归栈中 → 绕回路径，有环
    if (inStack[curId]) {
      hasCircle = true;
      return true;
    }

    // 标记：加入当前路径 + 全局打勾（避免重复遍历）
    visited[curId] = true;
    inStack[curId] = true;

    // 钻进去处理所有依赖（下游节点）
    // 优化1：兼容graph[curId]为空的情况（无邻居），避免解构报错
    for (let nextId of graph[curId] || []) {
      // 优化2：去掉多余的[]解构（graph元素是number而非[number]）
      // 只要有一个依赖找到环，立刻终止
      if (traverse(nextId)) return true;
    }

    // 核心：所有依赖都打完勾了，给自己打勾！（后序记录）
    orderList.push(curId);
    // 回溯：退出当前路径（该节点处理完，不影响其他路径）
    inStack[curId] = false;
    return false;
  }
}

```

### DFS真题实战：LeetCode 210. 课程表 II（拓扑排序版）

🔗 [LeetCode 210](https://leetcode.cn/problems/course-schedule-ii/)

#### 描述

与BFS实战题目一致（见上文），仅实现方式不同。

#### 示例

与BFS实战示例一致（见上文）。

#### 思路

1. 同样构建邻接表（先修课→依赖课程），表示课程间的依赖关系。

2. 用两个数组标记节点状态：`visited`（全局是否遍历过，避免重复）、`inStack`（当前递归路径中是否存在，用于判环）。

3. 遍历所有未访问的节点（处理非连通图），递归处理每个节点的下游依赖，直到所有依赖都处理完毕（后序），再记录当前节点。

4. 若递归过程中发现节点已在递归栈中，说明存在环；否则，将后序记录反转，得到拓扑序列。

#### 代码

```JavaScript

/**
 * 210. 课程表 II（DFS拓扑排序版）
 * @param {number} numCourses - 课程总数
 * @param {Array<Array<number>>} prerequisites - 先修课列表：[to, from]
 * @returns {Array<number>} - 合法学习顺序（无环）/空数组（有环）
 */
var findOrder = function (numCourses, prerequisites) {
  // 1. 初始化邻接表：graph[先修课] = [依赖该先修课的课程列表]
  // 例：graph[0] = [1] → 学完0才能学1
  const graph = new Array(numCourses).fill(0).map(() => []);

  // 2. 遍历先修课列表，填充邻接表
  prerequisites.forEach(([to, from]) => {
    graph[from].push(to); // from是to的先修课 → from指向to
  });

  // 3. 核心修正：DFS拓扑排序需要遍历所有节点（处理非连通图）
  const visited = new Array(numCourses).fill(false); // 全局遍历标记
  const inStack = new Array(numCourses).fill(false); // 递归栈标记
  let hasCircle = false;
  const orderList = [];

  // 遍历所有未访问的节点（而非只从0开始）
  for (let i = 0; i < numCourses; i++) {
    if (!visited[i] && !hasCircle) {
      traverse(i);
    }
  }

  // 有环返回空数组，无环返回反转后的拓扑序
  return hasCircle ? [] : orderList.reverse();

  // 封装traverse函数（替代原tpOrder），避免单独函数传参冗余
  function traverse(curId) {
    if (hasCircle) return true;
    if (visited[curId]) return false;
    if (inStack[curId]) {
      hasCircle = true;
      return true;
    }

    visited[curId] = true;
    inStack[curId] = true;

    // 兼容空邻居，避免遍历报错
    for (let nextId of graph[curId] || []) {
      if (traverse(nextId)) return true;
    }

    // 后序记录：所有依赖打完勾，给自己打勾
    orderList.push(curId);
    inStack[curId] = false;
    return false;
  }
};

```

---

# 四、BFS与DFS实现对比

| 实现方式 | 核心思想 | 判环逻辑 | 拓扑序列生成 | 适用场景 |
| --- | --- | --- | --- | --- |
| BFS | 基于入度，逐步解锁无依赖节点 | 最终解锁的节点数 ≠ 总节点数 → 有环 | 解锁顺序即为拓扑序列（正序） | 适合求任意拓扑序列，逻辑直观，易理解 |
| DFS | 后序遍历，先处理依赖再处理自身 | 递归栈中出现重复节点 → 有环 | 后序记录反转后，得到拓扑序列 | 适合深度优先场景，代码简洁，可处理非连通图 |

---

# 五、补充：LeetCode 207. 课程表（简化版）

🔗 [LeetCode 207](https://leetcode.cn/problems/course-schedule/)

#### 描述

给你一个整数 `numCourses` 表示你必须学习的课程数目，以及一个数组 `prerequisites` 表示先修课程关系。判断是否可能完成所有课程的学习。

#### 核心说明

该题是210题的简化版，仅需判断是否无环，无需返回拓扑序列。

- BFS版：将210题代码的返回值改为 `return doneList.length === numCourses`即可。

- DFS版：将210题代码的返回值改为 `return !hasCircle` 即可。

---

# 六、总结

环检测与拓扑排序是有向图的核心应用，记住两个关键结论：

1. 有环有向图 → 无法生成拓扑序列；无环有向图（DAG）→ 可生成拓扑序列。

2. BFS靠「入度+队列」解锁节点，直观易懂；DFS靠「后序遍历+递归栈」判环，代码简洁。
