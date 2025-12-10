// 哈希表数据结构实现

/**
 * 哈希表（HashTable）
 */
export class HashTable<K, V> {
  private obj: Map<K, V>;
  constructor() {
    this.obj = new Map<K, V>();
  }
  /**
   * 设置键值对
   */
  set(key: K, value: V): void {
    this.obj.set(key, value);
  }

  /**
   * 获取值
   */
  get(key: K): V | undefined {
    return this.obj.get(key);
  }

  /**
   * 删除键值对
   */
  delete(key: K): boolean {
    return this.obj.delete(key);
  }

  /**
   * 检查键是否存在
   */
  has(key: K): boolean {
    return this.obj.has(key);
  }

  /**
   * 检查哈希表是否为空
   */
  isEmpty(): boolean {
    return this.obj.size === 0;
  }

  /**
   * 获取哈希表的大小
   */
  size(): number {
    return this.obj.size;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    this.obj.clear();
  }

  /**
   * 获取所有键
   */
  keys(): K[] {
    return Array.from(this.obj.keys());
  }

  /**
   * 获取所有值
   */
  values(): V[] {
    return Array.from(this.obj.values());
  }

  /**
   * 获取所有键值对
   */
  entries(): Array<[K, V]> {
    return Array.from(this.obj.entries());
  }
}
