# 吃透JavaScript核心：call/apply/bind、new与继承全解析

在JavaScript的学习和开发中，`call/apply/bind`、`new` 运算符以及原型链继承是贯穿始终的核心知识点，它们不仅是面试高频考点，更是理解JS**原型机制**和**this绑定规则**的关键。本文将从底层原理出发，手把手实现`call/apply/bind`和`new`，并深入解析JS中多种继承方式的优劣，最终聚焦**寄生组合式继承**——这一ES6`class extends`的底层实现方案，帮你彻底打通JS核心知识的任督二脉。

在开始前，先明确一个基础知识点：JS中**原始值**直接存储在栈内存，**引用值**在栈内存存储指针地址，实际数据存于堆内存，这一特性是理解`this`绑定、引用类型属性继承的基础。

---

## 🧠 核心知识思维导图

![call_apply_bind_new](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/call_apply_bind_new.png)

<!-- ```mermaid
## **一、call / apply / bind**
- 核心作用：显式改变函数 this 指向
- call
  - 特点：立即执行，逐个传参
  - 实现：挂载→执行→删除
- apply
  - 特点：立即执行，数组传参
  - 实现：同 call，仅参数不同
- bind
  - 特点：返回新函数，永久绑定 this
  - 支持：柯里化、new 调用兼容
  - 实现：返回函数 + new.target 判断
- 三者区别
  - 执行时机：call/apply 立即，bind 延迟
  - 参数形式：call 逐个，apply 数组，bind 柯里化
## **二、new 运算符**
- 核心作用：通过构造函数创建实例
- 执行四步
  - 创建空对象
  - 链接原型（__proto__ → 构造函数 prototype）
  - 绑定 this 并执行构造函数
  - 返回规则（引用类型则返回，否则返回新对象）
- 手动实现 myNew
  - Object.create 建立原型
  - Fn.call 绑定 this
  - 判断返回值
## **三、JS 继承体系**
- 组合继承（构造函数 + 原型链）
  - 优点：属性隔离、方法复用
  - 缺点：父类构造函数调用两次
- 寄生组合式继承（最优）
  - 优化：用 Object.create 继承父类原型
  - 优点：只调用一次父类构造，无冗余属性
  - 地位：ES6 class extends 底层实现
- ES6 class / extends
  - 语法糖，底层仍是寄生组合式继承
  - super 等价于 Parent.call(this, ...)
## **四、底层核心串联**
- this 绑定
  - 显式绑定：call / apply / bind
  - 构造绑定：new
- 原型机制
  - 实例 __proto__ → 构造函数 prototype
  - 原型链查找：自身 → 原型 → 上层原型
- 继承本质
  - 属性隔离靠构造函数（call）
  - 方法复用靠原型链
``` -->

## 一、手撕call/apply/bind：掌握this绑定的本质

`call`、`apply`、`bind`的核心作用是**显式改变函数执行时的this指向**，三者原理相通，仅在参数传递和执行时机上有差异。实现它们的核心思路是：**利用「对象的方法执行时，this指向该对象」的规则，将函数临时挂载到目标对象上执行**。

### 1. 实现Function.prototype.call

`call`的特点是**立即执行函数**，参数以**逐个传参**的形式传递，核心实现需处理`context`边界、避免污染目标对象、正确传递参数并返回执行结果。

```JavaScript

Function.prototype.call = function (context, ...args) {
  // 边界处理：context为null/undefined时，指向全局对象（兼容浏览器/Node.js）
  const ctx = context == null ? globalThis : context;
  // 保存当前调用call的原函数（this指向原函数，因call是函数的方法）
  const fn = this;
  // 生成唯一Symbol属性名，避免覆盖context原有属性
  const uniqueKey = Symbol();
  // 将原函数临时挂载到目标对象上
  ctx[uniqueKey] = fn;
  // 调用函数：此时函数内this指向ctx，同时展开参数执行
  const result = ctx[uniqueKey](...args);
  // 删除临时属性，避免污染目标对象
  delete ctx[uniqueKey];
  // 返回函数执行结果，与原生行为一致
  return result;
};
```

