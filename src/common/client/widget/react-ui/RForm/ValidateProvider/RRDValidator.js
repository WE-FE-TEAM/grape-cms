/**
 * 人人贷已有的校验规则
 * Created by jess on 15/11/26.
 */


var $ = require('common:widget/lib/jquery/jquery.js');

var message = {
    required: "不能为空",
    remoteCode: "验证码输入错误",
    isEmail: "请输入有效的邮箱地址",
    equalPsw: "两次密码输入不一致",
    length: "字数超过限制",
    minPswLength: "长度应为6-16个字符",
    maxPswLength: "长度应为6-16个字符",
    isMobile: "请输入正确手机号",
    isMobileOrEmail: "请输入正确的邮箱地址或手机号码",
    isNickName: "昵称只能由中文、英文字母、数字、下划线组成",
    isRealName:"包含非法字符",
    isHasUnderlineFrontEnd: "不能以下划线开头或结尾",
    isNickNameLength: "长度为4-16个字符之间",
    isHasYX: "前缀请不要使用“YX_”,且后缀请不要使用“_yx”",
    nickNameRemote: "昵称已存在",
    userNameRemote: "手机号已经存在",
    isPassWord: "包含非法字符",
    isPassNotAllNum:"密码不能全为数字",
    isPassNotRepeat:"密码不能为同一个字符",
    equalTo: "两次密码输入不一致",
    agree: "请同意我们的条款",
    contractPay: "支付前请阅读并同意协议",
    maxLoanTitle: "借款标题不能超过14字",
    isOneDecimal: "利率最大保留小数点后1位",
    isRateOver: "您输入的借款年利率超出范围，请重新输入！",
    minLoanDescription: "借款描述应限制在20-500字之间",
    maxLoanDescription: "借款描述应限制在20-500字之间",
    minRealNameLength: "姓名长度在2-32字之间",
    maxRealNameLength: "姓名长度在2-32字之间",
    isPostCode: "邮政编码须为6位数字",
    isIDNum: "请正确输入您的二代身份证号码",
    isPhone: "请正确输电话号码",
    isUrl: "请输入正确的网址",
    isAmount: "请输入正确的金额",
    minAmount: "单笔充值金额应大于1元且小于或等于30万元",
    maxAmount: "单笔充值金额应大于1元且小于或等于30万元",
    bankRequired: "请选择充值方式",
    userBankId: "请选择提现银行卡",
    isEnough: "您的账户余额不足",
    equalToBank: "您输入的银行卡号不一致",
    bankCardLength: "银行卡号须为12-19位数字",
    isBankCard: "银行卡号输入错误",
    isCardDeposit: "开户行只能由中文、英文字母、数字、小括号组成",
    maxCashPasswordLength: "密码长度不超过16位",
    depositLength: "开户行的名称限制在64字以内",
    isEducationCode: "学历在线验证码须为12位数字",
    isIntNum: "请输入正整数",
    codeLength: "请输入4位验证码",
    minCachLength:"提现金额不能小于1元",
    maxNumberLength : "提现金额小于15位数字",
    intention:"请选择角色",
    phoneCodeMsg:"手机验证码不能为空",
    phoneCodeMsgLength:"请输入4位验证码",
    qianjinMsgLength : "验证码为6位",
    loanProductType: '请选择您要申请的借款产品',

    requestFail : '网络异常,请稍后再试',
    asyncCheckNickname : '正在检查昵称是否可用',
    nicknameNotAvailable : '昵称已存在',

    asyncCheckMobile : '正在检查手机号是否存在',
    mobileNotAvailable : '该手机号已经存在'
};


