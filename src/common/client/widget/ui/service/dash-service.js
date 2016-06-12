/**
 * 负责请求后台系统相关数据
 * Created by jess on 16/6/12.
 */


'use strict';


const ServiceBase = require('./service-base');


const adapters = {};



const URL_PREFIX = '/cms';

const apiConf = {

    /* 获取菜单栏数据 */
    getUserMenuTree: {
        url: URL_PREFIX + '/dash/channel/userChannelsData',
        method: 'GET',
        dataType: 'json'
    },

    /** 获取当前页面所属菜单信息 **/
    getChannelPath : {
        url: URL_PREFIX + '/dash/channel/channelPath',
        method: 'GET',
        dataType: 'json'
    }

};


let singleton = new ServiceBase( apiConf, adapters);

module.exports = singleton;