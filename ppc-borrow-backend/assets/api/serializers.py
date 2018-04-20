# coding:utf-8

from rest_framework import serializers
from ..models import Book, Borrow_User, Borrow_Record

class Book_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["name", "qr_code", "can_borrow", "current_user"]
        depth = 0
    # def __init__(self, *args, **kwargs):
    #     super(Lark_Group_Serializer, self).__init__(*args, **kwargs)
    #     self.fields.pop('project')
    #     #import pdb; pdb.set_trace()