# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Book, Borrow_User, Borrow_Record

# Register your models here.
admin.site.register(Book)
admin.site.register(Borrow_User)
admin.site.register(Borrow_Record)