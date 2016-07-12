<!doctype html>
{% block block_assign %}
    {# 模板内赋值局部变量 #}
    {% set tpl_now = Date.now() %}
{% endblock %}
{% html lang="en" framework="common:static/js/mod.js" %}
    {% head %}
        <meta charset="utf-8">
        <script>
            window._jHeadStart = ( new Date() ).getTime();
        </script>
        {# 360 浏览器就会在读取到这个标签后，立即切换对应的极速核 #}
        <meta name="renderer" content="webkit">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {% block block_head_content %}
        <meta name="keywords" content="">
        <meta name="description" content="">
        <title>Grape CMS</title>
        {% endblock %}

        <link rel="shortcut icon" type="image/x-icon" href="/client/static/img/favicon.ico" />

        <link rel="stylesheet" type="text/css" href="/client/static/css/base.scss">

        {# bootstrap css #}
        <link rel="stylesheet" type="text/css" href="/client/static/bootstrap/css/bootstrap.css">
        {% block block_head_css %}
        {% endblock %}

        {% script %}
            require(["common:page/layout.js"] , function(app){

            });
        {% endscript %}

        {% block block_head_js %}
        {% endblock %}

    {% endhead %}

    {% body %}

        {% block block_header %}

        {% endblock %}

        <div class="main-content">

            {% block block_body %}
            {% endblock %}

        </div>

        {% block block_footer %}

        {% endblock %}

        {# 页面的JS,放在body结束的入口 #}
        {% block block_body_js %}

        {% endblock %}


        {% script %}

        {% endscript %}
    {% endbody %}

{% endhtml %}
