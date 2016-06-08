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

    doAddAction(){
        this.http.res.end('新增角色接口');
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