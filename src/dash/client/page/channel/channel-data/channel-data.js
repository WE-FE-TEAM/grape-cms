/**
 * Created on 16/6/16.
 */


'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

const utils = require('common:widget/ui/utils/utils.js');

const DataList = require('dash:widget/ui/data/data-list/data-list.js');
const DeleteDataDialog = require('dash:widget/ui/data/delete-data-dialog/delete-data-dialog.js');


class AppData extends React.Component {
    constructor(props) {
        super(props);
        let searchConf = utils.getSearchConf();

        this.state = {
            channelId: searchConf.channelId,
            isShowDelete: null
        };
        this.onDataEdit = this.onDataEdit.bind(this);
        this.onDataDelete = this.onDataDelete.bind(this);
        this.onDataPublish = this.onDataPublish.bind(this);

    }

    onDataEdit(data) {

        //跳转到文章编辑页面 得改
        location.href = '/cms/dash/data/edit?channelId='
            + encodeURIComponent(this.state.channelId)
            + '&dataId=' + encodeURIComponent(data._id);
    }

    onDataDelete(data) {
        this.setState({
            isShowDelete: data
        });
    }

    onDataPublish() {
    }

    closeDialog(type) {
        let state = this.state;
        state[type] = null;
        this.setState(state);
    }

    render() {

        let props = this.props;
        let state = this.state;

        let addURL = '/cms/dash/data/add?channelId=' + encodeURIComponent(state.channelId);

        let deleteDialog = null;
        if (state.isShowDelete) {
            deleteDialog = <DeleteDataDialog
                onRequestClose={ this.closeDialog.bind( this, 'isShowDelete') }
                jsondata={ state.isShowDelete }/>;
        }

        return (
            <div>
                <div>
                    <a className="btn btn-primary btn-lg" target="_self" href={ addURL }>创建数据</a>
                </div>
                <div className="">
                    <h2>该栏目下 数据列表</h2>
                    <DataList onDataEdit={ this.onDataEdit }
                              onDataDelete={ this.onDataDelete }
                              onDataPublish={ this.onDataPublish }
                    />
                </div>
                { deleteDialog }
            </div>
        );
    }


}

let singleton = {

    init: function () {

        ReactDOM.render(<AppData />, document.getElementById('app'));
    }
};
module.exports = singleton;