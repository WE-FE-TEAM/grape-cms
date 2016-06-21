/**
 * 文件上传栏目的入口JS
 * Created by jess on 16/6/21.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');


const RUploader = require('common:widget/react-ui/RUploader/RUploader.js');



class App extends React.Component{

    render(){

        let parentDir = './test2';

        return (
            <div className="resource-page">
                <h1>资源上传栏目</h1>
                <div>
                    <RUploader parentDir={ parentDir } />
                </div>
            </div>
        );
    }
}


let singleton = {

    init(){
        ReactDOM.render( <App />, document.getElementById('app') );
    }
};




module.exports = singleton;


