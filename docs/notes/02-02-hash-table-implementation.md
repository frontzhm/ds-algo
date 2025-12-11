# 从0到1：用JavaScript实现高性能哈希表（图文详解）

哈希表（Hash Table）是前端开发中最常用的高效数据结构之一，核心优势是**O(1) 时间复杂度**的增删改查，广泛应用于缓存、数据映射、去重等场景。本文会结合「图形化拆解+实战代码」，带你实现一个适配前端场景、鲁棒性强的哈希表，同时理解哈希表的底层原理和优化思路。

## 一、先搞懂：哈希表到底是什么？

### 1. 哈希表的核心原理

哈希表的本质是「键值对映射」，通过**哈希函数**将「键（Key）」转换为「哈希值（Hash Code）」，再通过哈希值快速定位「值（Value）」的存储位置，从而避开数组/链表的遍历开销。

#### 可视化核心流程

```text
键（Key）→ 哈希函数 → 哈希值（索引）→ 直接访问值（Value）

  "name"  →  hashCode  →    1024    →      "张三"
```

### 2. 哈希表 vs 原生对象/Map（前端场景对比）

| 特性     | 普通对象              | 原生Map               | 自定义哈希表（本文实现） |
| -------- | --------------------- | --------------------- | ------------------------ |
| 键类型   | 仅字符串/数字/Symbol  | 任意类型              | 任意类型（强化校验）     |
| 空值键   | 允许 `null/undefined` | 允许 `null/undefined` | 禁止（强化鲁棒性）       |
| 批量操作 | 无原生支持            | 需手动遍历            | 内置批量增删             |
| 反向查找 | 需手动遍历            | 需手动遍历            | 内置按值查键             |
| 缓存优化 | 无                    | 无                    | 高频遍历场景缓存         |
| 序列化   | 需手动处理            | 需手动处理            | 内置toJSON方法           |

### 3. 哈希表的核心挑战：哈希冲突

当不同的键通过哈希函数得到相同的哈希值时，就会发生「哈希冲突」。常见解决方式：

- **链地址法**：冲突位置存储链表，挂载多个键值对（如下图）；

  ```text
  哈希值: 1024 → [("name":"张三") → ("age":18)]  // 链表挂载冲突键值对

  哈希值: 2048 → [("city":"北京")]
  ```

- **开放寻址法**：冲突后向后寻找空位置；

- 本文基于原生Map封装（底层已优化冲突处理），重点聚焦前端场景的功能扩展。

## 二、分步实现：前端友好的哈希表

### 核心设计思路

基于ES6原生Map封装（复用底层优化的哈希实现），补充以下前端适配能力：

1. 入参校验（禁止非法键值，减少业务错误）；

2. 批量操作（适配接口数据批量处理场景）；

3. 缓存优化（高频遍历场景减少重复计算）；

4. 前端高频功能（反向查找、JSON序列化、冲突统计）；

5. 迭代器支持（兼容for...of、解构等ES6语法）。

### 第一步：基础结构与初始化

搭建哈希表核心骨架，包含底层存储容器、缓存容器和初始化逻辑。

#### 可视化结构

```text
HashTable
├── map（私有）：原生Map实例（复用底层哈希实现）
├── cache（私有）：缓存遍历结果（优化高频操作）
│   ├── keys：缓存键数组
│   ├── values：缓存值数组
│   ├── entries：缓存键值对数组
└── 方法集：
    ├── 核心操作：set/get/delete
    ├── 批量操作：batchSet/batchDelete
    ├── 工具方法：has/isEmpty/size
    ├── 扩展功能：toJSON/findKeyByValue
```

#### 代码实现

```typescript
/**
 * 哈希表（优化版：鲁棒性+前端场景适配+扩展能力）
 * 基于原生Map封装，补充前端高频功能，强化TypeScript类型校验
 * @template K 键的类型（支持任意类型，但禁止null/undefined）
 * @template V 值的类型（支持任意类型，可按需开启空值校验）
 */
export class HashTable<K, V> {
  /** 私有：底层存储容器，复用原生Map的哈希实现（V8引擎优化） */
  private readonly map: Map<K, V>;

  /** 私有：缓存遍历结果，避免高频遍历场景重复调用Array.from */
  private cache: {
    keys?: K[];
    values?: V[];
    entries?: Array<[K, V]>;
  } = {};

  /**
   * 构造函数：初始化哈希表
   * @param initialData 初始键值对数组（可选，支持批量初始化）
   */
  constructor(initialData?: Array<[K, V]>) {
    this.map = new Map<K, V>();
    // 若传入初始数据，批量存入哈希表
    if (initialData) {
      this.batchSet(initialData);
    }
  }
}
```

