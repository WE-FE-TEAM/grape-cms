/**
 * 负责请求后台系统  页面 相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取所有的栏目数据 */
    addPage: {
        url: URL_PREFIX + '/designer/app/doAdd',
        method: 'POST',
        dataType: 'json'
    },

    /* 获取某个页面的详情 */
    getPage : {
        url: URL_PREFIX + '/designer/app/detail',
        method: 'GET',
        dataType: 'json'
    },

    /* 修改某个页面的数据 */
    updatePage: {
        url: URL_PREFIX + '/designer/app/doUpdate',
        method: 'POST',
        dataType: 'json'
    },

    /* 删除某个页面的数据 */
    deletePage: {
        url: URL_PREFIX + '/designer/app/doDelete',
        method: 'POST',
        dataType: 'json'
    },

    /* 获取某个区间内的页面列表 */
    getPageList : {
        url: URL_PREFIX + '/designer/app/list',
        method: 'GET',
        dataType: 'json'
    },

    /* 获取某个页面的所有编辑历史 */
    getPageEditHistory : {
        url: URL_PREFIX + '/designer/app/getEditHistory',
        method: 'GET',
        dataType: 'json'
    },

    /* 修改某个页面的数据 */
    publishPage: {
        url: URL_PREFIX + '/designer/app/doPublish',
        method: 'POST',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;