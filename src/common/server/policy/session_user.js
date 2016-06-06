/**
 * 获取当前登录用户的信息
 * Created by jess on 16/6/4.
 */


'use strict';

const PolicyBase = grape.get('policy_base');


class SessionUserPolicy extends PolicyBase{

    async execute(){
        let http = this.http;
        let session = http.req.session;
        let userName = session.userName;

        let User = this.model('User');

        let result = await User.findOne({ userName : userName}).exec();
        
        if( result ){
            let user = new User( result );
            http.setUser( user );
        }

        // grape.console.log( result );
    }
}


module.exports = SessionUserPolicy;