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

        let saveBtn = null;
        if( props.isEdit ){
            saveBtn = (
                <li className="header-op-btn" title="保存当前页面" onClick={ props.onSave }>
                    <i className="fa fa-floppy-o" aria-hidden="true"></i>
                    <div>保存</div>
                </li>
            );
        }

        return (
            <div className="designer-header clearfix">
                <a target="_self" href="/cms/dash/home/index">CMS首页</a>
                <a target="_self" href={ channelURL }>返回当前栏目</a>
                <ul className="header-aside">
                    { saveBtn }
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
    //点击保存按钮
    onSave: noop,
    //退出按钮
    onExit : noop
};


module.exports = Header;

