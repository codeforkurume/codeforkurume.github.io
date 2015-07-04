'use strict';

/**
 * ゴミのカテゴリを管理するクラスです。
 * description.csvのモデルです。
 * @class DescriptionModel
 * @constructor
 */
var DescriptionModel;
DescriptionModel = (function () {
  function DescriptionModel(data) {
    this.targets = [];

    this.label = data[0];
    this.sublabel = data[1];//not used
    this.description = data[2];
    this.styles = data[3];
    this.background = data[4];
  }

  return DescriptionModel;
})();
