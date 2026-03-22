# 吃透回溯算法：从框架到实战

回溯算法本质就是在一棵**决策树**上做暴力穷举，看似题型繁多、变化复杂，实则有一套万能框架可以一网打尽。

本文会用最直白的思路 + 可直接运行的 JS 代码，带你从零吃透回溯：子集、组合、排列、去重、可复选、数独、N 皇后全部覆盖。

![sum](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e44c5d7bdd8f4370b8fcf4f255615290~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?rk3s=f64ab15b&x-expires=1774746923&x-signature=NVzs5ir0HqBoQ%2BDMvVj4w7lEEM4%3D)

## 一、回溯算法核心框架

站在回溯树的任意一个节点上，你只需要想清楚 3 件事：

1. **路径**：已经做出的选择

2. **选择列表**：当前还能做哪些选择

3. **结束条件**：到达底层，无法再选择

通用代码框架：

```Python

result = []
def backtrack(路径, 选择列表):
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:
        # 做选择
        将该选择从选择列表移除
        路径.add(选择)
        backtrack(路径, 选择列表)
        # 撤销选择
        路径.remove(选择)
        将该选择再加入选择列表
```

对应到多叉树遍历：

```JavaScript

var traverse = function (root) {
  for (var i = 0; i < root.children.length; i++) {
    // 前序位置需要的操作
    traverse(root.children[i]);
    // 后序位置需要的操作
  }
};
```

---

## 二、经典例题实战

### 46. 全排列（无重不可复选）

用过的数字不能再用，需要 `used` 标记。

```JavaScript

// 功能：求数组 nums 的全排列（所有不重复的排列组合）
var permute = function (nums) {
  // 1. 定义变量
  const n = nums.length; // 数组长度，用来判断什么时候排列满了
  const used = new Array(n).fill(false); // 标记：数字有没有被用过
  // used = [false, false, false] 表示 1、2、3 都没用过
  const path = []; // 路径：当前正在拼的排列（比如 [1,2]）
  const res = []; // 结果：存放所有最终排列

  // 2. 开始回溯
  backtrack();

  // 3. 返回结果
  return res;

  // ==================== 回溯核心函数 ====================
  function backtrack() {
    // 终止条件：如果路径长度 == 数组长度，说明排列完成！
    if (path.length === n) {
      res.push([...path]); // 把当前排列放进结果（浅拷贝）
      return; // 结束这层递归
    }

    // 遍历所有数字：挨个尝试选哪个数字
    for (let i = 0; i < n; i++) {
      // 如果这个数字已经用过了 → 跳过（不能重复选）
      if (used[i]) continue;

      // ========== 1. 做选择 ==========
      path.push(nums[i]); // 把数字放进当前路径
      used[i] = true; // 标记：这个数字我用过啦

      // ========== 2. 递归 ==========
      // 继续选下一个数字（进入下一层）
      backtrack();

      // ========== 3. 撤销选择（回溯！） ==========
      used[i] = false; // 取消标记：这个数字可以被别人选了
      path.pop(); // 把数字从路径里删掉 → 回到上一步
    }
  }
};
```

---

### n 位二进制数的所有可能

每一位都可以选 0/1，天然可复选。

```JavaScript

var generateBinaryNumber = function (n) {
  // used[i][j] i表示第几步 j表示0 1 值表示是否使用
  const used = Array.from({ length: n }, () => new Array(2).fill(false));
  const res = [];
  const path = [];

  backtrack();
  return res;

  function backtrack() {
    if (path.length === n) {
      res.push([...path]);
    }
    const curStepIndex = path.length;
    for (let i = 0; i <= 1; i++) {
      if (used[curStepIndex][i]) {
        continue;
      }
      path.push(i);
      used[curStepIndex][i] = true;
      backtrack();
      path.pop();
      used[curStepIndex][i] = false;
    }
  }
};
```

---

### 37. 解数独（Hard）

暴力填数 + 剪枝，找到解立刻返回。

