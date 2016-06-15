/**
 * 负责请求后台系统相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取所有角色 */
    getAll: {
        url: URL_PREFIX + '/dash/role/all',
        method: 'GET',
        dataType: 'json'
    },

    /* 新增角色 */
    addRole: {
        url: URL_PREFIX + '/dash/role/doAdd',
        method: 'POST',
        dataType: 'json'
    },

    /* 编辑角色 */
    updateRole: {
        url: URL_PREFIX + '/dash/role/doUpdate',
        method: 'POST',
        dataType: 'json'
    },

    /* 删除角色 */
    deleteRole: {
        url: URL_PREFIX + '/dash/role/doDelete',
        method: 'POST',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;