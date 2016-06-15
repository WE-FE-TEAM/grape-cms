/**
 * 角色 相关action
 * Created by jess on 16/6/7.
 */



'use strict';


const ControllerBase = grape.get('controller_base');


class RoleController extends ControllerBase {
    

    //异步接口: 获取所有的角色列表
    async allAction(){

        let Role = this.model('Role');

        let data = null;

        try{
            data = await Role.getAll();
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '获取角色数据异常',
                debugInfo : e.message
            });
        }

        this.json({
            status : 0,
            message : '',
            data : data
        });
    }

    //异步接口: 添加角色
    async doAddAction(){

        let http = this.http;

        let Role = this.model('Role');

        let body = http.req.body;

        let roleName = ( body.roleName || '' ).trim();
        let permissions = body.permissions;

        if( ! roleName ){
            return this.json({
                status : -1,
                message : `角色名 不能为空!!`
            });
        }
        
        try{
            permissions = JSON.parse( permissions );
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '权限字段必须是 object 字面量!!',
                debugInfo : e.message
            });
        }
        
        //判断是否存在同名的角色
        let isNameExist = await Role.isNameExist( roleName );
        
        if( isNameExist ){
            return this.json({
                status : -1,
                message : '已经存在同名的角色!!'
            });
        }

        let role = new Role({
            roleName : roleName,
            permissions : permissions
        });

        try{
            let out = await role.save();
            this.json({
                status : 0,
                message : '添加角色成功',
                data : out
            });
        }catch(e){
            grape.log.warn( e );
            this.json({
                status : -1,
                message : '添加角色失败',
                debugInfo : e.message
            });
        }

    }
    
    //异步接口: 修改角色
    async doUpdateAction(){
        let http = this.http;

        let Role = this.model('Role');

        let body = http.req.body;

        let roleId = body.roleId;
        let roleName = ( body.roleName || '' ).trim();
        let permissions = body.permissions;

        if( ! roleName ){
            return this.json({
                status : -1,
                message : `角色名 不能为空!!`
            });
        }

        try{
            permissions = JSON.parse( permissions );
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '权限字段必须是 object 字面量!!',
                debugInfo : e.message
            });
        }

        let role = null;
        try{
            role = await Role.findOne({ _id : roleId }).exec();
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '服务异常',
                debugInfo : e.message
            });
        }

        if( ! role ){
            return this.json({
                status : -1,
                message : '未找到该 roleId 对应的角色数据!'
            });
        }

        if( roleName !== role.roleName ){
            //用户修改了角色名
            //判断是否存在同名的角色
            let isNameExist = await Role.isNameExist( roleName );

            if( isNameExist ){
                return this.json({
                    status : -1,
                    message : '已经存在同名的角色!!'
                });
            }
        }


        try{
            let out = await role.update( { roleName : roleName, permissions : permissions } ).exec();
            this.json({
                status : 0,
                message : '修改角色成功',
                data : out
            });
        }catch(e){
            grape.log.warn( e );
            this.json({
                status : -1,
                message : '修改角色失败',
                debugInfo : e.message
            });
        }
    }

    async doDeleteAction(){

        let http = this.http;

        let Role = this.model('Role');

        let body = http.req.body;

        let roleId = body.roleId;

        let role = null;
        try{
            role = await Role.findOne({ _id : roleId }).exec();
        }catch(e){
            grape.log.warn( e );
            return this.json({
                status : -1,
                message : '服务异常',
                debugInfo : e.message
            });
        }

        if( ! role ){
            return this.json({
                status : -1,
                message : '未找到该 roleId 对应的角色数据!'
            });
        }

        try{
            await Role.deleteRoleById( roleId );
            this.json({
                status : 0,
                message : '删除角色成功'
            });
        }catch(e){
            grape.log.warn( e );
            this.json({
                status : -1,
                message : '系统异常',
                debugInfo : e.message
            });
        }
    }
}



module.exports = RoleController;