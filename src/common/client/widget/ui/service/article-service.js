/**
 * 负责请求后台系统  文章 相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取所有的栏目数据 */
    addArticle: {
        url: URL_PREFIX + '/dash/article/doAdd',
        method: 'POST',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;