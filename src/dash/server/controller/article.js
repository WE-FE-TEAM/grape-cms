/**
 * 文章 相关的action
 * Created by jess on 16/6/7.
 */


'use strict';


const ControllerBase = grape.get('controller_base');


class ArticleController extends ControllerBase {


    addAction(){
        this.http.res.end('新增文章页面');
    }

    doAddAction(){
        this.http.res.end('新增文章接口');
    }

    viewAction(){
        this.http.res.end('查看文章页面');
    }
    
    editAction(){
        this.http.res.end('编辑文章页面');
    }
    
    doUpdateAction(){
        this.http.res.end('更新文章接口');
    }
    
    doDeleteAction(){
        this.http.res.end('删除文章接口');
    }
}



module.exports = ArticleController;