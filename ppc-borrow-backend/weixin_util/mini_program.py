# -*- coding: utf-8 -*-
from weixin import WXAPPAPI
from bookshelf.settings import appid, appsecret
from WXBizDataCrypt import WXBizDataCrypt
from hashlib import sha1

def code2session_key(code):

    api = WXAPPAPI(appid=appid, app_secret=appsecret)
    try:
        return api.exchange_code_for_session_key(code)
    except Exception as e:
        #import pdb; pdb.set_trace()
        return e.__dict__

def auth_sign(session_key, rawData ,signature): #验证用户签名是否正确
    #print session_key,rawData,signature
    if rawData and session_key and signature == sha1(rawData + session_key).hexdigest():
        return True
    else:
        return False

def get_user_info(sessionKey, encryptedData, iv):
    wx = WXBizDataCrypt(appid, sessionKey)
    try:
        ret = wx.decrypt(encryptedData, iv)
    except Exception as e:
        ret = {}
    return ret

if __name__ == '__main__':
    import sys, django
    django.setup()
    if len(sys.argv)<2:
        print 'plz give an argv'
        sys.exit(1)
    print code2session_key(sys.argv[1])

    