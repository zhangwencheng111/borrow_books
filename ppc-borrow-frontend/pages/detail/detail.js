// 获取全局应用程序实例对象
const app = getApp()
var utils = require('../../utils/util.js');
// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        qr_code: "",
        bookInfo: null,
        cateisShow:false,
        userInfo: null,
        current_user: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
      this.setData({
        qr_code: params.bookId,
        current_user: app.globalData.user_uuid
      })
    },
  
    onShow: function (params) {
        let that = this;
        console.log(that.data) 
        utils.checkSettingStatu();
        wx.login({
          success: function (res) {
            if (res.code){
              wx.request({
                url: 'https://' + app.globalData.apiUrl + '/assets/api/book/' + '?qr_code=' + that.data.qr_code,
                method: "GET",
                data: {
                  code: res.code,
                  single: true
                },
                success: function(res){
                  //console.log(res)
                  if (res.statusCode != 200) {
                    wx.showModal({
                      title: 'sorry',
                      content: '该书没有进行登记或者资产编号错误',
                      showCancel: false,
                      success: function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    })
                    that.setData({
                      loading: false,
                    })
                  }
                  if(res.data.name){
                    that.setData({
                      loading: false,
                      bookInfo: res.data,
                      userInfo: app.globalData.userInfo,                      
                    })
                  } 
                }
              })
            }

            
            
          }
        })        
    },

    onUnload: function () {
      wx.switchTab({
        url: '../index/index'
      })

    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        // TODO: onPullDownRefresh
        var params = this.data.params;
        this.onLoad(params);
        wx.stopPullDownRefresh()
    },

    onShareAppMessage() {
        return {
            title: this.data.bookInfo.book_name,
            desc: this.data.introduction,
            path: '/pages/detail/detail?canShareId=' + this.data.canShareId
        }
    },

    borrowBook: function (e) {
        //借书
        var that = this;
        var canShareId = that.data.canShareId;
        var book_type = that.data.book_type;
        var checkStatus = that.data.bookInfo.protect;//信息保护
        //C2C借书
        if (that.data.bookInfo.can_borrow == 1) {
            //开启信息保护
            that.togglePtype();
        } else {

        }

    },

    returnBook: function (e) {
      if (this.data.current_user != this.data.bookInfo.current_user){
          wx.showModal({
            title: '这书不是你借的',
            showCancel: false,
          });
          return false;
       }
      var that = this;
      wx.login({
        success: function (res) {
          if (res.errMsg == "login:ok") {
            wx.request({
              url: 'https://' + app.globalData.apiUrl + '/assets/api/book_action/',
              method: "POST",
              data: {
                code: res.code,
                qr_code: that.data.bookInfo.qr_code,
                action: "return",
              },
              success: function (res) {
                wx.showToast({
                  title: res.data,
                  icon: 'false',
                  duration: 1000,
                  complete: function () {
                    if (res.data == 'success') {
                      setTimeout(function () {
                        wx.navigateBack({})
                      }, 1000
                      )
                    }
                  }                  
                })
              }
            })
          }
        }
      })

    },

    affirmBorrowBook: function (e) {
        var that = this;
        wx.login({
          success:function(res){
            if (res.errMsg =="login:ok"){
              wx.request({
                url: 'https://' + app.globalData.apiUrl + '/assets/api/book_action/',
                method: "POST",
                data: {
                  code:res.code,
                  qr_code: that.data.bookInfo.qr_code,
                  action: "borrow",      
                },
                success:function(res){
                  wx.showToast({
                    title: res.data,
                    icon: 'false',
                    duration: 1000,
                    complete:function(){
                      if (res.data == 'success'){
                          setTimeout(function(){
                            wx.navigateBack({})
                          },1000
                        )
                      }
                    }
                  })
                }
              })
            }
          }
        })
        
    },

    //打开读书卡片页面
    writeCard: function () {
        var that = this
        //添加至public_booklist 我看过的
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    that.setData({
                        haveRead:1
                    })
                    wx.navigateTo({
                        url: '../cardDetail/cardDetail?book_id=' + that.data.bookInfo.book_id,
                    })
                    wx.showToast({
                        title: '添加成功！',
                        icon: 'false',
                        duration: 2000
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您也添加过！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '添加失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    //取消我看过的
    cancelSeen: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消看过吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=1",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'false',
                                    duration: 2000
                                })
                                that.setData({
                                    haveRead: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    icon: 'false',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                icon: 'false',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })

    },

    //添加志public_booklist 我喜欢的
    addLove: function () {
        var that = this
        //添加至public_booklist 我看过的
        wx.request({
            url: 'https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=addSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '成功添加至喜欢！',
                        icon: 'false',
                        duration: 2000
                    })
                    that.setData({
                        haveLoved: 1
                    })
                } else if (res.data == "haveAdded") {
                    wx.showToast({
                        title: '您已添加过！',
                        icon: 'false',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '添加失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
    },

    //取消喜欢
    cancelLove: function () {
        var that = this
        wx.showModal({
            title: '通知',
            content: '您确定要取消喜欢吗？（取消可能会错过信息哦）',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: 'https://' + app.globalData.apiUrl + '/bookshare?m=home&c=Api&a=cancelSeenBook&user_id=' + app.globalData.userId + "&book_id=" + that.data.bookInfo.book_id + "&type=2",
                        method: "GET",
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showToast({
                                    title: '取消成功！',
                                    icon: 'false',
                                    duration: 2000
                                })
                                that.setData({
                                    haveLoved: 0
                                })
                            } else {
                                wx.showToast({
                                    title: '取消失败',
                                    icon: 'false',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function () {
                            wx.showToast({
                                title: '取消失败，请稍后重试！',
                                icon: 'false',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })
    },
})
