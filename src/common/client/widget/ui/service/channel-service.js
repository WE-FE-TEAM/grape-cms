/**
 * 负责请求后台系统相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取所有的栏目数据 */
    getAllTree: {
        url: URL_PREFIX + '/dash/channel/getAllTree',
        method: 'GET',
        dataType: 'json'
    },

    /* 新增栏目接口 */
    addChannel: {
        url: URL_PREFIX + '/dash/channel/doAdd',
        method: 'POST',
        dataType: 'json'
    },

    /* 编辑栏目接口 */
    editChannel: {
        url: URL_PREFIX + '/dash/channel/doUpdate',
        method: 'POST',
        dataType: 'json'
    },

    /* 删除栏目接口 */
    deleteChannel: {
        url: URL_PREFIX + '/dash/channel/doDelete',
        method: 'POST',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;