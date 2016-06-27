/**
 * 用户修改登录密码
 * Created by jess on 16/6/27.
 */


'use strict';


const service = require('common:widget/ui/service/service-factory.js');

const userService = service.getService('user');


let singleton = {
    
    init : function(){
        
        let $form = $('#modify-pass-form');
        let $oldPass = $('#oldPassword');
        let $newPass = $('#newPassword');
        let $newPass2 = $('#newPassword2');

        let isRequesting = false;
        
        $form.on('submit', function(e){
            
            e.preventDefault();

            if( isRequesting ){
                alert('正在请求中.....');
                return;
            }
            
            let oldPass = $oldPass.val().trim();
            let newPass = $newPass.val().trim();
            let newPass2 = $newPass2.val().trim();
            
            if(! oldPass ){
                alert('原密码不能为空!');
                return;
            }
            
            if( newPass !== newPass2 ){
                alert('两次输入的新密码不一致!!');
                return;
            }

            let data = {
                oldPassword : oldPass,
                newPassword : newPass
            };

            isRequesting = true;

            userService.modifyPassword( data )
                .then( function(req){
                    isRequesting = false;
                    if( req.requestStatus === userService.STATUS.SUCCESS ){
                        let out = req.data;
                        if( out.status === 0 ){
                            alert(out.message);
                            location.href = '/cms/dash/home/index';
                            return;
                        }
                        return Promise.reject( new Error(out.message));
                    }
                    return Promise.reject( new Error('请求修改密码接口出错') );
                } )
                .catch( function(e){
                    alert(e.message);
                    isRequesting = false;
                } );
            
        } );
    }
    
};





module.exports = singleton;


