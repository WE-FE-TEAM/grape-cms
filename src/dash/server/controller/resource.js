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
        this.uploadUrlPrefix = cmsConfig.uploadUrlPrefix;
    }

    /**
     * 判断文件名是否合法, 文件名不能包含 .. 字符, 不能以 . 开头
     * @param fileName {string} 文件名
     */
    isFileNameLegal( fileName ){
        fileName = ( fileName || '').trim();
        return fileName && ( fileName === '.' || fileName[0] !== '.' ) && fileName.indexOf('..') < 0;
    }

    /**
     * 检查目录路径是否含有非法字符
     * @param dirPath {string}
     */
    isDirPathValidate( dirPath ){
        return ! dirPath || dirPath.indexOf('..') < 0;
    }

    getFinalUploadDir( channelId, dirPath ){
        return path.resolve(`${this.uploadRootPath}${sep}${channelId}${sep}${dirPath}`);
    }

    /**
     * 获取某绝对路径, 相对于上传文件根目录的路径
     * @param absolutePath {string} 某绝对路径
     * @return {string} 该绝对路径相对于上传文件根目录的相对路径
     */
    getRelativeToRoot( absolutePath ){
        let relativeToUploadRoot = path.relative( this.uploadRootPath, absolutePath);
        return relativeToUploadRoot;
    }

    /**
     * 根据文件上传之后的绝对路径, 获取外部访问该文件的URL
     * @param finalFilePath {string} 文件上传之后的绝对路径
     */
    getUploadFileUrl( finalFilePath ){
        let relativeToUploadRoot = path.relative( this.uploadRootPath, finalFilePath);
        return this.uploadUrlPrefix + '/' + relativeToUploadRoot.split('\\').join('/');
    }

    /**
     * 判断客户端提交的某个相对路径, 是否合法
     * @param channelId {string} 栏目ID
     * @param filePath {string} 客户端提交的某个目录路径
     * @returns {boolean} true 路径合法; false 路径非法
     */
    isPathLegal( channelId, filePath ){
        let out = false;
        if( ! path.isAbsolute(filePath) ){
            let finalPath = this.getFinalUploadDir( channelId, filePath );
            let relativeToRoot = this.getRelativeToRoot( finalPath );
            out = relativeToRoot.length > 0 && relativeToRoot.indexOf('..') < 0;
        }
        return out;
    }
    
    //异步接口: 创建目录, 每个目录,都自动放在该栏目ID的同名目录下
    async mkdirAction(){
        
        let http = this.http;
        let body = http.req.body;

        let channelId = http.getChannelId();
        
        let parentDirPath = ( body.parentDir || '').trim();
        let dirName = ( body.dirName || '').trim();
        
        if( ! parentDirPath || ! dirName ){
            return http.error(`父级目录/新创建的目录名都不能为空!!`);
        }

        if( ! this.isFileNameLegal( parentDirPath ) || ! this.isFileNameLegal(dirName) ){
            return http.error('目录路径或目录名含有非法字符(目录名不能以.开头, 不能包含 .. )!!');
        }
        
        let finalDirPath = parentDirPath + sep + dirName;

        if( ! this.isPathLegal( channelId, finalDirPath) ){
            return http.error('目录路径或目录名含有非法字符!!');
        }

        finalDirPath = this.getFinalUploadDir( channelId, finalDirPath);
        
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

    //异步接口: 上传单个文件
    async uploadAction(){

        let http = this.http;
        let req = http.req;

        let channelId = http.getChannelId();

        let body = req.body;

        let parentDirPath = ( body.parentDir || '').trim();

        if( ! parentDirPath ){
            return http.error(`父级目录不能为空!!`);
        }

        if( ! this.isDirPathValidate( parentDirPath) ){
            return http.error('目录路径或目录名含有非法字符!!');
        }

        //最终文件要上传的路径
        let finalPath = this.getFinalUploadDir( channelId, parentDirPath );

        let isDirExist = false;
        try{
            isDirExist = await cmsUtils.isFileExist( finalPath );
        }catch(e){
            return http.error('检查目标目录是否存在异常', e);
        }

        if( ! isDirExist ){
            return http.error('上传目录不存在!!');
        }


        let files = req.files || {};
        let keys = Object.keys( files );
        let file = files[ keys[0] ];

        if( ! file ){
            return http.error('未添加要上传的文件!!');
        }

        if( keys.length > 1 ){
            return http.error('一次只能上传一个文件!!');
        }

        //判断要上传的文件是否已经存在
        let fileName = file.name;
        if( fileName.indexOf('..') >= 0 ){
            return http.error(`文件名[${fileName}]含有非法字符!!`);
        }

        let finalFilePath = `${finalPath}${sep}${fileName}`;
        let isFileExist = false;
        try{
            isFileExist = await cmsUtils.isFileExist( finalFilePath );
        }catch(e){
            return http.error('检查目标文件是否存在 异常', e);
        }

        if( isFileExist ){
            //如果同名文件已经存在, 检查请求是否要求强制覆盖
            let isOverride = ( body.isOverride || '') + '';
            if( isOverride !== '1' ){
                //请求未要求强制覆盖, 需要询问客户端
                return this.json({
                    status : 2,
                    message : `该目录下已经存在文件${fileName}, 必须选择是否覆盖!`
                });
            }
        }

        let result = false;

        try{
            result = await cmsUtils.move( file.path, finalFilePath );
        }catch(e){
            return http.error(`移动文件异常!`, e);
        }

        let data = {
            status : 0,
            message : '上传成功',
            data : {
                url : this.getUploadFileUrl( finalFilePath )
            }
        };


        this.json( data );
        
    }

    //异步接口: 列出某个某个上传文件目录下, 所有的文件和目录
    async lsAction(){

        let http = this.http;
        let query = http.req.query;

        let channelId = http.getChannelId();
        let path = ( query.path || '' ).trim();

        if( ! path ){
            return http.error('path 参数不能为空');
        }

        if( ! this.isPathLegal(channelId, path ) ){
            return http.error(`路径[${path}]非法!!`);
        }

        let finalPath = this.getFinalUploadDir( channelId, path );

        let prefix = '';
        if( path.length > 1 ){
            prefix = path + sep;
            prefix = prefix.replace(/\/+$/, '/');
        }

        let files = [];
        try{
            files = await cmsUtils.readDir( finalPath, `${prefix}`);
        }catch(e){
            if( e.code === 'ENOENT' ){
                files = [];
            }else{
                grape.log.warn( e );
                return http.error('读取文件列表异常', e);
            }

        }

        files.forEach( ( obj ) => {
            if( obj.isFile ){
                obj.url = this.getUploadFileUrl( `${finalPath}${sep}${obj.name}`);
            }
        });

        this.json({
            status : 0,
            message : 'OK',
            data : {
                files : files
            }
        });
        
    }
}




module.exports = ResourceController;
