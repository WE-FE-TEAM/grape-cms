/**
 * 删除 用户 弹窗
 * Created by jess on 16/6/14.
 */


'use strict';



const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const RDialog = require('common:widget/react-ui/RWeDialog/RWeDialog.js');
const RForm = require('common:widget/react-ui/RForm/RForm.js');

const TextInput = RForm.TextInput;

const userService = service.getService('user');



class DeleteRoleDialog extends React.Component {

    constructor( props ){

        super(props);

        this.state = {
            user : props.user,
            isLoading : false,
            errorMsg : ''
        };

        this.submit = this.submit.bind( this );
    }

    submit(){
        if( this.state.isLoading ){
            return;
        }

        let searchConf = utils.getSearchConf();


        let data = {
            channelId : searchConf.channelId,
            userId : this.state.user._id
        };

        userService.deleteUser( data )
            .then( ( req ) => {
                if( req.requestStatus === userService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        alert('删除用户成功');
                        location.reload();
                        return;
                    }
                    return Promise.reject( out.message );
                }
                return Promise.reject();
            })
            .catch( ( msg ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : msg || '服务器异常'
                });
            });

        this.state.isLoading = true;

        this.setState({
            isLoading : true,
            errorMsg : false
        });
    }

    render(){

        let props = this.props;
        let state = this.state;


        let dialogProps = {
            showing : true,
            isAutoCenter : true,
            title : '删除用户',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'delete-user-dialog',
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
                <RForm action="/cms/dash/user/doDelete" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">用户名</label>
                        <div className="col-sm-10">
                            { state.user.userName }
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="col-xs-6">
                                <button onClick={ this.submit } type="button" className="btn btn-danger">确认删除</button>
                            </div>
                            <div className="col-xs-6">
                                <button onClick={ props.onRequestClose } type="button" className="btn btn-primary">取消</button>
                            </div>
                        </div>
                    </div>
                    { error }
                </RForm>
            </RDialog>
        );
    }
}



module.exports = DeleteRoleDialog;