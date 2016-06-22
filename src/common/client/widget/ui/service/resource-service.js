/**
 * 负责请求后台系统 文件上传 相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取某个上传目录下的所有文件和子目录 */
    getDirectoryContent: {
        url: URL_PREFIX + '/dash/resource/ls',
        method: 'GET',
        dataType: 'json'
    },

    /* 创建目录 */
    mkdir : {
        url: URL_PREFIX + '/dash/resource/mkdir',
        method: 'POST',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;