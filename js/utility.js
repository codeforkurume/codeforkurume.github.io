/**
 * Created by taisuke on 15/08/17.
 */


function csvToArray(filename, cb) {
    $.get(filename, function (csvdata) {
        //CSVのパース作業
        //CRの解析ミスがあった箇所を修正しました。
        //以前のコードだとCRが残ったままになります。
        // var csvdata = csvdata.replace("\r/gm", ""),
        csvdata = csvdata.replace(/\r/gm, "");
        var line = csvdata.split("\n"),
            ret = [];
        line.forEach(function (row) {
            if (row.length != 0) {
                ret.push(row.split(","));
            }
        });
        cb(ret);
    });
}
