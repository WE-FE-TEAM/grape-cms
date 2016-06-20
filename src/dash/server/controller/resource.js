/**
 * 文件上传相关接口
 * Created by jess on 16/6/20.
 */


'use strict';


const path = require('path');

const sep = path.sep;

const grape = global.grape;

const ControllerBase = grape.get('controller_base');

const cms = global.cms;

const cmsUtils = cms.utils;


class ResourceController extends ControllerBase {
    
    constructor(http){
        super(http);
        
        const cmsConfig = grape.configManager.getConfig('cms');
        
        this.uploadRootPath = cmsConfig.uploadRootPath;
    }

    /**
     * 检查目录路径是否含有非法字符
     * @param dirPath {string}
     */
    isDirPathValidate( dirPath ){
        return dirPath.indexOf('..') < 0;
    }
    
    //异步接口: 创建目录
    async mkdirAction(){
        
        let http = this.http;
        let body = http.req.body;
        
        let parentDirPath = ( body.parentDir || '').trim();
        let dirName = ( body.dirName || '').trim();
        
        if( ! parentDirPath || ! dirName ){
            return http.error(`父级目录/新创建的目录名都不能为空!!`);
        }
        
        let finalDirPath = parentDirPath + sep + dirName;

        if( ! this.isDirPathValidate( finalDirPath) ){
            return http.error('目录路径或目录名含有非法字符!!');
        }

        finalDirPath = path.resolve(`${this.uploadRootPath}${sep}${finalDirPath}`);
        
        let result = false;
        try{
            result = await cmsUtils.mkdirp( finalDirPath );
        }catch(e){
            grape.log.error( e );
            return http.error('创建目录失败', e);
        }

        this.json({
            status : 0,
            message : '创建目录成功'
        });
    }
}




module.exports = ResourceController;
