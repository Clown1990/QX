/**
 * Created by cj on 16/4/8.
 */
//$(function(){
//    $("#checkAll").click(function() {
//        $('input[name="checkNum"]').prop("checked",this.checked);
//    });
//    var $checkNum = $("input[name='checkNum']");
//    $checkNum.click(function(){
//        $("#checkAll").prop("checked",$checkNum.length == $("input[name='checkNum']:checked").length ? true : false);
//    });
//    $(".tcdPageCode").createPage({
//        pageCount:6,
//        current:1,
//        backFn:function(p){
//            console.log(p);
//        }
//    });
//    $(".storeSetAdPhotoImgUB").change(function(){
//        var objUrl = getObjectURL(this.files[0]) ;
//        console.log("objUrl = "+objUrl) ;
//        if (objUrl) {
//            $(this).parent().find("img").attr("src", objUrl) ;
//        }
//    }) ;
//
//    //建立一個可存取到該file的url
//    function getObjectURL(file) {
//        var url = null ;
//        if (window.createObjectURL!=undefined) { // basic
//            url = window.createObjectURL(file) ;
//        } else if (window.URL!=undefined) { // mozilla(firefox)
//            url = window.URL.createObjectURL(file) ;
//        } else if (window.webkitURL!=undefined) { // webkit or chrome
//            url = window.webkitURL.createObjectURL(file) ;
//        }
//        return url ;
//    }
//
//
//    $('.form_date').datetimepicker({
//        language:  'fr',
//        weekStart: 1,
//        todayBtn:  1,
//        autoclose: 1,
//        todayHighlight: 1,
//        startView: 2,
//        minView: 2,
//        forceParse: 0
//    });
//
//})