### 第二步：核心工具方法（校验+缓存）

实现通用入参校验和缓存清理，为后续操作提供鲁棒性保障。

#### 代码实现

```typescript
/**
 * 私有方法：通用入参校验（强化鲁棒性，避免非法键值）
 * @param key 待校验的键（禁止null/undefined）
 * @param value 待校验的值（可选，可按需开启空值校验）
 * @param checkValue 是否开启值的空值校验（默认false）
 * @throws {Error} 键为空或值校验不通过时抛出错误
 */
private validateParams(key: K, value?: V, checkValue: boolean = false): void {
  // 键校验：禁止null/undefined（前端常见错误源）
  if (key === undefined || key === null) {
    throw new Error(`哈希表的键不能为undefined或null，当前键：${String(key)}`);
  }
  // 值校验：按需开启（适配需要非空值的业务场景）
  if (checkValue && (value === undefined || value === null)) {
    throw new Error(`哈希表的值不能为undefined或null，当前值：${String(value)}`);
  }
}

/**
 * 私有方法：清空缓存（增删操作后触发，保证缓存与数据一致性）
 * @description 增删操作会改变哈希表数据，需清空缓存避免脏数据
 */
private clearCache(): void {
  this.cache = {};
}
```

### 第三步：核心增删改查功能

实现基础键值对操作，强化前端使用体验（如默认值、错误提示）。

#### 1. 设置键值对（set）

##### 核心逻辑

校验键合法性 → 调用原生Map存储 → 清空缓存（保证数据一致性）。

##### 可视化过程

```text
// 调用示例：hashTable.set("name", "张三")
1. 校验键 "name" → 非null/undefined → 通过
2. 调用map.set("name", "张三") → 底层哈希存储
3. 清空缓存 → cache = {}（避免后续遍历使用旧缓存）
```

##### 代码实现

```typescript
/**
 * 设置键值对（支持空值校验开关）
 * @param key 键（非null/undefined）
 * @param value 值（默认允许null/undefined）
 * @param checkValue 是否开启值的空值校验（默认false）
 * @throws {Error} 键/值校验失败时抛出错误
 */
set(key: K, value: V, checkValue: boolean = false): void {
  this.validateParams(key, value, checkValue);
  this.map.set(key, value);
  this.clearCache(); // 增删操作必须清空缓存
}
```

#### 2. 批量设置（batchSet）

##### 前端场景

接口返回数组格式的键值对（如`[{key1: val1}, {key2: val2}]`），需批量存入哈希表。

##### 可视化过程

```text
// 调用示例：batchSet([["name","张三"], ["age",18]])
1. 校验输入 → 是数组 → 通过
2. 遍历数组：
   - 第1项：set("name", "张三") → 成功
   - 第2项：set("age", 18) → 成功
3. 每步set操作均清空缓存 → 最终缓存为空
```

##### 代码实现

```typescript
/**
 * 批量设置键值对（前端高频场景：接口数据批量入库）
 * @param data 键值对数组（格式：Array<[K, V]>）
 * @param checkValue 是否开启值的空值校验（默认false）
 * @description 异常项会跳过并打印警告，不中断整体流程
 */
batchSet(data: Array<[K, V]>, checkValue: boolean = false): void {
  if (!Array.isArray(data)) {
    console.warn('批量设置失败：输入不是数组，当前输入：', data);
    return;
  }
  data.forEach(([key, value]) => {
    try {
      this.set(key, value, checkValue);
    } catch (e) {
      console.warn(`批量设置跳过异常项 [${String(key)}, ${String(value)}]：`, e);
    }
  });
}
```

#### 3. 获取值（get）

##### 核心优化

补充默认值参数，避免前端频繁写`const val = hash.get(key) || '默认值'`（兼容`0`、`''`等 falsy 值）。

##### 代码实现

