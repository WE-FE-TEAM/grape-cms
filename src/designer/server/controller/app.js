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

        //判断该栏目下, 是否存在同名的 文章
        let out = await Page.isNameExist(pageName, channelId);

        if (out) {
            return http.error(`该栏目下已经存在同名的页面: ${pageName}`);
        }

        //生成一个新的文章ID
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

    //异步接口: 获取某个指定文章的详情数据
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

    //异步接口: 获取所有 [ start, start + num ) 区间内的文章列表, 按照创建时间升序排序
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
            //     Page.find({ channelId : channelId }, { articleName : true } ).sort({ createdAt : 1 }).count().exec(),
            //     Page.find({ channelId : channelId }, { articleName : true } )
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

    //异步接口: 更新文章内容
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
            //判断该栏目下, 是否存在同名的 文章
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

    //异步接口: 删除文章
    async doDeleteAction() {

        const Channel = this.model('Channel');
        const Page = this.model('Page');
        // const SearchRaw = this.model('SearchRaw');

        let http = this.http;
        let body = http.req.body;

        let channelId = http.getChannelId();
        let pageId = ( body.pageId || '' ).trim();

        if (!pageId) {
            return http.error(`要删除的页面ID(pageId), 不能为空!!!`);
        }


        // let channel = await Channel.findOne({_id: channelId}).exec();
        // let needSearch = channel.needSearch;
        // if (needSearch) {
        //     let page = await Page.find({channelId: channelId, pageId: pageId}).exec();
        //     if (page.length > 1) {
        //         let sdata = null;
        //         let searchData = await SearchRaw.findOne({resourceId: pageId, resourceType: "page"}).exec();
        //         if (searchData) {
        //             searchData.set("__is_search_enabled", 0);
        //             try {
        //                 sdata = await searchData.save();
        //             } catch (e) {
        //                 grape.log.error(`删除文章searchRaw记录失败` + e);
        //             }
        //         }
        //     }
        // }

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

}


module.exports = DesignerController;