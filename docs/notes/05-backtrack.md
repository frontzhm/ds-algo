# 回溯算法：选→钻→退→删，掌握穷举的艺术

回溯算法是算法领域的核心思想之一，尤其在处理「穷举所有可能解」的问题时堪称"神器"。本文将从核心思路出发，通过"选一个数→钻到底→退回来→删掉这个数→选下一个数→再钻到底"这个固定节奏，带你彻底掌握回溯算法。

## 一、回溯核心原理：选→钻→退→删的固定节奏

### 一句话记牢回溯的执行过程

**选一个数→钻到底→退回来→删掉这个数→选下一个数→再钻到底，直到所有数都试完，最后收集所有符合条件的路径。**

选了就往下钻，走不通就退回来擦脚印，换条路再试。很多人一开始都会被递归的多层调用绕晕，但只要抓住 **push（选数）→ 递归（钻深层）→ pop（擦脚印）** 这个固定节奏，再结合剪枝提前止损，所有回溯题都能套模板解决～

### 核心四要素

任何回溯问题都能拆解为以下4个核心部分：

| 要素         | 作用                                     | 示例（组合总和）                     |
| ------------ | ---------------------------------------- | ------------------------------------ |
| **路径**     | 已经做出的选择（比如选了哪些数）         | `path = [2,3]`（表示选了2和3）       |
| **选择列表** | 当前步骤可选择的选项（比如还能选哪些数） | `nums = [2,3,6,7]`，已选2则可选3/6/7 |
| **终止条件** | 什么时候停止探索（找到解/走到底）        | 路径和等于目标值，或路径和超过目标值 |
| **剪枝**     | 提前排除无效路径（核心优化）             | 路径和超过目标值，直接停止当前路径   |

### 关键理解

- **递归是"往下钻"**：每选一个数，就递归调用backtrack，相当于"往下走一步"
- **return 是"往回退"**：触发终止条件（找到解/和超了），就结束当前递归，回到上一层
- **pop 是"擦脚印"**：回到上一层后，必须执行`path.pop()`，把刚才选的数删掉，才能"换另一个数选"
- **for 循环是"选岔路"**：每一层的 for 循环，就是在当前位置选不同的数（岔路），试完一条再试下一条

### 通用模板

```javascript
// 回溯核心函数
function backtrack(路径, 选择列表, 其他参数) {
  // 1. 终止条件：找到解，记录结果并返回
  if (满足终止条件) {
    结果列表.push(路径的拷贝); // 注意：要拷贝，否则会被后续修改
    return;
  }

  // 2. 遍历所有可选选项
  for (const 选项 of 选择列表) {
    // 剪枝：提前排除无效选项（关键优化）
    if (选项无效) continue;

    // 3. 做选择：把当前选项加入路径（选数）
    路径.push(选项);

    // 4. 递归探索：基于当前选择，继续往下走（钻到底）
    backtrack(路径, 新的选择列表, 其他参数);

    // 5. 撤销选择（回溯核心）：回到上一步，换选项（退回来→删掉这个数）
    路径.pop();
  }
}

// 主函数
function solveProblem(参数) {
  const 结果列表 = []; // 存储所有符合条件的解
  backtrack([], 初始选择列表, 初始参数); // 初始路径为空
  return 结果列表;
}
```

## 二、入门示例：组合总和（可视化理解）

为了让你快速理解回溯的核心节奏，我们先从**组合总和**这个经典入门题入手，通过可视化打印完整展示「选→探→撤」的全过程。

### 题目描述

给定一个无重复元素的数组 `candidates` 和一个目标数 `target`，找出 `candidates` 中所有可以使数字和为 `target` 的组合（数字可以无限制重复被选取）。

- 示例：输入 `candidates = [2,3,7]`，`target = 7`，输出 `[[2,2,3],[7]]`。

### 完整代码实现

