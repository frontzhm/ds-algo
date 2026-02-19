var minSubArrayLen = function(target, nums) {
  const len = nums.length
  if(len === 0 ) return 0
  let left = 0
  let right = 0
  let minLen = Infinity
  let windowSum = 0

  while(right<len){
    const rNum = nums[right]
    right++
    windowSum+=rNum
    console.log('right',windowSum)
    while(windowSum>=target){
      const lNum = nums[left]

      minLen = Math.min(minLen,right-left)
      // console.log(windowSum,left,right,minLen)
      left++
      windowSum -=lNum
      console.log('left', windowSum)
    }

  }
  return minLen === Infinity ? 0 : minLen
};


minSubArrayLen(40,[1,1,4])

