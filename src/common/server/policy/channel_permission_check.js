/**
 * 检查当前登录用户, 是否对当前栏目的当前请求动作有权限
 * 依赖前置检查条件  :   login_filter
 * Created by jess on 16/6/6.
 */


'use strict';


const PolicyBase = grape.get('policy_base');


class ChannelPermissionCheckFilter extends PolicyBase {

    async execute(){

        const Operation = this.model('Operation');
        const Channel = this.model('Channel');
        const Role = this.model('role');

        let user = this.http.getUser();

        let http = this.http;
        let req = http.req;

        //channel ID 必须放在 query 部分
        let channelId = ( req.query.channelId || '' ).trim();
        if( ! channelId ){
            return http.e404();
        }

        let currentActionPath = `${http.module}+${http.controller}+${http.action}`;

        let userRoles = user.roles;

        //找到当前URL对应的 operationName
        let operation = await Operation.findOne({ actionList : currentActionPath }).exec();

        if( ! operation ){
            return http.e404();
        }

        let operationName = operation.operationName;

        //查找对 channelId 的 operationName 有权限 并且 在用户所属角色组中的 角色 是否存在
        let matchedRole = await Role.findOne(
            {
                permissions : `${operationName}&${channelId}`,
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