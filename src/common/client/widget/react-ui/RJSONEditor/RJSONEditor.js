/**
 * 将 jsoneditor 封装成 react 的组件
 * Created by jess on 16/7/4.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const JSONEditor = require('jsoneditor');

class RJSONEditor extends React.Component{

    constructor(props){
        super(props);

        let data = props.data || '{}';
        if( typeof data === 'string' ){
            try{
                data = JSON.parse( data );
            }catch(e){
                data = {};
            }
        }

        this.state = {
            data : data,
            editMode : ( props.readonly ? 'view' : 'code')
        };

        this.lastEditor = null;

        this.toCode = this.toCode.bind( this );
        this.toTree = this.toTree.bind( this );

        this.toggleEditMode = this.toggleEditMode.bind( this );

    }

    componentDidMount(){

        this.codeEditor = new JSONEditor( this.refs.codeEditor, {
            mode : 'code',
            onChange : () =>{
                this.lastEditor = this.codeEditor;
            }
        });

        // this.treeEditor = new JSONEditor( this.refs.treeEditor, {
        //     mode : 'tree',
        //     onChange : () => {
        //         this.lastEditor = this.treeEditor;
        //     }
        // } );

        this.lastEditor = this.codeEditor;

        this.codeEditor.set( this.state.data );
        // this.treeEditor.set( this.state.data );

        this.updateMode( this.props.readonly === true );
    }

    componentDidUpdate(prevProps, prevState){
        // let state = this.state;
        // if( state.editMode !== prevState.editMode ){
        //     this.codeEditor.setMode( this.state.editMode );
        // }
        this.codeEditor.setMode( this.state.editMode );
    }

    onValueChange( value ){
        this.setState( {
            data : value
        });
    }

    updateMode( isReadOnly ){
        let codeEditorMode = isReadOnly ? 'view' : 'code';
        let treeEditorMode = isReadOnly ? 'view' : 'tree';
        this.codeEditor.setMode( codeEditorMode );
        // this.treeEditor.setMode( treeEditorMode );
    }

    toTree(){
        let data = this.codeEditor.get();
        this.treeEditor.set( data );
        this.onValueChange( data );
    }

    toCode(){
        let data = this.treeEditor.get();
        this.codeEditor.set( data );
        this.onValueChange( data );
    }

    toggleEditMode(){

        let newMode = 'view';

        if( ! this.props.readonly ){
            newMode = this.state.editMode === 'code' ? 'tree' : 'code';
            this.setState({
                editMode : newMode
            });
        }
    }

    getValue(){
        return this.lastEditor.get();
    }

    render(){

        let state = this.state;
        let props = this.props;

        // <div className="split-con">
        //     <div>
        //         <div onClick={ this.toTree } ref="toTree" className="convert to-tree-btn" title="同步JSON到图形界面">
        //             <div className="convert-right">&gt;</div>
        //         </div>
        //     </div>
        //     <div>
        //         <div onClick={ this.toCode } ref="toCode" className="convert to-code-btn" title="同步JSON到源码编辑界面">
        //             <div className="convert-left">&lt;</div>
        //         </div>
        //     </div>
        // </div>
        // <div className="tree-editor json-editor" ref="treeEditor"></div>
        
        let toggleBtn = null;
        if( ! props.readonly ){
            let toggleText = '切换到图形界面编辑';
            if( state.editMode === 'tree' ){
                toggleText = '切换到源码编辑';
            }
            toggleBtn = (
                <div className="op-btns">
                    <span className="btn btn-primary" onClick={ this.toggleEditMode }>{ toggleText }</span>
                </div>
            );
        }

        return (
            <div className="r-json-editor clearfix">
                { toggleBtn }
                <div className="code-editor json-editor" ref="codeEditor"></div>
            </div>
        );
    }
}


RJSONEditor.defaultProps = {

    readonly : false

};


module.exports = RJSONEditor;