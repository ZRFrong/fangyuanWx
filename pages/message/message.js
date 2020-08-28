// pages/message/message.js
const fun = require('../../utils/function.js');
Page({
  data: {
    region: ['山西省', '太原市', '小店区'],
    region_value : ["请选择"],
    index_show:"请选择产品类别",
    crop_show:"请选择",
    cropshow:"none",
    active : {},
   	croparr : ['种植','加工','养殖'],
  },
  onLoad: function (options) {
  	var user_id = wx.getStorageSync('user_id');
  	var _this = this;
  	var id = options.id;
  	if(id){
  		//编辑
  		var url = fun.apiurl("admin/login_run/getLandInfo");
  		fun.ajax(url,{user_id:user_id,land_id:id},function(ret){
  			if(ret.data.code == 1){
  				var actionurl = fun.apiurl("admin/select/action");
  				fun.ajax(actionurl,{user_id:user_id,cid:ret.data.data.crop},function(rets){
  					if(rets.data.code == 1){
  						if(rets.data.data.typeid == 0){
  							var crop_show = '种植';
  						}else if(rets.data.data.typeid == 1){
  							var crop_show = '加工';
  						}else if(rets.data.data.typeid == 2){
  							var crop_show = '养殖';
  						}
							_this.setData({
								action:rets.data.data.action,
								crop_show : crop_show,
							})
							var cropurl = fun.apiurl("admin/select/crop");
					  	fun.ajax(cropurl,{user_id:user_id,typeid:rets.data.data.typeid},function(ret){
					  		if(ret.data.code == 1){
									_this.setData({
										sroparr:ret.data.data
									})
								}else{
									console.log(ret)
								}
					  	})
						}else{
							console.log(rets)
						}
  				})
					var active = {};
					for(var i = 0;i<ret.data.data.action.length;i++){
						active[ret.data.data.action[i]] = "checked";
					}
					_this.setData({
						region:ret.data.data.city,
						region_value:ret.data.data.city,
						address : ret.data.data.address,
						latitude : ret.data.data.latitude,
						longitude : ret.data.data.longitude,
						markers:[{
	          	latitude: ret.data.data.latitude,
	          	longitude: ret.data.data.longitude,
	          }],
//	          size:ret.data.data.size,
	          cropid:ret.data.data.crop,
						index_show:ret.data.data.cropshow,
						cropshow : "block",
						active : active,
						content: ret.data.data.content,
						land_id:id
					})
				}else{
					console.log(ret)
				}
  		})
  	}else{
  		wx.getLocation({
	      type: "wgs84",
	      success: function (res) {
	        var latitude = res.latitude;
	        var longitude = res.longitude;
	        _this.setData({
	          latitude: latitude,
	          longitude: longitude,
	          markers:[{
	          	latitude: latitude,
	          	longitude: longitude,
	          }]
	        })
	      },
	    })
  	}
  },
  bindRegionChange:function(e){
  	this.setData({
  		region_value:e.detail.value
  	})
  },
	clickmap:function(){
		var _this = this;
		wx.chooseLocation({
			success:function(e){
				_this.setData({
          latitude: e.latitude,
          longitude: e.longitude,
          markers:[{
          	latitude: e.latitude,
          	longitude: e.longitude,
          }]
        })
			}
		})
	},
	//产品类别选择
	croptypechange:function(e){
		var user_id = wx.getStorageSync('user_id');
		var _this = this;
		var typeid = e.detail.value;
		if(typeid == 0){
			var crop_show = '种植';
		}else if(typeid == 1){
			var crop_show = '加工';
		}else if(typeid == 2){
			var crop_show = '养殖';
		}
		this.setData({
			crop_show : crop_show,
			index_show : '请选择产品类别',
		})
		var cropurl = fun.apiurl("admin/select/crop");
  	fun.ajax(cropurl,{user_id:user_id,typeid:typeid},function(ret){
  		if(ret.data.code == 1){
				_this.setData({
					sroparr:ret.data.data
				})
			}else{
				console.log(ret)
			}
  	})
	},
	//选择农作物
	cropchange:function(e){
		var user_id = wx.getStorageSync('user_id');
		this.setData({
      index: e.detail.value,
      index_show: e.currentTarget.dataset.arr[e.detail.value].name
    })
		var _this = this;
		var url = fun.apiurl("admin/select/action");
		var data = {
			user_id: user_id,
			cid : e.currentTarget.dataset.arr[e.detail.value].id
		}
		fun.ajax(url,data,function(ret){
			if(ret.data.code == 1){
				_this.setData({
					action:ret.data.data.action,
					cropshow : "block",
					cropid : e.currentTarget.dataset.arr[e.detail.value].id
				})
			}else{
				console.log(ret)
			}
		})
	},
	//选择操作
	actionclick:function(e){
		var action_id = e.currentTarget.dataset.id;
		var action_key = e.currentTarget.dataset.key;
		var active = this.data.active;
		if(active[action_id] == 'checked'){
			active[action_id] = '';
		}else{
			active[action_id] = 'checked';
		}
		this.setData({
			active : active
		})
	},
	//返回
	goback:function(){
		wx.navigateBack();
	},
	//提交
	submitform:function(ret){
		var ret = ret.detail.value;
		var user_id = wx.getStorageSync('user_id');
		var _this = this;
		var action = ret.action.join(',');
		var city = ret.city == '请选择' ? '' : ret.city;
		var land_id = ret.land_id;
		if(land_id == ''){
			var url = fun.apiurl("admin/login_run/addLand");
			var data = {
				user_id: user_id,
				city : city,
				address : ret.address,
				longitude : ret.longitude,
				latitude : ret.latitude,
//				size : ret.size,
				crop : ret.crop,
				action: action,
				content : ret.content
			};
		}else{
			var url = fun.apiurl("admin/login_run/editLandInfo");
			var data = {
				land_id : land_id,
				user_id: user_id,
				city : city,
				address : ret.address,
				longitude : ret.longitude,
				latitude : ret.latitude,
//				size : ret.size,
				crop : ret.crop,
				action: action,
				content : ret.content
			};
		}
		fun.ajax(url,data,function(ret){
			if(ret.data.code == 1){
				wx.showToast({
				  title: '操作成功',
				  icon: 'success',
				  duration: 1000,
				  success:function(res){
				  	setTimeout(function(){
				  		wx.navigateBack();
				  	},1000)
				  }
				})
			}else{
				console.log(ret)
			}
		})
	}
})