
var loginProject=(function($,document,window){

	$('#login_count').on('propertychange input blur',function(){
		checkName();
	});
	$('#login_password').on('propertychange input blur',function(){
		checkPassword();
	});
	$('#login').click(function(){
		loginAction();
	});
	//注册
	$('#regist_username').blur(function(){
		checkRegistUsername();
	});
	$('#regist_password').on('propertychange input blur',function(){
		checkRegistPassword();
	});
	$('#final_password').on('propertychange input blur',function(){
		checkRegistPassword();
	});
	$('#regist_button').click(function(){
		registAction();
	});
	$('.refresh').click(function(){
		getImageAction();
	});
})(jQuery,document,window);

function getImageAction(){
	$('#login_img').attr("src", "admin/imgcode.go?d=" + (new Date()).valueOf());
}
function registAction(){
	var url="admin/register.go";
	var name=$('#regist_username').val();
	var pwd=$('#regist_password').val();
	var confirm=$('#final_password').val();
	
	var pass=checkRegistUsername()+checkRegistPassword()+checkFinalPassword();
	if(pass!=3){
		//return;
	}
	var data={
			"name":name,
			"password":pwd,
			"confirmPass":confirm
			};
	$.post(url,data,function(result){
		if(result.state=='success'){
			var user=result.data;
			$('#login_count').val(user.name);
			$('#login_password').focus();
			$('#back').click();
		}else if(result.state=='failed'){
			$('#warning_1 span').html(result.message).parent().show();
		}
	});
	
	
}
function checkRegistUsername(){
	var name=$('#regist_username').val();
	var reg=/^\w{3,15}$/;
	if(!reg.test(name)){
		$('#warning_1 span').html("不合规则").parent().show();
		return;
	}
	$('#warning_1 span').hide();
}
function checkRegistPassword(){
	var pwd=$('#regist_password').val();
	var confirm=$('#regist_password').val();
	var reg=/^\w{3,15}$/;
	if(!reg.test(pwd)){
		$('#warning_2 span').html("不合规则").parent().show();
		return;
	}
	if(pwd!=confirm){
		$('#warning_2 span').html("不一致").parent().show();
		return;
	}
	$('#warning_2 span').hide();
	
}
function checkFinalPassword(){
	var confirm=$('#regist_password').val();
	var pwd=$('#final_password').val();
	if(pwd!=confirm){
		$('#warning_3 span').html("不一致").parent().show();
		return;
	}
	$('#warning_3 span').hide();
}
//登录按钮的动作
function loginAction(){
	var name=$('#login_count').val();
	var password=$('#login_password').val();
	var imgcode=$('#login_imgcode').val();
	var pass=checkName()+checkPassword();
	if(pass!=2){
		return;
	}
	var paramter={
			'name':name,
			'password':password,
			'imgcode':imgcode
			};
	//发送ajax请求
	$.ajax({
		url:'admin/login.go',
	data:paramter,
	dataType:'json',
	type:'POST',
	success:function(r){
		if(r.state=='success'){
			var returnData=r.data;
			SetCookie('userName',returnData.name);
			location.href='admin_message.html';
			return;
		}else if(r.state=='failed'){
			$('#count-msg').html(r.message);
			return;
		}
		alert(r.message);
	},
	error:function(){
		alert('请求失败');
	}
	});
}
function checkName(){
	var name=$('#login_count').val();
	if(name==null||name==''){
		$('#count-msg').html('不能空');
		return false;
	}
	var reg=/^\w{3,15}$/;
	if(!reg.test(name)){
		$('#count-msg').html('不合格');
		return false;
		
	}
	$('#count-msg').empty();
	return true;
}
function checkPassword(){
	var name=$('#login_password').val();
	if(name==null||name==''){
		$('#password-msg').html('不能空');
		return false;
	}
	var reg=/^\w{3,15}$/;
	if(!reg.test(name)){
		$('#password-msg').html('不合格');
		return false;
		
	}
	$('#password-msg').empty();
	return true;
}
