/**
 * 组件的  背景色/背景图片  的编辑器
 * Created by jess on 16/8/31.
 */

'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const BaseEditor = require('designer:widget/style-item-edit/base/base.js');


/*

为了降低复杂度, 如果传递的简写版本 background , 还需要手动解析出  backgroundColor backgroundImage backgroundSize 等属性
为了 **不解析background**, 针对 background 属性特殊处理, 组件传递的  background  是这样一个JSON:

{
    backgroundColor : '#ff07dd',
    backgroundImage : 'http://xxx.xx.com/aaa/sss.png',
    backgroundSize : '100% 100%',
    backgroundPosition : '0 0',
    backgroundRepeat : 'no-repeat'
}

 */

function BackgroundEditor(args){
    BaseEditor.call( this, args );
}


$.extend( BackgroundEditor.prototype, BaseEditor.prototype, {

    init : function(){
        let value = this.value || {};
        
        let backgroundColor = value.backgroundColor || 'transparent';
        let backgroundImage = value.backgroundImage || '';
        let backgroundSize = value.backgroundSize || 'auto auto';
        let backgroundPosition = value.backgroundPosition || '0 0';
        let backgroundRepeat = value.backgroundRepeat || 'no-repeat';

        this.backgroundColor = backgroundColor;
        this.backgroundImage = backgroundImage;
        this.backgroundSize = backgroundSize;
        this.backgroundPosition = backgroundPosition;
        this.backgroundRepeat = backgroundRepeat;

        this.onInputKeyUp = this.onInputKeyUp.bind( this );
    },

    render : function(){
        let $el = this.$generateContainerElement();
        $el.addClass('style-editor-type-background');

        let html = '';
        
        html += this._renderColorInput();
        html += this._renderImageInput();
        html += this._renderImageSize();
        html += this._renderImagePosition();

        $el.append( html );

        this.$el = $el;
    },
    
    //渲染 backgroundColor 输入框
    _renderColorInput : function(){
        let inputId = this.generateInputId();
        return `<label class="style-editor-label" for="${inputId}">背景色</label><div><input id="${inputId}" class="style-edit-input" data-style="backgroundColor" type="text" placeholder="输入背景色, 格式: #rrggbbaa " value="${this.backgroundColor}" /></div>`;
    },

    //渲染 backgroundImage 输入框
    _renderImageInput : function(){
        let inputId = this.generateInputId();
        return `<label class="style-editor-label" for="${inputId}">背景图片</label><div><input id="${inputId}" class="style-edit-input" data-style="backgroundImage" type="url" placeholder="输入背景图片的URL地址" value="${this.backgroundImage}" /></div>`;
    },

    //渲染 backgroundSize 输入框
    _renderImageSize : function(){
        let inputId = this.generateInputId();
        return `<label class="style-editor-label" for="${inputId}">背景图片大小</label><div><input id="${inputId}" class="style-edit-input" data-style="backgroundSize" type="url" placeholder="背景图片大小: 宽度 高度" value="${this.backgroundSize}" /></div>`;
    },

    //渲染 backgroundPosition 输入框
    _renderImagePosition : function(){
        let inputId = this.generateInputId();
        return `<label class="style-editor-label" for="${inputId}">背景图片位置</label><div><input id="${inputId}" class="style-edit-input" data-style="backgroundPosition" type="url" placeholder="背景图片位置: X Y" value="${this.backgroundPosition}" /></div>`;
    },

    bindEvent : function(){
        this.$el.on('keyup', '.style-edit-input', this.onInputKeyUp);
    },

    onInputKeyUp : function(e){
        let $input = $(e.currentTarget);
        let key = $input.attr('data-style');
        this[key] = ( $input.val() || '').trim();
        this.value = {
            backgroundColor : this.backgroundColor,
            backgroundImage : this.backgroundImage,
            backgroundSize : this.backgroundSize,
            backgroundPosition : this.backgroundPosition,
            backgroundRepeat : this.backgroundRepeat
        };
        this.triggerChange();
    },

    destroy : function(){
        this.$el.off('keyup', '.style-edit-input', this.onInputKeyUp);
        this.onInputKeyUp = null;
        BaseEditor.prototype.destroy.call( this );
    }
} );



module.exports = BackgroundEditor;
