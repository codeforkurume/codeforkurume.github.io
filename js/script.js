"use strict";

$(function () {

    function createSelectElement(type, models, selected_name) {
        var createList = function (option, text) {
            return Utility.html("option", option, Utility.text(text));
        };
        var select_form = $("#select_" + type),
            select_html = [],
            text = (type == "area") ? "地域" : "地区";

        select_html.push(createList({value: '-1'}, text + "を選択してください"));
        models.forEach(function (model) {
            var name = model.name,
                option = {value: model.getId()};
            if (selected_name == name) {
                option.selected = "selected";
            }
            select_html.push(createList(option, name));
        });
        select_form.html(select_html);
        select_form.change();
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

    function createAccordionElement(areaModel) {
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
        // 4つがちょうど入るように仕様を変更
        var accordion_height = window.innerHeight / 4;
        var styleHTML = "";
        var accordionHTML = [];

        //アコーディオンの分類から対応の計算を行います。
        areaModel.trash.forEach(function (trash, i) {
            DescriptionModel.data.every(function (description, d_no) {
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

    function updateAccordion(row_index) {
        var areaModel = AreaModel.data[row_index],
            accordion_elm = $("#accordion");
        accordion_elm.html(createAccordionElement(areaModel));

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

    $(".select-field").on('change', function (e) {
        // 1-indexのため
        var id = $(e.target).val() - 1,
            type = $(e.target).data('type');
        if (type == "area_master") {
            areaMasterSelected(id);
        } else if (type == "area") {
            areaSelected(id);
        }
    });

    function initAccordion() {
        $("#accordion").html("");
    }

    /*
     * 地区が選択された時に呼ばれる
     */
    function areaMasterSelected(id) {
        var name = "";
        // 選択されているかどうか
        if (id >= 0) {
            name = AreaMasterModel.data[id].name;
        } else {
            initAccordion();
        }
        // localStorageを変更
        Storage.setSelectedAreaMasterName(name);
        updateAreaList();
    }

    /*
     * 地域が選択された時に呼ばれる
     */
    function areaSelected(id) {
        var name = "";
        // 選択されているかどうか
        if (id >= 0) {
            name = AreaModel.data[id].name;
            updateAccordion(id);
        } else {
            initAccordion();
        }
        Storage.setSelectedAreaName(name);
    }


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
                    var index = AreaModel.getAreaIndex(area_name);
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

    function updateMasterList() {
        $("#select_area_master").html("");
        var selected_master_name = Storage.getSelectedAreaMasterName();
        createSelectElement("area_master", AreaMasterModel.data, selected_master_name);
    }

    function updateAreaList() {
        var mastercode = AreaMasterModel.getMasterCodeByName(Storage.getSelectedAreaMasterName());
        if (mastercode) {
            var area_list = AreaModel.getAreaList(mastercode),
                selected_name = Storage.getSelectedAreaName();
            createSelectElement("area", area_list, selected_name);
        } else {
            var dom = Utility.html("option", {value: "-1"},
                Utility.text("地域を選択してください")
            );
            $("#select_area").html(dom);
        }
    }

    function initSelectList() {
        updateMasterList();
        updateAreaList();
    }

    function renderCalendar() {
        var calendar = new Calendar(),
            dom = $("#calendar_body"),
            selected_area_name = Storage.getSelectedAreaName();
        var area_index = AreaModel.getAreaIndex(selected_area_name);
        if (area_index == -1) {
            return -1;
        }
        calendar.render(dom, AreaModel.data[area_index]);
    }

    var Models = [AreaMasterModel, AreaModel, CenterModel, DescriptionModel, TargetRowModel],
        event = Event.getInstance();

    event.$on('update', function() {
        if (done()) {
            Models.forEach(function (model) {
                if (typeof model.afterDone === 'function') {
                    model.afterDone();
                }
            });
            initSelectList();
            renderCalendar();
        }
    });

    Models.forEach(function(model) {
        model.readCSV(function (data) {
            model.data = data;
            model.done = true;
            Event.getInstance().$emit('update');
        })
    });

    function done ()  {
        for (var i = 0; i < Models.length; i++) {
            if (!Models[i].done) {
                return false;
            }
        }
        return true;
    }

    event.$on("updateArea",
        function(area_master, area){
            var select_area_master = $("#select_area_master");
            select_area_master.val(area_master.mastercode);
            select_area_master.change();
            var select_area = $("#select_area");
            select_area.val(area.id);
            select_area.change();
        }
    );
});