```JavaScript

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
emptyList：先把所有空格找出来，按顺序填
三个Set：快速判断数字能不能填（剪枝）
return true：找到了！一路向上终止递归
return false：此路不通！退回去换数字
 */
// 功能：解数独（回溯算法 Hard 题）
// 核心思想：暴力枚举 + 剪枝 + 回溯（选择 → 递归 → 撤销）
var solveSudoku = function (board) {
  // 存放所有空位置（二维坐标）：[[行,列], [行,列]...]
  let emptyList = [];
  const n = 9; // 数独固定 9x9

  // 三个 Set 用来快速判断：数字是否在 行/列/九宫格 中出现过
  // rowIdxToVaList[row] 表示第 row 行已经有哪些数字
  const rowIdxToVaList = new Array(n).fill(0).map(() => new Set());
  // colIdxToVaList[col] 表示第 col 列已经有哪些数字
  const colIdxToVaList = new Array(n).fill(0).map(() => new Set());
  // gridIdxToVaList[gridIdx] 表示第几个 3x3 九宫格已经有哪些数字
  const gridIdxToVaList = new Array(n).fill(0).map(() => new Set());

  // 工具函数：计算 (row, col) 属于第几个 3x3 九宫格（0~8）
  // 原理：把 9 个九宫格看成 3x3 矩阵 → 二维转一维
  const getGridIdx = (row, col) => {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  };

  // ==================== 第一步：初始化棋盘 ====================
  // 遍历整个 9x9 数独
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // 如果当前位置是空的，记录坐标
      if (board[row][col] === '.') {
        emptyList.push([row, col]);
        continue;
      }
      // 把棋盘上的字符串数字转成 Number 类型
      const curVal = Number(board[row][col]);

      // 获取当前位置属于哪个九宫格
      const gridIdx = getGridIdx(row, col);
      // 把数字分别加入 行、列、九宫格 的 Set 中
      rowIdxToVaList[row].add(curVal);
      colIdxToVaList[col].add(curVal);
      gridIdxToVaList[gridIdx].add(curVal);
    }
  }

  // 空格总数，用来判断什么时候填完
  const emptyCount = emptyList.length;
  // 当前正在填第几个空格（从第 0 个开始）
  let curEmptyIdx = 0;

  // 开始回溯
  backtrack();
  return;

  // ==================== 核心回溯函数 ====================
  // 返回值：boolean
  // true  = 找到解了，直接终止所有递归
  // false = 此路不通，需要回溯
  function backtrack() {
    // 终止条件：当前已经填完了所有空格 → 找到唯一解！
    if (curEmptyIdx === emptyCount) {
      return true;
    }

    // 取出当前要填的空格坐标：行、列
    const [row, col] = emptyList[curEmptyIdx];
    // 计算当前空格属于哪个九宫格
    const gridIdx = getGridIdx(row, col);

    // 尝试往这个空格填入 1~9
    for (let i = 1; i <= 9; i++) {
      const curVal = i;

      // ==================== 剪枝 ====================
      // 如果这个数字在 行、列、九宫格 中已经存在 → 跳过，不能填
      if (
        rowIdxToVaList[row].has(curVal) ||
        colIdxToVaList[col].has(curVal) ||
        gridIdxToVaList[gridIdx].has(curVal)
      ) {
        continue;
      }

      // ==================== 1. 做选择 ====================
      // 往数独棋盘填入数字
      board[row][col] = i + '';
      // 把这个数字标记为：已使用
      rowIdxToVaList[row].add(curVal);
      colIdxToVaList[col].add(curVal);
      gridIdxToVaList[gridIdx].add(curVal);
      // 准备填下一个空格
      curEmptyIdx++;

      // ==================== 2. 递归（填下一个空格） ====================
      // 接收下一层递归的返回值
      const isFound = backtrack();
      // 如果下一层返回 true → 说明后面全部填完了，找到解了
      if (isFound) {
        return true; // 一路向上 return true，直接结束所有递归
      }

      // ==================== 3. 撤销选择（回溯核心） ====================
      // 代码走到这里 = 刚才填的数字不对，后面走不通了
      // 把数字从棋盘擦掉
      board[row][col] = '.';
      // 从 Set 中删除（取消标记）
      rowIdxToVaList[row].delete(curVal);
      colIdxToVaList[col].delete(curVal);
      gridIdxToVaList[gridIdx].delete(curVal);
      // 回到当前这个空格，继续尝试下一个数字
      curEmptyIdx--;
    }

    // ==================== 4. 所有数字都试过了，都不行 ====================
    // 说明上一步填错了 → 返回 false，让上一层回溯
    return false;
  }
};
```

