# 算法的数学技巧1：模运算、快速幂、位运算、GCD/LCM

## 前言

在算法刷题和面试中，**模运算、快速幂、最大公约数（GCD）、最小公倍数（LCM）、位运算**是高频核心考点。这些技巧不仅能解决大数溢出问题，还能将暴力算法的时间复杂度从 O(n) 优化至 O(logn)，是进阶算法工程师的必备基本功。

---

## 一、模运算：解决大数溢出的核心工具

### 核心运算律

模运算的本质是保留除法余数，通过分步取模避免数值溢出，三大核心运算律必须牢记：

```Plain Text

1. 加法：(a + b) % k = (a % k + b % k) % k
2. 乘法：(a * b) % k = (a % k * b % k) % k
3. 减法：(a - b) % k = (a % k - b % k + k) % k （+k 保证结果为正）
```

### 原理推导

对任意整数 `a` 和正数 `m`，可拆分：`a = q·m + r`（`0≤r<m`，`r` 为余数）

- 加法推导：

我们的目标是证明模运算的加法运算律：`(a + b) mod m = [(a mod m) + (b mod m)] mod m`，具体推导过程如下：

首先，根据模运算的定义，对任意整数a和正数m，都可以将a拆分为`a = q1·m + r1`，其中q1是商，r1是余数，且满足`0 ≤ r1 < m`，此时`r1 = a mod m`；同理，对于整数b，也可以拆分为`b = q2·m + r2`，其中q2是商，r2是余数，满足`0 ≤ r2 < m`，即`r2 = b mod m`。

接下来，将a和b的拆分式相加，可得`a + b = (q1·m + r1) + (q2·m + r2)`，整理后得到`a + b = (q1 + q2)·m + (r1 + r2)`。

然后，对等式两边整体取模m。由于`(q1 + q2)·m`是m的整数倍，根据模运算的性质，一个数的整数倍对m取模结果为0，因此`(a + b) mod m = [(q1 + q2)·m + (r1 + r2)] mod m = (r1 + r2) mod m`。

最后，将`r1 = a mod m`和`r2 = b mod m`代回上式，即可得到最终结论：`(a + b) mod m = [(a mod m) + (b mod m)] mod m`。

- 乘法推导：

我们的目标是证明模运算的乘法运算律：`(a·b) mod m = [(a mod m)·(b mod m)] mod m`，具体推导过程如下：

沿用模运算的核心定义，对任意整数a和正数m，可拆分得到`a = q1·m + r1`，其中q1为商，r1为余数，且满足`0 ≤ r1 < m`，此时`r1 = a mod m`；同理，整数b可拆分为`b = q2·m + r2`，q2为商，r2为余数，满足`0 ≤ r2 < m`，即`r2 = b mod m`。

接下来，将a和b的拆分式相乘，展开后可得`a·b = (q1·m + r1)·(q2·m + r2) = q1·q2·m² + q1·m·r2 + q2·m·r1 + r1·r2`。

对等式两边整体取模m，分析各项取模结果：其中`q1·q2·m²`、`q1·m·r2`、`q2·m·r1`均为m的整数倍（分别含有m²、m因子），根据模运算性质，m的整数倍对m取模结果为0，因此这些项均可消去。

最终可得`(a·b) mod m = (r1·r2) mod m`，再将`r1 = a mod m`和`r2 = b mod m`代回上式，即可证明乘法运算律：`(a·b) mod m = [(a mod m)·(b mod m)] mod m`。

### ultra 精简总结

- 任何数都能拆成：`a=k⋅m+r`

- 加减乘时，倍数项都会被模吃掉

- 只剩下余数之间的加减乘

- 减法可能负，所以 +m 再模 保证是正余数

---

## 二、快速幂：O(logn) 计算高次幂取模

### 核心思路

暴力计算高次幂（如 `2^100000000`）时间复杂度为 O(n)，效率极低。

**快速幂**通过**二进制拆分指数**，将时间复杂度降至 O(logn)，全程边算边取模防止溢出。

示例：`3^13 = 3^(8+4+1) = 3^8 × 3^4 × 3^1`

- 13 二进制：`1101`

- 二进制位为 1 时，将当前底数乘入结果

- 底数每次自平方，对应 2 的次方递增

