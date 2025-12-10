import { leetcodeTemplate, boundaryCheck } from '../template';

/**
 * 1. 两数之和（Easy）
 * @param nums 数组
 * @param target 目标值
 * @returns 满足条件的下标
 */
function twoSum(nums: number[], target: number): number[] {
  // 边界条件检查
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

// 测试用例
leetcodeTemplate(
  { id: 1, name: '两数之和', difficulty: 'easy' },
  twoSum,
  [[2, 7, 11, 15], 9],
  [0, 1],
);

leetcodeTemplate(
  { id: 1, name: '两数之和', difficulty: 'easy' },
  twoSum,
  [[3, 2, 4], 6],
  [1, 2],
);

