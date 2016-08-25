/**
 * landing page builder 产出的页面数据模型
 * Created by jess on 16/8/25.
 */



'use strict';

const mongoose = require('mongoose');


//////////////////////////////////////////////////////////////

let pageSchema = new mongoose.Schema(
    {
        channelId : {
            type : String,
            required : true
        },
        //一篇文章的惟一ID
        pageId : {
            type : String,
            required : true
        },
        //该页面在系统中惟一的名字
        pageName : {
            type : String,
            required : true
        },
        data : {
            //该页面所属的平台类型
            platform : {
                type : String,
                enum : [ 'mobile', 'pc', 'responsive' ],
                default : 'mobile'
            },
            //该页面使用的模板ID
            templateId : {
                type : String,
                required : true
            },
            //用户访问页面时,看到的title
            title : {
                type : String,
                required : true,
                default : '新页面'
            },
            //该页面包含的组件树JSON
            components : {
                type : mongoose.Schema.Types.Mixed
            }
        },
        //最后修改文章内容的用户ID
        editUserId : {
            type : String,
            required : true
        },
        //最后发布文章的用户ID
        publishUserId : {
            type : String,
            default : null
        },
        //最后发布日期
        publishedAt : {
            type : Date,
            default : null
        }

    },
    {
        versionKey: false,
        minimize : false,
        collection : 'pages',
        timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
    }
);




///////////////////// 静态方法   /////////////////////////

/**
 * 判断某个页面名称, 在某栏目下, 是否已经存在
 * @param pageName {string}
 * @param channelId {string}
 * @returns {boolean}
 */
pageSchema.statics.isNameExist = async function( pageName, channelId ){

    pageName = ( pageName || '' ) .trim();

    const Page = mongoose.model('Page');

    let obj = await Page.findOne( { channelId : channelId, pageName : pageName} ).exec();

    return !! obj;

};


/**
 * 生成一篇文章的惟一ID
 * 此方法是 async 的, 考虑到可能会含有异步操作
 * @returns {string} 页面惟一ID
 */
pageSchema.statics.generatePageId = async function(){
    return ( new mongoose.Types.ObjectId() ).toString();
};

/**
 * 获取某个栏目下, 总的文章个数
 * @param channelId {string} 栏目ID
 * @returns {number} 该栏目下的总文章个数
 */
pageSchema.statics.getPageNumberOfChannel = async function( channelId ){

    let num = 0;

    const Page = mongoose.model('Page');

    let out = await Page.aggregate( [
        {
            $match : {
                channelId : channelId,
                publishUserId : null
            }
        },
        {
            $project : {
                channelId : 1,
                pageId : 1
            }
        },
        {
            $sort : {
                //按创建时间倒序排列
                createdAt : -1
            }
        },
        {
            $group : {
                _id : "$pageId",
                channelId : { $first : "$channelId" }
            }
        }
    ] ).exec();

    num = out.length;

    return num;
};

/**
 * 获取某个栏目下, [start, start+num) 区间内的页面数据
 * 只返回每个文章最近一次修改的 _id, channelId, pageId, pageName 字段
 * @param channelId {string} 栏目ID
 * @param start {int} 起始位置
 * @param num {int} 返回个数
 * @returns {Array}
 */
pageSchema.statics.getPageList = async function( channelId, start, num ){

    let out = [];

    const Page = mongoose.model('Page');

    out = await Page.aggregate( [
        {
            $match : {
                channelId : channelId,
                publishUserId : null
            }
        },
        {
            $project : {
                _id : 1,
                channelId : 1,
                pageId : 1,
                pageName : 1,
                createdAt : 1
            }
        },
        {
            $sort : {
                //按创建时间倒序排列
                createdAt : -1
            }
        },
        {
            $group : {
                _id : "$pageId",
                channelId : { $first : "$channelId" },
                pageId : { $first : "$pageId" },
                recordId : { $first : "$_id" },
                pageName : { $first : "$pageName" },
                createdAt: {$first: "$createdAt"}
            }
        },
        {
            $sort: {
                //按创建时间倒序排列
                createdAt: -1
            }
        },
        {
            $skip : start
        },
        {
            $limit : num
        }
    ] ).exec();

    return out;
};


/**
 * 获取某个页面的所有历史修改记录
 * @param pageId {string}
 * @returns {Array} 历史修改记录, 按时间倒序
 */
pageSchema.statics.getEditHistory = async function( pageId ){

    let out = [];

    const Page = mongoose.model('Page');
    const User = mongoose.model('User');

    let arr = await Page.find({ pageId : pageId }).sort( { createdAt : -1 } ).lean( true );

    out = await Promise.all( arr.map( function( page, index ){

        //查找编辑的用户和发布的用户
        let arr = [];

        arr.push( User.findOne({ _id : page.editUserId }).then( function( user ){
            if( user ){
                page.userName = user.userName;
            }else{
                page.userName = '未找到对应用户,可能已被系统删除';
            }
            page.editUser = user;
            return page;
        } ) );

        if( page.publishUserId ){
            //该修改记录被发布过, 查找发布的用户名
            arr.push( User.findOne({ _id : page.publishUserId }).then( function( user ){
                if( user ){
                    page.publishUserName = user.userName;
                }else{
                    page.publishUserName = '未找到对应用户,可能已被系统删除';
                }
                page.publishUser = user;
                return page;
            } ) );
        }

        return Promise.all( arr ).then( function( data ){
            return page;
        } );
    }  ) );

    return out;
};

/**
 * 获取某篇页面最新的内容
 * @param channelId {string} 该文章所属的栏目ID
 * @param pageId {string} 该页面的惟一ID
 * @returns {object} 文章数据
 */
pageSchema.statics.getLatestArticle = async function( channelId, pageId ){

    const Page = mongoose.model('Page');

    let page = await Page.find({ channelId : channelId, pageId : pageId, publishUserId : null })
        .sort({ updatedAt : -1})
        .limit(1)
        .lean(true);

    page = page[0];

    return page;

};



let Page = mongoose.model('Page', pageSchema );



module.exports = Page;