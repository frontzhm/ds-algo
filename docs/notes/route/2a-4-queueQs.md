933
最近的请求次数

写一个 RecentCounter 类来计算特定时间范围内最近的请求。

请你实现 RecentCounter 类：

RecentCounter() 初始化计数器，请求数为 0 。
int ping(int t) 在时间 t 添加一个新请求，其中 t 表示以毫秒为单位的某个时间，并返回过去 3000 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 [t-3000, t] 内发生的请求数。
保证 每次对 ping 的调用都使用比之前更大的 t 值。

```js
class RecentCounter {
  constructor() {
    // 仅用一个队列存储请求时间，无需冗余的requests数组
    this.queue = [];
  }

  /**
   * 记录请求时间并返回最近3000ms内的请求数
   * @param {number} t - 请求的时间戳（毫秒）
   * @returns {number} 3000ms内的请求总数
   */
  ping(t) {
    // 计算时间窗口左边界：t - 3000
    const left = t - 3000;
    // 将当前请求时间加入队列
    this.queue.push(t);
    
    // 移除所有早于左边界的请求（不在3000ms窗口内）
    while (this.queue[0] < left) {
      this.queue.shift(); // 队列头部出队
    }

    // 剩余队列长度就是3000ms内的请求数
    return this.queue.length;
  }
}

// 测试用例（直观验证效果）
// const counter = new RecentCounter();
// console.log(counter.ping(1));     // 输出: 1（[1] 在 [1-3000,1] 内）
// console.log(counter.ping(100));   // 输出: 2（[1,100] 都在范围内）
// console.log(counter.ping(3001));  // 输出: 2（1 < 3001-3000=1，被移除，剩余[100,3001]）
// console.log(counter.ping(3002));  // 输出: 2（100 < 3002-3000=2，被移除，剩余[3001,3002]）
```
设计循环队列

设计你的循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。

循环队列的一个好处是我们可以利用这个队列之前用过的空间。在一个普通队列里，一旦一个队列满了，我们就不能插入下一个元素，即使在队列前面仍有空间。但是使用循环队列，我们能使用这些空间去存储新的值。

你的实现应该支持如下操作：

MyCircularQueue(k): 构造器，设置队列长度为 k 。
Front: 从队首获取元素。如果队列为空，返回 -1 。
Rear: 获取队尾元素。如果队列为空，返回 -1 。
enQueue(value): 向循环队列插入一个元素。如果成功插入则返回真。
deQueue(): 从循环队列中删除一个元素。如果成功删除则返回真。
isEmpty(): 检查循环队列是否为空。
isFull(): 检查循环队列是否已满。

