// pages/follow/follow.js
const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({
   //页面的初始数据
  data: {
		dixian:"none",
  },
	//头像错误时
  touerror:function(e){
  	var data = this.data.data;
  	data[e.currentTarget.dataset.index].image = '../../image/tou.png';
		this.setData({
			data : data
		})
  },
  //打开个人主页
  oepnuser:function(e){
  	var user_id = e.currentTarget.dataset.userid;
  	fun.openPage("/pages/user/user?uid="+user_id);
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
		var _this = this;
		var url = fun.apiurl("admin/my/myFans");
		fun.ajax(url,{user_id:user_id},function(ret){
			if(ret.data.code == 1){
				_this.setData({
					data : ret.data.data.data,
					current_page : ret.data.data.current_page,
        			last_page : ret.data.data.last_page,
        			search : '',
				})
			}
		})
  },
  //加关注
  addFans:function(e){
  	var usersid = e.currentTarget.dataset.userid;
  	var index = e.currentTarget.dataset.index;
  	var _this = this;
  	var url = fun.apiurl("admin/blog/addFollow");
  	fun.ajax(url,{user_id : user_id,focus_user_id : usersid},function(ret){
  		if(ret.data.code == 1){
				var data = _this.data.data;
				data[index].is_fans = 1;
				_this.setData({
					data : data
				})
				wx.showToast({title:'已关注',icon:'none'});
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //取消关注
  delFans:function(e){
  	var usersid = e.currentTarget.dataset.userid;
  	var index = e.currentTarget.dataset.index;
  	var _this = this;
  	var url = fun.apiurl("admin/blog/deleteFollow");
  	fun.ajax(url,{user_id : user_id,focus_user_id : usersid},function(ret){
  		if(ret.data.code == 1){
				var data = _this.data.data;
				data[index].is_fans = 0;
				_this.setData({
					data : data
				})
				wx.showToast({title:'已取消',icon:'none'});
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //上拉触底
  onReachBottom:function(){
  	var current_page = this.data.current_page;
  	var last_page = this.data.last_page;
  	var search = this.data.search;
  	var _this = this;
  	if(current_page < last_page){
  		var url = fun.apiurl("admin/my/myFans");
  		var data = {
					user_id: user_id,
					page : parseInt(current_page)+1,
					search : search != '' ? search : ''
			}
  		fun.ajax(url,data,function(ret){
  			if(ret.data.code == 1){
					for(var i=0;i<ret.data.data.data.length;i++){
						_this.data.data.push(ret.data.data.data[i]);
					}
					var data = _this.data.data;
					_this.setData({
            data:data,
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
  		})
  	}
  },
  search:function(ret){
  	var _this = this;
  	var search = ret.detail.value.search;
  	var url = fun.apiurl("admin/my/myFans");
  	fun.ajax(url,{user_id:user_id,search:search},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
					data : ret.data.data.data,
					current_page : ret.data.data.current_page,
        last_page : ret.data.data.last_page,
        search : search,
				})
			}
  	})
  },
  goback:function(){
		wx.navigateBack();
  },
})