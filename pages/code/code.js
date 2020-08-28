const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		array: ['土地1', '土地2', '土地3', '土地4'],
		land : '请选择',
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var _this = this;
		var url = fun.apiurl("admin/apply/applyInfo");
		var urllist = fun.apiurl("admin/login_run/landList");
 		fun.ajax(urllist,{user_id:user_id},function(ret){
 			if(ret.data.code == 1){
				_this.setData({
					array : ret.data.data
				})
			}else{
				console.log(ret);
			}
 		})
		fun.ajax(url,{user_id:user_id,type:3},function(ret){
			if(ret.data.code == 1){
				_this.setData({
					is : 1,
					username : ret.data.data.username,
					phone : ret.data.data.phone,
					land_id : ret.data.data.land_id,
				})
			}
		})
  },
  //选择土地
  changeLand:function(e){
  	var arr = this.data.array;
  	this.setData({
  		land : arr[e.detail.value].crop,
  	})
  },
  //提交表单
  formSubmit:function(e){
  	console.log(e);
		if(!(/^1[3456789]\d{9}$/.test(e.detail.value.phone))) {
		 	wx.showToast({
		 			title:"请输入正确的手机号码",
		 			icon:"none"
		 		});
		 		return false;
		}
		wx.showLoading({title: '请稍等'});
		var _this = this;
		var data = {
			type : 3,
			user_id : user_id,
	  	username : e.detail.value.username,
	  	phone : e.detail.value.phone,
	  	land_id : e.detail.value.land_id,
		}
		var url = fun.apiurl('admin/Apply/apply');
  	fun.ajax(url,data,function(ret){
  		wx.showToast({title:ret.data.msg,icon:'none'});
  		if(ret.data.code == 1){
  			_this.onLoad();
  		}
  		wx.hideLoading()
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
  	
  },
})