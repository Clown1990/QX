var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

var startTime = "2000-01-01";
var endTime = "";

/** 初始化动态信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/activity/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"startDate":startTime, "endDate":endTime, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initActivityTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initActivityTable(list, result){
	if(result == "SUCCESS"){
		var activityTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
		"<th hidden='true'>ID</th><th hidden='true'>userId</th><th>用户名</th><th>时间</th><th>标题</th><th>内容</th><th hidden='true'>状态Id</th><th>状态</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			activityTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
								"<td hidden='true'>"+ list[i].activityId +"</td>" +
								"<td hidden='true'>"+ list[i].userId +"</td>" +
								"<td>"+ list[i].userName +"</td>" +
								"<td>"+ formatDate(list[i].time) +"</td>" +
								"<td>"+ list[i].title +"</td>" +
								"<td>"+ getLengthProcessField(list[i].content) +"</td>" +
								"<td hidden='true'>"+ list[i].state +"</td>" +
								"<td>"+ changeState(list[i].state) +"</td>" +
								"<td><button type='button' class='btn btn-primary btnSize'  onclick='activityInfoHandle("+ (i+1) +",this,\"deleteActivity\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
									"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='activityInfoHandle("+ (i+1) +",this,\"updateActivity\");' " +
									"data-target='#myModal1'>修改</button>&nbsp;&nbsp;&nbsp;" +
									"<button type='button' class='btn btn-primary btnSize' onclick='jumpToDetailPage("+ list[i].activityId +")'>详情</button></td></tr>";
		}
		$("#activityTable").html(activityTableStr);
	}else
		alert("init activity table fail.");
}
function changeState(state){
	if(state == 1) return "已发布";
	else if(state == 0)return "未发布";
	else if(state == 2)return "置顶发布";
	else return "店长可见";
}
/** 动态信息操作 **/
function activityInfoHandle(num,obj,action){
	if(action == "addActivity"){
		$("#title").val("");
		$("#content").val("");
		document.getElementById("userId").selectedIndex = 0;
	}else if(action == "updateActivity"){
		var activityId = $("table").find("tr").eq(num).find("td").eq(1).text();
		$.ajax({
			type : "GET",
			url : "/QXJS/activity/selectActivityById",
			dataType : "json",
			contentType : "application/json",
			data : {"activityId" : activityId},
			success : function(msg) {
				var activity = msg.list;
				$("#updateActivityId").val(activityId);
				$("#updateUserId").val(activity.userId);
				$("#updateTitle").val(activity.title);
				$("#updateState").val(activity.state);
				editorA.$txt.html(activity.content);
			},
			error: function () {
				alert("异常！");
			}
		});
	}else if(action == "deleteActivity"){
		var activityID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteActivityControl(activityID);
	}
}
function selectUserInfo(){
	$.ajax({
		type : "GET",
		url : "/QXJS/user/downloadData",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var userStr = "";
			for(var i = 0; i < list.length;i++){
				userStr += "<option value='"+ list[i].userId +"'>"+ list[i].username +"</option>";
			}
			$("#userId").html(userStr);
			$("#updateUserId").html(userStr);
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加动态信息 **/
function insertActivityControl(){
	var addData = $('#addManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/activity/insertControl",
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
	endTime = formatDate(0);
	init();
}
/** 修改动态信息 **/
function updateActivityControl(){
	var updateData = $('#updateManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/activity/updateControl",
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
	endTime = formatDate(0);
	init();
}
/** 删除产品信息 **/
function deleteActivityControl(activityIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/activity/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"activityId":activityIdStr},
		success : function(msg) {
			var result = msg.result;
		},
		error: function () {
            alert("异常！");
        }
	});
	endTime = formatDate(0);
	init();
}

$(function(){
	endTime = formatDate(0);
	selectTotalNum();
	init();
	selectUserInfo();
	$(".storeSetAdPhotoImgUB").change(function(){
        var objUrl = getObjectURL(this.files[0]) ;
        console.log("objUrl = "+objUrl) ;
        if (objUrl) {
            $(this).parent().find("img").attr("src", objUrl) ;
        }
    }) ;

    //建立一個可存取到該file的url
    function getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }
    
    $('.form_date').datetimepicker({
       language:  'fr',
       weekStart: 1,
       todayBtn:  1,
       autoclose: 1,
       todayHighlight: 1,
       startView: 2,
       minView: 2,
       forceParse: 0
   });
});
/** 批量删除**/
function mulitDelete(){
    var tbodyObj = document.getElementById('activityTable');
    var activityIdArr = new Array();
    var activityIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            activityIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < activityIdArr.length;i++){
    	activityIdStr += activityIdArr[i]+",";
    }
    if(activityIdStr.length > 0){
    	activityIdStr = activityIdStr.substring(0, activityIdStr.length-1);
    	activityIdStr = activityIdStr.replace("ID,", "");
    	deleteActivityControl(activityIdStr);
    }
}
var fuzzyActivityCd = "";
function fuzzySearch(){
	fuzzyActivityCd = $("#selectActivityName").val();
	currentPage = 1;
	startTime = $("#startTime").val();
	endTime = $("#endTime").val();
	
	if(startTime == undefined || startTime == "") startTime = "2000-01-01";
	if(endTime == undefined || endTime == "") endTime = formatDate(0);
//	if(fuzzyActivityname.length == 0) alert("请输入产品名！");return;
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
		url : "/QXJS/activity/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"startDate":startTime, "endDate":endTime, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}
/** 格式化时间：时间戳转字符串yyyy-MM-dd HH:mm **/
function formatDate(timeStamp){
	if(timeStamp == 0) var d = new Date();    //根据时间戳生成的时间对象
	else var d = new Date(timeStamp*1000);
	var yyyy = d.getFullYear();      //年
	var mm = d.getMonth() + 1;     //月
	var dd = d.getDate();          //日
	var dateStr = yyyy + "-";
	if(mm < 10) dateStr += "0";
	dateStr += mm + "-";
	if(dd < 10) dateStr += "0";
	dateStr += dd + " ";
	return dateStr;
}
function jumpToDetailPage(activityId){
	window.open("activitydetaile.html?activityId="+activityId);
}
function getLengthProcessField(field){
	var newField = null;
	if (field != null) {
		field = field.replace(/<[^>]+>/g,"");
		var fieldLength = field.length;
		if (fieldLength > 20) {
			newField = field.substring(0, 20)+ "...";
		} else {
			newField = field;
		}
	}
	return newField;
}