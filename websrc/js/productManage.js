var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号
var groupId = 1;
/** 初始化产品信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/product/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupId":groupId, "productCd":fuzzyProductCd, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initProductTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initProductTable(list, result){
	if(result == "SUCCESS"){
		var productTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th>序号</th><th>产品编号</th><th>产品名称</th><th hidden='true'>类别ID</th><th>类别</th>" +
				"<th hidden='true'>套餐ID</th><th>套餐</th><th>图片</th><th>产品参数</th><th>产品特点</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			productTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td>"+ list[i].productId +"</td>" +
							"<td>"+ list[i].productCd +"</td>" +
							"<td>"+ list[i].productName +"</td>" +
							"<td hidden='true'>"+ list[i].groupId +"</td>" +
							"<td>"+ list[i].groupCd +"</td>" +
							"<td hidden='true'>"+ list[i].categoryId +"</td>" +
							"<td>"+ list[i].categoryCname +"</td>" +
							"<td> <a class='example2' href='/QXJS/source/productImg/"+list[i].imgPath+"'><img src='/QXJS/source/productImg/"+list[i].imgPath+"' id='img"+(i+1)+"'/></a></td>" +
							"<td>"+ list[i].paramJson.replace(/@#/g,"<br>") +"</td>" +
							"<td>"+ list[i].comment +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='productInfoHandle("+ (i+1) +",this,\"deleteProduct\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='productInfoHandle("+ (i+1) +",this,\"updateProduct\");' " +
								"data-target='#myModal1'>修改</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' onclick='jumpToDetailPage("+ (i+1) +")'>详情</button></a></td></tr>";
		}
		$("#productTable").html(productTableStr);
	}else
		alert("init product table fail.");
}
/** 产品信息操作 **/
function productInfoHandle(num,obj,action){
	if(action == "addProduct"){
		$("#productName").val("");
		$("#productCd").val("");
		$("#comment").val("");
		$("#imgcolor").val("");
		$("#imgsize").val("");
		document.getElementById("groupId").selectedIndex = 0;
		document.getElementById("categoryId").selectedIndex = 0;
	}else if(action == "updateProduct"){
		var productID = $("table").find("tr").eq(num).find("td").eq(1).text();
		var productCd = $("table").find("tr").eq(num).find("td").eq(2).text();
		var productname = $("table").find("tr").eq(num).find("td").eq(3).text();
		var groupId = $("table").find("tr").eq(num).find("td").eq(4).text();
		var categoryId = $("table").find("tr").eq(num).find("td").eq(6).text();
		var paramJson = $("table").find("tr").eq(num).find("td").eq(9).text();
		var comment = $("table").find("tr").eq(num).find("td").eq(10).text();
		$("#updateProductId").val(productID);
		$("#updateProductCd").val(productCd);
		$("#updateProductName").val(productname);
		$("#updateGroupId").val(groupId);
		$("#updateCategoryId").val(categoryId);
		$("#updateComment").val(comment);
		showParam(categoryId);
	}else if(action == "deleteProduct"){
		var productID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteProductControl(productID);
	}
}
function selectGroupInfo(){
	$.ajax({
		type : "GET",
		url : "/QXJS/group/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupCd":"", "currentPage":0, "pageSize":1000},
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var listStr = "";
			for(var i = 0; i < list.length;i++){
				listStr += "<option value='"+ list[i].groupId +"'>"+ list[i].groupCd +"</option>";
			}
			$("#groupId").html(listStr);
			$("#updateGroupId").html(listStr);
		},
		error: function () {
            alert("异常！");
        }
	});
}
function selectCategoryInfo(){
	$.ajax({
		type : "GET",
		url : "/QXJS/category/selectControl",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			var result = msg.result;
			var list = msg.list;
			var listStr = "";
			for(var i = 0; i < list.length;i++){
				listStr += "<option value='"+ list[i].categoryId +"'>"+ list[i].categoryCname +"</option>";
			}
			$("#categoryId").html(listStr);
			$("#updateCategoryId").html(listStr);
		},
		error: function () {
			alert("异常！");
		}
	});
}
/** 增加产品信息 **/
function insertProductControl(){
	var addData = $('#addManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/product/insertControl",
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
/** 修改产品信息 **/
function updateProductControl(){
	var updateData = $('#updateManage').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/product/updateControl",
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
/** 删除产品信息 **/
function deleteProductControl(productIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/product/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"productId":productIdStr},
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
	selectGroupInfo();
	selectCategoryInfo();
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
    var tbodyObj = document.getElementById('productTable');
    var productIdArr = new Array();
    var productIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            productIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < productIdArr.length;i++){
    	productIdStr += productIdArr[i]+",";
    }
    if(productIdStr.length > 0){
    	productIdStr = productIdStr.substring(0, productIdStr.length-1);
    	productIdStr = productIdStr.replace("ID,", "");
    	deleteProductControl(productIdStr);
    }
}
var fuzzyProductCd = "";
function fuzzySearch(){
	fuzzyProductCd = $("#selectProductName").val();
	currentPage = 1;
	$(".tcdPageCode").clearPage({});
	selectTotalNum();
//	if(fuzzyProductname.length == 0) alert("请输入产品名！");return;
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
		url : "/QXJS/product/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"groupId":groupId, "productCd":fuzzyProductCd, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}
function jumpToDetailPage(num){
	var productCd = $("table").find("tr").eq(num).find("td").eq(2).text();
	var productname = $("table").find("tr").eq(num).find("td").eq(3).text();
	var groupCd = $("table").find("tr").eq(num).find("td").eq(5).text();
	var categoryCname = $("table").find("tr").eq(num).find("td").eq(7).text();
	var paramJson = $("table").find("tr").eq(num).find("td").eq(9).text();
	var comment = $("table").find("tr").eq(num).find("td").eq(10).text();
	var imgSrc = document.getElementById('img'+num).src;
	var photo = imgSrc.split("/")[imgSrc.split("/").length-1];
	photo = decodeURI(photo);
	var paramStr = "productCd="+productCd+"&productname="+productname+"&groupCd="+groupCd+
			"&categoryCname="+categoryCname+"&photo="+photo+"&paramJson="+paramJson+"&comment="+comment;
	url = encodeURI("productDetail.html?"+paramStr);//加码
	window.location.href = url;
}
function showParam(ID){
	var categoryId = 0;
	var paramHtmlId = "";
	if(ID == 0){
		categoryId = $("#categoryId").val();
		paramHtmlId = "paramList";
	}else if(ID == 1){
		categoryId = $("#updateCategoryId").val();
		paramHtmlId = "updateParamList";
	}else {
		categoryId = ID;
		paramHtmlId = "updateParamList";
	}
	$.ajax({
		type : "GET",
		url : "/QXJS/param/selectParamByCategoryId",
		dataType : "json",
		contentType : "application/json",
		data : {"categoryId" : categoryId},
		success : function(msg) {
			var paramList = msg.list;
			insertHtmlParam(paramList, paramHtmlId);
		},
		error: function () {
			alert("异常！");
		}
	});
}
function insertHtmlParam(paramList, paramHtmlID){
	var paramStr = "";
	for(var i = 0; i < paramList.length; i++){
		paramStr += "<input type='text' class='form-control' name='param"+ (i+1) +"' value='"+ paramList[i].cname +"："+ paramList[i].level +"'>";
	}
	$("#"+paramHtmlID).html(paramStr);
}