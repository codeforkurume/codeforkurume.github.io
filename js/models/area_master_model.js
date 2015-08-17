/**
 エリアマスターを管理するクラスです。
 area_master.csvのモデルです。
 */
var AreaMasterModel;
AreaMasterModel = (function () {
    function AreaMasterModel(row) {
        this.mastercode = row[0];
        this.name = row[1];
    }

    return AreaMasterModel;
})();

AreaMasterModel.readCSV = function (func) {
    var ret = [];
    Utility.csvToArray(AreaMasterCSV, function (tmp) {
        // 1行目は読み飛ばす
        var area_master_label = tmp.shift();
        tmp.forEach(function (row) {
            var area_master = new AreaMasterModel(row);
            ret.push(area_master);
        });
        func(ret);
    });
};
