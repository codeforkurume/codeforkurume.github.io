"use strict";

/* var windowHeight; */

$(function () {
    /*   windowHeight = $(window).height(); */

    var center_data = [];
    var descriptions = [];
    var areaModels = [];
    var remarks = [];
    var areaMasterModels = [];
    /*   var descriptions = new Array(); */


    // ローカルストレージ（エリア名）
    function getSelectedAreaName() {
        return localStorage.getItem("selected_area_name");
    }

    function setSelectedAreaName(name) {
        localStorage.setItem("selected_area_name", name);
    }

    // ローカルストレージ（エリアマスター名）
    function getSelectedAreaMasterName() {
        return localStorage.getItem("selected_area_master_name");
    }

    function setSelectedAreaMasterName(name) {
        localStorage.setItem("selected_area_master_name", name);
    }

    // ローカルストレージ（エリアマスター名）
    function getSelectedAreaMasterNameBefore() {
        return localStorage.getItem("selected_area_master_name_before");
    }

    function setSelectedAreaMasterNameBefore(name) {
        localStorage.setItem("selected_area_master_name_before", name);
    }

    function getInitSelectOption(flg) {
        var _ = Utility,
            text = (flg == "area") ? "地域" : "地区";
        return createList({value: "-1"}, text + "を選択してください");
    }

    function createList(option, text) {
        var _ = Utility;
        return _.html("option", option, _.text(text));
    }

    function masterAreaList() {
        // ★エリアのマスターリストを読み込みます
        // 大阪府仕様。大阪府下の区一覧です
        AreaMasterModel.readCSV(function (data) {
            areaMasterModels = data;
            // ListメニューのHTMLを作成
            var selected_master_name = getSelectedAreaMasterName();
            var area_master_select_form = $("#select_area_master");
            var select_master_html = [];
            select_master_html.push(getInitSelectOption("area_master"));

            areaMasterModels.forEach(function (area_master, row_index) {
                var area_master_name = area_master.name,
                    option = {value: row_index};
                if (selected_master_name == area_master_name) {
                    option.selected = "selected";
                }
                select_master_html.push(createList(option, area_master_name));
            });


            //デバッグ用
            if (typeof dump == "function") {
                dump(areaMasterModels);
            }
            //HTMLへの適応
            area_master_select_form.html(select_master_html);
            area_master_select_form.change();
        });
    }


    function updateAreaList(mastercode) {
        // 大阪府仕様。区のコード(mastercode)が引数です
        AreaModel.readCSV(mastercode, remarks, function (data) {
            areaModels = data;

            CenterModel.readCSV(function (center) {
                center_data = center;
                //ゴミ処理センターのデータを解析します。
                //表示上は現れませんが、
                //金沢などの各処理センターの休止期間分は一週間ずらすという法則性のため
                //例えば第一金曜日のときは、一周ずらしその月だけ第二金曜日にする

                //ゴミ処理センターを対応する各地域に割り当てます。
                areaModels.forEach(function (area_model) {
                    area_model.setCenter(center_data);
                });
                //エリアとゴミ処理センターを対応後に、表示のリストを生成する。
                //ListメニューのHTML作成
                var selected_name = getSelectedAreaName();
                var area_select_form = $("#select_area");
                var select_html = [];
                select_html.push(getInitSelectOption("area"));
                areaModels.forEach(function (area, row_index) {
                    var area_name = area.name,
                        option = {value: row_index};
                    if (selected_name == area_name) {
                        option.selected = "selected";
                    }

                    select_html.push(createList(option, area_name));
                });

                //デバッグ用
                if (typeof dump == "function") {
                    dump(areaModels);
                }
                //HTMLへの適応
                area_select_form.html(select_html);
                area_select_form.change();
            });
        });
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
            setSelectedAreaName("");
            return;
        }
        setSelectedAreaName(areaModels[row_index].name);

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
            setSelectedAreaMasterName("");
            return;
        }

        var checkAreaMasterName = getSelectedAreaMasterName();
        var checkAreaMasterNameBefore = getSelectedAreaMasterNameBefore();
        if (checkAreaMasterName != checkAreaMasterNameBefore) {
            initSelectArea();
            setSelectedAreaName("");
        }

        areaModels.length = 0;

        setSelectedAreaMasterName(areaMasterModels[row_index].name);
        setSelectedAreaMasterNameBefore(areaMasterModels[row_index].name);

        updateAreaList(areaMasterModels[row_index].mastercode);

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

    if (getSelectedAreaName() == null) {
        $("#accordion2").show();
        $("#collapseZero").addClass("in");
    }
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

    masterAreaList();
    //updateAreaList();

});