我们以计算 `3^13 mod 15` 为例，直观理解快速幂的核心操作流程。首先，将指数13转化为二进制形式，得到`1101`，这意味着13可以拆分为 `8 + 4 + 1`（对应二进制每一位1的权重），因此 `3^13` 可转化为 `3^8 × 3^4 × 3^1`，取模运算也遵循这一拆分逻辑。

具体计算时，我们重点关注二进制中为1的位（即第0、2、3位，对应权重1、4、8），核心思路是“边平方底数、边累乘结果”。首先初始化base为 `3^1 mod 15`，后续每一步都将base进行平方并取模，得到更高次幂的余数——比如 `3^2 mod 15` 就是`(base × base) mod 15`，以此类推得到 `3^4`、`3^8` 的余数。

累乘过程中，只要二进制当前位为1，就将当前base的余数乘入最终结果，且每一次累乘后都需取模，避免数值溢出。最终的计算式为 `((3^1 mod 15) × (3^4 mod 15) mod 15) × (3^8 mod 15) mod 15`，这也正是快速幂“从低位到高位，平方base、累乘结果”的核心逻辑。

### 代码实现

1. 字符串二进制版（易懂）

```JavaScript

// 计算 num 的 power 次方  取余 mod
/**
 * 快速幂算法：计算 (base 的 exponent 次方) % mod 的结果
 * 核心原理：把指数拆成二进制，从低位到高位，只平方 + 累乘需要的项
 */
function fastPower(baseNumber, exponent, mod) {
  // 1. 把指数转成二进制，并反转数组 → 从【低位】到【高位】遍历
  const binaryBits = exponent.toString(2).split('').reverse();

  // 2. 初始化：当前项 = 底数的 1 次方（二进制最低位对应的次方）
  // 每次循环都会变成自己的平方：1次方 → 2次方 → 4次方 → 8次方...
  let currentPowerValue = baseNumber % mod;

  // 3. 最终结果（乘法初始值为 1）
  let result = 1;

  // 4. 遍历指数的每一位（从低位到高位）
  for (let i = 0; i < binaryBits.length; i++) {
    const currentBit = binaryBits[i];

    // ✅ 如果当前二进制位是 1，说明这个次方需要乘进结果
    if (currentBit === '1') {
      // 结果 = (上一次结果 × 当前次方项) 取模
      result = (result * currentPowerValue) % mod;
    }

    // ✅ 关键：当前项平方一次，对应二进制位往左移一位
    // 1次方 → 平方 → 2次方 → 平方 → 4次方 → 平方 → 8次方...
    currentPowerValue = (currentPowerValue * currentPowerValue) % mod;
  }

  // 返回最终取模结果
  return result;
}
```

1. 位运算版（高效，面试推荐）

```JavaScript

// 计算 num 的 power 次方  取余 mod
/**
 * 快速幂算法：计算 (base 的 exponent 次方) % mod 的结果
 * 核心原理：把指数拆成二进制，从低位到高位，只平方 + 累乘需要的项
 */
function fastPower(baseNumber, exponent, mod) {
  // 2. 初始化：当前项 = 底数的 1 次方（二进制最低位对应的次方）
  // 每次循环都会变成自己的平方：1次方 → 2次方 → 4次方 → 8次方...
  let currentPowerValue = baseNumber % mod;

  // 3. 最终结果（乘法初始值为 1）
  let result = 1;

  // 4. 遍历指数的每一位（从低位到高位）
  while (exponent > 0) {
    const currentBit = exponent & 1;

    // ✅ 如果当前二进制位是 1，说明这个次方需要乘进结果
    if (currentBit === 1) {
      // 结果 = (上一次结果 × 当前次方项) 取模
      result = (result * currentPowerValue) % mod;
    }

    // ✅ 关键：当前项平方一次，对应二进制位往左移一位
    // 1次方 → 平方 → 2次方 → 平方 → 4次方 → 平方 → 8次方...
    currentPowerValue = (currentPowerValue * currentPowerValue) % mod;

    // exponent变成二进制之后，整体往右移动一位，舍弃最后一位
    exponent = exponent >> 1;
  }
  // 返回最终取模结果
  return result;
}
```

---

## 三、位运算：5 个高频实用技巧

位运算直接操作二进制，执行效率远超四则运算，5 个技巧直接背诵：

