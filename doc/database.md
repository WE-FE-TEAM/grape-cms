
# 数据库设计


权限控制, 遵循 `RBAC`, 一个`user`对应多个`role`, 一个 `role` 对应拥有多个栏目(`channel`)的不同操作(`operation`)权限.

权限控制, 只控制到 栏目(`channel`) 级别, **不再**细化到具体的文件级别.

一个权限, 由2部分构成: 栏目 以及 对栏目下的操作: 栏目由 栏目ID(channelId) 来限定; 对栏目下操作, 通过 `operationName` 来限定.

一个操作(`operationName`), 可能对应1个或多个真实的`URL`, 每个`URL` 都解析为 `module`+`controller`+`action` 来表示 


## 用户表 db.users

```javascript
{
    _id : 'user id',
    userName : '登录名',
    password : '登录密码',
    // 0: 系统管理员; 1: 普通管理员; 2: 普通用户
    level : [0|1|2],
    //用户是否可正常使用: 0 正常; 1 被禁用
    enabled : 0,
    //用户对应的多个 角色
    roles : [ 'role_id 1', 'role_id 2' ]
}
```

约束:

```javascript
db.users.createIndex( { userName : 1}, { unique : true } )
```

## 角色表 db.roles

```javascript
{
    _id : '',
    roleName : '角色名',
    //该角色拥有的权限: operationName&channelId 来表达一个权限
    permissions : [
        'operationName&channelId',
        'operationName&channelId',
        'operationName&channelId'
    ]
}
```

约束:

```javascript
db.roles.createIndex( { roleName : 1}, { unique : true } )
```


## 栏目表 db.channels

```javascript
{
    _id : '',
    channelName : '栏目名',
    url : '查看栏目的URL',
    //栏目类型: container: 容器栏目; article: 文章栏目; json: 数据栏目; asset_upload: 图片上传栏目 
    channelType : 'article',
    //如果是 文章栏目, 则该栏目下的文章, 应该必须具备的一些字段模板
    articleTemplate : {},
    //父栏目的ID
    parentId : 'xxx',
    //如果该栏目类型是容器栏目parent, 该栏目包含的子栏目ID数组
    children : [ 'channelId1', 'channelId2' ]
}
```


## 系统支持的操作表 db.operations

```javascript
{
    _id : '',
    //操作名称, 比如  "查看栏目", "新增文章", "编辑文章", "查看文章", "上传文件" 等
    operationNameZh : '操作名称',
    //操作对应的英文名称  viewChannel/addArticle/editArtile/viewArticle/uploadAsset
    operationName : '',
    //该操作对应的 多个具体URL, 每个URL通过 module+controller+action 的方式来表达
    actionList : [
        'module+controller+action',
        'module+controller+action'
    ]
    //url : '该操作的URL',
    //如果对当前动作有权限, 那么对关联的其他动作也有权限
    //subUrls不能直接设置权限(即不会出现在权限编辑界面上), 权限是完全关联到 对应的主action上的
    //比如 "新增文章" 动作, 其实包含了  1. 显示新增文章入口页面的URL; 2. 点击保存的URL
    //subUrls : [ '该动作相关联的其他动作1', '关联的其他动作2' ]
}
```


## 文章表  db.articles

```javascript
{
    _id : '',
    channelId : '文章所处栏目的ID',
    //文章内容, 字段要匹配该栏目的文章模板
    data : {}
}
```


## 资源表  db.assets

这是用户上传的各种资源

```javascript
{
    _id : '',
    // image; js; css; video
    type : '资源类型',
    url : '资源URL'
}
```