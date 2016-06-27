/**
 * Created by jess on 16/6/6.
 */


'use strict';


module.exports = {

    '*' : [ 'session_user' ],

    passport : {

        '*' : [ 'session_user' ],

        modifyPassword : [ 'session_user', 'login_filter' ],

        doModifyPassword : [ 'session_user', 'login_filter' ]
    }
};