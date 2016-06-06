/**
 * 后台系统面板
 * Created by jess on 16/6/6.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class HomeController extends ControllerBase{


    indexAction(){

        this.http.res.end('后台系统首页');
    }

    testAction(){

        this.http.res.end(' dash home test page');
    }
}


module.exports = HomeController;