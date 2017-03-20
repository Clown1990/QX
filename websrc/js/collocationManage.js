var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 15;//页面大小
var startIndex = 0;//当前页号

/** 初始化店铺信息表 **/
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/collocation/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"categoryCname":fuzzyCategoryName,"currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			initCollocationTable(list, result);
			listenCheckbox();
		},
		error: function () {
            alert("异常！");
        }
	});
}
function initCollocationTable(list, result){
	if(result == "SUCCESS"){
		var collocationTableStr = "<tr><th>全选<input type='checkbox' class='checkboxAll' id='checkAll'></th>" +
				"<th hidden='true'>ID</th><th hidden='true'>类型ID</th><th>类型</th><th>图片</th><th>X坐标</th><th>Y坐标</th><th>长</th><th>高</th><th>操作</th></tr>";
		for(var i = 0;i < list.length;i++){
			collocationTableStr += "<tr><td><input type='checkbox' name='checkNum'></td>" +
							"<td hidden='true'>"+ list[i].collocationId +"</td>" +
							"<td hidden='true'>"+ list[i].type +"</td>" +
							"<td>"+ list[i].categoryCname +"</td>" +
							"<td> <a class='example2' href='/QXJS/source/collocationImg/"+list[i].imgPath+"'><img src='/QXJS/source/collocationImg/"+list[i].imgPath+"' /></a></td>" +
							"<td>"+ list[i].xValue +"</td>" +
							"<td>"+ list[i].yValue +"</td>" +
							"<td>"+ list[i].width +"</td>" +
							"<td>"+ list[i].height +"</td>" +
							"<td><button type='button' class='btn btn-primary btnSize'  onclick='collocationInfoHandle("+ (i+1) +",this,\"deleteCollocation\");'>删除</button>&nbsp;&nbsp;&nbsp;" +
								"<button type='button' class='btn btn-primary btnSize' data-toggle='modal' onclick='collocationInfoHandle("+ (i+1) +",this,\"updateCollocation\");' " +
								"data-target='#myModal1'>修改</button></td></tr>";
		}
		$("#collocationTable").html(collocationTableStr);
	}else
		alert("init collocation table fail.");
}
/** 店铺信息操作 **/
function collocationInfoHandle(num,obj,action){
	if(action == "addCollocation"){
		$("#xValue").val("");
		$("#yValue").val("");
		$("#width").val("");
		$("#height").val("");
		document.getElementById("categoryId").selectedIndex = 0;
	}else if(action == "updateCollocation"){
		var collocationID = $("table").find("tr").eq(num).find("td").eq(1).text();
		var type = $("table").find("tr").eq(num).find("td").eq(2).text();
//		var imgPath = $("table").find("tr").eq(num).find("td").eq(3).text();
		var xValue = $("table").find("tr").eq(num).find("td").eq(5).text();
		var yValue = $("table").find("tr").eq(num).find("td").eq(6).text();
		var width = $("table").find("tr").eq(num).find("td").eq(7).text();
		var height = $("table").find("tr").eq(num).find("td").eq(8).text();
		$("#updateCollocationId").val(collocationID);
		$("#updateCategoryId").val(type);
		$("#updateXValue").val(xValue);
		$("#updateYValue").val(yValue);
		$("#updateWidth").val(width);
		$("#updateHeight").val(height);
	}else if(action == "deleteCollocation"){
		var collocationID = $("table").find("tr").eq(num).find("td").eq(1).text();
		deleteCollocationControl(collocationID);
	}
}
function selectCategoryInfo(){
	$.ajax({
		type : "GET",
		url : "/QXJS/category/selectControl",
		dataType : "json",
		contentType : "application/json",
		success : function(msg) {
			list = msg.list;
			var categoryStr = "";
			for(var i = 0; i < list.length;i++){
				categoryStr += "<option value='"+ list[i].categoryId +"'>"+ list[i].categoryCname +"</option>";
			}
			$("#searchCategoryId").html(categoryStr);
			$("#categoryId").html(categoryStr);
			$("#updateCategoryId").html(categoryStr);
		},
		error: function () {
            alert("异常！");
        }
	});
}
/** 增加店铺信息 **/
function insertCollocationControl(){
	var addData = $('#addCollocationForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/collocation/insertControl",
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
function updateCollocationControl(){
	var updateData = $('#updateCollocationForm').serialize();
	$.ajax({
		type : "GET",
		url : "/QXJS/collocation/updateControl",
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
function deleteCollocationControl(collocationIdStr){
	$.ajax({
		type : "GET",
		url : "/QXJS/collocation/deleteControl",
		dataType : "json",
		contentType : "application/json",
		data : {"collocationId":collocationIdStr},
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
    var tbodyObj = document.getElementById('collocationTable');
    var collocationIdArr = new Array();
    var collocationIdStr = "";
    $("table :checkbox").each(function(key,value){
        if($(value).prop('checked')){
            collocationIdArr.push(tbodyObj.rows[key].cells[1].innerHTML);
        }
    });
    for(var i = 0;i < collocationIdArr.length;i++){
    	collocationIdStr += collocationIdArr[i]+",";
    }
    if(collocationIdStr.length > 0){
    	collocationIdStr = collocationIdStr.substring(0, collocationIdStr.length-1);
    	collocationIdStr = collocationIdStr.replace("ID,", "");
    	deleteCollocationControl(collocationIdStr);
    }
}
var fuzzyCategoryName = "";
function fuzzySearch(){
	fuzzyCategoryName = $("#searchCategoryId").find("option:selected").text();
	currentPage = 1;
//	if(fuzzyCollocationname.length == 0) alert("请输入用户名！");return;
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
		url : "/QXJS/collocation/selectControl",
		dataType : "json",
		contentType : "application/json",
		data : {"categoryCname":fuzzyCategoryName,"currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			totalNumber = msg.pageVo.totalNumber;
			pageControl();
		},
		error: function () {
			alert("异常！");
		}
	});
}