```javascript
/**
 * 组合总和：找所有和为目标值的组合（可视化打印版）
 * @param {number[]} candidates - 候选数组
 * @param {number} target - 目标和
 * @returns {number[][]} - 所有符合条件的组合
 */
function combinationSum(candidates, target) {
  const result = []; // 存储最终结果
  candidates.sort((a, b) => a - b); // 排序便于剪枝
  let recursionLevel = 0; // 标记递归层级，用于可视化缩进

  // 回溯函数：path=当前路径，sum=当前路径和，start=起始索引（避免重复组合）
  function backtrack(path, sum, start) {
    // 层级+1，生成缩进（每级2个空格）
    recursionLevel++;
    const indent = '  '.repeat(recursionLevel - 1);
    const levelTag = `【层级${recursionLevel}】`;

    // 🟢 调用阶段：打印当前层级初始状态
    console.log(
      `${indent}🟢 ${levelTag} 调用阶段 → path=${JSON.stringify(path)}, sum=${sum}, start=${start}`
    );

    // 终止条件1：路径和等于目标值，记录结果
    if (sum === target) {
      result.push([...path]); // 拷贝路径，避免后续修改
      console.log(
        `${indent}✅ ${levelTag} 找到有效组合 → ${JSON.stringify(path)}，result=${JSON.stringify(result)}`
      );
      // 层级-1，准备返回
      recursionLevel--;
      console.log(`${indent}🔴 ${levelTag} 返回阶段 → 找到解，回到上一层`);
      return;
    }
    // 终止条件2：路径和超过目标值，直接返回（剪枝）
    if (sum > target) {
      console.log(`${indent}🚫 ${levelTag} 剪枝 → sum=${sum} > target=${target}，直接返回`);
      recursionLevel--;
      console.log(`${indent}🔴 ${levelTag} 返回阶段 → 剪枝返回，回到上一层`);
      return;
    }

    // 遍历选择列表（从start开始，避免重复组合）
    for (let i = start; i < candidates.length; i++) {
      const num = candidates[i];
      console.log(`${indent}🔍 ${levelTag} 遍历i=${i} → 尝试选数字${num}，当前sum=${sum}`);

      // 排序剪枝：当前数+已选和>目标值，后续数更大，无需继续
      if (sum + num > target) {
        console.log(
          `${indent}🚫 ${levelTag} 排序剪枝 → ${sum}+${num}=${sum + num} > ${target}，break循环`
        );
        break;
      }

      // 做选择：加入当前数（选数）
      path.push(num);
      console.log(
        `${indent}✅ ${levelTag} 选数字${num} → path=${JSON.stringify(path)}, sum=${sum + num}`
      );

      // 🟡 暂停阶段：调用下一层，当前层级暂停
      console.log(`${indent}🟡 ${levelTag} 暂停阶段 → 调用下一层backtrack，等待返回`);
      // 递归探索：数字可重复选，所以start仍为i（钻到底）
      backtrack(path, sum + num, i);
      console.log(`${indent}🔴 ${levelTag} 返回阶段 → 从下一层返回，继续执行`);

      // 撤销选择：回溯核心（退回来→删掉这个数）
      path.pop();
      console.log(
        `${indent}🔵 ${levelTag} 撤销阶段 → 撤销数字${num} → path=${JSON.stringify(path)}, sum=${sum}`
      );
    }

    // 层级-1，准备返回
    recursionLevel--;
    console.log(`${indent}🔴 ${levelTag} 返回阶段 → for循环结束，回到上一层`);
  }

  // 初始调用：空路径、和为0、从索引0开始
  console.log('========== 开始执行组合总和 ==========');
  backtrack([], 0, 0);
  console.log('========== 执行结束 ==========');
  return result;
}

// 测试：输入 [2,3,7], 7 → 输出 [[2,2,3],[7]]
console.log('最终结果：', combinationSum([2, 3, 7], 7));
```

各个图标的含义：

- 🟢 调用阶段：进入递归时的状态
- 🔍 遍历阶段：尝试选择数字
- ✅ 选择阶段：成功选择数字
- 🟡 暂停阶段：调用下一层递归
- 🔴 返回阶段：从下一层返回
- 🔵 撤销阶段：删除数字（擦脚印）
- 🚫 剪枝阶段：提前终止无效路径

**控制台输出示例：**

```plaintext
========== 开始执行组合总和 ==========
🟢 【层级1】 调用阶段 → path=[], sum=0, start=0
🔍 【层级1】 遍历i=0 → 尝试选数字2，当前sum=0
✅ 【层级1】 选数字2 → path=[2], sum=2
🟡 【层级1】 暂停阶段 → 调用下一层backtrack，等待返回
  🟢 【层级2】 调用阶段 → path=[2], sum=2, start=0
  🔍 【层级2】 遍历i=0 → 尝试选数字2，当前sum=2
  ✅ 【层级2】 选数字2 → path=[2,2], sum=4
  🟡 【层级2】 暂停阶段 → 调用下一层backtrack，等待返回
    🟢 【层级3】 调用阶段 → path=[2,2], sum=4, start=0
    🔍 【层级3】 遍历i=0 → 尝试选数字2，当前sum=4
    ✅ 【层级3】 选数字2 → path=[2,2,2], sum=6
    🟡 【层级3】 暂停阶段 → 调用下一层backtrack，等待返回
      🟢 【层级4】 调用阶段 → path=[2,2,2], sum=6, start=0
      🔍 【层级4】 遍历i=0 → 尝试选数字2，当前sum=6
      🚫 【层级4】 排序剪枝 → 6+2=8 > 7，break循环
      🔴 【层级4】 返回阶段 → for循环结束，回到上一层
    🔴 【层级3】 返回阶段 → 从下一层返回，继续执行
    🔵 【层级3】 撤销阶段 → 撤销数字2 → path=[2,2], sum=4
    🔍 【层级3】 遍历i=1 → 尝试选数字3，当前sum=4
    ✅ 【层级3】 选数字3 → path=[2,2,3], sum=7
    🟡 【层级3】 暂停阶段 → 调用下一层backtrack，等待返回
      🟢 【层级4】 调用阶段 → path=[2,2,3], sum=7, start=1
      ✅ 【层级4】 找到有效组合 → [2,2,3]，result=[[2,2,3]]
      🔴 【层级4】 返回阶段 → 找到解，回到上一层
    🔴 【层级3】 返回阶段 → 从下一层返回，继续执行
    🔵 【层级3】 撤销阶段 → 撤销数字3 → path=[2,2], sum=4
    🔍 【层级3】 遍历i=2 → 尝试选数字7，当前sum=4
    🚫 【层级3】 排序剪枝 → 4+7=11 > 7，break循环
    🔴 【层级3】 返回阶段 → for循环结束，回到上一层
  🔴 【层级2】 返回阶段 → 从下一层返回，继续执行
  🔵 【层级2】 撤销阶段 → 撤销数字2 → path=[2], sum=2
  🔍 【层级2】 遍历i=1 → 尝试选数字3，当前sum=2
  ✅ 【层级2】 选数字3 → path=[2,3], sum=5
  🟡 【层级2】 暂停阶段 → 调用下一层backtrack，等待返回
    🟢 【层级3】 调用阶段 → path=[2,3], sum=5, start=1
    🔍 【层级3】 遍历i=1 → 尝试选数字3，当前sum=5
    🚫 【层级3】 排序剪枝 → 5+3=8 > 7，break循环
    🔴 【层级3】 返回阶段 → for循环结束，回到上一层
  🔴 【层级2】 返回阶段 → 从下一层返回，继续执行
  🔵 【层级2】 撤销阶段 → 撤销数字3 → path=[2], sum=2
  🔍 【层级2】 遍历i=2 → 尝试选数字7，当前sum=2
  🚫 【层级2】 排序剪枝 → 2+7=9 > 7，break循环
  🔴 【层级2】 返回阶段 → for循环结束，回到上一层
🔴 【层级1】 返回阶段 → 从下一层返回，继续执行
🔵 【层级1】 撤销阶段 → 撤销数字2 → path=[], sum=0
🔍 【层级1】 遍历i=1 → 尝试选数字3，当前sum=0
✅ 【层级1】 选数字3 → path=[3], sum=3
🟡 【层级1】 暂停阶段 → 调用下一层backtrack，等待返回
  🟢 【层级2】 调用阶段 → path=[3], sum=3, start=1
  🔍 【层级2】 遍历i=1 → 尝试选数字3，当前sum=3
  ✅ 【层级2】 选数字3 → path=[3,3], sum=6
  🟡 【层级2】 暂停阶段 → 调用下一层backtrack，等待返回
    🟢 【层级3】 调用阶段 → path=[3,3], sum=6, start=1
    🔍 【层级3】 遍历i=1 → 尝试选数字3，当前sum=6
    🚫 【层级3】 排序剪枝 → 6+3=9 > 7，break循环
    🔴 【层级3】 返回阶段 → for循环结束，回到上一层
  🔴 【层级2】 返回阶段 → 从下一层返回，继续执行
  🔵 【层级2】 撤销阶段 → 撤销数字3 → path=[3], sum=3
  🔍 【层级2】 遍历i=2 → 尝试选数字7，当前sum=3
  🚫 【层级2】 排序剪枝 → 3+7=10 > 7，break循环
  🔴 【层级2】 返回阶段 → for循环结束，回到上一层
🔴 【层级1】 返回阶段 → 从下一层返回，继续执行
🔵 【层级1】 撤销阶段 → 撤销数字3 → path=[], sum=0
🔍 【层级1】 遍历i=2 → 尝试选数字7，当前sum=0
✅ 【层级1】 选数字7 → path=[7], sum=7
🟡 【层级1】 暂停阶段 → 调用下一层backtrack，等待返回
  🟢 【层级2】 调用阶段 → path=[7], sum=7, start=2
  ✅ 【层级2】 找到有效组合 → [7]，result=[[2,2,3],[7]]
  🔴 【层级2】 返回阶段 → 找到解，回到上一层
🔴 【层级1】 返回阶段 → 从下一层返回，继续执行
🔵 【层级1】 撤销阶段 → 撤销数字7 → path=[], sum=0
🔴 【层级1】 返回阶段 → for循环结束，回到上一层
========== 执行结束 ==========
最终结果： [ [ 2, 2, 3 ], [ 7 ] ]
```

