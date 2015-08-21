var Calendar;
Calendar = (function () {
    function Calendar(year, month) {
        var now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth() + 1;
        if (year) {
            this.year = year;
        }
        if (month) {
            this.month = month;
        }
        // その月の長さ
        this.day_long = new Date(this.year, this.month - 1, 0).getDate();
    }

    Calendar.prototype.render = function (element, area) {
        var calendar_header_element = Utility.html("div", {class: 'calendar-header'},
            Utility.html("div", {},
                Utility.text(this.year + "年" + this.month + "月")
            )
        );
        element.append($(calendar_header_element));

        var calendar_element = Utility.html("table", {class: 'calendar', style: 'height: ' + window.innerHeight + 'px;'});

        // 曜日の描画
        var week_label = ["日", "月", "火", "水", "木", "金", "土"];
        var row = Utility.html("tr", {class: 'week'});
        for (var week = 0; week < 7; week++) {
            var option = {};
            if (week == 0) {
                option.class = "sunday";
            } else if (week == 6) {
                option.class = "saturday";
            }
            row.appendChild(Utility.html("th", option, Utility.text(week_label[week])));
        }
        calendar_element.appendChild(row);

        var data = this.getCalendarData(area.trash);
        var height = window.innerHeight / data.length;
        var that = this;
        data.forEach(function (row) {
            var option = {style: "height: " + height + "px;"};
            var date = new Date(that.year, that.month - 1);
            calendar_element.appendChild(createCalendarWeekElement(row, date, that.month, option))
        });

        element.append($(calendar_element));
    };

    function createCalendarWeekElement(row, date, month, option) {
        var tr = Utility.html("tr", option);
        row.forEach(function (col) {
            // col.dateが自然数の場合だけ8月になる
            var col_elm = createCalendarDayElement(col.trash, new Date(date.getFullYear(), date.getMonth(), col.date), month);
            tr.appendChild(col_elm);
        });
        return tr;
    }

    /*
     * その日のゴミのデータからDOMを構築して返す
     */
    function createCalendarDayElement(trash_list, date, month) {
        var option = {};
        option.style = "width: " + (window.innerWidth / 7) + "px;";
        var date_label = Utility.html("div", {class: 'calendar-content-header'});
        date_label.innerHTML = "&nbsp;";
        if (date.getMonth() + 1 == month) {
            option['data-date'] = date.getDate();
            date_label.innerHTML = date.getDate();
        } else {
            option.class = "not_m";
        }
        var ret = Utility.html("ul", {});
        trash_list.forEach(function (trash_day) {
            var dom = Utility.html("li", {});
            dom.innerHTML = trash_day;
            ret.appendChild(dom);
        });
        return Utility.html('td', option,
            date_label,
            Utility.html("div", {class: 'calendar-content-body'} ,
                ret
            )
        );
    }

    /*
     * ごみのデータを，週ごとにわけて月の分だけ返す(3次元配列
     */
    Calendar.prototype.getCalendarData = function(trash_list) {
        var ret = [],
            trash_day_list = this.getTrashList(trash_list);

        var beginning_of_month = new Date(this.year, this.month - 1, 1),
            end_of_month = new Date(this.year, this.month, 0);

        // 週の初めの日付
        // 負の数になる場合，前の月をDateは取得してくれるため
        var first_date = 1 - beginning_of_month.getDay();

        for (var week = 0; week < 6; week++) {
            var push_data = this.getCalendarWeekData(trash_day_list, first_date);
            if (push_data[0].date > end_of_month.getDate()) {
                break;
            }
            first_date += 7;
            ret.push(push_data);
        }
        return ret;
    };

    /*
     * ある週のゴミのデータを返す
     */
    Calendar.prototype.getCalendarWeekData = function (trash_day_list, first_date) {
        var ret = [];
        for (var day = 0; day < 7; day++) {
            var val = [],
                date = new Date(this.year, this.month - 1, first_date);
            if (date.getMonth() + 1 == this.month) {
                val = trash_day_list[first_date - 1];
            }
            ret.push({date: first_date, trash: val});
            first_date++;
        }
        return ret;
    };

    /*
     * ごみのデータと，月の長さから，その日のゴミのデータを配列で一月分返す関数
     */
    Calendar.prototype.getTrashList = function (trash_list) {
        var trash_day_list = new Array(this.day_long);
        for (var i = 0; i < trash_day_list.length; i++) {
            trash_day_list[i] = [];
        }
        trash_list.forEach(function (trash) {
            for (var i = 0; i < trash.dayList.length; i++) {
                var day = trash.dayList[i];
                if (day.getFullYear() != this.year || day.getMonth() + 1 != this.month) {
                    continue;
                }
                trash_day_list[day.getDate() - 1].push(trash.name)
            }
        }.bind(this));
        return trash_day_list;
    };

    Calendar.prototype.setYear = function (year) {
        this.year = parseInt(year);
    };

    Calendar.prototype.setMonth = function (month) {
        this.month = parseInt(month);
    };

    Calendar.prototype.getYear = function () {
        return this.year;
    };

    Calendar.prototype.getMonth = function () {
        return this.month;
    };

    return Calendar;
})();