**核心原理**：通过`Symbol`生成唯一属性，将原函数挂载到目标`context`，调用后立即清理，既实现了this绑定，又保证了目标对象的纯净性。

### 2. 实现Function.prototype.apply

`apply`与`call`的唯一区别是**参数传递形式**：`apply`的第二个参数是**数组/类数组**，其余逻辑完全一致。

```JavaScript

Function.prototype.apply = function (context, argsArr = []) {
  const ctx = context == null ? globalThis : context;
  const fn = this;
  const uniqueKey = Symbol();
  ctx[uniqueKey] = fn;
  // 直接展开数组参数，与call的核心差异
  const result = ctx[uniqueKey](...argsArr);
  delete ctx[uniqueKey];
  return result;
};
```

**使用场景**：当参数是数组或类数组（如`arguments`）时，使用`apply`更便捷，无需手动展开。

### 3. 实现Function.prototype.bind

`bind`的特性比前两者更复杂：**延迟执行**（返回新函数）、**永久绑定this**、**支持柯里化传参**（分多次传参）、**兼容构造函数场景**（new调用时绑定的this失效）。实现的关键是返回新函数，并通过`new.target`判断是否为构造函数调用。

```JavaScript

Function.prototype.bind = function (context, ...partArgs = []) {
  const ctx = context == null ? globalThis : context;
  const fn = this; // 保存原函数，避免后续this指向改变

  // 定义返回的绑定函数，支持new调用
  function boundFn(...otherPartArgs) {
    // 合并柯里化参数：bind时的预置参数 + 调用时的后续参数
    const allArgs = [...partArgs, ...otherPartArgs];
    // 判断是否为构造函数场景（new调用）
    if (new.target) {
      // new调用时，绑定的ctx失效，this指向新实例，直接执行原函数
      return new fn(...allArgs);
    }
    // 普通调用，复用call永久绑定this
    return fn.call(ctx, ...allArgs);
  }

  // 可选补充：100%原生原型兼容，让绑定函数继承原函数原型
  boundFn.prototype = Object.create(fn.prototype);
  boundFn.prototype.constructor = fn;

  return boundFn;
};
```

**核心亮点**：

- 柯里化传参：合并`bind`时和调用时的参数，支持分多次传递；

- 构造函数兼容：通过`new.target`判断，保证`new`调用时的原生行为；

- 原型继承：通过`Object.create`实现原型链继承，避免污染原函数原型。

### 4. call/apply/bind核心区别

|方法|执行时机|返回值|参数传递|核心特性|
|---|---|---|---|---|
|call|立即执行|函数执行结果|逐个传参（逗号分隔）|临时绑定this，一次生效|
|apply|立即执行|函数执行结果|数组/类数组传参|临时绑定this，一次生效|
|bind|延迟执行|永久绑定this的新函数|柯里化传参（分多次）|永久绑定this，多次生效|
**记忆口诀**：立即执行用`call/apply`（区别在参数形式），延迟执行且永久绑定用`bind`。

## 二、手撕new：理解构造函数的执行本质

`new`运算符用于通过**构造函数创建实例对象**，其执行过程有严格的规则，掌握`new`的实现，能彻底理解构造函数与实例的原型关系。

### 1. new的四个核心作用（按执行顺序）

很多资料总结为三个，实际完整的执行逻辑包含四个关键步骤（含隐含的返回规则）：

1. 创建一个**空的新对象**（后续成为构造函数的实例）；

2. 将新对象的`__proto__`**指向构造函数的** **`prototype`**（实现原型继承）；

3. 将构造函数的`this`**绑定到新对象**并执行（构造函数内的`this.xxx`挂载到新对象）；

4. **返回规则**：若构造函数返回**非null的引用类型**（对象/数组/函数），则返回该值，否则返回新创建的对象。

### 2. 实现自定义myNew

基于上述规则，实现一个与原生`new`行为完全一致的`myNew`，仅需3行核心逻辑：

