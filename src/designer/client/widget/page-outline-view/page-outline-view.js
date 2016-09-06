/**
 * 负责渲染页面中整个组件树的结构
 * Created by jess on 16/9/1.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');

const glpbBase = require('glpb-components-common');

const componentFactory = glpbBase.factory;


function PageOutlineView(args){

    this.builder = args.builder;
    
    this.$el = $(args.el);

    this.$treeEl = this.$el.find('.page-com-outline-tree');
    
    this.data = args.data || [];
    
}

$.extend( PageOutlineView.prototype, {
    
    render( ){

        let draggable = componentFactory.isEditMode();

        this.$treeEl.tree({
            data : this.data,
            autoOpen : true,
            dragAndDrop : draggable
        })
    },
    
    bindEvent : function(){
        
        let that = this;
        
        this.$el.on('click', '.toggle-btn', function(){
            that.toggle();
        } );

        this.$treeEl.bind('tree.select', function(e){
            let node = e.node;
            if( node ){
                that.editComponentById( node.id );
            }else{
                EventEmitter.eventCenter.trigger('component.list.show');
            }
        } );

        if( ! componentFactory.isEditMode() ){
            //非编辑模式下, 不能拖动节点
            return;
        }

        this.$treeEl.bind('tree.move', function(event){

            event.preventDefault();

            let movedNode = event.move_info.moved_node;

            let targetNode = event.move_info.target_node;

            let movedComponentId = movedNode.id;

            let position = event.move_info.position;

            let targetParentId = null;
            let newPositionIndex = 0;
            if( position === 'inside' ){
                //target_node就是要移动之后的父节点
                targetParentId = targetNode.id;
                newPositionIndex = 0;
            }else{
                //target_node 是要移动之后的父节点内某个子节点
                let targetParent = targetNode.parent;
                targetParentId = targetParent.id || null;
                let children = targetParent.children;
                let targetNodeIndex = -1;
                let movedNodeCurrentIndex = -1;
                for( var i = 0, len = children.length; i < len; i++ ){
                    if( children[i] === targetNode ){
                        targetNodeIndex = i;
                    }else if( children[i] === movedNode ){
                        movedNodeCurrentIndex = i;
                    }
                }

                if( position === 'before' ){
                    newPositionIndex = Math.max(0, targetNodeIndex - 1 );
                }else{
                    newPositionIndex = targetNodeIndex + 1;
                }

                if( movedNode.parent === targetNode.parent ){
                    //节点在父节点内改变位置, 需要重新处理新的位置
                    if( movedNodeCurrentIndex < targetNodeIndex && position === 'after' ){
                        newPositionIndex = Math.max(0, newPositionIndex - 1);
                    }
                }

            }


            
            console.log('moved_node', event.move_info.moved_node);
            console.log('target_node', event.move_info.target_node);
            console.log('position', event.move_info.position);
            console.log('previous_parent', event.move_info.previous_parent);
            
            that.builder.tryMoveComponentById(movedComponentId, targetParentId, newPositionIndex );
        } );
    },
    
    toggle : function(){
        this.$el.toggleClass('tree-visible');
    },

    show : function(){
        this.$el.addClass('tree-visible');
    },

    hide : function(){
        this.$el.removeClass('tree-visible');
    },

    setData : function( data ){
        this.data = data;
        this.$treeEl.tree('loadData', data);
    },

    editComponentById : function( componentId ){
        this.builder.editComponent( componentId );
    },
    
    
    selectNodeById : function(id){
        let node = this.$treeEl.tree('getNodeById', id);
        if( node ){
            this.$treeEl.tree('selectNode', node);
        }
    },

    unselectNode : function(){
        this.$treeEl.tree('selectNode', null);
    },

    /**
     * 更新某个节点的名字
     * @param id {string} 组件ID
     * @param name {string} 组件实例名
     */
    updateNodeNameById : function(id, name){
        let node = this.$treeEl.tree('getNodeById', id);
        if( node ){
            this.$treeEl.tree('updateNode', node, { name : name });
        }
    },

    /**
     * 某个新个节点及其子孙节点
     * @param id {string} 组件ID
     * @param data {object} 组件及其子孙节点的JSON树
     */
    updateNodeDataById : function(id, data){
        let node = this.$treeEl.tree('getNodeById', id);
        if( node ){
            this.$treeEl.tree('updateNode', node, data);
        }
    }
    
} );



module.exports = PageOutlineView;

