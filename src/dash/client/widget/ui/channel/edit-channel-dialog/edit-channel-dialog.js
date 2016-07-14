/**
 * 新增 栏目 的弹窗
 * Created by jess on 16/6/13.
 */


'use strict';


const $ = require('common:widget/lib/jquery/jquery.js');;
const React = require('react');
const ReactDOM = require('react-dom');
const utils = require('common:widget/ui/utils/utils.js');

const service = require('common:widget/ui/service/service-factory.js');

const RDialog = require('common:widget/react-ui/RWeDialog/RWeDialog.js');
const RForm = require('common:widget/react-ui/RForm/RForm.js');

const TextInput = RForm.TextInput;
const Checkbox=RForm.Checkbox;
const channelService = service.getService('channel');

const channelUtil = utils.channelUtil;


class EditChannelDialog extends React.Component{

    constructor( props ){
        super(props);

        this.state = {
            isLoading : false,
            errorMsg : ''
        };

        this.submit = this.submit.bind( this );
    }

    submit( e ){

        if( this.state.isLoading ){
            return;
        }

        let props = this.props;
        let channel = props.channel;


        let section = (this.refs.sectionInput.getValue() || '' ).trim();
        let category = (this.refs.categoryInput.getValue() || '' ).trim();
        let needSearch = this.refs.checkboxSelector.state.checked;
        let docURL = (this.refs.readmeDoc.getValue()|| '' ).trim();
        let onlineUrl = ( this.refs.onlineUrl.getValue() || '' ).trim();

        if (needSearch) {
            if (section== null || section== "") {
                this.setState({
                    errorMsg: 'section不能为空!'
                });
                return;
            }
            if(onlineUrl==null||onlineUrl==''){
                this.setState({
                    errorMsg: '文章访问Url不能为空!'
                });
                return;
            }

        }
        let articleTemplate = channel.articleTemplate;

        if( channelUtil.isArticleChannel( channel.channelType ) || channelUtil.isDataChannel( channel.channelType) ){
            articleTemplate = this.refs.articleTemplate.value;

            try{
                articleTemplate = JSON.parse( articleTemplate );
            }catch(e){
                this.setState({
                    errorMsg : '文章模板(JSON schema)必须是 JSON 格式!'
                });
                return;
            }
        }

        //发送字符串, 避免 boolean 类型丢失
        articleTemplate = JSON.stringify( articleTemplate );

        //只能修改 栏目名/文章模板
        let data = {
            channelId : channel._id,
            channelName : this.refs.channelName.getValue(),
            onlineUrl : onlineUrl,
            articleTemplate : articleTemplate
        };


        channelService.editChannel( data )
            .then( ( req ) => {
                if( req.requestStatus === channelService.STATUS.SUCCESS ){
                    let data = req.data;
                    if( data.status === 0 ){
                        //成功
                        alert('修改栏目成功');
                        location.reload();
                        return;
                    }
                    return Promise.reject( new Error( data.message ) );
                }
                return Promise.reject( new Error('系统返回异常') );
            })
            .catch( ( e ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : e.message || '保存栏目失败'
                });
            });

        this.state.isLoading = true;

        this.setState({
            isLoading : true,
            errorMsg : ''
        });
    }

    render(){

        let props = this.props;
        let state = this.state;

        let channel = props.channel;

        let dialogProps = {
            showing : true,
            title : '编辑栏目',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'edit-channel-dialog',
                style : {
                    width : 700
                }
            }
        };

        let error = null;
        if( state.errorMsg ){
            error = <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="error-info">{ state.errorMsg }</div>
                </div>
            </div>
        }

        return (
            <RDialog { ...dialogProps }>
                <RForm action="/cms/dash/channel/doEdit" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <input type="hidden" name="channelId" value={ channel._id } />
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">栏目名</label>
                        <div className="col-sm-9">
                            <TextInput ref="channelName" id="name-input" name="channelName" type="text" placeholder="输入栏目名称" value={ channel.channelName } />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="channel-type" className="col-sm-2 control-label">栏目类型</label>
                        <div className="col-sm-9">
                            { channelUtil.getChannelTypeText( channel.channelType ) }
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="sectionInput" className="col-sm-2 control-label">Section</label>
                        <div className="col-sm-9">
                            <TextInput ref="sectionInput" name="Section" defaultValue={channel.section}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="categoryInput" className="col-sm-2 control-label">Category</label>
                        <div className="col-sm-9">
                            <TextInput ref="categoryInput" name="Category" defaultValue={channel.category}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label for="checkboxSelector" className="col-sm-2 control-label">是否可搜索</label>
                        <div className="col-sm-9">
                            <Checkbox ref="checkboxSelector" name="NeedSearch" checked={channel.needSearch}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="readmeDoc" className="col-sm-2 control-label">说明文档URL</label>
                        <div className="col-sm-9">
                            <TextInput ref="readmeDoc" name="readmeDoc" value={channel.docURL}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="online-url-input" className="col-sm-2 control-label">文章访问URL</label>
                        <div className="col-sm-9">
                            <TextInput ref="onlineUrl" id="online-url-input" name="onlineUrl" type="text" placeholder="线上的文章访问URL" value={ channel.onlineUrl } />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="article-template" className="col-sm-2 control-label">文章栏目模板</label>
                        <div className="col-sm-9">
                            <textarea ref="articleTemplate" id="article-template" name="articleTemplate" className="form-control" rows="4" placeholder="输入文章模板" defaultValue={ JSON.stringify(channel.articleTemplate) }></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-9">
                            <button type="submit" className="btn btn-default">保存</button>
                        </div>
                    </div>
                    { error }
                </RForm>
            </RDialog>
        );
    }
}




module.exports = EditChannelDialog;