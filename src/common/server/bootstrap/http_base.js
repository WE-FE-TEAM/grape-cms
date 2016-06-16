/**
 * Created by jess on 16/6/3.
 */
/**
 * 继承 grape.Http, 覆盖掉一些默认页面渲染/错误处理
 * Created by jess on 16/4/28.
 */


'use strict';


const grape = global.grape;

const Http = grape.get('http');

class HttpBase extends Http {

    init( ...data ){

        super.init( ...data );

        this.user = null;

        let req = this.req;
        //channel ID 必须放在 query 部分, 如果是 POST, 必须在 POST 里
        let temp = req.query;
        if( req.method === 'post' ){
            temp = req.body;
        }
        let channelId = ( temp.channelId || '' ).trim();

        this.channelId = channelId;
    }

    /**
     * 客户端参数校验失败, 可以调用此方法输出
     * @param message {string}
     */
    argumentValidateFail( message ){
        this.assign( 'message', message );
        this.e404();
    }

    setUser( user ){
        this.user = user;
        this.req.user = user;
    }

    getUser(){
        return this.user;
    }

    getChannelId(){
        return this.channelId;
    }

}

// console.log( grape.configManager.getConfig('common', 'page'));


// 不用覆盖框架的, 没有特殊处理, 如果有特殊处理, 需要调用下面的 set , 修改框架内初始化时,使用的 Http 类
grape.set('http', HttpBase );

