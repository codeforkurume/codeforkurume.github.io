/**
 * Created by taisuke on 15/08/17.
 */

var Utility = {};

Utility.csvToArray = function csvToArray(filename, cb) {
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
};

/*
 *  var dom =
 *  html('div', {class: 'container'},
 *      html('div', {class: 'col-md-2'}),
 *          html('div', {class: 'col-md-8'},
 *          text('sample')
 *      ),
 *      html('div', {class: 'col-md-2'})
 *  );
 */
Utility.html = function (name, attributes) {
    var elm = document.createElement(name);
    attributes.forEach(function (attributeValue, attributeName) {
        if (Array.isArray(attributeValue)) {
            attributeValue = attributeValue.join(' ');
        }
        elm.setAttribute(attributeName, attributeValue);
    });
    var children = Array.prototype.slice.call(arguments, 2);
    children.forEach(function (child) {
        elm.appendChild(child);
    });
    return elm;
};

Utility.text = function (nodeValue) {
    return document.createTextNode(nodeValue);
};