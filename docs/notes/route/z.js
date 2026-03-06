/**
 * LFU缓存节点类 - 存储缓存的键、值、访问频率
 * @class Node
 * @param {any} key - 缓存键（淘汰时需通过key删除哈希表映射）
 * @param {any} val - 缓存值
 * @property {number} freq - 访问频率（初始值为1，每次访问+1）
 */
class Node {
  constructor(key, val) {
    this.key = key; // 缓存键：核心作用是关联哈希表，淘汰时删除映射
    this.val = val; // 缓存值：实际存储的业务数据
    this.freq = 1; // 访问频率：初始为1，get/put（更新）操作都会触发+1
  }
}

/**
 * LFU缓存实现类（Least Frequently Used - 最少使用淘汰策略）
 * 核心设计：双哈希表 + O(1) 维护最小频率
 *  - keyToNode: key → Node 映射（O(1) 查找节点）
 *  - freqToKeySet: freq → Set(key) 映射（O(1) 按频率分组管理key）
 * @class LFUCache
 * @param {number} capacity - 缓存最大容量（必须>0）
 */
class LFUCache {
  /**
   * 初始化LFU缓存
   * @param {number} capacity - 缓存最大容量
   */
  constructor(capacity) {
    this.capacity = capacity; // 缓存最大容量（边界：需保证>0，可加校验）
    this.keyToNode = new Map(); // 哈希表1：key → Node（O(1) 获取节点）
    this.freqToKeySet = new Map(); // 哈希表2：频率 → 同频率key的Set集合（O(1) 增删key）
    this.minFreq = 1; // 最小访问频率：初始为1（新增节点频率必为1）
  }

  /**
   * 语义化核心方法：刷新指定key的缓存（可选更新值 + 频率+1）
   * @param {any} key - 缓存键
   * @param {any} [val] - 可选：要更新的缓存值（不传则仅更新频率）
   * @description 核心逻辑：更新值 → 频率+1 → 从旧频率Set移除 → 加入新频率Set → 维护minFreq
   */
  refresh(key, val) {
    // 1. 获取节点（调用前已确保key存在，无需判空）
    const node = this.keyToNode.get(key);

    // 2. 可选更新缓存值（put操作更新值时触发）
    if (val !== undefined) {
      node.val = val;
    }

    // 3. 频率更新：记录旧频率，新频率=旧频率+1，更新节点自身频率
    const oldFreq = node.freq;
    const newFreq = oldFreq + 1;
    node.freq = newFreq; // 核心：必须更新节点的freq，否则频率永远为1

    // 4. 从旧频率的Set中移除当前key
    const keySet = this.freqToKeySet.get(oldFreq);
    keySet.delete(key); // Set.delete(key) 是O(1)操作

    // 5. 若旧频率的Set为空，删除该频率映射，并维护minFreq
    if (keySet.size === 0) {
      this.freqToKeySet.delete(oldFreq);
      // 关键：如果删除的是当前最小频率 → 直接+1（O(1) 维护，无需遍历）
      if (this.minFreq === oldFreq) {
        this.minFreq++;
      }
    }

    // 6. 将key添加到新频率的Set中（不存在则新建Set）
    if (!this.freqToKeySet.has(newFreq)) {
      this.freqToKeySet.set(newFreq, new Set());
    }
    this.freqToKeySet.get(newFreq).add(key); // Set.add(key) 是O(1)操作
  }

  /**
   * 语义化核心方法：淘汰最少使用的节点（频率最低 → 同频率最先加入的key）
   * @description 核心逻辑：取minFreq的Set第一个key → 删除key → 同步删除哈希表映射
   * 注意：evict仅在put新节点且容量满时触发，后续addNew会重置minFreq=1
   */
  evict() {
    // 1. 获取最小频率对应的key集合（调用前已确保存在，无需判空）
    const keySet = this.freqToKeySet.get(this.minFreq);

    // 2. 取Set中第一个key（Set按插入顺序存储，第一个=同频率最久未用）
    const firstKey = keySet.values().next().value;

    // 3. 从Set中删除该key
    keySet.delete(firstKey);

    // 4. 若Set为空，删除该频率映射（无需找新minFreq，addNew会重置）
    if (keySet.size === 0) {
      this.freqToKeySet.delete(this.minFreq);
    }

    // 5. 同步从keyToNode中删除该节点（O(1)操作）
    this.keyToNode.delete(firstKey);
  }

