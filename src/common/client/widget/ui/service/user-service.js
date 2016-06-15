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
    }


};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;