字典树 trie-tree

Trie 树就是多叉树结构的延伸，是一种针对字符串进行特殊优化的数据结构。 Trie 树也叫前缀树 字典树

Trie 树在处理字符串相关操作时有诸多优势，比如节省公共字符串前缀的内存空间、方便处理前缀操作、支持通配符匹配等。

Trie 树是一种针对字符串有特殊优化的数据结构，这也许它又被叫做字典树的原因。Trie 树针对字符串的处理有若干优势，下面一一列举

1. 节约存储空间
2. 方便处理前缀操作
3. 可以使用通配符
4. 可以按照字典序遍历键

Trie 树的基本结构 :Trie 树本质上就是一棵从二叉树衍生出来的多叉树。

```js
// 基本的多叉树节点
// Trie 树节点实现
var TrieNode = function () {
  this.val = null;
  // children[97] 如果非空，说明这里存储了一个字符 'a'，因为 'a' 的 ASCII 码为 97。题目说了只包含字符 a-z，那么你可以把大小改成 26
  this.children = new Array(256);
};
```

TrieNode 节点本身只存储 val 字段，并没有一个字段来存储字符，字符是通过子节点在父节点的 children 数组中的索引确定的。

形象理解就是，Trie 树用「树枝」存储字符串（键），用「节点」存储字符串（键）对应的数据（值）。

TrieMap API

```js
var TrieMap = class {
  // 构造函数
  constructor() {}
  // 在 Map 中添加 key
  put(key, val) {}
  // 删除键 key 以及对应的值
  remove(key) {}
  // 搜索 key 对应的值，不存在则返回 null
  // get("the") -> 4
  // get("tha") -> null
  get(key) {}
  // 判断 key 是否存在在 Map 中
  // containsKey("tea") -> false
  // containsKey("team") -> true
  containsKey(key) {}
  // 在 Map 的所有键中搜索 query 的最短前缀
  // shortestPrefixOf("themxyz") -> "the"
  shortestPrefixOf(query) {}
  // 在 Map 的所有键中搜索 query 的最长前缀
  // longestPrefixOf("themxyz") -> "them"
  longestPrefixOf(query) {}
  // 搜索所有前缀为 prefix 的键
  // keysWithPrefix("th") -> ["that", "the", "them"]
  keysWithPrefix(prefix) {}
  // 判断是和否存在前缀为 prefix 的键
  // hasKeyWithPrefix("tha") -> true
  // hasKeyWithPrefix("apple") -> false
  hasKeyWithPrefix(prefix) {}
  // 通配符 . 匹配任意字符，搜索所有匹配的键
  // keysWithPattern("t.a.") -> ["team", "that"]
  keysWithPattern(pattern) {}
  // 通配符 . 匹配任意字符，判断是否存在匹配的键
  // hasKeyWithPattern(".ip") -> true
  // hasKeyWithPattern(".i") -> false
  hasKeyWithPattern(pattern) {}
  // 返回 Map 中键值对的数量
  size() {}
};
```

假设 TrieMap 中已经存储了如下键值对

首先，TrieMap 类中一定需要记录 Trie 的根节点 root，以及 Trie 树中的所有节点数量用于实现 size() 方法：再实现一个工具函数 getNode;有了这个 getNode 函数，就能实现 containsKey 方法和 get 方法了; 实现 hasKeyWithPrefix;实现 shortestPrefixOf 方法，只要在第一次遇到存有 val 的节点的时候返回就行了

```js
class TrieNode {
  constructor() {
    this.val = null;
    this.children = new Array(256).fill(null);
  }
}
class TrieMap {
  constructor() {
    // ASCII 码个数
    this.R = 256;
    // 当前存在 Map 中的键值对个数
    this._size = 0;
    // Trie 树的根节点
    this.root = null;
  }
  size() {
    return this._size;
  }
  // 从节点 node 开始搜索 key，如果存在返回对应节点，否则返回 null,就算 getNode(key) 的返回值 x 非空，也只能说字符串 key 是一个「前缀」；除非 x.val 同时非空，才能判断键 key 存在。
  _getNode(node, key) {
    let p = node;
    // 从节点 node 开始搜索 key
    for (let i = 0; i < key.length; i++) {
      if (p === null) {
        // 无法向下搜索
        return null;
      }
      // 向下搜索
      const c = key.charCodeAt(i);
      p = p.children[c];
    }
    return p;
  }
  get(key) {
    // 从 root 开始搜索 key
    const x = this._getNode(this.root, key);
    if (x === null || x.val === null) {
      // x 为空或 x 的 val 字段为空都说明 key 没有对应的值
      return null;
    }
    return x.val;
  }
  containsKey(key) {
    return this.get(key) !== null;
  }
  hasKeyWithPrefix(prefix) {
    // 只要能找到一个节点，就是存在前缀
    return this._getNode(this.root, prefix) !== null;
  }
  // 这里需要注意的是 for 循环结束之后我们还需要额外检查一下。

  // 因为之前说了 Trie 树中「树枝」存储字符串，「节点」存储字符串对应的值，for 循环相当于只遍历了「树枝」，但漏掉了最后一个「节点」，即 query 本身就是 TrieMap 中的一个键的情况。
  shortestPrefixOf(query) {
    let p = this.root;
    // 从节点 node 开始搜索 key
    for (let i = 0; i < query.length; i++) {
      if (p === null) {
        // 无法向下搜索
        return '';
      }
      if (p.val !== null) {
        // 找到一个键是 query 的前缀
        return query.substring(0, i);
      }
      // 向下搜索
      const c = query.charCodeAt(i);
      p = p.children[c];
    }

    if (p !== null && p.val !== null) {
      // 如果 query 本身就是一个键
      return query;
    }
    return '';
  }
}
```
