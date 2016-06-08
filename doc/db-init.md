
# 数据库环境初始化



## mongodb


### 栏目相关

整个CMS后台系统, 认为是一个大的栏目, 即 **根栏目**, 因此, 需要提前向 `db.channels` 中插入根栏目:

```javascript

//根节点
db.channels.insert({ channelName : "CMS后台系统", channelType : "container", isSystem : true, parentId : null });

//系统管理
db.channels.insert({ channelName : "系统管理", channelType : "container", isSystem : true, parentId : null });

//用户管理
db.channels.insert({ channelName : "用户管理", channelType : "userManage", isSystem : true, parentId : null });

//角色管理
db.channels.insert({ channelName : "角色管理", channelType : "roleManage", isSystem : true, parentId : null });

//栏目管理 
db.channels.insert({ channelName : "栏目管理", channelType : "channelManage", isSystem : true, parentId : null });

```

然后, 将得到的 根栏目 `_id` , 写入 `common/server/config/cms.js`  中, 修改 `rootChannelId`  的值为生成的根栏目ID

