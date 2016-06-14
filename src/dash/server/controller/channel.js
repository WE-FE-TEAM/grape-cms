/**
 * 栏目相关接口
 * Created by jess on 16/6/6.
 */


'use strict';


const ControllerBase = grape.get('controller_base');

const cmsUtils = global.cms.utils;


class ChannelController extends ControllerBase {

    //异步接口: 返回所有的栏目数据
    async getAllTreeAction(){

        let Channel = this.model('Channel');

        let result = await Channel.getChannelTree( this.cmsConfig.rootChannelId );

        this.json( {
            status : 0,
            data : result
        } );
    }
    
    //异步接口: 返回当前用户有权限的整个 频道树 的数据
    async userChannelsDataAction(){
        let http = this.http;
        let user = http.getUser();
        let Channel = this.model('Channel');

        let wholeTree = await cmsUtils.getUserAvailableChannelTree( user, this.cmsConfig.rootChannelId );

        this.json( {
            status : 0,
            data : wholeTree
        } );

    }

    //异步方法: 根据channelId, 获取该channel对一个的所有祖先id数组路径
    async channelPathAction(){

        let http = this.http;

        let channelId = http.req.query.channelId;

        let Channel = this.model('Channel');

        let arr = await Channel.getChannelPath( channelId );

        this.json( {
            status : 0,
            //因为 model 获取的是 从叶子节点开始
            data : arr
        } );
    }
    
    //渲染  添加栏目页面
    addAction(){}
    
    //实际执行 添加栏目动作
    async doAddAction(){

        let http = this.http;

        let Channel = this.model('Channel');

        let body = http.req.body;

        let parentId = body.channelId;
        let channelName = ( body.channelName || '' ).trim();
        let channelType = body.channelType;

        if( ! channelName ){
            return this.json({
                status : -1,
                message : `栏目名 不能为空!!`
            });
        }
        
        let isTypeValid = Channel.isChannelTypeValida( channelType );

        let channelUrl = Channel.getChannelUrlByType( channelType );
        
        if( ! isTypeValid || ! channelUrl ){
            return this.json({
                status : -1,
                message : `栏目类型[${channelType}]非法!! 只能添加 普通栏目`
            });
        }

        let articleTemplate = null;
        if( Channel.isArticleChannel( channelType ) ){

            articleTemplate = body.articleTemplate;

            // console.log( articleTemplate );

            try{

                if( ! articleTemplate ){
                    throw new Error('articleTemplate must not be empty for article channel!');
                }

                articleTemplate = JSON.parse( articleTemplate );
                
                // articleTemplate = JSON.stringify( articleTemplate );
            }catch(e){
                grape.log.warn( e );
                return this.json({
                    status : -1,
                    message : '文章模板 必须是 JSON !!'
                });
            }

        }


        
        let temp = await Channel.isNameExist( parentId, channelName );
        
        if( temp ){
            //已经存在同名的栏目
            return this.json({
                status : -1,
                message : `父栏目下已经存在同名的栏目!`
            });
        }

        let channel = new Channel({
            channelName : channelName,
            channelType : channelType,
            parentId : parentId,
            isSystem : false,
            url : channelUrl,
            articleTemplate : articleTemplate
        });

        try{
            let out = await channel.save();
            this.json({
                status : 0,
                message : '添加栏目成功',
                data : out
            });
        }catch(e){
            grape.log.warn( e );
            this.json({
                status : -1,
                message : '添加栏目失败',
                debugInfo : e.message
            });
        }

    }

    //查看某个栏目
    async viewAction(){

        let http = this.http;
        let req = http.req;
        let channelId = ( req.channelId || '' ).trim();

    }

    //异步接口: 修改栏目属性
    async doUpdateAction(){

        let http = this.http;

        let Channel = this.model('Channel');

        let body = http.req.body;

        let channelId = body.channelId;
        let channelName = ( body.channelName || '' ).trim();

        if( ! channelName ){
            return this.json({
                status : -1,
                message : `栏目名 不能为空!!`
            });
        }

        let channel = null;
        try{
            channel = await Channel.findOne({ _id : channelId }).exec();
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '服务异常',
                debugInfo : e.message
            });
        }

        if( ! channel ){
            return this.json({
                status : -1,
                message : '未找到该 channelId 对应的栏目数据!'
            });
        }

        if( channelName !== channel.channelName ){
            //检查新的栏目名, 是否在同一级已经存在
            let temp = await Channel.isNameExist( channel.parentId, channelName );
            if( temp ){
                //已经存在同名的栏目
                return this.json({
                    status : -1,
                    message : `父栏目下已经存在同名的栏目!`
                });
            }
        }

        //文章栏目, 用户可以修改文章模板
        let articleTemplate = null;

        if( Channel.isArticleChannel( channel.channelType ) ){

            articleTemplate = body.articleTemplate;

            // console.log( articleTemplate );

            try{

                // articleTemplate = JSON.stringify( articleTemplate );
                articleTemplate = JSON.parse( articleTemplate );

            }catch(e){
                grape.log.warn( e );
                return this.json({
                    status : -1,
                    message : '文章模板 必须是 JSON !!'
                });
            }

        }

        channel.channelName = channelName;
        channel.articleTemplate = articleTemplate;

        let result = await channel.update({ channelName : channelName, articleTemplate : articleTemplate }).exec();

        console.log( result );

        this.json({
            status : 0,
            message : '更新栏目成功'
        });
    }
    
    //删除栏目
    async doDeleteAction(){

        let http = this.http;

        let Channel = this.model('Channel');

        let body = http.req.body;

        let channelId = body.channelId;

        let channel = null;
        try{
            channel = await Channel.findOne({ _id : channelId }).lean( true );
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '服务异常',
                debugInfo : e.message
            });
        }

        if( ! channel ){
            return this.json({
                status : -1,
                message : '找不到该栏目!!'
            });
        }

        if( channel.isSystem ){
            //系统级栏目, 不允许删除
            return this.json({
                status : -1,
                message : '系统级栏目, 不允许删除!!'
            });
        }

        //删除
        try{
            let result = await Channel.deleteChannelById( channelId );
            this.json({
                status : 0,
                message : '删除栏目成功'
            });
        }catch(e){
            grape.log.error( e );
            return this.json({
                status : -1,
                message : '执行删除异常',
                debugInfo : e.message
            });
        }

    }

    articleAction(){
        this.http.res.end('显示某文章栏目');
    }

    dataAction(){
        this.http.res.end('显示某json栏目');
    }

    resourceAction(){
        this.http.res.end('显示某资源上传栏目');
    }

    containerAction(){
        this.http.res.end('显示某 容器 栏目');
    }


}



module.exports = ChannelController;