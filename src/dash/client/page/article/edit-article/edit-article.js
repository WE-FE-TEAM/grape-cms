/**
 * Created by jess on 16/6/16.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');


const ArticleEditor = require('dash:widget/ui/article/article-editor/article-editor.js');
const ArticleEditHistory = require('dash:widget/ui/article/article-edit-history/article-edit-history.js');

const ACTION_VIEW = 'view';
const ACTION_ADD = 'add';
const ACTION_EDIT = 'edit';

const PUBLISH_TYPE_ONLINE = 'publish';
const PUBLISH_TYPE_PREVIEW = 'preview';

const articleService = service.getService('article');

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            //是否正在发布预览中
            isPreviewing: false,
            //是否处于  正式发布中
            isPublishing: false

        };

        this.onArticlePublishPreview = this.onArticlePublishPreview.bind(this);
        this.onArticlePublish = this.onArticlePublish.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
    }

    openOnlinePage(type) {

        let channel = this.props.channel;
        let article = this.props.article;

        if (!article) {
            return;
        }

        let url = channel.onlineUrl;
        if (!url) {
            alert('该栏目未配置线上的访问URL, 不能自动打开线上页面');
            return;
        }

        url = url.replace(/\{\{articleId\}\}/g, article.articleId);

        if (type === PUBLISH_TYPE_PREVIEW) {
            //预览
            if (url.indexOf('?') < 0) {
                url += '?';
            }

            url += '&cmsPreview=1';
        }

        window.open(url);

    }

    //异步发布预览文章
    onArticlePublishPreview() {

        let state = this.state;

        if (state.isPreviewing) {
            return;
        }

        let channel = this.props.channel;

        let article = this.props.article;
        let data = {
            channelId: article.channelId,
            articleId: article.articleId,
            recordId: article.recordId,
            releaseType: 'preview'
        };

        articleService.publishArticle(data)
            .then((req) => {
                if (req.requestStatus === articleService.STATUS.SUCCESS) {
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

    //异步发布文章
    onArticlePublish() {

        let state = this.state;

        if (state.isPublishing) {
            return;
        }

        if (!window.confirm('=====再次确认发布=====\n\n正式发布会影响线上效果, 请 **务必** 慎重!!\n\n 确认发布么??? ')) {
            return;
        }

        let article = this.props.article;
        let data = {
            channelId: article.channelId,
            articleId: article.articleId,
            recordId: article.recordId,
            releaseType: 'publish'
        };

        articleService.publishArticle(data)
            .then((req) => {
                if (req.requestStatus === articleService.STATUS.SUCCESS) {
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
                return Promise.reject(new Error('发布文章请求失败'));
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

    //取消编辑, 跳转到查看页面
    onCancelEdit() {

        let article = this.props.article;

        let data = {
            channelId: article.channelId,
            articleId: article.articleId
        };

        let viewUrl = '/cms/dash/article/view?' + utils.json2query(data);

        location.href = viewUrl;
    }

    render() {

        let props = this.props;
        let state = this.state;

        let article = props.article;

        let isView = false;
        let isAdd = false;
        let isEdit = false;

        let editBtn = null;
        let publishPreviewBtn = null;
        let publishBtn = null;
        let historyCon = null;
        let cancelEditBtn = null;

        let currentReleaseBtn = null;

        if( article ){

            let data = {
                channelId: props.channel._id,
                articleId: props.article.articleId
            };

            let currentReleaseURL = '/cms/dash/article/currentRelease?' + utils.json2query(data);
            currentReleaseBtn = (
                <a className="btn btn-primary" target="_blank" href={ currentReleaseURL }>查看当前发布的数据</a>
            );

        }

        let title = '';
        if (props.action === ACTION_VIEW) {
            isView = true;
            title = '查看文章';
            let data = {
                channelId: props.channel._id,
                articleId: props.article.articleId,
                recordId: props.article._id
            };
            let editUrl = '/cms/dash/article/edit?' + utils.json2query(data);
            editBtn = (
                <a className="btn btn-warning" target="_self" href={ editUrl }>编辑文章</a>
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
                <span className="btn btn-primary" onClick={ this.onArticlePublishPreview }>{ previewText }</span>
            );

            publishBtn = (
                <span className="btn btn-danger" onClick={ this.onArticlePublish }>{ publishText }</span>
            );

            historyCon = <ArticleEditHistory channelId={ props.channel._id } articleId={ props.article.articleId }/>;

        } else if (props.action === ACTION_ADD) {
            isAdd = true;
            title = '新增文章';
        } else if (props.action === ACTION_EDIT) {

            isEdit = true;
            title = '编辑文章';

            cancelEditBtn = (
                <span className="btn btn-info" onClick={ this.onCancelEdit }>退出编辑</span>
            );

            historyCon = <ArticleEditHistory channelId={ props.channel._id } articleId={ props.article.articleId }/>;

        } else {
            return null;
        }

        return (
            <div className="article-edit-page">
                <h1>{ title }</h1>
                <div className="operation-bar">
                    { currentReleaseBtn }
                    { publishPreviewBtn }
                    { editBtn }
                    { publishBtn }
                    { cancelEditBtn }
                </div>
                <ArticleEditor channel={ props.channel } isView={ isView } isAdd={ isAdd } isEdit={ isEdit }
                               article={ props.article }/>
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

        let article = null;

        if (action === ACTION_ADD) {
            //新创建文章
            singleton.render(channel, action, article);
        } else if (action === ACTION_EDIT || action === ACTION_VIEW) {
            //异步请求文章数据, 再渲染
            let searchConf = utils.getSearchConf();

            articleService.getArticle({
                channelId: searchConf.channelId,
                articleId: searchConf.articleId,
                recordId: searchConf.recordId
            })
                .then((req) => {
                    if (req.requestStatus === articleService.STATUS.SUCCESS) {
                        let out = req.data;
                        if (out.status === 0) {
                            console.log(JSON.stringify(out.data) + "article");
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

    render(channel, action, article){
        ReactDOM.render(<App channel={ channel } action={ action }
                             article={ article }/>, document.getElementById('app'));
    }
};


module.exports = singleton;