const fun = require('../../utils/function.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
		
  },
  onLoad:function(){
  	wx.getSetting({
		    success: res => {
		    	var user_id = wx.getStorageSync('user_id');
	      	if(res.authSetting['scope.userInfo'] && user_id != '' ){
		      	wx.switchTab({
						  	url: '/pages/index/index',
						})
	      	}
		    }
	  })
  },
  bindGetUserInfo: function(res) {
    if(res.detail.userInfo) {
			// 登录
			wx.login({
				success: function(code) {
					if(code.code) {
						var code = code.code;
						var url = fun.apiurl('admin/login/xaddUser');
						var data = {
								code: code,
								image:res.detail.userInfo.avatarUrl,
								nickname:res.detail.userInfo.nickName
						};
						fun.ajax(url,data,function(ret){
							if(ret.data.code == 1){
								wx.setStorageSync('user_id', ret.data.data);
								wx.switchTab({
								  	url: '/pages/index/index',
								})
							}else{
								wx.showToast({
						 			title:ret.data.msg,
						 			icon:"none"
						 		});
							}
						})
					}
				}
			})
    }else {
      wx.switchTab({
			  	url: '/pages/index/index',
			})
    }
  }
 
})