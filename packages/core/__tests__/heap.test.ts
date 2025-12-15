import { describe, it, expect, beforeEach } from 'vitest';
import { MinHeap, MaxHeap } from '../src/data-structures/heap';

describe('MinHeap', () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空堆', () => {
      expect(heap.isEmpty()).toBe(true);
      expect(heap.size()).toBe(0);
    });

    it('应该能够插入元素', () => {
      heap.insert(5);
      expect(heap.size()).toBe(1);
      expect(heap.isEmpty()).toBe(false);
    });

    it('应该能够获取最小值', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      expect(heap.peek()).toBe(3);
    });

    it('应该能够弹出最小值', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      expect(heap.extractMin()).toBe(3);
      expect(heap.size()).toBe(2);
      expect(heap.peek()).toBe(5);
    });

    it('空堆 peek 应该返回 undefined', () => {
      expect(heap.peek()).toBeUndefined();
    });

    it('空堆 extractMin 应该返回 undefined', () => {
      expect(heap.extractMin()).toBeUndefined();
    });
  });

  describe('堆属性', () => {
    it('应该维护最小堆性质', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);
      heap.insert(9);
      // 每次弹出的应该是最小值
      expect(heap.extractMin()).toBe(1);
      expect(heap.extractMin()).toBe(3);
      expect(heap.extractMin()).toBe(5);
      expect(heap.extractMin()).toBe(7);
      expect(heap.extractMin()).toBe(9);
    });

    it('应该能够处理重复值', () => {
      heap.insert(3);
      heap.insert(3);
      heap.insert(3);
      expect(heap.size()).toBe(3);
      expect(heap.extractMin()).toBe(3);
      expect(heap.extractMin()).toBe(3);
      expect(heap.extractMin()).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量元素', () => {
      const count = 1000;
      for (let i = count; i >= 1; i--) {
        heap.insert(i);
      }
      expect(heap.size()).toBe(count);
      expect(heap.peek()).toBe(1);
    });

    it('应该能够清空堆', () => {
      heap.insert(5);
      heap.insert(3);
      heap.clear();
      expect(heap.isEmpty()).toBe(true);
      expect(heap.size()).toBe(0);
    });
  });

  describe('转换为数组', () => {
    it('应该能够转换为数组', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      const arr = heap.toArray();
      expect(arr.length).toBe(3);
      expect(arr).toContain(3);
      expect(arr).toContain(5);
      expect(arr).toContain(7);
    });
  });
});

describe('MaxHeap', () => {
  let heap: MaxHeap<number>;

  beforeEach(() => {
    heap = new MaxHeap<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空堆', () => {
      expect(heap.isEmpty()).toBe(true);
      expect(heap.size()).toBe(0);
    });

    it('应该能够插入元素', () => {
      heap.insert(5);
      expect(heap.size()).toBe(1);
    });

    it('应该能够获取最大值', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      expect(heap.peek()).toBe(7);
    });

    it('应该能够弹出最大值', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      expect(heap.extractMax()).toBe(7);
      expect(heap.size()).toBe(2);
      expect(heap.peek()).toBe(5);
    });

    it('空堆 peek 应该返回 undefined', () => {
      expect(heap.peek()).toBeUndefined();
    });

    it('空堆 extractMax 应该返回 undefined', () => {
      expect(heap.extractMax()).toBeUndefined();
    });
  });

  describe('堆属性', () => {
    it('应该维护最大堆性质', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);
      heap.insert(9);
      // 每次弹出的应该是最大值
      expect(heap.extractMax()).toBe(9);
      expect(heap.extractMax()).toBe(7);
      expect(heap.extractMax()).toBe(5);
      expect(heap.extractMax()).toBe(3);
      expect(heap.extractMax()).toBe(1);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量元素', () => {
      const count = 1000;
      for (let i = 1; i <= count; i++) {
        heap.insert(i);
      }
      expect(heap.size()).toBe(count);
      expect(heap.peek()).toBe(count);
    });
  });
});
