/**
 * 栏目
 * Created by jess on 16/6/6.
 */

'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//整个后台系统, 也当做是一个栏目来处理, 根栏目, 直接固定该栏目的

let channelSchema = new mongoose.Schema(
    {
        channelName : {
            type : String,
            required : true,
            index : {
                unique : true,
                background : false
            }
        },
        channelType : {
            type : String,
            enum : [ 'container', 'article', 'data', 'resource', 'channelManage', 'roleManage', 'userManage' ],
            default : 'container'
        },
        articleTemplate : {},
        parentId : {
            type : mongoose.Schema.Types.ObjectId
        }
        // children : [ mongoose.Schema.Types.ObjectId ]
    },
    {
        collection : 'channels',
        timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
    }
);


///////////////////// 静态方法  ///////////////////

/**
 * 获取某个_id下的所有子孙栏目数据
 * @param parentId {string} 要查找的父节点ID
 * @returns {Array}
 */
channelSchema.statics.getSubChannels = async function( parentId ){

    let out = [];
    let Channel = mongoose.model('Channel' );
    let temp = await Channel.find({ parentId : ( parentId) }).lean(true);


    out = await Promise.all( temp.map( ( channel ) => {

        //mongoose 不允许直接在 document 上增加属性, 因此必须转成 JSON !!!!
        //因为上线find时, 继续调用了  lean ,所以已经转成 JSON 了
        // channel = channel.toJSON();
        channel.realUrl = cms.utils.getChannelRealUrl( channel.url );

        return Channel.getSubChannels( channel._id ).then( ( children ) => {
            channel.children = children;
            return channel;
        });
    } ) );

    return out;
};

/**
 * 获取某个 栏目以及其包含的所有子孙栏目 的完整JSON树
 * @param channelId {string} 栏目ID
 * @returns {*}
 */
channelSchema.statics.getChannelTree = async function( channelId ){
    let out = null;
    let Channel = mongoose.model('Channel' );


    let temp = await Promise.all( [ Channel.findOne({ _id : channelId }).lean(true), Channel.getSubChannels( channelId ) ] );

    if( temp[0] ){
        out = temp[0];
        out.children = temp[1] || [];
    }

    return out;
};


let Channel = mongoose.model('Channel', channelSchema );



module.exports = Channel;