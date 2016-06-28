#!/bin/sh

#用于线上生产环境的 node-ui
export PATH=/opt/app/node-v5.3.0-linux-x64/bin:$PATH

source /etc/profile

#定义颜色
WHITE="\e[1;37m"
RED="\e[1;31m"
blue="\e[0;34m"
BLUE="\e[1;34m"
NC="\e[0m"

#控制server的启动/停止/重启

opType=$1
env=$2
pm2json="pm2.json"
cwd=$(cd "$(dirname "$0")";pwd)
cwd="${cwd}/../app"

cd ${cwd}

pwd

#if [ ! "${env}" = "development" ]
#then
#    env="production"
#fi

whoami
echo "env: ${env}"

case ${opType} in
    start)
        pm2 start ${pm2json} --env ${env}
    ;;
    stop)
        pm2 stop ${pm2json}
    ;;
    reload)
        pm2 reload ${pm2json} --env ${env}
    ;;
    *)
        echo "Usage: ./server_control.sh start|stop|reload [development|production]"
    ;;
esac

