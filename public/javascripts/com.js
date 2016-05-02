$('.reg-btn').click(function () {
	var uname = $('#uname').val().trim();
	var password = $('#password').val().trim();
	var rq_password = $('#qr_password').val().trim();
	if (!uname) {
		alert('用户名为空！');
		return
	}
	if (uname.length < 4) {
		alert('用户名长度小于4个字符！');
		return
	}
	if (!uname.match(/^[a-zA-Z]+\w+$/)) {
		alert('用户名只能由字母、下划线、数字组成，开头必须是字母');
		return
	}
	if (!password) {
		alert('密码为空！');
		return
	}
	if (password !== rq_password) {
		alert('两次输入的密码不一致');
		return
	}
	$.post(
		'/doreg'
		, {
			uname: uname,
			password: password
		}
		, function (data) {
			alert(data);
		}
		);
});

$('.login-btn').click(function () {
	var uname = $('#uname').val().trim();
	var password = $('#password').val().trim();
	if (!uname) {
		alert('用户名为空！');
		return;
	}
	if (uname.length < 4) {
		alert('用户名长度小于4个字符！');
		return;
	}
	if (!uname.match(/^[a-zA-Z]+\w+$/)) {
		alert('用户名只能由字母、下划线、数字组成，开头必须是字母');
		return;
	}
	if (!password) {
		alert('密码为空！');
		return;
	}
	$.post(
		'dologin'
		,{
			uname:uname,
			password:password
		}
		,function(data){
			if(data.trim() === 'success'){
				location.href = '/';
			}else{
				alert(data);
			}
		}
	);
});