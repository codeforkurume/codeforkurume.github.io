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
