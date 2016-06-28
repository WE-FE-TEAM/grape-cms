/**
 * 多行 输入框  textarea 的简单封装
 * Created by jess on 16/6/17.
 */


'use strict';


var React = require('react');
var ReactDOM = require('react-dom');


function noop() {
}


class Textarea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        };

        this.onChange = this.onChange.bind(this);
        // this.onBlur = this.onBlur.bind(this);
    }

    onChange(e) {
        this.setState({
            value: this.refs.input.value
        });
        let valu = this.refs.input.value.trim();
        console.log("value json"+valu);
        let json = JSON.parse(valu);
        $('#editor').jsonEditor(json, {change: this.updateJSON});
    }



    getValue() {
        return this.state.value;
    }

    render() {
        let props = this.props;
        let state = this.state;

        let containerProps = {
            className: 'r-textarea ' + ( props.className || '' )
        };


        let inputProps = {
            ref: 'input',
            name: props.name,
            value: state.value,
            placeholder: "请直接输入JSON数据",
            id: props.id,
            onChange: this.onChange,
            onBlur: this.onBlur
        };

        return (
            <div { ...containerProps }>
                <textarea { ...inputProps } />
            </div>
        );
    }
}
Textarea.defaultProps = {

    className: '',
    placeholder: '',
    id: '',
    name: '',
    value: '',
    onChange: noop
};

module.exports = Textarea;