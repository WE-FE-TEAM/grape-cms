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
    }

    getFinalUploadDir(channelId, dirPath) {
        return path.resolve(`${this.ueditorUploadRootPath}${sep}${channelId}${sep}${dirPath}`);
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
    getUploadFileUrl(finalFilePath) {
        let relativeToUploadRoot = path.relative(this.ueditorUploadRootPath, finalFilePath);
        return this.ueditorUploadUrlPrefix + '/' + relativeToUploadRoot.split('\\').join('/');
    }

    getFormateTime() {
        let d = new Date();
        let m = d.getMonth() + 1;
        return d.getFullYear() + "-" + m + "-" + d.getDate();
    }

    async uploadImage() {
        let http = this.http;
        let req = http.req;

        let mdate = this.getFormateTime();

        let channelId = http.getChannelId();
        // //最终文件要上传的路径
        let finalPath = this.getFinalUploadDir(channelId, mdate);
        let files = req.files || {};
        let keys = Object.keys(files);
        let file = files[keys[0]];

        let imageName = file.name;

        if( imageName.indexOf('..') >= 0 ){
            return http.error(`文件名[${imageName}]含有非法字符!!`);
        }

        let randomToken=uuid.v4();

        let newFileName = randomToken + "_" + imageName;

        let finalFilePath = `${finalPath}${sep}${newFileName}`;


        // await this.updateUrlPrefix(channelId);

        let result = false;
        try {
            result = cmsUtils.move(file.path, finalFilePath);
        } catch (e) {
            return http.error(`移动文件异常!`, e);
        }

        let data = {
            title:imageName,
            state: 'SUCCESS',
            message: '上传成功',
            original: newFileName,
            url: this.getUploadFileUrl(finalFilePath)
        };

        return data;
    }

    async indexAction() {
        let json = {
            "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
            "imageUrl": "http://localhost:9203/cms/dash/ueditor/index?action=uploadimage",
            "imageFieldName": "upfile",
            "imageUrlPrefix": "", /* 图片访问路径前缀 */
            "imageMaxSize": 2048,
            "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
            "imagePathFormat": this.ueditorUploadRootPath + "{yyyy}{mm}{dd}"/* 上传保存路径,可以自定义保存路径和文件名格式 */
        };
        let req = this.http.req;
        let res = this.http.res;

        if (req.query.action == "config") {
            res.setHeader('Content-Type', 'application/json');
            return res.json(json);
        }
        else if (req.query.action == "uploadimage") {
            let x = this.uploadImage();
            res.setHeader('Content-Type', 'text/html');
            grape.console.log(x);
            return res.json(x);
        }
    }


}
module.exports = UeditorController;
