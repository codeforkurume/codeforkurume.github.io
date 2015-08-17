/**
 * ゴミのカテゴリを管理するクラスです。
 * description.csvのモデルです。
 */
var DescriptionModel;
DescriptionModel = (function () {
    function DescriptionModel(data) {
        this.targets = [];

        this.mastercode = data[0];//kit
        this.name = data[1];
        this.sublabel = data[2];//not used
        this.description = data[3];//not used
        this.styles = data[4];
        this.background = data[5];
    }

    return DescriptionModel;
})();