```typescript
/**
 * 获取值（支持默认值，避免undefined判断）
 * @param key 键（非null/undefined）
 * @param defaultValue 未找到时的默认值（默认undefined）
 * @returns 找到的值 | 默认值
 * @throws {Error} 键为空时抛出错误
 */
get(key: K, defaultValue?: V): V | undefined {
  this.validateParams(key);
  // 使用??而非||，避免falsy值被默认值覆盖（如0、''、false）
  return this.map.get(key) ?? defaultValue;
}
```

#### 4. 删除键值对（delete + batchDelete）

##### 代码实现

```typescript
/**
 * 删除指定键值对（返回操作结果）
 * @param key 键（非null/undefined）
 * @returns  删除成功返回true，键不存在返回false
 * @throws {Error} 键为空时抛出错误
 */
delete(key: K): boolean {
  this.validateParams(key);
  const isDeleted = this.map.delete(key);
  if (isDeleted) {
    this.clearCache(); // 仅删除成功时清空缓存（减少不必要开销）
  }
  return isDeleted;
}

/**
 * 批量删除键值对（前端高频场景：批量清理缓存/数据）
 * @param keys 待删除的键数组
 * @returns 删除成功的数量
 * @description 异常项会跳过并打印警告，返回有效删除数
 */
batchDelete(keys: K[]): number {
  if (!Array.isArray(keys)) {
    console.warn('批量删除失败：输入不是数组，当前输入：', keys);
    return 0;
  }
  let deleteCount = 0;
  keys.forEach(key => {
    try {
      if (this.delete(key)) {
        deleteCount++;
      }
    } catch (e) {
      console.warn(`批量删除跳过异常键 ${String(key)}：`, e);
    }
  });
  return deleteCount;
}
```

#### 5. 基础检查方法（has / isEmpty / size / clear）

```typescript
/**
 * 检查键是否存在于哈希表中
 * @param key 键（非null/undefined）
 * @returns 存在返回true，不存在返回false
 * @throws {Error} 键为空时抛出错误
 */
has(key: K): boolean {
  this.validateParams(key);
  return this.map.has(key);
}

/**
 * 检查哈希表是否为空
 * @returns 空表返回true，非空返回false
 */
isEmpty(): boolean {
  return this.map.size === 0;
}

/**
 * 获取哈希表的键值对数量
 * @returns 哈希表大小（O(1)时间复杂度）
 */
size(): number {
  return this.map.size;
}

/**
 * 清空哈希表所有数据
 * @description 重置map和cache，GC会自动回收内存
 */
clear(): void {
  this.map.clear();
  this.clearCache();
}
```

### 第四步：性能优化：缓存遍历结果

高频遍历场景（如表格渲染、数据导出）中，缓存`keys()`/`values()`/`entries()`的结果，避免重复调用`Array.from(map.xxx)`（减少数组创建开销）。

#### 代码实现

```typescript
/**
 * 获取所有键（缓存优化，高频遍历场景性能提升）
 * @returns 键数组（返回副本，避免外部修改缓存）
 */
keys(): K[] {
  // 缓存不存在则创建，存在则直接返回副本
  if (!this.cache.keys) {
    this.cache.keys = Array.from(this.map.keys());
  }
  return [...this.cache.keys]; // 返回副本，防止外部修改缓存导致脏数据
}

/**
 * 获取所有值（缓存优化）
 * @returns 值数组（返回副本）
 */
values(): V[] {
  if (!this.cache.values) {
    this.cache.values = Array.from(this.map.values());
  }
  return [...this.cache.values];
}

/**
 * 获取所有键值对（缓存优化）
 * @returns 键值对数组（返回副本）
 */
entries(): Array<[K, V]> {
  if (!this.cache.entries) {
    this.cache.entries = Array.from(this.map.entries());
  }
  return [...this.cache.entries];
}
```

### 第五步：前端扩展功能

补充原生Map没有的、前端高频使用的功能，覆盖序列化、反向查找等场景。

#### 1. 迭代器支持（兼容ES6语法）

让哈希表支持`for...of`、解构赋值、扩展运算符，与数组/Map使用体验一致。

##### 代码实现

