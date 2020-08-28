const fun = require('../../utils/function.js');
Page({
 	onShow:function(){
 		var user_id =  wx.getStorageSync('user_id');
 		var _this = this;
 		var url = fun.apiurl("admin/login_run/landList");
 		fun.ajax(url,{user_id:user_id},function(ret){
 			if(ret.data.code == 1){
				_this.setData({
					list : ret.data.data
				})
			}else{
				console.log(ret);
			}
 		})
 	},
 	goback:function(){
		wx.navigateBack();
  },
	qrcode:function(e){
		var land_id = e.currentTarget.dataset.id;
		fun.openPage("/pages/qrcode/qrcode?landid="+land_id);
	},
})