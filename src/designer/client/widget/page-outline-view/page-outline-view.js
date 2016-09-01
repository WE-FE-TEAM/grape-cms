/**
 * 负责渲染页面中整个组件树的结构
 * Created by jess on 16/9/1.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const EventEmitter = require('common:widget/lib/EventEmitter/EventEmitter.js');


function PageOutlineView(args){

    this.builder = args.builder;
    
    this.$el = $(args.el);

    this.$treeEl = this.$el.find('.page-com-outline-tree');
    
    this.data = args.data || [];
    
}

$.extend( PageOutlineView.prototype, {
    
    render( ){
        this.$treeEl.tree({
            data : this.data,
            autoOpen : true,
            dragAndDrop : false
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
    },
    
    toggle : function(){
        this.$el.toggleClass('tree-visible');
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
    }
    
} );



module.exports = PageOutlineView;

