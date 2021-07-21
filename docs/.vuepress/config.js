module.exports = {
  title: 'zhoukingzzBlog',
  description: 'zhoukingzzBlog,有事没事一时兴起都会更新下',
  base:'/',
  port: 8801,    //端口
  themeConfig: {
    configureWebpack: {
      resolve: {
        alias: {
          '@alias': 'docs'
        }
      }
    },
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'JS',
        link: '/JS/'
      },
      {
        text: 'Vue',
        link: '/Vue/'
      },
      {
        text: 'Webpack',
        link: '/Webpack/'
      },
      {
        text: 'React',
        link: '/React/'
      }
    ],
    sidebar: {
      '/Webpack/':[
        {
          title: '项目依赖打包优化',
          collapsable: false,
          children: []
        }
      ]
    },
    plugins: [
        '@vuepress/back-to-top',    //返回顶部
        '@vuepress/last-updated' ,  //最后更新时间
        '@vuepress/nprogress'   //页面顶部进度条
    ]
  }
}