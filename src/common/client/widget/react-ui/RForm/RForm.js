/**
 * 封装 form 表单,提供校验功能
 * Created by jess on 15/11/25.
 */


var React  = require('react');

var TextInput = require('./TextInput/TextInput.js');
var Checkbox = require('./Checkbox/Checkbox.js');
var Select = require('./Select/Select.js');
var Textarea = require('./Textarea/Textarea.js');
var RichEditor = require('./RichEditor/RichEditor.js');
var ValidateProvider = require('./ValidateProvider/ValidateProvider.js');


function noop(){}

var RForm = React.createClass({

    getDefaultProps : function(){
        return {

            action : '',
            method : 'get',
            className : '',
            id : '',
            //提交表单,已经通过了全部校验
            onSubmit : noop,
            //主动校验结束
            onValidateEnd : noop
        };
    },

    fields : {},

    fieldMsg : {},

    componentDidMount : function(){

    },

    childContextTypes : {
        form : React.PropTypes.object
    },

    getChildContext : function(){
        return {
            form : {
                ref : this,
                addField : this.addField,
                removeField : this.removeField
            }
        };
    },

    addField : function( name, field ){
        if( this.fields[name] ){
            //已经存在同名的field
            console.warn('field[' + name + '] 已经注册过同名的', field );
        }
        this.fields[name] = field;
    },

    removeField : function( name ){
        delete this.fields[name];
    },

    handleSubmit : function(e){
        e.preventDefault();
        //
        var isValid = this.validateAll();

        if( ! isValid ){
            return;
        }

        this.props.onSubmit( e, this );
    },

    //主动调用全部field的validate方法
    validateAll : function(){
        var fields = this.fields;
        var fieldMsg = this.fieldMsg;
        var isValid = true;

        for( var name in fields ){
            if( fields.hasOwnProperty(name) ){
                var component = fields[name];
                var out = component.validate();
                if( out.length > 0 ){
                    fieldMsg[name] = out[0];
                    isValid = false;
                }
            }
        }

        return isValid;
    },

    //
    getElement : function(){
        return this.refs.form;
    },

    //根据组件name来获取对应的错误消息
    getInputError : function( name ){
        return this.fieldMsg[name] || '';
    },

    render : function(){

        let { action, method, className, id } = this.props;

        className += ' rui-form';

        let formProps = {
            action : action,
            method : method,
            className : className,
            id : id
        };

        return (
            <form {...formProps} ref="form" onSubmit={this.handleSubmit}>
                {this.props.children}
            </form>
        );
    }

});


//对外暴露,都放在 RForm 下
RForm.TextInput = TextInput;
RForm.Checkbox = Checkbox;
RForm.Select = Select;
RForm.Textarea = Textarea;
RForm.RichEditor = RichEditor;
RForm.ValidateProvider = ValidateProvider;


module.exports = RForm;