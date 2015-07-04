'use strict';

/**
 * ゴミのカテゴリの中のゴミの具体的なリストを管理するクラスです。
 * target.csvのモデルです。
 * @class TargetRowModel
 * @constructor
 */
var TargetRowModel;
TargetRowModel = (function () {
    function TargetRowModel(data) {
        this.label = data[0];
        this.name = data[1];
        this.notice = data[2];
        this.furigana = data[3];
    }

    return TargetRowModel;
})();

