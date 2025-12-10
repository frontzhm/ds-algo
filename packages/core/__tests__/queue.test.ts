import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from '../src/data-structures/stack-queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空队列', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('应该能够入队元素', () => {
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      expect(queue.isEmpty()).toBe(false);
    });

    it('应该能够出队元素', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.dequeue()).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.isEmpty()).toBe(true);
    });

    it('应该能够查看队首元素而不移除', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.front()).toBe(1);
      expect(queue.size()).toBe(2);
    });

    it('空队列出队应该返回 undefined', () => {
      expect(queue.dequeue()).toBeUndefined();
    });

    it('空队列查看应该返回 undefined', () => {
      expect(queue.front()).toBeUndefined();
    });
  });

  describe('FIFO 特性', () => {
    it('应该遵循先进先出原则', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量元素', () => {
      const count = 1000;
      for (let i = 0; i < count; i++) {
        queue.enqueue(i);
      }
      expect(queue.size()).toBe(count);
      expect(queue.dequeue()).toBe(0);
    });

    it('应该能够清空队列', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });
  });

  describe('泛型支持', () => {
    it('应该支持字符串类型', () => {
      const stringQueue = new Queue<string>();
      stringQueue.enqueue('hello');
      stringQueue.enqueue('world');
      expect(stringQueue.dequeue()).toBe('hello');
    });

    it('应该支持对象类型', () => {
      const objQueue = new Queue<{ name: string }>();
      objQueue.enqueue({ name: 'test' });
      expect(objQueue.dequeue()?.name).toBe('test');
    });
  });

  describe('转换为数组', () => {
    it('应该能够转换为数组', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('空队列应该返回空数组', () => {
      expect(queue.toArray()).toEqual([]);
    });
  });
});
