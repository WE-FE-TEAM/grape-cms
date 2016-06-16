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
        default : 99
    },
    roles : {
        type : [ String ],
        default : []
    }
}, {
    minimize : false,
    collection : 'users',
    timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
});


/////////////////// 静态方法  ///////////////////////

//用户密码加密后存储
userSchema.statics.hashPassword = function( password ){
    const salt = '`12wrpowjf[wu2u;-=JKLjw';
    const hash = crypto.createHash('sha256');
    return hash.update('gcms' + password + salt).digest('hex');
};


/**
 * 用户是否被禁用
 * @param userDoc {object}
 * @returns {*|boolean}
 */
userSchema.statics.isUserDisabled = function( userDoc ){
    return userDoc && userDoc.enabled === 1;
};

/**
 * 判断用户名是否存在
 * @param userName {string} 用户名
 * @returns {boolean} 存在返回 true; 不存在返回 false 
 */
userSchema.statics.isNameExist = async function( userName ){
    
    userName = userName.trim();
    
    let User = mongoose.model('User');
    
    let out = false;
    
    let temp = await User.findOne({ userName : userName }).exec();
    
    out = !! temp;
    
    return out;
};

/**
 * 获取到所有的 用户数组, 按照 用户创建时间 升序 排列
 * @returns {Array}
 */
userSchema.statics.getAll = async function(){

    let User = mongoose.model('User');

    let out = [];

    //按 创建时间 升序 排列
    out = await User.find({}).sort( { createdAt : 1 } ).lean( true );

    return out;

};

/**
 * 判断用户的 enabled 字段, 是否在合法取值范围
 * @param enabled {int}  整型
 * @returns {boolean}
 */
userSchema.statics.isEnableValid = function( enabled ){

    return [ 0, 1 ].indexOf( enabled ) >= 0;

};


////////////////  实例方法  //////////////////


/**
 * 判断当前用户是否被禁用
 * @return {boolean}  true 当前用户被禁用; false 用户可以正常登陆系统
 */
userSchema.methods.isUserDisabled = function(){
    return this.enabled === 1;
};

/**
 * 用户是否为 超级管理员, 超级管理员具有所有的权限 
 * @returns {boolean}
 */
userSchema.methods.isSuperAdmin = function(){
    return this.level === 0;
};


let User = mongoose.model('User', userSchema);



module.exports = User;