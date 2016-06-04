/**
 * Created by jess on 16/6/4.
 */


'use strict';


const session = require('express-session');
const RedisStore = require('connect-redis')( session );


const redisConf = {
    host : '127.0.0.1',
    port : 6379,
    db : 0,
    prefix : 'cmssess:'
};

module.exports = {

    name : 'gcmssid',
    proxy : undefined,
    resave : false,
    rolling : false,
    saveUninitialized : false,
    secret : 'grape.cms.will.release1',
    unset : 'keep',
    cookie : {
        secure : false,
        maxAge : 60000 * 60 * 24 * 10
        // maxAge : 60000
    },

    store : new RedisStore( redisConf )

};