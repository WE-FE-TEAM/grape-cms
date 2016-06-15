/**
 * 新增角色弹窗
 * Created by jess on 16/6/14.
 */


'use strict';



const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const RDialog = require('common:widget/react-ui/RWeDialog/RWeDialog.js');
const RForm = require('common:widget/react-ui/RForm/RForm.js');

const RolePermissionTree = require('dash:widget/ui/role/role-permission-tree/role-permission-tree.js');

const TextInput = RForm.TextInput;

const roleService = service.getService('role');

const channelUtil = utils.channelUtil;


class AddRoleDialog extends React.Component {

    constructor( props ){
        super(props);

        this.state = {
            isLoading : false,
            errorMsg : ''
        };

        this.rolePermission = {};

        this.submit = this.submit.bind( this );
        this.handlePermissionChange = this.handlePermissionChange.bind( this );
    }

    submit(){
        if( this.state.isLoading ){
            return;
        }

        let roleName = this.refs.roleName.getValue().trim();

        console.log( 'add role submit: ', this.rolePermission );

        if( ! roleName ){
            this.setState({
                errorMsg : '角色名不能为空'
            });
            return;
        }

        let searchConf = utils.getSearchConf();

        let data = {
            channelId : searchConf.channelId,
            roleName : roleName,
            permissions : JSON.stringify( this.rolePermission )
        };

        roleService.addRole( data )
            .then( ( req ) => {
                if( req.requestStatus === roleService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        alert('添加角色成功');
                        location.reload();
                        return;
                    }
                    return Promise.reject( out.message );
                }
                return Promise.reject();
            })
            .catch( ( msg ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : msg || '服务器异常'
                });
            });

        this.state.isLoading = true;

        this.setState({
            isLoading : true,
            errorMsg : false
        });
    }

    handlePermissionChange(channel, operationValue, isChecked){

        let operationGroup = this.rolePermission[channel._id] || [];

        let index = operationGroup.indexOf( operationValue );

        if( isChecked && index < 0 ){
            //增加权限
            operationGroup.push( operationValue );
        }
        if( ! isChecked && index >= 0 ){
            //取消权限
            operationGroup.splice( index, 1);
        }

        this.rolePermission[channel._id] = operationGroup;

    }

    render(){

        let props = this.props;
        let state = this.state;


        let dialogProps = {
            showing : true,
            isAutoCenter : false,
            title : '新增角色',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'add-role-dialog',
                style : {
                }
            }
        };

        let error = null;
        if( state.errorMsg ){
            error = <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="error-info">{ state.errorMsg }</div>
                </div>
            </div>
        }

        return (
            <RDialog { ...dialogProps }>
                <RForm action="/cms/dash/role/doAdd" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">角色名</label>
                        <div className="col-sm-10">
                            <TextInput ref="roleName" id="name-input" name="roleName" type="text" placeholder="输入角色名称" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">设置角色权限</label>
                        <div className="col-sm-10">
                            <RolePermissionTree
                                collapsed={ false }
                                onPermissionChange={ this.handlePermissionChange }
                                channelTree={ props.channelTree }
                                rolePermission={ {} } />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">增加</button>
                        </div>
                    </div>
                    { error }
                </RForm>
            </RDialog>
        );
    }
}



module.exports = AddRoleDialog;