/**
 * 左侧操作区域控制器
 * Created by jess on 16/8/17.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');

const glpbBase = require('glpb-components-common');

const componentFactory = glpbBase.factory;

const ComponentSelectCtrl = require('designer:widget/edit-aside/component-select-ctrl/component-select-ctrl.js');
const ComponentEditCtrl = require('designer:widget/edit-aside/component-edit-ctrl/component-edit-ctrl.js');

const DataEditorEntry = require('designer:widget/data-editor/data-editor-entry/data-editor-entry.js');


function EditAsideCtrl(args){
    
    this.platform = args.platform; 
    
    this.componentListCtrl = null;
    this.componentEditMap = {};
    this.dataEditor = null;
    
    this.$el = $( args.el );
    
    this.init();
}


$.extend( EditAsideCtrl.prototype, {
    
    init : function(){
        
        let components = componentFactory.getComponentOfPlatform(this.platform);
        
        this.componentListCtrl = new ComponentSelectCtrl({
            platform : this.platform,
            supportComponents : components
        });

        this.dataEditor = new DataEditorEntry({});
    },
    
    render : function(){
        
        this.componentListCtrl.render();
        this.componentListCtrl.show();
        let $con = this.componentListCtrl.$getElement();
        this.$el.append( $con );

    },
    
    bindEvent : function(){

        let that = this;

        this.componentListCtrl.bindEvent();

        EventEmitter.eventCenter.on('component.data.edit', function( args ){
            that.editComponentData( args );
        } );
    },
    
    destroy : function(){
        this.componentListCtrl.destroy();
        this.componentListCtrl = null;
    },

    showComponentList : function(){
        if( this.currentEdit ){
            this.currentEdit.hide();
        }
        this.componentListCtrl.show();
    },

    showEdit : function(component){
        this.componentListCtrl.hide();
        if( this.currentEdit ){
            if( this.currentEdit.getComponent() === component ){
                this.currentEdit.show();
                return;
            }
            this.currentEdit.destroy();
        }
        let edit = new ComponentEditCtrl({
            component : component
        });
        edit.render();
        this.$el.append( edit.$getElement() );
        edit.bindEvent();
        this.currentEdit = edit;

        edit.show();
    },

    /**
     * 如果当前编辑的是该组件, 退出编辑状态
     * @param component
     */
    exitEditComponent : function( component ){
        if( this.currentEdit ){
            if( this.currentEdit.getComponent() === component ){
                this.currentEdit.destroy();
                this.componentListCtrl.show();
            }
        }
    },

    editComponentData : function(args){
        this.dataEditor.editComponent( args.component );
    },

    hide : function(){
        this.$el.css({
            width : 0
        });
    },

    show : function(){
        this.$el.css({
            width : '280px'
        });
    }
    
} );


module.exports = EditAsideCtrl;

