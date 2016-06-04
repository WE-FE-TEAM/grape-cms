/**
 * 用户  的数据模型
 * Created by jess on 16/6/4.
 */


'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');


let userSchema = mongoose.Schema({

    userName : {
        type : String,
        required : true,
        index : {
            unique : true,
            background : false
        }
    },
    password : {
        type : String,
        required : true
    },
    //用户是否可正常使用: 0 正常; 1 被禁用
    enabled : {
        type : Number,
        min : 0,
        max : 1,
        default : 0
    },
    //用户等级, 数字越大, 等级越低  0: 系统管理员; 1: 普通管理员; 2: 普通用户
    level : {
        type : Number,
        default : 999
    },
    roles : [ String ]
}, {
    collection : 'users'
});


//用户密码加密后存储
userSchema.statics.hashPassword = function( password ){
    const salt = '`12wrpowjf[wu2u;-=JKLjw';
    const hash = crypto.createHash('sha256');
    return hash.update('gcms' + password + salt).digest('hex');
};


let User = mongoose.model('User', userSchema);



module.exports = User;