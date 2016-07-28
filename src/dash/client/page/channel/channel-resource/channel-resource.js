/**
 * 文件上传栏目的入口JS
 * Created by jess on 16/6/21.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RUploader = require('common:widget/react-ui/RUploader/RUploader.js');

const FileList = require('dash:widget/ui/resource/file-list/file-list.js');

const resourceService = service.getService('resource');


class App extends React.Component{

    constructor(props){

        super(props);

        let searchConf = utils.getSearchConf();
        let dir = searchConf.path || '.';

        this.state = {
            channelId : searchConf.channelId,
            currentDir : dir,
            isLoading : false,
            fileList : null
        };
        
        this.addSubDirectory = this.addSubDirectory.bind( this );

        this.onDirectoryChange = this.onDirectoryChange.bind( this );
        this.onUploadSuccess = this.onUploadSuccess.bind( this );
    }

    componentDidMount(){
        this.refresh();
    }

    refresh(){
        if( this.state.isLoading ){
            return;
        }

        let data = {
            channelId : this.state.channelId,
            path : this.state.currentDir
        };

        resourceService.getDirectoryContent( data )
            .then( ( req ) => {
                if( req.requestStatus === resourceService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        return this.setState({
                            isLoading : false,
                            fileList : out.data.files
                        });
                    }
                    return Promise.reject( new Error(out.message ) );
                }
                return Promise.reject( new Error('请求文件列表失败'));
            })
            .catch( (e) => {
                alert( e.message );
                this.setState({
                    isLoading : false,
                    fileList : []
                });
            });

        this.state.isLoading = true;
        this.setState({
            isLoading : true
        });
    }

    onDirectoryChange( directory ){

        let data = utils.getSearchConf();
        data.path = directory.path;

        location.href = '/cms/dash/channel/view?' + utils.json2query( data );
    }

    onUploadSuccess(){
        this.refresh();
    }
    
    //创建子目录
    addSubDirectory(){

        if( this.state.isLoading ){
            return;
        }
        
        let dirName = ( this.refs.dirNameInput.value || '' );

        let data = {
            channelId : this.state.channelId,
            parentDir : this.state.currentDir,
            dirName : dirName
        };

        resourceService.mkdir( data )
            .then( ( req ) => {
                if( req.requestStatus === resourceService.STATUS.SUCCESS ){
                    let out = req.data;
                    if( out.status === 0 ){
                        this.refs.dirNameInput.value = '';
                        return this.setState({
                            isLoading : false
                        }, () => {
                            this.refresh();
                        });
                    }
                    return Promise.reject( new Error(out.message ) );
                }
                return Promise.reject( new Error('创建目录失败'));
            })
            .catch( (e) => {
                alert( e.message );
                this.setState({
                    isLoading : false
                });
            });

        this.state.isLoading = true;
        this.setState({
            isLoading : true
        });
    }
    
    //渲染创建子目录按钮区域
    renderMkdirSection(){

        return (
            <dl className="dir-create-con form-inline">
                <dt>创建子目录</dt>
                <dd>
                    <label htmlFor="dir-name-input">目录名</label>
                    <input ref="dirNameInput" className="form-control" type="text" id="dir-name-input" placeholder="输入要创建的新目录名, 不能包含空格!!"/>
                    <button onClick={ this.addSubDirectory } className="dir-add-btn btn btn-warning">创建目录</button>
                </dd>
            </dl>
        );
    }

    //渲染当前目录的路径层级
    renderDirectoryPath(){
        let currentDir = this.state.currentDir;

        if( currentDir.indexOf('./') !== 0 && currentDir !== '.' ){
            currentDir = './' + currentDir;
        }

        let searchConf = utils.getSearchConf();

        let dirArray = currentDir.split('/');

        let last = dirArray.length - 1;

        let pathArr = dirArray.map( ( dirName, index) => {

            let temp = dirArray.slice(0, index + 1);
            let path = temp.join('/');

            if( index > 0 ){
                path = path.replace(/^\.\//,'');
            }

            searchConf.path = path;

            let url = '/cms/dash/channel/view?' + utils.json2query( searchConf );

            if( index === 0 ){
                dirName = '栏目根目录';
            }

            return (
                <span key={ index } className="directory-item">
                    <a target="_self" href={ url }>{ dirName }</a>
                    /
                </span>
            );
        });

        return (
            <div className="dir-path-con">
                <span className="path-label">当前目录: </span>
                { pathArr }
            </div>
        );
    }

    render(){

        let state = this.state;

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }

        let parentDir = state.currentDir;
        
        let mkdirCon = this.renderMkdirSection();

        let directoryPath = this.renderDirectoryPath();

        let list = null;
        if( state.fileList ){
            list = <FileList fileList={ state.fileList } onDirectoryClick={ this.onDirectoryChange } />
        }

        return (
            <div className="resource-page">
                <h1>资源上传栏目</h1>
                { mkdirCon }
                <dl>
                    <dt>上传文件到本目录</dt>
                    <dd><RUploader parentDir={ parentDir } onSuccess={ this.onUploadSuccess } /></dd>
                </dl>
                { directoryPath }
                <div>
                    <h2>该目录下的文件列表</h2>
                    { list }
                </div>
                { indicator }
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


