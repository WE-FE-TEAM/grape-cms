/**
 * 用户管理
 * Created by jess on 16/6/15.
 */



'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const roleService = service.getService('role');

const AddUserDialog = require('dash:widget/ui/user/add-user-dialog/add-user-dialog.js');
const EditUserDialog = require('dash:widget/ui/user/edit-user-dialog/edit-user-dialog.js');
const DeleteUserDialog = require('dash:widget/ui/user/delete-user-dialog/delete-user-dialog.js');

const UserList = require('dash:widget/ui/user/user-list/user-list.js');

class App extends React.Component {

    constructor(props){
        
        super(props);
        
        this.state = {
            isShowAdd : false,
            isShowEdit : false,
            isShowDelete : false
        };
        
        this.onUserAdd = this.onUserAdd.bind( this );
        this.onUserAddSuccess = this.onUserAddSuccess.bind( this );

        this.onUserEdit = this.onUserEdit.bind( this );
        this.onUserDelete = this.onUserDelete.bind( this );
    }

    closeDialog( dialogType ){
        let newState = {};
        newState[dialogType] = null;
        this.setState( newState );
    }
    
    onUserAdd(){
        this.setState({
            isShowAdd : true
        });
    }

    onUserAddSuccess(){

    }

    onUserEdit( user ){
        this.setState({
            isShowEdit : user
        });
    }

    onUserDelete( user ){
        this.setState({
            isShowDelete : user
        });
    }

    render(){

        let props = this.props;
        let state = this.state;

        let addDialog = null;
        if( state.isShowAdd ){
            addDialog = <AddUserDialog
                onSuccess={ this.onUserAddSuccess }
                onRequestClose={ this.closeDialog.bind( this, 'isShowAdd') }
                roleList={ props.roleList }
            />;
        }

        let editDialog = null;
        if( state.isShowEdit ){
            editDialog = <EditUserDialog
                user={ state.isShowEdit }
                onRequestClose={ this.closeDialog.bind( this, 'isShowEdit') }
                roleList={ props.roleList }
            />;
        }

        let deleteDialog = null;
        if( state.isShowDelete ){
            deleteDialog = <DeleteUserDialog
                user={ state.isShowDelete }
                onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') }
                roleList={ props.roleList }
            />;
        }

        return (
            <div>
                <h1>用户管理</h1>
                <div>
                    <button onClick={ this.onUserAdd } type="button" className="btn btn-lg btn-primary">新增用户</button>
                </div>
                <div>
                    <h3>系统中用户列表</h3>
                    <UserList onUserEdit={ this.onUserEdit } onUserDelete={ this.onUserDelete } />
                </div>
                { addDialog }
                { editDialog }
                { deleteDialog }
            </div>
        );
    }
}




let singleton = {

    init : function(){

        roleService.getAll()
            .then( ( res ) => {
                if( res.requestStatus === roleService.STATUS.SUCCESS ){
                    let out = res.data;
                    if( out.status === 0 ){
                        return singleton.render( out.data );
                    }
                }
                return Promise.reject(-1);
            } ).catch( () => {
            alert('获取角色数据失败!');
        });

    },

    render : function( roleList ){
        ReactDOM.render( <App roleList={ roleList } />, document.getElementById('app') );
    }
};



module.exports = singleton;

