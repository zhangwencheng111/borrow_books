var utils = require('../../utils/util.js');

//index.js
//获取应用实例
var screenNum = 3;
var app = getApp()
Page({
    data: {
        cateisShow: false,
        activeNum: 1,
        loading: true,
        bookObj:null,
        search_string:"",
        current_user: null
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onPullDownRefresh: function () {
        //监听页面刷新
        this.onLoad()
        this.setData({
          current_user: app.globalData.user_uuid
        })
        wx.stopPullDownRefresh()
    },

    onLoad: function () {  
        utils.getUserData();      
        var that = this;
        //图书列表数据获取
        wx.request({
          url: 'https://' + app.globalData.apiUrl + '/assets/api/book/',
            method: "GET",
            success: function (res) {
                if (res.statusCode==200){
                  //console.log(res.data)
                  that.setData({                    
                    bookObj: res.data,
                    loading: false
                  })
                }else{
                  wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                  })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
        
    },

    onShow: function () {
      this.onPullDownRefresh()
      
    },
    
    changeTab: function (event) {
        //切换筛选tab
        var num = event.target.dataset.id;
        this.setData({
            activeNum: num
        })
    },



    detail: function (event) {
        var bookId = event.currentTarget.dataset.bookid;
        //打开详情页
        wx.navigateTo({
            url: '../detail/detail?bookId=' + bookId,
        })
    },
    
    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    searchBOOK: function() {

        //if (!this.data.search_string) return false;
        var that = this;
        //图书列表数据获取
        wx.request({
          url: 'https://' + app.globalData.apiUrl + '/assets/api/book/?name__icontains=' + this.data.search_string,
          method: "GET",
          success: function (res) {
            that.setData({
              bookObj: res.data,
              loading: false
            })
          },
          fail: function () {
            wx.showToast({
              title: '获取数据失败，请稍后重试！',
              icon: 'false',
              duration: 2000
            })
          }
        })


    },
    input_search_string: function(event) {
      //输入书名的搜索字段
      var search_str = event.detail.value;
      this.setData({
        search_string: search_str
      });
      this.searchBOOK()
    },    
})
