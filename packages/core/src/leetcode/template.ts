import { analyzeTimeComplexity } from '@ds-algo/utils';

/**
 * LeetCode 解题通用模板
 * @param problem 题目信息（编号、名称、难度）
 * @param solution 解题函数
 * @param input 测试输入
 * @param expected 预期输出
 */
export function leetcodeTemplate<T>(
  problem: {
    id: number;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
  },
  solution: (...args: any[]) => T,
  input: any[],
  expected: T
) {
  console.log(`\n=== LeetCode ${problem.id}.${problem.name}（${problem.difficulty}） ===`);

  // 执行并分析时间复杂度
  const result = analyzeTimeComplexity(problem.name, 'O(n)', solution, ...input);

  // 验证结果
  const isCorrect = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`结果验证：${isCorrect ? '✅ 正确' : '❌ 错误'}`);
  if (!isCorrect) {
    console.log(`输入：${JSON.stringify(input)}`);
    console.log(`预期：${JSON.stringify(expected)}`);
    console.log(`实际：${JSON.stringify(result)}`);
  }
  return result;
}

/**
 * 边界条件检查工具
 */
export const boundaryCheck = {
  // 空值检查
  isEmpty: (val: any) => val === null || val === undefined || val.length === 0,
  // 数值范围检查
  inRange: (num: number, min: number, max: number) => num >= min && num <= max,
};
