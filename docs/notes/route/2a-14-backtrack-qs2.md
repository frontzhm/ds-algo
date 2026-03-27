# 回溯算法实战练习（2）

回溯算法是算法面试中的高频考点，核心思想是“试探-回溯-剪枝”，通过递归遍历所有可能的解，同时撤销无效选择、剪枝优化，高效找到目标结果。本文整理了8道经典回溯练习题，涵盖网格搜索、字符串分割、排列、组合等常见场景，从基础到困难逐步递进。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/31e2ab63214a43309cea30797b743faf~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTA1NjUzMzA5OTQxNDk1In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1774668588&x-orig-sign=c8FfwlAKP%2FKfPZyToM59O33zoZg%3D)

## 一、1219. 黄金矿工

### 题目信息

题号：1219. 黄金矿工

链接：[https://leetcode.cn/problems/path-with-maximum-gold/](https://leetcode.cn/problems/path-with-maximum-gold/)

### 题目描述

你要开发一座金矿，地质勘测学家已经探明了这座金矿中的资源分布，并用大小为 m x n 的网格 grid 进行了标注。每个单元格中的整数表示这一单元格中的黄金数量；如果该单元格是空的，那么就是 0。

为了使收益最大化，你需要找出从启程单元格出发，沿着四个基本方向（上、下、左、右）挖掘的路线，使路线上的黄金总量最大。每次挖掘只能从一个单元格走到另一个相邻的单元格。

注意：挖掘路线不能重复经过任何一个单元格。

### 示例

示例 1：

输入：grid = [[0,6,0],[5,8,7],[0,9,0]]

输出：24

解释：路线为：9 → 8 → 7。

示例 2：

输入：grid = [[1,0,7],[2,0,6],[3,4,5],[0,3,0],[9,0,20]]

输出：28

解释：路线为：1 → 2 → 3 → 4 → 5 → 6 → 7。

### 解题思路

1.  优化起点：先遍历整个网格，收集所有有黄金（值>0）的坐标，仅从这些坐标开始DFS，避免无效遍历；

2.  四方向搜索：定义上下左右四个方向，每次递归尝试向四个方向移动；

3.  去重处理：用used二维数组标记已访问的单元格，防止走回头路；

4.  回溯核心：标记当前单元格为已访问 → 递归搜索四个方向 → 撤销标记（回溯）；

5.  最大值更新：每一步递归结束后，无论是否能继续搜索，都将当前收集的黄金总量与全局最大值比较，确保不遗漏最优路径。

### 完整代码（含原创注释）

```javascript
/**
 * 1219. 黄金矿工
 * 解法：DFS 回溯 + 网格四方向搜索
 * 思路：从每个有黄金的格子出发，四方向搜索，不走回头路，收集最大黄金数
 */
var getMaximumGold = function (grid) {
  // 网格行数
  const rows = grid.length;
  // 网格列数
  const cols = grid[0].length;
  // 上下左右四个方向
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // 用来存放所有有黄金的坐标 [row, col]
  const goldPosList = [];

  // 遍历整个网格，收集所有有黄金的位置
  // 优化：只从有黄金的地方开始DFS，避免无效遍历
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] > 0) {
        goldPosList.push([row, col]);
      }
    }
  }

  // 黄金位置总数
  const goldPosCount = goldPosList.length;
  // 没有黄金，直接返回 0
  if (goldPosCount === 0) return 0;

  // 记录最终答案：最大黄金数量
  let res = 0;
  // 标记格子是否走过，防止走回头路
  const used = Array.from({ length: rows }, () => new Array(cols).fill(false));

  // 遍历每一个有黄金的位置，作为起点开始 DFS
  for (let [row, col] of goldPosList) {
    // 标记当前起点已访问
    used[row][col] = true;
    // DFS：当前坐标、当前黄金总数、已经走了几步
    dfs(row, col, grid[row][col], 1);
    // 回溯：取消标记，准备下一个起点
    used[row][col] = false;
  }

  // 返回最大黄金数
  return res;

  // ==================== DFS 回溯核心 ====================
  // row, col：当前位置
  // curSum：当前收集的黄金总数
  // step：当前走了多少个黄金格子  走完这个格子，现在已经有的步数和价值
  function dfs(row, col, curSum, step) {
    // 遍历四个方向，尝试走下一步
    for (let [dr, dc] of dirs) {
      // 计算下一个位置坐标
      const nr = row + dr;
      const nc = col + dc;

      // 越界判断：出网格直接跳过
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      // 下一个格子的值
      const curVal = grid[nr][nc];
      // 如果已经走过 或者 没有黄金，不能走
      if (used[nr][nc] || curVal === 0) continue;

      // ==================== 回溯三步 ====================
      // 1. 标记已访问
      used[nr][nc] = true;
      // 2. 递归继续搜索
      dfs(nr, nc, curSum + curVal, step + 1);
      // 3. 撤销标记，回溯
      used[nr][nc] = false;
    }

    // 🔥 关键：
    // 无论能不能继续走，当前这条路径的黄金数都要参与比较
    // 因为可能走到尽头了，无法继续走，必须更新最大值
    res = Math.max(res, curSum);
  }
};
```

## 二、1849. 将字符串拆分为递减的连续值

### 题目信息

题号：1849. 将字符串拆分为递减的连续值

链接：[https://leetcode.cn/problems/splitting-a-string-into-descending-consecutive-values/](https://leetcode.cn/problems/splitting-a-string-into-descending-consecutive-values/)

### 题目描述

给你一个仅由数字组成的字符串 s ，请你判断能否将其拆分为两个或多个非空子字符串，使子字符串表示的数字按顺序严格递减，且每两个相邻子字符串表示的数字之间的差等于 1 。

例如，字符串 "1234" 可以拆分为 "123" 和 "4" ，但不能拆分为 "1" 和 "234" ，因为 234 - 1 = 233 ≠ 1 。

注意：子字符串可以有前导零吗？不可以，因为 leading zero 的数字是无效的（例如，"01" 不是一个有效的数字）。

### 示例

示例 1：

输入：s = "1234"

输出：false

解释：无法将 "1234" 拆分为两个或多个严格递减且相邻差为 1 的子字符串。

示例 2：

输入：s = "050043"

输出：true

解释：可以拆分为 ["05", "004", "3"] ，对应数字 5,4,3 ，满足严格递减且相邻差为 1 。注意 "05" 是 5 的有效表示，"004" 是 4 的有效表示。

### 解题思路

1.  字符串切割模板：从start位置开始，逐步切割子字符串，尝试所有可能的切割方式；

2.  核心判断：切割出的当前数字cur，需满足“前一个数字 - cur = 1”（即cur - 前一个数字 = -1），第一个数字无需判断；

3.  终止条件：当start等于字符串长度时，判断切割的段数是否大于1（至少两段才合法）；

4.  剪枝优化：若当前数字cur与前一个数字的差大于-1（即cur比前一个数字小不足1），后续切割只会让cur更大，直接break终止当前循环，提升效率；

5.  回溯核心：将当前数字加入路径 → 递归切割下一段 → 撤销路径（回溯）。

### 完整代码（含原创注释）

```javascript
/**
 * 1849. 将字符串拆分为递减的连续值
 * 解法：回溯 DFS + 字符串切割
 * 常规标准解法 ✅
 */
var splitString = function (s) {
  let res = false; // 最终结果：是否能合法拆分
  const path = []; // 回溯路径：存放已经切好的数字
  const n = s.length; // 字符串总长度
  dfs(0); // 从下标 0 开始切割

  return res;

  // ====================
  // 回溯 DFS 核心
  // start：从哪个位置开始切割
  // ====================
  function dfs(start) {
    if (res) return; // 已经找到答案，剪枝，不再搜索

    // 终止条件：整个字符串切割完毕（start 走到最后一位）
    if (start === n) {
      // 必须至少切成 2 段，才合法
      if (path.length > 1) res = true;
      return;
    }

    // 尝试在 i 位置切一刀
    for (let i = start; i < n; i++) {
      // 切割出 s[start ... i]，转成数字
      const cur = Number(s.slice(start, i + 1));

      // ====================
      // 情况1：路径为空（第一段）
      // 直接加入，不需要判断
      // 情况2：满足 后一个数 = 前一个数 - 1
      // ====================
      if (path.length === 0 || (path.length > 0 && cur - path.at(-1) === -1)) {
        path.push(cur); // 加入路径
        // console.log(cur) 打印这句能看到走过的痕迹
        dfs(i + 1); // 继续切后面
        if (res) return; // 找到答案直接退出
        path.pop(); // 回溯撤销
        continue; // 继续尝试下一刀
      }

      // ====================
      // 剪枝优化（非常关键）
      // 如果当前数字 比前一个数字 小太多（不止小1）
      // 再往后切只会更大，直接 break 停止
      // ====================
      const prev = path.at(-1);
      if (cur - prev > -1) {
        break;
      }
    }
  }
};
```

## 三、1593. 拆分字符串使唯一子字符串的数目最大

### 题目信息

题号：1593. 拆分字符串使唯一子字符串的数目最大

链接：[https://leetcode.cn/problems/split-a-string-into-the-max-number-of-unique-substrings/](https://leetcode.cn/problems/split-a-string-into-the-max-number-of-unique-substrings/)

### 题目描述

给你一个字符串 s ，请你拆分该字符串，并返回拆分后唯一子字符串的最大数目。

拆分定义：将字符串 s 拆分为若干个非空子字符串，并且每个子字符串都是唯一的。

注意：子字符串可以按任意顺序拆分，但拆分出来的子字符串必须覆盖整个字符串 s 。

### 示例

示例 1：

输入：s = "ababccc"

输出：5

解释：一种拆分方式为 ["a", "b", "ab", "c", "cc"] ，满足所有子字符串都是唯一的。

示例 2：

输入：s = "aa"

输出：1

解释：只能拆分为 ["aa"] ，因为 "a" 出现两次，无法拆分为两个唯一的子字符串。

### 解题思路

1.  字符串切割模板：从start位置开始，遍历所有可能的切割点i，切割出子字符串curStr；

2.  去重处理：用Set集合记录已出现的子字符串，若curStr已存在则跳过当前切割；

3.  最大值更新：当切割完整个字符串（start === n）时，用当前切割的段数更新全局最大值；

4.  优化简化：可将path数组（记录切割的子字符串）简化为step变量（记录切割段数），减少内存占用；

5.  回溯核心：将curStr加入Set → 递归切割下一段 → 从Set中删除curStr（回溯）。

### 完整代码（含原创注释，两种版本）

版本1（含path数组，可读性强）：

```javascript
var maxUniqueSplit = function (s) {
  let res = 0;
  const path = [];
  const used = new Set();
  const n = s.length;
  dfs(0);

  return res;

  function dfs(start) {
    if (start === n) {
      res = Math.max(res, path.length);
      return;
    }
    for (let i = start; i < n; i++) {
      const curStr = s.slice(start, i + 1);
      if (used.has(curStr)) continue;
      used.add(curStr);
      path.push(curStr);
      // console.log(path);
      dfs(i + 1);
      used.delete(curStr);
      path.pop();
    }
  }
};
```

版本2（简化path，用step计数，最优解）：

```javascript
/**
 * 1593. 拆分字符串使唯一子字符串的数目最大
 * 解法：回溯 DFS (最优解)
 * 思想：切割字符串，保证子串不重复，求最大分割数
 */
var maxUniqueSplit = function (s) {
  let res = 0; // 存储最终答案：最大的分割段数
  const used = new Set(); // 集合：记录已经分割出来的字符串（用于去重）
  const n = s.length; // 字符串总长度

  dfs(0, 0); // 开始DFS：从索引0开始，当前分割了0段
  return res;

  // ====================
  // 回溯核心函数
  // start: 下一次切割的起始位置
  // step: 当前已经分割了几段（用来计算最大值）
  // ====================
  function dfs(start, step) {
    // 1. 终止条件：切割到了字符串末尾
    if (start === n) {
      // 更新最大值
      res = Math.max(res, step);
      return;
    }

    // 2. 遍历切割：尝试在 i 位置切一刀
    for (let i = start; i < n; i++) {
      // 3. 切割出当前字符串
      const curStr = s.slice(start, i + 1);

      // 4. 剪枝：如果字符串已经用过，直接跳过
      if (used.has(curStr)) continue;

      // 5. 回溯标准操作
      used.add(curStr); // 标记使用
      dfs(i + 1, step + 1); // 递归：切下一段，段数+1
      used.delete(curStr); // 撤销：回溯
    }
  }
};
```

## 四、1079. 活字印刷

### 题目信息

题号：1079. 活字印刷

链接：[https://leetcode.cn/problems/letter-tile-possibilities/](https://leetcode.cn/problems/letter-tile-possibilities/)

### 题目描述

你有一套活字字模 tiles，其中每个字模上都刻有一个字母 tiles[i]。返回你可以印出的非空字母序列的数目。

注意：本题中，每个活字字模只能使用一次。

### 示例

示例 1：

输入：tiles = "AAB"

输出：8

解释：可能的序列为 "A", "B", "AA", "AB", "BA", "AAB", "ABA", "BAA"。

示例 2：

输入：tiles = "AAABBC"

输出：188

### 解题思路

1.  排列问题特性：每个字模只能用一次，属于排列问题，需用used数组标记已使用的字模；

2.  去重处理：tiles中可能有重复字母，需先排序（让相同字母挨在一起），再通过同层去重避免重复序列；

3.  结果收集：题目要求非空序列，因此只要当前排列长度step>0，就计数一次（无需等排列完所有字模）；

4.  回溯核心：标记当前字模为已使用 → 递归搜索下一个字模 → 撤销标记（回溯）；

5.  同层去重：若当前字母与前一个字母相同，且前一个字母未被使用（说明是同层重复选择），直接跳过。

### 完整代码（含原创注释）

```javascript
/**
 * 1079. 活字印刷
 * 题意：给出字符 tiles，返回所有 非空 不重复 排列 的数量
 * 解法：回溯 + 排序去重 + 统计所有长度的结果
 * 你的代码 = 标准最优解 ✅
 */
var numTilePossibilities = function (tiles) {
  // 先排序！目的：让相同字符挨在一起，方便后续去重
  tiles = tiles.split('').sort().join('');
  let res = 0; // 最终答案：所有合法排列数量
  const n = tiles.length; // 字符总长度
  const used = new Array(n).fill(false); // 标记字符是否用过

  dfs(0); // 从 0 步开始搜索

  return res;

  // ====================
  // 回溯核心 DFS
  // step：当前排列长度
  // ====================
  function dfs(step) {
    // 这个条件可以删掉，因为题目允许 1~n 长度，不只是完整长度
    // if (step === n) {
    //   res++;
    //   return;
    // }

    // 🔥 核心：只要 step > 0，就说明当前是一个合法的非空排列，必须计数！
    // 因为答案包含：长度1、长度2 ... 长度n 的所有结果
    if (step > 0) res++;

    // 遍历所有字符
    for (let i = 0; i < n; i++) {
      if (used[i]) continue; // 当前字符已经用过，不能重复用

      // 🔥 核心去重：
      // 当前字符 和 前一个一样，且前一个没被使用 → 说明是同层重复选择，直接跳过
      if (i > 0 && tiles[i] === tiles[i - 1] && !used[i - 1]) {
        continue;
      }

      // 标准回溯三件套
      used[i] = true; // 标记使用
      dfs(step + 1); // 进入下一层，长度+1
      used[i] = false; // 回溯撤销
    }
  }
};
```

## 五、996. 正方形数组的数目

### 题目信息

题号：996. 正方形数组的数目

链接：[https://leetcode.cn/problems/number-of-squareful-arrays/](https://leetcode.cn/problems/number-of-squareful-arrays/)

### 题目描述

给定一个非负整数数组 A，如果该数组每对相邻元素之和是一个完全平方数，则称这一数组为正方形数组。

返回满足条件的所有排列的数目。两个排列不同的充要条件是存在至少一个位置上的元素不同。

### 示例

示例 1：

输入：nums = [1,17,8]

输出：2

解释：[1,8,17] 和 [17,8,1] 都是正方形数组，因为 1+8=9=3²，8+17=25=5²，1+17=18 不是完全平方数。

示例 2：

输入：nums = [2,2,2]

输出：1

### 解题思路

1.  排列问题特性：数组元素可重复，属于带重复元素的排列问题，需用used数组标记已使用元素，且先排序进行同层去重；

2.  核心条件：相邻两个元素之和必须是完全平方数，需单独写辅助函数判断完全平方数；

3.  参数传递：需在DFS中传递prev（上一个选择的元素），用于判断当前元素与上一个元素的和是否为完全平方数；

4.  终止条件：当step（当前选择的元素个数）等于数组长度时，说明找到一个合法排列，计数加1；

5.  同层去重：若当前元素与前一个元素相同，且前一个元素未被使用（同层重复选择），直接跳过。

### 完整代码（含原创注释）

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 * - 排列 必须使用used
 * - 有重复元素 必须排序  且同层必须去重
 * - 因为是全排列 所以是n的时候 才收集 dfs需要传递step
 * - 需要知道上一个值 所以dfs存储 prev
 *
 */
/**
 * 996. 正方形数组的数目（困难）
 * 解法：排列回溯 + 去重 + 相邻和为完全平方数判断
 * 核心：求满足相邻两数之和是完全平方数的 不重复排列数量
 */
var numSquarefulPerms = function (nums) {
  // 1. 排序：必须排序！为了让相同数字挨在一起，方便后续同层去重
  nums.sort((x, y) => x - y);

  let res = 0; // 最终答案：合法排列的总数
  const n = nums.length; // 数组长度
  const used = new Array(n).fill(false); // 标记元素是否被使用（排列必备）

  // 开始回溯：
  // step = 当前选了几个数
  // prev = 上一个选的数（用来判断和是否为平方数）
  dfs(0, 0);

  return res;

  // ====================
  // 回溯核心函数
  // step: 当前已选择的数字个数
  // prev: 上一个选择的数字（相邻判断用）
  // ====================
  function dfs(step, prev) {
    // 终止条件：已经选满了所有数字 → 找到一个合法排列
    if (step === n) {
      res++; // 答案 +1
      return;
    }

    // 排列回溯：每层都从头遍历所有元素
    for (let i = 0; i < n; i++) {
      // 去重条件1：当前数字已经被使用过 → 跳过（排列不能重复选同一个位置）
      if (used[i]) continue;

      const cur = nums[i]; // 当前要选的数字

      // 🔥 核心去重：同层去重（解决重复数字导致的重复排列）
      // 如果当前数字和前一个相同，且前一个没被使用 → 说明是同层重复选择，直接跳过
      if (i > 0 && nums[i - 1] === cur && !used[i - 1]) {
        continue;
      }

      // 🔥 核心条件：非第一个数字时，必须满足【当前数 + 上一个数 = 完全平方数】
      // step === 0 是第一个数，不需要判断 注意是step
      if (step > 0 && !isPerfectSquare(cur + prev)) {
        continue;
      }

      // ==================== 回溯标准三件套 ====================
      used[i] = true; // 1. 标记当前数字已使用
      dfs(step + 1, cur); // 2. 递归：选下一个数字，步数+1，当前数变成上一个数
      used[i] = false; // 3. 回溯撤销：取消标记
    }
  }
};

/**
 * 辅助函数：判断一个数是否是完全平方数
 * 原理：开平方后是整数，就是完全平方数
 */
function isPerfectSquare(num) {
  const sqrtNum = Math.sqrt(num); // 开平方
  return sqrtNum === Math.floor(sqrtNum); // 判断是否为整数
}
```

## 六、784. 字母大小写全排列

### 题目信息

题号：784. 字母大小写全排列

链接：[https://leetcode.cn/problems/letter-case-permutation/](https://leetcode.cn/problems/letter-case-permutation/)

### 题目描述

给定一个字符串 s ，通过将字符串 s 中的每个字母转变大小写，我们可以获得一个新的字符串。返回所有可能得到的字符串集合。

注意：返回的集合中的字符串不区分顺序。

### 示例

示例 1：

输入：s = "a1b2"

输出：["a1b2", "a1B2", "A1b2", "A1B2"]

示例 2：

输入：s = "3z4"

输出：["3z4", "3Z4"]

### 解题思路

1.  顺序处理特性：按字符串索引顺序处理每个字符，无需for循环枚举选择（每个位置只有1-2种选择）；

2.  分支选择：数字只能直接拼接，字母有两种选择（小写、大写），分别递归处理；

3.  结果收集：当处理完所有字符（start === n）时，将当前拼接的字符串加入结果集；

4.  回溯简化：无需额外的回溯撤销操作，通过递归参数curStr传递当前拼接结果，天然实现回溯；

5.  效率优化：无多余循环和剪枝，每个字符仅处理一次，时间复杂度为O(2^k)（k为字符串中字母的个数）。

### 完整代码（含原创注释）

```javascript
/**
 * 784. 字母大小写全排列
 * 解法：DFS 回溯（无循环，直接分支）
 * 思路：
 * 1. 这是组合/遍历型 DFS，用 start 标记当前处理到第几个字符
 * 2. 数字直接拼接，字母分大小写两条路
 * 3. 不用 for 循环！因为每个位置只有固定选择，不是多选一
 * 4. 走到 start === n 收集答案
 *
 * @param {string} s
 * @return {string[]}
 */
var letterCasePermutation = function (s) {
  const n = s.length; // 字符串长度
  const res = []; // 存放最终结果

  dfs(0, ''); // 从第 0 位开始，当前字符串为空
  return res;

  // ====================
  // DFS 核心
  // start：当前处理到第几个字符
  // curStr：已经拼接好的当前字符串
  // ====================
  function dfs(start, curStr) {
    // 终止条件：处理完所有字符 → 收集答案
    if (start === n) {
      res.push(curStr);
      return;
    }

    const char = s[start]; // 取出当前要处理的字符

    // ====================
    // 情况 1：当前是数字 → 只能直接拼接，继续往后走
    // ====================
    if (/[0-9]/.test(char)) {
      dfs(start + 1, curStr + char);
    }

    // ====================
    // 情况 2：当前是字母 → 分两条路：
    // 1. 小写
    // 2. 大写
    // 没有循环，直接写两个递归！
    // ====================
    if (/[a-zA-Z]/.test(char)) {
      dfs(start + 1, curStr + char.toLocaleLowerCase());
      dfs(start + 1, curStr + char.toLocaleUpperCase());
    }
  }
};
```

## 七、638. 大礼包

### 题目信息

题号：638. 大礼包

链接：[https://leetcode.cn/problems/shopping-offers/](https://leetcode.cn/problems/shopping-offers/)

### 题目描述

在 LeetCode 商店中， 有 n 件在售的物品。每件物品都有对应的价格。然而，也有一些大礼包，每个大礼包以优惠的价格捆绑销售一组物品。

给你一个整数数组 price 表示物品价格，其中 price[i] 是第 i 件物品的价格。另有一个整数数组 needs 表示购物清单，其中 needs[i] 是需要购买第 i 件物品的数量。

还有一个数组 special 表示大礼包，special[i] 是一个数组，其中 special[i][j] 表示第 i 个大礼包中包含第 j 件物品的数量，special[i][n] 是这个大礼包的价格。

返回 满足购物清单所需花费的最低价格 。你可以充分利用大礼包的优惠，也可以不使用任何大礼包，只购买单品。

注意：大礼包的数量没有限制。

### 示例

示例 1：

输入：price = [2,5], special = [[3,0,5],[1,2,10]], needs = [3,2]

输出：14

解释：有两种购买方式：

1. 买 1 个大礼包 [3,0,5] 和 2 个单品 5 → 5 + 2\*5 = 15

2. 买 2 个大礼包 [1,2,10] → 2\*10 = 14（最优）

示例 2：

输入：price = [2,3,4], special = [[1,1,0,4],[2,2,1,9]], needs = [1,2,1]

输出：11

### 解题思路

1.  初始值设置：先计算全部购买单品的价格，作为初始最低价格；

2.  组合回溯特性：每个大礼包有两种选择（使用/不使用），属于组合问题，用start控制当前遍历的礼包索引；

3.  礼包使用条件：判断当前礼包中每种物品的数量加上已购买的数量，是否不超过需求数量，超过则不能使用；

4.  重复使用：礼包可以重复购买，因此使用礼包后，start不递增（继续判断当前礼包）；不使用礼包则start递增（遍历下一个礼包）；

5.  终止条件：当遍历完所有礼包（start === n）时，计算剩余未购买的物品按单品价格购买的总费用，更新全局最低价格；

6.  回溯简化：通过传递curOwnedList（当前已购买物品数量）的副本，避免全局修改，天然实现回溯。

### 完整代码

```javascript
/**
 * 638. 大礼包
 * 解法：回溯 DFS（组合型，无for循环，二分支选择）
 * 核心思路：
 * 1. 每个礼包只有两个选择：用 / 不用
 * 2. 不用：直接往后走 start+1
 * 3. 能用：可以重复用，保持 start 不动
 * 4. 最后全部礼包遍历完，补差价算总价
 * 5. 全程记录最小值
 */

var shoppingOffers = function (price, special, needs) {
  const n = special.length; // 大礼包总数
  const typeCount = needs.length; // 商品种类数
  // 初始最小值：全部单品购买的价格
  let min = needs.reduce((acc, count, i) => count * price[i] + acc, 0);

  // start：当前遍历到第几个礼包 total：当前已花的钱 curOwnedList：当前已经买到的商品数量
  dfs(0, 0, new Array(typeCount).fill(0));

  return min;

  function dfs(start, total, curOwnedList) {
    // 终止条件：所有礼包都判断完了
    if (start === n) {
      // 计算：还差多少商品，按原价买
      const needCost = curOwnedList.reduce((acc, ownCount, index) => {
        return acc + (needs[index] - ownCount) * price[index];
      }, 0);
      // 更新最小花费
      min = Math.min(min, total + needCost);
      return;
    }

    // 组合的时候 这里其实心里想象一个多叉树， 用不用大礼包
    // 能用可以有一个用的分支 不用就走不用的分支
    // 最多每次两个选项，不会用到for的
    const curS = special[start]; // 当前礼包
    let temp = [...curOwnedList]; // 买了当前礼包后的数量

    // ====================
    // 判断：当前礼包能不能买
    // ====================
    const canUse = (() => {
      let res = true;
      for (let i = 0; i < typeCount; i++) {
        // 买了之后超过需要的数量 → 不能买
        const curCount = curS[i] + curOwnedList[i];
        if (curCount > needs[i]) {
          res = false;
          break;
        }
        temp[i] = curCount;
      }
      if (!res) temp = curOwnedList;
      return res;
    })();

    // ====================
    // 分支 1：不使用当前礼包 → 往后走
    // ====================
    dfs(start + 1, total, curOwnedList);

    // ====================
    // 分支 2：可以使用 → 用当前礼包（可重复使用，所以 i 不变）
    // ====================
    if (canUse) {
      dfs(start, total + curS.at(-1), temp);
    }
  }
};
```

## 总结

回溯算法的核心是“遍历所有可能，撤销无效选择”，本次8道练习题覆盖了回溯的主流题型（网格、切割、排列、组合、分支），每道题的思路和代码都围绕“回溯模板”展开，仅根据题型特点调整去重方式、终止条件和剪枝逻辑。

重点记住：排列用used、重复先排序、子集用start、分支无循环，掌握这些技巧，就能轻松应对大多数回溯面试题。后续可通过更多练习巩固剪枝优化和复杂条件判断，进一步提升解题效率。
