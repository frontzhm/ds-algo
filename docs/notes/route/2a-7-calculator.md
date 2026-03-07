# 一步步实现字符串计算器：从「转整数」到「带括号与优化」

用代码实现一个计算器，是面试和刷题里很常见的一类题。很多人一上来就想写「完整版」，容易在符号优先级、括号、多位数上一起踩坑。更好的方式是：**先解决最小子问题，再一层层加能力**。

这篇文章会按下面这条路线，带你从零搭出一个支持 `+ - * /` 和括号的表达式计算器，并在最后做一轮优化。

1. **字符串转整数**：先把「数字字符串」正确转成数字
2. **只做加减**：引入运算符和栈，处理 `+`、`-`
3. **加入乘除**：在原有框架上加上 `*`、`/` 与优先级
4. **支持括号**：用递归或区间，处理嵌套括号
5. **优化**：避免爆栈、少做拷贝、写法更稳

每一步都会在**前一步可运行代码**的基础上做增量修改，方便你跟着写、跟着测。

---

## 第一步：字符串转整数

表达式是由「数字」和「运算符」组成的，而数字在字符串里可能是多位数，比如 `"123"`。所以首先要会：**把一段连续的数字字符转成一个整数**。

核心就一句话：**每多一位，相当于原来的数左移一位（×10），再加上当前这一位**。

- `"1"` → 先得到 `1`
- `"12"` → 原来的 `1` 变成十位：`1*10+2 = 12`
- `"123"` → 原来的 `12` 再左移一位：`12*10+3 = 123`

用代码写出来就是这样（只考虑正整数、无空格无符号）。用 `while` 把连续数字一次性读完，后面各步也都用这一套逻辑，更统一：

```js
/**
 * 将纯数字字符串转为整数（如 "123" → 123）
 * @param {string} str - 仅包含数字字符的字符串
 * @returns {number} 转换后的整数
 */
function stringToInt(str) {
  let num = 0; // 累加结果，初始为 0（乘法的单位元，不影响首次 num*10+cur）
  let i = 0; // 当前扫描到的下标
  // 只要未越界且当前字符是数字，就继续读（多位数一次性读完）
  while (i < str.length && /[0-9]/.test(str[i])) {
    num = num * 10 + (str[i] - '0'); // 左移一位（×10）+ 当前位数字；'5'-'0' → 5
    i++;
  }
  return num;
}
```

这里用 `str[i] - '0'` 把字符转成数字，比 `parseInt` 更直接，也避免一些隐式转换问题。

**建议**：自己写一遍，用 `"0"`、`"9"`、`"123"`、`"1000"` 测几组，确保多位数和边界都对。这是后面所有步骤的「数字解析」基础。

---

## 第二步：只做加减法

假设输入只有 `+`、`-`、数字和空格，例如：`"1 - 12 + 3"`。目标是：**一次遍历，得到结果**。

一个很好用的思路是：**把减法变成「加负数」**，这样最后只需要做「一堆数求和」。

1. 给**第一个数字**前面补一个默认的 `+`，整体看成：`+1 -12 +3`。
2. 把**一个符号 + 一个数字**绑在一起，得到几组：`(+1)`、`(-12)`、`(+3)`。
3. 把这些数全部加在一起：`1 + (-12) + 3 = -8`。

实现时：

- 用一个变量 `sign` 表示「当前正在拼的这个数字前面是 `+` 还是 `-`」，初始为 `'+'`。
- 遇到数字就按「第一步」的方式拼成多位数，拼在 `curNum` 里，然后根据数字前面的sign，进栈
- 遍历结束后，栈里全是「带符号的数」，求和即可。

```js
/**
 * 只支持 +、-、数字、空格的表达式（减法转为加负数，最后统一求和）
 * @param {string} s - 表达式字符串，如 "1 - 12 + 3"
 * @returns {number} 计算结果
 */
function calculateAddSub(s) {
  const stack = []; // 存「带符号的加数」，最后全部相加即可
  let sign = '+'; // 当前数字前的符号，第一个数字前默认为 +
  const n = s.length;

  for (let i = 0; i < n; i++) {
    const c = s[i];
    if (c === ' ') continue; // 空格跳过，避免被误判为数字

    // 遇到数字：用 while 一次性读完多位数
    if (/[0-9]/.test(c)) {
      let num = 0;
      while (i < n && /[0-9]/.test(s[i])) {
        num = num * 10 + (s[i] - '0');
        i++;
      }
      stack.push(sign === '+' ? num : -num); // 按当前符号入栈（减法即存负数）
      i--; // while 结束时 i 已指向非数字，for 会再 i++，故回退一步避免跳过
      continue;
    }

    // 遇到 + 或 -：只更新符号，下一个数字将使用该符号入栈
    if (c === '+' || c === '-') {
      sign = c;
    }
  }

  // 栈内全是带符号的加数，直接求和
  let sum = 0;
  while (stack.length) sum += stack.pop();
  return sum;
}
```

