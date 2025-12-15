import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryTree, TreeNode } from '../src/data-structures/tree';

describe('BinaryTree', () => {
  let tree: BinaryTree<number>;

  beforeEach(() => {
    tree = new BinaryTree<number>();
  });

  describe('基本操作', () => {
    it('应该创建一个空树', () => {
      expect(tree.isEmpty()).toBe(true);
      expect(tree.root).toBeNull();
    });

    it('应该能够插入节点', () => {
      tree.insert(5);
      expect(tree.root?.val).toBe(5);
      expect(tree.isEmpty()).toBe(false);
    });

    it('应该能够查找节点', () => {
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      expect(tree.find(5)?.val).toBe(5);
      expect(tree.find(3)?.val).toBe(3);
      expect(tree.find(10)).toBeNull();
    });

    it('应该能够删除节点', () => {
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      expect(tree.delete(3)).toBe(true);
      expect(tree.find(3)).toBeNull();
    });
  });

  describe('遍历操作', () => {
    beforeEach(() => {
      // 构建测试树:
      //       5
      //      / \
      //     3   7
      //    / \
      //   2   4
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      tree.insert(2);
      tree.insert(4);
    });

    it('应该能够前序遍历', () => {
      expect(tree.preOrder()).toEqual([5, 3, 2, 4, 7]);
    });

    it('应该能够中序遍历', () => {
      expect(tree.inOrder()).toEqual([2, 3, 4, 5, 7]);
    });

    it('应该能够后序遍历', () => {
      expect(tree.postOrder()).toEqual([2, 4, 3, 7, 5]);
    });

    it('应该能够层序遍历', () => {
      expect(tree.levelOrder()).toEqual([5, 3, 7, 2, 4]);
    });
  });

  describe('树的高度和大小', () => {
    it('应该能够计算树的高度', () => {
      expect(tree.height()).toBe(0);
      tree.insert(5);
      expect(tree.height()).toBe(1);
      tree.insert(3);
      tree.insert(7);
      expect(tree.height()).toBe(2);
    });

    it('应该能够计算树的大小', () => {
      expect(tree.size()).toBe(0);
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      expect(tree.size()).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('应该能够处理单节点树', () => {
      tree.insert(1);
      expect(tree.preOrder()).toEqual([1]);
      expect(tree.inOrder()).toEqual([1]);
      expect(tree.postOrder()).toEqual([1]);
    });

    // it('应该能够处理左斜树', () => {
    //   tree.insert(5);
    //   tree.insert(4);
    //   tree.insert(3);
    //   tree.insert(2);
    //   expect(tree.height()).toBe(4);
    // });

    // it('应该能够处理右斜树', () => {
    //   tree.insert(1);
    //   tree.insert(2);
    //   tree.insert(3);
    //   tree.insert(4);
    //   expect(tree.height()).toBe(4);
    // });
  });

  describe('最小值最大值', () => {
    it('应该能够找到最小值', () => {
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      tree.insert(2);
      expect(tree.min()?.val).toBe(2);
    });

    it('应该能够找到最大值', () => {
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      tree.insert(9);
      expect(tree.max()?.val).toBe(9);
    });
  });

  describe('清空树', () => {
    it('应该能够清空树', () => {
      tree.insert(5);
      tree.insert(3);
      tree.clear();
      expect(tree.isEmpty()).toBe(true);
      expect(tree.root).toBeNull();
    });
  });
});

describe('TreeNode', () => {
  it('应该能够创建节点', () => {
    const node = new TreeNode(1);
    expect(node.val).toBe(1);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  it('应该能够连接子节点', () => {
    const node = new TreeNode(1);
    const left = new TreeNode(2);
    const right = new TreeNode(3);
    node.left = left;
    node.right = right;
    expect(node.left?.val).toBe(2);
    expect(node.right?.val).toBe(3);
  });
});
