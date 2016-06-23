/**
 * Created by jess on 16/6/16.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');

const ArticleList = require('dash:widget/ui/article/article-list/article-list.js');
const DeleteArticleDialog = require('dash:widget/ui/article/delete-article-dialog/delete-article-dialog.js');



class App extends React.Component{

    constructor(props){
        super(props);

        let searchConf = utils.getSearchConf();

        this.state = {
            channelId : searchConf.channelId,
            isShowDelete : null
        };

        this.onArticleEdit = this.onArticleEdit.bind( this );
        this.onArticleDelete = this.onArticleDelete.bind( this );
        this.onArticlePublish = this.onArticlePublish.bind( this );

    }

    onArticleEdit( article ){
        //跳转到文章编辑页面
        let data = {
            channelId : this.state.channelId,
            articleId : article._id,
            recordId : article.recordId
        };
        location.href = '/cms/dash/article/edit?' + utils.json2query( data );
    }

    onArticleDelete( article ){
        this.setState({
            isShowDelete : article
        });
    }

    onArticlePublish( article ){

    }

    closeDialog(type){
        let state = this.state;
        state[type] = null;
        this.setState( state );
    }

    render(){

        let props = this.props;
        let state = this.state;

        let addURL = '/cms/dash/article/add?channelId=' + encodeURIComponent( state.channelId );

        let deleteDialog = null;
        if( state.isShowDelete ){
            deleteDialog = <DeleteArticleDialog
                onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') }
                article={ state.isShowDelete } />;
        }

        return (
            <div>
                <div>
                    <a className="btn btn-primary btn-lg" target="_self" href={ addURL }>创建文章</a>
                </div>
                <div className="">
                    <h2>该栏目下 文章列表</h2>
                    <ArticleList onArticleEdit={ this.onArticleEdit }
                                 onArticleDelete={ this.onArticleDelete }
                                 onArticlePublish={ this.onArticlePublish }
                    />
                </div>
                { deleteDialog }
            </div>
        );
    }
}




let singleton = {

    init : function(){

        ReactDOM.render( <App />, document.getElementById('app') );
    }
};



module.exports = singleton;