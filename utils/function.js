//api接口
function apiurl(url){
	return 'https://peasetech.cn/api/'+url;
}
//访问接口
function ajax(url,data,success,error){
	wx.request({
		url: url,
		data: data,
		success(ret) {
			if(success){
				success(ret);
			}
		},
		fail(err){
			if(error){
				error(err);
			}
			console.log(err);
			wx.showToast({title:'调用失败',icon:'none'});
		}
	})
}
//判断消息未读
function isMessage(){
	var url = apiurl("admin/my/index");
	var user_id = wx.getStorageSync('user_id');
	if(user_id){
		ajax(url,{user_id:user_id},function(ret){
			if(ret.data.code == 1){
				if(ret.data.data.read == 1){
					wx.showTabBarRedDot({index:3});
				}else{
					wx.hideTabBarRedDot({index:3});
				}
			}else{
				console.log(ret.data.msg)
			}
		})
	}
}
//判断是否登录
function islogin(){
	var user_id = wx.getStorageSync('user_id');
  	if(!user_id){
  		wx.showToast({title:'请登录',icon:'none'});
  		return false;
  	}else{
  		return true;
  	}
}
//打开页面
function openPage(url){
	wx.navigateTo({
  		url:url,
  	})
}
module.exports = {
	apiurl : apiurl,
  	ajax: ajax,
  	islogin:islogin,
  	openPage:openPage,
  	isMessage:isMessage,
}