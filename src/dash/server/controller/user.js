/**
 * CMS后台系统中, 涉及到 用户相关操作的controller
 * Created by jess on 16/6/4.
 */


'use strict';



const ControllerBase = grape.get('controller_base');


class UserController extends ControllerBase{


    //显示添加用户界面
    addAction(){

        this.http.render('dash/page/user/add-user.tpl');
        
    }

    //异步方法,实际执行增加用户
    async doAddAction(){

        const User = this.model('User');
        
        let body = this.http.req.body;
        
        let userName = body.userName;
        let password = body.password;
        let level = parseInt( body.level, 10 );
        if( isNaN( level ) || level < 0 ){
            level = 99;
        }
        let roles = body.roles || [];

        //原始密码加密
        password = User.hashPassword( password );

        let user = new User({
            userName : userName,
            password : password,
            level : level,
            roles : roles
        });

        let result = null;

        try{
            result = await user.save();
        }catch(e){
            grape.log.warn(e);
            //保存失败
            return this.json({
                status : -1,
                message : '添加用户出错',
                debugMessage : e.message
            });
        }

        return this.json({
            status : 0,
            data : result
        });

    }
}


module.exports = UserController;