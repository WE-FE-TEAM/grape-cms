{# 文章类型的栏目页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
<div id="app">

</div>
{% endblock %}


{% block block_body_js %}
{% script %}
require(["dash:page/channel/channel-article/channel-article.js"] , function(app){
app.init();
});
{% endscript %}
{% endblock %}
