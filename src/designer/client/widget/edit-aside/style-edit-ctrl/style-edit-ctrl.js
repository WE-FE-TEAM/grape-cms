/**
 * 组件的样式编辑区域
 * Created by jess on 16/8/17.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');

const factory = require('designer:widget/style-item-edit/factory/factory.js');


function StyleEditCtrl(args){
    
    this.component = args.component;
    
    this.$el = null;
    
    this.styleEditors = [];
    
    this.init();

    this.handleStyleChange = this.handleStyleChange.bind( this );
}


$.extend(StyleEditCtrl.prototype, {
    
    init : function(){},
    
    render : function(){
        let component = this.component;
        let componentId = component.getComponentId();
        let tpl = `<div class="editor-com-style-edit" data-for-cid="${componentId}"></div>`;
        let $el = $(tpl);
        this.$el = $el;

        //获取该组件支持编辑的所有样式, 渲染出可视化编辑
        let style = this.component.getStyle();
        let keys = Object.keys(style);
        //按字母顺序排
        keys.sort();

        if( keys.length > 0 ){
            for( var i = 0, len = keys.length; i < len; i++ ){
                let styleName = keys[i];
                let styleValue = style[styleName];
                let classFn = factory.getEditorClassForStyleKey(styleName);
                let label = factory.getStyleLabel(styleName);
                let view = new classFn({
                    key : styleName,
                    value : styleValue || '',
                    label : label,
                    component : component
                });
                view.render();
                $el.append( view.$getElement() );
                this.styleEditors.push( view );
            }
        }else{
            $el.append(`该组件不支持编辑样式`);
        }
    },

    handleStyleChange : function(key, result){

    },
    
    bindEvent : function(){
        let editors = this.styleEditors || [];
        for( var i = 0, len = editors.length; i < len; i++ ){
            let view = editors[i];
            view.bindEvent();
        }
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
        let editors = this.styleEditors || [];
        for( var i = 0, len = editors.length; i < len; i++ ){
            let view = editors[i];
            view.destroy();
        }
        this.styleEditors = null;
        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }
} );


module.exports = StyleEditCtrl;


