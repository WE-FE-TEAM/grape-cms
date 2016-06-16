/**
 * 渲染所有的 用户 列表
 * Created by jess on 16/6/15.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RTable = require('common:widget/react-ui/RTable/RTable.js');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const userService = service.getService('user');

function noop(){}


class RoleList extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            isLoading : false,
            userList : null,
            count : 0,
            //用户点击翻页后, 要跳转到的页码
            targetPage : 0,
            currentPage : 0,
            pageSize : 10
        };

        this.tableHeaderRenderer = this.tableHeaderRenderer.bind( this );
        this.tableRowRenderer = this.tableRowRenderer.bind( this );

        this.onPageChange = this.onPageChange.bind( this );
    }

    componentDidMount(){

        this.requestPageData( 0 );
    }

    //请求 pageIndex 页码的数据
    requestPageData( pageIndex ){

        if( this.state.isLoading ){
            return;
        }

        let searchConf = utils.getSearchConf();

        let state = this.state;

        let start = pageIndex * state.pageSize;
        let num = state.pageSize;

        let data = {
            channelId : searchConf.channelId,
            start : start,
            num : num
        };

        userService.getUserList( data )
            .then( (req) => {
                if( req.requestStatus === userService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){

                        let data = out.data;

                        let temp = this.setState({
                            currentPage : pageIndex,
                            isLoading : false,
                            count : data.count,
                            userList : data.data
                        });

                        return null;
                    }
                    return Promise.reject( new Error(out.message) );
                }
                return Promise.reject( );
            })
            .catch( (e) => {
                alert( e.message );
                this.setState({
                    isLoading : false
                });
            });

        this.state.isLoading = true;

        this.setState({
            targetPage : pageIndex,
            isLoading : true
        });
    }

    tableHeaderRenderer(){

        return (
            <tr>
                <th className="text-center">用户名</th>
                <th className="text-center">是否禁用</th>
                <th className="text-center">编辑用户</th>
                <th className="text-center">删除用户</th>
            </tr>
        );
    }

    tableRowRenderer(rowData, index){

        let props = this.props;

        let rowClass = '';

        let disabled = null;
        if( rowData.enabled === 0 ){
            //启用
            disabled = '--';
        }else{
            //用户被禁用
            rowClass += ' warning';
            disabled = '用户被禁用';
        }

        return (
            <tr key={ index } className={ rowClass }>
                <td className="text-center">{ rowData.userName }</td>
                <td className="text-center">{ disabled }</td>
                <td className="text-center"><button onClick={ this.onUserEdit.bind( this, rowData) } className="btn btn-warning">编辑</button></td>
                <td className="text-center"><button onClick={ this.onUserDelete.bind( this, rowData) } className="btn btn-danger">删除</button></td>
            </tr>
        );
    }

    onUserEdit( rowData ){
        console.log( 'edit user: ', rowData );
        this.props.onUserEdit( rowData );
    }

    onUserDelete( rowData ){
        console.log( 'delete user: ', rowData );
        this.props.onUserDelete( rowData );
    }

    onPageChange( newPageIndex ){
        this.requestPageData( newPageIndex.selected );
    }
    
    render(){
        
        let props = this.props;
        let state = this.state;

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }

        let table = null;
        if( state.userList ){

            let count = state.count;
            let pageSize = state.pageSize;

            let totalPage = Math.ceil( count / pageSize );

            table = <RTable
                className="user-list-table"
                pagination={ true }
                totalPage={ totalPage }
                currentPage={ state.currentPage }
                onPageChange={ this.onPageChange }
                data={ state.userList }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />
        }
        
        return (
            <div className="user-list-con">
                { table }
                { indicator }
            </div>
        );
    }
}


RoleList.defaultProps = {

    onUserEdit : noop,
    onUserDelete : noop
};


module.exports = RoleList;