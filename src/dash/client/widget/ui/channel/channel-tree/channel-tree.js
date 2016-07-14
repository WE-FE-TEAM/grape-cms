/**
 * 负责渲染所有的栏目树
 * Created by jess on 16/6/13.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const Tree = require('common:widget/react-ui/tree/tree.js');

const dashService = service.getService('dash');
const channelUtil = utils.channelUtil;


class ChannelTree extends React.Component {

    constructor(props){
        super(props);
      
        this.state = {
            isLoading : true,
            data : null
        };

        this.nodeLabelRender = this.nodeLabelRender.bind( this );

    }

    componentDidMount(){

        dashService.getUserMenuTree()
            .then( ( allData ) => {
                if( allData.requestStatus === dashService.STATUS.SUCCESS ){
                    let data = allData.data;
                    if( data.status === 0 ){
                        return this.setState({
                            isLoading : false,
                            data : data.data
                        });
                    }
                }
                return Promise.reject(-1);
            })
            .catch( (e) => {
                console.error( e );
                alert('请求栏目数据失败');
            });
        
      
       

    }

    nodeLabelRender( channel, onNodeClick ){
        
        //如果是容器类的栏目, 可以为其添加子栏目
        let addChildBtn = null;
        
        if( channelUtil.canAddChild(channel) ){
            addChildBtn =<button onClick={ this.addChannelChild.bind( this, channel) } type="button" className="btn btn-primary">添加子栏目</button>;
        }

        let editChannelBtn = <button onClick={ this.editChannel.bind( this, channel) } type="button" className="btn btn-warning">编辑栏目</button>;

        let deleteChannelBtn = <button onClick={ this.deleteChannel.bind( this, channel) } type="button" className="btn btn-danger">删除栏目</button>;

        if( channel.isSystem ){
            //系统级栏目, 不能删除
            deleteChannelBtn = null;
        }
        
        return (
            <div className="channel-tree-node">
                <span className="channel-name col-lg-2 col-md-3 fa fa-plus-square-o" onClick={ onNodeClick }>{ channel.channelName }</span>
                { editChannelBtn }
                { deleteChannelBtn }
                { addChildBtn }
            </div>
        );
    }

    /**
     * 给 parentChannel 添加子栏目
     * @param parentChannel {object}
     */
    addChannelChild( parentChannel ){
        console.log( 'add channel: ', parentChannel );
        this.props.addChannel( parentChannel );
    }

    /**
     * 点击对应栏目的删除按钮
     * @param channel
     */
    deleteChannel( channel ){
        console.log( 'delete channel: ', channel );
        this.props.deleteChannel( channel );
    }

    /**
     * 点击对应栏目的编辑按钮
     * @param channel
     */
    editChannel( channel ){
        console.log( 'edit channel: ', channel );
        this.props.editChannel( channel );
    }

    render(){

        let state = this.state;

        let loadIndicator = null;

        if( state.isLoading ){
            loadIndicator = <div>加载栏目数据中...</div>;
        }

        let menuTree = null;
        if( state.data ){
            menuTree = <Tree childrenKey="children" nodeLabelRenderer={ this.nodeLabelRender } data={ state.data } />;
        }

        return (
            <div className="channel-tree">
                { loadIndicator }
                { menuTree }
            </div>
        );
    }
}



module.exports = ChannelTree;