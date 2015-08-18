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
    $.get(AreaMasterCSVFileName, function(data){
        var ret = [];
        var csv_array = Utility.csvToArray(data);
        var area_master_label = csv_array.shift();
        csv_array.forEach(function (row) {
            var area_master = new AreaMasterModel(row);
            ret.push(area_master);
        });
        func(ret);
    });
};
