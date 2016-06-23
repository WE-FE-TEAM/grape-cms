
const React = require('react');
const ReactDOM = require('react-dom');
const service = require('common:widget/ui/service/service-factory.js');

const utils = require('common:widget/ui/utils/utils.js');

const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');

const RForm = require('common:widget/react-ui/RForm/RForm.js');


require('common:widget/lib/jquery/jquery.jsoneditor.js');



const TextInput = RForm.TextInput;
const Textarea = RForm.Textarea;
const RichEditor = RForm.RichEditor;



const dataService = service.getService('data');

class DataEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            isLoading : false,
            errorMsg : ''
        };
        this.submit = this.submit.bind( this );
    }
   submit(){

    }

    updateJSON(data) {
       let json = data;
        $('#json').val(JSON.stringify(json));
    }

    componentDidMount(){
        let json = {
            "string": "",
            "number": 0,
            "array": [0, ],
            "object": {
                "property": "value",
                "subobj": {
                    "arr": ["foo", "ha"],
                    "numero": 1
                }
            }
        };

        $('#json').change(function() {
            var val = $('#json').val();
            if (val) {
                try { json = JSON.parse(val); }
                catch (e) { alert('Error in parsing json. ' + e); }
            } else {
                json = {};
            }
            $('#editor').jsonEditor(json, { change: this.updateJSON,});
        });
        $('#json').val(JSON.stringify(json));
        $('#editor').jsonEditor(json, { change: this.updateJSON});
        $('#expander').click(function() {
            var editor = $('#editor');
            editor.toggleClass('expanded');
            $(this).text(editor.hasClass('expanded') ? 'Collapse' : 'Expand all');
        });
    }

    render(){

        let props = this.props;

        let state = this.state;

        let indicator = null;
        if( state.isLoading ){
            indicator = <RLoadingIndicator />;
        }
        let error = null;
        if( state.errorMsg ){
            error = <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                <div className="error-info">{ state.errorMsg }</div>
            </div>
            </div>;
        }

        let article = props.article;
        let jsonData ='';

        let articleName = '';
        if( article ){
            articleName = article.articleName || '';
            jsonData = article.data||'';
        }

        return (
            <div className="article-editor">
            <div class="col-sm-10 col-lg-10">
            <div id="editor" class="json-editor"></div>
            </div>
            <RForm action="" method="POST" className="form-horizontal" onSubmit={ this.submit }>

            <div className="form-group">
            <label htmlFor="articleName" className="col-sm-2 control-label">JSON数据标题（非重复）</label>
            <div className="col-sm-9">
            <textarea value={ articleName  } ref="articleName" id="articleName" name="articleName" type="text" placeholder="这里输入JSON数据条标题"  />
            </div>
            </div>
            <div className="form-group">
            <label htmlFor="jsonData" className="col-sm-2 control-label">JSON数据直接输入框</label>
            <div className="col-sm-9">
            <textarea value={ jsonData } ref="jsonData" id="json" name="jsonData" type="text" placeholder="这里输入JSON数据"  />
            </div>
            </div>
            <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-default">保存</button>
            </div>
            </div>
            { error }
            </RForm>
            { indicator }
            </div>
    );
    }


}
DataEditor.defaultProps = {

    //当前栏目数据
    channel : null,
    //是否新增文章
    isAdd : true,
    //如果是编辑文章, 传入文章数据
    article : null

};


module.exports = DataEditor;