'use strict';

/**
 * ゴミのカテゴリを管理するクラスです。
 * description.csvのモデルです。
 * @class DescriptionModel
 * @constructor
 */
var DescriptionModel = (function() {
    var descriptionModel = function(data) {
        this.targets = new Array();

        this.label = data[0];
        this.sublabel = data[1];//not used
        this.description = data[2];//not used
        this.styles = data[3];
        this.background = data[4];
    };

    return descriptionModel;
})();
