/**
 * 线上环境
 * Created by jess on 16/6/27.
 */


'use strict';



const session = require('express-session');
const RedisStore = require('connect-redis')( session );

let cmsConf = require('../cms.js');

const redisConf = {
    host : '127.0.0.1',
    port : 6379,
    db : 0,
    prefix : 'cmssess:'
};

let sessionConf = {

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


const finalCmsConfig = Object.assign( {}, cmsConf, {

    //文章的预览 根目录
    articlePreviewRootPath : `/cms/article_preview`,
    //文章的发布根目录
    articlePublishRootPath : `/cms/article`,
    //数据的预览 根目录
    dataPreviewRootPath : `/cms/data_preview`,
    //数据的发布根目录
    dataPublishRootPath : `/cms/data`,

    ueditorUploadRootPath:`/cms/static/ueditor`,
    ueditorUploadUrlPrefix : 'http://www.we.com/cms',
    //CMS文件上传的根目录
    uploadRootPath : `/cms/static`,
    //文件上传之后,访问文件时,要添加的URL前缀
    uploadUrlPrefix : 'http://www.we.com/cms'

} );

module.exports = {


    log : {
        name : 'grape-cms',
        streams : [
            {
                level : 'error'
            },
            {
                level : 'fatal'
            }
        ]
    },

    session : sessionConf,

    cms : finalCmsConfig

};

