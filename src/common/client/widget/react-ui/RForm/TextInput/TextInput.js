/**
 * 处理单行文本输入框
 * Created by jess on 15/11/25.
 */


var React = require('react');
var ValidateProvider = require('../ValidateProvider/ValidateProvider.js');

var constant = require('../constant.js');

function noop(){}


//校验的两个时机, 用户输入中
const VALIDATE_KEYUP = 'keyup';
//输入框失去焦点
const VALIDATE_BLUR = 'blur';

const CONTAINER_CLASS = 'rui-form-text-container';
const INPUT_CLASS = 'rui-form-input';
const CONTAINER_ERROR_CLASS = 'rui-form-text-error';

const INPUT_WRAP_CLASS = constant.INPUT_WRAP_CLASS;
const PLACEHOLDER_CLASS = constant.PLACEHOLDER_CLASS;
const ERROR_INFO_CLASS = constant.ERROR_INFO_CLASS;

var TextInput = React.createClass({

    contextTypes : {
        form : React.PropTypes.object
    },

    propTypes : {
        type : React.PropTypes.oneOf(['text', 'password'])
    },

    getDefaultProps : function(){
        return {
            type : 'text',
            validate : {
                keyup : [],
                blur : []
            },
            validateProvider : null,
            isShowError : true,
            className : '',
            id : '',
            name : '',
            errorClass : '',
            placeholder : '',
            value : '',
            onValidateEnd : noop
        };
    },

    getInitialState : function() {

        var props = this.props;

        var provider = props.validateProvider || ValidateProvider.getInstance();

        var isShowPlaceholder = ! props.value;

        return {
            validateProvider : provider,
            value : props.value,
            invalidMessageList : [],
            //是否显示placeholder
            isShowPlaceholder : isShowPlaceholder
        };
    },

    componentDidMount : function(){
        if( ! this.props.name ){
            throw new Error('TextInput 必须包含 name 属性(props)');
        }
        this.context.form.addField( this.props.name, this );
        this.state.validateProvider.registerComponent( this );
    },

    componentWillUnmount : function(){
        this.context.form.removeField( this.props.name, this );
        this.state.validateProvider.unregisterComponent( this );
    },

    //是否全部校验通过
    isValid : function(){
        return this.state.invalidMessageList.length < 1;
    },

    getName : function(){
        return this.props.name;
    },


    _doValidate : function( phase ){
        phase = phase || VALIDATE_BLUR;

        let ruleArray = this.props.validate[phase];
        if( ! ruleArray ){
            return this.state.invalidMessageList;
        }

        let provider = this.state.validateProvider;
        let newMessageList = [];
        let value = this.refs.input.value;

        for( var i = 0, len = ruleArray.length; i < len; i++ ){
            var obj = ruleArray[i];
            var temp = null;
            if( typeof obj === 'function' ){
                //直接调函数
                temp = obj( value, this );
            }else if( typeof obj === 'string' ){
                //调用 validateProvider 上的方法
                temp = provider.validate( value, this, {
                    fn : obj,
                    message : obj
                } );

            }else if( obj && typeof obj === 'object' ){
                //复杂的校验配置,需要调用 provider 的通用方法处理
                temp = provider.validate( value, this, obj );
            }else{
                throw new Error('TextInput[' + this.props.name + ']上有未知的校验规则:' + obj);
            }
            if( temp ){
                newMessageList.push( temp );
                break;
            }
        }

        return newMessageList;

    },

    //validateProvider 中的异步校验完成
    asyncValidateFinish : function( value, message ){
        if( value === this.state.value ){
            var list = [];
            if( message ){
                list.push( message );
            }
            this.setState({
                invalidMessageList : list
            });
        }
    },

    handleFocus : function(e){
        this.setState({
            isShowPlaceholder : false
        });
    },

    //keyup 时监听
    handleValueUpdate : function(e){
        var list = this._doValidate( VALIDATE_KEYUP );

        this.setState({
            invalidMessageList : list,
            value : this.refs.input.value
        });

        this.props.onValidateEnd( this.props.name, list );
    },

    handleBlur : function(e){
        var list = this._doValidate( VALIDATE_BLUR );
        var value = this.refs.input.value.trim();
        var isShowPlaceholder = value === '';


        this.setState({
            invalidMessageList : list,
            isShowPlaceholder : isShowPlaceholder
        });

        this.props.onValidateEnd( this.props.name, list );
    },

    //form 主动调用validate 方法
    validate : function( phase ){
        phase = phase || VALIDATE_BLUR;
        var list = this._doValidate( phase );
        this.setState({
            invalidMessageList : list
        });

        return list;
    },

    handlePlaceholderClick : function(){
        this.refs.input.focus();
        this.setState({
            isShowPlaceholder : false
        });
    },

    //是否浏览器原生支持 placeholder
    isSupportPlaceholder : function(){
        return false;
    },

    //渲染 placeholder
    renderPlaceholder : function(){
        if( this.props.placeholder && ! this.isSupportPlaceholder() ){

            let style = {};

            if( this.state.isShowPlaceholder ){
                style.display = 'block';
            }else{
                style.display = 'none';
            }

            return <div style={style} onClick={this.handlePlaceholderClick} className={PLACEHOLDER_CLASS}>{this.props.placeholder}</div>;
        }

        return null;
    },

    getValue : function(){
        return this.state.value;
    },

    render : function(){

        let placeholder = this.renderPlaceholder();

        let {  type, className, id, name, errorClass, readonly } = this.props;

        let { value, invalidMessageList } = this.state;

        let containerProps = {
            className : className + ' ' + CONTAINER_CLASS
        };

        let inputProps = {
            autoComplete : 'off',
            type : type,
            id : id,
            name : name,
            value : value,
            className : INPUT_CLASS
        };

        if( readonly ){
            inputProps.readOnly = 'readOnly';
        }

        let errorTip = null;
        if( invalidMessageList.length > 0 ){
            containerProps.className += ' ' + CONTAINER_ERROR_CLASS + ' ' + errorClass;

            if( this.props.isShowError ){
                let tipErrorClass = ERROR_INFO_CLASS;
                errorTip = <div className={tipErrorClass}>{ invalidMessageList[0] }</div>;
            }
        }

        return (
            <div {...containerProps}>
                <div className={INPUT_WRAP_CLASS}>
                    <input {...inputProps} ref="input" onFocus={this.handleFocus} onChange={this.handleValueUpdate} onBlur={this.handleBlur} />
                    {placeholder}
                </div>
                {errorTip}
                {this.props.children}
            </div>
        );
    }

});


module.exports = TextInput;