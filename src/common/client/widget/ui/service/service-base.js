/**
 * 负责请求后端服务的基类
 * Created by jess on 16/4/26.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery');
const Promise = require('bluebird');


class ServiceBase {
    
    
    constructor( apiConf, adapter ){
        
        let that = this;

        for( var apiKey in apiConf ){
            if( apiConf.hasOwnProperty(apiKey) ){
                that[apiKey] = function(conf){
                    return function(data){
                        return that.request( conf, data);
                    };
                }( apiConf[apiKey] );
            }
        }
        
        this.adapter = $.extend( {}, ServiceBase.prototype.adapter, adapter );

    }

    /**
     * 请求后端服务
     * @param conf {object} 后端服务的配置, 包括请求地址, 返回数据类型, 请求method, 返回数据的 适配器 等
     * @param data {object} 请求的参数
     * @return {Promise} 返回promise对象
     */
    request( conf, data){

        let finalData = $.extend({}, conf.data || {}, data );

        return new Promise( (resolve, reject) => {

            let options = {
                url: conf.url,
                data: finalData,
                method: conf.method || conf.type,
                cache: conf.cache === true,
                dataType: conf.dataType,
                error : (xhr) => {
                    resolve( {
                        requestStatus : this.STATUS.ERROR
                    });
                },

                success : ( data ) => {
                    if( typeof this.adapter[conf.adapter] === 'function' ){
                        data = this.adapter[conf.adapter].call( this, data);
                    }
                    resolve( {
                        requestStatus : this.STATUS.SUCCESS,
                        data : data
                    });
                }
            };

            $.ajax( options );


        });


    }
}

//请求出错
ServiceBase.prototype.STATUS = {
    ERROR : 'error',
    SUCCESS : 'success'
};

//数据适配函数
ServiceBase.prototype.adapter = {};


module.exports = ServiceBase;