  /**
   * 语义化核心方法：新增缓存节点（频率初始化为1）
   * @param {any} key - 缓存键
   * @param {any} val - 缓存值
   * @description 核心逻辑：新建节点 → 加入keyToNode → 加入freq=1的Set → 重置minFreq=1
   */
  addNew(key, val) {
    // 1. 新建节点（频率默认1）
    const newNode = new Node(key, val);

    // 2. 加入keyToNode哈希表（O(1)操作）
    this.keyToNode.set(key, newNode);

    // 3. 加入freq=1的Set（不存在则新建）
    if (!this.freqToKeySet.has(1)) {
      this.freqToKeySet.set(1, new Set());
    }

    // 4. 强制重置minFreq=1（新增节点频率为1，必然是最小频率）
    this.minFreq = 1;
    this.freqToKeySet.get(1).add(key);
  }

  /**
   * 对外暴露方法：根据key获取缓存值
   * @param {any} key - 缓存键
   * @returns {any} 存在返回值，不存在返回-1
   * @description 核心逻辑：判空 → 刷新频率 → 返回值
   */
  get(key) {
    // 1. key不存在 → 返回-1（LFU缓存标准行为）
    if (!this.keyToNode.has(key)) {
      return -1;
    }

    // 2. 刷新节点频率（仅更新频率，不传val）
    this.refresh(key);

    // 3. 返回更新后的缓存值
    return this.keyToNode.get(key).val;
  }

  /**
   * 对外暴露方法：新增/更新缓存
   * @param {any} key - 缓存键
   * @param {any} val - 缓存值
   * @description 核心逻辑：
   *  1. key存在 → 更新值+刷新频率
   *  2. key不存在 → 容量满则淘汰 → 新增节点
   */
  put(key, val) {
    // 边界：容量为0时直接返回（避免无意义操作）
    if (this.capacity === 0) return;

    // 1. key已存在 → 更新值并刷新频率
    const hasNode = this.keyToNode.has(key);
    if (hasNode) {
      this.refresh(key, val); // 传val：更新值+频率
      return;
    }

    // 2. key不存在 → 先判断容量是否已满
    if (this.keyToNode.size === this.capacity) {
      this.evict(); // 容量满 → 淘汰最少使用节点
    }

    // 3. 新增节点（频率初始化为1）
    this.addNew(key, val);
  }
}

// ------------------------------ 高频易错点总结 ------------------------------
/**
 * LFUCache实现高频易错点（基于本次实现过程+面试考点）
 * 1. 节点频率更新遗漏：
 *    - 错误：refresh中只计算newFreq，但未执行node.freq = newFreq
 *    - 后果：节点频率永远为1，minFreq无法正确维护
 *
 * 2. minFreq维护方式错误：
 *    - 错误：evict后遍历所有频率找新minFreq（O(n)）
 *    - 优化：利用"evict仅在put新节点时触发"的特性，addNew直接重置minFreq=1；refresh中旧频率为空时minFreq++
 *
 * 3. Set操作语法错误：
 *    - 错误：使用Map/Set的remove方法（如this.keyToNode.remove(key)）
 *    - 正确：JS中Map/Set删除用delete方法（this.keyToNode.delete(key)）
 *
 * 4. 可选参数判断错误：
 *    - 错误：用if (val)判断是否传值（val为0/false时误判）
 *    - 正确：用val !== undefined判断（覆盖所有值类型）
 *
 * 5. 初始值设置错误：
 *    - 错误：minFreq初始化为Infinity
 *    - 正确：初始化为1（新增节点频率必为1，语义更合理）
 *
 * 6. 新增节点时Set逻辑错误：
 *    - 错误：直接this.freqToKeySet.set(1, new Set([key]))（覆盖原有Set）
 *    - 正确：先判断Set是否存在，存在则add，不存在则新建
 *
 * 7. 边界场景遗漏：
 *    - 遗漏：capacity=0时的处理（put操作会无意义执行evict）
 *    - 补充：put方法开头加if (this.capacity === 0) return
 */

// ------------------------------ 测试用例（验证所有核心逻辑） ------------------------------
function testLFU() {
  const lfu = new LFUCache(2);
  // 1. 新增2个节点（freq=1，minFreq=1）
  lfu.put('a', 1);
  lfu.put('b', 2);
  console.log('get(a):', lfu.get('a')); // 1 → a.freq=2，minFreq=1
  // 2. 新增c → 淘汰b（minFreq=1），addNew重置minFreq=1
  lfu.put('c', 3);
  console.log('get(b):', lfu.get('b')); // -1（已淘汰）
  console.log('get(c):', lfu.get('c')); // 3 → c.freq=2，minFreq=1
  // 3. 新增d → 淘汰a（minFreq=1），addNew重置minFreq=1
  lfu.put('d', 4);
  console.log('get(a):', lfu.get('a')); // -1（已淘汰）
  console.log('get(d):', lfu.get('d')); // 4 → d.freq=2，minFreq=1
  // 4. 极端场景：多次访问d，验证minFreq精准更新
  lfu.get('d');
  console.log('多次访问d后minFreq:', lfu.minFreq); // 2 → 旧freq=2的Set为空，minFreq++
}
testLFU();
