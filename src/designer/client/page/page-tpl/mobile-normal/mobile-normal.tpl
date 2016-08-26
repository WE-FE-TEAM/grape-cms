{# 移动端普通页面模板 #}
{% extends 'common:page/designer-layout.tpl' %}

{% block block_head_js %}

{# 计算rem自适应方案的js #}
<script>
    (function(){var l=window.document;var b=document.documentElement;var g=window;var m=0;var d=0;var e;window.remFlexible=window.remFlexible||{};var f=window.remFlexible;function j(){var n=b.clientWidth;b.style.fontSize=n/7.5+"px"}var i=l.querySelector('meta[name="viewport"]');if(i){i.parentNode.removeChild(i)}var h=g.navigator.appVersion.match(/android/gi);var c=g.navigator.appVersion.match(/iphone/gi);var k=g.devicePixelRatio;if(c){if(k>=3&&(!m||m>=3)){m=3}else{if(k>=2&&(!m||m>=2)){m=2}else{m=1}}}else{m=1}d=1/m;i=document.createElement("meta");i.setAttribute("name","viewport");i.setAttribute("content","initial-scale="+d+", maximum-scale="+d+", minimum-scale="+d+", user-scalable=no");if(b.firstElementChild){b.firstElementChild.appendChild(i)}else{var a=l.createElement("div");a.appendChild(i);l.write(a.innerHTML)}g.addEventListener("resize",function(){clearTimeout(e);e=setTimeout(j,300)},false);g.addEventListener("pageshow",function(n){if(n.persisted){clearTimeout(e);e=setTimeout(j,300)}},false);if(l.readyState==="complete"){j()}else{l.addEventListener("DOMContentLoaded",function(n){j()},false)}j();b.setAttribute("data-dpr",m);f.dpr=m;f.px2rem=function(n){return n/100};f.rem2px=function(n){return n*100}})();
</script>

{% endblock %}

{% block block_body %}
<div id="lpb-com-editor" class="glpb-sortable gplb-sys-editor">

</div>
{% endblock %}

{% block block_body_js %}

{% script %}
require(['designer:page/page-tpl/mobile-normal/mobile-normal.js'], function(app){
app.init();
});
{% endscript %}

{% endblock %}