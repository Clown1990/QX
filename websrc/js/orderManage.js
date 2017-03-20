var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

var startTime = "2000-01-01";
var endTime = "";
var customName = "";

/** 初始化订单信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/order/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customName":customName, "provinceStr":provinceStr, "startDate":startTime, "endDate":endTime, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initOrderTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initOrderTable(list, result){
	if(result == "SUCCESS"){
		var orderTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th>编号</th><th hidden='true'>客户ID</th><th>客户名称</th><th>联系电话</th><th>时间</th>" +
				"<th>地址</th><th>内容</th><th>描述</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			orderTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td>"+ list[i].orderId +"</td>" +
							"<td hidden='true'>"+ list[i].customId +"</td>" +
							"<td>"+ list[i].customName +"</td>" +
							"<td>"+ list[i].phone +"</td>" +
							"<td>"+ formatDate(list[i].time) +"</td>" +
							"<td>"+ list[i].address +"</td>" +
							"<td>"+ list[i].content +"</td>" +
							"<td>"+ list[i].comment +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='orderInfoHandle("+ (i+1) +",this,\"deleteOrder\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='orderInfoHandle("+ (i+1) +",this,\"updateOrder\");' " +
								"data-target='#myModal1'>修改</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' onclick='jumpToDetailPage("+ (i+1) +")'>详情</button></td></tr>";
		}
		$("#orderTable").html(orderTableStr);
	}else
		alert("init order table fail.");
}
/** 订单信息操作 **/
function orderInfoHandle(num,obj,action){
	if(action == "addOrder"){
		$("#address").val("");
		$("#content").val("");
		$("#comment").val("");
		selectCustomInfo('', '', num, action);
	}else if(action == "updateOrder"){
		selectCustomInfo('', '', num, action);
	}else if(action == "deleteOrder"){
		var orderID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteOrderControl(orderID);
	}
}
function selectCustomInfo(customName, province, num, action){
	$.ajax({
		type : "GET",
		url : "/QXJS/custom/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customName":customName, "province":province, "currentPage":0, "pageSize":1000},
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var storeStr = "";
			for(var i = 0; i < list.length;i++){
				storeStr += "<option value='"+ list[i].customId +"'>"+ list[i].customName +"</option>";
			}
			if(action == "addOrder") {
				$("#customId").html(storeStr);
				document.getElementById("customId").selectedIndex = 0;
			}else if(action == "updateOrder") {
				$("#updateCustomId").html(storeStr);
				var orderId = $("table").find("tr").eq(num).find("td").eq(1).text();
				var customId = $("table").find("tr").eq(num).find("td").eq(2).text();
				var address = $("table").find("tr").eq(num).find("td").eq(6).text();
				var content = $("table").find("tr").eq(num).find("td").eq(7).text();
				var comment = $("table").find("tr").eq(num).find("td").eq(8).text();
				$("#updateOrderId").val(orderId);
				$("#updateCustomId").val(customId);
				$("#updateAddress").val(address);
				$("#updateContent").val(content);
				$("#updateComment").val(comment);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加订单信息 **/
function insertOrderControl(){
	var addData = $('#addOrderForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/order/insertControl",
		dataType : "json",
		contentType : "application/json",
		data : addData,
		success : function(msg) {
			var result = msg.result;
			insertOrderResult(result);
		},
		error: function () {
            alert("异常！");
        }
	});
	endTime = formatDate(0);
	init();
}
/** 修改订单信息 **/
function updateOrderControl(){
	var updateData = $('#updateOrderForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/order/updateControl",
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
/** 删除客户信息 **/
function deleteOrderControl(orderIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/order/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"orderId":orderIdStr},
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
	selectProvince();
	
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
    var tbodyObj = document.getElementById('orderTable');
    var orderIdArr = new Array();
    var orderIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            orderIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < orderIdArr.length;i++){
    	orderIdStr += orderIdArr[i]+",";
    }
    if(orderIdStr.length > 0){
    	orderIdStr = orderIdStr.substring(0, orderIdStr.length-1);
    	orderIdStr = orderIdStr.replace("ID,", "");
    	deleteOrderControl(orderIdStr);
    }
}
function fuzzySearch(){
	customName = $("#selectOrderName").val();
	provinceStr = $("#provinceId").find("option:selected").text();
	currentPage = 1;
	startTime = $("#startTime").val();
	endTime = $("#endTime").val();
	if(startTime == undefined || startTime == "") startTime = "2000-01-01";
	if(endTime == undefined || endTime == "") endTime = formatDate(0);
	$(".tcdPageCode").clearPage({});
	selectTotalNum();
//	if(fuzzyOrdername.length == 0) alert("请输入客户名！");return;
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
/** 获取总条数**/
function selectTotalNum(){
	$.ajax({
		type : "GET",
		url : "/QXJS/order/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"customName":customName, "provinceStr":provinceStr, "startDate":startTime, "endDate":endTime, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}
var provinceStr = '';
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
		provinceStr += "<option>"+provinceArr[i].provinceName+"</option>";
	}
	$("#provinceId").html(provinceStr);
}
/** 格式化时间：时间戳转字符串yyyy-MM-dd HH:mm **/
function formatDate(timeStamp){
	if(timeStamp == 0) var d = new Date();    //根据时间戳生成的时间对象
	else var d = new Date(timeStamp*1000);
	var yyyy = d.getFullYear();      //年
	var mm = d.getMonth() + 1;     //月
	var dd = d.getDate();          //日
//	var hh = d.getHours();         //时
//	var ii = d.getMinutes();       //分
	var dateStr = yyyy + "-";
	if(mm < 10) dateStr += "0";
	dateStr += mm + "-";
	if(dd < 10) dateStr += "0";
	dateStr += dd + " ";
//	if(hh < 10) dateStr += "0";
//	dateStr += hh + ":";
//	if(ii < 10) dateStr += "0";
//	dateStr += ii;
	return dateStr;
}
function jumpToDetailPage(num){
	var customName = $("table").find("tr").eq(num).find("td").eq(3).text();
	var phone = $("table").find("tr").eq(num).find("td").eq(4).text();
	var time = $("table").find("tr").eq(num).find("td").eq(5).text();
	var address = $("table").find("tr").eq(num).find("td").eq(6).text();
	var content = $("table").find("tr").eq(num).find("td").eq(7).text();
	var comment = $("table").find("tr").eq(num).find("td").eq(8).text();
	var paramStr = "customName="+customName+"&phone="+phone+"&time="+time+"&address="+address+"&content="+content+"&comment="+comment;
	url = encodeURI("orderDetail.html?"+paramStr);//加码
	window.location.href = url;
}