// pages/register/register.js
const fun = require('../../utils/function.js');
const user_id = wx.getStorageSync('user_id');
Page({
  /**
   * 页面的初始数据
   */
  data: {
		disabled : false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var _this = this;
  	var url = fun.apiurl("admin/healthy/getone");
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
					disabled : true,
					value : ret.data.data.ask_2,
				})
				var setdata = {};
				if(ret.data.data.ask_1 == 1){
					setdata.ask_1_1 = true;
				}
				if(ret.data.data.ask_1 == 2){
					setdata.ask_1_2 = true;
				}
				if(ret.data.data.ask_1 == 3){
					setdata.ask_1_3 = true;
				}
				if(ret.data.data.ask_3 == 1){
					setdata.ask_3_1 = true;
				}
				if(ret.data.data.ask_3 == 2){
					setdata.ask_3_2 = true;
				}
				if(ret.data.data.ask_3 == 3){
					setdata.ask_3_3 = true;
				}
				if(ret.data.data.ask_3 == 4){
					setdata.ask_3_4 = true;
				}
				if(ret.data.data.ask_4 == 1){
					setdata.ask_4_1 = true;
				}
				if(ret.data.data.ask_4 == 2){
					setdata.ask_4_2 = true;
				}
				_this.setData(setdata);
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //提交
 	formSubmit:function(res){
 		var url = fun.apiurl("admin/healthy/index");
 		var data = {
				user_id: user_id,
				ask_1 : res.detail.value.ask_1,
				ask_2 : res.detail.value.ask_2,
				ask_3 : res.detail.value.ask_3,
				ask_4 : res.detail.value.ask_4,
		};
 		var _this = this;
 		fun.ajax(url,data,function(ret){
 			if(ret.data.code == 1){
				wx.showToast({
				  title: '提交成功',
				  icon: 'success',
				  duration: 1000,
				  success:function(res){
				  	_this.onLoad();
				  }
				})
			}else{
				wx.showToast({
				  title: ret.data.msg,
				  icon: 'none',
				  duration: 1000,
				})
				console.log(ret.data.msg)
			}
 		})
 	},
  goback:function(){
		wx.navigateBack();
  },
 
})