/**
 * Created by jess on 16/6/6.
 */


'use strict';


module.exports = {
    
    '*' : [ 'session_user', 'login_filter' ],

    home : {

        '*' : [ 'session_user', 'login_filter' ]
    },

    channel : {

        '*' : [ 'session_user', 'login_filter', 'channel_permission_check' ]

    },

    user : {

        '*' : [ 'session_user', 'login_filter', 'channel_permission_check' ]

    }
    
};