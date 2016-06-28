const React = require('react');
const ReactDOM = require('react-dom');
const service = require('common:widget/ui/service/service-factory.js');
const utils = require('common:widget/ui/utils/utils.js');
const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RForm = require('common:widget/react-ui/RForm/RForm.js');
const Textarea = require('./Textarea.js');
 require('common:widget/lib/jquery/jquery.jsoneditor.js');

const TextInput = RForm.TextInput;

const dataService = service.getService('data');

class DataEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isLoading: false,
            errorMsg: ''
        };
        this.submit = this.submit.bind(this);
        this.updateJSON=this.updateJSON.bind(this);
        this.clickeditor=this.clickeditor.bind(this);
    }

    submit() {
        let state = this.state;
        let props = this.props;
        if (state.isLoading || props.isView) {
            return;
        }

        let channel = props.channel;
        let mjsondata = props.jsondata;
        let isAdd = !mjsondata;
        let dataName = this.refs.dataName.getValue();
        let data = this.state.value;


        let allData = {
            channelId: channel._id,
            dataName: dataName,
            data: JSON.stringify(data)
        };

        let promise;

        if (isAdd) {
            //新增
            promise = dataService.addData(allData);
        } else {
            allData.dataId = mjsondata.dataId;
            //编辑
            console.log(mjsondata.dataId+"alldata now edit");
            promise = dataService.updateData(allData);
        }

        promise.then((req) => {
            if (req.requestStatus === dataService.STATUS.SUCCESS) {
                let out = req.data;
                if (out.status === 0) {
                    alert('保存文章成功');

                    let searchConf = utils.getSearchConf();

                    searchConf.dataId = out.data.dataId;
                    delete searchConf.recordId;
                    // searchConf.recordId = out.data._id;

                    location.href = '/cms/dash/data/view?' + utils.json2query(searchConf);

                    return;
                }
                return Promise.reject(new Error(out.message));
            }
            return Promise.reject(new Error('系统返回异常'));
        }).catch((e) => {
            alert(e.message);
            this.setState({
                isLoading: false,
                errorMsg: e.message || '系统返回异常'
            });
        });

        state.isLoading = true;

        this.setState({
            isLoading: true,
            errorMsg: ''
        });

    }

    updateJSON(data) {
        let json =JSON.stringify(data);
         $('#json').val(json);
        let state=this.state;
        console.log(">"+json+">>>>>>>>>>"+state.value);
        state.value =json;
        console.log(">"+json+">>>>>>>>>>"+state.value);
    }

    componentDidMount() {
        let props = this.props;
        let mjsondata = props.jsondata;
        let json = '';
        if (mjsondata) {
            json = JSON.parse(mjsondata.data);
            console.log(mjsondata.data + "commponent");
        }
        else {
            json  = {"string":"hello!","number":"0"};
        }
        $('#editor').jsonEditor(json, {change: this.updateJSON });
        $('#expander').click(function () {
            var editor = $('#editor');
            editor.toggleClass('expanded');
            $(this).text(editor.hasClass('expanded') ? 'Collapse' : 'Expand all');
        });
    }

   clickeditor(){

   }
    render() {
        let props = this.props;
        let mjsondata = props.jsondata;
        let state = this.state;
        let dataName = '';

        if (mjsondata) {
            dataName = mjsondata.dataName || '';
            state.value = mjsondata.data || '';
        }
        else {
            state.value  = '{"string":"hello!","number":"0"}';
        }
        let indicator = null;
        if (state.isLoading) {
            indicator = <RLoadingIndicator />;
        }
        let error = null;
        if (state.errorMsg) {
            error = <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <div className="error-info">{ state.errorMsg }</div>
                </div>
            </div>;
        }

        return (
            <div className="data-editor">
                <div class="col-sm-10 col-lg-10" onClick={this.clickeditor}>
                    <div id="editor" class="json-editor" ></div>
                </div>
                <RForm action="" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label htmlFor="articleName" className="col-sm-2 control-label">JSON数据标题（非重复）</label>
                        <div className="col-sm-9">
                            <TextInput value={ dataName  } ref="dataName" id="dataName" name="dataName"
                                       type="text" placeholder="这里输入JSON数据条标题"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="jsonData" className="col-sm-2 control-label">JSON数据直接输入框</label>
                        <div className="col-sm-9">
                            <Textarea value={state.value} id="json" ref="input" />
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
    channel: null,
    //是否新增文章
    isAdd: true,
    //如果是编辑文章, 传入文章数据
    article: null

};


module.exports = DataEditor;