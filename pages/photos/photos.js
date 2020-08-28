// pages/register/register.js
const fun = require('../../utils/function.js');
Page({
  onLoad: function (options) {
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	var url = fun.apiurl("admin/my/myPhoto");
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
        photo : ret.data.data,
      });
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //预览图片
  seeImg:function(e){
  	var arr = e.currentTarget.dataset.arr;
  	var img = e.currentTarget.dataset.img;
		wx.previewImage({
		  current: img, // 当前显示图片的http链接
		  urls: arr // 需要预览的图片http链接列表
		})
  },
  goback:function(){
		wx.navigateBack();
  },

})