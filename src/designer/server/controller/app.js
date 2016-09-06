/**
 * Created by jess on 16/8/8.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


const cms = global.cms;

const cmsUtils = cms.utils;

class DesignerController extends ControllerBase{

    // drag and drop 的页面
    async createAction(){
        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'add');
        
        http.render('designer/page/editor/editor.tpl');
    }

    //异步接口: 添加页面
    async doAddAction() {

        const Channel = this.model('Channel');
        const Page = this.model('Page');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let pageName = ( body.pageName || '').trim();
        let data = ( body.data || '').trim();

        if (!pageName) {
            return http.error(`页面的后台显示标题 必填!! pageName`);
        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            return http.error(`页面内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        //判断该栏目下, 是否存在同名的 页面
        let out = await Page.isNameExist(pageName, channelId);

        if (out) {
            return http.error(`该栏目下已经存在同名的页面: ${pageName}`);
        }

        //生成一个新的页面ID
        let pageId = await Page.generatePageId();


        let page = new Page({
            channelId: channelId,
            pageId: pageId,
            pageName: pageName,
            editUserId: user._id.toString(),
            data: data
        });

        let result = null;

        try {
            result = await page.save();

        } catch (e) {
            grape.log.warn(e);
            return http.error(`保存页面异常`, e);
        }

        return http.json({
            status: 0,
            message: '创建页面成功',
            data: result
        });


    }

    //同步接口: 查看某个页面
    async viewAction() {
        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'view');

        http.render('designer/page/editor/editor.tpl');
    }

    //同步接口: 查看某个页面
    async editAction() {
        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'edit');

        http.render('designer/page/editor/editor.tpl');
    }

    //异步接口: 获取某个指定页面的详情数据
    async detailAction() {

        let http = this.http;

        const Page = this.model('Page');

        let query = http.req.query;

        let channelId = http.getChannelId();
        let pageId = ( query.pageId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();

        if (!pageId) {
            return http.error(`页面ID( pageId )必须指定!!`);
        }

        let page = null;

        try {

            if (!recordId) {
                //未指定某次历史ID, 取最新的数据
                page = await Page.getLatestPage(channelId, pageId);
            } else {
                page = await Page.findOne({channelId: channelId, _id: recordId}).lean(true);
            }

        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的页面详情出错!`, e);
        }

        if (page) {
            page.recordId = page._id;
        }

        this.json({
            status: 0,
            message: 'ok',
            data: page
        });
    }

    //异步接口: 获取所有 [ start, start + num ) 区间内的页面列表, 按照创建时间升序排序
    async listAction() {

        let http = this.http;

        const Page = this.model('Page');

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
                Page.getPageNumberOfChannel(channelId),
                Page.getPageList(channelId, start, num)
            ]);

            // let arr = await Promise.all( [
            //     Page.find({ channelId : channelId }, { pageName : true } ).sort({ createdAt : 1 }).count().exec(),
            //     Page.find({ channelId : channelId }, { pageName : true } )
            //         .sort({ createdAt : 1 })
            //         .skip( start )
            //         .limit( num )
            //         .lean(true)
            // ] );
            total = arr[0];
            list = arr[1];
        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取页面列表异常`, e);
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

    //异步接口: 更新页面内容
    async doUpdateAction() {

        const Channel = this.model('Channel');
        const Page = this.model('Page');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let pageId = ( body.pageId || '' ).trim();
        let pageName = ( body.pageName || '').trim();
        let data = ( body.data || '').trim();

        if (!pageName) {
            return http.error(`页面后台显示标题 必填!! pageName`);
        }

        if (!pageId) {
            return http.error(`要编辑的页面ID, 不能为空!!!`);
        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            return http.error(`页面内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        let page = null;

        try {
            page = await Page.findOne({channelId: channelId, pageId: pageId, publishUserId: null}).exec();
        } catch (e) {
            grape.log.warn(e);
            return http.error(`查找指定的页面异常`, e);
        }

        if (pageName !== page.pageName) {
            //判断该栏目下, 是否存在同名的 页面
            let out = await Page.isNameExist(pageName, channelId);

            if (out) {
                return http.error(`该栏目下已经存在同名的页面: ${pageName}`);
            }
        }

        // let articleNew = new Page({
        //     channelId : channelId,
        //     pageId : pageId,
        //     pageName : pageName,
        //     editUserId : user._id.toString(),
        //     data : data
        // });

        page.set('pageName', pageName);
        page.set('editUserId', user._id.toString());
        page.set('data', data);

        //强制标注为 已改变
        page.markModified('pageName');
        page.markModified('editUserId');
        page.markModified('data');

        let result = null;

        try {
            result = await page.save();

        } catch (e) {
            return http.error(`保存页面异常`, e);
        }

        return http.json({
            status: 0,
            message: '更新页面成功',
            data: result
        });
    }

    //异步接口: 删除页面
    async doDeleteAction() {

        const Channel = this.model('Channel');
        const Page = this.model('Page');
        

        let http = this.http;
        let body = http.req.body;

        let channelId = http.getChannelId();
        let pageId = ( body.pageId || '' ).trim();

        if (!pageId) {
            return http.error(`要删除的页面ID(pageId), 不能为空!!!`);
        }

        try {
            let result = await Page.remove({channelId: channelId, pageId: pageId}).exec();
            this.json({
                status: 0,
                message: '成功删除页面, 以及该页面所有的历史记录',
                data: result
            });
        } catch (e) {
            grape.log.warn(e);
            http.error('删除页面失败', e);
        }

    }

    //异步接口: 发布页面到线上, 用户可以发布页面的某一次编辑内容
    //每次发布, 都会插入一条新的历史记录
    async doPublishAction() {

        const Channel = this.model('Channel');
        const Page = this.model('Page');
        
        let http = this.http;

        let user = http.getUser();

        let query = http.req.body;
        let channelId = http.getChannelId();
        let pageId = ( query.pageId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();
        let releaseType = ( query.releaseType || '').trim();

        if (!pageId || !recordId || !releaseType) {
            return http.error(`页面ID( pageId, recordId ),发布类型(releaseType)必须指定!!`);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        let page = null;

        try {
            page = await Page.findOne({channelId: channelId, _id: recordId}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的页面详情出错!`, e);
        }

        if (!page) {
            return http.error(`找不到页面ID[${pageId}][${recordId}]对应的页面`);
        }

        try {
            let result = await cmsUtils.releasePage(page, releaseType);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`发布页面异常`, e);
        }

        let data = null;

        //如果是正式发布, 需要插入一条新的记录
        if (releaseType === 'publish') {
            let record = new Page({
                channelId: page.channelId,
                pageId: page.pageId,
                pageName: page.pageName,
                editUserId: page.editUserId,
                data: page.data,
                publishUserId: user._id,
                publishedAt: new Date()
            });
            try {
                data = await record.save();
            } catch (e) {
                return http.error(`保存发布记录失败`, e);
            }

        }
        
        let accessUrl = channel.onlineUrl || '';
        if( accessUrl ){
            accessUrl = accessUrl.replace(/\{\{pageId\}\}/g, encodeURIComponent(page.pageId) );
            if( releaseType !== 'publish' ){
                //预览页面, 需要加上预览参数
                accessUrl += accessUrl.indexOf('?') >= 0 ? '&' : '?';
                accessUrl += 'cmsPreview=1';
            }
        }
        
        this.json({
            status: 0,
            message: '发布页面成功',
            data: {
                pageUrl : accessUrl
            }
        });


    }

    //获取某个页面当前发布在硬盘上的数据内容
    async currentReleaseAction() {

        const Page = this.model('Page');

        let http = this.http;

        let res = http.res;

        let query = http.req.query;

        let pageId = ( query.pageId || '' ).trim();
        let releaseType = ( query.releaseType || 'publish' ).trim();

        let page = null;

        try {
            page = await Page.findOne({pageId: pageId, publishUserId: null}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return res.end(e.stack);
        }

        if (!page) {
            return res.end(`未找到pageId=${pageId}的页面数据`);
        }

        let filePath = cmsUtils.getPageReleaseFileName(page, releaseType);

        let content = '';
        let status = 0;
        let message = '';

        try {
            content = await cmsUtils.readFile(filePath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                status = 1;
                content = '页面未发布';
            } else {
                grape.log.warn(e);
                return res.end(e);
            }
        }

        res.end(content);
    }

}


module.exports = DesignerController;