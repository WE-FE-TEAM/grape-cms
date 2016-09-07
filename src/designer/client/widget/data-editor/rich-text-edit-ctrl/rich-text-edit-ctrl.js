/**
 * 组件的 富文本 数据编辑弹窗
 * Created by jess on 16/8/17.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');

const RichTextEditor = require('designer:widget/editor/rich-text-editor/rich-text-editor.js');


function RichTextEditCtrl(args){
    
    this.component = args.component;
    
    this.$el = null;

    this.editor = null;
    
    this.init();
}


$.extend(RichTextEditCtrl.prototype, {
    
    init : function(){},
    
    render : function(){
        let tpl = `<div class="editor-com-data-dialog" title="编辑组件数据"></div>`;
        let $el = $(tpl);
        this.$el = $el;

        this.editor = new RichTextEditor({
            component : this.component
        });

        this.editor.render();
        $el.append( this.editor.$getElement() );
    },
    
    bindEvent : function(){
        let that = this;
        
        this.editor.bindEvent();
        
        this.$el.dialog({
            resizable: false,
            autoOpen : false,
            height: "auto",
            width: 700,
            modal: true,
            buttons: {
                "确定": function() {
                    that.updateComponentData();
                },
                "取消": function() {
                    that.hide();
                }
            }
        });
    },
    
    $getElement : function(){
        return this.$el;
    },

    setComponent : function(component){
        this.component = component;
        this.editor.setData( component.getData() );
    },
    
    show : function(){
        let that = this;
        this.$el.dialog('open');
    },
    hide : function(){
        this.$el.dialog('close');
    },

    updateComponentData : function(){
        let data = null;
        try{
            data = this.editor.getData();   
        }catch(e){
            alert(` 获取富文本数据错误!!  详细错误信息: \n\n ${e.message}`);
            console.error(e);
            return;
        }
        this.component.setData( data );
        this.hide();
    },

    destroy : function(){
        this.editor.destroy();
        this.editor = null;
        this.$el.dialog('destroy');
        this.$el.off();
        this.$el.remove();
        this.$el = null;
        this.component = null;
    }
} );


module.exports = RichTextEditCtrl;