---

### 51. N 皇后（Hard）

按行放置，标记列和两条斜线即可。

```JavaScript

var solveNQueens = function (n) {
  const res = []; // 存放所有解法

  // 标记：列是否被占用
  const colUsed = new Array(n).fill(false);
  // 标记：左上 -> 右下 斜线（row + col）
  const leftTopUsed = new Array(2 * n - 1).fill(false);
  // 标记：右上 -> 左下 斜线（row - col + n -1）
  const rightBottomTopUsed = new Array(2 * n - 1).fill(false);

  const path = []; // 记录每一行皇后放在第几列

  // 从第 0 行开始放
  backtrack(0);

  return res;

  // ==================== 回溯核心 ====================
  function backtrack(curRow) {
    // 终止条件：所有行都放完皇后 → 得到一个解
    if (curRow === n) {
      // 转换成要求的输出格式
      res.push([...path].map(id => '.'.repeat(id) + 'Q' + '.'.repeat(n - id - 1)));
      return; // 找到解，向上传递，停止递归
    }

    // 尝试在当前行的每一列放皇后
    for (let col = 0; col < n; col++) {
      // 计算当前位置所在的两条斜线 ID
      const ltId = curRow + col;
      const rbId = curRow - col + n - 1;

      // 剪枝：列 / 斜线 任意一个被占用，都不能放
      if (colUsed[col] || leftTopUsed[ltId] || rightBottomTopUsed[rbId]) {
        continue;
      }

      // ========== 1. 做选择 ==========
      path.push(col);
      colUsed[col] = true;
      leftTopUsed[ltId] = true;
      rightBottomTopUsed[rbId] = true;

      // ========== 2. 递归放下一行 ==========
      backtrack(curRow + 1);
      // const canFill = backtrack(curRow + 1);
      // if (canFill) return true; // 找到解，直接返回

      // ========== 3. 撤销选择（回溯） ==========
      path.pop();
      colUsed[col] = false;
      leftTopUsed[ltId] = false;
      rightBottomTopUsed[rbId] = false;
    }

    // 当前行所有列都不行 → 回溯
    return;
  }
};
```

---

## 三、排列组合子集三大变体

从数组中按规则取元素，一共 3 种核心变体：

1. **无重不可复选**：元素唯一，只能用一次

2. **可重不可复选**：元素可重复，只能用一次

3. **无重可复选**：元素唯一，可用多次

---

## 四、子集/组合/排列 全题型代码

### 1. 子集（无重不可复选）78

每个节点都是一个子集，进来就收集。

```JavaScript

// 核心思想：回溯 + 不回头（只能往后选，避免重复）
var subsets = function (nums) {
  // 数组长度，比如 [1,2,3] 长度是 3
  const n = nums.length;

  // res：存放最终所有子集（答案）
  const res = [];

  // path：记录当前正在拼接的子集（路径）
  const path = [];

  // 从第 0 个元素开始选
  backtrack(0);

  // 返回所有子集
  return res;

  // ==================== 回溯核心函数 ====================
  // start：表示从哪个索引开始选（保证只能往后，不回头） 表示可选择的元素
  function backtrack(start) {
    // ✅ 关键：每个节点都是一个子集！进来就先收集！
    // [...path] 是拷贝一份，防止原数组被修改
    res.push([...path]);

    // 循环：从 start 开始往后选，绝对不回头！
    // i 是当前选中的元素索引
    for (let i = start; i < n; i++) {
      // 1. 做选择：把当前元素放进子集
      path.push(nums[i]);

      // 2. 递归：继续往下选，只能从 i+1 开始（不回头）
      backtrack(i + 1);

      // 3. 撤销选择（回溯）：把刚才放进去的元素拿掉
      // 回到上一步，尝试下一个元素
      path.pop();
    }
  }
};
```

---

### 2. 组合（无重不可复选）

长度够了才收集，直接剪枝。

