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

//URL到对应的操作组名的映射
let urlOperationGroupMap = {

    //栏目管理
    'dash/home/channelManage' : 'home.channelManage.view',
    //角色管理
    'dash/home/roleManage' : 'home.roleManage.view',
    //用户管理
    'dash/home/userManage' : 'home.userManage.view',

    //查看容器栏目
    'dash/channel/container' : 'channel.view',
    //新增子栏目
    'dash/channel/add' : 'channel.container.addChild',
    'dash/channel/doAdd' : 'channel.container.addChild',
    //编辑栏目
    'dash/channel/doUpdate' : 'channel.update',
    //删除栏目
    'dash/channel/doDelete' : 'channel.delete',


    //查看栏目
    'dash/channel/view' : 'channel.view',
    
    //查看文章栏目
    'dash/channel/article' : 'channel.view',
    //查看文章
    'dash/article/view' : 'article.view',
    //新增文章
    'dash/article/add' : 'article.add',
    'dash/article/doAdd' : 'article.add',
    //编辑文章
    'dash/article/edit' : 'article.edit',
    'dash/article/doUpdate' : 'article.edit',
    //删除文章
    'dash/article/doDelete' : 'article.delete',
    //发布文章
    'dash/article/doPublish' : 'article.publish',
    
    
    //数据栏目相关
    //查看数据栏目
    'dash/channel/data' : 'channel.view',
    //查看数据
    'dash/data/view' : 'data.view',
    //新增数据
    'dash/data/add' : 'data.add',
    'dash/data/doAdd' : 'data.add',
    //编辑数据
    'dash/data/edit' : 'data.edit',
    'dash/data/doUpdate' : 'data.edit',
    //删除数据
    'dash/data/doDelete' : 'data.delete',
    //发布数据
    'dash/data/doPublish' : 'data.publish',
    
    
    //文件上传栏目 相关
    //查看文件上传栏目
    'dash/channel/resource' : 'channel.view'

};


module.exports = {
    
    rootChannelId : '5755366bb470a1c0cfed8221',

    urlPrefix : URL_PREFIX,

    urls : urls,

    urlOperationGroupMap : urlOperationGroupMap
    
};