function letterCombinations(digits) {
  const res = [];
  const arr = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const len = digits.length;
  // const digitsArr = digits.split('').map(item => arr[item]);
  function backtrack(path, startIndex) {
    if (path.length === len) {
      res.push(path);
      return;
    }
    const curStrs = arr[digits[startIndex]];
    for (let j = 0; j < curStrs.length; j++) {
      console.log(path);
      backtrack(path + curStrs[j], startIndex + 1);
    }
  }
  backtrack('', 0);
  return res;
}
console.log(letterCombinations('23'));
