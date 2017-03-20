/**
 * Created by Administrator on 2017/3/7 0007.
 */
$(function(){
    $(".productSeriesList ul li:nth-child(3n)").css("margin-right","0");
    $(".example").imgbox({
        'speedIn'		: 0,
        'speedOut'		: 0,
        'alignment'		: 'center',
        'overlayShow'	: true,
        'allowMultiple'	: false
    });
    $(".processDetail ul li a").imgbox({
        'speedIn'		: 0,
        'speedOut'		: 0,
        'alignment'		: 'center',
        'overlayShow'	: true,
        'allowMultiple'	: false
    });


});
//字数限制
