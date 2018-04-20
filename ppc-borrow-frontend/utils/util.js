function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

module.exports = {
    formatTime: formatTime,
    
    // 是否为空对象
    isEmptyObject: function (e) {

        var t;

        for (t in e)

            return !1;

        return !0

    },

    // 检测授权状态
    checkSettingStatu: function (cb) {

        var that = this;
        var param = cb;
        // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒

        wx.getSetting({

            success: function success(res) {

                console.log(res.authSetting);

                var authSetting = res.authSetting;

                if (that.isEmptyObject(authSetting)) {

                    console.log('首次授权');

                } else {

                    console.log('不是第一次授权', authSetting);

                    // 没有授权的提醒

                    if (authSetting['scope.userInfo'] === false) {

                        wx.showModal({

                            title: '用户未授权',

                            content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',

                            showCancel: false,

                            success: function (res) {

                                if (res.confirm) {

                                    console.log('用户点击确定')

                                    wx.openSetting({

                                        success: function success(res) {
                                            that.getUserData(param)

                                        }

                                    });

                                }

                            }

                        })

                    }

                }

            }

        });

    },

    //获取个人信息
    getUserData: function (el){
      var app = getApp();
      wx.getUserInfo({
        success: function (res) {
          if (res.errMsg == "getUserInfo:ok"){
            app.globalData.userInfo = res.userInfo;
            app.globalData.rawData = res.rawData;
            app.globalData.iv = res.iv;
            app.globalData.encryptedData = res.encryptedData;
            app.globalData.signature = res.signature;
            wx.login({
              success: function (res) {
                if (res.code){
                  //开始认证
                  wx.request({
                    url: 'https://' + app.globalData.apiUrl + '/assets/api/auth_user/',
                    method: 'POST',
                    data: {
                      rawData: app.globalData.rawData,
                      iv: app.globalData.iv,
                      encryptedData: app.globalData.encryptedData,
                      code: res.code,
                      signature: app.globalData.signature,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      if(res.data.nickName){
                        app.globalData.userInfo=res.data
                        app.globalData.user_uuid = res.data.user_uuid;
                      }
                      if (res.data.certificationOk == 2){                       
                        app.globalData.certificationOk = 2
                      }
                    }
                  })
                }    
              }
            })
          }
        },
        fail: function (res){

        },
      })
    },
    UpdateUserData: function (el) {
      var app = getApp();
      wx.getUserInfo({
        success: function (res) {
          if (res.errMsg == "getUserInfo:ok") {
            app.globalData.userInfo = res.userInfo;
            app.globalData.rawData = res.rawData;
            app.globalData.iv = res.iv;
            app.globalData.encryptedData = res.encryptedData;
            app.globalData.signature = res.signature;
          }
        },
        fail: function (res) {

        },
      })
    }    
}


