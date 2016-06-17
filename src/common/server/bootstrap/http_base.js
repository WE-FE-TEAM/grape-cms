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
        
        if( req.method.toLowerCase() === 'post' ){
            temp = req.body;
        }
        let channelId = ( temp.channelId || '' ).trim();

        this.channelId = channelId;

        this.assign('channelId', channelId);
    }

    /**
     * 客户端参数校验失败, 可以调用此方法输出
     * @param message {string}
     */
    argumentValidateFail( message ){
        this.assign( 'message', message );
        this.e404();
    }

    //是否本次请求应该返回JSON格式
    shouldResponseJson(){
        let resType = ( this.req.get('x-grape-res-expect') || '' ).toLowerCase();
        return resType === 'json';
    }

    sendStatus( status, data ){

        if( this.shouldResponseJson() ){

            status += '';

            let message = '';

            switch( status ){
                case '403':
                    message = '您没有权限执行该操作!!';
                    break;
                case '404':
                    message = '请求地址不存在!!';
                    break;
                case '500':
                    message = '系统错误';
                    break;
                default :
                    message = '';
            }

            if( message ){
                this.json({
                    status : -1,
                    message : message
                });
                return grape.prevent();
            }
        }

        return super.sendStatus( status, data );
    }

    error( msg, err ){
        if( this.shouldResponseJson() ){
            let data = {
                status : -1,
                message : msg
            };
            if( err ){
                data.debugInfo = err.message;
            }
            this.json( data );
        }else{
            this.sendStatus( 500, err);
        }
        return grape.prevent();
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

