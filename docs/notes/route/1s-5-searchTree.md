# 二叉搜索树（BST）核心心法：从特性到实战，理解高频考点

二叉搜索树（Binary Search Tree，简称BST）是算法领域最基础、最常用的树形数据结构之一，其「左小右大」的核心特性赋予了它高效的查找、插入、删除能力，时间复杂度均为O(logN)（平衡BST下）。同时，BST的中序遍历天然升序的特性，使其能轻松解决有序性相关问题。本文将从**BST核心特性**出发，循序渐进讲解**基础操作、经典题型、进阶实战**，提炼通用解题心法，帮你彻底吃透BST所有高频考点。

## 一、BST核心特性：一切操作的基础

BST的定义看似简单，却是所有解题思路的源头，必须牢牢掌握**严格定义**和**衍生性质**，避免因理解偏差导致解题错误。

### 1.1 严格定义（3条核心规则）

对于BST的任意一个节点`node`，必须同时满足：

1. 左子树的**所有节点**值都**严格小于**`node.val`；

2. 右子树的**所有节点**值都**严格大于**`node.val`；

3. 左子树和右子树自身也必须是合法的BST。

**关键误区**：切勿简化为「仅当前节点大于左子节点、小于右子节点」，深层子节点的约束会被忽略，导致BST合法性判断、遍历等操作出错。

### 1.2 核心衍生性质（算法解题的关键）

从严格定义可推导出2个最常用的性质，几乎所有BST题目都围绕这两个性质展开：

1. **高效查找性**：根据「左小右大」，查找目标节点时可一次性排除一半子树，无需遍历所有节点，基础查找/插入/删除的时间复杂度为O(logN)（平衡BST），远优于普通二叉树的O(N)；

2. **中序遍历有序性**：BST的中序遍历（左→根→右）结果为**严格升序**，逆序中序遍历（右→根→左）结果为**严格降序**。这一性质是解决「第K小元素」「累加树转换」等有序性问题的核心。

### 1.3 BST与普通二叉树的核心区别

普通二叉树的操作仅能通过**全遍历**（前/中/后序）实现，而BST可通过**特性引导遍历**（根据目标值与当前节点值的大小，决定左/右子树遍历），大幅提升效率；同时，BST的有序性是普通二叉树不具备的，这是解决各类有序问题的天然优势。

## 二、BST基础操作：查、增、删、验（高频面试题）

BST的基础操作是所有进阶题型的铺垫，核心思路是**「特性引导遍历找位置 + 针对性修改」**，其中「删除」和「合法性验证」略复杂，需重点掌握。

### 2.1 查找节点（力扣700题）

#### 核心思路

利用「左小右大」特性，递归/迭代引导遍历：目标值大于当前节点值则走右子树，小于则走左子树，等于则找到目标节点，空节点则表示未找到。

#### 实现代码（递归版，简洁高效）

```JavaScript

/**
 * 查找BST中值为target的节点，找到返回节点，未找到返回null
 * @param {TreeNode} root BST根节点
 * @param {number} target 目标值
 * @return {TreeNode} 目标节点/null
 */
var searchBST = function(root, target) {
    // 递归终止：空节点未找到，直接返回null
    if (root === null) return null;
    // 目标值更大，去右子树查找
    if (target > root.val) return searchBST(root.right, target);
    // 目标值更小，去左子树查找
    if (target < root.val) return searchBST(root.left, target);
    // 找到目标节点，返回当前节点
    return root
};
```

#### 复杂度

时间：O(logN)（平衡BST）/ O(N)（链状BST），空间：O(logN)（递归栈）。

### 2.2 插入节点（力扣701题）

#### 核心思路

1. BST插入的**关键性质**：新节点最终必作为**叶子节点**插入，无需调整原有树结构（输入保证新值唯一）；

2. 利用特性找到空节点（插入位置），创建新节点并返回，回溯时完成父节点与新节点的链接。

#### 实现代码

```JavaScript

/**
 * 向BST插入新值，保持BST性质，返回插入后的根节点
 * @param {TreeNode} root BST根节点
 * @param {number} value 新值（保证唯一）
 * @return {TreeNode} 插入后的根节点
 */
function insertIntoBST(root, value) {
    // 递归终止：找到空节点，创建新节点作为插入位置
    if (root === null) return new TreeNode(value);
    // 新值更大，去右子树插入，更新右子树链接
    if (value > root.val) {
        root.right = insertIntoBST(root.right, value);
    } else {
        // 新值更小，去左子树插入，更新左子树链接
        root.left = insertIntoBST(root.left, value);
    }
    // 回溯返回当前节点，保证树结构连续
    return root;
}
```

#### 复杂度

时间：O(logN)，空间：O(logN)（递归栈）。

### 2.3 验证BST合法性（力扣98题）

#### 核心思路

1. 关键问题：单个节点的合法值范围由**所有祖先节点**共同决定，而非仅父节点；

2. 解决方案：递归传递**动态上下界**，为每个节点划定开区间合法范围`(min, max)`，节点值必须严格在区间内，同时左右子树也需合法。

#### 实现代码

```JavaScript

/**
 * 验证二叉树是否为合法BST
 * @param {TreeNode} root 二叉树根节点
 * @return {boolean} 是否为合法BST
 */
function isValidBST(root) {
    // 空树视为合法BST，根节点初始上下界为负无穷/正无穷
    return traverse(root, -Infinity, Infinity);
    
    // 递归辅助：验证当前节点是否在(min, max)区间内
    function traverse(node, min, max) {
        if (node === null) return true;
        // 节点值超出开区间，直接判定非法
        if (node.val <= min || node.val >= max) return false;
        // 验证左子树：上界更新为当前节点值，下界继承
        const leftValid = traverse(node.left, min, node.val);
        // 验证右子树：下界更新为当前节点值，上界继承
        const rightValid = traverse(node.right, node.val, max);
        // 左右子树都合法，当前子树才合法
        return leftValid && rightValid;
    }
}
```

#### 关键易错点

- 初始上下界必须为`(-Infinity, Infinity)`，根节点无祖先约束；

- 必须用**开区间**（`<= / >=`），避免节点值等于边界（如`[2,2,2]`误判为合法）。

### 2.4 删除节点（力扣450题，核心难点）

#### 核心思路

先通过特性找到目标节点，再分**4种情况**处理删除，核心是「删除后保持BST性质」，其中「有左右双孩子」的情况是难点。

#### 4种删除情况

1. 目标节点是**叶子节点**（左右子树均空）：直接删除，返回null让父节点置空该子树；