```JavaScript

function myNew(Fn, ...args) {
  // 1. 创建空对象，同时将__proto__指向构造函数prototype（一步完成原型关联）
  const obj = Object.create(Fn.prototype);
  // 2. 绑定this到新对象，执行构造函数并传递参数
  const res = Fn.call(obj, ...args);
  // 3. 执行返回规则：排除null（因typeof null === 'object'是JS历史bug）
  return typeof res === 'object' && res !== null ? res : obj;
}
```

**核心优化**：使用`Object.create(Fn.prototype)`替代`{}`+手动设置`__proto__`，更符合ES规范，语义更清晰（专门用于原型式创建对象）。

### 3. 测试myNew与原生new的一致性

定义构造函数，分别用原生`new`和自定义`myNew`创建实例，验证结果完全一致：

```JavaScript

function Person (name, age) {
  this.name = name;
  this.age = age;
  this.habit = 'Games';
}
// 原型挂载属性和方法（测试原型继承）
Person.prototype.strength = 80;
Person.prototype.sayYourName = function () {
  console.log('I am ' + this.name);
};

// 原生new创建实例
var person1 = new Person('Kevin', '18');
// 自定义myNew创建实例
var person2 = myNew(Person, 'Tom', '20');

console.log(person1.name); // Kevin，实例属性正常
console.log(person2.strength); // 80，原型属性继承正常
person1.sayYourName(); // I am Kevin，原型方法调用正常
person2.sayYourName(); // I am Tom，与原生行为完全一致
```

## 三、JS继承全解析：从组合继承到寄生组合式继承

JS是基于**原型链**实现继承的，早期有原型链继承、构造函数继承等单一方式，但均存在明显缺陷。**组合继承**结合了两者的优点，成为ES6前的常用方案，而**寄生组合式继承**则是组合继承的完美优化版，也是ES6`class extends`的底层实现。

在讲解继承前，先补充一个核心知识点：**arguments**——函数内部的类数组属性，`arguments.length`表示实际传参个数，`arguments.callee`指向当前执行的函数本身（ES6中可被`new.target`替代，更规范）。

### 1. 组合继承：构造函数+原型链继承（ES6前常用）

组合继承的核心是**两步走**：用**构造函数继承**实现**实例属性隔离**（解决引用类型共享问题），用**原型链继承**实现**原型方法复用**（节省内存）。

```JavaScript

function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green']; // 引用类型属性
}
Parent.prototype.getName = function () { // 原型方法，实现复用
  console.log(this.name);
};

function Child (name, age) {
  // 第一步：构造函数继承，绑定this并传参，实现实例属性独立
  Parent.call(this, name);
  this.age = age;
}
// 第二步：原型链继承，让子类原型继承父类实例，实现方法复用
Child.prototype = new Parent();
// 修正constructor指向：重写原型后，constructor会指向Parent，需手动修正
Child.prototype.constructor = Child;

// 测试
var child1 = new Child('kevin', '18');
child1.colors.push('black');
console.log(child1.colors); // ["red", "blue", "green", "black"]
var child2 = new Child('daisy', '20');
console.log(child2.colors); // ["red", "blue", "green"]（引用类型属性独立）
child2.getName(); // daisy（原型方法复用正常）
```

**组合继承的优势**：

- ✅ 实例属性独立（包括引用类型），修改一个实例的属性不会影响其他实例；

- ✅ 原型方法复用，所有子类实例共享父类原型方法，节省内存；

- ✅ 支持子类向父类传参，灵活初始化实例属性。

**组合继承的缺陷**：**父类构造函数被调用两次**——一次是`Parent.call(this)`（必要），一次是`new Parent()`（构建原型链时，无实际业务意义），导致子类原型上挂载了多余的父类实例属性（会被实例自身属性屏蔽，不影响功能，但存在轻微内存浪费）。

### 2. 寄生组合式继承：完美优化版（ES6 extends底层实现）

寄生组合式继承的核心优化是：**用「空对象继承父类原型」替代「创建父类实例」**，彻底避免父类构造函数的第二次调用，同时保留组合继承的所有优点。仅需修改原型链继承的一行代码，即可实现完美优化。

