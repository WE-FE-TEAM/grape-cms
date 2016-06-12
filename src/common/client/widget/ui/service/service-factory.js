/**
 * 维护所有的service的工厂
 * Created by jess on 16/4/26.
 */


'use strict';


const userService = require('./user-service');
const dashService = require('./dash-service');

let serviceMap = {
    user : userService,
    dash : dashService
};

let singleton = {
    
    getService : function(name){
        return serviceMap[name];
    }
    
};



module.exports = singleton;