2. 只有右子树：用右子树替换当前节点，返回右子树根节点；

3. 只有左子树：用左子树替换当前节点，返回左子树根节点；

4. 有**左右双孩子**（核心）：选择「左子树最大值节点（前驱）」或「右子树最小值节点（后继）」替换当前节点，再删除该替换节点（保证BST性质不变）。

#### 实现代码（前驱节点替换法，不修改节点值，仅调整指针）

```JavaScript

/**
 * 删除BST中值为key的节点，保持BST性质，返回删除后的根节点
 * @param {TreeNode} root BST根节点
 * @param {number} key 要删除的节点值
 * @return {TreeNode} 删除后的根节点
 */
function deleteNode(root, key) {
    // 递归终止：空树/未找到目标节点，返回null
    if (root === null) return null;

    // 目标值更大，去右子树递归删除，更新右子树链接
    if (key > root.val) {
        root.right = deleteNode(root.right, key);
        return root;
    }
    // 目标值更小，去左子树递归删除，更新左子树链接
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
        return root;
    }

    // 找到目标节点，分情况处理
    if (key === root.val) {
        // 情况1：叶子节点，直接删除
        if (!root.left && !root.right) return null;
        // 情况2：只有右子树，用右子树替换
        if (!root.left) return root.right;
        // 情况3：只有左子树，用左子树替换
        if (!root.right) return root.left;
        // 情况4：有双孩子，左子树最大值（前驱）替换
        let maxLeft = root.left;
        // 找到左子树最右侧节点（最大值）
        while (maxLeft.right) maxLeft = maxLeft.right;
        // 先删除左子树的最大值节点
        root.left = deleteNode(root.left, maxLeft.val);
        // 用前驱节点替换当前节点，调整指针
        maxLeft.left = root.left;
        maxLeft.right = root.right;
        return maxLeft;
    }

    return root;
}
```

#### 复杂度

时间：O(logN)，空间：O(logN)（递归栈）。

## 三、BST经典题型：利用有序性解决问题

BST的中序遍历有序性是解决这类问题的「黄金钥匙」，核心思路是**「通过中序遍历将BST转化为有序序列，再针对性处理」**，无需额外排序，时间复杂度最优。

### 3.1 寻找第K小的元素（力扣230题）

#### 题目要求

给定BST，查找其中第K小的元素（从1开始计数）。

#### 核心思路

利用BST**中序遍历升序**的特性，中序遍历过程中维护全局计数，遍历到第K个节点时即为答案，找到后立即终止遍历（剪枝）。

#### 实现代码

```JavaScript

/**
 * 查找BST中第K小的元素
 * @param {TreeNode} root BST根节点
 * @param {number} k 第k小（1<=k<=节点总数）
 * @return {number} 第k小节点值
 */
var kthSmallest = function(root, k) {
    let res = null; // 存储结果
    let rank = 0;   // 全局计数，记录当前遍历节点的排名

    // 中序遍历：左→根→右
    function traverse(node) {
        // 递归终止：空节点/已找到目标，直接返回
        if (node === null || res !== null) return;
        // 遍历左子树
        traverse(node.left);
        // 处理当前节点：计数+判断是否为第k小
        rank++;
        if (rank === k) {
            res = node.val;
            return;
        }
        // 遍历右子树
        traverse(node.right);
    }

    traverse(root);
    return res;
};
```

#### 关键优化

找到目标后立即终止遍历，避免无效的后续递归，提升实际执行效率。

### 3.2 BST转化为累加树（力扣538/1038题）

#### 题目要求

将BST转化为累加树，使每个节点的新值等于原树中**大于或等于**该节点值的所有节点值之和。

#### 核心思路

1. BST中序遍历（左→根→右）为升序 → **逆序中序遍历（右→根→左）为降序**；

2. 逆序遍历过程中维护全局累加和`sum`，先遍历的节点值一定更大，累加后赋值给当前节点，自然得到「所有大于等于当前节点值的和」。

#### 实现代码

```JavaScript

/**
 * 将BST转化为累加树，直接修改原树，返回根节点
 * @param {TreeNode} root BST根节点
 * @return {TreeNode} 累加树根节点
 */
function convertBST(root) {
    if (root === null) return null;
    let sum = 0; // 全局累加和，记录所有已遍历节点值的和

    // 逆序中序遍历：右→根→左
    function traverse(node) {
        if (node === null) return;
        // 先遍历右子树（更大的节点）
        traverse(node.right);
        // 处理当前节点：累加+更新值
        sum += node.val;
        node.val = sum;
        // 再遍历左子树（更小的节点）
        traverse(node.left);
    }

    traverse(root);
    return root;
}
```

#### 优势

直接修改原树节点值，空间复杂度仅为O(logN)（递归栈），无需额外创建节点，为最优解。

## 四、BST进阶题型：构造与子树问题

这类题目属于BST的高频难题，核心考察**动态规划**和**后序遍历的信息收集能力**，其中「二叉搜索子树的最大键值和」是综合考察的典型代表。

### 4.1 构造不同的BST（力扣96/95题）

这类题目考察BST的组合特性，核心是**「以任意节点为根，拆分左右子树节点数，利用乘法原理计算组合数/生成组合」**。

#### 4.1.1 计算BST种数（力扣96题，动态规划+卡特兰数）

##### 核心思路

1. 关键性质：BST的种数仅与**节点数量**有关，与节点具体值无关；

2. 动态规划定义：`dp[i]`表示`i`个节点能组成的不同BST种数；

3. 状态转移：选`j`为根节点，左子树有`j-1`个节点，右子树有`i-j`个节点，总种数为`dp[j-1] * dp[i-j]`（乘法原理）。

##### 实现代码

```JavaScript

/**
 * 计算n个节点（1~n）能组成的不同BST种数
 * @param {number} n 节点总数
 * @return {number} BST种数
 */
function numTrees(n) {
    const dp = new Array(n + 1).fill(0);
    // 边界条件：0个/1个节点，仅1种BST
    dp[0] = 1;
    dp[1] = 1;

    // 计算2~n个节点的种数
    for (let i = 2; i <= n; i++) {
        let total = 0;
        // 枚举根节点j，拆分左右子树
        for (let j = 1; j <= i; j++) {
            total += dp[j - 1] * dp[i - j];
        }
        dp[i] = total;
    }

    return dp[n];
}
```

##### 本质

该问题的解为**卡特兰数**，适用于所有「合法组合数」问题（如括号生成、出栈顺序等）。

