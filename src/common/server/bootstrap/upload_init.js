/**
 * 上传文件相关的初始化工作
 * Created by jess on 16/6/20.
 */


'use strict';


const fse = require('fs-extra');

const grape = global.grape;

const cmsConfig = grape.configManager.getConfig('cms');


//确保文件上传目录存在
const uploadPath = cmsConfig.uploadRootPath;


try{
    fse.mkdirpSync( uploadPath );
}catch(e){
    grape.log.error(`创建[文件上传]根目录异常!!`);
}

//文章预览根目录创建
try{
    fse.mkdirpSync( cmsConfig.articlePreviewRootPath );
}catch(e){
    grape.log.error(`创建[文章预览]根目录异常!!`);
}

//文章发布根目录创建
try{
    fse.mkdirpSync( cmsConfig.articlePublishRootPath );
}catch(e){
    grape.log.error(`创建[文章发布]根目录异常!!`);
}

//数据预览根目录创建
try{
    fse.mkdirpSync( cmsConfig.dataPreviewRootPath );
}catch(e){
    grape.log.error(`创建[数据预览]根目录异常!!`);
}

//文章发布根目录创建
try{
    fse.mkdirpSync( cmsConfig.dataPublishRootPath );
}catch(e){
    grape.log.error(`创建[数据发布]根目录异常!!`);
}