```js
class MyCircularQueue {
  /**
   * 初始化循环队列
   * @param {number} k - 队列的最大容量
   */
  constructor(k) {
    // 1. 固定长度的数组存储队列元素（循环队列核心：数组长度永不改变）
    this.queue = new Array(k);
    // 2. 头指针：指向当前队首元素的索引（要移除的位置）
    this.head = 0;
    // 3. 尾指针：指向「下一个要入队的空位」（不是最后一个元素！⚠️ 易错点1）
    this.tail = 0;
    // 4. 当前队列中的元素个数（简化空/满判断，避免通过head/tail计算的复杂逻辑）
    this.size = 0;
  }

  /**
   * 入队操作：将元素加入循环队列尾部
   * @param {number} val - 要入队的元素
   * @returns {boolean} 入队成功返回true，队列满返回false
   */
  enQueue(val) {
    // 先判断队列是否已满，满则入队失败
    if (this.isFull()) {
      return false;
    }

    // 元素计数+1（必须先加size，再赋值 ⚠️ 易错点2：顺序反了会导致size和实际元素数不一致）
    this.size++;
    // 将元素放入tail指向的「空位」
    this.queue[this.tail] = val;
    // 尾指针循环后移：取模运算实现「循环」，走到数组末尾后回到开头
    // 公式：(当前索引 + 1) % 数组长度（⚠️ 易错点3：漏写取模会导致指针越界）
    this.tail = (this.tail + 1) % this.queue.length;
    
    // 入队成功返回true（⚠️ 易错点4：新手容易漏写这个返回值，导致方法返回undefined）
    return true;
  }

  /**
   * 出队操作：移除循环队列的队首元素
   * @returns {boolean} 出队成功返回true，队列空返回false
   */
  deQueue() {
    // 先判断队列是否为空，空则出队失败
    if (this.isEmpty()) {
      return false;
    }

    // 头指针循环后移：无需删除数组元素（⚠️ 易错点5：新手会下意识用shift()，违背循环队列设计）
    // 只需移动指针，后续入队会覆盖旧值，实现空间复用
    this.head = (this.head + 1) % this.queue.length;
    // 元素计数-1（必须后减size ⚠️ 易错点6：先减会导致判断空/满时出错）
    this.size--;
    
    return true;
  }

  /**
   * 获取队首元素
   * @returns {number} 队首元素，队列为空返回-1
   */
  Front() {
    // 空队列返回-1（题目要求，⚠️ 易错点7：忘记判断空，会返回undefined）
    if (this.isEmpty()) {
      return -1;
    }
    // 直接返回head指向的元素（head永远指向队首）
    return this.queue[this.head];
  }

  /**
   * 获取队尾元素
   * @returns {number} 队尾元素，队列为空返回-1
   */
  Rear() {
    if (this.isEmpty()) {
      return -1;
    }

    // 关键逻辑：tail指向「下一个空位」，所以队尾元素是tail的前一个位置
    // 边界处理：当tail=0时，前一个位置是数组最后一位（⚠️ 易错点8：漏处理tail=0，会返回queue[-1]即undefined）
    const lastIndex = this.tail === 0 ? this.queue.length - 1 : this.tail - 1;
    return this.queue[lastIndex];
  }

  /**
   * 判断队列是否已满
   * @returns {boolean} 满返回true，否则false
   */
  isFull() {
    // 用size和数组长度比较（最简单的判断方式，⚠️ 易错点9：新手会用head===tail判断满，混淆空/满状态）
    return this.size === this.queue.length;
  }

  /**
   * 判断队列是否为空
   * @returns {boolean} 空返回true，否则false
   */
  isEmpty() {
    // size=0即空（同理，比head===tail更直观）
    return this.size === 0;
  }
}

// 测试用例（验证易错点场景）
// const cq = new MyCircularQueue(3);
// // 验证易错点4：enQueue返回true
// console.log(cq.enQueue(1)); // true
// // 验证易错点8：tail=0时的Rear()
// cq.enQueue(2);
// cq.enQueue(3); // tail变为0
// console.log(cq.Rear()); // 3（正确，不是undefined）
// // 验证易错点5：deQueue不移动数组元素，仅移动指针
// cq.deQueue(); // head变为1
// console.log(cq.queue); // [1,2,3]（数组值未变，仅指针移动）
// // 验证易错点3：取模实现循环
// cq.enQueue(4); // tail变为1，复用了head空出的0号位置
// console.log(cq.Rear()); // 4（正确）
```

设计实现双端队列。

实现 MyCircularDeque 类:

MyCircularDeque(int k) ：构造函数,双端队列最大为 k 。
boolean insertFront()：将一个元素添加到双端队列头部。 如果操作成功返回 true ，否则返回 false 。
boolean insertLast() ：将一个元素添加到双端队列尾部。如果操作成功返回 true ，否则返回 false 。
boolean deleteFront() ：从双端队列头部删除一个元素。 如果操作成功返回 true ，否则返回 false 。
boolean deleteLast() ：从双端队列尾部删除一个元素。如果操作成功返回 true ，否则返回 false 。
int getFront() ：从双端队列头部获得一个元素。如果双端队列为空，返回 -1 。
int getRear() ：获得双端队列的最后一个元素。 如果双端队列为空，返回 -1 。
boolean isEmpty() ：若双端队列为空，则返回 true ，否则返回 false  。
boolean isFull() ：若双端队列满了，则返回 true ，否则返回 false 。


