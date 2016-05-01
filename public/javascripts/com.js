$('.regbtn').click(function(){
	var uname = $('#uname').val().trim();
	var password = $('#password').val().trim();
	var rq_password = $('#qr_password').val().trim();
	if(uname.length < 4){
		alert('用户名长度小于4个字符！');
		return;
	}else{
		if(!uname.match(/^[a-zA-Z]+\w+$/)){
			alert('用户名只能由字母、下划线、数字组成，开头必须是字母');
			return;
		}
	}
	if(password !== rq_password){
		alert('两次输入的密码不一致');
		return;
	}
	$.post(
			'/doreg'
			,{
					uname:uname,
					password:password
			}
			,function(data){
				alert(data);
			}
		);
});