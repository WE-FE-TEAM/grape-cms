{# 新增文章 / 编辑文章  页面 #}
{% extends 'common:page/dash-layout.tpl' %}

{% block dash_block_main %}
<div id="app">
</div>
{% endblock %}

{% block block_body_js %}
<script>
    window.tplConf = {
        action : '{{ action | raw }}',
        channel : '{{ channel | json | escape('js') | raw }}'
    };
</script>
{% script %}
require(["dash:page/data/edit-data/edit-data.js"] , function(app){
app.init( window.tplConf );
});
{% endscript %}
{% endblock %}
