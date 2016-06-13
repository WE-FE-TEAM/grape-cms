/**
 * 删除 栏目 的弹窗
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


class DeleteChannelDialog extends React.Component{

    constructor( props ){
        super(props);

        this.state = {
            isLoading : false,
            errorMsg : ''
        };

        this.addSubmit = this.addSubmit.bind( this );
    }

    submit( e ){

        if( this.state.isLoading ){
            return;
        }

        let props = this.props;
        let channel = props.channel;

        let data = {
            channelId : channel._id
        };


        channelService.deleteChannel( data )
            .then( ( req ) => {
                if( req.requestStatus === channelService.STATUS.SUCCESS ){
                    let data = req.data;
                    if( data.status === 0 ){
                        //成功
                        alert('删除栏目成功');
                        location.reload();
                    }else{
                        return Promise.reject( new Error( data.message ) );
                    }
                }
            })
            .catch( ( e ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : e.message || '删除栏目失败'
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
            title : '确认删除栏目',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'delete-channel-dialog',
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
                <div className="form-horizontal">
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">栏目名</label>
                        <div className="col-sm-10">
                            { channel.channelName }
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="channel-type" className="col-sm-2 control-label">栏目类型</label>
                        <div className="col-sm-10">
                            { channelUtil.getChannelTypeText( channel.channelType ) }
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-danger" onClick={ this.submit }>确认删除</button>
                        </div>
                    </div>
                    { error }
                </div>
            </RDialog>
        );
    }
}




module.exports = DeleteChannelDialog;