### 执行流程解析

以 `candidates = [2,3,7]`, `target = 7` 为例：

1. **选2** → path=[2], sum=2 → **钻到底**（递归）
2. **选2** → path=[2,2], sum=4 → **钻到底**（递归）
3. **选2** → path=[2,2,2], sum=6 → **钻到底**（递归）
4. **选2** → sum=8 > 7，剪枝，**退回来**
5. **删掉2** → path=[2,2], sum=6 → **选下一个数3**
6. **选3** → path=[2,2,3], sum=7 ✅ 找到解，**退回来**
7. **删掉3** → path=[2,2], sum=6 → **选下一个数7**
8. 剪枝，**退回来** → path=[2], sum=2 → 继续尝试...
9. 最终收集到 `[[2,2,3],[7]]`

## 三、回溯算法常见题型及解题方法

### 1. 组合问题

#### 核心特征

- 不考虑元素顺序，每个组合唯一（如`[2,3]`和`[3,2]`算同一个）
- 用`start`参数控制"不回头选"，避免生成重复组合
- 数字可重复选（组合总和）/不可重复选（组合），仅需调整`start`参数（重复选传`i`，不重复选传`i+1`）

#### LeetCode 题目详解

##### [39. 组合总和](https://leetcode.cn/problems/combination-sum/)

**题目描述：**

给定一个**无重复元素**的整数数组 `candidates` 和一个目标整数 `target`，找出 `candidates` 中可以使数字和为目标数 `target` 的**所有不同组合**，并以列表形式返回。你可以按**任意顺序**返回这些组合。

`candidates` 中的**同一个数字可以无限制重复被选取**。如果至少一个数字的被选数量不同，则两种组合是不同的。

**示例 1：**

```
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
解释：
2 和 3 可以形成一组候选，2 + 2 + 3 = 7。注意 2 可以使用多次。
7 也是一个候选， 7 = 7。
所以这两种组合是唯一的答案。
```

**示例 2：**

```
输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
```

**解决方案：**

