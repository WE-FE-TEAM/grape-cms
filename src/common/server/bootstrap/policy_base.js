/**
 * Created by jess on 16/6/3.
 */

/**
 * 所有 policy 的基类
 * Created by jess on 16/4/21.
 */


'use strict';


const ControllerBase = require('./controller_base.js');


class PolicyBase extends ControllerBase{

    init(http){
        super.init(http);
    }

    /**
     * 所有policy 都执行 execute 方法
     * @param data {any} 可以在执行policy时,传入额外参数
     * @return {promise}
     */
    execute( data ){}
}


grape.set('policy_base', PolicyBase);

module.exports = PolicyBase;
