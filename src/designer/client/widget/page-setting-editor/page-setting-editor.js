/**
 * 页面设置的编辑器视图
 * Created by jess on 16/8/25.
 */



'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');


let tpl = `<div class="page-setting-editor form-horizontal" title="编辑页面信息">
        <div class="form-group">
            <label for="name-input" class="col-sm-2 control-label">系统中的页面名</label>
            <div class="col-sm-9">
                <input type="text" class="pageName-input" placeholder="系统中的页面名"/>
            </div>
        </div>
        <div class="form-group">
            <label for="name-input" class="col-sm-2 control-label">用户看到的的页面title</label>
            <div class="col-sm-9">
                <input type="text" class="title-input" placeholder="title"/>
            </div>
        </div>
        <div class="form-group">
            <label for="name-input" class="col-sm-2 control-label">页面展现的平台</label>
            <div class="col-sm-9">
                <select class="platform-select">
                    <option value="mobile">移动端</option>
                    <option value="pc">PC端</option>
                    
                </select>
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
    },

    updatePageSetting : function(){
        let pageName = ( this.$pageNameInput.val() || '' ).trim();
        let title = ( this.$titleInput.val() || '' ).trim();
        let platform = this.$platformSelect.val();
        if( ! pageName || ! title ){
            alert(`[系统内页面名]和[用户可见title]都**不能**为空!!`);
            return;
        }
        this.trigger('change', {
            pageName : pageName,
            title : title,
            platform : platform
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

