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
            data : data
        };

        this.lastEditor = null;

        this.toCode = this.toCode.bind( this );
        this.toTree = this.toTree.bind( this );

    }

    componentDidMount(){

        this.codeEditor = new JSONEditor( this.refs.codeEditor, {
            mode : 'code',
            onChange : () =>{
                this.lastEditor = this.codeEditor;
            }
        });

        this.treeEditor = new JSONEditor( this.refs.treeEditor, {
            mode : 'tree',
            onChange : () => {
                this.lastEditor = this.treeEditor;
            }
        } );

        this.lastEditor = this.codeEditor;

        this.codeEditor.set( this.state.data );
        this.treeEditor.set( this.state.data );

    }

    onValueChange( value ){
        this.setState( {
            data : value
        });
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

    getValue(){
        return this.lastEditor.get();
    }

    render(){

        let state = this.state;
        let props = this.props;

        return (
            <div className="r-json-editor clearfix">
                <div className="code-editor json-editor" ref="codeEditor"></div>
                <div className="split-con">
                    <div>
                        <div onClick={ this.toTree } ref="toTree" className="convert to-tree-btn" title="同步JSON到图形界面">
                            <div className="convert-right">&gt;</div>
                        </div>
                    </div>
                    <div>
                        <div onClick={ this.toCode } ref="toCode" className="convert to-code-btn" title="同步JSON到源码编辑界面">
                            <div className="convert-left">&lt;</div>
                        </div>
                    </div>
                </div>
                <div className="tree-editor json-editor" ref="treeEditor"></div>
            </div>
        );
    }
}



module.exports = RJSONEditor;