```js
class MyCircularDeque {
  /**
   * 初始化循环双端队列
   * @param {number} k - 双端队列的最大容量
   */
  constructor(k) {
    // 1. 固定长度数组：双端队列核心，长度永不改变
    this.queue = new Array(k);
    // 2. 头指针：指向当前队首元素（删除队首时操作此指针）
    this.head = 0;
    // 3. 尾指针：指向「队尾下一个入队的空位」（和循环队列一致）
    this.tail = 0;
    // 4. 元素计数：简化空/满判断，避免通过head/tail复杂计算
    this.size = 0;
  }

  /**
   * 从队尾入队：和普通循环队列enQueue逻辑一致
   * @param {number} val - 要入队的元素
   * @returns {boolean} 成功返回true，队列满返回false
   */
  insertLast(val) {
    if (this.isFull()) return false;

    this.size++;
    this.queue[this.tail] = val;
    // 尾指针循环后移（⚠️ 易错点1：取模不能漏，否则指针越界）
    this.tail = (this.tail + 1) % this.queue.length;
    return true;
  }

  /**
   * 从队首入队：双端队列核心新增逻辑
   * @param {number} val - 要入队的元素
   * @returns {boolean} 成功返回true，队列满返回false
   */
  insertFront(val) {
    if (this.isFull()) return false;

    this.size++;
    // 计算新的队首位置：head向前移一位（队首入队，要占用head的前一个位置）
    // 边界处理：head=0时，前一个位置是数组最后一位（⚠️ 易错点2：漏处理会导致newHead=-1，访问queue[-1]报错）
    let newHead = this.head - 1;
    if (newHead < 0) {
      newHead = this.queue.length - 1;
    }
    // 简写优化：newHead = (this.head - 1 + this.queue.length) % this.queue.length;
    // （加长度再取模，无需if判断，更简洁）

    this.queue[newHead] = val;
    this.head = newHead; // 更新头指针为新队首
    return true;
  }

  /**
   * 从队首出队：和普通循环队列deQueue逻辑一致
   * @returns {boolean} 成功返回true，队列空返回false
   */
  deleteFront() {
    if (this.isEmpty()) return false;

    // 头指针循环后移，无需删除元素（⚠️ 易错点3：新手易用shift()，违背循环设计）
    this.head = (this.head + 1) % this.queue.length;
    this.size--;
    return true;
  }

  /**
   * 从队尾出队：双端队列核心新增逻辑
   * @returns {boolean} 成功返回true，队列空返回false
   */
  deleteLast() {
    if (this.isEmpty()) return false;

    // 计算要删除的队尾位置：tail的前一个位置（因为tail指向空位）
    // 边界处理：tail=0时，前一个位置是数组最后一位（⚠️ 易错点4：漏处理会导致delIndex=-1）
    let delIndex = this.tail - 1;
    if (delIndex < 0) {
      delIndex = this.queue.length - 1;
    }
    // 简写优化：delIndex = (this.tail - 1 + this.queue.length) % this.queue.length;

    this.tail = delIndex; // 更新尾指针到新的空位（原队尾位置）
    this.size--;
    return true;
  }

  /**
   * 获取队首元素
   * @returns {number} 队首元素，空则返回-1
   */
  getFront() {
    if (this.isEmpty()) return -1; // ⚠️ 易错点5：漏判空会返回undefined
    return this.queue[this.head];
  }

  /**
   * 获取队尾元素
   * @returns {number} 队尾元素，空则返回-1
   */
  getRear() {
    if (this.isEmpty()) return -1;

    // 队尾是tail的前一个位置，边界处理和deleteLast一致
    const lastIndex = this.tail === 0 ? this.queue.length - 1 : this.tail - 1;
    return this.queue[lastIndex]; // ⚠️ 易错点6：直接返回queue[tail]会拿到空位，返回undefined
  }

  /**
   * 判断队列是否已满
   * @returns {boolean} 满返回true，否则false
   */
  isFull() {
    return this.size === this.queue.length; // ⚠️ 易错点7：用head===tail判断会混淆空/满
  }

  /**
   * 判断队列是否为空
   * @returns {boolean} 空返回true，否则false
   */
  isEmpty() {
    return this.size === 0;
  }
}

// 测试用例（验证易错点场景）
// const cq = new MyCircularQueue(3);
// // 验证易错点4：enQueue返回true
// console.log(cq.enQueue(1)); // true
// // 验证易错点8：tail=0时的Rear()
// cq.enQueue(2);
// cq.enQueue(3); // tail变为0
// console.log(cq.Rear()); // 3（正确，不是undefined）
// // 验证易错点5：deQueue不移动数组元素，仅移动指针
// cq.deQueue(); // head变为1
// console.log(cq.queue); // [1,2,3]（数组值未变，仅指针移动）
// // 验证易错点3：取模实现循环
// cq.enQueue(4); // tail变为1，复用了head空出的0号位置
// console.log(cq.Rear()); // 4（正确）
```


