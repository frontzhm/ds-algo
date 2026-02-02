# 吃透二叉树：从基础到实战，掌握算法的核心骨架

二叉树是数据结构与算法领域的“基石”——不仅是红黑树、二叉堆、字典树等高级结构的基础，更是回溯、BFS、动态规划等算法思想的具象化载体。吃透二叉树，就掌握了算法的核心逻辑；搞不懂二叉树，面对复杂问题只会无从下手。

本文将从二叉树的核心概念、实现形式、遍历框架到实战场景，全方位拆解二叉树的核心知识点，并补充针对性的LeetCode练习，帮你真正做到“学练结合”。

## 一、二叉树的核心认知

### 1.1 为什么二叉树如此重要？

- **结构基础**：红黑树（自平衡BST）、二叉堆、线段树、字典树等高频数据结构，本质都是二叉树的变种；

- **算法思想载体**：回溯、DFS、BFS、动态规划等算法，本质是将问题抽象成“树的遍历”；

- **面试高频**：超60%的算法面试题可归为二叉树问题，或能通过“树抽象”解决。

### 1.2 核心术语

- 节点/父节点/子节点/根节点/叶子节点：树的基本组成单元，叶子节点是无左右子节点的节点；

- 子树/左子树/右子树：以某个节点为根的局部树结构；

- 深度/高度：深度是从根到当前节点的层数，高度是从当前节点到叶子节点的最大层数（最大深度=最大高度）。

### 1.3 常见二叉树类型

|类型|核心特征|应用场景|
|---|---|---|
|满二叉树|所有非叶子节点都有左右子节点，叶子节点在同一层|理论研究、完全二叉树的特例|
|完全二叉树|除最后一层外，其他层节点满；最后一层节点靠左排列|二叉堆（数组存储）、优先级队列|
|二叉搜索树（BST）|左子树节点值 < 根节点值 < 右子树节点值|高效查找/插入（如红黑树底层）|
|高度平衡二叉树|每个节点的左右子树高度差 ≤ 1|避免BST退化成链表（如AVL树）|
|自平衡二叉树|自动维持高度平衡的BST（如红黑树）|工程场景（Java TreeMap、Linux内核）|
## 二、二叉树的实现形式

二叉树的实现分两种核心形式，可根据场景选择：

### 2.1 链式存储（最常用）

通过节点对象+指针（引用）关联，直观且适配绝大多数算法场景：

```JavaScript

// 二叉树节点定义
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null; // 左子节点指针
        this.right = null; // 右子节点指针
    }
}

// 多叉树节点（无左右之分，用数组存子节点）
class Node {
    constructor(val, children = []) {
        this.val = val;
        this.children = children; // 子节点数组
    }
}
```

### 2.2 哈希表/数组模拟（轻量化）

无需显式创建节点对象，用哈希表映射“节点-子节点”关系，适合快速抽象问题：

```JavaScript

// 用Map模拟树结构：key=节点值，value=子节点数组
let tree = new Map([
    [1, [2, 3]],
    [2, [4]],
    [3, [5, 6]]
]);
```

## 三、二叉树的核心遍历框架

二叉树只有两种核心遍历逻辑：**递归遍历（DFS）** 和 **层序遍历（BFS）**，所有复杂遍历都是这两种框架的变种。

### 3.1 递归遍历（DFS）：掌握“三个关键位置”

递归遍历的本质是“分解子问题”，每个节点会被访问三次，而前序、中序、后序的核心区别，本质是“在节点的生命周期中选择执行代码的时机”：

- **前序位置**：进入节点时执行（第一次访问节点，只知道父节点信息），也是“进入这个节点”的标志；

- **中序位置**：左子树遍历完成后、右子树遍历开始前执行（第二次访问节点，已知道左子树所有信息）；

- **后序位置**：左右子树遍历完成后执行（第三次访问节点，已知道所有子树信息），也是“离开这个节点”的标志。

#### 基础框架（二叉树）

```JavaScript

// 二叉树递归遍历核心框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置：进入当前节点时执行（如收集节点值、初始化状态）
    // 典型场景：记录路径（入栈）、统计路径和、初始化子树状态
    traverse(root.left); // 递归左子树
    // 中序位置：左子树处理完，右子树未开始（BST中序遍历是有序的！）
    // 典型场景：BST的有序遍历、左子树结果校验
    traverse(root.right); // 递归右子树
    // 后序位置：离开当前节点时执行（子树全部处理完）
    // 典型场景：回溯（出栈）、统计子树高度、合并子树结果、释放子树状态
};
```

#### 关键补充：前序=进入，后序=离开

这个“进入/离开”的特性是回溯算法的核心：

- 前序位置做的操作，是“进入节点时的初始化”（比如把节点加入路径栈）；

- 后序位置做的操作，是“离开节点时的清理”（比如把节点从路径栈中弹出，恢复状态）；

- 整个递归过程，就是“进入父节点→进入左子节点→离开左子节点→进入右子节点→离开右子节点→离开父节点”的完整生命周期。

#### 多叉树适配（无中序位置）

多叉树没有“左/右”之分，仅保留前序（进入）/后序（离开）位置——因为没有“左子树处理完、右子树未开始”的中间状态：

```JavaScript

// N叉树递归遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置：进入当前节点
    root.children?.forEach(child => traverse(child)); // 遍历所有子节点
    // 后序位置：离开当前节点（所有子节点都已遍历完成）
};
```

#### 实战：DFS找所有根到叶子的路径

利用“前序入栈（进入节点）、后序出栈（离开节点）”的回溯思想，收集所有路径：

```JavaScript

function traverseDFS(root) {
    const res = []; // 存储所有路径
    const path = []; // 记录当前路径（回溯栈）

    function traverse(node) {
        if (node === null) return;
        
        path.push(node.val); // 前序：进入节点，加入路径（初始化）
        // 叶子节点：保存路径副本（必须拷贝，避免引用问题）
        if (!node.left && !node.right) {
            res.push([...path]);
        }
        
        traverse(node.left); // 递归左子树（进入左子节点）
        traverse(node.right); // 递归右子树（进入右子节点）
        
        path.pop(); // 后序：离开节点，回溯出栈（清理状态）
    }

    traverse(root);
    return res;
}

// 测试：输出 [[1,2,5], [1,3]]
const root = new TreeNode(1, new TreeNode(2, null, new TreeNode(5)), new TreeNode(3));
console.log(traverseDFS(root));
```

### 3.2 层序遍历（BFS）：掌握“层级生命周期”

层序遍历依赖队列实现（先进先出），核心是通过 `curLevelSize` 固定当前层节点数，更关键的是抓住“进入层”和“离开层”两个核心时机——这是按层处理逻辑的灵魂。

#### 核心逻辑：层的“进入”与“离开”

- **进入层**：`level++` 之后、遍历当前层节点之前，是“进入该层”的标志（可做层初始化：如创建当前层数组、记录层开始时间）；

- **离开层**：当前层所有节点遍历完成（for循环结束后），是“离开该层”的标志（可做层结果汇总：如将当前层数组存入结果、统计层节点数）。

#### 基础框架（二叉树，标注层生命周期）

```JavaScript

function traverseBFS(root) {
    if (!root) return;
    
    let level = 0; // 记录当前层数
    const queue = [root]; // 初始化队列
    
    while (queue.length) {
        // ====== 进入当前层 ======
        level++;
        const curLevelSize = queue.length; // 关键：固定当前层节点数（避免后续入队干扰）
        const curLevelNodes = []; // 存储当前层节点值（层初始化）
        console.log(`===== 进入第 ${level} 层 =====`);
        
        // 遍历当前层所有节点
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift(); // 取出队首节点
            curLevelNodes.push(curNode.val); // 收集当前层节点值
            
            // 子节点入队（为下一层做准备）
            curNode.left && queue.push(curNode.left);
            curNode.right && queue.push(curNode.right);
        }
        
        // ====== 离开当前层 ======
        console.log(`===== 离开第 ${level} 层，该层节点：${curLevelNodes} =====`);
        // 典型场景：层结果汇总、层校验、层统计
    }
}
```

#### 关键补充：为什么需要“进入/离开层”？

比如实现“收集每层节点值”“求每层节点数最大值”“按层反转节点顺序”等需求，核心逻辑都要在“进入层”初始化、“离开层”汇总：

