/**
 * Created by jess on 16/6/12.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const AddRoleDialog = require('dash:widget/ui/role/add-role-dialog/add-role-dialog.js');


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

        return (
            <div>
                <h1>角色管理</h1>
                <div>
                    <button onClick={ this.onAddClick } type="button" className="btn btn-lg btn-primary">新增角色</button>
                </div>
                { addDialog }
            </div>
        );
    }
}



let singleton = {

    init : function(){

        channelService.getAllTree()
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