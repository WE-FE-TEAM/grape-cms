/**
 * Created by jess on 16/8/19.
 */
/**
 * @require common:node_modules/jsoneditor/dist/jsoneditor.css
 */

'use strict';


const jsoneditor = require('jsoneditor');

const $ = require('common:widget/lib/jquery/jquery.js');

// require('common:node_modules/jsoneditor/dist/jsoneditor.css');


function JSONEditor(args){

    this.data = args.data || {};
    this.editMode = args.editMode || 'code';
    this.editor = null;
    this.$el = null;

    this.init();
}

$.extend( JSONEditor.prototype, {

    init : function(){},

    render : function(){
        let $el = $('<div class="editor-for-json"></div>');
        this.editor = new jsoneditor( $el[0], {
            mode : 'code'
        });
        
        this.$el = $el;
    },

    bindEvent : function(){

    },

    $getElement : function(){
        return this.$el;
    },

    getData : function(){
        return this.editor.get();
    },

    setData : function(data){
        this.editor.set( data );
    },

    destroy : function(){
        this.editor.destroy();
        this.editor = null;
        this.$el.remove();
        this.$el = null;
    }
} );


module.exports = JSONEditor;

