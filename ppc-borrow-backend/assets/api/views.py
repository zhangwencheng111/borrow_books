# coding:utf-8

from assets.api.serializers import Book_Serializer
from ..models import Book, Borrow_User, Borrow_Record
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from weixin_util.mini_program import code2session_key, auth_sign, get_user_info
from .conf import _code
from assets.models import Borrow_User
from datetime import datetime

def add_user(params, wechat_openid, nickname):
    mobile = params.get("mobile")
    name = params.get("name")
    email = params.get("email")
    if mobile and name and email:
        params.update({"wechat_openid":wechat_openid, "wechat_id":nickname})
        try:
            #print params
            ret = Borrow_User.objects.create(**params)
        except Exception as e:
            print e
            ret = None
        if ret:
            return True
    return False

class register(APIView):
    def post(self, request):
        """
        Toauth页面新增用户
        """        
        data = request.data
        code = data.get("code")
        iv = data.get("iv")
        rawData = data.get("rawData")
        signature = data.get("signature")
        encryptedData = data.get("encryptedData")
        certificationOk = data.get("certificationOk")
        params = data.get("params")
        if code:
            ret = code2session_key(code)
            session_key = ret.get('session_key')
            wechat_openid = ret.get('openid')
            if session_key:
                if auth_sign(session_key, rawData, signature):
                    userinfo = get_user_info(session_key, encryptedData, iv)
                    if userinfo:
                        userinfo = get_user_info(session_key, encryptedData, iv)
                    else:
                        return Response(_code[203])
                    if Borrow_User.objects.filter(wechat_openid=wechat_openid):
                        return Response(_code[204])
                    else:
                        ###
                        if add_user(params, wechat_openid, userinfo.get("nickName")):                            
                            return Response(_code[0])
                        else:
                            return Response(_code[205])
                else:
                    return Response(_code[201])
            else:
                return Response(_code[202])
        else:
            return Response(_code[101])

class auth_user_simple(APIView):
    def post(self, request):
        """
        验证用户openid是否已注册系统
        """
        data = request.data
        code = data.get("code")
        rawData = data.get("rawData")
        signature = data.get("signature")
        if code:
            ret = code2session_key(code)
            session_key = ret.get('session_key')
            wechat_openid = ret.get('openid')
            if session_key:
                if auth_sign(session_key, rawData, signature):                   
                    try:
                        user = Borrow_User.objects.get(wechat_openid=wechat_openid)                        
                    except Exception as e:
                        user = None
                        return Response(_code[206])
                    return Response({"name":user.name, 
                                    "mobile":user.mobile, 
                                    "email":user.email,
                                    "user_uuid":user.uuid if user else "",
                                    "certificationOk":2})
                else:
                    #import pdb; pdb.set_trace()
                    return Response(_code[201])
            else:
                return Response(_code[202])
        else:
            return Response(_code[101])

class auth_user(APIView):
    def post(self, request):
        """
        验证用户openid是否已注册系统
        """
        data = request.data
        code = data.get("code")
        iv = data.get("iv")
        rawData = data.get("rawData")
        signature = data.get("signature")
        encryptedData = data.get("encryptedData")
        if code:
            ret = code2session_key(code)
            session_key = ret.get('session_key')
            wechat_openid = ret.get('openid')
            if session_key:
                if auth_sign(session_key, rawData, signature):
                    userinfo = get_user_info(session_key, encryptedData, iv)
                    if userinfo:
                        userinfo = get_user_info(session_key, encryptedData, iv)
                        try:
                            userinfo.pop("openId")
                        except Exception as e:
                            pass
                        try:
                            userinfo.pop("watermark")
                        except Exception as e:
                            pass
                    else:
                        return Response(_code[203])
                    ret = Borrow_User.objects.filter(wechat_openid=wechat_openid)
                    if ret:
                        user = ret[0]
                        userinfo.update({"certificationOk":2, "user_uuid":user.uuid})
                        return Response(userinfo)
                    else:
                        return Response(userinfo)
                else:
                    return Response(_code[201])
            else:
                return Response(_code[202])
        else:
            return Response(_code[101])
          

