///**
// * Created by cj on 16/4/5.
// */
$(function(){
    $('#submit').click(function(){
        login();
    });

});
function login() {
    var logindata = $('#login').serialize();
   /* alert(logindata);*/
    var url = "/QXJS/user/loginControl";
    $.ajax({
        type: 'GET',
        url: url,
        data: logindata,
        success: function (data) {
        	var list = data.list;
            if(data.result =="SUCCESS"){
            	if(list != null)
            		window.location.href = "user/userManage.html";
            	else
            		window.location.href = "login.html";
            }else {
                return false;
            }
        },
        error: function () {
            alert("异常！");
        }
    });
}