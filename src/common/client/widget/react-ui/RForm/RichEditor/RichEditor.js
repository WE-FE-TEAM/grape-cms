/**
 * 将 ueditor 封装成 React 的组件
 * Created by jess on 16/6/17.
 */


'use strict';


var React = require('react');
var ReactDOM = require('react-dom');

var utils = require('common:widget/ui/utils/utils.js');

function noop(){}

var id = 0;
function uuid(){
    return 'rich-editor--' + ( i ++);
}

class RichEditor extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            value : props.value,
            id : props.id || uuid()
        };

        this.onChange = this.onChange.bind( this );
    }

    componentDidMount(){

        let searchConf = utils.getSearchConf();

        let channelId = searchConf.channelId || '';

        // let script = ReactDOM.findDOMNode( this.refs.ueditorscript );

        this.editor = UE.getEditor( this.state.id, {
            serverUrl: '/cms/dash/ueditor/index?channelId=' + encodeURIComponent(channelId),
            readonly : this.props.readonly === true
        } );

        this.editor.addListener('contentChange', this.onChange );

        this.editor.addListener('ready', () => {
            this.updateEditor();
        });

    }

    componentWillUnmount(){

        this.editor.removeListener('contentChange', this.onChange );
        this.editor.destroy();
        this.editor = null;
    }

    // componentWillReceiveProps( nextProps ){
    //     if( nextProps.value !== this.state.value ){
    //         this.setState({
    //             value : nextProps.value
    //         });
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState){
        // return nextState.value !== this.state.value;
        return false;
    }

    componentDidUpdate(){
        this.updateEditor();
    }

    onChange( eventType ){

        let editor = this.editor;

        if( eventType === 'contentchange'){
            //内容修改
            let value = editor.getContent();
            if( value !== this.state.value ){
                this.setState({
                    value : value
                });
                this.props.onChange( value, this );
            }
        }

    }


    updateEditor(){
        this.editor.setContent( this.state.value );
    }

    getValue(){
        return this.editor.getContent();
    }


    render(){

        let state = this.state;
        let props = this.props;

        let className = 'r-rich-editor ' + ( props.className || '' );

        let containerProps = {

            className : className,
            ref : 'container'
        };

        let editorProps = {
            id : state.id,
            name : props.name,
            ref : 'ueditorscript'
        };

        return (
            <div {...containerProps}>
                <script { ...editorProps }></script>
            </div>
        );
    }
}


RichEditor.defaultProps = {

    readonly : false,
    value : '',
    className : '',
    id : '',
    name : '',
    onChange : noop
};



module.exports = RichEditor;