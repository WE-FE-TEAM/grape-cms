/**
 * 显示某條數據的编辑 历史记录
 * Created on 16/6/28.
 */



const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');


const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RTable = require('common:widget/react-ui/RTable/RTable.js');

const dataService = service.getService('data');

class DataEditHistory extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            channelId : props.channelId,
            dataId : props.dataId,
            isLoading : false,
            history : null,
            errorMsg : ''
        };

        this.tableHeaderRenderer = this.tableHeaderRenderer.bind( this );
        this.tableRowRenderer = this.tableRowRenderer.bind( this );
    }

    componentDidMount(){
        this.fetchHistory();
    }

    fetchHistory(){

        if( this.state.isLoading || ! this.state.dataId ){
            return;
        }

        let state = this.state;

        let data = {
            channelId : state.channelId,
            dataId : state.dataId
        };

        dataService.getDataEditHistory( data )
            .then( ( req ) => {
                if( req.requestStatus === dataService.STATUS.SUCCESS ){
                    let out = req.data;
                  console.log("data history "+JSON.stringify(out.data));
                    if( out.status === 0 ){
                        this.setState({
                            isLoading : false,
                            errorMsg : '',
                            history : out.data
                        });
                        return;
                    }
                    return Promise.reject( new Error(out.message) );
                }
                return Promise.reject( new Error('请求历史记录失败'));
            })
            .catch( (e) => {
                alert( e.message );
                this.setState({
                    isLoading : false,
                    errorMsg : e.message,
                    history : null
                });
            });

        state.isLoading = true;
        this.setState({
            isLoading : true
        });
    }

    tableHeaderRenderer(){
        return (
            <tr>
                <th className="text-center">数据ID</th>
                <th className="text-center">数据名</th>
                <th className="text-center">本次编辑的用户</th>
                <th className="text-center">编辑时间</th>
                <th className="text-center">发布时间</th>
                <th className="text-center">发布人</th>
            </tr>
        );
    }

    tableRowRenderer(rowData, index){

        let props = this.props;
        let rowClass = '';
        let userName = rowData.userName;

        let editTime = new Date(rowData.createdAt).toLocaleString();

        let publishTime = '未发布';
        let publishUserName = '--';
        if( rowData.publishedAt ){
            publishTime = new Date( rowData.publishedAt ).toLocaleString();
            publishUserName = rowData.publishUserName;
        }

        let data = {
            channelId : rowData.channelId,
            dataId : rowData.dataId,
            recordId : rowData._id
        };

        let editUrl = '/cms/dash/data/view?' + utils.json2query( data );

        return (
            <tr key={ index } className={ rowClass }>
                <td className="text-center">{ rowData.dataId }</td>
                <td className="text-center">
                    <a title="点击查看" target="_blank" href={ editUrl }>{ rowData.dataName }</a>
                </td>
                <td className="text-center">{ userName }</td>
                <td className="text-center">{ editTime }</td>
                <td className="text-center">{ publishTime }</td>
                <td className="text-center">{ publishUserName }</td>
            </tr>
        );
    }

    render(){

        let state = this.state;

        if( ! state.dataId ){
            return null;
        }

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }


        let table = null;
        if( state.history ){
            table = <RTable
                className="data-edit-history-table"
                pagination={ false }
                data={ state.history }
                headerRenderer={ this.tableHeaderRenderer }
                rowRenderer={ this.tableRowRenderer }
            />;
        }

        return (
            <div className="data-edit-history">
                <h2>数据修改历史</h2>
                { table }
                { indicator }
            </div>
        );
    }
}

DataEditHistory.defaultProps = {

    channelId : '',
    dataId : ''
};


module.exports =DataEditHistory;