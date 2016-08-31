/**
 * 页面设置的编辑器视图
 * Created by jess on 16/8/25.
 */



'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');


let tpl = `<div class="page-setting-editor form-horizontal" title="编辑页面信息">
        <div class="form-group">
            <label for="name-input" class="col-sm-4 control-label">系统中的页面名</label>
            <div class="col-sm-7">
                <input type="text" class="pageName-input" placeholder="系统中的页面名"/>
            </div>
        </div>
        <div class="form-group">
            <label for="name-input" class="col-sm-4 control-label">用户看到的的页面title</label>
            <div class="col-sm-7">
                <input type="text" class="title-input" placeholder="title"/>
            </div>
        </div>
        <div class="form-group">
            <label for="name-input" class="col-sm-4 control-label">页面展现的平台</label>
            <div class="col-sm-7">
                <select class="platform-select">
                    <option value="mobile">移动端</option>
                    <option value="pc">PC端</option>
                    
                </select>
            </div>
        </div>
       <div class="page-style-con">
            <h2>页面的样式</h2>
            <div class="form-group">
                <label for="name-input" class="col-sm-4 control-label">页面背景色</label>
                <div class="col-sm-7">
                    <input type="text" class="bg-color-input" value="transparent" placeholder="输入页面背景色, 格式: #rrggbbaa"/>
                </div>
            </div>
            <div class="form-group">
                <label for="name-input" class="col-sm-4 control-label">页面背景图片URL</label>
                <div class="col-sm-7">
                    <input type="text" class="bg-image-input" value="" placeholder="输入页面背景图片URL"/>
                </div>
            </div>
            <div class="form-group">
                <label for="name-input" class="col-sm-4 control-label">背景图片大小</label>
                <div class="col-sm-7">
                    <input type="text" class="bg-image-size-input" value="auto auto" placeholder="输入页面背景图片大小: 宽度 高度"/>
                </div>
            </div>
            <div class="form-group">
                <label for="name-input" class="col-sm-4 control-label">背景图片位置</label>
                <div class="col-sm-7">
                    <input type="text" class="bg-image-position-input" value="0 0" placeholder="输入页面背景图片位置: X Y"/>
                </div>
            </div>
            <div class="form-group">
                <label for="name-input" class="col-sm-4 control-label">背景图片重复排列</label>
                <div class="col-sm-7">
                    <select class="bg-image-repeat-select">
                        <option value="no-repeat">不重复</option>
                        <option value="repeat-x">横向重复</option>
                        <option value="repeat-y">竖向重复</option>
                    </select>
                </div>
            </div>
        </div>
</div>
`;

function PageSettingEditor(args){
    
    this.$el = null;
    
}


$.extend( PageSettingEditor.prototype, EventEmitter.prototype, {
    
    render(){
        let $el = $(tpl);
        
        this.$pageNameInput = $('.pageName-input', $el);
        this.$titleInput = $('.title-input', $el);
        this.$platformSelect = $('.platform-select', $el);

        this.$bgColorInput = $('.bg-color-input', $el);
        this.$bgImageInput = $('.bg-image-input', $el);
        this.$bgImageSizeInput = $('.bg-image-size-input', $el);
        this.$bgImagePositionInput = $('.bg-image-position-input', $el);
        this.$bgImageRepeat = $('.bg-image-repeat-select', $el);
        
        this.$el = $el;
    },
    
    bindEvent : function(){
        let that = this;
        this.$el.dialog({
            resizable: false,
            autoOpen : false,
            height: "auto",
            width: 700,
            modal: true,
            buttons: {
                "确定": function() {
                    that.updatePageSetting();
                },
                "取消": function() {
                    that.hide();
                }
            }
        });
    },
    
    setPageSetting : function(data){
        let pageName = data.pageName || '';
        let title = data.title || '';
        let platform = data.platform || '';
        
        this.$pageNameInput.val( pageName );
        this.$titleInput.val( title );
        this.$platformSelect.val( platform );

        //如果平台已经选择了, 不能编辑平台
        if( platform ){
            this.$platformSelect.attr('disabled', 'disabled');
        }

        let style = data.style || {};
        let background = style.background || {};
        this.$bgColorInput.val( background.backgroundColor || 'transparent' );
        this.$bgImageInput.val( background.backgroundImage || '' );
        this.$bgImageSizeInput.val( background.backgroundSize || 'auto auto');
        this.$bgImagePositionInput.val( background.backgroundPosition ||  '0 0');
        this.$bgImageRepeat.val( background.backgroundRepeat || 'no-repeat');
    },

    updatePageSetting : function(){
        let pageName = ( this.$pageNameInput.val() || '' ).trim();
        let title = ( this.$titleInput.val() || '' ).trim();
        let platform = this.$platformSelect.val();
        if( ! pageName || ! title ){
            alert(`[系统内页面名]和[用户可见title]都**不能**为空!!`);
            return;
        }

        let background = {
            backgroundColor : this.$bgColorInput.val(),
            backgroundImage : this.$bgImageInput.val(),
            backgroundSize : this.$bgImageSizeInput.val(),
            backgroundPosition : this.$bgImagePositionInput.val(),
            backgroundRepeat : this.$bgImageRepeat.val()
        };

        this.trigger('change', {
            pageName : pageName,
            title : title,
            platform : platform,
            templateId : 'mobile-normal',

            style : {
                background : background
            }
        } );
        
        this.hide();
    },
    
    $getElement : function(){
        return this.$el;
    },
    
    show : function(){
        this.$el.dialog('open');
    },
    
    hide : function(){
        this.$el.dialog('close');
    },

    destroy : function(){
        this.off();
        this.$el.dialog('destroy');
        this.$el.off();
        this.$el.remove();
        this.$el = null;
    }
    
} );



module.exports = PageSettingEditor;

