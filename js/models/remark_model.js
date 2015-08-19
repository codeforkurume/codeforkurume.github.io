/**
 * ゴミ収集日に関する備考を管理するクラスです。
 * remarks.csvのモデルです。
 */
var RemarkModel;
RemarkModel = (function () {
    function RemarkModel(data) {
        this.id = data[0];
        this.text = data[1];
    }

    return RemarkModel;
}());

RemarkModel.readCSV = function (func) {
    $.get(RemarkCSVFileName, function (data) {
        var csv_array = Utility.csvToArray(data),
            ret = [];
        csv_array.shift();
        csv_array.forEach(function (row) {
            var remark = new RemarkModel(row);
            ret.push(remark);
        });
        func(ret);
    });
};

RemarkModel.data = [];

RemarkModel.afterRead = function () {
};

$(document).ready(function () {
    function setData(data) {
        RemarkModel.data = data;
        RemarkModel.afterRead();
    }

    RemarkModel.readCSV(setData);
});