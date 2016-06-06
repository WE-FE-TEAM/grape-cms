/**
 * cms 系统中相关配置
 * Created by jess on 16/6/6.
 */


'use strict';



let URL_PREFIX = grape.path.APP_URL_PREFIX;



if( URL_PREFIX.length > 1 && URL_PREFIX.charAt( URL_PREFIX.length - 1) !== '/' ){
    URL_PREFIX = URL_PREFIX + '/';
}

let urls = {
    
    //登陆页
    logInPage : URL_PREFIX + 'passport/passport/login',
    doLogin : URL_PREFIX + 'passport/passport/doLogin',


    //后台系统首页
    dashIndex : URL_PREFIX + 'dash/home/index'
};


module.exports = {
    
    rootChannelId : '5755366bb470a1c0cfed8221',
    
    //系统中所有的栏目类型
    CHANNEL_TYPES : {
        //容器栏目
        CONTAINER : 'container',
        //文章类型栏目
        ARTICLE : 'article',
        //数据栏目
        JSON : 'json',
        //资源上传栏目
        ASSET_UPLOAD : 'asset_upload'
    },
    
    urls : urls
    
};