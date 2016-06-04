/**
 * passport 相关
 * Created by jess on 16/6/4.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class PassportController extends ControllerBase{

    //渲染登录页面
    loginAction(){
        this.http.res.end('in login page');
    }

    //执行登录操作
    doLoginAction(){

    }
}


module.exports = PassportController;