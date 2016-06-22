{# 文件上传 类型的栏目页面 #}
{% extends 'common:page/dash-layout.tpl' %}


{% block block_head_js %}

{% endblock %}


{% block dash_block_main %}
<div id="app">
    文件上传 类型栏目
</div>
{% endblock %}


{% block block_body_js %}
{% script %}
require(["dash:page/channel/channel-resource/channel-resource.js"] , function(app){
app.init();
});
{% endscript %}
{% endblock %}
