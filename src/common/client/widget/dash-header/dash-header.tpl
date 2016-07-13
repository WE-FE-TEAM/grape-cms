{# 后台系统的通用头部 #}
<header class="navbar navbar-inverse navbar-fixed-top dash-header" id="dash-header">
    <div class="container-fluid">
        <a class="navbar-brand" href="/cms/dash/home/index"><p>we-cms</p></a>
        <span class="user-name">{{ $request.user.userName | raw }}</span>
        <ul class="nav navbar-nav navbar-right">
            <li>
                <a target="_blank" href="http://www.jsoneditoronline.org/">JSON在线编辑器</a>
            </li>
            <li>
                <a href="##">帮助文档</a>
            </li>
            <li>
                <a target="_blank" href="/cms/passport/passport/modifyPassword">修改登录密码</a>
            </li>
            <li>
                <a href="/cms/passport/passport/logout">退出</a>
            </li>
        </ul>
    </div>
</header>