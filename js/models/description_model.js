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

DescriptionModel.readCSV = function readCSV(func) {
    $.get(DescriptionCSVFileName, function (data) {
        var ret = [];
        var csv_array = Utility.csvToArray(data);
        csv_array.shift();
        csv_array.forEach(function (row) {
            var description = new DescriptionModel(row);
            ret.push(description);
        });
        func(ret);
    });
};

DescriptionModel.data = [];
DescriptionModel.done = false;

DescriptionModel.afterDone = function afterDone() {
    DescriptionModel.data.forEach(function (description) {
        TargetRowModel.data.forEach(function (target_row) {
            if ((description.name == target_row.type) && (description.mastercode == target_row.mastercode)) {
                description.targets.push(target_row);
            }
        });
    });
};

