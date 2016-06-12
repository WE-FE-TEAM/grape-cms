{# CMS后台首页页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
角色管理
{% endblock %}

{% block block_body_js %}
require(["dash:page/home/role-manage/role-manage.js"] , function(app){
    app.init();
});
{% endblock %}