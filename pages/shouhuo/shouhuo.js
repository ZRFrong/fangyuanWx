const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		photo1 : '../../image/addPhoto.png',
		select : '请选择',
		shouge : '请选择',
		shougearr : ['是','否'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var _this = this;
		var url = fun.apiurl("admin/login_run/landList");
 		fun.ajax(url,{user_id:user_id},function(ret){
 			if(ret.data.code == 1){
 				var list = ret.data.data;
				_this.setData({
					list : ret.data.data
				})
				var infourl = fun.apiurl("admin/apply/fruitInfo");
				var x = 0;
				fun.ajax(infourl,{user_id:user_id},function(rets){
		 			if(rets.data.code == 1){
		 				for(var i=0;i<list.length;i++){
							if(list[i].id == rets.data.data.land_id){
								x = i;
							}
						}	
		 				_this.setData({
			 				info : rets.data.data,
			 				x : x,
			 				select : list[x].crop,
			 				shouge : rets.data.data.harvest == 1 ? '是' : '否',
			 				photo1 : rets.data.data.good_photo,
			 				uphoto1 : rets.data.data.good_photo,
			 				is : 1,
 			 			})
		 			}else{
		 				console.log(ret);
		 			}
		 		})
			}else{
				console.log(ret);
			}
 		})
 		
 		
  },
  bindPickerChange:function(e){
  	var list = this.data.list;
  	this.setData({
  		select : list[e.detail.value].crop
  	})
  },
  bindshouge:function(e){
  	var shougearr = this.data.shougearr;
  	this.setData({
  		shouge : shougearr[e.detail.value]
  	})
  },
  //选择图片
  chooseImage:function(e){
  	var type = e.currentTarget.dataset.type;
  	var _this = this;
  	wx.chooseImage({
		  count: 1,
		  sizeType: ['original', 'compressed'],
		  sourceType: ['album'],
		  success (res) {
		  	if(type == 1){
		  		_this.setData({
			    	photo1 : res.tempFiles[0].path,
			    	uphoto1  : res.tempFiles[0].path,
			    })
		  	}
		  }
		})
  },
  //提交表单
  formSubmit:function(e){
  	wx.showLoading({title: '请稍等'});
  	var list = this.data.list;
  	var _this = this;
  	var data = {
  		user_id : user_id,
  		land_id : list[e.detail.value.land_id].id,
	  	yield : e.detail.value.yield,
	  	harvest : e.detail.value.harvest,
	  	man : e.detail.value.man,
  	}
  	var good_photo = this.data.uphoto1;
  	if(good_photo){
  		var up = wx.uploadFile({
	      url: fun.apiurl('admin/upload/uploadFile'), 
	      filePath: good_photo,
	      formData: {
	        user_id: user_id,
	        from : 1,
	        use_from : 0,
	        file_class : 'one',
	        file_type : 'image',
	      },
	      name: 'file',
	      success (res){
	      	var arr = JSON.parse(res.data);
	      	data.good_photo = arr.data;
	      	var url = fun.apiurl('admin/Apply/fruit');
			  	fun.ajax(url,data,function(ret){
			  		wx.showToast({title:ret.data.msg,icon:'none'});
			  		if(ret.data.code == 1){
			  			_this.onLoad();
			  		}
			  		wx.hideLoading()
			  	})
	      }
	    })
  	}else{
  		wx.showToast({title:"请上传产品图片",icon:"none"});
  		wx.hideLoading()
	 		return false;
  	}
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