/*自定义的checkbox组件*/


var React = require('react');
var ReactDOM = require('react-dom');

var ValidateProvider = require('../ValidateProvider/ValidateProvider.js');


function noop(){}


var id = 0;

function guid(){
    return 'rui-checkbox-auto-id-' + id++;
}


const CONTAINER_ERROR_CLASS = 'rui-form-checkbox-error';
const ERROR_INFO_CLASS = 'rui-form-error-info';

var RCheckbox = React.createClass({

    contextTypes : {
        form : React.PropTypes.object
    },

    getDefaultProps : function(){
        return {
            validate : {
                change : []
            },
            validateProvider : null,
            isShowError : true,
            checked : false,
            name : '',
            label : '',
            id : '',
            className : '',
            onChange : noop,
            onValidateEnd : noop
        };
    },

    getInitialState : function(){

        var props = this.props;

        var provider = props.validateProvider || ValidateProvider.getInstance();

        return {
            validateProvider : provider,
            id : this.props.id || guid(),
            checked : this.props.checked,
            invalidMessageList : []
        };
    },

    componentWillReceiveProps : function(nextProps){
        //this.setState({
        //    checked : nextProps.checked
        //});
    },

    componentDidMount : function(){
        this.componentDidUpdate();
        if( ! this.props.name ){
            throw new Error('TextInput 必须包含 name 属性(props)');
        }
        if( this.context.form ){
            this.context.form.addField( this.props.name, this );
        }

    },

    componentWillUnmount : function(){
        if( this.context.form ){
            this.context.form.removeField( this.props.name, this );
        }

    },

    componentDidUpdate : function(){
        this.refs.input.checked = this.state.checked;
    },

    isChecked : function(){
        return this.state.checked;
    },

    getName : function(){
        return this.props.name;
    },

    _doValidate : function(){
        let ruleArray = this.props.validate.change;
        if( ! ruleArray ){
            return this.state.invalidMessageList;
        }

        let provider = this.state.validateProvider;
        let newMessageList = [];
        let value = this.refs.input.checked;

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

    validate : function(){
        var list = this._doValidate(  );
        this.setState({
            invalidMessageList : list
        });

        return list;
    },

    handleClick : function(){
        var isChecked = ! this.state.checked;
        this.setState({
            checked : isChecked
        }, () => {

            var list = this._doValidate(  );

            this.setState({
                invalidMessageList : list
            });

            this.props.onValidateEnd( this.props.name, list );

            this.props.onChange( isChecked, this );
        });


    },

    render : function(){
        var state = this.state;
        var props = this.props;

        let { errorClass } = this.props;
        let { invalidMessageList }  = this.state;

        var outerClass = 'rui-form-checkbox ' + props.className;
        if( state.checked ){
            outerClass += ' rui-form-checkbox-checked';
        }

        var label = null;
        if( props.label ){
            label = <span className="rui-checkbox-label">{props.label}</span>;
        }

        let errorTip = null;
        if( invalidMessageList.length > 0 ){
            outerClass += ' ' + CONTAINER_ERROR_CLASS + ' ' + errorClass;

            if( this.props.isShowError ){
                let tipErrorClass = ERROR_INFO_CLASS;
                errorTip = <span className={tipErrorClass}>{ invalidMessageList[0] }</span>;
            }
        }

        return (
                <span className={outerClass}>
                    <span className="checkbox-holder" onClick={this.handleClick}>
                        <input style={ {display:'none'} } ref="input" type="checkbox" name={props.name} />
                        {label}
                    </span>
                    {this.props.children}
                    {errorTip}
                </span>
            );
    }

});


module.exports = RCheckbox;



