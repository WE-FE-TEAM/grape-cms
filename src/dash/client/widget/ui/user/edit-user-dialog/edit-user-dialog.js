/**
 * 新增 用户弹窗
 * Created by jess on 16/6/15.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');


const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const RDialog = require('common:widget/react-ui/RWeDialog/RWeDialog.js');

const RForm = require('common:widget/react-ui/RForm/RForm.js');

const TextInput = RForm.TextInput;
const Select = RForm.Select;

const UserRoleList = require('dash:widget/ui/user/user-role-list/user-role-list.js');


const userService = service.getService('user');



const enabledData = [
    {
        value : 0,
        text : '启用'
    },
    {
        value : 1,
        text : '禁用'
    }
];


class AddUserDialog extends React.Component{
    
    constructor(props){
        
        super(props);
        
        this.state = {
            isLoading : false,
            errorMsg : '',
            user : props.user,
            userRoles : props.user.roles || []
        };
        
        this.submit = this.submit.bind( this );
        this.onRoleChange = this.onRoleChange.bind( this );

        this.onOptionClick = this.onOptionClick.bind( this );
    }
    
    submit(){
        if( this.state.isLoading ){
            return;
        }

        let user = this.state.user;

        let searchConf = utils.getSearchConf();
        
        let userName = this.refs.userName.getValue();
        let password = this.refs.password.getValue();

        let roles = this.state.userRoles;

        let data = {
            channelId : searchConf.channelId,
            userId : user._id,
            enabled : user.enabled,
            userName : userName,
            password : password,
            roles : JSON.stringify( roles )
        };

        userService.updateUser( data )
            .then( ( req ) => {
                if( req.requestStatus === userService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        alert('更新用户成功');
                        location.reload();
                        return;
                    }
                    return Promise.reject( new Error( out.message ) );
                }
                return Promise.reject( new Error('请求出错') );
            })
            .catch( ( e ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : e.message || '系统异常'
                });
            });

        this.state.isLoading = true;

        this.setState({
            isLoading : true,
            errorMsg : ''
        });
    }
    
    onRoleChange( role, isChecked ){

        let userRoles = this.state.userRoles;

        let index = userRoles.indexOf( role._id );

        if( index >= 0 && ! isChecked ){
            //删除该角色
            userRoles.splice( index, 1 );
        }
        if( index < 0 && isChecked ){
            //加入角色
            userRoles.push( role._id );
        }

        this.setState({
            userRoles : userRoles
        });
    }

    //修改用户的 启用状态
    onOptionClick( value, text ){
        let user = this.state.user;
        user.enabled = parseInt( value, 10);
        this.setState({
            user : user
        });
    }
    
    render(){

        let props = this.props;
        let state = this.state;

        let user = state.user;

        let dialogProps = {
            showing : true,
            isAutoCenter : false,
            title : '编辑用户',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'edit-user-dialog',
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
                <RForm action="/cms/dash/user/doUpdate" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">用户名</label>
                        <div className="col-sm-10">
                            <TextInput ref="userName" id="name-input" name="userName" type="text" value={ user.userName } placeholder="输入用户名称" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="password-input" className="col-sm-2 control-label">登录密码</label>
                        <div className="col-sm-10">
                            <TextInput ref="password" id="password-input" name="password" type="password" placeholder="修改登录密码" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="enable-input" className="col-sm-2 control-label">是否启用</label>
                        <div className="col-sm-10">
                            <Select name="enable-input" value={ user.enabled } data={ enabledData } onOptionClick={ this.onOptionClick } />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">设置用户的角色</label>
                        <div className="col-sm-10">
                            <UserRoleList 
                                roleList={ props.roleList } 
                                userRoles={ state.userRoles } 
                                onRoleChange={ this.onRoleChange }
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-warning">保存</button>
                        </div>
                    </div>
                    { error }
                </RForm>
            </RDialog>
        );
    }
}



module.exports = AddUserDialog;
