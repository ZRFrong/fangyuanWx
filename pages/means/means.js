// pages/means/means.js
const fun = require('../../utils/function.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    xz:'请选择',
    a_checked : 'checked',
    zw_img : '/image/zw2.png',
    jg_img : '/image/jg2.png',
    display : "none",
    my : '1'
  },
  onLoad: function (options) {
  	var type = this.options.type;
		if(type == 'my'){
			this.setData({
				my : '2'
			})
		}
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	//获取头像和昵称
  	var url = fun.apiurl("admin/login_run/getInfo");
  	fun.ajax(url,{user_id:user_id},function(ret){
  		if(ret.data.code == 1){
				var sex = ret.data.data.sex;
				if(sex == 0){
					_this.setData({
						a_checked : 'checked'
					})
				}else if(sex == 1){
					_this.setData({
						b_checked : 'checked'
					})
				}else if(sex == 2){
					_this.setData({
						c_checked : 'checked'
					})
				}
				var birthday = ret.data.data.birthday == null ? '' : ret.data.data.birthday ;
				var xz = ret.data.data.birthday == null ? '请选择' : '' ;
				_this.setData({
					pic : ret.data.data.image,
					nickname:ret.data.data.nickname,
					username:ret.data.data.username,
					birthday : birthday,
					sign : ret.data.data.sign,
					date : birthday,
					xz : xz,
				})
			}else{
				console.log(ret);
			}
  	})
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      xz:''
    })
  },
  goback:function(e){
  		wx.navigateBack();
  },
  //打开相册选择器
	uppic:function(){
		var _this = this;
		wx.chooseImage({
		  count: 1,
		  success (res) {
		  	var user_id = wx.getStorageSync('user_id'),
		  			path = res.tempFilePaths[0];
		  	wx.uploadFile({
	      	url: 'https://peasetech.cn/api/admin/upload/uploadFile', //仅为示例，非真实的接口地址
		      filePath: path,
		      name: 'file',
		      formData: {
		        user_id: user_id,
		        from : 1,
		        use_from : 2,
		        file_class : 'one',
		        file_type : 'image',
		      },
		      success (ret){
		      	var ret = JSON.parse(ret.data);
		      	if(ret.code == 1){
		      		_this.setData({
								pic : ret.data,
							})
		      	}else{
		      		wx.showToast({
					 			title:ret.data.msg,
					 			icon:"none"
					 		});
		      	}
		      }
		    })
		  }
		})
	},
	//提交
	formSubmit:function(ret){
		//提交
		var user_id = wx.getStorageSync('user_id');
		var ret = ret.detail.value;
		var _this = this;
		var url = fun.apiurl("admin/login_run/saveInfo");
		var data =  {
				user_id: user_id,
				username : ret.username,
				nickname : ret.nickname,
				sex : ret.sex,
				birthday : ret.birthday,
				image : ret.image,
				sign:ret.sign,
		};
		fun.ajax(url,data,function(res){
			if(res.data.code == 1){
				wx.showToast({
		 			title:'保存成功',
		 			icon:"success",
		 			duration: 1000,
		 			success:function(){
		 				setTimeout(function(){
							wx.switchTab({
				  			url:'/pages/index/index'
				  		})
				  	},1000)
		 			}
		 		});
			}else{
				console.log(res);
			}
		})
	},
	goback:function(){
		wx.navigateBack();
  },
	
})