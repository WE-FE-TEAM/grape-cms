/**
 * 渲染角色对应的各个栏目下的权限
 * Created by jess on 16/6/14.
 */


'use strict';



const React = require('react');
const ReactDOM = require('react-dom');
const utils = require('common:widget/ui/utils/utils.js');

const RForm = require('common:widget/react-ui/RForm/RForm.js');
const Tree = require('common:widget/react-ui/tree/tree.js');

const channelUtil = utils.channelUtil;

const Checkbox = RForm.Checkbox;


function noop(){}

class RolePermissionTree extends React.Component {

    constructor(props){

        super(props);

        this.nodeLabelRender = this.nodeLabelRender.bind( this );
    }

    nodeLabelRender( channel, onNodeClick ){

        let rolePermission = this.props.rolePermission || {};

        let roleChannelPermission = rolePermission[channel._id] || [];

        let operationSet = channelUtil.getChannelOperationSet( channel.channelType );

        let operations = operationSet.map( ( operation, index ) => {
            let value = operation.value;
            let checked = roleChannelPermission.indexOf( value ) >= 0;
            let name = `${channel._id}.${value}`;
            return (
                <Checkbox key={ index } className="operation-checkbox" onChange={ this.onCheckboxChange.bind( this, channel, value) } checked={ checked } label={ operation.text } name={ name } />
            );
        });


        return (
            <div className="permission-node">
                <span className="channel-name" onClick={ onNodeClick }>{ channel.channelName }</span>
                { operations }
            </div>
        );
    }

    onCheckboxChange( channel, operationValue, isChecked ){
        this.props.onPermissionChange( channel, operationValue, isChecked );
    }

    render(){

        let props = this.props;

        return (
            <dl className="role-permission-con">
                <dt>角色权限</dt>
                <dd className="role-permission-tree">
                    <Tree
                        collapsed={ props.collapsed }
                        childrenKey="children"
                        nodeLabelRenderer={ this.nodeLabelRender }
                        data={ props.channelTree } />
                </dd>
            </dl>
        );
    }
}


RolePermissionTree.propTypes = {

    //某个角色下的权限map
    rolePermission : React.PropTypes.object,
    //系统中整个栏目树
    channelTree : React.PropTypes.object
};

RolePermissionTree.defaultProps = {
    //用户勾选操作
    onPermissionChange : noop
};


module.exports = RolePermissionTree;