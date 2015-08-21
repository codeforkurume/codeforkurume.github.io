/**
 * Created by taisuke on 15/08/17.
 */

var Utility = {};

/**
 * csvを配列に変換。
 * ヘッダーは無視する。
 * @param csv_text
 * @returns {Array}
 */
Utility.csvToArray = function csvToArray(csv_text) {
    csv_text = csv_text.replace(/\r/gm, "");
    var line = csv_text.split("\n"),
        array = [];
    line.forEach(function (row) {
        if (row.length != 0) {
            array.push(row.split(","));
        }
    });
    return array;
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
Utility.html = function html(name, attributes) {
    var elm = document.createElement(name);
    for (var attributeName in attributes) {
        var attributeValue = attributes[attributeName];
        if (Array.isArray(attributeValue)) {
            attributeValue = attributeValue.join(' ');
        }
        elm.setAttribute(attributeName, attributeValue);
    }
    var children = Array.prototype.slice.call(arguments, 2);
    for (var i in children) {
        if (Array.isArray(children[i])) {
            for (var j in children[i]) {
                elm.appendChild(children[i][j]);
            }
        }
        else {
            elm.appendChild(children[i]);
        }
    }
    return elm;
};

Utility.text = function text(nodeValue) {
    return document.createTextNode(nodeValue);
};

Utility.setCSVFileData = function setCSVData(file_name, Models) {
    function push_data(data) {
        var model = Models.getInstance();
        model._data.push(data);
    }

    function setCsvData(data) {
        var csv_array = Utility.csvToArray(data);
        csv_array.shift();
        csv_array.forEach(push_data);
    }

    $.get(file_name, setCsvData);
};