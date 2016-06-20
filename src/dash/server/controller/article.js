/**
 * 文章 相关的action
 * Created by jess on 16/6/7.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class ArticleController extends ControllerBase {

    //同步接口: 显示 新增文章/编辑文章  页面
    async addAction(){

        const Channel = this.model('Channel');
        
        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({ _id : channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'add');

        http.render('dash/page/article/edit-article/edit-article.tpl');
        
    }

    //异步接口: 添加文章
    async doAddAction(){

        const Channel = this.model('Channel');
        const Article = this.model('Article');
        
        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleName = ( body.articleName || '').trim();
        let data = ( body.data || '').trim();
        
        if( ! articleName ){
            return http.error(`文章后台显示标题 必填!! articleName`);
        }
        
        try{
            data = JSON.parse( data );
        }catch(e){
            return http.error( `文章内容格式非法, 只能是JSON!!`, e);
        }
        
        //判断目标栏目是否存在
        let channel = await Channel.findOne({ _id : channelId}).exec();
        
        if( ! channel ){
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }
        
        //判断该栏目下, 是否存在同名的 文章
        let out = await Article.isNameExist( articleName, channelId );

        if( out ){
            return http.error( `该栏目下已经存在同名的文章: ${articleName}`);
        }
        
        let article = new Article({
            channelId : channelId,
            articleName : articleName,
            editUserId : user._id.toString(),
            data : data
        });

        let result = null;

        try{
            result = await article.save();

        }catch(e){
            return http.error( `保存文章异常`, e);
        }

        return http.json({
            status : 0,
            message : '创建文章成功',
            data : result
        });


    }

    viewAction(){
        this.http.res.end('查看文章页面');
    }

    //异步接口: 获取所有 [ start, start + num ) 区间内的文章列表, 按照创建时间升序排序
    async listAction(){

        let http = this.http;

        const Article = this.model('Article');

        let query = http.req.query;

        let channelId = http.getChannelId();
        let start = parseInt( query.start, 10 );
        let num = parseInt( query.num, 10 );

        if( isNaN( start )
            || start < 0
            || isNaN( num )
            || num <= 0
        ){
            return http.error( 'start  num 参数 必须 >= 0 !!');
        }

        let total = 0;
        let list = [];

        try{
            let arr = await Promise.all( [
                Article.find({ channelId : channelId }, { articleName : true } ).sort({ createdAt : 1 }).count().exec(),
                Article.find({ channelId : channelId }, { articleName : true } )
                    .sort({ createdAt : 1 })
                    .skip( start )
                    .limit( num )
                    .lean(true)
            ] );
            total = arr[0] ;
            list = arr[1] ;
        }catch(e){
            grape.log.warn(e);
            return http.error( `获取文章列表异常`, e );
        }

        let data = {
            total : total,
            start : start,
            num : num,
            list : list
        };

        http.json({
            status : 0,
            message : 'ok',
            data : data
        });

    }

    //异步接口: 获取某个指定文章的详情数据
    async detailAction(){

        let http = this.http;

        const Article = this.model('Article');

        let query = http.req.query;

        let channelId = http.getChannelId();
        let articleId = ( query.articleId || '' ).trim();

        if( ! articleId ){
            return http.error(`文章ID(articleId)必须指定!!`);
        }

        let article = null;

        try{
            article = await Article.findOne({ channelId : channelId, _id : articleId }).lean(true);
        }catch(e){
            grape.log.warn( e );
            return http.error( `获取指定的文章详情出错!`, e);
        }

        this.json({
            status : 0,
            message : 'ok',
            data : article
        });
    }

    //同步接口: 渲染编辑文章页面
    async editAction(){

        const Channel = this.model('Channel');

        let http = this.http;

        let channelId = http.getChannelId();

        let channel = await Channel.findOne({ _id : channelId}).lean(true);

        http.assign('channel', channel);
        http.assign('action', 'edit');

        http.render('dash/page/article/edit-article/edit-article.tpl');

    }

    //异步接口: 更新文章内容
    async doUpdateAction(){

        const Channel = this.model('Channel');
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleId = ( body.articleId || '' ).trim();
        let articleName = ( body.articleName || '').trim();
        let data = ( body.data || '').trim();

        if( ! articleName ){
            return http.error(`文章后台显示标题 必填!! articleName`);
        }

        if( ! articleId ){
            return http.error(`要编辑的文章ID, 不能为空!!!`);
        }

        try{
            data = JSON.parse( data );
        }catch(e){
            return http.error( `文章内容格式非法, 只能是JSON!!`, e);
        }

        //判断目标栏目是否存在
        let channel = await Channel.findOne({ _id : channelId}).exec();

        if( ! channel ){
            return http.error(`指定的栏目不存在! 栏目ID: ${channelId}`);
        }

        let article = null;

        try{
            article = await Article.findOne({ channelId : channelId, _id : articleId }).exec();
        }catch(e){
            grape.log.warn( e );
            return http.error( `查找指定的文章异常`, e);
        }

        if( articleName !== article.articleName ){
            //判断该栏目下, 是否存在同名的 文章
            let out = await Article.isNameExist( articleName, channelId );

            if( out ){
                return http.error( `该栏目下已经存在同名的文章: ${articleName}`);
            }
        }

        article.set('articleName', articleName);
        article.set('data', data);

        let result = null;

        try{
            result = await article.save();

        }catch(e){
            return http.error( `保存文章异常`, e);
        }

        return http.json({
            status : 0,
            message : '更新文章成功',
            data : result
        });
    }

    //异步接口: 删除文章
    async doDeleteAction(){

        const Channel = this.model('Channel');
        const Article = this.model('Article');

        let http = this.http;

        let body = http.req.body;

        let user = http.getUser();

        let channelId = http.getChannelId();
        let articleId = ( body.articleId || '' ).trim();

        if( ! articleId ){
            return http.error(`要删除的文章ID, 不能为空!!!`);
        }

        let article = null;

        try{
            article = await Article.findOne({ channelId : channelId, _id : articleId }).exec();
        }catch(e){
            grape.log.warn( e );
            return http.error( '获取该文章数据异常', e);
        }

        if( ! article ){
            return http.error(`找不到[${articleId}]对应的文章数据`);
        }

        try{
            let result = await article.remove();
            this.json({
                status : 0,
                message : '删除文章成功',
                data : result
            });
        }catch(e){
            http.error('删除文章失败', e);
        }
    }
}



module.exports = ArticleController;