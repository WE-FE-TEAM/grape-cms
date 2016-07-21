/**
 * 提供给搜索使用的数据model
 * Created by jess on 16/7/14.
 */


'use strict';


'use strict';

const mongoose = require('mongoose');

const cms = global.cms;

let searchRawSchema = new mongoose.Schema(
    {
        resourceName: {
            type: String,
            required: true
        },
        resourceType: {
            type: String,
            required: true,
            enum: ['article', 'data']
        },
        resourceId: {
            type: String,
            required: true
        },
        //该资源对外访问的URL
        accessUrl: {
            type: String,
            required: true
        },
        __is_search_enabled: {
            type: Number,
            required: true,
            default: 1,
            enum: [1, 0]
        },
        //文章栏目, 具有此字段, 用来生成文章编辑时需要填写的内容
        data: {
            type: mongoose.Schema.Types.Mixed
        },
        //提供给搜索使用的数据所属栏目层级关系
        section: {
            type: String,
            default: ''
        },
        category: {
            type: String,
            default: ''
        }
    },
    {
        versionKey: false,
        minimize: false,
        collection: 'searchRaw',
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    }
);

let SearchRaw = mongoose.model('SearchRaw', searchRawSchema);


module.exports = SearchRaw;
