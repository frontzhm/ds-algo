function subsetsWithDup(nums) {
  const res = [];
  const len = nums.length;
  // 排序 重复的数字会挨着 方便剪枝
  nums.sort((x, y) => x - y);
  function backtrack(path, startIndex) {
    res.push([...path]);
    for (let i = startIndex; i < len; i++) {
      if (i > startIndex && nums[i] === nums[i - 1]) {
        continue;
      }
      const cur = nums[i];
      path.push(cur);
      backtrack(path, i + 1);
      path.pop();
    }
  }
  backtrack([], 0);
  return res;
}
console.log(subsetsWithDup([1, 2, 2]));
