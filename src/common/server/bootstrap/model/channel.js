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
        url : {
            type : String  ,
            required : true
        },
        articleTemplate : {
            type : String
        },
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
        channel.realUrl = cms.utils.getChannelRealUrl( channel );

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

    if( ! channelId ){
        return out;
    }


    let temp = await Promise.all( [ Channel.findOne({ _id : channelId }).lean(true), Channel.getSubChannels( channelId ) ] );

    if( temp[0] ){
        out = temp[0];
        out.children = temp[1] || [];
    }

    return out;
};

/**
 * 根据channelId,找到其对应的所有祖先栏目的ID路径
 * @param channelId {string} 要查找祖先栏目ID的栏目
 * @return {array} 从根栏目ID,到 channelId 的所有栏目ID
 */
channelSchema.statics.getChannelPath = async function( channelId ){

    channelId = channelId.toString();

    let Channel = mongoose.model('Channel' );

    let out = [  ];

    if( ! channelId ){
        return out;
    }

    let channel = await Channel.findOne({ _id : channelId }).lean( true );

    if( channel ){

        out.push( channel );

        if( channel.parentId ){
            let parentPath = await Channel.getChannelPath( channel.parentId );
            out = out.concat( parentPath );
        }

    }


    return out;
};

/**
 * 判断用户添加的栏目类型, 是否合法. 用户只能添加 普通栏目, 系统级栏目, 不允许  添加
 * @param channelType {string}
 * @returns {boolean}
 */
channelSchema.statics.isChannelTypeValida = function( channelType ){
    const validArr = [ 'container', 'article', 'data', 'resource' ];
    return validArr.indexOf( channelType ) >= 0;
};

/**
 * 判断channelId的直接子栏目中, 是否存在同名的栏目
 * @param parentId {string} 父级栏目ID
 * @param channelName {string} 栏目名
 * @returns {boolean}
 */
channelSchema.statics.isNameExist = async function( parentId, channelName ){

    channelName = channelName.trim();

    let Channel = mongoose.model('Channel' );

    let out = false;

    let temp = await Channel.findOne({ parentId : parentId, channelName : channelName }).exec();

    if( temp ){
        //已经存在同名的栏目
        out = true;
    }

    return out;
};

/**
 * 根据栏目类型, 返回 查看栏目对应的URL
 * @param channelType {string} 栏目类型
 * @returns {string} 查看该类型栏目的URL
 */
channelSchema.statics.getChannelUrlByType = function( channelType ){

    let url = '';

    const type2urlMap = {
        container : 'dash/channel/view',
        article : 'dash/channel/view',
        data : 'dash/channel/view',
        resource : 'dash/channel/view',

        //下面是系统级的栏目类型
        channelManage : 'dash/home/channelManage',
        roleManage : 'dash/home/roleManage',
        userManage : 'dash/home/userManage'
    };

    url = type2urlMap[channelType] || '';

    return url;
};

/**
 * 判断栏目类型是否为  文章栏目
 * @param channelType {string}
 * @returns {boolean}
 */
channelSchema.statics.isArticleChannel = function( channelType ){
    return channelType === 'article';
};

let Channel = mongoose.model('Channel', channelSchema );



module.exports = Channel;