```JavaScript

// 核心思想：回溯 + 不回头（只能往后选，避免重复）
var combine = function (nums) {
  // 数组长度，比如 [1,2,3] 长度是 3
  const n = nums.length;

  // res：存放最终所有子集（答案）
  const res = [];

  // path：记录当前正在拼接的子集（路径）
  const path = [];

  // 从第 0 个元素开始选
  backtrack(0);

  // 返回所有子集
  return res;

  // ==================== 回溯核心函数 ====================
  // start：表示从哪个索引开始选（保证只能往后，不回头） 表示可选择的元素
  function backtrack(start) {
    // 🔥就这里改下，长度够了收集就行
    if (path.length === n) {
      res.push([...path]);
      return;
    }

    // 循环：从 start 开始往后选，绝对不回头！
    // i 是当前选中的元素索引
    for (let i = start; i < n; i++) {
      // 1. 做选择：把当前元素放进子集
      path.push(nums[i]);

      // 2. 递归：继续往下选，只能从 i+1 开始（不回头）
      backtrack(i + 1);

      // 3. 撤销选择（回溯）：把刚才放进去的元素拿掉
      // 回到上一步，尝试下一个元素
      path.pop();
    }
  }
};
```

---

### 77. 组合（从 1~n 选 k 个）

```JavaScript

// LeetCode 77. 组合（从 1~n 中选出 k 个数的所有组合）
// 核心：子集的微改版 → 长度够 k 才收集
var combine = function (n, k) {
  // 存放最终所有组合结果
  const res = [];
  // 记录当前正在拼接的路径
  const path = [];

  // 从数字 1 开始选
  backtrack(1);
  return res;

  // ==================== 回溯核心 ====================
  // start：从哪个数字开始选（保证不回头、不重复）
  function backtrack(start) {
    // 🔥 核心区别：只有路径长度达到 k，才收集结果
    if (path.length === k) {
      res.push([...path]);
      return; // 🔥 剪枝：已经够长了，不用继续往下递归
    }

    // 只能从 start 往后选，绝对不回头
    for (let i = start; i <= n; i++) {
      // 1. 选择当前数字
      path.push(i);

      // 2. 递归：下一个数字只能从 i+1 开始选
      backtrack(i + 1);

      // 3. 撤销选择（回溯）
      path.pop();
    }
  }
};
```

---

### 3. 子集/组合（可重不可复选）90

先排序，同层相同数字跳过。

```JavaScript

// 核心思想：回溯 + 不回头（只能往后选，避免重复）
var subsets = function (nums) {
  // 🔥这里加个排序，相同的就在一起
  nums.sort((x, y) => x - y);
  // 数组长度，比如 [1,2,3] 长度是 3
  const n = nums.length;

  // res：存放最终所有子集（答案）
  const res = [];

  // path：记录当前正在拼接的子集（路径）
  const path = [];

  // 从第 0 个元素开始选
  backtrack(0);

  // 返回所有子集
  return res;

  // ==================== 回溯核心函数 ====================
  // start：表示从哪个索引开始选（保证只能往后，不回头） 表示可选择的元素
  function backtrack(start) {
    // 切换子集和组合题的关键
    // res.push([...path]);
    // 🔥 组合的话就是长度够了收集 然后不用往下走了
    if (path.length === n) {
      res.push([...path]);
      return;
    }

    // 循环：从 start 开始往后选，绝对不回头！
    // i 是当前选中的元素索引
    for (let i = start; i < n; i++) {
      // 🔥这里同一层相同的跳过
      if (i > start && nums[i] === nums[i - 1]) continue;
      // 1. 做选择：把当前元素放进子集
      path.push(nums[i]);

      // 2. 递归：继续往下选，只能从 i+1 开始（不回头）
      backtrack(i + 1);

      // 3. 撤销选择（回溯）：把刚才放进去的元素拿掉
      // 回到上一步，尝试下一个元素
      path.pop();
    }
  }
};
```

---

### 4. 排列（可重不可复选）47

排序 + `!used[i-1]` 只跳过同层重复。

