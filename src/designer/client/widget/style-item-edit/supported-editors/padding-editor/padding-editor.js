/**
 * padding 内边距的编辑器
 * Created by jess on 16/8/18.
 */

'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const BaseEditor = require('designer:widget/style-item-edit/base/base.js');


function MarginEditor(args){
    BaseEditor.call( this, args );
}


$.extend( MarginEditor.prototype, BaseEditor.prototype, {

    init : function(){
        let value = this.value || '';
        let arr = value.split(' ');
        let paddingTop = arr[0] || 'auto';
        let paddingRight = arr[1] || paddingTop;
        let paddingBottom = arr[2] || paddingTop;
        let paddingLeft = arr[3] || paddingRight;
        
        this.paddingTop = paddingTop;
        this.paddingRight = paddingRight;
        this.paddingBottom = paddingBottom;
        this.paddingLeft = paddingLeft;

        this.onInputKeyUp = this.onInputKeyUp.bind( this );
    },
    
    render : function(){
        let $el = this.$generateContainerElement();
        $el.addClass('style-editor-type-padding');
        let topId = this.generateInputId();
        let rightId = this.generateInputId();
        let bottomId = this.generateInputId();
        let leftId = this.generateInputId();
        
        let html = `
        <label class="style-editor-label" for="${topId}">上内边距</label>
<div>
    <input id="${topId}" class="style-edit-input" data-style="paddingTop" type="text" placeholder="输入上内边距" value="${this.paddingTop}" />
</div>
<label class="style-editor-label" for="${bottomId}">下内边距</label>
<div>
    <input id="${bottomId}" class="style-edit-input" data-style="paddingBottom" type="text" placeholder="输入下内边距" value="${this.paddingBottom}" />
</div>
<label class="style-editor-label" for="${leftId}">左侧内边距</label>
<div>
    <input id="${leftId}" class="style-edit-input" data-style="paddingLeft" type="text" placeholder="输入上内边距" value="${this.paddingLeft}" />
</div>
<label class="style-editor-label" for="${rightId}">右侧内边距</label>
<div>
    <input id="${rightId}" class="style-edit-input" data-style="paddingRight" type="text" placeholder="输入上内边距" value="${this.paddingRight}" />
</div>
        `;

        $el.append( html );

        this.$el = $el;
    },

    bindEvent : function(){
        this.$el.on('keyup', '.style-edit-input', this.onInputKeyUp);
    },

    onInputKeyUp : function(e){
        let $input = $(e.currentTarget);
        let key = $input.attr('data-style');
        this[key] = ( $input.val() || '').trim();
        this.value = `${this.paddingTop} ${this.paddingRight} ${this.paddingBottom} ${this.paddingLeft}`;
        this.triggerChange();
    },

    destroy : function(){
        this.$el.off('keyup', '.style-edit-input', this.onInputKeyUp);
        this.onInputKeyUp = null;
        BaseEditor.prototype.destroy.call( this );
    }
} );



module.exports = MarginEditor;

