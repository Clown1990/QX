/** 初始化参数信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/param/selectControl",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initParamTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initParamTable(list, result){
	if(result == "SUCCESS"){
		var paramTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th>参数编号</th><th>类别</th><th>中文名</th><th>英文名</th><th>顺序</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			paramTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td>"+ list[i].paramId +"</td>" +
							"<td hidden='true'>"+ list[i].categoryId +"</td>" +
							"<td>"+ list[i].categoryCname +"</td>" +
							"<td>"+ list[i].cname +"</td>" +
							"<td>"+ list[i].ename +"</td>" +
							"<td>"+ list[i].level +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='paramInfoHandle("+ (i+1) +",this,\"deleteParam\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='paramInfoHandle("+ (i+1) +",this,\"updateParam\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#paramTable").html(paramTableStr);
	}else
		alert("init param table fail.");
}
/** 参数信息操作 **/
function paramInfoHandle(num,obj,action){
	if(action == "addParam"){
		$("#cname").val("");
		$("#ename").val("");
		$("#level").val("");
		selectCategoryInfo(num, action);
	}else if(action == "updateParam"){
		selectCategoryInfo(num, action);
	}else if(action == "deleteParam"){
		var paramID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteParamControl(paramID);
	}
}
function selectCategoryInfo(num, action){
	$.ajax({
		type : "GET",
		url : "/QXJS/category/selectControl",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var categoryStr = "";
			for(var i = 0; i < list.length;i++){
				categoryStr += "<option value='"+ list[i].categoryId +"'>"+ list[i].categoryCname +"</option>";
			}
			if(action == "addParam") {
				$("#categoryId").html(categoryStr);
				document.getElementById("categoryId").selectedIndex = 0;
			}
			else if(action == "updateParam") {
				$("#updateCategoryId").html(categoryStr);
				var paramID = $("table").find("tr").eq(num).find("td").eq(1).text();
				var categoryId = $("table").find("tr").eq(num).find("td").eq(2).text();
				var cname = $("table").find("tr").eq(num).find("td").eq(4).text();
				var ename = $("table").find("tr").eq(num).find("td").eq(5).text();
				var level = $("table").find("tr").eq(num).find("td").eq(6).text();
				$("#updateParamId").val(paramID);
				$("#updateCategoryId").val(categoryId);
				$("#updateCname").val(cname);
				$("#updateEname").val(ename);
				$("#updateLevel").val(level);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加参数信息 **/
function insertParamControl(){
	var addData = $('#addParamForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/param/insertControl",
		dataType : "json",
		contentType : "application/json",
		data : addData,
		success : function(msg) {
			var result = msg.result;
			insertParamResult(result);
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}
/** 修改参数信息 **/
function updateParamControl(){
	var updateData = $('#updateParamForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/param/updateControl",
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
/** 删除参数信息 **/
function deleteParamControl(paramIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/param/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"paramId":paramIdStr},
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
	init();
});
/** 批量删除**/
function mulitDelete(){
    var tbodyObj = document.getElementById('paramTable');
    var paramIdArr = new Array();
    var paramIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            paramIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < paramIdArr.length;i++){
    	paramIdStr += paramIdArr[i]+",";
    }
    if(paramIdStr.length > 0){
    	paramIdStr = paramIdStr.substring(0, paramIdStr.length-1);
    	paramIdStr = paramIdStr.replace("ID,", "");
    	deleteParamControl(paramIdStr);
    }
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
