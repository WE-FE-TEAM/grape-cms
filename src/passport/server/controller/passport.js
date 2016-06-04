/**
 * passport 相关
 * Created by jess on 16/6/4.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class PassportController extends ControllerBase{

    //渲染登录页面
    async loginAction(){

        let session = this.http.req.session;
        let pv = session.pv || 0;
        pv++;

        session.pv = pv;

        let User = this.model('User');

        let temp = new User({
            userName : 'test1',
            password : 'pwd',
            roles :  [ '1111', '222', '333' ]
        });

        let result = await temp.save();

        grape.console.log( result );

        this.http.res.end('in login page, pv: ' + pv);
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
            //登录成功
            return this.json({
                status : 0,
                data : {
                    userName : result.userName
                }
            });
        }else{
            //登录失败
            return this.json({
                status : -1,
                message : '用户不存在, 或者用户名/密码错误'
            });
        }

    }
}


module.exports = PassportController;