'use strict';


const cms = global.cms;

const ControllerBase = grape.get('controller_base');
const path = require('path');
const sep = path.sep;
const cmsUtils = cms.utils;
const uuid=require('node-uuid');

class UeditorController extends ControllerBase {
    constructor(http) {
        super(http);
        const cmsConfig = grape.configManager.getConfig('cms');
        this.ueditorUploadRootPath = cmsConfig.ueditorUploadRootPath;
        this.ueditorUploadUrlPrefix = cmsConfig.ueditorUploadUrlPrefix;
        this.uploadRootPath = cmsConfig.uploadRootPath;
    }

    getFinalUploadDir( dirPath) {
        return path.resolve(`${this.ueditorUploadRootPath}${sep}${dirPath}`);
    }

    //允许单个栏目配置各自的上传图片访问URL前缀
    async updateUrlPrefix(channelId) {

        const Channel = this.model('Channel');

        let channel = await Channel.findOne({_id: channelId}).exec();

        if (channel) {
            this.uploadUrlPrefix = ( channel.onlineUrl || this.ueditorUploadUrlPrefix );
            return;
        }

        throw new Error(`找不到[${channelId}]对应的栏目数据`);
    }

    /**
     * 根据文件上传之后的绝对路径, 获取外部访问该文件的URL
     * @param finalFilePath {string} 文件上传之后的绝对路径
     */
    getUploadFileUrl(finalFilePath, uploadUrlPrefix) {
        let relativeToUploadRoot = path.relative(this.uploadRootPath, finalFilePath);
        return uploadUrlPrefix + '/' + relativeToUploadRoot.split('\\').join('/');
    }

    getFormateTime() {
        let d = new Date();
        let m = d.getMonth() + 1;
        if( m < 10 ){
            m = '0' + m;
        }
        let day = d.getDate();
        if( day < 10 ){
            day = '0' + day;
        }
        return d.getFullYear() + "-" + m + "-" + day;
    }

    async uploadImage() {
        let http = this.http;
        let req = http.req;
        let res = http.res;

        let Channel = this.model('Channel');

        let channelId = req.query.channelId || '';

        let channel = null;
        try {
            channel = await Channel.findOne({_id: channelId}).exec();
        } catch (e) {
            grape.log.warn(e);
            return this.json({
                status: -1,
                message: '服务异常',
                debugInfo: e.message
            });
        }

        if (!channel) {
            return this.json({
                status: -1,
                message: '未找到该 channelId 对应的栏目数据!'
            });
        }

        let mdate = this.getFormateTime();


        // //最终文件要上传的路径
        let finalPath = this.getFinalUploadDir( mdate);
        let files = req.files || {};
        let keys = Object.keys(files);
        let file = files[keys[0]];

        let imageName = file.name;

        if( imageName.indexOf('..') >= 0 ){
            return http.error(`文件名[${imageName}]含有非法字符!!`);
        }

        let extname = path.extname(imageName);
        let randomToken=uuid.v4();

        let newFileName = randomToken + extname;

        let finalFilePath = `${finalPath}${sep}${newFileName}`;


        // await this.updateUrlPrefix(channelId);

        let result = false;
        try {
            result = await cmsUtils.move(file.path, finalFilePath);
        } catch (e) {
            return http.error(`移动文件异常!`, e);
        }

        let ueditorImageURL = channel.ueditorUploadUrlPrefix || this.ueditorUploadUrlPrefix;

        let data = {
            title:imageName,
            state: 'SUCCESS',
            message: '上传成功',
            original: newFileName,
            url: this.getUploadFileUrl(finalFilePath, ueditorImageURL)
        };

        // res.setHeader('Content-Type', 'text/html');
        grape.console.log( data );
        return http.json( data );
    }

    async indexAction() {


        let req = this.http.req;
        let res = this.http.res;

        if (req.query.action == "config") {
            this.configAction();
        }
        else if (req.query.action == "uploadimage") {
            this.uploadImage();
        }
    }

    async configAction(){

        let http = this.http;

        let req = http.req;
        let res = http.res;

        let Channel = this.model('Channel');

        let channelId = req.query.channelId || '';

        let json = {
            "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
            "imageUrl": "/cms/dash/ueditor/index?action=uploadimage&channelId=" + encodeURIComponent(channelId),
            "imageFieldName": "upfile",
            "imageUrlPrefix": "", /* 图片访问路径前缀 */
            "imageMaxSize": 2048,
            "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp", "webp"],
            "imagePathFormat": this.ueditorUploadRootPath + "/{yyyy}{mm}{dd}"/* 上传保存路径,可以自定义保存路径和文件名格式 */
        };

        res.setHeader('Content-Type', 'application/json');
        http.json(json);
    }


}
module.exports = UeditorController;
