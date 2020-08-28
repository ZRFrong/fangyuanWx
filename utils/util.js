const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getlogin(fun){
	var user_id = wx.getStorageSync('user_id');
	if(!user_id){
		wx.login({
				success: function(code) {
					if(code.code) {
						var code = code.code;
						wx.getUserInfo({
						  success: function(res) {
						    wx.request({
									url: 'https://peasetech.cn/api/admin/login/xaddUser',
									data: {
										code: code,
										image:res.userInfo.avatarUrl,
										nickname:res.userInfo.nickName
									},
									success(ret) {
										if(ret.data.code == 1){
												wx.setStorageSync('user_id', ret.data.data);
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
						
					}
				}
			})
	}
}


module.exports = {
  formatTime: formatTime,
  getlogin:getlogin
}
