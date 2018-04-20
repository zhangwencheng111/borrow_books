# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from assets.models import Book
import xlrd
from django.shortcuts import render
from django.http import HttpResponse
import uuid
from django.http import JsonResponse


def index(request):
    return render(request, "assets/index.html")
    #return HttpResponse("Hello, world. You're at the polls index123.")


def upload(request):
    #获取编号
    code_book = Book.objects.all()
    book_list = [i.qr_code for i in code_book]
    # 请求方法为POST时,进行处理;
    if request.method == "POST":
        # 获取上传的文件,如果没有文件,则默认为None;
        File = request.FILES.get("excel", None)
        context = {"status": 200, "message": "ok"}              #json
        if File is None:
            return HttpResponse("no files for upload!")
        else: 
            # 打开特定的文件进行二进制的写操作;
            with open("/tmp/%s" % File.name, 'wb+') as f:
                # 分块写入文件;
                for chunk in File.chunks():
                    f.write(chunk)
            data = xlrd.open_workbook('/tmp/{}'.format(File.name))
            table = data.sheets()[0]
            rows = table.nrows
            for i in range(2, rows):
                #print table.row_values(i)[0].decode("UTF-8")
                #print table.row_values(i)[1].decode("UTF-8")
                name = table.row_values(i)[1].decode("UTF-8")
                book_code = table.row_values(i)[0].decode("UTF-8")
                if book_code not in book_list:
                    Book.objects.get_or_create(name=name, qr_code=book_code, uuid=uuid.uuid4())
                    context[book_code] = "ok"
                else:
                    context[book_code] = "error"
                    context["message"] = "error"
            print context
            return JsonResponse(context)