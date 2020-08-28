const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		tishi : '我也是有底线的',
		nothing : 'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var user_id = wx.getStorageSync('user_id');
		var _this = this;
		var url = fun.apiurl("admin/my/message");
		fun.ajax(url,{user_id:user_id},function(ret){
			if(ret.data.code == 1){
				if(ret.data.data.data.length != 0){
					_this.setData({
            message : ret.data.data.data,
            current_page : ret.data.data.current_page,
            last_page : ret.data.data.last_page,
            dixian : "none",
          });
				}else{
					_this.setData({
            message : ret.data.data.data,
            current_page : ret.data.data.current_page,
            last_page : ret.data.data.last_page,
            nothing : 'block',
          });
				}
				var readurl = fun.apiurl('admin/my/messageToRead');
				fun.ajax(readurl,{user_id:user_id});
			}else{
				console.log(ret.data.msg)
			}
		})
  },
	goback:function(){
		wx.navigateBack();
  },
	//下拉刷新
  onPullDownRefresh:function(){
  	this.onLoad();
  	wx.stopPullDownRefresh();
  },
  //上拉触底
  onReachBottom:function(){
  	var current_page = this.data.current_page;
  	var last_page = this.data.last_page;
  	var search = this.data.search;
  	var _this = this;
	if(current_page < last_page){
		var url = fun.apiurl("admin/my/message");
		fun.ajax(url,{user_id:user_id,page:parseInt(current_page)+1},function(ret){
			if(ret.data.code == 1){
				for(var i=0;i<ret.data.data.length;i++){
					_this.data.message.push(ret.data.data.data[i]);
				}
				var message = _this.data.message;
				_this.setData({
	        message:message,
	        current_page : ret.data.data.current_page,
	        last_page : ret.data.data.last_page,
	      });
			}else{
				console.log(ret.data.msg)
			}
		})
	}else{
		_this.setData({
			dixian : "block",
   	 	tishi : '我也是有底线的'
		})
	}
  },
})