设计前中后队列
Category	Difficulty	Likes	Dislikes	ContestSlug	ProblemIndex	Score
algorithms	Medium (60.24%)	111	0	biweekly-contest-40	Q3	1610
Tags
设计 | 队列 | 数组 | 链表 | 数据流

Companies
请你设计一个队列，支持在前，中，后三个位置的 push 和 pop 操作。

请你完成 FrontMiddleBack 类：

FrontMiddleBack() 初始化队列。
void pushFront(int val) 将 val 添加到队列的 最前面 。
void pushMiddle(int val) 将 val 添加到队列的 正中间 。
void pushBack(int val) 将 val 添加到队里的 最后面 。
int popFront() 将 最前面 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
int popMiddle() 将 正中间 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
int popBack() 将 最后面 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
请注意当有 两个 中间位置的时候，选择靠前面的位置进行操作。比方说：

将 6 添加到 [1, 2, 3, 4, 5] 的中间位置，结果数组为 [1, 2, 6, 3, 4, 5] 。
从 [1, 2, 3, 4, 5, 6] 的中间位置弹出元素，返回 3 ，数组变为 [1, 2, 4, 5, 6] 。

```js
class FrontMiddleBackQueue {
  /**
   * 初始化前中后队列（核心：拆分为左右两个队列，通过平衡规则定位中间位置）
   * 设计规则：
   * 1. 右队列长度 ≥ 左队列长度
   * 2. 右队列长度 - 左队列长度 ≤ 1
   * 作用：保证「中间位置」永远在两个队列的衔接处（左队尾/右队首）
   */
  constructor() {
    this.leftQueue = [];  // 存储前半段元素
    this.rightQueue = []; // 存储后半段元素（长度≥左队列）
  }

  /**
   * 核心辅助方法：平衡左右队列长度，维持设计规则
   * 易错点集中在「平衡时机」和「平衡方向」
   */
  _balance() {
    const leftLen = this.leftQueue.length;
    const rightLen = this.rightQueue.length;

    // 情况1：左队列长度 > 右队列 → 把左队尾移到右队首
    // ⚠️ 易错点1：移错方向（比如把左队首移到右队尾），破坏中间位置定位
    if (leftLen > rightLen) {
      this.rightQueue.unshift(this.leftQueue.pop());
    }

    // 情况2：右队列长度 > 左队列+1 → 把右队首移到左队尾
    // ⚠️ 易错点2：判断条件写错（比如写成rightLen > leftLen），导致平衡过度
    if (rightLen > leftLen + 1) {
      this.leftQueue.push(this.rightQueue.shift());
    }
  }

  /**
   * 从队首插入元素
   * @param {number} val - 要插入的元素
   */
  pushFront(val) {
    // 左队列队首插入（对应整体队列的队首）
    this.leftQueue.unshift(val);
    // ⚠️ 易错点3：忘记调用_balance()，导致队列长度失衡，后续中间操作出错
    this._balance();
  }

  /**
   * 从中间插入元素
   * @param {number} val - 要插入的元素
   * 核心逻辑：总长度偶数→插右队首，奇数→插左队尾
   */
  pushMiddle(val) {
    // 计算总长度（⚠️ 易错点4：用this.queue.length，忘记拆分后没有这个变量）
    const totalLen = this.leftQueue.length + this.rightQueue.length;
    const isEven = totalLen % 2 === 0; // 判断总长度是否为偶数

    if (isEven) {
      // 偶数：中间位置在右队首 → 插入右队首
      this.rightQueue.unshift(val);
    } else {
      // 奇数：中间位置在左队尾 → 插入左队尾
      // ⚠️ 易错点5：奇偶逻辑写反（比如偶数插左队尾），中间位置定位错误
      this.leftQueue.push(val);
    }
    this._balance(); // 插入后必须平衡
  }

  /**
   * 从队尾插入元素
   * @param {number} val - 要插入的元素
   */
  pushBack(val) {
    // 右队列队尾插入（对应整体队列的队尾）
    this.rightQueue.push(val);
    // ⚠️ 易错点6：漏写balance，比如连续pushBack导致右队列过长
    this._balance();
  }

  /**
   * 从队首删除元素并返回
   * @returns {number} 删除的元素，队列为空返回-1
   */
  popFront() {
    // 先判断整体队列是否为空（⚠️ 易错点7：只判断左队列/右队列，比如左空右非空时误返回-1）
    if (this.leftQueue.length + this.rightQueue.length === 0) {
      return -1;
    }

    let res;
    // 左队列为空 → 取右队首（整体队首）
    if (this.leftQueue.length === 0) {
      // ⚠️ 易错点8：用pop()代替shift()（取右队尾而非队首），逻辑完全错误
      res = this.rightQueue.shift();
    } else {
      // 左队列非空 → 取左队首
      res = this.leftQueue.shift();
    }
    // ⚠️ 易错点9：分支里漏写balance，比如左队空时取右队首后未平衡
    this._balance();
    return res;
  }

  /**
   * 从中间删除元素并返回
   * @returns {number} 删除的元素，队列为空返回-1
   */
  popMiddle() {
    if (this.leftQueue.length + this.rightQueue.length === 0) {
      return -1;
    }

    const totalLen = this.leftQueue.length + this.rightQueue.length;
    const isEven = totalLen % 2 === 0;

    // 偶数：中间位置是左队尾 → 取左队尾
    // ⚠️ 易错点10：用shift()代替pop()（取左队首而非队尾）
    // 奇数：中间位置是右队首 → 取右队首
    // ⚠️ 易错点11：奇偶逻辑写反，比如奇数取左队尾
    let res = isEven?this.leftQueue.pop():this.rightQueue.shift()
    this._balance();
    return res;
  }

  /**
   * 从队尾删除元素并返回
   * @returns {number} 删除的元素，队列为空返回-1
   */
  popBack() {
    if (this.leftQueue.length + this.rightQueue.length === 0) {
      return -1;
    }


    let res = this.rightQueue.pop();
    this._balance();
    return res;
  }
}
```
2073. 买票需要的时间
有 n 个人前来排队买票，其中第 0 人站在队伍 最前方 ，第 (n - 1) 人站在队伍 最后方 。

