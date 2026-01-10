import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '数据结构与算法学习笔记',
  description: '前端工程师的算法系统化学习指南',
  // 部署到 GitHub Pages 时的基础路径
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/ds-algo/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '学习笔记', link: '/notes/01-prepare' },
      { text: '刷题指南', link: '/notes/leetcode' },
    ],
    sidebar: {
      '/notes/': [
        {
          text: '前置准备',
          link: '/notes/01-prepare',
        },
        {
          text: '基础数据结构',
          link: '/notes/02-data-structures',
          items: [
            { text: '数组 & 链表', link: '/notes/02-data-structures#数组--链表' },
            { text: '单向链表实现详解', link: '/notes/02-01-linked-list-implementation' },
            { text: '栈 & 队列', link: '/notes/02-data-structures#栈--队列' },
            { text: '栈 & 队列实现详解', link: '/notes/02-03-stack-queue-implementation' },
            { text: '哈希表', link: '/notes/02-data-structures#哈希表' },
            { text: '哈希表实现详解', link: '/notes/02-02-hash-table-implementation' },
            { text: '树 & 堆', link: '/notes/02-data-structures#树--堆' },
            { text: '二叉树实现详解', link: '/notes/02-04-binary-tree-implementation' },
            { text: '二叉树优化版实现', link: '/notes/02-04-binary-tree-optimized' },
            { text: '堆实现详解', link: '/notes/02-05-heap-implementation' },
          ],
        },
        {
          text: '核心算法思想',
          link: '/notes/03-algorithms',
          items: [
            { text: '算法思想总览', link: '/notes/03-algorithms' },
            { text: '双指针详解', link: '/notes/03-01-two-pointers' },
            {
              text: '动态规划',
              collapsed: false,
              items: [
                { text: 'DP基础：五部曲框架', link: '/notes/03-04-dp1' },
                { text: 'DP进阶：背包问题', link: '/notes/03-04-dp2' },
                { text: 'DP高级：完全背包变形', link: '/notes/03-04-dp3' },
                { text: '前端必备DP：10道经典题目', link: '/notes/dp-frontend-blog' },
                // { text: 'DP实战：20道经典题', link: '/notes/03-04-dp4' },
              ],
            },
          ],
        },
        {
          text: '前端专项算法',
          link: '/notes/04-frontend',
        },
        {
          text: 'LeetCode 刷题',
          link: '/notes/leetcode',
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/frontzhm/ds-algo' }],
  },
  // 支持在 Markdown 中引用 TS 代码并语法高亮
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true, // 显示行号
    // 注意：VitePress 1.6.4 可能不支持 importCode，如果报错可以注释掉
    // importCode: {
    //   // 支持从 packages 中导入代码片段
    //   resolvePath: (source: string) => {
    //     if (source.startsWith('@/')) {
    //       return source.replace('@/', '../../packages/')
    //     }
    //     return source
    //   },
    // },
  },
});