```typescript
/**
 * 实现迭代器协议（支持for...of、解构、扩展运算符）
 * @returns 生成器迭代器，逐个产出键值对（[K, V]）
 * @description 惰性计算：按需生成数据，避免一次性转换大数组（节省内存）
 */
*[Symbol.iterator](): Generator<[K, V], void, void> {
  // yield* 遍历原生Map的entries，逐个产出键值对
  yield* this.map.entries();
}
```

##### 使用示例

```typescript
const hash = new HashTable([
  ['name', '张三'],
  ['age', 18],
]);

// for...of遍历
for (const [key, value] of hash) {
  console.log(`${key}: ${value}`); // name: 张三 → age: 18
}

// 解构赋值
const [firstEntry, secondEntry] = hash;
console.log(firstEntry); // ["name", "张三"]

// 扩展运算符
const entryArray = [...hash];
console.log(entryArray); // [["name", "张三"], ["age", 18]]
```

#### 2. 转换为JSON（数据序列化）

前端场景中，常需要将哈希表转换为普通JSON对象（适配接口传输、localStorage存储），处理键类型限制（JSON键仅支持字符串）。

##### 代码实现

```typescript
/**
 * 转换为JSON对象（前端数据序列化场景）
 * @returns 普通JSON对象（键为字符串/数字，其他类型键会跳过）
 * @description 仅支持键为字符串/数字的场景，其他类型键会打印警告并跳过
 */
toJSON(): Record<string, V> {
  const json: Record<string, V> = {};
  this.map.forEach((value, key) => {
    // JSON键仅支持字符串，故将数字键转为字符串，其他类型键跳过
    if (typeof key === 'string' || typeof key === 'number') {
      json[String(key)] = value;
    } else {
      console.warn(`键 ${String(key)} 不是字符串/数字，跳过JSON序列化`);
    }
  });
  return json;
}
```

##### 使用示例

```typescript
const hash = new HashTable([
  ['name', '张三'],
  ['age', 18],
  [Symbol('id'), 1001],
]);
const json = hash.toJSON();
console.log(json); // { "name": "张三", "age": 18 }（Symbol键被跳过）

// 存储到localStorage
localStorage.setItem('userData', JSON.stringify(json));
```

#### 3. 按值查找键（反向查找）

前端高频场景：已知值需找到对应的键（如表单回显、数据反向映射），原生Map需手动遍历，此处封装为内置方法。

##### 代码实现

```typescript
/**
 * 按值查找键（前端高频：反向查找场景）
 * @param value 待查找的值
 * @returns 第一个匹配的键（无匹配返回undefined）
 * @description 使用Object.is判断值相等，支持NaN、-0等特殊值（比===更严谨）
 */
findKeyByValue(value: V): K | undefined {
  for (const [key, val] of this.map.entries()) {
    // Object.is处理特殊场景：Object.is(NaN, NaN) → true；Object.is(-0, 0) → false
    if (Object.is(val, value)) {
      return key;
    }
  }
  return undefined;
}
```

##### 使用示例

```typescript
const hash = new HashTable([
  ['name', '张三'],
  ['age', 18],
]);
console.log(hash.findKeyByValue(18)); // "age"
console.log(hash.findKeyByValue('李四')); // undefined
```

#### 4. 哈希冲突统计（调试/学习用）

帮助理解哈希表底层冲突问题，适用于学习或调试（模拟简单哈希算法，统计冲突次数）。

##### 代码实现

```typescript
/**
 * 模拟哈希冲突统计（学习/调试用）
 * @returns 哈希值-冲突次数映射（仅包含冲突次数>1的哈希值）
 * @description 基于键的toString长度计算哈希值（简化版，实际哈希算法更复杂）
 */
getHashConflictStats(): Record<string, number> {
  const hashMap: Record<string, number> = {};
  // 遍历所有键，计算简化版哈希值（键的字符串长度）
  this.map.forEach((_, key) => {
    const keyStr = String(key);
    const simpleHash = keyStr.length.toString(); // 简化哈希算法：取字符串长度
    hashMap[simpleHash] = (hashMap[simpleHash] || 0) + 1;
  });
  // 过滤无冲突的哈希值（仅保留冲突次数>1的）
  return Object.fromEntries(
    Object.entries(hashMap).filter(([_, count]) => count > 1)
  );
}
```

##### 使用示例

