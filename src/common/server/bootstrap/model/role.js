/**
 * 角色 
 * Created by jess on 16/6/6.
 */


'use strict';


const mongoose = require('mongoose');


let roleSchema = new mongoose.Schema(
    {
        roleName : {
            type : String,
            required : true,
            index : {
                unique : true,
                background : false
            }
        },
        permissions : {
            type : mongoose.Schema.Types.Mixed,
            default : {}
        }
}, 
    {
        versionKey: false,
        minimize : false,
        collection : 'roles',
        timestamps: { createdAt: 'createdAt', updatedAt : 'updatedAt' }
    }
);


/**
 * 判断 是否存在同名的角色
 * @param roleName {string} 栏目名
 * @returns {boolean}
 */
roleSchema.statics.isNameExist = async function( roleName ){

    roleName = roleName.trim();

    let Role = mongoose.model('Role' );

    let out = false;

    let temp = await Role.findOne({ roleName : roleName }).exec();

    if( temp ){
        //已经存在同名的角色
        out = true;
    }

    return out;
};

/**
 * 获取所有的角色数组, 按照角色名 升序
 * @returns {Array}
 */
roleSchema.statics.getAll = async function(){

    let out = [];

    let Role = mongoose.model('Role' );

    out = await Role.find({}).sort( { roleName : 1 } ).lean( true );

    out.map( (role) => {
        role.permissions = role.permissions || {};
    });

    return out;
};

/**
 * 删除角色 roleId, 并从用户表中, 删除对该角色的引用
 * @param roleId {string}
 */
roleSchema.statics.deleteRoleById = async function( roleId ){

    let Role = mongoose.model('Role' );
    let User = mongoose.model('User');

    //先从 角色表 中, 删除对应的角色
    let temp = await Role.remove({ _id : roleId });

    //从 用户表 中, 删除该角色
    temp = await User.update({}, { $pullAll : { roles : [ roleId ]} } ).exec();

};

let Role = mongoose.model('Role', roleSchema );



module.exports = Role;