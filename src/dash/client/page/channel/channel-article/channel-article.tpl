{# 文章类型的栏目页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
<div id="app">
    <a class="btn btn-primary btn-lg" target="_self" href="/cms/dash/article/add?channelId={{ channelId | url_encode }}">创建文章</a>
</div>
{% endblock %}


{% block block_body_js %}
{% script %}
require(["dash:page/channel/channel-article/channel-article.js"] , function(app){
app.init();
});
{% endscript %}
{% endblock %}
