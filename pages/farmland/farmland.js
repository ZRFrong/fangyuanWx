var bmap = require('../../utils/bmap-wx.min.js');
var util = require('../../utils/util.js');
var fun = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [],
    li_show: 'none',
    isSocket: 0,
    dis: 1,
    nones: 'block',
    value: '',
    is_auto:1,

    shed: 7, //运行的棚的数量
    items: [{
        name: '大棚一',
        value: '1',
        
      },
      {
        name: '大棚二',
        value: '2'
      },
      {
        name: '大棚三',
        value: '3'
      },
      {
        name: '大棚四',
        value: '4'
      },
      {
        name: '大棚五',
        value: '5'
      },
      {
        name: '大棚六',
        value: '6'
      },
      {
        name: '大棚七',
        value: '7'
      },
    ],


    list: false,
    select: false, //选择大棚
    change_ping: false,
    checkall: false,
    batchIds: '', //选中的ids
    checked:'',
    fertilizer_name:'A肥',//肥料名称
    standing_crop:'100L',//肥料现有量
    concentration:'50',//肥料浓度



  },


  //点击展开闭合设备
  clickButtton: function(e) {
    console.log(e, '设备')
    var show = e.currentTarget.dataset.show;
    var id = e.currentTarget.dataset.id;
    // var user_id = wx.getStorageSync('user_id');
    // user_id = !user_id ? -1 : user_id;
    // var url = fun.apiurl("admin/wisdom/goToIquire");
    // fun.ajax(url, {
    //   user_id: user_id,
    //   code: 'pisitai-00022-dapeng_01'
    // }, function(ret) {
    //   console.log(ret, '......');
      
    // })

    //点击展开闭合设备自动开启通风
    var url = fun.apiurl("admin/wisdom/index");
    var data = {
      user_id: wx.getStorageSync('user_id'),
      code: e.currentTarget.dataset.code,
      // 这个  操作指令  1,244，255，00   开     1,244，00，00 关 goToIquire
      command: '1,244,255,0',
      product_type: 1,
      crop_id: e.currentTarget.dataset.cropid,
      action_id: e.currentTarget.dataset.actionid,
      eid: e.currentTarget.dataset.eid,
      land_id: e.currentTarget.dataset.landid,
      action_content_id: e.currentTarget.dataset.action_content_id,
    }
    var that = this;
    fun.ajax(url, data, function (ret) {
       console.log(ret,'通风')
      if (ret.data.code == 1) {
         
      }
    })
   



    if (show == 'none') {
      this.data.data[id].show = 'block';
    } else {
      this.data.data[id].show = 'none';
    }
    var data = this.data.data;
    this.setData({
      data: data,
    })
    console.log(data, '二氧化碳的接口找不到')
  },
  //打开二维码
  qrcode: function(e) {
    console.log(e, '打开二维码')
    var land_id = e.currentTarget.dataset.landid;
    fun.openPage("/pages/qrcode/qrcode?landid=" + land_id);
  },
  //操作设备
  move: function(e) {
    var data = {
      user_id: wx.getStorageSync('user_id'),
      code: e.currentTarget.dataset.code,
      // 这个  操作指令  1,244，255，00   开     1,244，00，00 关 goToIquire
      command: e.currentTarget.dataset.command,
      product_type: 1,
      crop_id: e.currentTarget.dataset.cropid,
      action_id: e.currentTarget.dataset.actionid,
      eid: e.currentTarget.dataset.eid,
      land_id: e.currentTarget.dataset.landid,
      action_content_id: e.currentTarget.dataset.action_content_id,
    }
    var thisid = e.currentTarget.dataset.thisid;
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var indexss = e.currentTarget.dataset.indexss;
    var _this = this;
    var action_name = e.currentTarget.dataset.msg;
    var command_name = e.currentTarget.dataset.msgs;
    var command = e.currentTarget.dataset.command;
    var closeid = e.currentTarget.dataset.closeid;
    var user_id = wx.getStorageSync('user_id');
    var url = fun.apiurl("admin/wisdom/useEquipment");
    wx.showModal({
      title: '提示',
      content: '确定执行【' + action_name + '】的【' + command_name + '】操作吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
            mask: true
          })
          fun.ajax(url, data, function(ret) {
            if (ret.data.code == 1) {
              setTimeout(function() {
                wx.hideLoading();
                wx.showToast({
                  title: '操作成功'
                });
              }, 1000)

            } else {
              wx.hideLoading();
              wx.showToast({
                title: '失败'
              })
              console.log(ret);
            }
          })
        }
      }
    })
  },
  // 施肥
  fertilize() {
    console.log('施肥')
    var that = this;
    this.setData({
      list: (!that.data.list)
    })
  },
  //自动切换手动
  change_automatic() {
    this.setData({
      manual: true,
      automatic: false

    })
    console.log('自动切换成手动')
  },
  //手动切换自动
  change_manual() {
    this.setData({
      manual: false,
      automatic: true

    })
    console.log('手动切换成自动')
  },
  //点击箭头显示大棚数量
  select() {
    var that = this;
    console.log('点击显示')
    this.setData({
      select: (!that.data.select)
    })
  },

  change_ping: function(e) {
    console.log('瓶子')
    this.setData({
      change_ping: true
    })
  },

  change_detail:function(e){
    
     this.setData({
      change_ping:false,
      fertilizer_name:e.detail.value.name,
      standing_crop:e.detail.value.standing_crop
     })
  },

  //隐藏模态对话框

  hideModal: function() {
    this.setData({
      change_ping: false
    });
  },

  //全选施肥
  checkall: function(e) {
    console.log(e)
    var that = this;
    var arr = []; //存放选中id的数组
    console.log(that.data.items[0]);
    for (let i = 0; i < that.data.items.length; i++) {

      that.data.items[i].checked = (!that.data.checkall)

      if (that.data.items[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(that.data.items[i].value.split(','));
      }
    }
    console.log(arr)
    that.setData({
      items: that.data.items,
      checkall: (!that.data.checkall),
      batchIds: arr,
      checked:''
    })
  },

  //选择大棚
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e)
    var value = e.detail.value;
    console.log(value,'111111111')

    this.setData({
      checked:value
    })
    
  },
  //确定施肥
  fertilize_start: function(e) {
    var that = this;
    console.log(that.data.checked,'选中后的新数组')
    if (that.data.checked.length || that.data.batchIds.length) {
      wx.showModal({
        title: '提示',
        content: '确定要开始施肥吗',
        success(res) {
          if (res.confirm) {
            console.log(res, '用户点击确定')
            that.setData({
              list: false,
            })
            wx.showToast({
              title: '操作成功'
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '至少选择一个大棚',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }

    that.setData({
      checked:''
    })

  },












  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user_id = wx.getStorageSync('user_id');
    user_id = !user_id ? -1 : user_id;
    var _this = this;
    //banner图
    var url = fun.apiurl("admin/wisdom/getBanner");
    fun.ajax(url, {
      user_id: user_id,
      slide_id: 1
    }, function(ret) {
      if (ret.data.code == 1) {
        var imageUrls = [];
        var imagebind = [];
        for (var i = 0; i < ret.data.data.length; i++) {
          imageUrls[i] = ret.data.data[i];
        }
        _this.setData({
          imageUrls: imageUrls,
        })
      } else {
        console.log(ret);
      }
    })
  },
  //打开banner跳转
  swipclick: function(e) {
    if (e.currentTarget.dataset.url != '') {
      fun.openPage(e.currentTarget.dataset.url);
    }
  },
  //生命周期函数--监听页面显示
  onShow: function() {
    //天气预报
    var user_id = wx.getStorageSync('user_id');
    user_id = !user_id ? -1 : user_id;
    var _this = this;
    var BMap = new bmap.BMapWX({
      ak: 'QHgOjw296YGpe5PLLCnh61mfzGSBNkit'
    });
    BMap.regeocoding({
      success: function(ret) {
        _this.setData({
          city: ret.originalData.result.addressComponent.city
        })
      },
    });
    BMap.weather({
      success: function(ret) {
        var temperature = ret.currentWeather[0].date.split('：');
        temperature = temperature[1].split(')');
        _this.setData({
          temperature: temperature[0],
          pm: ret.currentWeather[0].pm25,
          win: ret.currentWeather[0].wind,
        })
      }
    });
    var url = fun.apiurl("admin/wisdom/index");
    fun.ajax(url, {
      user_id: user_id
    }, function(ret) {
      console.log(ret, '?????????');
      if (ret.data.code == 1) {
        if (ret.data.data.land.length == 0) {
          _this.setData({
            nones: 'block'
          })
        } else {
          _this.setData({
            nones: 'none'
          })
        }
        var lishow = [];
        for (var i = 0; i < ret.data.data.land.length; i++) {
          ret.data.data.land[i].show = 'none';
        }
        _this.setData({
          data: ret.data.data.land
        })
      } else {
        console.log(ret);
      }
    })
    fun.isMessage();
  },
  //开始溯源
  source_start: function(e) {
    wx.showModal({
      title: '提示',
      content: '确认要开始此操作？',
      success(res) {
        if (res.confirm) {
          var user_id = wx.getStorageSync('user_id');
          var data = {
            user_id: user_id,
            type: 1,
            land_id: e.currentTarget.dataset.landid,
            company_id: 0,
            crop_id: e.currentTarget.dataset.cropid,
            eid: 0,
            action_id: e.currentTarget.dataset.actionid,
            action_content_id: 0,
          }
          var url = fun.apiurl("admin/wisdom/useSource");
          fun.ajax(url, data, function(ret) {
            if (ret.data.code == 1) {
              wx.showToast({
                title: '操作成功'
              });
            } else {
              wx.showToast({
                title: ret.data.msg,
                icon: 'none'
              });
              console.log(ret);
            }
          })
        }
      }
    })
  },
  openaddland: function(e) {

    var user_id = wx.getStorageSync('user_id');
    if (!fun.islogin()) {
      return false;
    }
    fun.openPage("/pages/dome/dome");
  },
})