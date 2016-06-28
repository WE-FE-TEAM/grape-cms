/**
 * 文章 相关的action
 * Created  on 16/6/23.
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

        http.assign('channel', channel);
        http.assign('action', 'add');

        http.render('dash/page/data/edit-data/edit-data.tpl');

    }

    //异步接口: 添加文章
    async doAddAction() {

        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let dataName = ( body.dataName || '').trim();
        let data = ( body.data || '').trim();
        console.log("doadd action>>>>" + data);
        if (!dataName) {
            return http.error(`JSON数据后台显示标题 必填!! articleName`);
        }

        try {
            data = JSON.parse(data);
            console.log("doadd action>>>>jsonparse~!!!!!!!" + data);
        } catch (e) {
            return http.error(`数据内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        //判断该栏目下, 是否存在同名的 文章
        let out = await Data.isNameExist(dataName, channelId);

        if (out) {
            return http.error(`该栏目下已经存在同名的文章: ${dataName}`);
        }
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
            return http.error(`保存文章异常`, e);
        }

        return http.json({
            status: 0,
            message: '创建文章成功',
            data: result
        });


    }

    viewAction() {
        this.http.res.end('查看文章页面');
    }

    //异步接口: 获取所有 [ start, start + num ) 区间内的文章列表, 按照创建时间升序排序
    async listAction() {

        let http = this.http;

        const Data = this.model('Data');

        let query = http.req.query;

        let channelId = http.getChannelId();

        let start = parseInt(query.start, 10);
        let num = parseInt(query.num, 10);
        console.log("list action in data.js" + channelId + num + start);
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
            return http.error(`获取文章列表异常`, e);
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

    //异步接口: 获取某个指定文章的详情数据
    async detailAction() {
        console.log("detail action in controller");
        let http = this.http;
        const Data = this.model('Data');
        let query = http.req.query;

        let channelId = http.getChannelId();

        let dataId = ( query.dataId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();

        console.log("dataid" + dataId + "channeldId");
        if (!dataId) {
            return http.error(`文章ID(articleId)必须指定!!`);
        }
        let jsonData = null;

        try {

            if (!recordId) {
                //未指定某次历史ID, 取最新的数据
                jsonData = await Data.getLatestData(channelId, dataId);
            } else {
                jsonData = await Data.findOne({channelId: channelId, dataId: dataId}).lean(true);
            }
            console.log("jsondata" + jsonData);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的文章详情出错!`, e);
        }

        console.log("jsondata" + jsonData);
        this.json({
            status: 0,
            message: 'ok',
            data: jsonData
        });

    }

    //同步接口: 渲染编辑文章页面
    async editAction() {

        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'edit');

        http.render('dash/page/data/edit-data/edit-data.tpl');

    }

    //异步接口: 更新文章内容
    async doUpdateAction() {
        console.log("doupdate");
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
            return http.error(`文章后台显示标题 必填!! articleName`);
        }

        if (!dataId) {
            return http.error(`要编辑的文章ID, 不能为空!!!`);
        }

        try {
            data = JSON.parse(data);
            console.log(data + "update action");
        } catch (e) {
            return http.error(`文章内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        let mjsondata = null;

        try {
            mjsondata = await Data.findOne({channelId: channelId, dataId: dataId}).exec();
        } catch (e) {
            grape.log.warn(e);
            return http.error(`查找指定的文章异常`, e);
        }

        if (dataName !== mjsondata.dataName) {
            //判断该栏目下, 是否存在同名的 文章
            let out = await Data.isNameExist(dataName, channelId);

            if (out) {
                return http.error(`该栏目下已经存在同名的文章: ${dataName}`);
            }
        }

        let DataNew = new Data({
            channelId: channelId,
            dataId: dataId,
            dataName: dataName,
            editUserId: user._id.toString(),
            data: data
        });

        let result = null;

        try {
            result = await DataNew.save();

        } catch (e) {
            return http.error(`保存文章异常`, e);
        }

        return http.json({
            status: 0,
            message: '更新文章成功',
            data: result
        });


    }

    //异步接口: 删除文章
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
                message: '成功删除文章, 以及该文章所有的历史记录',
                data: result
            });
        } catch (e) {
            grape.log.warn(e);
            http.error('删除文章失败', e);
        }

    }

    async getEditHistoryAction() {

        const Channel = this.model('Channel');
        const Data = this.model('Data');

        let http = this.http;

        let body = http.req.query;

        let user = http.getUser();

        let dataId = ( body.dataId || '' ).trim();
        console.log("getedit history  action dataid====="+dataId);
        if (!dataId) {
            return http.error(`数据ID( dataId ), 不能为空!!!`);
        }

        let result = await Data.getEditHistory(dataId);
         console.log("result result  result"+JSON.stringify(result));
        this.json({
            status: 0,
            message: 'ok',
            data: result
        });
    }

    async doPublishAction() {
    }
}


module.exports = DataController;