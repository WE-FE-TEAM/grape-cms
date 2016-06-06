/**
 * CMS系统中的所有操作集合
 * Created by jess on 16/6/6.
 */


'use strict';

const mongoose = require('mongoose');


let operationSchema = new mongoose.Schema(
    {
        operationName : {
            type : String,
            required : true,
            index : {
                unique : true,
                background : false
            }
        },
        operationNameZh : {
            type : String,
            required : true,
            index : {
                unique : true,
                background : false
            }
        },
        actionList : [ String ]
    },
    {
        collection : 'operations'
    }
);



let Operation = mongoose.model('Operation', operationSchema);



module.exports = Operation;