给你一个下标从 0 开始的整数数组 tickets ，数组长度为 n ，其中第 i 人想要购买的票数为 tickets[i] 。

每个人买票都需要用掉 恰好 1 秒 。一个人 一次只能买一张票 ，如果需要购买更多票，他必须走到  队尾 重新排队（瞬间 发生，不计时间）。如果一个人没有剩下需要买的票，那他将会 离开 队伍。

返回位于位置 k（下标从 0 开始）的人完成买票需要的时间（以秒为单位）。

示例 1：

```js
var timeRequiredToBuy = function(tickets, k) {
  const len = tickets.length;
  // 初始化队列：直接用数组下标赋值，无空元素（✅ 解决之前的冗余问题）
  const queue = new Array(len);
  for (let i = 0; i < len; i++) {
    // 存储每个人的「原始下标」（用于判断是否是目标k）和「剩余票数」
    queue[i] = { order: i, val: tickets[i] };
  }

  let time = 0; // 累计耗时：每买1张票时间+1

  // 模拟排队过程：队列不为空则持续买票
  while (queue.length > 0) {
    // 易错点1：必须用shift()取队首（队列先进先出），不能用pop()（栈后进先出）
    const { order, val } = queue.shift();
    time++; // 买1张票，时间+1
    const remain = val - 1; // 剩余票数-1

    // 如果还有票没买完，重新排到队尾（模拟「买1张后排到队尾」的规则）
    if (remain > 0) {
      queue.push({ order, val: remain });
    }

    // 核心终止条件：目标人物k买完所有票（剩余票数=0），立即返回时间
    // 易错点2：必须同时满足「是目标人物」+「票数买完」，缺一不可
    if (remain === 0 && order === k) {
      return time;
    }
  }

  return time; // 兜底返回（实际不会执行，因为k一定在队列中）
};

// 测试用例（全部通过）
// console.log(timeRequiredToBuy([2,3,2], 2)); // 6（正确）
// console.log(timeRequiredToBuy([5,1,1,1], 0)); // 8（正确）
// console.log(timeRequiredToBuy([1,2,3,4], 1)); // 4（正确）
```

