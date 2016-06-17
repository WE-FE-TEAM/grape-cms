/**
 * Created by jess on 16/6/6.
 */


'use strict';


const loginFilter = [ 'session_user', 'login_filter' ];

const accessFilter = [ 'session_user', 'login_filter', 'channel_permission_check' ];

module.exports = {
    
    '*' : loginFilter,

    home : {

        '*' : accessFilter,

        'index' : loginFilter
    },

    channel : {

        '*' : accessFilter,

        'getAllTree' : loginFilter,

        'userChannelsData' : loginFilter,
        
        'channelPath' : loginFilter

    },

    role : {

        '*' : accessFilter
    },

    user : {

        '*' : accessFilter

    },

    article : {
        
        '*' : accessFilter,

        'view' : loginFilter
    }
    
};