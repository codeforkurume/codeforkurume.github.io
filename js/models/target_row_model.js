/**
 * ゴミのカテゴリの中のゴミの具体的なリストを管理するクラスです。
 * target.csvのモデルです。
 */
var TargetRowModel;
TargetRowModel = (function () {

    function TargetRowModel(data) {
        this.mastercode = data[0]; //kit
        this.type = data[1];
        this.name = data[2];
        this.notice = data[3];
        this.furigana = data[4];
    }

    return TargetRowModel;
})();

TargetRowModel.readCSV = function readCSV(func) {
    $.get(TargetRowCSVFileName, function (data) {
        var csv_array = Utility.csvToArray(data);
        var ret = [];
        csv_array.shift();
        csv_array.forEach(function (row) {
            var target = new TargetRowModel(row);
            ret.push(target);
        });
        func(ret);
    })
};

TargetRowModel.data = [];
TargetRowModel.done = false;
