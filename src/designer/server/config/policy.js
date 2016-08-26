/**
 * Created by jess on 16/8/25.
 */


'use strict';


const loginFilter = [ 'session_user', 'login_filter' ];

const accessFilter = [ 'session_user', 'login_filter', 'channel_permission_check' ];


module.exports = {

    '*' : accessFilter,

    'view' : {
        '*' : []
    }
};