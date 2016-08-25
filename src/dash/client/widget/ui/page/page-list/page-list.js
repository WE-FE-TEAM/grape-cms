/**
 * 渲染所有的 页面 列表
 * Created by jess on 16/6/15.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RTable = require('common:widget/react-ui/RTable/RTable.js');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const articleService = service.getService('page');

function noop(){}


class PageList extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            isLoading : false,
            articleList : null,
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

        articleService.getPageList( data )
            .then( (req) => {
                if( req.requestStatus === articleService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){

                        let data = out.data;

                        let temp = this.setState({
                            currentPage : pageIndex,
                            isLoading : false,
                            count : data.total,
                            articleList : data.list
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
                <th className="text-center">页面ID</th>
                <th className="text-center">页面名</th>
                <th className="text-center">编辑页面</th>
                <th className="text-center">删除页面</th>

            </tr>
        );
    }

    tableRowRenderer(rowData, index){

        let props = this.props;

        let rowClass = '';

        let viewUrl = '';

        let viewBtn = (
            <a title="点击查看页面" className="" target="_self" onClick={ this.onPageView.bind( this, rowData) }>{ rowData.articleName }</a>
        );

        // <td className="text-center"><button onClick={ this.onPagePublish.bind( this, rowData) } className="btn btn-info">发布</button></td>

        return (
            <tr key={ index } className={ rowClass }>
                <td className="text-center">{ rowData._id }</td>
                <td className="text-center">{ viewBtn }</td>
                <td className="text-center"><button onClick={ this.onPageEdit.bind( this, rowData) } className="btn btn-warning">编辑</button></td>
                <td className="text-center"><button onClick={ this.onPageDelete.bind( this, rowData) } className="btn btn-danger">删除</button></td>
            </tr>
        );
    }

    onPageView( rowData ){
        console.log( 'view article: ', rowData );
        let data = {
            channelId : rowData.channelId,
            articleId : rowData.articleId
        };
        let viewUrl = '/cms/designer/app/view?' + utils.json2query( data );
        location.href = viewUrl;
    }

    onPageEdit( rowData ){
        console.log( 'edit article: ', rowData );
        this.props.onPageEdit( rowData );
    }

    onPageDelete( rowData ){
        console.log( 'delete article: ', rowData );
        this.props.onPageDelete( rowData );
    }

    onPagePublish( rowData ){
        console.log( 'publish article: ', rowData );
        this.props.onPagePublish( rowData );
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
        if( state.articleList ){

            let count = state.count;
            let pageSize = state.pageSize;

            let totalPage = Math.ceil( count / pageSize );

            table = <RTable
                className="page-list-table"
                pagination={ true }
                totalPage={ totalPage }
                currentPage={ state.currentPage }
                onPageChange={ this.onPageChange }
                data={ state.articleList }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />
        }
        
        return (
            <div className="page-list-con">
                { table }
                { indicator }
            </div>
        );
    }
}


PageList.defaultProps = {

    onPageEdit : noop,
    onPageDelete : noop,
    onPagePublish : noop
};


module.exports = PageList;