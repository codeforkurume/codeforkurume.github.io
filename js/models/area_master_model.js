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
    $.get(AreaMasterCSVFileName, function (data) {
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

AreaMasterModel.getMasterCodeByName = function (name) {
    if (AreaMasterModel.done) {
        Object.keys(AreaMasterModel.data).forEach(function (key) {
            var area_master_model = AreaMasterModel.data[key];
            if (area_master_model.name == name) {
                return area_master_model.mastercode;
            }
        })
    }
    return -1;
};

AreaMasterModel.data = [];
AreaMasterModel.done = false;

AreaMasterModel.afterRead = function () {
    AreaMasterModel.done = true;
};

$(document).ready(function () {
    function setData(data) {
        AreaMasterModel.data = data;
        AreaMasterModel.afterRead();
        Event.update();
    }

    AreaMasterModel.readCSV(setData);
});
