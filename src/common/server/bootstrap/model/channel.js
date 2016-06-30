/**
 * 栏目
 * Created by jess on 16/6/6.
 */

'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cms = global.cms;

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
        //文章栏目, 具有此字段, 用来生成文章编辑时需要填写的内容
        articleTemplate : {
            type : mongoose.Schema.Types.Mixed
        },
        dataTemplate:{
            type : mongoose.Schema.Types.Mixed
        },
        //文章发布上线之后, 访问的URL
        onlineUrl : {
            type : String,
            default : ''
        },
        parentId : {
            type : mongoose.Schema.Types.ObjectId
        }
        // children : [ mongoose.Schema.Types.ObjectId ]
    },
    {
        minimize : false,
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
 * 根据channelId,找到其对应的所有祖先栏目
 * @param channelId {string} 要查找祖先栏目ID的栏目
 * @return {array} 从根栏目ID,到 channelId 的所有栏目
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


/**
 * 从频道树的JSON中, 遍历取出所有的ID数组
 * @param data {object} 某一个栏目及其包含的所有子栏目数据
 * @returns {Array} 该栏目及其子孙栏目所有的ID数组
 */
function pickIdFromTree( data ){

    let out = [];

    if( data ){
        out.push( data._id );
        let children = data.children || [];
        children.forEach( function( obj ){
            let subList = pickIdFromTree( obj );
            out = out.concat( subList );
        } );
    }

    return out;
}

/**
 * 根据栏目ID, 获取包含其所有子孙栏目的ID数组
 * @param parentId {string} 栏目ID
 * @rerun {array}
 */
channelSchema.statics.getIdTree = async function( parentId ){

    let out = [];

    let Channel = mongoose.model('Channel' );

    let wholeTree = await Channel.getChannelTree( parentId );

    if( wholeTree ){
        //成功获取到parentId及其包含的所有
        out = pickIdFromTree( wholeTree );
    }

    return out;
};

/**
 * 删除channelId对应的栏目, 包括其下面的所有子孙栏目, 以及所有这些栏目下的文章/数据/文件
 * @param channelId {string}
 * @returns {boolean}
 */
channelSchema.statics.deleteChannelById = async function( channelId ){

    let out = false;

    let Channel = mongoose.model('Channel' );
    let Role = mongoose.model('Role');

    //获取到该栏目包含的所有子孙栏目ID
    let idList = await Channel.getIdTree( channelId );
    
    if( idList && idList.length > 0 ){
        //从栏目表中, 删除所有ID
        let temp = await Channel.remove({ _id : { $in : idList } });    
        
        //从角色表中, 删除所有的栏目ID字段
        let unsetMap = {};
        idList.forEach( function( id ){
            unsetMap[`permissions.${id}`] = '';
        });
        let temp2 = await Role.update( {}, { $unset : unsetMap } ).exec();
        
        //TODO 从文章表中, 删除所有属于这些栏目下的文章
        //TODO 从数据表中, 删除所有属于这些栏目下的数据
        //TODO 从文件上传表中, 删除所有属于这些栏目下的文件
        
        out = true;
    }
    
    
    return out;
};




/************     下面是栏目实例的方法     *************/


/**
 * 判断当前栏目, 是否可以进行某个操作
 * @param operationName {string} 操作名
 * @returns {boolean}
 */
channelSchema.methods.isOperationValid = function( operationName ){
    
    const utils = cms.utils;
    
    let out = false;
    
    let channelType = this.channelType;

    let supportedOperationList = utils.getChannelSupportedOperationList( channelType );

    out = supportedOperationList.indexOf( operationName ) >= 0;
    
    return out;
};



let Channel = mongoose.model('Channel', channelSchema );



module.exports = Channel;