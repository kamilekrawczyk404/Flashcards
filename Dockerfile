FROM php:8.2 AS php

RUN usermod -u 1000 www-data

RUN apt-get update && apt-get install -y \
    unzip \
    libxml2-dev \
    libzip-dev \
    libpng-dev \
    libpq-dev \
    libcurl4-gnutls-dev

RUN docker-php-ext-install  -j10 \
        pdo \
        pdo_mysql \
        soap \
        zip \
        opcache \
        gd \
        intl \
        fileinfo

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

WORKDIR /var/www
COPY . .
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV PORT=8000

RUN chown -R www-data:www-data /var/www

USER www-data

ENTRYPOINT [ "Docker/entrypoint.sh" ]

###########################
# Node

FROM node:20 AS node

WORKDIR /var/www
COPY . .

RUN chown -R www-data:www-data /var/www

# RUN npm install -g vite

USER www-data

RUN npm install

RUN npm run build

VOLUME /var/www/node_modules