/**
 * Created by jess on 16/8/30.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');

const loadingImage = __uri('../../react-ui/RLoadIndicator/assets/load.gif');

function LoadIndicator(args){
    args = args || {};
    this.parent = args.parent || document.body;
    this.text = args.text || '加载中...';
    this.$el = null;
    this.$textCon = null;
}

$.extend( LoadIndicator.prototype, {
    
    render : function(){
        if( this.$el ){
            return this.$el;
        }
        let $el = $(`<div class="j-ui-load-indicator"><div class="load-indicator-inner"><img class="load-img" src="${loadingImage}" /><div class="load-text">${this.text}</div></div></div>`);
        this.$textCon = $el.find('.load-text');
        this.$el = $el;
        $el.appendTo( this.parent );
    },
    
    setText : function(text){
        this.text = text;
        if( this.$textCon ){
            this.$textCon.html( text );
        }
        return this;
    },

    show : function(){
        this.$el.show();
    },

    hide : function(){
        this.$el.hide();
    }
} );



module.exports = LoadIndicator;

