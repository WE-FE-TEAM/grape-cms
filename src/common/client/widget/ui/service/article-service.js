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
    },

    /* 获取某个文章的详情 */
    getArticle : {
        url: URL_PREFIX + '/dash/article/detail',
        method: 'GET',
        dataType: 'json'
    },

    /* 修改某个文章的数据 */
    updateArticle: {
        url: URL_PREFIX + '/dash/article/doUpdate',
        method: 'POST',
        dataType: 'json'
    },

    /* 删除某个文章的数据 */
    deleteArticle: {
        url: URL_PREFIX + '/dash/article/doDelete',
        method: 'POST',
        dataType: 'json'
    },

    /* 获取某个区间内的文章列表 */
    getArticleList : {
        url: URL_PREFIX + '/dash/article/list',
        method: 'GET',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;