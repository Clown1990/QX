var currentPage = 1;//当前页号
var totalNumber = 0;//总记录数
var pageSize = 6;//页面大小
var startIndex = 0;//当前页号

var startTime = "2000-01-01";
var endTime = "";

$(function(){
	endTime = formatDate(0);
	init();
});
function init(){
	$.ajax({
		type : "GET",
		url : "/QXJS/news/selectNewsControl",
		dataType : "json",
		contentType : "application/json",
		data : {"startDate":startTime, "endDate":endTime, "currentPage":(currentPage-1)*pageSize, "pageSize":pageSize},
		success : function(msg) {
			var list = msg.list;
			var result = msg.result;
			totalNumber = msg.pageVo.totalNumber;
			createPageView();
			insertNewsHtml(list, result);
		},
		error: function () {
			console.log(arguments);
            alert("异常！");
        }
	});
}
function insertNewsHtml(list, result){
	if(result == "SUCCESS"){
		var newsTableStr = "";
		for(var i = 0; i < list.length; i++){
			newsTableStr += "<li><div class='QXprovideContentListD QXprovideContentListDF'>" +
							"<a target='_blank' href='../QXnewsDetail.html?newsId='"+ list[i].newsId +"><h2>"+ list[i].title +"</h2></a>" +
							"<p class='PublishedTime'>"+ formatDate(list[i].time) +"</p>" +
							"<div class='QXprovideContentListC'>" +
							"<p>"+ getLengthProcessField(list[i].content) +"</p>" +
							"</div></div></li>";
		}
		$("#newsInfo").html(newsTableStr);
	}else
		alert("init news table fail.");
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

function createPageView(){
	var pageStr = "<li><a onclick='pageViewControl(\"previous\",0)' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
	for(var i = 0;i < totalPage();i++){
		pageStr += "<li><a onclick='pageViewControl(\"num\", "+ (i+1) +")'>"+ (i+1) +"</a></li>";
	}
	pageStr += "<li><a onclick='pageViewControl(\"next\", 0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
	$("#pageHandle").html(pageStr);
}
function pageViewControl(flagStr, pageNum){
	if(flagStr == "previous"){
		if(currentPage == 1) return;
		currentPage = currentPage - 1;
	}else if(flagStr == "num"){
		if(currentPage == pageNum) return;
		currentPage = pageNum;
	}else if(flagStr == "next"){
		if(currentPage == totalPage()) return;
		currentPage = currentPage + 1;
	}
	init();
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
function getLengthProcessField(field){
	var newField = null;
	if (field != null) {
		field = field.replace(/<[^>]+>/g,"");
		var fieldLength = field.length;
		if (fieldLength > 100) {
			newField = field.substring(0, 100)+ "...";
		} else {
			newField = field;
		}
	}
	return newField;
}