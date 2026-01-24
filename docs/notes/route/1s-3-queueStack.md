[队列和栈](https://labuladong.online/zh/algo/data-structure-basic/queue-stack-basic/)

数组和链表，增删查改的 API 都实现过了，你可以对任意一个索引元素进行增删查改，只要索引不越界，就随便你。

但是对于队列和栈，它们的操作是受限的：队列只能在一端插入元素，另一端删除元素；栈只能在某一端插入和删除元素。说白了就是把数组链表提供的 API 删掉了一部分，只保留头尾操作元素的 API 给你用。实际上它们底层都是数组和链表实现的

用栈实现队列

```js
/**
 * 栈类（基础工具类）- ES6 Class 版本
 * 封装栈的核心操作：push/pop/peek/isEmpty/size
 * 注意：栈是后进先出（LIFO）结构，队列是先进先出（FIFO），用两个栈可模拟队列
 */
class MyStack {
  constructor() {
    this.arr = []; // 底层存储数组
    // 【易错点1】无需单独维护size变量！
    // 原因：数组length属性可实时反映栈的大小，单独维护易出现同步错误（比如push后忘更size）
    // this.size = 0; // 废弃：删除冗余的size变量
  }

  /**
   * 获取栈的元素个数
   * @return {number} 栈的大小
   */
  size() {
    return this.arr.length; // 直接返回数组长度，无需额外维护
  }

  /**
   * 入栈：向栈顶添加元素
   * @param {number} val 要入栈的元素
   */
  push(val) {
    this.arr.push(val);
    // 若非要维护size，需在这里同步更新：this.size++
  }

  /**
   * 出栈：移除并返回栈顶元素
   * @return {number|undefined} 栈顶元素（空栈返回undefined）
   */
  pop() {
    const val = this.arr.pop();
    // 若维护size，需同步更新：if(val !== undefined) this.size--
    return val;
  }

  /**
   * 查看栈顶元素（不移除）
   * @return {number|undefined} 栈顶元素（空栈返回undefined）
   */
  peek() {
    // 空栈时直接返回undefined，避免数组越界
    if (this.isEmpty()) return undefined;
    return this.arr[this.arr.length - 1];
  }

  /**
   * 判断栈是否为空
   * @return {boolean} 空返回true，非空返回false
   */
  isEmpty() {
    // 【易错点2】原错误：return this.length === 0
    // 正确写法：判断底层数组的length，而非this（栈实例）的length
    return this.arr.length === 0;
  }
}

/**
 * 队列类（用两个栈实现）- ES6 Class 版本
 * 核心逻辑：inStack负责入队，outStack负责出队；outStack空时，将inStack元素倒序移入outStack
 * 时间复杂度：push/empty为O(1)，pop/peek均摊O(1)（每个元素仅入栈/出栈两次）
 */
class MyQueue {
  constructor() {
    this.inStack = new MyStack(); // 入队栈：所有新元素先进入这个栈
    this.outStack = new MyStack(); // 出队栈：所有出队操作从这个栈取
  }

  /**
   * 入队：向队列尾部添加元素
   * @param {number} x 要入队的元素
   * @return {void}
   */
  push(x) {
    // 入队仅需向inStack添加元素，无需处理outStack
    this.inStack.push(x);
  }

  /**
   * 出队：移除并返回队列头部元素
   * @return {number} 队列头部元素（空队列返回-1，符合力扣题目习惯）
   */
  pop() {
    // 空队列返回-1
    if (this.empty()) {
      return -1;
    }

    // 【核心逻辑】outStack为空时，将inStack所有元素倒序移入outStack
    // 此时outStack的栈顶就是队列的头部元素（先进先出）
    this.transfer();

    // 从outStack出栈，即队列的出队操作
    return this.outStack.pop();
  }

  /**
   * 查看队列头部元素（不移除）
   * @return {number} 队列头部元素（空队列返回-1）
   */
  peek() {
    // 空队列返回-1
    if (this.empty()) {
      return -1;
    }

    // 核心逻辑：保证outStack有元素，才能取队首
    this.transfer();

    // 查看outStack栈顶，即队列的头部元素
    return this.outStack.peek();
  }

  /**
   * 判断队列是否为空
   * @return {boolean} 空返回true，非空返回false
   */
  empty() {
    // 【核心】队列空的条件：入队栈和出队栈都为空
    return this.inStack.isEmpty() && this.outStack.isEmpty();
  }

  /**
   * 私有辅助方法：将inStack元素倒序移入outStack（仅当outStack为空时调用）
   * 注意：该方法仅内部使用，无需对外暴露
   */
  transfer() {
    if (this.outStack.isEmpty()) {
      // 循环将inStack的元素弹出，压入outStack，实现倒序
      while (!this.inStack.isEmpty()) {
        this.outStack.push(this.inStack.pop());
      }
    }
  }
}

// ====================== 测试用例（可直接运行验证） ======================
// const queue = new MyQueue();
// console.log("push(1) →", queue.push(1));  // undefined（push无返回值）
// console.log("push(2) →", queue.push(2));  // undefined
// console.log("peek() →", queue.peek());    // 1（队首是第一个入队的1）
// console.log("pop() →", queue.pop());      // 1（出队第一个元素）
// console.log("empty() →", queue.empty());  // false（还有元素2）
// console.log("pop() →", queue.pop());      // 2（出队第二个元素）
// console.log("empty() →", queue.empty());  // true（队列为空）
// console.log("pop() →", queue.pop());      // -1（空队列返回-1）
// console.log("peek() →", queue.peek());    // -1（空队列返回-1）
```


队列实现栈，

```js
/**
 * 基础队列类：封装队列核心操作（先进先出）
 */
class MyQueue {
  constructor() {
    this.elements = []; // 存储队列元素的数组
  }

  // 向队尾添加元素
  enqueue(value) {
    this.elements.push(value);
  }

  // 从队首移除并返回元素
  dequeue() {
    return this.elements.shift();
  }

  // 判断队列是否为空
  isEmpty() {
    return this.elements.length === 0;
  }

  // 获取队列元素个数
  getSize() {
    return this.elements.length;
  }
}

/**
 * 栈类（仅用两个队列实现，满足题目LIFO要求）
 * 核心逻辑：
 * 1. 始终保持一个队列为空，另一个存储所有栈元素；
 * 2. push：新元素加入非空队列（保证队尾=栈顶）；
 * 3. pop/top：非空队列元素转移到空队列，保留最后一个元素作为栈顶；
 * 4. empty：两个队列都为空则栈空。
 */
class MyStack {
  constructor() {
    this.queue1 = new MyQueue(); // 队列1
    this.queue2 = new MyQueue(); // 队列2
  }

  /**
   * 将元素 x 压入栈顶
   * @param {number} x 要压入的元素
   * @return {void}
   */
  push(x) {
    // 新元素优先加入非空队列（都空则加入queue1），保证新元素在队尾（栈顶）
    if (!this.queue1.isEmpty()) {
      this.queue1.enqueue(x);
    } else {
      this.queue2.enqueue(x);
    }
  }

  /**
   * 移除并返回栈顶元素
   * @return {number} 栈顶元素
   */
  pop() {
    // 找到存储元素的队列（sourceQueue）和空队列（targetQueue）
    let sourceQueue, targetQueue;
    if (!this.queue1.isEmpty()) {
      sourceQueue = this.queue1;
      targetQueue = this.queue2;
    } else {
      sourceQueue = this.queue2;
      targetQueue = this.queue1;
    }

    // 转移sourceQueue中除最后一个元素外的所有元素到targetQueue
    while (sourceQueue.getSize() > 1) {
      targetQueue.enqueue(sourceQueue.dequeue());
    }

    // 移除并返回最后一个元素（栈顶）
    return sourceQueue.dequeue();
  }

  /**
   * 返回栈顶元素（不移除）
   * @return {number} 栈顶元素
   */
  top() {
    // 技巧：先pop拿到栈顶，再push回栈（保证栈结构不变）
    const topVal = this.pop();
    this.push(topVal);
    return topVal;
  }

  /**
   * 判断栈是否为空
   * @return {boolean} 空返回true，非空返回false
   */
  empty() {
    return this.queue1.isEmpty() && this.queue2.isEmpty();
  }
}

/**
 * 测试用例（验证所有功能）
 */
// const stack = new MyStack();
// stack.push(1);
// stack.push(2);
// console.log(stack.top());    // 预期输出：2
// console.log(stack.pop());    // 预期输出：2
// console.log(stack.empty());  // 预期输出：false
// console.log(stack.top());    // 预期输出：1
// console.log(stack.pop());    // 预期输出：1
// console.log(stack.empty());  // 预期输出：true
// console.log(stack.pop());    // 预期输出：undefined（空队列dequeue返回undefined，符合JS特性）
```
