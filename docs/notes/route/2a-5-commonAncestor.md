# 理解二叉树最近公共祖先（LCA）：从基础到变种解析

最近公共祖先（Lowest Common Ancestor，简称 LCA）是二叉树领域的经典问题，也是算法面试的高频考点。本文将从「基础查找逻辑」出发，逐步拆解 LCA 的核心思路，覆盖普通二叉树、二叉搜索树、带父指针二叉树等不同场景的 LCA 问题，结合力扣真题（236/235/1676/1644/1650）给出最优解法，帮你彻底掌握这一核心考点。

![lca.png](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b0ec58782d35422095972c9b1dd7634f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?rk3s=f64ab15b&x-expires=1773122269&x-signature=o8b0JUnuOPbDMtlF31AHOw1Ajgc%3D)

## 一、前置基础：二叉树节点查找的两种核心思路

在解决 LCA 问题前，我们先掌握二叉树中「节点查找」的两种核心范式——这是 LCA 所有解法的基础。

### 1.1 遍历思路：过程导向的全局遍历

**核心逻辑**：遍历整棵树，用外部变量记录目标节点是否找到，遍历过程中匹配到目标即标记，直到遍历结束或提前找到目标。

**通俗理解**：像亲自逛整棵树，手里拿小本本记录，看到目标就打勾，逛完后看本本判断结果。

```JavaScript

function find(root, val) {
  let res = null;
  traverse(root);
  return res;

  function traverse(node) {
    if (node === null) {
      return;
    }
    if (node.val === val) {
      res = node;
      return;
    }
    traverse(node.left);
    traverse(node.right);
  }
}
```

**优化版（提前终止）**：找到目标后立即终止所有递归，避免无效遍历：

```JavaScript

function find(root, val) {
  let res = null;
  traverse(root);
  return res;

  function traverse(node) {
    if (node === null) return false; // 没找到
    if (node.val === val) {
      res = node;
      return true; // 找到，返回true终止
    }
    // 左子树找到，直接终止；没找到再查右子树
    if (traverse(node.left)) return true;
    if (traverse(node.right)) return true;
    return false; // 都没找到
  }
}
```

### 1.2 分解问题思路：结果导向的递归拆解

**核心逻辑**：把「找整棵树的目标节点」拆解为三个子问题：

1. 检查当前节点是否匹配；

2. 找左子树的目标节点；

3. 找右子树的目标节点。

**通俗理解**：不亲自逛树，派两个人分别找目标，根据他们的汇报结果整合答案。

```JavaScript

function find(root, val) {
  if (root === null) return null;
  if (root.val === val) return root;
  let leftRes = find(root.left, val);
  if (leftRes) {
    return leftRes;
  }
  let rightRes = find(root.right, val);
  if (rightRes) {
    return rightRes;
  }
  return null;
}
```

**关键优化点**：若左子树找到目标，无需递归右子树，直接返回结果，减少无效递归。

### 1.3 层序遍历思路：广度优先查找

**核心逻辑**：用队列实现按层遍历，逐行扫描节点，匹配到目标后立即返回，适合需要「按层查找」的场景。

```JavaScript

function find(root, val) {
  if (root === null) return null;
  const queue = [root];
  while (queue.length) {
    const levelNodesCount = queue.length;
    for (let i = 0; i < levelNodesCount; i++) {
      const cur = queue.shift();
      if (cur.val === val) {
        return cur;
      }
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
  }
}
```

## 二、经典 LCA 问题：力扣 236. 二叉树的最近公共祖先

### 2.1 题目链接

