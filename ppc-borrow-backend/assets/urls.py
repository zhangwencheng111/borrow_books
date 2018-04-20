# coding:utf-8

from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/', include('assets.api.urls')),
    url(r'^upload/', views.upload, name='upload'),
]