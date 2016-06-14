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

const ChannelTypeSelect = require('dash:widget/ui/channel-type-select/channel-type-select.js');

const TextInput = RForm.TextInput;

const channelService = service.getService('channel');

const channelUtil = utils.channelUtil;


class AddChannelDialog extends React.Component{

    constructor( props ){
        super(props);

        this.state = {
            isLoading : false,
            errorMsg : ''
        };

        this.addSubmit = this.addSubmit.bind( this );
    }

    addSubmit( e ){

        if( this.state.isLoading ){
            return;
        }

        let props = this.props;
        let channel = props.channel;

        let type = this.refs.channelType.getValue();

        let articleTemplate = null;

        if( channelUtil.isArticleChannel( type ) ){
            articleTemplate = this.refs.articleTemplate.value;
            try{
                articleTemplate = JSON.parse( articleTemplate );
            }catch(e){
                this.setState({
                    errorMsg : '文章模板必须是 JSON 格式!'
                });
                return;
            }
        }

        //发送字符串, 避免 boolean 类型丢失
        articleTemplate = JSON.stringify( articleTemplate );

        let data = {
            channelId : channel._id,
            channelName : this.refs.channelName.getValue(),
            channelType : type,
            articleTemplate : articleTemplate
        };


        channelService.addChannel( data )
            .then( ( req ) => {
                if( req.requestStatus === channelService.STATUS.SUCCESS ){
                    let data = req.data;
                    if( data.status === 0 ){
                        //成功
                        alert('新增栏目成功');
                        location.reload();
                    }else{
                        return Promise.reject( new Error( data.message ) );
                    }
                }
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
            title : '新增栏目',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'add-channel-dialog',
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
                <RForm action="/cms/dash/channel/doAdd" method="POST" className="form-horizontal" onSubmit={ this.addSubmit }>
                    <input type="hidden" name="channelId" value={ channel._id } />
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">栏目名</label>
                        <div className="col-sm-10">
                            <TextInput ref="channelName" id="name-input" name="channelName" type="text" placeholder="输入栏目名称" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="channel-type" className="col-sm-2 control-label">栏目类型</label>
                        <div className="col-sm-10">
                            <ChannelTypeSelect ref="channelType"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="article-template" className="col-sm-2 control-label">文章栏目模板</label>
                        <div className="col-sm-10">
                            <textarea ref="articleTemplate" id="article-template" name="articleTemplate" className="form-control" rows="4" placeholder="输入栏目名称"></textarea>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">增加</button>
                        </div>
                    </div>
                    { error }
                </RForm>
            </RDialog>
        );
    }
}




module.exports = AddChannelDialog;