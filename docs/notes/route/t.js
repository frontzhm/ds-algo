var evalRPN = function(tokens) {
  const len = tokens.length
  if(len ===0) return 0
  if(len ===1) return Number(tokens[0])
  const signs = new Set(['+','-','*','/'])
  const stack = []
  for(let i=0;i<len;i++){
    const cur = tokens[i]
    const isSign = signs.has(cur)
    if(!isSign){
      stack.push(Number(cur))
    }else{
      const after = stack.pop()
      const before = stack.pop()
      const newVal = cal(before,after,cur)
      stack.push(newVal)
    }

  }
  return stack.pop()
  function cal(before,after,sign){
    switch (sign) {
      case '+':
        return before+after
      case '-':
        return before-after
      case '*':
        return before*after
      case '/':
        return Math.trunc(before/after)

      default:
        break;
    }

  }
};




console.log(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]))
