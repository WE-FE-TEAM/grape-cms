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
        this.removeFile();
        this.setState({
            fileCount: 0,
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

        this.uploader.upload();
        this.state.isUploading = true;
        this.setState({
            isUploading: true
        });
    }

    removeFile() {
        $("#file-list").find('.info').remove();
    }

    onFileQueued(file) {
        let $list = $('#file-list');
        let $li = $(
            '<div class="info"><span class="fileName">' + file.name + '</span></div>'
        );
        $list.append($li);
        console.log('file queued', file);

        let mfileCount = this.state.fileCount;
        mfileCount++;
        this.setState({
            fileCount: mfileCount
        });
        console.log(mfileCount);
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
            isUploading: false
        };
        if (status === 0) {
            //上传成功
            console.log("上传成功");
            let stat = this.uploader.getStats();
            if (stat.successNum == this.state.fileCount) {
                alert('上传成功 :)' + "DDD" + stat.successNum);
                this.uploader.reset();
                this.removeFile();//删除list里的元素
                newState.file = null;
                this.props.onSuccess(file);
                this.setState({
                    fileCount: 0
                });
            }
        } else if (status === 2) {
            //存在同名文件, 需要让用户勾选覆盖已有文件
            alert(response.message + ' 如果覆盖, 请勾选 覆盖提示框');
        } else {
            alert("else" + response.message);
        }
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

        let overrideCheckProps = {
            name: 'isOverride',
            ref: 'isOverride',
            checked: state.isOverride,
            label: '覆盖已有的同名文件',
            onChange: this.onOverrideChange
        };

        return (
            <div className="r-uploader">
                <div id="file-list"></div>
                <div>本次共选择了{state.fileCount}个文件</div>
                <div className="btns">
                    <span id={ state.pickerId } className="file-choose-btn btn">选择文件</span>
                    <button onClick={ this.upload } className=" btn btn-info">{ uploadText }</button>
                    <button onClick={ this.resetUploader } className="file-reset-btn btn btn-warning">重置</button>
                    <span>
                        <Checkbox { ...overrideCheckProps } />
                    </span>
                </div>
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