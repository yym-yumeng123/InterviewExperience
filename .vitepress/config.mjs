import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "学海无涯",
  description: "吾日三省吾身",
  srcDir: "src",
  markdown: {
    math: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 设置导航栏
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    docFooter: {prev: '上一篇', next: '下一篇'},

    sidebar: [
      {
        text: "快速阅读",
        link: '/started'
      },
      {
        text: "必备问题",
        link: '/other/other'
      },
      {
        text: '前端',
        items: [
          {text: 'HTML', link: '/html'},
          {text: 'CSS', link: '/css'},
          {text: 'JavaScript', link: '/javascript/js'},
          {text: 'JavaScript手写代码', link: '/javascript/js_code'},
          {text: 'TypeScript', link: 'typescript/ts'},
          {text: '网络知识', link: '/client/client'},
          {text: 'React', link: "react/react"},
          {text: '自定义 Hooks', link: "react/hooks"},
          {text: 'Vue', link: "vue/vue"},
          {text: 'Webpack', link: '/javascript/webpack'},
          {text: '设计模式', link: '/javascript/design_mode'},
        ]
      },
      {
        text: 'Node',
        items: [
          {text: 'Node', link: '/Node/node'},
        ]
      },
      {
        text: '数据结构',
        items: [
          {text: "数组_链表_栈_队列", link: "/datastructure/data"},
          {text: "递归_排序_二分查找", link: "/datastructure/sort_serach_rescue"},
          {text: "跳表_散列表_哈希算法", link: "/datastructure/skip_hashtable"},
          {text: "树", link: "/datastructure/tree"},
          {text: "字符串匹配基础", link: "/datastructure/strings"},
          {text: "算法思想", link: "/datastructure/algorithm"},
          {text: "leetcode算法", link: "/datastructure/leetcode"}
        ]
      },
      {
        text: "Golang基础",
        items: [
          {text: "fmt env file json testing包", link: '/go/package'},
          {text: "golang 网络编程", link: '/go/http'}
        ]
      },
      {
        text: "Docker",
        items: [
          {text: "Docker", link: '/docker/docker'},
        ]
      }

    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/yym-yumeng123/InterviewExperience'}
    ],

  }
})
