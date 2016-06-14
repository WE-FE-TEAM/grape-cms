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
        permissions : {}
}, 
    {
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



let Role = mongoose.model('Role', roleSchema );



module.exports = Role;