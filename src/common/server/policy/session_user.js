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
        let userId = session.userId;

        let User = this.model('User');

        try{
            let result = await User.findOne({ _id : userId}).exec();
            if( result ){
                // let user = new User( result );
                http.setUser( result );
            }
        }catch(e){

        }

        


        // grape.console.log( result );
    }
}


module.exports = SessionUserPolicy;