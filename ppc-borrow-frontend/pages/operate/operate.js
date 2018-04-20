var utils = require('../../utils/util.js');

// pages/home/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
       
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        utils.checkSettingStatu();
  
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 别人的借书申请
     */
    borrowApplication:function(){
        wx.navigateTo({
            url: '../borrowApplication/borrowApplication'
        })
    },

    /**
     * 借入
     */
    borrowIn: function () {
        wx.navigateTo({
            url: '../borrowIn/borrowIn'
        })
    },

    //待归还
    returnBack:function(){
        wx.navigateTo({
            url: '../returnBack/returnBack'
        })
    },

    //收书
    getBook:function(){
        wx.navigateTo({
            url: '../getBook/getBook'
        })
    },

    //图书管理
    bookMan: function () {
        wx.navigateTo({
            url: '../bookMan/bookMan'
        })
    },
    
    screenISBN: function () {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            //已授权 扫描ISBN
            wx.scanCode({
              success: (res) => {
                if (res.errMsg == "scanCode:ok") {
                  //扫描成功
                  if (res.scanType == "QR_CODE") {
                    var bookId = res.result;
                    wx.navigateTo({
                      url: '../detail/detail?bookId=' + bookId,
                    })
                  } else {
                    wx.showToast({
                      title: "二维码错误",
                    })
                  }
                } else {
                  wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                  })
                }
              }
            })
          } else {
            utils.checkSettingStatu();
          }
        }
      })
 
    },

    pilot:function(){
        wx.navigateTo({
            url: '../pilot/pilot'
        })
    },

    openComment: function () {
      wx.navigateTo({
          url: '../joinShare/joinShare'
      })
    },
    detail: function (event) {
      var bookId = event.currentTarget.dataset.bookid;
      //打开详情页
      wx.navigateTo({
        url: '../detail/detail?bookId=' + bookId,
      })
    },

    login: function () {
      var that = this;
      if (that.data.userInfo) {
        if (that.data.certificationOk == 0) {
          wx.showModal({
            title: '认证提醒',
            content: '您还没有认证',
            cancelText: "下次再说",
            cancelColor: "",
            success: function (res) {
              if (res.confirm) {
                if (that.data.certificationOk != 2) {
                  wx.navigateTo({
                    url: '../toAuth/toAuth',
                  })
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }

      }
    },
})