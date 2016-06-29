/**
 * 渲染所有的 文章 列表
 * Created on 16/6/15.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RTable = require('common:widget/react-ui/RTable/RTable.js');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const dataService = service.getService('data');

function noop() {
}


class DataList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            dataList: null,
            count: 0,
            //用户点击翻页后, 要跳转到的页码
            targetPage: 0,
            currentPage: 0,
            pageSize: 10
        };

        this.tableHeaderRenderer = this.tableHeaderRenderer.bind(this);
        this.tableRowRenderer = this.tableRowRenderer.bind(this);

        this.onPageChange = this.onPageChange.bind(this);
    }

    componentDidMount() {

        this.requestPageData(0);
    }

    //请求 pageIndex 页码的数据
    requestPageData(pageIndex) {

        if (this.state.isLoading) {
            return;
        }

        let searchConf = utils.getSearchConf();

        let state = this.state;

        let start = pageIndex * state.pageSize;
        let num = state.pageSize;

        let data = {
            channelId: searchConf.channelId,
            start: start,
            num: num
        };

        dataService.getDataList(data)
            .then((req) => {
                if (req.requestStatus === dataService.STATUS.SUCCESS) {
                    let out = req.data;
                    if (out.status === 0) {

                        let data = out.data;

                        let temp = this.setState({
                            currentPage: pageIndex,
                            isLoading: false,
                            count: data.total,
                            dataList: data.list
                        });

                        return null;
                    }
                    return Promise.reject(new Error(out.message));
                }
                return Promise.reject();
            })
            .catch((e) => {
                alert(e.message);
                this.setState({
                    isLoading: false
                });
            });

        this.state.isLoading = true;

        this.setState({
            targetPage: pageIndex,
            isLoading: true
        });
    }

    tableHeaderRenderer() {
        return (
            <tr>
                <th className="text-center">数据ID</th>
                <th className="text-center">数据名</th>
                <th className="text-center">编辑数据</th>
                <th className="text-center">删除数据</th>

            </tr>
        );
    }

    tableRowRenderer(rowData, index) {

        let props = this.props;

        let rowClass = '';
        let viewBtn = (
            <a title="点击查看数据" className="" target="_self"
               onClick={ this.onDataView.bind( this, rowData) }>{ rowData.dataName }</a>
        );

        return (
            <tr key={ index } className={ rowClass }>
                <td className="text-center">{ rowData.dataId }</td>
                <td className="text-center">{ viewBtn }</td>
                <td className="text-center"><button onClick={ this.onDataEdit.bind( this, rowData) } className="btn btn-warning">编辑</button></td>
                <td className="text-center"><button onClick={ this.onDataDelete.bind( this, rowData) } className="btn btn-danger">删除</button></td>
            </tr>
        );
    }

    onDataView(rowData) {
        console.log('view data: ', rowData);
        let data = {
            channelId: rowData.channelId,
            dataId: rowData.dataId
        };
        let viewUrl = '/cms/dash/data/view?' + utils.json2query(data);
        location.href = viewUrl;
    }

    onDataEdit(rowData) {
        console.log('edit jsondata: ', rowData);
        this.props.onDataEdit(rowData);
    }

    onDataDelete(rowData) {
        console.log('delete jsondata: ', rowData);
        this.props.onDataDelete(rowData);
    }

    onDataPublish(rowData) {
        console.log('publish data: ', rowData);
        this.props.onDataPublish(rowData);
    }

    onPageChange(newPageIndex) {
        this.requestPageData(newPageIndex.selected);
    }

    render() {

        let props = this.props;
        let state = this.state;

        let indicator = null;
        if (state.isLoading) {
            indicator = <RLoadingIndicator />;
        }

        let table = null;
        if (state.dataList) {
            let count = state.count;
            let pageSize = state.pageSize;

            let totalPage = Math.ceil(count / pageSize);

            table = <RTable
                className="Data-list-table"
                pagination={ true }
                totalPage={ totalPage }
                currentPage={ state.currentPage }
                onPageChange={ this.onPageChange }
                data={ state.dataList }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />
        }

        return (
            <div className="article-list-con">
                { table }
                { indicator }
            </div>
        );
    }
}


DataList.defaultProps = {

    onDataEdit: noop,
    onDataDelete: noop,
    onDataPublish: noop
};


module.exports = DataList;