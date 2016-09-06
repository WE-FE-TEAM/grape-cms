/**
 * Created by jess on 16/6/3.
 */

/**
 * @file FIS 配置
 * @author wangcheng
 */

'use strict';

let path = require('path');

fis.set('namespace', 'common');

/**
 * 静态资源url前添加前缀
 */
let url_prefix = '/cmss';
fis.match('**.{js,css,png,jpg,gif,jsx,scss,ts,eot,ttf,woff,woff2,svg,ico}', {
    domain: url_prefix
});


//设置默认的release路径
let distDir = path.dirname(fis.project.getProjectPath()) + '/../dist/';
fis.set('distDir', distDir);


//设置排除那些node_modules不添加短路径
let excludeModules = ['classnames'];
fis.set('excludeModules', excludeModules);


//glpb common
fis.match('/node_modules/glpb-components-common/(**.{css,scss})', {
    parser: fis.plugin('node-sass'),
    rExt: '.css'
});

fis.match('/node_modules/glpb-components-{common,pc,mobile}/(**.{js,jsx})', {
    preprocessor: [
        fis.plugin('js-require-file'),
        fis.plugin('js-require-css')
    ],
    parser : fis.plugin('babel-5.x', {
        blacklist: [ 'useStrict' ],
        loose: ["es6.classes", "es6.properties.computed"]
    }),
    rExt: '.js'
});

//glpb mobile and pc for we.com
fis.match('/node_modules/glpb-we-{mobile,pc}/(**.{css,scss})', {
    parser: fis.plugin('node-sass'),
    rExt: '.css'
});

fis.match('/node_modules/glpb-we-{mobile,pc}/(**.{js,jsx})', {
    preprocessor: [
        fis.plugin('js-require-file'),
        fis.plugin('js-require-css')
    ],
    parser : fis.plugin('babel-5.x', {
        blacklist: [ 'useStrict' ],
        loose: ["es6.classes", "es6.properties.computed"]
    }),
    rExt: '.js'
});


/**
 * 打包策略 :
 *     node_modules资源打包
 *     widget资源打包
 */
fis.media('prod')
    .match("/node_modules/**.{js,jsx}", {
        useHash : true,
        packTo : '/${static}/pkg/${namespace}_nm.js'
    })
    .match("/client/static/**.{js,jsx,ts,css,scss,png,jpg,gif,svg}", {
        useHash : false
    })
    .match("/client/widget/**.{js,jsx,ts}", {
        useHash : false,
        packTo : '/${static}/pkg/${namespace}_wdg.js'
    })
    .match('/client/widget/(**.{css,scss})', {
        useHash : false,
        packTo : '/${static}/pkg/${namespace}_wdg.css'
    });


