/**
 * 渲染编辑器的头部
 * Created by jess on 16/8/25.
 */

'use strict';

const $ = require('common:widget/lib/jquery/jquery.js');

const React = require('react');
const ReactDOM = require('react-dom');


function noop(){}

class Header extends React.Component{

    render(){

        let props = this.props;

        let channel = props.channel;

        if( ! channel ){
            return null;
        }

        let channelURL = `/cms/dash/channel/view?channelId=${encodeURIComponent(channel._id)}`;

        //编辑页面信息按钮
        let editPageBtn = null;
        //保存按钮
        let saveBtn = null;
        //进入编辑按钮
        let editBtn = null;
        //退出编辑按钮
        let exitEditBtn = null;
        //预览按钮
        let previewBtn = null;
        //发布按钮
        let publishBtn = null;
        //删除页面按钮
        let deleteBtn = null;

        if( props.isEdit ){
            //编辑模式
            saveBtn = (
                <li className="header-op-btn" title="保存当前页面" onClick={ props.onSave }>
                    <i className="fa fa-floppy-o" aria-hidden="true"></i>
                    <div>保存</div>
                </li>
            );
            exitEditBtn = (
                <li className="header-op-btn" title="退出编辑" onClick={ props.onExit }>
                    <i className="fa fa-frown-o" aria-hidden="true"></i>
                    <div>退出编辑</div>
                </li>
            );
            deleteBtn = (
                <li className="header-op-btn  danger-action" title="删除当前页面" onClick={ props.onDelete }>
                    <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                    <div>删除页面</div>
                </li>
            );
            editPageBtn = (
                <li className="header-op-btn" title="页面设置" onClick={ props.onEditPage }>
                    <i className="fa fa-cog" aria-hidden="true"></i>
                    <div>页面设置</div>
                </li>
            );
        }else{
            //只读模式
            editBtn = (
                <li className="header-op-btn" title="编辑当前页面" onClick={ props.onEdit }>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    <div>编辑页面</div>
                </li>
            );
            previewBtn = (
                <li className="header-op-btn" title="预览当前页面" onClick={ props.onPreview }>
                    <i className="fa fa-video-camera" aria-hidden="true"></i>
                    <div>预览</div>
                </li>
            );
            publishBtn = (
                <li className="header-op-btn  danger-action" title="发布当前页面" onClick={ props.onPublish }>
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    <div>发布</div>
                </li>
            );
        }

        return (
            <div className="designer-header clearfix">
                <a target="_self" href="/cms/dash/home/index">CMS首页</a>
                <a target="_self" href={ channelURL }>返回当前栏目</a>
                <ul className="header-aside">
                    { editPageBtn }
                    { saveBtn }
                    { exitEditBtn }
                    { deleteBtn }
                    { editBtn }
                    { previewBtn }
                    { publishBtn }
                    <li className="header-op-btn" title="查看当前已发布的数据" onClick={ props.onCurrentRelease }>
                        <i className="fa fa-eye" aria-hidden="true"></i>
                        <div>查看已发布数据</div>
                    </li>
                </ul>
            </div>
        );
    }
}


Header.defautProps = {

    //当前是否处于编辑模式
    isEdit: false,
    //当前栏目信息
    channel: null,
    //编辑页面点击
    onEdit : noop,
    //点击保存按钮
    onSave: noop,
    //退出按钮
    onExit : noop,
    //预览
    onPreview : noop,
    //点击发布按钮
    onPublish : noop,
    //查看当前已发布数据
    onCurrentRelease : noop,
    //删除
    onDelete : noop,
    //编辑页面信息
    onEditPage : noop
};


module.exports = Header;

