#!/bin/bash
#2018年3月13日17:36:33
#
#
##########

#$1 版本号v1.0.1
#$2 jenkins构建号

VERSION=$1
NUM=$2

if [ x"$VERSION" == "x" ];then
	echo "parameter err"
	exit 1
fi

if [ x"$NUM" == "x" ];then
        echo "parameter err"
        exit 1
fi

cd  /tmp/weixin_tar/${NUM}
cat << "EOF" > Dockerfile
FROM docker.io/django:python2

MAINTAINER zhangwencheng

COPY ./ppc-borrow-backend.tar.gz  /usr/local/src

RUN mkdir /usr/local/ppc-borrow-backend && \
tar -zxvf /usr/local/src/ppc-borrow-backend.tar.gz -C /usr/local/ppc-borrow-backend && \
pip --no-cache-dir install -r /usr/local/ppc-borrow-backend/install/requirement.txt && \
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

EXPOSE 8111

WORKDIR /usr/local/ppc-borrow-backend

CMD ["python", "manage.py", "runserver", "0.0.0.0:8111"]
EOF

docker build -t weixin:${VERSION} . && \
docker tag weixin:${VERSION}  registry.ppc.com/public/weixin:${VERSION} && \
docker push registry.ppc.com/public/weixin:${VERSION}
