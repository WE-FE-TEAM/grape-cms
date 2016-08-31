/**
 *
 * Created by jess on 16/8/18.
 */


'use strict';


const InputEditor = require('designer:widget/style-item-edit/supported-editors/input-editor/input-editor.js');
const MarginEditor = require('designer:widget/style-item-edit/supported-editors/margin-editor/margin-editor.js');
const PaddingEditor = require('designer:widget/style-item-edit/supported-editors/padding-editor/padding-editor.js');
const BackgroundEditor = require('designer:widget/style-item-edit/supported-editors/background-editor/background-editor.js');



const styleKey2EditorClass = {
    width : InputEditor,
    height : InputEditor,
    margin : MarginEditor,
    padding : PaddingEditor,
    background : BackgroundEditor
};

const styleKeyLabel = {
    width : '宽度',
    height : '高度',
    background : '背景',
    'borderRadius' : '圆角'
};

let singleton = {};


module.exports = singleton;

//获取某个属性对应的中文名
singleton.getStyleLabel = function( styleName ){
    return styleKeyLabel[styleName] || styleName;
};

//获取某个样式属性对应的编辑器类
singleton.getEditorClassForStyleKey = function(key){
    return styleKey2EditorClass[key] || InputEditor;
};



