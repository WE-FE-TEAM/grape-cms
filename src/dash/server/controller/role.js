/**
 * 角色 相关action
 * Created by jess on 16/6/7.
 */



'use strict';


const ControllerBase = grape.get('controller_base');


class RoleController extends ControllerBase {


    addAction(){
        this.http.res.end('新增角色页面');
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

    viewAction(){
        this.http.res.end('查看角色页面');
    }

    editAction(){
        this.http.res.end('编辑角色页面');
    }

    doUpdateAction(){
        this.http.res.end('更新角色接口');
    }

    doDeleteAction(){
        this.http.res.end('删除角色接口');
    }
}



module.exports = RoleController;