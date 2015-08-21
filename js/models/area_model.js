'use strict';
/**
 エリア(ごみ処理の地域）を管理するクラスです。
 */
var AreaModel;
AreaModel = (function () {
    function AreaModel(row_index, label, row) {
        // AreaMasterは1-indexのため合わせる
        this.id = row_index + 1;
        this.mastercode = row[0];
        this.name = row[1];
        this.furigana = row[2];
        this.centerName = row[3];
        this.center = null;
        this.trash = [];
        this.trashLabel = [];
        for (var i = 4; i < MaxDescription; i++) {
            if (label[i]) {
                this.trashLabel[label[i]] = row[i];
            }
        }
    }

    AreaModel.prototype.getId = function () {
        return this.id;
    };

    /**
     各ゴミのカテゴリに対して、最も直近の日付を計算します。
     */
    AreaModel.prototype.calcMostRect = function calcMostRect() {
        var that = this;
        this.trash.forEach(function (trash) {
            trash.calcMostRect(that);
        });
    };
    /**
     休止期間（主に年末年始）かどうかを判定します。
     */
    AreaModel.prototype.isBlankDay = function isBlankDay(currentDate) {
        var period = [this.center.startDate, this.center.endDate];

        return !!(period[0].getTime() <= currentDate.getTime() &&
        currentDate.getTime() <= period[1].getTime());

    };
    /**
     ゴミ処理センターを登録します。
     名前が一致するかどうかで判定を行っております。
     */
    AreaModel.prototype.setCenter = function setCenter(center_data) {
        var that = this;
        center_data.forEach(function (center) {
            if (that.centerName == center.name) {
                that.center = center;
            }
        });
    };
    /**
     ゴミのカテゴリのソートを行います。
     */
    AreaModel.prototype.sortTrash = function sortTrash() {
        this.trash.sort(function (a, b) {
            var at = a.mostRecent.getTime();
            var bt = b.mostRecent.getTime();
            if (at < bt) return -1;
            if (at > bt) return 1;
            return 0;
        });
    };

    return AreaModel;
})();

AreaModel.readCSV = function readCSV(func) {
    $.get(AreaCSVFileName, function (data) {
        var csv_array = Utility.csvToArray(data);
        var ret = [],
            area_label = csv_array.shift();
        csv_array.forEach(function (row, row_index) {
            var area = new AreaModel(row_index, area_label, row);
            ret.push(area);
        });
        func(ret);
    });
};

AreaModel.getAreaList = function getAreaList(mastercode) {
    var ret = [];
    AreaModel.data.forEach(function (area_master_model) {
        if (area_master_model.mastercode == mastercode) {
            ret.push(area_master_model);
        }
    });
    return ret;
};


AreaModel.getAreaIndex = function (area_name) {
    var area_models = AreaModel.data;
    for (var i = 0; i < area_models.length; i++) {
        if (area_models[i].name == area_name) {
            return i;
        }
    }
    return -1;
};


AreaModel.data = [];
AreaModel.done = false;

AreaModel.afterDone = function afterDone() {
    AreaModel.data.forEach(function (area_model) {
        var label = area_model.trashLabel;
        area_model.setCenter(CenterModel.data);
        Object.keys(label).forEach(function (key) {
            area_model.trash.push(new TrashModel(key, label[key], RemarkModel.data));
        });
        area_model.trashLabel = null;
    });
};

