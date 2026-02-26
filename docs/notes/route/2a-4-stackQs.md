# 栈的经典应用：从基础到进阶，解决LeetCode高频栈类问题

栈（Stack）是一种遵循「后进先出（LIFO）」原则的线性数据结构，也是算法面试中最常考察的基础数据结构之一。本文将从栈的核心特性出发，系统讲解栈在路径简化、括号匹配、表达式求值、数据结构设计等场景的经典应用，覆盖LeetCode高频栈类题目，每个题目均包含题目描述、核心思路、完整代码及易错点解析，帮助你彻底掌握栈的实战用法。
![stack_qs.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/276da6d14a32429d9fac3da6c5dc3a1b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6aKc6YWx:q75.awebp?rk3s=f64ab15b&x-expires=1772705583&x-signature=2yIPIo7XkipHZS96C8mpxrqduaU%3D)
<!-- 
```
## **栈 Stack**
- 核心特性
  - 后进先出 LIFO
  - 适用：匹配、回退、分层、顺序
- 基础应用题
  - LeetCode 71 简化路径
    - 分割 / → 栈过滤
    - 跳过 . / 空串
    - .. 弹出栈顶
  - LeetCode 20 有效的括号
    - 左括号入栈
    - 右括号匹配栈顶
    - 最终栈必须为空
  - LeetCode 150 逆波兰表达式求值
    - 数字入栈
    - 运算符弹出两数计算
    - 除法用 Math.trunc
  - LeetCode 388 文件最长绝对路径
    - \t 表示层级
    - 栈存目录长度
    - 只统计带 . 的文件
- 设计类栈
  - LeetCode 225 队列实现栈
    - 双队列：转移取最后一个
    - 单队列：push 反转前 n-1
  - LeetCode 155 最小栈
    - 双栈法：主栈 + 最小栈
    - 优化栈：只存更小值
    - 单栈差值法：O(1) 空间
  - LeetCode 895 最大频率栈
    - valToFreq 记录频率
    - stack 按频率分层
    - 同频率取最近入栈
- 频率延伸题
  - LeetCode 451 字符频率排序
    - 统计频率
    - 按频率分层
    - 从高到低拼接
## **通用算法思想**
- 栈分层：维护层级/深度/频率
- 编码解码：最小栈差值思想
- 双结构分离：职责拆分，操作O(1)
``` -->

## 一、简化路径（LeetCode 71）

### 题目链接

