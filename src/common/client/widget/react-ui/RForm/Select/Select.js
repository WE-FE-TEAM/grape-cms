/**
 * 基于 React 封装的 下拉框
 * Created by jess on 16/5/30.
 */


var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('common:widget/lib/jquery/jquery.js');


function noop(){}


const OPTION_CLASS = 'r-select-option';
const OPTION_SELECTED_CLASS = 'r-select-option-selected';


var Select = React.createClass({

    contextTypes : {
        form : React.PropTypes.object
    },

    getDefaultProps : function(){

        return {
            data : [],
            validate : {
                change : []
            },
            //下拉框的最大高度, 超出这个高度,出现滚动条
            maxHeight : 'auto',
            value : '',
            name : '',
            className : '',
            onOptionClick : noop
        };
    },

    getInitialState : function(){

        return {

            //当前是否显示下拉框
            optionVisible : false,
            //校验失败的错误信息数组
            invalidMessageList : []
        };
    },

    componentDidMount : function(){

        if( ! this.props.name ){
            throw new Error('Select 必须包含 name 属性(props)');
        }
        this.context.form.addField( this.props.name, this );

        this.container = ReactDOM.findDOMNode( this );

        $(document).on('click', this.onBodyClick );
    },

    componentWillUnmount : function(){
        this.context.form.removeField( this.props.name, this );
        $(document).off('click', this.onBodyClick );
    },

    onBodyClick : function(e){
        var target = e.target;
        if( ! $.contains( this.container, target ) ){
            //点击事件不在当前组件内部
            this.setState({
                optionVisible : false
            });
        }
    },

    onOptionClick : function(e){

        var target = e.currentTarget;
        var className = target.className || '';
        if( className.indexOf( OPTION_SELECTED_CLASS ) >= 0 ){
            //当前option已处于选中状态

        }else{
            var text = target.getAttribute('data-text');
            var value = target.getAttribute('data-value');
            this.props.onOptionClick( value, text );
        }

        this.setState({
            optionVisible : false
        });
    },

    toggleOptionList : function(){
        this.setState({
            optionVisible : ! this.state.optionVisible
        });
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
        let value = this.props.value;

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
                throw new Error('Select[' + this.props.name + ']上有未知的校验规则:' + obj);
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


    render(){

        let props = this.props;
        let state = this.state;

        let value = props.value;
        let currentText = '';

        let options = null;

        let data = props.data || [];

        if( data && data.length > 0 ){
            options = data.map( ( obj, i) => {

                let className = OPTION_CLASS + ' ';

                let text = obj;
                let valueTemp = text;
                if( typeof obj !== 'string' ){
                    text = obj.text;
                    valueTemp = obj.value;
                }

                if( valueTemp === value && ! currentText ){
                    currentText = text;
                    className += ' ' + OPTION_SELECTED_CLASS;
                }

                return (
                    <li className={ className } key={i} data-value={ valueTemp } data-text={ text } onClick={ this.onOptionClick }>
                        <span className="r-select-option-text">{ text }</span>
                    </li>
                );

            });
        }

        let optionListContainer = null;
        if( options && options.length > 0 ){

            var optionContainerStyle = {
                maxHeight : props.maxHeight,
                overflow : 'auto'
            };

            optionListContainer = (
                <ul className="border-box r-select-list-container" style={ optionContainerStyle }>
                    { options }
                </ul>
            );
        }


        let containerClass = 'r-select ' + ( props.className || '') ;

        //控制是否显示下拉框
        if( state.optionVisible ){
            containerClass += ' r-select-option-showing ';
        }else{
            containerClass += ' r-select-option-hidden ';
        }

        return (
            <div className={ containerClass }>
                <input type="hidden" name={ props.name } value={ props.value } />
                <div className="border-box r-select-indicator" onClick={ this.toggleOptionList }>
                    <span className="r-select-current-text">{ currentText }</span>
                    <span className="arrow">
                        <i className="icon-down3 glyphicon glyphicon-triangle-bottom"></i>
                    </span>
                </div>
                { optionListContainer }
            </div>
        );

    }

});



module.exports = Select;