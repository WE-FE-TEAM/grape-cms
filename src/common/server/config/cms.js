/**
 * cms 系统中相关配置
 * Created by jess on 16/6/6.
 */


'use strict';

const path = require('path');

const sep = path.sep;

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
    'dash/home/channelManage' : 'channel.view',
    
    
    //角色管理
    'dash/home/roleManage' : 'channel.view',
    'dash/role/all' : 'channel.view',
    'dash/role/doAdd' : 'role.add',
    'dash/role/doUpdate' : 'role.update',
    'dash/role/doDelete' : 'role.delete',


    //用户管理
    'dash/home/userManage' : 'channel.view',
    'dash/user/userNameExist' : 'channel.view',
    'dash/user/list' : 'channel.view',
    'dash/user/doAdd' : 'user.add',
    'dash/user/doUpdate' : 'user.update',
    'dash/user/doDelete' : 'user.delete',

    //查看容器栏目
    'dash/channel/container' : 'channel.view',
    //新增子栏目
    'dash/channel/add' : 'channel.add',
    'dash/channel/doAdd' : 'channel.add',
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

//不同类型的栏目, 对应的各自下支持的所有操作集合
const channelTypeOperationMap = {
    //容器栏目的操作集合
    container : [
        'channel.view',
        'channel.update',
        'channel.delete',
        'channel.add'
    ],
    //文章栏目对应操作集合
    article : [
        'channel.view',
        'channel.update',
        'channel.delete',
        'article.view',
        'article.add',
        'article.edit',
        'article.publish',
        'article.delete'
    ],
    //数据栏目对应操作集合
    data : [
        'channel.view',
        'channel.update',
        'channel.delete',
        'data.view',
        'data.add',
        'data.edit',
        'data.publish',
        'data.delete'
    ],
    //文件上传栏目的操作集合
    resource : [
        'channel.view',
        'channel.update',
        'channel.delete'
    ],

    //下面三个是系统自带的栏目
    channelManage : [
        'channel.view'
    ],
    roleManage : [
        'channel.view',
        'role.add',
        'role.update',
        'role.delete'
    ],
    userManage : [
        'channel.view',
        'user.add',
        'user.update',
        'user.delete'
    ]
};

//文章模板中, 支持的所有输入类型
const articleFieldTypes = [
    //单行输入框
    'text',
    //多行输入框
    'textarea',
    //富文本输入框
    'richtext'
];

module.exports = {
    
    rootChannelId : '5755366bb470a1c0cfed8221',

    urlPrefix : URL_PREFIX,

    //CMS文件上传的根目录
    uploadRootPath : `${path.dirname(grape.path.APP_PATH)}${sep}cms_upload`,

    urls : urls,

    urlOperationGroupMap : urlOperationGroupMap,

    channelTypeOperationMap : channelTypeOperationMap,
    
    articleFieldTypes : articleFieldTypes
    
};