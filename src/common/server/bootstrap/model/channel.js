/**
 * 栏目
 * Created by jess on 16/6/6.
 */

'use strict';

const mongoose = require('mongoose');

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
            enum : [ 'container', 'article', 'json', 'asset_upload' ],
            default : 'container'
        },
        articleTemplate : {},
        parentId : {
            type : mongoose.Schema.Types.ObjectId
        },
        children : [ mongoose.Schema.Types.ObjectId ]
    },
    {
        collection : 'channels'
    }
);


let Channel = mongoose.model('Channel', channelSchema );



module.exports = Channel;