要点：

- 空格直接 `continue`，避免被误当数字。
- 遇到数字就用 `while` 一次性读完，入栈后记得 `i--`，因为 `for` 会再 `i++`，否则会跳过一个字符。
- 遇到 `+`、`-` 只更新 `sign`，数字在读完时按当前 `sign` 入栈；栈里存的已经是「带符号的加数」，最后只做加法。

到这里，你已经有了「数字解析 + 运算符 + 栈」的框架，下一步只是在这个框架上扩展运算符种类和优先级。

---

## 第三步：加入乘除

在「加减 + 栈」的基础上，再支持 `*`、`/`，并且满足：**乘除优先于加减**。

做法可以这样理解：

- **加减**：像第二步一样，把数字带上符号压栈（减法即压负值），最后统一求和。
- **乘除**：需要「立刻算掉」，因为乘除的优先级高。做法是：遇到 `*` 或 `/` 时，用**当前刚拼好的数**和**栈顶的数**做运算，把结果再压回栈顶。这样栈里存的仍然是「已经按优先级算好的、待求和的项」。

所以我们需要一个「数字前的运算符」`signBeforeNum`：

- 遇到 `+`、`-`：把当前数字按正/负入栈，只改 `signBeforeNum`，不入栈时做运算。
- 遇到 `*`、`/`：先按 `signBeforeNum` 把当前数字和栈顶结合（若是 `*`/`/` 就弹出栈顶算完再压回），再更新 `signBeforeNum`。

为了代码清晰，可以把「根据符号把 num 入栈」抽成一个函数：

```js
/**
 * 根据「数字前的运算符」把 num 入栈（加减存带符号数，乘除与栈顶算完再入栈）
 * @param {number[]} stack - 数字栈
 * @param {string} signBeforeNum - 该数字前的运算符（+、-、*、/）
 * @param {number} num - 刚读完的数字
 */
function addNumToStack(stack, signBeforeNum, num) {
  switch (signBeforeNum) {
    case '+':
      stack.push(num); // 加：直接入栈
      break;
    case '-':
      stack.push(-num); // 减：转成加负数入栈
      break;
    case '*':
      stack.push(stack.pop() * num); // 乘：弹出栈顶 × 当前数，结果入栈（乘除优先）
      break;
    case '/':
      const top = stack.pop();
      stack.push(Math.trunc(top / num)); // 除：向零取整，如 -5/2 → -2
      break;
  }
}

/**
 * 支持 +、-、*、/、数字、空格，乘除优先于加减
 * @param {string} s - 表达式，如 "10 - 2*3 + 8/2"
 * @returns {number} 计算结果
 */
function calculateMulDiv(s) {
  const stack = []; // 存待累加的项（加减已转符号，乘除已算完）
  let signBeforeNum = '+'; // 「下一个数字」前的运算符，第一个数字前默认为 +
  const n = s.length;

  for (let i = 0; i < n; i++) {
    const c = s[i];
    if (c === ' ') continue;

    // 遇到数字：while 读完多位数，再按 signBeforeNum 入栈
    if (/[0-9]/.test(c)) {
      let num = 0;
      while (i < n && /[0-9]/.test(s[i])) {
        num = num * 10 + (s[i] - '0');
        i++;
      }
      addNumToStack(stack, signBeforeNum, num);
      i--;
      continue;
    }

    // 遇到运算符：只更新「下一个数字前的符号」，数字入栈在读完数字时由 addNumToStack 完成
    if (['+', '-', '*', '/'].includes(c)) {
      signBeforeNum = c;
    }
  }

  return stack.reduce((a, b) => a + b, 0);
}
```

注意：

- 除法用 `Math.trunc`，这样 `-5/2 === -2`，符合「向零取整」的惯例。
- 数字用 `while` 一次性读完，入栈后 `i--`，与第二步一致。

到这一步，不带括号的四则运算已经完成，逻辑也是后面「带括号版」的基础。

---

## 第四步：支持括号

