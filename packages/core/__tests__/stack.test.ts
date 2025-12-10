import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from '../src/data-structures/stack-queue';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空栈', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    it('应该能够推入元素', () => {
      stack.push(1);
      expect(stack.size()).toBe(1);
      expect(stack.isEmpty()).toBe(false);
    });

    it('应该能够弹出元素', () => {
      stack.push(1);
      stack.push(2);
      expect(stack.pop()).toBe(2);
      expect(stack.size()).toBe(1);
      expect(stack.pop()).toBe(1);
      expect(stack.isEmpty()).toBe(true);
    });

    it('应该能够查看栈顶元素而不移除', () => {
      stack.push(1);
      stack.push(2);
      expect(stack.peek()).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('空栈弹出应该返回 undefined', () => {
      expect(stack.pop()).toBeUndefined();
    });

    it('空栈查看应该返回 undefined', () => {
      expect(stack.peek()).toBeUndefined();
    });
  });

  describe('LIFO 特性', () => {
    it('应该遵循后进先出原则', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理大量元素', () => {
      const count = 1000;
      for (let i = 0; i < count; i++) {
        stack.push(i);
      }
      expect(stack.size()).toBe(count);
      expect(stack.pop()).toBe(count - 1);
    });

    it('应该能够清空栈', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.clear();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });
  });

  describe('泛型支持', () => {
    it('应该支持字符串类型', () => {
      const stringStack = new Stack<string>();
      stringStack.push('hello');
      stringStack.push('world');
      expect(stringStack.pop()).toBe('world');
    });

    it('应该支持对象类型', () => {
      const objStack = new Stack<{ name: string }>();
      objStack.push({ name: 'test' });
      expect(objStack.pop()?.name).toBe('test');
    });
  });

  describe('转换为数组', () => {
    it('应该能够转换为数组', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.toArray()).toEqual([1, 2, 3]);
    });

    it('空栈应该返回空数组', () => {
      expect(stack.toArray()).toEqual([]);
    });
  });
});
