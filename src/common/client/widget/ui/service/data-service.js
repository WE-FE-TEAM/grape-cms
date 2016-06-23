/**
 * 负责请求后台系统  文章 相关数据
 * Created by jess on 16/6/23.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取所有的栏目数据 */
    addData: {
        url: URL_PREFIX + '/dash/data/doAdd',
        method: 'POST',
        dataType: 'json'
    },

    /* 获取某个文章的详情 */
    getData : {
        url: URL_PREFIX + '/dash/data/detail',
        method: 'GET',
        dataType: 'json'
    },

    /* 修改某个文章的数据 */
    updateData: {
        url: URL_PREFIX + '/dash/data/doUpdate',
        method: 'POST',
        dataType: 'json'
    },
    /* 获取某个区间内的文章列表 */
    getDataList : {
        url: URL_PREFIX + '/dash/data/list',
        method: 'GET',
        dataType: 'json'
    },
    /* 删除某个文章的数据 */
    deleteData: {
        url: URL_PREFIX + '/dash/data/doDelete',
        method: 'POST',
        dataType: 'json'
    }



};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;