// pages/register/register.js
const user_id = wx.getStorageSync('user_id');
const fun = require('../../utils/function.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
		powershow:"none",
		imagediv : "none",
		videodiv : 'none',
		hot : [],
		imgarr : [],
		textheight : 810,
		location_show : "none",
		location: '',
		mediatype : ['image','video'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.setData({
			powershow:"none",
			imagediv : "none",
			videodiv : 'none',
			hot : [],
			imgarr : [],
			textheight : 810,
			location_show : "none",
			location: '',
			mediatype : ['image','video'],
			textvalue : '',
		})
  },
  goback:function(){
		wx.switchTab({
		  url: '/pages/index/index'
		})
  },
  //相册选择
  chooseImage:function(e){
  	if(!fun.islogin()){return false;}
  	var _this = this;
  	var num = e.currentTarget.dataset.num;
  	var mediatype = _this.data.mediatype;
  	if(num >= 9){
  		wx.showToast({'title':'最多只能上传9张图片'})
  	}else{
  		wx.chooseMedia({
			  count: 9,
			  mediaType : mediatype,
			  sizeType: ['original', 'compressed'],
			  sourceType: ['album'],
			  success (res) {
			  	if(res.type == 'image'){
			  		if(num + res.tempFiles.length > 0 && num + res.tempFiles.length <= 4){
				  		_this.setData({
				  			textheight : 610,
				  		})
				  	}else if(num + res.tempFiles.length > 4 && num + res.tempFiles.length <= 8){
				  		
				  		_this.setData({
				  			textheight : 460,
				  		})
				  	}else if(num + res.tempFiles.length > 8){
				  		_this.setData({
				  			textheight : 310,
				  		})
				  	}
				  	var imgarr = _this.data.imgarr;
				  	if(num + res.tempFiles.length > 9){
				  		wx.showToast({'title':'最多只能上传9张图片'})
				  	}else{
				  		for(var i = 0;i<res.tempFiles.length;i++){
					  		imgarr.push(res.tempFiles[i].tempFilePath);
					  	}
					    _this.setData({
					    	imagediv:'block',
					    	imgarr : imgarr,
					    	mediatype : ['image'],
					    })
				  	}
			  	}else{
			  		var path = res.tempFiles[0].tempFilePath;
			  		_this.setData({
				    	videodiv:'block',
				    	videopath : path,
				    	mediatype : ['video'],
				    })
			  	}
			  }
			})
  	}
  	
  },
  //打开相机
  cameraImage:function(e){
  	if(!fun.islogin()){return false;}
  	var _this = this;
  	var num = e.currentTarget.dataset.num;
  	if(num >= 9){
  		wx.showToast({'title':'最多只能上传9张图片'})
  	}else{
	  	wx.chooseImage({
			  count: 1,
			  sizeType: ['original', 'compressed'],
			  sourceType: ['camera'],
			  success (res) {
			  	if(num + res.tempFilePaths.length > 0 && num + res.tempFilePaths.length <= 4){
			  		_this.setData({
			  			textheight : 760,
			  		})
			  	}else if(num + res.tempFilePaths.length > 4 && num + res.tempFilePaths.length <= 8){
			  		
			  		_this.setData({
			  			textheight : 610,
			  		})
			  	}else if(num + res.tempFilePaths.length > 8){
			  		_this.setData({
			  			textheight : 460,
			  		})
			  	}
			  	if(num + res.tempFilePaths.length > 9){
			  		wx.showToast({'title':'最多只能上传9张图片'})
			  	}else{
				    var imgarr = _this.data.imgarr;
			  		imgarr.push(res.tempFilePaths[0]);
				    _this.setData({
				    	imagediv:'block',
				    	imgarr : imgarr,
				    })
			   }
			  }
			})
  	}
  },
  //删除照片
  clearimg:function(e){
  	var index = e.currentTarget.dataset.index;
  	var imgarr = this.data.imgarr;
  	imgarr.splice(index, 1);
  	this.setData({
  		imgarr : imgarr
  	})
  	if(imgarr.length == 0){
  		this.setData({
	  		mediatype : ['image','video'],
	  	})
  	}
  },
  //删除视频
  clearvideo:function(e){
  	var videopath = this.data.videopath;
  	this.setData({
  		videopath : '',
  		videodiv : 'none',
  		mediatype : ['image','video'],
  	})
  },
	//选择权限
	power:function(){
		if(!fun.islogin()){return false;}
		if(this.data.powershow == 'block'){
			this.setData({
				powershow:'none'
			})
		}else{
			this.setData({
				powershow:'block'
			})
		}
	},
	closepower:function(){
		this.setData({
			powershow:'none'
		})
	},
	//阻止冒泡
	bubbling:function(){},
	//定位
	openlocation:function(){
		if(!fun.islogin()){return false;}
		var _this = this;
		wx.chooseLocation({
			success:function(ret){
				_this.setData({
					location: ret.name,
					location_show : 'inline-block',
				})
			},
			fail:function(ret){
				_this.setData({
					location_show : 'none',
					location: '',
				})
			}
		})
	},
	//选择词条
	hot:function(){
		if(!fun.islogin()){return false;}
		var _this = this;
			wx.navigateTo({
				url:"/pages/hot/hot",
				events:{
					selectHot:function(ret){
						var data = _this.data.hot;
						var arr = {id:ret.id,name:ret.name};
						var d = false;
						for(var i = 0;i<data.length;i++){
							if(data[i].name == arr.name){
								d = true;
							}
						}
						if(!d){
							data.push(arr);
							_this.setData({
								hot : data
							})
						}
					}
				},
				
			})
	},
	clearhot:function(e){
		var _this = this;
		var key = e.currentTarget.dataset.key;
		var data = _this.data.hot;
		data.splice(key, 1);
		console.log(data);
		_this.setData({
			hot : data
		})
	},
	//发表
	formSubmit:function(ret){
		if(!fun.islogin()){return false;}
		wx.showLoading({
		  title: '请稍等...',
		})
		var user_id = wx.getStorageSync('user_id');
		var hot = this.data.hot;
		var hot_id = '';
		var _this = this;
		var addhot = [];
		for(var i = 0;i<hot.length;i++){
			if(hot[i].id != undefined){
				if(i == hot.length-1){
					hot_id += hot[i].id;
				}else{
					hot_id += hot[i].id+',';
				}
			}else{
				addhot.push(hot[i].name);
			}
			
		}
		var media = this.data.imgarr;
		var video = this.data.videopath;
		var data = {
			user_id : user_id,
			content : ret.detail.value.content,
			address : this.data.location,
			power : ret.detail.value.power,
			hot_id : hot_id,
			addhot : addhot,
		}
		//上传图片
		if(media.length != 0){
			for(var i = 0;i<media.length;i++){
				var image_arr = [];
				var up = wx.uploadFile({
		      url: fun.apiurl('admin/upload/uploadFile'), 
		      filePath: media[i],
		      formData: {
		        user_id: user_id,
		        from : 1,
		        use_from : 1,
		        file_class : 'one',
		        file_type : 'image',
		      },
		      name: 'file',
		      success (res){
		      	var arr = JSON.parse(res.data);
		      	image_arr.push(arr.data);
		      	if(image_arr.length == media.length){
		      		data.media = image_arr;
		      		var url = fun.apiurl("admin/blog/addBlog");
		      		fun.ajax(url,data,function(ret){
		      			if(ret.data.code == 1){
									wx.hideLoading()
									wx.showToast({title:'发表成功'});
									setTimeout(function(){
											wx.switchTab({
											  url: '/pages/index/index'
											})
											_this.onLoad();
									},1000)
								}else{
									wx.showToast({'title':ret.data.msg});
									console.log(ret.data.msg)
								}
		      		})
		      	}
		      }
		    })
			}
		}else{
			if(video != undefined){
				var up = wx.uploadFile({
		      url: fun.apiurl('admin/upload/uploadFile'), 
		      filePath: video,
		      formData: {
		        user_id: user_id,
		        from : 1,
		        use_from : 1,
		        file_class : 'one',
		        file_type : 'video',
		      },
		      name: 'file',
		      success (res){
		      	console.log(res);
		      	var arr = JSON.parse(res.data);
	      		data.media = [arr.data];
	      		var url = fun.apiurl("admin/blog/addBlog");
	      		fun.ajax(url,data,function(ret){
	      			if(ret.data.code == 1){
								wx.hideLoading()
								wx.showToast({title:'发表成功'});
								setTimeout(function(){
										wx.switchTab({
										  url: '/pages/index/index'
										})
										_this.onLoad();
								},1000)
							}else{
								wx.showToast({'title':ret.data.msg});
								console.log(ret.data.msg)
							}
	      		})
		      }
		    })
			}else{
				var url = fun.apiurl("admin/blog/addBlog");
				fun.ajax(url,data,function(ret){
					if(ret.data.code == 1){
						wx.hideLoading()
						wx.showToast({title:'发表成功'});
						setTimeout(function(){
								wx.switchTab({
								  url: '/pages/index/index'
								})
								_this.onLoad();
						},1000)
					}else{
						wx.showToast({'title':ret.data.msg,'icon':'none'});
						console.log(ret.data.msg)
					}
				})
			}
		}
	}
})