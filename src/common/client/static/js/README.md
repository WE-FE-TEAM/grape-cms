BigPipe & Page 说明
============================

## BigPipe.js

对外暴露以下几个方法。

### BigPipe.onPageletArrive

此方法不需要主动去调用，当 pagelet 输出的时候会自动调用这个方法。不管是 `chunk` 输出的 `pagelet`, 还是靠第二次请求 `quickling` 类型的 `pagelet` 都是靠此方法渲染。

示例：

```javascript
BigPipe.onPageletArrive({"container":"pages-container","id":"spage","html":"contact us","js":[],"css":[],"styles":[],"scripts":[]});
```

格式说明 

* `container` 容器
* `id` pagelet id
* `html` 内容
* `js` 外联 js 集合
* `css` 外联 css 集合
* `styles` 内联 css 集合
* `scripts` 内联 js 集合

### BigPipe.load

默认 `quickling` 性质的 `pagelet` 不会主动加载，需要用户主动调用此方法，才会开始加载。

调用方式：

```javascript  
BigPipe.load('pageletId');

BigPipe.load('pageletId1 pageletId2 pagelet Id3');

BigPipe.load({
    pagelets: ['pageletId1', 'pageletId2']
    url: '/other page url',
    cacheID: 'pageletId1&pageletId2', // 设置后不会重复请求Pagelet
    param: 'key1=val1&key2=val2',
    container: dom /* or id or {pageletId1: dom1, pageletId2: dom2}*/,
    cb: function() {
        // excuted when all done.
    }
});
```

参数说明

* `pagelets` pagelets 的 id 列表，可以是单个 pagelet， 也可以是多个用空格隔开，或者直接就是一个数组，里面由 pagelet id 组成。
* `url` 页面地址，默认是从当前页面去加载 pagelet，有时你可能需要加载其他页面的 pagelet。
* `param` 附带参数内容。
* `cacheID` pagelet 请求的缓存ID，不设置则请求不会被缓存。
* `container` 指定 pagelet 渲染时的容器。
* `cb` 回调，完成后触发。

### BigPipe 事件

* `pageletarrive` 当 pagelet 即将渲染前触发。
* `pageletinsert` pagelet 开始渲染，并已经插入了 css 和 dom 了，还没开始执行脚本时触发。
* `pageletdone` 当 pagelet 全部渲染完成触发。

事件 API

* on(type, callback)
* off(type?, callback?)
* once(type, callback)
* trigger(type, args...?)

## Page.js

依赖 BipPipe.js, 基于 quickling pagelet 实现单页面无跳转 web, 适用于无线端。

此 js 主要解决 history 兼容性问题，如果支持 pushstate 则会替换 url, 不支持则替换 hash, 否则直接跳转页面。

- `/home`
- `pathname#/home`

### Page.start

开起 history 监听，同时监听页面内点击跳转事件，自动完成对目标页面的内容区请求，并完成渲染。

调用方式：

```javascript
Page.start({
    selector: "a,[data-href]",
    layer : null,
    validate: null
});
```

当页面内有满足 selector 选择器的元素发生点击时，对 url 连接地址进行 validate 验证，（valdiate 验证可以是正则，也可以是自定义函数，）如果满足，将对目标页面加载 name 为 `spage` 的 pagelet， 并渲染。

### Page.redirect

主动调用跳转到指定页面。

调用方式：

```javascript
Page.redirect(url, {
    trigger: true,
    replace: false
});
```

* `trigger` 为 false 时标示，只修改 url，不进行页面加载, 否则加载页面。
* `replace` 为 true 标示替换 url 的时候是 replace 模式，不会添加历史纪录。（即不能后退，前进记录中）

### Page 事件

* `pagestart` 页面开始获取前触发。
* `pagedone` 页面渲染后触发。

事件 API

* on(type, callback)
* off(type?, callback?)
* once(type, callback)
* trigger(type, args...?)

