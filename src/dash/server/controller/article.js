/**
 * 文章 相关的action
 * Created by jess on 16/6/7.
 */


'use strict';


const ControllerBase = grape.get('controller_base');

const cms = global.cms;

const cmsUtils = cms.utils;


class ArticleController extends ControllerBase {

    //同步接口: 显示 新增文章/编辑文章  页面
    async addAction() {

        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'add');

        http.render('dash/page/article/edit-article/edit-article.tpl');

    }

    //异步接口: 添加文章
    async doAddAction() {

        const Channel = this.model('Channel');
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleName = ( body.articleName || '').trim();
        let data = ( body.data || '').trim();

        if (!articleName) {
            return http.error(`文章后台显示标题 必填!! articleName`);
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

        //判断该栏目下, 是否存在同名的 文章
        let out = await Article.isNameExist(articleName, channelId);

        if (out) {
            return http.error(`该栏目下已经存在同名的文章: ${articleName}`);
        }

        //生成一个新的文章ID
        let articleId = await Article.generateArticleId();


        let article = new Article({
            channelId: channelId,
            articleId: articleId,
            articleName: articleName,
            editUserId: user._id.toString(),
            data: data
        });

        let result = null;

        try {
            result = await article.save();

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

    //同步接口: 查看文章
    async viewAction() {
        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({_id: channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'view');

        http.render('dash/page/article/edit-article/edit-article.tpl');
    }

    //异步接口: 获取所有 [ start, start + num ) 区间内的文章列表, 按照创建时间升序排序
    async listAction() {

        let http = this.http;

        const Article = this.model('Article');

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
                Article.getArticleNumberOfChannel(channelId),
                Article.getArticleList(channelId, start, num)
            ]);

            // let arr = await Promise.all( [
            //     Article.find({ channelId : channelId }, { articleName : true } ).sort({ createdAt : 1 }).count().exec(),
            //     Article.find({ channelId : channelId }, { articleName : true } )
            //         .sort({ createdAt : 1 })
            //         .skip( start )
            //         .limit( num )
            //         .lean(true)
            // ] );
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

        let http = this.http;

        const Article = this.model('Article');

        let query = http.req.query;

        let channelId = http.getChannelId();
        let articleId = ( query.articleId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();

        if (!articleId) {
            return http.error(`文章ID( articleId )必须指定!!`);
        }

        let article = null;

        try {

            if (!recordId) {
                //未指定某次历史ID, 取最新的数据
                article = await Article.getLatestArticle(channelId, articleId);
            } else {
                article = await Article.findOne({channelId: channelId, _id: recordId}).lean(true);
            }

        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的文章详情出错!`, e);
        }

        if (article) {
            article.recordId = article._id;
        }

        this.json({
            status: 0,
            message: 'ok',
            data: article
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

        http.render('dash/page/article/edit-article/edit-article.tpl');

    }

    //异步接口: 更新文章内容
    async doUpdateAction() {

        const Channel = this.model('Channel');
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleId = ( body.articleId || '' ).trim();
        let articleName = ( body.articleName || '').trim();
        let data = ( body.data || '').trim();

        if (!articleName) {
            return http.error(`文章后台显示标题 必填!! articleName`);
        }

        if (!articleId) {
            return http.error(`要编辑的文章ID, 不能为空!!!`);
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

        let article = null;

        try {
            article = await Article.findOne({channelId: channelId, articleId: articleId, publishUserId: null}).exec();
        } catch (e) {
            grape.log.warn(e);
            return http.error(`查找指定的文章异常`, e);
        }

        if (articleName !== article.articleName) {
            //判断该栏目下, 是否存在同名的 文章
            let out = await Article.isNameExist(articleName, channelId);

            if (out) {
                return http.error(`该栏目下已经存在同名的文章: ${articleName}`);
            }
        }

        // let articleNew = new Article({
        //     channelId : channelId,
        //     articleId : articleId,
        //     articleName : articleName,
        //     editUserId : user._id.toString(),
        //     data : data
        // });

        article.set('articleName', articleName);
        article.set('editUserId', user._id.toString());
        article.set('data', data);

        let result = null;

        try {
            result = await article.save();

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
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleId = ( body.articleId || '' ).trim();

        if (!articleId) {
            return http.error(`要删除的文章ID(articleId), 不能为空!!!`);
        }


        try {
            let result = await Article.remove({channelId: channelId, articleId: articleId}).exec();
            this.json({
                status: 0,
                message: '成功删除文章, 以及该文章所有的历史记录',
                data: result
            });
        } catch (e) {
            grape.log.warn(e);
            http.error('删除文章失败', e);
        }

        // if( ! article ){
        //     return http.error(`找不到[${articleId}]对应的文章数据`);
        // }

        // try{
        //     let result = await article.remove();
        //     this.json({
        //         status : 0,
        //         message : '删除文章成功',
        //         data : result
        //     });
        // }catch(e){
        //     http.error('删除文章失败', e);
        // }
    }

    //异步接口: 获取某篇文章的编辑历史记录
    async getEditHistoryAction() {

        const Channel = this.model('Channel');
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.query;

        let user = http.getUser();

        let articleId = ( body.articleId || '' ).trim();

        if (!articleId) {
            return http.error(`文章ID( articleId ), 不能为空!!!`);
        }

        let result = await Article.getEditHistory(articleId);

        this.json({
            status: 0,
            message: 'ok',
            data: result
        });

    }

    //异步接口: 发布文章到线上, 用户可以发布文章的某一次编辑内容
    //每次发布, 都会插入一条新的历史记录
    async doPublishAction() {

        const Channel = this.model('Channel');
        const Article = this.model('Article');
        const SearchRaw = this.model('SearchRaw');
        let http = this.http;

        let user = http.getUser();

        let query = http.req.body;

        let channelId = http.getChannelId();
        let articleId = ( query.articleId || '' ).trim();
        let recordId = ( query.recordId || '' ).trim();
        let releaseType = ( query.releaseType || '').trim();

        if (!articleId || !recordId || !releaseType) {
            return http.error(`文章ID( articleId, recordId ),发布类型(releaseType)必须指定!!`);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({_id: channelId}).exec();

        if (!channel) {
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        let article = null;

        try {
            article = await Article.findOne({channelId: channelId, _id: recordId}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`获取指定的文章详情出错!`, e);
        }

        if (!article) {
            return http.error(`找不到文章ID[${articleId}][${recordId}]对应的文章`);
        }

        try {
            let result = await cmsUtils.releaseArticle(article, releaseType);
        } catch (e) {
            grape.log.warn(e);
            return http.error(`发布文章异常`, e);
        }

        let data = null;

        //如果是正式发布, 需要插入一条新的记录
        if (releaseType === 'publish') {
            let record = new Article({
                channelId: article.channelId,
                articleId: article.articleId,
                articleName: article.articleName,
                editUserId: article.editUserId,
                data: article.data,
                publishUserId: user._id,
                publishedAt: new Date()
            });
            try {
                data = await record.save();
            } catch (e) {
                return http.error(`保存发布记录失败`, e);
            }

            let sdata = null;
            let url = (channel.onlineUrl || '').trim();
            url = url.replace(/\{\{articleId\}\}/g, article.articleId);
            let category = (channel.category || '').trim();
            let section = (channel.section || '').trim();
            let searchR = await SearchRaw.findOne({resourceId: article.articleId, resourceType: "article"}).exec();
            let searchData = null;
            if (searchR) {
                searchData = searchR;
                searchData.set("resourceName", article.articleName);
                searchData.set("data", article.data);
            } else {
                searchData = new SearchRaw({
                    resourceName: article.articleName,
                    resourceType: "article",
                    resourceId: article.articleId,
                    accessUrl: url,
                    data: article.data,
                    section: section,
                    category: category
                });
            }
            console.log("category" + JSON.stringify(searchData));
            try {
                console.log("publish data" + article.articleName + JSON.stringify(searchData));
                sdata = await searchData.save();
            } catch (e) {
                return http.error(`保存文章searchRaw记录失败`, e);
            }
        }
        this.json({
            status: 0,
            message: '发布文章成功',
            data: data
        });


    }

    //获取某个文章当前发布在硬盘上的数据内容
    async currentReleaseAction() {

        const Article = this.model('Article');

        let http = this.http;

        let res = http.res;

        let query = http.req.query;

        let articleId = ( query.articleId || '' ).trim();
        let releaseType = ( query.releaseType || 'publish' ).trim();

        let article = null;

        try {
            article = await Article.findOne({articleId: articleId, publishUserId: null}).lean(true);
        } catch (e) {
            grape.log.warn(e);
            return res.end(e.stack);
        }

        if (!article) {
            return res.end(`未找到articleId=${articleId}的文章数据`);
        }

        let filePath = cmsUtils.getArticleReleaseFileName(article, releaseType);

        let content = '';
        let status = 0;
        let message = '';

        try {
            content = await cmsUtils.readFile(filePath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                status = 1;
                content = '文章未发布';
            } else {
                grape.log.warn(e);
                return res.end(e);
            }
        }

        res.end(content);
    }
}


module.exports = ArticleController;