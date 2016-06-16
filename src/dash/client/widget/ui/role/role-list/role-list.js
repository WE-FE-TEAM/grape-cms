/**
 * 渲染所有的角色列表
 * Created by jess on 16/6/15.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RTable = require('common:widget/react-ui/RTable/RTable.js');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const roleService = service.getService('role');

function noop(){}


class RoleList extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            isLoading : true,
            roleList : null
        };

        this.tableHeaderRenderer = this.tableHeaderRenderer.bind( this );
        this.tableRowRenderer = this.tableRowRenderer.bind( this );
    }

    componentDidMount(){

        this.setState({
            isLoading : true
        });

        let searchConf = utils.getSearchConf();

        let data = {
            channelId : searchConf.channelId
        };

        roleService.getAll( data )
            .then( (req) => {
                if( req.requestStatus === roleService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){

                        return this.setState({
                            isLoading : false,
                            roleList : out.data
                        });
                    }
                    return Promise.reject( new Error(out.message) );
                }
                return Promise.reject();
            })
            .catch( (e) => {
                alert( e.message );
                this.setState({
                    isLoading : false
                });
            });
    }

    tableHeaderRenderer(){

        return (
            <tr>
                <th className="text-center">角色名</th>
                <th className="text-center">编辑操作</th>
                <th className="text-center">删除操作</th>
            </tr>
        );
    }

    tableRowRenderer(rowData, index){

        let props = this.props;

        return (
            <tr key={ index }>
                <td className="text-center">{ rowData.roleName }</td>
                <td className="text-center"><button onClick={ this.onRoleEdit.bind( this, rowData) } className="btn btn-warning">编辑</button></td>
                <td className="text-center"><button onClick={ this.onRoleDelete.bind( this, rowData) } className="btn btn-danger">删除</button></td>
            </tr>
        );
    }

    onRoleEdit( rowData ){
        console.log( 'edit role: ', rowData );
        this.props.onRoleEdit( rowData );
    }

    onRoleDelete( rowData ){
        console.log( 'delete role: ', rowData );
        this.props.onRoleDelete( rowData );
    }
    
    render(){
        
        let props = this.props;
        let state = this.state;

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }

        let table = null;
        if( state.roleList ){
            table = <RTable
                className="role-list-table"
                pagination={ false }
                data={ state.roleList }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />
        }
        
        return (
            <div className="role-list-con">
                { table }
                { indicator }
            </div>
        );
    }
}


RoleList.defaultProps = {

    onRoleEdit : noop,
    onRoleDelete : noop
};


module.exports = RoleList;