/**
 * 删除 某个 页面 弹窗
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

const pageService = service.getService('page');



class DeletePageDialog extends React.Component {

    constructor( props ){

        super(props);

        this.state = {
            isLoading : false,
            errorMsg : ''
        };

        this.submit = this.submit.bind( this );
    }

    submit(){
        if( this.state.isLoading ){
            return;
        }

        let page = this.props.page;

        let searchConf = utils.getSearchConf();


        let data = {
            channelId : searchConf.channelId,
            pageId : page.pageId
        };
        console.log(data.channelId+"pageId"+page.pageId);
        pageService.deletePage( data )
            .then( ( req ) => {
                if( req.requestStatus === pageService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        alert('删除页面成功');
                        location.reload();
                        return;
                    }
                    return Promise.reject( new Error(out.message) );
                }
                return Promise.reject( new Error('请求出错') );
            })
            .catch( ( e ) => {
                this.setState({
                    isLoading : false,
                    errorMsg : e.message || '服务器异常'
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
        
        let page = props.page;


        let dialogProps = {
            showing : true,
            isAutoCenter : true,
            title : '删除页面',
            onRequestClose : props.onRequestClose,
            dialog : {
                className : 'delete-page-dialog',
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
                <RForm action="/cms/dash/page/doDelete" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label for="name-input" className="col-sm-2 control-label">页面名</label>
                        <div className="col-sm-10">
                            { page.pageName }
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



module.exports = DeletePageDialog;