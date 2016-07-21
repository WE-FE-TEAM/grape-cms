/**
 * 文章在 mongodb 中的模型
 * Created by jess on 16/6/17.
 */



'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const cms = global.cms;


let dataSchema = new mongoose.Schema(
    {
        channelId: {
            type: String,
            required: true
        },
        //一条数据的惟一ID
        dataId: {
            type: String,
            required: true
        },
        dataName: {
            type: String,
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed
        },
        //最后修改文章内容的用户ID
        editUserId: {
            type: String
        },
        //最后发布文章的用户ID
        publishUserId: {
            type: String,
            default : null
        },
        //最后发布日期
        publishedAt: {
            type: Date,
            default: null
        }

    },
    {
        versionKey: false,
        minimize: false,
        collection: 'data',
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    }
);


///////////////////// 静态方法   /////////////////////////

/**
 * 判断某个文章名称, 在某栏目下, 是否已经存在
 * @param dataName {string}
 * @param channelId {string}
 * @returns {boolean}
 */
dataSchema.statics.isNameExist = async function (dataName, channelId) {

    dataName = ( dataName || '' ).trim();

    const Data = mongoose.model('Data');

    let obj = await Data.findOne({channelId: channelId, dataName: dataName}).exec();

    return !!obj;

};


///////////////////// 数据实例  上的方法  ///////////////////////

/**
 * 判断当前json数据的 实体 是否满足该栏目模板的定义
 */
dataSchema.methods.isDataValid = async function () {
    //TODO 后面考虑是否需要实现校验
    return true;
};


/**
 * 生成一条数据的惟一ID
 * 此方法是 async 的, 考虑到可能会含有异步操作
 * @returns {string} 文章惟一ID
 */
dataSchema.statics.generateDataId = async function () {
    return ( new mongoose.Types.ObjectId() ).toString();
};
/**
 * 获取某个栏目下, 总的json数据的个数
 * @param channelId {string} 栏目ID
 * @returns {number} 该栏目下的总文章个数
 */

dataSchema.statics.getDataNumberOfChannel = async function (channelId) {

    let num = 0;

    const Data = mongoose.model('Data');

    let out = await Data.aggregate([
        {
            $match: {
                channelId: channelId
            }
        },
        {
            $project: {
                channelId: 1,
                dataId: 1
            }
        },
        {
            $sort: {
                //按创建时间倒序排列
                createdAt: -1
            }
        },
        {
            $group: {
                _id: "$dataId",
                channelId: {$first: "$channelId"}
            }
        }
    ]).exec();


    num = out.length;

    return num;
};
/**
 * 获取某个栏目下, [start, start+num) 区间内的json数据
 * 只返回每个文章最近一次修改的 _id, channelId, dataId, dataName 字段
 * @param channelId {string} 栏目ID
 * @param start {int} 起始位置
 * @param num {int} 返回个数
 * @returns {Array}
 */
dataSchema.statics.getDataList = async function (channelId, start, num) {

    let out = [];

    const Data = mongoose.model('Data');

    out = await Data.aggregate([
        {
            $match: {
                channelId: channelId
            }
        },
        {
            $project: {
                _id: 1,
                channelId: 1,
                dataId: 1,
                dataName: 1,
                createdAt: 1
            }
        },
        {
            $sort: {
                //按创建时间倒序排列
                createdAt: -1
            }
        },
        {
            $group: {
                _id: "$dataId",
                channelId: {$first: "$channelId"},
                dataId: {$first: "$dataId"},
                recordId: {$first: "$_id"},
                dataName: {$first: "$dataName"}
            }
        },
        {
            $skip: start
        },
        {
            $limit: num
        }
    ]).exec();

    return out;
};

/**
 * 获取某个文章的所有历史修改记录
 * @param dataId {string}
 * @returns {Array} 历史修改记录, 按时间倒序
 */
dataSchema.statics.getEditHistory = async function (dataId) {

    let out = [];

    const Data = mongoose.model('Data');
    const User = mongoose.model('User');

    let arr = await  Data.find({dataId: dataId}).sort({createdAt: -1}).lean(true);

    out = await Promise.all(arr.map(function (jsondata, index) {

        //查找编辑的用户和发布的用户
        let arr = [];
        arr.push(User.findOne({_id: jsondata.editUserId}).then(function (user) {
            if (user) {
                jsondata.userName = user.userName;
            } else {
                jsondata.userName = '未找到对应用户,可能已被系统删除';
            }
            jsondata.editUser = user;
            return jsondata;
        }));

        if (jsondata.publishUserId) {
            //该修改记录被发布过, 查找发布的用户名
            arr.push(User.findOne({_id: jsondata.publishUserId}).then(function (user) {
                if (user) {
                    jsondata.publishUserName = user.userName;
                } else {
                    jsondata.publishUserName = '未找到对应用户,可能已被系统删除';
                }
                jsondata.publishUser = user;
                return jsondata;
            }));
        }

        return Promise.all(arr).then(function (data) {
            return jsondata;
        });
    }));

    return out;
};

/**
 * 获取某篇文章最新的内容
 * @param channelId {string} 该文章所属的栏目ID
 * @param dataId {string} 该文章的惟一ID
 * @returns {object} 文章数据
 */
dataSchema.statics.getLatestData = async function (channelId, dataId) {

    const Data = mongoose.model('Data');

    let mjsondata = await Data.find({channelId: channelId, dataId: dataId, publishUserId : null})
        .sort({createdAt: -1})
        .limit(1)
        .lean(true);

    mjsondata = mjsondata[0];

    return mjsondata;

};


let Data = mongoose.model('Data', dataSchema);


module.exports = Data;