#### 4.1.2 生成所有BST（力扣95题，递归+子问题复用）

##### 核心思路

递归构造闭区间`[lo, hi]`的所有BST：枚举区间内每个数为根节点，递归生成左右子树的所有组合，再通过笛卡尔积组合左右子树与根节点。

##### 实现代码

```JavaScript

/**
 * 生成n个节点（1~n）的所有不同BST，返回根节点数组
 * @param {number} n 节点总数
 * @return {TreeNode[]} 所有BST根节点数组
 */
var generateTrees = function(n) {
    if (n === 0) return [];
    // 构造闭区间[1, n]的所有BST
    return build(1, n);

    // 递归构造闭区间[lo, hi]的所有BST
    function build(lo, hi) {
        const res = [];
        // 边界条件：lo>hi，添加null（保证叶子节点能被正确创建）
        if (lo > hi) {
            res.push(null);
            return res;
        }
        // 枚举根节点
        for (let i = lo; i <= hi; i++) {
            // 递归生成左右子树的所有组合
            const leftTrees = build(lo, i - 1);
            const rightTrees = build(i + 1, hi);
            // 组合左右子树与根节点
            for (const left of leftTrees) {
                for (const right of rightTrees) {
                    const root = new TreeNode(i);
                    root.left = left;
                    root.right = right;
                    res.push(root);
                }
            }
        }
        return res;
    }
};
```

### 4.2 二叉搜索子树的最大键值和（力扣1373题，BST综合实战）

该题是BST后序遍历的经典代表，考察**「子树信息收集与传递」**能力，是大厂面试的高频难题。

#### 题目要求

给定一棵二叉树，找到其中**所有合法BST子树**的最大键值和（若所有BST子树和为负，返回0）。

#### 核心思路

1. 问题拆解：需要同时完成「判断子树是否为BST」和「计算BST子树和」，两个需求都需要**子树的信息支撑**；

2. 后序遍历的优势：后序位置可获取子树的返回信息，能基于子树结果判断当前子树是否为BST、计算和值；

3. 四元信息推导：从需求倒推递归需要返回的4个关键信息（缺一不可）：

    - `isBST`：当前子树是否为合法BST；

    - `minVal`：当前子树的最小值（BST判断的关键）；

    - `maxVal`：当前子树的最大值（BST判断的关键）；

    - `sumVal`：当前子树的节点和（计算最大和的关键）。

4. 非BST隔离：非BST子树返回无效最值（`Infinity/-Infinity`），避免父节点误判。

#### 优化版实现代码（100%通过所有测试用例）

```JavaScript

/**
 * 找到二叉树中合法BST子树的最大键值和，负和返回0
 * @param {TreeNode} root 二叉树根节点
 * @return {number} 最大键值和/0
 */
var maxSumBST = function(root) {
    let maxSum = -Infinity; // 初始负无穷，兼容负权值BST

    // 后序遍历，返回四元信息[isBST, minVal, maxVal, sumVal]
    const postOrder = (node) => {
        if (!node) return [true, Infinity, -Infinity, 0]; // 空节点固定返回
        // 递归获取左右子树信息
        const [lBST, lMin, lMax, lSum] = postOrder(node.left);
        const [rBST, rMin, rMax, rSum] = postOrder(node.right);

        // 仅合法BST时处理，否则返回无效信息
        if (lBST && rBST && node.val > lMax && node.val < rMin) {
            const curSum = lSum + node.val + rSum;
            maxSum = Math.max(maxSum, curSum);
            return [true, Math.min(lMin, node.val), Math.max(rMax, node.val), curSum];
        }

        // 非BST返回无效信息，彻底隔离
        return [false, Infinity, -Infinity, 0];
    };

    postOrder(root);
    // 有合法BST则取max(maxSum,0)，无则返回0
    return Math.max(maxSum, 0);
};
```

#### 核心解题心法

**「从需求倒推条件，从条件倒推数据，让子问题的返回值支撑父问题的所有操作」**，这一思路适用于所有树的子树问题。

## 五、BST通用解题心法（精华总结）

通过以上知识点和题型分析，提炼出3条BST通用解题心法，掌握后可应对99%的BST题目：

### 心法1：紧抓「左小右大」和「中序有序」两大核心特性

- 涉及**查找、插入、删除、合法性验证**等基础操作，优先用「左小右大」特性引导遍历，减少无效操作；

- 涉及**有序性问题**（第K小、累加、排序、区间查询等），优先利用「中序遍历有序」特性，将BST转化为有序序列处理。

### 心法2：树的子树问题，优先考虑后序遍历+自定义返回信息

- 一旦题目要求「基于子树结果判断当前节点/子树」（如1373题、平衡树判断），必须用后序遍历；

- 自定义返回信息的推导逻辑：**需求→判断条件→所需数据**，确保子问题的返回值能支撑父问题的所有判断和计算，无冗余、无缺失。

### 心法3：BST的构造/组合问题，利用「根节点拆分+乘法原理」

- 构造BST时，任意节点都可作为根节点，只需拆分左右子树的节点数/值范围；

- 组合数计算用动态规划（卡特兰数），组合生成用递归+笛卡尔积，复用子问题结果避免重复计算。


## 总结

二叉搜索树是算法学习的重点，其核心价值在于「**高效的有序操作能力**」。从基础的「左小右大」定义，到中序遍历的有序性，再到后序遍历的信息收集，所有知识点和题型都围绕这两个核心特性展开。

学习BST的关键不是死记硬背代码，而是**理解特性背后的逻辑，掌握解题心法的推导过程**：比如从需求倒推递归的返回信息，从特性引导遍历的方向。通过练习基础操作、经典有序问题、进阶构造和子树问题，逐步形成BST的解题思维，最终能灵活应对各类高频考点和面试难题。

掌握BST后，后续可深入学习**平衡二叉树**（红黑树、AVL树），理解如何解决BST链状化导致的效率降低问题，进一步完善树形数据结构的知识体系。

<!-- 二叉搜索树

这个左小右大的特性，可以让我们在 BST 中快速找到某个节点，或者找到某个范围内的所有节点，这是 BST 的优势所在。

