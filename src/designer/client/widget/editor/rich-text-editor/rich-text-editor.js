/**
 * 封装富文本编辑框
 * Created by jess on 16/9/7.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');

const utils = require('common:widget/ui/utils/utils.js');

let uid = 0;

function getEditorId(){
    return 'j-uid-' + ( Date.now() ) + '-' + uid++;
}

function RichTextEditor(args){

    this.data = args.data || '';
    this.editor = null;
    this.$el = null;

    this._editorId = getEditorId();
    this._editorReady = false;

    this.init();
}


$.extend( RichTextEditor.prototype, {

    init : function(){},

    render : function(){


        let $el = $(`<div id="${this._editorId}" class="editor-for-rich-text"></div>`);

        this.$el = $el;

        // this.editor = UE.getEditor( this.state.id, {
        //     autoHeight: false,
        //     serverUrl: '/cms/dash/ueditor/index?channelId=' + encodeURIComponent(channelId)
        // } );

    },

    bindEvent : function(){

        let that = this;

        let searchConf = utils.getSearchConf();

        let channelId = searchConf.channelId || '';

        this.editor =  UE.getEditor( this._editorId, {
            autoFloatEnabled : false,
            autoHeight: false,
            zIndex : 300,
            serverUrl: '/cms/dash/ueditor/index?channelId=' + encodeURIComponent(channelId)
        });

        this.editor.addListener('ready', function(){
            that._editorReady = true;
            that.setData( that.data );
        } );

        // this.editor.render( this.$el[0] );

    },

    $getElement : function(){
        return this.$el;
    },

    getData : function(){
        return this.editor.getContent();
    },

    setData : function(data){
        this.data = data;
        if( this._editorReady ){
            this.editor.setContent( data );
        }
    },

    destroy : function(){
        this.editor.destroy();
        this.editor = null;
        this.$el.remove();
        this.$el = null;
    }

} );



module.exports = RichTextEditor;



