/**
 * 栏目类型 的下拉框
 * Created by jess on 16/6/13.
 */


'use strict';


const React = require('react');

const RForm = require('common:widget/react-ui/RForm/RForm.js');

const Select = RForm.Select;


function noop(){}

const types = [
    {
        text : '容器栏目',
        value : 'container'
    },
    {
        text : '文章栏目',
        value : 'article'
    },
    {
        text : '数据栏目',
        value : 'data'
    },
    {
        text : '文件上传栏目',
        value : 'resource'
    },
    {
        text : '栏目管理(系统级栏目, 不能添加!!)',
        value : 'channelManage'
    },
    {
        text : '角色管理(系统级栏目, 不能添加!!)',
        value : 'roleManage'
    },
    {
        text : '用户管理(系统级栏目, 不能添加!!)',
        value : 'userManage'
    }
];


class ChannelTypeSelect extends React.Component{


    constructor(props){

        super(props);

        this.state = {
            value : props.value
        };

        this.onOptionClick = this.onOptionClick.bind( this );
    }

    onOptionClick( value ){
        this.setState({
            value : value
        });
    }

    getValue(){
        return this.state.value;
    }

    render(){

        let props = this.props;
        let state = this.state;

        return (
            <Select name="channelType" 
                    data={ types } 
                    value={ state.value } 
                    maxHeight={ props.maxHeight } 
                    onOptionClick={ this.onOptionClick } 
                    className="channel-type-select"
            />
        );
    }
}


ChannelTypeSelect.defaultProps = {
    value : types[0].value,
    maxHeight : 200,
    onOptionClick : noop
};


module.exports = ChannelTypeSelect;