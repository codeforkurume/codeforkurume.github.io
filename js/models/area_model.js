'use strict';
/**
 エリア(ごみ処理の地域）を管理するクラスです。
 */
var AreaModel = function () {
    this.mastercode;
    this.label;
    this.centerName;
    this.center;
    this.trash = new Array();
    /**
     各ゴミのカテゴリに対して、最も直近の日付を計算します。
     */
    this.calcMostRect = function () {
        for (var i = 0; i < this.trash.length; i++) {
            this.trash[i].calcMostRect(this);
        }
    }
    /**
     休止期間（主に年末年始）かどうかを判定します。
     */
    this.isBlankDay = function (currentDate) {
        var period = [this.center.startDate, this.center.endDate];

        if (period[0].getTime() <= currentDate.getTime() &&
            currentDate.getTime() <= period[1].getTime()) {
            return true;
        }
        return false;
    }
    /**
     ゴミ処理センターを登録します。
     名前が一致するかどうかで判定を行っております。
     */
    this.setCenter = function (center_data) {
        for (var i in center_data) {
            if (this.centerName == center_data[i].name) {
                this.center = center_data[i];
            }
        }
    }
    /**
     ゴミのカテゴリのソートを行います。
     */
    this.sortTrash = function () {
        this.trash.sort(function (a, b) {
            var at = a.mostRecent.getTime();
            var bt = b.mostRecent.getTime();
            if (at < bt) return -1;
            if (at > bt) return 1;
            return 0;
        });
    }
}
