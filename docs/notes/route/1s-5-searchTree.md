二叉搜索树

这个左小右大的特性，可以让我们在 BST 中快速找到某个节点，或者找到某个范围内的所有节点，这是 BST 的优势所在。

```js
// 利用 BST 的特性搜索指定元素
let targetNode = null;

function traverse(root, targetVal) {
    if (root === null) {
        return;
    }
    if (root.val === targetVal) {
        targetNode = root;
    }
    if (targetNode !== null) {
        // 已经找到目标，不需要继续遍历了
        return;
    }
    // 根据 targetVal 和当前节点的大小
    // 可以判断应该去左子树还是右子树进行搜索
    if (root.val < targetVal) {
        traverse(root.right, targetVal);
    } else {
        traverse(root.left, targetVal);
    }
}


let _bstRoot = BTree.createRoot([7, 4, 9, 1, 5, 8, 11]);
// 搜索元素 8
traverse(_bstRoot, 8);
```
想的时间复杂度是树的高度 O(logN)，而普通的二叉树遍历函数则需要 O(N) 的时间遍历所有节点。

至于其他增、删、改的操作，你首先查到目标节点，才能进行增删改的操作对吧？增删改的操作无非就是改一改指针，所以增删改的时间复杂度也是 O(logN)。
TreeMap 这个名字，应该就能看出来，它和前文介绍的 
哈希表 HashMap的结构是类似的，都是存储键值对的，HashMap 底层把键值对存储在一个 table 数组里面，而 TreeMap 底层把键值对存储在一棵二叉搜索树的节点里面。至于 TreeSet，它和 TreeMap 的关系正如哈希表 HashMap 和哈希集合 HashSet 的关系一样，说白了就是 TreeMap 的简单封装

树节点：
```js
// 之前的简单树节点
var TreeNode = function(val) {
    this.val = val;
    this.left = null;
    this.right = null;
};

// TreeMap里的树节点 多了一个key
class TreeNode {
  constructor(key, value) {
      this.key = key;  // 只增加了key属性
      this.value = value;
      this.left = null;
      this.right = null;
  }
}
```

要实现的TreeMap的接口如下
```js
// TreeMap 主要接口
class MyTreeMap<K, V> {

    // ****** Map 键值映射的基本方法 ******

    // 增/改，复杂度 O(logN)
    public void put(K key, V value) {}

    // 查，复杂度 O(logN)
    public V get(K key) {}

    // 删，复杂度 O(logN)
    public void remove(K key) {}

    // 是否包含键 key，复杂度 O(logN)
    public boolean containsKey(K key) {}

    // 返回所有键的集合，结果有序，复杂度 O(N)
    public List<K> keys() {}

    // ****** TreeMap 提供的额外方法 ******

    // 查找最小键，复杂度 O(logN)
    public K firstKey() {}

    // 查找最大键，复杂度 O(logN)
    public K lastKey() {}

    // 查找小于等于 key 的最大键，复杂度 O(logN)
    public K floorKey(K key) {}

    // 查找大于等于 key 的最小键，复杂度 O(logN)
    public K ceilingKey(K key) {}

    // 查找排名为 k 的键，复杂度 O(logN)
    public K selectKey(int k) {}

    // 查找键 key 的排名，复杂度 O(logN)
    public int rank(K key) {}

    // 区间查找，复杂度 O(logN + M)，M 为区间大小
    public List<K> rangeKeys(K low, K high) {}
}
```

## 基本的增删改查

- get 方法其实就类似上面可视化面板中查找目标节点的操作，根据目标 key 和当前节点的 key 比较，决定往左走还是往右走，可以一次性排除掉一半的节点，复杂度是 O(logN)。
- put, remove, containsKey 方法，其实也是要先利用 get 方法找到目标键所在的节点，然后做一些指针操作，复杂度都是
- floorKey, ceilingKey 方法是查找小于等于/大于等于某个键的最大/最小键，这个方法的实现和 get 方法类似，唯一的区别在于，当找不到目标 key 时，get 方法返回空指针，而 ceilingKey, floorKey 方法则返回和目标 key 最接近的键，类似上界和下界。
- rangeKeys 方法输入一个 [low, hi] 区间，返回这个区间内的所有键。这个方法的实现也是利用 BST 的性质提高搜索效率。如果当前节点的 key 小于 low，那么当前节点的整棵左子树都小于 low，根本不用搜索了；如果当前节点的 key 大于 hi，那么当前节点的整棵右子树都大于 hi，也不用搜索了。
- firstKey 方法是查找最小键，lastKey 方法是查找最大键，借助 BST 左小右大的特性，非常容易实现
- keys 方法返回所有键，且结果有序。可以利用 BST 的中序遍历结果有序的特性。
- selectKey 方法是查找排名为 k 的键（从小到大，从 1 开始），rank 方法是查找目标 key 的排名。

selectKey 方法，一个容易想到的方法是利用 BST 中序遍历结果有序的特性，中序遍历的过程中记录第 k 个遍历到节点，就是排名为 k 的节点。

但是这样的时间复杂度是 O(k)，因为你至少要用中序遍历经过 k 个节点。

一个更巧妙的办法是给二叉树节点中新增更多的字段记录额外信息：size 维护的就是当前节点为根的整棵树上有多少个节点，加上 BST 左小右大的特性，那么对于根节点，它只需要查询左子树的节点个数，就知道了自己在以自己为根的这棵树上的排名；知道了自己的排名，就可以确定目标排名的那个节点存在于左子树还是右子树上，从而避免搜索整棵树。这样也提高了维护的复杂性，因为每次插入、删除节点都要动态地更新这个额外的 size 字段，确保它的正确性。
rank 方法，也可以利用这个 size 字段。比方说你调用 rank(9)，想知道节点 9 这个元素排名第几，根节点 7 知道左子树有 3 个节点，加上自己共有 4 个节点，即自己排名第 4；然后 7 可以去右子树递归调用 rank(9)，计算节点 9 在右子树中的排名，最后再加上 4，就是整棵树中节点 9 的排名：


rank(node(7), 9) = 3 + 1 + rank(node(9), 9) = 3 + 1 + 1 = 5

```js
class TreeNode {
  constructor(key, value) {
      this.size = size;  
      this.key = key;  
      this.value = value;
      this.left = null;
      this.right = null;
  }
}
```
练习

