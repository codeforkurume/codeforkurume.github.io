"use strict";

/* var windowHeight; */

var Event = new Object();

$(function () {
    /*   windowHeight = $(window).height(); */

    var center_data = [];
    var descriptions = [];
    var areaModels = [];
    var remarks = [];
    /*   var descriptions = new Array(); */

    function createSelectElement(type, models, selected_name) {
        var createList = function (option, text) {
            return Utility.html("option", option, Utility.text(text));
        };
        var select_form = $("#select_" + type),
            select_html = [],
            text = (type == "area") ? "地域" : "地区";

        select_html.push(createList({value: '-1'}, text + "を選択してください"));
        models.forEach(function (model, row_index) {
            var name = model.name,
                option = {value: row_index};
            if (selected_name == name) {
                option.selected = "selected";
            }
            select_html.push(createList(option, name));
        });
        select_form.html(select_html);
        select_form.change();
    }

    function masterAreaList() {
        var selected_master_name = Storage.getSelectedAreaMasterName();
        createSelectElement("area_master", AreaMasterModel.data, selected_master_name);
    }

    function updateAreaList(mastercode) {
        //ListメニューのHTML作成
        var area_list = AreaModel.getAreaList(mastercode),
            selected_name = Storage.getSelectedAreaName();
        createSelectElement("area", area_list, selected_name);
    }


    function createMenuList(after_action) {
        // 備考データを読み込む
        $.get("data/remarks.csv", function (data) {
            var csv_array = Utility.csvToArray(data);
            csv_array.shift();
            csv_array.forEach(function (remark_data) {
                remarks.push(new RemarkModel(remark_data));
            });
        });

        $.get("data/description.csv", function (data) {
            var csv_array = Utility.csvToArray(data);
            csv_array.shift();
            csv_array.forEach(function (description_data) {
                descriptions.push(new DescriptionModel(description_data));
            });

            $.get("data/target.csv", function (data) {
                var csv_array = Utility.csvToArray(data);
                csv_array.shift();
                csv_array.forEach(function (target_row_data) {
                    var row = new TargetRowModel(target_row_data);
                    for (var j = 0; j < descriptions.length; j++) {
                        //一致してるものに追加する。
                        if ((descriptions[j].name == row.type) && (descriptions[j].mastercode == row.mastercode)) { // 久留米仕様版
                            descriptions[j].targets.push(row);
                            break;
                        }
                    }
                });
                after_action();
                $("#accordion2").show();
            });
        });
    }

    function createTrashList(targets) {
        var _ = Utility,
            list = [],
            component = [],
            furigana = "";
        targets.forEach(function (target) {
            if (furigana != target.furigana) {
                var furigana_html = _.html("h4", {class: "initials"}, _.text(furigana));
                var ul = _.html("ul", {}, component);
                list.push(furigana_html);
                list.push(ul);

                component = [];
                furigana = target.furigana;
            }
            component.push(_.html("li", {style: "list-style: none;"}, _.text(target.name)));
            component.push(_.html("p", {class: "note"}, _.text(target.notice)));
        });
        return list;
    }

    function createAccordion(areaModel) {
        var _ = Utility;
        //SVG が使えるかどうかの判定を行う。
        //TODO Android 2.3以下では見れない（代替の表示も含め）不具合が改善されてない。。
        //参考 http://satussy.blogspot.jp/2011/12/javascript-svg.html
        //var ableSVG = false;  // SVG未使用の場合、descriptionの1項目目を使用
        var ableSVG = (window.SVGAngle !== void 0);

        ////area_days.csvの日付が””である場合最後にソートされ、表示しないようにする。  久留米
        // areaModel.trash.length.push(5);
        if (AbleEmptyDate == true) {
            areaModel.trash.forEach(function (trash) {
                if (trash.dayCell == "") {
                    trash.dayCell.push("21001231");
                    trash.name = "dummy";
                }
            });
        }

        //直近の一番近い日付を計算します。
        areaModel.calcMostRect();
        //トラッシュの近い順にソートします。
        areaModel.sortTrash();
        //TODO 処理の内容が謎
        var accordion_height = window.innerHeight / descriptions.length;
        if (descriptions.length > 4) {
            accordion_height = window.innerHeight / 4.1;
            if (accordion_height > 140) {
                accordion_height = window.innerHeight / descriptions.length;
            }
            if (accordion_height < 130) {
                accordion_height = 130;
            }
        }
        var styleHTML = "";
        var accordionHTML = [];

        //アコーディオンの分類から対応の計算を行います。
        areaModel.trash.forEach(function (trash, i) {
            descriptions.every(function (description, d_no) {
                if ((description.name != trash.name) || (description.mastercode != areaModel.mastercode)) { // 久留米仕様版
                    // everyメソッドではtrueを返すとcontinueと同じ動きをする
                    return true;
                }

                styleHTML += '#accordion-group' + d_no + '{background-color:  ' + description.background + ';} ';

                var accordion_toggle_option =
                    {
                        class: "accordion-toggle",
                        style: "height: " + accordion_height + "px;",
                        'data-toggle': "collapse",
                        'data-parent': '#accordion',
                        href: '#collapse' + i
                    },
                    svg_dom;
                if (ableSVG && SVGLabel) {
                    svg_dom = _.html("img", {src: description.styles, alt: description.name});
                } else {
                    svg_dom = _.html("p", {class: 'text-center'}, _.text(description.name));
                }

                var accordion_heading =
                        _.html("div", {class: "accordion-heading"},
                            _.html("a", accordion_toggle_option,
                                _.html("div", {class: 'left-day'}, _.text(trash.getLeftDay())),
                                _.html("div", {class: 'accordion-table'},
                                    svg_dom
                                ),
                                _.html("h6", {},
                                    _.html("p", {class: 'text-left date'}, _.text(trash.getDateLabel()))
                                )
                            )
                        ),
                    accordion_body =
                        _.html("div", {id: "collapse" + i, class: "accordion-body collapse"},
                            _.html("div", {class: "accordion-inner"},
                                _.text(description.description),
                                createTrashList(description.targets),
                                _.html("div", {class: 'targetDays'})
                            )
                        ),
                    accordion =
                        _.html("div", {class: "accordion-group", id: "accordion-group" + d_no},
                            accordion_heading,
                            accordion_body
                        );
                accordionHTML.push(accordion);
            });
        });
        $("#accordion-style").html('<!-- ' + styleHTML + ' -->');
        return accordionHTML;
    }

    function updateData(row_index) {
        var areaModel = areaModels[row_index],
            accordion_elm = $("#accordion");
        accordion_elm.html(createAccordion(areaModel));

        $('html,body').animate({scrollTop: 0}, 'fast');

        //アコーディオンのラベル部分をクリックしたら
        $(".accordion-body").on("shown.bs.collapse", function () {
            var body = $('body');
            var accordion_offset = $($(this).parent().get(0)).offset().top;
            body.animate({
                scrollTop: accordion_offset
            }, 50);
        });
        //アコーディオンの非表示部分をクリックしたら
        $(".accordion-body").on("hidden.bs.collapse", function () {
            if ($(".in").length == 0) {
                $("html, body").scrollTop(0);
            }
        });
    }

    function onChangeSelect(row_index) {
        if (row_index == -1) {
            $("#accordion").html("");
            Storage.setSelectedAreaName("");
            return;
        }
        Storage.setSelectedAreaName(areaModels[row_index].name);

        if ($("#accordion").children().length === 0 && descriptions.length === 0) {
            createMenuList(function () {
                updateData(row_index);
            });
        } else {
            updateData(row_index);
        }
    }

    // ★マスターの変更時
    function onChangeSelectMaster(row_index) {
        var initSelectArea = function () {
            var _ = Utility;
            var dom = _.html("option", {value: "-1"},
                _.text("地域を選択してください")
            );
            $("#accordion").html("");
            $("#select_area").html(dom);
        };

        if (row_index == -1) {
            // 初期化
            initSelectArea();
            Storage.setSelectedAreaMasterName("");
            return;
        }


        Storage.setSelectedAreaMasterName(AreaMasterModel.data[row_index].name);
        updateAreaList(AreaMasterModel.data[row_index].mastercode);
    }

    function getAreaIndex(area_name) {
        for (var i in areaModels) {
            if (areaModels[i].name == area_name) {
                return i;
            }
        }
        return -1;
    }

    // リストマスターが選択されたら
    $("#select_area_master").change(function (data) {
        var row_index = $(data.target).val();
        //onChangeSelect(row_index);
        // ★ここでselect area変更用の読み込み処理
        onChangeSelectMaster(row_index);
    });

    //リストが選択されたら
    $("#select_area").change(function (data) {
        var row_index = $(data.target).val();
        onChangeSelect(row_index);
    });


    //-----------------------------------
    //位置情報をもとに地域を自動的に設定する処理です。
    //これから下は現在、利用されておりません。
    //将来的に使うかもしれないので残してあります。
    $("#gps_area").click(function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            $.getJSON("area_candidate.php", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, function (data) {
                if (data.result == true) {
                    var area_name = data.candidate;
                    var index = getAreaIndex(area_name);
                    $("#select_area").val(index).change();
                    alert(area_name + "が設定されました");
                } else {
                    alert(data.reason);
                }
            })

        }, function (error) {
            alert(getGpsErrorMessage(error));
        });
    });

    if (!navigator.geolocation) {
        $("#gps_area").css("display", "none");
    }

    function getGpsErrorMessage(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return "User denied the request for Geolocation.";
            case error.POSITION_UNAVAILABLE:
                return "Location information is unavailable.";
            case error.TIMEOUT:
                return "The request to get user location timed out.";
            case error.UNKNOWN_ERROR:
            default:
                return "An unknown error occurred."
        }
    }

    Event.update = function () {
        if (Event.done()) {
            masterAreaList();
            var selected_master_name = Storage.getSelectedAreaMasterName();
            updateAreaList(AreaMasterModel.getMasterCodeByName(selected_master_name));
        }
    };

    Event.done = function () {
        return AreaMasterModel.done && AreaModel.done && CenterModel.done && RemarkModel.done;
    }
});