[https://leetcode.cn/problems/simplify-path/](https://leetcode.cn/problems/simplify-path/)

### 题目描述

给你一个字符串 `path`，表示指向某一文件或目录的 Unix 风格绝对路径（以 '/' 开头），请你将其转化为更加简洁的规范路径。

Unix 风格文件系统规则：

1. 一个点（`.`）表示当前目录本身；

2. 两个点（`..`）表示将目录切换到上一级（父目录）；

3. 任意多个连续的斜杠（`//`）都被视为单个斜杠 `/`；

4. 其他格式的点（如 `...`）均被视为文件/目录名称。

返回的规范路径需满足：

- 必须以 `/` 开头；

- 目录名之间只能有一个 `/`；

- 不能包含 `.` 和 `..`；

- 不能有末尾的 `/`（根目录 `/` 除外）。

### 示例

输入：`path = "/a/./b/../../c/"`

输出：`"/c"`

### 解题思路

利用栈的「后进先出」特性处理目录回退，是路径简化的最优解：

1. 按 `/` 分割路径，得到包含空字符串、`.`、`..`、合法目录名的数组；

2. 遍历数组：空字符串/`.` 直接跳过，`..` 则栈非空时弹出栈顶（回退目录），合法目录名压入栈；

3. 拼接结果：栈空返回 `/`，否则用 `/` 连接栈内元素并加前缀 `/`。

### 完整代码

```JavaScript

/**
 * LeetCode 71. 简化路径（https://leetcode.cn/problems/simplify-path/）
 * 解题思路：栈（利用「后进先出」特性处理目录回退，是处理路径简化的最优解）
 * 核心规则（Unix 规范路径）：
 * 1. 必须以 '/' 开头
 * 2. 目录名之间只能有一个 '/'
 * 3. 不能包含 '.'（当前目录）和 '..'（上级目录）
 * 4. 不能有末尾的 '/'（根目录 '/' 除外）
 * @param {string} path Unix 风格的绝对路径
 * @return {string} 简化后的规范路径
 */
var simplifyPath = function(path) {
    // 1. 按 '/' 分割路径：会产生空字符串（连续/）、.、..、合法目录名
    const pathArr = path.split('/');
    const stack = []; // 栈存储合法的目录名，用于最终拼接

    // 2. 遍历分割后的数组，过滤无效内容，处理目录回退
    for(let i = 0; i < pathArr.length; i++){
        const cur = pathArr[i];
        
        // 情况1：空字符串（连续/）或 .（当前目录）→ 无意义，跳过
        if(cur === '' || cur === '.'){
            continue;
        }
        
        // 情况2：..（上级目录）→ 栈非空则弹出栈顶（回退），栈空则不处理（根目录无上级）
        if(cur === '..'){
            if(stack.length !== 0){
                stack.pop();
            }
            continue; // 处理完..后直接跳过，避免误将..入栈
        }
        
        // 情况3：合法目录名 → 压入栈中
        stack.push(cur);
    }

    // 3. 拼接结果：栈空则返回 '/'，否则用/连接栈内元素并加前缀/
    return '/' + stack.join('/');
};
```

## 二、有效的括号（LeetCode 20）

### 题目链接

[https://leetcode.cn/problems/valid-parentheses/](https://leetcode.cn/problems/valid-parentheses/)

### 题目描述

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s`，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合；

2. 左括号必须以正确的顺序闭合；

3. 每个右括号都有一个对应的相同类型的左括号。

### 示例

输入：`s = "()[]{}"`

输出：`true`

输入：`s = "(]"`

输出：`false`

### 解题思路

栈 + 哈希表组合：

1. 哈希表存储左括号到右括号的映射，用于快速匹配；

2. 遍历字符串：左括号入栈，右括号则检查栈顶左括号是否匹配（栈空/不匹配则直接无效）；

3. 遍历结束后，栈空则所有括号匹配，否则左括号多余。

### 完整代码

```JavaScript

/**
 * LeetCode 20. 有效的括号（https://leetcode.cn/problems/valid-parentheses/）
 * 解题思路：栈 + 哈希表（核心：左括号入栈，右括号匹配栈顶左括号）
 * 有效括号规则：
 * 1. 左括号必须用相同类型的右括号闭合
 * 2. 左括号必须以正确的顺序闭合
 * 3. 空字符串视为有效
 * @param {string} s 括号字符串（仅包含 '()[]{}'）
 * @return {boolean} 是否为有效括号
 */
var isValid = function(s) {
    const len = s.length;
    // 【易错点1】空字符串直接返回true（题目定义空字符串有效）
    if (len === 0) return true;
    // 【优化】用Map存储左→右括号的映射，匹配时直接查找
    const map = new Map([['[', ']'], ['(', ')'], ['{', '}']]);
    const stack = []; // 栈：存储未匹配的左括号

    for (let i = 0; i < len; i++) {
        const cur = s[i];
        if (map.has(cur)) {
            // 情况1：左括号 → 入栈（等待后续匹配）
            stack.push(cur);
        } else {
            // 情况2：右括号 → 检查匹配
            // 【易错点2】栈空但遇到右括号 → 右括号多余，直接无效
            if (stack.length === 0) return false;
            // 弹出栈顶左括号，检查是否匹配当前右括号
            const left = stack.pop();
            const matchRight = map.get(left);
            // 【易错点3】括号类型不匹配 → 直接无效
            if (matchRight !== cur) return false;
        }
    }

    // 【易错点4】遍历完后栈非空 → 左括号多余，无效；栈空则全部匹配
    return stack.length === 0;
};
```

## 三、逆波兰表达式求值（LeetCode 150）

### 题目链接

[https://leetcode.cn/problems/evaluate-reverse-polish-notation/](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

### 题目描述

给你一个字符串数组 `tokens`，表示一个根据逆波兰表示法表示的算术表达式，请你计算该表达式并返回结果。

规则：

1. 有效的算符为 `'+'`、`'-'`、`'*'` 和 `'/'`；

2. 两个整数之间的除法总是向零截断；

3. 表达式中不含除零运算；

4. 答案及所有中间计算结果可用 32 位整数表示。

### 示例

输入：`tokens = ["2","1","+","3","*"]`

输出：`9`

解释：该表达式转化为常规中缀表达式为 `(2+1)*3 = 9`

### 解题思路

逆波兰表达式（后缀表达式）的标准解法是栈：

1. 遍历 `tokens`：数字直接入栈，运算符则弹出栈顶两个数（注意顺序：后弹出的是左操作数）；

2. 执行运算后将结果重新入栈，参与后续运算；

3. 遍历结束后，栈中仅剩一个元素，即为最终结果。

### 完整代码

```JavaScript

/**
 * LeetCode 150. 逆波兰表达式求值（https://leetcode.cn/problems/evaluate-reverse-polish-notation/）
 * 解题核心：栈（逆波兰表达式的标准解法，时间/空间复杂度均为最优）
 * 逆波兰表达式定义：将运算符写在操作数之后的后缀表达式，无需括号即可确定运算顺序
 * 示例：["2","1","+","3","*"] → (2+1)*3 = 9
 * @param {string[]} tokens 逆波兰表达式数组（元素为数字字符串/+-*运算符）
 * @return {number} 表达式计算结果
 */
var evalRPN = function(tokens) {
    const len = tokens.length;

    // 【易错点1：边界处理】空数组返回0（题目隐含要求）
    if (len === 0) return 0;
    // 【易错点2：单元素类型】单元素需转为数字，避免返回字符串（如["123"]返回123而非"123"）
    if (len === 1) return Number(tokens[0]);

    // 用Set存储运算符：查询效率O(1)（数组includes是O(n)，性能更优）
    const signs = new Set(['+', '-', '*', '/']);
    const stack = []; // 栈：存储待运算的数字（核心容器）

    // 遍历每个token，区分数字/运算符处理
    for (let i = 0; i < len; i++) {
        const cur = tokens[i];
        const isSign = signs.has(cur); // 判断当前token是否为运算符

        if (!isSign) {
            // ========== 情况1：当前是数字 ==========
            // 【易错点3：数字类型转换】必须提前转Number入栈！
            // 反例：若存字符串，后续+运算会变成拼接（如"10"+"20"="1020"）
            stack.push(Number(cur));
        } else {
            // ========== 情况2：当前是运算符 ==========
            // 【易错点4：操作数顺序（核心！）】
            // 逆波兰表达式中，运算符后出现的操作数先弹出（右操作数），先出现的后弹出（左操作数）
            // 错误顺序会导致减法/除法完全错误（如10-5变成5-10）
            const after = stack.pop(); // 右操作数（后出现的数，如a-b中的b）
            const before = stack.pop(); // 左操作数（先出现的数，如a-b中的a）

            // 调用运算函数，结果重新入栈（参与后续运算）
            const newVal = cal(before, after, cur);
            stack.push(newVal);
        }
    }

    // 最终栈中仅剩一个元素，即为最终结果
    return stack.pop();


    function cal(before, after, sign) {
        switch (sign) {
            case '+':
                return before + after;
            case '-':
                return before - after;
            case '*':
                return before * after;
            case '/':
                // 【易错点5：除法取整规则（题目强制要求）】
                // 错误写法：Math.floor(before/after) → 负数除法会出错（如-10/3=-4，正确应为-3）
                // 正确写法：Math.trunc() → 直接截断小数部分，向零取整（符合题目要求）
                return Math.trunc(before / after);
            // 【工程化补充】default分支必须有返回/抛错，避免函数返回undefined
            default:
                throw new Error(`不支持的运算符：${sign}，请输入 +-*/ 中的一种`);
        }
    }
};
```

## 四、用队列实现栈（LeetCode 225）

### 题目链接

[https://leetcode.cn/problems/implement-stack-using-queues/](https://leetcode.cn/problems/implement-stack-using-queues/)

### 题目描述

请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（`push`、`top`、`pop` 和 `empty`）。

实现 `MyStack` 类：

- `void push(int x)`：将元素 x 压入栈顶；

- `int pop()`：移除并返回栈顶元素；

- `int top()`：返回栈顶元素；

- `boolean empty()`：如果栈是空的，返回 `true`；否则返回 `false`。

注意：只能使用队列的标准操作（`push to back`、`peek/pop from front`、`size`、`is empty`）。

### 示例

```JavaScript

const myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // 返回 2
myStack.pop(); // 返回 2
myStack.empty(); // 返回 false
```

### 解题思路

#### 双队列实现

核心是通过「元素转移」模拟栈的后进先出：

1. 主队列存储栈元素，辅助队列临时存储转移的元素；

2. `pop` 时将主队列除最后一个元素外，全部转移到辅助队列，取出最后一个元素（栈顶），再交换主辅队列角色；

3. `top` 复用 `pop` 逻辑，取出栈顶后重新入队。

#### 单队列实现（进阶）

优化空间，仅用一个队列：

1. `push` 时先将元素入队，再将前 `n-1` 个元素重新入队，让新元素到队头（模拟栈顶）；

2. `pop/top` 直接操作队头即可。

### 完整代码

#### 双队列版

```JavaScript

/**
 * 225. 用队列实现栈（ES6 Class 版本）
 * 核心思路：双队列（主队列q1 + 辅助队列q2），通过元素转移模拟栈的后进先出
 * 队列仅使用标准操作：push to back（push）、pop from front（shift）、size、isEmpty
 */
class MyStack {
    // 构造函数：初始化两个队列（用数组模拟队列）
    constructor() {
        this.q1 = []; // 主队列：存储当前栈的所有元素
        this.q2 = []; // 辅助队列：临时存储转移的元素
    }

    /**
     * 将元素x压入栈顶（始终入队到主队列q1）
     * @param {number} x
     * @return {void}
     */
    push(x) {
        // 【易错点1】push操作直接入队q1，无需复杂逻辑
        this.q1.push(x);
    }

    /**
     * 移除并返回栈顶元素（核心操作：转移q1元素到q2，仅保留最后一个）
     * @return {number}
     */
    pop() {
        // 步骤1：将q1中除最后一个元素外，全部转移到q2
        while (this.q1.length > 1) {
            // 队列标准操作：shift从队头出队，push到q2队尾
            this.q2.push(this.q1.shift());
        }
        // 步骤2：q1中仅剩的元素就是栈顶元素，取出它
        const topVal = this.q1.shift();
        
        // 步骤3：交换q1和q2的角色（让q2变成新的主队列，q2清空）
        // 【易错点2】必须交换队列，否则下次操作会丢失元素
        [this.q1, this.q2] = [this.q2, this.q1];
        
        return topVal;
    }

    /**
     * 返回栈顶元素（逻辑同pop，但不删除元素）
     * @return {number}
     */
    top() {
        // 复用pop的逻辑，但取出栈顶元素后要重新加回q1
        const topVal = this.pop();
        // 【易错点3】top操作不删除元素，需把取出的栈顶元素重新入队q1
        this.push(topVal);
        return topVal;
    }

    /**
     * 判断栈是否为空（仅需判断主队列q1是否为空）
     * @return {boolean}
     */
    empty() {
        // 【易错点4】只判断q1即可，因为q2始终是辅助队列，操作后会被清空
        return this.q1.length === 0;
    }
}
```

#### 单队列版

```JavaScript

class MyStack {
    constructor() {
        this.q = []; // 单个队列模拟栈
    }

    push(x) {
        this.q.push(x);
        // 把前n-1个元素重新入队，让新元素到队头（模拟栈顶）
        let len = this.q.length;
        while (len > 1) {
            this.q.push(this.q.shift());
            len--;
        }
    }

    pop() {
        return this.q.shift(); // 队头就是栈顶，直接出队
    }

    top() {
        return this.q[0]; // 队头就是栈顶，直接返回
    }

    empty() {
        return this.q.length === 0;
    }
}
```

## 五、文件的最长绝对路径（LeetCode 388）

### 题目链接

[https://leetcode.cn/problems/longest-absolute-file-path/](https://leetcode.cn/problems/longest-absolute-file-path/)

### 题目描述

假设有一个同时存储文件和目录的文件系统，给定一个格式化的路径字符串 `input`（包含 `\n` 和 `\t`），请计算文件的最长绝对路径的长度。

规则：

1. `\n` 分隔不同的文件/目录；

2. `\t` 的个数表示层级（如 `\t\tfile.txt` 表示第三级）；

3. 只有包含 `.` 的是文件，目录不参与最长长度统计；

4. 绝对路径的分隔符为 `/`，长度包含 `/`。

### 示例

输入：`input = "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"`

输出：`20`

解释：最长路径为 `dir/subdir2/file.ext`，长度为 20。

### 解题思路

栈存储各层级名称的长度（空间最优）：

1. 按 `\n` 分割路径，遍历每个节点；

2. 通过 `\t` 的个数判断层级，维护栈的层级匹配（栈长度 = 当前层级）；

3. 栈中存储各层级名称的长度，遇到文件时计算总长度（名称长度和 + 分隔符个数），更新最大值。

### 完整代码

```JavaScript

/**
 * LeetCode 388. 文件的最长绝对路径 - 终极优化版
 * 核心思路：
 * 1. 栈仅存储「各层级名称的长度」（而非完整名称），空间复杂度最优；
 * 2. 用\t的个数判断层级，通过栈长度匹配层级，维护当前路径的有效性；
 * 3. 仅计算含.的文件路径长度，文件夹不参与统计。
 * @param {string} input 格式化的路径字符串（含\n和\t）
 * @return {number} 最长文件绝对路径的长度
 */
var lengthLongestPath = function(input) {
    // 按换行分割所有路径节点（如"dir\n\tsubdir" → ["dir", "\tsubdir"]）
    let parts = input.split('\n');
    let maxLen = 0; // 记录最长文件路径长度，初始为0（无文件时返回0）
    let stack = []; // 栈：存储各层级名称的长度（核心优化：仅存数字，节省空间）

    for(let part of parts) {
        // ========== 步骤1：计算当前节点的层级 ==========
        // curLevel = \t的个数（lastIndexOf('\t')找最后一个\t的索引，+1转为个数）
        const curLevel = part.lastIndexOf('\t') + 1;
        
        // ========== 步骤2：提取纯名称（去掉所有\t） ==========
        const name = part.slice(curLevel); // 如"\t\tfile.txt" → "file.txt"

        // ========== 步骤3：维护栈的层级匹配（核心！） ==========
        // 规则：栈长度 = 当前层级（只保留当前节点的所有父路径长度）
        // 若curLevel < 栈长度 → 层级回退，循环pop直到栈长度匹配curLevel
        while(curLevel < stack.length) {
            stack.pop();
        }

        // ========== 步骤4：将当前节点名称长度入栈 ==========
        // 优化点：栈存长度而非完整名称，避免字符串存储开销
        stack.push(name.length);

        // ========== 步骤5：仅计算文件的路径长度 ==========
        if(name.includes('.')) { // 只有含.的是文件，文件夹跳过
            // 总长度 = 所有层级名称长度和 + 分隔符/的数量（栈长度-1）
            const len = stack.reduce((acc, cur) => acc + cur, 0); // 名称长度和
            const splitCount = stack.length - 1; // /的数量（n层路径有n-1个/）
            maxLen = Math.max(maxLen, len + splitCount); // 更新最长长度
        }
    }

    return maxLen;
};
```

## 六、最小栈（LeetCode 155）

### 题目链接

[https://leetcode.cn/problems/min-stack/](https://leetcode.cn/problems/min-stack/)

### 题目描述

设计一个支持 `push`、`pop`、`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类：

- `MinStack()`：初始化堆栈对象；

- `void push(int val)`：将元素 `val` 推入堆栈；

- `void pop()`：删除堆栈顶部的元素；

- `int top()`：获取堆栈顶部的元素；

- `int getMin()`：获取堆栈中的最小元素。

### 示例

```JavaScript

const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // 返回 -3
minStack.pop();
minStack.top();    // 返回 0
minStack.getMin(); // 返回 -2
```

### 解题思路

#### 双栈实现（基础版）

主栈存所有元素，辅助栈同步存「当前栈的最小值」，保证辅助栈与主栈长度一致，`getMin` 直接返回辅助栈顶。

#### 双栈优化版（空间优化）

辅助栈仅存储「最小值发生变化的节点」，`push` 时仅当当前值 ≤ 辅助栈顶才入栈，`pop` 时仅当弹出值 = 辅助栈顶才弹出。

#### 单栈实现（极致优化）

栈存储「当前值 - 当时最小值」的差值，用变量记录当前最小值，通过差值反推原始值，仅占用 O(1) 额外空间。

### 完整代码

#### 双栈基础版

```JavaScript

/**
 * LeetCode 155. 最小栈（MinStack）
 * 核心需求：实现一个栈，支持 push/pop/top 操作，且能在 O(1) 时间内获取栈内最小值
 * 核心思路：双栈设计（主栈存所有元素 + 辅助栈同步存「当前栈的最小值」）
 * 关键规则：
 * 1. 辅助栈与主栈长度始终一致；
 * 2. 辅助栈每个位置的值 = 主栈对应位置及之前所有元素的最小值；
 * 3. 所有操作均为 O(1) 时间复杂度。
 */
class MinStack {
  /**
   * 构造函数：初始化两个栈
   */
  constructor() {
    // 主栈：存储所有入栈的原始元素（如 [2, 0, -1]）
    this.stack = [];
    // 辅助栈：同步存储「当前栈的最小值」（如 [2, 0, -1]，对应主栈每一步的最小值）
    this.minStack = [];
  }

  /**
   * 推入元素到栈顶（核心操作：同步更新辅助栈）
   * @param {number} val 要推入的元素
   * @return {void}
   */
  push(val) {
    // ========== 步骤1：主栈正常推入元素 ==========
    this.stack.push(val);

    // ========== 步骤2：辅助栈推入「当前最小值」 ==========
    // 【易错点1：空栈判断】
    // 错误写法：if (this.stack.length) → 空栈时this.stack.length=0（false），首次push无法入辅助栈；
    // 正确写法：判断辅助栈是否为空（辅助栈空 = 首次push）
    if (this.minStack.length === 0) {
      this.minStack.push(val); // 首次push，辅助栈直接推入当前值（此时它就是最小值）
      return; // 无需后续逻辑，直接返回
    }

    // 非首次push：取辅助栈顶的「历史最小值」和当前值的较小者
    const minTop = this.minStack[this.minStack.length - 1]; // 辅助栈顶 = 主栈当前所有元素的最小值
    const smallerVal = Math.min(minTop, val); // 新的最小值（当前值 vs 历史最小值）
    this.minStack.push(smallerVal); // 辅助栈同步推入新最小值
  }

  /**
   * 弹出栈顶元素（核心：主栈+辅助栈必须同步弹出）
   * @return {number | undefined} 弹出的元素（空栈返回undefined，符合原生栈行为）
   */
  pop() {
    // 【易错点2：同步弹出】
    // 错误写法：仅pop主栈，不pop辅助栈 → 两个栈长度不一致，getMin结果错误；
    // 正确写法：辅助栈必须和主栈同步弹出，保证长度一致
    this.minStack.pop();
    // 返回主栈弹出的元素（原生栈pop也会返回弹出值，保持行为一致）
    return this.stack.pop();
  }

  /**
   * 获取栈顶元素（不弹出，仅查询）
   * @return {number | undefined} 栈顶元素（空栈返回undefined，避免报错）
   */
  top() {
    // 【易错点3：空栈保护】
    // 错误写法：直接return this.stack[this.stack.length-1] → 空栈时返回undefined（无报错，但不规范）；
    // 正确写法：显式判断空栈，返回undefined（工程化编码规范）
    if (this.stack.length === 0) return undefined;
    return this.stack[this.stack.length - 1]; // 访问主栈最后一个元素（栈顶）
  }

  /**
   * 获取当前栈内的最小值（O(1) 时间复杂度，核心优势）
   * @return {number | undefined} 最小值（空栈返回undefined）
   */
  getMin() {
    // 【易错点4：辅助栈空栈保护】
    // 错误写法：直接return this.minStack[this.minStack.length-1] → 空栈时返回undefined；
    // 正确写法：显式判断辅助栈为空，返回undefined
    if (this.minStack.length === 0) return undefined;
    // 辅助栈顶元素 = 当前主栈所有元素的最小值（核心设计）
    return this.minStack[this.minStack.length - 1];
  }
}
```

#### 单栈极致优化版

```JavaScript

/**
 * 单栈实现最小栈（极致空间优化版）
 * 核心思想：编码解码思维
 * - 栈存储「当前值 - 入栈时的最小值」的差值（编码）
 * - 用minVal记录「当前栈的最小值」（解码密钥）
 * - 所有操作通过「差值 + minVal」反推原始值（解码）
 * 优势：O(1)时间复杂度 + O(1)额外空间复杂度
 */
class MinStack {
  /**
   * 构造函数初始化
   */
  constructor() {
    this.stack = []; // 核心：存储「值 - 入栈时最小值」的差值，而非原始值
    this.minVal = Infinity; // 解码密钥：记录当前栈的最小值，初始为无穷大（任何数都比它小）
  }

  /**
   * 推入元素到栈顶（编码过程）
   * @param {number} val 要推入的原始值
   * @return {void}
   */
  push(val) {
    // ========== 场景1：首次push（栈为空） ==========
    if (this.stack.length === 0) {
      this.stack.push(0); // 首次差值特殊处理为0（val - 无穷大无意义，手动设0）
      this.minVal = val; // 首次push，最小值就是当前值
      return;
    }

    // ========== 场景2：非首次push ==========
    // 编码：计算「当前值 - 当前最小值」的差值（核心编码逻辑）
    const diff = val - this.minVal;
    this.stack.push(diff); // 栈仅存储差值，不存原始值

    // 【易错点1：差值<0才更新最小值】
    // 错误：用<=判断 → 无影响，但冗余（=0时val=minVal，无需更新）
    // 正确：diff<0 说明val < minVal，是新的最小值，更新解码密钥
    if (diff < 0) {
      this.minVal = val;
    }
  }

  /**
   * 弹出栈顶元素（解码过程）
   * @return {number} 弹出的原始值
   * @throws {Error} 空栈弹出时主动抛错（符合栈的语义）
   */
  pop() {
    // 【易错点2：空栈保护】
    // 错误：无判断直接pop → 空栈时topDiff=undefined，后续运算报错
    // 正确：显式判断空栈，抛错或返回undefined（工程化规范）
    if (this.stack.length === 0) {
      throw new Error('栈为空，无法执行弹出操作');
    }

    const topDiff = this.stack.pop(); // 弹出编码后的差值

    // ========== 解码核心：根据差值正负反推原始值 ==========
    // 场景1：差值<0 → 入栈时val是当时的最小值（编码时更新过minVal）
    if (topDiff < 0) {
      const topVal = this.minVal; // 弹出的原始值 = 当前最小值（解码关键）
      // 【易错点3：恢复历史最小值（核心公式）】
      // 推导：入栈时 diff = 新minVal - 旧minVal → 旧minVal = 新minVal - diff
      // 错误：公式写反（如minVal = topDiff - topVal）→ 最小值恢复错误
      // 正确：minVal = 弹出值（新minVal） - 差值
      this.minVal = topVal - topDiff; 
      return topVal; // 返回弹出的原始值
    } 
    // 场景2：差值≥0 → 入栈时val ≥ minVal，原始值 = 当前最小值 + 差值
    else {
      const topVal = this.minVal + topDiff; // 解码原始值
      return topVal;
    }
  }

  /**
   * 获取栈顶元素（不弹出，仅解码）
   * @return {number | undefined} 栈顶原始值，空栈返回undefined
   */
  top() {
    // 【易错点4：空栈保护】
    // 错误：无判断直接访问stack[-1] → 空栈时topDiff=undefined，后续报错
    // 正确：显式判断空栈，返回undefined
    if (this.stack.length === 0) return undefined;

    const topDiff = this.stack[this.stack.length - 1]; // 获取栈顶差值
    // 解码：差值<0 → 栈顶值=当前最小值；否则=最小值+差值
    return topDiff < 0 ? this.minVal : this.minVal + topDiff;
  }

  /**
   * 获取当前栈的最小值（O(1)核心优势）
   * @return {number | undefined} 当前最小值，空栈返回undefined
   */
  getMin() {
    // 【易错点5：空栈保护】
    // 错误：无判断直接返回minVal → 空栈时返回Infinity，不符合预期
    // 正确：空栈返回undefined，非空返回minVal
    if (this.stack.length === 0) return undefined;
    return this.minVal; // 直接返回解码密钥，无需计算（核心优势）
  }
}
```

## 七、最大频率栈（LeetCode 895）

### 题目链接

[https://leetcode.cn/problems/maximum-frequency-stack/](https://leetcode.cn/problems/maximum-frequency-stack/)

### 题目描述

设计一个类似堆栈的数据结构，将元素推入堆栈，并从堆栈中弹出出现频率最高的元素。

实现 `FreqStack` 类：

- `FreqStack()`：构造一个空的堆栈；

- `void push(int val)`：将一个整数 `val` 压入栈顶；

- `int pop()`：删除并返回堆栈中出现频率最高的元素。如果出现频率最高的元素不只一个，则移除并返回最接近栈顶的元素。

### 示例

```JavaScript

const freqStack = new FreqStack();
freqStack.push(5);
freqStack.push(7);
freqStack.push(5);
freqStack.push(7);
freqStack.push(5);
freqStack.pop(); // 返回 5（频率3，最高）
freqStack.pop(); // 返回 7（频率2，同频率下最后入栈）
freqStack.pop(); // 返回 5（频率2，当前最高）
freqStack.pop(); // 返回 7（频率1，当前最高）
freqStack.pop(); // 返回 5（频率1，最后剩余）
```

### 解题思路

双结构拆分需求，所有操作 O(1) 时间复杂度：

1. `valToFreq`：哈希表记录每个值的当前频率；

2. `stack`：嵌套栈（数组），索引=频率，值=该频率下的「值栈」（保证同频率后进先出）；

3. `mostFreq`：快速定位当前最高频率，避免遍历。

### 完整代码

```JavaScript

/**
 * LeetCode 895. 最大频率栈（FreqStack）
 * 核心需求：
 * 1. push(val)：将元素val压入栈，记录每个值的出现频率；
 * 2. pop()：弹出「出现频率最高」的元素；若多个元素频率相同，弹出「最后入栈」的元素；
 * 核心设计思路（最优解，所有操作O(1)时间复杂度）：
 * - 双结构拆分需求：「值→频率」映射 + 「频率→值栈」分层存储；
 * - valToFreq：记录每个值的当前频率（解决「频率统计」需求）；
 * - stack：嵌套栈（数组实现），索引=频率，值=该频率下的「值栈」（解决「同频率后进先出」需求）；
 * - mostFreq：快速定位当前最高频率（避免遍历，提升效率）；
 */
class FreqStack {
  /**
   * 构造函数初始化核心数据结构
   */
  constructor() {
    // 哈希表：键=入栈值，值=该值的当前出现频率（如 {5:3, 7:2}）
    // 作用：O(1)时间更新/查询值的频率
    this.valToFreq = new Map();

    // 嵌套栈（数组实现）：stack[频率] = 该频率下的「值栈」（索引从1开始，stack[0]为占位空数组）
    // 核心：每个频率对应独立栈，栈顶是该频率下最后入栈的元素（满足「同频率后进先出」）
    this.stack = [[]];

    // 数值：当前栈中元素的「最高频率」（快速定位要弹出的栈，无需遍历）
    this.mostFreq = 0;
  }

  /**
   * 推入元素到栈顶（编码过程）
   * @param {number} val 要推入的原始值
   * @return {void}
   */
  push(val) {
    // ========== 步骤1：更新当前值的频率 ==========
    // 若值未出现过，默认频率为0；频率+1后更新到valToFreq
    const curFreq = (this.valToFreq.get(val) || 0) + 1;
    this.valToFreq.set(val, curFreq);

    // ========== 步骤2：将值推入对应频率的子栈 ==========
    // 【易错点1：数组索引初始化】
    // 错误写法：if (!this.stack[curFreq]) → 会误判「空栈（长度0）」为未初始化
    // 正确写法：判断是否为undefined（仅初始化未定义的频率层）
    if (this.stack[curFreq] === undefined) {
      this.stack[curFreq] = []; // 新频率层初始化空栈
    }
    // 将值推入对应频率的子栈（保证同频率下「后进先出」）
    this.stack[curFreq].push(val);

    // ========== 步骤3：更新当前最高频率 ==========
    // 若当前值的频率超过历史最高，更新mostFreq
    this.mostFreq = Math.max(this.mostFreq, curFreq);
  }

  /**
   * 弹出频率最高的元素（解码过程）
   * @return {number} 弹出的原始值
   * @throws {Error} 空栈调用pop时主动抛错（符合栈的语义规范）
   */
  pop() {
    // ========== 前置：空栈保护 ==========
    // 【易错点2：空栈判断逻辑】
    // 错误写法：if (this.valToFreq.size === 0) → 极端场景下valToFreq有值但mostFreq=0（概率极低）
    // 正确写法：判断mostFreq===0（直接反映「是否有可弹出的元素」）
    if (this.mostFreq === 0) {
      throw new Error('空栈不能执行弹出操作');
    }

    // ========== 步骤1：弹出最高频率子栈的栈顶元素 ==========
    // 取出最高频率对应的子栈（栈顶是该频率下最后入栈的元素）
    const maxFreqStack = this.stack[this.mostFreq];
    // 弹出栈顶元素（核心：满足「频率最高 + 最后入栈」）
    const popVal = maxFreqStack.pop();

    // ========== 步骤2：更新最高频率 ==========
    // 若最高频率子栈为空，说明该频率无元素，最高频率递减
    if (maxFreqStack.length === 0) {
      this.mostFreq -= 1;
    }

    // ========== 步骤3：更新弹出值的频率 ==========
    // 取出弹出值的当前频率，频率-1（模拟「元素出栈」）
    const curFreq = this.valToFreq.get(popVal);
    const newFreq = curFreq - 1;

    // 若频率减为0，说明该值已无剩余，从valToFreq中删除（节省空间）
    if (newFreq === 0) {
      this.valToFreq.delete(popVal);
    } else {
      // 频率未归零，更新valToFreq中的频率
      this.valToFreq.set(popVal, newFreq);

      // 【易错点3：绝对禁止的冗余操作】
      // 错误写法：this.stack[newFreq].push(popVal)
      // 错误原因：stack是「入栈历史记录」，而非「当前频率映射」，重新推入会破坏栈顺序
      // 正确逻辑：仅在push时更新stack，pop时绝不修改低频率子栈
    }

    // 返回弹出的原始值
    return popVal;
  }
}
```

## 八、根据字符出现频率排序（LeetCode 451）

### 题目链接

[https://leetcode.cn/problems/sort-characters-by-frequency/](https://leetcode.cn/problems/sort-characters-by-frequency/)

### 题目描述

给定一个字符串 `s`，根据字符出现的频率对其进行降序排序。如果多个字符出现的频率相同，则按照任意顺序排列。

### 示例

输入：`s = "tree"`

输出：`"eetr"` 或 `"eert"`

### 解题思路

频率分层思想（与最大频率栈核心逻辑一致）：

1. 统计字符频率：哈希表记录「字符→频率」；

2. 频率分层：数组索引=频率，值=该频率下的字符列表；

3. 拼接结果：从最高频率到1遍历，按频率重复字符拼接。

### 完整代码

```JavaScript

/**
 * LeetCode 451. 根据字符出现频率排序 - 工程化最优版
 * 核心需求：
 * 1. 将字符串字符按「出现频率从高到低」排序；
 * 2. 频率相同的字符，输出顺序任意；
 * 核心思路（频率分层思想，时间复杂度O(n)，最优解）：
 * 1. 统计频率：Map记录「字符→频率」，O(1)更新/查询频率；
 * 2. 频率分层：数组实现「频率→字符列表」（索引=频率），避免排序的O(nlogn)开销；
 * 3. 拼接结果：从最高频率到1遍历，按频率重复字符拼接，保证高频优先；
 * 工程化优化：
 * - 用for循环替代while循环，规避continue导致的迭代漏更风险；
 */
var frequencySort = function(s) {
  const len = s.length;
  // 【易错点1：边界条件遗漏】
  // 错误示例：忽略len<=1的情况，仍执行后续逻辑（无意义且降低效率）
  // 正确处理：空字符串/单个字符直接返回，无需处理
  if (len <= 1) return s;

  // ========== 步骤1：统计每个字符的出现频率（O(n)） ==========
  const charToFreq = new Map(); // 键：字符，值：字符出现频率
  for (let char of s) {
    // 【易错点2：频率初始化错误】
    // 错误示例：charToFreq.get(char) + 1（未处理char不存在的情况，返回NaN）
    // 正确处理：不存在则默认频率为0，+1后更新
    const newFreq = (charToFreq.get(char) || 0) + 1;
    charToFreq.set(char, newFreq);
  }

  // ========== 步骤2：频率分层存储（O(k)，k为不同字符数，k≤n） ==========
  const freqToCharList = []; // 核心：数组索引=频率，值=该频率下的所有字符
  let mostFreq = 0; // 记录最高频率，避免遍历整个数组（性能优化）
  for (let [char, freq] of charToFreq) {
    // 【易错点3：频率层初始化错误】
    // 错误示例：if (!freqToCharList[freq])（误判空数组为未初始化）
    // 正确处理：判断undefined，仅初始化未定义的频率层
    if (freqToCharList[freq] === undefined) {
      freqToCharList[freq] = [];
    }
    // 将字符推入对应频率层（保证同频率字符集中存储）
    freqToCharList[freq].push(char);
    // 【易错点4：最高频率未更新】
    // 错误示例：未统计mostFreq，后续遍历从数组长度开始（包含空层，效率低）
    // 正确处理：同步更新最高频率，后续仅遍历有效频率
    mostFreq = Math.max(mostFreq, freq);
  }

  // ========== 步骤3：按频率从高到低拼接结果（O(n)） ==========
  let res = '';
  // 【工程化优化：for循环替代while循环】
  // 优势：迭代变量freq的增减写在循环头，continue仅跳过当前轮次，不会漏更（避免无限循环）
  // 错误示例（while版）：continue跳过freq--导致无限循环
  for (let freq = mostFreq; freq > 0; freq--) {
    const charList = freqToCharList[freq];
    // 【易错点5：空频率层处理】
    // 错误示例：直接遍历charList（访问undefined会报错）
    // 正确处理：跳过无字符的频率层，继续下一轮迭代
    if (charList === undefined) continue;

    // 【易错点6：字符重复次数错误】
    // 错误示例：res += char.repeat(1)（重复1次，未按频率重复）
    // 正确处理：重复次数=当前频率，保证高频字符多输出
    for (let char of charList) {
      res += char.repeat(freq);
    }
  }

  return res;
};
```

## 总结

栈作为基础数据结构，核心优势是「后进先出」，在处理「顺序依赖」「回退操作」「分层存储」类问题时具有天然优势。本文覆盖的高频栈类问题可归纳为三类：

1. **基础应用**：路径简化、括号匹配、逆波兰表达式求值（直接利用栈的LIFO特性）；

2. **数据结构模拟**：用队列实现栈、最小栈、最大频率栈（组合栈与其他结构，满足定制化需求）；

3. **分层存储优化**：文件最长路径、字符频率排序（栈+频率分层，降低时间复杂度）。

掌握栈的核心逻辑后，需重点关注「边界条件处理」「空栈保护」「操作顺序」等易错点，同时理解「空间换时间」「时间换空间」的优化思路，才能在面试中灵活应对各类栈相关问题。

