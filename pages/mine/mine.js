//index.js
//获取应用实例
const fun = require('../../utils/function.js');
const user_id = wx.getStorageSync('user_id');
Page({
  data:{

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	//显示转发
  	wx.showShareMenu({
		  withShareTicket: true
		})
  	var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
  	var _this = this;
  	var url = fun.apiurl("admin/my/index");
  	fun.ajax(url,{user_id:user_id},function(ret){
  		console.log(ret.data.data);
  		if(ret.data.code == 1){
				_this.setData({
					user : ret.data.data,
				})
			}else{
				_this.setData({
					user : 0,
				})
			}
  	})
  },
 	onShow:function(){
 		var user_id = wx.getStorageSync('user_id');
 		var _this = this;
		//检查手机号是否绑定
		if(user_id){
			var url = fun.apiurl("admin/login_run/checkUser");
			fun.ajax(url,{user_id:user_id},function(ret){
	  		if(ret.data.code == '0'){
					//未绑定，跳转绑定页面
					wx.navigateTo({
					  	url: '/pages/register/register',
					})
				}else{
					_this.onLoad();
				}
	  	})
		}
		fun.isMessage();
 	},
 	//点击登录
 	login:function(e){
 		fun.openPage('/pages/power/power');
 	},
 	upnum:function(e){
 		if(!fun.islogin()){return false;}
 		var user_id = wx.getStorageSync('user_id');
 		var url = fun.apiurl("admin/my/getMyUp");
		fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				wx.showToast({
				  title: '您总共获得了'+ret.data.data.count+'个赞',
				  icon : 'none',
				})
			}
  	})
 	},
 	//打开我的农田
 	land:function(e){
 		if(!fun.islogin()){return false;}
 		fun.openPage('/pages/dome/dome');
 	},
 	//打开我的企业
 	company:function(e){
 		if(!fun.islogin()){return false;}
 		fun.openPage('/pages/company/company');
 	},
	//打开相册页面
  photos:function(e){
  	if(!fun.islogin()){return false;}
 		fun.openPage('/pages/photos/photos');
  },
	//打开我的关注
	attention:function(e){
		if(!fun.islogin()){return false;}
 		fun.openPage('/pages/follow/follow');
	},
	//打开我的粉丝
	fans:function(e){
		if(!fun.islogin()){return false;}
 		fun.openPage('/pages/Fans/Fans');
	},
	//打开系统消息
	message:function(e){
		if(!fun.islogin()){return false;}
 		fun.openPage('/pages/xiaoxi/xiaoxi');
	},
	//打开个人信息设置
	means:function(e){
		if(!fun.islogin()){return false;}
		fun.openPage('/pages/means/means?type=my');
	},
	openuser:function(e){
		if(!fun.islogin()){return false;}
		var user_id = wx.getStorageSync('user_id');
		fun.openPage("/pages/user/user?uid="+user_id);
	},
	qecodelist:function(e){
		if(!fun.islogin()){return false;}
		fun.openPage("/pages/qrcodelist/qrcodelist");
	},
	shouhuo:function(e){
		if(!fun.islogin()){return false;}
		fun.openPage("/pages/shouhuo/shouhuo");
	},
})