```JavaScript

var permute = function (nums) {
  // 🔥这里加个排序，相同的就在一起
  nums.sort((x, y) => x - y);
  const n = nums.length;
  const used = new Array(n).fill(false); // ✅ 标记用过没
  const res = [];
  const path = [];

  backtrack();
  return res;

  function backtrack() {
    // 长度够了才收集
    if (path.length === n) {
      res.push([...path]);
      return;
    }

    // ✅ 排列核心：每次从头开始选（i=0）
    for (let i = 0; i < n; i++) {
      if (used[i]) continue; // ✅ 用过就跳过
      // 🔥 used[i - 1] === false表示前一个相同数字，刚在【同一层】用完、撤销了。想象 1 2 2  第一个2使用完之后used[2]=false 第二个2需要跳过
      if (i > 0 && nums[i] === nums[i - 1] && used[i - 1] === false) continue;

      path.push(nums[i]);
      used[i] = true; // ✅ 标记使用

      backtrack(); // ✅ 继续递归

      path.pop(); // ✅ 撤销
      used[i] = false; // ✅ 取消标记
    }
  }
};
```

---

### 5. 组合总和（无重可复选）39

可以重复选自己，递归传 `i`。

```JavaScript

var combinationSum = function (candidates, target) {
  const n = candidates.length;
  const res = [];
  let curSum = 0;
  const path = [];

  // 不重复的 就索引既定，因为前面的数字的情况已经尝试完了
  backtrack(0);

  return res;
  function backtrack(start) {
    // 🔥 条件达到 收
    if (curSum === target) {
      res.push([...path]);
      return;
    }
    // 🔥 和大于的话 也不用走了 死路一条
    if (curSum > target) {
      return;
    }
    for (let i = start; i < n; i++) {
      const cur = candidates[i];
      // 选择
      path.push(cur);
      curSum += cur;
      // 🔥继续往下，这条路往下找到了 往后 死路了也往回 因为可以复选 所以从自己开始。这是i本身就在往后走了。
      backtrack(i);

      // 但是这里表示这个数字完事了 换下一个
      path.pop();
      curSum -= cur;
    }
  }
};
```

推荐写法：`curSum` 用参数传递，更干净。

```JavaScript

var combinationSum = function (candidates, target) {
  const n = candidates.length;
  const res = [];
  let curSum = 0;
  const path = [];

  // 不重复的 就索引既定，因为前面的数字的情况已经尝试完了
  backtrack(0, 0);

  return res;
  function backtrack(start, curSum) {
    // 🔥 条件达到 收
    if (curSum === target) {
      res.push([...path]);
      return;
    }
    // 🔥 和大于的话 也不用走了 死路一条
    if (curSum > target) {
      return;
    }
    for (let i = start; i < n; i++) {
      const cur = candidates[i];
      // 选择
      path.push(cur);
      // 继续往下，这条路往下找到了 往后 死路了也往回 因为可以复选 所以从自己开始。这是i本身就在往后走了。
      backtrack(i, curSum + cur);

      // 但是这里表示这个数字完事了 换下一个
      path.pop();
    }
  }
};
```

---

### 6. 排列（无重可复选）

可复选 → 不需要 `used`。

```JavaScript

// 排列：用过的就不能用了，没用过的都能选！
var permute = function (nums) {
  // 名字改对就行
  const n = nums.length;
  // const used = new Array(n).fill(false); // ✅ 标记用过没
  const res = [];
  const path = [];

  backtrack();
  return res;

  function backtrack() {
    // 长度够了才收集
    if (path.length === n) {
      res.push([...path]);
      return;
    }

    // ✅ 排列核心：每次从头开始选（i=0）
    for (let i = 0; i < n; i++) {
      // if (used[i]) continue; // ✅ 用过就跳过

      path.push(nums[i]);
      // used[i] = true; // ✅ 标记使用

      backtrack(); // ✅ 继续递归

      path.pop(); // ✅ 撤销
      // used[i] = false; // ✅ 取消标记
    }
  }
};
```

---

## 五、核心总结

1. **子集/组合**：用 `start` 不回头，避免重复组合

2. **排列**：从头遍历，用 `used` 防重

3. **元素可重**：排序 + 同层去重

4. **可复选**：递归传 `i`，不用 `used`

5. **路径**：数组用 `push + pop`，数字可传参

掌握这套思路，LeetCode 所有回溯题都可以直接套框架秒杀。