```js
// 利用 BST 的特性搜索指定元素
let targetNode = null;

function traverse(root, targetVal) {
    if (root === null) {
        return;
    }
    if (root.val === targetVal) {
        targetNode = root;
    }
    if (targetNode !== null) {
        // 已经找到目标，不需要继续遍历了
        return;
    }
    // 根据 targetVal 和当前节点的大小
    // 可以判断应该去左子树还是右子树进行搜索
    if (root.val < targetVal) {
        traverse(root.right, targetVal);
    } else {
        traverse(root.left, targetVal);
    }
}


let _bstRoot = BTree.createRoot([7, 4, 9, 1, 5, 8, 11]);
// 搜索元素 8
traverse(_bstRoot, 8);
```
想的时间复杂度是树的高度 O(logN)，而普通的二叉树遍历函数则需要 O(N) 的时间遍历所有节点。

至于其他增、删、改的操作，你首先查到目标节点，才能进行增删改的操作对吧？增删改的操作无非就是改一改指针，所以增删改的时间复杂度也是 O(logN)。
TreeMap 这个名字，应该就能看出来，它和前文介绍的 
哈希表 HashMap的结构是类似的，都是存储键值对的，HashMap 底层把键值对存储在一个 table 数组里面，而 TreeMap 底层把键值对存储在一棵二叉搜索树的节点里面。至于 TreeSet，它和 TreeMap 的关系正如哈希表 HashMap 和哈希集合 HashSet 的关系一样，说白了就是 TreeMap 的简单封装

树节点：
```js
// 之前的简单树节点
var TreeNode = function(val) {
    this.val = val;
    this.left = null;
    this.right = null;
};

// TreeMap里的树节点 多了一个key
class TreeNode {
  constructor(key, value) {
      this.key = key;  // 只增加了key属性
      this.value = value;
      this.left = null;
      this.right = null;
  }
}
```

要实现的TreeMap的接口如下
```js
// TreeMap 主要接口
class MyTreeMap<K, V> {

    // ****** Map 键值映射的基本方法 ******

    // 增/改，复杂度 O(logN)
    public void put(K key, V value) {}

    // 查，复杂度 O(logN)
    public V get(K key) {}

    // 删，复杂度 O(logN)
    public void remove(K key) {}

    // 是否包含键 key，复杂度 O(logN)
    public boolean containsKey(K key) {}

    // 返回所有键的集合，结果有序，复杂度 O(N)
    public List<K> keys() {}

    // ****** TreeMap 提供的额外方法 ******

    // 查找最小键，复杂度 O(logN)
    public K firstKey() {}

    // 查找最大键，复杂度 O(logN)
    public K lastKey() {}

    // 查找小于等于 key 的最大键，复杂度 O(logN)
    public K floorKey(K key) {}

    // 查找大于等于 key 的最小键，复杂度 O(logN)
    public K ceilingKey(K key) {}

    // 查找排名为 k 的键，复杂度 O(logN)
    public K selectKey(int k) {}

    // 查找键 key 的排名，复杂度 O(logN)
    public int rank(K key) {}

    // 区间查找，复杂度 O(logN + M)，M 为区间大小
    public List<K> rangeKeys(K low, K high) {}
}
```

## 基本的增删改查

- get 方法其实就类似上面可视化面板中查找目标节点的操作，根据目标 key 和当前节点的 key 比较，决定往左走还是往右走，可以一次性排除掉一半的节点，复杂度是 O(logN)。
- put, remove, containsKey 方法，其实也是要先利用 get 方法找到目标键所在的节点，然后做一些指针操作，复杂度都是
- floorKey, ceilingKey 方法是查找小于等于/大于等于某个键的最大/最小键，这个方法的实现和 get 方法类似，唯一的区别在于，当找不到目标 key 时，get 方法返回空指针，而 ceilingKey, floorKey 方法则返回和目标 key 最接近的键，类似上界和下界。
- rangeKeys 方法输入一个 [low, hi] 区间，返回这个区间内的所有键。这个方法的实现也是利用 BST 的性质提高搜索效率。如果当前节点的 key 小于 low，那么当前节点的整棵左子树都小于 low，根本不用搜索了；如果当前节点的 key 大于 hi，那么当前节点的整棵右子树都大于 hi，也不用搜索了。
- firstKey 方法是查找最小键，lastKey 方法是查找最大键，借助 BST 左小右大的特性，非常容易实现
- keys 方法返回所有键，且结果有序。可以利用 BST 的中序遍历结果有序的特性。
- selectKey 方法是查找排名为 k 的键（从小到大，从 1 开始），rank 方法是查找目标 key 的排名。

selectKey 方法，一个容易想到的方法是利用 BST 中序遍历结果有序的特性，中序遍历的过程中记录第 k 个遍历到节点，就是排名为 k 的节点。

但是这样的时间复杂度是 O(k)，因为你至少要用中序遍历经过 k 个节点。

一个更巧妙的办法是给二叉树节点中新增更多的字段记录额外信息：size 维护的就是当前节点为根的整棵树上有多少个节点，加上 BST 左小右大的特性，那么对于根节点，它只需要查询左子树的节点个数，就知道了自己在以自己为根的这棵树上的排名；知道了自己的排名，就可以确定目标排名的那个节点存在于左子树还是右子树上，从而避免搜索整棵树。这样也提高了维护的复杂性，因为每次插入、删除节点都要动态地更新这个额外的 size 字段，确保它的正确性。
rank 方法，也可以利用这个 size 字段。比方说你调用 rank(9)，想知道节点 9 这个元素排名第几，根节点 7 知道左子树有 3 个节点，加上自己共有 4 个节点，即自己排名第 4；然后 7 可以去右子树递归调用 rank(9)，计算节点 9 在右子树中的排名，最后再加上 4，就是整棵树中节点 9 的排名：


rank(node(7), 9) = 3 + 1 + rank(node(9), 9) = 3 + 1 + 1 = 5

```js
class TreeNode {
  constructor(key, value) {
      this.size = size;  
      this.key = key;  
      this.value = value;
      this.left = null;
      this.right = null;
  }
}
```
练习

## 二叉搜索树心法（特性篇）

首先，BST 的特性大家应该都很熟悉了：

1、对于 BST 的每一个节点 node，左子树节点的值都比 node 的值要小，右子树节点的值都比 node 的值大。

2、对于 BST 的每一个节点 node，它的左侧子树和右侧子树都是 BST。

从做算法题的角度来看 BST，除了它的定义，还有一个重要的性质：BST 的中序遍历结果是有序的（升序）。

寻找第 K 小的元素
这是力扣第 230 题「二叉搜索树中第 K 小的元素」，看下题目：

给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。

