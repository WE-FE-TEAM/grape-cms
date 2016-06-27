#!/bin/sh

# 上线时, 打包CMS工程的入口脚本
# 从GIT拉取代码, 执行 代码 中的编译脚本


base_dir=$(cd "$(dirname "$0")";pwd)
# 要下载的代码分支
branch_name=$1
backup_dir="${base_dir}/node-cms-backup"
code_dir_name="grape-cms"
code_dir="${base_dir}/${code_dir_name}"
project_dir="${base_dir}/${code_dir_name}"
tar_name="prod-node-cms.tar.gz"
git_url="https://github.com/WE-FE-TEAM/grape-cms.git"


source /etc/profile

#检查生成的tar包是否存在
check_output_tar(){
    local file_name=$1
    if [ ! -f "${project_dir}/${file_name}" ]
    then
        echo "生成新的${file_name}出错!!"
        exit 1
    fi
}

#备份目标文件到目录
backup_file(){
    local file_name=$1
    if [ -f ${file_name} ]
    then
        mv ${file_name} ${backup_dir}
        echo "===备份${file_name}成功==="
    fi
}

#将生成的 tar 包,拷贝到当前脚本所在目录
mv_tar(){
    local file_name=$1
    mv "${project_dir}/${file_name}" ${base_dir}

    echo "已经将新${file_name}拷贝到${base_dir}下"
}



# 判断命令行参数,是否传入了 分支名
if [ -z ${branch_name} ]
then
    echo "缺少分支名: sh pull-code.sh someBranchName !!"
    exit 1
fi


cd ${base_dir}

# 如果备份目录不存在,先创建
if [ ! -d ${backup_dir} ]
then
    echo "备份目录不存在,创建备份目录: ${backup_dir}"
    mkdir -p ${backup_dir}
fi

#TODO 提升下,这里最好先判断有没有代码了,有的话,可以直接pull,而不是重新clone
#先删除之前的代码目录
if [ -d ${code_dir_name} ]
then
    rm -rf ${code_dir_name}
fi

git clone ${git_url}

if [ ! -d ${code_dir_name} ]
then
    echo "拉取git代码出错,${code_dir_name}目录不存在"
    exit 1
fi

echo "============ git clone 拉取最新代码OK ============"


#拉取代码OK,进入源码根目录,执行 build.sh ,生成 .tag.gz

cd ${code_dir_name}

#切到对应的分支
git checkout ${branch_name}

#如果切分支失败,退出
if [ $? -ne 0 ]
then
    echo "切到指定分支 [${branch_name}] 失败!!!!"
    exit 1
fi

# 切换到工程主目录
cd ${project_dir}

#编译 node-cms ,生成 tar 包
sh tools/build.sh

# 检查执行结果
if [ $? -ne 0 ]
then
    echo "执行 tools/build.sh 出错!!!!"
    exit 1
fi

#备份当前的tar包,并将新生成的tar包,拷贝到 base_dir 目录
check_output_tar ${tar_name}

cd ${code_dir}
#还原git
echo "======== 还原git代码 ========"
pwd
git checkout .

echo "=== 切换到 ${base_dir} 目录 ==="
cd ${base_dir}

#如果当前目录下有 prod-node-cms.tar.gz  , mv 到备份目录
backup_file ${tar_name}

#将源码里生成的tar包,拷贝到当前目录
mv_tar ${tar_name}

echo "========== 生成tar完美结束 ========"




