/**
 * 时间复杂度分析工具（辅助打印）
 * @param name 算法名称
 * @param complexity 时间复杂度（如 O(n)、O(nlogn)）
 * @param fn 要执行的算法函数
 * @param args 函数参数
 */
export function analyzeTimeComplexity<T>(
  name: string,
  complexity: string,
  fn: (...args: any[]) => T,
  ...args: any[]
): T {
  console.log(`[${name}] 时间复杂度：${complexity}`);
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`[${name}] 执行耗时：${(end - start).toFixed(4)}ms`);
  return result;
}