```js
/**
 * 二叉搜索树中第K小的元素（力扣230题通关版，93/93用例全过）
 * 核心解题思路：利用BST中序遍历（左→根→右）天然升序的特性，遍历到第k个节点即为答案
 * 实现方式：闭包维护全局计数和结果，中序递归遍历计数，找到目标立即赋值
 * @param {TreeNode} root - BST的根节点（力扣平台自动传入，节点含val/left/right属性）
 * @param {number} k - 第k小元素（题目保证1≤k≤节点总数，从1开始计数）
 * @return {number} 第k小节点的数值
 */
var kthSmallest = function(root, k) {
  // 记录最终结果，初始值0（因BST节点值为数字，且找到后会覆盖，不影响结果）
  let res = null;
  // 记录当前遍历节点的排名（全局计数），初始值0：表示尚未遍历任何节点
  // 易错点1：必须定义在traverse外！若定义在内部，每次递归会重新初始化，无法累计计数
  let rank = 0;

  /**
   * 中序遍历递归辅助函数（闭包特性：共享外层的res和rank，无需传参）
   * @param {TreeNode} node - 当前遍历的节点（形参用node更语义化，原始代码用root因作用域隔离无歧义）
   */
  var traverse = function(node) {
      // 递归终止条件：遇到空节点直接返回，防止无限递归导致栈溢出
      // 易错点2：所有二叉树递归必须有此终止条件！遗漏会触发Maximum call stack size exceeded
      if (node === null || res !== null) {
          return;
      }

      // 1. 中序遍历第一步：递归遍历左子树（BST核心性质：左子树所有节点值 < 当前节点值，优先遍历）
      traverse(node.left);

      // 2. 中序遍历核心位置：处理当前节点（左子树遍历完毕，才轮到当前节点计数）
      // 先自增排名，再判断：表示「当前节点是第rank个被遍历的节点」，计数逻辑严谨无边界漏洞
      // 易错点3：计数时机是关键！先增后判（rank初始0）比先判后增（rank初始1）更适配BST遍历，无隐性计数漏洞
      rank++;
      // 找到第k小节点：当前节点排名等于目标k
      if (k === rank) {
          // 赋值结果：当前节点即为目标节点，记录其值
          // 易错点4：必须赋值node.val！若误写root.val会永远返回根节点值，完全错误
          res = node.val;
          // 立即返回：终止当前层级的递归，无需继续处理后续逻辑
          return;
      }

      // 3. 中序遍历第三步：递归遍历右子树（左子树+当前节点都不是目标，再遍历右子树）
      traverse(node.right);
  }

  // 调用中序遍历函数，启动遍历（闭包特性，traverse可访问外层root/k/res/rank）
  traverse(root);
  // 遍历结束后，res已存储第k小节点值，直接返回
  return res;
}
```

## BST 转化累加树

力扣第 538 题和 1038 题都是这道题，完全一样，你可以把它们一块做掉。看下题目

给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。

提醒一下，二叉搜索树满足下列约束条件：

节点的左子树仅包含键 小于 节点键的节点。
节点的右子树仅包含键 大于 节点键的节点。
左右子树也必须是二叉搜索树。

```js
/**
 * 力扣538题：把二叉搜索树转换为累加树
 * 题目要求：每个节点的新值 = 自身原始值 + 所有比它大的节点原始值之和
 * 核心思路：BST中序遍历（左→根→右）为升序 → 逆序中序遍历（右→根→左）为严格降序
 *          逆序遍历中维护全局累加和sum，先遍历的节点值一定更大，累加后自然得到「所有更大节点值的和」
 * 实现亮点：闭包维护sum，直接修改原树节点值（空间复杂度O(h)仅为递归栈，最优）
 * @param {TreeNode} root - 输入的BST根节点
 * @return {TreeNode} 转换后的累加树根节点（原树直接修改，无需新建节点）
 */
function convertBST(root) {
  // 基础终止：空树直接返回null，符合题目要求
  if (root === null) return null;
  
  // 闭包全局累加和：初始0，记录「所有已遍历节点的原始值总和」（已遍历节点都比当前节点大）
  // 易错点1：必须定义在traverse外！若定义在内部，每次递归会重置sum=0，无法累计累加和
  let sum = 0;

  // 调用逆序中序遍历函数，启动节点值更新
  traverse(root);
  
  // 核心：累加树直接修改原BST的节点val，最终返回原根节点即可
  return root;

  /**
   * 逆序中序遍历递归辅助函数（右→根→左）：核心执行累加和节点更新
   * @param {TreeNode} node - 当前遍历的节点（形参用node更语义化，避免与外层root混淆）
   */
  function traverse(node) {
    // 递归终止条件：遇到空节点直接返回，防止无限递归导致栈溢出
    // 易错点2：所有二叉树递归必备！遗漏会触发Maximum call stack size exceeded
    if (node === null) return;

    // 1. 逆序中序第一步：优先遍历右子树（BST核心性质：右子树所有节点值 > 当前节点值）
    // 先遍历完所有更大的节点，保证sum是「所有比当前节点大的节点值总和」
    traverse(node.right);

    // 2. 逆序中序核心：处理当前节点（右子树遍历完毕，才更新当前节点）
    // 先将当前节点原始值累加到sum → sum变为「当前节点+所有更大节点的原始值总和」
    sum += node.val;
    // 再将sum赋值给当前节点val → 完成当前节点的累加更新，符合题目要求
    // 此写法与「node.val += sum; sum = node.val;」等价，逻辑更直观
    node.val = sum;

    // 3. 逆序中序第三步：最后遍历左子树（BST核心性质：左子树所有节点值 < 当前节点值）
    // 此时sum已包含当前节点值，左子树节点可直接累加「当前节点+所有更大节点的值」
    traverse(node.left);
  }
}
```

## 二叉搜索树心法（基操篇）

LeetCode	力扣	难度
450. Delete Node in a BST	450. 删除二叉搜索树中的节点	
701. Insert into a Binary Search Tree	701. 二叉搜索树中的插入操作	
700. Search in a Binary Search Tree	700. 二叉搜索树中的搜索	
98. Validate Binary Search Tree	98. 验证二叉搜索树	


我们前文 
二叉搜索树心法（特性篇）
 介绍了 BST 的基本特性，还利用二叉搜索树「中序遍历有序」的特性来解决了几道题目，本文来实现 BST 的基础操作：判断 BST 的合法性、增、删、查。其中「删」和「判断合法性」略微复杂。

 左小右大

 ```js
var BST = function(root, target) {
    if (root.val === target) {
        // 找到目标，做点什么
    }
    if (root.val < target) { 
        BST(root.right, target);
    }
    if (root.val > target) {
        BST(root.left, target);
    }
};
 ```

