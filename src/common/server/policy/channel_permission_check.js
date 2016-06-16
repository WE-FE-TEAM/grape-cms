/**
 * 检查当前登录用户, 是否对当前栏目的当前请求动作有权限
 * 依赖前置检查条件  :   login_filter
 * Created by jess on 16/6/6.
 */


'use strict';


const PolicyBase = grape.get('policy_base');


const cms = global.cms;

const cmsUtils = cms.utils;


class ChannelPermissionCheckFilter extends PolicyBase {

    async execute(){
        
        let user = this.http.getUser();

        let http = this.http;
        let req = http.req;

        let channelId = http.getChannelId();
        if( ! channelId ){
            return http.sendStatus( 403 );
        }

        //超级管理员, 具有所有权限
        if( user.isSuperAdmin() ){
            return;
        }


        let actionPath = cmsUtils.getActionPath( http.module, http.controller, http.action );

        let canAccess = await user.canAccess( channelId, actionPath );

        if( ! canAccess ){
            //用户没有权限
            return http.sendStatus( 403 );
        }

    }
}


module.exports = ChannelPermissionCheckFilter;