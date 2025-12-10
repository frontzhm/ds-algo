# LeetCode 刷题指南

## 刷题模板

我们提供了通用的 LeetCode 解题模板，方便统一管理和测试。

### 使用模板

```typescript
import { leetcodeTemplate, boundaryCheck } from '@ds-algo/core';

function solution(...args: any[]) {
  // 你的解题代码
}

leetcodeTemplate(
  { id: 1, name: '题目名称', difficulty: 'easy' },
  solution,
  [/* 输入参数 */],
  /* 预期输出 */
);
```

## 题目分类

### Easy

- [1. 两数之和](/notes/leetcode#两数之和)

### Medium

### Hard

## 解题技巧

1. **理解题意**
   - 仔细阅读题目描述
   - 明确输入输出格式
   - 注意边界条件

2. **分析复杂度**
   - 时间复杂度
   - 空间复杂度

3. **编写代码**
   - 先写边界条件检查
   - 实现核心逻辑
   - 添加注释

4. **测试验证**
   - 使用提供的模板进行测试
   - 覆盖各种边界情况

## 示例：两数之和

```typescript
import { leetcodeTemplate, boundaryCheck } from '@ds-algo/core';

function twoSum(nums: number[], target: number): number[] {
  if (boundaryCheck.isEmpty(nums) || nums.length < 2) return [];

  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// 测试
leetcodeTemplate(
  { id: 1, name: '两数之和', difficulty: 'easy' },
  twoSum,
  [[2, 7, 11, 15], 9],
  [0, 1],
);
```

