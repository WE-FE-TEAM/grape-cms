/**
 * Created by jess on 16/6/16.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');

const ArticleList = require('dash:widget/ui/page/page-list/page-list.js');
const DeleteArticleDialog = require('dash:widget/ui/page/delete-page-dialog/delete-page-dialog.js');


class App extends React.Component {

    constructor(props) {
        super(props);

        let searchConf = utils.getSearchConf();

        this.state = {
            channelId: searchConf.channelId,
            isShowDelete: null
        };

        this.onPageEdit = this.onPageEdit.bind(this);
        this.onPageDelete = this.onPageDelete.bind(this);
        this.onPagePublish = this.onPagePublish.bind(this);

    }

    onPageEdit(article) {
        //跳转到页面编辑页面
        let data = {
            channelId: this.state.channelId,
            articleId: article.articleId
        };
        location.href = '/cms/designer/app/edit?' + utils.json2query(data);
    }

    onPageDelete(article) {
        this.setState({
            isShowDelete: article
        });
    }

    onPagePublish(article) {

    }

    closeDialog(type) {
        let state = this.state;
        state[type] = null;
        this.setState(state);
    }

    render() {

        let props = this.props;
        let state = this.state;

        let addURL = '/cms/designer/app/create?channelId=' + encodeURIComponent(state.channelId);

        let deleteDialog = null;
        if (state.isShowDelete) {
            deleteDialog = <DeleteArticleDialog
                onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') }
                page={ state.isShowDelete }/>;
        }

        return (
            <div>
                <div>
                    <a className="btn btn-primary btn-lg" target="_self" href={ addURL }>创建页面</a>
                </div>
                <div className="">
                    <h2>该栏目下 页面 列表</h2>
                    <ArticleList onPageEdit={ this.onPageEdit }
                                 onPageDelete={ this.onPageDelete }
                                 onPagePublish={ this.onPagePublish }
                    />
                </div>
                { deleteDialog }
            </div>
        );
    }
}


let singleton = {

    init: function () {

        ReactDOM.render(<App />, document.getElementById('app'));
    }
};


module.exports = singleton;