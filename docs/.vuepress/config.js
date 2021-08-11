const path = require('path')
module.exports = {
  title: 'zhoukingzzBlog',
  description: 'zhoukingzzBlog,有事没事一时兴起都会更新下',
  base: '/',
  port: 8888,    //端口
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    logo: '/logo.png',
    // displayAllHeaders: true,//设置为 true 来显示所有页面的标题链接
    configureWebpack: {
      resolve: {
        alias: {
          '@alias': 'docs'
        }
      }
    },
    nav: [
      {
        text: 'JS',
        link: '/JS/'
      },
      {
        text: 'Vue',
        link: '/Vue/'
      },
      {
        text: 'React',
        link: '/React/'
      },
      {
        text: 'Engineering',
        link: '/Engineering/'
      }
    ],
    sidebar: {
      '/JS/': [
        '',
        'Array',
        'attributes',
        'Instance object',
        'object',
        'options',
        'promise',
        'protoTo',
        'strict',
        'this'
      ],
      'Vue':[''],
      'React':[''],
      'Engineering':['']
    },
    plugins: [
      '@vuepress/back-to-top',    //返回顶部
      '@vuepress/last-updated',  //最后更新时间
      '@vuepress/nprogress'   //页面顶部进度条
    ]
  }
}