/**
 * 后台系统面板
 * Created by jess on 16/6/6.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class HomeController extends ControllerBase{


    indexAction(){

        this.http.render('dash/page/home/index/index.tpl');
    }

    testAction(){

        this.http.res.end(' dash home test page');
    }

    userManageAction(){
        this.http.res.end(' 用户管理页面');
    }

    roleManageAction(){
        this.http.res.end(' 角色管理页面');
    }

    channelManageAction(){
        this.http.res.end(' 栏目管理');
    }
}


module.exports = HomeController;