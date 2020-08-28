// pages/register/register.js
const fun = require('../../utils/function.js');
const user_id = wx.getStorageSync('user_id');
Page({
  /**
   * 页面的初始数据
   */
  data: {
		comment : "none",
  	inputfocus : false,
  	placeholder: '请输入',
  	pid : 0,
  	puid:0,
  	comment_dixian : "none",
  	dixian : "none",
  	tuijian_class : 'tuijian',
  	guanzhu_class : '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var uid = this.options.uid;
		var user_id = wx.getStorageSync('user_id');
  	user_id = !user_id ? -1 : user_id;
		var _this = this;
		var url = fun.apiurl("admin/my/userinfo");
		fun.ajax(url,{user_id:user_id,uid:uid},function(ret){
			if(ret.data.code == 1){
				_this.setData({
					blog : ret.data.data.blog.data,
					user : ret.data.data.user,
				})
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
  picerror:function(e){
  	var user = this.data.user;
  	user.image = '../../image/tou.png';
  	this.setData({
  		user : user
  	})
  },
  goback:function(){
		wx.navigateBack();
  },
  //长按删除
  longPress:function(e){
  	var uid = e.currentTarget.dataset.userid;
  	var id = e.currentTarget.dataset.id;
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	if(uid == user_id){
  		wx.showActionSheet({
			  itemList: ['删除'],
			  success (res) {
			    if(res.tapIndex == 0){
			    	var url = fun.apiurl("admin/blog/delBlog");
			    	fun.ajax(url,{user_id:user_id,id:id},function(ret){
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
			  },
			  fail (res) {
			    console.log(res.errMsg)
			  }
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
   //打开转发
  showturn:function(e){
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
  //点赞动态
  blogup:function(e){
  	if(!user_id){
  		wx.showToast({title:'请登录',icon:'none'});
  		return false;
  	}
  	var id = e.currentTarget.dataset.id;
  	var index = e.currentTarget.dataset.index;
  	var up = e.currentTarget.dataset.up;
  	var _this = this;
  	var blog = _this.data.blog;
  	if(up == 0){
  		var url = fun.apiurl("admin/blog/blogup");
  		blog[index].up = 1;
  		blog[index].up_num += 1;
  	}else{
  		var url = fun.apiurl("admin/blog/blogdown");
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
   //打开评论
  showcomment:function(e){
  	var id = e.currentTarget.dataset.id;
  	var _this = this;
  	this.setData({
    	comment : "block",
    })
  	var url = fun.apiurl("admin/blog/commentList");
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
    //指定回复某人
  toSpend:function(e){
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
  	var data = {
  		content : ret.detail.value.content,
  		blog_id : ret.currentTarget.dataset.blogid,
  		parent_id : ret.currentTarget.dataset.pid,
  		parent_user_id:ret.currentTarget.dataset.puid,
  		user_id : user_id,
  	}
  	var _this = this;
  	var url = fun.apiurl("admin/blog/comment");
  	fun.ajax(url,data,function(ret){
  		if(ret.data.code == 1){
				wx.showToast({title:'评论成功'});
				var listurl = fun.apiurl("admin/blog/commentList");
				fun.ajax(listurl,{user_id:user_id,blog_id:data.blog_id},function(ret){
					if(ret.data.code == 1){
				    _this.setData({
				      comment_list : ret.data.data.data,
				      comment_num : ret.data.data.total,
				      commentcontent : '',
				      pid : 0,
				      puid : 0,
				    })
					}else{
						console.log(ret.data.msg)
					}
				})
			}else{
				console.log(ret.data.msg)
			}
  	})
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
    //评论点赞
  commentUp:function(e){
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
  //失去焦点
  blurComment:function(e){
 		this.setData({
      pid : 0,
      puid : 0,
      placeholder : '请输入',
    })
  },
  notouch:function(){},
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
  }
})