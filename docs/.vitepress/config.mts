import { defineConfig } from 'vitepress'

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
            { text: '栈 & 队列', link: '/notes/02-data-structures#栈--队列' },
            { text: '哈希表', link: '/notes/02-data-structures#哈希表' },
            { text: '树 & 堆', link: '/notes/02-data-structures#树--堆' },
          ],
        },
        {
          text: '核心算法思想',
          link: '/notes/03-algorithms',
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frontzhm/ds-algo' },
    ],
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
})
