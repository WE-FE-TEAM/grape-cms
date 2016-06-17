#!/bin/sh


base_dir=$(cd "$(dirname "$0")";pwd)
today=`date "+%Y-%m-%d"`

# 1. 备份mongodb数据


cd ${base_dir}

echo "开始备份mongodb的 CMS 数据库=====>"
mongodump  --archive=./"mongodb-backup-${today}.gz" --gzip --db cms

if [ $? -ne 0 ]
then
    echo "备份mongodb数据出错!!!"
    exit 1
fi

echo "=====> 备份mongodb的CMS完成"


