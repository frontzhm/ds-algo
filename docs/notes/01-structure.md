# 前端工程师必刷算法题清单：分板块高效学习指南

对前端工程师而言，算法不是“炫技项”，而是**中大厂面试敲门砖**、**业务性能优化利器**。不同于后端/算法岗，前端算法学习讲究“精准聚焦、贴合业务”，无需死磕难题偏题。本文按**高频板块**梳理必刷题目（附LeetCode直达链接），配套学习方法与前端应用场景，帮你高效构建算法知识体系。

## 核心学习原则

1. **优先级至上**：按「数组字符串 > 哈希表 > 二叉树 > 链表 > 排序查找 > 动态规划 > 回溯」顺序学习，前4个板块占前端面试算法题的80%。

2. **模板化刷题**：每类题型总结通用模板，刷同类题直接套用，避免重复造轮子。

3. **业务结合**：刷每道题都思考“前端工作中哪里能用”，比如滑动窗口做输入框去重、哈希表做前端缓存。

4. **拒绝难题**：只刷 **LeetCode 简单-中等难度** 题目，困难题直接跳过（前端面试几乎不考）。

## 一、数组 & 字符串（前端第一高频，25题）

数组和字符串是前端处理**接口数据、DOM操作、文本处理**的核心载体，该板块题目占前端算法面试的30%，必须吃透。

### 核心考点

双指针（快慢/左右）、滑动窗口、原地修改、边界处理。

