// pages/register/register.js
const fun = require('../../utils/function.js');
Page({
  onLoad: function (options) {
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	var url = fun.apiurl("admin/login_run/getInfo");
  	//获取头像和昵称
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
					pic : ret.data.data.image,
					nickname:ret.data.data.nickname
				})
			}else{
				console.log(ret);
			}
  	})
  },
  onShow:function(e){
  	var url = fun.apiurl('admin/my/isSms');
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
  			_this.setData({
  				sendSms : '',
  				jishi : 'jishi',
  				s : ret.data.data.s,
  				sms : ret.data.data.sms,
  				phone : ret.data.data.phone,
  			})
  			_this.onShow();
  		}else{
  			_this.setData({
  				sendSms : 'sendSms',
  				jishi : '',
  				s : '获取验证码',
  			})
  		}
  	})
  },
  addinput:function(e){
		this.setData({
			phone : e.detail.value
		})
  },
  sendSms:function(e){
  	var user_id = wx.getStorageSync('user_id');
  	var phone = e.currentTarget.dataset.phone;
  	if(!(/^1[3456789]\d{9}$/.test(phone))) {
  	 	wx.showToast({
	 			title:"请输入正确的手机号码",
	 			icon:"none"
	 		});
	 		return false;
  	}
  	var _this = this;
  	var url = fun.apiurl("admin/my/sendSms");
  	fun.ajax(url,{user_id:user_id,phone:phone},function(ret){
  		if(ret.data.code == 1){
  			wx.showToast({title:"发送成功",icon:"none"});
  			_this.onShow();
  		}
  	})
  },
 	formSubmit: function(ret){
 		var user_id = wx.getStorageSync('user_id');
  	var phone = ret.detail.value.phone;
  	var code = ret.detail.value.code;
  	if(!(/^1[3456789]\d{9}$/.test(phone))) {
  	 	wx.showToast({
	 			title:"请输入正确的手机号码",
	 			icon:"none"
	 		});
	 		return false;
  	}
  	if(phone != this.data.phone){
  		wx.showToast({title:"手机号不匹配，请检查",icon:"none"});
  		return false;
  	}
  	if(code != this.data.sms){
  		wx.showToast({title:"验证码不正确",icon:"none"});
  		return false;
  	}
  	var url = fun.apiurl("admin/login_run/bindingPhone");
  	fun.ajax(url,{user_id:user_id,phone:phone},function(ret){
  		if(ret.data.code == 1){
				wx.showToast({
				  title: ret.data.msg,
				  icon: 'success',
				  duration: 1000,
				  success:function(res){
				  	setTimeout(function(){
				  		wx.redirectTo({
				  			url:'/pages/means/means'
				  		})
				  	},1000)
				  }
				})
			}else{
				wx.showToast({
		 			title:ret.data.msg,
		 			icon:"none"
		 		});
			}
  	})
  },
  goback:function(){
		wx.switchTab({
		  url: '/pages/index/index'
		})
  }
})