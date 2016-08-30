/**
 * 页面编辑的控制器
 * Created by jess on 16/8/15.
 */


'use strict';

// const cssobj = require('cssobj');

const $ = require('common:widget/lib/jquery/jquery.js');

const glpbBase = require('glpb-components-common');

const utils = glpbBase.utils;

const componentFactory = glpbBase.factory;

const EditAsideCtrl = require('designer:widget/edit-aside/edit-aside-ctrl/edit-aside-ctrl.js');

function Builder( config ){

    config = config || {};

    this.isEditMode = config.isEditMode;

    this.platform = config.platform;
    this.templateId = config.templateId || '';
    this.pageName = config.pageName || '';
    this.title = config.title || '新页面';
    this.meta = config.meta || [];
    this.components = config.components || [];

    //当前页面中实时的顶级组件
    this.componentRefs = [];

    //当前页面中所有的组件ID到组件实例的map
    this.pageComponentMap = {};

    this.editCtrl = null;

    this.init();

    //当前处于编辑中的组件ID
    this.currentEditComponentId  = null;

}

$.extend( Builder.prototype, {

    init : function(){

        this.editCtrl = new EditAsideCtrl({
            platform : this.platform,
            el : '#com-edit-section'
        });

        this.editCtrl.render();

    },
    
    bindEvent : function(){

        let that = this;

        this.editCtrl.bindEvent();

        //初始化组件选择栏/编辑器区域
        let $editor = $('#lpb-com-editor');

        let $editorFrame = $(`<iframe src="/cms/designer/view/mobile?" frameborder="0" style="width: 100%; height: 100%;"></iframe>`);
        $editorFrame.on('load', function(){
            let frameDoc = $editorFrame[0].contentDocument;
            let $editor = $( frameDoc.getElementById('lpb-com-editor'));
            $editor
                .droppable({
                    // accept : '.lpb-component',
                    accept : '[data-com-name=layout_row]',
                    classes: {
                        "ui-droppable-active": "custom-state-active"
                    },
                    drop : function(e, ui){
                        let $draggable = ui.draggable;
                        let componentId = $draggable.attr('data-glpb-com-id');
                        if( ! componentId ){

                            that.addNewRow();

                        }else{
                            that.addExistRow(componentId);
                        }

                    }
                });
            that.$editor = $editor;

            that.initPageComponents();
        } );

        $editor.append( $editorFrame );

        // $editor
        //     .droppable({
        //         // accept : '.lpb-component',
        //         accept : '[data-com-name=layout_row]',
        //         classes: {
        //             "ui-droppable-active": "custom-state-active"
        //         },
        //         drop : function(e, ui){
        //             let $draggable = ui.draggable;
        //             let componentId = $draggable.attr('data-glpb-com-id');
        //             if( ! componentId ){
        //
        //                 that.addNewRow();
        //
        //             }else{
        //                 that.addExistRow(componentId);
        //             }
        //
        //         }
        //     });

        if( ! this.isEditMode ){
            //查看页面, 不显示编辑区域
            this.editCtrl.hide();
        }else{
            this.editCtrl.show();
        }


        this.$editor = $editor;

        this.updateEditorViewPort();
    },

    //在编辑器ready的时候,渲染当前页面中的组件
    initPageComponents : function(){
        let components = this.components || [];
        for( let i = 0, len = components.length; i < len; i++ ){
            this.appendRow( components[i] );
        }
    },
    
    createComponentInstance : function(conf){
        conf.page = this;
        let component = componentFactory.createComponentInstance(conf);
        if( component ){
            let componentId = component.getComponentId();
            this.pageComponentMap[componentId] = component;
        }
        return component;
    },

    addNewRow : function(){
        let conf = {
            parentId : null,
            componentName : 'layout_row'
        };

        this.appendRow( conf );
    },

    appendRow : function( conf ){
        let component = this.createComponentInstance(conf);
        component.render();
        let $el = component.$getElement();
        this.$editor.append( $el );
        component.bindEvent();
        this.componentRefs.push( component );
    },
    
    addExistRow : function(componentId){
        let component = this.getComponentById(componentId);
        if( component ){
            if( ! component.editorGetParentId() ){
                //要添加的组件,本来就处于页面第一级
                return;
            }
            let oldParentComponent = component.getParentComponent();
            oldParentComponent.editorRemoveComponent(componentId);
            this.componentRefs.push( component );
            this.$editor.append( component.$getElement() );
        }
    },

    /**
     * 批量修改组件样式
     * @param conf {object} 包含组件ID及该组件要修改的样式 { com-id : {}, com-id-2 : {} }
     */
    updateStyle : function( conf ){

        for( var componentId in conf ){
            if( conf.hasOwnProperty(componentId) ){
                let com = this.getComponentById(componentId);
                if( com ){
                    com.setStyle( conf[componentId] );
                }
            }
        }
    },

    //根据组件ID, 获取已经存在的组件实例
    getComponentById : function(componentId){
        return this.pageComponentMap[componentId];
    },

    editorRemoveComponent : function(componentId){
        let componentRefs = this.componentRefs || [];
        for( var i = 0, len = componentRefs.length; i < len; i++ ){
            let conf = componentRefs[i];
            if( conf.getComponentId() === componentId ){
                componentRefs.splice(i, 1);
                return true;
            }
        }
        console.warn(`(editorRemoveComponent) : 页面不包含子组件${componentId}`);
        return false;
    },

    editorHandleChildMove : function(componentId, direction){
        if( [ 'up', 'down', 'left', 'right'].indexOf(direction) < 0 ){
            console.warn(`子组件移动方向值[${direction}]非法!!只能是 up/down/left/right 之一`);
            return false;
        }
        let componentRefs = this.componentRefs || [];
        let oldIndex = -1;
        let childConf = null;
        let len = componentRefs.length;
        for( var i = 0; i < len; i++ ){
            let temp = componentRefs[i];
            if( temp.getComponentId() === componentId ){
                oldIndex = i;
                childConf = temp;
                break;
            }
        }
        if( ! childConf ){
            console.error(`父组件[${this.componentId}]不包含子组件[${componentId}]!!`);
            return false;
        }
        let newIndex = oldIndex;
        switch(direction){
            case 'up':
            case 'left':
                newIndex = oldIndex - 1;
                break;
            case 'down':
            case 'right':
                newIndex = oldIndex + 1;
                break;
            default:;

        }
        if( newIndex < 0 ){
            alert(`已经是父组件中的第一个了!`);
            return false;
        }
        if( newIndex >= len ){
            alert('已经是父组件中最后一个了');
            return false;
        }
        //先从老的位置删除
        componentRefs.splice(oldIndex, 1);
        //插入到新位置
        componentRefs.splice(newIndex, 0, childConf);

        //移动DOM
        let targetComponent = this.getComponentById(componentId);
        let $target = targetComponent.$getElement();
        utils.moveChildInParent($target, this.$editor, newIndex);
    },

    /**
     * 编辑某个组件
     * @param componentId {string} 组件ID
     */
    editComponent : function(componentId){
        console.log(`编辑组件${componentId}`);
        let component = this.getComponentById(componentId);
        this.editCtrl.showEdit( component );
    },


    setPageSetting : function(data){
        this.pageName = data.pageName;
        this.title = data.title;
        this.platform = data.platform;
        this.templateId = data.templateId;

        this.updateEditorViewPort();
    },

    getPageSetting : function(){
        return {
            pageName : this.pageName,
            title : this.title,
            platform : this.platform,
            templateId : this.templateId
        };
    },

    updateEditorViewPort : function(){
        let platform = this.platform;
        let editorStyle = {
            width : 'auto',
            height : '100%',
            marginLeft : 'auto',
            marginRight : 'auto',
            marginTop : '0'
        };
        if( platform === 'mobile' ){
            editorStyle.width = '375px';
            editorStyle.height = '667px';
            editorStyle.marginTop = '50px';
        }
        this.$editor.css( editorStyle );
    },
    
    //后去当前整个页面的JSON数据(包含所有的子孙节点)
    toJSON : function(){
        
        let resultComponents = [];
        
        let componentRefs = this.componentRefs || [];
        for( let i = 0, len = componentRefs.length; i < len; i++ ){
            let temp = componentRefs[i];
            let componentJSON = temp.toJSON();
            resultComponents.push( componentJSON );
        }
        
        return {
            platform : this.platform,
            templateId : this.templateId,
            pageName : this.pageName,
            title : this.title,
            meta : this.meta || [],
            components : resultComponents || []
        };
    }

} );



module.exports = Builder;

