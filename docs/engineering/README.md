# 打包
要想进行优化，首先我们得清楚问题所在。即：是哪些代码/依赖包导致最后的编译文件过大？
- 通过 `webpack-bundle-analyzer` 插件查看打包后各模块所占体积

  <img style="width:80%" src="http://travel-official-imagesrc-1258234669.cos.ap-guangzhou.myqcloud.com/upload/buildTreeOld.png"/>

- 经过观察，发现XLSX和echarts这个两库在项目中占体积确实较大，并且，可以看到途中存在两个关于echarts的模块被打包进来
- 那我们是不是可以通过Webpack4自带的SplitChunks把这两个模块中重复的给打包出来防止模块重复？（顺带提一下，对于webpack来说，万物皆模块）
- 用于本项目用的是`vue-cli4`，可以直接在`vue.config.js`中添加以下代码
  ```js
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        echarts: {
          name: 'chunk-echarts',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?echarts(.*)/
        }
      }
    })
  }
  ```
- 虽然总体积是有点缩小了，但是还是远远达不到我们的预期
- 既然如此，那么我们换种思路，分析哪些是可以不需要参与打包的,在大部分管理系统中，大部分页面可能是通过像`element`这样的ui库构成的，那我们可以直接丢到cdn上，而像`xlsx、echarts`这样的，可以按需引入

那么我们先将echarts从项目中去除试一下

  ```js
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      'echarts':'echarts'
    }
  }
  ```
- 现在看看效果
  <img style="width:80%" src="http://ruqi-img.ruqimobility.com/pic_image/20210204062303__FL0G6C4A.png" />
- 可以看到打包后的文件直接比原来少了一大块，而且打包速度也快了很多（可以用插件，去跟踪打包各个模块所花费的时间，根据对比我们发现打包速度比原来快了10s多）
- 现在下一步是，我们将依赖从打包后的文件中剔除了，那么开发和打包后我们所需要的依赖就需要利用cdn上引进来
- 慢着~我们先回想一下，按理来说，我们直接删除依赖然后从全局引进cdn就完事了，但是，部门大佬此时提出了一个更加优秀的方案，那就是既然这个echarts并不是用的很多，那我们需要全局加载这份资源进来吗，答案当然是大可不必，那么我们需要的就是做到按需引入cdn
- 实现如下：
  ```html
  <template>
    <div>
      <echart-js href="https://lib.baomitu.com/echarts/4.2.1/echarts.js" />
    </div>
  </template>
  ```
  ```js
  components:{
    'echart-js':{
      render(createElement){
        return createElement('link', { rel:'stylesheet', href:this.href })
      },
      props:{
        href:{ type:String, required:true }
      }
    }
  }
  ```
- 这确实是一种方法，不过每次都需要在页面添加这么一大段，总归是有些不优雅的，我们是不是可以直接写一个方法，只需要把cdn地址丢进去就让他自动加载呢？慢着，或许我们还可以这样，写一个公共的工具，用来加载cdn上的资源，并且我们调用这个方法后，实现按需引入这个效果
- 首先先实现加载cdn资源工具，具体如下
  ```js
  function loadingRes({ url = '', tagType }) {
    return new Promise((resolve, reject) => {
      const script = document.createElement(tagType);
      script.src = url;
      script.id = url
      script.onload = () => { resolve() };
      script.onerror = () => { reject() }
      document.getElementsByTagName('head')[0].appendChild(script);
    })
  }
  ```
- 接着我们需要实现一个函数，用来使我们在代码中获取到我们需要的模块对象
  ```js
  const LoadScript = async(params, callback) => {
    const { url, module, tagType } = params
    const existingScript = document.getElementById(url)
    const cb = callback || function() {}

    if (!existingScript){
      await loadingRes({ url, tagType })
      const script = document.getElementById('url')
      const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd
      onEnd(script).then(resobj => {
        res(resobj)
      })
    }

    if (existingScript && cb) {
      if (window[module]) {
        res(window[module])
        return
      } 
      const onEnd = 'onload' in existingScript ? stdOnEnd : ieOnEnd
      onEnd(existingScript).then(resobj => {
        console.warn(resobj)
        res(resobj)
      })
    }
    function stdOnEnd(script) {
      return new Promise((res, rej) => {
        let fn = script.onload || function(){} 
        script.onload = function() {
          fn()
          if (this){
            this.onerror = this.onload = null
          }
          res(window[module])
        }
      })
    }
  }
  ```
- 这样我们就可以实现每次只加载我们需要的资源并且不需要加入打包并且不会重复请求cdn
- 现在可以来看一下具体打包后的模块
  <img style="width:80%" src="http://ruqi-img.ruqimobility.com/pic_image/20210223015630__EJD6FTQ5.png"/>
- 很明显XLSX和echarts模块都不在打包后的模块中了，而且整个打包后的体积也大大减少了，具体如图
- 优化后打包的体积，在没有gzip压缩过的是6.11MB
  <img style="width:80%" src="http://ruqi-img.ruqimobility.com/pic_image/20210223015630__FPPQT791.png"/>
- 没有优化的打包体积，在没有gzip压缩过的话是8.01MB
  <img style="width:80%" src="http://ruqi-img.ruqimobility.com/pic_image/20210223031045__135P8C3H.png"/>

在以上对打包过程的优化中，受影响的主要是项目中第三方库的部分，确确实实在装依赖或者打包的时候，减少一些依赖包的参与是能有效的加快编译速度和体积的。