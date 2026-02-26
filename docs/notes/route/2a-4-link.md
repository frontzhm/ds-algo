
上面的思维延展题

一、核心迁移题（频率 / 优先级类）
这类题都能用「分层存储 + 快速定位」的思路解决，和频率栈的核心逻辑高度一致：
1. 频率队列（LeetCode 451. 根据字符出现频率排序）
链接：https://leetcode.cn/problems/sort-characters-by-frequency/



「已知迭代范围」用 for 循环：
比如「从 n 到 1」「遍历数组索引」「循环固定次数」，优先用 for 循环，迭代逻辑由语法兜底；
例：遍历数组 for(let i=0; i<arr.length; i++)，遍历频率 for(let f=max; f>0; f--)。
「未知迭代次数」用 while 循环：
比如「读取输入直到用户输入 'quit'」「BFS 遍历直到队列空」，用 while 循环；
例：while (queue.length > 0) { ... }（迭代次数由队列长度决定）。
如果必须用 while，加「防御性迭代」：
若场景只能用 while，把迭代逻辑写在「循环体开头 / 结尾」，避免被 continue 跳过：
```js
// 防御性 while 写法（兜底）
let freq = mostFreq;
while (freq > 0) {
  // 先记录当前值，再迭代（避免continue跳过）
  const currentFreq = freq;
  freq--; 

  const charList = freqToCharList[currentFreq];
  if (charList === undefined) continue;
  for(let char of charList) {
    res += char.repeat(currentFreq);
  }
}
```


```js
/**
 * LeetCode 451. 根据字符出现频率排序 - 工程化最优版
 * 核心需求：
 * 1. 将字符串字符按「出现频率从高到低」排序；
 * 2. 频率相同的字符，输出顺序任意；
 * 核心思路（频率分层思想，时间复杂度O(n)，最优解）：
 * 1. 统计频率：Map记录「字符→频率」，O(1)更新/查询频率；
 * 2. 频率分层：数组实现「频率→字符列表」（索引=频率），避免排序的O(nlogn)开销；
 * 3. 拼接结果：从最高频率到1遍历，按频率重复字符拼接，保证高频优先；
 * 工程化优化：
 * - 用for循环替代while循环，规避continue导致的迭代漏更风险；
 */
var frequencySort = function(s) {
  const len = s.length;
  // 【易错点1：边界条件遗漏】
  // 错误示例：忽略len<=1的情况，仍执行后续逻辑（无意义且降低效率）
  // 正确处理：空字符串/单个字符直接返回，无需处理
  if (len <= 1) return s;

  // ========== 步骤1：统计每个字符的出现频率（O(n)） ==========
  const charToFreq = new Map(); // 键：字符，值：字符出现频率
  for (let char of s) {
    // 【易错点2：频率初始化错误】
    // 错误示例：charToFreq.get(char) + 1（未处理char不存在的情况，返回NaN）
    // 正确处理：不存在则默认频率为0，+1后更新
    const newFreq = (charToFreq.get(char) || 0) + 1;
    charToFreq.set(char, newFreq);
  }

  // ========== 步骤2：频率分层存储（O(k)，k为不同字符数，k≤n） ==========
  const freqToCharList = []; // 核心：数组索引=频率，值=该频率下的所有字符
  let mostFreq = 0; // 记录最高频率，避免遍历整个数组（性能优化）
  for (let [char, freq] of charToFreq) {
    // 【易错点3：频率层初始化错误】
    // 错误示例：if (!freqToCharList[freq])（误判空数组为未初始化）
    // 正确处理：判断undefined，仅初始化未定义的频率层
    if (freqToCharList[freq] === undefined) {
      freqToCharList[freq] = [];
    }
    // 将字符推入对应频率层（保证同频率字符集中存储）
    freqToCharList[freq].push(char);
    // 【易错点4：最高频率未更新】
    // 错误示例：未统计mostFreq，后续遍历从数组长度开始（包含空层，效率低）
    // 正确处理：同步更新最高频率，后续仅遍历有效频率
    mostFreq = Math.max(mostFreq, freq);
  }

  // ========== 步骤3：按频率从高到低拼接结果（O(n)） ==========
  let res = '';
  // 【工程化优化：for循环替代while循环】
  // 优势：迭代变量freq的增减写在循环头，continue仅跳过当前轮次，不会漏更（避免无限循环）
  // 错误示例（while版）：continue跳过freq--导致无限循环
  for (let freq = mostFreq; freq > 0; freq--) {
    const charList = freqToCharList[freq];
    // 【易错点5：空频率层处理】
    // 错误示例：直接遍历charList（访问undefined会报错）
    // 正确处理：跳过无字符的频率层，继续下一轮迭代
    if (charList === undefined) continue;

    // 【易错点6：字符重复次数错误】
    // 错误示例：res += char.repeat(1)（重复1次，未按频率重复）
    // 正确处理：重复次数=当前频率，保证高频字符多输出
    for (let char of charList) {
      res += char.repeat(freq);
    }
  }

  return res;
};

// ============== 测试用例（覆盖所有易错场景） ==============
// console.log(frequencySort("tree"));    // 输出 "eetr"/"eert"（正常场景）
// console.log(frequencySort("cccaaa"));  // 输出 "cccaaa"/"aaaccc"（同频率场景）
// console.log(frequencySort("Aabb"));    // 输出 "bbAa"/"bbaA"（大小写敏感场景）
// console.log(frequencySort(""));        // 输出 ""（空字符串边界）
// console.log(frequencySort("a"));       // 输出 "a"（单个字符边界）
// console.log(frequencySort("ab"));      // 输出 "ab"/"ba"（频率均为1场景）
```
2. 带优先级的栈（LeetCode 703. 数据流中的第 K 大元素）
链接：https://leetcode.cn/problems/kth-largest-element-in-a-stream/

