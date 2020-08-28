// pages/register/register.js
const fun = require('../../utils/function.js');
const user_id = wx.getStorageSync('user_id');
Page({
  /**
   * 页面的初始数据
   */
  data: {
		add:'none',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var _this = this;
  	var url = fun.apiurl('admin/blog/hotList');
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
					list : ret.data.data.data.data
				})
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //搜索
  formSubmit:function(ret){
  	var _this = this;
  	var search = ret.detail.value.search;
  	var url = fun.apiurl("admin/blog/hotList");
  	fun.ajax(url,{user_id:user_id,search:search},function(ret){
  		if(ret.data.code == 1){
				if(ret.data.data.is == 1){
					_this.setData({
						list : ret.data.data.data.data,
						add : 'none',
					})
				}else{
					if(search == ''){
						_this.setData({
							list : ret.data.data.data.data,
							add : 'none',
							addname : search,
						})
					}else{
						_this.setData({
							list : ret.data.data.data.data,
							add : 'block',
							addname : search,
						})
					}
				}
		}else{
			console.log(ret.data.msg)
		}
  	})
  },
  //选择话题
  choiceHot:function(e){
  	var id = e.currentTarget.dataset.id;
  	var name = e.currentTarget.dataset.name;
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.emit('selectHot', {id: id,name:name});
		wx.navigateBack();
  },

  goback:function(){
		wx.navigateBack();
  },
 
})