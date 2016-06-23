/**
 * 渲染文章编辑器
 * Created by jess on 16/6/17.
 */



const React = require('react');
const ReactDOM = require('react-dom');

const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');

const RForm = require('common:widget/react-ui/RForm/RForm.js');

const TextInput = RForm.TextInput;
const Textarea = RForm.Textarea;
const RichEditor = RForm.RichEditor;


const articleService = service.getService('article');

class ArticleEditor extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            
            isLoading : false,
            errorMsg : ''
        };
        

        this.submit = this.submit.bind( this );
    }

    submit(){

        let state = this.state;
        let props = this.props;

        if( state.isLoading ){
            return;
        }



        let channel = props.channel;
        let article = props.article;
        let articleTemplate = channel.articleTemplate;
        let fields = articleTemplate.fields || [];

        let isAdd = ! article;

        let articleName = this.refs.articleName.getValue();
        let data = article ? article.data : {} ;

        fields.forEach( ( conf ) => {
            let key = conf.key;
            let component = this.refs[key];
            if( component ){
                data[key] = component.getValue();
            }
        } );

        let allData = {
            channelId : channel._id,
            articleName : articleName,
            data : JSON.stringify( data )
        };

        let promise;

        if( isAdd ){
            //新增
            promise = articleService.addArticle( allData );
        }else{
            allData.articleId = article.articleId;
            //编辑
            promise = articleService.updateArticle( allData );
        }

        promise.then( ( req ) => {
            if( req.requestStatus === articleService.STATUS.SUCCESS ){
                let out = req.data;
                if( out.status === 0 ){
                    alert('保存文章成功');

                    let searchConf = utils.getSearchConf();

                    searchConf.articleId = out.data.articleId;
                    // searchConf.recordId = out.data._id;

                    location.href = '/cms/dash/article/edit?' + utils.json2query( searchConf );

                    return;
                }
                return Promise.reject( new Error(out.message) );
            }
            return Promise.reject( new Error('系统返回异常') );
        } ).catch( (e) => {
            alert( e.message );
            this.setState({
                isLoading : false,
                errorMsg : e.message || '系统返回异常'
            });
        });

        state.isLoading = true;

        this.setState({
            isLoading : true,
            errorMsg : ''
        });

    }

    renderField( fieldConf ){

        let article = this.props.article;
        let key = fieldConf.key;
        let placeholder = fieldConf.placeholder || '';

        let inputProps = {
            ref : key,
            name : key,
            id : key,
            placeholder : placeholder
        };

        if( article && article.data ){
            inputProps.value = article.data[key];
        }

        let input = null;

        switch( fieldConf.type ){
            case 'text':
                input = <TextInput {...inputProps} type="text"  />;
                break;
            case 'textarea':
                input = <Textarea {...inputProps} />;
                break;
            case 'richtext':
                input = <RichEditor { ...inputProps} />;
                break;
            default:
                input = <div className="error-info">未识别的输入类型</div>;
        }

        return (
            <div key={ key } className="form-group">
                <label htmlFor={key} className="col-sm-2 control-label">{ fieldConf.label }</label>
                <div className="col-sm-10">
                    { input }
                </div>
            </div>
        );
    }

    render(){
        
        let props = this.props;
        
        let state = this.state;

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }

        let error = null;
        if( state.errorMsg ){
            error = <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="error-info">{ state.errorMsg }</div>
                </div>
            </div>;
        }

        let article = props.article;
        let channel = props.channel;

        let fieldsDef = channel.articleTemplate.fields || [];

        let fields = fieldsDef.map( ( fieldConf ) => {
            return this.renderField( fieldConf );
        } );

        let articleName = '';
        if( article ){
            articleName = article.articleName || '';
        }

        return (
            <div className="article-editor">
                <RForm action="/cms/dash/article/doAdd" method="POST" className="form-horizontal" onSubmit={ this.submit }>

                    <div className="form-group">
                        <label htmlFor="articleName" className="col-sm-2 control-label">文章后台显示标题</label>
                        <div className="col-sm-10">
                            <TextInput value={ articleName  } ref="articleName" id="articleName" name="articleName" type="text" placeholder="这里输入文章在在后台显示的标题"  />
                        </div>
                    </div>
                    <div className="text-center split-line">==============以下是文章被普通用户能看到的属性===============</div>
                    { fields }
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">保存</button>
                        </div>
                    </div>
                    { error }
                </RForm>
                { indicator }
            </div>
        );
    }
}

ArticleEditor.defaultProps = {

    //当前栏目数据
    channel : null,
    //是否新增文章
    isAdd : true,
    //如果是编辑文章, 传入文章数据
    article : null
    
};


module.exports = ArticleEditor;