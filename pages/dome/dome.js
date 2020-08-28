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
 	//编辑土地
 	editLand:function(e){
 		var id = e.currentTarget.dataset.id;
 		fun.openPage('/pages/message/message?id='+id);
 	},
 	//添加土地
 	addLand:function(){
 		fun.openPage('/pages/message/message');
 	},
 	//删除
  bindlongpress:function(e){
  	var user_id =  wx.getStorageSync('user_id');
  	var id = e.currentTarget.dataset.id;
  	var _this = this;
  	wx.showActionSheet({
		  itemList: ['删除'],
		  itemColor:'red',
		  success (res) {
		    wx.showModal({
				  title: '提示',
				  content: '确定删除？',
				  confirmColor:'red',
				  success (res) {
				    if (res.confirm) {
				    	var url = fun.apiurl("admin/login_run/deleteLand");
				    	fun.ajax(url,{user_id : user_id,land_id : id},function(ret){
				    		if(ret.data.code == 1){
									wx.showToast({
									  title: '删除成功',
									  icon: 'success',
									  duration: 1000,
									  success:function(res){
									  	_this.onShow();
									  }
									})
								}else{
									console.log(ret);
								}
				    	})
				    }
				  }
				})
		  },
		})
  },
  complete:function(){
  	wx.switchTab({
		  url: '/pages/farmland/farmland'
		})
  }
})