一、判断 BST 的合法性
力扣第 98 题「验证二叉搜索树」就是让你判断输入的 BST 是否合法：

给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

有效 二叉搜索树定义如下：

节点的左子树只包含 小于 当前节点的数。
节点的右子树只包含 大于 当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。

```js
/**
 * 力扣98题：验证二叉搜索树（Valid Binary Search Tree）
 * 题目核心要求：判断二叉树是否满足BST严格规则
 * 1. 左子树「所有节点」值 < 当前节点值；
 * 2. 右子树「所有节点」值 > 当前节点值；
 * 3. 左右子树自身也必须是合法BST；
 * 解题核心思路：递归传递「动态上下界」，为每个节点划定合法值范围
 * 每个节点的合法范围由「所有祖先节点」共同决定，而非仅父节点，完美覆盖整棵子树的限制
 * @param {TreeNode} root - 二叉树的根节点（节点结构：val/left/right）
 * @return {boolean} 该二叉树是否为有效BST
 */
function valid(root) {
  // 边界处理：空树直接判定为合法BST（题目隐含要求，空树是任意BST的子树）
  if (root === null) return true;

  // 调用递归辅助函数，初始化根节点的上下界
  // 易错点1：初始上下界必须是(-Infinity, Infinity)，根节点无祖先，无值范围限制
  // 错误写法：min=Infinity/max=-Infinity（直接导致根节点判定非法）
  return isValid(root, -Infinity, Infinity);

  /**
   * 递归验证辅助函数：为每个节点划定「开区间合法范围 (min, max)」
   * 开区间：节点值必须严格大于min、严格小于max，禁止等于（符合BST严格大小要求）
   * @param {TreeNode} node - 当前正在验证的节点
   * @param {number} min - 当前节点的「合法最小值」（开区间，node.val 必须 > min）
   * @param {number} max - 当前节点的「合法最大值」（开区间，node.val 必须 < max）
   * @return {boolean} 以当前node为根的子树是否为合法BST
   */
  function isValid(node, min, max) {
    // 递归终止条件：空节点是合法BST（所有递归的基础终止，避免无限递归）
    // 易错点2：遗漏此条件会触发「Maximum call stack size exceeded」栈溢出错误
    if (node === null) return true;

    // 核心判断1：当前节点值超出合法范围，直接判定为非法，提前剪枝
    // 易错点3：必须用「<= / >=」（开区间），而非「< / >」（闭区间）
    // 错误后果：允许节点值等于边界，违反BST严格大小规则（如[2,2,2]会被判合法）
    // 易错点4：不可遗漏任意一个条件（node.val <= min 或 node.val >= max 都非法）
    if (node.val <= min || node.val >= max) return false;

    // 递归验证左子树，并动态更新其合法上下界
    // 左子树规则：所有节点值 < 当前节点值 → 左子树的「上界」更新为当前节点值
    // 左子树继承当前节点的「下界min」，因为左子树仍需满足大于所有祖先的下界限制
    const leftIsValid = isValid(node.left, min, node.val);

    // 递归验证右子树，并动态更新其合法上下界
    // 右子树规则：所有节点值 > 当前节点值 → 右子树的「下界」更新为当前节点值
    // 右子树继承当前节点的「上界max」，因为右子树仍需满足小于所有祖先的上界限制
    // 易错点5：上下界传递顺序不可颠倒（左子树传min+当前val，右子树传当前val+max）
    // 错误后果：深层子节点范围限制错误，漏判非法场景（如左子树的右节点大于根节点）
    const rightIsValid = isValid(node.right, node.val, max);

    // 核心判断2：只有左、右子树都合法，当前子树才是合法BST
    // 易错点6：不可重复判断同一子树（如leftIsValid && leftIsValid），遗漏右子树验证
    // 错误后果：右子树无论是否非法，都会返回true，彻底失效
    return leftIsValid && rightIsValid;
  }
}
```

### 在 BST 中搜索元素
力扣第 700 题「二叉搜索树中的搜索」就是让你在 BST 中搜索值为 target 的节点，函数签名如下：

```js
var searchBST = function(root, target) {
  if(root === null) return null
  if(target>root.val){
    return searchBST(root.right,target)
  }
  if(target<root.val){
    return searchBST(root.left,target)
  }
  return root
}
```

## 在 BST 中插入一个数
对数据结构的操作无非遍历 + 访问，遍历就是「找」，访问就是「改」。具体到这个问题，插入一个数，就是先找到插入位置，然后进行插入操作。

因为 BST 一般不会存在值重复的节点，所以我们一般不会在 BST 中插入已存在的值。下面的代码都默认不会向 BST 中插入已存在的值。

上一个问题，我们总结了 BST 中的遍历框架，就是「找」的问题。直接套框架，加上「改」的操作即可。

一旦涉及「改」，就类似二叉树的构造问题，函数要返回 TreeNode 类型，并且要对递归调用的返回值进行接收。

力扣第 701 题「二叉搜索树中的插入操作」就是这个问题：

给定二叉搜索树（BST）的根节点 root 和要插入树中的值 value ，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据 保证 ，新值和原始二叉搜索树中的任意节点值都不同。

注意，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回 任意有效的结果 。

```js
/**
 * 力扣701题：二叉搜索树中的插入操作
 * 题目要求：将新值插入BST中，保持BST性质不变，返回插入后的根节点
 * 核心思路：利用BST递归性质找插入位置，新节点最终必作为叶子节点插入（无需调整原有树结构）
 * BST插入规则：
 * 1. 新值 > 当前节点值 → 去右子树寻找插入位置
 * 2. 新值 < 当前节点值 → 去左子树寻找插入位置
 * 3. 输入保证新值与树中所有节点值不同，无需处理相等情况
 * @param {TreeNode} root - 原始BST的根节点（节点结构：val/left/right）
 * @param {number} value - 要插入的新值（保证与树中所有节点值唯一）
 * @return {TreeNode} 插入新值后的BST根节点（原树基础上修改，无需新建整棵树）
 */
function insertIntoBST(root, value) {
  // 递归终止条件：找到空节点，即为新值的插入位置，创建新节点并返回
  // 易错点1：此处参数名需与函数入参一致（原代码写val会报未定义错误，已修复为value）
  // 核心逻辑：新节点最终一定作为叶子节点插入，这是BST插入的关键性质
  if (root === null) return new TreeNode(value);

  // 新值大于当前节点值 → 去右子树插入，递归处理右子树
  // 关键：将递归返回的新子树根节点赋值给当前节点的right，完成链接
  if (value > root.val) {
    root.right = insertIntoBST(root.right, value);
  }

  // 新值小于当前节点值 → 去左子树插入，递归处理左子树
  // 关键：将递归返回的新子树根节点赋值给当前节点的left，完成链接
  if (value < root.val) {
    root.left = insertIntoBST(root.left, value);
  }

  // 递归回溯：返回当前节点（作为父节点的左/右子节点，完成树的链接）
  // 根节点最终会被返回，作为插入后的整棵树的根节点
  return root;
}

```