括号的语义是：**括号内的表达式先算，结果当作一个数**。所以可以很自然想到：

- 遇到 `(`：找到与之匹配的 `)`，对中间这一段**递归计算**，得到的结果当作「一个数字」，再按当前的 `signBeforeNum` 入栈。
- 遇到 `)`：不需要在本层处理，因为是由「匹配的 `(` 那一层」通过递归边界自然结束的。

因此需要解决两件事：

1. **括号匹配**：给定一个 `(` 的位置，找到对应的 `)`。嵌套括号用栈即可：从左到右扫，`(` 压栈，`)` 弹栈，弹出来的就是匹配的左括号，记录下右括号位置即可得到「左 → 右」的映射。
2. **递归范围**：遇到 `(` 时，用映射找到配对的 `)`，对子串 `s.slice(left+1, right)` 递归计算（不包含括号本身），结果当作一个数入栈，然后把下标 `i` 直接跳到 `)`，避免重复处理。

下面先给出**未优化版**：每次进入 `calculate(s)` 都会对当前 `s` 算一遍 `getBracketMap(s)`，递归时用 `s.slice(i+1, right)` 复制出一段子串再递归。逻辑清晰，但长表达式、深括号时会有重复计算和大量拷贝，第五步再优化。

先写括号匹配（只扫一遍字符串）：

```js
/**
 * 建立括号配对：左括号下标 → 对应的右括号下标（嵌套括号用栈就近匹配）
 * @param {string} s - 表达式字符串
 * @returns {Map<number, number>} 左括号索引 → 右括号索引
 */
function getBracketMap(s) {
  const map = new Map();
  const stack = []; // 存左括号的下标，遇到 ) 时弹栈即得到与之匹配的 (
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i); // 左括号：记录其下标，等待匹配
    }
    if (s[i] === ')') {
      const left = stack.pop(); // 弹出最近的左括号下标，即与当前 ) 配对
      map.set(left, i); // 记录配对关系
    }
  }
  return map;
}
```

然后在主逻辑里加上对 `(` 的分支（递归时传入**子串**，即未优化版）：

```js
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
  const stack = []; // 存储待累加的数字栈（核心数据结构）
  const bracketMap = getBracketMap(s); // 预生成「左括号索引→右括号索引」映射，解决嵌套括号匹配
  let signBeforeNum = '+'; // 【易错点1】初始值必须为+，对应第一个数字前默认是加号

  // 遍历表达式的每个字符
  for (let i = 0; i < s.length; i++) {
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
      const bracketRes = calculate(s.slice(i + 1, rightBracketIdx));
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
```

注意：

- 递归区间用 `s.slice(i+1, right)`，不包含左右括号；每一层递归收到的都是「当前层」的字符串，所以本层算出的 `bracketMap` 就是当前 `s` 的映射。
- `i = right` 之后，外层 `for` 会执行 `i++`，所以不会重复处理 `)`。
- 未优化点：每次递归都复制一次子串，且每次进入 `calculate(s)` 都会执行一次 `getBracketMap(s)`，表达式长、括号深时容易爆栈或变慢。下一步在第五步里改成「只算一次 bracketMap、只传区间不复制」。(主要是跑leetCode224题目的时候，用例没过)

---

## 第五步：优化

在第四步未优化版的基础上做两处改动：**不复制字符串**、**只算一次括号映射**。

### 1. 不拷贝字符串，只传区间

递归时不再用 `calculate(s.slice(i + 1, right))`，而是始终在原串 `s` 上操作，用内部函数 `calc(low, high)` 表示「只处理 `s[low..high]` 这一段」。递归时调用 `calc(i + 1, right - 1)`，不产生任何子串拷贝。

### 2. 只算一次括号映射

`getBracketMap(s)` 只依赖**整串** `s`，和递归层数无关。在**最外层入口**算一次，得到整串的「左括号下标 → 右括号下标」映射，然后在整个递归过程中通过闭包共用这一个 `bracketMap`。这样每一层不再重新扫一遍当前子串，避免重复计算。

优化后的主逻辑示意（与文末完整实现一致）：入口处 `const bracketMap = getBracketMap(s)` 只执行一次，然后 `return calc(0, s.length - 1)`；内部 `calc(low, high)` 遇到 `(` 时用 `bracketMap.get(i)` 取到匹配的右括号下标（因为 i 始终是原串下标），再递归 `calc(i + 1, right - 1)`，并令 `i = right` 跳过整段括号。

### 3. 数字拼接时的小细节

