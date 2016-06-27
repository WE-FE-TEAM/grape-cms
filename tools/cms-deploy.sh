#!/bin/sh

## 用于正式线上机器, 解压 prod-node-cms.tar.gz ,部署到 APP 路径下

tar_path=$1
env_name=$2
tar_name="prod-node-cms.tar.gz"
nui_dir_name="node-cms"
nui_root="/opt/app/${nui_dir_name}"
cwd=$(cd "$(dirname "$0")";pwd)

echo "切换到deploy.sh脚本所在目录"
cd ${cwd}
echo "当前路径: ${cwd}"

if [ -z ${tar_path} ]
then
    echo "缺少上线包路径参数: sh deploy.sh /absolute/path/to/${tar_name} NODE_ENV-name !!"
    exit 1
fi

if [ -z ${env_name} ]
then
    echo "缺少Node执行环境参数: sh deploy.sh /absolute/path/to/${tar_name} NODE_ENV-name !!"
    exit 1
fi

if [ ${cwd} = ${nui_root} ]
then
    echo "不能在${nui_root}下执行deploy.sh!!"
    exit 1
fi


# 如果当前路径下已经存在 node-cms 目录,先删除
if [ -d ${nui_dir_name} ]
then
    rm -rf ${nui_dir_name}
fi

#
cp -f ${tar_path} ./

tar xf ${tar_name}

rm -f ${tar_name}

# 将 node-cms 下的内容都拷贝到 运行路径下

if [ ! -d ${nui_root} ]
then
    echo "运行路径目录不存在,创建目录"
    mkdir -p ${nui_root}
fi

if [ ! -d "./${nui_dir_name}" ]
then
    echo "解压之后,找不到目录${nui_dir_name} !!"
    exit 1
fi

cp -rf "./${nui_dir_name}/." "${nui_root}/"

echo "拷贝内容到${nui_root} 完成"


echo "======准备重启pm2======"

sh "${nui_root}/tools/server_control.sh" reload ${env_name}



