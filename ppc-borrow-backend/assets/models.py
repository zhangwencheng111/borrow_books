# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.validators import RegexValidator

import uuid
from django.db import models

class Book(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    create_time = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    qr_code = models.CharField(max_length=100, unique=True)


    @property
    def can_borrow(self):
        if Borrow_Record.objects.filter(book=self, is_return=False):
            return False
        return True

    @property
    def current_user(self):
        ret = Borrow_Record.objects.filter(book=self, is_return=False)
        if ret and ret[0].user:
            return ret[0].user.uuid
        return False        

    def __unicode__(self):
        if self.name:
            return self.name
        else:
            return self.uuid

class Borrow_User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    create_time = models.DateTimeField(auto_now_add=True)
    wechat_id = models.CharField(max_length=50)
    wechat_openid = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=10)
    mobile = models.CharField(max_length=11, blank=True, null=True, validators=[RegexValidator(r'^\d{1,11}$')])
    email = models.EmailField(blank=True, null=True)

    def __unicode__(self):
        return '{0}-{1}'.format(self.name, self.mobile)    

class Borrow_Record(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    create_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(Borrow_User, blank=True, null=True, on_delete=models.SET_NULL)
    book = models.ForeignKey(Book, blank=True, null=True, on_delete=models.SET_NULL)
    borrow_time = models.DateTimeField(blank=True, null=True, verbose_name=u'借书时间')
    back_time = models.DateTimeField(blank=True, null=True, verbose_name=u'还书时间')
    is_return = models.BooleanField(verbose_name=u'是否归还', default=False, choices=((True, '使用中'), (False, '空闲')))

    def __unicode__(self):
        if self.borrow_time:
            borrow_time = self.borrow_time.strftime("%Y-%m-%d %T")
        else:
            borrow_time = 'None'

        return '{0}-{1}-{2}'.format(borrow_time, self.user, self.is_return)