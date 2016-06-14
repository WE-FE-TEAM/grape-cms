/**
 * 缓存后端数据
 * Created by jess on 16/6/14.
 */


'use strict';


const service = require('common:widget/ui/service/service-factory.js');

const channelService = service.getService('channel');




let singleton = {};

module.exports = singleton;



let channelTreePromise = null;

singleton.getAll = function(){
    if( channelService ){
        return channelTreePromise;
    }
    channelTreePromise = channelService.getAllTree();
    return channelTreePromise;
};


