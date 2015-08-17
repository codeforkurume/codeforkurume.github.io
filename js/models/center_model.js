/**
 センターのデータを管理します。
 */
var CenterModel = function (row) {
    function getDay(center, index) {
        var tmp = center[index].split("/");
        return new Date(tmp[0], tmp[1] - 1, tmp[2]);
    }

    this.name = row[0];
    this.startDate = getDay(row, 1);
    this.endDate = getDay(row, 2);
};
