/**
 * Created by jess on 15/9/28.
 */


'use strict';


const moment = require('moment');

const timeUtil = require('./time-utils.js');
const channelUtil = require('./channel-utils');

function myFocus(sel, start, end) {
    try {
        if (sel.setSelectionRange) {
            sel.focus();
            sel.setSelectionRange(start, end);
        }
        else if (sel.createTextRange) {
            var range = sel.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    } catch (e) {
    }
}


var utils = {};


module.exports = utils;

//子utils
utils.timeUtil = timeUtil;
utils.channelUtil = channelUtil;

//将光标定位到输入框的最后
utils.moveCursorEnd = function (element) {
    if (element) {
        var value = element.value;
        if (value) {
            myFocus(element, value.length, value.length);
        }
    }
};

/**
 * 解析JSON的字符串, 解析出错返回 null
 * @param str {string} JSON的字符串
 * @returns {object}
 */
utils.parseJSON = function (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
};

/////////////////解析URL参数///////////
utils.query2json = function (s) {
    s = s.replace(/^\?/, '');
    var out = {};
    var arr = s.split('&');
    for (var i = 0, len = arr.length; i < len; i++) {
        var temp = arr[i];
        var tempArr = temp.split('=');
        if (tempArr.length === 2) {
            try {
                out[tempArr[0]] = decodeURIComponent(tempArr[1]);
            } catch (e) {
            }
        }
    }

    return out;
};

utils.json2query = function (data) {
    var out = '';
    if (data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                out += i + '=' + encodeURIComponent(data[i]) + '&';
            }
        }
    }

    return out;
};


utils.getSearchConf = function () {
    return utils.query2json(location.search);
};

utils.getHashConf = function () {
    var hash = ( location.hash || '' ).substring(1);
    return utils.query2json(hash);
};

///////////////////////////////////数字操作先关函数///////

//保留两位小数
utils.fixFloat1 = function (floatNumber) {
    if (typeof floatNumber == 'string') {
        floatNumber = parseFloat(floatNumber, 10);
    }
    return parseFloat(Math.round(floatNumber * 100) / 100, 10).toFixed(1);
};

//保留两位小数
utils.fixFloat2 = function (floatNumber) {
    if (typeof floatNumber == 'string') {
        floatNumber = parseFloat(floatNumber, 10);
    }
    return parseFloat(Math.round(floatNumber * 100) / 100, 10).toFixed(2);
};
//保留4位小数
utils.fixFloat4 = function (floatNumber) {
    if (typeof floatNumber == 'string') {
        floatNumber = parseFloat(floatNumber, 10);
    }
    return parseFloat(Math.round(floatNumber * 10000) / 10000, 10).toFixed(4);
};
//整数添加,
utils.commaInteger = function (number) {
    number = parseInt(number, 10);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
//浮点数添加,
utils.commaFloat = function (number) {
    if (!number) return 0;
    return utils.fixFloat2(number).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


//是否数字或浮点数
utils.isNumber = function (str) {
    str = str || '';
    return /^\d+(\.\d+)?$/.test(str);
};


//////////////////  基金操作  /////////

//获取 YYYY-MM-DD 格式的日期
utils.formatYearMonthDate = function (date) {
    var out = '';

    if (date && date instanceof Date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var year = date.getFullYear();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        out = year + '-' + month + '-' + day;
    }

    return out;

};

//获取 MM-DD 格式的日期
utils.formatMonthDate = function (date) {
    var out = '';

    if (date && date instanceof Date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        out = month + '-' + day;
    }

    return out;

};


//获取 DD天HH时 |HH时 格式的日期
utils.formatDateHour = function (time) {
    var out = '--', DAY = 24 * 60 * 60 * 1000, HOUR = 60 * 60 * 1000, MIU = 60 * 1000, SEC = 1000;
    //计算出相差天数
    var day = Math.floor(time / DAY)

    //计算出小时数
    var leave1 = time % DAY; //计算天数后剩余的毫秒数
    var hour = Math.floor(leave1 / HOUR);

    //计算相差分钟数
    var leave2 = leave1 % HOUR;      //计算小时数后剩余的毫秒数
    var min = Math.floor(leave2 / MIU);

    //计算相差秒数
    var leave3 = leave2 % MIU;     //计算分钟数后剩余的毫秒数
    var sec = Math.round(leave3 / SEC);
    if (time > 0) {

        if (day > 0) {
            out = day + '天' + hour + '时';
        } else if (hour > 0) {

            out = hour + '时' + min + '分';
        } else if (min > 0) {

            out = min + '分' + sec + '秒';

        } else if (sec > 0) {
            out = sec + '秒';
        }

    }

    return out;

};
utils.getDefaultJSON = function(jsonSchema){

    
}

