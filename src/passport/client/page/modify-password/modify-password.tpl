{# 修改登录密码页面 #}
{% extends 'common:page/layout.tpl' %}

{% block block_body %}
<div id="pages-container">
    <form id="modify-pass-form" method="post">
        <div>
            <label for="oldPassword">原密码</label>
            <input type="password" id="oldPassword" name="oldPassword" />
        </div>
        <div>
            <label for="newPassword">新密码</label>
            <input type="password" id="newPassword" name="newPassword" />
        </div>
        <div>
            <label for="newPassword2">确认新密码</label>
            <input type="password" id="newPassword2" name="newPassword2" />
        </div>
        <div>
            <input type="submit" value="提交" />
        </div>

    </form>
</div>
{% endblock %}


{% block block_body_js %}

{% script %}
require(["passport:page/modify-password/modify-password.js"] , function(app){
app.init(  );
});
{% endscript %}
{% endblock %}
