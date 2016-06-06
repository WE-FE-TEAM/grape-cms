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
        permissions : [ String ]
}, {
    collection : 'roles'
}
);






let Role = mongoose.model('Role', roleSchema );



module.exports = Role;