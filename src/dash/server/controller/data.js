/**
 * json数据相关的action
 * Created on 16/6/23.
 */


'use strict';


const ControllerBase = grape.get('controller_base');

const cms = global.cms;

const cmsUtils = cms.utils;


class DataController extends ControllerBase {

    //同步接口: 显示 新增json数据/编辑json数据  页面
    async addAction() {

        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);
        // let json = await cmsUtils.getDefaultJSON();
        // console.log("add action json" + json + "json" + JSON.stringify(json));

        http.assign('channel', channel);
        http.assign('action', 'add');
        http.render('dash/page/data/edit-data/edit-data.tpl');

    }

    //异步接口: 添加数据
    async doAddAction() {

        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let dataName = ( body.dataName || '').trim();
        let data = ( body.data || '').trim();

        if (!dataName) {
            return http.error(`JSON数据后台显示标题 必填!! dataName`);
        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            return http.error(`数据内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        //判断该栏目下, 是否存在同名的json数据
        let out = await Data.isNameExist(dataName, channelId);

        if (out) {
            return http.error(`该栏目下已经存在同名的文章: ${dataName}`);
        }
        let jsonSchema = channel.articleTemplate;

        if (jsonSchema) {
            let errors = cmsUtils.validateJSON(data, jsonSchema);

            if (errors && errors.length > 0) {
                grape.console.log(errors);
                let error = errors[0];
                return http.error(`JSON数据格式有误: ${error.dataPath} ${error.message}`);
            }
        }

        //生成一个新的dataID
        let dataId = await Data.generateDataId();


        let jsonData = new Data({
            channelId: channelId,
            dataId: dataId,
            dataName: dataName,
            editUserId: user._id.toString(),
            data: data
        });

        let result = null;

        try {
            result = await jsonData.save();

        } catch (e) {
            grape.log.warn(e);
            return http.error(`保存文章异常`, e);
        }

        return http.json({
            status: 0,
            message: '创建文章成功',
            data: result
        });


    }

    //同步接口 查看数据
    async viewAction() {
        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'view');

        http.render('dash/page/data/edit-data/edit-data.tpl');
    }

    //异步接口: 获取所有 [ start, start + num ) 区间内的数据列表, 按照创建时间升序排序
    async listAction() {

        let http = this.http;

        const Data = this.model('Data');

        let query = http.req.query;

        let channelId = http.getChannelId();

        let start = parseInt(query.start, 10);
        let num = parseInt(query.num, 10);

        if (isNaN(start)
            || start < 0
            || isNaN(num)
            || num <= 0
        ) {
            return http.error('start  num 参数 必须 >= 0 !!');
        }

        let total = 0;
        let list = [];

        try {
            let arr = await Promise.all([
                Data.getDataNumberOfChannel(channelId),
                Data.getDataList(channelId, start, num)
                //
                // Data.find({channelId: channelId}, {articleName: true}).sort({createdAt: 1}).count().exec(),
                // Data.find({channelId: channelId}, {articleName: true})
                //     .sort({createdAt: 1})
                //     .skip(start)
                //     .limit(num)
                //     .lean(true)
            ]);
            total = arr[0];
            list = arr[1];

        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取数据列表异常`, e);
        }

        let data = {
            total: total,
            start: start,
            num: num,
            list: list
        };

        http.json({
            status: 0,
            message: 'ok',
            data: data
        });

    }

    //异步接口: 获取某个指定数据的详情
    async detailAction() {

        let http = this.http;
        const Data = this.model('Data');
        let query = http.req.query;

        let channelId = http.getChannelId();

        let dataId = ( query.dataId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();


        if (!dataId) {
            return http.error(`json数据ID(dataId)必须指定!!`);
        }
        let jsonData = null;

        try {

            if (!recordId) {
                //未指定某次历史ID, 取最新的数据
                jsonData = await Data.getLatestData(channelId, dataId);
            } else {
                jsonData = await Data.findOne({channelId: channelId, _id: recordId}).lean(true);
            }

        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的数据详情出错!`, e);
        }
        if (jsonData) {
            jsonData.recordId = jsonData._id;
        }

        this.json({
            status: 0,
            message: 'ok',
            data: jsonData
        });

    }

    //同步接口: 渲染编辑页面
    async editAction() {

        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'edit');

        http.render('dash/page/data/edit-data/edit-data.tpl');

    }

    //异步接口: 更新json数据内容
    async doUpdateAction() {

        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let dataId = ( body.dataId || '' ).trim();
        let dataName = ( body.dataName || '').trim();
        let data = ( body.data || '').trim();

        if (!dataName) {
            return http.error(`数据后台显示标题 必填!! dataName`);
        }

        if (!dataId) {
            return http.error(`要编辑的数据ID, 不能为空!!!`);
        }

        try {
            data = JSON.parse(data);

        } catch (e) {
            return http.error(`文章内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }
        let jsonSchema = channel.articleTemplate;

        if (jsonSchema) {
            let errors = cmsUtils.validateJSON(data, jsonSchema);

            if (errors && errors.length > 0) {
                grape.console.log(errors);
                let error = errors[0];
                return http.error(`JSON数据格式有误: ${error.dataPath} ${error.message}`);
            }
        }


        let mjsondata = null;

        try {
            mjsondata = await Data.findOne({channelId: channelId, dataId: dataId, publishUserId: null}).exec();
        } catch (e) {
            grape.log.warn(e);
            return http.error(`查找指定的json数据异常`, e);
        }

        if (dataName !== mjsondata.dataName) {
            //判断该栏目下, 是否存在同名的 文章
            let out = await Data.isNameExist(dataName, channelId);

            if (out) {
                return http.error(`该栏目下已经存在同名的数据: ${dataName}`);
            }
        }

        // let DataNew = new Data({
        //     channelId: channelId,
        //     dataId: dataId,
        //     dataName: dataName,
        //     editUserId: user._id.toString(),
        //     data: data
        // });
        mjsondata.set('dataName', dataName);
        mjsondata.set('editUserId', user._id.toString());
        mjsondata.set('data', data);

        let result = null;

        try {
            result = await mjsondata.save();

        } catch (e) {
            return http.error(`保存json数据异常`, e);
        }

        return http.json({
            status: 0,
            message: '更新数据成功',
            data: result
        });


    }

    //异步接口: 删除数据
    async doDeleteAction() {
        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let dataId = ( body.dataId || '' ).trim();

        if (!dataId) {
            return http.error(`要删除的数据ID(dataId), 不能为空!!!`);
        }

        try {
            let result = await Data.remove({channelId: channelId, dataId: dataId}).exec();
            this.json({
                status: 0,
                message: '成功删除数据, 以及该json数据所有的历史记录',
                data: result
            });
        } catch (e) {
            grape.log.warn(e);
            http.error('删除数据失败', e);
        }

    }

    async getEditHistoryAction() {

        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.query;

        let user = http.getUser();

        let dataId = ( body.dataId || '' ).trim();

        if (!dataId) {
            return http.error(`数据ID( dataId ), 不能为空!!!`);
        }

        let result = await Data.getEditHistory(dataId);

        this.json({
            status: 0,
            message: 'ok',
            data: result
        });
    }

    //异步接口: 发布数据到线上, 用户可以发布json数据的某一次编辑内容
    //每次发布, 都会插入一条新的历史记录
    async doPublishAction() {
        const Channel = this.model('Channel');
        const Data = this.model('Data');
        const SearchRaw = this.model('SearchRaw');
        let http = this.http;

        let user = http.getUser();

        let query = http.req.body;

        let channelId = http.getChannelId();
        let dataId = ( query.dataId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();
        let releaseType = ( query.releaseType || '').trim();


        if (!dataId || !recordId || !releaseType) {
            return http.error(`数据ID( dataId, recordId ),发布类型(releaseType)必须指定!!`);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }
        let jsondata = null;
        try {
            jsondata = await Data.findOne({channelId: channelId, _id: recordId}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的数据详情出错!`, e);
        }

        if (!jsondata) {
            return http.error(`找不到数据ID[${dataId}][${recordId}]对应的数据`);
        }

        try {
            let result = await cmsUtils.releaseData(jsondata, releaseType);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`发布文章异常`, e);
        }

        let data = null;

        //如果是正式发布, 需要插入一条新的记录
        if (releaseType === 'publish') {
            let record = new Data({
                channelId: jsondata.channelId,
                dataId: jsondata.dataId,
                dataName: jsondata.dataName,
                editUserId: jsondata.editUserId,
                data: jsondata.data,
                publishUserId: user._id,
                publishedAt: new Date()
            });
            try {
                data = await record.save();
            } catch (e) {
                return http.error(`保存发布记录失败`, e);
            }

            let sdata = null;
            let searchR = await SearchRaw.findOne({resourceId: jsondata.dataId, resourceType: "data"}).exec();
            let searchData = null;
            if (searchR) {
                searchData = searchR;
                searchData.set("resourceName", jsondata.dataName);
                searchData.set("data", jsondata.data);
            } else {
                let url = (channel.onlineUrl || '').trim();
                url = url.replace(/\{\{dataId\}\}/g, jsondata.dataId);
                let category = (channel.category || '').trim();
                let section = (channel.section || '').trim();
                searchData = new SearchRaw({
                    resourceName: jsondata.dataName,
                    resourceType: "data",
                    resourceId: jsondata.dataId,
                    accessUrl: url,
                    data: jsondata.data,
                    section: section,
                    category: category
                });
            }

            try {
                sdata = await searchData.save();
            } catch (e) {
                return http.error(`保存数据searchRaw记录失败`, e);
            }
        }

        this.json({
            status: 0,
            message: '发布文章成功',
            data: data
        });


    }

    //获取某个数据当前发布在硬盘上的数据内容
    async currentReleaseAction() {

        const Data = this.model('Data');

        let http = this.http;

        let res = http.res;

        let query = http.req.query;

        let dataId = ( query.dataId || '' ).trim();
        let releaseType = ( query.releaseType || 'publish' ).trim();

        let jsonObj = null;

        try {
            jsonObj = await Data.findOne({dataId: dataId, publishUserId: null}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return res.end(e.stack);
        }

        if (!jsonObj) {
            return res.end(`未找到dataId=${dataId}的JSON数据`);
        }

        let filePath = cmsUtils.getDataReleaseFileName(jsonObj, releaseType);

        let content = '';
        let status = 0;
        let message = '';

        try {
            content = await cmsUtils.readFile(filePath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                status = 1;
                content = 'JSON数据未发布';
            } else {
                grape.log.warn(e);
                return res.end(e);
            }
        }

        res.end(content);

    }
}


module.exports = DataController;