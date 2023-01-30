FROM php:7.3-apache
MAINTAINER itxcjm "2781676192@qq.com"
COPY ./src /var/www/html/
RUN chmod -R 777 /var/www/html/*
