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
        this.handleEdit = this.handleEdit.bind( this );
        this.handleExit = this.handleExit.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
        this.handlePreview = this.handlePreview.bind( this );
        this.handlePublish = this.handlePublish.bind( this );
        this.viewCurrentRelease = this.viewCurrentRelease.bind( this );

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

            //防止用户误操作, 导致的页面关闭
            window.onbeforeunload = function(){
                return '确认离开么? 请确保已经保存了页面的最新修改!!!';
            };
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
                                //查看页面
                                singleton.viewPageCtrl();
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
        ReactDOM.render( <Header
            isEdit={ isEdit }
            channel={ channel }
            onEdit={ singleton.handleEdit }
            onExit={ singleton.handleExit }
            onDelete={ singleton.handleDelete }
            onPreview={ singleton.handlePreview }
            onPublish={ singleton.handlePublish }
            onSave={ singleton.handleSave }
            onCurrentRelease={ singleton.viewCurrentRelease }
        />, document.getElementById('editor-header') );
        
    },

    //创建新的页面, 需要先弹窗选择页面平台
    addPageCtrl : function( ){
        singleton.pageSettingEditor.show();
    },
    
    editPageCtrl : function(){

        singleton.pageData.isEditMode = true;

        this.builder = new Builder( singleton.pageData );

        this.builder.bindEvent();

        window.builder = this.builder;
    },
    
    viewPageCtrl : function(){
        
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
            args.isEditMode = true;
            let builder = new Builder( args );
            builder.bindEvent();
            this.builder = builder;
        }
    },

    //保存当前页面
    handleSave : function(){

        let that = this;

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
                            singleton.pageData = data;
                            that.handleEdit();
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
    },

    //进入编辑模式
    handleEdit : function(){
        let data = this.pageData;
        let url = `/cms/designer/app/edit?channelId=${encodeURIComponent(this.channel._id)}&pageId=${encodeURIComponent(data.pageId)}`;
        location.href = url;
    },

    //跳转到只读模式
    handleExit : function(){
        let data = this.pageData;
        let url = '';
        if( this.isAddMode ){
            url = `/cms/dash/channel/view?channelId=${encodeURIComponent(this.channel._id)}`;
        }else{
            url = `/cms/designer/app/view?channelId=${encodeURIComponent(this.channel._id)}&pageId=${encodeURIComponent(data.pageId)}`;
        }

        location.href = url;
    },

    //删除当前页面
    handleDelete : function(){

        if( this.isAddMode ){
            //当前是创建新页面, 不能执行删除操作
            alert(`当前是新页面, 不能删除`);
            return;
        }

        if( ! window.confirm(`确认删除当前页面么??`) ){
            return;
        }

        let channel = this.channel;
        let page = this.pageData;

        let data = {
            channelId : channel._id,
            pageId : page.pageId
        };

        pageService.deletePage( data )
            .then( ( req ) => {
                if( req.requestStatus === pageService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        alert('删除页面成功');
                        let channelURL = `/cms/dash/channel/view?channelId=${encodeURIComponent(channel._id)}`;
                        location.href = channelURL;

                        return;
                    }
                    return Promise.reject( new Error(out.message) );
                }
                return Promise.reject( new Error('请求出错') );
            })
            .catch( ( e ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : e.message || '服务器异常'
                });
            });
    },

    //预览到线上
    handlePreview : function(){
        this._doPublish('preview');
    },

    //发布当前页面
    handlePublish : function(){
        if( window.confirm(`确认**发布**么???\n\n操作会影响**线上页面**, 请谨慎!!!`) ){
            this._doPublish('publish');
        }

    },

    _doPublish : function( releaseType ){
        let data = this.pageData;
        let channel = this.channel;
        let requestData = {
            channelId : channel._id,
            pageId : data.pageId,
            recordId : data.recordId,
            releaseType : releaseType
        };

        let text = releaseType === 'publish' ? '发布' : '预览';

        this.loadIndicator.setText(`正在${text}中...`).show();
        pageService.publishPage( requestData )
            .then( ( requestResult ) => {
                this.loadIndicator.hide();
                if( requestResult.requestStatus === pageService.STATUS.SUCCESS ){
                    let result = requestResult.data;
                    if( result.status === 0 ){
                        //发布/预览成功
                        alert(`${text}成功 :) `);
                        return;
                    }
                    return Promise.reject( new Error(result.message));
                }
                return Promise.reject( new Error(`${text}数据失败`));
        }).catch( (e) => {
                this.loadIndicator.hide();
                alert( e.message );
            });
    },

    //查看当前已发布的页面数据
    viewCurrentRelease : function(){
        let data = this.pageData;
        let url = `/cms/designer/app/currentRelease?channelId=${encodeURIComponent(this.channel._id)}&pageId=${encodeURIComponent(data.pageId)}`;
        window.open( url );
    }

};

Object.defineProperty(window, 'editor', {
    writable : false,
    value : singleton
} );




module.exports = singleton;