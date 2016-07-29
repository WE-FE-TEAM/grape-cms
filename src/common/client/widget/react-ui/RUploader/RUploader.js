/**
 * 就 web uploader 封装的 react 组件
 * Created by jess on 16/6/21.
 */



'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');

const RForm = require('common:widget/react-ui/RForm/RForm.js');


const WebUploader = require('common:widget/lib/webuploader/webuploader.js');


const Checkbox = RForm.Checkbox;

let id = 0;
function uuid(prefix) {
    return ( prefix || 'r-uploader-id-') + id++;
}

function noop() {
}

class RUploader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            //当前上传的文件数
            fileCount: 0,
            //当前所有选中的文件
            files : [],
            //上传出错的信息
            errorInfo : [],
            //是否正在上传中
            isUploading: false,
            pickerId: uuid('r-uploader-picker-'),
            //是否覆盖已有的同名文件
            isOverride: false
        };

        this.onOverrideChange = this.onOverrideChange.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.resetUploader = this.resetUploader.bind(this);
        this.uploadBeforeSend = this.uploadBeforeSend.bind(this);
        this.upload = this.upload.bind(this);
        this.onFileQueued = this.onFileQueued.bind(this);
        this.uploadAccept = this.uploadAccept.bind(this);
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
        this.onUploadError = this.onUploadError.bind(this);
    }

    componentDidMount() {

        let searchConf = utils.getSearchConf();

        this.uploader = WebUploader.create({
            server: this.props.server,
            pick: '#' + this.state.pickerId,
            formData: {
                channelId: searchConf.channelId,
                parentDir: this.props.parentDir
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

        this.uploader.on('uploadBeforeSend', this.uploadBeforeSend);

        this.uploader.on('fileQueued', this.onFileQueued);
        // this.uploader.on('uploadAccept', this.uploadAccept);

        this.uploader.on('uploadSuccess', this.onUploadSuccess);
        this.uploader.on('uploadError', this.onUploadError);
    }

    componentWillUnmount() {

        this.uploader.off('uploadBeforeSend', this.uploadBeforeSend);
        this.uploader.off('fileQueued', this.onFileQueued);
        this.uploader.off('uploadSuccess', this.onUploadSuccess);
        this.uploader.off('uploadError', this.onUploadError);
        this.uploader.destroy();
        this.uploader = null;
    }

    resetUploader() {
        this.uploader.stop(true);
        this.uploader.reset();

        this.setState({
            files : [],
            errorInfo : [],
            isUploading: false
        });
    }

    uploadBeforeSend(obj, formData, headers) {
        formData = formData || {};

        //加入是否强制覆盖的选项
        if (this.state.isOverride) {
            formData.isOverride = '1';
        }

        headers = headers || {};
        headers['x-grape-res-expect'] = 'json';

    }

    //开始上传 或  停止当前上传
    upload(file) {
        console.log("is uploading" + this.state.isUploading + file.toString());
        if (this.state.isUploading) {
            this.uploader.stop(true);
            this.uploader.reset();
            this.setState({
                isUploading: false
            });
            return;
        }


        this.state.isUploading = true;
        this.setState({
            isUploading: true,
            errorInfo : []
        }, () => {
            this.uploader.upload();
        });
    }

    removeFile() {

    }

    onFileQueued(file) {

        console.log('file queued', file);

        this.state.files.push(file);

        this.setState({
            files : this.state.files
        });

    }

    uploadAccept(file, response) {
        if (response.status !== 0) {
            return false;
        }
    }

    onUploadSuccess(file, response) {
        console.log('onUploadSuccess', file);
        let status = response.status;
        let newState = {

        };
        let errorInfo = this.state.errorInfo;
        let stat = this.uploader.getStats();
        if (status === 0) {
            //上传成功
        } else if (status === 2) {
            //存在同名文件, 需要让用户勾选覆盖已有文件
            errorInfo.push(`[${file.name}] 已经存在同名文件, 如果要覆盖, 请勾选 覆盖提示框 !!`);
        } else {
            errorInfo.push( response.message);
        }
        if( stat.queueNum === 0 && stat.progressNum === 0 ){
            //全部图片都已上传完毕
            alert('全部图片上传完毕!!');
            newState.isUploading = false;
            newState.files = [];
            this.uploader.reset();
            this.props.onSuccess(file);
        }
        newState.errorInfo = errorInfo;
        this.setState(newState);
    }

    onUploadError(file) {
        this.setState({
            isUploading: false
        });
        this.props.onError(file);
    }

    onOverrideChange(checked) {
        this.setState({
            isOverride: checked
        });
    }

    render() {
        let state = this.state;
        let uploadText = '开始上传';
        if (state.isUploading) {
            uploadText = '停止上传';
        }
        // if( file ){
        //     fileInfo = (
        //         <div className="file-info">
        //             <span>文件名: { file.name }</span>
        //         </div>
        //     );
        // }

        let queuedFiles = state.files || [];
        let queuedInfoList = queuedFiles.map( ( file, index ) => {
            return (
                <li key={ file.name + index } className="file-info">
                    <span className="file-name">{ file.name }</span>
                </li>
            );
        });

        //错误消息列表
        let errorInfo = state.errorInfo || [];
        let errorList = errorInfo.map( ( info, index) => {
            return (
                <li key={ 'error-' + index } className="error-item">
                    { info }
                </li>
            );
        });

        let errorContainer = null;
        if( errorList.length > 0 ){
            errorContainer = (
                <ul className="error-list">{ errorList }</ul>
            );
        }else{
            errorContainer = (
                <div className="info error-list">无</div>
            );
        }

        let overrideCheckProps = {
            name: 'isOverride',
            ref: 'isOverride',
            checked: state.isOverride,
            label: '覆盖已有的同名文件',
            onChange: this.onOverrideChange
        };

        return (
            <div className="r-uploader">

                <div>本次共选择了{ queuedFiles.length }个文件</div>
                <ul className="queued-file-list">
                    { queuedInfoList }
                </ul>
                <div className="btns">
                    <span id={ state.pickerId } className="file-choose-btn btn">选择文件</span>
                    <button onClick={ this.upload } className=" btn btn-info">{ uploadText }</button>
                    <button onClick={ this.resetUploader } className="file-reset-btn btn btn-warning">重置</button>
                    <span>
                        <Checkbox { ...overrideCheckProps } />
                    </span>
                </div>
                <dl className="error-info-wrap">
                    <dt className="error-title">错误信息:</dt>
                    <dd className="error-detail-section">
                        { errorContainer }
                    </dd>
                </dl>
            </div>
        );
    }
}

RUploader.defaultProps = {

    server: '/cms/dash/resource/upload',
    parentDir: '',
    onSuccess: noop,
    onError: noop
};


module.exports = RUploader;