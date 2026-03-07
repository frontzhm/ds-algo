/**
 * 表达式计算函数（支持 +-*\/、数字、空格、嵌套括号，遵循 括号>乘除>加减 优先级）
 * @param {string} s - 输入表达式，示例："1+2+1*3+(3*6+12*(3+3))-5"
 * @returns {number} - 计算结果
 *
 * 核心设计思路：
 * 1. 栈的作用：存储待累加的数字（根据符号决定数字进栈的值，加减转符号存储，乘除优先计算后存储，括号结果作为单个数字存储）
 * 2. 符号规则：signBeforeNum 记录「当前数字的前一个运算符」，决定数字如何入栈
 * 3. 字符处理优先级：空格跳过 → 数字拼接 → 左括号递归 → 运算符更新符号
 */
function calculate(s) {
  const bracketMap = getBracketMap(s); // 预生成「左括号索引→右括号索引」映射，解决嵌套括号匹配
  return calculatePart(0, s.length - 1);
  // 计算low到high的字符串
  function calculatePart(low, high) {
    const stack = []; // 存储待累加的数字栈（核心数据结构）
    let signBeforeNum = '+'; // 【易错点1】初始值必须为+，对应第一个数字前默认是加号
    // 遍历表达式的每个字符
    for (let i = low; i <= high; i++) {
      let curChar = s[i];

      // 1. 跳过空格（唯一需要主动跳过的特殊字符）
      if (curChar === ' ') continue;

      // 2. 处理连续数字拼接（核心逻辑：多位数拆解）
      if (/[0-9]/.test(curChar)) {
        let num = 0;
        // 循环拼接所有连续数字，直到遇到非数字字符
        while (i < s.length && /[0-9]/.test(s[i])) {
          // 【易错点2】必须加i < s.length，避免越界
          // 【易错点3】必须用s[i]而非curChar，curChar是循环外的初始值，不会随i更新
          const singleNum = s[i] - '0';
          num = num * 10 + singleNum; // 位权原理拼接多位数（如1→12→123）
          i++; // 移动到下一个字符
        }
        // 数字拼接完成，按符号入栈
        addNumToStack(stack, num, signBeforeNum);
        // 【易错点4】核心细节：循环后i指向非数字，外层i++会跳过运算符，必须回退一步
        i--;
        continue; // 跳过后续逻辑，避免数字被误判为运算符
      }

      // 3. 处理左括号（递归+索引跳转，无需处理右括号）
      if (curChar === '(') {
        const rightBracketIdx = bracketMap.get(i); // 获取匹配的右括号索引
        // 【易错点5】递归截取范围是[i+1, rightBracketIdx)，不包含右括号
        const bracketRes = calculatePart(i + 1, rightBracketIdx);
        // 括号结果作为单个数字，按当前符号入栈
        addNumToStack(stack, bracketRes, signBeforeNum);
        // 【易错点6】跳到右括号索引，外层i++会自然跳过右括号，无需额外处理)
        i = rightBracketIdx;
        continue; // 本次循环结束，避免后续逻辑处理右括号
      }

      // 4. 处理运算符（仅更新符号，数字入栈逻辑在数字拼接时触发）
      if (['+', '-', '*', '/'].includes(curChar)) {
        // 【易错点7】符号仅记录，不立即计算，作用于下一个数字
        signBeforeNum = curChar;
      }
    }

    // 5. 栈内所有数字累加（加减已转符号，乘除/括号已计算，直接求和）
    let sum = 0;
    while (stack.length) {
      sum += stack.pop();
    }
    return sum;
  }
}

/**
 * 按「数字前的运算符」处理数字入栈（核心：优先级实现）
 * @param {number[]} stack - 数字栈
 * @param {number} num - 待入栈的数字（或括号计算结果）
 * @param {string} signBeforeNum - 数字前的运算符（+、-、*、/）
 */
function addNumToStack(stack, num, signBeforeNum) {
  switch (signBeforeNum) {
    case '+':
      stack.push(num); // 加法：直接入栈（等价于+num）
      break;
    case '-':
      stack.push(-num); // 【易错点8】减法转加负数，简化最终求和逻辑
      break;
    case '*':
      // 【易错点9】乘除优先：弹出栈顶元素与当前数字计算，结果重新入栈
      const prevNum = stack.pop();
      stack.push(prevNum * num);
      break;
    case '/':
      const prevNum1 = stack.pop();
      // 【易错点10】除法用Math.trunc取整，兼容负数（如-5/2=-2，而非2）
      stack.push(Math.trunc(prevNum1 / num));
      break;
    default:
      break;
  }
}

/**
 * 生成「左括号索引→右括号索引」的映射（解决嵌套括号匹配）
 * @param {string} s - 表达式字符串
 * @returns {Map<number, number>} - 括号索引映射表
 */
function getBracketMap(s) {
  const bracketMap = new Map();
  const stack = []; // 存储左括号索引，用于匹配嵌套括号（先进后出）

  for (let i = 0; i < s.length; i++) {
    const curChar = s[i];
    if (curChar === '(') {
      // 【易错点11】左括号入栈记录索引，嵌套括号靠栈的先进后出匹配
      stack.push(i);
      continue;
    }
    if (curChar === ')') {
      // 【易错点12】弹出最近的左括号索引（匹配原则：就近匹配）
      const leftBracketIdx = stack.pop();
      bracketMap.set(leftBracketIdx, i); // 记录映射关系
      continue;
    }
  }
  return bracketMap;
}

// ===================== 测试用例（验证所有易错点） =====================
console.log(calculate('1+2+1*3+(3*6+12*(3+3))-5')); // 91 ✅（覆盖嵌套括号+乘除）
console.log(calculate(' 10 - 2*3 + 8/2 ')); // 8 ✅（覆盖空格+连续数字）
console.log(calculate('((10-2)*3)+(8/2)')); // 28 ✅（覆盖多层嵌套）
console.log(calculate('10-(2*3+8)/2')); // 3 ✅（覆盖负数除法）
