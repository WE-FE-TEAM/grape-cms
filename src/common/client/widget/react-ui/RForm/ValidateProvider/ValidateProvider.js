/**
 * 用于form表单校验中,提供通用的校验函数
 * Created by jess on 15/11/25.
 */


var JqueryValidator = require('./JqueryValidator.js');
var RRDValidator = require('./RRDValidator.js');


var toString = Object.prototype.toString;

function isBoolean(args){
    return toString.call( args ) === '[object Boolean]';
}

function isString(args){
    return toString.call( args ) === '[object String]';
}

function extend( to ){
    to = to || {};
    var sourceArray = [].slice.call( arguments, 1 );

    for( var i = 0, len = sourceArray.length; i < len; i++ ){
        var from = sourceArray[i];
        if( from ){
            for( var key in from ){
                if( from.hasOwnProperty(key) ){
                    to[key] = from[key];
                }
            }
        }
    }

    return to;
}

function bindKey( fn, msg ){
    return function(){
        if( fn.apply(this, arguments) ){
            return '';
        }
        return msg;
    };
}

//实际上,所有的校验方法都放在这个类上
function Validator(){}

extend( Validator.prototype, JqueryValidator.validate, RRDValidator.validate );

/**
 *
 * @param args {Object}
 * @param args.component {React.Component} 和当前校验实例绑定的组件实例
 * @param args.message {Object} 校验函数出错时的错误消息 { 校验函数名 : '校验失败的消息' }
 * @param args.validate {Object} 校验函数集 { 校验函数名 : function  }
 * @constructor
 */
function ValidateProvider( args ){
    args = args || {};

    //异步校验的时候,会用到
    this._component = args.component || null;

    var message = extend( {}, ValidateProvider.defaultMessage, args.message );


    this.message = message;

    var validator = new Validator({

    });
    extend( validator, args.validate || {} );

    var that = this;

    validator.asyncValidateFinish = function(){
        that.asyncValidateFinish.apply( that, arguments );
    };

    this.validator = validator;

    //校验缓存的值,已经校验过的值,会放到这里,避免相同的请求 { fnName : { value : 'message', value2 : 'message 2' }, fnName : { value : 'message' }   }
    this.validateCache = {};

    //var fnHash = extend( {}, Validator.prototype, args.validate || {} );
    //for( var i in fnHash ){
    //    if( fnHash.hasOwnProperty(i) ){
    //        this[i] = bindKey( fnHash[i], message[i] );
    //    }
    //}

}

extend( ValidateProvider.prototype, {

    registerComponent : function( component ){
        this._component = component;
    },

    unregisterComponent : function(){
        this._component = null;
    },

    getComponent : function(){
        return this._component;
    },

    //validator 中,异步校验完成后,调用这个回调来更新
    asyncValidateFinish : function( fnName, value, messageID ){

        var message = this.message[messageID] || messageID;

        this.setCacheMessage( fnName, value, message );
        this._component && this._component.asyncValidateFinish( value, message );
    },

    setCacheMessage : function( fnName, value, message ){
        var cache = this.validateCache;
        if( cache ){
            var fnCache = cache[fnName] || {};
            fnCache[value] = message;
            cache[fnName] = fnCache;
        }
    },

    getCacheMessage : function( fnName, value ){
        var cache = this.validateCache;
        if( cache && value ){
            var fnCache = cache[fnName];
            if( fnCache && fnCache.hasOwnProperty(value) ){
                return fnCache[value];
            }
        }
        return null;
    },

    /**
     * 复杂的校验规则
     * @param value {String} 值
     * @param ref {Object} 当前校验组件的引用
     * @param conf {Object}
     * @param conf.fn {String} 函数名
     * @param conf.message {String}
     * @param conf.args 调用校验函数时,额外的参数
     */
    validate : function( value, ref, conf ){
        var fnName = conf.fn;

        //先从缓存中取校验结果,如果有,直接返回
        var cacheMessage = this.getCacheMessage( fnName, value );
        if( typeof cacheMessage === 'string' ){
            return cacheMessage;
        }

        // 返回  true 表示验证通过; false 表示验证失败; 字符串,表示 异步校验,需要等待异步结果返回 !!!
        var out = this.validator[fnName]( value, ref, conf.args );
        var finalMsg = '';
        if( isBoolean(out) ){
            //返回的boolean
            if( ! out ){
                finalMsg = this.message[conf.message] || out;
            }
        }else if( isString(out) ){
            //返回字符串,说明是异步校验,需要等待异步结果返回
            finalMsg = this.message[ out ] || out;
        }else{
            //
            throw new Error('validator 校验方法返回值非法!!');
        }


        this.setCacheMessage( fnName, value, finalMsg);

        return finalMsg;
    }

} );

ValidateProvider.defaultMessage = extend( {}, JqueryValidator.message, RRDValidator.message );




ValidateProvider.getInstance = function(args){
    return new ValidateProvider( args );
};

module.exports = ValidateProvider;