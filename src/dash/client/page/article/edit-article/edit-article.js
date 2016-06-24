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

const articleService = service.getService('article');

class App extends React.Component{

    render(){

        let props = this.props;

        let isAdd = false;

        let historyCon = null;

        let title = '';
        if( props.action === ACTION_VIEW ){

            title = '查看文章';
        }else if( props.action === ACTION_ADD ){
            isAdd = true;
            title = '新增文章';
        }else if( props.action === ACTION_EDIT ){
            isAdd = false;
            title = '编辑文章';

            historyCon = <ArticleEditHistory channelId={ props.channel._id } articleId={ props.article.articleId } />;

        }else{
            return null;
        }

        return (
            <div>
                <h1>{ title }</h1>
                <ArticleEditor channel={ props.channel } isAdd={ isAdd } article={ props.article } />
                { historyCon }
            </div>
        );
    }
}


let singleton = {

    init : function( args ){

        let action = args.action;
        let channel = args.channel;

        channel = utils.parseJSON( channel );

        if( ! channel ){
            alert('栏目数据异常!!');
            return;
        }
        
        let article = null;
        
        if( action === ACTION_ADD ){
            //新创建文章
            singleton.render( channel, action, article );
        }else if( action === ACTION_EDIT ){
            //异步请求文章数据, 再渲染
            let searchConf = utils.getSearchConf();

            articleService.getArticle( { channelId : searchConf.channelId, articleId : searchConf.articleId, recordId : searchConf.recordId } )
                .then( ( req ) => {
                    if( req.requestStatus === articleService.STATUS.SUCCESS ){
                        let out = req.data;
                        if( out.status === 0 ){
                            singleton.render( channel, ACTION_EDIT, out.data );
                            return;
                        }
                        return Promise.reject( new Error(out.message) );
                    }
                    return Promise.reject( new Error('请求该文章详情出错!') );
                })
                .catch( (e) => {
                    alert( e.message );
                });
        }
    },
    
    render( channel, action, article ){
        ReactDOM.render( <App channel={ channel } action={ action } article={ article } />, document.getElementById('app') );
    }
};



module.exports = singleton;