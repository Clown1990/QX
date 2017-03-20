var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

/** 初始化用户信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/user/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"username":fuzzyUsername, "role":0, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			totalNumber = msg.pageVo.totalNumber;
			initUserTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initUserTable(list, result){
	if(result == "SUCCESS"){
		var userTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th>ID</th><th>用户名</th><th>密码</th><th>权限</th><th>店铺</th><th hidden='true'>店铺ID</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			userTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td>"+ list[i].userId +"</td>" +
							"<td>"+ list[i].username +"</td>" +
							"<td>"+ list[i].password +"</td>" +
							"<td>"+ changeRole(list[i].role) +"</td>" +
							"<td>"+ list[i].storeName +"</td>" +
							"<td hidden='true'>"+ list[i].storeId +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='userInfoHandle("+ (i+1) +",this,\"deleteUser\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='userInfoHandle("+ (i+1) +",this,\"updateUser\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#userTable").html(userTableStr);
	}else
		alert("init user table fail.");
}
function changeRole(roleId){
	if(roleId == 1) return "店员";
	else if(roleId == 2) return "店长";
	else if(roleId == 3) return "管理员";
	else if(roleId == 4) return "高级管理员";
}
/** 用户信息操作 **/
function userInfoHandle(num,obj,action){
	if(action == "addUser"){
		$("#userName").val("");
		$("#passWord").val("");
		selectStoreInfo('', '四川省', num, action);
	}else if(action == "updateUser"){
		selectStoreInfo('', '四川省', num, action);
	}else if(action == "deleteUser"){
		var userID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteUserControl(userID);
	}
}
function selectStoreInfo(storeName, province, num, action){
	$.ajax({
		type : "GET",
		url : "/QXJS/store/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"storeName":storeName, "province":province, "currentPage":0, "pageSize":1000},
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var storeStr = "";
			for(var i = 0; i < list.length;i++){
				storeStr += "<option value='"+ list[i].storeId +"'>"+ list[i].storeName +"</option>";
			}
			if(action == "addUser") {
				$("#storeId").html(storeStr);
				document.getElementById("role").selectedIndex = 0;
				document.getElementById("storeId").selectedIndex = 0;
			}else if(action == "updateUser") {
				$("#updateStoreId").html(storeStr);
				var userID = $("table").find("tr").eq(num).find("td").eq(1).text();
				var username = $("table").find("tr").eq(num).find("td").eq(2).text();
				var password = $("table").find("tr").eq(num).find("td").eq(3).text();
				var role = $("table").find("tr").eq(num).find("td").eq(4).text();
				var storeId = $("table").find("tr").eq(num).find("td").eq(6).text();
				$("#updateUserId").val(userID);
				$("#updateName").val(username);
				$("#updatePasswd").val(password);
				if(role == "店员") $("#updateRole").val(1);
				else if(role == "店长") $("#updateRole").val(2);
				else if(role == "管理员") $("#updateRole").val(3);
				else if(role == "高级管理员") $("#updateRole").val(4);
				$("#updateStoreId").val(storeId);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加用户信息 **/
function insertUserControl(){
	var addData = $('#addManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/user/insertControl",
		dataType : "json",
		contentType : "application/json",
		data : addData,
		success : function(msg) {
			var result = msg.result;
			insertUserResult(result);
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}
/** 修改用户信息 **/
function updateUserControl(){
	var updateData = $('#updateManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/user/updateControl",
		dataType : "json",
		contentType : "application/json",
		data : updateData,
		success : function(msg) {
			var result = msg.result;
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}
/** 删除用户信息 **/
function deleteUserControl(userIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/user/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"userId":userIdStr},
		success : function(msg) {
			var result = msg.result;
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}

$(function(){
	selectTotalNum();
	init();
});
/** 批量删除**/
function mulitDelete(){
    var tbodyObj = document.getElementById('userTable');
    var userIdArr = new Array();
    var userIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            userIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < userIdArr.length;i++){
    	userIdStr += userIdArr[i]+",";
    }
    if(userIdStr.length > 0){
    	userIdStr = userIdStr.substring(0, userIdStr.length-1);
    	userIdStr = userIdStr.replace("ID,", "");
    	deleteUserControl(userIdStr);
    }
}
var fuzzyUsername = "";
function fuzzySearch(){
	fuzzyUsername = $("#selectUserName").val();
	currentPage = 1;
//	if(fuzzyUsername.length == 0) alert("请输入用户名！");return;
	$(".tcdPageCode").clearPage({});
	selectTotalNum();
	init();
}
function pageControl(){
	 $(".tcdPageCode").createPage({
	        pageCount:totalPage(),
	        current:currentPage,
	        backFn:function(p){
	            console.log(p);
	            setViewByPageVo(p);
	        }
	  });
}
function totalPage(){
	if(totalNumber == 0) return 0;
	var remainder = totalNumber % pageSize;
	if(remainder > 0){
		return (totalNumber-remainder) / pageSize + 1;
	}else{
		return totalNumber / pageSize ;
	}
}
function setViewByPageVo(page){
	currentPage = page;
	init();
}
function listenCheckbox(){
	$("#checkAll").click(function() {
		$('input[name="checkNum"]').prop("checked",this.checked);
	});
	var $checkNum = $("input[name='checkNum']");
	$checkNum.click(function(){
		$("#checkAll").prop("checked",$checkNum.length == $("input[name='checkNum']:checked").length ? true : false);
	});
}
function selectTotalNum(){
	$.ajax({
		type : "GET",
		url : "/QXJS/user/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"username":fuzzyUsername, "role":0, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}