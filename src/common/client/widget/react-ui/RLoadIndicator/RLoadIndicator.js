/**
 * 加载中的指示器
 * Created by jess on 16/6/15.
 */


'use strict';



const React = require('react');
const ReactDOM = require('react-dom');


const loadingImage = __uri('./assets/load.gif');

class RLoadIndicator extends React.Component {

    render(){

        let props = this.props;

        let className = 'r-load-indicator ' + ( props.className || '' );
        
        let text = props.text || '加载中...';

        return (
            <div className={ className }>
                <div className="r-load-indicator-inner">
                    <img className="loading-img" src={ loadingImage } />
                    <div className="loading-text">{ text }</div>
                </div>
            </div>
        );
    }
}



module.exports = RLoadIndicator;