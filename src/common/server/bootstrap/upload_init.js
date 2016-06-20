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
    grape.log.error(`创建文件上传根目录异常!!`);
}