[236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

### 2.2 题目介绍

给你输入一棵不含重复值的二叉树，以及存在于树中的两个节点 `p` 和 `q`，请你计算 `p` 和 `q` 的最近公共祖先节点。

### 2.3 示例

```Plain Text

        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

- 输入：`root = 3, p = 5, q = 1` → 输出：`3`

- 输入：`root = 3, p = 5, q = 4` → 输出：`5`

### 2.4 核心思路

LCA 的核心判断逻辑：

1. 若一个节点的左右子树中分别包含 `p` 和 `q`，则该节点是 LCA；

2. 若节点本身是 `p` 或 `q`，且另一节点在该节点的子树中，则该节点是 LCA。

基于「分解问题」思路，递归函数的返回值承载三种状态：

- `null`：当前子树无 `p/q`；

- `p/q`：当前子树只找到一个目标；

- 其他节点：当前子树找到 `p/q` 的 LCA。

### 2.5 剪枝优化版代码

```JavaScript

/**
 * 找二叉树中两个节点的最近公共祖先（LCA）- 剪枝优化版
 * 核心思路：分解问题 + 剪枝（提前终止无用递归，提升性能）
 * 剪枝逻辑：如果左子树已找到LCA（非p/q），直接返回，无需递归右子树
 * @param {TreeNode} root 二叉树根节点
 * @param {TreeNode} p 目标节点1（节点对象，非值）
 * @param {TreeNode} q 目标节点2（节点对象，非值）
 * @returns {TreeNode} 最近公共祖先节点
 */
var lowestCommonAncestor = function (root, p, q) {
  // 【终止条件1】当前节点为空 → 子树无p/q，返回null
  // 🔴 易错点1：漏写该终止条件 → 递归无限调用，栈溢出
  //    所有树的递归必须先判断节点是否为空，这是递归的“出口”
  if (root === null) return null;

  // 【终止条件2】当前节点是p或q → 找到其中一个目标，返回当前节点
  // 🔴 易错点2：误写成 root.val === p/q → p/q是节点对象，非值！
  //    后果：值重复时匹配错误节点（如树中有两个val=5的节点）
  if (root === p || root === q) return root;

  // 【分解子问题1】递归查找左子树中的p/q → 得到左子树查找结果
  // 📌 leftRes语义：
  //    - null → 左子树无p/q；
  //    - p/q → 左子树只找到一个目标；
  //    - 其他节点 → 左子树已找到p/q的LCA（核心剪枝依据）
  const leftRes = lowestCommonAncestor(root.left, p, q);

  // 【核心剪枝逻辑】提前终止无用递归（你新增的优化思路）
  // 逻辑：leftRes非空 + 不是p/q → 说明左子树已找到LCA，无需递归右子树
  // 🔴 易错点3：漏判leftRes!==null → 会把null误判为“不是LCA”，触发错误剪枝
  // 🔴 易错点4：条件写反（如if(leftRes === p || leftRes === q)）→ 提前返回目标节点，破坏逻辑
  if (leftRes !== null && leftRes !== p && leftRes !== q) {
    return leftRes; // 直接返回左子树的LCA，不递归右子树（剪枝）
  }

  // 【分解子问题2】左子树未找到LCA，才递归右子树（剪枝后仅必要时执行）
  // 📌 原版代码会无条件递归右子树，剪枝版仅左子树无LCA时才执行，减少递归次数
  const rightRes = lowestCommonAncestor(root.right, p, q);

  // 【推导父问题答案】根据左右子问题结果判断当前节点是否为LCA
  // 情况1：左右子树都有结果 → p在左、q在右（或反之）→ 当前节点是LCA
  // 📌 只有这一步会返回“新的公共祖先节点”，其他情况都是传递子问题结果
  if (leftRes && rightRes) {
    return root;
  }

  // 情况2：只有一侧有结果 → 两个目标都在该侧子树 → 向上传递结果
  // 🔴 易错点5：漏写该返回 → 函数无返回值，最终返回undefined，结果错误
  // 🔴 易错点6：误写成 return leftRes && rightRes → 逻辑错误，应返回存在的那一侧
  return leftRes ? leftRes : rightRes;
};
```

## 三、LCA 变种 1：多节点的最近公共祖先（力扣 1676）

### 3.1 题目链接

[1676. 二叉树的最近公共祖先 IV](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-iv/)

### 3.2 题目介绍

输入一棵不含重复值的二叉树，以及包含若干节点的列表 `nodes`（节点均存在于树中），计算这些节点的最近公共祖先。

### 3.3 核心思路

多节点 LCA 的本质是「分布范围判断」：

1. 若左右子树都包含目标节点 → 当前节点是 LCA；

2. 若所有目标节点都在左/右子树 → LCA 藏在该侧子树中；

3. 若当前节点是目标节点 → 直接返回当前节点。

### 3.4 代码实现

```JavaScript

/**
 * @param {TreeNode} root
 * @param {TreeNode[]} nodes
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, nodes) {
  // 题目保证nodes非空且所有节点都在树中，无需额外验证
  if (root === null) return null;

  // 终止条件：当前节点是目标节点之一（用Set优化includes效率）
  const nodeSet = new Set(nodes);
  if (nodeSet.has(root)) return root;

  // 分解子问题
  const left = lowestCommonAncestor(root.left, nodes);
  const right = lowestCommonAncestor(root.right, nodes);

  // 推导答案
  if (left && right) return root;
  return left || right;
};
```

## 四、LCA 变种 2：带存在性校验的 LCA（力扣 1644）

### 4.1 题目链接

[1644. 二叉树的最近公共祖先 II](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-ii/)

### 4.2 题目介绍

输入一棵不含重复值的二叉树，以及两个节点 `p` 和 `q`，若 `p` 或 `q` 不存在于树中则返回 `null`，否则返回它们的 LCA。

### 4.3 核心思路

在经典 LCA 基础上增加「节点存在性校验」，分为两步：

1. 先校验 `p/q` 是否同时存在于树中；

2. 若存在，调用经典 LCA 逻辑；若不存在，返回 `null`。

### 4.4 完整代码

```JavaScript

/**
 * 找二叉树中两个节点的最近公共祖先（LCA）
 * 核心特性：1. 先校验p/q是否都在树中 2. 递归剪枝优化 3. 时间复杂度O(n)
 * @param {TreeNode} root 二叉树根节点（节点对象）
 * @param {TreeNode} p 目标节点1（节点对象，非值）
 * @param {TreeNode} q 目标节点2（节点对象，非值）
 * @returns {TreeNode|null} 存在则返回LCA，否则返回null
 */
var lowestCommonAncestor = function (root, p, q) {
  // 【边界处理1】根节点为空 → 直接返回null
  // 🔴 易错点1：漏写该判断 → 后续hasNode调用会报错
  if (root === null) return null;

  // 【外层仅校验一次】验证p和q是否同时存在于树中（核心优化：避免递归内重复校验）
  // 🔴 易错点2：把hasNode放在递归内部 → 时间复杂度飙升至O(n²)
  if (!hasNode(root, p, q)) {
    return null;
  }

  // 调用核心LCA逻辑（递归分解问题+剪枝）
  return findLCA(root, p, q);

/**
 * 辅助函数：检查树中是否同时存在p和q（遍历思路+提前终止）
 * @param {TreeNode} root 根节点
 * @param {TreeNode} p 目标节点1
 * @param {TreeNode} q 目标节点2
 * @returns {boolean} 同时存在返回true，否则false
 */
function hasNode (root, p, q) {
  let hasP = false;
  let hasQ = false;

  function traverse(node) {
    if (node === null) return false;
    if (node === p) hasP = true;
    if (node === q) hasQ = true;
    if (hasP && hasQ) return true; // 找到后立即终止所有递归
    if (traverse(node.left)) return true;
    if (traverse(node.right)) return true;
    return false;
  }

  traverse(root);
  return hasP && hasQ;
};
  /**
   * 内部递归函数：找LCA（外层已保证p/q存在，无需再校验）
   * 核心思路：分解问题 → 整棵树的LCA = 左右子树LCA的推导结果
   * @param {TreeNode} node 当前遍历节点（参数名改node更语义化，避免和外层root混淆）
   * @param {TreeNode} p 目标节点1
   * @param {TreeNode} q 目标节点2
   * @returns {TreeNode|null} LCA节点
   */
  function findLCA(node, p, q) {

    if (node === null) return null;
    if (node === p || node === q) return node;
    const leftRes = findLCA(node.left, p, q);
    if (leftRes !== null && leftRes !== p && leftRes !== q) {
      return leftRes;
    }
    const rightRes = findLCA(node.right, p, q);

    if (leftRes && rightRes) {
      return node;
    }

    // 【推导答案】只有一侧有结果 → 传递该结果（p/q都在该侧子树）
    // 🔴 易错点6：漏写该返回 → 函数返回undefined，结果错误
    return leftRes ? leftRes : rightRes;
  }
};


```

## 五、LCA 变种 3：二叉搜索树的 LCA（力扣 235）

### 5.1 题目链接

[235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

### 5.2 题目介绍

输入一棵不含重复值的二叉搜索树（BST），以及存在于树中的两个节点 `p` 和 `q`，计算它们的最近公共祖先。

### 5.3 核心思路

利用 BST「左子树值都小、右子树值都大」的特性，无需遍历整棵树：

1. 若 `root.val` 介于 `p.val` 和 `q.val` 之间 → `root` 是 LCA；

2. 若 `root.val` 小于最小值 → LCA 在右子树；

3. 若 `root.val` 大于最大值 → LCA 在左子树。

### 5.4 代码实现

```JavaScript

/**
 * 找二叉搜索树（BST）中两个节点的最近公共祖先（LCA）
 * 核心思路：利用BST有序性（左小右大），单次路径递归，无需遍历整棵树
 * @param {TreeNode} root BST的根节点
 * @param {TreeNode} p 目标节点1（节点对象）
 * @param {TreeNode} q 目标节点2（节点对象）
 * @returns {TreeNode} LCA节点（题目保证p/q必存在）
 */
var lowestCommonAncestor = function (root, p, q) {
  // 【终止条件】当前节点为空 → 返回null（题目保证p/q存在，实际不会走到）
  // 🔴 易错点1：漏写该条件 → 递归到叶子节点的子节点时栈溢出
  if (root === null) return null;

  // 【终止条件】当前节点是p/q → 直接返回（p/q的LCA就是自己）
  // 🔴 易错点2：用root.val === p/q → 混淆节点对象和值，应直接比较节点
  if (root === p || root === q) return root;

  // 【核心：利用BST有序性，确定p/q的大小范围】
  // 先找到p/q值的最小值和最大值，避免多次判断
  const minVal = Math.min(p.val, q.val);
  const maxVal = Math.max(p.val, q.val);
  // 🔴 易错点3：初始赋值smaller/bigger为p，q.val=p.val时bigger还是p
  // 优化：用Math.min/max更简洁，且覆盖所有情况（包括p.val=q.val）

  // 情况1：当前节点值 < 最小值 → p/q都在右子树，递归右子树
  if (root.val < minVal) {
    return lowestCommonAncestor(root.right, p, q);
  }

  // 情况2：当前节点值 > 最大值 → p/q都在左子树，递归左子树
  if (root.val > maxVal) {
    return lowestCommonAncestor(root.left, p, q);
  }

  // 情况3：minVal ≤ root.val ≤ maxVal → 当前节点是LCA（p/q分属左右，或其中一个是当前节点）
  // 🎯 这是BST-LCA的核心：第一个满足该条件的节点就是最近公共祖先
  return root;
};
```

## 六、LCA 变种 4：带父指针的 LCA（力扣 1650）

### 6.1 题目链接

[1650. 二叉树的最近公共祖先 III](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-iii/)

### 6.2 题目介绍

输入一棵二叉树的两个节点 `p` 和 `q`（节点包含 `parent` 指针，无树根节点输入），返回它们的最近公共祖先。

### 6.3 核心思路

将问题转化为「单链表相交问题」：

1. 把 `parent` 指针看作链表的 `next` 指针；

2. 用双指针遍历两条链表，走到头后切换到对方起点，最终相遇在相交节点（LCA）。

用通俗的例子：

- 你从「A 点（p）」出发，要走的路：A→B→C→D（C 是碰面的地方，对应 LCA）；
- 朋友从「E 点（q）」出发，要走的路：E→C→D；
- 路的尽头 D 是 “死胡同”（对应根节点的 parent=null）。
- 如果你们都 “走到头就换对方的起点重新走”，最终一定会在 C 碰面 —— 因为你们走的总步数完全相同，只是走的顺序不一样。

### 6.4 代码实现

```JavaScript

/**
 * 找带parent指针的二叉树中p和q的最近公共祖先（LCA）
 * 核心思路：将p/q的parent路径转化为「相交链表」，双指针找第一个相交节点
 * 特性：O(1) 额外空间、O(h) 时间复杂度（h为树高），最优解法
 * @param {Node} p 目标节点1（结构：{ val, left, right, parent }）
 * @param {Node} q 目标节点2（结构同上）
 * @returns {Node} 最近公共祖先（题目保证p/q必存在于树中）
 */
function findLCA(p, q) {
  // 初始化双指针，分别指向p和q
  let l1 = p;
  let l2 = q;

  // 核心循环：只要两个指针未相遇，就继续遍历
  // 🎯 循环终止条件：l1 === l2（相遇在LCA节点）
  while (l1 !== l2) {
    // 指针1的遍历规则：
    // - 若当前为null（走到根节点的父节点），则跳转到q的起点重新遍历
    // - 否则，向上走一步（指向父节点）
    l1 = l1 === null ? q : l1.parent;

    // 指针2的遍历规则（和指针1对称）：
    // - 若当前为null，跳转到p的起点重新遍历
    // - 否则，向上走一步
    l2 = l2 === null ? p : l2.parent;
  }

  // 相遇时，l1/l2就是LCA（此时l1===l2）
  return l1;
}
```

## 七、核心总结

### 7.1 LCA 核心规律

1. **普通二叉树 LCA**：后序递归，通过左右子树结果判断当前节点是否为 LCA；

2. **BST LCA**：利用有序性，单次路径递归，无需遍历整棵树；

3. **带父指针 LCA**：转化为链表相交问题，双指针路径对齐；

4. **多节点/带校验 LCA**：在经典 LCA 基础上扩展分布判断/存在性校验。

### 7.2 关键易错点

1. 混淆「节点对象」和「节点值」：LCA 问题中需比较节点引用，而非值；

2. 递归终止条件缺失：树的递归必须先判断节点是否为空；

3. 剪枝逻辑错误：需先判断返回值非空，再判断是否为目标节点；

4. 存在性校验重复调用：外层仅校验一次，避免时间复杂度飙升。

### 7.3 解题思路升华

LCA 问题的本质是「子树分布判断」：

- 跨左右子树分布 → 当前节点是 LCA；

- 全在单侧子树 → LCA 藏在该侧子树中；

- 利用数据结构特性（BST 有序性、父指针链表）可进一步优化效率。
