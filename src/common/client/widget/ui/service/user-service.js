/**
 * 请求用户相关的后端API的封装类
 * Created by jess on 16/4/26.
 */

'use strict';



const ServiceBase = require('./service-base');


const adapters = {


};

const URL_PREFIX = '/cms';

const apiConf = {

    /* 判断用户名是否存在 */
    getUserNameExist : {
        url: URL_PREFIX + '/dash/user/userNameExist',
        method: 'GET',
        dataType: 'json'
    },

    /* 创建新用户 */
    addUser : {
        url: URL_PREFIX + '/dash/user/doAdd',
        method: 'POST',
        dataType: 'json'
    },

    /* 编辑用户信息 */
    updateUser : {
        url: URL_PREFIX + '/dash/user/doUpdate',
        method: 'POST',
        dataType: 'json'
    },

    /*  删除用户信息 */
    deleteUser : {
        url: URL_PREFIX + '/dash/user/doDelete',
        method: 'POST',
        dataType: 'json'
    },

    /* 获取某个区间内的用户列表 */
    getUserList : {
        url: URL_PREFIX + '/dash/user/list',
        method: 'GET',
        dataType: 'json'
    },

    /*  修改用户登录密码 */
    modifyPassword : {
        url: URL_PREFIX + '/passport/passport/doModifyPassword',
        method: 'POST',
        dataType: 'json'
    }


};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;