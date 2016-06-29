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
const PUBLISH_TYPE_ONLINE = 'publish';
const PUBLISH_TYPE_PREVIEW = 'preview';

const dataService = service.getService('data');

class AppData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            //是否正在发布预览中
            isPreviewing: false,
            //是否处于  正式发布中
            isPublishing: false

        };

        this.onDataPublishPreview = this.onDataPublishPreview.bind(this);
        this.onDataPublish = this.onDataPublish.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
    }

    openOnlinePage(type) {

        let channel = this.props.channel;
        let mjsondata = this.props.jsondata;

        if (!mjsondata) {
            return;
        }

        let url = channel.onlineUrl;
        if (!url) {
            alert('该栏目未配置线上的访问URL, 不能自动打开线上页面');
            return;
        }

        url = url.replace(/\{\{dataId\}\}/g, mjsondata.dataId);

        if (type === PUBLISH_TYPE_PREVIEW) {
            //预览
            if (url.indexOf('?') < 0) {
                url += '?';
            }

            url += '&cmsPreview=1';
        }
        window.open(url);
    }

    onDataPublishPreview() {
        let state = this.state;

        if (state.isPreviewing) {
            return;
        }

        let channel = this.props.channel;

        let mjsondata = this.props.jsondata;
        let data = {
            channelId: mjsondata.channelId,
            dataId: mjsondata.dataId,
            recordId: mjsondata.recordId,
            releaseType: 'preview'
        };
        console.log(data.channelId + "chnann=" + data.recordId + "====dataid + datareleasetyoe" + data.releaseType);
        dataService.publishData(data)
            .then((req) => {
                if (req.requestStatus === dataService.STATUS.SUCCESS) {
                    let out = req.data;
                    if (out.status === 0) {
                        alert('发布到预览环境成功');
                        this.setState({
                            isPreviewing: false
                        });

                        //打开预览URL
                        this.openOnlinePage(PUBLISH_TYPE_PREVIEW);

                        location.reload();

                        return;
                    }
                    return Promise.reject(new Error(out.message));
                }
                return Promise.reject(new Error('预览文章请求失败'));
            })
            .catch((e) => {
                alert(e.message);
                this.setState({
                    isPreviewing: false
                });
            });

        state.isPreviewing = true;

        this.setState({
            isPreviewing: true
        });

    }

    onDataPublish() {
        let state = this.state;

        if (state.isPublishing) {
            return;
        }

        if (!window.confirm('=====再次确认发布=====\n\n正式发布会影响线上效果, 请 **务必** 慎重!!\n\n 确认发布么??? ')) {
            return;
        }

        let json_data = this.props.jsondata;
        let data = {
            channelId: json_data.channelId,
            dataId: json_data.dataId,
            recordId: json_data.recordId,
            releaseType: 'publish'
        };
        console.log("datapublish"+data.channelId + "chnann=" + data.recordId + "====dataid + datareleasetyoe" + data.releaseType);
        dataService.publishData(data)
            .then((req) => {
                if (req.requestStatus === dataService.STATUS.SUCCESS) {
                    let out = req.data;
                    if (out.status === 0) {
                        alert('发布到正式环境成功');
                        this.setState({
                            isPublishing: false
                        });

                        //打开线上访问的URL
                        this.openOnlinePage(PUBLISH_TYPE_ONLINE);

                        location.reload();

                        return;
                    }
                    return Promise.reject(new Error(out.message));
                }
                return Promise.reject(new Error('发布数据请求失败'));
            })
            .catch((e) => {
                alert(e.message);
                this.setState({
                    isPublishing: false
                });
            });

        state.isPublishing = true;

        this.setState({
            isPublishing: true
        });

    }

    onCancelEdit() {

        let mjsondata = this.props.jsondata;

        let data = {
            channelId: mjsondata.channelId,
            dataId: mjsondata.dataId
        };

        let viewUrl = '/cms/dash/data/view?' + utils.json2query(data);

        location.href = viewUrl;
    }

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
        let cancelEditBtn = null;

        let title = '';
        if (props.action === ACTION_VIEW) {
            isView = true;
            title = '查看文章';
            let data = {
                channelId: props.channel._id,
                dataId: props.jsondata.dataId,
                recordId: props.jsondata._id
            };
            let editUrl = '/cms/dash/data/edit?' + utils.json2query(data);
            editBtn = (
                <a className="btn btn-warning" target="_self" href={ editUrl }>编辑数据</a>
            );

            let previewText = '预览';
            if (state.isPreviewing) {
                previewText = '正在启动预览...';
            }

            let publishText = '发布';
            if (state.isPublishing) {
                publishText = '正在发布中...';
            }

            publishPreviewBtn = (
                <span className="btn btn-primary" onClick={ this.onDataPublishPreview }>{ previewText }</span>
            );

            publishBtn = (
                <span className="btn btn-danger" onClick={ this.onDataPublish }>{ publishText }</span>
            );
            historyCon = <DataEditHistory channelId={ props.channel._id } dataId={ props.jsondata.dataId }/>;
        }
        else if (props.action === ACTION_ADD) {
            isAdd = true;
            title = '新增json数据';

        } else if (props.action === ACTION_EDIT) {

            isEdit = true;
            title = '编辑json数据';
            console.log(title + "props.jsondat.dataid" + props.jsondata.dataId);
            cancelEditBtn = (
                <span className="btn btn-info" onClick={ this.onCancelEdit }>退出编辑</span>
            );
            historyCon = <DataEditHistory channelId={ props.channel._id } dataId={ props.jsondata.dataId }/>;

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
                    { cancelEditBtn }
                </div>
                <DataEditor channel={ props.channel } isView={ isView } isAdd={ isAdd } isEdit={ isEdit }
                            jsondata={ props.jsondata }/>
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

            singleton.render(channel, action, jsondata);
        } else if (action === ACTION_EDIT || action === ACTION_VIEW) {
            //异步请求文章数据, 再渲染
            let searchConf = utils.getSearchConf();
            dataService.getData({
                channelId: searchConf.channelId,
                dataId: searchConf.dataId,
                recordId: searchConf.recordId
            })
                .then((req) => {
                    if (req.requestStatus === dataService.STATUS.SUCCESS) {
                        let out = req.data;
                        if (out.status === 0) {
                            console.log(JSON.stringify(out.data) + action + "data eidit-data  ");
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