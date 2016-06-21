/**
 * 就 web uploader 封装的 react 组件
 * Created by jess on 16/6/21.
 */



'use strict';



const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');


const WebUploader = require('common:widget/lib/webuploader/webuploader.js');

let id = 0;
function uuid( prefix ){
    return ( prefix || 'r-uploader-id-') + id++;
}

function noop(){}

class RUploader extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            //是否正在上传中
            isUploading : false,
            pickerId : uuid('picker')
        };

        this.upload = this.upload.bind( this );
    }

    componentDidMount(){

        let searchConf = utils.getSearchConf();

        this.uploader = WebUploader.create({
            server : this.props.server,
            pick : '#' + this.state.pickerId,
            formData : {
                channelId : searchConf.channelId,
                parentDir : this.props.parentDir
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        this.uploader.on('uploadSuccess', ( file ) => {
            console.log( file );
        });
    }

    upload(){
        if( this.state.isUploading ){
            return;
        }

        this.uploader.upload();

        this.state.isUploading = true;

        this.setState({
            isUploading : true
        });
    }

    render(){

        let state = this.state;

        let uploadText = '开始上传';
        if( state.isUploading ){
            uploadText = '上传中...';
        }

        return (
            <div className="r-uploader">
                <div className="btns">
                    <span id={ state.pickerId } className="file-choose-btn ">选择文件</span>
                    <button onClick={ this.upload } className="file-choose-btn btn btn-info">{ uploadText }</button>
                </div>
            </div>
        );
    }
}

RUploader.defaultProps = {

    server : '/cms/dash/resource/upload',
    parentDir : '',
    onSuccess : noop,
    onFail : noop
};


module.exports = RUploader;