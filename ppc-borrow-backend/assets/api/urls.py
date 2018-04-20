# coding:utf-8

from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^book/', views.book_info.as_view()),
    url(r'^auth_user/', views.auth_user.as_view()),
    url(r'^auth_user_simple/', views.auth_user_simple.as_view()),
    url(r'^book_action/', views.book_action.as_view()),
    url(r'^register/', views.register.as_view()),
]