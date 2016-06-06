/**
 * Created by jess on 16/6/3.
 */

/**
 * 具体APP的controller 基类
 * Created by jess on 16/4/20.
 */


'use strict';

const validate = require("validate.js");
const mongoose = require('mongoose');

const cms = global.cms;


class Base extends grape.ControllerBase {

    init(http){
        super.init(http);

        //cms config
        this.cmsConfig = grape.configManager.getConfig('cms');
        
        //系统中的URL
        this.urls = this.cmsConfig.urls;

        http.assign('cms_urls', this.urls );
    }

    json( data ){
        this.http.json( (data) );
    }

    /**
     * 客户端参数校验失败, 可以调用此方法输出
     * @param message
     */
    argumentValidateFail( message ){
        this.http.argumentValidateFail( message );
    }

    validateArgument(data, constraints){
        let validateResult = validate(data, constraints, { fullMessages : false });

        if(validateResult){
            let resultMsg = "";
            for(let key in validateResult){
                resultMsg += key + validateResult[key].join()+ "; " ;
            }
            return resultMsg;
        }

        return true;
    }

    model( modelName ){
        return mongoose.model( modelName );
    }

}

grape.set('controller_base', Base );

module.exports = Base;
