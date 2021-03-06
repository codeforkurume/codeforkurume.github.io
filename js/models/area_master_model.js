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

    AreaMasterModel.prototype.getId = function () {
        return this.mastercode;
    };

    return AreaMasterModel;
})();

AreaMasterModel.readCSV = function readCSV(func) {
    $.get(AreaMasterCSVFileName, function (data) {
        var ret = [];
        var csv_array = Utility.csvToArray(data);
        csv_array.shift();
        csv_array.forEach(function (row) {
            var area_master = new AreaMasterModel(row);
            ret.push(area_master);
        });
        func(ret);
    });
};

AreaMasterModel.getMasterCodeByName = function getMasterCodeByName(name) {
    var ret = -1;
    AreaMasterModel.data.forEach(function (area_master_model) {
        if (area_master_model.name == name) {
            ret = area_master_model.mastercode;
        }
    });
    return ret;
};

AreaMasterModel.data = [];
AreaMasterModel.done = false;

