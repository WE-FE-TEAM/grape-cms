/**
 * 允许 ueditor 设置 p 标签整个背景色的 自定义按钮
 * Created by jess on 16/6/29.
 */


UE.commands['paragraph-bg-color'] = {
    execCommand: function (cmdName, value) {

        var domUtils = UE.dom.domUtils;

        var style = 'background-color';

        value = value || (this.queryCommandState(cmdName) ? 'none' : cmdName == 'underline' ? 'underline' :
                cmdName == 'fontborder' ? '1px solid #000' :
                    'line-through');
        var me = this,
            range = this.selection.getRange(),
            text;

        var paragraph = domUtils.findParentByTagName(range.startContainer, 'p', true);

        if( paragraph ){
            paragraph.style.backgroundColor = value;
        }else{
            alert('当前选中部分,不属于任何段落!');
        }

        return true;
    },
    queryCommandValue: function (cmdName) {

        var domUtils = UE.dom.domUtils;

        var style = 'background-color';

        var startNode = this.selection.getStart();

        var paragraph = domUtils.findParentByTagName(startNode, 'p', true);


        return  domUtils.getComputedStyle(paragraph, style);
    },
    queryCommandState: function (cmdName) {
        // if (!needCmd[cmdName])
        //     return 0;
        // var val = this.queryCommandValue(cmdName);
        // if (cmdName == 'fontborder') {
        //     return /1px/.test(val) && /solid/.test(val)
        // } else {
        //     return  cmdName == 'underline' ? /underline/.test(val) : /line\-through/.test(val);
        //
        // }

    }
};


UE.registerUI('paragraph-bg-color',function(editor,uiName){
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    // editor.registerCommand(uiName,{
    //     execCommand:function(){
    //         alert('execCommand:' + uiName)
    //     }
    // });

    var cmd = 'paragraph-bg-color';

    //创建一个button
    // var btn = new UE.ui.Button({
    //     //按钮的名字
    //     name:uiName,
    //     //提示
    //     title:'设置整个段落的背景色',
    //     //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
    //     cssRules :'background-position: -500px 0;',
    //     //点击时执行的命令
    //     onclick:function () {
    //         //这里可以不用执行命令,做你自己的操作也可
    //         // editor.execCommand(uiName);
    //
    //         editor.execCommand( 'inserthtml', '<p data-tag="we-product-sug" title="输入要推荐的产品列表"></p>');
    //     }
    // });

    var btn = new UE.ui.ColorButton({
        className:'edui-for-' + uiName,
        color:'default',
        title: '设置整个段落的背景色',
        editor:editor,
        onpickcolor:function (t, color) {
            editor.execCommand(cmd, color);
        },
        onpicknocolor:function () {
            editor.execCommand(cmd, 'default');
            this.setColor('transparent');
            this.color = 'default';
        },
        onbuttonclick:function () {
            editor.execCommand(cmd, this.color);
        }
    });

    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });

    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);