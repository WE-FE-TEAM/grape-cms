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

    userManageAction(){
        this.http.render('dash/page/home/user-manage/user-manage.tpl');
    }

    roleManageAction(){
        this.http.render('dash/page/home/role-manage/role-manage.tpl');
    }

    channelManageAction(){
        this.http.render('dash/page/home/channel-manage/channel-manage.tpl');
    }
}


module.exports = HomeController;