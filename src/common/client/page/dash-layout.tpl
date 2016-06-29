{# CMS后台页面的common模板 #}
{% extends 'common:page/layout.tpl' %}

{% block block_head_css %}
<link rel="stylesheet" type="text/css" href="/client/static/dash/dash.scss">
{% endblock %}

{% block block_head_js %}
<script src="/client/static/ueditor/ueditor.config.js"></script>
<script src="/client/static/ueditor/ueditor.all.js"></script>
<script src="/client/static/ueditor-plugins/we-product-sug/we-product-sug.js"></script>
{% endblock %}

{# 通用header #}
{% block block_header %}
    {% widget "common:widget/dash-header/dash-header.tpl" %}
{% endblock %}

{% block block_body %}
<div id="dash-app" class="container-fluid">
    <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
            {% widget "common:widget/dash-menu/dash-menu.tpl" %}
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            {% block dash_block_main %}
             这是dash页面的右侧主面板
            {% endblock %}
        </div>
    </div>

</div>
{% endblock %}