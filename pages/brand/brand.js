const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		photo1 : '../../image/addPhoto.png',
		photo2 : '../../image/addPhoto.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var _this = this;
		var url = fun.apiurl("admin/apply/applyInfo");
		fun.ajax(url,{user_id:user_id,type:1},function(ret){
			if(ret.data.code == 1){
				_this.setData({
					is : 1,
					username : ret.data.data.username,
					idcard : ret.data.data.idcard,
					phone : ret.data.data.phone,
					brand_name : ret.data.data.brand_name,
					range : ret.data.data.range,
					photo1 : ret.data.data.business_license,
					photo2 : ret.data.data.good_photo,
				})
			}
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
		  	}else if(type == 2){
		  		_this.setData({
			    	photo2 : res.tempFiles[0].path,
			    	uphoto2  : res.tempFiles[0].path,
			    })
		  	}
		  }
		})
  },
  //提交表单
  formSubmit:function(e){
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
  		user_id : user_id,
	  	username : e.detail.value.username,
	  	idcard : e.detail.value.idcard,
	  	phone : e.detail.value.phone,
	  	brand_name : e.detail.value.brand_name,
	  	range : e.detail.value.range,
  	}
  	var business_license = this.data.uphoto1;
  	var good_photo = this.data.uphoto2;
  	if(business_license){
  		var up = wx.uploadFile({
	      url: fun.apiurl('admin/upload/uploadFile'), 
	      filePath: business_license,
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
	      	data.business_license = arr.data;
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
				      success (ress){
				      	var arrs = JSON.parse(ress.data);
				      	data.good_photo = arrs.data;
				      	var url = fun.apiurl('admin/Apply/apply');
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
	      }
	    })
  	}else{
  		wx.showToast({title:"请上传营业执照",icon:"none"});
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