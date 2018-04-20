import WxValidate from '../../utils/WxValidate'
//toAuth.js 认证页面
//获取应用实例

var app = getApp()
Page({
    data: {        
        //认证信息
        name:null,
        tel:null,
        email:null
    },
    onShow: function() {

    },
    onLoad: function () {
        var that = this;
        wx.setNavigationBarTitle({ title: '个人认证' });
        that.initValidate();

        //等待认证获取详情
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '/bookshare?m=home&c=User&a=getUserInfo&id=' + app.globalData.userId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                app.globalData.userInfo = res.data[0];
                that.setData({
                    userInfo: res.data[0],
                    pictureFiles: 'http://'+app.globalData.apiUrl+"/bookshare"+res.data[0]["authPic"],
                    userName: res.data[0]["userName"],
                    phoneNumber: res.data[0]["phoneNumber"],
                    userSchool: res.data[0]["userSchool"],
                    userClass: res.data[0]["userClass"],
                    studentCard: res.data[0]["studentCard"]
                })
                console.log(typeof (that.data.pictureFiles))

            }
        })
    },
    showModal(error) {
      wx.showModal({
        content: error.msg,
        showCancel: false,
      })
    },    
    onReady: function () {
        this.setData({
            loading: false
        })
    },
    initValidate() {
      const rules = {
        name: {
          required: true,
        },        
        email: {
          required: true,
          email: true,
        },
        mobile: {
          required: true,
          tel: true,
        },
      }

      const messages = {
        email: {
          required: '请输入邮箱',
          email: '请输入正确的邮箱',
        },
        mobile: {
          required: '请输入手机号',
          mobile: '请输入正确的手机号',
        },
        name: {
          required: '请输入姓名',
          name: '请输入正确的姓名',
        },
      }
      // 创建实例对象
      this.WxValidate = new WxValidate(rules, messages)
    },
    submitForm(e) {
      const params = e.detail.value

      console.log(params)

      // 传入表单数据，调用验证方法
      if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        this.showModal(error)
        return false
      }
      // 提交认证用户

      wx.getUserInfo({
        success: function (res) {
          if (res.errMsg == "getUserInfo:ok") {
            app.globalData.userInfo = res.userInfo;
            app.globalData.rawData = res.rawData;
            app.globalData.iv = res.iv;
            app.globalData.encryptedData = res.encryptedData;
            app.globalData.signature = res.signature;
            wx.login({
              success: function (res) {
                if (res.code) {
                  //开始认证
                  wx.request({
                    url: 'https://' + app.globalData.apiUrl + '/assets/api/register/',
                    method: 'POST',
                    data: {
                      rawData: app.globalData.rawData,
                      iv: app.globalData.iv,
                      encryptedData: app.globalData.encryptedData,
                      code: res.code,
                      signature: app.globalData.signature,
                      params: params,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      wx.showModal({
                        title: '提示',
                        content: res.data,
                        showCancel: false,
                        success: function (e) {
                          if (e.confirm) {
                            console.log('用户点击确定')
                          } else if (e.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })
                      if (res.data=='success'){
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../self/self',
                          })   
                        },1650
                        )
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail: function (res) {

        },
      })

    },

})