### 必刷题目（按高频优先级排序）

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 26 | 删除有序数组中的重复项 | 简单 | 快慢指针、原地修改 | 列表去重、数据筛选 | [https://leetcode.cn/problems/remove-duplicates-from-sorted-array/](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) |
| 27 | 移除元素 | 简单 | 快慢指针 | 数据过滤、列表删除项 | [https://leetcode.cn/problems/remove-element/](https://leetcode.cn/problems/remove-element/) |
| 3 | 无重复字符的最长子串 | 中等 | 滑动窗口、哈希表 | 输入框去重、文本匹配 | [https://leetcode.cn/problems/longest-substring-without-repeating-characters/](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) |
| 15 | 三数之和 | 中等 | 左右指针、排序去重 | 多条件数据筛选 | [https://leetcode.cn/problems/3sum/](https://leetcode.cn/problems/3sum/) |
| 11 | 盛最多水的容器 | 中等 | 左右指针、贪心 | 区域计算、可视化布局 | [https://leetcode.cn/problems/container-with-most-water/](https://leetcode.cn/problems/container-with-most-water/) |
| 53 | 最大子数组和 | 简单 | 动态规划、贪心 | 数据趋势统计、收益分析 | [https://leetcode.cn/problems/maximum-subarray/](https://leetcode.cn/problems/maximum-subarray/) |
| 76 | 最小覆盖子串 | 中等 | 滑动窗口、哈希表 | 文本检索、内容匹配 | [https://leetcode.cn/problems/minimum-window-substring/](https://leetcode.cn/problems/minimum-window-substring/) |
| 283 | 移动零 | 简单 | 快慢指针 | 数组整理、数据筛选 | [https://leetcode.cn/problems/move-zeroes/](https://leetcode.cn/problems/move-zeroes/) |
| 344 | 反转字符串 | 简单 | 左右指针 | 文本反转、输入框处理 | [https://leetcode.cn/problems/reverse-string/](https://leetcode.cn/problems/reverse-string/) |
| 121 | 买卖股票的最佳时机 | 简单 | 一次遍历 | 数据趋势、收益计算 | [https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) |

## 二、哈希表（快速查找利器，10题）

哈希表（`Map/Object`）是前端**提升查询效率**的核心数据结构，能将O(n)的遍历查询优化为O(1)，面试必考。

### 核心考点

键值对设计、快速查找与统计、空间换时间思想。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 1 | 两数之和 | 简单 | 哈希表记录索引 | 数据匹配、条件查找 | [https://leetcode.cn/problems/two-sum/](https://leetcode.cn/problems/two-sum/) |
| 20 | 有效的括号 | 简单 | 哈希表+栈 | 代码解析、输入框校验 | [https://leetcode.cn/problems/valid-parentheses/](https://leetcode.cn/problems/valid-parentheses/) |
| 242 | 有效的字母异位词 | 简单 | 哈希表统计字符 | 字符串匹配、数据校验 | [https://leetcode.cn/problems/valid-anagram/](https://leetcode.cn/problems/valid-anagram/) |
| 347 | 前 K 个高频元素 | 中等 | 哈希表+堆 | 数据统计、热门排序 | [https://leetcode.cn/problems/top-k-frequent-elements/](https://leetcode.cn/problems/top-k-frequent-elements/) |
| 49 | 字母异位词分组 | 中等 | 哈希表映射 | 文本分组、数据归类 | [https://leetcode.cn/problems/group-anagrams/](https://leetcode.cn/problems/group-anagrams/) |
| 454 | 四数相加 II | 中等 | 哈希表分治 | 多组数据匹配 | [https://leetcode.cn/problems/4sum-ii/](https://leetcode.cn/problems/4sum-ii/) |
| 13 | 罗马数字转整数 | 简单 | 哈希表映射 | 格式转换、数据解析 | [https://leetcode.cn/problems/roman-to-integer/](https://leetcode.cn/problems/roman-to-integer/) |
| 128 | 最长连续序列 | 中等 | 哈希表+集合 | 数据去重+连续统计 | [https://leetcode.cn/problems/longest-consecutive-sequence/](https://leetcode.cn/problems/longest-consecutive-sequence/) |

## 三、二叉树（大厂必考，20题）

二叉树是前端**树形组件、路由树、DOM树**的底层逻辑，掌握二叉树遍历，就能轻松应对前端层级结构相关的性能优化问题。

### 核心考点

深度优先遍历（前/中/后序）、广度优先遍历（层序）、递归与迭代写法。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 94 | 二叉树的中序遍历 | 简单 | 递归+迭代遍历 | 树形组件渲染、路由树遍历 | [https://leetcode.cn/problems/binary-tree-inorder-traversal/](https://leetcode.cn/problems/binary-tree-inorder-traversal/) |
| 144 | 二叉树的前序遍历 | 简单 | 递归+迭代遍历 | DOM树深度遍历 | [https://leetcode.cn/problems/binary-tree-preorder-traversal/](https://leetcode.cn/problems/binary-tree-preorder-traversal/) |
| 145 | 二叉树的后序遍历 | 简单 | 递归+迭代遍历 | 组件销毁、资源释放 | [https://leetcode.cn/problems/binary-tree-postorder-traversal/](https://leetcode.cn/problems/binary-tree-postorder-traversal/) |
| 102 | 二叉树的层序遍历 | 中等 | BFS、队列 | 树形组件层级渲染、菜单生成 | [https://leetcode.cn/problems/binary-tree-level-order-traversal/](https://leetcode.cn/problems/binary-tree-level-order-traversal/) |
| 226 | 翻转二叉树 | 简单 | 递归翻转左右子树 | 树形组件镜像渲染 | [https://leetcode.cn/problems/invert-binary-tree/](https://leetcode.cn/problems/invert-binary-tree/) |
| 101 | 对称二叉树 | 简单 | 递归比较左右子树 | 树形结构校验 | [https://leetcode.cn/problems/symmetric-tree/](https://leetcode.cn/problems/symmetric-tree/) |
| 104 | 二叉树的最大深度 | 简单 | DFS/BFS | 树形组件深度计算 | [https://leetcode.cn/problems/maximum-depth-of-binary-tree/](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| 199 | 二叉树的右视图 | 中等 | BFS层序遍历 | 树形组件右侧渲染 | [https://leetcode.cn/problems/binary-tree-right-side-view/](https://leetcode.cn/problems/binary-tree-right-side-view/) |
| 98 | 验证二叉搜索树 | 中等 | 中序遍历有序性 | 搜索树校验、数据有序性 | [https://leetcode.cn/problems/validate-binary-search-tree/](https://leetcode.cn/problems/validate-binary-search-tree/) |
| 108 | 将有序数组转换为二叉搜索树 | 简单 | 二分+递归构造 | 有序数据转树形结构 | [https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/) |

## 四、链表（前端次高频，10题）

链表在前端的**虚拟列表、组件链表、DOM节点遍历**中广泛应用，重点掌握指针操作与边界处理。

### 核心考点

链表反转、快慢指针、环检测、哑节点技巧。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 206 | 反转链表 | 简单 | 双指针迭代 | 虚拟列表节点反转 | [https://leetcode.cn/problems/reverse-linked-list/](https://leetcode.cn/problems/reverse-linked-list/) |
| 21 | 合并两个有序链表 | 简单 | 哑节点、指针遍历 | 列表合并、数据拼接 | [https://leetcode.cn/problems/merge-two-sorted-lists/](https://leetcode.cn/problems/merge-two-sorted-lists/) |
| 141 | 环形链表 | 简单 | 快慢指针 | 虚拟列表防死循环 | [https://leetcode.cn/problems/linked-list-cycle/](https://leetcode.cn/problems/linked-list-cycle/) |
| 19 | 删除链表的倒数第 N 个结点 | 中等 | 快慢指针、哑节点 | 列表删除、节点操作 | [https://leetcode.cn/problems/remove-nth-node-from-end-of-list/](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) |
| 234 | 回文链表 | 简单 | 快慢指针+链表反转 | 链表判断、数据校验 | [https://leetcode.cn/problems/palindrome-linked-list/](https://leetcode.cn/problems/palindrome-linked-list/) |
| 2 | 两数相加 | 中等 | 链表遍历、进位处理 | 大数相加、字符串数字计算 | [https://leetcode.cn/problems/add-two-numbers/](https://leetcode.cn/problems/add-two-numbers/) |
| 142 | 环形链表 II | 中等 | 快慢指针、数学推导 | 环检测、找到环入口 | [https://leetcode.cn/problems/linked-list-cycle-ii/](https://leetcode.cn/problems/linked-list-cycle-ii/) |

## 五、排序 & 查找（基础算法，12题）

排序和查找是前端**数据处理、搜索筛选**的基础，重点掌握二分查找和快速排序。

### 核心考点

二分查找（基础+左右边界）、快速排序、归并排序。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 704 | 二分查找 | 简单 | 二分查找基础模板 | 下拉搜索定位、分页 | [https://leetcode.cn/problems/binary-search/](https://leetcode.cn/problems/binary-search/) |
| 35 | 搜索插入位置 | 简单 | 二分查找变形 | 插入定位、索引查找 | [https://leetcode.cn/problems/search-insert-position/](https://leetcode.cn/problems/search-insert-position/) |
| 34 | 在排序数组中查找元素的第一个和最后一个位置 | 中等 | 二分左右边界 | 范围查找、区间统计 | [https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| 912 | 排序数组 | 中等 | 快速排序、归并排序 | 通用数据排序 | [https://leetcode.cn/problems/sort-an-array/](https://leetcode.cn/problems/sort-an-array/) |
| 215 | 数组中的第K个最大元素 | 中等 | 快速选择、堆排序 | 排名统计、TopK筛选 | [https://leetcode.cn/problems/kth-largest-element-in-an-array/](https://leetcode.cn/problems/kth-largest-element-in-an-array/) |
| 75 | 颜色分类 | 中等 | 双指针、快速排序分区 | 数据分类、颜色排序 | [https://leetcode.cn/problems/sort-colors/](https://leetcode.cn/problems/sort-colors/) |

## 六、动态规划（进阶加分，10题）

动态规划是前端算法的“分水岭”，掌握基础DP即可应对面试，无需深钻复杂题型。

### 核心考点

单维度状态转移、初始条件、空间优化。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 70 | 爬楼梯 | 简单 | 状态转移、空间优化 | 步数计算、递归转迭代 | [https://leetcode.cn/problems/climbing-stairs/](https://leetcode.cn/problems/climbing-stairs/) |
| 53 | 最大子数组和 | 简单 | 动态规划、贪心 | 数据趋势统计 | [https://leetcode.cn/problems/maximum-subarray/](https://leetcode.cn/problems/maximum-subarray/) |
| 198 | 打家劫舍 | 简单 | 状态转移、相邻不选 | 资源筛选、最优选择 | [https://leetcode.cn/problems/house-robber/](https://leetcode.cn/problems/house-robber/) |
| 322 | 零钱兑换 | 中等 | 完全背包、最值DP | 金额计算、最优解 | [https://leetcode.cn/problems/coin-change/](https://leetcode.cn/problems/coin-change/) |
| 62 | 不同路径 | 中等 | 二维DP、空间优化 | 可视化布局路径计算 | [https://leetcode.cn/problems/unique-paths/](https://leetcode.cn/problems/unique-paths/) |
| 300 | 最长递增子序列 | 中等 | 状态转移、二分优化 | 数据趋势分析 | [https://leetcode.cn/problems/longest-increasing-subsequence/](https://leetcode.cn/problems/longest-increasing-subsequence/) |

## 七、回溯（选学加分，5题）

回溯适合解决**组合、排列、子集**问题，前端场景中可用于输入框联想、配置项排列。

### 必刷题目

| 题号 | 题目名称 | 难度 | 核心考点 | 前端应用场景 | LeetCode链接 |
| --- | --- | --- | --- | --- | --- |
| 22 | 括号生成 | 中等 | 回溯、剪枝 | 括号组合、代码生成 | [https://leetcode.cn/problems/generate-parentheses/](https://leetcode.cn/problems/generate-parentheses/) |
| 39 | 组合总和 | 中等 | 回溯、剪枝 | 组合筛选、数据匹配 | [https://leetcode.cn/problems/combination-sum/](https://leetcode.cn/problems/combination-sum/) |
| 46 | 全排列 | 中等 | 回溯、交换元素 | 排列生成、数据重排 | [https://leetcode.cn/problems/permutations/](https://leetcode.cn/problems/permutations/) |

## 八、刷题时间规划（适配职场人）

| 阶段     | 时间  | 学习内容          | 目标                             |
| -------- | ----- | ----------------- | -------------------------------- |
| 基础阶段 | 1-2周 | 数组字符串+哈希表 | 掌握双指针、滑动窗口、哈希表模板 |
| 核心阶段 | 2-3周 | 二叉树+链表       | 熟练手写遍历模板、链表反转       |
| 进阶阶段 | 1-2周 | 排序查找+动态规划 | 掌握二分查找、DP三步法           |
| 复盘阶段 | 1周   | 二刷高频题        | 确保每道高频题能在20分钟内手写   |

## 九、前端算法学习工具推荐

1. **刷题平台**：LeetCode（优先刷「前端面试高频题」标签）。

2. **本地刷题**：VS Code + LeetCode插件（支持本地调试、写注释）。

3. **笔记工具**：Notion/语雀（按板块整理模板+刷题笔记）。

## 总结

前端算法学习的核心是**“精准、高效、贴合业务”**，不用追求刷遍所有题，把本文的72道题吃透，就能轻松应对中大厂前端算法面试。记住：算法是工具，最终目的是为前端业务性能优化和架构设计服务。

> （注：文档部分内容可能由 AI 生成）

```shell
[1,2,3]

res []

used [false,false,false]

1执行backtrack([])
  {
    let i= 0
    curNum = 1
    used[0] = true
    path = [1]
    2执行backtrack([1])
    path.pop() 未执行
    used[0] =false 未执行
    i++ 未执行
  }

  2执行backtrack([1])
  {
    let i= 0
    continue
    let i = 1
    used[1] = true
    path = [1,2]
    3执行backtrack([1,2])
    path.pop() 未执行
    used[1] =false 未执行
    i++ 未执行
  }
  3执行backtrack([1,2])
  {
    let i= 0
    continue
    let i = 1
    continue
    let i = 2
    used[2] = true
    path = [1,2,3]
    4执行backtrack([1,2,3])
    path.pop() 未执行
    used[1] =false 未执行
    i++ 未执行
  }

  4执行backtrack([1,2,3])
  {
    length相等
    res = [[1,2,3]]
    这个函数就结束了，出栈，就到了3执行backtrack([1,2])
  }

  3执行backtrack([1,2])
  {
    let i= 0
    continue
    let i = 1
    continue
    let i = 2
    used[2] = true
    path = [1,2,3]
    4执行backtrack([1,2,3])
    # 继续执行这里
    path.pop()，path变成[1,2]
    used[2] =false
    i = 3
    因为超过len，所以函数也结束出栈，就到了2执行backtrack([1])
  }
  2执行backtrack([1])
  {
    let i= 0
    continue
    let i = 1
    used[1] = true
    path = [1,2]
    3执行backtrack([1,2])
    # 继续执行这里
    path.pop() ，path变成[1]
    used[1] =false
    i=1+1
    used[2] = true
    path.push(3)，path变成[1,3]
    5执行backtrack([1,3]);
    path.pop 未执行
    used[2] = false 未执行
    i++ 未执行
  }

 5执行backtrack([1,3]);
 {
  let i = 0
 }








```
