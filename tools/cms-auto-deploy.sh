#!/bin/sh

# 临时使用这个脚本, 来自动部署到 开发机119和QA的106 机器

# 这个脚本要和  cms-release.sh  放到同一个目录 !!!


base_dir=$(cd "$(dirname "$0")";pwd)
# 要下载的代码分支
branch_name=$1
#要部署到目标机器的名字
deploy_target_name=$2
backup_dir="${base_dir}/node-cms-backup"
code_dir_name="grape-cms"

code_dir="${base_dir}/${code_dir_name}"
project_dir="${base_dir}/${code_dir_name}"
tar_name="prod-node-cms.tar.gz"

#默认部署到 RD开发机
deploy_target_ssh_port="22222"
deploy_target_login="devpay@172.16.3.119"
deploy_target_temp_dir="/home/devpay/fe/deploy-node-cms"

if [ -z ${branch_name} ]
then
    echo "Usage: sh cms-auto-deploy.sh 分知名 [119|106]"
    exit 1
fi

if [ "${deploy_target_name}" = "106" ]
then
    echo "==============部署目标: QA 的 106 机器================"
    deploy_target_login="tomcat@172.16.3.106"
    deploy_target_temp_dir="/home/tomcat/fe/deploy-node-cms"
elif [ "${deploy_target_name}" = "119" ]
then
    echo "==============部署目标: RD联调机器 119 ================"
else
    echo "===========不支持的部署目标机器名, 默认部署到  RD  联调机器 119  ============="
fi

sh cms-release.sh ${branch_name}

if [ $? -ne 0 ]
then
    echo "\n\n==========编译出错, 请检查========\n\n"
    exit 1
fi

# 检查生成的tar包
cd ${base_dir}

if [ ! -f ${tar_name} ]
then
    echo "生成上线包 ${tar_name} 出错!!!"
    exit 1
fi


# 拷贝生成的上线包, 到目标机器的临时目录
echo "BEGIN: 拷贝上线包到目标机器临时目录"
scp -P ${deploy_target_ssh_port} ${tar_name}  ${deploy_target_login}:${deploy_target_temp_dir}

if [ $? -ne 0 ]
then
    echo "\n\n==========拷贝上线包 ${tar_name} 到目标机器 失败!!========\n\n"
    exit 1
fi

echo "END: 拷贝上线包到目标机器"


# ssh 登录目标机器, 部署刚拷贝的上线包
ssh -p ${deploy_target_ssh_port} ${deploy_target_login}  <<ENDSSH

whoami
node -v

cd ${deploy_target_temp_dir}

echo "准备解压上线包, 当前目录:"
pwd

sh cms-deploy.sh "${deploy_target_temp_dir}/${tar_name}"

ENDSSH

echo "END"


