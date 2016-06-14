/**
 * 基于react实现的简单树形结构
 * Created by jess on 16/6/13.
 */


'use strict';


const React = require('react');
const ReactDOM = require('react-dom');


//节点class
const NODE_CLASS = 'r-tree-node';
const NODE_HAS_SUB_TREE = 'r-tree-has-sub';
//子树收起的class
const SUB_TREE_COLLAPSE = 'r-tree-sub-collapse';


class TreeNode extends React.Component{

    constructor(props){

        super(props);

        let subKey = props.childrenKey;
        let data = props.data || {};
        let children = data[subKey] || [];

        let hasChild = false;

        if( children.length > 0 ){
            hasChild = true;
        }

        this.state = {
            //是否有子树
            hasChild : hasChild,
            //如果有子树,默认收起
            collapsed : props.collapsed !== false
        };

        this.toggleSubTree = this.toggleSubTree.bind( this );
    }

    //渲染该节点下的子树
    renderSubTree( arr ){
        if( ! arr || arr.length < 1 ){
            return null;
        }

        let props = this.props;

        let list = arr.map( ( obj, index ) => {
            let key = index;
            return (
                <TreeNode key={ key } childrenKey={ props.childrenKey }  data={ obj } className={ props.className } nodeLabelRenderer={ props.nodeLabelRenderer } />
            );
        });

        return (
            <ul className="r-tree-sub-list">
                { list }
            </ul>
        );
    }

    toggleSubTree(e){

        if( this.state.hasChild ){
            this.setState({
                collapsed : ! this.state.collapsed
            });
        }
    }

    render(){

        let props = this.props;
        let data = props.data;

        if( ! data ){
            return null;
        }

        let className = NODE_CLASS + ( props.className || '' );

        let nodeLabel = props.nodeLabelRenderer( props.data, this.toggleSubTree );

        let subTree = null;
        let subKey = props.childrenKey;
        if( data[subKey] ){
            subTree = this.renderSubTree( data[subKey] );
            className += ' ' + NODE_HAS_SUB_TREE;

            if( this.state.collapsed ){
                className += ' ' + SUB_TREE_COLLAPSE;
            }
        }

        return (
            <li className={ className }>
                <div className="r-tree-node-label">{ nodeLabel }</div>
                { subTree }
            </li>
        );

    }
}

TreeNode.propTypes = {

    nodeLabelRenderer : React.PropTypes.func
};

TreeNode.defaultProps = {

    //子树 所在data中的 key
    childrenKey : 'sub'

};


class Tree extends React.Component{

    render(){
        
        let props = this.props;
        
        let className = 'r-tree ' + ( props.className || '' ); 

        return (
            <ul className={ className }>
                <TreeNode data={ props.data } childrenKey={ props.childrenKey } className={ props.nodeClassName } nodeLabelRenderer={ props.nodeLabelRenderer } />
            </ul>
        );
    }
}

Tree.propTypes = {

    nodeClassName : React.PropTypes.string,
    nodeLabelRenderer : React.PropTypes.func
};


Tree.defaultProps = {
    //子树 所在data中的 key
    childrenKey : 'sub'
};

module.exports = Tree;