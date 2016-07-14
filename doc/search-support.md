
# 对搜索组的支持

搜索组需要直接来CMS数据库中, 读取数据, 生成搜索库, 因此, 需要单独一个 `collection` 来存放搜索读取的原始数据.

## 数据库设置

* mongodb中集合名: `db.searchRaw`
* 单条 `document` 的字段:

```
{
     resourceName : "名称",
     searchPath : "WE观$$股票",
     //外部用户访问该资源的URL
     accessUrl : "该数据访问的URL",
     //该数据在CMS中所属的类型, article 或者 data
     resourceType : "[article|data]",
     //该数据对应原始数据的ID
     resourceId : "在CMS中的惟一ID",
     //该数据实际包含的内容
     data : {

     },
    
    createdAt : "",
    updatedAt : ""
}
```


## CMS涉及修改点

### **栏目** 修改点

栏目需要新增如下字段:

* docUrl : string 该栏目的相关文档说明URL(此字段和搜索**无关**, 纯粹是搭车一起上:)
* needSearch: true | false 是否需要被搜索, 默认是false
* searchPath : string 该栏目下的文章或数据, 所属的栏目层级关系, 这个是被搜索时需要关注的

如果栏目的 `needSearch` 为 `true`, 那么该栏目的 `onlineUrl` 字段, 不能为空!! 为必填项. 这个字段会随着具体数据一起, 写入`db.searchRaw` 集合中


### **文章** 修改点

在文章 **发布** 的时候, 需要判断该文章所属的栏目, `needSearch` 字段是否为 `true`, 如果true, 需要在文章写入文件**之后**, 将文章数据写入 `db.searchRaw`
中.

### **数据** 修改点

同以上**文章**修改点.



