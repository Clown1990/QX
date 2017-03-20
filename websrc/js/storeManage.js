var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

/** 初始化店铺信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/store/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"storeName":fuzzyStorename, "province":provinceStr, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initStoreTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initStoreTable(list, result){
	alert();
	if(result == "SUCCESS"){
		var storeTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th hidden='true'>ID</th><th>店铺名</th><th hidden='true'>省ID</th><th>省份</th><th>地址</th><th>电话</th><th>图片</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			storeTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td hidden='true'>"+ list[i].storeId +"</td>" +
							"<td>"+ list[i].storeName +"</td>" +
							"<td hidden='true'>"+ list[i].provinceId +"</td>" +
							"<td>"+ list[i].provinceName +"</td>" +
							"<td>"+ list[i].address +"</td>" +
							"<td>"+ list[i].phone +"</td>" +
							"<td> <a class='example2' href='/QXJS/source/storeImg/"+list[i].img+"'><img src='/QXJS/source/storeImg/"+list[i].img+"' /></a></td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='storeInfoHandle("+ (i+1) +",this,\"deleteStore\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='storeInfoHandle("+ (i+1) +",this,\"updateStore\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#storeTable").html(storeTableStr);
	}else
		alert("init store table fail.");
}
/** 店铺信息操作 **/
function storeInfoHandle(num,obj,action){
	if(action == "addStore"){
		$("#storeName").val("");
		$("#address").val("");
		selectProvinceInfo(num, action);
	}else if(action == "updateStore"){
		selectProvinceInfo(num, action);
	}else if(action == "deleteStore"){
		var storeID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteStoreControl(storeID);
	}
}
function selectProvinceInfo(num, action){
	$.ajax({
		type : "GET",
		url : "/QXJS/province/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"provinceName":'', "currentPage":(currentPage-1)*pageSize, "pageSize":1000},
		success : function(msg) {
			list = msg.list;
			var provinceStr = "";
			for(var i = 0; i < list.length;i++){
				provinceStr += "<option value='"+ list[i].provinceId +"'>"+ list[i].provinceName +"</option>";
			}
			if(action == "addStore") {
				$("#provinceId").html(provinceStr);
				document.getElementById("provinceId").selectedIndex = 0;
			}else if(action == "updateStore"){
				$("#updateProvinceId").html(provinceStr);
				var storeID = $("table").find("tr").eq(num).find("td").eq(1).text();
				var storename = $("table").find("tr").eq(num).find("td").eq(2).text();
				var provinceId = $("table").find("tr").eq(num).find("td").eq(3).text();
				var provinceName = $("table").find("tr").eq(num).find("td").eq(4).text();
				var address = $("table").find("tr").eq(num).find("td").eq(5).text();
				var phone = $("table").find("tr").eq(num).find("td").eq(6).text();
				var img = $("table").find("tr").eq(num).find("td").eq(7).text();
				$("#updateStoreId").val(storeID);
				$("#updateStoreName").val(storename);
				$("#updateProvinceId").val(provinceId);
				$("#updateProvinceName").val(provinceName);
				$("#updateAddress").val(address);
				$("#updatePhone").val(phone);
				$("#updateimg").val(img);
			}
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加店铺信息 **/
function insertStoreControl(){
	var addData = $('#addStoreForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/store/insertControl",
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
/** 修改店铺信息 **/
function updateStoreControl(){
	var updateData = $('#updateStoreForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/store/updateControl",
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
function deleteStoreControl(storeIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/store/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"storeId":storeIdStr},
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
});
/** 批量删除**/
function mulitDelete(){
    var tbodyObj = document.getElementById('storeTable');
    var storeIdArr = new Array();
    var storeIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            storeIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < storeIdArr.length;i++){
    	storeIdStr += storeIdArr[i]+",";
    }
    if(storeIdStr.length > 0){
    	storeIdStr = storeIdStr.substring(0, storeIdStr.length-1);
    	storeIdStr = storeIdStr.replace("ID,", "");
    	deleteStoreControl(storeIdStr);
    }
}
var fuzzyStorename = "";
function fuzzySearch(){
	fuzzyStorename = $("#selectStoreName").val();
//	provinceStr = $("#provinceId").find("option:selected").text();
	currentPage = 1;
	$(".tcdPageCode").clearPage({});
	selectTotalNum();
//	if(fuzzyStorename.length == 0) alert("请输入用户名！");return;
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
		url : "/QXJS/store/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"storeName":'', "province":provinceStr, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
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
		provinceStr += "<option>"+provinceArr[i].provinceName+"</option>"
	}
	$("#provinceId").html(provinceStr);
}