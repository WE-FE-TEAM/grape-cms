{# CMS后台页面的common模板 #}
{% extends 'common:page/layout.tpl' %}

{% block block_head_css %}
<link rel="stylesheet" type="text/css" href="/client/static/dash/dash.scss">
<link rel="stylesheet" type="text/css" href="/client/static/dash/custom.scss">
<link rel="stylesheet" type="text/css" href="/client/static/dash/font-awesome.css">
{% endblock %}

{% block block_head_js %}
<script src="/client/static/ueditor/ueditor.config.js"></script>
<script src="/client/static/ueditor/ueditor.all.js"></script>
<script src="/client/static/ueditor-plugins/paragraph-bg-color/paragraph-bg-color.js"></script>
<script src="/client/static/ueditor-plugins/we-product-sug/we-product-sug.js"></script>
{% endblock %}

{# 通用header #}
{% block block_header %}
    {% widget "common:widget/dash-header/dash-header.tpl" %}
{% endblock %}

{% block block_body %}
<div id="dash-app" class="container-fluid">
    <div class="row">
        <div class="col-md-2 sidebar left_col">

         <div class="main_menu_side hidden-print main_menu">
         <div class="menu_section active">
            {% widget "common:widget/dash-menu/dash-menu.tpl" %}
         </div>
         </div>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            {% block dash_block_main %}
             这是dash页面的右侧主面板
            {% endblock %}
        </div>
    </div>

</div>
{% endblock %}