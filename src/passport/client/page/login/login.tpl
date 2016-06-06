{# 登陆页面 #}
{% extends 'common:page/layout.tpl' %}

{% block block_body %}
<div id="pages-container">
    <form action="{{ cms_urls.doLogin | raw }}" method="post">
        <div>
            <label for="userName">用户名</label>
            <input type="text" id="userName" name="userName" placeholder="输入用户名" />
        </div>
        <div>
            <label for="password">密码</label>
            <input type="password" id="password" name="password" />
        </div>
        <div>
            <input type="submit" value="提交" />
        </div>
        <div>
            {{ loginError || raw }}
        </div>
    </form>
</div>
{% endblock %}