```js
/**
 * LeetCode 703. 数据流中的第 K 大元素 - 小顶堆最优版
 * 核心思路：
 * 1. 维护大小为 K 的小顶堆，堆顶即为「第 K 大元素」；
 * 2. add 逻辑：
 *    - 堆大小 < K：直接入堆，向上调整（swim）保证小顶堆性质；
 *    - 堆大小 = K：新值 > 堆顶则替换堆顶，向下调整（sink）保证小顶堆性质；
 * 核心函数：
 * - sink：向下堆化（替换堆顶后调用）；
 * - 向上调整：入堆新元素后调用（内联在add中）；
 */
class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = []; // 小顶堆（仅存储前K大元素，堆顶是第K大）
    // 初始化：遍历nums，复用add逻辑构建堆
    for (let num of nums) {
      this.add(num);
    }
  }

  /**
   * 添加新值并返回第K大元素
   * @param {number} val 新增值
   * @return {number} 第K大元素（堆顶）
   */
  add(val) {
    if (this.heap.length < this.k) {
      // 步骤1：堆未满，直接入堆并向上调整
      this.heap.push(val);
      let i = this.heap.length - 1;
      // 向上调整（swim）：子节点 < 父节点则交换，保证小顶堆
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        if (val < this.heap[parent]) {
          [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
          i = parent;
        } else {
          break; // 无需继续调整
        }
      }
    } else if (val > this.heap[0]) {
      // 步骤2：堆已满，新值 > 堆顶（属于前K大），替换堆顶并向下调整
      this.heap[0] = val;
      this.sink(0);
    }
    // 堆顶即为第K大元素（题目保证调用add时元素数≥K）
    return this.heap[0];
  }

  /**
   * 向下堆化（sink）：保证小顶堆性质（父节点 < 子节点）
   * @param {number} index 要调整的节点索引
   */
  sink(index) {
    const len = this.heap.length;
    let minIndex = index; // 最小元素的索引（初始为当前节点）
    const left = index * 2 + 1; // 左子节点索引
    const right = index * 2 + 2; // 右子节点索引

    // ========== 修正1：先判断子节点是否越界，再比较大小 ==========
    // 错误：先比较大小再判断越界 → 访问undefined（比如left>=len时，heap[left]是undefined）
    // 正确：先判断left<len，再比较左子节点和当前最小值
    if (left < len && this.heap[left] < this.heap[minIndex]) {
      minIndex = left;
    }
    // 修正2：同理，先判断right<len，再比较右子节点和当前最小值
    if (right < len && this.heap[right] < this.heap[minIndex]) {
      minIndex = right;
    }

    // ========== 修正3：只有最小值不是当前节点时，才交换并递归 ==========
    // 错误：未判断minIndex是否等于index → 无意义的交换+递归（甚至报错）
    if (minIndex !== index) {
      [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
      this.sink(minIndex); // 递归调整交换后的子节点
    }
  }
}

// ============== 测试用例（验证所有场景） ==============
// const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
// console.log(kthLargest.add(3));  // 输出4（正确）
// console.log(kthLargest.add(5));  // 输出5（正确）
// console.log(kthLargest.add(10)); // 输出5（正确）
// console.log(kthLargest.add(9));  // 输出8（正确）
// console.log(kthLargest.add(4));  // 输出8（正确）

// // 边界测试：初始数组为空
// const kthLargest2 = new KthLargest(1, []);
// console.log(kthLargest2.add(-3)); // 输出-3（正确）
// console.log(kthLargest2.add(-2)); // 输出-2（正确）
// console.log(kthLargest2.add(-4)); // 输出-2（正确）
```


