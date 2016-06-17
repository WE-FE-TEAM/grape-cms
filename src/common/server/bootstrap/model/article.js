/**
 * 文章在 mongodb 中的模型
 * Created by jess on 16/6/17.
 */



'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cms = global.cms;


let articleSchema = new mongoose.Schema(
    {
        channelId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        articleName : {
            type : String,
            required : true
        },
        data : {
            type : mongoose.Schema.Types.Mixed
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