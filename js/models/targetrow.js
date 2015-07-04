'use strict';

/**
 * ゴミのカテゴリの中のゴミの具体的なリストを管理するクラスです。
 * target.csvのモデルです。
 * @class TargetRowModel
 * @constructor
 */
var TargetRowModel = (function() {
    var targetRowModel = function(data) {
        this.label = data[0];
        this.name = data[1];
        this.notice = data[2];
        this.furigana = data[3];
    };

    return targetRowModel;
})();

