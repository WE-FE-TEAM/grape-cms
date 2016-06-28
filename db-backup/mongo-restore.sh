#!/bin/sh

# 将备份的 mongodb 文件, 导入 mongodb 的 CMS 数据库

mongorestore --gzip --archive=$1 --db cms

