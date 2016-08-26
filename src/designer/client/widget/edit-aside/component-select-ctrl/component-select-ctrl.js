/**
 * 提供该平台下支持的所有组件的下拉选择框
 * Created by jess on 16/8/17.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const glpbBase = require('glpb-components-common');

const componentFactory = glpbBase.factory;


function ComponentSelectCtrl( args ){
    this.platform = args.platform;
    this.supportComponents = args.supportComponents || [];
    this.$el = null;

    this.init();
}


$.extend( ComponentSelectCtrl.prototype, {

    init : function(){

    },

    render : function(){
        let $el = $('<div class=" glpb-raw-com-wrap"><h1 class="editor-card-title">平台支持的组件</h1></div>');
        let html = '<div class="clearfix glpb-raw-com-container">';
        let arr = this.supportComponents;
        for( var i = 0, len = arr.length; i < len; i++ ){
            let componentName = arr[i];
            let componentClass = componentFactory.getComponentClass(componentName);
            let componentNameZh = componentClass.componentNameZh || componentName;
            html += `<div class="glpb-component glpb-com-raw-${componentName}" data-com-name="${componentName}">${componentNameZh}</div>`;
        }
        html += '</div>'
        $el.append( html );
        this.$el = $el;
    },

    bindEvent : function(){
        this.$el.find('.glpb-component').draggable({
            revert : 'invalid',
            helper: "clone",
            appendTo: "body",
            iframeFix: true
        });
    },

    $getElement : function(){
        return this.$el;
    },
    
    show : function(){
        this.$el.show();
    },
    
    hide : function(){
        this.$el.hide();
    },

    destroy : function(){
        this.$el.find('.glpb-component').draggable('destroy');
        this.$el.remove();
        this.$el = null;
    }

} );



module.exports = ComponentSelectCtrl;