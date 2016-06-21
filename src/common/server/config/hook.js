/**
 * 请求声明周期的hook执行配置
 * Created by jess on 16/4/15.
 */


'use strict';

module.exports = {

    request_start : [  ],
    request_parse : [ 'url_rewrite', 'url_parser', 'upload_parser'],
    filter_start : [],
    filter_end : [],
    controller_start : [],
    controller_end : []
};
