# 差分数组：高效处理数组区间批量更新的核心技巧

在算法解题中，前缀和是处理「静态数组区间查询」的利器，而与之相辅相成的差分数组，则是解决「动态数组区间批量更新」的最优解。本文将从差分数组的核心原理出发，结合三道LeetCode高频真题，带你吃透这一技巧的应用场景与实现细节。

## 一、差分数组核心原理

### 1.1 适用场景

前缀和适用于**原始数组不修改**的场景下频繁查询区间和；而差分数组的核心优势是：**频繁对原始数组的某个区间元素进行增减操作**（如给`nums[2..6]`加1、`nums[3..9]`减3），最终快速还原数组。

### 1.2 核心定义

给定原始数组`nums`，构造差分数组`diff`，其中`diff[i]`表示`nums[i]`与`nums[i-1]`的差值：

```JavaScript

// 构造差分数组
const diff = new Array(nums.length);
diff[0] = nums[0];
for (let i = 1; i < nums.length; i++) {
    diff[i] = nums[i] - nums[i - 1];
}

// 从差分数组还原原始数组
const res = new Array(diff.length);
res[0] = diff[0];
for (let i = 1; i < diff.length; i++) {
    res[i] = res[i - 1] + diff[i];
}
```

### 1.3 区间更新的核心操作

若要给`nums[i..j]`的所有元素加`val`，无需遍历区间，只需对差分数组做两步操作：

1. `diff[i] += val`：标记区间起点，从`i`开始所有元素加`val`；

2. `diff[j+1] -= val`：标记区间终点，从`j+1`开始取消`val`的加成（避免影响后续元素）。

### 1.4 差分数组封装类

将核心逻辑封装为类，便于复用：

```JavaScript

class Difference {
    constructor(nums) {
        // 差分数组
        this.diff = new Array(nums.length);
        // 根据初始数组构造差分数组
        this.diff[0] = nums[0];
        for (let i = 1; i < nums.length; i++) {
            this.diff[i] = nums[i] - nums[i - 1];
        }
    }

    // 给闭区间 [i, j] 增加 val（可以是负数）
    increment(i, j, val) {
        this.diff[i] += val;
        if (j + 1 < this.diff.length) {
            this.diff[j + 1] -= val;
        }
    }

    // 返回结果数组
    result() {
        let res = new Array(this.diff.length);
        // 根据差分数组构造结果数组
        res[0] = this.diff[0];
        for (let i = 1; i < this.diff.length; i++) {
            res[i] = res[i - 1] + this.diff[i];
        }
        return res;
    }
}
```

## 二、LeetCode真题实战

### 2.1 LeetCode 370. 区间加法（[https://leetcode.cn/problems/range-addition/](https://leetcode.cn/problems/range-addition/)）

#### 题目描述

给定一个长度为 `n` 的初始全为 0 的数组 `nums`，以及一个包含若干操作的二维数组 `updates`，其中每个操作 `[start, end, val]` 表示对 `nums` 中从索引 `start` 到 `end`（包含两端）的所有元素都加上 `val`。请你返回执行完所有操作后的最终数组。

#### 题目示例

```Plain Text

输入：n = 5, updates = [[1,3,2],[2,4,3],[0,2,-2]]
输出：[-2,0,3,5,3]
```

#### 解题思路

1. 初始化长度为`n+1`的差分数组（避免`end+1`越界）；

2. 遍历所有操作，对差分数组做「起点加val、终点下一位减val」的标记；

3. 对差分数组求前缀和，还原最终数组。

#### 代码实现

