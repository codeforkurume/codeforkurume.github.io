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

    function masterAreaList() {
        // ★エリアのマスターリストを読み込みます
        // 大阪府仕様。大阪府下の区一覧です
        AreaMasterModel.readCSV(function(data) {
            areaMasterModels = data;
            // ListメニューのHTMLを作成
            var selected_master_name = getSelectedAreaMasterName();
            var area_master_select_form = $("#select_area_master");
            var select_master_html = "";
            select_master_html += '<option value="-1">地区を選択してください</option>';
            for (var row_index in areaMasterModels) {
                var area_master_name = areaMasterModels[row_index].name;
                var selected = (selected_master_name == area_master_name) ? 'selected="selected"' : "";

                select_master_html += '<option value="' + row_index + '" ' + selected + " >" + area_master_name + "</option>";
            }

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
        Utility.csvToArray("data/area_days.csv", function (tmp) {
            var area_days_label = tmp.shift();
            for (var i in tmp) {
                var row = tmp[i];
                var area = new AreaModel();
                area.mastercode = row[0];
                area.label = row[1];
                area.centerName = row[2];

                // 区コードが一致した場合のみデータ格納
                if (area.mastercode == mastercode) {
                    areaModels.push(area);
                    //２列目以降の処理
                    for (var r = 3; r < 3 + MaxDescription; r++) {
                        if (area_days_label[r]) {
                            var trash = new TrashModel(area_days_label[r], row[r], remarks);
                            area.trash.push(trash);
                        }
                    }
                }
            }

            Utility.csvToArray("data/center.csv", function (tmp) {
                //ゴミ処理センターのデータを解析します。
                //表示上は現れませんが、
                //金沢などの各処理センターの休止期間分は一週間ずらすという法則性のため
                //例えば第一金曜日のときは、一周ずらしその月だけ第二金曜日にする
                tmp.shift();
                for (var i in tmp) {
                    var row = tmp[i];

                    var center = new CenterModel(row);
                    center_data.push(center);
                }
                //ゴミ処理センターを対応する各地域に割り当てます。
                for (var i in areaModels) {
                    var area = areaModels[i];
                    area.setCenter(center_data);
                }
                //エリアとゴミ処理センターを対応後に、表示のリストを生成する。
                //ListメニューのHTML作成
                var selected_name = getSelectedAreaName();
                var area_select_form = $("#select_area");
                var select_html = "";
                select_html += '<option value="-1">地域を選択してください</option>';
                for (var row_index in areaModels) {
                    var area_name = areaModels[row_index].label;
                    var selected = (selected_name == area_name) ? 'selected="selected"' : "";

                    select_html += '<option value="' + row_index + '" ' + selected + " >" + area_name + "</option>";
                }

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
        Utility.csvToArray("data/remarks.csv", function (data) {
            data.shift();
            for (var i in data) {
                remarks.push(new RemarkModel(data[i]));
            }
        });
        Utility.csvToArray("data/description.csv", function (data) {
            data.shift();
            for (var i in data) {
                descriptions.push(new DescriptionModel(data[i]));
            }

            Utility.csvToArray("data/target.csv", function (data) {

                data.shift();
                for (var i in data) {
                    var row = new TargetRowModel(data[i]);
                    for (var j = 0; j < descriptions.length; j++) {
                        //一致してるものに追加する。
                        if ((descriptions[j].label == row.type) && (descriptions[j].mastercode == row.mastercode)) { // 久留米仕様版
                            descriptions[j].targets.push(row);
                            break;
                        }
                    }
                }
                after_action();
                $("#accordion2").show();

            });

        });

    }

    function updateData(row_index) {
        //SVG が使えるかどうかの判定を行う。
        //TODO Android 2.3以下では見れない（代替の表示も含め）不具合が改善されてない。。
        //参考 http://satussy.blogspot.jp/2011/12/javascript-svg.html
        var ableSVG = (window.SVGAngle !== void 0);
        //var ableSVG = false;  // SVG未使用の場合、descriptionの1項目目を使用
        var areaModel = areaModels[row_index];
        ////area_days.csvの日付が””である場合最後にソートされ、表示しないようにする。  久留米
        // areaModel.trash.length.push(5);
        if (AbleEmptyDate == true) {
            for (var i = 0; i < areaModel.trash.length; i++) {
                if (areaModel.trash[i].dayCell == "") {
                    areaModel.trash[i].dayCell.push("21001231");
                    areaModel.trash[i].label = "dummy";
                }
            }
        }

        var today = new Date();
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
        var accordionHTML = "";
        //アコーディオンの分類から対応の計算を行います。
        for (var i in areaModel.trash) {
            var trash = areaModel.trash[i];

            for (var d_no in descriptions) {
                var description = descriptions[d_no];
                if ((description.label != trash.label) || (description.mastercode != areaModel.mastercode)) { // 久留米仕様版
                    continue;
                }
                var furigana = "";
                var target_tag = "";
                var targets = description.targets;
                for (var j in targets) {
                    var target = targets[j];
                    if (furigana != target.furigana) {
                        if (furigana != "") {
                            target_tag += "</ul>";
                        }

                        furigana = target.furigana;

                        target_tag += '<h4 class="initials">' + furigana + "</h4>";
                        target_tag += "<ul>";
                    }

                    target_tag += '<li style="list-style:none;">' + target.name + "</li>";
                    target_tag += '<p class="note">' + target.notice + "</p>";
                }

                target_tag += "</ul>";

                var dateLabel = trash.getDateLabel();
                //あと何日かを計算する処理です。
                var leftDay = Math.ceil((trash.mostRecent.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                var leftDayText = "";
                if (leftDay == 0) {
                    leftDayText = "今日";
                } else if (leftDay == 1) {
                    leftDayText = "明日";
                } else if (leftDay == 2) {
                    leftDayText = "明後日"
                } else {
                    leftDayText = leftDay + "日後";
                }

                styleHTML += '#accordion-group' + d_no + '{background-color:  ' + description.background + ';} ';

                accordionHTML +=
                    '<div class="accordion-group" id="accordion-group' + d_no + '">' +
                    '<div class="accordion-heading">' +
                    '<a class="accordion-toggle" style="height:' + accordion_height + 'px" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '">' +
                    '<div class="left-day">' + leftDayText + '</div>' +
                    '<div class="accordion-table" >';
                if (ableSVG && SVGLabel) {
                    accordionHTML += '<img src="' + description.styles + '" alt="' + description.label + '"  />';
                } else {
                    accordionHTML += '<p class="text-center">' + description.label + "</p>";
                }
                accordionHTML += "</div>" +
                    '<h6><p class="text-left date">' + dateLabel + "</p></h6>" +
                    "</a>" +
                    "</div>" +
                    '<div id="collapse' + i + '" class="accordion-body collapse">' +
                    '<div class="accordion-inner">' +
                    description.description + "<br />" + target_tag +
                    '<div class="targetDays"></div></div>' +
                    "</div>" +
                    "</div>";
                window.debug = accordionHTML;
            }
        }
        $("#accordion-style").html('<!-- ' + styleHTML + ' -->');

        var accordion_elm = $("#accordion");
        accordion_elm.html(accordionHTML);

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
        setSelectedAreaName(areaModels[row_index].label);

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
        if (row_index == -1) {
            // 初期化
            $("#accordion").html("");
            $("#select_area").html('<option value="-1">地域を選択してください</option>');
            setSelectedAreaMasterName("");
            return;
        }

        var checkAreaMasterName = getSelectedAreaMasterName();
        var checkAreaMasterNameBefore = getSelectedAreaMasterNameBefore();

        if (checkAreaMasterName == checkAreaMasterNameBefore) {
        } else {
            $("#accordion").html("");
            $("#select_area").html('<option value="-1">地域を選択してください</option>');
            setSelectedAreaName("");
        }

        areaModels.length = 0;

        setSelectedAreaMasterName(areaMasterModels[row_index].name);
        setSelectedAreaMasterNameBefore(areaMasterModels[row_index].name);

        updateAreaList(areaMasterModels[row_index].mastercode);

    }


    function getAreaIndex(area_name) {
        for (var i in areaModels) {
            if (areaModels[i].label == area_name) {
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
