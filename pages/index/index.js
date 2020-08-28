//index.js
//获取应用实例
const fun = require('../../utils/function.js');
const app = getApp();
const query = wx.createSelectorQuery();
const user_id = wx.getStorageSync('user_id');
Page({
  data: {
  	comment : "none",
  	inputfocus : false,
  	placeholder: '请输入',
  	pid : 0,
  	puid:0,
  	comment_dixian : "none",
  	dixian : "none",
  	dixianmsg : '我也是有底线的',
  	tuijian_class : 'tuijian',
  	guanzhu_class : '',
  	user_id : user_id,
  	indexvideo : '',
  },
  //扫描二维码
  saomiao:function(e){
  	wx.scanCode({
		  success (res) {
		  	var user_id = wx.getStorageSync('user_id');
		    var url = res.result+'/user_id/'+user_id;
		    fun.openPage("/pages/codeweb/codeweb?url="+url);
		  }
		})
  },
  //头像错误时
  touerror:function(e){
  	var blog = this.data.blog;
  	blog[e.currentTarget.dataset.index].user.image = '../../image/tou.png';
		this.setData({
			blog : blog
		})
  },
  //打开banner跳转
	swipclick:function(e){
		if(e.currentTarget.dataset.url != ''){
			fun.openPage(e.currentTarget.dataset.url);
		}
	},
  //播放视频时候
  videoplay:function(e){
		var videoid = this.data.indexvideo;
		
		if(videoid != '' && videoid != e.currentTarget.dataset.id){
			var videoContext = wx.createVideoContext(videoid,this);
			videoContext.pause();
		}
		this.setData({
			indexvideo : e.currentTarget.dataset.id,
		})
  },
	onPageScroll(e) {//滚动监听生命周期函数
		let query = wx.createSelectorQuery();//查询
		let wh = wx.getSystemInfoSync().windowHeight;//可视区域高度
		var videoid = this.data.indexvideo;
		if(videoid) {
				query.select('#' + videoid).boundingClientRect(function(rect){
				let top = rect.top;//距离顶部高度
				let height = rect.height;//视频本身
				let bottom = rect.bottom;
				if (top < 0 || top > wh-height/2) { //当视频距离顶部为零，测了下，这个为0，视频不可见。
					var videoContext = wx.createVideoContext(videoid,this);
					videoContext.pause();
				}
			}).exec();
		}
	},
  onLoad: function () {
  	//显示转发
  	wx.showShareMenu({
		  withShareTicket: true
		})
		var user_id = wx.getStorageSync('user_id');
		user_id = !user_id ? -1 : user_id;
		var _this = this;
		var url = fun.apiurl('admin/blog/index');
		var data = {user_id : user_id};
		//推荐数据
		fun.ajax(url,data,function(ret){
			if(ret.data.code == 1){
					_this.setData({
		        blog:ret.data.data.blog.data,
		        current_page : ret.data.data.blog.current_page,
		        last_page : ret.data.data.blog.last_page,
		        tuijian_class : 'tuijian',
		        guanzhu_class : '',
		        dixian : "none",
		        search : '',
		      });
					if(ret.data.data.blog.total == 0){
						_this.setData({
	            dixian : "block",
	            dixianmsg : '没有符合要求的动态',
						})
					}
				}else{
					console.log(ret.data.msg)
				}
		})
  },
  onShow:function(e){
  	var url = fun.apiurl("admin/wisdom/getBanner");
  	var _this = this;
  	var user_id = wx.getStorageSync('user_id');
		user_id = !user_id ? -1 : user_id;
		fun.ajax(url,{user_id:user_id,slide_id:1},function(ret){
			if(ret.data.code == 1){
				var imageUrls = [];
				var imagebind = [];
				for(var i = 0;i<ret.data.data.length;i++){
					imageUrls[i]= ret.data.data[i];
				}
				_this.setData({
					imageUrls : imageUrls,
				})
			}else{
				console.log(ret);
			}
		})
  	fun.isMessage();
  },
  //长按删除
  longPress:function(e){
  	var uid = e.currentTarget.dataset.userid;
  	var id = e.currentTarget.dataset.id;
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	var url = fun.apiurl('admin/blog/delBlog');
  	var data = {user_id:user_id,id:id};
  	if(uid == user_id){
  		wx.showActionSheet({
			  itemList: ['删除'],
			  success (res) {
			    if(res.tapIndex == 0){
			    	wx.showModal({
						  title: '提示',
						  content: '确认删除？',
						  success (res) {
						    if (res.confirm) {
						      fun.ajax(url,data,function(ret){
						    			if(ret.data.code == 1){
												wx.showToast({title:ret.data.msg,icon:'none'});
												setTimeout(function(){
													_this.onLoad();
												},1000)
											}else{
												console.log(ret.data.msg)
											}
						    	})
						    }
						  }
						})
			    }
			  }
			})
  	}
  },
  //搜索
  search:function(ret){
  	var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
  	var search = ret.detail.value.search;
  	var _this = this;
  	var url = fun.apiurl('admin/blog/index');
  	var data = {user_id:user_id,search:search};
  	fun.ajax(url,data,function(ret){
  		if(ret.data.code == 1){
				_this.setData({
	        blog:ret.data.data.blog.data,
	        current_page : ret.data.data.blog.current_page,
	        last_page : ret.data.data.blog.last_page,
	        dixian : "none",
	        tuijian_class : 'tuijian',
					guanzhu_class :  '',
					search : search,
	      });
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //切换关注推荐
  changepage:function(e){
  	var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
  	var type = e.currentTarget.dataset.type;
  	var _this = this;
  	var url = fun.apiurl('admin/blog/index');
  	var data = {user_id:user_id,type:type};
  	fun.ajax(url,data,function(ret){
  		if(ret.data.code == 1){
  			_this.setData({
	        blog:ret.data.data.blog.data,
	        current_page : ret.data.data.blog.current_page,
	        last_page : ret.data.data.blog.last_page,
	        tuijian_class : type == 1 ? 'tuijian' : '',
					guanzhu_class : type == 2 ? 'tuijian' : '',
					search : '',
	      });
				if(ret.data.data.blog.total == 0){
					_this.setData({
            dixian : "block",
            dixianmsg : '没有符合要求的动态',
          });
				}
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //下拉刷新
  onPullDownRefresh:function(){
  	var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
  	this.onLoad();
  	wx.stopPullDownRefresh();
  },
  //上拉触底
  onReachBottom:function(){
  	var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
  	var current_page = this.data.current_page;
  	var last_page = this.data.last_page;
  	var search = this.data.search;
  	var _this = this;
  	var url = fun.apiurl('admin/blog/index');
  	var data = {user_id:user_id,page:parseInt(current_page)+1,search:search != '' ? search : ''};
  	if(current_page < last_page){
  		fun.ajax(url,data,function(ret){
  			if(ret.data.code == 1){
					for(var i=0;i<ret.data.data.blog.data.length;i++){
						_this.data.blog.push(ret.data.data.blog.data[i]);
					}
					var blog = _this.data.blog;
					_this.setData({
            blog:blog,
            current_page : ret.data.data.blog.current_page,
            last_page : ret.data.data.blog.last_page,
          });
				}else{
					console.log(ret.data.msg)
				}
  		})
  	}else{
  		_this.setData({
  			dixian : "block",
  			dixianmsg : '我也是有底线的',
  		})
  	}
  },
  //预览图片
  seeImg:function(e){
  	var arr = e.currentTarget.dataset.arr;
  	var img = e.currentTarget.dataset.img;
		wx.previewImage({
		  current: img, // 当前显示图片的http链接
		  urls: arr // 需要预览的图片http链接列表
		})
  },
  notouch:function(){},
  //点赞动态
  blogup:function(e){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	var id = e.currentTarget.dataset.id;
  	var index = e.currentTarget.dataset.index;
  	var up = e.currentTarget.dataset.up;
  	var _this = this;
  	var blog = _this.data.blog;
  	if(up == 0){
  		var url = fun.apiurl('admin/blog/blogup');
  		blog[index].up = 1;
  		blog[index].up_num += 1;
  	}else{
  		var url = fun.apiurl('admin/blog/blogdown');
  		blog[index].up = 0;
  		blog[index].up_num -= 1;
  	}
  	fun.ajax(url,{user_id:user_id,blog_id:id},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
	        blog:blog,
	      });
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //打开个人主页
  openuser:function(e){
  	var uid = e.currentTarget.dataset.uid;
  	fun.openPage("/pages/user/user?uid="+uid);
  },
  //打开转发
  showturn:function(e){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	if(user_id !=  e.currentTarget.dataset.user){
  		var data = {
	  		user_id : user_id,
	  		power : 0,
	  		content : '转发动态',
	  		turn_id : e.currentTarget.dataset.id,
	  	}
	  	var url = fun.apiurl("admin/blog/addBlog");
	  	var _this = this;
	  	wx.showActionSheet({
			  itemList: ['确认转发'],
			  success (res) {
			  	fun.ajax(url,data,function(ret){
			  		if(ret.data.code == 1){
							wx.showToast({title:'转发成功',icon:'none'});
							_this.onLoad();
							wx.pageScrollTo({
							  scrollTop: 0,
							  duration: 300
							})
						}else{
							console.log(ret.data.msg)
						}
			  	})
			  }
			})
  	}else{
  		wx.showToast({title:'不可以转发自己的动态',icon:'none'});
  	}
  },
  //打开评论
  showcomment:function(e){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	var id = e.currentTarget.dataset.id;
  	var _this = this;
  	this.setData({
    	comment : "block",
    })
  	var url = fun.apiurl('admin/blog/commentList');
  	fun.ajax(url,{user_id:user_id,blog_id:id},function(ret){
  		if(ret.data.code == 1){
				var animation = wx.createAnimation({
		      duration: 500,
		      timingFunction: 'linear',
		    });
		    animation.bottom("0").step();
		    _this.setData({
		      ani: animation.export(),
		      comment_list : ret.data.data.data,
		      comment_current_page : ret.data.data.current_page,
		      comment_last_page : ret.data.data.last_page,
		      comment_num : ret.data.data.total,
		      nowblog_id : id,
		      comment_dixian : 'none',
		    })
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //加关注
  addFans:function(e){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	var usersid = e.currentTarget.dataset.user;
  	var index = e.currentTarget.dataset.index;
  	var _this = this;
  	var url = fun.apiurl("admin/blog/addFollow");
  	fun.ajax(url,{user_id : user_id,focus_user_id : usersid},function(ret){
  		if(ret.data.code == 1){
				var blog = _this.data.blog;
				blog[index].user.is_fans = 1;
				_this.setData({
					blog : blog
				})
				wx.showToast({title:'已关注',icon:'none'});
			}else{
				console.log(ret.data.msg)
			}
  	})
  },
  //指定回复某人
  toSpend:function(e){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	var usersid = e.currentTarget.dataset.userid;
  	var id = e.currentTarget.dataset.id;
  	var nickname = e.currentTarget.dataset.nickname;
  	if(usersid != user_id){
  		this.setData({
	  		inputfocus : true,
	  		placeholder : '回复@'+nickname,
	  		pid : id,
	  		puid : usersid,
	  	})
  	}
  },
  //评论
  commentSubmit:function(ret){
  	if(!fun.islogin()){return false;}
  	var user_id = wx.getStorageSync('user_id');
  	var data = {
  		content : ret.detail.value.content,
  		blog_id : ret.currentTarget.dataset.blogid,
  		parent_id : ret.currentTarget.dataset.pid,
  		parent_user_id:ret.currentTarget.dataset.puid,
  		user_id : user_id,
  	}
  	var url = fun.apiurl('admin/blog/comment');
  	var _this = this;
  	fun.ajax(url,data,function(ret){
  		if(ret.data.code == 1){
				wx.showToast({title:'评论成功'});
				var listurl = fun.apiurl('admin/blog/commentList');
				var listdata = {user_id: user_id,blog_id : data.blog_id};
				fun.ajax(listurl,listdata,function(rets){
					if(rets.data.code == 1){
				    _this.setData({
				      comment_list : rets.data.data.data,
				      comment_num : rets.data.data.total,
				      commentcontent : '',
				      pid : 0,
				      puid : 0,
				    })
					}else{
						console.log(rets.data.msg)
					}
				})
			}else{
				wx.showToast({title:ret.data.msg,icon:'none'});
				console.log(ret.data.msg)
			}
  	})
  },
  //上拉加载
  touchButtom:function(){
  	var user_id = wx.getStorageSync('user_id');
  	var current_page = this.data.comment_current_page;
  	var last_page = this.data.comment_last_page;
  	var nowblog_id = this.data.nowblog_id;
  	var _this = this;
		if(current_page < last_page){
			var url = fun.apiurl('admin/blog/commentList');
			var data = {
					user_id: user_id,
					blog_id : nowblog_id, 
					page : current_page+1
			}
			fun.ajax(url,data,function(ret){
				if(ret.data.code == 1){
					for(var i=0;i<ret.data.data.data.length;i++){
						_this.data.comment_list.push(ret.data.data.data[i]);
					}
					var comment_list = _this.data.comment_list;
					_this.setData({
            comment_list:comment_list,
            comment_current_page : ret.data.data.current_page,
            comment_last_page : ret.data.data.last_page,
          });
				}else{
					console.log(ret.data.msg)
				}
			})
		}else{
			_this.setData({
				comment_dixian : 'block',
			})
		}
  },
  //评论点赞
  commentUp:function(e){
  	var user_id = wx.getStorageSync('user_id');
  	var userid = e.currentTarget.dataset.user;
  	if(userid != user_id){
	  	var id = e.currentTarget.dataset.id;
	  	var up = e.currentTarget.dataset.up;
	  	var index = e.currentTarget.dataset.index;
	  	var num = e.currentTarget.dataset.num;
	  	var _this = this;
	  	if(up == 0){
	  		var nowup = 1;
	  		num += 1;
	  		var url = fun.apiurl("admin/blog/commentUp");
	  	}else if(up == 1){
	  		var nowup = 0;
	  		num -= 1;
	  		var url = fun.apiurl("admin/blog/commentDown");
	  	}
	  	fun.ajax(url,{user_id:user_id,comment_id:id},function(ret){
	  		if(ret.data.code == 1){
					var list = _this.data.comment_list;
					list[index].up = nowup;
					list[index].up_num = num;
			    _this.setData({
			      comment_list : list,
			    })
				}else{
					console.log(ret.data.msg)
				}
	  	})
  	}else{
  		wx.showToast({title:'不可以点赞自己的评论',icon:'none'});
  	}
  },
  //删除评论
  delcomment:function(e){
  	var user_id = wx.getStorageSync('user_id');
  	var userid = e.currentTarget.dataset.userid;
  	var _this = this;
  	if(userid == user_id){
  		wx.showActionSheet({
			  itemList: ['删除'],
			  success (res) {
			    if(res.tapIndex == 0){
			    	wx.showModal({
						  title: '提示',
						  content: '确认删除？',
						  success (res) {
						    if (res.confirm) {
						    	var url = fun.apiurl("admin/blog/deleteComment");
						    	var id = e.currentTarget.dataset.id;
						      fun.ajax(url,{user_id:user_id,comment_id:id},function(ret){
						    			if(ret.data.code == 1){
												wx.showToast({title:ret.data.msg,icon:'none'});
												var listurl = fun.apiurl('admin/blog/commentList');
												var nowblog_id = _this.data.nowblog_id;
												fun.ajax(listurl,{user_id:user_id,blog_id:nowblog_id},function(ret){
										  		if(ret.data.code == 1){
												    _this.setData({
												      comment_list : ret.data.data.data,
												      comment_current_page : ret.data.data.current_page,
												      comment_last_page : ret.data.data.last_page,
												      comment_num : ret.data.data.total,
												    })
													}else{
														console.log(ret.data.msg)
													}
										  	})
											}else{
												console.log(ret.data.msg)
											}
						    	})
						    }
						  }
						})
			    }
			  }
			})
  	}
  },
  //失去焦点
  blurComment:function(e){
 		this.setData({
      pid : 0,
      puid : 0,
      placeholder : '请输入',
    })
  },
  //关闭评论
  closeComment:function(e){
  	var _this = this;
  	var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    });
    animation.bottom("-60%").step();
    this.setData({
      ani: animation.export(),
      pid : 0,
      puid : 0,
    })
    setTimeout(function(){
    	_this.setData({
    		comment : "none"
    	})
    },500)
  },
  //打开健康报告
  openHealthy:function(e){
  	fun.openPage("/pages/healthy/healthy");
  },
   //品牌授权
  oepnBrand:function(){
  	fun.openPage("/pages/brand/brand");
  },
  //质检服务
  oepnTesting:function(){
  	fun.openPage("/pages/testing/testing");
  },
  //溯源码申请
  openCode:function(){
  	fun.openPage("/pages/code/code");
  },
  //打开咨询
  openPhone:function(){
  	wx.showToast({title:'咨询电话：0359-2378278',icon:'none'});
  },
})
