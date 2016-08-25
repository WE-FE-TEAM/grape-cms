/**
 * margin 外边距的编辑器
 * Created by jess on 16/8/18.
 */


'use strict';


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
        let marginTop = arr[0] || 'auto';
        let marginRight = arr[1] || marginTop;
        let marginBottom = arr[2] || marginTop;
        let marginLeft = arr[3] || marginRight;
        
        this.marginTop = marginTop;
        this.marginRight = marginRight;
        this.marginBottom = marginBottom;
        this.marginLeft = marginLeft;

        this.onInputKeyUp = this.onInputKeyUp.bind( this );
    },
    
    render : function(){
        let $el = this.$generateContainerElement();
        $el.addClass('style-editor-type-margin');
        let topId = this.generateInputId();
        let rightId = this.generateInputId();
        let bottomId = this.generateInputId();
        let leftId = this.generateInputId();
        
        let html = `
        <label class="style-editor-label" for="${topId}">上外边距</label>
<div>
    <input id="${topId}" class="style-edit-input" data-style="marginTop" type="text" placeholder="输入上外边距" value="${this.marginTop}" />
</div>
<label class="style-editor-label" for="${bottomId}">下外边距</label>
<div>
    <input id="${bottomId}" class="style-edit-input" data-style="marginBottom" type="text" placeholder="输入下外边距" value="${this.marginBottom}" />
</div>
<label class="style-editor-label" for="${leftId}">左侧外边距</label>
<div>
    <input id="${leftId}" class="style-edit-input" data-style="marginLeft" type="text" placeholder="输入上外边距" value="${this.marginLeft}" />
</div>
<label class="style-editor-label" for="${rightId}">右侧外边距</label>
<div>
    <input id="${rightId}" class="style-edit-input" data-style="marginRight" type="text" placeholder="输入上外边距" value="${this.marginRight}" />
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
        this.value = `${this.marginTop} ${this.marginRight} ${this.marginBottom} ${this.marginLeft}`;
        this.triggerChange();
    },

    destroy : function(){
        this.$el.off('keyup', '.style-edit-input', this.onInputKeyUp);
        this.onInputKeyUp = null;
        BaseEditor.prototype.destroy.call( this );
    }
} );



module.exports = MarginEditor;

