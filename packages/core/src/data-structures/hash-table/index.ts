/**
 * 哈希表（优化版：鲁棒性+前端场景适配+扩展能力）
 * 基于原生Map封装，补充前端高频功能，强化类型和容错性
 */
export class HashTable<K, V> {
  private readonly map: Map<K, V>;
  // 可选：缓存遍历结果（高频遍历场景优化）
  private cache: {
    keys?: K[];
    values?: V[];
    entries?: Array<[K, V]>;
  } = {};

  constructor(initialData?: Array<[K, V]>) {
    this.map = new Map<K, V>();
    // 初始化：支持传入初始键值对数组
    if (initialData) {
      this.batchSet(initialData);
    }
  }

  /**
   * 私有方法：通用入参校验
   * @param key 键（禁止undefined/null）
   * @param value 值（可选校验，默认允许空值）
   * @param checkValue 是否校验值的空值
   */
  private validateParams(key: K, value?: V, checkValue: boolean = false): void {
    // 键不能为空（undefined/null）
    if (key === undefined || key === null) {
      throw new Error(`哈希表的键不能为undefined或null，当前键：${key}`);
    }
    // 可选：校验值不能为空
    if (checkValue && (value === undefined || value === null)) {
      throw new Error(`哈希表的值不能为undefined或null，当前值：${value}`);
    }
  }

  /**
   * 私有方法：清空缓存（增删操作时触发）
   */
  private clearCache(): void {
    this.cache = {};
  }

  /**
   * 设置键值对（强化鲁棒性）
   * @param key 键（非undefined/null）
   * @param value 值（默认允许空值）
   * @param checkValue 是否校验值的空值
   */
  set(key: K, value: V, checkValue: boolean = false): void {
    this.validateParams(key, value, checkValue);
    this.map.set(key, value);
    this.clearCache(); // 增删操作清空缓存
  }

  /**
   * 批量设置键值对（前端高频：接口数据批量入库）
   * @param data 键值对数组
   * @param checkValue 是否校验值的空值
   */
  batchSet(data: Array<[K, V]>, checkValue: boolean = false): void {
    if (!Array.isArray(data)) {
      console.warn('批量设置失败：输入不是数组，当前输入：', data);
      return;
    }
    data.forEach(([key, value]) => {
      try {
        this.set(key, value, checkValue);
      } catch (e) {
        console.warn(`批量设置跳过异常项 [${String(key)}, ${String(value)}]：`, e);
      }
    });
  }

  /**
   * 获取值（明确返回类型，补充默认值参数）
   * @param key 键
   * @param defaultValue 未找到时的默认值（默认undefined）
   */
  get(key: K, defaultValue?: V): V | undefined {
    this.validateParams(key);
    return this.map.get(key) ?? defaultValue;
  }

  /**
   * 删除键值对（返回操作结果）
   * @param key 键
   */
  delete(key: K): boolean {
    this.validateParams(key);
    const isDeleted = this.map.delete(key);
    if (isDeleted) {
      this.clearCache();
    }
    return isDeleted;
  }

  /**
   * 批量删除键值对（前端高频：批量清理）
   * @param keys 键数组
   * @returns 删除成功的数量
   */
  batchDelete(keys: K[]): number {
    if (!Array.isArray(keys)) {
      console.warn('批量删除失败：输入不是数组，当前输入：', keys);
      return 0;
    }
    let deleteCount = 0;
    keys.forEach(key => {
      try {
        if (this.delete(key)) {
          deleteCount++;
        }
      } catch (e) {
        console.warn(`批量删除跳过异常键 ${String(key)}：`, e);
      }
    });
    return deleteCount;
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  has(key: K): boolean {
    this.validateParams(key);
    return this.map.has(key);
  }

  /**
   * 检查哈希表是否为空
   */
  isEmpty(): boolean {
    return this.map.size === 0;
  }

  /**
   * 获取哈希表大小
   */
  size(): number {
    return this.map.size;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    this.map.clear();
    this.clearCache();
  }

  /**
   * 获取所有键（缓存优化，高频遍历场景性能提升）
   */
  keys(): K[] {
    if (!this.cache.keys) {
      this.cache.keys = Array.from(this.map.keys());
    }
    return [...this.cache.keys]; // 返回副本，避免外部修改缓存
  }

  /**
   * 获取所有值（缓存优化）
   */
  values(): V[] {
    if (!this.cache.values) {
      this.cache.values = Array.from(this.map.values());
    }
    return [...this.cache.values];
  }

  /**
   * 获取所有键值对（缓存优化）
   */
  entries(): Array<[K, V]> {
    if (!this.cache.entries) {
      this.cache.entries = Array.from(this.map.entries());
    }
    return [...this.cache.entries];
  }

  /**
   * 扩展：迭代器支持（和原生Map/数组一致，支持for...of）
   * yield* 是 “遍历后逐个产出”，yield 是 “直接产出整个对象”。
   * 迭代器核心好处：
      统一遍历体验：一套语法遍历所有可迭代对象；
      解耦遍历逻辑：数据结构和遍历规则分离，易维护；
      惰性计算：按需生成数据，节省内存；
      灵活控制：支持中断遍历，比 forEach 更灵活；
      语法糖适配：解构、扩展运算符无缝使用；
   */
  *[Symbol.iterator](): Generator<[K, V], void, void> {
    yield* this.map.entries();
  }

  /**
   * 扩展：转换为JSON对象（前端数据序列化）
   * 注意：仅支持键为字符串/数字的场景
   */
  toJSON(): Record<string, V> {
    const json: Record<string, V> = {};
    this.map.forEach((value, key) => {
      if (typeof key === 'string' || typeof key === 'number') {
        json[String(key)] = value;
      } else {
        console.warn(`键 ${String(key)} 不是字符串/数字，跳过JSON序列化`);
      }
    });
    return json;
  }

  /**
   * 扩展：模拟哈希冲突统计（理解哈希表底层，面试/调试用）
   * 基于键的toString结果计算哈希值，统计冲突次数
   */
  getHashConflictStats(): Record<string, number> {
    const hashMap: Record<string, number> = {};
    this.map.forEach((_, key) => {
      // 简单哈希算法：取键的字符串长度（仅演示）
      const hash = String(key).length.toString();
      hashMap[hash] = (hashMap[hash] || 0) + 1;
    });
    // 过滤无冲突的哈希值
    return Object.fromEntries(Object.entries(hashMap).filter(([_, count]) => count > 1));
  }

  /**
   * 扩展：按值查找键（前端高频：反向查找）
   * @param value 要查找的值
   * @returns 第一个匹配的键（无则返回undefined）
   */
  findKeyByValue(value: V): K | undefined {
    for (const [key, val] of this.map.entries()) {
      if (Object.is(val, value)) {
        return key;
      }
    }
    return undefined;
  }
}
