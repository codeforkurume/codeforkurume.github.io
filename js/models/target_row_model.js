/**
 * ゴミのカテゴリの中のゴミの具体的なリストを管理するクラスです。
 * target.csvのモデルです。
 */
var TargetRowModel = function (data) {

    this.mastercode = data[0]; //kit
    this.type = data[1];
    this.name = data[2];
    this.notice = data[3];
    this.furigana = data[4];


}
