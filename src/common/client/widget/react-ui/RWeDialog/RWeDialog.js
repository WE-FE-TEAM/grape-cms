/**
 * 封装WE产品线上主要使用的弹窗样式
 * Created by jess on 16/4/27.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');


const RDialog = require('common:widget/react-ui/RDialog/RDialog');



function noop(){}


class RWeDialog extends React.Component{

    constructor(props){
        super(props);

    }

    render(){

        let props = this.props;


        let dialogClass = 'r-we-dialog ' + ( props.dialog.className || '');
        let dialogStyle  = props.dialog.style || {};

        let titleView = null;
        if( props.title ){
            titleView = <header className="j-dialog-title-con">
                        <h1 className="j-dialog-title">{ props.title }</h1>

            </header>;
        }

        props.dialog.className = dialogClass;
        props.dialog.style = dialogStyle;


        return (
            <RDialog {...props}>
                <span className="j-dialog-close-btn" onClick={ this.props.onRequestClose }>×</span>
                { titleView }
                <div className="j-dialog-content">
                    { props.children }
                </div>
            </RDialog>
        );
    }

}


RWeDialog.defaultProps = {

    showing : false,

    //弹窗标题
    title : '',

    isAutoCenter : true,

    dialog : {
        className : '',
        style : {
            width : 700
        }
    },
    
    onRequestClose : noop
};


module.exports = RWeDialog;