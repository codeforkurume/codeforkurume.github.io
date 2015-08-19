/**
 * ゴミのカテゴリを管理するクラスです。
 * description.csvのモデルです。
 */
var DescriptionModel;
DescriptionModel = (function () {
    function DescriptionModel(data) {
        this.targets = [];

        this.mastercode = data[0];//kit
        this.name = data[1];
        this.sublabel = data[2];//not used
        this.description = data[3];//not used
        this.styles = data[4];
        this.background = data[5];
    }

    return DescriptionModel;
})();

DescriptionModel.readCSV = function (func) {
    $.get(DesCriptionCSVFileName, function (data) {
        var ret = [];
        var csv_array = Utility.csvToArray(data);
        var area_master_label = csv_array.shift();
        csv_array.forEach(function (row) {
            var area_master = new DescriptionModel(row);
            ret.push(area_master);
        });
        func(ret);
    });
};

DescriptionModel.done = false;

$(document).ready(function(){
    function setData(data) {
        DescriptionModel.data = data;
        DescriptionModel.done = true;
        Event.update();
    }

    DescriptionModel.readCSV(setData);
});
