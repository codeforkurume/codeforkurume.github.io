/**
 センターのデータを管理します。
 */
var CenterModel;
CenterModel = (function () {
    //ゴミ処理センターのデータを解析します。
    //表示上は現れませんが、
    //金沢などの各処理センターの休止期間分は一週間ずらすという法則性のため
    //例えば第一金曜日のときは、一周ずらしその月だけ第二金曜日にする
    function CenterModel(row) {
        this.name = row[0];
        this.startDate = getDay(row, 1);
        this.endDate = getDay(row, 2);
    }

    function getDay(center, index) {
        var tmp = center[index].split("/");
        return new Date(tmp[0], tmp[1] - 1, tmp[2]);
    }

    return CenterModel;
})();

CenterModel.readCSV = function (func) {
    $.get(CenterCSVFileName, function (data) {
        var csv_array = Utility.csvToArray(data);
        var ret = [];
        csv_array.shift();
        csv_array.forEach(function (row) {
            var center = new CenterModel(row);
            ret.push(center);
        });
        func(ret);
    });
};