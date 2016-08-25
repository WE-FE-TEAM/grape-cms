/**
 * 单个样式编辑器的父类
 * Created by jess on 16/8/18.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');


let id = 0;

function StyleItemBase(args){

    this.key = args.key;
    this.label = args.label;
    this.value = args.value;
    this.component = args.component;

    this.$el = null;
    
    this.init();
}


$.extend( StyleItemBase.prototype, {
    
    init : function(){},
    
    $generateContainerElement : function(){
        return $(`<div class="style-item-editor"></div>`);
    },
    
    generateInputId : function(){
        return 'style-edit-input-' + id++;
    },

    render : function(){

    },

    $getElement : function(){
        return this.$el;
    },

    bindEvent : function(){},

    triggerChange : function(){
        let result = {};
        result[this.key] = this.value;
        this.component.setStyle( result );
    },

    getKey : function(){
        return this.key;
    },

    getValue : function(){
        return this.value;
    },

    destroy : function(){
        this.$el.off();
        this.$el = null;
        this.component = null;
    }
} );


module.exports = StyleItemBase;

