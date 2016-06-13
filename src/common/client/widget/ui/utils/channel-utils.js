/**
 * 栏目相关的工具
 * Created by jess on 16/6/13.
 */


'use strict';


let singleton = {};


module.exports = singleton;


//所有系统支持的栏目类型
const channelTypes = {

    container : 'container',
    article : 'article',
    data : 'data',
    resource : 'resource',

    //下面三个是系统自带的栏目
    channelManage : 'channelManage',
    roleManage : 'roleManage',
    userManage : 'userManage'
};

//栏目类型对应的中文显示
const channelTypeText = {

    container : '容器栏目',
    article : '文章栏目',
    data : '数据栏目',
    resource : '文件上传栏目',

    //下面三个是系统自带的栏目
    channelManage : '栏目管理',
    roleManage : '角色管理',
    userManage : '用户管理'

};


/**
 * channnel下能否添加子栏目, 只有容器类型的栏目, 才能添加子栏目
 * @param channel
 * @returns {boolean}
 */
singleton.canAddChild = function( channel ){

    let out = false;

    out = channel.channelType === channelTypes.container;


    return out;
};

/**
 * 判断栏目类型是否为  文章栏目
 * @param channelType {string}
 * @returns {boolean}
 */
singleton.isArticleChannel = function( channelType ){
    return channelType === channelTypes.article;
};

/**
 * 根据 channelType, 返回对应的中文的 栏目类型
 * @param channelType {string}
 * @returns {string}
 */
singleton.getChannelTypeText = function( channelType ){
    return channelTypeText[ channelType ];
};