二、延伸迁移题（缓存 / 设计类）
这类题需要「拆分需求 + 组合数据结构」，和频率栈「双结构拆分需求」的设计思路一致：
1. LRU 缓存（LeetCode 146. LRU 缓存）
链接：https://leetcode.cn/problems/lru-cache/

数组；逻辑
```js
class LRUCache {
  constructor(capacity) {
    this.queue = []; // 存储格式：[[key1, val1], [key2, val2]]，尾部=最近使用
    this.capacity = capacity;
    this.keyToIndex = new Map(); // key → 数组索引
  }

  get(key) {
    if (!this.keyToIndex.has(key)) return -1;

    // 修正1：访问后更新访问顺序（删除原位置 → 移到尾部）
    const index = this.keyToIndex.get(key);
    const [k, val] = this.queue.splice(index, 1)[0]; // 删除原位置元素
    this.queue.push([k, val]); // 移到尾部（最近使用）
    
    // 修正2：更新Map中的索引
    this._updateIndexMap();
    
    return val; // 修正3：返回val而非整个数组
  }

  put(key, val) {
    // 情况1：key已存在 → 更新值 + 移到尾部
    if (this.keyToIndex.has(key)) {
      const index = this.keyToIndex.get(key);
      this.queue.splice(index, 1); // 删除原位置
      this.queue.push([key, val]); // 移到尾部
      this._updateIndexMap(); // 更新索引
      return;
    }

    // 情况2：key不存在 → 检查容量
    if (this.queue.length >= this.capacity) {
      // 修正4：淘汰最久未使用（头部），并删除Map中的key
      const [delKey] = this.queue.shift();
      this.keyToIndex.delete(delKey);
    }

    // 插入新元素到尾部
    this.queue.push([key, val]);
    this._updateIndexMap();
  }

  /**
   * 辅助函数：更新keyToIndex映射（数组变化后同步）
   */
  _updateIndexMap() {
    this.keyToIndex.clear();
    for (let i = 0; i < this.queue.length; i++) {
      const [k] = this.queue[i];
      this.keyToIndex.set(k, i);
    }
  }
}
```

一、先看「数组 + Map」的核心痛点：「一动全动」
数组的索引是「物理位置」，和元素的「访问顺序」强绑定：
比如数组 [[1,1], [2,2], [3,3]]，keyToIndex 是 {1:0, 2:1, 3:2}；
当你访问 key=1（要移到尾部）：
先 splice(0,1) 删除原位置 → 数组变成 [[2,2], [3,3]]；
再 push([1,1]) → 数组变成 [[2,2], [3,3], [1,1]]；
此时 所有元素的索引都变了（2 从 1→0，3 从 2→1，1 从 0→2）；
必须「清空 + 重建」整个 keyToIndex → 这是 O (n) 的全量更新，大数据量直接卡爆。
简单说：数组的「索引」是硬绑定的，只要有一个元素移动，所有元素的索引都要变，keyToIndex 就必须全量重建 —— 这是数组的「天生缺陷」，无法规避。

换做链表

