{# CMS后台 用户管理 页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
<div id="app"></div>
{% endblock %}


{% block block_body_js %}
{% script %}
require(["dash:page/home/user-manage/user-manage.js"] , function(app){
app.init();
});
{% endscript %}
{% endblock %}