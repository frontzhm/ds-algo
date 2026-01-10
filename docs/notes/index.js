function d(prices) {
  const count = prices.length;
  // dp[i]表示第i天卖的话 能获得的最大利润
  const dp = new Array(count).fill(0);

  for (let i = 1; i < count; i++) {
    let max = 0;
    const curPrice = prices[i];
    for (let j = 0; j < i; j++) {
      if (curPrice > prices[j]) {
        max = Math.max(max, curPrice - prices[j]);
      }
    }
    dp[i] = max;
  }
  return Math.max(...dp);
}
console.log(d([7, 1, 5, 3, 6, 4]));
