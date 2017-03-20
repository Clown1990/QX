var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

/** 初始化组合信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/group/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupCd":fuzzyGroupCd, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initGroupTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initGroupTable(list, result){
	if(result == "SUCCESS"){
		var groupTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th>序号</th><th>组合编号</th><th hidden='true'>系列号</th><th>系列名</th><th>备注</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			groupTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td>"+ list[i].groupId +"</td>" +
							"<td>"+ list[i].groupCd +"</td>" +
							"<td hidden='true'>"+ list[i].seriesId +"</td>" +
							"<td>"+ list[i].seriesName +"</td>" +
							"<td>"+ list[i].comment +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='groupInfoHandle("+ (i+1) +",this,\"deleteGroup\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='groupInfoHandle("+ (i+1) +",this,\"updateGroup\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#groupTable").html(groupTableStr);
	}else
		alert("init group table fail.");
}
/** 组合信息操作 **/
function groupInfoHandle(num,obj,action){
	if(action == "addGroup"){
		$("#groupCd").val("");
		$("#comment").val("");
		selectSeriesInfo(num, action);
	}else if(action == "updateGroup"){
		selectSeriesInfo(num, action);
	}else if(action == "deleteGroup"){
		var groupID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteGroupControl(groupID);
	}
}
function selectSeriesInfo(num, action){
	$.ajax({
		type : "GET",
		url : "/QXJS/series/selectControl",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var storeStr = "";
			for(var i = 0; i < list.length;i++){
				storeStr += "<option value='"+ list[i].seriesId +"'>"+ list[i].seriesName +"</option>";
			}
			if(action == "addGroup") {
				$("#seriesId").html(storeStr);
				document.getElementById("seriesId").selectedIndex = 0;
			}else if(action == "updateGroup"){
				$("#updateSeriesId").html(storeStr);
				var groupID = $("table").find("tr").eq(num).find("td").eq(1).text();
				var groupCd = $("table").find("tr").eq(num).find("td").eq(2).text();
				var seriesId = $("table").find("tr").eq(num).find("td").eq(3).text();
				var comment = $("table").find("tr").eq(num).find("td").eq(5).text();
				$("#updateGroupId").val(groupID);
				$("#updateGroupCd").val(groupCd);
				$("#updateSeriesId").val(seriesId);
				$("#updateComment").val(comment);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加组合信息 **/
function insertGroupControl(){
	var addData = $('#addGroupForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/group/insertControl",
		dataType : "json",
		contentType : "application/json",
		data : addData,
		success : function(msg) {
			var result = msg.result;
		},
		error: function () {
            alert("异常！");
        }
	});
	init();
}
/** 修改组合信息 **/
function updateGroupControl(){
	var updateData = $('#updateGroupForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/group/updateControl",
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
function deleteGroupControl(groupIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/group/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupId":groupIdStr},
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
    var tbodyObj = document.getElementById('groupTable');
    var groupIdArr = new Array();
    var groupIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            groupIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < groupIdArr.length;i++){
    	groupIdStr += groupIdArr[i]+",";
    }
    if(groupIdStr.length > 0){
    	groupIdStr = groupIdStr.substring(0, groupIdStr.length-1);
    	groupIdStr = groupIdStr.replace("ID,", "");
    	deleteGroupControl(groupIdStr);
    }
}
var fuzzyGroupCd = "";
function fuzzySearch(){
	fuzzyGroupCd = $("#selectGroupName").val();
	currentPage = 1;
	$(".tcdPageCode").clearPage({});
	selectTotalNum();
//	if(fuzzyGroupname.length == 0) alert("请输入用户名！");return;
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
		url : "/QXJS/group/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupCd":fuzzyGroupCd, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}