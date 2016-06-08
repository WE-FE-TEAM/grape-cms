/**
 * 栏目相关接口
 * Created by jess on 16/6/6.
 */


'use strict';


const ControllerBase = grape.get('controller_base');

const cmsUtils = global.cms.utils;


class ChannelController extends ControllerBase {
    
    //异步接口: 返回当前用户有权限的整个 频道树 的数据
    async userChannelsDataAction(){
        let http = this.http;
        let user = http.getUser();
        let Channel = this.model('Channel');

        let wholeTree = await cmsUtils.getUserAvailableChannelTree( user, this.cmsConfig.rootChannelId );

        this.json( wholeTree );

    }
    
    //渲染  添加栏目页面
    addAction(){}
    
    //实际执行 添加栏目动作
    doAddAction(){
        
    }

    //查看某个栏目
    async viewAction(){

        let http = this.http;
        let req = http.req;
        let channelId = ( req.channelId || '' ).trim();

    }
    
    //删除栏目
    doDeleteAction(){
        this.http.res.end('删除栏目操作');
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