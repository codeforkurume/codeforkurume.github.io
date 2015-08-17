'use strict';
/**
 エリア(ごみ処理の地域）を管理するクラスです。
 */
var AreaModel;
AreaModel = (function () {
    function AreaModel() {
        this.mastercode = null;
        this.label = null;
        this.centerName = null;
        this.center = null;
        this.trash = [];
    }

    /**
     各ゴミのカテゴリに対して、最も直近の日付を計算します。
     */
    AreaModel.prototype.calcMostRect = function calcMostRect() {
        for (var i = 0; i < this.trash.length; i++) {
            this.trash[i].calcMostRect(this);
        }
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
        for (var i in center_data) {
            if (this.centerName == center_data[i].name) {
                this.center = center_data[i];
            }
        }
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