```typescript
const hash = new HashTable([
  ['name', '张三'],
  ['age', 18],
  ['city', '北京'],
]);
// 键"name"（4）、"age"（3）、"city"（4）→ 哈希值"4"对应2个键，存在冲突
console.log(hash.getHashConflictStats()); // { "4": 2 }
```

## 三、完整使用示例（前端业务场景）

```typescript
// 1. 初始化哈希表（支持初始数据）
const userCache = new HashTable<string, { name: string; age: number }>([
  ['user1001', { name: '张三', age: 18 }],
  ['user1002', { name: '李四', age: 20 }],
]);

// 2. 基础操作：新增/查询/删除
userCache.set('user1003', { name: '王五', age: 22 }); // 新增
console.log(userCache.get('user1002')); // 查询 → { name: "李四", age: 20 }
console.log(userCache.has('user1004')); // 检查 → false
userCache.delete('user1004'); // 删除不存在的键 → false

// 3. 批量操作（适配接口数据）
const apiData = [
  ['user1005', { name: '赵六', age: 24 }],
  ['user1006', { name: '孙七', age: 26 }],
];
userCache.batchSet(apiData); // 批量新增
const deleteCount = userCache.batchDelete(['user1001', 'user1005']); // 批量删除
console.log(`批量删除成功：${deleteCount} 个`); // 2 个

// 4. 遍历操作（支持for...of）
for (const [userId, userInfo] of userCache) {
  console.log(`用户ID：${userId}，姓名：${userInfo.name}`);
}

// 5. 反向查找（按值找键）
const targetUser = { name: '李四', age: 20 };
const targetUserId = userCache.findKeyByValue(targetUser);
console.log(`李四的用户ID：${targetUserId}`); // user1002

// 6. 序列化（存储到localStorage）
const userJson = userCache.toJSON();
localStorage.setItem('userCache', JSON.stringify(userJson));

// 7. 清空哈希表
userCache.clear();
console.log(userCache.isEmpty()); // true
```

## 四、核心优化与前端适配总结

### 1. 性能优化点

| 优化方向     | 具体实现                    | 效果                         |
| ------------ | --------------------------- | ---------------------------- |
| 缓存遍历结果 | 缓存keys/values/entries结果 | 高频遍历场景减少数组创建开销 |
| 复用原生Map  | 基于V8引擎优化的Map封装     | 避开手动实现哈希的性能问题   |
| 惰性迭代器   | 实现Symbol.iterator生成器   | 按需生成数据，节省内存       |
| 条件清空缓存 | 仅增删成功时清空缓存        | 减少不必要的缓存清理开销     |

### 2. 前端场景适配

- **批量操作**：适配接口数据批量入库/清理（如列表页批量删除）；

- **JSON序列化**：适配localStorage存储、接口传输（解决哈希表无法直接JSON.stringify的问题）；

- **反向查找**：适配表单回显、数据反向映射（如根据用户信息找ID）；

- **类型校验**：TypeScript泛型+空值校验，减少前端业务错误（如传入null键）。

### 3. 鲁棒性强化

- **入参校验**：禁止null/undefined键，按需校验值，提前拦截错误；

- **异常处理**：批量操作跳过异常项并打印警告，不中断整体流程；

- **数据一致性**：增删操作强制清空缓存，避免缓存与实际数据不一致。

## 五、进阶方向（扩展学习）

1. **自定义哈希函数**：脱离原生Map，手动实现「数组+链表」的哈希表（深入理解哈希冲突解决）；

2. **LRU缓存**：基于「哈希表+双向链表」实现LRU（最近最少使用）缓存（前端缓存淘汰策略）；

3. **持久化存储**：结合IndexedDB，实现哈希表的本地持久化（适配大数据量缓存）；

4. **并发安全**：添加锁机制（如互斥锁），适配前端并发修改场景（如多请求同时操作哈希表）。

## 六、总结

本文实现的哈希表并非"重复造轮子"，而是基于原生Map的**前端场景优化封装**——既复用了底层引擎的性能优势，又补充了前端高频需求（批量操作、反向查找、序列化），兼顾了性能、易用性和鲁棒性。

哈希表作为前端开发的"瑞士军刀"，掌握其实现思路和优化方向，能显著提升缓存、数据映射、去重等场景的开发效率。无论是日常业务开发（如表单缓存、列表去重），还是面试中的数据结构考察，哈希表都是必须掌握的核心知识点。