```JavaScript

function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child (name, age) {
  Parent.call(this, name); // 仅一次调用父类构造函数（必要）
  this.age = age;
}

// 优化核心：用Object.create继承父类原型，不创建父类实例，避免第二次调用Parent
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; // 保留constructor修正

// 测试：功能与组合继承完全一致，且父类构造函数仅调用一次
var child1 = new Child('kevin', '18');
child1.colors.push('black');
console.log(child1.colors); // ["red", "blue", "green", "black"]
var child2 = new Child('daisy', '20');
console.log(child2.colors); // ["red", "blue", "green"]
child2.getName(); // daisy
```

**优化逻辑说明**：

- `Object.create(Parent.prototype)`：创建一个空对象，其`__proto__`直接指向`Parent.prototype`，无需创建父类实例，因此不会调用父类构造函数；

- 原型链更简洁：`child.__proto__ → Child.prototype（空对象） → Parent.prototype → Object.prototype → null`，无多余属性；

- 完全兼容：保留组合继承的所有优势，同时解决了两次调用的缺陷，是**ES5中最完美的继承方案**。

### 3. ES6 class extends：寄生组合式继承的语法糖

ES6引入的`class`和`extends`让继承更简洁、更符合面向对象语法，但它并非全新的继承机制，**底层依然是寄生组合式继承**。上述寄生组合式继承的代码，用ES6改写后如下：

```JavaScript

// 父类
class Parent {
  constructor(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
  }
  // 原型方法，自动挂载到Parent.prototype
  getName() {
    console.log(this.name);
  }
}

// 子类继承父类，底层是寄生组合式继承
class Child extends Parent {
  constructor(name, age) {
    super(name); // 等价于 Parent.call(this, name)，必须在this前执行
    this.age = age;
  }
}

// 测试：与ES5寄生组合式继承行为完全一致
const child = new Child('kevin', 18);
child.getName(); // kevin
console.log(child.colors); // ["red", "blue", "green"]
```

**关键点**：`super`关键字在构造函数中表示父类的构造函数，等价于ES5中的`Parent.call(this, name)`，且必须在`this`关键字前执行。

## 四、核心知识点串联总结

本文讲解的`call/apply/bind`、`new`和继承并非孤立的知识点，而是相互关联、层层递进的，核心串联关系如下：

1. `call/apply`是实现`bind`、`myNew`和继承中**构造函数继承**的基础，通过它们可以灵活改变函数的`this`指向；

2. `new`的实现依赖`call`绑定构造函数的`this`，而继承的核心是通过`new`或`Object.create`构建原型链；

3. 寄生组合式继承结合了`call`（构造函数继承）和`Object.create`（原型链继承），成为ES6`class extends`的底层实现，是JS继承的终极方案；

4. 所有知识点的底层核心，都是JS的**原型机制**和**this绑定规则**。

## 五、面试高频考点梳理

1. `call/apply/bind`的区别及手动实现（重点是`bind`的构造函数兼容）；

2. `new`的执行过程及手动实现（重点是返回规则和原型关联）；

3. 组合继承的缺陷及寄生组合式继承的优化点（父类构造函数调用次数）；

4. ES6`class extends`的底层实现（寄生组合式继承）；

5. `this`的绑定规则（显式绑定：`call/apply/bind`；构造函数绑定：`new`）；

6. 原型链的属性查找规则（先实例自身，再沿原型链向上查找，同名属性会屏蔽）。

## 写在最后

`call/apply/bind`、`new`和继承是JavaScript的**核心基石**，看似简单，实则蕴含了JS原型式编程的设计思想。本文通过**原理讲解+手动实现+代码测试**的方式，层层拆解了这些知识点，希望能帮助你从“会用”提升到“理解底层”。

真正掌握这些知识点，不仅能应对面试，更能在开发中灵活处理**this指向问题**、**对象继承问题**，写出更优雅、更高效的JavaScript代码。建议大家手动敲一遍文中的所有代码，亲自调试运行，才能真正吃透这些核心知识点。

