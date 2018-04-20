//selfInfo.js 个人信息
//获取应用实例
var app = getApp()
Page({
    data: {
       userInfo: {},
       avatarUrl: "",
    },
    onLoad: function () {
        var that = this;
        that.setData({
          userInfo: app.globalData.userInfo,
        })        
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.request({
                url: 'https://' + app.globalData.apiUrl + '/assets/api/auth_user_simple/',
                method: 'POST',
                data: {
                  rawData: app.globalData.rawData,
                  code: res.code,
                  signature: app.globalData.signature,
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if(res.data.name){
                    that.setData({
                      reg_userinfo: res.data,
                      certificationOk: res.data.certificationOk
                    })                    
                  }else{
                    console.log(res)
                    wx.showToast({
                      title: '获取数据失败，请稍后重试！',
                      icon: 'false',
                      duration: 2000
                    })                    
                  }
                },
                fail: function(){
                  wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                  })
                }              
              })
            }
          }
        })

        this.setData({
            loading: false
        })
    },
    onShow: function () {
      this.onLoad()
    },
    toAuth:function(){
        wx.navigateTo({
            url: '../toAuth/toAuth',
        })
    }
})
