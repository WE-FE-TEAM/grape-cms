/**
 * Created by jess on 16/6/12.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const ChannelTree = require('dash:widget/ui/channel-tree/channel-tree.js');
const AddChannelDialog = require('dash:widget/ui/add-channel-dialog/add-channel-dialog.js');
const DeleteChannelDialog = require('dash:widget/ui/delete-channel-dialog/delete-channel-dialog.js');


class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            //是否显示 添加栏目 弹窗
            isShowAdd : null,
            //是否显示 编辑栏目 弹窗
            isShowEdit : null,
            //是否显示 删除栏目 弹窗
            isShowDelete : null


        };

        this.addSubChannel = this.addSubChannel.bind( this );
        this.editChannel = this.editChannel.bind( this );
        this.deleteChannel = this.deleteChannel.bind( this );
    }
    
    addSubChannel( parentChannel ){
        this.setState({
            isShowAdd : parentChannel
        });
    }

    editChannel( channel ){
        this.setState({
            isShowEdit : channel
        });
    }

    deleteChannel( channel ){
        this.setState({
            isShowDelete : channel
        });
    }

    closeDialog( dialogType ){
        let newState = {};
        newState[dialogType] = null;
        this.setState( newState );
    }


    render(){

        let state = this.state;

        let addDialog = null;

        let addParent = state.isShowAdd;

        if( addParent ){
            addDialog = <AddChannelDialog channel={ addParent } onRequestClose={ this.closeDialog.bind( this, 'isShowAdd') } />;
        }

        let deleteDialog = null;
        if( state.isShowDelete ){
            deleteDialog = <DeleteChannelDialog channel={ state.isShowDelete } onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') } />;
        }

        return (
            <div className="">
                <h1>栏目管理</h1>
                <ChannelTree addChannel={ this.addSubChannel } editChannel={ this.editChannel } deleteChannel={ this.deleteChannel } />
                { addDialog }
                { deleteDialog }
            </div>
        );
    }
}



let singleton = {

    init : function(){

        ReactDOM.render( <App />, document.getElementById('app'));
        
    }
};



module.exports = singleton;