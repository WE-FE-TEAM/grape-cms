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
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {# 360 浏览器就会在读取到这个标签后，立即切换对应的极速核 #}
        <meta name="renderer" content="webkit">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {% block block_head_content %}
        <meta name="keywords" content="">
        <meta name="description" content="">
        <title>人人贷WE理财(Wealth Evolution)官网</title>
        {% endblock %}

        <link rel="shortcut icon" type="image/x-icon" href="/client/static/img/favicon.ico" />

        <link rel="stylesheet" type="text/css" href="/client/static/css/base.scss">

        {% block block_head_css %}
        {% endblock %}

        <script>
            !function(){var c=Object.prototype.toString;var a=/complete|loaded|interactive/;var m="m.we.com/s1/w.gif";var d="";var p=location.protocol;var k="";var l=p+"//"+m;function b(q){return c.call(q)==="[object String]"}function j(s,r){for(var q in r){if(r.hasOwnProperty(q)){s[q]=r[q]}}}function o(s){var q="";for(var r in s){q+=r+"="+encodeURIComponent(s[r])+"&"}return q}function g(t){var s=(new Date()).getTime();var r="___log_"+s;var q=new Image();window[r]=q;q.onload=q.onerror=function(){q.onload=q.onerror=null;window[r]=null;q=null};q.src=t+"&_r="+s}function f(t){var q={pl:d,pid:k};for(var s in t){if(t.hasOwnProperty(s)){if(!b(t[s])){q[s]=JSON.stringify(t[s])}else{q[s]=t[s]}}}var r=l+"?"+o(q);g(r)}var n=false;var i={};var e={init:function(q){d=q.platform;k=q.pageID;if(!k){k=location.pathname}},perf:{headStart:function(q){i.jhead_start=q;return e},bodyStart:function(q){q=q||(new Date()).getTime();i.jbody_start=q;return e},bodyEnd:function(q){q=q||(new Date()).getTime();i.jbody_end=q;return e},domReady:function(q){if(i.jdom_ready){return}q=q||(new Date()).getTime();i.jdom_ready=q;return e},fullLoad:function(q){q=q||(new Date()).getTime();i.jfull_load=q;return e},send:function(){if(!n){if(window.performance&&window.performance.timing&&typeof window.performance.timing.toJSON==="function"){j(i,window.performance.timing.toJSON())}f({perf:i})}n=true}}};if(a.test(document.readyState)&&document.body){e.perf.domReady()}else{if(typeof document.addEventListener==="function"){document.addEventListener("DOMContentLoaded",function(){e.perf.domReady()})}}window.weLogger=e;function h(){e.perf.fullLoad();e.perf.send()}if(document.readyState!=="complete"){if(typeof window.addEventListener==="function"){window.addEventListener("load",h)}else{if(window.attachEvent){window.attachEvent("onload",h)}}}}();
        </script>

        {% script %}
            require(["common:page/layout.js"] , function(app){

            });
        {% endscript %}

        {% block block_head_js %}
        {% endblock %}

        <script>
            weLogger.init({ platform : 'pc' });
            weLogger.perf.headStart( _jHeadStart );
        </script>
    {% endhead %}

    {% body %}
        <script>
            weLogger.perf.bodyStart( );
        </script>

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
        weLogger.perf.bodyEnd( );
        if( typeof document.addEventListener !== 'function' ){
        weLogger.perf.domReady();
        }
        {% endscript %}
    {% endbody %}

{% endhtml %}
