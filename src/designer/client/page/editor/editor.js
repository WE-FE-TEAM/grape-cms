/**
 * Created by jess on 16/8/8.
 */


'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const $ = require('common:widget/lib/jquery/jquery.js');
const glpbBase = require('glpb-components-common');
const glpbUtils = glpbBase.utils;
const componentFactory = glpbBase.factory;

const LoadIndicator = require('common:widget/j-ui/LoadIndicator/LoadIndicator.js');

const Builder = require('designer:widget/builder/builder.js');


const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const PageSettingEditor = require('designer:widget/page-setting-editor/page-setting-editor.js');

const Header = require('designer:widget/header/header.js');


const ACTION_VIEW = 'view';
const ACTION_ADD = 'add';
const ACTION_EDIT = 'edit';

const PUBLISH_TYPE_ONLINE = 'publish';
const PUBLISH_TYPE_PREVIEW = 'preview';

const pageService = service.getService('page');

let singleton = {
    
    channel : null,
    
    pageData : null,
    
    pageSettingEditor : null,

    builder : null,

    loadIndicator : null,

    isAddMode : false,
    isEditMode : false,

    init : function( args ){

        let action = args.action;
        let channel = args.channel;

        channel = utils.parseJSON(channel);

        if (!channel) {
            alert('栏目数据异常!!');
            return;
        }

        this.handleSave = this.handleSave.bind( this );

        //全局的加载中提示
        let loadIndicator = new LoadIndicator();
        loadIndicator.render();
        this.loadIndicator = loadIndicator;
        
        let pageSettingEditor = new PageSettingEditor({});
        pageSettingEditor.render();
        pageSettingEditor.$getElement().appendTo( document.body );
        pageSettingEditor.bindEvent();
        
        pageSettingEditor.on('change', function( data ){
            singleton.onPageSettingChange( data );
        } );
        
        singleton.pageSettingEditor = pageSettingEditor;
        
        singleton.channel = channel;

        let page = null;

        let isEdit = false;

        if( action === ACTION_ADD || action === ACTION_EDIT ){
            componentFactory.enableEditMode();
            isEdit = true;
            this.isEditMode = true;
        }

        if (action === ACTION_ADD) {
            //新创建文章
            this.isAddMode = true;
            singleton.addPageCtrl(channel);
        } else if (action === ACTION_EDIT || action === ACTION_VIEW) {
            //异步请求文章数据, 再渲染
            let searchConf = utils.getSearchConf();

            pageService.getPage({
                    channelId: searchConf.channelId,
                    pageId: searchConf.pageId,
                    recordId: searchConf.recordId
                })
                .then((req) => {
                    if (req.requestStatus === pageService.STATUS.SUCCESS) {
                        let out = req.data;
                        if (out.status === 0) {
                            
                            singleton.pageData = out.data;

                            $.extend( singleton.pageData, singleton.pageData.data );
                            
                            if( action === ACTION_VIEW ){
                                //TODO 查看页面
                            }else{
                                //编辑某个页面
                                singleton.editPageCtrl();
                            }
                            
                            return;
                        }
                        return Promise.reject(new Error(out.message));
                    }
                    return Promise.reject(new Error('请求该页面详情出错!'));
                })
                .catch((e) => {
                    alert(e.message);
                });
        }

        //渲染header
        ReactDOM.render( <Header isEdit={ isEdit } channel={ channel } onSave={ singleton.handleSave } />, document.getElementById('editor-header') );
        
    },

    //创建新的页面, 需要先弹窗选择页面平台
    addPageCtrl : function( ){
        singleton.pageSettingEditor.show();
    },
    
    editPageCtrl : function(){

        this.builder = new Builder( singleton.pageData );

        this.builder.bindEvent();

        window.builder = this.builder;
    },

    onPageSettingChange : function( data ){
        if( this.builder ){
            this.builder.setPageSetting( data );
        }else{
            let args = $.extend( this.pageData || {
                    channelId : this.channel._id
                }, data );
            let builder = new Builder( args );
            builder.bindEvent();
            this.builder = builder;
        }
    },

    //保存当前页面
    handleSave : function(){

        if( this.builder && this.isEditMode ){
            let pageData = this.builder.toJSON();
            let data = {
                channelId : this.channel._id,
                pageName : pageData.pageName,
                data : JSON.stringify( pageData )
            };
            if( this.isAddMode ){
                //创建新的页面
                this.loadIndicator.setText('保存中...').show();
                pageService.addPage( data ).then( ( requestResult ) => {
                    this.loadIndicator.hide();
                    if( requestResult.requestStatus === pageService.STATUS.SUCCESS ){
                        let result = requestResult.data;
                        if( result.status === 0 ){
                            //保存成功, 跳转到该页面的编辑页
                            alert('保存成功');
                            let data = result.data;
                            let url = `/cms/designer/app/edit?channelId=${encodeURIComponent(this.channel._id)}&pageId=${encodeURIComponent(data.pageId)}`;
                            location.href = url;
                            return;
                        }
                        return Promise.reject( new Error( result.message ) );
                    }
                    return Promise.reject( new Error(`保存页面异常`) );
                }).catch( (e) => {
                    this.loadIndicator.hide();
                    alert( e.message );
                    
                });
            }else{
                //更新老的页面
                data.pageId = this.pageData.pageId;
                this.loadIndicator.setText('保存中...').show();
                pageService.updatePage( data ).then( ( requestResult ) => {
                    this.loadIndicator.hide();
                    if( requestResult.requestStatus === pageService.STATUS.SUCCESS ){
                        let result = requestResult.data;
                        if( result.status === 0 ){
                            //保存成功, 跳转到该页面的编辑页
                            alert('更新页面成功');
                            return;
                        }
                        return Promise.reject( new Error( result.message ) );
                    }
                    return Promise.reject( new Error(`更新页面异常`) );
                }).catch( (e) => {
                    this.loadIndicator.hide();
                    alert( e.message );

                });
            }
        }else{
            alert(`当前页面不处于编辑状态!!`);
        }
    }

};

Object.defineProperty(window, 'editor', {
    writable : false,
    value : singleton
} );


module.exports = singleton;