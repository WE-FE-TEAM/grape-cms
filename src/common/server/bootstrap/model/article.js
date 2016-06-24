/**
 * 文章在 mongodb 中的模型
 * Created by jess on 16/6/17.
 */



'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const cms = global.cms;

///////////////////////  重要说明   ////////////////////////////
/*

由于要保存每篇文章每次的修改记录, articles 表中的一条 document ,只是代表对文章的一次修改记录.
因此, 每个修改记录, 都需要对应到该文章的惟一ID, 即 articleId .
系统自动插入的 _id, 仅代表该次修改记录的ID.

*/
//////////////////////////////////////////////////////////////

let articleSchema = new mongoose.Schema(
    {
        channelId : {
            type : String,
            required : true
        },
        //一篇文章的惟一ID
        articleId : {
            type : String,
            required : true
        },
        articleName : {
            type : String,
            required : true
        },
        //文章发布上线之后, 访问的URL
        // onlineUrl : {
        //     type : String,
        //     default : ''
        // },
        data : {
            type : mongoose.Schema.Types.Mixed
        },
        //最后修改文章内容的用户ID
        editUserId : {
            type : String,
            required : true
        },
        //最后发布文章的用户ID
        publishUserId : {
            type : String
        },
        //最后发布日期
        publishedAt : {
            type : Date,
            default : null
        }

    },
    {
        minimize : false,
        collection : 'articles',
        timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
    }
);




///////////////////// 静态方法   /////////////////////////

/**
 * 判断某个文章名称, 在某栏目下, 是否已经存在
 * @param articleName {string}
 * @param channelId {string}
 * @returns {boolean}
 */
articleSchema.statics.isNameExist = async function( articleName, channelId ){

    articleName = ( articleName || '' ) .trim();

    const Article = mongoose.model('Article');

    let obj = await Article.findOne( { channelId : channelId, articleName : articleName} ).exec();

    return !! obj;

};

/**
 * 生成一篇文章的惟一ID
 * 此方法是 async 的, 考虑到可能会含有异步操作
 * @returns {string} 文章惟一ID
 */
articleSchema.statics.generateArticleId = async function(){
    return ( new mongoose.Types.ObjectId() ).toString();
};

/**
 * 获取某个栏目下, 总的文章个数
 * @param channelId {string} 栏目ID
 * @returns {number} 该栏目下的总文章个数
 */
articleSchema.statics.getArticleNumberOfChannel = async function( channelId ){

    let num = 0;

    const Article = mongoose.model('Article');

    let out = await Article.aggregate( [
        {
            $match : {
                channelId : channelId
            }
        },
        {
            $project : {
                channelId : 1,
                articleId : 1
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
                _id : "$articleId",
                channelId : { $first : "$channelId" }
            }
        }
    ] ).exec();

    num = out.length;

    return num;
};

/**
 * 获取某个栏目下, [start, start+num) 区间内的文章数据
 * 只返回每个文章最近一次修改的 _id, channelId, articleId, articleName 字段
 * @param channelId {string} 栏目ID
 * @param start {int} 起始位置
 * @param num {int} 返回个数
 * @returns {Array}
 */
articleSchema.statics.getArticleList = async function( channelId, start, num ){

    let out = [];

    const Article = mongoose.model('Article');

    out = await Article.aggregate( [
        {
            $match : {
                channelId : channelId
            }
        },
        {
            $project : {
                _id : 1,
                channelId : 1,
                articleId : 1,
                articleName : 1,
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
                _id : "$articleId",
                channelId : { $first : "$channelId" },
                articleId : { $first : "$articleId" },
                recordId : { $first : "$_id" },
                articleName : { $first : "$articleName" }
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
 * 获取某个文章的所有历史修改记录
 * @param articleId {string}
 * @returns {Array} 历史修改记录, 按时间倒序
 */
articleSchema.statics.getEditHistory = async function( articleId ){

    let out = [];

    const Article = mongoose.model('Article');
    const User = mongoose.model('User');

    let arr = await Article.find({ articleId : articleId }).sort( { createdAt : -1 } ).lean( true );

    out = await Promise.all( arr.map( function( article, index ){
        return User.findOne({ _id : article.editUserId }).then( function( user ){
            if( user ){
                article.userName = user.userName;
            }else{
                article.userName = '未找到对应用户,可能已被系统删除';
            }
            return article;
        } );
    }  ) );

    return out;
};

/**
 * 获取某篇文章最新的内容
 * @param channelId {string} 该文章所属的栏目ID
 * @param articleId {string} 该文章的惟一ID
 * @returns {object} 文章数据
 */
articleSchema.statics.getLatestArticle = async function( channelId, articleId ){

    const Article = mongoose.model('Article');

    let article = await Article.find({ channelId : channelId, articleId : articleId })
        .sort({ createdAt : -1})
        .limit(1)
        .lean(true);

    article = article[0];

    return article;

};

///////////////////// 文章实例  上的方法  ///////////////////////

/**
 * 判断当前文章的 实体数据  是否满足该栏目模板的定义
 */
articleSchema.methods.isDataValid = async function(){
    //TODO 后面考虑是否需要实现校验
    return true;
};


let Article = mongoose.model('Article', articleSchema );



module.exports = Article;