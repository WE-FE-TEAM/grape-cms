/**
 * table component
 * Created by jess on 16/6/15.
 */


'use strict';



const React = require('react');
const ReactDOM = require('react-dom');

const Paginate = require('react-paginate');

function noop(){}

class RTable extends React.Component {


    renderEmpty(){
        let content = null;

        if( typeof this.props.emptyRenderer === 'function' ){
            content = this.props.emptyRenderer();
        }else{
            content = <div className="table-empty">无数据</div>;
        }

        return content;
    }

    //渲染翻页组件
    renderPagination(){

        let props = this.props;

        if( ! props.pagination ){
            return null;
        }

        return ( <div className="clearfix r-table-page-container">
            <Paginate
                containerClassName="pagination"
                activeClassName="active"
                pageNum={ props.totalPage }
                forceSelected={ props.currentPage }
                clickCallback={ props.onPageChange }
                marginPagesDisplayed={ 2 }
                pageRangeDisplayed={ 5 }
            />
        </div> );
    }

    render(){

        let props = this.props;

        let className = 'r-table '+ ( props.className || '' );

        let tableClassName = 'table table-bordered table-hover ' ;

        let header = props.headerRenderer();

        let body = null;

        let data = props.data;

        if( data.length > 0 ){
            body = data.map( ( rowData, index ) => {
                return props.rowRenderer( rowData, index );
            } );
        }else{
            body = this.renderEmpty();
        }

        // 翻页组件
        let pagination = null;
        if( props.pagination ){
            pagination = this.renderPagination();
        }

        return (
            <div className={ className }>
                <table className={ tableClassName }>
                    <thead>
                    { header }
                    </thead>
                    <tbody>
                    { body }
                    </tbody>
                </table>
                { pagination }
            </div>
        );

    }
}


RTable.defaultProps = {

    className : '',

    data : [],

    //渲染表头的函数
    headerRenderer : noop,

    //渲染一行的函数
    rowRenderer : noop,

    //无数据时渲染
    emptyRenderer : null,

    //是否分页
    pagination : false,
    pageSize : 10,
    totalPage : 1,
    currentPage : 0,
    onPageChange : noop
};


module.exports = RTable;