```JavaScript

/**
 * LeetCode 370. 区间加法
 * 解题思路：差分数组（高效处理批量区间更新）
 * 核心原理：
 * 1. 差分数组diff用于记录「区间更新的起点/终点标记」
 * 2. 对diff求前缀和，即可还原出最终的数组
 * @param {number} n 原始数组长度（初始全为0）
 * @param {number[][]} updates 操作数组，每个元素[start, end, val]表示给nums[start..end]加val
 * @return {number[]} 执行所有操作后的最终数组
 */
var getModifiedArray = function(n, updates) {
    // 边界处理：n为0时直接返回空数组（避免后续数组操作报错）
    if(n === 0) return []

    // 【核心1】初始化差分数组，长度设为n+1（关键！避免end+1越界）
    // 为什么n+1？因为end最大为n-1，end+1=n，diff[n]是合法索引，不影响前缀和计算
    const diff = new Array(n+1).fill(0)
    const updateLen = updates.length

    // 遍历所有更新操作，标记差分数组
    for(let i = 0; i < updateLen; i++){
        const [start, end, val] = updates[i]
        // 标记1：区间起点start处加val（表示从start开始，所有元素都要加val）
        diff[start] += val
        // 标记2：区间终点end的下一位减val（表示从end+1开始，取消val的加成）
        // 即使end+1=n（超出原始数组长度），diff[n]的修改也不影响最终前缀和（因为res只取前n位）
        diff[end + 1] -= val
    }

    // 【核心2】对差分数组求前缀和，还原最终数组
    const res = new Array(n)
    // 第一个元素的前缀和就是diff[0]
    res[0] = diff[0]
    // 从第二个元素开始，依次累加前一个结果和当前diff值
    for(let i = 1; i < n; i++){
        res[i] = res[i - 1] + diff[i]
    }

    return res
};
```

#### 核心要点 & 易错点

1. 差分数组长度设为`n+1`：避免`end = n-1`时`end+1 = n`导致越界，且`diff[n]`不会参与前缀和计算，不影响结果；

2. 无需判断`end+1 < n`：即使`end+1 = n`，`diff[n] -= val`也不报错，且`res`只取前`n`位，逻辑完全正确。

### 2.2 LeetCode 1109. 航班预订统计（[https://leetcode.cn/problems/corporate-flight-bookings/](https://leetcode.cn/problems/corporate-flight-bookings/)）

#### 题目描述

这里有 `n` 个航班，它们分别从 1 到 n 进行编号。有一份航班预订表 `bookings` ，表中第 `i` 条预订记录 `bookings[i] = [firsti, lasti, seatsi]` 意味着在从 `firsti` 到 `lasti`（包含 `firsti` 和 `lasti`）的每个航班上预订了 `seatsi` 个座位。请你返回一个长度为 `n` 的数组 `answer`，里面的元素是每个航班预定的座位总数。

#### 题目示例

```Plain Text

输入：bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5
输出：[10,55,45,25,25]
```

#### 解题思路

1. 核心逻辑与370题一致（差分数组+前缀和）；

2. 关键差异：航班编号是`1-based`，需转换为数组`0-based`索引（`start-1`、`end-1`）；

3. 初始化长度为`n+1`的差分数组，完成标记后求前缀和还原结果。

#### 代码实现

```JavaScript

/**
 * LeetCode 1109. 航班预订统计
 * 解题思路：差分数组（和370.区间加法核心逻辑一致，仅需处理航班编号→数组索引的转换）
 * 题目核心：
 * - bookings[i] = [first, last, seats] 表示给第first~last号航班各预订seats个座位
 * - 航班编号是「1-based」（从1开始），数组是「0-based」（从0开始），需转换
 * @param {number[][]} bookings 预订记录数组
 * @param {number} n 航班总数（编号1~n）
 * @return {number[]} 每个航班的预订座位数
 */
var corpFlightBookings = function(bookings, n) {
    // 1. 初始化差分数组（长度n+1，避免end+1越界，和370题一致）
    const diff = new Array(n + 1).fill(0);
    const bookLen = bookings.length;

    // 2. 遍历所有预订记录，更新差分数组（核心：处理1-based→0-based转换）
    for (let i = 0; i < bookLen; i++) {
        let [start, end, val] = bookings[i];
        // 【易错点1】航班编号是1-based，转成数组0-based索引需各减1
        start -= 1;
        end -= 1;
        // 标记区间起点：从start（原first号航班）开始加val
        diff[start] += val;
        // 标记区间终点：从end+1（原last+1号航班）开始减val
        diff[end + 1] -= val;
    }

    // 3. 对差分数组求前缀和，还原最终每个航班的预订数（和370题完全一致）
    const res = new Array(n);
    res[0] = diff[0];
    for (let i = 1; i < n; i++) {
        res[i] = res[i - 1] + diff[i];
    }

    return res;
};
```

#### 核心要点 & 易错点

- 索引转换是唯一坑点：航班编号`1-based`必须转`0-based`（减1），否则会遗漏/错误修改航班；

- 其余逻辑与370题完全一致，差分数组长度仍设为`n+1`。

### 2.3 LeetCode 1094. 拼车（[https://leetcode.cn/problems/car-pooling/](https://leetcode.cn/problems/car-pooling/)）

