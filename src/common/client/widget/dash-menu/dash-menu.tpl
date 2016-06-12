{# 后台系统的菜单栏 #}
<div id="dash-menu">

</div>

{% script %}
require(["common:widget/dash-menu/dash-menu.js"] , function(menu){
    menu.init();
});
{% endscript %}