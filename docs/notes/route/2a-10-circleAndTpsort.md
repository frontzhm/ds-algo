# 检测环和拓扑排序

先说BFS

BFS

```js
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

207题 210题 课程表

```js
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

在说

DFS

```js
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

207题 210题 课程表

```js
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