var validate = {
    isDate: function (intYear, intMonth, intDay) {
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay))
            return false;
        if (intMonth > 12 || intMonth < 1)
            return false;
        if (intDay < 1 || intDay > 31)
            return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30))
            return false;
        if (intMonth == 2) {
            if (intDay > 29)
                return false;
            if ((((intYear % 100 === 0) && (intYear % 400 !== 0)) || (intYear % 4 !== 0)) && (intDay > 28))
                return false;
        }
        return true;
    },
    isIDNum: function (cId) {
        var pattern;
        if (cId.length == 18) {
            pattern = /^\d{17}(\d|x|X)$/;// 正则表达式,18位且前17位全是数字，最后一位只能数字,x,X
            if (!pattern.exec(cId)) {
                return false;
            }
            if (!form.is.isDate(cId.substring(6, 10), cId.substring(10, 12), cId.substring(12, 14))) {
                return false;
            }
            var strJiaoYan = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
            var intQuan = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];
            var intTemp = 0;
            for (var i = 0; i < cId.length - 1; i++)
                intTemp += cId.substring(i, i + 1) * intQuan[i];
            intTemp %= 11;
            if (cId.substring(cId.length - 1, cId.length).toUpperCase() != strJiaoYan[intTemp]) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    },
    isUserName: function (n) {
        var myreg = /^\w+(@)\w+(\.\w+)(\.\w+|)$/;
        var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return myreg.test(n) || mobile.test(n);
    },
    isRealName: function (n) {
        //正则后的/都加了括号，不加jslint会警告，Douglas大神已回答了为什么加括号好些，看：http://groups.yahoo.com/neo/groups/jslint_com/conversations/topics/345
        return (/^[\u4E00-\u9FA5]+$/).test(n);
    },
    isNickName: function (n) {
        return (/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/).test(n);
    },
    isHasUnderlineFrontEnd: function (v) {
        return (/^(?!_)(?!.*?_$).*$/).test(v);
    },
    isHasYX: function (v) {
        return !(/^(YX_|yx_|yX_|Yx_).*|(.*(_YX|_yx|_yX|_Yx)$)/).test(v);
    },
    isNickNameLength: function (v) {
        function getLength(str) {
            var len = str.length;
            var reLen = 0;
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                    // 全角
                    reLen += 2;
                } else {
                    reLen++;
                }
            }
            return reLen;
        }

        v = v.trim();

        return getLength( v ) <= 16 && getLength( v ) >= 4;
    },
    isPassWord: function (p) {
        return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{1,}$/).test(p);
    },
    isPassNotAllNum:function(v){
        return !((/^\d{1,}$/).test(v));
    },
    isPassNotRepeat:function(v){
        // var s = v.substring(0,1);
        //if(s === '*') return true;
        // return !(new RegExp("^"+s+"{1,}$","g").test(v));
        return  !(new RegExp(/^(.)\1+$/).test(v));
    },
    isMobile: function (t) {
        return (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/).test(t);
    },
    isPhone: function (p) {
        return (/^0\d{2,3}[-]?\d{8}$|^0\d{3}[-]?\d{7,8}$/).test(p);
    },
    isEmail: function (e) {
        return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i).test(e);
    },
    isMobileOrEmail: function (v) {
        return this.isMobile(v) || this.isEmail(v);
    },
    isUrl: function (v) {
        return (/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i).test(v);
    },
    isAmount: function (v) {
        return (/^[0-9]*(\.[0-9]{1,2})?$/).test(v);
    },
    isPostCode: function (v) {
        return (/^\d{6}$/).test(v);
    },
    isBankCard: function (v) {
        return (/^\d{12,19}$/).test(v);
    },
    isCardDeposit: function (v) {
        return (/^[a-zA-Z0-9\(\)\（\）\u4e00-\u9fa5]+$/).test(v);
    },
    isEducationCode: function (v) {
        return (/^\d{12}$/).test(v);
    },
    isIntNum: function (v) {
        return (/^\d+$/).test(v);
    },
    //loan page
    isOneDecimal: function (v) {
        return (/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/).test(v);
    },
    isLuhn: function (v) {
        //luhn算法，见：http://rosettacode.org/wiki/Luhn_test_of_credit_card_numbers
        //主要是验证银行卡和信用卡
        //value为字符串类型
        if (/[^0-9-\s]+/.test(v)) return false;

        var nCheck = 0, nDigit = 0, bEven = false;
        v = v.replace(/\D/g, "");

        for (var n = v.length - 1; n >= 0; n--) {
            var cDigit = v.charAt(n);
            nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) === 0;
    },
    //校验 checkbox 是否选中
    isChecked : function( value ){
        return !!value;
    },
    //是否长度固定相等
    isLengthEqual : function( value, component, args ){
        return value.length === args;
    },
    //用户昵称是否已经存在
    isNicknameAvailable : function( value, component, args){

        var that = this;

        var url = '/checkUserNickname!checkNickname.action?nickName=' + encodeURIComponent(value);
        $.get( url ).done( function(res){
            var isOK = res === true || res === 'true';
            var messageID = isOK ? '' : 'nicknameNotAvailable';
            that.asyncValidateFinish( 'isNicknameAvailable', value, messageID );
        }).fail(function(){
            that.asyncValidateFinish( 'isNicknameAvailable', value, 'requestFail' );
        });

        return 'asyncCheckNickname';
    },
    //用户手机号是否已经存在
    isMobileAvailable : function( value, component, args ){
        var that = this;
        var url = '/checkEmail.action?username=' + encodeURIComponent(value);
        $.get( url ).done( function(res){
            var isOK = res === true || res === 'true';
            var messageID = isOK ? '' : 'mobileNotAvailable';
            that.asyncValidateFinish( 'isMobileAvailable', value, messageID );
        }).fail(function(){
            that.asyncValidateFinish( 'isMobileAvailable', value, 'requestFail' );
        });

        return 'asyncCheckMobile';
    }
};


module.exports = {
    message : message,
    validate : validate
};
