# 回溯算法专项突破练习（1）

## 前言

回溯算法是算法面试中的核心考点，本质是通过**深度优先搜索**尝试所有可能的解，在搜索过程中通过「选择-递归-撤销」完成回溯，适用于排列、组合、分割、网格搜索、子集生成等场景。

本文整理了**10道LeetCode高频回溯真题**，方便读者练习回溯算法

---

## 目录

1. [17. 电话号码的字母组合](#17-电话号码的字母组合)

2. [93. 复原 IP 地址](#93-复原-ip-地址)

3. [131. 分割回文串](#131-分割回文串)

4. [491. 非递减子序列](#491-非递减子序列)

5. [526. 优美的排列](#526-优美的排列)

6. [79. 单词搜索](#79-单词搜索)

7. [967. 连续差相同的数字](#967-连续差相同的数字)

8. [89. 格雷编码](#89-格雷编码)

9. [980. 不同路径 III](#980-不同路径-iii)

10. [473. 火柴拼正方形](#473-火柴拼正方形)

---

## 17. 电话号码的字母组合

**题目链接**：[https://leetcode.cn/problems/letter-combinations-of-a-phone-number/](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

### 题目描述

给定一个仅包含数字 `2-9` 的字符串，返回所有它能表示的字母组合。答案可以按**任意顺序**返回。

数字到字母的映射与电话按键相同。

### 示例

```Plain Text

输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

### 解题思路

1. 建立数字到字母的映射表；

2. 回溯遍历每个数字对应的字母，依次拼接；

3. 拼接长度等于数字长度时，收集结果；

4. 标准回溯：选择字母→递归→撤销选择。

### 代码实现

```JavaScript

/**
 * 17. 电话号码的字母组合
 * 思路：回溯（多叉树遍历）
 * 每一个数字对应几个字母，依次选字母 → 选够长度 → 存结果
 */
var letterCombinations = function (digits) {
  // 1. 数字 → 字母 映射表（完全正确）
  const numToStr = new Map([
    ['2', 'abc'],
    ['3', 'def'],
    ['4', 'ghi'],
    ['5', 'jkl'],
    ['6', 'mno'],
    ['7', 'pqrs'],
    ['8', 'tuv'],
    ['9', 'wxyz'],
  ]);

  const n = digits.length; // 输入数字的长度（决定最终组合长度）
  const res = []; // 存放最终所有组合
  const path = []; // 回溯路径：存放当前正在拼的字母

  // 从第 0 个数字开始选字母
  dfs(0);
  return res;

  // ====================
  // 回溯核心 DFS
  // start：当前处理第几个数字
  // ====================
  function dfs(start) {
    // 一、终止条件：选够了 n 个字母（和数字长度一样），就是一个合法组合
    if (path.length === n) {
      res.push([...path].join('')); // 转字符串存入结果
      return;
    }

    // 边界：超出数字长度，直接返回
    if (start >= n) return;

    // 二、拿到当前数字对应的所有字母（核心）
    const curNum = digits[start]; // 拿到第 start 个数字
    const charList = numToStr.get(curNum).split(''); // 拿到对应字母数组

    // 三、遍历每个字母，挨个尝试（回溯核心）
    for (let char of charList) {
      path.push(char); // 选择：加入当前字母
      dfs(start + 1); // 递归：去处理下一个数字
      path.pop(); // 撤销：回溯，换一个字母
    }
  }
};
```

---

## 93. 复原 IP 地址

**题目链接**：[https://leetcode.cn/problems/restore-ip-addresses/](https://leetcode.cn/problems/restore-ip-addresses/)

### 题目描述

给定一个只包含数字的字符串，用以表示一个 IP 地址，返回所有可能从 `s` 获得的**有效 IP 地址**。

有效 IP 地址规则：

1. 必须切成 4 段；

2. 每段数值在 0~255 之间；

3. 不能有前导 0；

4. 必须用完所有字符。

### 示例

```Plain Text

输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]
```

### 解题思路

1. 回溯切割字符串，每段最多切割3个字符；

2. 校验合法性：无前置0、数值≤255；

3. 切割成4段且用完所有字符时，收集结果；

4. 非法情况直接剪枝，提升效率。

### 代码实现

```JavaScript

/**
 * 93. 复原 IP 地址
 * 功能：给定一个数字字符串，返回所有可能的有效 IP 地址
 * 规则：
 * 1. 必须切成 4 段
 * 2. 每段 0 ~ 255
 * 3. 不能有前导 0（如 01 非法，0 合法）
 * 4. 必须刚好用完所有字符
 */
var restoreIpAddresses = function (s) {
  const n = s.length; // 字符串总长度
  const res = []; // 存放最终所有合法IP
  const path = []; // 回溯路径：存放当前切出来的 1~4 段数字

  dfs(0); // 从下标 0 开始切
  return res;

  // ====================
  // 回溯核心函数
  // start：从哪个位置开始切
  // ====================
  function dfs(start) {
    // ====================
    // 一、终止条件：已经切了 4 段
    // ====================
    if (path.length === 4) {
      // 必须刚好用完所有字符，才是合法IP
      if (start === n) {
        // 把四段用 . 连接，存入结果
        res.push([...path].join('.'));
      }
      // 不管是否合法，只要切够 4 段就停止
      return;
    }

    // ====================
    // 二、循环：尝试在 i 位置切一刀
    // 每一段最多切 3 个字符（因为 0~255 最多三位）
    // ====================
    for (let i = start; i < n; i++) {
      // 切出：从 start 到 i 的一段字符串
      const curVal = s.slice(start, i + 1);

      // ====================
      // 三、合法性判断 1：不能有前导 0
      // ====================
      // 长度 >=2 还以 0 开头 → 非法（如 01 / 012）
      if (curVal.length >= 2 && curVal.startsWith('0')) {
        break; // 再往后切更长，也一定带前导0 → 直接剪枝，不继续切
      }

      // ====================
      // 四、合法性判断 2：不能大于 255
      // ====================
      if (Number(curVal) > 255) {
        break; // 超过255，再往后切数字更大 → 直接剪枝
      }

      // ====================
      // 五、合法！开始回溯
      // ====================
      path.push(curVal); // 把当前合法段加入路径
      dfs(i + 1); // 继续切下一段（从 i+1 开始）
      path.pop(); // 回溯：撤销这一刀，尝试切更长的段
    }
  }
};
```

---

## 131. 分割回文串

**题目链接**：[https://leetcode.cn/problems/palindrome-partitioning/](https://leetcode.cn/problems/palindrome-partitioning/)

### 题目描述

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是**回文串**。

返回 `s` 所有可能的分割方案。

### 示例

```Plain Text

输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
```

### 解题思路

1. 从起始位置开始切割字符串；

2. 判断切割出的子串是否为回文；

3. 是回文则加入路径，递归切割剩余部分；

4. 切割完整个字符串时，收集分割方案。

### 代码实现

```JavaScript

var partition = function (s) {
  const n = s.length;
  const res = []; // 存放所有分割方案
  const path = []; // 存放当前的一种分割方案

  dfs(0);
  return res;

  // start：从哪个位置开始继续分割
  function dfs(start) {
    // 一、终止条件：已经把整个字符串分割完了
    if (start === n) {
      res.push([...path]); // 保存方案
      return;
    }

    // 二、尝试在 i 位置切一刀
    for (let i = start; i < n; i++) {
      // 切出 [start, i] 这一段
      const curStr = s.slice(start, i + 1);

      // 三、不是回文就不能切，跳过
      if (!isP(curStr)) continue;

      // 四、是回文 → 加入当前方案
      path.push(curStr);

      // 五、继续分割剩下的 i+1 位置
      dfs(i + 1);

      // 六、回溯：撤销这一刀，尝试下一个切割位置
      path.pop();
    }
  }

  // 判断是否回文
  function isP(str) {
    let l = 0,
      r = str.length - 1;
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  }
};
```

---

## 491. 非递减子序列

**题目链接**：[https://leetcode.cn/problems/non-decreasing-subsequences/](https://leetcode.cn/problems/non-decreasing-subsequences/)

### 题目描述

给你一个整数数组 `nums`，找出并返回所有该数组中不同的**非递减子序列**。

子序列长度**至少为 2**，可以按任意顺序返回答案。

### 示例

```Plain Text

输入：nums = [4,6,7,7]
输出：[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
```

### 解题思路

1. 回溯生成子序列，保证非递减；

2. 同层去重：使用Set记录当前层已使用数字；

3. 子序列长度≥2时收集结果；

4. 保证元素顺序，只能从当前下标向后选择。

### 代码实现

```JavaScript

/**
 * LeetCode 491. 非递减子序列
 * 题目：找出数组中所有长度 >= 2 的非递减子序列，不能重复
 * 解法：回溯 DFS + 同层去重
 */
var findSubsequences = function (nums) {
  const n = nums.length; // 数组长度，控制循环范围
  const res = []; // 存放最终所有符合条件的子序列
  const path = []; // 回溯路径：保存当前正在拼接的子序列

  dfs(0); // 从数组第 0 位开始搜索
  return res;

  /**
   * 回溯 DFS 函数
   * @param {number} start - 从哪个下标开始选数字（保证子序列的顺序）
   */
  function dfs(start) {
    // ==================== 1. 结果收集条件 ====================
    // 只要当前路径长度 >= 2，就是一个合法的非递减子序列
    if (path.length >= 2) {
      res.push([...path]); // 把 path 拷贝一份存入结果（防止回溯被修改）
    }

    // ==================== 2. 同层去重核心 ====================
    // 关键点：每一层（每一次递归）都新建一个 Set
    // 作用：保证【同一层】不会选相同的数字，避免生成重复子序列
    const curLevelUsedSet = new Set();

    // ==================== 3. 遍历选择：只能选 start 及之后的数字 ====================
    for (let i = start; i < n; i++) {
      const curNum = nums[i]; // 当前要选的数字

      // ==================== 4. 两个跳过条件（必须满足才能选） ====================
      // 条件 1：如果 path 不为空 && 当前数字 < 路径最后一个数字 → 不是非递减 → 跳过
      // 条件 2：当前数字在【本层】已经用过 → 重复 → 跳过
      if ((path.length > 0 && curNum < path.at(-1)) || curLevelUsedSet.has(curNum)) {
        continue;
      }

      // ==================== 5. 标记本层已使用 ====================
      // 这个数字在当前这一层循环里，以后不能再用了（去重）
      curLevelUsedSet.add(curNum);

      // ==================== 6. 回溯标准三步：选择 → 递归 → 撤销 ====================
      path.push(curNum); // 1. 选择：把当前数字加入路径

      dfs(i + 1); // 2. 递归：下一层必须从 i+1 开始选（保证子序列顺序）

      path.pop(); // 3. 撤销：回溯，退回上一步，尝试下一个数字（想象就是去掉当前值 然后准备选当前层的其他值）
    }
  }
};
```

---

## 526. 优美的排列

**题目链接**：[https://leetcode.cn/problems/beautiful-arrangement/](https://leetcode.cn/problems/beautiful-arrangement/)

### 题目描述

假设有从 1 到 N 的 N 个整数，如果用这些数字构造一个数组，满足：

对于数组中第 i 个位置（1 ≤ i ≤ N），满足下列条件之一：

1. 数字能被 i 整除；

2. i 能被数字整除。

返回能构造的**优美排列**的数量。

### 示例

```Plain Text

输入：n = 2
输出：2
解释：[1,2] 和 [2,1] 都是优美排列
```

### 解题思路

1. 回溯填充1~n的位置；

2. 标记已使用的数字，避免重复；

3. 校验当前位置与数字的整除关系；

4. 填满所有位置时，计数+1。

### 代码实现

```JavaScript

var countArrangement = function (n) {
  let res = 0;
  let used = new Array(n + 1).fill(false); // 标记数字是否使用 ✅

  dfs(1); // 从第 1 个位置开始 ✅
  return res;

  function dfs(step) {
    // 填满 n 个位置（1~n），成功 ✅
    if (step === n + 1) {
      res++;
      return;
    }

    // 尝试给第 step 个位置放数字 num ✅
    for (let num = 1; num <= n; num++) {
      if (used[num]) continue; // 数字用过跳过 ✅

      // 核心条件：优美排列 100% 正确 ✅
      // 数字能被位置整除 或 位置能被数字整除
      if (step % num !== 0 && num % step !== 0) continue;

      used[num] = true;
      dfs(step + 1);
      used[num] = false; // 完美回溯 ✅
    }
  }
};
```

---

## 79. 单词搜索

**题目链接**：[https://leetcode.cn/problems/word-search/](https://leetcode.cn/problems/word-search/)

### 题目描述

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word`。

判断单词是否存在于网格中，单词由相邻单元格的字母构成，同一单元格字母不可重复使用。

### 示例

```Plain Text

输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
```

### 解题思路

1. 遍历网格所有格子作为起点；

2. 四方向深度优先搜索，匹配单词字符；

3. 原地标记已访问字符，无需额外used数组；

4. 匹配完成立即剪枝，提升效率。

### 代码实现（原地修改优化版）

```JavaScript

var exist = function (board, word) {
  const n = word.length; // 要搜索的单词长度
  let res = false; // 最终结果：是否找到
  const rows = board.length; // 网格行数
  const cols = board[0].length; // 网格列数
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ]; // 上下左右四个方向

  // 遍历网格所有格子，寻找单词的第一个字符作为起点
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 不是单词首字母，直接跳过
      if (board[row][col] !== word[0]) continue;

      board[row][col] = '#'; // 标记起点已访问

      dfs(row, col, 1); // 开始DFS，已经匹配了 1 个字符

      board[row][col] = word[0]; // 记得回溯

      if (res) return true; // 找到单词，直接返回
    }
  }

  return false; // 遍历完都没找到

  // ====================
  // DFS 回溯核心函数
  // ====================
  function dfs(row, col, matchIndex) {
    if (res) return; // 剪枝：已经找到，不再继续搜索

    // 终止条件：匹配长度 == 单词长度 → 找到！
    if (matchIndex === n) {
      res = true;
      return;
    }

    const targetChar = word[matchIndex]; // 当前需要匹配的字符

    // 遍历四个方向
    for (let [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;

      // 1. 越界 → 跳过
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      // 2. 字符不匹配 → 跳过
      if (board[nr][nc] !== targetChar) continue;

      // ====================
      // 回溯标准三件套
      // ====================
      const char = board[nr][nc];
      board[nr][nc] = '#'; // 1. 标记已访问
      dfs(nr, nc, matchIndex + 1); // 2. 递归下一个字符
      board[nr][nc] = char; // 3. 回溯撤销（关键！）
    }
  }
};
```

---

## 967. 连续差相同的数字

**题目链接**：[https://leetcode.cn/problems/numbers-with-same-consecutive-differences/](https://leetcode.cn/problems/numbers-with-same-consecutive-differences/)

### 题目描述

返回所有长度为 `n` 且满足：每一对相邻数字的差的绝对值为 `k` 的**非负整数**。

数字不能以 0 开头。

### 示例

```Plain Text

输入：n = 3, k = 7
输出：[181,292,707,818,929]
```

### 解题思路

1. 第一位从1~9开始，避免前导0；

2. 下一位数字 = 当前数字±k，保证在0~9范围内；

3. 处理k=0的特殊情况，避免重复；

4. 构造完成后转换为数字返回。

### 代码实现

```JavaScript

var numsSameConsecDiff = function (n, k) {
  const diff = k; // 相邻两位数字的差值要求
  const res = []; // 存放最终结果（存的是数组，如 [1,2,1]）
  const path = []; // 回溯路径：正在拼接的数字（每一位依次存入）

  // 第一位不能是 0，所以从 1~9 开始
  dfs([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // 最后把 [1,2,1] 变成 121 并返回
  return res.map(numList => Number(numList.join('')));

  // ==================== 回溯 DFS 核心 ====================
  function dfs(selectList) {
    // 1. 终止条件：当前数字长度达到 n 位，收集答案
    if (path.length === n) {
      res.push([...path]); // 拷贝一份 path 存入结果
      return;
    }

    // 2. 遍历当前可以选择的所有数字
    for (let i = 0; i < selectList.length; i++) {
      const curNum = selectList[i];

      // 选择当前数字，加入路径
      path.push(curNum);

      // 🔥 核心：计算下一位能选什么数字
      const nextList = [];

      // 下一位可以是：当前数字 - k
      if (curNum - diff >= 0) nextList.push(curNum - diff);
      // 下一位可以是：当前数字 + k 🔥 注意diff为0 的情况
      if (diff !== 0 && curNum + diff <= 9) nextList.push(curNum + diff);

      // 递归进入下一位
      dfs(nextList);

      // 回溯：撤销选择，换一个数字试试
      path.pop();
    }
  }
};
```

---

## 89. 格雷编码

**题目链接**：[https://leetcode.cn/problems/gray-code/](https://leetcode.cn/problems/gray-code/)

### 题目描述

格雷编码是一个二进制数字系统，两个连续的数值仅有一个二进制位的差异。

给定一个代表编码总位数的非负整数 `n`，打印其格雷编码序列。

### 示例

```Plain Text

输入：n = 2
输出：[0,1,3,2]
```

### 解题思路

1. 从全0二进制串开始；

2. 每次翻转一位，生成新的二进制串；

3. 使用Set去重，保证不重复使用；

4. 收集满2ⁿ个数字，且首尾仅一位不同时返回结果。

### 代码实现

```JavaScript

/**
 * 89. 格雷编码
 * 规则：
 * 1. 相邻两个数只有 1 位不同
 * 2. 第一个数和最后一个数也只有 1 位不同
 * 3. 包含 2^n 个数
 *
 * 解法：DFS 回溯 + 逐位翻转 + 去重
 */
var grayCode = function (n) {
  let res = []; // 最终答案（十进制数组）
  const used = new Set(); // 记录用过的二进制串
  const path = []; // 当前搜索路径

  // 起点：全 0 的二进制串
  const start = '0'.repeat(n);
  path.push(start);
  used.add(start);

  dfs();
  return res;

  // ====================
  // DFS 回溯核心
  // ====================
  function dfs() {
    if (res.length) return; // 已经找到答案，剪枝

    // 终止条件：收集满 2^n 个数字
    if (path.length === 2 ** n) {
      // 检查首尾是否也只有一位不同
      if (isFirstLastDiffOne(path)) {
        // 二进制串 → 十进制
        res = path.map(bin => parseInt(bin, 2));
      }
      return;
    }

    // 取最后一个二进制串
    const prev = path.at(-1);

    // 尝试翻转每一位（0变1，1变0）
    for (let i = 0; i < n; i++) {
      // 翻转第 i 位，生成新串
      const newBin = prev.slice(0, i) + (prev[i] === '0' ? '1' : '0') + prev.slice(i + 1);

      if (used.has(newBin)) continue; // 用过的跳过

      // 回溯三件套
      path.push(newBin);
      used.add(newBin);

      dfs();

      if (res.length) return; // 找到就立刻返回

      // 撤销
      path.pop();
      used.delete(newBin);
    }
  }

  // ====================
  // 辅助：判断首尾是否只有一位不同
  // ====================
  function isFirstLastDiffOne(path) {
    const first = path[0];
    const last = path.at(-1);
    let cnt = 0;
    for (let i = 0; i < n; i++) {
      if (first[i] !== last[i]) cnt++;
    }
    return cnt === 1;
  }
};
```

---

## 980. 不同路径 III

**题目链接**：[https://leetcode.cn/problems/unique-paths-iii/](https://leetcode.cn/problems/unique-paths-iii/)

### 题目描述

在二维网格上，有四个类型的方格：

1 表示起点，2 表示终点，0 表示空方格，-1 表示障碍。

你可以上下左右移动，要求**走完所有空方格**，从起点到终点的路径数量。

### 示例

```Plain Text

输入：grid = [[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
输出：2
```

### 解题思路

1. 遍历网格，统计空格数量、找到起点；

2. 四方向DFS搜索，原地标记已走格子；

3. 到达终点时，判断是否走完所有空格；

4. 标准回溯：标记→递归→撤销。

### 代码实现

```JavaScript

var uniquePathsIII = function (grid) {
  const rows = grid.length; // 网格行数
  const cols = grid[0].length; // 网格列数
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]; // 上下左右四个方向

  // 网格里的数字含义（定义常量，代码更清晰）
  const START = 1; // 起点
  const END = 2; // 终点
  const EMPTY = 0; // 空格（必须全部走一遍）
  const STONE = -1; // 障碍物（不能走）

  let emptyCount = 0; // 总空格数量（必须全部走完）
  let startPos = []; // 起点坐标 [row, col]
  let endPos = []; // 终点坐标（这题不用存，不影响）

  // ------------------------------
  // 第一步：遍历整个网格，统计 空格数 + 找到起点
  // ------------------------------
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === EMPTY) emptyCount++; // 统计空格
      if (grid[row][col] === START) startPos = [row, col]; // 记录起点
    }
  }

  let res = 0; // 最终答案：合法路径条数
  let walkedCount = 0; // 已经走过的空格数量

  // 从起点开始DFS搜索
  dfs(...startPos);
  return res;

  // ------------------------------
  // DFS 回溯函数：当前站在 (row, col) 位置
  // ------------------------------
  function dfs(row, col) {
    // ------------------------------
    // 终止条件：如果当前站在【终点】
    // 规则：必须走完所有空格，才算一条合法路径
    // ------------------------------
    if (grid[row][col] === END) {
      // 走过的空格数 === 总空格数 → 正确
      if (walkedCount === emptyCount) res++;
      return;
    }

    // ------------------------------
    // 遍历四个方向，尝试往前走
    // ------------------------------
    for (let [dr, dc] of dirs) {
      const nr = row + dr; // 下一个行
      const nc = col + dc; // 下一个列

      // 1. 越界判断：出网格直接跳过
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const newVal = grid[nr][nc]; // 下一个格子的值

      // 2. 障碍物不能走
      if (newVal === STONE || newVal === START) continue;

      // ------------------------------
      // 情况1：下一个是终点
      // 可以走，但不能修改终点、不能计数
      // ------------------------------
      if (newVal === END) {
        dfs(nr, nc);
        continue;
      }

      // ------------------------------
      // 情况2：下一个是空格（0）
      // 必须走，必须标记，必须计数
      // ------------------------------

      // 标记为石头（表示走过了，不走回头路）
      grid[nr][nc] = STONE;
      walkedCount++; // 走过空格 +1

      // 继续递归
      dfs(nr, nc);

      // 回溯：撤销操作（非常关键！）
      walkedCount--;
      grid[nr][nc] = EMPTY;
    }
  }
};
```

---

## 473. 火柴拼正方形

**题目链接**：[https://leetcode.cn/problems/matchsticks-to-square/](https://leetcode.cn/problems/matchsticks-to-square/)

### 题目描述

给定整数数组 `matchsticks`，`matchsticks[i]` 是第 `i` 根火柴的长度。

用所有火柴拼成一个正方形，**不能折断火柴**，可以拼接火柴。

判断是否能拼成正方形。

### 示例

```Plain Text

输入：matchsticks = [1,1,2,2,2]
输出：true
```

### 解题思路

1. 总长度必须能被4整除，否则直接返回false；

2. 火柴降序排序，优先使用长火柴，快速剪枝；

3. 回溯拼接4条边，每条边长度相等；

4. 同层重复火柴剪枝，首根火柴失败直接剪枝，大幅提升效率。

### 代码实现

```JavaScript

var makesquare = function (matchsticks) {
  // 1. 把火柴从大到小排序：贪心 + 剪枝，先放大的，更快找到失败情况
  matchsticks.sort((x, y) => y - x);

  const n = matchsticks.length; // 火柴总数量

  // 2. 计算所有火柴的总长度
  const total = matchsticks.reduce((acc, cur) => acc + cur, 0);

  // 3. 核心判断：总和不能被 4 整除 → 绝对拼不出正方形
  if (total % 4 !== 0) return false;

  // 正方形每条边的目标长度
  const size = total / 4;

  // 4. 如果最长的火柴 > 边长 → 直接失败（火柴不能折断）
  if (matchsticks[0] > size) return false;

  // 5. 强力剪枝：最长火柴 + 最短火柴 > 边长，直接返回失败（经验剪枝，不影响正确性）
  if (matchsticks[0] < size && matchsticks[0] + matchsticks.at(-1) > size) return false;

  let res = false; // 最终答案：是否能拼成正方形

  // used 数组：标记每根火柴是否已经被使用（true=用过了，false=没用）
  let used = new Array(n).fill(false);

  // 开始深度优先搜索（回溯）
  // 参数1：当前这条边已经拼了多长
  // 参数2：已经拼好的完整边数量（目标是 4）
  dfs(0, 0);

  return res; // 返回最终结果

  // ======================
  // 核心递归函数：DFS 回溯
  // ======================
  function dfs(pathSum, sideCount) {
    // ✔ 剪枝：如果已经找到答案（res=true），直接退出所有递归
    if (res) return;

    // ✔ 终止条件：已经拼好 4 条边 → 成功！
    if (sideCount === 4) {
      res = true;
      return;
    }

    // ✔ 当前边长度刚好达标 → 开始拼下一条新边
    // 重置当前长度为 0，已完成边数 +1
    if (pathSum === size) {
      dfs(0, sideCount + 1);
      return; // 必须 return！否则会继续执行下面逻辑，造成混乱
    }

    // ✔ 当前边长度超标 → 剪枝，这条路走不通，直接返回
    if (pathSum > size) {
      return;
    }

    // ==============================================
    // 遍历所有火柴，尝试把【没使用的火柴】放进当前边
    // ==============================================
    for (let i = 0; i < n; i++) {
      // 1. 这根火柴已经用过了 → 跳过
      if (used[i]) continue;

      const cur = matchsticks[i]; // 当前拿到的火柴长度

      // 2. 重复剪枝：和前一根火柴一样长，且前一根没使用 → 跳过
      // 作用：避免相同长度的火柴重复递归，大幅提速
      if (i > 0 && cur === matchsticks[i - 1] && !used[i - 1]) continue;

      // ========================
      // 回溯三步：选择 → 递归 → 撤销
      // ========================

      // 🔹 选择：标记当前火柴为已使用
      used[i] = true;

      // 🔹 递归：把这根火柴放进当前边，继续往下拼
      dfs(pathSum + cur, sideCount);

      // 🔹 撤销：回溯！把这根火柴标记为未使用，尝试下一种组合
      used[i] = false;

      // ==============================================
      // 🔴 最强力剪枝：90% 提速都靠这一行！
      // ==============================================
      // pathSum === 0 代表：正在拼一条【全新的边】，一根都没放
      // 刚试了第一根火柴 → 递归回来失败了
      // 因为火柴从大到小排序 → 后面的更小，试了也没用
      // 所以直接 return，不再循环后面的火柴！
      // 比如拼第三根的时候 失败了 那么不往后试了 这个组合就是不行了
      // 可能需要撤销第二根 第一根 所以这里不行 不代表全局不行
      if (pathSum === 0) {
        return;
      }
    }
  }
};
```

---

## 总结

本文覆盖了**JavaScript回溯算法**的全部核心场景：

1. **组合/排列**：电话号码、优美排列、连续差相同的数字；

2. **字符串切割**：复原IP、分割回文串；

3. **子集生成**：非递减子序列；

4. **网格搜索**：单词搜索、不同路径III；

5. **进阶回溯**：格雷编码、火柴拼正方形。
