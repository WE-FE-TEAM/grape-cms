/**
 * 栏目相关的工具
 * Created by jess on 16/6/13.
 */


'use strict';


let utils = {};


module.exports = utils;


//所有系统支持的栏目类型
const channelTypes = {

    container : 'container',
    article : 'article',
    data : 'data',
    resource : 'resource',
    page : 'page',

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
    page : '页面构建栏目',

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
utils.canAddChild = function( channel ){

    let out = false;

    out = channel.channelType === channelTypes.container;


    return out;
};

/**
 * 判断栏目类型是否为  文章栏目
 * @param channelType {string}
 * @returns {boolean}
 */
utils.isArticleChannel = function( channelType ){
    return channelType === channelTypes.article;
};
/**
 * 判断栏目类型是否为  数据栏目
 * @param channelType {string}
 * @returns {boolean}
 */
utils.isDataChannel = function( channelType ){
    return channelType === channelTypes.data;
};
/**
 * 根据 channelType, 返回对应的中文的 栏目类型
 * @param channelType {string}
 * @returns {string}
 */
utils.getChannelTypeText = function( channelType ){
    return channelTypeText[ channelType ];
};


/**
 * 根据 栏目类型, 获取该栏目支持的所有操作列表
 * @param channelType {string} 栏目类型
 * @returns {Array} 该栏目支持的所有操作列表
 */
utils.getChannelOperationSet = function( channelType ){

    let out = [];

    const channelTypeOperationMap = {

        //容器栏目的操作集合
        container : [
                {
                    text : '查看栏目',
                    value : 'channel.view'
                },
                {
                    text : '编辑栏目',
                    value : 'channel.update'
                },
                {
                    text : '删除栏目',
                    value : 'channel.delete'
                },
                {
                    text : '添加子栏目',
                    value : 'channel.add'
                }
            ],
        //文章栏目对应操作集合
        article : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '编辑栏目',
                value : 'channel.update'
            },
            {
                text : '删除栏目',
                value : 'channel.delete'
            },
            {
                text : '查看文章',
                value : 'article.view'
            },
            {
                text : '新增文章',
                value : 'article.add'
            },
            {
                text : '编辑文章',
                value : 'article.edit'
            },
            {
                text : '发布文章',
                value : 'article.publish'
            },
            {
                text : '删除文章',
                value : 'article.delete'
            }
        ],
        //数据栏目对应操作集合
        data : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '编辑栏目',
                value : 'channel.update'
            },
            {
                text : '删除栏目',
                value : 'channel.delete'
            },
            {
                text : '查看数据',
                value : 'data.view'
            },
            {
                text : '新增数据',
                value : 'data.add'
            },
            {
                text : '编辑数据',
                value : 'data.edit'
            },
            {
                text : '发布数据',
                value : 'data.publish'
            },
            {
                text : '删除数据',
                value : 'data.delete'
            }
        ],
        //文件上传栏目的操作集合
        resource : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '编辑栏目',
                value : 'channel.update'
            },
            {
                text : '删除栏目',
                value : 'channel.delete'
            },
            {
                text : '创建目录',
                value : 'resource.mkdir'
            },
            {
                text : '上传文件',
                value : 'resource.upload'
            }
        ],
        //页面栏目对应操作集合
        page : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '编辑栏目',
                value : 'channel.update'
            },
            {
                text : '删除栏目',
                value : 'channel.delete'
            },
            {
                text : '查看页面',
                value : 'page.view'
            },
            {
                text : '新增页面',
                value : 'page.add'
            },
            {
                text : '编辑页面',
                value : 'page.edit'
            },
            {
                text : '发布页面',
                value : 'page.publish'
            },
            {
                text : '删除页面',
                value : 'page.delete'
            }
        ],

        //下面三个是系统自带的栏目
        channelManage : [
            {
                text : '查看栏目',
                value : 'channel.view'
            }
        ],
        roleManage : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '新增角色',
                value : 'role.add'
            },
            {
                text : '编辑角色',
                value : 'role.update'
            },
            {
                text : '删除角色',
                value : 'role.delete'
            }
        ],
        userManage : [
            {
                text : '查看栏目',
                value : 'channel.view'
            },
            {
                text : '新增用户',
                value : 'user.add'
            },
            {
                text : '编辑用户',
                value : 'user.update'
            },
            {
                text : '删除用户',
                value : 'user.delete'
            }
        ]

    };

    out = channelTypeOperationMap[channelType];

    return out;
};