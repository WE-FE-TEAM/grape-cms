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


        const Channel = this.model('Channel');
        const Role = this.model('Role');

        let user = this.http.getUser();

        let http = this.http;
        let req = http.req;

        //channel ID 必须放在 query 部分, 如果是 POST, 必须在 POST 里
        let data = req.query;
        if( req.method === 'post' ){
            data = req.body;
        }
        let channelId = ( data.channelId || '' ).trim();
        if( ! channelId ){
            grape.log.info('请求query中缺少 channelId, 不进行权限校验 ');
            return;
        }

        //超级管理员, 具有所有权限
        if( user.isSuperAdmin() ){
            return;
        }

        let userRoles = user.roles;
        

        let permissionPath = cmsUtils.getPermissionPath( http.module, http.controller, http.action, channelId );

        //查找对 channelId 的 operationName 有权限 并且 在用户所属角色组中的 角色 是否存在
        let matchedRole = await Role.findOne(
            {
                permissions : permissionPath,
                _id : {
                    $in : userRoles
                }
            }
        ).exec();

        if( ! matchedRole ){
            //用户没有权限
            return http.sendStatus( 403 );
        }

    }
}


module.exports = ChannelPermissionCheckFilter;