{# CMS后台 栏目管理 页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
<div id="app"></div>
{% endblock %}

{% block block_body_js %}
{% script %}
require(["dash:page/home/channel-manage/channel-manage.js"] , function(app){
app.init();
});
{% endscript %}
{% endblock %}