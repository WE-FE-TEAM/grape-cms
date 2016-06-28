/**
 * Created on 16/6/28.
 */


'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const DataEditor = require('dash:widget/ui/data/data-editor/data-editor.js');
const DataEditHistory = require('dash:widget/ui/data/data-edit-history/data-edit-history.js');

const ACTION_VIEW = 'view';
const ACTION_ADD = 'add';
const ACTION_EDIT = 'edit';


const dataService = service.getService('data');

class AppData extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            //是否正在发布预览中
            isPreviewing : false,
            //是否处于  正式发布中
            isPublishing : false

        };

        this.onDataPublishPreview = this.onDataPublishPreview.bind( this );
        this.onDataPublish = this.onDataPublish.bind( this );
    }


    onDataPublishPreview(){}
    onDataPublish(){}
    render() {

        let props = this.props;
        let state = this.state;

        let isView = false;
        let isAdd = false;
        let isEdit = false;
        let editBtn = null;
        let publishPreviewBtn = null;
        let publishBtn = null;
        let historyCon = null;

        let title = '';
        if( props.action === ACTION_VIEW ){
            isView = true;
            title = '查看文章';
            let data = {
                channelId : props.channel._id,
                articleId : props.article.articleId,
                recordId : props.article._id
            };
            let editUrl = '/cms/dash/article/edit?' + utils.json2query( data );
            editBtn = (
                <a className="btn btn-warning" target="_self" href={ editUrl }>编辑文章</a>
            );

            let previewText = '预览';
            if( state.isPreviewing ){
                previewText = '正在启动预览...';
            }

            let publishText = '发布';
            if( state.isPublishing ){
                publishText = '正在发布中...';
            }

            publishPreviewBtn = (
                <span className="btn btn-primary" onClick={ this.onDataPublishPreview }>{ previewText }</span>
            );

            publishBtn = (
                <span className="btn btn-danger" onClick={ this.onDataPublish }>{ publishText }</span>
            );
            historyCon = <DataEditHistory channelId={ props.channel._id } dataId={ props.jsondata.dataId } />;
        }
       else if (props.action === ACTION_ADD) {
            isAdd = true;
            title = '新增json数据';
            console.log(title);
        } else if (props.action === ACTION_EDIT) {
            isAdd = false;
            title = '编辑json数据';
            console.log(title+"props.jsondat.dataid"+props.jsondata.dataId);

            historyCon = <DataEditHistory channelId={ props.channel._id } dataId={ props.jsondata.dataId } />;
        } else {
            return null;
        }

        return (
            <div>
                <h1>{ title }</h1>
                <div className="operation-bar">
                    { publishPreviewBtn }
                    { editBtn }
                    { publishBtn }
                </div>
                <DataEditor channel={ props.channel }  isView={ isView } isAdd={ isAdd } isEdit={ isEdit }  jsondata={ props.jsondata }/>
                { historyCon }
            </div>
        );
    }

}
let singleton = {

    init: function (args) {

        let action = args.action;
        let channel = args.channel;

        channel = utils.parseJSON(channel);

        if (!channel) {
            alert('栏目数据异常!!');
            return;
        }

        let jsondata = null;

        if (action === ACTION_ADD) {
            //新创建文章
            console.log("xin jian new add ");
            singleton.render(channel, action, jsondata);
        } else if (action === ACTION_EDIT|| action === ACTION_VIEW ) {
            //异步请求文章数据, 再渲染
            let searchConf = utils.getSearchConf();
            console.log("edit edit");
            dataService.getData({channelId: searchConf.channelId, dataId: searchConf.dataId,recordId : searchConf.recordId })
                .then((req) => {
                    if (req.requestStatus === dataService.STATUS.SUCCESS) {
                        let out = req.data;
                        if (out.status === 0) {
                            console.log(JSON.stringify(out.data) + action + "data eidit-data");
                            singleton.render(channel, action, out.data);
                            return;
                        }
                        return Promise.reject(new Error(out.message));
                    }
                    return Promise.reject(new Error('请求该文章详情出错!'));
                })
                .catch((e) => {
                    alert(e.message);
                });
        }
    },

    render(channel, action, jsondata){
        ReactDOM.render(<AppData channel={ channel } action={ action }
                                 jsondata={ jsondata }/>, document.getElementById('app'));
    }
};


module.exports = singleton;