```javascript
//**
 * 组合总和：找出候选数组中所有和为目标值的组合（数字可重复选取）
 * @param candidates 无重复元素的候选数字数组
 * @param target 目标和
 * @returns 所有符合条件的组合数组
 */
function combinationSum(candidates: number[], target: number): number[][] {
  // 结果数组：存储所有符合条件的组合（需深拷贝，避免引用污染）
  const res: number[][] = [];
  // 候选数组长度：避免循环中重复计算
  const len = candidates.length;

  // 【易错点1】排序是剪枝的前提！无序数组无法用break有效剪枝
  candidates.sort((x, y) => x - y);

  /**
   * 回溯核心函数
   * @param path 当前已选数字的路径（引用类型，需注意回溯撤销）
   * @param sum 当前路径的数字和（避免重复计算，提升效率）
   * @param start 遍历起始索引（控制不回头选，避免重复组合）
   */
  function backtrack(path: number[], sum: number, start: number) {
    // 终止条件1：找到有效组合
    if (sum === target) {
      // 【易错点2】必须深拷贝！直接push(path)会因引用导致后续pop修改结果
      res.push([...path]);
      return;
    }

    // 终止条件2：前置剪枝（sum超过目标值，直接终止当前递归）
    // 可选优化：可合并为 if (sum >= target) { ... return }
    if (sum > target) {
      return;
    }

    // 遍历候选数组（从start开始，避免重复组合）
    for (let i = start; i < len; i++) {
      const cur = candidates[i];

      // 【执行顺序优化点】剪枝逻辑应放在push之前（当前代码push后判断，会多一次无效push/pop）
      // 排序后，若当前数+已选和>目标值，后续数更大，直接终止循环
      if (sum + cur > target) {
        break;
      }

      // 做选择：将当前数字加入路径
      path.push(cur);

      // 【易错点3】递归参数传i而非start！
      // 传i：允许重复选当前数字（组合总和核心需求）
      // 传start：无限递归（永远从0开始选），传i+1：不允许重复选（变成组合问题）
      backtrack(path, sum + cur, i);

      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径、和为0、从索引0开始遍历
  backtrack([], 0, 0);
  return res;
}

// 测试用例
console.log(combinationSum([2, 3, 6, 7], 7)); // 输出：[[2,2,3],[7]]
console.log(combinationSum([2, 3, 5], 8));   // 输出：[[2,2,2,2],[2,3,3],[3,5]]
```

**易错点：**

- 忘记排序导致剪枝失效
- `start`参数传错（重复选传`i`，不重复选传`i+1`）
- 忘记拷贝路径（`[...path]`）

---

##### [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

**题目描述：**

给定一个候选人编号的集合 `candidates` 和一个目标数 `target`，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

`candidates` 中的**每个数字在每个组合中只能使用一次**。

**注意：**解集不能包含重复的组合。

**示例 1：**

```
输入: candidates = [10,1,2,7,6,1,5], target = 8,
输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

**解决方案：**

```ts
/**
 * 组合总和II：找出候选数组中所有和为目标值的组合（数字不可重复选取，且结果无重复组合）
 * 核心区别于combinationSum：
 * 1. 候选数组可能包含重复数字
 * 2. 每个数字在每个组合中只能使用一次
 * 3. 最终结果不能有重复组合
 * @param candidates 可能包含重复元素的候选数字数组
 * @param target 目标和
 * @returns 所有符合条件的不重复组合数组
 */
