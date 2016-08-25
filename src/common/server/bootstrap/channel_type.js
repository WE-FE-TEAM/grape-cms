/**
 * 系统支持的栏目类型及相应方法
 * Created by jess on 16/6/7.
 */


'use strict';


let cms = global.cms;


let cmsConfig = grape.configManager.getConfig('cms');

let urlOperationGroupMap = cmsConfig.urlOperationGroupMap;

let singleton = {};


cms.channelTypes = singleton;


//系统支持的所有栏目类型
let typeDef = {

    //栏目管理
    channelManage : {
        isSystem : true,
        text : '栏目管理',
        //查看栏目的URL
        url : 'dash/home/channelManage',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/home/channelManage']
            }
        ]
    },

    //角色管理
    roleManage : {
        isSystem : true,
        text : '角色管理',
        //查看栏目的URL
        url : 'dash/home/roleManage',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/home/roleManage']
            }
        ]
    },
    
    //用户管理
    userManage : {
        isSystem : true,
        text : '用户管理',
        //查看栏目的URL
        url : 'dash/home/userManage',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/home/userManage']
            }
        ]
    },
    
    //容器栏目
    container : {
        isSystem : false,
        text : '容器栏目',
        //查看栏目的URL
        url : 'dash/channel/container',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/channel/container']
            },
            {
                text : '新增子栏目',
                name : urlOperationGroupMap['dash/channel/add']
            },
            {
                text : '删除子栏目',
                name : urlOperationGroupMap['dash/channel/doDelete']
            }
        ]
    },
    
    //文章类型
    article : {
        isSystem : false,
        text : '文章栏目',
        //查看栏目的URL
        url : 'dash/channel/article',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/channel/article']
            },
            {
                text : '查看文章',
                name : urlOperationGroupMap['dash/article/view']
            },
            {
                text : '新增文章',
                name : urlOperationGroupMap['dash/article/add']
            },
            {
                text : '编辑文章',
                name : urlOperationGroupMap['dash/article/edit']
            },
            {
                text : '删除文章',
                name : urlOperationGroupMap['dash/article/doDelete']
            },
            {
                text : '发布文章',
                name : urlOperationGroupMap['dash/article/doPublish']
            }
        ]
    },
    
    //数据栏目
    data : {
        isSystem : false,
        text : '数据栏目',
        //查看栏目的URL
        url : 'dash/channel/data',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/channel/data']
            },
            {
                text : '查看数据',
                name : urlOperationGroupMap['dash/data/view']
            },
            {
                text : '新增数据',
                name : urlOperationGroupMap['dash/data/add']
            },
            {
                text : '编辑数据',
                name : urlOperationGroupMap['dash/data/edit']
            },
            {
                text : '删除数据',
                name : urlOperationGroupMap['dash/data/doDelete']
            },
            {
                text : '发布数据',
                name : urlOperationGroupMap['dash/data/doPublish']
            }
        ]
    },

    //文件上传栏目
    resource : {
        isSystem : false,
        text : '文件上传栏目',
        //查看栏目的URL
        url : 'dash/channel/resource',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/channel/resource']
            }
        ]
    },

    //页面类型
    page : {
        isSystem : false,
        text : '页面栏目',
        //查看栏目的URL
        url : 'dash/channel/page',
        //该栏目下支持的操作
        operations : [
            {
                text : '查看栏目',
                name : urlOperationGroupMap['dash/channel/page']
            },
            {
                text : '查看页面',
                name : urlOperationGroupMap['designer/app/view']
            },
            {
                text : '新增页面',
                name : urlOperationGroupMap['designer/app/add']
            },
            {
                text : '编辑页面',
                name : urlOperationGroupMap['designer/app/edit']
            },
            {
                text : '删除页面',
                name : urlOperationGroupMap['designer/app/doDelete']
            },
            {
                text : '发布页面',
                name : urlOperationGroupMap['designer/app/doPublish']
            }
        ]
    }
};


singleton.typeDef = typeDef;




module.exports = singleton;