```Plain Text

1. 判断奇数：x & 1 === 1
2. 乘以 2：x << 1
3. 除以 2：x >> 1 （等价 Math.floor(n/2)）
4. 清零最后一位 1：x & (x - 1)
```

### 原理补充

- 二进制左移 1 位 = 乘以 2

- 二进制右移 1 位 = 除以 2（向下取整）

- `x & (x - 1)` 可快速统计二进制中 1 的个数、判断是否为 2 的幂

---

## 四、最大公约数（GCD）与最小公倍数（LCM）

### 1. 最大公约数（GCD）

最大公约数有个[视频推荐](https://v.douyin.com/ydXhwiqZ14k/)

**欧几里得算法**：辗转相除，核心公式 `gcd(m, n) = gcd(n, m % n)`

```JavaScript

// 基础版
function gcd(m, n) {
  if (m % n === 0) return n;
  if (n > m) {
    [m, n] = [n, m];
  }
  // m始终指向大的数
  while (n > 0) {
    const oldN = n;
    n = m % n;
    m = oldN;
  }
  return m;
}

// 专业极简版（面试推荐）
function gcd(m, n) {
  while (n !== 0) {
    [m, n] = [n, m % n];
  }
  return m;
}
```

### 2. 最小公倍数（LCM）

公式：`LCM(m, n) = (m × n) / GCD(m, n)`

```JavaScript

function lcd(m, n) {
  const area = m * n;
  while (n !== 0) {
    [m, n] = [n, m % n];
  }
  // m此时就是最大公约数
  return area / m;
}
```

---

## 五、LeetCode 实战练习

### 练习 1：1979. 找出数组的最大公约数

- 链接：[https://leetcode.cn/problems/find-greatest-common-divisor-of-array/](https://leetcode.cn/problems/find-greatest-common-divisor-of-array/)

- 描述：给定一个整数数组 `nums`，返回数组中最大数和最小数的**最大公约数**

- 示例：输入 `nums = [2,5,6,9,10]`，输出 `2`

- 思路：
  1. 找出数组最大值和最小值

  2. 用辗转相除法计算两者的 GCD

- 代码：

```JavaScript

var findGCD = function (nums) {
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  while (min > 0) [max, min] = [min, max % min];
  return max;
};
```

### 练习 2：2413. 最小偶倍数

- 链接：[https://leetcode.cn/problems/smallest-even-multiple/](https://leetcode.cn/problems/smallest-even-multiple/)

- 描述：给一个正整数 `n`，返回 `2` 和 `n` 的**最小公倍数**

- 示例：输入 `n = 5`，输出 `10`

- 思路：直接套用 LCM 公式计算

- 代码：

```JavaScript

var smallestEvenMultiple = function (n) {
  let m = 2;
  const area = m * n;
  while (n > 0) {
    [m, n] = [n, m % n];
  }
  return area / m;
};
```

### 练习 3：191. 位1的个数

- 链接：[https://leetcode.cn/problems/number-of-1-bits/](https://leetcode.cn/problems/number-of-1-bits/)

- 描述：编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 `1` 的个数

- 示例：输入 `n = 00000000000000000000000000001011`，输出 `3`

- 思路：用 `x & (x - 1)` 循环清零最后一位 1，统计次数

- 代码：

```JavaScript

var hammingWeight = function (n) {
  // 数1的个数， n &(n-1) 消灭最后一个1
  let res = 0;
  while (n > 0) {
    n = n & (n - 1);
    res++;
  }
  return res;
};
```

---

## 六、核心知识点思维导图

```mermaid
markmap
## **模运算**
- 加法：(a+b)%k=(a%k+b%k)%k
- 乘法：(a*b)%k=(a%k*b%k)%k
- 减法：(a-b)%k=(a%k-b%k+k)%k
- 作用：解决大数溢出
## **快速幂**
- 原理：二进制拆分指数
- 复杂度：O(logn)
- 实现：位运算/字符串二进制
- 核心：自平方+累乘取模
## **位运算技巧**
- 判断奇数：x&1
- 乘2：x<<1
- 除2：x>>1
- 清最后1位：x&(x-1)
## **GCD&LCM**
- GCD：辗转相除法
- LCM：(m*n)/GCD(m,n)
- 极简代码：循环交换取余
## **实战题目**
- 1979：数组GCD
- 2413：最小偶倍数
- 191：统计二进制1的个数
```
