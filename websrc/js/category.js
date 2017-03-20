/**
 * Created by cj on 16/4/1.
 */
/**
 * Created by cj on 16/3/31.
 */
// 添加种类
function addCategory() {
    var addCategory = $('#addCategoryForm').serialize();
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: addCategory,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//删除种类
function deleteCategory(categoryId) {
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: {categoryId:categoryId},
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//修改种类-获取当前选中行信息
function updateGetCategory(categoryId){
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: {categoryId:categoryId},
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//修改种类
function updateCategory(){
    var updateGroup = $('#updateCategoryForm').serialize();
    var url = url;
    $.ajax({
        type: 'POST',
        url: url,
        data: updateGroup,
        success: function (data) {
            console.log(data);
        },
        error: function () {
            alert("异常！");
        }
    })
}
//查询种类
function selectCategory(){
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