- 用 `while` 把连续数字一次性拼完，避免用 `curChar` 而忘记用 `s[i]` 导致死循环或错位；拼完后记得 `i--`，因为 `for` 会再 `i++`，否则会跳过一个字符。
- 数字判断用 `/[0-9]/.test(s[i])`，循环条件里务必写 `i < s.length`，防止越界。

### 4. 除法取整

坚持用 `Math.trunc(top / num)`，这样负数的除法行为一致（向零取整），和常见数学期望一致。

```js
/**
 * 建立括号配对：左括号下标 → 右括号下标（仅扫一遍，嵌套用栈匹配）
 */
function getBracketMap(s) {
  const map = new Map();
  const stack = []; // 存左括号下标
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') stack.push(i);
    if (s[i] === ')') map.set(stack.pop(), i);
  }
  return map;
}

/**
 * 按「数字前的运算符」将 num 入栈：加减存带符号数，乘除与栈顶算完再入栈
 */
function addNumToStack(stack, signBeforeNum, num) {
  switch (signBeforeNum) {
    case '+':
      stack.push(num);
      break;
    case '-':
      stack.push(-num);
      break;
    case '*':
      stack.push(stack.pop() * num);
      break;
    case '/':
      stack.push(Math.trunc(stack.pop() / num));
      break;
  }
}

/**
 * 表达式计算（优化版：不复制 s，只传区间；bracketMap 只算一次）
 * @param {string} s - 整段表达式
 * @returns {number} 计算结果
 */
function calculate(s) {
  const bracketMap = getBracketMap(s); // 整串只算一次，递归过程中通过闭包共用
  return calc(0, s.length - 1);

  /** 只处理 s[low..high] 这一段，不复制字符串 */
  function calc(low, high) {
    const stack = [];
    let signBeforeNum = '+';

    for (let i = low; i <= high; i++) {
      const c = s[i];
      if (c === ' ') continue;

      // 数字：while 读完多位数（注意边界 i <= high），入栈后 i-- 避免 for 多跳一格
      if (/[0-9]/.test(c)) {
        let num = 0;
        while (i <= high && /[0-9]/.test(s[i])) {
          num = num * 10 + (s[i] - '0');
          i++;
        }
        addNumToStack(stack, signBeforeNum, num);
        i--;
        continue;
      }

      // 左括号：用预算好的 bracketMap 取匹配的右括号，递归区间 [i+1, right-1]，结果入栈后跳过整段
      if (c === '(') {
        const right = bracketMap.get(i);
        const sub = calc(i + 1, right - 1);
        addNumToStack(stack, signBeforeNum, sub);
        i = right;
        continue;
      }

      // 运算符：更新「下一个数字前的符号」
      if (['+', '-', '*', '/'].includes(c)) {
        signBeforeNum = c;
      }
    }

    return stack.reduce((a, b) => a + b, 0);
  }
}
```

测试示例：

- `calculate('1 + 1')` → 2
- `calculate(' 2-1 + 2 ')` → 3
- `calculate('10 - 2*3 + 8/2')` → 8
- `calculate('(1+(4+5+2)-3)+(6+8)')` → 23
- `calculate('3*(2-6/(3-7))')` → 12

---

## 小结

整体路线可以概括成：

| 步骤 | 能力 | 核心点 |
| --- | --- | --- |
| 1 | 字符串转整数 | `while` 读连续数字，`num = num * 10 + (c - '0')`，多位数左移再累加 |
| 2 | 加减 | 同上 `while` 读数字，读完按 `sign` 入栈；减法当加负数，最后求和 |
| 3 | 乘除 | 同上 `while` 读数字，读完用 `addNumToStack`；乘除与栈顶算完再入栈 |
| 4 | 括号（未优化） | 同上 `while` 读数字；每层 `getBracketMap(s)`，递归用 `s.slice` 传子串 |
| 5 | 优化 | 不 slice、只传区间 `calc(low,high)`；只算一次 bracketMap；注意 `i--` 与越界 |

按这个顺序实现，每一步都能单独测，最后再接到一起，就是一个清晰、可维护的字符串计算器实现。如果你愿意，还可以在此基础上再扩展：负号、空格预处理、更多运算符等，思路都是在这一套「栈 + 符号 + 区间」上做延伸。

如果你按「字符串转整数 → 加减 → 乘除 → 括号 → 优化」的顺序自己实现一遍，再和这份代码对照，会更容易抓住每一步的意图和易错点。
