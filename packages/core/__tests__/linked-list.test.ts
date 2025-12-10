import { describe, it, expect, beforeEach } from 'vitest';
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
});
