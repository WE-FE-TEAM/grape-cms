/**
 * 组件的 data 编辑入口, 内部根据组件的数据类型,分别调用 JSON编辑弹窗/ 富文本编辑弹窗等
 * Created by jess on 16/8/22.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');

const JSONEditCtrl = require('designer:widget/data-editor/json-edit-ctrl/json-edit-ctrl.js');
const RichTextEditCtrl = require('designer:widget/data-editor/rich-text-edit-ctrl/rich-text-edit-ctrl.js');


function DataEditorEntry(args){
    
    this.jsonEditor = null;
    this.richTextEditor = null;
}

$.extend( DataEditorEntry.prototype, {
    
    editComponent : function(component){
        let dataType = component.getDataType();
        switch( dataType ){
            case 'json':
                this.showJSONEditor( component );
                break;
            case 'richtext':
                this.showRichTextEditor( component );
                break;
            default:
                alert(`暂不支持的编辑的组件数据类型: ${dataType}`);
        }
    },
    
    showJSONEditor : function(component){
        if( ! this.jsonEditor ){
            this.jsonEditor = new JSONEditCtrl({
                component : component
            });
            this.jsonEditor.render();
            this.jsonEditor.$getElement().appendTo( document.body );
            this.jsonEditor.bindEvent();
        }

        this.jsonEditor.setComponent( component );

        this.jsonEditor.show();

    },
    
    showRichTextEditor : function(component){
        if( ! this.richTextEditor ){
            this.richTextEditor = new RichTextEditCtrl({
                component : component
            });
            this.richTextEditor.render();
            this.richTextEditor.$getElement().appendTo( document.body );
            this.richTextEditor.bindEvent();
        }

        this.richTextEditor.setComponent( component );

        this.richTextEditor.show();
    },

    destroy : function(){
        if( this.jsonEditor ){
            this.jsonEditor.destroy();
            this.jsonEditor = null;
        }
        if( this.richTextEditor ){
            this.richTextEditor.destroy();
            this.richTextEditor = null;
        }
    }
} );


module.exports = DataEditorEntry;


