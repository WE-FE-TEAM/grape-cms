
# 数据库环境初始化



## mongodb


### 栏目相关

整个CMS后台系统, 认为是一个大的栏目, 即 **根栏目**, 因此, 需要提前向 `db.channels` 中插入根栏目:

```javascript
db.channels.insert({ channelName : "CMS后台系统", channelType : "container", parentId : null });
```

然后, 将得到的 根栏目 `_id` , 写入 `common/server/config/cms.js`  中, 修改 `rootChannelId`  的值为生成的根栏目ID


### 页面操作集 operation

```javascript
db.operations.insert( {  } )
```