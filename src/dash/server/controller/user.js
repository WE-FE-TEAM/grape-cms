/**
 * CMS后台系统中, 涉及到 用户相关操作的controller
 * Created by jess on 16/6/4.
 */


'use strict';


const util = require('util');

const ControllerBase = grape.get('controller_base');


class UserController extends ControllerBase{
    
    //异步接口: 获取所有 [ start, start + num ) 区间内的用户列表, 按照 用户创建时间 升序排列
    async listAction(){

        let http = this.http;

        const User = this.model('User');
        
        let query = http.req.query;
        
        let start = parseInt( query.start, 10 );
        let num = parseInt( query.num, 10 );
        
        if( isNaN( start )
            || start < 0
            || isNaN( num )
            || num <= 0
        ){
            return this.json({
                status : -1,
                message : 'start  num 参数 必须 >= 0 !!'
            });
        }
        
        let allUsers;
        
        try{
            allUsers = await User.getAll();    
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '获取用户列表异常'
            });
        }
        
        let data = {
            count : allUsers.length,
            data : allUsers.slice( start, start + num )
        };
        
        this.json({
            status : 0,
            data : data
        });
        
    }

    //异步方法,实际执行增加用户
    async doAddAction(){

        let http = this.http;

        const User = this.model('User');

        let sessionUser = http.getUser();
        
        let body = http.req.body;
        
        let userName = ( body.userName || '' ).trim();
        let password = ( body.password || '').trim();
        let level = parseInt( body.level, 10 );
        if( isNaN( level ) || level < 0 ){
            level = 99;
        }

        //确保当前用户创建的新用户, 等级必须等于或低于当前用户
        let sessionUserLevel = sessionUser.level;
        if( level < sessionUserLevel ){
            level = sessionUserLevel + 1;
        }

        if( ! userName ){
            return this.json({
                status : -1,
                message : '用户名不能为空'
            });
        }

        if( password.length < 6 ){
            return this.json({
                status : -1,
                message : '密码长度不能小于 6 个字符!'
            });
        }

        let isNameExist = await User.isNameExist( userName );

        if( isNameExist ){
            return this.json({
                status : -1,
                message : '已经存在同名的用户!!'
            });
        }

        let roles = body.roles || [];

        try{
            roles = JSON.parse( body.roles );
            if( ! util.isArray(roles) ){
                throw new Error(' user.roles 必须是数组');
            }
        }catch(e){
            return this.json({
                status : -1,
                message : '用户对应角色, 必须是 数组 !'
            });
        }

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

    //异步接口: 更新用户信息
    async doUpdateAction(){

        let http = this.http;

        const User = this.model('User');

        let sessionUser = http.getUser();

        let body = http.req.body;

        let userId = body.userId;
        let enabled = parseInt(body.enabled, 10);
        let userName = ( body.userName || '' ).trim();
        let password = ( body.password || '').trim();

        let targetUser = null;
        try{
            targetUser = await User.findOne({ _id : userId }).exec();
        }catch(e){
            grape.log.info( e );
        }

        if( ! targetUser ){
            //未找到对应用户
            return this.json({
                status : -1,
                message : `未找到id为[${userId}]对应的用户!`
            });
        }

        let level = targetUser.level;

        //确保当前用户, 不能修改 比自己权限更高的用户
        let sessionUserLevel = sessionUser.level;
        if( level <= sessionUserLevel ){
            return this.json({
                status : -1,
                message : '您不能修改权限高于自己的用户!!'
            });
        }

        if( ! userName ){
            return this.json({
                status : -1,
                message : '用户名不能为空'
            });
        }

        if( ! User.isEnableValid( enabled ) ){
            return this.json({
                status : -1,
                message : '用户启用标记,取值范围非法!!'
            });
        }

        if( userName !== targetUser.userName ){
            //修改了用户名, 要判断是否已经有相同的用户
            let isNameExist = await User.isNameExist( userName );

            if( isNameExist ){
                return this.json({
                    status : -1,
                    message : '已经存在同名的用户!!'
                });
            }
        }

        if( password ){
            //修改了登录密码
            if( password.length < 6 ){
                return this.json({
                    status : -1,
                    message : '密码长度不能小于 6 个字符!'
                });
            }
            //原始密码加密
            password = User.hashPassword( password );
        }else{
            //未修改登录密码
            password = targetUser.password;
        }



        let roles = body.roles || [];

        try{
            roles = JSON.parse( body.roles );
            if( ! util.isArray(roles) ){
                throw new Error(' user.roles 必须是数组');
            }
        }catch(e){
            return this.json({
                status : -1,
                message : '用户对应角色, 必须是 数组 !'
            });
        }

        targetUser.set('userName', userName);
        targetUser.set('password', password);
        targetUser.set('roles', roles);
        targetUser.set('enabled', enabled);

        let result = null;

        try{
            result = await targetUser.save();
        }catch(e){
            grape.log.warn(e);
            //保存失败
            return this.json({
                status : -1,
                message : '修改用户出错',
                debugMessage : e.message
            });
        }

        return this.json({
            status : 0,
            data : result
        });
        
    }
    
    //判断用户名是否存在
    async userNameExistAction(){

        const User = this.model('User');

        let http = this.http;
        
        let userName = ( http.req.query.userName || '' ).trim();
        
        if( ! userName ){
            return this.json({
                status : -1,
                message : '用户名为空!!'
            });
        }

        let result = {
            status : 0,
            message : ''
        };
        
        try{

            let user = await User.findOne({ userName : userName }).exec();

            if( user ){
                //该用户名已经存在
                result.data = true;
            }else{
                result.data = false;
            }
            
        }catch(e){
            
            grape.log.warn( e );
            
            result = {
                status : 500,
                message : '系统出错, 请稍后再试',
                debugInfo : e.message
            };
            
        }
        
        this.json( result );
        
    }

    //异步接口: 删除指定用户
    async doDeleteAction(){

        let http = this.http;

        const User = this.model('User');

        let sessionUser = http.getUser();

        let body = http.req.body;

        let userId = body.userId;

        let targetUser = null;
        try{
            targetUser = await User.findOne({ _id : userId }).exec();
        }catch(e){
            grape.log.info( e );
        }

        if( ! targetUser ){
            //未找到对应用户
            return this.json({
                status : -1,
                message : `未找到id为[${userId}]对应的用户!`
            });
        }

        let level = targetUser.level;

        //确保当前用户, 不能修改 比自己权限更高的用户
        let sessionUserLevel = sessionUser.level;
        if( level <= sessionUserLevel ){
            return this.json({
                status : -1,
                message : '您不能修改权限高于自己的用户!!'
            });
        }

        let result = null;

        try{
            result = await targetUser.remove();
        }catch(e){

            return this.json({
                status : -1,
                message : '删除用户异常',
                debugInfo : e.message
            });
        }

        this.json({
            status : 0,
            message : '',
            data : result
        });

    }
    
}


module.exports = UserController;