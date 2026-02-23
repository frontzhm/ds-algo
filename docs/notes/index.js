var subarraysDivByK = function(nums, k) {
  // (prefix[j] -  prefix[i] )%5 = 0
  // prefix[j]%5 = prefix[i] %5
  const len = nums.length
  if(len===0) return 0
  let prefix = 0
  const map = new Map([[0,1]])
  let count = 0
  for(let i=0;i<len;i++){
    prefix+=nums[i]
    const mod = Math.abs(prefix % k)

    if(map.has(mod)){
      count+= map.get(mod)
    }
    const newVal = (map.get(mod) || 0)+1
    map.set(mod,newVal)
    // console.log(mod,map)
  }
  return count

};
console.log(subarraysDivByK([-1,2,9],2))