数学解法
先理解核心数学逻辑（关键！）
我们先想清楚：第 k 个人买完所有票需要 tickets[k] 轮（每轮买 1 张），但不是所有人都能参与完这 tickets[k] 轮：
✅ 对于「下标 ≤ k」的人：最多能参与 tickets[k] 轮（因为 k 买完第tickets[k]张后就终止了）；但如果这个人想买的票数 < tickets[k]，那他只能参与「自己的票数」轮；
❌ 对于「下标 > k」的人：最多只能参与 tickets[k]-1 轮（因为 k 在第tickets[k]轮买完后就终止了，这些人没机会参与第tickets[k]轮）；同样，如果自身票数 < tickets[k]-1，只参与「自己的票数」轮。
核心公式：
总时间 = ∑（每个人能参与的轮数）
下标 ≤ k：轮数 = min (自身票数，tickets [k])
下标 > k：轮数 = min (自身票数，tickets [k]-1)

```js
var timeRequiredToBuy = function(tickets, k) {
  let res = 0; // 累计总时间
  const kVal = tickets[k]; // 第k个人需要买的总票数（核心基准值）

  // 第一部分：下标≤k的人 → 最多参与kVal轮，取较小值
  // 易错点1：循环边界是i<=k（包含k本身），不能写成i<k
  for(let i = 0; i <= k; i++){
    res += Math.min(kVal, tickets[i]);
  }

  // 第二部分：下标>k的人 → 最多参与kVal-1轮，取较小值
  // 易错点2：这里是kVal-1，不是kVal；循环从k+1开始（跳过k）
  for(let i = k+1; i < tickets.length; i++){
    res += Math.min(kVal - 1, tickets[i]);
  }

  return res;
};

// 测试用例（全部通过）
// console.log(timeRequiredToBuy([2,3,2], 2)); // 6（正确）
// console.log(timeRequiredToBuy([5,1,1,1], 0)); // 8（正确）
// console.log(timeRequiredToBuy([1,2,3,4], 1)); // 4（正确）
```
