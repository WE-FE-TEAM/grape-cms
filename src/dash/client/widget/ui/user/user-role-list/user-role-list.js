/**
 * 列出所有的角色数据, 以及当前用户所属的角色
 * Created by jess on 16/6/15.
 */



'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const RForm = require('common:widget/react-ui/RForm/RForm.js');

const Checkbox = RForm.Checkbox;


function noop(){}

class UserRoleList extends React.Component {

    constructor(props){
        super(props);


    }

    onRoleCheckChange( role, isChecked ){
        this.props.onRoleChange( role, isChecked );
    }

    render(){

        let props = this.props;

        let userRoles = props.userRoles || [];
        let roleList = props.roleList || [];

        let roles = roleList.map( (role, index) => {
            let id = role._id;
            let isChecked = userRoles.indexOf(id) >= 0;

            return (
                <li key={ index } className="role-item">
                    <Checkbox onChange={ this.onRoleCheckChange.bind( this, role) } name={ id } checked={ isChecked } label={ role.roleName } />
                </li>
            );
        });

        if( roleList.length < 1 ){
            //没有角色可选
            roles = <div className="info">系统还没有任何角色, 请先创建角色</div>;
        }

        return (
            <div className="user-role-list">
                <ul>
                    { roles }
                </ul>
            </div>
        );
    }
}


UserRoleList.defaultProps = {

    //某用户具有的所有角色列表
    userRoles : [],
    //所有的角色数据
    roleList : [],

    onRoleChange : noop
};



module.exports = UserRoleList;