/**
 * 基于React 的弹窗
 * Created by jess on 16/4/26.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const DialogPortal = require('./DialogPortal');

function noop(){}

class RDialog extends React.Component {
    
    constructor(props){
        super(props);
        
    }
    
    componentDidMount(){
        this.container = document.createElement('div');
        this.container.className = 'r-dialog-container';
        document.body.appendChild(this.container);
        this.renderPortal( this.props );
    }

    componentWillReceiveProps(newProps){
        this.renderPortal( newProps );
    }

    componentWillUnmount(){
        ReactDOM.unmountComponentAtNode( this.container );
        document.body.removeChild( this.container );
        this.container = null;
    }

    renderPortal( props ){

        ReactDOM.render( <DialogPortal {...props} />, this.container);

    }
    
    render(){
        
        return null;
    }
    
}


RDialog.defaultProps = {
    showing : false,
    //是否带mask
    isModal : true,
    //点击mask, 是否触发关闭弹窗动作
    isCloseOnMaskClick : false,
    //是否自动在可视区域居中
    isAutoCenter : false,
    zIndex : 20,
    dialog : {
        className : '',
        id : '',
        style : {

        }
    },
    mask : {
        className : '',
        id : '',
        style : {}
    },

    onRequestClose : noop
};



module.exports = RDialog;