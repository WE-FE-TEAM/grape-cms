const React = require('react');
const ReactDOM = require('react-dom');
const service = require('common:widget/ui/service/service-factory.js');
const utils = require('common:widget/ui/utils/utils.js');
const RLoadingIndicator = require('common:widget/react-ui/RLoadIndicator/RLoadIndicator.js');
const RForm = require('common:widget/react-ui/RForm/RForm.js');
const Textarea = require('./Textarea.js');
require('common:widget/lib/jquery/jquery.jsoneditor.js');

const RJSONEditor = require('common:widget/react-ui/RJSONEditor/RJSONEditor.js');

const TextInput = RForm.TextInput;

const dataService = service.getService('data');

class DataEditor extends React.Component {
    constructor(props) {
        super(props);

        let data = ( ( props.jsondata || '' ).data ) || {};

        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        this.state = {
            value: data,
            isLoading: false,
            errorMsg: ''
        };
        this.submit = this.submit.bind(this);

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
        let data = null;

        try{
            data = this.refs.jsonEditor.getValue();
        }catch(e){
            alert( '=======数据格式错误!!=======\n\n' + e.message );
            return this.setState({
                errorMsg : e.message
            });
        }

        data = JSON.stringify( data );

        //需要先校验JSON格式是否满足该栏目下的 json schema
        // let jsonSchema = channel.articleTemplate;
        // if( jsonSchema ){
        //     let obj = null;
        //     try{
        //         obj = JSON.parse( data );
        //     }catch(e){
        //         console.error( e );
        //         this.setState({
        //             errorMsg : 'JSON格式错误!!'
        //         });
        //         return;
        //     }
        //     let ajvObj = new ajv({useDefaults: true });
        //     let validate = ajvObj.validate( jsonSchema, obj );
        //     if( ! validate ){
        //         console.log( ajvObj.errors );
        //         return;
        //     }
        // }

        let allData = {
            channelId: channel._id,
            dataName: dataName,
            data: data
        };
        console.log("when submit");
        let promise;

        if (isAdd) {
            //新增
            console.log("when submit add");
            promise = dataService.addData(allData);
        } else {
            console.log("when submit edit");
            allData.dataId = mjsondata.dataId;
            //编辑
            console.log(mjsondata.dataId + "alldata now edit");
            promise = dataService.updateData(allData);
        }

        promise.then((req) => {
            if (req.requestStatus === dataService.STATUS.SUCCESS) {
                let out = req.data;
                if (out.status === 0) {
                    alert('保存数据成功');

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

    render() {
        let props = this.props;
        let state = this.state;

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

        let dataName = '';
        if (props.jsondata) {
            dataName = props.jsondata.dataName || '';
        }

        let saveBtn = null;

        if (props.isAdd || props.isEdit) {
            saveBtn = (
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-default">保存</button>
                    </div>
                </div>
            );
        }

        let editorReadOnly = this.props.isView;

        return (
            <div className="data-editor">
                <RForm action="" method="POST" className="form-horizontal" onSubmit={ this.submit }>
                    <div className="form-group">
                        <label htmlFor="dataName" className="col-sm-2 control-label">JSON数据标题（非重复）</label>
                        <div className="col-sm-9">
                            <TextInput value={ dataName  } ref="dataName" id="dataName" name="dataName"
                                       type="text" placeholder="这里输入JSON数据条标题"/>
                        </div>
                    </div>
                    <RJSONEditor ref="jsonEditor" data={ state.value } readonly={ editorReadOnly } />
                    {saveBtn}
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
    //是否新增数据
    isAdd: true,
    //如果是编辑数据, 传入json数据
    jsondata: null

};


module.exports = DataEditor;