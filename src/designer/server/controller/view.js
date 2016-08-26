/**
 * Created by jess on 16/8/26.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


const cms = global.cms;

const cmsUtils = cms.utils;


class ViewController extends ControllerBase{


    async mobileAction(){
        let http = this.http;
        let query = http.req.query;

        let tplName = 'mobile-normal';
        
        http.render(`designer/page/page-tpl/${tplName}/${tplName}.tpl`);
    }
}


module.exports = ViewController;