```JavaScript

// 实战：收集每层节点值（核心依赖层的进入/离开）
function levelOrder(root) {
    const res = [];
    if (!root) return res;
    
    const queue = [root];
    let level = 0;
    
    while (queue.length) {
        // 进入层：初始化当前层数组
        level++;
        const curLevelSize = queue.length;
        const curLevel = [];
        
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift();
            curLevel.push(curNode.val);
            curNode.left && queue.push(curNode.left);
            curNode.right && queue.push(curNode.right);
        }
        
        // 离开层：汇总当前层结果到最终数组
        res.push(curLevel);
    }
    return res;
}
```

#### 多叉树适配（子节点数组展开）

```JavaScript

// N叉树层序遍历（返回二维数组：每层节点为一个子数组）
var levelOrder = function(root) {
    const res = [];
    if (!root) return res;
    
    const queue = [root];
    while (queue.length) {
        // 进入层：初始化
        const curLevelSize = queue.length;
        const curLevel = [];
        
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift();
            curLevel.push(curNode.val);
            
            // 多叉树：子节点数组展开入队
            if (curNode.children && curNode.children.length) {
                queue.push(...curNode.children);
            }
        }
        
        // 离开层：汇总
        res.push(curLevel);
    }
    return res;
};

// 测试：输出 [[1], [3,2,4], [5,6]]
const nRoot = new Node(1, [new Node(3, [new Node(5), new Node(6)]), new Node(2), new Node(4)]);
console.log(levelOrder(nRoot));
```

#### 实战：BFS找二叉树最小深度（最优解）

层序遍历是“最短路径/最小深度”的最优解——核心是在“遍历层内节点时”判断叶子节点，找到后直接返回（无需走到“离开层”）：

```JavaScript

function minDepth(root) {
    if (!root) return 0;
    
    let level = 0;
    const queue = [root];
    
    while (queue.length) {
        // 进入层
        level++;
        const curLevelSize = queue.length;
        
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift();
            // 核心：层内找到第一个叶子节点，直接返回当前层数（最小深度）
            if (!curNode.left && !curNode.right) {
                return level;
            }
            curNode.left && queue.push(curNode.left);
            curNode.right && queue.push(curNode.right);
        }
        // 无需走到离开层，提前终止
    }
    return level;
}
```

### 3.3 DFS vs BFS：核心区别

|维度|DFS（递归遍历）|BFS（层序遍历）|
|---|---|---|
|核心数据结构|调用栈（递归）|队列|
|遍历顺序|先深后广（一条路走到头）|先广后深（按层遍历）|
|生命周期|节点级：前序=进入、后序=离开（回溯核心）|层级级：进入层=初始化、离开层=汇总|
|空间复杂度|最坏O(n)（退化成链表）|最坏O(n)（最后一层节点数）|
|适用场景|找所有路径、统计子树信息|找最短路径、按层处理节点|
|终止条件|遍历完所有节点|可提前终止（如找最小深度）|
### 3.4 BFS进阶：带路径的层序遍历

BFS无节点级的“进入/离开”生命周期，需手动封装“节点+路径”的状态，模拟DFS的路径回溯：

```JavaScript

// 封装状态节点：绑定节点和对应的路径
class StateNode {
    constructor(node, path) {
        this.node = node; // 当前节点
        this.path = path; // 根到当前节点的路径
    }
}

// BFS找所有根到叶子的路径
function traverseBFS(root) {
    const res = [];
    if (!root) return res;
    
    // 队列存储StateNode，初始值：根节点 + 根节点路径（模拟“进入根节点”）
    const queue = [new StateNode(root, [root.val])];
    
    while (queue.length) {
        const cur = queue.shift();
        // 叶子节点：保存路径（模拟“离开叶子节点”）
        if (!cur.node.left && !cur.node.right) {
            res.push([...cur.path]);
            continue;
        }
        // 左子节点入队：路径拷贝 + 追加左子节点值（模拟“进入左节点”）
        if (cur.node.left) {
            queue.push(new StateNode(cur.node.left, [...cur.path, cur.node.left.val]));
        }
        // 右子节点入队：路径拷贝 + 追加右子节点值（模拟“进入右节点”）
        if (cur.node.right) {
            queue.push(new StateNode(cur.node.right, [...cur.path, cur.node.right.val]));
        }
    }
    return res;
}
```


## 核心总结

1. **二叉树是算法的“元结构”**：复杂问题可抽象为“树的遍历”，掌握遍历框架就掌握了核心；

2. **递归遍历抓“节点生命周期”**：前序=进入节点（初始化）、中序=左子树处理完（中间校验）、后序=离开节点（清理/合并）；

3. **层序遍历抓“层级生命周期”**：通过`curLevelSize`固定当前层节点数，进入层做初始化、离开层做结果汇总，是按层处理的关键；

4. **DFS/BFS选型原则**：找所有路径用DFS（利用节点级进入/离开的回溯），找最短路径用BFS（利用层级遍历可提前终止）；

5. **练习核心**：先掌握框架再刷真题，每道题尝试两种遍历方式，强化“树状思维”。

吃透二叉树的核心不是背代码，而是建立“树状思维”——看到问题能抽象成树，看到代码能联想到“节点的进入/离开”或“层级的进入/离开”。


## 针对性练习（LeetCode）

### 练习建议

1. **先刷基础遍历**：144、94、145、102 必须掌握递归+迭代两种写法；

2. **对比练习DFS/BFS**：同一道题（如104、111）分别用DFS和BFS实现，理解两种思路的差异；

3. **聚焦生命周期**：写代码时明确标注“前序/中序/后序”或“进入层/离开层”，强化思维；

4. **多叉树适配**：589、590、429 帮助理解“去掉中序位置”的逻辑，触类旁通；

5. **进阶题拆解**：如199（二叉树右视图）本质是“层序遍历取每层最后一个节点”，拆解后都是基础框架的变形。

### 基础遍历类（掌握框架）

