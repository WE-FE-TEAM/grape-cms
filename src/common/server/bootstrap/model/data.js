/**
 * 文章在 mongodb 中的模型
 * Created by jess on 16/6/17.
 */



'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cms = global.cms;


let dataSchema = new mongoose.Schema(
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
        },
        //最后修改文章内容的用户ID
        editUserId : {
            type : String
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
        collection : 'data',
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
dataSchema.statics.isNameExist = async function( articleName, channelId ){

    articleName = ( articleName || '' ) .trim();

    const Data = mongoose.model('Data');

    let obj = await Data.findOne( { channelId : channelId, articleName : articleName} ).exec();

    return !! obj;

};


///////////////////// 文章实例  上的方法  ///////////////////////

/**
 * 判断当前文章的 实体数据  是否满足该栏目模板的定义
 */
dataSchema.methods.isDataValid = async function(){
    //TODO 后面考虑是否需要实现校验
    return true;
};


let Data = mongoose.model('Data', dataSchema );



module.exports = Data;