```js
/**
 * LeetCode 146. LRU 缓存 - 双向链表+Map最优版
 * 核心需求（LRU：最近最少使用淘汰）：
 * 1. get(key)：获取key对应值，若不存在返回-1；存在则将key移到「最近使用」位置；
 * 2. put(key, val)：
 *    - 若key存在：更新值，移到「最近使用」位置；
 *    - 若key不存在：插入新节点；若缓存满，删除「最久未使用」节点，再插入；
 * 核心设计（O(1) 操作）：
 * - 双向链表：维护访问顺序（头节点=最久未使用，尾节点=最近使用）；
 * - Map：key → 链表节点（实现O(1)查找节点）；
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyToNode = new Map(); // 键：缓存key，值：链表节点（{ key, val, prev, next }）
    
    // 双向链表哨兵节点（避免边界判断，简化代码）
    this.head = { prev: null, next: null }; // 头节点：最久未使用
    this.tail = { prev: null, next: null }; // 尾节点：最近使用
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 辅助函数：删除链表中的指定节点（O(1)）
   * @param {object} node 要删除的节点
   */
  _removeNode(node) {
    const prevNode = node.prev;
    const nextNode = node.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**
   * 辅助函数：将节点添加到链表尾部（最近使用位置，O(1)）
   * @param {object} node 要添加的节点
   */
  _addToTail(node) {
    const lastNode = this.tail.prev;
    lastNode.next = node;
    node.prev = lastNode;
    node.next = this.tail;
    this.tail.prev = node;
  }

  /**
   * 获取缓存值并更新访问顺序
   * @param {number} key 缓存key
   * @return {number} 缓存值（不存在返回-1）
   */
  get(key) {
    // 步骤1：判断key是否存在
    if (!this.keyToNode.has(key)) return -1;

    // 步骤2：存在则获取节点，更新访问顺序（删除节点 → 移到尾部）
    const node = this.keyToNode.get(key);
    this._removeNode(node);
    this._addToTail(node);

    // 步骤3：返回节点值
    return node.val;
  }

  /**
   * 插入/更新缓存，触发LRU淘汰
   * @param {number} key 缓存key
   * @param {number} val 缓存值
   */
  put(key, val) {
    // 情况1：key已存在 → 更新值 + 移到最近使用位置
    if (this.keyToNode.has(key)) {
      const node = this.keyToNode.get(key);
      node.val = val; // 更新值
      this._removeNode(node);
      this._addToTail(node);
      return; // 避免后续逻辑执行
    }

    // 情况2：key不存在 → 检查缓存容量
    // 2.1 缓存已满 → 删除最久未使用节点（头节点的下一个节点）
    if (this.keyToNode.size >= this.capacity) {
      const leastUsedNode = this.head.next; // 最久未使用节点
      this._removeNode(leastUsedNode); // 从链表删除
      this.keyToNode.delete(leastUsedNode.key); // 从Map删除
    }

    // 2.2 插入新节点（创建节点 → 加Map → 移到尾部）
    const newNode = { key, val, prev: null, next: null };
    this.keyToNode.set(key, newNode);
    this._addToTail(newNode);
  }
}

// ============== 测试用例验证 ==============
// const lruCache = new LRUCache(2);
// lruCache.put(1, 1); // 缓存：[1=1]
// lruCache.put(2, 2); // 缓存：[1=1, 2=2]
// console.log(lruCache.get(1));  // 输出1，缓存变为：[2=2, 1=1]
// lruCache.put(3, 3); // 缓存满，淘汰2，缓存变为：[1=1, 3=3]
// console.log(lruCache.get(2));  // 输出-1（已淘汰）
// lruCache.put(4, 4); // 缓存满，淘汰1，缓存变为：[3=3, 4=4]
// console.log(lruCache.get(1));  // 输出-1（已淘汰）
// console.log(lruCache.get(3));  // 输出3，缓存变为：[4=4, 3=3]
// console.log(lruCache.get(4));  // 输出4，缓存变为：[3=3, 4=4]
```

二、再看「双向链表 + Map」的核心优势：「一动只动局部」
链表的节点是「逻辑关联」（靠 prev/next 指针连接），和「物理位置」无关：
比如链表 head → 2 → 3 → 1 → tail，keyToNode 是 {1:节点1, 2:节点2, 3:节点3}；
当你访问 key=2（要移到尾部）：
找到节点 2，修改它的 prev 和 next 指针 → 断开和前后的连接（仅操作 2 个指针）；
把节点 2 接在 tail 前面 → 修改节点 2 和 tail.prev 的指针（仅操作 2 个指针）；
其他节点的指针完全不变，keyToNode 也无需任何修改（因为 Map 存的是「节点引用」，不是索引）；
全程只做「4 个指针的修改」→ O (1) 局部更新，无论数据量多大，成本都不变。

2. LFU 缓存（LeetCode 460. LFU 缓存）
链接：https://leetcode.cn/problems/lfu-cache/
