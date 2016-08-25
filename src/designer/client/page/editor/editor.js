/**
 * Created by jess on 16/8/8.
 */


'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');
const glpbBase = require('glpb-components-common');
const glpbUtils = glpbBase.utils;
const componentFactory = glpbBase.factory;

const Builder = require('designer:widget/builder/builder.js');


const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const PageSettingEditor = require('designer:widget/page-setting-editor/page-setting-editor.js');


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

    init : function( args ){

        let action = args.action;
        let channel = args.channel;

        channel = utils.parseJSON(channel);

        if (!channel) {
            alert('栏目数据异常!!');
            return;
        }
        
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

        if( action === ACTION_ADD || action === ACTION_EDIT ){
            componentFactory.enableEditMode();
        }

        if (action === ACTION_ADD) {
            //新创建文章
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
    }

};



module.exports = singleton;