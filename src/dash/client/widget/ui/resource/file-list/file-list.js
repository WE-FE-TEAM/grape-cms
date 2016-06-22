/**
 * 显示某个目录下的所有文件列表
 * Created by jess on 16/6/22.
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


class FileList extends React.Component{

    constructor(props){
        super(props);

        // this.onDirectoryClick = this.onDirectoryClick.bind( this );

        this.tableHeaderRenderer = this.tableHeaderRenderer.bind( this );
        this.tableRowRenderer = this.tableRowRenderer.bind( this );
    }

    onDirectoryClick( directory ){
        this.props.onDirectoryClick( directory );
    }

    tableHeaderRenderer(){

        return (
            <tr>
                <th className="text-center">文件名</th>
                <th className="text-center">类型</th>
                <th className="text-center">操作</th>
            </tr>
        );
    }

    tableRowRenderer(rowData, index){

        let props = this.props;

        let fileType = '--';
        let operation = null;

        if( rowData.isFile ){
            fileType = '文件';
            operation = <a target="_blank" href={ rowData.url }>查看文件</a>;
        }else if( rowData.isDirectory ){
            fileType = '目录';
            operation = <button onClick={ this.onDirectoryClick.bind( this, rowData) } className="btn btn-primary">进入目录</button>
        }

        return (
            <tr key={ index }>
                <td className="text-center">{ rowData.name }</td>
                <td className="text-center">{ fileType }</td>
                <td className="text-center">{ operation }</td>
            </tr>
        );
    }

    render(){

        let props = this.props;
        let state = this.state;


        let table = null;
        if( props.fileList ){
            table = <RTable
                className="file-list-table"
                pagination={ false }
                data={ props.fileList }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />;
        }

        return (
            <div className="file-list-con">
                { table }
            </div>
        );
    }
}


FileList.defaultProps = {

    //用户点击某个目录 的回调
    onDirectoryClick : noop,

    fileList : []
};


module.exports = FileList;