#### 题目描述

车上最初有 `capacity` 个空座位。车只能向一个方向行驶（不允许掉头或改变方向）。给定整数 `capacity` 和一个数组 `trips` , `trip[i] = [numPassengersi, fromi, toi]` 表示第 `i` 次旅行有 `numPassengersi` 乘客，接他们和放他们的位置分别是 `fromi` 和 `toi`（位置是从初始位置向东的公里数）。当且仅当你可以在所有给定的行程中接送所有乘客时，返回 `true`，否则返回 `false`。

#### 题目示例

```Plain Text

输入：trips = [[2,1,5],[3,3,7]], capacity = 4
输出：false
```

#### 解题思路

1. 差分数组记录「站点乘客变化」：上车（`from`）加乘客数，下车（`to`）减乘客数；

2. 关键差异：`to`是「不包含」的（乘客在`to`站下车，不计入该站人数），因此直接`diff[to] -= count`；

3. 遍历所有站点（0~1000，题目约束站点≤1000），实时计算当前乘客数，超员则返回`false`。

#### 代码实现

```JavaScript

/**
 * LeetCode 1094. 拼车
 * 解题思路：差分数组（记录每个站点的乘客变化，实时校验容量）
 * 核心逻辑：
 * 1. 上车：start站增加count个乘客 → diff[start] += count
 * 2. 下车：end站减少count个乘客（乘客在end站下车，不计入end站人数）→ diff[end] -= count
 * 3. 累加差分数组得到各站点实时乘客数，只要超员立即返回false
 * @param {number[][]} trips 行程数组，格式[乘客数, 上车站点, 下车站点]
 * @param {number} capacity 最大载客量
 * @return {boolean} 是否能完成所有行程（不超员）
 */
var carPooling = function(trips, capacity) {
    // 初始化差分数组：题目约束站点编号≤1000，长度设为1001覆盖所有站点
    const diff = new Array(1000 + 1).fill(0);
    const tripLen = trips.length;

    // 遍历所有行程，更新差分数组
    for (let i = 0; i < tripLen; i++) {
        const [count, start, end] = trips[i];
        // 上车站点：增加对应乘客数
        diff[start] += count;
        // 【核心注释】下车站点：减少对应乘客数
        // 原因：乘客在end站下车，end站的人数不计入，所以截止到end-1站都有这些乘客，end站直接减
        diff[end] -= count; // 修正：把val改为count（你的笔误）
    }

    // 实时计算当前乘客数，校验是否超员
    let currentPassengers = 0;
    // 遍历所有可能的站点（0~1000），确保每个站点都校验
    for (let i = 0; i <= 1000; i++) {
        currentPassengers += diff[i];
        // 任意站点超员，立即返回false（提前终止，提升效率）
        if (currentPassengers > capacity) {
            return false;
        }
    }

    // 所有站点都未超员，返回true
    return true;
};
```

#### 核心要点 & 易错点

1. 站点是`0-based`：无需像航班题那样减1，直接使用原始值；

2. 下车站点处理：`diff[end] -= count`（而非`end+1`），因为`end`站不计入乘客数；

3. 遍历范围：覆盖所有可能的站点（0~1000），而非行程数，避免遗漏超员场景。

## 三、拓展延伸

### 3.1 超大区间问题

若区间范围是`[0, 10^9]`，直接创建长度为`10^9`的差分数组会导致内存溢出。此时需要「线段树」这种数据结构，可在`O(logN)`时间复杂度内完成区间增减和查询。

### 3.2 前缀和+差分数组结合

前缀和擅长区间查询，差分数组擅长区间更新，线段树则融合了两者的优势，可同时支持高效的区间更新与区间查询，是处理复杂区间问题的终极方案。

## 四、总结

1. 差分数组的核心是「用两个标记替代区间遍历」，将区间更新的时间复杂度从`O(N)`降为`O(1)`；

2. 不同场景的关键适配点：

    - 区间包含终点（370/1109题）：`diff[end+1] -= val`；

    - 区间不包含终点（1094题）：`diff[end] -= val`；

    - 1-based编号（1109题）：需转换为0-based索引；

3. 差分数组长度建议设为`n+1`，避免越界且不影响结果，是行业通用最优写法。

差分数组是算法面试中高频的「区间操作」技巧，掌握其核心原理和场景适配细节，能轻松解决大部分数组区间批量更新问题。

