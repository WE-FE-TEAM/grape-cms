/**
 * 维护所有的service的工厂
 * Created by jess on 16/4/26.
 */


'use strict';


const userService = require('./user-service');
const dashService = require('./dash-service');
const channelService = require('./channel-service.js');
const roleService = require('./role-service.js');
const articleService = require('./article-service.js');

let serviceMap = {
    user : userService,
    dash : dashService,
    channel : channelService,
    role : roleService,
    article : articleService
};

let singleton = {
    
    getService : function(name){
        return serviceMap[name];
    }
    
};



module.exports = singleton;