|题目链接|难度|核心考点|解题提示|
|---|---|---|---|
|[144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)|简单|递归/迭代实现前序遍历|递归框架前序位置收集节点；迭代用栈模拟递归|
|[94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)|简单|递归/迭代实现中序遍历|BST的中序遍历是有序的，这是高频考点|
|[145. 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)|简单|递归/迭代实现后序遍历|后序位置适合合并子树结果|
|[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)|中等|层序遍历（按层收集节点）|核心是`curLevelSize`+层的进入/离开|
|[589. N 叉树的前序遍历](https://leetcode.cn/problems/n-ary-tree-preorder-traversal/)|简单|多叉树前序遍历|遍历`children`数组，前序位置收集节点|
|[590. N 叉树的后序遍历](https://leetcode.cn/problems/n-ary-tree-postorder-traversal/)|简单|多叉树后序遍历|遍历`children`数组，后序位置收集节点|
|[429. N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)|中等|多叉树层序遍历|展开`children`数组入队，按层收集|
###  深度/路径类（DFS/BFS选型）

|题目链接|难度|核心考点|解题提示|
|---|---|---|---|
|[104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)|简单|DFS后序统计/BFS层计数|DFS：后序位置取左右子树最大深度+1；BFS：统计层数|
|[111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)|简单|BFS最优解/DFS回溯|BFS找到第一个叶子节点直接返回层数，效率更高|
|[257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)|简单|DFS回溯/BFS带路径|DFS用前序入栈、后序出栈；BFS封装StateNode|
|[112. 路径总和](https://leetcode.cn/problems/path-sum/)|简单|DFS路径和校验/BFS带和|检查是否存在根到叶子的路径和等于目标值|
|[113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)|中等|DFS回溯收集所有符合条件路径|前序累加和、后序回溯，叶子节点校验和是否匹配|
### 进阶应用类（树思维拓展）

|题目链接|难度|核心考点|解题提示|
|---|---|---|---|
|[107. 二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)|中等|层序遍历+结果反转|按层收集后反转数组，或从下往上遍历|
|[199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)|中等|层序遍历取每层最后一个节点|进入层初始化、离开层取最后一个节点值|
|[637. 二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)|简单|层序遍历统计层和/节点数|离开层时计算平均值|
|[101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)|简单|递归比较左右子树/BFS层校验|递归：比较左左和右右、左右和右左；BFS按层校验对称性|
|[98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)|中等|BST中序遍历有序性|中序遍历收集值，校验是否严格递增|


## 练习

先在开头总结一下，二叉树解题的思维模式分两类：

1、是否可以通过遍历一遍二叉树得到答案？如果可以，用一个 traverse 函数配合外部变量来实现，这叫「遍历」的思维模式。

2、是否可以定义一个递归函数，通过子问题（子树）的答案推导出原问题的答案？如果可以，写出这个递归函数的定义，并充分利用这个函数的返回值，这叫「分解问题」的思维模式。

无论使用哪种思维模式，你都需要思考：

如果单独抽出一个二叉树节点，它需要做什么事情？需要在什么时候（前/中/后序位置）做？其他的节点不用你操心，递归函数会帮你在所有节点上执行相同的操作。

本文中会用题目来举例，但都是最最简单的题目，所以不用担心自己看不懂，我可以帮你从最简单的问题中提炼出所有二叉树题目的共性，并将二叉树中蕴含的思维进行升华，反手用到 动态规划 ， 回溯算法 ， 分治算法 ， 图论算法 中去，这也是我一直强调框架思维的原因。希望你在学习了上述高级算法后，也能回头再来看看本文，会对它们有更深刻的认识。

首先，我还是要不厌其烦地强调一下二叉树这种数据结构及相关算法的重要性。


## 二叉树的重要性
如果你告诉我，快速排序就是个二叉树的前序遍历，归并排序就是个二叉树的后序遍历，那么我就知道你是个算法高手了。

为什么快速排序和归并排序能和二叉树扯上关系？我们来简单分析一下他们的算法思想和代码框架：

快速排序的逻辑是，若要对 nums[lo..hi] 进行排序，我们先找一个分界点 p，通过交换元素使得 nums[lo..p-1] 都小于等于 nums[p]，且 nums[p+1..hi] 都大于 nums[p]，然后递归地去 nums[lo..p-1] 和 nums[p+1..hi] 中寻找新的分界点，最后整个数组就被排序了。

快速排序的代码框架如下：

```js
var sort = function(nums, lo, hi) {
    if (lo >= hi) {
        return;
    }
    // ****** 前序位置 ******
    // 对 nums[lo..hi] 进行切分，将 nums[p] 排好序
    // 使得 nums[lo..p-1] <= nums[p] < nums[p+1..hi]
    var p = partition(nums, lo, hi);

    // 去左右子数组进行切分
    sort(nums, lo, p - 1);
    sort(nums, p + 1, hi);
};
```

先构造分界点，然后去左右子数组构造分界点，你看这不就是一个二叉树的前序遍历吗？

再说说归并排序的逻辑，若要对 nums[lo..hi] 进行排序，我们先对 nums[lo..mid] 排序，再对 nums[mid+1..hi] 排序，最后把这两个有序的子数组合并，整个数组就排好序了。

```js
// 定义：排序 nums[lo..hi]
function sort(nums, lo, hi) {
    if (lo == hi) {
    return;
    }
    var mid = Math.floor((lo + hi) / 2);
    // 利用定义，排序 nums[lo..mid]
    sort(nums, lo, mid);
    // 利用定义，排序 nums[mid+1..hi]
    sort(nums, mid + 1, hi);

    // ****** 后序位置 ******
    // 此时两部分子数组已经被排好序
    // 合并两个有序数组，使 nums[lo..hi] 有序
    merge(nums, lo, mid, hi);
}
```
先对左右子数组排序，然后合并（类似合并有序链表的逻辑），你看这是不是二叉树的后序遍历框架？另外，这不就是传说中的分治算法嘛，不过如此呀。

如果你一眼就识破这些排序算法的底细，还需要背这些经典算法吗？不需要。你可以手到擒来，从二叉树遍历框架就能扩展出算法了。

说了这么多，旨在说明，二叉树的算法思想的运用广泛，甚至可以说，只要涉及递归，都可以抽象成二叉树的问题。

接下来我们从二叉树的前中后序开始讲起，让你深刻理解这种数据结构的魅力。

## 深入理解前中后序

单链表和数组的遍历可以是迭代的，也可以是递归的，二叉树这种结构无非就是二叉链表，它没办法简单改写成 for 循环的迭代形式，所以我们遍历二叉树一般都使用递归形式。
只要是递归形式的遍历，都可以有前序位置和后序位置，分别在递归之前和递归之后。
所谓前序位置，就是刚进入一个节点（元素）的时候，后序位置就是即将离开一个节点（元素）的时候，那么进一步，你把代码写在不同位置，代码执行的时机也不同：

比如倒序打印单链表：

```js
// 递归遍历单链表，倒序打印链表元素
var traverse = function(head) {
    if (head == null) {
        return;
    }
    traverse(head.next);
    // 后序位置
    console.log(head.val);
};
```

但是我想说，前中后序是遍历二叉树过程中处理每一个节点的三个特殊时间点，绝不仅仅是三个顺序不同的 List：

前序位置的代码在刚刚进入一个二叉树节点的时候执行；

后序位置的代码在将要离开一个二叉树节点的时候执行；

中序位置的代码在一个二叉树节点左子树都遍历完，即将开始遍历右子树的时候执行。

你注意本文的用词，我一直说前中后序「位置」，就是要和大家常说的前中后序「遍历」有所区别：你可以在前序位置写代码往一个 List 里面塞元素，那最后得到的就是前序遍历结果；但并不是说你就不可以写更复杂的代码做更复杂的事。

二叉树的所有问题，就是让你在前中后序位置注入巧妙的代码逻辑，去达到自己的目的，你只需要单独思考每一个节点应该做什么，其他的不用你管，抛给二叉树遍历框架，递归会在所有节点上做相同的操作。

图论算法基础把二叉树的遍历框架扩展到了图，并以遍历为基础实现了图论的各种经典算法，不过这是后话，本文就不多说了。
二叉树题目的递归解法可以分两类思路，第一类是遍历一遍二叉树得出答案，第二类是通过分解问题计算出答案，这两类思路分别对应着 回溯算法核心框架 和 动态规划核心框架
这里说一下我的函数命名习惯：二叉树中用遍历思路解题时函数签名一般是 void traverse(...)，没有返回值，靠更新外部变量来计算结果，而用分解问题思路解题时函数名根据该函数具体功能而定，而且一般会有返回值，返回值是子问题的计算结果。

与此对应的，你会发现我在 回溯算法核心框架 中给出的函数签名一般也是没有返回值的 void backtrack(...)，而在 动态规划核心框架 中给出的函数签名是带有返回值的 dp 函数。这也说明它俩和二叉树之间千丝万缕的联系。 虽然函数命名没有什么硬性的要求，但我还是建议你也遵循我的这种风格，这样更能突出函数的作用和解题的思维模式，便于你自己理解和运用。

以求二叉树的最大深度为例：

遍历思维的话，
1. 外部定义res和depth变量，res表示最大深度，depth表示当前节点深度，
2. 遍历每个节点，进入节点的时候depth++,离开节点的时候depth--，如果是子节点的话，更新res
然后得到res

```js
// 104题
/**
 * LeetCode 104. 二叉树的最大深度 - 回溯法（遍历思维）
 * 时间复杂度 O(n)：每个节点仅遍历一次
 * 空间复杂度 O(h)：h为树的高度，递归调用栈的最大深度（最坏为链表时h=n）
 * @param {TreeNode} root - 二叉树根节点（结构：{val: number, left: TreeNode, right: TreeNode}）
 * @returns {number} 二叉树的最大深度（根节点到最远叶子节点的最长路径上的节点数）
 */
var maxDepth = function(root) {
    // 全局变量：记录最终的最大深度，初始为0（空树深度为0）
    let maxDeep = 0;
    // 全局变量：记录遍历当前节点时的实时深度，初始为0（未进入任何节点）
    let currentDepth = 0;

    /**
     * 递归遍历函数 - 核心：跟踪节点深度+回溯
     * @param {TreeNode} node - 当前遍历的节点
     */
    function traverse(node) {
        // 递归终止条件：遇到空节点（越过叶子节点），直接返回，不处理
        if (node === null) {
            return;
        }

        // 前序位置：进入当前节点，深度+1（节点生命周期的「进入」标志）
        currentDepth++;

        // 关键判断：当前节点是叶子节点（无左右子节点）
        // 此时的currentDepth是该叶子节点的深度，用其更新全局最大深度
        if (node.left === null && node.right === null) {
            maxDeep = Math.max(maxDeep, currentDepth);
        }

        // 递归遍历左子树：继续向深度遍历，探索左分支
        traverse(node.left);
        // 递归遍历右子树：左分支遍历完成后，探索右分支
        traverse(node.right);

        // 后序位置：离开当前节点，深度-1（节点生命周期的「离开」标志，回溯核心）
        // 恢复currentDepth状态，避免影响其他分支的深度计算（比如右分支不受左分支深度干扰）
        currentDepth--;
    }

    // 从根节点开始递归遍历，触发深度计算
    traverse(root);
    // 返回最终的最大深度
    return maxDeep;
};
```

分解问题思维的话：

一个树的最大深度，得到左子树和右子树的最大深度，取较大值+1

- 分解函数返回最大深度
- 取较大值 +1

```js
/**
 * LeetCode 104. 二叉树的最大深度 - 分治法（分解问题思维）
 * 核心：树的最大深度 = 左子树最大深度 和 右子树最大深度 的较大值 + 1（当前节点）
 * 时间复杂度 O(n)：每个节点仅递归一次，无额外遍历
 * 空间复杂度 O(h)：h为树的高度，递归调用栈的最大深度（最坏为链表时h=n）
 * @param {TreeNode} root - 二叉树根节点（结构：{val: number, left: TreeNode, right: TreeNode}）
 * @returns {number} 二叉树的最大深度（根节点到最远叶子节点的最长路径上的节点数）
 */
var maxDepth = function(root) {
    // 递归终止条件：空节点的深度为0（二叉树深度定义，无节点则层数为0）
    if (root === null) {
        return 0;
    }

    // 分解子问题1：递归求左子树的最大深度（后序遍历，先处理左子树）
    const leftSubTreeMaxDepth = maxDepth(root.left);
    // 分解子问题2：递归求右子树的最大深度（后序遍历，再处理右子树）
    const rightSubTreeMaxDepth = maxDepth(root.right);

    // 合并子问题结果：当前树的最大深度 = 左右子树深度的较大值 + 1
    // +1 原因：当前节点作为子树的根节点，本身占一层深度
    return Math.max(leftSubTreeMaxDepth, rightSubTreeMaxDepth) + 1;
};

```
只要明确递归函数的定义，这个解法也不难理解，但为什么主要的代码逻辑集中在后序位置？

因为这个思路正确的核心在于，你确实可以通过子树的最大深度推导出原树的深度，所以当然要首先利用递归函数的定义算出左右子树的最大深度，然后推出原树的最大深度，主要逻辑自然放在后序位置。

## 再来看下前序遍历

遍历的思维：外围定义res，遍历的时候，填充res

```js
// 用遍历的思路计算前序遍历结果
var preorderTraversal = function(root) {
    // 存放前序遍历结果
    var res = [];

    // 二叉树遍历函数
    var traverse = function(root) {
        if (root == null) {
            return;
        }
        // 前序位置
        res.push(root.val);
        traverse(root.left);
        traverse(root.right);
    };

    traverse(root);
    return res;
}
```

分解的思维：
换句话说，不要用像 traverse 这样的辅助函数和任何外部变量，单纯用题目给的 preorderTraverse 函数递归解题，你会不会？

我们知道前序遍历的特点是，根节点的值排在首位，接着是左子树的前序遍历结果，最后是右子树的前序遍历结果


```js
// 用遍历的思路计算前序遍历结果
var preorderTraversal = function(root) {
   if(root === null) {
    return []
   }

   const leftRes = preorderTraversal(root.left)
   const rightRes = preorderTraversal(root.right)
   return [root.val,...leftRes,...rightRes]
}
```
这个解法短小精干，但为什么不常见呢？

一个原因是这个算法的复杂度不好把控，比较依赖语言特性。

Java 的话无论 ArrayList 还是 LinkedList，addAll 方法的复杂度都是 O(N)，所以总体的最坏时间复杂度会达到 O(N^2)，除非你自己实现一个复杂度为 O(1) 的 addAll 方法，底层用链表的话是可以做到的，因为多条链表只要简单的指针操作就能连接起来。

举了两个简单的例子，但还有不少二叉树的题目是可以同时使用两种思路来思考和求解的，这就要靠你自己多去练习和思考，不要仅仅满足于一种熟悉的解法思路。

综上，遇到一道二叉树的题目时的通用思考过程是：

1、是否可以通过遍历一遍二叉树得到答案？如果可以，用一个 traverse 函数配合外部变量来实现。

2、是否可以定义一个递归函数，通过子问题（子树）的答案推导出原问题的答案？如果可以，写出这个递归函数的定义，并充分利用这个函数的返回值。

3、无论使用哪一种思维模式，你都要明白二叉树的每一个节点需要做什么，需要在什么时候（前中后序）做。

本站 
二叉树递归专项练习
 中列举了 100 多道二叉树习题，完全使用上述两种思维模式手把手带你练习，助你完全掌握递归思维，更容易理解高级的算法。

## 后序位置的特殊之处

说后序位置之前，先简单说下前序和中序。

前序位置本身其实没有什么特别的性质，之所以你发现好像很多题都是在前序位置写代码，实际上是因为我们习惯把那些对前中后序位置不敏感的代码写在前序位置罢了。

中序位置主要用在 BST 场景中，你完全可以把 BST 的中序遍历认为是遍历有序数组。

划重点

仔细观察，前中后序位置的代码，能力依次增强。

前序位置的代码只能从函数参数中获取父节点传递来的数据。

中序位置的代码不仅可以获取参数数据，还可以获取到左子树通过函数返回值传递回来的数据。

后序位置的代码最强，不仅可以获取参数数据，还可以同时获取到左右子树通过函数返回值传递回来的数据。

所以，某些情况下把代码移到后序位置效率最高；有些事情，只有后序位置的代码能做

举些具体的例子来感受下它们的能力区别。现在给你一棵二叉树，我问你两个简单的问题：

1、如果把根节点看做第 1 层，如何打印出每一个节点所在的层数？

2、如何打印出每个节点的左右子树各有多少节点？

第一个 前序遍历
```js

// 二叉树遍历函数
function traverse(TreeNode root, int level) {
    if (root == null) {
        return;
    }
    // 前序位置
    printf("节点 %s 在第 %d 层", root.val, level);
    traverse(root.left, level + 1);
    traverse(root.right, level + 1);
}

// 这样调用
traverse(root, 1);
```
第二个，后序遍历

```js
// count是tree的总节点数量
function count(root){
  if(root=== null) return 0
  const leftCount = count(root.left)
  const rightCount = count(root.right)
  // 后序位置
  console.log(`节点${root.val} 的左子树有 ${leftCount} 个节点，右子树有 ${rightCount}个节点`);
 return leftCount+rightCount+1
}
```
这两个问题的根本区别在于
一个节点在第几层，你从根节点遍历过来的过程就能顺带记录，用递归函数的参数就能传递下去；
而以一个节点为根的整棵子树有多少个节点，你必须遍历完子树之后才能数清楚，然后通过递归函数的返回值拿到答案。

结合这两个简单的问题，你品味一下后序位置的特点，只有后序位置才能通过返回值获取子树的信息。

那么换句话说，一旦你发现题目和子树有关，那大概率要给函数设置合理的定义和返回值，在后序位置写代码了。


接下来看下后序位置是如何在实际的题目中发挥作用的，简单聊下力扣第 543 题「二叉树的直径」，让你计算一棵二叉树的最长直径长度。

所谓二叉树的「直径」长度，就是任意两个结点之间的路径长度。最长「直径」并不一定要穿过根结点，比如下面这棵二叉树：
解决这题的关键在于，每一条二叉树的「直径」长度，就是一个节点的左右子树的最大深度之和。

```js
var diameterOfBinaryTree = function(root) {
    // 记录最大直径的长度
    let maxDiameter = 0;

    // 计算二叉树的最大深度
    const maxDepth = function(root) {
        if (root === null) {
            return 0;
        }
        let leftMax = maxDepth(root.left);
        let rightMax = maxDepth(root.right);
        return 1 + Math.max(leftMax, rightMax);
    };

    // 遍历二叉树
    const traverse = function(root) {
        if (root === null) {
            return;
        }
        // 对每个节点计算直径
        let leftMax = maxDepth(root.left);
        let rightMax = maxDepth(root.right);
        let myDiameter = leftMax + rightMax;
        // 更新全局最大直径
        maxDiameter = Math.max(maxDiameter, myDiameter);
        
        traverse(root.left);
        traverse(root.right);
    };

    traverse(root);

    return maxDiameter;
};
```
这个解法是正确的，但是运行时间很长，原因也很明显，traverse 遍历每个节点的时候还会调用递归函数 maxDepth，而 maxDepth 是要遍历子树的所有节点的，所以最坏时间复杂度是 O(N^2)。

这就出现了刚才探讨的情况，前序位置无法获取子树信息，所以只能让每个节点调用 maxDepth 函数去算子树的深度。

那如何优化？我们应该把计算「直径」的逻辑放在后序位置，准确说应该是放在 maxDepth 的后序位置，因为 maxDepth 的后序位置是知道左右子树的最大深度的。

所以，稍微改一下代码逻辑即可得到更好的解法：

```js
var diameterOfBinaryTree = function(root) {
    let maxDiameter = 0;

    const maxDepth = function(root) {
        if (root === null) {
            return 0;
        }
        let leftMax = maxDepth(root.left);
        let rightMax = maxDepth(root.right);
        // 后序位置，顺便计算最大直径
        let myDiameter = leftMax + rightMax;
        maxDiameter = Math.max(maxDiameter, myDiameter);

        return 1 + Math.max(leftMax, rightMax);
    }

    maxDepth(root);
    return maxDiameter;
};
```

讲到这里，照应一下前文：遇到子树问题，首先想到的是给函数设置返回值，然后在后序位置做文章。

Info
思考题：请你思考一下，运用后序位置的题目使用的是「遍历」的思路还是「分解问题」的思路？
都用了

## 以树的视角看动归/回溯/DFS算法的区别和联系

划重点
动归/DFS/回溯算法都可以看做二叉树问题的扩展，只是它们的关注点不同：

动态规划算法属于分解问题（分治）的思路，它的关注点在整棵「子树」。
回溯算法属于遍历的思路，它的关注点在节点间的「树枝」。
DFS 算法属于遍历的思路，它的关注点在单个「节点」。

怎么理解？我分别举三个例子你就懂了。

例子一：分解问题的思想体现
第一个例子，给你一棵二叉树，请你用分解问题的思路写一个 count 函数，计算这棵二叉树共有多少个节点。代码很简单，上文都写过了：

```js
// 定义：输入一棵二叉树，返回这棵二叉树的节点总数
var count = function(root) {
    if (root == null) {
        return 0;
    }
    // 当前节点关心的是两个子树的节点总数分别是多少
    // 因为用子问题的结果可以推导出原问题的结果
    var leftCount = count(root.left);
    var rightCount = count(root.right);
    // 后序位置，左右子树节点数加上自己就是整棵树的节点数
    return leftCount + rightCount + 1;
}
```
你看，这就是动态规划分解问题的思路，它的着眼点永远是结构相同的整个子问题，类比到二叉树上就是「子树」。

你再看看具体的动态规划问题，比如 
动态规划框架套路详解中举的斐波那契的例子，我们的关注点在一棵棵子树的返回值上

例子二：回溯算法的思想体现
第二个例子，给你一棵二叉树，请你用遍历的思路写一个 traverse 函数，打印出遍历这棵二叉树的过程，你看下代码
```js
void traverse(TreeNode root) {
    if (root == null) return;
    printf("从节点 %s 进入节点 %s", root, root.left);
    traverse(root.left);
    printf("从节点 %s 回到节点 %s", root.left, root);

    printf("从节点 %s 进入节点 %s", root, root.right);
    traverse(root.right);
    printf("从节点 %s 回到节点 %s", root.right, root);
}
```
不难理解吧，好的，我们现在从二叉树进阶成多叉树，代码也是类似的：

```js
// 多叉树节点
class Node {
    int val;
    Node[] children;
}

void traverse(Node root) {
    if (root == null) return;
    for (Node child : root.children) {
        printf("从节点 %s 进入节点 %s", root, child);
        traverse(child);
        printf("从节点 %s 回到节点 %s", child, root);
    }
}
```
这个多叉树的遍历框架就可以延伸出 回溯算法框架套路详解 中的回溯算法框架：

```js
// 回溯算法框架
void backtrack(...) {
    // base case
    if (...) return;

    for (int i = 0; i < ...; i++) {
        // 做选择
        ...

        // 进入下一层决策树
        backtrack(...);

        // 撤销刚才做的选择
        ...
    }
}
```
你看，这就是回溯算法遍历的思路，它的着眼点永远是在节点之间移动的过程，类比到二叉树上就是「树枝」。

你再看看具体的回溯算法问题，比如 
回溯算法秒杀排列组合子集的九种题型 中讲到的全排列，我们的关注点在一条条树枝上：


```js
// 回溯算法核心部分代码
void backtrack(int[] nums) {
    // 回溯算法框架
    for (int i = 0; i < nums.length; i++) {
        // 做选择
        used[i] = true;
        track.addLast(nums[i]);

        // 进入下一层回溯树
        backtrack(nums);

        // 取消选择
        track.removeLast();
        used[i] = false;
    }
}
```


例子三：DFS 的思想体现
第三个例子，我给你一棵二叉树，请你写一个 traverse 函数，把这棵二叉树上的每个节点的值都加一。很简单吧，代码如下：

```js
var traverse = function(root) {
    if (root === null) return;
    // 遍历过的每个节点的值加一
    root.val++;
    traverse(root.left);
    traverse(root.right);
}
```
就是 DFS 算法遍历的思路，它的着眼点永远是在单一的节点上，类比到二叉树上就是处理每个「节点」。

再看看具体的 DFS 算法问题，比如 
一文秒杀所有岛屿题目
 中讲的前几道题，我们的关注点是 grid 数组的每个格子（节点），我们要对遍历过的格子进行一些处理，所以我说是用 DFS 算法解决这几道题的：

```js
// DFS 算法核心逻辑
void dfs(int[][] grid, int i, int j) {
    int m = grid.length, n = grid[0].length;
    if (i < 0 || j < 0 || i >= m || j >= n) {
        return;
    }
    if (grid[i][j] == 0) {
        return;
    }
    // 遍历过的每个格子标记为 0
    grid[i][j] = 0;
    dfs(grid, i + 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i - 1, j);
    dfs(grid, i, j - 1);
}
```

有了这些铺垫，你就很容易理解为什么回溯算法和 DFS 算法代码中「做选择」和「撤销选择」的位置不同了，看下面两段代码

```js
// DFS 算法把「做选择」「撤销选择」的逻辑放在 for 循环外面
var dfs = function(root) {
    if (root == null) return;
    // 做选择
    console.log("enter node %s", root);
    for (var i = 0; i < root.children.length; i++) {
        dfs(root.children[i]);
    }
    // 撤销选择
    console.log("leave node %s", root);
}

// 回溯算法把「做选择」「撤销选择」的逻辑放在 for 循环里面
var backtrack = function(root) {
    if (root == null) return;
    for (var i = 0; i < root.children.length; i++) {
        var child = root.children[i];
        // 做选择
        console.log("I'm on the branch from %s to %s", root, child);
        backtrack(child);
        // 撤销选择
        console.log("I'll leave the branch from %s to %s", child, root);
    }
}
```
看到了吧，你回溯算法必须把「做选择」和「撤销选择」的逻辑放在 for 循环里面，否则怎么拿到「树枝」的两个端点？

## 层序遍历

二叉树题型主要是用来培养递归思维的，而层序遍历属于迭代遍历，也比较简单，这里就过一下代码框架吧：

```js
// 输入一棵二叉树的根节点，层序遍历这棵二叉树
var levelTraverse = function(root) {
    if (root == null) return;
    var q = [root];

    var depth = 0;
    // 从上到下遍历二叉树的每一层
    while (q.length > 0) {
        depth++
        var sz = q.length;
        // 从左到右遍历每一层的每个节点
        for (var i = 0; i < sz; i++) {
            var cur = q.shift();

            // 将下一层节点放入队列
            if (cur.left != null) {
                q.push(cur.left);
            }
            if (cur.right != null) {
                q.push(cur.right);
            }
        }
    }
}
```
前文 
BFS 算法框架
 就是从二叉树的层序遍历扩展出来的，常用于求无权图的最短路径问题。

当然这个框架还可以灵活修改，题目不需要记录层数（步数）时可以去掉上述框架中的 for 循环，比如前文 
Dijkstra 算法
 中计算加权图的最短路径问题，详细探讨了 BFS 算法的扩展。

值得一提的是，有些很明显需要用层序遍历技巧的二叉树的题目，也可以用递归遍历的方式去解决，而且技巧性会更强，非常考察你对前中后序的把控。

好了，本文已经够长了，围绕前中后序位置算是把二叉树题目里的各种套路给讲透了，真正能运用出来多少，就需要你亲自刷题实践和思考了。

最后，
二叉树递归专项练习
 中会手把手带你运用本文所讲的技巧。
https://labuladong.online/zh/algo/intro/binary-tree-practice/





<!-- [二叉树](https://labuladong.online/zh/algo/data-structure-basic/binary-tree-basic/)

二叉树是最重要的基本数据结构，没有之一。

- 二叉树本身是比较简单的基础数据结构，但是很多复杂的数据结构都是基于二叉树的，比如 红黑树 （二叉搜索树）、 多叉树 、 二叉堆 、 图 、 字典树 、 并查集 、 线段树 等等。你把二叉树玩明白了，这些数据结构都不是问题；如果你不把二叉树搞明白，这些高级数据结构你也很难驾驭。

- 二叉树不单纯是一种数据结构，更是一种常用的算法思维。一切暴力穷举算法，比如 
回溯算法 、 BFS 算法 、 动态规划 本质上也是把具体问题抽象成树结构，你只要抽象出来了，这些问题最终都回归二叉树的问题。同样看一段算法代码，在别人眼里是一串文本，每个字都认识，但连起来就不认识了；而在你眼里的代码就是一棵树，想咋改就咋改，咋改都能改对，实在是太简单了。

## 术语

节点、子节点、父节点、根节点、叶子节点、子树、左子树、右子树、最大深度（最大高度）

## 二叉树类型

满二叉树、完全二叉树（除了最后一层，其他都是满的，满二叉树是特殊的完全二叉树；由于它的节点紧凑排列，如果从左到右从上到下对它的每个节点编号，那么父子节点的索引存在明显的规律，可以用数组来存储，不需要真的构建链式节点；完全二叉树的左右子树也是完全二叉树，更准确地说应该是：完全二叉树的左右子树中，至少有一棵是满二叉树。完全二叉树对应英文 Complete Binary Tree,满二叉树的定义对应英文的 Perfect Binary Tree, Full Binary Tree 是指一棵二叉树的所有节点要么没有孩子节点，要么有两个孩子节点。）、二叉搜索树（Binary Search Tree，简称 BST）左小右大（BST 是非常常用的数据结构。因为左小右大的特性，可以让我们在 BST 中快速找到某个节点，或者找到某个范围内的所有节点，这是 BST 的优势所在。）、高度平衡二叉树（Height-Balanced Binary Tree）是一种特殊的二叉树，它的「每个节点」的左右子树的高度差不超过 1（假设高度平衡二叉树中共有 N N 个节点，那么高度平衡二叉树的高度是 O ( log ⁡ N ) O(logN)。这是非常重要的性质）、自平衡二叉树（自平衡的二叉树有很多种实现方式，最经典的就是 红黑树 ，一种自平衡的二叉搜索树。）

## 二叉树的实现形式

最常见的二叉树就是类似链表那样的链式存储结构，每个二叉树节点有指向左右子节点的指针，这种方式比较简单直观。是的，在 二叉堆原理及实现 和 并查集算法详解 中，我们会根据具体的需求场景选择用数组来存储二叉树。在一般的算法题中，我们可能会把实际问题抽象成二叉树结构，但我们并不需要真的用 TreeNode 创建一棵二叉树出来，而是直接用类似 哈希表 的结构来表示二叉树/多叉树。

```js
// 1 -> [2, 3]
// 2 -> [4]
// 3 -> [5, 6]

let tree = new Map([
    [1, [2, 3]],
    [2, [4]],
    [3, [5, 6]]
]);
```


## 二叉树的遍历

二叉树只有两种遍历，层序遍历和递归遍历，递归遍历可以衍生出 DFS 算法，层序遍历可以衍生出 BFS 算法。

递归遍历二叉树节点的顺序是固定的，但是有三个关键位置，在不同位置插入代码，会产生不同的效果。

层序遍历二叉树节点的顺序也是固定的，但是有三种不同的写法，对应不同的场景。

二叉树的遍历算法主要分为递归遍历和层序遍历两种，都有代码模板。递归代码模板可以延伸出后面要讲的 DFS 算法、回溯算法，层序代码模板可以延伸出后面要讲的 BFS 算法，所以我经常强调二叉树结构的重要性。

递归的时候 每个节点被访问三次，第一次是只知道父节点的信息，第二次是知道左节点的信息，第三次是知道左右子节点信息，前序位置的代码会在进入节点时立即执行；中序位置的代码会在左子树遍历完成后，遍历右子树之前执行；后序位置的代码会在左右子树遍历完成后执行：

大家熟知的前序遍历、中序遍历、后序遍历，都属于二叉树的递归遍历，只不过是把自定义代码插入到了代码模板的不同位置而已。

递归遍历  （分解子问题、 步骤）
```js
// 基本的二叉树节点
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// 二叉树的递归遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置
    traverse(root.left);
    // 中序位置
    traverse(root.right);
    // 后序位置
};

```
，
二叉搜索树（BST）的中序遍历结果是有序的，这是 BST 的一个重要性质。

层序遍历需要借助队列实现，三种不同写法

```js
function traverse(root){
  if(!root){
    return
  }
  const queue = [root]
  while(queue.length){
    const cur = queue.shift()
    console.log(cur.val)
    cur.left && queue.push(cur.left)
    cur.right && queue.push(cur.right)
  }

}
```

这种写法最大的优势就是简单。每次把队头元素拿出来，然后把它的左右子节点加入队列，就完事了。

但是这种写法的缺点是，无法知道当前节点在第几层。知道节点的层数是个常见的需求，比方说让你收集每一层的节点，或者计算二叉树的最小深度等等。

所以这种写法虽然简单，但用的不多，下面介绍的写法会更常见一些。



加上层数

```js
/**
 * 二叉树层序遍历（广度优先遍历 BFS）
 * 核心特点：
 * 1. depth 初始为 0（代表未遍历任何层级），进入循环先自增，最终 depth 直接等于树的实际深度
 * 2. 无需额外回退修正，语义自洽、逻辑无冗余，是算法面试/工程开发的主流写法
 * 3. 适配高频场景：求树的最大深度、按层级收集节点、层级遍历输出
 * @param {TreeNode} root - 二叉树根节点（结构：{ val: number, left: TreeNode, right: TreeNode }）
 * @returns {void} 无返回值（可根据需求修改为返回层级数组/树深度）
 */
function traverse(root) {
  // 边界处理：空树直接返回，避免后续队列操作报错
  // 空树的深度为 0，符合常规认知
  if (!root) return;

  // 初始化深度为 0 → 语义：还未开始遍历任何层级（零值初始化，符合编程直觉）
  // 🌟 核心语义：depth 最终会等于「树的实际深度」，无需额外修正
  let depth = 0;

  // 初始化队列并放入根节点 → 队列是层序遍历的核心：存储「待遍历的下一层节点」
  // 队列特性：先进先出（FIFO），保证节点按「层级顺序」被遍历
  const queue = [root];

  // 循环条件：队列不为空（还有未遍历的节点）
  while (queue.length) {
    // 🌟 关键操作：先自增深度 → 代表「即将遍历第 depth 层」
    // 自增后 depth 的值 = 当前要遍历的层级数，遍历完成后自然等于「已遍历层级数」
    depth++;

    // 记录当前层级的节点总数（固定值）→ 核心！避免循环中队列长度动态变化干扰层级遍历
    // 例如：当前层有 2 个节点，即使遍历中新增了下一层节点，也只遍历这 2 个节点
    const curLevelSize = queue.length;

    // 打印层级标识（可选，直观展示当前遍历的层级）
    console.log(`===== 第 ${depth} 层的节点 =====`);

    // 遍历当前层级的所有节点（次数 = 当前层节点数）
    for (let i = 0; i < curLevelSize; i++) {
      // 出队：取出队列头部节点（数组 shift 模拟队列的 dequeue 操作）
      // ⚠️ 注意：数组 shift 是 O(n) 复杂度，大规模数据可改用双向队列（Deque）优化
      const curNode = queue.shift();

      // 输出当前节点值（核心业务操作，可替换为：收集节点、计算、判断等）
      console.log("节点值：", curNode.val);

      // 左子节点存在 → 入队（加入「下一层待遍历节点池」）
      if (curNode.left) {
        queue.push(curNode.left);
      }

      // 右子节点存在 → 入队（加入「下一层待遍历节点池」）
      if (curNode.right) {
        queue.push(curNode.right);
      }
    }
    // for 循环结束 → 当前层级所有节点遍历完成，队列中仅剩下一层节点
  }

  // while 循环结束 → 所有层级遍历完成，depth 直接等于树的实际深度
  // 🌟 核心优势：无需任何修正，直接得到树的深度，适配高频面试题（求树的最大深度）
  console.log("二叉树的实际深度：", depth);
}

// ==================== 测试用例 ====================
// 构造1：单节点二叉树（深度1）
const root1 = { val: 1 };
console.log("测试单节点二叉树：");
traverse(root1);
// 预期输出：
// 测试单节点二叉树：
// ===== 第 1 层的节点 =====
// 节点值： 1
// 二叉树的实际深度： 1

// 构造2：三层二叉树（深度3）
//        1（第1层）
//      /   \
//     2     3（第2层）
//    / \   / \
//   4  5  6  7（第3层）
const root2 = {
  val: 1,
  left: {
    val: 2,
    left: { val: 4 },
    right: { val: 5 }
  },
  right: {
    val: 3,
    left: { val: 6 },
    right: { val: 7 }
  }
};
console.log("\n测试三层二叉树：");
traverse(root2);
// 预期输出：
// 测试三层二叉树：
// ===== 第 1 层的节点 =====
// 节点值： 1
// ===== 第 2 层的节点 =====
// 节点值： 2
// 节点值： 3
// ===== 第 3 层的节点 =====
// 节点值： 4
// 节点值： 5
// 节点值： 6
// 节点值： 7
// 二叉树的实际深度： 3
```

## BFS找最短路径

breadth first search 

给定一个二叉树，找出其最小深度。

```js
/**
 * 求二叉树的最小深度（层序遍历/BFS解法）
 * 核心思路：层序遍历是找「最短路径/最小深度」的最优解，找到第一个叶子节点的层级就是最小深度
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最小深度（空树返回0）
 */
function minDepth(root) {
  // 边界处理：空树深度为0
  if (root === null) {
    return 0;
  }

  let level = 0; // 记录当前遍历的层级（初始为0，先自增再遍历）
  const queue = [root]; // 初始化队列，存入根节点

  while (queue.length) {
    level++; // 进入循环先自增，代表当前遍历第level层
    const curLevelSize = queue.length; // 固定当前层节点数

    for (let i = 0; i < curLevelSize; i++) {
      const curNode = queue.shift(); // 取出当前层的节点

      // 核心判断：找到第一个叶子节点（无左右子节点），直接返回当前层级（最小深度）
      if (!curNode.left && !curNode.right) {
        return level; // 提前终止，无需遍历后续节点，性能最优
      }

      // 子节点入队（继续遍历下一层）
      if (curNode.left) {
        queue.push(curNode.left);
      }
      if (curNode.right) {
        queue.push(curNode.right);
      }
    }
  }

  // 理论上不会走到这里（二叉树非空时必有叶子节点），兜底返回level
  return level;
}

// ==================== 测试用例 ====================
// 测试1：单节点树（最小深度1）
const root1 = { val: 1 };
console.log(minDepth(root1)); // 输出：1

// 测试2：三层树（最小深度2，根节点右子节点是叶子）
//        1
//       / \
//      2   3
//     /
//    4
const root2 = {
  val: 1,
  left: { val: 2, left: { val: 4 } },
  right: { val: 3 }
};
console.log(minDepth(root2)); // 输出：2（第2层的3是叶子节点）

// 测试3：空树
console.log(minDepth(null)); // 输出：0
```

如果用递归的话

```js
var minDepth = function(root) {
    if (root === null) {
        return 0; // 空树深度为0
    }
    
    let minDepthValue = Infinity; // 初始化最小深度为无穷大（用于后续取最小值）
    let currentDepth = 0; // 记录当前遍历节点的深度

    // 递归遍历函数（DFS核心）
    const traverse = function(root) {
        if (root === null) {
            return; // 遇到空节点，直接返回（递归终止条件）
        }

        // 前序位置：进入当前节点，深度+1（比如根节点进入后，currentDepth=1）
        currentDepth++;

        // 核心判断：当前节点是叶子节点（无左右子节点），更新最小深度
        if (root.left === null && root.right === null) {
            minDepthValue = Math.min(minDepthValue, currentDepth);
        }

        // 递归遍历左子树
        traverse(root.left);
        // 递归遍历右子树
        traverse(root.right);

        // 后序位置：离开当前节点，深度-1（回溯，恢复状态）
        currentDepth--;
    };

    traverse(root); // 从根节点开始遍历
    return minDepthValue;
};
```
回溯思想：currentDepth++（前序）和 currentDepth--（后序）是 DFS 的核心 —— 进入节点时深度 + 1，离开节点时深度 - 1，保证遍历不同分支时深度值正确；
叶子节点判断：只有遇到叶子节点时才更新最小深度，符合 “最小深度是根到最近叶子节点的距离” 的定义；
边界处理：空树直接返回 0，逻辑完整。


BFS通常先结束，DFS必须走完所有路径

## DFS找所有路径

因为每个分支就是天然的路径

```js

/**
 * 深度优先遍历（DFS）二叉树，获取所有从根节点到叶子节点的路径
 * @param {TreeNode} root - 二叉树的根节点（节点结构需包含 val/left/right 属性）
 * @returns {Array<Array<number>>} - 所有根到叶子的路径数组，每个子数组代表一条路径的节点值
 */
function traverseDFS(root) {
  // 最终结果数组：存储所有根到叶子的完整路径
  const res = [];
  // 路径栈：记录当前遍历路径上的节点值（回溯时会弹出最后一个节点）
  const path = [];

  /**
   * 递归遍历函数（核心DFS逻辑）
   * @param {TreeNode} node - 当前遍历的节点
   */
  function traverse(node) {
    // 递归终止条件：如果当前节点为null（越过叶子节点），直接返回
    if (node === null) {
      return;
    }

    // 1. 处理当前节点：将当前节点的值加入路径栈  （前序遍历，也就是第一次访问节点的时候，将节点加入path）
    path.push(node.val);

    // 2. 终止条件：如果当前节点是叶子节点（无左、右子节点） (如果是叶子节点， 加入path加入res)
    if (!node.left && !node.right) {
      // 将当前路径的副本存入结果数组（⚠️ 必须用[...path]拷贝，否则会引用同一个数组）
      res.push([...path]);
    }

    // 3. 递归遍历左子树（深度优先：先左后右）
    traverse(node.left);
    // 4. 递归遍历右子树
    traverse(node.right);

    // 5. 回溯：遍历完当前节点的左右子树后，将当前节点值从路径栈中弹出
    //    目的是回到父节点，继续探索其他分支 (后续遍历，也就是第三次访问节点的时候，离开节点的时候,从path中pop)
    path.pop();
  }

  // 从根节点开始执行递归遍历
  traverse(root);

  // 返回所有根到叶子的路径
  return res;
}

// 示例：测试代码（可直接运行验证）
// 定义二叉树节点类
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 构建测试二叉树：
//       1
//      / \
//     2   3
//      \
//       5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.right = new TreeNode(5);

// 调用函数并打印结果
console.log(traverseDFS(root)); // 输出：[[1,2,5], [1,3]]
```



如果换成层序遍历

核心逻辑解释（与 DFS 的关键区别）
StateNode 类的作用：
BFS 是「非递归」遍历，无法像 DFS 那样通过函数调用栈的回溯自动维护路径，因此需要手动封装「节点 + 路径」的状态，确保每个节点都能关联到从根到它的完整路径。
路径拷贝的必要性：
代码中多次使用 [...curNode.path] 拷贝路径数组 —— 因为数组是引用类型，如果直接传递原数组，多个 StateNode 会共享同一份路径，修改其中一个会影响所有关联的 StateNode，导致路径错乱。
BFS 遍历逻辑：
队列遵循「先进先出」，先处理上层节点，再处理下层节点（按层遍历）；
遇到叶子节点时，直接将路径存入结果，无需回溯（DFS 需要path.pop()回溯，BFS 通过拷贝新路径天然避免了回溯）。


```js
// 定义状态节点类：用于在BFS队列中同时存储「当前遍历的节点」和「从根到当前节点的路径」
class StateNode {
  /**
   * 构造函数
   * @param {TreeNode} node - 当前遍历的二叉树节点（包含val/left/right属性）
   * @param {Array<number>} path - 从根节点到当前node的路径数组（存储节点值）
   */
  constructor(node, path) {
    this.node = node;   // 保存当前二叉树节点
    this.path = path;   // 保存到当前节点为止的完整路径
  }
}

/**
 * 广度优先遍历（BFS）二叉树，获取所有从根节点到叶子节点的路径
 * @param {TreeNode} root - 二叉树的根节点
 * @returns {Array<Array<number>>} - 所有根到叶子的路径数组，每个子数组代表一条路径的节点值
 */
function traverseBFS(root) {
  // 最终结果数组：存储所有根到叶子的完整路径
  const res = [];

  // 边界条件：如果根节点为null，直接返回空数组
  if (root == null) {
    return res;
  }

  // 初始化BFS队列：队列中存储StateNode对象，初始值为根节点 + 仅包含根节点值的路径
  const queue = [new StateNode(root, [root.val])];

  // BFS核心循环：只要队列不为空，就持续遍历
  while (queue.length) {
    // 出队：取队列头部的元素（BFS是「先进先出」，对应按层遍历）
    const curNode = queue.shift();

    // 终止条件：如果当前节点是叶子节点（无左、右子节点）
    if (!curNode.node.left && !curNode.node.right) {
      // 将当前路径的副本存入结果数组（用[...path]拷贝，避免引用问题）
      res.push([...curNode.path]);
      // 跳过后续逻辑，继续处理队列中的下一个节点
      continue;
    }

    // 如果有左子节点：创建新的StateNode（左子节点 + 追加左子节点值的新路径），加入队列
    if (curNode.node.left) {
      queue.push(new StateNode(
        curNode.node.left,          // 左子节点
        [...curNode.path, curNode.node.left.val]  // 新路径：拷贝原路径 + 追加左子节点值
      ));
    }

    // 如果有右子节点：创建新的StateNode（右子节点 + 追加右子节点值的新路径），加入队列
    if (curNode.node.right) {
      queue.push(new StateNode(
        curNode.node.right,         // 右子节点
        [...curNode.path, curNode.node.right.val] // 新路径：拷贝原路径 + 追加右子节点值
      ));
    }
  }

  // 返回所有根到叶子的路径
  return res;
}

// 示例：测试代码（可直接运行验证，与DFS结果一致）
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 构建测试二叉树：
//       1
//      / \
//     2   3
//      \
//       5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.right = new TreeNode(5);

// 调用函数并打印结果
console.log(traverseBFS(root)); // 输出：[[1,2,5], [1,3]]
```

## 多叉树的节点

二叉树的节点

```js
var TreeNode = function(val) {
    this.val = val;
    this.left = null;
    this.right = null;
};
```

多叉树的节点 不分左右

```js
var TreeNode = function(val) {
    this.val = val;
    this.children = [];
};
```

森林就是多个多叉树的集合（单独一棵多叉树也是一个特殊的森林），类似TreeNode数组，遍历盛林，就是遍历数组，数组的每项单独树遍历即可。

## 多叉树的递归遍历

```js

// 二叉树的遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置
    traverse(root.left);
    // 中序位置
    traverse(root.right);
    // 后序位置
};

// N 叉树的遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
    // 前序位置
    root.children?.forEach(child=>traverseDFS(child))
    // 后序位置
};
```
## 多叉树的层序遍历

```js
// 二叉树的遍历框架
var traverse = function(root) {
    if (root === null) {
        return;
    }
   const queue = [root]
   let level = 0
   while(queue.length){
     // 进入新的层
    level++
    // 当前层数的节点数量
    const curLevelSize = queue.length
    for(let i=0;i<curLevelSize;i++){
      // 每次的当前节点都是新的 队列的开头元素
      const curNode = queue.shift()
      // 将其子节点push到队列里
      curNode.left && queue.push(curNode.left)
      curNode.right && queue.push(curNode.right)
    }

   }
};
// N 叉树的层序遍历（BFS）框架：按层遍历每个节点，并记录当前层数
var traverse = function(root) {
    // 边界条件：如果根节点为空，直接返回
    if (root === null) {
        return;
    }
    // 初始化队列：层序遍历的核心数据结构，初始存入根节点
    const queue = [root];
    // 记录当前遍历到的层数（从0或1开始都可以，这里从0开始更符合编程习惯）
    let level = 0;
    
    // 队列不为空时，持续遍历
    while (queue.length) {
        // 进入新的一层，层数+1
        level++;
        // 关键：记录当前层的节点数量（必须先存，因为后续队列会新增子节点）
        const curLevelSize = queue.length;
        
        // 遍历当前层的所有节点（循环次数=当前层节点数）
        for (let i = 0; i < curLevelSize; i++) {
            // 取出队列头部的节点（FIFO：先进先出，符合层序遍历逻辑）
            const curNode = queue.shift();
            
            // 关键修正：将当前节点的所有子节点依次加入队列（而非整体push数组）
            // curNode.children 是子节点数组，需逐个push到队列中
            if (curNode.children && curNode.children.length) {
                queue.push(...curNode.children); // 用展开运算符逐个添加
            }
        }
        
        // 可选：这里可以添加对「当前层」的处理逻辑，比如收集当前层的节点值
        // console.log(`第${level}层的节点数：${curLevelSize}`);
    }
};

// 示例：测试代码（模拟 N 叉树节点）
// 定义 N 叉树节点类
class Node {
    constructor(val, children = []) {
        this.val = val;
        this.children = children;
    }
}

// 构建测试 N 叉树：
//        1
//      / | \
//     2  3  4
//    / \
//   5   6
const root = new Node(1, [
    new Node(2, [new Node(5), new Node(6)]),
    new Node(3),
    new Node(4)
]);

// 调用遍历函数
traverse(root);
```

589. N-ary Tree Preorder Traversal	589. N 叉树的前序遍历	
590. N-ary Tree Postorder Traversal	590. N 叉树的后序遍历	
429. N-ary Tree Level Order Traversal	429. N 叉树的层序遍历


遍历过程中 将节点放进res
```js
// N 叉树的层序遍历（BFS）框架：按层遍历每个节点，并记录当前层数
/**
 * N 叉树的层序遍历（返回二维数组：每层节点值为一个子数组）
 * 符合 list<list<integer>> 类型要求，解决报错问题
 * @param {Node} root - N 叉树根节点
 * @returns {Array<Array<number>>} - 二维数组，每个子数组对应一层的节点值
 */
var levelOrder = function(root) {
    // 最终结果：二维数组，每层节点值存为一个子数组
    const res = [];
    
    // 边界条件：根节点为空，返回空数组
    if (root === null) {
        return res;
    }

    // 初始化队列：层序遍历核心数据结构
    const queue = [root];

    // 队列不为空时持续遍历
    while (queue.length) {
        // 记录当前层的节点数量（必须先存，后续队列会添加下一层节点）
        const curLevelSize = queue.length;
        // 存储当前层的所有节点值（每遍历一层新建一个数组）
        const curLevelNodes = [];

        // 遍历当前层的所有节点
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift();
            // 将当前节点值存入「当前层数组」
            curLevelNodes.push(curNode.val);

            // 将子节点逐个加入队列（下一层待处理）
            if (curNode.children && Array.isArray(curNode.children) && curNode.children.length) {
                queue.push(...curNode.children);
            }
        }

        // 把当前层的节点值数组存入最终结果（核心：构建二维数组）
        res.push(curLevelNodes);
    }

    // 返回二维数组，符合 list<list<integer>> 要求
    return res;
};

// 测试用例（和之前一致）
class Node {
    constructor(val, children = []) {
        this.val = val;
        this.children = children;
    }
}
// 构建测试 N 叉树：
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
const root = new Node(1, [
    new Node(3, [new Node(5), new Node(6)]),
    new Node(2),
    new Node(4)
]);
// 调用函数，输出符合要求的二维数组
console.log(traverse(root)); // 输出：[[1], [3,2,4], [5,6]]
```


```js
var levelOrderBottom = function(root) {
    // 最终结果：二维数组，每层节点值存为一个子数组
    const res = [];
    
    // 边界条件：根节点为空，返回空数组
    if (root === null) {
        return res;
    }

    // 初始化队列：层序遍历核心数据结构
    const queue = [root];

    // 队列不为空时持续遍历
    while (queue.length) {
        // 记录当前层的节点数量（必须先存，后续队列会添加下一层节点）
        const curLevelSize = queue.length;
        // 存储当前层的所有节点值（每遍历一层新建一个数组）
        const curLevelNodes = [];

        // 遍历当前层的所有节点
        for (let i = 0; i < curLevelSize; i++) {
            const curNode = queue.shift();
            // 将当前节点值存入「当前层数组」
            curLevelNodes.push(curNode.val);

            // 将子节点逐个加入队列（下一层待处理）
            curNode.left && queue.push(curNode.left)
            curNode.right && queue.push(curNode.right)
        }

        // 把当前层的节点值数组存入最终结果（核心：构建二维数组）
        res.push(curLevelNodes);
    }

    res.reverse()

    // 返回二维数组，符合 list<list<integer>> 要求
    return res;
};
``` -->
