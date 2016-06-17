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
    
    editAction(){
        this.http.res.end('编辑文章页面');
    }
    
    doUpdateAction(){
        this.http.res.end('更新文章接口');
    }
    
    doDeleteAction(){
        this.http.res.end('删除文章接口');
    }
}



module.exports = ArticleController;