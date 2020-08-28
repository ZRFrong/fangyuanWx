// pages/message/message.js
const fun = require('../../utils/function.js');
Page({
  data: {
    photo1 : '../../image/addPhoto.png',
		photo2 : '../../image/addPhoto.png',
		photo3 : '../../image/addPhoto.png',
  },
  onLoad: function (options) {
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	var url = fun.apiurl('admin/login_run/getCompanyInfo');
  	fun.ajax(url,{user_id:user_id},function(ret){
  		_this.setData({
  			company : ret.data.data.company,
  			address : ret.data.data.address,
  			brand_name : ret.data.data.brand_name,
  			range : ret.data.data.range,
  			photo1 : ret.data.data.business_license ? ret.data.data.business_license : '../../image/addPhoto.png',
  			photo2 : ret.data.data.good_photo ? ret.data.data.good_photo : '../../image/addPhoto.png',
  			photo3 : ret.data.data.permit_photo ? ret.data.data.permit_photo : '../../image/addPhoto.png',
  			uphoto1 : ret.data.data.business_license,
  			uphoto2 : ret.data.data.good_photo,
  			uphoto3 : ret.data.data.permit_photo,
  			id : ret.data.data.id,
  		})
  	})
  },
  bindRegionChange:function(e){
  	this.setData({
  		region_value:e.detail.value
  	})
  },
	//返回
	goback:function(){
		wx.navigateBack();
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
		  	}else if(type == 3){
		  		_this.setData({
			    	photo3 : res.tempFiles[0].path,
			    	uphoto3  : res.tempFiles[0].path,
			    })
		  	}
		  }
		})
  },
	//提交
	submitform:function(e){
		var e = e.detail.value;
		var id = e.id;
		var user_id = wx.getStorageSync('user_id');
		var _this = this;
		var data = {
			user_id : user_id,
			company : e.company,
			address : e.address,
			brand_name : e.brand_name,
			range : e.range,
		}
		if(id){
			data.business_license = this.data.uphoto1;
			data.good_photo = this.data.uphoto2;
			data.permit_photo = this.data.uphoto3;
		}
		var business_license = this.data.uphoto1;
  	var good_photo = this.data.uphoto2;
  	var permit_photo = this.data.uphoto3;
		if(!business_license || !good_photo){
			wx.showToast({
	 			title:"请上传营业执照和产品照片",
	 			icon:"none"
	 		});
	 		return false;
		}
		var uparr = [business_license,good_photo];
		if(permit_photo != undefined && permit_photo != ''){
			uparr.push(permit_photo);
		}
		var uparray = [];
		wx.showLoading({title: '请稍等'});
		for(var i = 0;i<uparr.length;i++){
			if(uparr[i] != undefined){
				wx.uploadFile({
		      url: fun.apiurl('admin/upload/uploadFile'), 
		      filePath: uparr[i],
		      formData: {
		        user_id: user_id,
		        from : 1,
		        use_from : 0,
		        file_class : 'one',
		        file_type : 'image',
		        num : i,
		      },
		      name: 'file',
		      success (res){
		      	var arr = JSON.parse(res.data);
		      	if(arr.code == 1){
		      		uparray[arr.data.num] = arr.data.path;
		      	}
		      },
		      fail(err){
		      	uparray.push('none');
		      },
		      complete(){
		      	if(id){
	      			var url = fun.apiurl('admin/login_run/editCompanyInfo');
	      			data.company_id = id;
	      		}else{
	      			var url = fun.apiurl('admin/login_run/addCompany');
	      		}
	      		console.log(uparray);
      			if(uparray.length == uparr.length){
		      		data.business_license = uparray[0] != 'none' ? uparray[0] : uparr[0];
		      		data.good_photo = uparray[1] != 'none' ? uparray[1] : uparr[1];
		      		if(uparray[2]){
		      			data.permit_photo = uparray[2] != 'none' ? uparray[2] : uparr[2];
		      		}
		      		fun.ajax(url,data,function(ret){
		      			wx.showToast({title:ret.data.msg,icon:'none'});
					  		if(ret.data.code == 1){
					  			_this.onLoad();
					  		}
					  		wx.hideLoading()
		      		})
		      	}
		      	
		      },
		    })
			}
		}
		
		
//		fun.ajax(url,data,function(ret){
//			if(ret.data.code == 1){
//				wx.showToast({
//				  title: '操作成功',
//				  icon: 'success',
//				  duration: 1000,
//				  success:function(res){
//				  	setTimeout(function(){
//				  		wx.navigateBack();
//				  	},1000)
//				  }
//				})
//			}else{
//				console.log(ret)
//			}
//		})
	}
})