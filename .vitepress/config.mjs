import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "学海无涯",
  description: "吾日三省吾身",
  srcDir: "src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 设置导航栏
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    docFooter: { prev: '上一篇', next: '下一篇' },

    sidebar: [
      {
        text: "快速阅读",
        link: '/started/started'
      },
      {
        text: '前端',
        items: [
          { text: 'HTML和CSS', link: '/html/html' },
          { text: 'md 语法', link: '/markdown-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yym-yumeng123/InterviewExperience' }
    ]
  }
})
