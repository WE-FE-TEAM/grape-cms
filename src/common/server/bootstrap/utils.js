/**
 * CMS 工具函数
 * Created by jess on 16/6/6.
 */


'use strict';


const mongoose = require('mongoose');

const sysUtil = require('util');

const cms = global.cms;

const cmsConfig = grape.configManager.getConfig('cms');

const urlOperationGroupMap = cmsConfig.urlOperationGroupMap;

const channelTypeOperationMap = cmsConfig.channelTypeOperationMap;

const articleFieldTypes = cmsConfig.articleFieldTypes;

let utils = {};

cms.utils = utils;

module.exports = utils;


//根据URL来获取所属的 操作组 
utils.url2OperationGroup = function ( url ){
    return urlOperationGroupMap[url];
};

/**
 * 根据栏目类型, 获取该栏目支持的所有操作集合
 * @param channelType {string} 栏目类型
 * @returns {Array}
 */
utils.getChannelSupportedOperationList = function( channelType ){
    return channelTypeOperationMap[ channelType ] || [];
};


/**
 * 返回栏目真是的访问URL
 * @param channel {object} 某个栏目的数据
 * @return {string}
 */
utils.getChannelRealUrl = function( channel ){
    return cmsConfig.urlPrefix + channel.url + '?channelId=' + encodeURIComponent( channel._id.toString() );
};

/**
 * 根据一个URL解析出来的 module/controller/action 获取数据库中存储时,使用的对应字符串格式
 * @param module {string}
 * @param controller {string}
 * @param action {string}
 * @returns {string}
 */
utils.getActionPath = function( module, controller, action){
    return `${module}/${controller}/${action}`;
};


/**
 * 查找用户具有的所有有查看权限的 栏目 
 * @param user {object}
 * @returns {Array} 栏目ID数组
 */
utils.getUserAvailableChannelIds = async function( user ){

    let out = [];

    let User = mongoose.model('User');
    let Role = mongoose.model('Role');
    let Channel = mongoose.model('Channel');
    
    let result = await Channel.find({}).lean( true );

    if( ! user.isUserDisabled() ){
        if( user.isSuperAdmin() ){
            //超级用户具有所有权限
            out = result.map( (obj) => {
                return obj._id.toString();
            });
        }else{

            //普通用户, 获取到所有的权限
            let userPermissions = await user.getAllPermissions();
            
            //遍历所有的栏目, 找出用户有权限访问的
            result.forEach( ( channel ) => {

                let channelId = channel._id.toString();
                let viewOperationName = utils.url2OperationGroup( channel.url );

                let result = userPermissions[channelId];

                if( result && result.indexOf( viewOperationName ) >= 0 ){
                    out.push( channelId );
                }
            });
        }
    }


    return out;
};

/**
 * 获取某个 栏目 下, 用户有权限查看的所有 子孙 栏目
 * @param user {object}
 * @param channelId {string}
 */
utils.getUserAvailableChannelTree = async function( user, channelId){
    let out = null;

    let Channel = mongoose.model('Channel');

    let arr = await Promise.all( [ utils.getUserAvailableChannelIds( user ), Channel.getChannelTree( channelId ) ] );

    // console.log( JSON.stringify(arr) );

    if( arr[1] ){
        out = filterChannelTree( arr[1], arr[0] );
    }


    return out;
};

/**
 * 检查 channel 包含的 子栏目中, 属于 channelIdList 数组中的子栏目
 * @param channel {object} 包含 children 的栏目JSON
 * @param channelIdList {Array} 需要筛选出来的 栏目ID 数组
 * @return {object}
 */
function filterChannelTree( channel, channelIdList ){

    let result = Object.assign( {}, channel, {
        children : []
    } );
    
    let arr = channel.children || [];


    arr.forEach( ( childChannel ) => {
        let id = childChannel._id.toString();
        if( channelIdList.indexOf(  id ) >= 0 ){
            result.children.push( filterChannelTree( childChannel, channelIdList) );
        }
    });

    return result;
}

/**
 * 判断输入的文章模板, 是否合法
 * @param templateStr {string} 文章模板字符串
 * @returns {string}
 */
utils.isArticleTemplateValid = function( templateStr ){

    let out = '';

    let template = templateStr;

    if( sysUtil.isString( templateStr ) ){
        try{
            template = JSON.parse( templateStr );
        }catch(e){
            return e.message;
        }
    }

    if( ! sysUtil.isObject(template) ){
        return '文章模板必须是 {} 类型的JSON格式!';
    }

    let fields = template.fields;

    if( ! sysUtil.isArray( fields ) ){
        return '文章模板必须包含 fields 的数组字段!';
    }

    let keys = [];

    //禁止文章模板中出现的 key
    const forbiddenKeys = [ 'articleName' ];

    for( var i = 0, len = fields.length; i < len; i++ ){
        let conf = fields[i];
        let key = conf.key;
        let label = conf.label;
        let type = conf.type;

        if( ! key || ! label || ! type ){
            return `文章模板中, 单个输入域必须包含 key label type 3个字段!!`;
        }

        if( forbiddenKeys.indexOf(key) >= 0 ){
            return `文章模板中, 不能包含 这些key: [ ${ forbiddenKeys.join(' ') } ]`;
        }

        if( keys.indexOf(key) >= 0 ){
            return `文章模板中, 存在相同的 key[${key}] 字段!!`;
        }

        if( articleFieldTypes.indexOf(type) < 0 ){
            return `文章模板中, 存在非法的字段类型: ${type}`;
        }

        keys.push( key );
    }

    return out;
};