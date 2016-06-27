#!/bin/sh

# 安装 node_modules, 打包成  nm.tar.gz


node -v

rm -rf nm.tar.gz
rm -rf node_modules/

npm i

tar czf nm.tar.gz node_modules/

