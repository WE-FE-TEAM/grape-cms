/**
 * 针对文件上传类型的 POST 请求, 即  multipart/form-data 类型的, 需要单独来解析请求数据
 */

'use strict';

const grape = global.grape;
const cms = global.cms;

const cmsUtils = cms.utils;

class UploadParser extends grape.MiddlewareBase{

    async execute(){

        let http = this.http;
        let req = http.req;

        let contentType = req.get('content-type').toLowerCase();
        if( contentType.indexOf('multipart/form-data') >= 0 ){
            //是文件上传类型的POST
            let result = await cmsUtils.parseUploadFiles( req );

            req.body = result.fields;
            req.files = result.files;

        }

        http.parseBaseArgs();
    }

}


module.exports = UploadParser;