/**
 * Created by jess on 16/6/4.
 */


'use strict';


module.exports = {


    log : {
        name : 'grape-cms',
        streams : [
            {
                level : 'error'
            },
            {
                level : 'fatal'
            },
            {
                level : 'trace',
                stream :  process.stdout
            }
        ]
    }

};

