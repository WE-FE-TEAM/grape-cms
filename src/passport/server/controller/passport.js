/**
 * passport 相关
 * Created by jess on 16/6/4.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class PassportController extends ControllerBase{

    //登陆之后, 跳转页面逻辑
    afterLoginJump(){
        let session = this.http.req.session;
        let url = session.loginJump || this.urls.dashIndex;
        session.loginJump = this.urls.dashIndex;
        this.http.redirect( url );
    }

    //渲染登录页面
    async loginAction(){

        let session = this.http.req.session;

        let user = this.http.getUser();
        if( user ){
            //用户已经登陆了
            return this.afterLoginJump();
        }

        //读取上一次登陆的错误信息
        let errorMsg = session.loginError;
        session.loginError = null;
        
        this.http.assign('loginError', errorMsg);

        this.http.render('passport/page/login/login.tpl');
    }

    //执行登录操作
    async doLoginAction(){

        const User = this.model('User');

        let body = this.http.req.body;

        let userName = body.userName;
        let password = body.password;

        //原始密码加密
        password = User.hashPassword( password );
        
        
        let result = await User.findOne({
            userName : userName,
            password : password
        }).exec();

        if( result ){

            if( ! User.isUserDisabled( result ) ){
                //登录成功
                this.http.req.session.userId = result._id.toString();

                return this.afterLoginJump();
                
            }

            this.http.req.session.loginError = '用户被禁用!!';

            
        }else{
            //登录失败
            this.http.req.session.loginError = '用户不存在, 或者用户名/密码错误!!';
            
        }

        return this.http.redirect( this.urls.logInPage );

    }

    //渲染 修改登录密码 的页面
    modifyPasswordAction(){
        this.http.render('passport/page/modify-password/modify-password.tpl');
    }
    
    //异步接口: 修改用户登录密码
    async doModifyPasswordAction(){

        const User = this.model('User');

        let http = this.http;

        let user = http.getUser();

        let body = this.http.req.body;

        let oldPassword = ( body.oldPassword || '').trim();
        let newPassword = ( body.newPassword || '' ).trim();

        if( ! newPassword ){
            return http.error( '新密码不能为空');
        }

        if( oldPassword === newPassword ){
            return http.error('新密码不能和原密码一样!!');
        }

        //原始密码加密
        oldPassword = User.hashPassword( oldPassword );

        if( oldPassword !== user.password ){
            //用户输入的老密码错误
            return http.error('原密码输入错误!!');
        }

        newPassword = User.hashPassword( newPassword );

        let result = null;

        try{
            result = await user.update({ password : newPassword }).exec();
        }catch(e){
            return http.error('保存新密码失败', e);
        }

        //清除当前session, 用户要重新登录
        http.req.session.userId = null;

        this.json({
            status : 0,
            message : '修改密码成功',
            data : result
        });
        
        
    }

    //同步接口, 退出登陆状态
    logoutAction(){

        this.http.req.session.userId = null;
        //跳转到登陆页
        this.http.redirect( this.urls.logInPage );
    }

    //TODO delete  开发时使用,获取当前登陆用户的信息
    async userInfoAction(){
        let http = this.http;
        let user = http.getUser();
        
        this.json( user );
    }
}


module.exports = PassportController;