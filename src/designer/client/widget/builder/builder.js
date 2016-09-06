/**
 * 页面编辑的控制器
 * Created by jess on 16/8/15.
 */


'use strict';

// const cssobj = require('cssobj');

const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');

const glpbBase = require('glpb-components-common');

const utils = glpbBase.utils;

const componentFactory = glpbBase.factory;

const EditAsideCtrl = require('designer:widget/edit-aside/edit-aside-ctrl/edit-aside-ctrl.js');

const PageOutlineView = require('designer:widget/page-outline-view/page-outline-view.js');


function Builder( config ){

    config = config || {};

    this.isEditMode = config.isEditMode;

    this.platform = config.platform;
    this.templateId = config.templateId || '';
    this.pageName = config.pageName || '';
    this.title = config.title || '新页面';
    this.meta = config.meta || [];
    this.style = config.style || {};
    this.components = config.components || [];

    //当前页面中实时的顶级组件
    this.componentRefs = [];

    //当前页面中所有的组件ID到组件实例的map
    // this.pageComponentMap = {};

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

        this.pageOutlineView = new PageOutlineView({
            builder : this,
            el : '#page-tree-section'
        });

        this.pageOutlineView.render();

    },
    
    bindEvent : function(){

        let that = this;

        this.editCtrl.bindEvent();

        this.pageOutlineView.bindEvent();

        EventEmitter.eventCenter.on('component.list.show', function(){
            that.showComponentList();
        } );

        EventEmitter.eventCenter.on('component.name.change', function( args ){
            let componentId = args.componentId;
            let value = args.value;
            that.updateComponentName( componentId, value );
        });

        //初始化组件选择栏/编辑器区域
        let $frameWrap = $('#lpb-editor-frame-wrap');

        let $editorFrame = $(`<iframe src="/cms/designer/view/mobile?" frameborder="0" style="width: 100%; height: 100%;"></iframe>`);
        $editorFrame.on('load', function(){
            let frameDoc = $editorFrame[0].contentDocument;
            let $editorBody = $( frameDoc.body );
            let $editor = $( frameDoc.getElementById('lpb-com-editor'));

            let $droppableHolder = $('<div class="top-droppable-holder"><i class="fa fa-plus" aria-hidden="true"></i>追加组件到最后</div>').appendTo( frameDoc.getElementById('lpb-com-editor') );

            $droppableHolder
                .droppable({
                    accept : '[data-com-name]:not([data-com-name=layout_column])',
                    // accept : '[data-com-name=layout_row]',
                    classes: {
                        "ui-droppable-active": "custom-state-active",
                        "ui-droppable-hover": "custom-state-hover"
                    },
                    tolerance: "pointer",
                    drop : function(e, ui){
                        let $draggable = ui.draggable;
                        let componentId = $draggable.attr('data-glpb-com-id');

                        if( ! componentId ){
                            let componentName = $draggable.attr('data-com-name');
                            that.addNewComponent( componentName );

                        }else{
                            that.addExistRow(componentId);
                        }

                    }
                });
            that.$editor = $editor;
            that.$editorBody = $editorBody;
            that.$droppableHolder = $droppableHolder;

            that.updatePageStyle();
            that.initPageComponents();
        } );

        $frameWrap.append( $editorFrame );

        if( ! this.isEditMode ){
            //查看页面, 不显示编辑区域
            this.editCtrl.hide();
        }else{
            this.editCtrl.show();
            this.pageOutlineView.show();
        }


        this.$frameWrap = $frameWrap;

        this.updateEditorViewPort();
    },

    //在编辑器ready的时候,渲染当前页面中的组件
    initPageComponents : function(){
        let components = this.components || [];
        for( let i = 0, len = components.length; i < len; i++ ){
            this.appendComponent( components[i] );
        }

        this.renderOutlineTree();
    },
    
    createComponentInstance : function(conf){
        conf.page = this;
        let component = componentFactory.createComponentInstance(conf);

        return component;
    },

    addNewComponent : function( componentName ){
        let conf = {
            parentId : null,
            componentName : componentName
        };

        this.appendComponent( conf );
    },

    appendComponent : function( conf ){
        let component = this.createComponentInstance(conf);
        component.render();
        let $el = component.$getElement();
        this.$droppableHolder.before( $el );
        component.bindEvent();
        this.componentRefs.push( component );

        this.renderOutlineTree();
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
            this.$droppableHolder.before( component.$getElement() );
        }

        this.renderOutlineTree();
    },

    //根据组件ID, 获取已经存在的组件实例
    getComponentById : function(componentId){
        return componentFactory.getComponentById( componentId );
        // return this.pageComponentMap[componentId];
    },

    editorRemoveComponent : function(componentId){

        let out = false;

        let componentRefs = this.componentRefs || [];
        for( var i = 0, len = componentRefs.length; i < len; i++ ){
            let conf = componentRefs[i];
            if( conf.getComponentId() === componentId ){
                componentRefs.splice(i, 1);
                out = true;
                break;
            }
        }
        if( out ){
            this.renderOutlineTree();
        }else{
            console.warn(`(editorRemoveComponent) : 页面不包含子组件${componentId}`);
        }

        return out;
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
            console.error(`页面不包含子组件[${componentId}]!!`);
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

        this.renderOutlineTree();
    },

    /**
     * 编辑某个组件
     * @param componentId {string} 组件ID
     */
    editComponent : function(componentId){

        console.log(`编辑组件${componentId}`);
        let component = this.getComponentById(componentId);

        //将要编辑的组件滚动到可视区域内
        let $el = component.$getElement();
        if( $el.length ){
            $el[0].scrollIntoView();
        }

        if( ! this.isEditMode ){
            return;
        }


        this.editCtrl.showEdit( component );
        this.pageOutlineView.selectNodeById( componentId );

    },

    showComponentList : function(){
        this.editCtrl.showComponentList();
        this.pageOutlineView.unselectNode();
    },


    setPageSetting : function(data){
        this.pageName = data.pageName;
        this.title = data.title;
        this.platform = data.platform;
        this.templateId = data.templateId;
        this.style = data.style || {};

        this.updateEditorViewPort();
        this.updatePageStyle();
    },

    getPageSetting : function(){
        return {
            pageName : this.pageName,
            title : this.title,
            platform : this.platform,
            templateId : this.templateId,
            style : this.style
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
            // editorStyle.width = '375px';
            // editorStyle.height = '667px';
            // editorStyle.marginTop = '50px';
            this.$frameWrap.addClass('editor-iphone-view');
        }else{
            this.$frameWrap.removeClass('editor-iphone-view');
        }
        // this.$frameWrap.css( editorStyle );
    },

    updatePageStyle : function(){
        let cssStyle = utils.translateComponentStyle( this.style || {} );
        this.$editorBody.css( cssStyle );
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
            style : this.style,
            components : resultComponents || []
        };
    },

    toSimpleJSON : function(){
        let resultComponents = [];

        let componentRefs = this.componentRefs || [];
        for( let i = 0, len = componentRefs.length; i < len; i++ ){
            let temp = componentRefs[i];
            let componentJSON = temp.toSimpleJSON();
            resultComponents.push( componentJSON );
        }

        return resultComponents;
    },

    /**
     * 销毁某个组件ID对应的组件机器子孙组件
     * @param componentId {string} 组件ID
     */
    destroyComponentById : function( componentId ){

        if( ! window.confirm(`是否确定删除组件??\n\n一旦删除, 不能回退, 请务必慎重!!!`)){
            return;
        }
        
        let component = this.getComponentById( componentId );
        if( ! component ){
            alert(`要销毁的组件ID[${componentId}]找不到对应组件!!`);
            return;
        }

        //先将要销毁的组件, 从父组件中删除
        let parentComponent = component.getParentComponent();
        parentComponent.editorRemoveComponent( componentId );

        //执行组件的销毁方法, 该方法内部会递归的销毁其包含的子孙组件
        component.destroy();

        //更新右侧的组件树
        // this.renderOutlineTree();
    },

    /**
     * 组件销毁前, 回调
     * @param component
     */
    beforeComponentDestroy : function( component ){
        this.editCtrl.exitEditComponent( component );
    },

    /**
     * 在某个组件内包含的子组件有 增加/排序/删除 等操作发生后, 回调
     * @param component {object}  子组件发生改变的父组件
     */
    afterComponentChildChange : function(component){
        this.updateOutlineNode( component.getComponentId() );
    },

    //刷新整个组件抽象树
    renderOutlineTree : function(){
        let data = this.toSimpleJSON();
        this.pageOutlineView.setData( data );
    },

    /**
     * 更新组件树下某个节点的数据
     * @param componentId {string} 组件ID
     */
    updateOutlineNode : function(componentId){
        let component = this.getComponentById( componentId );
        if( component ){
            let data = component.toSimpleJSON();
            this.pageOutlineView.updateNodeDataById( componentId, data );
        }
    },

    /**
     * 更新组件实例的名字
     * @param componentId {string} 组件ID
     * @param name {string} 组件实例的名字
     */
    updateComponentName : function( componentId, name){
        let component = this.getComponentById( componentId );
        if( component ){
            component.setInstanceName( name );
            this.pageOutlineView.updateNodeNameById( componentId, component.getInstanceName() );
        }else{
            console.error(`试图修改不存在的组件ID[${componentId}]对应的instanceName`);
        }
    },

    /**
     * 尝试将 componentId 对应的组件, 插入到 targetContainerId 对应的组件下的 insertIndex 位置上
     * @param componentId {string} 要移动的组件ID
     * @param targetContainerId {string} 要移动到的父组件ID
     * @param insertIndex {int} 要插入到父组件的位置需要, 从0开始
     */
    tryMoveComponentById : function( componentId, targetContainerId, insertIndex){
        let component = this.getComponentById( componentId );
        if( ! component ){
            alert(`组件ID[${componentId}]对应的组件不存在!!!`);
            return;
        }
        let targetParent = this;
        if( targetContainerId ){
            targetParent = this.getComponentById( targetContainerId );
        }
        
        let componentName = component.getComponentName();
        
        //先检查目标父组件, 是否支持接收对应类型的子组件
        if( ! targetParent.canAcceptChildComponentName(componentName) ){
            alert(`目标组件不能包含拖动的组件!!`);
            return;
        }

        targetParent.insertChildAtIndex(component, insertIndex);
    },

    canAcceptChildComponentName : function(componentName){
        return [ 'layout_column'].indexOf( componentName ) < 0;
    },

    insertChildAtIndex : function(component, index){
        let componentRefs = this.componentRefs;

        //将组件从原来的父组件中删除
        let oldParent = component.getParentComponent();
        oldParent.editorRemoveComponent( component.getComponentId() );

        //修改组件的 parentId
        component.editorSetParentId( null );

        index = Math.min( componentRefs.length, index );
        this.componentRefs.splice(index, 0, component);

        let $componentEl = component.$getElement();
        utils.insertElement( $componentEl, this.$editor, index );

        this.renderOutlineTree();
    }

} );



module.exports = Builder;

