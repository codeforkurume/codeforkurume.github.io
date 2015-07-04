'use strict';

/**
 * エリア(ごみ処理の地域）を管理するクラスです。
 * @class AreaModel
 * @constructor
 */
var AreaModel;
AreaModel = (function () {
  function AreaModel() {
    this.label = '';
    this.centerName = '';
    this.center = '';
    this.trash = [];
  }

  /**
   * 各ゴミのカテゴリに対して、最も直近の日付を計算します。
   * @method calcMostRect
   * @return {void}
   */
  AreaModel.prototype.calcMostRect = function calcMostRect() {
    for (var i = 0; i < this.trash.length; i++) {
      this.trash[i].calcMostRect(this);
    }
  };

  /**
   * 休止期間（主に年末年始）かどうかを判定します。
   * @method isBlankDay
   * @return {boolean} 休止期間かどうか
   * @param currentDate
   */
  AreaModel.prototype.isBlankDay = function isBlankDay(currentDate) {
    if (!this.center) {
      return false;
    }
    var period = [this.center.startDate, this.center.endDate];

    return !!(period[0].getTime() <= currentDate.getTime() &&
    currentDate.getTime() <= period[1].getTime());
  };

  /**
   * ゴミ処理センターを登録します。
   * 名前が一致するかどうかで判定を行っております。
   * @method setCenter
   * @return {void}
   * @param centerData
   */
  AreaModel.prototype.setCenter = function setCenter(centerData) {
    for (var i in centerData) {
      if (this.centerName == centerData[i].name) {
        this.center = centerData[i];
      }
    }
  };

  /**
   * ゴミのカテゴリのソートを行います。
   * @method sortTrash
   * @return {number}
   */
  AreaModel.prototype.sortTrash = function sortTrash() {
    this.trash.sort(function (a, b) {
      if (a.mostRecent === undefined) return 1;
      if (b.mostRecent === undefined) return -1;
      var at = a.mostRecent.getTime();
      var bt = b.mostRecent.getTime();
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    });
  };
  return AreaModel;
})();
