/**
 * 检查用户是否登陆, 未登陆, 跳转到登陆页, 依赖于  session_user
 * Created by jess on 16/6/6.
 */


'use strict';


const PolicyBase = grape.get('policy_base');


class LoginFilter extends PolicyBase {

    execute(){

        let user = this.http.getUser();

        if( ! user ){
            //用户未登陆, 跳转到登陆页
            let req = this.http.req;
            let session = req.session;
            let loginJumpURL = req.originalUrl || this.urls.dashIndex;
            session.loginJump = loginJumpURL;
            this.http.redirect( this.urls.logInPage );
            return grape.prevent();
        }

        if( user.isUserDisabled() ){
            //用户被禁用,不能访问系统
            return this.http.sendStatus(403);
        }

    }
}


module.exports = LoginFilter;