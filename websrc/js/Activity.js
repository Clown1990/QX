/**
 * Created by cj on 16/4/3.
 */
/**
 * Created by cj on 16/3/31.
 */
// 添加系列
function addSeries() {
    var addSeries = $('#seriesAddForm').serialize();
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: addSeries,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//删除系列号
function deleteSeries(seriesId) {
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: {seriesId:seriesId},
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//修改管系列-获取当前选中行信息
function updateGetSeries(seriesId){
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: {seriesId:seriesId},
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//修改系列
function updateSeries(){
    var updateSeries = $('#seriesAddForm1').serialize();
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: updateSeries,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//查询系列
function selectSeries(){
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}