function combinationSum2(candidates: number[], target: number): number[][] {
  // 结果数组：存储所有符合条件的组合（需深拷贝，避免引用污染）
  const res: number[][] = [];
  // 候选数组长度：避免循环中重复计算
  const len = candidates.length;

  // 【易错点1】排序是去重+剪枝的前提！无序数组无法有效去重和剪枝
  candidates.sort((x, y) => x - y);

  /**
   * 回溯核心函数
   * @param path 当前已选数字的路径（引用类型，需注意回溯撤销）
   * @param sum 当前路径的数字和（避免重复计算，提升效率）
   * @param start 遍历起始索引（控制不回头选，避免重复组合）
   */
  function backtrack(path: number[], sum: number, start: number) {
    // 终止条件1：找到有效组合
    if (sum === target) {
      // 【易错点2】必须深拷贝！直接push(path)会因引用导致后续pop修改结果
      res.push([...path]);
      return;
    }

    // 终止条件2：前置剪枝（sum超过目标值，直接终止当前递归）
    if (sum > target) {
      return;
    }

    // 遍历候选数组（从start开始，避免重复组合）
    for (let i = start; i < len; i++) {
      const cur = candidates[i];

      // 【核心优化1】先剪枝（sum+cur>target），再处理去重，避免无效操作
      // 排序后，若当前数+已选和>目标值，后续数更大，直接终止循环
      if (sum + cur > target) {
        break;
      }

      // 【易错点3】去重剪枝必须放在push之前！且判断条件是i>start
      // 作用：过滤同一层递归中重复的数字（比如[1,1,2]，3的话，第一个[1,2],然后path变成[]之后，走到i=1,此时又是1和上一个相同，如果不跳过，则又会有一个[1,2]，所以这里需要跳过）
      if (i > start && candidates[i] === candidates[i - 1]) {
        continue; // 跳过当前层的重复数字
      }

      // 做选择：将当前数字加入路径
      path.push(cur);

      // 【易错点4】递归参数传i+1而非i！
      // 传i+1：每个数字只能选一次（组合总和II核心要求）
      // 传i：允许重复选（变成combinationSum），传start：无限递归
      backtrack(path, sum + cur, i + 1);

      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径、和为0、从索引0开始遍历
  backtrack([], 0, 0);
  return res;
}

// 测试用例（重点验证去重）
console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
// 正确输出：[[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2([2, 5, 2, 1, 2], 5));
// 正确输出：[[1,2,2],[5]]
```

**易错点：**

- 去重逻辑错误：应该是`i > start`而不是`i > 0`（允许不同层选相同数字）
- 忘记排序导致去重失效

---

##### [77. 组合](https://leetcode.cn/problems/combinations/)

**题目描述：**

给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。

你可以按**任何顺序**返回答案。

**示例 1：**

```
输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

**解决方案：**

```ts
/**
 * 组合：从 1~n 的数字中选出 k 个数字的所有组合（不考虑顺序，无重复组合）
 * 核心规则：
 * 1. 组合不考虑顺序（如[1,2]和[2,1]算同一个，需通过startNum控制不回头选）
 * 2. 每个数字只能选一次
 * @param n 数字范围上限（1~n）
 * @param k 组合的长度
 * @returns 所有符合条件的组合数组
 */
function combine(n: number, k: number): number[][] {
  // 结果数组：存储所有符合条件的组合（需深拷贝，避免引用污染）
  const res: number[][] = [];

  /**
   * 回溯核心函数
   * @param path 当前已选数字的路径（引用类型，需注意回溯撤销）
   * @param startNum 遍历起始数字（控制不回头选，避免重复组合，如选1后只能选2/3...n）
   */
  function backtrack(path: number[], startNum: number) {
    // 终止条件：当前路径长度等于k，找到有效组合
    if (path.length === k) {
      // 【易错点1】必须深拷贝！直接push(path)会因引用导致后续pop修改结果
      res.push([...path]);
      return;
    }

    // 【核心剪枝】剩余可选数字不足以凑够k个，直接终止递归（优化效率）
    // 剩余可选数字数 = n - startNum + 1
    // 当前路径长度 + 剩余可选数字数 < k → 不可能凑够k个，剪枝
    if (path.length + (n - startNum + 1) < k) {
      return;
    }

    // 遍历数字：从startNum开始到n（避免回头选，生成重复组合）
    for (let i = startNum; i <= n; i++) {
      // 【易错点2】核心错误：原代码push(startNum)，正确应push(i)
      // 做选择：将当前遍历的数字i加入路径
      path.push(i);

      // 【易错点3】递归参数传i+1而非startNum+1！
      // 传i+1：下一层从当前数字的下一位开始，保证不回头选
      backtrack(path, i + 1);

      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径、从数字1开始遍历
  backtrack([], 1);
  return res;
}

// 测试用例
console.log(combine(4, 2));
// 正确输出：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combine(3, 3));
// 正确输出：[[1,2,3]]
console.log(combine(5, 1));
// 正确输出：[[1],[2],[3],[4],[5]]
```

**易错点：**

- 范围错误：应该是`[1, n]`，循环条件是`i <= n`而不是`i < n`
- 忘记剪枝优化导致超时

---

##### [216. 组合总和 III](https://leetcode.cn/problems/combination-sum-iii/)

**题目描述：**

找出所有相加之和为 `n` 的 `k` 个数的组合，且满足下列条件：

- 只使用数字1到9
- 每个数字**最多使用一次**

返回**所有可能的有效组合的列表**。该列表不能包含相同的组合两次，组合可以以任何顺序返回。

**示例 1：**

```
输入: k = 3, n = 7
输出: [[1,2,4]]
解释:
1 + 2 + 4 = 7
没有其他符合的组合了。
```

**解决方案：**

```ts
/**
 * 组合总和III：找出所有相加之和为n的k个正整数组合（仅使用数字1-9，每个数字最多使用一次）
 * 核心规则：
 * 1. 组合长度固定为k；
 * 2. 数字范围1~9，且不重复选取；
 * 3. 组合和为n，且组合不考虑顺序（如[1,2]和[2,1]算同一个，需通过startNum控制不回头选）。
 * @param k 组合的固定长度
 * @param n 组合的目标和
 * @returns 所有符合条件的组合数组
 */
function combinationSum3(k: number, n: number): number[][] {
  // 结果数组：存储所有符合条件的组合（需深拷贝，避免引用污染）
  const res: number[][] = [];
  // 目标和（可直接用n，此处保留target仅为语义清晰）
  const target = n;

  /**
   * 回溯核心函数
   * @param path 当前已选数字的路径（引用类型，需注意回溯撤销）
   * @param sum 当前路径的数字和（避免重复计算，提升效率）
   * @param startNum 遍历起始数字（控制不回头选，避免重复组合，如选1后只能选2~9）
   */
  function backtrack(path: number[], sum: number, startNum: number) {
    // 【易错点1】终止条件1：组合长度达到k（核心终止条件）
    if (path.length === k) {
      // 仅当和等于目标值时，记录有效组合
      if (sum === target) {
        res.push([...path]);
      }
      // 无论sum是否等于target，长度到k都要终止（sum>target也无需单独判断，直接return）
      return;
    }

    // 【核心剪枝1】剩余可选数字不足以凑够k个，直接终止递归
    // 剩余可选数字数 = 9 - startNum + 1（1~9共9个数字）
    // 当前路径长度 + 剩余可选数字数 < k → 不可能凑够k个，剪枝
    if (path.length + (9 - startNum + 1) < k) {
      return;
    }

    // 【核心剪枝2】提前预判：若当前sum + 最小剩余数字 > target，后续无需遍历（原代码仅在循环内剪枝，此处可选）
    // 如sum=7, target=8, k=2, path.length=1 → 剩余1个数字最小是startNum，若7+startNum>8则break
    // （原代码无此剪枝，不影响结果，仅优化效率）

    // 遍历数字：从startNum开始到9（避免回头选，保证数字不重复）
    for (let i = startNum; i <= 9; i++) {
      // 【易错点2】循环内剪枝：sum+i>target时，后续数字更大，直接终止循环（1~9已天然排序）
      if (sum + i > target) {
        break;
      }

      // 做选择：将当前数字i加入路径
      path.push(i);

      // 【易错点3】递归参数传i+1而非startNum+1！
      // 传i+1：下一层从当前数字的下一位开始，保证每个数字只选一次
      backtrack(path, sum + i, i + 1);

      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径、和为0、从数字1开始遍历
  backtrack([], 0, 1);
  return res;
}

// 测试用例
console.log(combinationSum3(3, 7));
// 正确输出：[[1,2,4]]
console.log(combinationSum3(3, 9));
// 正确输出：[[1,2,6],[1,3,5],[2,3,4]]
console.log(combinationSum3(4, 1));
// 正确输出：[]（无符合条件的组合）
console.log(combinationSum3(2, 18));
// 正确输出：[[9,9]] → 错误？不，1~9数字不重复，所以正确输出是[]（原代码会正确返回[]）
```

---

### 2. 排列问题

#### 核心特征

- 考虑元素顺序，每个排列唯一（如`[1,2]`和`[2,1]`算不同排列）
- 用`used`数组控制"不重复选"，循环从0开始（允许选任意未选过的数字）
- 含重复数字的排列（全排列II）需增加"去重剪枝"

#### LeetCode 题目详解

##### [46. 全排列](https://leetcode.cn/problems/permutations/)

**题目描述：**

给定一个**不含重复数字**的数组 `nums`，返回其**所有可能的全排列**。你可以**按任意顺序**返回答案。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**解决方案：**

```ts
/**
 * 全排列：生成无重复数字数组的所有排列（考虑顺序，如[1,2]和[2,1]是不同排列）
 * 核心规则：
 * 1. 排列考虑顺序，每个数字在排列中仅出现一次；
 * 2. 用used数组标记已选数字，避免重复选取；
 * 3. 无需start参数（排列需要遍历所有未选数字，而非从某一位置开始）。
 * @param nums 无重复元素的数字数组
 * @returns 所有可能的排列数组
 */
function permute(nums: number[]): number[][] {
  // 结果数组：存储所有排列（需深拷贝，避免引用污染）
  const res: number[][] = [];
  // 数组长度：避免循环中重复计算
  const len = nums.length;
  // 【核心】used数组：标记索引i的数字是否已被选入当前路径，初始全为false
  const used = new Array(len).fill(false);

  /**
   * 回溯核心函数
   * @param path 当前已选数字的路径（引用类型，需注意回溯撤销）
   */
  function backtrack(path: number[]) {
    // 终止条件：当前路径长度等于数组长度，找到一个完整排列
    if (path.length === len) {
      // 【易错点1】必须深拷贝！直接push(path)会因引用导致后续pop修改结果
      res.push([...path]);
      return;
    }

    // 遍历所有数字（排列需遍历全部，而非从start开始）
    for (let i = 0; i < len; i++) {
      // 【易错点2】跳过已选数字：used[i]为true时，当前数字已在path中，避免重复选取
      if (used[i]) {
        continue;
      }

      // 1. 标记当前数字为已选
      used[i] = true;
      // 2. 做选择：将当前数字加入路径
      const cur = nums[i];
      path.push(cur);

      // 递归：继续构建排列（无需传start，因为要遍历所有未选数字）
      backtrack(path);

      // 3. 撤销选择：回溯核心，恢复状态（先pop路径，再取消used标记）
      path.pop();
      used[i] = false;
    }
  }

  // 初始调用：空路径开始构建排列
  backtrack([]);
  return res;
}

// 测试用例
console.log(permute([1, 2, 3]));
// 正确输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(permute([0, 1]));
// 正确输出：[[0,1],[1,0]]
console.log(permute([1]));
// 正确输出：[[1]]
```

**易错点：**

- 忘记使用`used`数组导致重复选同一个数字
- 循环应该从0开始，不是从`start`开始（排列需要考虑所有位置）

---

##### [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/)

**题目描述：**

给定一个可包含重复数字的序列 `nums`，**按任意顺序**返回所有不重复的全排列。

**示例 1：**

```
输入：nums = [1,1,2]
输出：
[[1,1,2],
 [1,2,1],
 [2,1,1]]
```

**解决方案：**

```ts
/**
 * 全排列II：生成含重复数字数组的所有不重复排列
 * 核心目标：
 * 1. 生成所有排列（考虑顺序，如[1,2]≠[2,1]）；
 * 2. 过滤重复排列（如[1,1,2]仅保留唯一的3种排列）。
 * @param nums 可能包含重复元素的数字数组
 * @returns 所有不重复的排列数组
 */
function permuteUnique(nums: number[]): number[][] {
  // 结果数组：存储最终不重复的排列（深拷贝避免引用污染）
  const res: number[][] = [];
  // 数组长度：避免循环中重复计算
  const len = nums.length;
  // used数组：标记索引i的数字是否已被选入当前路径，初始全为未选（false）
  const used = new Array(len).fill(false);

  // 【核心前置操作】排序：让重复数字相邻，为后续去重剪枝做准备
  // 例：[1,2,1] → [1,1,2]，保证重复数字挨在一起
  nums.sort((x, y) => x - y);

  /**
   * 回溯核心函数：递归构建排列路径
   * @param path 当前已选数字的路径（引用类型，需回溯撤销）
   */
  function backtrack(path: number[]) {
    // 终止条件：路径长度等于数组长度 → 找到一个完整排列
    if (path.length === len) {
      // 深拷贝path：避免后续pop修改已存入res的数组
      res.push([...path]);
      return;
    }

    // 遍历所有数字（排列需遍历全部，而非从start开始）
    for (let i = 0; i < len; i++) {
      // 剪枝1：跳过已选数字（避免同一排列中重复选同一数字）
      if (used[i]) {
        continue;
      }

      // 【核心去重剪枝】过滤同一层的重复数字
      // 条件1：i>0 → 避免i=0时i-1越界
      // 条件2：nums[i] === nums[i-1] → 当前数字和前一个数字重复
      // 条件3：!used[i-1] → 前一个重复数字未被选（说明是同一层的重复），谁先被选，谁就占了这个 “重复数字开头” 的坑，后面的重复数字不用再选（没被选走→跳过）；
      // 作用：仅跳过「同一层」的重复数字，允许「不同层」选相同数字
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
        continue;
      }

      // 1. 标记当前数字为已选
      used[i] = true;
      const cur = nums[i];
      // 2. 做选择：将当前数字加入路径
      path.push(cur);

      // 递归：继续构建下一层的排列
      backtrack(path);

      // 3. 撤销选择（回溯核心）：恢复路径和used标记
      path.pop();
      used[i] = false;
    }
  }

  // 初始调用：从空路径开始构建排列
  backtrack([]);
  return res;
}

// 测试用例（验证去重和完整性）
console.log(permuteUnique([1, 1, 2]));
// 正确输出：[[1,1,2],[1,2,1],[2,1,1]]
console.log(permuteUnique([2, 2, 1, 1]));
// 正确输出：[[1,1,2,2],[1,2,1,2],[1,2,2,1],[2,1,1,2],[2,1,2,1],[2,2,1,1]]
console.log(permuteUnique([1, 2, 3]));
// 正确输出：和permute一致 → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**易错点：**

- 去重逻辑错误：应该是`!used[i - 1]`而不是`used[i - 1]`
  - `!used[i - 1]`：前一个相同数字未被使用，说明我们在同一层尝试重复数字，应该跳过
  - `used[i - 1]`：前一个相同数字已被使用，说明我们在不同层，可以使用

---

### 3. 子集问题

#### 核心特征

- 找出所有可能的子集（包括空集）
- 用`start`参数控制不回头选，无需严格终止条件（每次递归都记录路径）
- 含重复数字的子集（子集II）需增加"去重剪枝"

#### LeetCode 题目详解

##### [78. 子集](https://leetcode.cn/problems/subsets/)

**题目描述：**

给你一个整数数组 `nums`，数组中的元素**互不相同**。返回该数组所有可能的子集（幂集）。

解集**不能**包含重复的子集。你可以按**任意顺序**返回解集。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

**解决方案：**

```ts
/**
 * 子集：生成数组的所有子集（包括空集和数组本身，子集不考虑顺序）
 * 核心规则：
 * 1. 子集不考虑顺序（如[1,2]和[2,1]是同一个子集，通过startIndex控制不回头选）；
 * 2. 每个子集是原数组的任意元素组合（元素不重复选取）；
 * 3. 无需去重（若nums无重复元素），无需排序。
 * @param nums 无重复元素的数字数组
 * @returns 所有子集组成的二维数组
 */
function subsets(nums: number[]): number[][] {
  // 结果数组：存储所有子集（深拷贝避免引用污染）
  const res: number[][] = [];
  // 数组长度：避免循环中重复计算
  const len = nums.length;

  /**
   * 回溯核心函数：递归构建子集路径
   * @param path 当前子集路径（引用类型，需回溯撤销）
   * @param startIndex 遍历起始索引（控制不回头选，避免生成重复子集）
   */
  function backtrack(path: number[], startIndex: number) {
    // 【核心】每进入一层递归，先记录当前路径（包括空集）
    // 区别于排列/组合：子集问题无终止条件（所有路径都是有效子集），每一步都要保存
    res.push([...path]);

    // 遍历数组：从startIndex开始，避免回头选（如选1后只选2/3，不回头选1）
    for (let i = startIndex; i < len; i++) {
      const cur = nums[i];
      // 做选择：将当前数字加入子集路径
      path.push(cur);
      // 递归：下一层从i+1开始（保证元素不重复选取）
      backtrack(path, i + 1);
      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径开始，从索引0遍历
  backtrack([], 0);
  return res;
}

// 测试用例
console.log(subsets([1, 2, 3]));
// 正确输出：[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
console.log(subsets([0]));
// 正确输出：[[],[0]]
```

**易错点：**

- 忘记在每次递归开始时记录路径（子集问题需要在每个节点都记录，不只是叶子节点）

---

##### [90. 子集 II](https://leetcode.cn/problems/subsets-ii/)

**题目描述：**

给你一个整数数组 `nums`，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。

解集**不能**包含重复的子集。返回的解集中，子集可以按**任意顺序**排列。

**示例 1：**

```
输入：nums = [1,2,2]
输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
```

**解决方案：**

```ts
/**
 * 子集II：生成含重复数字数组的所有不重复子集（包括空集和数组本身）
 * 核心目标：
 * 1. 生成所有子集（子集不考虑顺序）；
 * 2. 过滤重复子集（如nums=[1,2,2]时，避免生成两个[1,2]）。
 * @param nums 可能包含重复元素的数字数组
 * @returns 所有不重复子集组成的二维数组
 */
function subsetsWithDup(nums: number[]): number[][] {
  // 结果数组：存储所有不重复子集（深拷贝避免引用污染）
  const res: number[][] = [];
  const len = nums.length;

  // 【核心前置操作】排序：让重复数字相邻，为去重剪枝做准备
  // 例：[1,2,2]排序后仍为[1,2,2]，[2,1,2]排序后为[1,2,2]，保证重复数字挨在一起
  nums.sort((x, y) => x - y);

  /**
   * 回溯核心函数：递归构建子集路径
   * @param path 当前子集路径（引用类型，需回溯撤销）
   * @param startIndex 遍历起始索引（控制不回头选，避免生成重复子集）
   */
  function backtrack(path: number[], startIndex: number) {
    // 子集问题核心：每进入一层递归，先保存当前路径（包括空集）
    // 所有路径都是有效子集，无需等待“长度达标”，这是子集和组合/排列的核心区别
    res.push([...path]);

    // 遍历数组：从startIndex开始，避免回头选（如选1后只选2/2，不回头选1）
    for (let i = startIndex; i < len; i++) {
      // 【核心去重剪枝】过滤同一层的重复数字
      // 条件1：i > startIndex → 跳过“当前层第一个数字”（避免误过滤跨层重复）
      // 条件2：nums[i] === nums[i - 1] → 当前数字和前一个数字重复
      // 作用：仅跳过同一层的重复数字，保留不同层的重复数字（如[2]和[1,2]都是有效子集）
      if (i > startIndex && nums[i] === nums[i - 1]) {
        continue;
      }

      const cur = nums[i];
      // 做选择：将当前数字加入子集路径
      path.push(cur);
      // 递归：下一层从i+1开始（保证元素不重复选取）
      backtrack(path, i + 1);
      // 撤销选择：回溯核心，恢复路径状态
      path.pop();
    }
  }

  // 初始调用：空路径开始，从索引0遍历
  backtrack([], 0);
  return res;
}

// 测试用例（验证去重效果）
console.log(subsetsWithDup([1, 2, 2]));
// 正确输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
console.log(subsetsWithDup([0]));
// 正确输出：[[],[0]]
console.log(subsetsWithDup([2, 1, 2]));
// 排序后为[1,2,2]，输出和上面一致 → [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

**易错点：**

- 去重逻辑和组合总和II相同，但容易忘记排序

---

## 四、总结

| 分类 | 题号&名称 | 核心规则 | 关键操作 | 终止/保存条件 | 去重&剪枝技巧 |
| --- | --- | --- | --- | --- | --- |
| **组合类** | 39. 组合总和 | 1. 数字可重复选<br>2. 候选数组无重复<br>3. 组合和为target | 1. 递归参数传`i`（允许重复选当前数）<br>2. 用`startIndex`控制不回头选 | 1. `sum === target` → 保存路径<br>2. `sum > target` → 剪枝返回 | 1. 排序（`nums.sort`）是剪枝前提<br>2. `sum + cur > target` → `break`（后续数更大） |
|  | 40. 组合总和 II | 1. 数字不可重复选<br>2. 候选数组有重复<br>3. 组合和为target | 1. 递归参数传`i+1`（不可重复选）<br>2. 用`startIndex`控制不回头选 | 1. `sum === target` → 保存路径<br>2. `sum > target` → 剪枝返回 | 1. 先排序（让重复数字相邻）<br>2. 同层去重：`i > startIndex && nums[i] === nums[i-1]` → `continue`<br>3. `sum + cur > target` → `break` |
|  | 77. 组合 | 1. 从 `1~n` 选 `k` 个数字<br>2. 无重复组合<br>3. 不考虑顺序 | 1. 递归参数传`i+1`<br>2. 用`startIndex`控制不回头选 | `path.length === k` → 保存路径 | 剪枝：`path.length + (n - startIndex + 1) < k` → 剪枝（剩余数不够凑k个） |
|  | 216. 组合总和 III | 1. 从 `1~9` 选 `k` 个数字<br>2. 数字不可重复选<br>3. 组合和为`n` | 1. 递归参数传`i+1`<br>2. 用`startIndex`控制不回头选 | `path.length === k` **且** `sum === n` → 保存路径 | 1. 1~9天然有序，无需排序<br>2. `sum + cur > n` → `break`<br>3. 剩余数剪枝（同77题） |
| **排列类** | 46. 全排列 | 1. 候选数组无重复<br>2. 生成所有排列（考虑顺序） | 1. 用`used`数组标记已选数字<br>2. 遍历范围`0~len-1`（无`startIndex`） | `path.length === len` → 保存路径 | 无需去重，仅用`used[i]` → `continue`（跳过已选数字） |
|  | 47. 全排列 II | 1. 候选数组有重复<br>2. 生成无重复排列（考虑顺序） | 1. 用`used`数组标记已选数字<br>2. 遍历范围`0~len-1`（无`startIndex`） | `path.length === len` → 保存路径 | 1. 先排序（让重复数字相邻）<br>2. 同层去重：`i > 0 && nums[i] === nums[i-1] && !used[i-1]` → `continue`<br>3. `used[i]` → `continue`（跳过已选数字） |
| **子集类** | 78. 子集 | 1. 候选数组无重复<br>2. 生成所有子集（含空集）<br>3. 不考虑顺序 | 1. 递归参数传`i+1`<br>2. 用`startIndex`控制不回头选 | **进入递归就保存路径**（所有路径都是有效子集） | 无需去重，无剪枝（子集无长度/和限制） |
|  | 90. 子集 II | 1. 候选数组有重复<br>2. 生成无重复子集（含空集）<br>3. 不考虑顺序 | 1. 递归参数传`i+1`<br>2. 用`startIndex`控制不回头选 | **进入递归就保存路径**（所有路径都是有效子集） | 1. 先排序（让重复数字相邻）<br>2. 同层去重：`i > startIndex && nums[i] === nums[i-1]` → `continue` |

- **排序**：只要涉及“去重/剪枝”，第一步必排序（让重复数字相邻、让数字递增便于sum剪枝）；
- **深拷贝**：所有题都需要`res.push([...path])`，直接push(path)会因引用导致结果错误；
- **回溯闭环**：选数字（push）→ 递归 → 撤销选（pop），心是"选→探→撤"，缺一不可。
- **模板复用**：
  - 组合/子集：用`start`参数避免重复，循环从`start`开始
  - 排列：用`used`数组避免重复选，循环从0开始=
- 去重剪枝的“黄金公式”
  - **组合/子集去重**（有重复数字）：`i > startIndex && nums[i] === nums[i-1]`；
  - **排列去重**（有重复数字）：`i > 0 && nums[i] === nums[i-1] && !used[i-1]`；
  - **sum剪枝**（所有求和类问题）：`sum + cur > target` → break（需先排序）。

记住“组合看start、排列看used、子集全保存”的口诀，就能快速适配所有这类回溯问题～
