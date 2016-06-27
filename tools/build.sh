#!/bin/sh


# 实际执行mobile内的打包任务

base_dir=$(cd "$(dirname "$0")";pwd)
project_dir="${base_dir}/.."
source_root_dir="${project_dir}/.."
project_source_dir="${project_dir}/src"
project_source_common_dir="${project_source_dir}/common"
dist_dir_name="node-cms"
dist_dir="${project_dir}/${dist_dir_name}"
dist_app_dir="${dist_dir}/app"
tar_name="prod-node-cms.tar.gz"

# 子模块
modules=( common dash passport )

# 调用 grape 命令, 编译某个模块
build_module(){
    local cwd=`pwd`
    local module_name=$1
    cd ${project_source_dir}/${module_name}
    echo "开始编译模块 ${module_name} "
    grape release prod -d ./output
    # 删除多余拷贝的文件
    rm ./output/*.json
    rm ./output/*.sh
    cp -rf ./output/* ${dist_dir}
    cd ${cwd}
}


# 回到工程主目录
cd ${project_dir}


# 检查dist目录, 创建空的
if [ -d ${dist_dir_name} ]
then
    echo "编译产出的${dist_dir_name}目录存在源代码中, 冲突了!!"
    exit 1
fi

mkdir ${dist_dir_name}
mkdir -p "${dist_dir_name}/app"


# 在开始编译各个模块前, 需要将 src/common 下的 nm.tar.gz 解压, 编译前端代码时, 需要依赖 src/common/node_modules 目录
cd ${project_source_common_dir}
tar xzf nm.tar.gz

#  执行 grape ,将各个子模块代码编译到 dist/app 下
cd ${project_dir}
for var in ${modules[@]}
do
    build_module ${var}
done


#  解压node_modules
cd ${project_dir}
cp nm.tar.gz ${dist_dir}
cd ${dist_dir}
# mobile的common模块,包含有前端的 node_modules, 会被拷贝到 dist 下面, 需要先删除
if [ -d node_modules ]
then
    rm -rf node_modules
fi
# 解压server端依赖的 node_modules
tar xzf nm.tar.gz
rm nm.tar.gz

#  拷贝 index.js 到 dist/app
cd ${project_dir}
cp ./src/index.js ${dist_app_dir}
cp ./pm2.json ${dist_app_dir}

#  拷贝 tools 目录到dist中
cd ${project_dir}
cp -r tools ${dist_dir}


#  打包整个 dist 目录
cd ${project_dir}
tar czf ${tar_name} ./${dist_dir_name}


echo "打包 NODE-CMS 上线包 ${tar_name} 完成"
