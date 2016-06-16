/**
 * Created by jess on 16/6/12.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const AddRoleDialog = require('dash:widget/ui/role/add-role-dialog/add-role-dialog.js');
const EditRoleDialog = require('dash:widget/ui/role/edit-role-dialog/edit-role-dialog.js');
const DeleteRoleDialog = require('dash:widget/ui/role/delete-role-dialog/delete-role-dialog.js');
const RoleList = require('dash:widget/ui/role/role-list/role-list.js');


const channelService = service.getService('channel');


class App extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            //是否显示 新增角色 弹窗
            isShowAdd : null,
            //是否显示 编辑角色权限 弹窗
            isShowEdit : null,
            //是否显示 删除角色 弹窗
            isShowDelete : null
        };


        this.onAddClick = this.onAddClick.bind( this );
        this.onAddRoleSuccess = this.onAddRoleSuccess.bind( this );

        this.onRoleEdit = this.onRoleEdit.bind( this );
        this.onRoleEditSuccess = this.onRoleEditSuccess.bind( this );

        this.onRoleDelete = this.onRoleDelete.bind( this );
        this.onRoleDeleteSuccess = this.onRoleDeleteSuccess.bind( this );
    }

    closeDialog( dialogType ){
        let newState = {};
        newState[dialogType] = null;
        this.setState( newState );
    }

    //显示添加栏目弹窗
    onAddClick(){
        this.setState({
            isShowAdd : true
        });
    }

    //添加栏目成功的回调
    onAddRoleSuccess(){

    }

    onRoleEdit( roleData ){
        this.setState({
            isShowEdit : roleData
        });
    }

    onRoleEditSuccess(){

    }

    onRoleDelete( roleData ){
        this.setState({
            isShowDelete : roleData
        });
    }

    onRoleDeleteSuccess(){

    }

    render(){

        let props = this.props;

        let state = this.state;

        let addDialog = null;
        if( state.isShowAdd ){
            addDialog = <AddRoleDialog
                onSuccess={ this.onAddRoleSuccess }
                onRequestClose={ this.closeDialog.bind( this, 'isShowAdd') }
                channelTree={ props.channelTree }
            />;
        }

        let editDialog = null;
        if( state.isShowEdit ){
            editDialog = <EditRoleDialog
                role={ state.isShowEdit }
                onSuccess={ this.onRoleEditSuccess }
                onRequestClose={ this.closeDialog.bind( this, 'isShowEdit') }
                channelTree={ props.channelTree }
            />;
        }

        let deleteDialog = null;
        if( state.isShowDelete ){
            deleteDialog = <DeleteRoleDialog
                role={ state.isShowDelete }
                onSuccess={ this.onRoleDeleteSuccess }
                onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') }
                channelTree={ props.channelTree }
            />;
        }

        return (
            <div>
                <h1>角色管理</h1>
                <div>
                    <button onClick={ this.onAddClick } type="button" className="btn btn-lg btn-primary">新增角色</button>
                </div>
                <div>
                    <RoleList onRoleEdit={ this.onRoleEdit } onRoleDelete={ this.onRoleDelete } />
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

        let searchConf = utils.getSearchConf();

        let data = {
            channelId : searchConf.channelId
        };

        channelService.getAllTree( data )
            .then( ( res ) => {
                if( res.requestStatus === channelService.STATUS.SUCCESS ){
                    let out = res.data;
                    if( out.status === 0 ){
                        return singleton.render( out.data );
                    }
                }
                return Promise.reject(-1);
            } ).catch( () => {
            alert('获取栏目数据失败!');
        });

    },

    render : function( channelTree ){
        ReactDOM.render( <App channelTree={ channelTree } />, document.getElementById('app') );
    }
};



module.exports = singleton;