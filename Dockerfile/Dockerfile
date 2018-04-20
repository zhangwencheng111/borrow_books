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

