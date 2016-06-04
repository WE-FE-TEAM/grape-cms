/**
 * 获取当前登录用户的信息
 * Created by jess on 16/6/4.
 */


'use strict';

const PolicyBase = grape.get('policy_base');


class SessionUserPolicy extends PolicyBase{

    async execute(){
        let session = this.req.session;
        let userName = session.userName;

        let User = this.model('User');

        let result = await User.find({ userName : userName}).exec();

        grape.console.log( result );
    }
}


module.exports = SessionUserPolicy;