var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

/** 初始化客户信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/custom/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customName":fuzzyCustomname, "province":provinceStr, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initCustomTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initCustomTable(list, result){
	if(result == "SUCCESS"){
		var customTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th hidden='true'>ID</th><th>姓名</th><th>店铺</th><th hidden='true'>店铺ID</th><th>地址</th><th>电话</th><th>性别</th><th>年龄</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			customTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td hidden='true'>"+ list[i].customId +"</td>" +
							"<td>"+ list[i].customName +"</td>" +
							"<td>"+ list[i].storeName +"</td>" +
							"<td hidden='true'>"+ list[i].storeId +"</td>" +
							"<td>"+ list[i].address +"</td>" +
							"<td>"+ list[i].phone +"</td>" +
							"<td>"+ changeSex(list[i].sex) +"</td>" +
							"<td>"+ list[i].age +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='customInfoHandle("+ (i+1) +",this,\"deleteCustom\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='customInfoHandle("+ (i+1) +",this,\"updateCustom\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#customTable").html(customTableStr);
	}else
		alert("init custom table fail.");
}
function changeSex(sex){
	if(sex == 1) return '男';
	else return '女';
}
/** 客户信息操作 **/
function customInfoHandle(num,obj,action){
	if(action == "addCustom"){
		$("#customName").val("");
		$("#address").val("");
		$("#phone").val("");
		$("#age").val("");
		selectStoreInfo('', '四川省', num, action);
	}else if(action == "updateCustom"){
		selectStoreInfo('', '四川省', num, action);
	}else if(action == "deleteCustom"){
		var customID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteCustomControl(customID);
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
			if(action == "addCustom") {
				$("#storeId").html(storeStr);
				document.getElementById("storeId").selectedIndex = 0;
				document.getElementById("sex").selectedIndex = 0;
			}else if(action == "updateCustom") {
				$("#updateStoreId").html(storeStr);
				var customId = $("table").find("tr").eq(num).find("td").eq(1).text();
				var customname = $("table").find("tr").eq(num).find("td").eq(2).text();
				var storeName = $("table").find("tr").eq(num).find("td").eq(3).text();
				var storeId = $("table").find("tr").eq(num).find("td").eq(4).text();
				var address = $("table").find("tr").eq(num).find("td").eq(5).text();
				var phone = $("table").find("tr").eq(num).find("td").eq(6).text();
				var sex = $("table").find("tr").eq(num).find("td").eq(7).text();
				var age = $("table").find("tr").eq(num).find("td").eq(8).text();
				$("#updateCustomId").val(customId);
				$("#updateName").val(customname);
				$("#updateStoreId").val(storeId);
				$("#updateAddress").val(address);
				$("#updatePhone").val(phone);
				if(sex == '男') $("#updateSex").val(1);
				else $("#updateSex").val(2);
				$("#updateAge").val(age);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加客户信息 **/
function insertCustomControl(){
	var addData = $('#customAddForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/custom/insertControl",
		dataType : "json",
		contentType : "application/json",
		data : addData,
		success : function(msg) {
			var result = msg.result;
			insertCustomResult(result);
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}
/** 修改客户信息 **/
function updateCustomControl(){
	var updateData = $('#customUpdateForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/custom/updateControl",
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
/** 删除客户信息 **/
function deleteCustomControl(customIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/custom/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customId":customIdStr},
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
	selectProvince();
});
/** 批量删除**/
function mulitDelete(){
    var tbodyObj = document.getElementById('customTable');
    var customIdArr = new Array();
    var customIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            customIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < customIdArr.length;i++){
    	customIdStr += customIdArr[i]+",";
    }
    if(customIdStr.length > 0){
    	customIdStr = customIdStr.substring(0, customIdStr.length-1);
    	customIdStr = customIdStr.replace("ID,", "");
    	deleteCustomControl(customIdStr);
    }
}
var fuzzyCustomname = "";
function fuzzySearch(){
	fuzzyCustomname = $("#selectCustomName").val();
	provinceStr = $("#provinceId").find("option:selected").text();
	currentPage = 1;
//	if(fuzzyCustomname.length == 0) alert("请输入用户名！");return;
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
		url : "/QXJS/custom/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customName":'', "province":provinceStr, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}
var provinceStr = '四川省';
function selectProvince(){
	var list = new Array();
	$.ajax({
		type : "GET",
		url : "/QXJS/province/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"provinceName":'', "currentPage":(currentPage-1)*pageSize, "pageSize":1000},
		success : function(msg) {
			list = msg.list;
			initProvince(list);
		},
		error: function () {
			alert("异常！");
		}
	});
}
function initProvince(provinceArr){
	var provinceStr = "";
	for(var i = 0;i < provinceArr.length;i++){
		provinceStr += "<option>"+provinceArr[i].provinceName+"</option>"
	}
	$("#provinceId").html(provinceStr);
}