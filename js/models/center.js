'use strict';

/**
 * センターのデータを管理します。
 * @class CenterModel
 * @constructor
 */
var CenterModel;
CenterModel = (function () {
  function CenterModel(row) {
    this.name = row[0];
    this.startDate = getDay(row, 1);
    this.endDate = getDay(row, 2);
  }

  function getDay(center, index) {
    var tmp = center[index].split("/");
    return new Date(tmp[0], tmp[1] - 1, tmp[2]);
  }

  return CenterModel;
})();
