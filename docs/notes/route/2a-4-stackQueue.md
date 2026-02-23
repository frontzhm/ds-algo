71. 简化路径
给你一个字符串 path ，表示指向某一文件或目录的 Unix 风格 绝对路径 （以 '/' 开头），请你将其转化为更加简洁的规范路径。

在 Unix 风格的文件系统中，一个点（.）表示当前目录本身；此外，两个点 （..） 表示将目录切换到上一级（指向父目录）；两者都可以是复杂相对路径的组成部分。任意多个连续的斜杠（即，'//'）都被视为单个斜杠 '/' 。 对于此问题，任何其他格式的点（例如，'...'）均被视为文件/目录名称。

请注意，返回的 规范
示例 4：

输入：path = "/a/./b/../../c/"
输出："/c"

```js
var simplifyPath = function(path) {
   const pathArr =  path.split('/')
   const stack = []
   for(let i=0;i<pathArr.length;i++){
    if(pathArr[i] === '' || pathArr[i] === '.'){
      continue
    }
    if(pathArr[i] === '..'){
      if(stack.length !== 0){
        stack.pop()
      }
    }

   }
   return '/'+ stack.join('/')
};
```
