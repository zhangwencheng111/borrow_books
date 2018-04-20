# -*- coding: utf-8 -*-
import os
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'c3p3s=!@jlqg+0ithmqantacuo0=gj^p$w943om&5intgcunw7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["*"]

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.       
        'NAME': 'bookshelf',  # Or path to database file if using sqlite3.
         'USER': 'bookshelf',
         'PASSWORD': 'bookshelf',  # Not used with sqlite3.
        'HOST': '172.20.201.203',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '3306',  # Set to empty string for default. Not used with sqlite3.
        "OPTIONS": {
            "init_command": "SET foreign_key_checks = 0;",
        },
    },

    # 'slave': {
    #     'ENGINE': 'django.db.backends.mysql',
    #     'NAME': 'salt',
    #     'USER': 'root',
    #     'PASSWORD': 'wanghui',
    #     'HOST': 'localhost',
    #     'PORT': '3306',
    # }
}