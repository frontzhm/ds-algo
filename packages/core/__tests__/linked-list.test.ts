import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LinkedList, ListNode } from '../src/data-structures/linked-list';

describe('LinkedList', () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空链表', () => {
      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
      expect(list.head).toBeNull();
    });

    it('应该能够在头部添加元素', () => {
      list.prepend(1);
      expect(list.size()).toBe(1);
      expect(list.head?.val).toBe(1);
    });

    it('应该能够在尾部添加元素', () => {
      list.append(1);
      expect(list.size()).toBe(1);
      expect(list.head?.val).toBe(1);
      list.append(2);
      expect(list.size()).toBe(2);
    });

    it('应该能够删除指定值的节点', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.delete(2)).toBe(true);
      expect(list.size()).toBe(2);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it('应该能够查找节点', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.find(2)?.val).toBe(2);
      expect(list.find(4)).toBeNull();
    });
  });

  describe('插入操作', () => {
    it('应该在指定位置插入元素', () => {
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('应该在头部插入', () => {
      list.append(2);
      list.insertAt(0, 1);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('应该在尾部插入', () => {
      list.append(1);
      list.insertAt(1, 2);
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe('删除操作', () => {
    it('应该能够删除头部节点', () => {
      list.append(1);
      list.append(2);
      list.deleteAt(0);
      expect(list.toArray()).toEqual([2]);
    });

    it('应该能够删除尾部节点', () => {
      list.append(1);
      list.append(2);
      list.deleteAt(1);
      expect(list.toArray()).toEqual([1]);
    });

    it('应该能够删除中间节点', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteAt(1);
      expect(list.toArray()).toEqual([1, 3]);
    });
  });

  describe('反转操作', () => {
    it('应该能够反转链表', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });

    it('空链表反转应该保持不变', () => {
      list.reverse();
      expect(list.isEmpty()).toBe(true);
    });

    it('单节点链表反转应该保持不变', () => {
      list.append(1);
      list.reverse();
      expect(list.toArray()).toEqual([1]);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量元素', () => {
      const count = 1000;
      for (let i = 0; i < count; i++) {
        list.append(i);
      }
      expect(list.size()).toBe(count);
    });

    it('应该能够清空链表', () => {
      list.append(1);
      list.append(2);
      list.clear();
      expect(list.isEmpty()).toBe(true);
      expect(list.head).toBeNull();
    });
  });

  describe('转换为数组', () => {
    it('应该能够转换为数组', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('空链表应该返回空数组', () => {
      expect(list.toArray()).toEqual([]);
    });
  });

  describe('泛型支持', () => {
    it('应该支持字符串类型', () => {
      const stringList = new LinkedList<string>();
      stringList.append('hello');
      stringList.append('world');
      expect(stringList.toArray()).toEqual(['hello', 'world']);
    });

    it('应该支持对象类型', () => {
      const objList = new LinkedList<{ name: string; age: number }>();
      const alice = { name: 'Alice', age: 20 };
      const bob = { name: 'Bob', age: 25 };
      objList.append(alice);
      objList.append(bob);
      expect(objList.size()).toBe(2);
      // find 使用 === 比较，所以需要相同的引用
      expect(objList.find(alice)?.val.name).toBe('Alice');
      expect(objList.find(bob)?.val.age).toBe(25);
    });
  });

  describe('空值校验', () => {
    it('应该拒绝 undefined 值', () => {
      expect(() => list.append(undefined as any)).toThrow('值不能为undefined或null');
      expect(() => list.prepend(undefined as any)).toThrow('值不能为undefined或null');
      expect(() => list.insertAt(0, undefined as any)).toThrow('值不能为undefined或null');
    });

    it('应该拒绝 null 值', () => {
      expect(() => list.append(null as any)).toThrow('值不能为undefined或null');
      expect(() => list.prepend(null as any)).toThrow('值不能为undefined或null');
      expect(() => list.insertAt(0, null as any)).toThrow('值不能为undefined或null');
    });

    it('查找时应该拒绝空值', () => {
      list.append(1);
      expect(() => list.find(undefined as any)).toThrow('值不能为undefined或null');
      expect(() => list.find(null as any)).toThrow('值不能为undefined或null');
    });

    it('删除时应该拒绝空值', () => {
      list.append(1);
      expect(() => list.delete(undefined as any)).toThrow('值不能为undefined或null');
      expect(() => list.delete(null as any)).toThrow('值不能为undefined或null');
    });
  });

  describe('性能优化 - O(1) size', () => {
    it('size 应该是 O(1) 时间复杂度', () => {
      const count = 10000;
      for (let i = 0; i < count; i++) {
        list.append(i);
      }
      // 多次调用 size，应该都是 O(1)
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        list.size();
      }
      const end = performance.now();
      // 如果 size 是 O(n)，1000 次调用会非常慢
      expect(end - start).toBeLessThan(100); // 应该在 100ms 内完成
      expect(list.size()).toBe(count);
    });
  });

  describe('尾指针优化', () => {
    it('append 应该是 O(1) 时间复杂度', () => {
      const count = 10000;
      const start = performance.now();
      for (let i = 0; i < count; i++) {
        list.append(i);
      }
      const end = performance.now();
      // 如果 append 是 O(n)，会非常慢
      expect(end - start).toBeLessThan(100); // 应该在 100ms 内完成
      expect(list.size()).toBe(count);
      expect(list.toArray()[count - 1]).toBe(count - 1);
    });

    it('删除尾节点后应该更新尾指针', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.deleteAt(2); // 删除尾节点
      expect(list.toArray()).toEqual([1, 2]);
      list.append(4);
      expect(list.toArray()).toEqual([1, 2, 4]);
    });

    it('删除尾节点值后应该更新尾指针', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.delete(3); // 删除尾节点
      expect(list.toArray()).toEqual([1, 2]);
      list.append(4);
      expect(list.toArray()).toEqual([1, 2, 4]);
    });
  });

  describe('索引校验', () => {
    it('应该拒绝负数索引', () => {
      list.append(1);
      list.insertAt(-1, 0);
      expect(list.size()).toBe(1); // 没有插入
      expect(list.deleteAt(-1)).toBe(false);
    });

    it('应该拒绝超出范围的索引', () => {
      list.append(1);
      list.insertAt(100, 2);
      expect(list.size()).toBe(1); // 没有插入
      expect(list.deleteAt(100)).toBe(false);
    });

    it('应该允许在 size 位置插入（尾部插入）', () => {
      list.append(1);
      list.append(2);
      list.insertAt(2, 3); // 在 size 位置插入
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('迭代器支持', () => {
    it('应该支持 for...of 遍历', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      const result: number[] = [];
      for (const val of list) {
        result.push(val);
      }
      expect(result).toEqual([1, 2, 3]);
    });

    it('空链表应该不产生任何迭代', () => {
      const result: number[] = [];
      for (const val of list) {
        result.push(val);
      }
      expect(result).toEqual([]);
    });

    it('应该支持扩展运算符', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect([...list]).toEqual([1, 2, 3]);
    });

    it('应该支持 Array.from', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(Array.from(list)).toEqual([1, 2, 3]);
    });
  });

  describe('静态方法 fromArray', () => {
    it('应该从数组构建链表', () => {
      const arr = [1, 2, 3, 4, 5];
      const newList = LinkedList.fromArray(arr);
      expect(newList.toArray()).toEqual([1, 2, 3, 4, 5]);
      expect(newList.size()).toBe(5);
    });

    it('应该自动过滤 undefined 和 null', () => {
      const arr = [1, undefined, 2, null, 3];
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const newList = LinkedList.fromArray(arr);
      expect(newList.toArray()).toEqual([1, 2, 3]);
      expect(newList.size()).toBe(3);
      expect(consoleSpy).toHaveBeenCalledTimes(2); // 应该警告两次
      consoleSpy.mockRestore();
    });

    it('空数组应该返回空链表', () => {
      const newList = LinkedList.fromArray([]);
      expect(newList.isEmpty()).toBe(true);
      expect(newList.size()).toBe(0);
    });

    it('非数组输入应该返回空链表', () => {
      const newList = LinkedList.fromArray(null as any);
      expect(newList.isEmpty()).toBe(true);
    });

    it('应该支持字符串数组', () => {
      const arr = ['hello', 'world', 'test'];
      const newList = LinkedList.fromArray(arr);
      expect(newList.toArray()).toEqual(['hello', 'world', 'test']);
    });
  });

  describe('可视化打印', () => {
    it('应该正确打印非空链表', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      list.print();
      expect(consoleSpy).toHaveBeenCalledWith('1 → 2 → 3 → null');
      consoleSpy.mockRestore();
    });

    it('应该正确打印空链表', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      list.print();
      expect(consoleSpy).toHaveBeenCalledWith('null');
      consoleSpy.mockRestore();
    });

    it('应该正确打印单节点链表', () => {
      list.append(42);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      list.print();
      expect(consoleSpy).toHaveBeenCalledWith('42 → null');
      consoleSpy.mockRestore();
    });
  });

  describe('边界情况增强', () => {
    it('删除头节点后应该正确更新状态', () => {
      list.append(1);
      list.append(2);
      list.deleteAt(0);
      expect(list.size()).toBe(1);
      expect(list.head?.val).toBe(2);
      expect(list.toArray()).toEqual([2]);
    });

    it('删除头节点值后应该正确更新状态', () => {
      list.append(1);
      list.append(2);
      list.delete(1);
      expect(list.size()).toBe(1);
      expect(list.head?.val).toBe(2);
      expect(list.toArray()).toEqual([2]);
    });

    it('清空链表后所有操作应该正常', () => {
      list.append(1);
      list.append(2);
      list.clear();
      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
      expect(list.head).toBeNull();
      list.append(3);
      expect(list.size()).toBe(1);
      expect(list.head?.val).toBe(3);
    });

    it('反转后应该正确更新头尾指针', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
      // 反转后可以继续添加
      list.append(4);
      expect(list.toArray()).toEqual([3, 2, 1, 4]);
    });
  });

  describe('复杂操作组合', () => {
    it('应该支持复杂的插入删除组合', () => {
      list.append(1);
      list.prepend(0);
      list.insertAt(2, 2);
      list.append(3);
      expect(list.toArray()).toEqual([0, 1, 2, 3]);
      list.delete(2);
      list.deleteAt(0);
      expect(list.toArray()).toEqual([1, 3]);
      list.reverse();
      expect(list.toArray()).toEqual([3, 1]);
    });

    it('应该支持大量连续操作', () => {
      for (let i = 0; i < 100; i++) {
        list.append(i);
      }
      expect(list.size()).toBe(100);
      for (let i = 0; i < 50; i++) {
        list.deleteAt(0);
      }
      expect(list.size()).toBe(50);
      expect(list.toArray()[0]).toBe(50);
    });
  });
});

describe('ListNode', () => {
  it('应该能够创建节点', () => {
    const node = new ListNode(1);
    expect(node.val).toBe(1);
    expect(node.next).toBeNull();
  });

  it('应该能够连接节点', () => {
    const node1 = new ListNode(1);
    const node2 = new ListNode(2);
    node1.next = node2;
    expect(node1.next?.val).toBe(2);
  });

  it('应该拒绝 undefined 值', () => {
    expect(() => new ListNode(undefined as any)).toThrow('节点值不能为undefined或null');
  });

  it('应该拒绝 null 值', () => {
    expect(() => new ListNode(null as any)).toThrow('节点值不能为undefined或null');
  });

  it('应该支持在构造函数中设置 next', () => {
    const node2 = new ListNode(2);
    const node1 = new ListNode(1, node2);
    expect(node1.val).toBe(1);
    expect(node1.next?.val).toBe(2);
  });

  it('应该支持字符串值', () => {
    const node = new ListNode('hello');
    expect(node.val).toBe('hello');
  });

  it('应该支持对象值', () => {
    const obj = { name: 'test', age: 20 };
    const node = new ListNode(obj);
    expect(node.val).toEqual(obj);
  });
});
