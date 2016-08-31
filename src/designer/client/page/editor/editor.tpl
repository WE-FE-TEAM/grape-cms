{# 页面编辑面板 #}
{% extends 'common:page/designer-layout.tpl' %}

{% block block_body %}

<div id="editor-app">
    <header id="editor-header"></header>
    <section id="editor-main">
        <aside id="com-edit-section"></aside>
        <article id="editor-panel">
            <div id="lpb-editor-frame-wrap" class="glpb-sortable gplb-sys-editor">

            </div>
        </article>
    </section>
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
    require(['designer:page/editor/editor.js'], function(app){
        app.init(window.tplConf);
    });
{% endscript %}
{% endblock %}