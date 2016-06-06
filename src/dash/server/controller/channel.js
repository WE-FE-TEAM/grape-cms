/**
 * 栏目相关接口
 * Created by jess on 16/6/6.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class ChannelController extends ControllerBase {
    
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
}



module.exports = ChannelController;