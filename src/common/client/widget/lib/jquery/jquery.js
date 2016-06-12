/**
 * 修改一些jquery的配置
 * Created by jess on 16/5/24.
 */


'use strict';


const $ = require('./jquery.1.9.1.js');


window.jQuery = $;

//设置 默认禁止XHR缓存
$.ajaxSetup({
    cache : false
});


module.exports = $;