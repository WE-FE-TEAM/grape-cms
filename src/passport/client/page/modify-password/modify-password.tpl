{# 修改登录密码页面 #}
{% extends 'common:page/layout.tpl' %}

{% block block_body %}
<div id="pages-container">
   <div class="card">
    <form id="modify-pass-form" method="post">
    <h2>CMS密码修改</h2>
        <div>
            <label for="oldPassword">原密码</label>
            <input type="password" id="oldPassword" name="oldPassword"  placeholder="原密码"/>
        </div>
        <div>
            <label for="newPassword">新密码</label>
            <input type="password" id="newPassword" name="newPassword" placeholder="新密码" />
        </div>
        <div>
            <label for="newPassword2">确认新密码</label>
            <input type="password" id="newPassword2" name="newPassword2" placeholder="重新输入新密码" />
        </div>
        <hr/>
        <div>
            <input class="btn btn-primary" type="submit" value="提交" />
        </div>

    </form>
    </div>
</div>
{% endblock %}


{% block block_body_js %}

{% script %}
require(["passport:page/modify-password/modify-password.js"] , function(app){
app.init(  );
});
{% endscript %}
{% endblock %}