class book_action(APIView):
    """
    借书和还书，查询借书日志操作
    """
    def get(self, request):
        '''
        查询借书日志操作
        
          JSON example:
          --
            {"qr_code":"", "token":"1111"}

          --
            {"qr_code":"", "wechat_id":"", "token":"1111"}

          parameters:
          --
            qr_code:
              required: 可选
              type: string
              value: ""
            wechat_id:
              required: 可选
              type: string
              value: ""
            token:
              required: 必选
              type: string
              value: ""                         
        '''

    def post(self, request):
        '''
        借书和还书操作
        '''
        data = request.data
        code = data.get("code")
        qr_code = data.get('qr_code')
        action = data.get('action')
        if code:
            ret = code2session_key(code)
            #session_key = ret.get('session_key')
            wechat_openid = ret.get('openid')
            if wechat_openid:
                ###借书操作
                try:
                    user = Borrow_User.objects.get(wechat_openid=wechat_openid)
                except Exception as e:
                    return Response(_code[207])

                try:
                    book = Book.objects.get(qr_code=qr_code)
                except Exception as e:
                    return Response(_code[208])
                if action == "borrow":
                    if book.can_borrow:
                        try:
                            ret = Borrow_Record.objects.create(
                                borrow_time=datetime.now(),
                                user=user,
                                book=book,
                            )
                        except Exception as e:
                            return Response(_code[211])
                        else:
                            return Response(_code[0])

                    else:
                        return Response(_code[210])
                elif action == "return":
                    if not book.can_borrow:
                        ret = Borrow_Record.objects.filter(
                            user=user,
                            book=book,
                            is_return=False,
                        )
                        if ret:
                            ret.update(
                                is_return=True, 
                                back_time=datetime.now()
                            )
                            return Response(_code[0])
                        else:
                            return Response(_code[212])             
                    else:
                        return Response(_code[212])
                else:
                    return Response(_code[209])
            else:
                return Response(_code[202])
        else:
            return Response(_code[101])

class book_info(APIView):
    """
    返回项目信息以及主机列表.
    """
    def get(self, request):        
        req_data = request.GET.dict()

        if req_data.get("single"):
            req_data.pop("single")
            req_data.pop("code")
            book = Book.objects.get(**req_data)
            serializer = Book_Serializer(book)            
            return Response(serializer.data)
        else:
            books = Book.objects.filter(**req_data)
            serializer = Book_Serializer(books, many=True)
            #print serializer.data       
            return Response(serializer.data)

    def post(self, request):
        # '''
        # 返回书本信息.
        
        #   JSON example:
        #   --
        #     {"env":"性能", "project_name":"ppc-sdk-query", "ip":"172.20.201.51"}

        #   parameters:
        #   --
        #     env:
        #       required: 可选
        #       type: string
        #       value: "测试", "预发布", "生产", "性能", "沙箱"
        #     project_name:
        #       required: 可选
        #       type: string
        #       value: 填写project_name
        #     ip:
        #       required: 可选
        #       type: string
        #       value: 填写主机ip地址                         
        # '''        
        # raw_data = request.data
        # data = {}
        # ###获取数据区
        # env = raw_data.get("env")
        # project_name = raw_data.get("project_name")
        # ip = raw_data.get("ip")
        # ###
        # ###拼装dict区
        # if env:
        #     data.update({'project_type':env})
        # if project_name:
        #     data.update({'project_name':project_name})
        # if ip:
        #     data.update({'lark_group__host__host_name':ip})          
        # ###

        # if data:
        #     projects = Project.objects.filter(**data)
        #     serializer = Project_With_Host_Serializer(projects, many=True)
        #     return Response(serializer.data)
        return Response('请求数据字段为空或不正确', status=status.HTTP_400_BAD_REQUEST)