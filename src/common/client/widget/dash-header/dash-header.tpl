{# 后台系统的通用头部 #}
<header class="navbar navbar-inverse navbar-fixed-top dash-header">
    <div class="container-fluid">
        <a class="navbar-brand" href="/cms/dash/home/index">we-cms</a>
        <span class="user-name">{{ $request.user.userName | raw }}</span>
        <ul class="nav navbar-nav navbar-right">
            <li>
                <a href="##">帮助文档</a>
            </li>
            <li>
                <a href="/cms/passport/passport/logout">退出</a>
            </li>
        </ul>
    </div>
</header>