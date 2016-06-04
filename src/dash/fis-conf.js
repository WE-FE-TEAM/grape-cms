/**
 * Created by jess on 16/6/3.
 */

/**
 * @file FIS 配置
 * @author wangcheng
 */

'use strict';

let path = require('path');

fis.set('namespace', 'dash');

/**
 * 静态资源url前添加前缀
 */
let url_prefix = '/static';
fis.match('**.{js,css,png,jpg,gif,jsx,scss,ts,eot,ttf,woff,svg,ico}', {
    domain: url_prefix
});


//设置默认的release路径
let distDir = path.dirname(fis.project.getProjectPath()) + '/../dist/';
fis.set('distDir', distDir);


//设置排除那些node_modules不添加短路径
let excludeModules = ['classnames'];
fis.set('excludeModules', excludeModules);

/**
 * 打包策略 :
 *     node_modules资源打包
 *     widget资源打包
 */
fis.media('prod')
    .match("/node_modules/**.{js,jsx}", {
        packTo : '/${static}/pkg/${namespace}_nm.js'
    })
    .match("/client/widget/**.{js,jsx,ts}", {
        packTo : '/${static}/pkg/${namespace}_wdg.js'
    })
    .match('/client/widget/(**.{css,scss})', {
        packTo : '/${static}/pkg/${namespace}_wdg.css'
    });