三、在 BST 中删除一个数
力扣第 450 题「删除二叉搜索树中的节点」就是让你在 BST 中删除一个值为 key 的节点：

给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

首先找到需要删除的节点；
如果找到了，删除它。

```js
/**
 * 力扣450题：删除二叉搜索树中的节点
 * 题目要求：删除BST中值为key的节点，保持BST严格升序性质，返回删除后的根节点
 * 核心思路：递归查找目标节点 + 分4种情况处理删除 + 左子树最大值替换法
 * 核心特性：BST删除仅需修改节点引用，无需新建整棵树；双孩子节点用前驱节点（左子树最大值）替换，保证性质不变
 * @param {TreeNode} root - 原始BST根节点（节点含val/left/right属性）
 * @param {number} key - 要删除的节点值
 * @return {TreeNode} 删除后的BST根节点（原树基础上修改，回溯完成节点链接）
 */
function deleteNode(root, key) {
  // 递归终止条件：空树/未找到目标节点，直接返回null（无需修改树结构）
  // 易错点1：所有二叉树递归必备，遗漏会触发栈溢出错误
  if (root === null) return null;

  // 情况1：目标值大于当前节点值 → 去右子树递归删除，更新右子树链接
  // 关键：递归结果赋值给root.right，完成回溯时的节点链接
  if (key > root.val) {
    root.right = deleteNode(root.right, key);
    return root; // 回溯返回当前节点，供父节点更新子树引用
  }

  // 情况2：目标值小于当前节点值 → 去左子树递归删除，更新左子树链接
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
    return root; // 回溯返回当前节点，保证树结构连续
  }

  // 情况3：找到目标节点（key === root.val），分4种情况处理删除
  if (key === root.val) {
    // 子情况1：叶子节点（左右子树都为空）→ 直接删除，返回null让父节点置空该子树
    if (root.left === null && root.right === null) {
      root = null;
      return root;
    }
    // 子情况2：只有右子树 → 用右子树替换当前节点，返回右子树根节点
    if (root.left === null && root.right !== null) {
      root = root.right;
      return root;
    }
    // 子情况3：只有左子树 → 用左子树替换当前节点，返回左子树根节点
    if (root.left !== null && root.right === null) {
      root = root.left;
      return root;
    }
    // 子情况4：有左右子树（核心难点）→ 左子树最大值替换法
    if (root.left !== null && root.right !== null) {
      // 步骤1：寻找左子树的最大值节点（BST左子树最右侧的节点，即当前节点的前驱节点）
      // 易错点2：必须用let声明，const无法重新赋值节点引用，无法遍历到最右侧
      let maxNode = root.left;
      while (maxNode.right) { // 循环遍历到左子树最右侧，即为最大值节点
        maxNode = maxNode.right;
      }
      // 先把这个节点断开 （删掉）
      root.left = deleteNode(root.left, maxNode.val);
      // root之前的左子树和右子树要接到maxNode上
      maxNode.left = root.left
      maxNode.right = root.right
      // 最后把maxNode赋值给root，替换掉原来的root
      root = maxNode
      return root
    }
    return root
  }
    return root
}


```

注意节点不要修改其值，只修改指针

## 二叉搜索树心法（构造篇）
读完本文，你不仅学会了算法套路，还可以顺便解决如下题目：

LeetCode	力扣	难度
96. Unique Binary Search Trees	96. 不同的二叉搜索树	
95. Unique Binary Search Trees II	95. 不同的二叉搜索树 II	
前置知识

之前写了两篇手把手刷 BST 算法题的文章，
第一篇
 讲了中序遍历对 BST 的重要意义，
第二篇
 写了 BST 的基本操作。

本文就来写手把手刷 BST 系列的第三篇，循序渐进地讲两道题，如何计算所有有效 BST。

给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。

```js
/**
 * 力扣96题：不同的二叉搜索树
 * 题目要求：求n个节点（值1~n）组成的不同合法BST的种数
 * 核心思路：动态规划+卡特兰数
 * 关键性质：BST的种数仅与节点数量有关，与节点具体值无关；
 *           选k为根节点时，左子树有k-1个节点，右子树有n-k个节点，总种数为左*右
 * @param {number} n - 节点总数（值1~n）
 * @return {number} 不同BST的种数
 */
function numTrees(n) {
    // 动态规划数组dp：dp[i]表示i个节点能组成的不同BST种数
    const dp = new Array(n + 1).fill(0);
    // 边界条件：0个节点（空树）、1个节点，都只有1种BST
    dp[0] = 1;
    dp[1] = 1;

    // 遍历：计算2~n个节点的BST种数（从少到多，利用已计算的子问题结果）
    for (let i = 2; i <= n; i++) {
        let curSum = 0; // 记录当前i个节点的总种数
        // 枚举：以j为根节点（j从1~i），拆分左右子树节点数
        for (let j = 1; j <= i; j++) {
            // 左子树节点数：j-1（值1~j-1）
            // 右子树节点数：i-j（值j+1~i）
            // 总种数：左子树种数 * 右子树种数（乘法原理）
            curSum += dp[j - 1] * dp[i - j];
        }
        dp[i] = curSum; // 保存i个节点的BST种数
    }

    return dp[n]; // 返回n个节点的结果
}


```


95.给你一个整数 n ，请你生成并返回所有由 n 个节点组成且节点值从 1 到 n 互不相同的不同 二叉搜索树 。可以按 任意顺序 返回答案。

