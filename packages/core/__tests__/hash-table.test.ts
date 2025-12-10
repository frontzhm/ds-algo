import { describe, it, expect, beforeEach } from 'vitest';
import { HashTable } from '../src/data-structures/hash-table';

describe('HashTable', () => {
  let hashTable: HashTable<string, number>;

  beforeEach(() => {
    hashTable = new HashTable<string, number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空哈希表', () => {
      expect(hashTable.isEmpty()).toBe(true);
      expect(hashTable.size()).toBe(0);
    });

    it('应该能够设置和获取值', () => {
      hashTable.set('key1', 1);
      expect(hashTable.get('key1')).toBe(1);
      expect(hashTable.size()).toBe(1);
    });

    it('应该能够更新已存在的键', () => {
      hashTable.set('key1', 1);
      hashTable.set('key1', 2);
      expect(hashTable.get('key1')).toBe(2);
      expect(hashTable.size()).toBe(1);
    });

    it('应该能够删除键值对', () => {
      hashTable.set('key1', 1);
      expect(hashTable.delete('key1')).toBe(true);
      expect(hashTable.get('key1')).toBeUndefined();
      expect(hashTable.size()).toBe(0);
    });

    it('删除不存在的键应该返回 false', () => {
      expect(hashTable.delete('nonexistent')).toBe(false);
    });

    it('应该能够检查键是否存在', () => {
      hashTable.set('key1', 1);
      expect(hashTable.has('key1')).toBe(true);
      expect(hashTable.has('key2')).toBe(false);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量键值对', () => {
      const count = 1000;
      for (let i = 0; i < count; i++) {
        hashTable.set(`key${i}`, i);
      }
      expect(hashTable.size()).toBe(count);
      expect(hashTable.get('key500')).toBe(500);
    });

    it('应该能够清空哈希表', () => {
      hashTable.set('key1', 1);
      hashTable.set('key2', 2);
      hashTable.clear();
      expect(hashTable.isEmpty()).toBe(true);
      expect(hashTable.size()).toBe(0);
    });

    it('应该能够处理空字符串键', () => {
      hashTable.set('', 0);
      expect(hashTable.get('')).toBe(0);
    });
  });

  describe('获取所有键和值', () => {
    it('应该能够获取所有键', () => {
      hashTable.set('key1', 1);
      hashTable.set('key2', 2);
      hashTable.set('key3', 3);
      const keys = hashTable.keys();
      expect(keys.length).toBe(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('应该能够获取所有值', () => {
      hashTable.set('key1', 1);
      hashTable.set('key2', 2);
      hashTable.set('key3', 3);
      const values = hashTable.values();
      expect(values.length).toBe(3);
      expect(values).toContain(1);
      expect(values).toContain(2);
      expect(values).toContain(3);
    });

    it('应该能够获取所有键值对', () => {
      hashTable.set('key1', 1);
      hashTable.set('key2', 2);
      const entries = hashTable.entries();
      expect(entries.length).toBe(2);
      expect(entries.some(([k, v]) => k === 'key1' && v === 1)).toBe(true);
      expect(entries.some(([k, v]) => k === 'key2' && v === 2)).toBe(true);
    });
  });

  describe('泛型支持', () => {
    it('应该支持数字键', () => {
      const numHashTable = new HashTable<number, string>();
      numHashTable.set(1, 'one');
      expect(numHashTable.get(1)).toBe('one');
    });

    it('应该支持对象值', () => {
      const objHashTable = new HashTable<string, { name: string }>();
      objHashTable.set('user', { name: 'test' });
      expect(objHashTable.get('user')?.name).toBe('test');
    });
  });
});
