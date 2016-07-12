{# 后台系统的菜单栏 #}
<div id="dash-menu">

</div>
 {# bootstrap css #}

 {% block block_head_css %}
  {% endblock %}
{% script %}
require(["common:widget/dash-menu/dash-menu.js"] , function(menu){
    menu.init();
});
{% endscript %}