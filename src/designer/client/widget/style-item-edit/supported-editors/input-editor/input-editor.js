/**
 * 最简单的单个样式编辑器视图, 提供一个单行输入框
 * Created by jess on 16/8/18.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const BaseEditor = require('designer:widget/style-item-edit/base/base.js');


function InputEditor(args){
    BaseEditor.call( this, args );
}

$.extend( InputEditor.prototype, BaseEditor.prototype, {
    
    init : function(){
        this.onInputKeyUp = this.onInputKeyUp.bind(this );
    },
    
    render : function(){
        let $el = this.$generateContainerElement();
        $el.addClass('style-editor-type-input');
        let tpl = `<label class="style-editor-label">${this.label}</label>
<div>
    <input class="style-edit-input" type="text" placeholder="${this.label}" value="${this.value}" />
</div>
`;
        $el.append( tpl );
        
        this.$el = $el;
    },
    
    bindEvent : function(){

        this.$el.on('keyup', 'input', this.onInputKeyUp);
    },
    
    destroy : function(){
        this.$el.off('keyup', 'input', this.onInputKeyUp);
        this.onInputKeyUp = null;
        BaseEditor.prototype.destroy.call( this );
    },
    
    onInputKeyUp : function(e){
        let value = this.$el.find('input').val();
        this.value = value;
        this.triggerChange();
    }
    
} );




module.exports = InputEditor;



