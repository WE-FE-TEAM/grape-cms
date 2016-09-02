/**
 * 编辑组件内部的style和data的控制器
 * Created by jess on 16/8/17.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');

const StyleEditCtrl = require('designer:widget/edit-aside/style-edit-ctrl/style-edit-ctrl.js');


const TAB_NAV_ITEM_ACTIVE = 'tab-nav-item-active';

function ComponentEditCtrl(args){

    this.platform = args.platform;

    this.component = args.component;

    this.$el = null;
    this.$instanceNameInput = null;
    this.styleCtrl = null;


    this.init();
}


$.extend( ComponentEditCtrl.prototype, {

    init : function(){
        this.styleCtrl = new StyleEditCtrl({
            component : this.component
        });
        
    },

    render : function(){
        let tpl = `<div class="editor-com-edit-ctrl">
        <div class="editor-com-edit-inner">
            <h2 class="editor-back-to-list"><i class="fa fa-angle-left" aria-hidden="true"></i>返回组件列表</h2>
            <div class="editor-com-name-edit-wrap">
                <label>组件名:</label>
                <input type="text" class="com-instance-name-input" />
            </div>
            <ul class="tab-nav clearfix">
                <li class="tab-nav-item ${TAB_NAV_ITEM_ACTIVE}" data-for="style">编辑样式</li>
                <li class="tab-nav-item" data-for="data">编辑数据</li>
            </ul>
            <div class="tab-con"></div>
        </div>
</div>`;

        let $el = $(tpl);
        this.$el = $el;
        
        this.$instanceNameInput = $el.find('.com-instance-name-input');
        
        this.styleCtrl.render();
        $el.find('.tab-con').append( this.styleCtrl.$getElement() );

    },

    bindEvent : function(){
        let that = this;
        this.$el.on('click', '.editor-back-to-list', function(){
            EventEmitter.eventCenter.trigger('component.list.show');
        } );
        this.$el.on('click', '.tab-nav li', function(e){
            let $li = $(e.currentTarget);
            if($li.hasClass( TAB_NAV_ITEM_ACTIVE )){
                return;
            }
            let forData = $li.attr('data-for');
            if( forData === 'data' ){
                //编辑组件数据
                EventEmitter.eventCenter.trigger('component.data.edit', {
                    component : that.component
                } );
                return;
            }
            $li.siblings().removeClass(TAB_NAV_ITEM_ACTIVE);
            $li.addClass(TAB_NAV_ITEM_ACTIVE);

            that.showView( forData );
        } );

        this.$instanceNameInput.on('input', function(){
            let value = ( that.$instanceNameInput.val() || '').trim();
            if( value ){
                EventEmitter.eventCenter.trigger('component.name.change', {
                    componentId : that.component.getComponentId(),
                    value : value
                } );
            }
        } );
        
        this.styleCtrl.bindEvent();
    },

    showView : function(view){
        switch( view ){
            case 'style':

                this.styleCtrl.show();
                break;
            case 'data':
                this.styleCtrl.hide();

                break;
            default:
                ;
        }
    },

    $getElement : function(){
        return this.$el;
    },

    show : function(){
        let instanceName = this.component.getInstanceName();
        this.$instanceNameInput.val( instanceName );
        this.$el.show();
        this.component.addEditingState();
    },

    hide : function(){
        this.$el.hide();
        this.component.removeEditingState();
    },
    
    getComponent : function(){
        return this.component;
    },

    destroy : function(){
        this.component.removeEditingState();
        this.styleCtrl.destroy();

        this.styleCtrl = null;

        this.$el.off();
        this.$el.remove();
        this.$el = null;
        this.component = null;
    }
} );



module.exports = ComponentEditCtrl;