```js

var generateTrees = function(n) {
    if (n === 0) return [];
    // 构造闭区间 [1, n] 组成的 BST 
    return build(1, n);
};

// 构造闭区间 [lo, hi] 组成的 BST
var build = function(lo, hi) {
    let res = [];
    // base case
    if (lo > hi) {
        // 这里需要装一个 null 元素，这样才能让下面的两个内层 for 循环都能进入，正确地创建出叶子节点
        // 举例来说吧，什么时候会进到这个 if 语句？当你创建叶子节点的时候，对吧。
        // 那么如果你这里不加 null，直接返回空列表，那么下面的内层两个 for 循环都无法进入
        // 你的那个叶子节点就没有创建出来，看到了吗？所以这里要加一个 null，确保下面能把叶子节点做出来
        res.push(null);
        return res;
    }

    // 1、穷举 root 节点的所有可能。
    for (let i = lo; i <= hi; i++) {
        // 2、递归构造出左右子树的所有有效 BST。
        let leftTree = build(lo, i - 1);
        let rightTree = build(i + 1, hi);
        // 3、给 root 节点穷举所有左右子树的组合。
        for (let left of leftTree) {
            for (let right of rightTree) {
                // i 作为根节点 root 的值
                let root = new TreeNode(i);
                root.left = left;
                root.right = right;
                res.push(root);
            }
        }
    }
    return res;
};



```

dp算法

```js
/**
 * 力扣95题：不同的二叉搜索树 II
 * 题目要求：生成n个节点（值1~n）组成的所有不同合法BST，返回根节点数组
 * 核心思路：动态规划 + 子问题复用
 * 关键：dp[i] 存储「连续i个数字」能生成的所有BST根节点（复用结构，避免重复创建）
 * 节点类（力扣平台已内置，本地测试需定义）
 */
class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

var generateTrees = function(n) {
  // 特殊边界：n=0返回空数组（力扣测试用例要求）
  if (n === 0) return [];

  // 定义DP数组：dp[i] 表示「连续i个数字」能生成的所有BST根节点数组
  // 索引0~n，dp[0]对应0个节点（空树），dp[1]对应1个节点，dp[n]为最终结果
  const dp = new Array(n + 1).fill(null).map(() => []);
  // 边界条件1：dp[0] = [null]（空树，为了组合左右子树时的乘法原理）
  dp[0] = [null];
  // 边界条件2：dp[1] = [new TreeNode(x)]（1个节点只有1种结构，先初始化通用结构）
  dp[1] = [new TreeNode(1)];

  // 第一步：先计算dp[2] ~ dp[n]，得到「连续k个数字」的所有BST结构（暂用1~k作为节点值）
  for (let k = 2; k <= n; k++) {
    // 枚举：以连续k个数中的第j个数作为根节点（j从1~k）
    for (let j = 1; j <= k; j++) {
      // 左子树有j-1个连续节点，对应dp[j-1]；右子树有k-j个连续节点，对应dp[k-j]
      const leftTrees = dp[j - 1];
      const rightTrees = dp[k - j];

      // 第二步：组合左右子树（笛卡尔积），生成以j为根的所有BST
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // 创建当前根节点（暂用1~k的数值，后续统一偏移）
          const root = new TreeNode(j);
          root.left = left;
          // 右子树节点值需要偏移j（因为右子树是连续k-j个数，接在j后面）
          root.right = cloneTree(right, j);
          // 将当前BST加入dp[k]
          dp[k].push(root);
        }
      }
    }
  }

  // dp[n]中存储的是「1~n连续数」的所有BST，直接返回
  return dp[n];

  // 辅助函数：克隆树并偏移所有节点值（解决右子树数值不连续的问题）
  function cloneTree(node, offset) {
    if (node === null) return null;
    // 克隆当前节点，值增加偏移量
    const newNode = new TreeNode(node.val + offset);
    // 递归克隆左右子树，偏移量相同
    newNode.left = cloneTree(node.left, offset);
    newNode.right = cloneTree(node.right, offset);
    return newNode;
  }
};
```

## 二叉搜索树心法（后序篇）

读完本文，你不仅学会了算法套路，还可以顺便解决如下题目：

LeetCode	力扣	难度
1373. Maximum Sum BST in Binary Tree	1373. 二叉搜索子树的最大键值和	

前序位置的代码只能从函数参数中获取父节点传递来的数据，而后序位置的代码不仅可以获取参数数据，还可以获取到子树通过函数返回值传递回来的数据。

那么换句话说，一旦你发现题目和子树有关，那大概率要给函数设置合理的定义和返回值，在后序位置写代码了。

二叉搜索子树的最大键值和这题，关注两个点
1. 真正的 BST 定义是：
一棵二叉树是 BST，当且仅当：
左子树整体是 BST；
右子树整体是 BST；
当前节点值 > 左子树的所有节点值；
当前节点值 < 右子树的所有节点值。
这里能推导出至少需要 3 个信息：[是否为BST, 子树最小值, 子树最大值]—— 这是解决「BST 判断」的必要数据，缺一不可。


2. 
题目不是只判断 BST，还要计算合法 BST 的节点和，并找最大值。那「子树的节点和」怎么来？
合法 BST 的节点和 = 左子树的节点和 + 当前节点值 + 右子树的节点和；
要得到这个值，必须让递归返回 **「子树的节点和」**—— 这是完成「和值计算 + 找最大值」的必要数据。
到这里，在之前 3 个信息的基础上，补充第 4 个信息「子树节点和」，四元信息就自然推导出来了：
[是否为BST, 子树最小值, 子树最大值, 子树节点和]


```js
/**
 * 力扣1373题：二叉搜索子树的最大键值和
 * 优化版：性能+简洁性+可读性三重提升，100%通过所有测试用例
 * 核心：后序遍历+四元信息+非BST隔离+官方负和规则兼容
 */
var maxSumBST = function(root) {
    let maxSum = -Infinity; // 初始负无穷，兼容负权值BST，同时作为合法BST存在标记

    // 后序遍历：返回[isBST, minVal, maxVal, sumVal]
    const postOrder = (node) => {
        if (!node) return [true, Infinity, -Infinity, 0]; // 空节点固定返回

        // 后序遍历+提前解构，减少代码层级
        const [lBST, lMin, lMax, lSum] = postOrder(node.left);
        const [rBST, rMin, rMax, rSum] = postOrder(node.right);

        // 仅合法BST时赋值，移除无意义初始化
        if (lBST && rBST && node.val > lMax && node.val < rMin) {
            const curSum = lSum + node.val + rSum;
            maxSum = Math.max(maxSum, curSum);
            // 简化最值计算，替代三元判断
            return [true, Math.min(lMin, node.val), Math.max(rMax, node.val), curSum];
        }

        // 非BST直接返回无效信息，彻底隔离
        return [false, Infinity, -Infinity, 0];
    };

    postOrder(root);
    // 合并规则：有合法BST则取max(maxSum,0)，无则返回0（maxSum仍为- Infinity）
    return Math.max(maxSum, 0);
};



``` -->
